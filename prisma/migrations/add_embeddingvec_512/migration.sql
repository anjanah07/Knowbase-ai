-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Drop old index if exists
DROP INDEX IF EXISTS chunk_embedding_idx;

-- Drop and recreate embedding_vec column
ALTER TABLE "Chunk" DROP COLUMN IF EXISTS embedding_vec;
ALTER TABLE "Chunk" ADD COLUMN embedding_vec vector(1024);

-- Recreate index
CREATE INDEX chunk_embedding_idx
ON "Chunk" USING ivfflat (embedding_vec vector_cosine_ops)
WITH (lists = 100);

ANALYZE "Chunk";