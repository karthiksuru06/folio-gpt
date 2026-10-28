import { useEffect, useRef, useState } from 'react'
import { MessageCircle, Send, X } from 'lucide-react'
import { getTurnstileToken } from '../turnstile'

// Small floating chat panel. All questions go to /api/chat, which enforces
// origin, rate limits and a bot check; this component only renders turns.

const STARTERS = ['What has Karthik built?', 'His RAG experience?', 'How can I contact him?']

function Bubble({ role, children }) {
  const mine = role === 'user'
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
          mine
            ? 'bg-white/10 text-[#e0e0e0] rounded-br-sm'
            : 'bg-[#141414] border border-white/10 text-[#c8c8c8] rounded-bl-sm'
        }`}
      >
        {children}
      </div>
    </div>
  )
}

export default function ChatPanel() {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [input, setInput] = useState('')
  const [turns, setTurns] = useState([])
  const scrollRef = useRef(null)
  const abortRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [turns, busy])

  useEffect(() => () => abortRef.current?.abort(), [])

  async function send(text) {
    const question = (text ?? input).trim()
    if (!question || busy) return
    setInput('')
    setBusy(true)
    setTurns(prev => [...prev, { role: 'user', text: question }])
    const history = [...turns, { role: 'user', text: question }]

    const controller = new AbortController()
    abortRef.current = controller
    let answer = ''
    try {
      const turnstileToken = await getTurnstileToken()
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.map(t => ({ role: t.role, content: t.text })),
          turnstileToken,
        }),
        signal: controller.signal,
      })
      if (!res.ok) {
        const detail = await res.json().catch(() => ({}))
        setTurns(prev => [...prev, { role: 'assistant', text: detail.error || 'Something went wrong — email karthiksuru06@gmail.com instead.' }])
        return
      }
      // Streaming: append chunks as they arrive; a replace event swaps the
      // whole answer (the server fact-checks the finished text).
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      setTurns(prev => [...prev, { role: 'assistant', text: '' }])
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        let nl
        while ((nl = buffer.indexOf('\n')) !== -1) {
          const line = buffer.slice(0, nl).trim()
          buffer = buffer.slice(nl + 1)
          if (!line.startsWith('data: ') || line === 'data: [DONE]') continue
          try {
            const event = JSON.parse(line.slice(6))
            if (typeof event.text !== 'string') continue
            if (event.replace) {
              answer = event.text
              setTurns(prev => {
                const next = [...prev]
                next[next.length - 1] = { role: 'assistant', text: answer }
                return next
              })
            } else {
              answer += event.text
              setTurns(prev => {
                const next = [...prev]
                next[next.length - 1] = { role: 'assistant', text: answer }
                return next
              })
            }
          } catch {
            // partial line; next iteration completes it
          }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setTurns(prev => [...prev, { role: 'assistant', text: 'Connection lost — please try again.' }])
      }
    } finally {
      setBusy(false)
      abortRef.current = null
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#101010] text-[#e0e0e0] shadow-lg transition-colors hover:bg-[#1a1a1a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Chat with the portfolio assistant"
          className="fixed bottom-20 right-5 z-50 flex h-[26rem] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b] shadow-2xl"
        >
          <div className="border-b border-white/10 px-4 py-3">
            <p className="text-sm font-semibold text-[#e0e0e0]">Ask about Karthik</p>
            <p className="text-xs text-[#8a8a8a]">Answers come from his resume — no guessing.</p>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {turns.length === 0 && (
              <div className="space-y-2">
                <Bubble role="assistant">Hi — I answer questions about Karthik&apos;s work only. Try one of these:</Bubble>
                {STARTERS.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="block w-full rounded-xl border border-white/10 px-3 py-2 text-left text-xs text-[#b5b5b5] transition-colors hover:bg-white/5"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {turns.map((t, i) => <Bubble key={i} role={t.role}>{t.text}</Bubble>)}
            {busy && turns.at(-1)?.role === 'user' && (
              <p className="text-xs italic text-[#6f6f6f]">thinking…</p>
            )}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send() }}
            className="flex items-center gap-2 border-t border-white/10 px-3 py-2"
          >
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              maxLength={600}
              placeholder="Ask a question…"
              aria-label="Chat message"
              className="flex-1 bg-transparent px-2 py-1.5 text-sm text-[#e0e0e0] placeholder:text-[#6f6f6f] focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send message"
              className="rounded-lg p-2 text-[#cfcfcf] transition-colors hover:bg-white/10 disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
