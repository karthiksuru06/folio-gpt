import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sun, Moon, ChevronRight } from 'lucide-react'
import { getPageTitles, getSectionLabels } from './articles/registry'

const PAGE_TITLE = getPageTitles()
const SECTION_LABELS = getSectionLabels()

function useActiveSection(pathname: string, enabled: boolean) {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    setActiveId(null)
    if (!enabled) return

    let io: IntersectionObserver | null = null
    let mo: MutationObserver | null = null

    function setup() {
      const h1 = document.querySelector('h1')
      const headings = Array.from(document.querySelectorAll('h2[id]'))
      if (headings.length === 0) return false

      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              if (entry.target.tagName === 'H1') {
                setActiveId(null)
                return
              }
              setActiveId(entry.target.id)
              return
            }
          }
        },
        { rootMargin: '-64px 0px -75% 0px' }
      )

      if (h1) io.observe(h1)
      headings.forEach((h) => io!.observe(h))
      return true
    }

    if (!setup()) {
      mo = new MutationObserver(() => {
        if (setup()) mo!.disconnect()
      })
      mo.observe(document.body, { childList: true, subtree: true })
    }

    return () => {
      io?.disconnect()
      mo?.disconnect()
    }
  }, [pathname, enabled])

  return activeId
}

function useLang() {
  const { pathname } = useLocation()
  const isHome = pathname === '/' || pathname === '/en'
  const lang: 'en' | 'es' = 'en'
  const pageTitle = PAGE_TITLE[pathname] ?? null
  return { pathname, isHome, lang, pageTitle }
}

function useTheme() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  useEffect(() => {
    if (localStorage.getItem('theme')) return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      setIsDark(e.matches)
      document.documentElement.classList.toggle('dark', e.matches)
      document.documentElement.classList.toggle('light', !e.matches)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const toggleTheme = useCallback(() => {
    document.documentElement.style.setProperty('--theme-transition', 'none')
    document.querySelectorAll('*').forEach(el => {
      (el as HTMLElement).style.transition = 'none'
    })

    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    document.documentElement.classList.toggle('light', !next)
    localStorage.setItem('theme', next ? 'dark' : 'light')

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.style.removeProperty('--theme-transition')
        document.querySelectorAll('*').forEach(el => {
          (el as HTMLElement).style.transition = ''
        })
      })
    })
  }, [isDark])

  return { isDark, toggleTheme }
}

function NavControls({ isDark, toggleTheme }: { isDark: boolean; toggleTheme: () => void }) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={toggleTheme}
        className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-md border border-border flex items-center justify-center shadow-lg hover:border-primary/50 hover:shadow-primary/20 hover:shadow-xl transition-all"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="w-5 h-5 text-primary" /> : <Moon className="w-5 h-5 text-primary" />}
      </button>
    </div>
  )
}

export default function GlobalNav() {
  const { pathname, isHome, pageTitle } = useLang()
  const { isDark, toggleTheme } = useTheme()
  const activeSection = useActiveSection(pathname, !isHome)
  const hasBar = !isHome
  const sectionLabels = SECTION_LABELS[pathname]
  const activeSectionLabel = activeSection && sectionLabels?.[activeSection]

  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])

  const barShown = useRef(false)
  const animateBar = hasBar && !barShown.current
  if (hasBar) barShown.current = true

  const backLinkShown = useRef(false)
  const animateBackLink = !isHome && !backLinkShown.current
  if (!isHome) backLinkShown.current = true

  const controls = <NavControls isDark={isDark} toggleTheme={toggleTheme} />
  const fade = (duration: string) => ({ animation: `nav-fade-in ${duration} ease-out` })

  if (hasBar) {
    return (
      <nav className="sticky top-0 z-50 relative">
        <div
          className="absolute inset-0 bg-background/80 backdrop-blur-md border-b border-border"
          style={animateBar ? fade('0.35s') : undefined}
        />
        <div className="relative pt-4 pb-3 px-6 pl-14 xl:pl-6 flex items-center justify-between">
          <div className="min-w-0 flex items-center">
            {!isHome && (
              <nav
                aria-label="Breadcrumb"
                className="inline-flex items-center gap-1.5 text-sm"
                style={animateBackLink ? fade('0.4s') : undefined}
              >
                <Link
                  to={'/'}
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors shrink-0"
                >
                  <img src="/foto-avatar.jpg" alt="Home" className="w-6 h-6 rounded-full border border-border/50 object-cover" />
                  <span className="hidden sm:inline font-display font-medium">foliogpt.com</span>
                </Link>
                {pageTitle && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                    <button
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className={`hover:text-foreground transition-colors cursor-pointer truncate ${activeSectionLabel ? 'text-muted-foreground' : 'text-foreground font-medium'}`}
                    >
                      {pageTitle}
                    </button>
                  </>
                )}
                {activeSectionLabel && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0 hidden sm:block" />
                    <span className="text-foreground font-medium truncate max-w-[140px] sm:max-w-none hidden sm:inline">
                      {activeSectionLabel}
                    </span>
                  </>
                )}
              </nav>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {controls}
          </div>
        </div>
      </nav>
    )
  }

  if (!hydrated) return null

  return (
    <div className="fixed top-4 right-6 z-50 flex items-center gap-3">
      {controls}
    </div>
  )
}
