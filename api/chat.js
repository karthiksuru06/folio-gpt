// /api/chat — streams answers about Karthik, grounded in the resume corpus.
// The route is deliberately small: guards and the fact verifier live in
// ./_shared so they can be unit tested without a network.

import SYSTEM_PROMPT from '../chatbot-prompt.txt'
import {
  sanitizeMessages, originAllowed, hit, verifyTurnstile,
  LIMIT_PER_MINUTE, LIMIT_PER_DAY,
} from './_shared/guard.js'
import { verifyAnswer, FALLBACK_ANSWER } from './_shared/verify.js'
import { classifyQuestion, isPromptLeak } from './_shared/questions.js'

export const config = { runtime: 'edge' }

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

const sse = (event) => `data: ${JSON.stringify(event)}\n\n`

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  if (!originAllowed(req.headers.get('origin'), req.url, process.env.ALLOWED_ORIGINS)) {
    return json({ error: 'Forbidden', code: 'origin' }, 403)
  }
  if (!process.env.OPENROUTER_API_KEY) return json({ error: 'Chat is offline', code: 'offline' }, 503)

  const ip = (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim()
  const minuteOk = await hit(`chat:m:${ip}`, 60, LIMIT_PER_MINUTE)
  const dayOk = minuteOk && await hit(`chat:d:${ip}`, 86400, LIMIT_PER_DAY)
  if (!minuteOk || !dayOk) {
    return json({ error: 'Too many messages. Try again later or email me directly.', code: 'rate_limited' }, 429)
  }

  let payload
  try { payload = await req.json() } catch { return json({ error: 'Invalid JSON', code: 'bad_request' }, 400) }
  const { messages: raw, turnstileToken } = payload || {}

  if (!(await verifyTurnstile(turnstileToken, ip))) {
    return json({ error: 'Bot check failed', code: 'bot_check' }, 403)
  }

  const messages = sanitizeMessages(raw)
  if (!messages.some(m => m.role === 'user')) {
    return json({ error: 'messages required', code: 'bad_request' }, 400)
  }

  const lastUser = messages[messages.length - 1].content
  if (classifyQuestion(lastUser).length > 0) {
    return json({ error: "I can only answer questions about Karthik's professional background.", code: 'blocked' }, 400)
  }

  let upstream
  try {
    upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-70b-instruct:free',
        stream: true,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      }),
      signal: req.signal,
    })
  } catch {
    return json({ error: 'Chat is temporarily unavailable.', code: 'upstream' }, 502)
  }
  if (!upstream.ok || !upstream.body) {
    return json({ error: 'Chat is temporarily unavailable.', code: 'upstream' }, 502)
  }

  const decoder = new TextDecoder()
  const encoder = new TextEncoder()
  const reader = upstream.body.getReader()
  let buffer = ''
  let fullAnswer = ''
  let replaced = false

  const stream = new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read()
      if (done) {
        // The full answer is known only now, so the fact check runs at the
        // end. Streaming means text already reached the screen; a failure
        // sends a replace event the client honours.
        if (!replaced) {
          const verdict = verifyAnswer(fullAnswer, SYSTEM_PROMPT)
          if (!verdict.ok) {
            controller.enqueue(encoder.encode(sse({ text: FALLBACK_ANSWER, replace: true })))
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
        return
      }
      buffer += decoder.decode(value, { stream: true })
      let nl
      while ((nl = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, nl).trim()
        buffer = buffer.slice(nl + 1)
        if (!line.startsWith('data: ') || line === 'data: [DONE]') continue
        try {
          const chunk = JSON.parse(line.slice(6)).choices?.[0]?.delta?.content || ''
          if (!chunk) continue
          fullAnswer += chunk
          if (isPromptLeak(fullAnswer)) {
            replaced = true
            controller.enqueue(encoder.encode(sse({ text: "That's not a question about Karthik's work — ask me about his projects, experience or skills.", replace: true })))
            controller.enqueue(encoder.encode('data: [DONE]\n\n'))
            controller.close()
            await reader.cancel()
            return
          }
          controller.enqueue(encoder.encode(sse({ text: chunk })))
        } catch {
          // partial JSON line; the next chunk completes it
        }
      }
    },
    cancel() { reader.cancel() },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
