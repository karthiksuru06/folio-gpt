# Domain résumés — RAG corpus

Each file here is a résumé tailored to one domain. They are chunked by `##`
section and embedded into Supabase so the chatbot can answer domain-specific
recruiter questions with the right emphasis.

Run `npm run rag:ingest` after editing anything here.

## Format

```markdown
---
domain: ai-engineering
label: AI Engineer
summary: One line describing who this résumé is aimed at.
---

## Summary
...

## Experience
...
```

Frontmatter keys:

| Key | Purpose |
|---|---|
| `domain` | Slug used in chunk metadata. One word, kebab-case. |
| `label` | Human-readable role name the chatbot can refer to. |
| `summary` | One line; helps retrieval match domain-level questions. |

Each `## Heading` becomes its own chunk, tagged with the domain. A question
about backend work retrieves the backend résumé's sections; a question about
computer vision retrieves the ML one.

## The one rule that matters

**Different emphasis, identical facts.**

Tailoring a résumé per domain is normal and expected — you lead with different
projects and reframe the same work for the audience. That is not the risk.

The risk is *drift*: one file says three internships, another says one; one
says graduating 2027, another 2026. Recruiters compare documents, and
inconsistency between two of your own résumés reads worse than a thin résumé.
It is the single fastest way to lose credibility, and it happens by accident
when files are edited months apart.

So: dates, employer names, university, graduation year, and metrics must be
byte-identical across every file here. Only ordering, emphasis, and which
projects you include should change.

The canonical facts are in `../../HANDOFF.md` under "Verified facts". If you
change a fact, change it there first, then propagate.

## Currently known-wrong

The PDF at `_Personal/Karthik_Suru.pdf` still says graduation **May 2026** and
a single **Jun–Aug 2023** RCTS internship. Both are wrong. Do not copy from it
until it is corrected — regenerate it from these files instead.
