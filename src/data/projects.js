/**
 * Project case studies.
 *
 * Every claim here traces to something checkable: a repo, a live URL, a
 * committed model registry, or an evaluation artefact. Where a number
 * isn't measured, the copy describes the engineering instead of inventing
 * a figure — "reduced latency" with no benchmark behind it is the kind of
 * thing an interviewer will ask you to defend.
 *
 * Icons are referenced by name and resolved in Projects.jsx so this file
 * stays free of React imports.
 */

export const projects = [
  {
    id: 'yukthi',
    title: 'Yukthi',
    icon: 'Bot',
    featured: true,
    status: 'In active development',
    shortDesc:
      'Governed AI growth engine for Indian SMBs — agents that propose actions, humans that approve them.',
    techStack: [
      'Python 3.12', 'FastAPI', 'PostgreSQL', 'pgvector', 'Redis', 'Celery',
      'Next.js', 'Docker', 'TEI Embeddings',
    ],
    github: 'https://github.com/karthiksuru06/yukthi-mvp',
    demo: null,
    problem:
      'Small businesses in India sit on first-party signals — Google reviews, Instagram activity, WhatsApp threads, inbound leads — and almost none of it turns into action. Generic AI marketing tools either do nothing useful with that data or act autonomously in ways an owner cannot audit, which is a non-starter under DPDP.',
    solution:
      'A governed agent system: it ingests those signals, ranks the growth actions worth taking, and then executes only what a human has explicitly approved. Every action is attributable in rupees, so the owner can see which campaign earned what.',
    architecture:
      'FastAPI modular monolith over PostgreSQL with pgvector for semantic retrieval, Redis for caching and queues, and Celery workers for asynchronous jobs. Embeddings are served locally through TEI on CPU to keep inference cost near zero. A Next.js dashboard handles configuration and approvals, while WhatsApp is the primary surface owners actually use. Docker Compose covers both development and production.',
    features: [
      'Human-in-the-loop approval gate on every outbound action',
      'Signal ingestion from Google reviews, Instagram, WhatsApp, and lead forms',
      'Rupee-level attribution on win-back campaigns',
      'Semantic retrieval over business context via pgvector',
      'DPDP-compliance constraints enforced at the data layer, not bolted on',
      'CPU-only embedding inference to keep unit economics viable',
    ],
    challenges: [
      'Designing an agent that is genuinely useful while never acting without approval — the approval gate had to be structural rather than a prompt instruction, because prompt-level guardrails fail under adversarial input.',
      'Keeping inference costs low enough for SMB pricing, which ruled out hosted embedding APIs and pushed the system toward locally served TEI models on CPU.',
      'Attributing revenue to specific agent actions without over-claiming causation.',
    ],
    impact:
      'The largest system I have built — a modular monolith with a test suite, load tests, a production runbook, and a deployment-readiness review. Currently the project I work on most.',
  },
  {
    id: 'btech-mentor',
    title: 'BTech Mentor AI',
    icon: 'GraduationCap',
    featured: true,
    status: 'Complete',
    shortDesc:
      'A fine-tuned small language model that tutors engineering students entirely offline, with RAG over their own syllabus.',
    techStack: [
      'Qwen2.5-3B', 'QLoRA', 'Unsloth', 'GGUF', 'Ollama', 'FastAPI',
      'ChromaDB', 'React', 'TypeScript',
    ],
    github: 'https://github.com/karthiksuru06/btech-mentor-ai',
    demo: null,
    problem:
      'Students who would benefit most from an AI tutor are the least able to pay for one, and hosted models require sending coursework to a third party. Both the cost and the privacy problem come from the same assumption: that the model has to live in someone else\'s datacentre.',
    solution:
      'Fine-tune a small model that runs on a student\'s own laptop. Qwen2.5-3B adapted with QLoRA for tutoring behaviour, quantised to GGUF, served locally through Ollama, with retrieval over the student\'s own syllabus PDFs so answers track the course they are actually taking. Nothing leaves the machine and there is no per-token cost.',
    architecture:
      'Training runs QLoRA through Unsloth against Qwen2.5-3B, after which adapters are merged and exported to GGUF for local inference via Ollama. A FastAPI backend handles retrieval: syllabus PDFs are chunked and embedded with nomic-embed-text into ChromaDB, and retrieved context grounds each answer. A React, Vite, and TypeScript frontend provides the tutoring interface.',
    features: [
      'QLoRA fine-tune of Qwen2.5-3B for step-by-step tutoring behaviour',
      'Fully offline inference — no API keys, no per-token cost, no data leaving the device',
      'RAG over the student\'s own syllabus PDFs via ChromaDB',
      'Concept explanation, coding help, and quiz generation',
      'GGUF quantisation for consumer-hardware inference',
    ],
    challenges: [
      'A 3B model has real capability limits. Getting reliable step-by-step reasoning out of it depended far more on the quality and shape of the fine-tuning data than on any inference-time prompting.',
      'Quantisation to GGUF trades accuracy for the ability to run on a student laptop — finding the level where tutoring quality survives was empirical, not theoretical.',
    ],
    impact:
      'End-to-end ownership of the full LLM lifecycle: dataset, fine-tune, merge, quantise, serve, and build the retrieval layer and interface around it.',
  },
  {
    id: 'htp-analyzer',
    title: 'HTP Test Analyzer',
    icon: 'Brain',
    featured: true,
    status: 'RCTS winter internship',
    shortDesc:
      'Psychological assessment tool combining YOLOv11 object detection with RAG over clinical guidelines.',
    techStack: [
      'FastAPI', 'YOLOv11', 'FAISS', 'Gemini 1.5 Pro', 'Next.js 14', 'Redis', 'Docker',
    ],
    github: 'https://github.com/RCTS-K-Hub/2025-WI-T7',
    demo: null,
    problem:
      'The House-Tree-Person projective test is interpreted manually, which makes it slow and inconsistent between practitioners. Two clinicians can read the same drawing differently, and there is no systematic way to tie an interpretation back to the literature it came from.',
    solution:
      'A two-stage pipeline: a fine-tuned YOLOv11 model detects the drawing features that carry interpretive weight, then a retrieval layer pulls the relevant clinical guidance and a language model composes a report grounded in those retrieved passages rather than in its own priors.',
    architecture:
      'YOLOv11s handles feature detection on the uploaded drawing. Detected features become the query into a FAISS index built over clinical guideline documents; retrieved passages are passed to Gemini 1.5 Pro as grounding context for report generation. FastAPI serves the pipeline, Redis caches expensive inference, and a Next.js 14 frontend handles upload and report display. Docker Compose covers dev and prod.',
    features: [
      'Fine-tuned YOLOv11 detection of interpretively significant drawing features',
      'FAISS retrieval over clinical guideline corpus',
      'Reports grounded in retrieved sources rather than model priors',
      'Redis-backed caching of inference results',
      'Containerised dev and production environments',
    ],
    challenges: [
      'Grounding was the whole problem. An ungrounded model will produce confident psychological claims it cannot support, which in this domain is actively harmful — the retrieval layer exists to constrain generation to documented guidance.',
      'Detecting drawing features reliably across wildly varying hand-drawn input.',
    ],
    impact:
      'Built during the winter research internship at RCTS, IIIT Hyderabad. Documented with a full system architecture write-up and sample generated reports.',
  },
  {
    id: 'compliance-os',
    title: 'Compliance OS',
    icon: 'FileSearch',
    featured: true,
    status: 'Prototype',
    shortDesc:
      'Multi-tenant compliance platform for Indian finance teams — OCR, hybrid retrieval, and a multi-agent copilot.',
    techStack: [
      'Python', 'FastAPI', 'PostgreSQL', 'pgvector', 'Alembic', 'OCR / VLM', 'Docker',
    ],
    github: null,
    demo: null,
    problem:
      'Finance teams and CA firms receive statutory notices from GST, IT, MCA, RBI, and SEBI in inconsistent formats and on unforgiving deadlines. Missing one is expensive. Tracking them manually across clients does not scale.',
    solution:
      'A system that ingests notices from email, OCRs them, classifies and risk-scores each one, tracks its deadline, and drafts a response that moves through a four-stage human approval chain before anything is sent.',
    architecture:
      'PostgreSQL provides both full-text search and pgvector similarity, combined through Reciprocal Rank Fusion for hybrid retrieval — keyword recall for statute references, semantic recall for paraphrased obligations. A separate OCR service runs a vision-language model with Tesseract fallback. Alembic manages schema migrations. An eight-agent copilot handles classification, risk scoring, and drafting, with RBAC and MFA over a multi-tenant data model.',
    features: [
      'Hybrid RRF retrieval over full-text and vector indexes',
      'Gmail ingestion with automatic notice classification',
      'Deadline tracking with .ics calendar export',
      'Four-stage approval chain before any response is sent',
      'Eight-agent AI copilot for classification, scoring, and drafting',
      'Multi-tenant RBAC with MFA',
    ],
    challenges: [
      'Pure vector search failed on this corpus — statutory notices reference exact section numbers that embeddings blur away. Combining full-text and vector rankings through RRF recovered the precision that semantic search alone lost.',
      'OCR quality on scanned and photographed notices varies enormously, requiring a VLM primary with a classical fallback.',
    ],
    impact:
      'The second-largest system I have built, with a structured backend test suite and full product design documentation.',
  },
  {
    id: 'speech-analysis',
    title: 'Real-Time Speech Platform',
    icon: 'Mic',
    featured: false,
    status: 'Complete',
    shortDesc:
      'Streaming speech-to-text and neural TTS over WebSockets, with word-level confidence and subtitle export.',
    techStack: ['FastAPI', 'WebSockets', 'PyTorch', 'Whisper', 'Edge-TTS', 'React', 'TypeScript', 'Docker'],
    github: 'https://github.com/karthiksuru06/speech-analysis',
    demo: null,
    problem:
      'Most transcription tools are batch: you upload a file and wait. Live captioning and interactive voice applications need streaming transcription with usable confidence signals, which is a meaningfully harder engineering problem.',
    solution:
      'A bidirectional WebSocket pipeline streaming microphone audio into Whisper for incremental transcription, with word-level confidence surfaced to the UI, plus streaming neural TTS in the other direction.',
    architecture:
      'FastAPI handles WebSocket connections and streams audio chunks into a Whisper inference loop, emitting partial transcripts as they stabilise. Edge-TTS provides ten neural voices with streaming synthesis so playback starts before generation completes. A React and TypeScript frontend renders live transcripts with per-word confidence shading. Docker Compose covers dev and prod.',
    features: [
      'Live microphone transcription with word-level confidence',
      'SRT and VTT subtitle export',
      'Ten neural TTS voices with streaming synthesis',
      'Document-to-audio conversion',
      'Backend integration test suite',
    ],
    challenges: [
      'Chunk-boundary handling in streaming transcription — naive chunking truncates words at the seam, so the buffer has to overlap and reconcile partial hypotheses as they stabilise.',
      'Keeping perceived latency low enough that streamed synthesis feels responsive rather than stuttering.',
    ],
    impact:
      'One of the few projects here with real integration tests covering the WebSocket pipeline end to end.',
  },
  {
    id: 'neural-style',
    title: 'Neural Style Studio',
    icon: 'Palette',
    featured: false,
    status: 'Complete',
    shortDesc:
      'Photo-to-artwork style transfer with two quality modes and a fine-tuned art-style classifier.',
    techStack: ['PyTorch', 'VGG19', 'AdaIN', 'EfficientNet-B3', 'Flask', 'React 19', 'Docker', 'Nginx'],
    github: 'https://github.com/karthiksuru06/art-style-transfer',
    demo: null,
    problem:
      'Classical Gatys-style optimisation produces excellent style transfer but takes far too long for interactive use. Fast feed-forward methods are responsive but lower quality. Forcing a single trade-off on every user is the wrong design.',
    solution:
      'Two modes behind one interface: a VGG19 optimisation path for quality when the user can wait, and an AdaIN feed-forward path for near-instant results. Alongside them, an EfficientNet-B3 classifier fine-tuned on WikiArt identifies the artistic style of an uploaded image.',
    architecture:
      'A PyTorch backend serves both transfer paths behind Flask. The classifier is an EfficientNet-B3 fine-tuned on WikiArt across 24 style classes, reaching 60.1% top-1 accuracy — respectable given how genuinely ambiguous the boundaries between art movements are. React 19 with Vite, Tailwind, and Zustand handles the frontend. Docker Compose with Nginx fronts the deployment, and the training pipeline is versioned separately from the app.',
    features: [
      'Quality mode: VGG19 Gatys-style optimisation',
      'Fast mode: AdaIN feed-forward transfer',
      'EfficientNet-B3 style classifier across 24 WikiArt classes',
      'Separately versioned training pipeline with a model registry',
      'Dockerised deployment behind Nginx',
    ],
    challenges: [
      'Art-style classification has genuinely fuzzy class boundaries — late Impressionism and early Post-Impressionism overlap in ways that cap achievable accuracy, so 60.1% across 24 classes is closer to the practical ceiling than it first sounds.',
      'Keeping model weights out of the application repo while preserving reproducibility, which is what the model registry exists for.',
    ],
    impact:
      'Trained models, a documented registry, and a containerised full-stack application — end to end rather than a notebook.',
  },
  {
    id: 'mirnet',
    title: 'TME-MIRNet-v2',
    icon: 'Aperture',
    featured: false,
    status: 'Research',
    shortDesc:
      'Low-light video enhancement adding temporal consistency and illumination-guided attention to MIRNet-v2.',
    techStack: ['PyTorch', 'ConvLSTM', 'OpenCV', 'torchvision', 'NumPy'],
    github: 'https://github.com/karthiksuru06/Mirnet',
    demo: null,
    problem:
      'MIRNet-v2 enhances low-light images well but operates frame by frame. Applied to video, that independence causes visible flicker: consecutive frames get enhanced slightly differently, and the eye picks it up immediately.',
    solution:
      'Two additions to the architecture — a ConvLSTM module that propagates state across frames to enforce temporal consistency, and an illumination-guided attention mechanism that concentrates capacity on the genuinely underexposed regions instead of spending it uniformly.',
    architecture:
      'Built on MIRNet-v2 in PyTorch. The ConvLSTM layer carries hidden state between frames so enhancement decisions stay coherent over time. Training uses a hybrid objective combining VGG19 perceptual loss, Charbonnier reconstruction loss, and SSIM — perceptual quality and pixel fidelity pull in different directions, and the combination balances them. Separate scripts handle training, evaluation, and video inference.',
    features: [
      'ConvLSTM temporal consistency across video frames',
      'Illumination-guided attention targeting underexposed regions',
      'Hybrid VGG19 perceptual + Charbonnier + SSIM loss',
      'PSNR and SSIM evaluation against baseline MIRNet-v2',
      'Dedicated video inference pipeline',
    ],
    challenges: [
      'Temporal consistency and per-frame sharpness trade off directly — over-weighting the temporal term smears motion, under-weighting it brings the flicker back.',
      'Evaluating video enhancement meaningfully, since per-frame PSNR says nothing about the flicker the model was built to remove.',
    ],
    impact:
      'Trained, evaluated against baseline with PSNR/SSIM comparisons, and written up as an IEEE-format paper draft.',
  },
  {
    id: 'veritas',
    title: 'Veritas',
    icon: 'ShieldCheck',
    featured: false,
    status: 'Live',
    shortDesc:
      'Cognitive security tool that flags emotional manipulation, urgency framing, and bias in text.',
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Google Cloud Vision'],
    github: 'https://github.com/karthiksuru06/veritas',
    demo: 'https://veritas-nine-rose.vercel.app',
    problem:
      'Manipulative content rarely announces itself. Clickbait, manufactured urgency, and emotional framing work precisely because readers process them without noticing the technique being used.',
    solution:
      'Paste text or upload a screenshot and get back a breakdown of the persuasion techniques present — emotional manipulation, urgency framing, loaded language, and bias — so the reader can see the mechanism rather than just feel its effect.',
    architecture:
      'A MERN application: React frontend, Express API, MongoDB for persistence. Screenshot input runs through Google Cloud Vision OCR before analysis, so the same NLP path handles both typed and captured text. Deployed on Vercel.',
    features: [
      'Text and screenshot input via Cloud Vision OCR',
      'Detection of emotional manipulation and urgency framing',
      'Clickbait and bias indicators',
      'Deployed and publicly accessible',
    ],
    challenges: [
      'Persuasion is not inherently manipulation — the hard part is flagging technique without moralising about every piece of ordinary persuasive writing.',
    ],
    impact:
      'Live and publicly usable, with deployment and security-review documentation alongside the code.',
  },
  {
    id: 'instaaid',
    title: 'Instaaid',
    icon: 'Siren',
    featured: false,
    status: 'Team project',
    shortDesc:
      'Shipped Android safety app — shake-to-alert, live location sharing, released as a signed APK.',
    techStack: [
      'React Native', 'Expo SDK 54', 'TypeScript', 'Node.js', 'Express',
      'Firebase Auth', 'Firestore', 'Sentry', 'EAS Build',
    ],
    github: 'https://github.com/karthiksuru06/insta-aid',
    demo: 'https://instaaid-frontend.vercel.app',
    problem:
      'In an emergency the useful action is getting your location to people who can help — immediately, and ideally without unlocking a phone and navigating a UI. Most safety apps ask for too many taps at exactly the moment you cannot spare them.',
    solution:
      'An Android app that shares live location with designated contacts and fires emergency alerts with minimal interaction, including a shake gesture that works from the background. Real-time sync means contacts see updates as they happen rather than on a refresh.',
    architecture:
      'React Native on Expo SDK 54 with expo-router and TypeScript, including a custom native module for background shake detection — the off-the-shelf options do not survive Android backgrounding. An Express backend secured with Firebase JWT handles alert routing; Firebase Auth covers identity and Firestore listeners push location updates without polling. Sentry provides crash reporting, and builds ship through EAS. The backend runs on Render and the download site on Vercel.',
    features: [
      'Shake-to-alert via a custom native background module',
      'Live location sharing with designated emergency contacts',
      'SMS alerting to contacts',
      'Google Sign-In and Firebase authentication with role support',
      'Sentry crash reporting and internationalisation',
      'Signed release build distributed through GitHub Releases',
    ],
    challenges: [
      'Android aggressively restricts background execution for battery and privacy reasons, so shake detection needed a custom native module rather than a JavaScript listener that the OS suspends.',
      'The release APK is ~147 MB, which broke static hosting on Vercel via Git LFS pointers. Moving distribution to GitHub Releases fixed downloads — a deployment problem rather than a code one, and the kind that only shows up once real users try to install.',
    ],
    impact:
      'Actually shipped: signed APK and AAB, Play Store submission docs, a device validation report, and a release review. Distribution is live.',
  },
]
