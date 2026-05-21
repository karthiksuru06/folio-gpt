export type AboutLang = 'en'

export const aboutContent = {
  en: {
    slug: 'about',
    altSlug: 'sobre-mi',
    seo: {
      title: 'Suru Karthik | AI Orchestration Engineer & Cyber Analyst',
      description: 'Computer Science student specializing in AI and Cybersecurity. Ready to excel as an AI Orchestration Engineer or Cyber Analyst.',
    },
    heading: 'Suru Karthik',
    manifesto: 'Ready to deliver immediate value in AI Engineering and Cybersecurity roles.',
    subtitle: 'AI Orchestration Engineer & Cyber Analyst',
    location: 'India',
    lastUpdated: 'May 2026',
    bio: [
      'Computer Science student specializing in AI and Cybersecurity. Ready to excel as an AI Orchestration Engineer or Cyber Analyst. Equipped with hands-on development experience.',
      'Pursuing a Degree in Computer Science with a focus on AI and Cybersecurity. Constantly upskilling through practical development, active open-source contributions, and hands-on lab projects.',
      'Explore my work at github.com/karthiksuru06 and let\'s connect!'
    ],
    seeking: '',
    roles: [],
    timelineHeading: 'Skills & Tech Stack',
    timeline: [
      { period: 'Core', role: 'Languages & Frameworks', company: '', desc: 'Python | TypeScript | Flask | Jupyter | JavaScript' },
      { period: 'Domain', role: 'AI & Security', company: '', desc: 'Machine Learning | Network Security (Scapy) | Artificial Intelligence | Orchestration' },
      { period: 'Data', role: 'Analysis', company: '', desc: 'Data Visualization | Large Datasets' }
    ],
    projectsHeading: 'Projects',
    projects: [
      { name: 'PacketSpyMaster', desc: 'A real-time network analyzer using Python and Flask, enabling live capture and TCP/UDP/ICMP filtering to monitor vulnerabilities.', href: 'https://github.com/karthiksuru06/packetspymaster' },
      { name: 'Smart Penny Tracker Pro', desc: 'A TypeScript application to automate expense monitoring, improving finance management efficiency.', href: 'https://github.com/karthiksuru06/SMART-PENNY-TRACKER-PRO' },
      { name: 'Sentiment Analysis Engine', desc: 'Analyzed large datasets and deployed via Jupyter Notebooks, transforming unstructured text into actionable intelligence.', href: 'https://github.com/karthiksuru06/SENTIMENT-ANALYSIS' },
      { name: 'NetJSONGraph Customization', desc: 'Improved network visualizations by customizing the NetJSONGraph library in JavaScript, allowing clearer topology mapping for distributed systems.', href: 'https://github.com/karthiksuru06/netjsongraph.js' },
    ],
    certificationsHeading: '',
    certifications: [] as Array<{ org: string, items: string[] }>,
    educationHeading: 'Education',
    education: [
      'Pursuing a Degree in Computer Science',
      'Specializing in Artificial Intelligence and Cybersecurity'
    ],
    pressHeading: '',
    press: [] as Array<{ title: string, publisher: string, date: string, href: string }>,
    communityHeading: '',
    community: [] as Array<{ title: string, platform: string, href: string }>,
    faqHeading: 'Frequently Asked Questions',
    faq: [
      { q: 'Who is Suru Karthik?', a: 'Suru Karthik is a Computer Science student specializing in Artificial Intelligence and Cybersecurity, actively targeting AI Orchestration Engineer and Cyber Analyst roles.' },
      { q: 'What has Suru built?', a: 'Suru has built PacketSpyMaster, Smart Penny Tracker Pro, a Sentiment Analysis engine, and customized the NetJSONGraph library.' },
      { q: 'What is Suru\'s technical toolkit?', a: 'His toolkit includes Python, TypeScript, Flask, Jupyter, Machine Learning, Network Security (Scapy), Data Visualization, Artificial Intelligence, and Orchestration.' }
    ],
    connectHeading: 'Connect',
    email: 'karthik939075@gmail.com',
  },
} as const

