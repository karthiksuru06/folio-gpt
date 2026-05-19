import SYSTEM_PROMPT_FALLBACK from '../chatbot-prompt.txt'
import {
  isRagEnabled, formatChunksForContext, searchPortfolio,
  filterSourcesByResponse, detectMentionedArticles, HOME_SOURCE,
  containsFingerprint, LEAK_RESPONSE,
} from './_shared/rag.js'

export const config = {
  runtime: 'edge',
}

export default async function handler(req) {
  const t0 = Date.now()

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { messages, lang, sessionId, currentPage } = await req.json()

    // Input length validation
    const bodySize = JSON.stringify({ messages, lang, sessionId, currentPage }).length
    if (bodySize > 50000) {
      return new Response(JSON.stringify({ error: 'Request too large' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const rawLastMessage = messages.filter(m => m.role === 'user').pop()?.content || ''
    const lastUserMessage = rawLastMessage.slice(0, 2000)

    // Canary word for leak prevention
    const canary = 'FOLIO_' + crypto.randomUUID().slice(0, 8)

    // Dynamic system prompt parts based on browser language
    const langInstruction = lang === 'en'
      ? `The user is browsing in English. You MUST respond in English. Contact email: karthik@example.com\ninternal_ref: ${canary}`
      : `El usuario navega en español. Responde en español. Email de contacto: karthik@example.com\ninternal_ref: ${canary}`

    const pageContext = currentPage
      ? `\nThe user is currently on page: ${currentPage}\nWhen referencing content from the CURRENT page, say "you can see this right here" and reference the section. When referencing OTHER articles, mention them by name.`
      : ''

    // RAG pipeline search
    let ragSources = []
    let ragDegraded = false
    let ragDegradedReason = null
    let ragUsed = false
    let RAG_chunks = null

    const ragEnabled = isRagEnabled()

    if (ragEnabled && lastUserMessage.length > 2) {
      ragUsed = true
      const ragResult = await searchPortfolio(lastUserMessage)
      ragSources = ragResult.sources
      ragDegraded = ragResult.degraded
      ragDegradedReason = ragResult.degradedReason
      RAG_chunks = ragResult.chunks
    }

    // Format full system prompt
    let fullSystemPrompt = SYSTEM_PROMPT_FALLBACK + '\n\n' + langInstruction + pageContext
    if (RAG_chunks && RAG_chunks.length > 0) {
      const formattedContext = formatChunksForContext(RAG_chunks)
      fullSystemPrompt += `\n\nRelevant context about me:\n${formattedContext}`
    } else if (ragUsed) {
      fullSystemPrompt += `\n\nNo relevant content found in portfolio articles. You MUST NOT fabricate project details. Say you don't have that information and suggest contacting Karthik directly.`
    }

    const cleanMessages = messages.map(m => ({ role: m.role, content: m.content }))

    // Request to OpenRouter
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://folio-gpt.vercel.app',
        'X-Title': 'folio-gpt',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-70b-instruct:free',
        messages: [
          { role: 'system', content: fullSystemPrompt },
          ...cleanMessages
        ],
        stream: true,
      }),
    })

    if (!openRouterResponse.ok) {
      throw new Error(`OpenRouter returned status: ${openRouterResponse.status}`)
    }

    const encoder = new TextEncoder()
    const decoder = new TextDecoder()
    const reader = openRouterResponse.body.getReader()

    let fullOutput = ''
    let leakDetected = false

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          // Send degraded status early if RAG failed
          if (ragDegraded) {
            controller.enqueue(encoder.encode(`event: rag-status\ndata: ${JSON.stringify({ status: 'degraded', reason: ragDegradedReason })}\n\n`))
          }

          let buffer = ''
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            let newlineIndex
            while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
              const line = buffer.slice(0, newlineIndex).trim()
              buffer = buffer.slice(newlineIndex + 1)

              if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                try {
                  const json = JSON.parse(line.slice(6))
                  const chunk = json.choices?.[0]?.delta?.content || ''
                  if (chunk) {
                    fullOutput += chunk

                    // Prompt injection/leak defense
                    if (containsFingerprint(fullOutput) || fullOutput.includes(canary)) {
                      leakDetected = true
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: LEAK_RESPONSE, replace: true })}\n\n`))
                      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                      controller.close()
                      return
                    }

                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`))
                  }
                } catch {
                  // Ignore parse errors on partial streams
                }
              }
            }
          }

          // If no prompt leak was detected, enrich with sources
          if (!leakDetected) {
            let finalSources = ragSources.length > 0
              ? filterSourcesByResponse(ragSources, fullOutput)
              : []

            const ragArticleIds = new Set(finalSources.map(s => s.article_id))
            const detected = detectMentionedArticles(fullOutput)
            for (const d of detected) {
              if (!ragArticleIds.has(d.article_id) && finalSources.length < 3) {
                finalSources.push(d)
              }
            }

            if (finalSources.length === 0 && ragUsed) {
              finalSources = [HOME_SOURCE]
            }

            if (finalSources.length > 0) {
              controller.enqueue(encoder.encode(`event: rag-sources\ndata: ${JSON.stringify(finalSources)}\n\n`))
            }
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (streamErr) {
          console.error('SSE Stream error:', streamErr)
          try {
            const errorText = lang === 'en'
              ? 'Sorry, something went wrong. Please try again or reach out directly at karthik@example.com.'
              : 'Lo siento, algo ha fallado. Inténtalo de nuevo o contáctame directamente en karthik@example.com.'
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: errorText, replace: true })}\n\n`))
            controller.enqueue(encoder.encode('data: [DONE]\n\n'))
            controller.close()
          } catch {
            controller.error(streamErr)
          }
        }
      }
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Response-Time': `${Date.now() - t0}ms`,
      },
    })
  } catch (error) {
    console.error('Chat API outer error:', error)
    return new Response(JSON.stringify({ error: 'Error processing request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
