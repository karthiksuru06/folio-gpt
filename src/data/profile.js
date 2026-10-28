/**
 * Single source of truth for every factual claim on this site.
 *
 * Rule: nothing goes in this file that can't be backed by the resume,
 * a public repo, or a verifiable link. If a number can't be cited, it
 * doesn't belong here — vague-but-true beats specific-but-unverifiable.
 */

export const identity = {
  name: 'Karthik Suru',
  first: 'KARTHIK',
  last: 'SURU',
  role: 'AI Engineer',
  tagline: 'Full Stack AI · Backend Python · Applied ML',
  location: 'Visakhapatnam, Andhra Pradesh, India',
  timezone: 'IST (UTC+5:30)',
  email: 'karthiksuru06@gmail.com',
  github: 'https://github.com/karthiksuru06',
  githubHandle: '@karthiksuru06',
  linkedin: 'https://www.linkedin.com/in/suru-karthik-923766321/',
  linkedinHandle: 'suru-karthik',
  resume: '/resume.pdf',
}

export const availability = {
  open: true,
  headline: 'Open to AI / Backend Engineering roles',
  detail:
    'Final-year CS student graduating May 2027. Looking for AI Engineering, Applied ML, and Backend Python internships and new-grad roles.',
}

export const education = [
  {
    degree: 'B.Tech, Computer Science',
    specialization: 'Cybersecurity specialization',
    institution: 'KIET Group of Institutions, Kakinada',
    period: 'Sep 2021 — May 2027',
    status: 'current',
    detail:
      'Core coursework in data structures, algorithms, operating systems, computer networks, DBMS, and applied cryptography.',
  },
  {
    degree: 'Foundations of Machine Learning',
    specialization: 'Certification programme',
    institution: 'IIIT Hyderabad',
    period: '2024',
    status: 'completed',
    detail:
      'Formal grounding in supervised and unsupervised learning, model evaluation, and the mathematics underpinning modern ML.',
  },
]

export const experience = [
  {
    type: 'internship',
    title: 'Summer Research Intern',
    organization: 'RCTS, IIIT Hyderabad',
    period: 'Jun 2026',
    color: '#00f3ff',
    description:
      'Third engagement with the Raj Reddy Center for Technology & Society, building on prior work in applied ML for social-impact research.',
    highlights: [
      'Extended machine learning pipelines for predictive analytics on social-impact datasets',
      'Built and integrated API interfaces for real-time data processing and analysis',
      'Worked alongside senior researchers on evaluation methodology and result reproducibility',
    ],
  },
  {
    type: 'internship',
    title: 'Winter Research Intern',
    organization: 'RCTS, IIIT Hyderabad',
    period: 'Dec 2025',
    color: '#0aff60',
    description:
      'Month-long intensive focused on applied machine learning and data pipeline engineering for ongoing research projects.',
    highlights: [
      'Developed ML models for predictive analytics within active research workstreams',
      'Implemented data processing pipelines to support downstream analysis',
      'Delivered a scoped research contribution within a fixed one-month window',
    ],
  },
  {
    type: 'engineering',
    title: 'Junior Developer',
    organization: 'K-Hub, RCTS — IIIT Hyderabad',
    period: 'Aug 2024 — Apr 2025',
    color: '#8b5cf6',
    description:
      'Nine-month engineering role at K-Hub, the technology and outreach arm of RCTS, working across the AI development lifecycle from model to interface.',
    highlights: [
      'Built machine learning models for predictive analytics in social-impact projects',
      'Integrated API interfaces enabling real-time data processing and analysis',
      'Contributed across the full AI development lifecycle — data, modelling, and delivery',
      'Collaborated with researchers and fellow developers in a multi-team environment',
    ],
  },
  {
    type: 'open source',
    title: 'Contributor',
    organization: 'OpenWISP',
    period: '2025 — Present',
    color: '#ff006e',
    description:
      'Working within the OpenWISP community on the Firmware Upgrader module, an open-source network management system used to manage device fleets at scale.',
    highlights: [
      'Studying the Firmware Upgrader module codebase and contribution workflow',
      'Submitted pull requests currently under community review',
      'Preparing a Google Summer of Code proposal focused on network monitoring tooling',
    ],
    // Deliberately no merge counts or PR numbers — nothing merged yet.
    // Once a PR lands, add: prs: [{ number, title, url }]
  },
]

