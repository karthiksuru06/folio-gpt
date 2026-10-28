// Request guards for /api/chat: sanitising, origin check, rate limiting, bot check.
// Pure functions where possible so they can be unit tested without a network.

export const MAX_TURNS = 6
export const MAX_USER_CHARS = 600
export const MAX_ASSISTANT_CHARS = 1500
export const LIMIT_PER_MINUTE = 10
export const LIMIT_PER_DAY = 60

// Control, zero-width and bidi-override characters are used to hide injected
// text. Tab, newline and carriage return survive (they are legitimate).
const INVISIBLE_RANGES = [
  [0x0000, 0x0008], [0x000b, 0x000c], [0x000e, 0x001f],
  [0x200b, 0x200f], [0x202a, 0x202e], [0x2060, 0x2064], [0xfeff, 0xfeff],
]
const isInvisible = (cp) => INVISIBLE_RANGES.some(([lo, hi]) => cp >= lo && cp <= hi)

export function cleanText(text) {
  const stripped = Array.from(String(text).normalize('NFKC'))
    .filter(ch => !isInvisible(ch.codePointAt(0)))
    .join('')
  return stripped.trim()
}

/** Accept only user/assistant string turns. The server owns the system prompt. */
export function sanitizeMessages(raw) {
  if (!Array.isArray(raw)) return []
  return raw
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map(m => ({
      role: m.role,
      content: cleanText(m.content).slice(0, m.role === 'user' ? MAX_USER_CHARS : MAX_ASSISTANT_CHARS),
    }))
    .filter(m => m.content.length > 0)
    .slice(-MAX_TURNS)
}

export function originAllowed(origin, requestUrl, allowedList = '') {
  if (!origin) return true
  const extra = allowedList.split(',').map(o => o.trim()).filter(Boolean)
  try {
    const o = new URL(origin)
    return o.host === new URL(requestUrl).host || o.hostname === 'localhost' || extra.includes(origin)
  } catch {
    return false
  }
}

const memoryHits = new Map()

/** Fixed-window limiter. Upstash Redis (shared) when configured, else per-instance memory. */
export async function hit(key, windowSec, limit, env = process.env, fetchImpl = fetch) {
  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const r = await fetchImpl(`${env.UPSTASH_REDIS_REST_URL}/pipeline`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify([['INCR', key], ['EXPIRE', key, windowSec, 'NX']]),
      })
      const out = await r.json()
      const n = Number(out?.[0]?.result)
      if (Number.isFinite(n)) return n <= limit
    } catch {
      // Redis unreachable: fall back to memory rather than blocking everyone.
    }
  }
  const now = Date.now()
  const rec = memoryHits.get(key)
  if (!rec || rec.reset < now) {
    if (memoryHits.size > 5000) memoryHits.clear()
    memoryHits.set(key, { count: 1, reset: now + windowSec * 1000 })
    return true
  }
  rec.count += 1
  return rec.count <= limit
}

export function resetMemoryLimiter() {
  memoryHits.clear()
}

/** Cloudflare Turnstile. Disabled (always true) unless TURNSTILE_SECRET is set. */
export async function verifyTurnstile(token, ip, env = process.env, fetchImpl = fetch) {
  if (!env.TURNSTILE_SECRET) return true
  if (!token || typeof token !== 'string') return false
  try {
    const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token })
    if (ip && ip !== 'unknown') body.set('remoteip', ip)
    const r = await fetchImpl('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body })
    return (await r.json())?.success === true
  } catch {
    return false
  }
}
