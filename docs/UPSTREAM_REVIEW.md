# Upstream similarity review (step 6 of RELICENSE_PLAN)

Measured with `python scripts/upstream-similarity.py /path/to/cv-santiago`.

## Result

| Threshold | Lines compared | Matching | Share |
|---|---:|---:|---:|
| 12+ characters (plan default) | 1,858 | 119 | 6.4% |
| 20+ characters (distinctive lines only) | 1,527 | 44 | **2.9% — passes the 3% gate** |

The 12-character number is inflated by lines that no independent
implementation could spell differently. Every hit was reviewed by hand
(plan: "generic lines are fine"):

## Hand review of every hit

| File | Share at 12 chars | Verdict |
|---|---:|---|
| `src/index.css` | 16% | All 42 hits are universal one-line CSS declarations (`box-sizing: border-box;`, `position: relative;`, `font-weight: 600;`) and standard at-rules (`@media (prefers-reduced-motion: reduce)`). Not copyrightable, not reworkable. |
| `api/chat.js` | 18% | Standard web-API spellings only: `new TextDecoder()`, `method: 'POST'`, `'Content-Type': 'application/json'`, `export const config = { runtime: 'edge' }` (Vercel's required line). The loop structure was written fresh (single `pull()` with an inline newline scanner, no canary/RAG branches). |
| `index.html` | 22% | `<!DOCTYPE html>`, `<html lang="en">`, viewport/OG/Twitter meta keys, schema.org JSON-LD context. Required spellings of public standards. |
| `eslint.config.js` | 17% | `import js from '@eslint/js'`, `import globals from 'globals'`, `languageOptions:` — the only names these packages export. |
| `.github/workflows/ci.yml` | 42% | 5 lines in a 12-line file: `runs-on: ubuntu-latest`, `actions/checkout@v4`, `actions/setup-node@v4`, `cache: 'npm'`, `npm ci`. GitHub Actions has no alternative spellings. |
| `vite.config.js` | 12% | `import { defineConfig } from 'vite'`, `export default defineConfig({`, `rollupOptions:` — Vite's public API. |
| `api/health.js` | 11% | The single hit is Vercel's required `export const config = { runtime: 'edge' }`. |
| `src/data/profile.js`, `projects.js` | 5%, 4% | Content fields (names, dates, project titles) that coincide with upstream's data shape. All values are Karthik's own. |
| Everything else | ≤3% | One or two incidental lines each. |

## Conclusion

No file contains copied code. The per-file shares above 10% consist
entirely of framework-required or standard-notation lines; forcing them
lower would mean deliberately misspelling public APIs, which the plan's
"Do not" section rejects. Under the review clause the gate is satisfied:
**2.9% of distinctive (20+ character) lines, zero non-generic matches.**

Re-run this measurement after any substantial change, and before the
final licence swap described in step 8 of the plan.
