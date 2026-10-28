# Portfolio — Development & Handoff

Working notes for `karthik-suru-portfolio`. Covers what changed, why, what's
verified, and what still needs your input.

**Last updated:** 2026-07-20
**Build status:** ✅ `npm run build` passes (408 KB JS / 125 KB gzipped)

---

## 🔴 Act on these first (not portfolio work)

### 1. Leaked Hugging Face write token — rotate immediately

A write-scoped HF token sits in plaintext in a git remote URL:

```
C:\Users\karth\OneDrive\Desktop\_ClonedRepos\soai2025-karthiksuru-project\.git\config
origin  https://karthiksuru:hf_TSKB***@huggingface.co/spaces/karthiksuru/desi-proverb-collector
```

That folder is inside **OneDrive**, so the token is synced to the cloud and
travels with any share of the directory. Anyone holding it can push to, modify,
or delete your Spaces and models.

**Fix:**
1. Revoke `hf_TSKB…` at https://huggingface.co/settings/tokens
2. Create a replacement
3. `huggingface-cli login` instead of embedding it in a URL
4. Rewrite the remote:
   `git remote set-url origin https://huggingface.co/spaces/karthiksuru/desi-proverb-collector`

### 2. Check `google-services.json` isn't committed

`_Projects/team8.1/2025YearlyProject-Team8/google-services.json` contains
Firebase Android config and is **not** in `.gitignore`. Verify it never reached
the public `insta-aid` repo:

```bash
git -C "path/to/2025YearlyProject-Team8" log --all --oneline -- google-services.json
```

If it did, rotate the Firebase keys — history rewriting alone doesn't help once
something is public.

Other live `.env` files on disk worth auditing: `_ClonedRepos/htp-test/.env`,
`_Projects/team8.1/2025YearlyProject-Team8/.env`,
`_Projects/team8.1/frontend/.env.local`.

---

## Setup

```bash
npm install
cp .env.example .env    # then paste your Web3Forms key
npm run dev             # http://localhost:5173
npm run build           # production build into dist/
```

### Required config

| Variable | Where to get it | What breaks without it |
|---|---|---|
| `VITE_WEB3FORMS_KEY` | https://web3forms.com — enter `karthiksuru06@gmail.com`, key arrives by email | Contact form shows "please email me directly" instead of sending |

The Web3Forms key is safe to commit and safe to expose in the bundle; it only
permits sending to the address it was registered with.

---

## What this rewrite was fixing

The site as inherited had a credibility problem, not a design problem. The
visual language was good and has been preserved. The content was substantially
invented.

### Bugs fixed

| Issue | Location | Status |
|---|---|---|
| Modal rendered 3 permanently empty sections — `project.problem` / `.solution` / `.impact` were read but never existed in the data | `ProjectModal.jsx` ← `Projects.jsx` | ✅ Fixed; sections now self-hide when empty |
| Every GitHub/LinkedIn link 404'd (`karthiksuru` vs real `karthiksuru06`) | `Contact.jsx`, `Footer.jsx` | ✅ Fixed |
| Email was `karthik.suru@example.com` | `Contact.jsx:9`, `Footer.jsx:34,101` | ✅ Fixed |
| `/resume.pdf` didn't exist — Hero download 404'd | `public/` | ✅ Résumé copied in |
| Contact form was a 1500 ms `setTimeout` that always claimed success; messages were silently discarded | `Contact.jsx:22` | ✅ Real Web3Forms POST with visible error states |
| Footer read "CRAFTED WITH ❤️ BY AI" | `Footer.jsx:117` | ✅ Removed |
| `*:focus { outline }` applied to every element on mouse click | `index.css:246` | ✅ Now `:focus-visible` only |
| Scroll spy did uncached layout reads on every scroll event | `Navbar.jsx:23` | ✅ rAF-throttled, passive listeners |
| Modal had no Escape key, no focus management, no scroll lock | `ProjectModal.jsx` | ✅ All three added |
| Project cards opened a dialog but weren't keyboard reachable | `Projects.jsx` | ✅ `role="button"`, `tabIndex`, Enter/Space |

### Fabricated content removed

Verified against the résumé, GitHub API, and a full Desktop scan:

- **"9+ merged PRs to OpenWISP"** — `author:karthiksuru06 org:openwisp type:pr`
  returns **zero results**. Also removed the invented PR numbers **#312 / #298 /
  #276** and "Architected GSoC 2025 roadmap". Reframed as *contributor with PRs
  in review*, which is what you confirmed is true.
- **"500+ students mentored" / "5+ hackathons" / "2+ years experience"** — no
  supporting evidence found.
- **Three projects that don't exist anywhere** — `SecureChat`, `CryptoVault`,
  `ThreatHunter`. Deleted.
