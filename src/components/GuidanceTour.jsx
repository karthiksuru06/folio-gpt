import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'

/**
 * First-visit guidance tour.
 *
 * A spotlight tour that runs once per visitor (localStorage) and can be
 * replayed from the navbar's guide button via the `replaySignal` prop. The
 * overlay is deliberately pointer-events-transparent: the whole point of the
 * first step is inviting the visitor to click the theme toggle while the
 * tour is pointing at it, so nothing may block the actual click. Only the
 * tooltip itself accepts pointer events.
 *
 * Fades use plain CSS transitions plus an explicit close timer instead of
 * framer-motion's AnimatePresence. Exit-completion callbacks are unreliable
 * in throttled/background tabs (the node stayed mounted at opacity 0), while
 * a setTimeout-backed close always unmounts — worst case a beat later.
 */

const SEEN_KEY = 'folio-guide-seen'
const START_DELAY_MS = 1400
const EXIT_MS = 220 // matches duration-200 plus a frame of slack

const STEPS = [
  {
    target: '#theme-toggle',
    title: 'Click to see the difference',
    body: 'This portfolio has two skins — warm paper, the default you landed on, and Editorial Dark. Same words, same layout — only the palette swaps.',
  },
  {
    target: '#projects',
    title: 'Open any project',
    body: 'Every card opens a full case study: the problem, the architecture, and the measurable outcome.',
  },
  {
    target: '#chat-trigger',
    title: 'Ask the assistant',
    body: 'The assistant pinned bottom-right answers questions about Karthik’s work straight from his résumé — no guessing.',
  },
]

const TOOLTIP_WIDTH = 22 // rem
const GAP = 14 // px between target and tooltip
const EDGE = 16 // min px from viewport edges

