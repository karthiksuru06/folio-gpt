-- Enable the pgvector extension to work with embeddings
create extension if not exists vector;

-- Create the table to store our RAG chunks
create table if not exists public.rag_chunks (
  id bigint generated always as identity primary key,
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  embedding vector(384), -- 384 dimensions for all-MiniLM-L6-v2
  fts tsvector -- for keyword search
);

-- Create a GIN index on metadata for fast JSON queries
create index if not exists rag_chunks_metadata_idx on public.rag_chunks using gin (metadata);

-- Create a vector index (HNSW) for fast cosine similarity searches
create index if not exists rag_chunks_embedding_idx on public.rag_chunks using hnsw (embedding vector_cosine_ops);

-- Create a text search index for full-text keyword search
create index if not exists rag_chunks_fts_idx on public.rag_chunks using gin (fts);

-- Create a trigger function to automatically update the fts (full-text search) column when content is inserted or updated
create or replace function public.rag_chunks_update_fts()
returns trigger as $$
begin
  new.fts := to_tsvector('english', new.content) || to_tsvector('spanish', new.content);
  return new;
end;
$$ language plpgsql;

-- Set up the trigger on insert/update of rag_chunks
create or replace trigger rag_chunks_update_fts_trigger
before insert or update on public.rag_chunks
for each row execute function public.rag_chunks_update_fts();

-- Create the hybrid_search function to combine semantic cosine similarity and full-text ranking
create or replace function public.hybrid_search(
  query_text text,
  query_embedding vector(384),
  match_count int,
  semantic_weight double precision,
  keyword_weight double precision
)
returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity double precision
)
language plpgsql
as $$
begin
  return query
  with semantic_search as (
    select
      r.id,
      1 - (r.embedding <=> query_embedding) as similarity
    from public.rag_chunks r
    order by r.embedding <=> query_embedding
    limit match_count * 2
  ),
  keyword_search as (
    select
      r.id,
      ts_rank_cd(r.fts, plainto_tsquery('english', query_text)) + ts_rank_cd(r.fts, plainto_tsquery('spanish', query_text)) as rank
    from public.rag_chunks r
    where r.fts @@ plainto_tsquery('english', query_text)
       or r.fts @@ plainto_tsquery('spanish', query_text)
    order by rank desc
    limit match_count * 2
  )
  select
    r.id,
    r.content,
    r.metadata,
    coalesce(s.similarity, 0.0) * semantic_weight + coalesce(k.rank, 0.0) * keyword_weight as similarity
  from public.rag_chunks r
  left join semantic_search s on r.id = s.id
  left join keyword_search k on r.id = k.id
  where s.id is not null or k.id is not null
  order by similarity desc
  limit match_count;
end;
$$;