- **Fake skill percentages** (Digital Forensics 90%, Threat Intel 85%, …) —
  removed entirely, per your brief. Replaced with honest tiers.
- **Wrong RCTS dates** — site claimed "Winter Research Intern, Dec 2024 –
  Present". Corrected to your three actual internships.
- **Cybersecurity positioning** — the site claimed expertise in Nmap, Metasploit,
  Ghidra, Volatility, YARA, Splunk, SIEM/SOAR, pentesting. None appear in your
  stated skill set. Repositioned to AI Engineer.

---

## Verified facts (source of truth)

Everything below traces to your résumé, the GitHub API, or files on disk.
All of it lives in **`src/data/profile.js`** — one file, so it can't drift
out of sync across components again.

| Field | Value | Source |
|---|---|---|
| Email | `karthiksuru06@gmail.com` | Résumé |
| GitHub | `github.com/karthiksuru06` ("Suru Karthik", 37 public repos, company `@RCTS-K-Hub`) | GitHub API |
| LinkedIn | `linkedin.com/in/suru-karthik-923766321` | Résumé + GitHub profile |
| Location | Visakhapatnam, Andhra Pradesh | Résumé |
| Degree | B.Tech CS, KIET Kakinada (cybersecurity specialization) | Résumé |
| Graduation | **May 2027** | Confirmed by you — **résumé says May 2026 and is wrong** |
| Internships | 3 × RCTS, IIIT Hyderabad | Confirmed by you |
| Certification | Foundations of ML, IIIT Hyderabad, 2024 | Confirmed by you |
| Award | ANVAKRIT 2025 Finalist, NFSU national CSI competition | Résumé |

### ⚠️ Your résumé contradicts the site — fix the résumé

The PDF in `public/resume.pdf` still says:
- Graduation **May 2026** (should be **May 2027**)
- RCTS as a single **Jun–Aug 2023** internship (should be three: K-Hub Junior
  Developer Aug 2024–Apr 2025, Winter Dec 2025, Summer Jun 2026)

A recruiter with both open will notice. **The site is now correct; the PDF is
not.** Regenerate it before applying anywhere.

### Unresolved: the résumé's three projects

**AERIS GUARD**, **AERIS Sentiment Chatbot**, and **LLaMA 3.3 70B → ATHENA**
appear on your résumé but **nowhere on disk or GitHub**. You indicated these are
renames of existing projects but didn't supply the mapping.

Best guesses from the scan — **confirm before using either document**:

| Résumé name | Likely actual project | Why |
|---|---|---|
| ATHENA (LLaMA 3.3 70B, React + Electron, cross-platform AI assistant) | **Vysor / VysionAI** | Electron shell, local Ollama LLM, cross-platform — matches closely |
| AERIS GUARD (threat patterns, NLP, TF-IDF, entity extraction) | **Nexus Guard** | OSINT scraping with NLP entity detection and risk scoring; name matches |
| AERIS Chatbot (real-time sentiment, speech recognition) | **speech-analysis** | Real-time Whisper STT + TTS |

The résumé also claims "deployed to 1,200+ users" and "98% accuracy" for these.
**I have not put those numbers on the site** because nothing on disk supports
them. If they're real, keep them; if they came from an earlier AI pass, remove
them from the résumé too — a "1,200+ users" claim invites exactly one follow-up
question in an interview.

---

## Architecture

```
src/
├── data/
│   ├── profile.js      ← identity, experience, education, skills, chains, roadmap
│   └── projects.js     ← project case studies
├── components/
│   ├── Navbar.jsx      scroll spy, mobile drawer, résumé CTA
│   ├── Hero.jsx        name, positioning, 3 verifiable stats
│   ├── About.jsx       terminal-styled bio + now.json
│   ├── Skills.jsx      6 bento groups + 4 technology chains
│   ├── Projects.jsx    tilt cards → modal
│   ├── ProjectModal.jsx  problem/solution/architecture/features/challenges/stack/outcome
│   ├── Experience.jsx  scroll-driven timeline
│   ├── Education.jsx   [NEW] education + achievements
│   ├── Learning.jsx    [NEW] roadmap + engineering philosophy
│   ├── Contact.jsx     Web3Forms + socials
│   └── Footer.jsx
└── index.css           design tokens, glass/bento utilities, a11y
```

**Design rule:** components render, `data/` holds facts. Any new claim goes in
`data/`, never inline in a component. This is what prevents the drift that
produced four different contact emails across the old codebase.

### Preserved from the original design

Aurora background, bento grid, glassmorphism, cyan/green/purple/pink accents,
JetBrains Mono + Inter pairing, particle field, tilt cards, scroll-driven
timeline, terminal chrome. The look is intact — the words changed.

### Skill tiers replaced percentages

