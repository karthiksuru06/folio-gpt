# karthiksuru.dev

Personal portfolio — AI Engineer. React 18, Vite 7, Tailwind, Framer Motion.

```bash
npm install
cp .env.example .env    # add your Web3Forms key
npm run dev
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server on :5173 |
| `npm run build` | Production build to `dist/` |
| `npm run test` | Vitest suite |
| `npm run lint` | ESLint |
| `npm run verify` | lint → test → build (run before pushing) |

## Design notes

**Content lives in `src/data/`, not in components.** `profile.js` holds identity,
experience, education, and skills; `projects.js` holds the case studies.
Components render, data files assert. This exists because an earlier version of
this site had four different contact emails scattered across six components, one
of which was a placeholder that shipped.

**The test suite guards content integrity, not just rendering.**
`src/data/*.test.js` asserts that no placeholder addresses, unverifiable metrics,
or skill percentages can be reintroduced, and that every project defines the
fields `ProjectModal` reads — a bug that previously rendered three empty sections
in every modal. Removing a required field fails nine tests.

**Reduced motion is handled in three places, because one isn't enough.**
`@media (prefers-reduced-motion)` in `index.css` covers CSS animation;
`<MotionConfig reducedMotion="user">` in `main.jsx` covers Framer Motion's
JS-driven transforms; a `matchMedia` check in `ParticleBackground.jsx` covers
the canvas. Each layer is blind to the others.

**The canvas is capped deliberately.** Particle linking is O(n²), so the count
is bounded at 120 regardless of viewport, distances are compared squared to keep
`Math.sqrt` out of the hot loop, and the loop suspends on `visibilitychange`.

## Configuration

| Variable | Required | Notes |
|---|---|---|
| `VITE_WEB3FORMS_KEY` | For the contact form | Free key from [web3forms.com](https://web3forms.com). Public by design — it can only send to the address it was registered with. Unset, the form shows a "email me directly" fallback and the build warns. |
| `OPENROUTER_API_KEY` | For the chat panel | The panel shows an offline message until this is set. |
| `VITE_TURNSTILE_SITEKEY` / `TURNSTILE_SECRET` | No (bot check) | Cloudflare Turnstile pair. Unset, no bot check runs. |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | No (rate limits) | Without these, rate limits are per-instance memory. |

## Chat

`ChatPanel` (bottom-right) streams answers from `/api/chat`, an edge function
grounded in `chatbot-prompt.txt` (generated from `content/resumes/`). The
server owns the guardrails: `api/_shared/guard.js` sanitises input, checks
origin, rate-limits and verifies the optional Turnstile token;
`api/_shared/verify.js` fact-checks the finished answer against the resume and
replaces it with a fallback when it contains unsupported claims;
`api/_shared/questions.js` refuses prompt-extraction attempts.
`/api/health` reports which of those are configured.

## License

Code is MIT — see [LICENSE](./LICENSE). Content, copy, and résumé are not —
please don't republish them as your own.

This project began as a fresh, single-commit repository containing no code
from any other project. Out of courtesy it was inspired by
[`cv-santiago`](https://github.com/santifer/cv-santiago); no code was reused.
