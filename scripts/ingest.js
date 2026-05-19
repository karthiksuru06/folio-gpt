import ts from 'typescript';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(projectRoot, '.env.local') });
dotenv.config({ path: path.join(projectRoot, '.env') });

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  HUGGINGFACE_API_KEY
} = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in env variables.");
  process.exit(1);
}

if (!HUGGINGFACE_API_KEY) {
  console.warn("Warning: HUGGINGFACE_API_KEY is not set. Make sure HuggingFace Inference API key is supplied.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const ARTICLE_SLUGS = {
  'n8n-for-pms':          { es: 'n8n-para-pms', en: 'n8n-for-pms' },
  'jacobo':               { es: 'agente-ia-jacobo', en: 'ai-agent-jacobo' },
  'business-os':          { es: 'business-os-para-airtable', en: 'business-os-for-airtable' },
  'programmatic-seo':     { es: 'seo-programatico', en: 'programmatic-seo' },
  'self-healing-chatbot': { es: 'chatbot-que-se-cura-solo', en: 'self-healing-chatbot' },
  'career-ops':          { es: 'career-ops', en: 'career-ops-system' },
};

const ARTICLE_ROUTES = {
  'n8n-for-pms':          { page_path_es: '/n8n-para-pms', page_path_en: '/n8n-for-pms' },
  'jacobo':               { page_path_es: '/agente-ia-jacobo', page_path_en: '/ai-agent-jacobo' },
  'business-os':          { page_path_es: '/business-os-para-airtable', page_path_en: '/business-os-for-airtable' },
  'programmatic-seo':     { page_path_es: '/seo-programatico', page_path_en: '/programmatic-seo' },
  'self-healing-chatbot': { page_path_es: '/chatbot-que-se-cura-solo', page_path_en: '/self-healing-chatbot' },
  'career-ops':          { page_path_es: '/career-ops', page_path_en: '/career-ops-system' },
};

// 6 files to ingest
const ARTICLES_REGISTRY = [
  { id: 'n8n-for-pms', i18nFile: 'src/n8n-i18n.ts', exportName: 'n8nContent' },
  { id: 'jacobo', i18nFile: 'src/jacobo-i18n.ts', exportName: 'jacoboContent' },
  { id: 'business-os', i18nFile: 'src/business-os-i18n.ts', exportName: 'businessOsContent' },
  { id: 'programmatic-seo', i18nFile: 'src/pseo-i18n.ts', exportName: 'pseoContent' },
  { id: 'self-healing-chatbot', i18nFile: 'src/chatbot-i18n.ts', exportName: 'chatbotContent' },
  { id: 'career-ops', i18nFile: 'src/career-ops-i18n.ts', exportName: 'careerOpsContent' },
];

/**
 * Transpiles a TS file to JS and returns evaluated module
 */
async function loadTsFile(filePath, exportName) {
  const absolutePath = path.resolve(projectRoot, filePath);
  const tsContent = fs.readFileSync(absolutePath, 'utf8');

  // Strip types and export const
  const jsOutput = ts.transpileModule(tsContent, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      removeComments: true,
    }
  }).outputText;

  // Save as a temporary .js file to import it
  const tempFileDir = path.join(projectRoot, 'scripts');
  if (!fs.existsSync(tempFileDir)) {
    fs.mkdirSync(tempFileDir, { recursive: true });
  }
  const tempFileName = `temp-${exportName}-${Date.now()}.js`;
  const tempFilePath = path.join(tempFileDir, tempFileName);

  fs.writeFileSync(tempFilePath, jsOutput, 'utf8');

  try {
    const imported = await import(`file://${tempFilePath}`);
    return imported[exportName];
  } finally {
    // Ensure clean up
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
}

/**
 * Helper to fetch embeddings from HuggingFace
 */
async function getEmbedding(text) {
  const url = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${HUGGINGFACE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: text })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HuggingFace API error: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  if (Array.isArray(result) && Array.isArray(result[0])) {
    return result[0];
  }
  return result;
}

/**
 * Extract semantic chunks from content object
 */