export const achievements = [
  {
    title: 'Finalist — ANVAKRIT 2025',
    issuer: 'National Forensic Sciences University (NFSU)',
    year: '2025',
    detail:
      'National-level Crime Scene Investigation Competition. Reached the final round against teams from across India.',
    tier: 'national',
  },
  {
    title: 'Winner — College Hackathon',
    issuer: 'KIET Group of Institutions',
    year: '2023',
    detail: 'First place in the institutional hackathon.',
    tier: 'institutional',
  },
  {
    title: 'Foundations of Machine Learning',
    issuer: 'IIIT Hyderabad',
    year: '2024',
    detail: 'Completed formal ML certification programme.',
    tier: 'certification',
  },
]

/**
 * Skill groups. No percentages — self-assigned proficiency numbers are
 * noise to anyone technical, and inventing them was the previous failure.
 * Instead: honest proficiency tiers and what each is actually used for.
 *
 * tier: 'core'       — used daily, would be comfortable in an interview
 *       'working'    — shipped real things with it
 *       'familiar'   — used it, still building depth
 */
export const skillGroups = [
  {
    title: 'Languages',
    icon: 'Code2',
    color: '#00f3ff',
    colSpan: 'md:col-span-1',
    blurb: 'Python first, with a working foundation across compiled and typed languages.',
    skills: [
      { name: 'Python', tier: 'core', note: 'Primary language — ML, backend, tooling' },
      { name: 'JavaScript', tier: 'working', note: 'Frontend and Node services' },
      { name: 'TypeScript', tier: 'working', note: 'Typed React applications' },
      { name: 'SQL', tier: 'working', note: 'Schema design and querying' },
      { name: 'Java', tier: 'familiar', note: 'OOP and coursework' },
      { name: 'C / C++', tier: 'familiar', note: 'DSA and systems fundamentals' },
    ],
  },
  {
    title: 'Artificial Intelligence',
    icon: 'Brain',
    color: '#0aff60',
    colSpan: 'md:col-span-2',
    blurb:
      'Where most of my recent work sits — getting language models to do something useful and reliable in production.',
    skills: [
      { name: 'Large Language Models', tier: 'core', note: 'Integration, serving, evaluation' },
      { name: 'Prompt Engineering', tier: 'core', note: 'Structured prompting, tool use' },
      { name: 'RAG', tier: 'working', note: 'Retrieval pipelines over private corpora' },
      { name: 'Embeddings', tier: 'working', note: 'Semantic search and similarity' },
      { name: 'AI Agents', tier: 'working', note: 'Multi-step tool-using systems' },
      { name: 'Context Engineering', tier: 'working', note: 'Window budgeting, retrieval shaping' },
      { name: 'Model Evaluation', tier: 'working', note: 'Accuracy and latency benchmarking' },
      { name: 'Fine-tuning / QLoRA', tier: 'familiar', note: 'Concepts and small experiments' },
    ],
  },
  {
    title: 'Machine Learning',
    icon: 'Sparkles',
    color: '#8b5cf6',
    colSpan: 'md:col-span-2',
    blurb: 'Classical ML and computer vision — the layer underneath the LLM work.',
    skills: [
      { name: 'scikit-learn', tier: 'core', note: 'Classification, NLP pipelines' },
      { name: 'NumPy / Pandas', tier: 'core', note: 'Data wrangling and analysis' },
      { name: 'NLP', tier: 'working', note: 'TF-IDF, entity extraction, sentiment' },
      { name: 'OpenCV', tier: 'working', note: 'Image processing pipelines' },
      { name: 'TensorFlow / Keras', tier: 'working', note: 'Deep learning models' },
      { name: 'PyTorch', tier: 'familiar', note: 'Currently deepening' },
      { name: 'MediaPipe', tier: 'working', note: 'Real-time landmark tracking' },
      { name: 'Transfer Learning', tier: 'familiar', note: 'Pretrained model adaptation' },
    ],
  },
  {
    title: 'Backend',
    icon: 'Server',
    color: '#ff006e',
    colSpan: 'md:col-span-1',
    blurb: 'APIs that hold up when something real is hitting them.',
    skills: [
      { name: 'FastAPI', tier: 'core', note: 'Primary API framework' },
      { name: 'REST API Design', tier: 'core', note: 'Resource modelling, versioning' },
      { name: 'Node.js / Express', tier: 'working', note: 'JavaScript services' },
      { name: 'JWT Auth', tier: 'working', note: 'Token-based authentication' },
      { name: 'Async Python', tier: 'working', note: 'asyncio, concurrent I/O' },
    ],
  },
  {
    title: 'Frontend',
    icon: 'Layout',
    color: '#00f3ff',
    colSpan: 'md:col-span-1',
    blurb: 'Interfaces for the systems I build, not pixel-pushing for its own sake.',
    skills: [
      { name: 'React', tier: 'core', note: 'Component architecture, hooks' },
      { name: 'Tailwind CSS', tier: 'core', note: 'Design systems and layout' },
      { name: 'Next.js', tier: 'working', note: 'SSR and routing' },
      { name: 'Vite', tier: 'working', note: 'Build tooling' },
      { name: 'Electron', tier: 'working', note: 'Cross-platform desktop apps' },
      { name: 'React Native', tier: 'familiar', note: 'Mobile with Expo' },
    ],
  },
  {
    title: 'Data & Infrastructure',
    icon: 'Database',
    color: '#0aff60',
    colSpan: 'md:col-span-2',
    blurb: 'Storage, deployment, and the plumbing between them.',
    skills: [
      { name: 'PostgreSQL', tier: 'working', note: 'Relational modelling' },
      { name: 'MongoDB', tier: 'working', note: 'Document stores' },
      { name: 'ChromaDB', tier: 'working', note: 'Vector search for RAG' },
      { name: 'Firebase', tier: 'working', note: 'Firestore, auth, hosting' },
      { name: 'Docker', tier: 'working', note: 'Containerised services' },
      { name: 'Git / GitHub', tier: 'core', note: 'Version control, PR workflow' },
      { name: 'GitHub Actions', tier: 'familiar', note: 'CI pipelines' },
      { name: 'Linux / Bash', tier: 'working', note: 'Daily driver, scripting' },
    ],
  },
]