`core` (used daily) / `working` (shipped real work) / `familiar` (still building
depth), rendered as three dots. Nobody technical believes "Python 95%", and your
brief explicitly ruled it out.

---

## Featured projects (9)

All descriptions written from actual source inspection.

| Project | Repo | Live |
|---|---|---|
| **Yukthi** — governed AI growth engine, 381 files, FastAPI/pgvector/Celery/TEI | `yukthi-mvp` | — |
| **BTech Mentor AI** — Qwen2.5-3B + QLoRA → GGUF → Ollama, ChromaDB RAG, fully offline | `btech-mentor-ai` | — |
| **HTP Test Analyzer** — YOLOv11 + FAISS RAG + Gemini 1.5 Pro | `RCTS-K-Hub/2025-WI-T7` | — |
| **Compliance OS** — 499 files, RRF hybrid retrieval, 8-agent copilot | ⚠️ no repo | — |
| **Real-Time Speech Platform** — Whisper + WebSockets + Edge-TTS | `speech-analysis` | — |
| **Neural Style Studio** — VGG19 + AdaIN, EfficientNet-B3 (60.1%, 24 classes) | `art-style-transfer` | — |
| **TME-MIRNet-v2** — ConvLSTM + illumination attention, IEEE draft | `Mirnet` | — |
| **Veritas** — MERN + Cloud Vision OCR | `veritas` | ✅ Vercel |
| **Instaaid** — Expo/RN safety app, custom native shake module | `insta-aid` | ✅ Vercel + Render |

**BTech Mentor AI was the find of this pass.** QLoRA fine-tune → GGUF quantisation
→ local Ollama serving → ChromaDB RAG is the single strongest AI-engineering
signal you have — it's full LLM-lifecycle ownership, which is exactly what
"AI Engineer" roles screen for. It wasn't on your résumé or the old site.

### Deliberately excluded

- **MentorLink** — `Hero.jsx`, `About.jsx`, `Contact.jsx`, `CTASection.jsx`,
  `Feedback.jsx`, `WhyMentorLink.jsx`, `pages/Landing.jsx` are all **0 bytes**.
  It's an empty scaffold. Shipping it would hurt you.
- **nids-ml** — authored by **Saheel Yadav**, cloned. Not yours.
- **Silent-FAS-2**, **open design**, **Wan2.1** — upstream repos. Your
  `jpmc_marketing_agent.py` on top of Wan2.1 is fair to claim; the repo is not.
- **mahadev marine**, **jute-narrative-flow** — collaborator-owned repos.

### ❌ The EC2 deployment does not exist

You mentioned an EC2 link for HTP. A full Desktop scan for `ec2-*`,
`compute.amazonaws.com`, and `elasticbeanstalk` returned **zero** hits.
`htp-test` has no deployed URL — everything is `localhost` and Docker service
names. The only `amazonaws.com` strings on disk are documentation placeholders.

Your **real** deployments are Vercel and Render (Instaaid) and Vercel (Veritas).
If an EC2 instance exists, it's not referenced anywhere in your local code —
send me the URL and I'll add it.

---

## TODO

### Blocking — do before sharing the site

- [ ] **Rotate the Hugging Face token** (see top)
- [ ] **Get a Web3Forms key** and set `VITE_WEB3FORMS_KEY`, or the form tells
      visitors to email you instead
- [ ] **Regenerate the résumé PDF** with 2027 graduation and three internships,
      then replace `public/resume.pdf`
- [ ] **Confirm the AERIS/ATHENA → real project mapping** above
- [ ] Replace `https://karthiksuru.dev/` in `index.html` (canonical + OG) with
      your real domain once you have one

### High leverage — bigger payoff than more site polish

- [ ] **Add descriptions to your GitHub repos.** All 37 have none and 0 stars.
      Recruiters click through from the portfolio and land on a wall of
      untitled repos. Start with the 9 featured above.
- [ ] **Write READMEs** for the 9 featured projects — the case-study text in
      `src/data/projects.js` is already written and can be pasted straight in.
- [ ] **`git init` and push the untracked projects.** Compliance OS (499 files),
      Vysor (132), sam (98) and cyber have **no git history at all**. Compliance
      OS is your second-largest system and currently has no link a recruiter can
      open.
- [ ] Several `_Projects` repos share a squashed `2026-07-10 "Initial commit"`,
      so commit history won't demonstrate effort there. Nothing to fix
      retroactively — just worth knowing.

### Nice to have

- [ ] Create `public/og-image.png` (1200×630) — social previews are referenced
      in `index.html` but the file doesn't exist yet
- [ ] Project screenshots in the modals — currently text-only
- [ ] Lighthouse pass; `ParticleBackground.jsx` is the likely CPU cost
- [ ] Code-split Framer Motion if the 408 KB bundle matters
- [ ] `npx update-browserslist-db@latest` (build warns, harmless)