function extractChunks(obj, articleId, lang) {
  const chunks = [];
  const slugs = ARTICLE_SLUGS[articleId] || { es: articleId, en: articleId };
  const routes = ARTICLE_ROUTES[articleId] || { page_path_es: '/' + slugs.es, page_path_en: '/' + slugs.en };

  const baseMeta = {
    article_id: articleId,
    lang: lang,
    page_path_en: routes.page_path_en,
    page_path_es: routes.page_path_es,
    article_slug_en: slugs.en,
    article_slug_es: slugs.es
  };

  // 1. Intro chunk
  let introText = "";
  if (obj.header) {
    if (obj.header.h1) introText += `Title: ${obj.header.h1}\n`;
    if (obj.header.subtitle) introText += `Subtitle: ${obj.header.subtitle}\n`;
  }
  if (obj.tldr) {
    introText += `TL;DR / Summary: ${obj.tldr}\n`;
  }
  if (obj.intro) {
    if (obj.intro.hook) introText += `Hook: ${obj.intro.hook}\n`;
    if (obj.intro.body) introText += `Overview: ${obj.intro.body}\n`;
  }
  if (introText.trim()) {
    chunks.push({
      content: introText.trim(),
      metadata: { ...baseMeta, section_id: 'intro', section_anchor: '#intro' }
    });
  }

  // 2. Sections
  if (obj.sections) {
    for (const [sectionKey, section] of Object.entries(obj.sections)) {
      if (!section || typeof section !== 'object') continue;

      const heading = section.heading || section.title || sectionKey;
      const sectionAnchor = `#${sectionKey}`;

      // Check for deep items (flows, decisions, lessons)
      if (sectionKey === 'e2eFlows' && Array.isArray(section.items)) {
        for (const item of section.items) {
          let itemText = `Section: ${heading}\n`;
          if (item.name) itemText += `Flow Name: ${item.name}\n`;
          if (item.trigger) itemText += `Trigger: ${item.trigger}\n`;
          if (item.summary) itemText += `Summary: ${item.summary}\n`;
          if (Array.isArray(item.details)) {
            itemText += `Details:\n` + item.details.map(d => `- ${d}`).join('\n');
          }
          if (Array.isArray(item.basesTouched)) {
            itemText += `\nBases/Modules: ${item.basesTouched.join(', ')}`;
          }
          chunks.push({
            content: itemText.trim(),
            metadata: { ...baseMeta, section_id: `flow-${sectionKey}-${(item.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, section_anchor }
          });
        }
        continue;
      }

      if (sectionKey === 'decisions' && Array.isArray(section.items)) {
        for (const item of section.items) {
          let itemText = `Architecture Decision Record (ADR):\n`;
          if (item.title) itemText += `Decision: ${item.title}\n`;
          if (item.detail) itemText += `Rationale: ${item.detail}\n`;
          chunks.push({
            content: itemText.trim(),
            metadata: { ...baseMeta, section_id: `adr-${sectionKey}-${(item.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, section_anchor }
          });
        }
        continue;
      }

      if (sectionKey === 'lessons' && Array.isArray(section.items)) {
        for (const item of section.items) {
          let itemText = `Lesson Learned:\n`;
          if (item.title) itemText += `Lesson: ${item.title}\n`;
          if (item.detail) itemText += `Description: ${item.detail}\n`;
          chunks.push({
            content: itemText.trim(),
            metadata: { ...baseMeta, section_id: `lesson-${sectionKey}-${(item.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, section_anchor }
          });
        }
        continue;
      }

      // Generic section format
      let sectionText = `Section: ${heading}\n`;
      if (section.body) sectionText += `${section.body}\n`;
      if (section.text) sectionText += `${section.text}\n`;

      if (Array.isArray(section.steps)) {
        sectionText += `Steps:\n` + section.steps.map(s => {
          if (typeof s === 'string') return `- ${s}`;
          const label = s.emoji || s.label || s.year || '';
          const text = s.text || s.event || '';
          const detail = s.detail || '';
          return `- ${label} ${text}${detail ? ': ' + detail : ''}`;
        }).join('\n');
      }
      if (Array.isArray(section.reasons)) {
        sectionText += `Details:\n` + section.reasons.map(r => {
          const key = r.tool || r.title || '';
          const val = r.issue || r.detail || '';
          return `- ${key}: ${val}`;
        }).join('\n');
      }
      if (Array.isArray(section.bases)) {
        sectionText += `Bases/Database Structure:\n` + section.bases.map(b => `- ${b.name}: ${b.desc}`).join('\n');
      }
      if (Array.isArray(section.savings)) {
        sectionText += `Savings:\n` + section.savings.map(s => `- Module: ${s.module} | Before: ${s.before} | After: ${s.after} | Monthly Saved: ${s.monthly}`).join('\n');
      }
      if (Array.isArray(section.items) && sectionKey !== 'e2eFlows') {
        sectionText += `Items:\n` + section.items.map(i => {
          if (typeof i === 'string') return `- ${i}`;
          const name = i.name || i.title || i.kind || '';
          const desc = i.desc || i.detail || i.role || '';
          return `- ${name}: ${desc}`;
        }).join('\n');
      }

      chunks.push({
        content: sectionText.trim(),
        metadata: { ...baseMeta, section_id: sectionKey, section_anchor }
      });
    }
  }

  // 3. FAQs
  if (obj.faq && Array.isArray(obj.faq.items)) {
    const heading = obj.faq.heading || "FAQ";
    for (const item of obj.faq.items) {
      if (!item.q || !item.a) continue;
      let faqText = `${heading} Item:\nQuestion: ${item.q}\nAnswer: ${item.a}`;
      chunks.push({
        content: faqText.trim(),
        metadata: { ...baseMeta, section_id: `faq-${item.q.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, section_anchor: '#faq' }
      });
    }
  }

  return chunks;
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  console.log("🚀 Starting folio-gpt RAG Ingestion Pipeline...");
  
  // 1. Clear existing table records
  console.log("🧹 Clearing old chunks in Supabase...");
  const { error: deleteError } = await supabase.from('rag_chunks').delete().neq('id', 0);
  if (deleteError) {
    console.error("❌ Error clearing database table:", deleteError.message);
    process.exit(1);
  }
  console.log("✅ Database table cleared.");

  const allChunks = [];

  // 2. Load files & extract chunks
  for (const article of ARTICLES_REGISTRY) {
    console.log(`📦 Loading and parsing ${article.i18nFile}...`);
    try {
      const content = await loadTsFile(article.i18nFile, article.exportName);
      
      if (content.es) {
        const esChunks = extractChunks(content.es, article.id, 'es');
        allChunks.push(...esChunks);
        console.log(`  - Extracted ${esChunks.length} Spanish chunks.`);
      }
      if (content.en) {
        const enChunks = extractChunks(content.en, article.id, 'en');
        allChunks.push(...enChunks);
        console.log(`  - Extracted ${enChunks.length} English chunks.`);
      }
    } catch (err) {
      console.error(`❌ Error parsing ${article.i18nFile}:`, err);
    }
  }

  console.log(`\n📚 Total chunks extracted: ${allChunks.length}`);
  console.log("⚡ Generating embeddings and uploading chunks sequentially to Supabase...\n");

  let successCount = 0;
  for (let i = 0; i < allChunks.length; i++) {
    const chunk = allChunks[i];
    const percentage = (((i + 1) / allChunks.length) * 100).toFixed(1);
    
    console.log(`[${percentage}%] Embedding chunk ${i + 1}/${allChunks.length} (Length: ${chunk.content.length})...`);
    
    try {
      const embedding = await getEmbedding(chunk.content);
      
      const { error: insertError } = await supabase.from('rag_chunks').insert({
        content: chunk.content,
        metadata: chunk.metadata,
        embedding: embedding
      });

      if (insertError) {
        console.error(`  ❌ Supabase insert error for chunk ${i + 1}:`, insertError.message);
      } else {
        successCount++;
      }
    } catch (err) {
      console.error(`  ❌ Error processing chunk ${i + 1}:`, err.message || err);
    }
    
    // 250ms delay between requests to be polite to the HuggingFace Inference API
    await delay(250);
  }

  console.log(`\n🎉 Ingestion completed! Successfully uploaded ${successCount}/${allChunks.length} chunks to Supabase.`);
}

main().catch(err => {
  console.error("FATAL Ingestion error:", err);
  process.exit(1);
});
