CREATE EXTENSION IF NOT EXISTS vector;

-- Drop index if it exists
DROP INDEX IF EXISTS chunk_embedding_idx;

-- If the column exists, alter it; if not, add it
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'Chunk' AND column_name = 'embedding_vec'
  ) THEN
    ALTER TABLE "Chunk" ALTER COLUMN embedding_vec TYPE vector(512);
  ELSE
    ALTER TABLE "Chunk" ADD COLUMN embedding_vec vector(512);
  END IF;
END $$;

-- Recreate index
CREATE INDEX IF NOT EXISTS chunk_embedding_idx
ON "Chunk" USING ivfflat (embedding_vec vector_cosine_ops)
WITH (lists = 100);

ANALYZE "Chunk";