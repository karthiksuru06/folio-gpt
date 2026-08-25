# folio-gpt — Strip & Rebuild Handoff

**Branch:** `strip-third-party-content` (nothing touched on `main` — revert with
`git checkout main` if needed)
**Date:** 2026-07-20

---

## Why this branch exists

This project is a fork of **cv-santiago** by Santiago Fernandez de Valderrama
Aparicio (santifer.io, Seville). The original rebrand renamed things but left
his identity and career in place. Shipping it as-is would have presented
another person's press coverage, enterprise clients, and case studies as
Karthik's — and the chatbot would have narrated them **in the first person**,
generating supporting detail on request.

The upstream project is open source and adapting it is legitimate. Presenting
its author's career as your own is not. This branch separates the two.

---

## 🔴 REQUIRED before any deploy

### 1. Purge the vector database — deleting files did NOT delete the vectors

Supabase `rag_chunks` still contains Santiago's indexed case studies. The
chatbot will retrieve and speak them regardless of what was deleted from disk.

```bash
npm run rag:ingest
```

`scripts/ingest.js:259` clears the table (`.delete().neq('id', 0)`) before
inserting. With the registry now empty, this leaves the index empty — the
chatbot falls back to `chatbot-prompt.txt` alone, which contains only verified
facts. **That is the safe state.** Re-populate later with real case studies.

**Until this is run, the site is not safe to deploy.**

### 2. Rotate the API keys

