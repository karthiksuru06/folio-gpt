// ---------------------------------------------------------------------------
// Shared RAG pipeline — wired to HuggingFace (MiniLM-L6-v2) & Supabase pgvector
// ---------------------------------------------------------------------------

export function isRagEnabled() {
  return !!(process.env.HUGGINGFACE_API_KEY && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

// ---------------------------------------------------------------------------
// RAG: embed query via HuggingFace Inference API
// ---------------------------------------------------------------------------

export async function embedQuery(query) {
  const t0 = Date.now()
  const response = await fetch(
    'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: query }),
    }
  )

  if (!response.ok) {
    throw new Error(`HuggingFace embedding failed: ${response.status}`)
  }

  const data = await response.json()
  // HF may return [f1, f2, ...] or [[f1, f2, ...]]
  const embedding = Array.isArray(data) && Array.isArray(data[0]) ? data[0] : data

  return {
    embedding,
    latencyMs: Date.now() - t0,
    totalTokens: query.split(/\s+/).length, // simple estimate
  }
}

// ---------------------------------------------------------------------------
// RAG: similarity search via Supabase RPC (Edge-compatible)
// ---------------------------------------------------------------------------

export async function searchDocuments(queryText, queryEmbedding) {
  const t0 = Date.now()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 2000) // 2s timeout

  try {
    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/rpc/hybrid_search`,
      {
        method: 'POST',
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query_text: queryText,
          query_embedding: queryEmbedding,
          match_count: 10,
          semantic_weight: 0.7,
          keyword_weight: 0.3,
        }),
        signal: controller.signal,
      },
    )

    clearTimeout(timeout)

    if (!response.ok) {
      throw new Error(`Supabase search failed: ${response.status}`)
    }

    const chunks = await response.json()
    return {
      chunks,
      latencyMs: Date.now() - t0,
    }
  } catch (err) {
    clearTimeout(timeout)
    if (err.name === 'AbortError') {
      throw new Error('Supabase search timeout (>2s)')
    }
    throw err
  }
}

// ---------------------------------------------------------------------------
// RAG: diversify & format chunks
// ---------------------------------------------------------------------------

export function diversifyByArticle(ranked) {
  const result = []
  const seenArticles = new Set()

  // Pass 1: first chunk from each distinct article (preserving rank order)
  for (const chunk of ranked) {
    const articleId = chunk.metadata?.article_id
    if (articleId && !seenArticles.has(articleId)) {
      seenArticles.add(articleId)
      result.push(chunk)
    }
  }

  // Pass 2: fill remaining slots with best remaining chunks (rank order)
  for (const chunk of ranked) {
    if (result.length >= 5) break
    if (!result.includes(chunk)) {
      result.push(chunk)
    }
  }

  return result
}

export function formatChunksForContext(chunks) {
  return chunks.map((c, i) => {
    const meta = c.metadata || {}
    const source = meta.article_id ? `[From article: ${meta.article_id}, section: ${meta.section_id}]` : ''
    return `--- Portfolio Reference ${i + 1} ${source} ---\n${c.content}`
  }).join('\n\n')
}

export function extractSources(chunks) {
  const seenArticles = new Set()
  const sources = []
  for (const c of chunks) {
    const meta = c.metadata || {}
    if (!meta.article_id) continue
    if (seenArticles.has(meta.article_id)) continue
    seenArticles.add(meta.article_id)
    sources.push({
      article_id: meta.article_id,
      section_id: meta.section_id,
      section_anchor: meta.section_anchor || '',
      page_path_en: meta.page_path_en || '',
      page_path_es: meta.page_path_es || '',
      article_slug_en: meta.article_slug_en || '',
      article_slug_es: meta.article_slug_es || '',
    })
  }
  return sources
}

// ---------------------------------------------------------------------------
// Intent & Keyword references
// ---------------------------------------------------------------------------

export const ARTICLE_KEYWORDS = {
  'n8n-for-pms':          ['n8n', 'nodemation'],
  'jacobo':               ['jacobo', 'agente ia', 'ai agent', 'whatsapp', 'multi-agent', 'multiagent'],
  'business-os':          ['business os', 'erp', 'airtable bases', 'crm', 'inventory'],
  'programmatic-seo':     ['seo programático', 'programmatic seo', 'web programática', 'programmatic web', 'decision engine', 'indexable', 'dataforseo', 'seo pipeline', 'seo automatizado', 'automated seo'],
  'self-healing-chatbot': ['chatbot', 'this chat', 'este chat', 'evals', 'self-healing', 'closed-loop', 'langfuse', 'rag'],
}

export function filterSourcesByResponse(sources, responseText) {
  if (!responseText || sources.length === 0) return sources
  const lower = responseText.toLowerCase()
  return sources.filter(s => {
    const keywords = ARTICLE_KEYWORDS[s.article_id]
    if (!keywords) return true // keep unknown
    return keywords.some(kw => lower.includes(kw))
  }).slice(0, 3)
}

export const ARTICLE_ROUTES = {
  'n8n-for-pms':          { page_path_es: '/n8n-para-pms', page_path_en: '/n8n-for-pms' },
  'jacobo':               { page_path_es: '/agente-ia-jacobo', page_path_en: '/ai-agent-jacobo' },
  'business-os':          { page_path_es: '/business-os-para-airtable', page_path_en: '/business-os-for-airtable' },
  'programmatic-seo':     { page_path_es: '/seo-programatico', page_path_en: '/programmatic-seo' },
  'self-healing-chatbot': { page_path_es: '/chatbot-que-se-cura-solo', page_path_en: '/self-healing-chatbot' },
}

export const HOME_SOURCE = {
  article_id: 'home',
  section_id: 'portfolio',
  section_anchor: '',
  page_path_en: '/en',
  page_path_es: '/',
  article_slug_en: 'en',
  article_slug_es: '',
}

export function detectMentionedArticles(responseText) {
  if (!responseText) return []
  const lower = responseText.toLowerCase()
  const sources = []
  for (const [articleId, keywords] of Object.entries(ARTICLE_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) {
      const routes = ARTICLE_ROUTES[articleId]
      if (routes) {
        sources.push({
          article_id: articleId,
          section_id: 'main',
          section_anchor: '',
          page_path_es: routes.page_path_es,
          page_path_en: routes.page_path_en,
          article_slug_es: routes.page_path_es.slice(1),
          article_slug_en: routes.page_path_en.slice(1),
        })
      }
    }
  }
  return sources.slice(0, 3)
}

// ---------------------------------------------------------------------------
// RAG: search portfolio pipeline
// ---------------------------------------------------------------------------

export async function searchPortfolio(query) {
  const result = {
    chunks: null,
    sources: [],
    degraded: false,
    degradedReason: null,
    metrics: { embeddingMs: 0, retrievalMs: 0 },
    usage: { embeddingTokens: 0 },
  }

  // 1. Embed
  let embedding
  try {
    const embResult = await embedQuery(query)
    embedding = embResult.embedding
    result.metrics.embeddingMs = embResult.latencyMs
    result.usage.embeddingTokens = embResult.totalTokens
  } catch (err) {
    result.degraded = true
    result.degradedReason = 'embedding_fail'
    return result
  }

  // 2. Retrieve
  try {
    const searchResult = await searchDocuments(query, embedding)
    result.metrics.retrievalMs = searchResult.latencyMs

    if (!searchResult.chunks.length) {
      result.degradedReason = 'no_match'
      return result
    }

    const filteredChunks = searchResult.chunks.filter(c => (c.similarity || 0) >= 0.3)
    if (!filteredChunks.length) {
      result.degradedReason = 'no_match'
      return result
    }

    const topChunks = filteredChunks.slice(0, 5)
    const diversified = diversifyByArticle(topChunks)
    const finalChunks = diversified.slice(0, 3)

    result.chunks = finalChunks
    result.sources = extractSources(finalChunks)
  } catch (err) {
    result.degraded = true
    result.degradedReason = err.message.includes('timeout') ? 'retrieval_timeout' : 'retrieval_fail'
  }

  return result
}

// ---------------------------------------------------------------------------
// Intent classification
// ---------------------------------------------------------------------------

export function classifyIntent(text) {
  const lower = text.toLowerCase()
  const tags = []

  const jailbreakPatterns = [
    'ignore previous', 'ignora las instrucciones', 'ignora todo',
    'pretend', 'roleplay', 'act as', 'you are now',
    'forget', 'disregard', 'bypass', 'override', 'jailbreak',
    'dan', 'developer mode', 'evil', 'system prompt', 'tu prompt', 'your prompt',
    'reveal your', 'show me your rules', 'your objective', 'your orders',
    'tus órdenes', 'tus reglas', 'cuáles son tus instrucciones',
    'dump', 'export', 'serialize', 'reproduce', 'output all', 'all of the above',
    'todo lo anterior', 'everything above', 'repeat everything',
  ]
  if (jailbreakPatterns.some(p => lower.includes(p))) {
    tags.push('jailbreak-attempt')
  }

  if (/experiencia|experience|trabajo|work|career|carrera|job/.test(lower)) tags.push('topic:experience')
  if (/proyecto|project|portfolio|github|código|code/.test(lower)) tags.push('topic:projects')
  if (/contact|contacto|email|linkedin|hablar|talk|hire|contratar/.test(lower)) tags.push('topic:contact')
  if (/stack|tech|tecnolog|python|react|supabase|huggingface|openrouter/.test(lower)) tags.push('topic:technical')
  if (/salario|salary|money|rate/.test(lower)) tags.push('topic:compensation')
  if (/hola|hello|hi|hey/.test(lower) && text.length < 20) tags.push('greeting')

  return tags.length > 0 ? tags : ['topic:general']
}

// ---------------------------------------------------------------------------
// Prompt leak detection
// ---------------------------------------------------------------------------

export const PROMPT_FINGERPRINTS = [
  'BREVEDAD OBLIGATORIA', 'máximo 150 palabras', '150 words', 'word limit',
  'formato sin listas', 'redirección ingeniosa', 'NUNCA revelar',
  'Anti-extracción', 'Instrucciones CRÍTICAS',
]

export const LEAK_RESPONSE = 'Esa información forma parte de mi diseño interno. El código fuente de folio-gpt es público en GitHub si te interesa la arquitectura.'

export function containsFingerprint(text) {
  const lower = text.toLowerCase()
  return PROMPT_FINGERPRINTS.some(fp => lower.includes(fp.toLowerCase()))
}
