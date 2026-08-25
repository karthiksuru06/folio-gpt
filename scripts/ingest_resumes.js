import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import mammoth from 'mammoth';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfParseModule = require('pdf-parse');
const pdfParse = typeof pdfParseModule === 'function' ? pdfParseModule : (pdfParseModule.default || pdfParseModule.PDFParse || pdfParseModule);

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

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function getEmbedding(text) {
  const url = "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction";
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

async function extractTextFromFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const buffer = fs.readFileSync(filePath);

  if (ext === '.pdf') {
    const data = await pdfParse(buffer);
    return data.text;
  } else if (ext === '.docx') {
    const data = await mammoth.extractRawText({ buffer });
    return data.value;
  }
  return null;
}

function chunkText(text, filename) {
  // Chunk by paragraphs, preserving around 800-1000 characters per chunk
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 10);
  
  const chunks = [];
  let currentChunk = "";
  for (const para of paragraphs) {
    if (currentChunk.length + para.length > 800) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = para + "\n";
    } else {
      currentChunk += para + "\n";
    }
  }
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks.map((c, i) => ({
    content: `Resume Data (${filename}):\n\n${c}`,
    metadata: {
      source: 'resume_raw',
      domain: filename,
      article_id: 'resume',
      section_id: `chunk-${i}`,
      section_anchor: '',
    }
  }));
}

async function main() {
  const resumesDir = path.resolve(projectRoot, '..', 'resumes');
  console.log("Looking for resumes in:", resumesDir);

  if (!fs.existsSync(resumesDir)) {
    console.error("Resumes directory not found.");
    return;
  }

  const files = fs.readdirSync(resumesDir).filter(f => f.endsWith('.pdf') || f.endsWith('.docx'));
  
  let allChunks = [];
  for (const file of files) {
    console.log(`Processing ${file}...`);
    const filePath = path.join(resumesDir, file);
    try {
      const text = await extractTextFromFile(filePath);
      if (text) {
        const chunks = chunkText(text, file);
        allChunks.push(...chunks);
        console.log(`  -> Generated ${chunks.length} chunks from ${file}`);
      }
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }

  console.log(`\n📚 Total chunks extracted: ${allChunks.length}`);

  let successCount = 0;
  for (let i = 0; i < allChunks.length; i++) {
    const chunk = allChunks[i];
    console.log(`Embedding chunk ${i + 1}/${allChunks.length}...`);
    
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
    
    await delay(300);
  }

  console.log(`\n🎉 Resume Ingestion completed! Successfully uploaded ${successCount}/${allChunks.length} chunks to Supabase.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