`.env` is correctly gitignored and was never committed — the keys are not
public. But the file sits in OneDrive, synced to the cloud. Rotate:
`OPENROUTER_API_KEY`, `HUGGINGFACE_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
(this last one is full database admin).

### 3. Verify the deployed site

If `folio-gpt.vercel.app` (or any domain) is currently live, **it is serving
the un-stripped version right now.** Take it down or redeploy from this branch.

---

## What was removed

**Source files (15):** `JacoboAgent.tsx`, `ProgrammaticSeo.tsx`, `BusinessOS.tsx`,
`SelfHealingChatbot.tsx`, `CareerOps.tsx`, `N8nForPMs.tsx`, `FolioGptRepair.tsx`,
`PressFeatures.tsx`, and their seven `*-i18n.ts` content files.

**Assets (~250 files):** `public/{jacobo,pseo,business-os,career-ops,chatbot,irepair,workflows}/`,
`public/press-logos/` (WIRED, Business Insider), `public/logos/` (Santander,
Lilly, Xylem, Brenntag, Junta, Dipusevilla), `docs/`.

**Individual images:** `garry-tan.jpg`, `javier-martinez.*`, `juan-sabate.*`,
`manuel-lopez.*`, `firma-zinkee-santi.png` (a signature), `zinkee-logo.*`,
`logo-everis.*`, `logo-lico.*`, `logo-santifer.*`, `career-ops-logo.*`,
`bmc-logo.svg`, `humans.txt` (credited Santiago by name and email),
`chatbot-avatar.webp`.

**Fabricated credibility signals:** the "As featured in" press section, nine
testimonial faces, six enterprise client logos, and the `X-Evals: 71` /
`X-Built-With` / `X-Open-To` headers in `vercel.json`.

**Kept:** `public/foto-avatar.jpg` — this is genuinely Karthik, added during the
rebrand. It is the only personal photo in the project.

---

## What was rewritten

| File | Change |
|---|---|
| `chatbot-prompt.txt` | Full rewrite. Verified projects, correct university (Kakinada, not Ghaziabad), three real RCTS internships. Added a hard **HONESTY** block that overrides all other instructions, and a rule to ignore any retrieved content naming someone other than Karthik. Discloses the site is adapted from cv-santiago if asked directly. |
| `src/i18n.ts` | SEO title/description repositioned to AI Engineer. Hero roles and pills. Experience block replaced (was "KHUB Ghaziabad" + **"LinkedIn Networking — Tech Enthusiast"** listed as a job). Education replaced with KIET Kakinada, IIIT-H ML cert, ANVAKRIT finalist. Six verified projects replacing four unverifiable ones. |
| Emails | Standardised to `karthiksuru06@gmail.com` across `main.tsx`, `PrivacyPolicy.tsx`, `about-i18n.ts`, `i18n.ts`, `api/cron/evaluate.js`. Three different addresses were previously in use. |
| `api/cron/evaluate.js` | Location "Seville" → "Visakhapatnam". |

### Legacy key names

`src/i18n.ts` experience keys are still `zinkee`, `careerOps`, `toastmasters`
(upstream names) because `App.tsx` reads them by key. **The content is correct**;
only the identifiers are stale. Rename both files together when convenient.

---

## Restyle — "Instrument"

Token-level restyle in `src/index.css`. Components reference semantic tokens
(`bg-primary`, `text-muted-foreground`), so this propagates without touching
JSX — verified no component hardcodes palette values.

**Direction.** The through-line across every project here is AI *under
constraint*, honestly measured: a 3B model on a student laptop, CPU-only
embeddings, human approval gates, PSNR/SSIM against baseline. So the design
reads as instrument rather than marketing.

| | Before | After |
|---|---|---|
| Background | `20 14% 8%` warm near-black | `222 20% 7%` cool instrument black |
| Primary | `24 92% 58%` orange | `38 95% 62%` amber readout |
| Accent | `178 74% 52%` teal | `191 85% 58%` cyan data channel |
| Muted fg | `30 12% 64%` — **under 4.5:1** | `215 16% 68%` — clears WCAG AA |

Warm black with orange reads as startup marketing. Cooling the base and moving
the signal to amber recontextualises the same hue family as a readout —
terminal, oscilloscope, LED — and keeps the avatar's orange integrated.

**Signature: the measurement block.** A bare `60.1%` is a claim. `60.1% ·
top-1 · 24 classes · EfficientNet-B3 / WikiArt` is a result. That distinction
is the entire positioning of this portfolio, so it is encoded in type rather
than asserted in prose. Classes: `.measure`, `.measure-value`, `.measure-unit`,
`.measure-rule`, `.measure-provenance`, `.measure-inline`, plus `.eyebrow` for
section labels. Usage examples are in the CSS comment block.

The hairline rule between figure and provenance is load-bearing — it separates
assertion from evidence, which is the relationship being shown.

Added a mono utility face from the system stack (zero download) for figures and
provenance.

**Not yet applied to markup.** The classes ship in the CSS but components still
use their old inline stat treatment. Swapping them in is the next step.

## Still open

- [ ] **`api/rag-search.js` is broken** — needs `ANTHROPIC_API_KEY`, absent from
      `.env`. Voice mode silently degrades on every call. Either add the key or
      remove the endpoint.
- [ ] **`getSystemPrompt()` in `rag-search.js` is a stub** returning a generic
      3-line prompt. Voice mode does not use `chatbot-prompt.txt`, so the
      honesty rules do not apply to it.
- [ ] **`foto-avatar.jpg` is 400 KB** for a 192px avatar, and `index.html`
      preloads two `.webp` files that don't exist. Convert to WebP (~20 KB).
- [ ] **No real test framework.** `tests/` uses a hand-rolled runner and needs
      live Langfuse credentials. `classifyIntent` and `containsFingerprint` —
      the prompt-injection defences — have zero test coverage.
- [ ] **`tsconfig.app.json` only includes `src`**, so `tsc -b` never typechecks
      `api/` or `scripts/`. The serverless functions are unchecked JavaScript.
- [ ] Supabase FTS trigger still builds a **Spanish** tsvector alongside English.
- [ ] Verify `foliogpt.com` → `karthiksuru.dev` domain replacement landed
      everywhere in `index.html` and `articles/registry.ts`.

---

## Verified facts (source of truth)

Cross-checked against the résumé PDF, the GitHub API, and the filesystem.

- Email `karthiksuru06@gmail.com` · GitHub `karthiksuru06` · LinkedIn `suru-karthik-923766321`
- B.Tech CS, **KIET Kakinada** (cybersecurity specialization), graduating **May 2027**
- Three internships, all **RCTS, IIIT Hyderabad**: K-Hub Junior Developer
  (Aug 2024–Apr 2025), Winter Intern (Dec 2025), Summer Intern (Jun 2026)
- Foundations of ML certification, IIIT Hyderabad, 2024
- ANVAKRIT 2025 national finalist (NFSU)
- **OpenWISP: PRs under review, none merged.** A public GitHub search returns
  zero merged PRs. Do not let any number appear anywhere.

The fuller verified dataset lives in
`C:/Users/karth/OneDrive/Desktop/_Personal/portfolio/src/data/{profile,projects}.js`
with a test suite asserting it stays honest.

### Unresolved

The résumé lists **AERIS GUARD**, **AERIS Chatbot**, and **ATHENA (LLaMA 3.3
70B)** — none exist on disk or GitHub. Best guesses: ATHENA→Vysor,
AERIS GUARD→Nexus Guard, AERIS Chatbot→speech-analysis. Unconfirmed, so none
are on the site. The résumé's "1,200+ users" and "98% accuracy" claims are
likewise unsupported by anything found.

The résumé also says graduation **May 2026** and a single **Jun–Aug 2023** RCTS
internship — both contradict what's now on the site. **Fix the résumé.**
