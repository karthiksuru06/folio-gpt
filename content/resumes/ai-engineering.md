---
domain: ai-engineering
label: AI Engineer
summary: For AI Engineering, Applied AI, and LLM systems roles.
---

## Summary

AI Engineer building production LLM systems end to end — fine-tuning, retrieval,
serving, and the applications around them. Final-year CS student at KIET
Kakinada, graduating May 2027, with three research engagements at RCTS, IIIT
Hyderabad. I own the full lifecycle: dataset, fine-tune, quantise, serve, and
build the retrieval layer and interface on top.

## Experience

**Summer Research Intern — RCTS, IIIT Hyderabad** · Jun 2026
Extended machine learning pipelines for predictive analytics on social-impact
datasets. Built API interfaces for real-time data processing and analysis.

**Winter Research Intern — RCTS, IIIT Hyderabad** · Dec 2025
One-month intensive on applied ML and data pipeline engineering. Built the HTP
Test Analyzer: YOLOv11 feature detection feeding a FAISS retrieval layer that
grounds generated clinical reports in documented guidance rather than model
priors.

**Junior Developer — K-Hub, RCTS, IIIT Hyderabad** · Aug 2024 – Apr 2025
Nine months across the AI development lifecycle. Built ML models for predictive
analytics in social-impact projects and integrated API interfaces enabling
real-time data processing.

## Selected Projects

**BTech Mentor AI** — Fine-tuned Qwen2.5-3B with QLoRA via Unsloth, merged
adapters, quantised to GGUF, served locally through Ollama. RAG over student
syllabus PDFs using ChromaDB and nomic-embed-text. Fully offline: no API keys,
no per-token cost, no data leaving the device. Full LLM lifecycle, owned end to
end.

**Yukthi** — Governed AI growth engine for Indian SMBs. Agents rank growth
actions from first-party signals; a human approves before anything executes.
The approval gate is structural rather than a prompt instruction, because
prompt-level guardrails fail under adversarial input. FastAPI modular monolith,
PostgreSQL with pgvector, Redis, Celery, TEI embeddings on CPU to keep unit
economics viable. ~380 source files with tests, load tests, and a production
runbook.

**Compliance OS** — Multi-tenant compliance platform. Hybrid retrieval
combining PostgreSQL full-text and pgvector through Reciprocal Rank Fusion:
pure vector search blurred away exact statute references, so RRF recovered the
precision semantic search alone lost. Eight-agent copilot for classification,
risk scoring, and drafting. ~500 source files.

**This portfolio** — RAG chatbot on Vercel Edge: HuggingFace all-MiniLM-L6-v2
embeddings into Supabase pgvector, hybrid search, Llama 3.3 70B streamed over
SSE, with layered prompt-injection defence including per-request canary tokens.

## Technical Skills

**AI/LLM:** LLM integration and serving, prompt engineering, RAG, embeddings,
vector search, AI agents, context engineering, model evaluation, QLoRA
fine-tuning, GGUF quantisation, Ollama
**ML:** Python, PyTorch, scikit-learn, NumPy, Pandas, NLP, TF-IDF, entity
extraction, OpenCV, YOLO, MediaPipe, transfer learning
**Backend:** FastAPI, REST API design, async Python, Celery, JWT auth
**Data:** PostgreSQL, pgvector, ChromaDB, FAISS, MongoDB, Supabase
**Infra:** Docker, Git, GitHub Actions, Vercel, Linux, Bash

## Education

**B.Tech, Computer Science (Cybersecurity specialization)**
KIET Group of Institutions, Kakinada · Sep 2021 – May 2027

**Foundations of Machine Learning** — IIIT Hyderabad, 2024

## Open Source

Contributor to **OpenWISP**, working on the Firmware Upgrader module. Pull
requests currently under community review. Preparing a Google Summer of Code
proposal on network monitoring tooling.

## Awards

**Finalist, ANVAKRIT 2025** — national Crime Scene Investigation competition,
National Forensic Sciences University (NFSU)
**Winner** — college hackathon, KIET

## Contact

karthiksuru06@gmail.com · github.com/karthiksuru06 ·
linkedin.com/in/suru-karthik-923766321 · Visakhapatnam, India
