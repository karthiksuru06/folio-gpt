import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

/**
 * Theme context.
 *
 * The initial value is read from <html>, which the synchronous
 * /theme-init.js in index.html has already configured before React boots —
 * so the first render matches what the user saw at first paint. The chosen
 * theme is mirrored to three places: the `.dark` class (what the CSS tokens
 * key off), `color-scheme` (native scrollbars/form controls), and
 * localStorage (what theme-init.js replays on the next visit).
 */

const THEME_KEY = 'folio-theme'
const ThemeContext = createContext(null)

const readInitialTheme = () =>
  (typeof document !== 'undefined' && document.documentElement.classList.contains('dark'))
    ? 'dark'
    : 'light'

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.style.colorScheme = theme
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      /* Private mode: the session still toggles, it just won't persist. */
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}
