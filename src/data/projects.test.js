import { describe, it, expect } from 'vitest'
import { projects } from './projects'

/**
 * The original bug: ProjectModal rendered `project.problem`, `.solution`, and
 * `.impact`, but the projects array defined none of them — every modal showed
 * three empty headed sections. Nothing caught it because nothing checked that
 * the data satisfied what the view consumed.
 *
 * This suite is that check. If a project is added without the fields the modal
 * reads, the build fails instead of the page rendering blank.
 */

/** Fields ProjectModal.jsx reads and renders as a titled section. */
const MODAL_REQUIRED = ['problem', 'solution', 'architecture', 'impact']
const MODAL_REQUIRED_ARRAYS = ['features', 'challenges', 'techStack']

describe('project data satisfies the modal contract', () => {
  it.each(projects.map((p) => [p.title, p]))(
    '%s defines every prose field the modal renders',
    (_title, project) => {
      for (const field of MODAL_REQUIRED) {
        expect(project[field], `missing "${field}"`).toBeTruthy()
        expect(typeof project[field]).toBe('string')
      }
    }
  )

  it.each(projects.map((p) => [p.title, p]))(
    '%s defines every list field the modal renders',
    (_title, project) => {
      for (const field of MODAL_REQUIRED_ARRAYS) {
        expect(Array.isArray(project[field]), `"${field}" is not an array`).toBe(true)
        expect(project[field].length, `"${field}" is empty`).toBeGreaterThan(0)
      }
    }
  )
})

describe('project identity', () => {
  it('gives every project a unique id', () => {
    const ids = projects.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('gives every project a title, icon, and short description', () => {
    for (const p of projects) {
      expect(p.title).toBeTruthy()
      expect(p.icon).toBeTruthy()
      expect(p.shortDesc).toBeTruthy()
    }
  })
})

describe('links', () => {
  it('uses https for every repo and demo link', () => {
    for (const p of projects) {
      if (p.github) expect(p.github, `${p.title} github`).toMatch(/^https:\/\//)
      if (p.demo) expect(p.demo, `${p.title} demo`).toMatch(/^https:\/\//)
    }
  })

  it('never links the wrong GitHub account', () => {
    // `karthiksuru` (no 06) is the handle that 404s.
    for (const p of projects) {
      if (p.github) {
        expect(p.github, `${p.title} uses the 404ing handle`).not.toMatch(
          /github\.com\/karthiksuru(?!06)(?!.*RCTS)/
        )
      }
    }
  })
})

describe('no fabricated projects', () => {
  // These three appeared on the old site and exist nowhere on disk or GitHub.
  it.each(['SecureChat', 'CryptoVault', 'ThreatHunter'])(
    'does not list the invented project %s',
    (name) => {
      expect(projects.map((p) => p.title)).not.toContain(name)
    }
  )
})

describe('honesty about deployment', () => {
  it('claims a live demo only where a demo URL exists', () => {
    for (const p of projects) {
      if (p.status === 'Live') {
        expect(p.demo, `${p.title} is marked Live but has no demo URL`).toBeTruthy()
      }
    }
  })
})
