import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { verifyAnswer } from '../../api/_shared/verify.js'

const corpus = readFileSync(resolve(process.cwd(), 'chatbot-prompt.txt'), 'utf8')
const ok = (a) => verifyAnswer(a, corpus)

describe('verifyAnswer: honest answers pass', () => {
  it.each([
    'I did three research engagements at RCTS, IIIT Hyderabad, starting in Aug 2024.',
    'EfficientNet-B3 reached 60.1% top-1 across 24 WikiArt classes.',
    'Yukthi is around 380 source files and Compliance OS around 500.',
    'I graduate in May 2027 from KIET Kakinada.',
    'My OpenWISP pull requests are still under review.',
    'You can reach me at karthiksuru06@gmail.com.',
  ])('%s', (a) => expect(ok(a)).toEqual({ ok: true, reasons: [] }))
})

describe('verifyAnswer: fabrications fail', () => {
  it('rejects merged-PR claims', () => {
    expect(ok('Several of my OpenWISP pull requests were merged.').reasons).toContain('merged-prs')
    expect(ok('I merged 5 PRs into OpenWISP.').ok).toBe(false)
  })
  it('rejects invented metrics and years', () => {
    expect(ok('Compliance OS reached 98% accuracy.').reasons.join()).toMatch(/unsupported-number:98%/)
    expect(ok('I graduated in 2023.').reasons.join()).toMatch(/unsupported-number:2023/)
  })
  it('rejects user counts and press', () => {
    expect(ok('The platform serves 1,200 users.').ok).toBe(false)
    expect(ok('I was featured in Forbes.').reasons).toContain('press')
  })
  it('rejects salary figures and professional-years claims', () => {
    expect(ok('I expect 12 LPA.').reasons).toContain('salary')
    expect(ok('I have 4 years of professional experience.').reasons).toContain('professional-years')
  })
  it('rejects employers that are not in the resume', () => {
    expect(ok('I worked at Infosys last summer.').reasons.join()).toMatch(/unsupported-employer:Infosys/)
    expect(ok('I worked at RCTS in Hyderabad.').ok).toBe(true)
  })
  it('rejects empty output', () => {
    expect(ok('   ').reasons).toEqual(['empty'])
  })
})
