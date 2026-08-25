export const seo = {
  en: {
    title:
      'Karthik Suru | AI Engineer',
    description:
      'AI Engineer building production LLM systems, RAG pipelines, and the full-stack products around them. Final-year CS student at KIET Kakinada, three research internships at RCTS, IIIT Hyderabad. This portfolio runs its own RAG chatbot on Vercel Edge and Supabase pgvector.',
  },
};

export const translations = {
  en: {
    greeting: 'who ships real, working systems',
    greetingRoles: ['AI Engineer', 'LLM Systems Engineer', 'Backend Engineer', 'Applied ML'],
    pillLabels: ['AI Engineer', 'LLMs + RAG', 'KIET · CSE', 'RCTS Intern'],
    email: 'karthiksuru06@gmail.com',
    role: '',
    story: {
      context: 'A +Jack of all trades+, now *mastering AI*.',
      reflections: ['Every skill connects.', 'Every project speaks.'],
      hookParagraphs: [
        ["I like the *unglamorous half* of AI work — the retrieval that returns the right chunk, the API that holds up, the evaluation that tells you whether any of it actually worked."],
        [
          "A model in a notebook is a demo.",
          '*Behind an API*, with a UI someone uses, it is a +product+.',
        ],
      ],
      why: 'Three research internships at RCTS, IIIT Hyderabad taught me to build the whole thing — model, pipeline, API, interface. I fine-tune local LLMs, build retrieval over private corpora, and ship the products around them.',
      seeking: [
        'Final year. Graduating May 2027.',
        'Open to AI and backend engineering roles.',
        'Every project here has source you can read.',
      ],
      nav: [
        { icon: 'briefcase', label: 'My path', href: '#experience' },
        { icon: 'folder', label: 'What I build', href: '#projects' },
        { icon: 'mail', label: "Let's talk", href: '#contact' },
        { icon: 'bot', label: 'Ask me', href: '#chat', highlight: true },
      ],
      skills: [
        'Applied AI & LLM Systems',
        'Backend Engineering (Python / FastAPI)',
        'RAG & Vector Retrieval',
        'Machine Learning & Computer Vision',
        'Full Stack (React / TypeScript)',
        'Research (RCTS, IIIT Hyderabad)',
      ],
      skipButton: 'Skip intro',
    },
    taglines: [] as readonly string[],
    location: 'Visakhapatnam, India · Open to remote',
    roles: [
      'Software Engineering Intern',
      'Full-Stack Developer',
      'Junior AI Engineer',
    ],
    summary: {
      title: 'About',
      p1: 'Computer science student and builder focused on',
      p1Highlight: 'AI-powered, end-to-end systems',
      p1End:
        '. I learn by shipping: this portfolio runs its own production RAG pipeline — edge functions, vector search, streaming — and every project on this page has source code you can read.',
      p2: 'I take projects across',
      p2Highlight: 'idea → architecture → build → deploy',
      p2End: ', and I sweat the details at every step.',
      cards: [
        {
          title: 'Builder Mindset',
          desc: 'Small experiments, shipped early, improved in public',
        },
        {
          title: 'Strengths',
          desc: 'Fast ramp-up on new stacks; comfortable across frontend, backend, and ML',
        },
        {
          title: 'Communication',
          desc: 'I explain technical work in plain language — and write it down',
        },
      ],
    },
    coreCompetencies: {
      title: 'Core Competencies',
      items: [
        {
          title: 'Full-Stack Web',
          desc: 'React 19, TypeScript, Node.js, Tailwind — this site is the demo',
        },
        {
          title: 'AI & LLM Integration',
          desc: 'RAG pipelines, embeddings, vector search, prompt-injection defense',
        },
        {
          title: 'LLM Fine-tuning',
          desc: 'QLoRA adaptation, GGUF quantisation, local serving via Ollama',
        },
        {
          title: 'Machine Learning',
          desc: 'Python, scikit-learn, PyTorch — models trained and benchmarked, not left in a notebook',
        },
        {
          title: 'Computer Vision',
          desc: 'OpenCV, YOLO, MediaPipe — detection and image enhancement pipelines',
        },
        {
          title: 'Backend & Infrastructure',
          desc: 'FastAPI, PostgreSQL, Redis, Celery, Docker — services that stay up',
        },
      ],
    },
    techStack: {
      title: 'Tech Stack',
      categories: [
        {
          name: 'AI / LLM',
          items: [
            'OpenRouter (Llama 3.3 70B)',
            'HuggingFace Embeddings',
            'RAG + pgvector',
            'Prompt Engineering',
          ],
        },
        {
          name: 'Machine Learning',
          items: ['Python', 'PyTorch', 'scikit-learn', 'NumPy / Pandas', 'OpenCV', 'YOLO'],
        },
        {
          name: 'Backend',
          items: ['FastAPI', 'Node.js / Express', 'REST APIs', 'Async Python', 'JWT Auth'],
        },
        {
          name: 'Web',
          items: ['React', 'TypeScript', 'Next.js', 'Vite', 'Tailwind CSS'],
        },
        {
          name: 'Data & Infra',
          items: ['PostgreSQL', 'MongoDB', 'ChromaDB', 'Supabase', 'Docker', 'Vercel', 'Git'],
        },
      ],
    },
    projects: {
      title: 'Projects',
      thisSite: {
        title: 'This portfolio is the first exhibit',
        subtitle:
          'Ask the chatbot anything about me — the answer is retrieved, ranked, and streamed by a pipeline I built.',
        pipeline: [
          { icon: 'messageSquare', name: 'You ask', desc: 'Chat UI · SSE streaming' },
          { icon: 'shield', name: 'Guard', desc: '6-layer prompt-injection defense' },
          { icon: 'brain', name: 'Embed', desc: 'all-MiniLM-L6-v2 · 384-dim vectors' },
          { icon: 'database', name: 'Retrieve', desc: 'Supabase pgvector · hybrid search' },
          { icon: 'bot', name: 'Answer', desc: 'Llama 3.3 70B · Vercel Edge' },
        ],
        footnote: 'Open the chat bubble in the corner and try to break it.',
      },
      githubLink: 'github.com/karthiksuru06',
      viewCode: 'View code',
      viewPrototype: 'View prototype',
      items: [
        {
          title: 'folio-gpt',
          badge: 'AI · RAG',
          badgeBuilding: '',
          desc: 'The site you are reading. React 19 + Vercel Edge chatbot with hybrid RAG search: HuggingFace embeddings → Supabase pgvector → Llama 3.3 70B streamed over SSE, hardened against prompt injection.',
          tech: ['React 19', 'Vercel Edge', 'Supabase pgvector', 'OpenRouter'],
          link: '',
        },
        {
          title: 'Yukthi',
          badge: 'Flagship',
          badgeBuilding: 'In development',
          desc: 'Governed AI growth engine for Indian SMBs. Agents rank growth actions from first-party signals; a human approves before anything executes. ~380 source files, with tests, load tests, and a production runbook.',
          tech: ['FastAPI', 'PostgreSQL', 'pgvector', 'Celery', 'Next.js', 'Docker'],
          link: 'github.com/karthiksuru06/yukthi-mvp',
        },
        {
          title: 'BTech Mentor AI',
          badge: 'LLM Fine-tuning',
          badgeBuilding: '',
          desc: 'A fine-tuned small language model that tutors engineering students entirely offline. Qwen2.5-3B adapted with QLoRA, quantised to GGUF, served through Ollama, with RAG over the student\'s own syllabus. No API keys, no per-token cost, nothing leaves the machine.',
          tech: ['Qwen2.5-3B', 'QLoRA', 'Ollama', 'ChromaDB', 'FastAPI', 'React'],
          link: 'github.com/karthiksuru06/btech-mentor-ai',
        },
        {
          title: 'HTP Test Analyzer',
          badge: 'Research',
          badgeBuilding: '',
          desc: 'Psychological assessment tool built during my winter internship at RCTS. YOLOv11 detects interpretively significant features in a drawing, then FAISS retrieval grounds the generated report in clinical guidance rather than model priors.',
          tech: ['YOLOv11', 'FAISS', 'Gemini 1.5 Pro', 'FastAPI', 'Next.js'],
          link: 'github.com/RCTS-K-Hub/2025-WI-T7',
        },
        {
          title: 'Neural Style Studio',
          badge: 'Computer Vision',
          badgeBuilding: '',
          desc: 'Photo-to-artwork style transfer with two modes — VGG19 optimisation for quality, AdaIN for speed — plus an EfficientNet-B3 classifier fine-tuned on WikiArt reaching 60.1% top-1 across 24 style classes.',
          tech: ['PyTorch', 'VGG19', 'AdaIN', 'EfficientNet-B3', 'Docker'],
          link: 'github.com/karthiksuru06/art-style-transfer',
        },
        {
          title: 'TME-MIRNet-v2',
          badge: 'Research',
          badgeBuilding: '',
          desc: 'Low-light video enhancement. Added ConvLSTM temporal consistency and illumination-guided attention to MIRNet-v2 to remove the flicker you get from per-frame enhancement. Evaluated against baseline; written up as an IEEE-format paper draft.',
          tech: ['PyTorch', 'ConvLSTM', 'OpenCV', 'SSIM'],
          link: 'github.com/karthiksuru06/Mirnet',
        },
        {
          title: 'Instaaid',
          badge: 'Shipped',
          badgeBuilding: '',
          desc: 'Android personal-safety app with shake-to-alert via a custom native background module, live location sharing, and Firestore sync. Shipped as a signed APK through GitHub Releases.',
          tech: ['React Native', 'Expo', 'Firebase', 'Express', 'TypeScript'],
          link: 'github.com/karthiksuru06/insta-aid',
        },
      ],
    },
    claudeCode: {
      title: 'AI-Native Workflow',
      badge: 'How I build',
      desc: 'I build with AI pair-programmers the way this generation of engineers will — but I own every line: architecture decisions, reviews, and tests are mine.',
      highlights: [
        "Built this site's RAG stack end-to-end: ingestion script, embeddings, pgvector schema, edge streaming",
        'Hardened the chatbot against prompt injection with fingerprinting, canary tokens, and keyword filters',
        'Every project ships with a README, reproducible setup, and source on GitHub',
      ],
      certs: [] as readonly { title: string; url: string }[],
    },
    experience: {
      title: 'Experience & Training',
      // Key names are legacy from the upstream template. The content below is
      // verified against the résumé; renaming the keys touches App.tsx.
      zinkee: {
        company: 'RCTS, IIIT Hyderabad',
        logo: null,
        location: 'Hyderabad, India',
        role: 'Research Intern — Summer & Winter',
        period: 'Dec 2025 · Jun 2026',
        desc: 'Two research engagements at the Raj Reddy Center for Technology & Society. Extended machine learning pipelines for predictive analytics on social-impact datasets, and built API interfaces for real-time data processing and analysis.',
      },
      careerOps: {
        company: 'K-Hub, RCTS — IIIT Hyderabad',
        logo: null,
        location: 'Hyderabad, India',
        role: 'Junior Developer',
        period: 'Aug 2024 — Apr 2025',
        badge: 'Nine months',
        url: '',
        urlLabel: '',
        desc: 'Nine-month engineering role across the AI development lifecycle. Built ML models for predictive analytics in social-impact projects and integrated API interfaces enabling real-time data processing, working alongside researchers and other developers.',
        pressLabel: '',
        press: [],
        caseStudyUrl: '',
        caseStudyLabel: '',
      },
      toastmasters: {
        company: 'OpenWISP',
        role: 'Open Source Contributor',
        period: '2025 — Present',
        desc: 'Working within the OpenWISP community on the Firmware Upgrader module. Pull requests are currently under community review — nothing merged yet. Preparing a Google Summer of Code proposal focused on network monitoring tooling.',
      },
    },
    education: {
      title: 'Education',
      items: [
        {
          year: '2021 — 2027',
          org: 'KIET Group of Institutions, Kakinada',
          title: 'B.Tech, Computer Science (Cybersecurity specialization)',
          desc: 'Core CS: data structures, algorithms, operating systems, computer networks, DBMS.',
        },
        {
          year: '2024',
          org: 'IIIT Hyderabad',
          title: 'Foundations of Machine Learning',
          desc: 'Supervised and unsupervised learning, model evaluation, and the mathematics underneath.',
        },
        {
          year: '2025',
          org: 'National Forensic Sciences University',
          title: 'ANVAKRIT 2025 — National Finalist',
          desc: 'Reached the final round of the national Crime Scene Investigation competition.',
        },
      ],
      focus: {
        title: 'Current Focus',
        items: [
          {
            title: 'RAG & LLM applications',
            desc: 'Retrieval quality, evals, guardrails — making AI answers trustworthy',
          },
          {
            title: 'PyTorch & MLOps',
            desc: 'Going deeper on training, serving, and the operational half of ML',
          },
          {
            title: 'DSA & systems fundamentals',
            desc: 'The basics that compound over a career',
          },
        ],
        note: 'I keep this list short on purpose — depth beats breadth.',
      },
    },
    skills: {
      title: 'Skills',
      languages: 'Languages',
      english: 'English',
      professional: 'Professional proficiency',
      technical: 'Technical Skills',
      soft: 'Soft Skills',
      softSkills: [
        'Communication',
        'Leadership',
        'Systems Thinking',
        'E2E Ownership',
        'Bias for Action',
        'Dealing with Ambiguity',
      ],
    },
    cta: {
      title: "Let's talk",
      desc: "I'm a student who ships. If you have an internship, a junior role, or an interesting AI project — my inbox is open, and the chatbot can handle the first round of questions.",
      contact: 'Contact',
    },
    ui: {
      languageBanner: 'Este sitio está disponible en español',
      languageBannerSwitch: 'Cambiar a ES',
      languageBannerSwitchPrefix: 'Cambiar a',
      languageBannerSwitchLang: 'ES',
      languageToggle: 'EN',
      typingIndicator: 'Karthik is typing...',
    },
    chat: {
      placeholder: 'Type your question...',
      title: 'Karthik',
      subtitle: 'Ask me about my experience',
      greeting:
        "Hi! I'm Karthik's bot. Ask me anything: experience, projects, what drives me.",
      error: 'Error sending. Please try again.',
      offline: "Looks like you're offline. Check your connection and try again.",
      prompts: [
        {
          icon: 'briefcase',
          label: 'AI Experience',
          query: "What is Karthik's experience with AI and automation?",
        },
        {
          icon: 'fileText',
          label: 'View Resume',
          query: "Can you summarize Karthik's resume?",
        },
        {
          icon: 'rocket',
          label: 'Top Projects',
          query: "What are Karthik's most notable projects?",
        },
      ],
      contactCtaTitle: 'Want to talk directly?',
      voice: {
        start: 'Talk to Karthik',
        stop: 'End',
        connecting: 'Connecting...',
        listening: 'Listening...',
        thinking: 'Thinking...',
        searching: 'Searching my projects...',
        speaking: 'Speaking...',
        timeWarning: '15 seconds remaining',
        ended: 'Voice session ended',
        rateLimited: 'You have reached the limit of 3 voice sessions per day',
        unsupported: 'Your browser does not support audio input',
        micDenied: 'Microphone access is needed for voice mode',
        switchToText: 'Switch to text',
        connection: 'Connection error. Please try again.',
      },
    },
  },
} as const;

export type Lang = 'en';