/**
 * Technology chains — how the pieces actually connect into something shippable.
 * This is the section that shows systems thinking rather than a badge wall.
 */
export const techChains = [
  {
    id: 'backend',
    label: 'Production Backend',
    color: '#00f3ff',
    description: 'The path from a Python function to an API somebody depends on.',
    steps: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'CI/CD', 'Production API'],
  },
  {
    id: 'ai',
    label: 'Applied AI',
    color: '#0aff60',
    description: 'How a language model becomes a system that answers from your own data.',
    steps: ['Python', 'Embeddings', 'ChromaDB', 'RAG', 'LLM', 'AI Agents'],
  },
  {
    id: 'ml',
    label: 'Classical ML',
    color: '#8b5cf6',
    description: 'The pipeline behind the NLP and vision work.',
    steps: ['NumPy / Pandas', 'scikit-learn', 'Feature Engineering', 'Evaluation', 'Deployed Model'],
  },
  {
    id: 'product',
    label: 'Full Stack Product',
    color: '#ff006e',
    description: 'End to end, model to interface.',
    steps: ['FastAPI', 'REST API', 'React', 'Tailwind', 'Vercel', 'Shipped Product'],
  },
]

/**
 * Currently learning — honest about what's in progress vs. solid.
 * status: 'solid' | 'active' | 'next'
 */
export const learningRoadmap = [
  { name: 'Python', status: 'solid' },
  { name: 'Advanced DSA', status: 'active' },
  { name: 'SQL & PostgreSQL', status: 'active' },
  { name: 'FastAPI', status: 'solid' },
  { name: 'Docker', status: 'active' },
  { name: 'PyTorch', status: 'active' },
  { name: 'LLMs', status: 'solid' },
  { name: 'RAG', status: 'active' },
  { name: 'AI Agents', status: 'active' },
  { name: 'MLOps', status: 'next' },
  { name: 'AWS', status: 'next' },
]

export const philosophy = [
  {
    title: 'Ship the whole thing',
    body: 'A model in a notebook is a demo. A model behind an API, with a UI someone can actually use, is a product. I try to build the second one.',
  },
  {
    title: 'Measure before claiming',
    body: 'Accuracy numbers, latency figures, throughput — if I say it, I benchmarked it. Unverified metrics are worse than none.',
  },
  {
    title: 'Boring infrastructure, interesting problems',
    body: 'Postgres and FastAPI are not exciting, and that is the point. Save the novelty budget for the part that actually needs it.',
  },
]
