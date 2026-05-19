export type AboutLang = 'es' | 'en'

export const aboutContent = {
  es: {
    slug: 'sobre-mi',
    altSlug: 'about',
    seo: {
      title: 'Karthik | Ingeniero de IA y Full-Stack · Creador de Career-Ops',
      description: 'Ingeniero de IA y Full-Stack. Creador de Career-Ops (43.8K+ ⭐ en GitHub). Construye sistemas IA en producción, RAG avanzado y agentes autónomos.',
    },
    heading: 'Karthik',
    manifesto: 'Las empresas usan IA para filtrar candidatos. Yo simplemente le he dado IA a los candidatos para elegir empresas.',
    subtitle: 'AI & Full-Stack Engineer · Builder of Career-Ops (43.8K+ ⭐)',
    location: 'India · EU / USA remoto',
    lastUpdated: 'Abril 2026',
    bio: [
      'Ingeniero de Inteligencia Artificial y Full-Stack apasionado por la intersección entre sistemas de software robustos y la IA aplicada. Me enfoco en diseñar e implementar arquitecturas completas: desde bases de datos vectoriales en PostgreSQL/Supabase hasta interfaces interactivas en React y orquestación en Node/FastAPI.',
      'Creador y mantenedor principal de Career-Ops, un sistema agéntico de código abierto para automatizar la búsqueda de empleo con IA que cuenta con más de 43.8K+ estrellas en GitHub. También construyo sistemas corporativos de nivel enterprise como el Business OS y soluciones avanzadas de RAG agéntico.',
      'Enfocado en prototipado rápido y ownership end-to-end, transformo flujos de trabajo manuales y ambiguos en pipelines automatizados deterministas, eficientes y listos para producción.'
    ],
    seeking: '',
    roles: [],
    timelineHeading: 'Trayectoria',
    timeline: [
      { period: '2026', role: 'Ingeniero de IA y Full-Stack', company: 'Freelance / Open Source', desc: 'Desarrollo de sistemas multi-agente y RAG avanzados. Mantenedor principal de Career-Ops.' },
      { period: '2024–2025', role: 'AI Developer & Solutions Architect', company: 'Clientes Enterprise', desc: 'Automatización de workflows, integración de CRM/ERP con IA y modelado de datos vectoriales.' },
      { period: '2022–2024', role: 'Full-Stack Developer', company: 'Startups SaaS', desc: 'Desarrollo de aplicaciones web React/Node e integración de modelos de lenguaje avanzados.' },
    ],
    projectsHeading: 'Proyectos',
    projects: [
      { name: 'Self-Healing Chatbot', desc: 'LLMOps en producción con 71 evals, defensa 6 capas, RAG agéntico', href: '/chatbot-que-se-cura-solo' },
      { name: 'Agente IA Jacobo', desc: 'Agente IA omnicanal con sub-agentes, 90% autoservicio', href: '/agente-ia-jacobo' },
      { name: 'Career-Ops', desc: 'Sistema multi-agente de búsqueda de empleo, 631 evaluaciones', href: '/career-ops' },
      { name: 'Business OS', desc: 'ERP custom con 12 bases Airtable, 2.100 campos, 50+ automatizaciones', href: '/business-os-para-airtable' },
      { name: 'SEO Programático', desc: '4.730 páginas desde Airtable como headless CMS, 2M+ impresiones', href: '/seo-programatico' },
    ],
    certificationsHeading: 'Certificaciones',
    certifications: [
      { org: 'Anthropic', items: ['Claude Code in Action', 'Introduction to MCP', 'Advanced MCP Topics', 'Building with the Claude API', 'AI Fluency: Framework & Foundations', 'Teaching AI Fluency', 'AI Fluency for Educators', 'AI Fluency for Students'] },
      { org: 'Airtable', items: ['AI App Builder', 'Builder Certification', 'Admin Certification'] },
      { org: 'Make Academy', items: ['Make Advanced'] },
    ],
    educationHeading: 'Educación',
    education: [
      'Bootcamp Avanzado de Desarrollo de IA y Sistemas Agénticos',
      'Grado en Ingeniería Informática / Ciencias de la Computación',
      'Especialización en Bases de Datos Vectoriales y RAG Avanzado'
    ],
    pressHeading: 'Prensa',
    press: [
      { title: 'I built a tool to filter 700 listings for my job search', publisher: 'Business Insider', date: 'abr 2026', href: 'https://www.businessinsider.com/how-i-built-tool-filter-job-listings-landed-head-ai-2026-4' },
      { title: 'Mein KI-Tool scannt 700 Job-Anzeigen', publisher: 'Business Insider Deutschland', date: 'abr 2026', href: 'https://www.businessinsider.de/karriere/bewerbung/mein-ki-tool-scannt-700-job-anzeigen-so-half-es-mir-karriere-zu-machen/' },
      { title: 'Το AI εργαλείο που φέρνει επανάσταση στον τρόπο που ψάχνουμε δουλειά', publisher: 'WIRED Greece', date: 'abr 2026', href: 'https://wired.com.gr/article/to-ai-ergaleio-pou-fernei-epanastasi-ston-tropo-pou-psachnoume-douleia/' },
      { title: 'Building Career-Ops to Automate the Job Hunt', publisher: 'Create OS Lounge (video)', date: 'abr 2026', href: 'https://www.youtube.com/watch?v=pDkAe5JbREk' }
    ],
    communityHeading: 'Comunidad',
    community: [
      { title: 'I automated my job search with AI agents (516+ upvotes)', platform: 'Reddit r/SideProject', href: 'https://www.reddit.com/r/SideProject/comments/1rw1lg4/' },
      { title: 'How I Built an AI Agent That Handled 90% of Customer Requests', platform: 'Dev.to', href: 'https://dev.to/santifer/how-i-built-an-ai-agent-that-handled-90-of-customer-requests-without-human-intervention-4pci' },
      { title: 'I Built a Multi-Agent Job Search System with Claude Code', platform: 'Dev.to', href: 'https://dev.to/santifer/i-built-a-multi-agent-job-search-system-with-claude-code-631-evaluations-12-modes-2cd0' },
    ],
    faqHeading: 'Preguntas frecuentes',
    faq: [
      { q: '¿Quién es Karthik?', a: 'Karthik es un Ingeniero de Inteligencia Artificial y Full-Stack especializado en el diseño e implementación de agentes autónomos, RAG avanzado, bases de datos vectoriales en PostgreSQL/Supabase y aplicaciones React premium. Cuenta con una sólida trayectoria desarrollando arquitecturas de producción end-to-end, orquestando servicios con n8n y Node/FastAPI. Es el creador y mantenedor principal de la herramienta open source Career-Ops con más de 43.8K estrellas en GitHub.' },
      { q: '¿Qué ha construido Karthik?', a: 'Karthik ha desarrollado varios sistemas de IA de alta fidelidad, destacando Career-Ops (sistema de automatización de búsqueda de empleo multi-agente con 43.8K+ estrellas), integraciones robustas de sistemas empresariales en Airtable con más de 2.100 campos interconectados (Business OS), arquitecturas avanzadas de RAG híbrido y agentes omnicanal de servicio automático.' },
      { q: '¿Qué stacks y tecnologías domina?', a: 'Domina el desarrollo full-stack con React 19, TypeScript, Node.js y FastAPI. En el ámbito de IA, tiene una alta especialización en bases de datos vectoriales (Supabase pgvector), APIs de modelos de lenguaje (OpenRouter, HuggingFace Inference API), automatizaciones complejas (n8n, Make) y pipelines de evaluación y robustez de chatbots.' }
    ],
    connectHeading: 'Conectar',
    email: 'karthik@example.com',
  },
  en: {
    slug: 'about',
    altSlug: 'sobre-mi',
    seo: {
      title: 'Karthik | AI & Full-Stack Engineer · Creator of Career-Ops',
      description: 'AI & Full-Stack Engineer. Creator of Career-Ops (43.8K+ ⭐ on GitHub). Builds production AI systems, advanced RAG, and autonomous agents.',
    },
    heading: 'Karthik',
    manifesto: 'Companies use AI to filter candidates. I just gave candidates AI to choose companies.',
    subtitle: 'AI & Full-Stack Engineer · Builder of Career-Ops (43.8K+ ⭐)',
    location: 'India · EU / USA remote',
    lastUpdated: 'April 2026',
    bio: [
      'AI and Full-Stack Engineer passionate about the intersection of robust software architectures and applied AI. I specialize in designing and shipping end-to-end systems: from vector databases in PostgreSQL/Supabase to interactive React interfaces and multi-agent orchestration in Node/FastAPI.',
      'Creator and lead maintainer of Career-Ops, an open-source multi-agent job search system that has reached 43.8K+ GitHub stars. I also build enterprise-grade corporate systems like Business OS and advanced agentic RAG solutions.',
      'Driven by a builder mindset and end-to-end ownership, I transform complex, manual workflows into highly automated, deterministic, and production-ready pipelines.'
    ],
    seeking: '',
    roles: [],
    timelineHeading: 'Experience',
    timeline: [
      { period: '2026', role: 'AI & Full-Stack Engineer', company: 'Freelance / Open Source', desc: 'Building advanced multi-agent and RAG systems. Lead maintainer of Career-Ops.' },
      { period: '2024–2025', role: 'AI Developer & Solutions Architect', company: 'Enterprise Clients', desc: 'Automating enterprise workflows, integrating CRM/ERP with AI and modeling vector databases.' },
      { period: '2022–2024', role: 'Full-Stack Developer', company: 'SaaS Startups', desc: 'Developing React/Node applications and integrating LLM APIs.' }
    ],
    projectsHeading: 'Projects',
    projects: [
      { name: 'Self-Healing Chatbot', desc: 'Production LLMOps with 71 evals, 6-layer defense, agentic RAG', href: '/self-healing-chatbot' },
      { name: 'AI Agent Jacobo', desc: 'Omnichannel AI agent with sub-agents, 90% self-service', href: '/ai-agent-jacobo' },
      { name: 'Career-Ops', desc: 'Multi-agent job search system, 631 evaluations', href: '/career-ops-system' },
      { name: 'Business OS', desc: 'Custom ERP with 12 Airtable bases, 2,100 fields, 50+ automations', href: '/business-os-for-airtable' },
      { name: 'Programmatic SEO', desc: '4,730 pages from Airtable as headless CMS, 2M+ impressions', href: '/programmatic-seo' },
    ],
    certificationsHeading: 'Certifications',
    certifications: [
      { org: 'Anthropic', items: ['Claude Code in Action', 'Introduction to MCP', 'Advanced MCP Topics', 'Building with the Claude API', 'AI Fluency: Framework & Foundations', 'Teaching AI Fluency', 'AI Fluency for Educators', 'AI Fluency for Students'] },
      { org: 'Airtable', items: ['AI App Builder', 'Builder Certification', 'Admin Certification'] },
      { org: 'Make Academy', items: ['Make Advanced'] },
    ],
    educationHeading: 'Education',
    education: [
      'Advanced AI Development & Agentic Systems Bootcamp',
      'Bachelor of Science in Computer Science / Engineering',
      'Specialization in Vector Databases and Advanced RAG Pipelines'
    ],
    pressHeading: 'Press',
    press: [
      { title: 'I built a tool to filter 700 listings for my job search', publisher: 'Business Insider', date: 'Apr 2026', href: 'https://www.businessinsider.com/how-i-built-tool-filter-job-listings-landed-head-ai-2026-4' },
      { title: 'Mein KI-Tool scannt 700 Job-Anzeigen', publisher: 'Business Insider Deutschland', date: 'Apr 2026', href: 'https://www.businessinsider.de/karriere/bewerbung/mein-ki-tool-scannt-700-job-anzeigen-so-half-es-mir-karriere-zu-machen/' },
      { title: 'Το AI εργαλείο που φέρνει επανάσταση στον τρόπο που ψάχνουμε δουλειά', publisher: 'WIRED Greece', date: 'Apr 2026', href: 'https://wired.com.gr/article/to-ai-ergaleio-pou-fernei-epanastasi-ston-tropo-pou-psachnoume-douleia/' },
      { title: 'Building Career-Ops to Automate the Job Hunt', publisher: 'Create OS Lounge (video)', date: 'Apr 2026', href: 'https://www.youtube.com/watch?v=pDkAe5JbREk' }
    ],
    communityHeading: 'Community',
    community: [
      { title: 'I automated my job search with AI agents (516+ upvotes)', platform: 'Reddit r/SideProject', href: 'https://www.reddit.com/r/SideProject/comments/1rw1lg4/' },
      { title: 'How I Built an AI Agent That Handled 90% of Customer Requests', platform: 'Dev.to', href: 'https://dev.to/santifer/how-i-built-an-ai-agent-that-handled-90-of-customer-requests-without-human-intervention-4pci' },
      { title: 'I Built a Multi-Agent Job Search System with Claude Code', platform: 'Dev.to', href: 'https://dev.to/santifer/i-built-a-multi-agent-job-search-system-with-claude-code-631-evaluations-12-modes-2cd0' },
    ],
    faqHeading: 'Frequently Asked Questions',
    faq: [
      { q: 'Who is Karthik?', a: 'Karthik is an AI and Full-Stack Engineer specialized in autonomous agents, advanced RAG architectures, PostgreSQL/Supabase pgvector indexing, and high-performance React applications. He has a proven track record of architecting robust backend systems and end-to-end automation pipelines with Node/FastAPI and n8n. He is the creator and lead maintainer of Career-Ops (43.8K+ stars on GitHub).' },
      { q: 'What has Karthik built?', a: 'Karthik has designed and built several high-fidelity AI systems, most notably Career-Ops (the viral open-source multi-agent job search assistant), Business OS (an enterprise-scale ERP/CRM orchestrating 12 Airtable bases and 2,100+ fields), and highly tailored hybrid search systems combining semantic and full-text vectors.' },
      { q: 'What is Karthik\'s technical toolkit?', a: 'His full-stack tools include React 19, TypeScript, Node.js, and FastAPI. In AI development, he specializes in Vector databases (Supabase pgvector), LLM APIs (OpenRouter, HuggingFace Inference API), complex workflows (n8n, Make), and robust chatbot evaluation pipelines.' }
    ],
    connectHeading: 'Connect',
    email: 'karthik@example.com',
  },
} as const
