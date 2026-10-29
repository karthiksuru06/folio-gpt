/*
 * No-flash theme initialiser.
 *
 * Runs synchronously in <head>, before first paint, under CSP script-src
 * 'self' (it lives in /public, so it is served as a same-origin file — no
 * inline script). Light is the default landing theme; a stored preference
 * re-applies the `.dark` class so returning visitors never see a flash of the
 * wrong palette. Kept in vanilla JS on purpose: it must work before the
 * React bundle has even been parsed.
 */
(function () {
  try {
    const stored = localStorage.getItem('folio-theme')
    const theme = stored === 'dark' || stored === 'light' ? stored : 'light'
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.style.colorScheme = theme
  } catch {
    /* Private-mode browsers block localStorage; the light default still holds. */
  }
})()
