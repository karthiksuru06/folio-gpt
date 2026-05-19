# folio-gpt

An edge-native, production-grade interactive AI portfolio with an intelligent chatbot powered by **OpenRouter (Llama 3.3 70B)**, a high-performance **HuggingFace (all-MiniLM-L6-v2)** semantic embedding pipeline, and a **Supabase pgvector** vector store. 

Adapted from the open-source `cv-santiago` project and personalized into a fast, modern portfolio featuring rich case studies, interactive UI elements, and robust prompt injection guards.

---

## 🚀 Key Features

- **🧠 OpenRouter Llama 3.3 Chatbot** — Powered by the highly capable `meta-llama/llama-3.3-70b-instruct:free` model. Streams responses using SSE (Server-Sent Events) over Vercel Edge.
- **⚡ Semantic RAG Search** — Converts user queries on-the-fly using the HuggingFace Inference API (`all-MiniLM-L6-v2`) into 384-dimension vectors, executing similarity searches directly via Supabase pgvector RPCs.
- **🛡️ 6-Layer Security Defense** — Built-in protection against prompt injection, jailbreaking, and system extraction via fingerprinting, canary tokens, and keyword filters.
- **✨ Bilingual Content (EN/ES)** — Full translations for both languages across core pages, chatbot prompts, and technical case studies.
- **📈 Built for Production** — Built with React 19, Vite, TypeScript, and Tailwind CSS. Extremely lightweight, optimized for fast hydration and edge rendering.

---

## 🛠️ Architecture

```
User Message → FloatingChat.tsx → api/chat.js (Vercel Edge)
                                   ├── Security & Canary Check
                                   ├── RAG Ingestion Pipeline (if matches):
                                   │     ├── HuggingFace API (all-MiniLM-L6-v2 384-dim embedding)
                                   │     └── Supabase pgvector RPC (hybrid semantic + text search)
                                   └── OpenRouter Chat API (meta-llama/llama-3.3-70b-instruct:free)
```

---

## 📂 Project Structure

```
├── api/
│   ├── chat.js                  # Main OpenRouter chatbot Edge function
│   └── _shared/
│       └── rag.js               # Shared RAG search utilities (HuggingFace + Supabase)
├── scripts/
│   └── ingest.js                # Document ingestion pipeline & embedding script
├── src/
│   ├── App.tsx                  # Portfolio main app
│   ├── FloatingChat.tsx         # SSE streaming chat UI component
│   ├── main.tsx                 # Entrypoint, Router and recruiter console API
│   ├── i18n.ts                  # Localization keys and translations
│   ├── about-i18n.ts            # Detailed personal biography keys
│   └── [Articles]               # Detailed technical project case studies
├── supabase_schema.sql          # Supabase SQL to initialize pgvector and search RPCs
├── vercel.json                  # Serverless routes and Edge configurations
└── package.json                 # Build commands and package dependencies
```

---

## 📦 Getting Started

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd folio-gpt
npm install
```

### 2. Configure Supabase

Run the SQL script `supabase_schema.sql` inside your Supabase SQL Editor. This will:
1. Enable `pgvector` extension.
2. Create the `documents` table with a `384` dimension vector column.
3. Set up the Hybrid Search RPC function.

### 3. Setup Environment Variables

Create a `.env` or `.env.local` file in the root of the project:

```env
# RAG - Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# HuggingFace API Key
HUGGINGFACE_API_KEY=your-huggingface-api-token

# OpenRouter API Key
OPENROUTER_API_KEY=your-openrouter-api-key
```

### 4. Run Ingestion Script

Embed and upload your portfolio content to Supabase using the built-in RAG ingestion engine:

```bash
npm run rag:ingest
```

### 5. Start Development Server

```bash
npm run dev
```

Your local interactive portfolio is now running at `http://localhost:5173`.

---

## 🚀 Deploying to Vercel

1. Push this clean repository to GitHub.
2. Connect your repository to **Vercel**.
3. Add the following **Environment Variables** in Vercel settings:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `HUGGINGFACE_API_KEY`
   - `OPENROUTER_API_KEY`
4. Deploy! Your interactive AI portfolio is live.

---

## 📄 License

MIT