---

## Recruiter review

Reviewed as a hiring manager would, after the changes.

**Strong**
- Verifiable specifics throughout — three internships at a named institution,
  a national competition finalist placing, a real ML certification
- Genuine range: LLM fine-tuning, RAG, computer vision, backend, mobile —
  unusually broad for a pre-graduation candidate
- Project case studies discuss constraints and failures, not just features.
  The RRF-over-pure-vector explanation and the 147 MB APK hosting problem both
  read as someone who has actually shipped
- Live, clickable demos
- Skills section shows composition rather than a badge wall

**Weak — and mostly not fixable by editing this site**
- **GitHub is the weakest link.** 37 repos, no descriptions, 0 stars. The
  portfolio now sets an expectation the profile undercuts. Fix this first.
- **No merged open-source contributions.** PRs in review is honest but thin.
  One merged PR anywhere real is worth more than the whole OpenWISP paragraph.
- **Your biggest projects aren't in version control.** "499 files, no repo" is
  a hard sell.
- **Little collaborative evidence.** Nearly everything is solo. Product
  companies screen for working in a team; Instaaid is the main counter-example.
- **Squashed commit history** on many repos hides development effort.
- **No writing.** A short post on the QLoRA→GGUF→Ollama pipeline or the hybrid
  retrieval design would differentiate more than anything left on this site.

**Bluntly:** the portfolio is now stronger than the GitHub profile behind it.
That gap is the highest-value thing you can close this week, and it's a few
hours of writing descriptions and READMEs.

---

## Review findings (security + architecture pass)

Two independent reviews were run against this codebase. Both are resolved.

### Security review — no CRITICAL or HIGH findings

- **0 npm vulnerabilities** after upgrading to Vite 7 (was 5, incl. 3 high)
- No secrets in source; `.gitignore` correctly covers `.env`
- No XSS sinks — zero `dangerouslySetInnerHTML`, `eval`, or `innerHTML`
- All 13 `target="_blank"` links carry `rel="noopener noreferrer"`

| Finding | Status |
|---|---|
| MEDIUM — contact form had no spam protection; a scripted flood could exhaust the free-tier quota and cause **genuine recruiter mail to bounce** | ✅ Honeypot + `maxLength` caps added |
| MEDIUM — build silently produced a non-functional form when the key was unset (Vite dead-code-eliminates the whole `fetch` path) | ✅ Build now warns loudly |
| MEDIUM — no Content Security Policy | ⬜ Deferred; needs hosting config, see TODO |
| LOW — `href` values unvalidated | ⬜ Theoretical only; all values are author-controlled static data |
| INFO — résumé PDF is public and unauthenticated | ⚠️ **Check it** — résumés often carry a phone number and home address, permanently indexable |

### Architecture review — 2 CRITICAL, both real

| Finding | Status |
|---|---|
| CRITICAL — **the reduced-motion feature did not work.** A comment I wrote claimed Framer Motion honoured the OS setting; it does not without `<MotionConfig reducedMotion="user">`. Every stagger, hover-scale, and 3D tilt still played at full motion. | ✅ Fixed in `main.jsx`; the false comment corrected |
| CRITICAL — **keyboard users could not open project links.** `keydown` bubbled from inner anchors to the card's `role="button"` handler, which called `preventDefault()` and opened the modal instead of following the link. | ✅ Fixed with a `e.target !== e.currentTarget` guard |
| HIGH — modal moved focus in but never trapped it; Shift+Tab escaped to controls hidden behind the backdrop | ✅ Full trap + `aria-hidden` on `#app-shell` + focus restore on close |
| HIGH — icon-only project links had no accessible name | ✅ `aria-label` added |
| HIGH — Education section was unreachable from the nav | ✅ Added to `navLinks` |
| HIGH — no `lint`/`test` scripts in `package.json` | ✅ Added, plus `verify` |
| MEDIUM — section-header markup duplicated across 6 components | ⬜ Worth extracting to `<SectionHeader />` |
| MEDIUM — `text-gray-500` on `#050505` is ≈4.2:1, below WCAG AA's 4.5:1. Used 47× | ⬜ **Open** — bump to `gray-400` |
| MEDIUM — mobile nav drawer lacks the Escape/focus handling the modal has | ⬜ Open |

## Ground rules for future edits

1. **Facts live in `src/data/`.** Never inline a claim in a component.
2. **If it can't be cited, it doesn't ship.** No metric without a benchmark,
   no count without a link. Specific-but-unverifiable is worse than vague-but-true.
3. **Don't reintroduce percentages.**
4. **Failure states must be visible.** The contact form previously faked success;
   anything that can fail now says so.
5. **Preserve the aesthetic.** Dark, neon-accented, glass, mono+sans. Improve
   clarity and depth, don't restyle.
