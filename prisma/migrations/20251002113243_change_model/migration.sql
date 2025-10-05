/*
  Warnings:

  - You are about to drop the column `embedding_vec` on the `Chunk` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."chunk_embedding_idx";

-- AlterTable
ALTER TABLE "public"."Chunk" DROP COLUMN "embedding_vec";
