import { useEffect, useRef, useState } from 'react'
import { MessageCircle, Send, X } from 'lucide-react'
import { getTurnstileToken } from '../turnstile'

// Small floating chat panel. All questions go to /api/chat, which enforces
// origin, rate limits and a bot check; this component only renders turns.

// Prebuilt questions, grouped so a visitor can browse topics. Every question
// is answerable from the resume corpus, so the verifier never has to reject.
const SUGGESTIONS = [
  'What has Karthik built?',
  'Tell me about Yukthi',
  'His RAG experience?',
  'Compliance OS details',
  'Research at RCTS, IIIT-H',
  'OpenWISP contributions',
  'His ML projects',
  'Work experience timeline',
  'Education and skills',
  'Is he available for work?',
  'How can I contact him?',
  'His resume highlights',
]

function Bubble({ role, children }) {
  const mine = role === 'user'
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
          mine
            ? 'bg-white/10 text-[#F4F1EA] rounded-br-sm'
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
  const [showAll, setShowAll] = useState(false)
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
        const offline = detail.code === 'offline'
        setTurns(prev => [...prev, {
          role: 'assistant',
          text: offline
            ? 'The chat assistant is not activated on this deployment yet. Email karthiksuru06@gmail.com directly and Karthik will reply.'
            : (detail.error || 'Something went wrong - email karthiksuru06@gmail.com instead.'),
        }])
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
            answer = event.replace ? event.text : answer + event.text
            setTurns(prev => {
              const next = [...prev]
              next[next.length - 1] = { role: 'assistant', text: answer }
              return next
            })
          } catch {
            // partial line; next iteration completes it
          }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setTurns(prev => [...prev, { role: 'assistant', text: 'Connection lost - please try again.' }])
      }
    } finally {
      setBusy(false)
      abortRef.current = null
    }
  }

  const visible = showAll ? SUGGESTIONS : SUGGESTIONS.slice(0, 4)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-[#C8FF3D]/30 bg-[#101010] text-[#C8FF3D] shadow-lg transition-colors hover:bg-[#1a1a1a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8FF3D]/60"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Chat with the portfolio assistant"
          className="fixed bottom-20 right-5 z-50 flex h-[30rem] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0D] shadow-2xl"
        >
          <div className="border-b border-white/10 px-4 py-3">
            <p className="font-display text-lg leading-tight text-[#F4F1EA]">Ask about Karthik</p>
            <p className="text-xs text-[#8a8a8a]">Answers come from his resume - no guessing.</p>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {turns.length === 0 && (
              <Bubble role="assistant">
                Hi - I answer questions about Karthik&apos;s work only. Tap a question below or type your own.
              </Bubble>
            )}
            {turns.map((t, i) => <Bubble key={i} role={t.role}>{t.text}</Bubble>)}
            {busy && turns.at(-1)?.role === 'user' && (
              <p className="text-xs italic text-[#6f6f6f]">thinking...</p>
            )}
          </div>

          {/* Prebuilt questions: always visible, scrollable row */}
          <div className="border-t border-white/10 px-3 pt-2">
            <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
              {visible.map(q => (
                <button
                  key={q}
                  type="button"
                  disabled={busy}
                  onClick={() => send(q)}
                  className="whitespace-nowrap rounded-full border border-[#C8FF3D]/25 px-3 py-1.5 text-xs text-[#C8FF3D]/90 transition-colors hover:bg-[#C8FF3D]/10 disabled:opacity-40"
                >
                  {q}
                </button>
              ))}
            </div>
            {SUGGESTIONS.length > 4 && (
              <button
                type="button"
                onClick={() => setShowAll(v => !v)}
                className="mb-1 text-[11px] text-[#6f6f6f] underline-offset-2 hover:text-[#8a8a8a] hover:underline"
              >
                {showAll ? 'fewer questions' : `+${SUGGESTIONS.length - 4} more questions`}
              </button>
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
              placeholder="Ask a question..."
              aria-label="Chat message"
              className="flex-1 bg-transparent px-2 py-1.5 text-sm text-[#F4F1EA] placeholder:text-[#6f6f6f] focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send message"
              className="rounded-lg p-2 text-[#C8FF3D] transition-colors hover:bg-[#C8FF3D]/10 disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
