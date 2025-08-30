CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE "Chunk"
ADD COLUMN embedding_vec vector(1536);

CREATE INDEX chunk_embedding_idx
ON "Chunk" USING ivfflat (embedding_vec vector_cosine_ops) WITH (lists = 100);

ANALYZE "Chunk";