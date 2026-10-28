// Post-generation fact check. The model is told to use only the resume, but a
// prompt is not a guarantee, so every answer is checked against the same text.

export const FALLBACK_ANSWER =
  "I'd rather not guess on that. Email me at [karthiksuru06@gmail.com](mailto:karthiksuru06@gmail.com) and I'll answer directly."

const norm = (s) => String(s).toLowerCase().replace(/,/g, '')

/** Numbers 0-12 are allowed freely ("three internships", list counts). Anything else must be in the corpus. */
function unsupportedNumbers(answer, corpus) {
  const c = norm(corpus)
  const bad = []
  for (const m of answer.matchAll(/\b\d[\d,]*(?:\.\d+)?%?/g)) {
    const raw = m[0]
    const n = norm(raw)
    if (/^\d{1,2}$/.test(n) && Number(n) <= 12) continue
    if (!c.includes(n)) bad.push(raw)
  }
  return bad
}

function unsupportedEmployers(answer, corpus) {
  const c = corpus.toLowerCase()
  const bad = []
  const re = /\b(?:worked|interned|employed|served)\s+(?:at|for|with)\s+([A-Z][\w&.-]*(?:\s+[A-Z][\w&.-]*)?)/g
  for (const m of answer.matchAll(re)) {
    if (!c.includes(m[1].toLowerCase())) bad.push(m[1])
  }
  return bad
}

const FORBIDDEN = [
  { name: 'merged-prs', re: /\b(?:prs?|pull requests?)\s+(?:\w+\s+){0,2}(?:were|was|got|have been|has been)\s+merged\b|\bmerged\s+(?:\w+\s+){0,2}(?:prs?|pull requests?)\b/i },
  { name: 'salary', re: /(?:₹|\$|€|£|\binr\b|\busd\b)\s?\d|\b\d+\s?(?:lpa|lakhs?|k\s?per)\b/i },
  { name: 'professional-years', re: /\b\d+\+?\s+years?\s+of\s+(?:professional\s+|industry\s+)?experience\b/i },
  { name: 'press', re: /\b(?:featured|covered)\s+(?:in|by)\b.*\b(?:wired|forbes|techcrunch|business insider)\b/i },
  { name: 'user-counts', re: /\b\d[\d,]*\+?\s+(?:active\s+)?(?:users|customers|clients)\b/i },
]

/** Returns { ok, reasons }. Pure: pass the corpus text in. */
export function verifyAnswer(answer, corpus) {
  const reasons = []
  const text = String(answer || '')
  if (!text.trim()) return { ok: false, reasons: ['empty'] }
  for (const f of FORBIDDEN) if (f.re.test(text)) reasons.push(f.name)
  const nums = unsupportedNumbers(text, corpus)
  if (nums.length) reasons.push(`unsupported-number:${nums.join(',')}`)
  const emp = unsupportedEmployers(text, corpus)
  if (emp.length) reasons.push(`unsupported-employer:${emp.join(',')}`)
  return { ok: reasons.length === 0, reasons }
}