export default function GuidanceTour({ replaySignal = 0 }) {
  const [state, setState] = useState({ active: false, index: 0 })
  const [closing, setClosing] = useState(false)
  const [steps, setSteps] = useState(STEPS)
  const [rect, setRect] = useState(null)
  const [tooltip, setTooltip] = useState({ top: 0, left: 0, placement: 'bottom', width: TOOLTIP_WIDTH * 16 })

  const nextButtonRef = useRef(null)
  const lastFocusedRef = useRef(null)
  const tooltipRef = useRef(null)
  const closeTimerRef = useRef(null)

  const current = state.active ? steps[state.index] : null

  /* ---------------------------------------------------------- lifecycle -- */

  const finish = useCallback(() => {
    if (closeTimerRef.current) return // already fading out
    try {
      localStorage.setItem(SEEN_KEY, '1')
    } catch {
      /* private mode: the tour simply shows again next visit */
    }
    // Fade out first, then unmount — the timer guarantees removal even if the
    // browser suspends CSS transitions (hidden tab, reduced motion).
    setClosing(true)
    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = null
      setClosing(false)
      setState({ active: false, index: 0 })
    }, EXIT_MS)
  }, [])

  const start = useCallback(() => {
    // Cancel a pending close so a replay during the fade still opens cleanly.
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    // Only tour steps whose target actually exists right now (e.g. the chat
    // button is always rendered, but be defensive about future changes).
    const available = STEPS.filter((step) => document.querySelector(step.target))
    if (available.length === 0) return
    lastFocusedRef.current = document.activeElement
    setClosing(false)
    setSteps(available)
    setState({ active: true, index: 0 })
  }, [])

  // Never leak the close timer if the page unmounts mid-fade.
  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
  }, [])

  // First visit: auto-start once the page has settled. Returning visitors
  // never see it unless they press the guide button.
  useEffect(() => {
    let seen = false
    try {
      seen = localStorage.getItem(SEEN_KEY) === '1'
    } catch {
      seen = false
    }
    if (seen) return undefined
    const timer = setTimeout(start, START_DELAY_MS)
    return () => clearTimeout(timer)
  }, [start])

  // Replay from the navbar. Deferred one tick so the state update lands after
  // the commit that delivered the signal instead of cascading inside it.
  useEffect(() => {
    if (replaySignal <= 0) return undefined
    const id = setTimeout(start, 0)
    return () => clearTimeout(id)
  }, [replaySignal, start])

  // Esc closes; focus the primary button on each step change.
  useEffect(() => {
    if (!state.active) return undefined
    const onKeyDown = (e) => {
      if (e.key === 'Escape') finish()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [state.active, finish])

  useEffect(() => {
    if (state.active && !closing) nextButtonRef.current?.focus()
  }, [state.active, state.index, closing])

  // Restore focus to whatever had it before the tour (close via Skip/Done).
  useEffect(() => {
    if (!state.active && lastFocusedRef.current) {
      lastFocusedRef.current.focus?.()
      lastFocusedRef.current = null
    }
  }, [state.active])

  /* --------------------------------------------------------- measurement -- */

  useLayoutEffect(() => {
    // No clearing of `rect` here on purpose: a stale rect from a previous run
    // can never paint, because this effect re-measures (and setState) before
    // the browser paints, and the render guards on `rect` being non-null.
    if (!current) return undefined

    const measure = () => {
      const el = document.querySelector(current.target)
      if (!el) return
      const r = el.getBoundingClientRect()
      setRect(r)

      // Tooltip placement: below the target by default, flipped above when
      // there isn't room; horizontally centred on the target, clamped in.
      const tooltipWidth = Math.min(TOOLTIP_WIDTH * 16, window.innerWidth - EDGE * 2)
      const estimatedHeight = tooltipRef.current?.offsetHeight || 190
      const below = r.bottom + GAP + estimatedHeight < window.innerHeight - EDGE
      const top = below
        ? r.bottom + GAP
        : Math.max(EDGE, r.top - GAP - estimatedHeight)
      const centre = r.left + r.width / 2
      const left = Math.min(
        Math.max(EDGE, centre - tooltipWidth / 2),
        window.innerWidth - EDGE - tooltipWidth
      )
      setTooltip({ top, left, placement: below ? 'bottom' : 'top', width: tooltipWidth })
    }

    measure()
    // Re-measure after fonts/layout settle and on any scroll or resize — the
    // spotlight must track the target (the navbar is fixed, sections scroll).
    const settle = setTimeout(measure, 250)
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure, { passive: true })
    return () => {
      clearTimeout(settle)
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [current])

  /* -------------------------------------------------------------- render -- */

  if (!state.active || !current || !rect) return null

  const isLast = state.index === steps.length - 1

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[90] transition-opacity duration-200 ${
        closing ? 'opacity-0' : 'opacity-100'
      }`}
      aria-live="polite"
    >
      {/* Dimmed backdrop + spotlight hole. pointer-events-none (inherited from
          the wrapper) so the highlighted control underneath stays clickable. */}
      <div
        className="pointer-events-none fixed"
        style={{
          top: rect.top - 6,
          left: rect.left - 6,
          width: rect.width + 12,
          height: rect.height + 12,
          borderRadius: rect.height > 40 ? 16 : 999,
          boxShadow:
            '0 0 0 4px rgb(var(--c-accent) / 0.35), 0 0 0 9999px rgb(var(--c-paper) / 0.78)',
        }}
      />

      {/* The only pointer-events-auto element: everything else passes clicks
          straight through to the page (the theme toggle on step 1). */}
      <div
        ref={tooltipRef}
        role="dialog"
        aria-modal="false"
        aria-labelledby="guide-step-title"
        className={`pointer-events-auto fixed rounded-2xl border border-ink/10 bg-surface p-5 shadow-2xl transition-all duration-200 ${
          closing ? 'pointer-events-none -translate-y-1 opacity-0' : 'translate-y-0 opacity-100'
        }`}
        style={{ top: tooltip.top, left: tooltip.left, width: tooltip.width }}
      >
        <button
          type="button"
          onClick={finish}
          aria-label="Close guide"
          className="absolute right-3 top-3 rounded-full p-1.5 text-ink-faint transition-colors hover:text-ink"
        >
          <X size={16} aria-hidden="true" />
        </button>

        <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
          Step {state.index + 1} of {steps.length}
        </p>
        <h2 id="guide-step-title" className="font-display mt-2 text-xl text-ink">
          {current.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{current.body}</p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={finish}
            className="text-sm font-medium text-ink-faint transition-colors hover:text-ink"
          >
            Skip
          </button>

          <div className="flex items-center gap-2">
            {state.index > 0 && (
              <button
                type="button"
                onClick={() => setState((s) => ({ ...s, index: s.index - 1 }))}
                aria-label="Previous step"
                className="rounded-full border border-ink/10 p-2.5 text-ink-soft transition-colors hover:border-accent/40 hover:text-ink"
              >
                <ArrowLeft size={15} aria-hidden="true" />
              </button>
            )}
            <button
              ref={nextButtonRef}
              type="button"
              onClick={() => {
                if (isLast) finish()
                else setState((s) => ({ ...s, index: s.index + 1 }))
              }}
              className="flex items-center gap-2 rounded-full bg-accent-fill px-5 py-2.5 text-sm font-semibold text-on-accent transition-transform hover:scale-[1.03]"
            >
              {isLast ? 'Done' : 'Next'}
              {!isLast && <ArrowRight size={15} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
