import { describe, it, expect } from 'vitest'
import { identity, experience, education, achievements, skillGroups, techChains, learningRoadmap } from './profile'
import { projects } from './projects'

/**
 * These tests exist because this codebase shipped with fabricated content:
 * placeholder emails, a wrong GitHub handle that 404'd every link, invented
 * open-source metrics, and invented skill percentages.
 *
 * They assert the invariants that were violated, so a regression is a failing
 * build rather than something a recruiter discovers.
 */

describe('identity', () => {
  it('uses the real contact address, not a placeholder', () => {
    expect(identity.email).toBe('karthiksuru06@gmail.com')
    expect(identity.email).not.toMatch(/example\.(com|org)/)
  })

  it('points at the GitHub account that actually exists', () => {
    // The old site used `karthiksuru`, which 404s. The real handle has `06`.
    expect(identity.github).toBe('https://github.com/karthiksuru06')
    expect(identity.github).not.toMatch(/karthiksuru(?!06)/)
  })

  it('has an https LinkedIn URL', () => {
    expect(identity.linkedin).toMatch(/^https:\/\/(www\.)?linkedin\.com\/in\//)
  })
})

describe('no placeholder content anywhere', () => {
  const blob = JSON.stringify({
    identity, experience, education, achievements, skillGroups, techChains, learningRoadmap, projects,
  })

  it.each([
    ['example.com', /example\.com/i],
    ['lorem ipsum', /lorem ipsum/i],
    ['TODO markers', /\bTODO\b|\bFIXME\b|\bXXX\b/],
    ['placeholder text', /placeholder|your name here|coming soon/i],
  ])('contains no %s', (_label, pattern) => {
    expect(blob).not.toMatch(pattern)
  })

  it('makes no unverified OpenWISP merge claims', () => {
    // A public PR search returned zero merged PRs. Any resurrected count
    // like "9+ merged PRs" should fail the build.
    expect(blob).not.toMatch(/\d+\+?\s*(merged\s*)?PRs?\s*merged/i)
    expect(blob).not.toMatch(/merged\s*\d+\+?\s*PRs?/i)
  })

  it('has no skill percentages', () => {
    // Self-assigned proficiency percentages were explicitly removed.
    const skillBlob = JSON.stringify(skillGroups)
    expect(skillBlob).not.toMatch(/"level"\s*:\s*\d+/)
    expect(skillBlob).not.toMatch(/\d{2,3}\s*%/)
  })
})

describe('experience', () => {
  it('records the three real internships plus open source', () => {
    expect(experience).toHaveLength(4)
  })

  it('never claims the fabricated Dec 2024 RCTS start date', () => {
    const periods = experience.map((e) => e.period)
    expect(periods).not.toContain('Dec 2024 - Present')
  })

  it('gives every entry an organisation, period, and at least one highlight', () => {
    for (const item of experience) {
      expect(item.organization, `${item.title} missing organization`).toBeTruthy()
      expect(item.period, `${item.title} missing period`).toBeTruthy()
      expect(item.highlights.length, `${item.title} has no highlights`).toBeGreaterThan(0)
    }
  })

  it('cites a URL for any PR it lists', () => {
    // Bare PR numbers with nothing behind them are what got us here.
    for (const item of experience) {
      for (const pr of item.prs ?? []) {
        expect(pr.url, `PR ${pr.number} has no verifying link`).toMatch(/^https:\/\//)
      }
    }
  })
})

describe('skills', () => {
  const validTiers = ['core', 'working', 'familiar']

  it('assigns every skill a valid honesty tier', () => {
    for (const group of skillGroups) {
      for (const skill of group.skills) {
        expect(validTiers, `${skill.name} has tier "${skill.tier}"`).toContain(skill.tier)
      }
    }
  })

  it('gives every skill a note explaining how it is used', () => {
    for (const group of skillGroups) {
      for (const skill of group.skills) {
        expect(skill.note, `${skill.name} has no note`).toBeTruthy()
      }
    }
  })

  it('lists no duplicate skills across groups', () => {
    const names = skillGroups.flatMap((g) => g.skills.map((s) => s.name))
    expect(new Set(names).size).toBe(names.length)
  })
})

describe('technology chains', () => {
  it('gives every chain a terminal outcome, not just a tool list', () => {
    for (const chain of techChains) {
      expect(chain.steps.length, `${chain.label} is too short to be a chain`).toBeGreaterThan(2)
    }
  })
})

describe('learning roadmap', () => {
  it('uses only known status values', () => {
    for (const item of learningRoadmap) {
      expect(['solid', 'active', 'next']).toContain(item.status)
    }
  })
})
