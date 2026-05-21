export type CareerOpsLang = 'en'

export const careerOpsContent = {
  en: {
    slug: 'career-ops-system',
    altSlug: 'career-ops',
    readingTime: '18 min read',
    seo: {
      title: 'Career-Ops: How I Built My Own AI Job Search Tool',
      description: 'Case study: AI job search tool built as a multi-agent system. AI resume builder, multi-dimensional scoring, automated job application with HITL. 631 evaluations.',
    },
    nav: {
      breadcrumbHome: 'Home',
      breadcrumbCurrent: 'Career-Ops',
    },
    header: {
      kicker: 'Case Study: From side project to 43.8K+ stars',
      h1: 'Career-Ops: How I Built an AI Job Search System That Got Me Hired',
      subtitle: 'I built a multi-agent system to automate my job search. It worked — I am now Head of Applied AI. Then I open-sourced it and it went viral — 43.8K+ GitHub stars.',
      badge: 'Mission accomplished',
      date: 'Mar 17, 2026',
    },
    heroMetrics: [
      { value: '631', label: 'Evaluations' },
      { value: '302', label: 'Apps processed' },
      { value: '12', label: 'Modes' },
      { value: 'A-F', label: 'Grade scoring' },
      { value: '680', label: 'URLs deduped' },
    ],
    tldr: 'A multi-agent system built with Claude Code that automates the job search: scores offers multi-dimensional (A-F), generates ATS-optimized PDFs per offer, fills forms via Playwright, and batch-processes with parallel workers. HITL design: AI analyzes, I decide. Open source under MIT — 43.8K+ stars, 2,700+ on Discord.',
    manifesto: 'Companies use AI to filter candidates. I just gave candidates AI to choose companies.',
    metaCallout: 'The irony: I built a multi-agent system to search for multi-agent roles. The system demonstrated the competencies better than any interview could. And no, it is not gaming the system: Career-Ops automates analysis, not decisions.',
    closingCallback: 'The system proved what no interview could: in the AI era, what you build with AI is the resume that gets you hired.',
    internalLinks: {
      chatbot: {
        text: 'The Self-Healing Chatbot | Case Study',
        href: '/self-healing-chatbot',
      },
      jacobo: {
        text: 'AI Agent Jacobo | Case Study',
        href: '/ai-agent-jacobo',
      },
      businessOs: {
        text: 'Business OS | Case Study',
        href: '/business-os-for-airtable',
      },
      pseo: {
        text: 'Programmatic SEO | Case Study',
        href: '/programmatic-seo',
      },
    },
    sections: {
      intro: {
        hook: 'I built an AI system to search for a job. It worked — I am now Head of Applied AI. Then I published it on GitHub and it exploded: 43.8K+ stars, viral, articles in France, China, and Korea. Week one of my AI job search was all manual. By week two I had stopped applying — I was building Career-Ops.',
        body: '631 evaluations later, Career-Ops was filtering better than I was. An AI-powered job search tool built as a multi-agent system: reads job descriptions, scores them multi-dimensional, generates personalized resumes, and prepares applications. I reviewed and decided. The AI did the analytical work. The system demonstrated exactly the competencies the target roles required — and that did not go unnoticed.',
      },
      theProblem: {
        heading: 'Why Did I Need to Automate My Job Search?',
        body: 'Searching for senior AI engineering roles is a full-time job in itself. Each offer requires reading the JD, mapping your skills against requirements, adapting the CV, writing personalized responses, and filling 15-field forms. Multiply that by 10 offers per day.',
        painPoints: [
          { label: 'Repetitive reading.', detail: '70% of offers are a poor fit. You find out after reading 800 words of JD.' },
          { label: 'Generic CVs.', detail: 'A static PDF cannot highlight the proof points relevant to each specific offer.' },
          { label: 'Manual forms.', detail: 'Every platform asks the same questions in different formats. Copy-paste 15 times per application.' },
          { label: 'No tracking.', detail: 'Without a system, you forget where you applied. Duplicate effort or lose follow-up entirely.' },
          { label: 'Zero feedback.', detail: 'Apply, wait, and never know if the problem was fit, the CV, or timing.' },
          { label: 'Global market.', detail: 'The AI sector moves internationally. Local referrals do not scale when you apply to companies across 6 different countries.' },
        ],
        punchline: 'The work is not hard. It is repetitive. And repetitive work gets automated.',
      },
      architecture: {
        heading: 'How Does the Multi-Agent System Work?',
        body: 'Career-Ops is not a script or an auto-apply bot. It is a multi-agent system with 12 operational modes, each a Claude Code skill file with its own context, rules, and tools. An agent that reasons about the problem domain and executes the right action.',
        whyModes: {
          heading: 'Why Modes, Not One Prompt',
          items: [
            { label: 'Precise context.', detail: 'Each mode loads only the information it needs. auto-pipeline skips contact rules. apply skips scoring logic.' },
            { label: 'Testability.', detail: 'One mode gets tested in isolation. Changing PDF logic never touches evaluation.' },
            { label: 'Independent evolution.', detail: 'Adding a new mode never breaks existing ones. Training mode shipped 3 weeks after first deploy.' },
          ],
        },
        modes: [
          { name: 'auto-pipeline', desc: 'Full pipeline: extract JD, evaluate A-F, generate report, PDF, and tracker entry.' },
          { name: 'oferta', desc: 'Single-offer evaluation with 6 blocks: summary, CV match, level, compensation, personalization, interview.' },
          { name: 'ofertas', desc: 'Multi-offer comparison and ranking.' },
          { name: 'pdf', desc: 'ATS-optimized PDF personalized per offer with proof points and keywords.' },
          { name: 'pipeline', desc: 'Batch URL processing from inbox.' },
          { name: 'scan', desc: 'Offer discovery: navigates job boards and careers pages of target companies. Many offers never appear on aggregators.' },
          { name: 'batch', desc: 'Parallel processing with conductor + workers. 122 simultaneous URLs in queue.' },
          { name: 'apply', desc: 'Interactive form-filling with Playwright. Reads the page, retrieves cached evaluation, generates responses.' },
          { name: 'contacto', desc: 'LinkedIn outreach helper.' },
          { name: 'deep', desc: 'Deep company research.' },
          { name: 'tracker', desc: 'Application status dashboard.' },
          { name: 'training', desc: 'Evaluates courses and certifications against the North Star.' },
        ],
      },
      scoring: {
        heading: 'How Does Career-Ops Evaluate Each Job Offer?',
        // HISTORIC: pre-launch private rubric had 10 sub-axes. Public tool consolidated to 6 categorical dimensions on April 4, 2026 — see career-ops.org/methodology for current canonical.
        body: 'My private pre-launch rubric had 10 weighted sub-axes (shown in the table). When I open-sourced career-ops on April 4, 2026, I consolidated these into **6 categorical dimensions** for the public tool. This page documents the framework I used to evaluate 631 offers in March 2026 — the canonical current rubric lives at [career-ops.org/methodology](https://career-ops.org/methodology). Output is always a numeric score (1-5) and an A-F grade.',
        dimensions: {
          headers: ['Sub-axis (private rubric)', 'What It Measured', 'Weight'],
          rows: [
            ['Role Match', 'Alignment between requirements and CV proof points', 'Gate-pass'],
            ['Skills Alignment', 'Tech stack overlap', 'Gate-pass'],
            ['Seniority', 'Stretch level and negotiability', 'High'],
            ['Compensation', 'Market rate vs target', 'High'],
            ['Geographic', 'Remote/hybrid/onsite feasibility', 'Medium'],
            ['Company Stage', 'Startup/growth/enterprise fit', 'Medium'],
            ['Product-Market Fit', 'Problem domain resonance', 'Medium'],
            ['Growth Trajectory', 'Career ladder visibility', 'Medium'],
            ['Interview Likelihood', 'Callback probability', 'High'],
            ['Timeline', 'Closing speed and hiring urgency', 'Low'],
          ],
        },
        distribution: {
          heading: 'Score Distribution',
          items: [
            { value: '21', label: 'Score >= 4.5 (A)' },
            { value: '52', label: 'Score 4.0-4.4 (B)' },
            { value: '71', label: 'Score 3.0-3.9 (C)' },
            { value: '51', label: 'Score < 3.0 (D-F)' },
          ],
        },
        callout: '74% of evaluated offers score below 4.0. Without the system, I would have spent hours reading JDs that never fit.',
      },
      pipeline: {
        heading: 'What Happens From URL Input to Generated Resume?',
        body: 'auto-pipeline is the flagship mode. A URL goes in, and out comes an evaluation report, a personalized PDF, and a tracker entry. Zero manual intervention until final review.',
        steps: [
          { label: 'Extract JD.', detail: 'Playwright navigates to the URL, extracts structured content from the offer.' },
          { label: 'Evaluate A-F.', detail: 'Claude reads JD + CV + portfolio and generates multi-dimensional scoring with grade.' },
          { label: 'Generate report.', detail: 'Markdown with 6 blocks: executive summary, CV match, level, compensation, personalization, and interview probability.' },
          { label: 'Generate PDF.', detail: 'HTML template + keyword injection + adaptive framing. Puppeteer renders to PDF.' },
          { label: 'Register tracker.', detail: 'TSV with company, role, score, grade, URL. Auto-merge via Node.js script.' },
          { label: 'Dedup.', detail: 'Checks scan-history.tsv (680 URLs) and applications.md. Zero re-evaluations.' },
        ],
        batch: {
          heading: 'Batch Processing',
          body: 'For high volume, batch mode launches a conductor that orchestrates parallel workers. Each worker is an independent Claude Code process with 200K context. The conductor manages the queue, tracks progress, and merges results.',
          metrics: [
            { value: '122', label: 'URLs in queue' },
            { value: '200K', label: 'Context/worker' },
            { value: '2x', label: 'Retries per failure' },
          ],
          details: 'Fault-tolerant: a worker failure never blocks the rest. Lock file prevents double execution. Batch is resumable — reads state and skips completed items.',
        },
      },
      pdf: {
        heading: 'How Does Career-Ops Generate a Personalized Resume?',
        body: 'A generic CV loses. Career-Ops works as an AI resume builder that generates a different ATS-optimized resume for each offer, injecting JD keywords and reordering experience by relevance. Not a template: a resume built from real CV proof points.',
        steps: [
          { label: 'Extract 15-20 keywords from the JD.', detail: 'Keywords land in the summary, first bullet of each role, and skills section.' },
          { label: 'Detect language.', detail: 'English JD generates English CV. Spanish JD generates Spanish CV.' },
          { label: 'Detect region.', detail: 'US company generates Letter format. Europe generates A4.' },
          { label: 'Detect archetype.', detail: '6 North Star archetypes. The summary shifts based on the profile.' },
          { label: 'Select projects.', detail: 'Top 3-4 by relevance. Jacobo for agent roles. Business OS for ERP/automation.' },
          { label: 'Reorder bullets.', detail: 'The most relevant experience moves up. The rest moves down — nothing disappears.' },
          { label: 'Render PDF.', detail: 'Puppeteer converts HTML to PDF. Self-hosted fonts, single-column ATS-safe.' },
        ],
        archetypes: {
          heading: '6 Archetypes',
          headers: ['Archetype', 'Primary Proof Point'],
          rows: [
            ['AI Platform / LLMOps', 'Self-Healing Chatbot (71 evals, closed-loop)', '/self-healing-chatbot'],
            ['Agentic Workflows', 'Jacobo (4 agents, 80h/mo automated)', '/ai-agent-jacobo'],
            ['Technical AI PM', 'Business OS (2,100 fields, 50 automations)', '/business-os-for-airtable'],
            ['AI Solutions Architect', 'pSEO (4,730 pages, 10.8x traffic)', '/programmatic-seo'],
            ['AI FDE', 'Jacobo (sold, running in production)', '/ai-agent-jacobo'],
            ['AI Transformation Lead', 'Exit 2025 (16 years, buyer kept all systems)', ''],
          ],
        },
        callout: 'Same CV. 6 different framings. All real — keywords get reformulated, never fabricated.',
      },
      beforeAfter: {
        heading: 'Before and After',
        headers: ['Dimension', 'Manual', 'Career-Ops'],
        rows: [
          ['Evaluation', 'Read JD, mental mapping', 'A-F automated scoring, multi-dimensional'],
          ['CV', 'Generic PDF', 'Personalized PDF, ATS-optimized'],
          ['Application', 'Manual form', 'Playwright auto-fill'],
          ['Tracking', 'Spreadsheet or nothing', 'TSV + automated dedup'],
          ['Discovery', 'LinkedIn alerts', 'Scanner: job boards + target company careers pages'],
          ['Batch', 'One at a time', '122 URLs in parallel'],
          ['Dedup', 'Human memory', '680 URLs deduplicated'],
        ],
      },
      results: {
        heading: 'What Results Has Career-Ops Achieved?',
        body: 'The most important result: I got the job. I am now Head of Applied AI. Career-Ops evaluated 631 offers, generated 354 personalized PDFs, and filtered the noise so I could focus on the opportunities that truly fit.',
        metrics: [
          { value: '631', label: 'Reports generated' },
          { value: '40.1K+', label: 'GitHub stars' },
          { value: '354', label: 'PDFs generated' },
          { value: '2,600+', label: 'Upvotes r/ClaudeAI' },
        ],
        aftermath: {
          heading: 'What Happened Next?',
          // HISTORIC: numbers below are week-1 viral snapshot — do not auto-update with current totals.
          body: 'When I no longer needed Career-Ops, I published it on GitHub. In one week it went from private repo to viral — 35K stars, 5K forks, and articles in blogs from France, China, and Korea by people who had never heard of me. Today it has crossed 40K stars and a community of 2K+ people on Discord helps each other configure and adapt the system. The project ended up demonstrating more competencies than any hiring process could.',
          highlights: [
            { value: '35K+', label: 'GitHub stars in 1 week' },
            { value: '5K+', label: 'Forks' },
            { value: '4', label: 'Languages (EN, FR, ZH, KO)' },
            { value: '6', label: 'Countries with coverage' },
          ],
        },
      },
      stack: {
        heading: 'Stack',
        items: [
          { name: 'Claude Code', role: 'LLM agent: reasoning, evaluation, content generation' },
          { name: 'Playwright', role: 'Browser automation: portal scanning and form-filling' },
          { name: 'Puppeteer', role: 'PDF rendering from HTML templates' },
          { name: 'Node.js', role: 'Utility scripts: merge-tracker, cv-sync-check, generate-pdf' },
          { name: 'tmux', role: 'Parallel sessions: conductor + workers in batch' },
        ],
      },
      lessons: {
        heading: 'Lessons',
        items: [
          {
            title: 'Automate analysis, not decisions',
            detail: 'Career-Ops evaluates 631 offers. I decide which ones get my time. HITL is not a limitation — it is the design. AI filters noise, humans provide judgment.',
          },
          {
            title: 'Modes beat a long prompt',
            detail: '12 modes with precise context outperform a 10,000-token system prompt. Each mode loads only what it needs. Less context means better decisions.',
          },
          {
            title: 'Dedup is more valuable than scoring',
            detail: '680 deduplicated URLs mean 680 evaluations I never had to repeat. Dedup saves more time than any scoring optimization.',
          },
          {
            title: 'A CV is an argument, not a document',
            detail: 'A generic PDF convinces nobody. A CV that reorganizes proof points by relevance, injects the right keywords, and adapts framing to the archetype — that CV converts.',
          },
          {
            title: 'Batch over sequential, always',
            detail: 'Batch mode with parallel workers processes 122 URLs while I do something else. The investment in parallel orchestration pays off on the first run.',
          },
          {
            title: 'The system IS the portfolio',
            detail: 'Building a multi-agent system to search for multi-agent roles is the most direct proof of competence. I do not need to explain that I can do this — I am using it.',
          },
          {
            title: 'Open-source it when you no longer need it',
            detail: 'Career-Ops was private while I was using it. When I got the job, I published it. One week later it had 43.8K stars. The lesson: the best time to open-source a project is when it has already proven its value in real production.',
          },
          {
            title: 'Why I keep it MIT',
            detail: 'MIT license. No dark patterns, no upsell inside the CLI, no feature gating. If it works for you, it works. If you want to support the maintenance or join the community, you can. But the tool does not depend on it.',
          },
        ],
      },
      cta: {
        sidebarLabel: 'Try it',
        heading: 'Your turn',
        body: 'Career-Ops is open source under MIT. Clone it, fork it, adapt it — it is yours.',
        ctaLabel: 'Try career-ops',
        ctaHref: 'https://career-ops.org?utm_source=foliogpt.com&utm_medium=case-study&utm_campaign=career-ops-deep-dive',
        ctaSecondaryLabel: 'View source on GitHub',
        ctaSecondaryHref: 'https://github.com/karthiksuru06/career-ops',
        communityHeading: 'Got questions? Ask the community',
        communityBody: '2,700+ builders already use Career-Ops and share tips, templates, and setups on Discord.',
        communityLabel: 'Join Discord',
        communityHref: 'https://discord.gg/8pRpHETxa4',
      },
    },
    faq: {
      heading: 'FAQ',
      items: [
        {
          q: 'Is this gaming the system?',
          a: 'Career-Ops automates analysis, not decisions. Real funnel from my March 2026 search: 631 listings evaluated → 66 applications sent → 12 interview processes → 1 offer signed (Head of Applied AI). The system discarded the 565 that did not fit; the 66 that did, I read one by one before applying and reviewed every PDF before sending. Same philosophy as a CRM or an IDE: the system organizes, the human decides.',
        },
        {
          q: 'Why Claude Code and not a script pipeline?',
          a: 'A script cannot reason. Career-Ops adapts scoring based on company context (size, stack mentioned in the JD, AI maturity signals), reformulates CV keywords for each offer without fabricating experience, and generates narrative reports with inline justification instead of tables with filled cells. The logic of each of the 12 modes lives in its own Claude Code skill file with isolated context and rules; adding a new mode does not require rewriting the rest of the pipeline.',
        },
        {
          q: 'What does it cost to run?',
          a: 'Zero marginal cost per evaluation. Career-Ops runs on my Claude Max 20x plan ($200/mo), which I use for everything: portfolio foliogpt.com, LLMOps chatbot, blog articles, Life OS, and Career-Ops. 631 listing evaluations + 354 ATS-optimized PDFs generated without a single extra invoice. With Claude Pro ($20/mo) it also works for lower volume — the real limit is the plan usage window, not per-call cost.',
        },
        {
          q: 'Does the apply mode fill forms automatically?',
          a: 'It reads the page with Playwright, retrieves the cached evaluation, and generates coherent responses matching the scoring. I review before submitting — always.',
        },
        {
          q: 'What happens when the scanner finds a duplicate?',
          a: 'scan-history.tsv stores 680 seen URLs. Dedup by exact URL match plus normalized company+role match against applications.md. Zero re-evaluations.',
        },
        {
          q: 'Is it replicable?',
          a: 'Yes — it is open source. The official landing is career-ops.org (docs, AI chat and guides) and the code lives at github.com/karthiksuru06/career-ops. Requires Claude Code with Playwright access. Skill files define the logic for each mode. 37K+ people have already seen, forked, or adapted it.',
        },
        {
          q: 'How do I use Career-Ops?',
          a: 'Career-Ops is a local tool that runs from your terminal with Claude Code. Clone the repository, configure your resume and preferences, and launch modes as needed: auto-pipeline to evaluate an offer end-to-end, scan to discover offers on job boards, batch to process many URLs in parallel, or pdf to generate a personalized resume. Everything runs on your machine — your resume and personal data never leave your computer. If you need help, a community of 1,000+ people is on Discord: discord.gg/8pRpHETxa4',
        },
        {
          q: 'What do I need to run Career-Ops?',
          a: 'Claude Code with a plan that includes tool access (Claude Max or Claude Pro). Playwright for web navigation. Node.js for utility scripts like tracker merging and PDF generation with Puppeteer. A working directory with your resume in markdown and your search preferences. No servers, databases, or external APIs needed — everything runs locally. The Discord community (discord.gg/8pRpHETxa4) can help with setup.',
        },
        {
          q: 'What kind of AI does Career-Ops use?',
          a: 'Career-Ops is not a chatbot or an API wrapper. It is a multi-agent system where Claude Code acts as the brain: it reasons about each offer, evaluates fit against your profile multi-dimensional (canonical rubric at career-ops.org/methodology), and makes filtering decisions. Each of the 12 modes is a skill file with its own context and rules. Web navigation uses Playwright. PDFs use Puppeteer. Batch processing launches parallel workers in tmux. No fine-tuning or custom models — standard Claude with very precise context.',
        },
        {
          q: 'Who created Career-Ops?',
          a: 'I did — Karthik Suru (foliogpt). I built it for my own AI job search after spending 16 years founding and selling a phone repair business. The system evaluated 631 offers and helped me land my current role as Head of Applied AI. When I no longer needed it, I published it as open source. In one week it reached 43.8K+ GitHub stars. The Discord community is now 2,700+ people: discord.gg/8pRpHETxa4',
        },
      ],
    },
  },
} as const
