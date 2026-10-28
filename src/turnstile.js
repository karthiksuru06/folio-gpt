// Optional Cloudflare Turnstile token for /api/chat. Does nothing unless
// VITE_TURNSTILE_SITEKEY is set, so local dev and previews work without it.

const SITEKEY = import.meta.env.VITE_TURNSTILE_SITEKEY

let scriptPromise = null
function loadScript() {
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script')
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      s.async = true
      s.onload = () => resolve()
      s.onerror = () => reject(new Error('turnstile load failed'))
      document.head.appendChild(s)
    })
  }
  return scriptPromise
}

export async function getTurnstileToken() {
  if (!SITEKEY) return undefined
  try {
    await loadScript()
    return await new Promise((resolve) => {
      const host = document.createElement('div')
      host.style.display = 'none'
      document.body.appendChild(host)
      const timer = setTimeout(() => { host.remove(); resolve(undefined) }, 8000)
      const id = window.turnstile.render(host, {
        sitekey: SITEKEY,
        size: 'invisible',
        callback: (token) => { clearTimeout(timer); host.remove(); resolve(token) },
        'error-callback': () => { clearTimeout(timer); host.remove(); resolve(undefined) },
      })
      window.turnstile.execute(id)
    })
  } catch {
    return undefined
  }
}
