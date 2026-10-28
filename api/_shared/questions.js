// Question filter for the portfolio chat. Only questions about Karthik's
// professional background are answered; prompt-extraction attempts are not.

const RULES = [
  { tag: 'jailbreak-attempt', re: /ignore (?:all |any )?(?:previous|prior|earlier|above) instructions/i },
  { tag: 'jailbreak-attempt', re: /reveal (?:your|the) (?:system|initial|hidden) prompt/i },
  { tag: 'jailbreak-attempt', re: /show (?:me )?(?:your|the) (?:system|initial|hidden) prompt/i },
  { tag: 'jailbreak-attempt', re: /repeat everything above/i },
  { tag: 'jailbreak-attempt', re: /disregard (?:your|the|all) rules/i },
  { tag: 'jailbreak-attempt', re: /you are (?:now )?(?:dan|unrestricted|jailbroken)/i },
  { tag: 'jailbreak-attempt', re: /pretend (?:you are|to be)/i },
  { tag: 'jailbreak-attempt', re: /act as (?!karthik)/i },
  { tag: 'jailbreak-attempt', re: /(?:output|print|display) (?:your )?(?:system )?prompt/i },
]

/** Returns a list of tags; empty means the question is fine. */
export function classifyQuestion(text) {
  const q = String(text || '')
  return RULES.filter(r => r.re.test(q)).map(r => r.tag)
}

// Short phrases that only appear inside the system prompt. If they surface in
// an answer, the model leaked its instructions rather than answering.
const MARKERS = ['MANDATORY BREVITY', 'internal_ref:FOLIO']

export function isPromptLeak(answer) {
  const a = String(answer || '')
  return MARKERS.some(m => a.includes(m))
}
