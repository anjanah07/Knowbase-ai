import { embed } from "@/lib/ai";
import { chunkText, fetchTextFromUrl } from "@/lib/chunk";
import { db } from "@/lib/db";
import "dotenv/config";
import { ca } from "zod/locales";
const runOnce = async () => {
  const job = await db.job.findFirst({
    where: { status: "QUEUED", type: "INGEST_DOCUMENT" },
    orderBy: { createdAt: "asc" },
  });
  if (!job) return;
  await db.job.update({ where: { id: job.id }, data: { status: "RUNNING" } });
  try {
    const { documentId } = job.payload as any as { documentId: string };
    const doc = await db.document.findUnique({ where: { id: documentId } });
    if (!doc) throw new Error("Document not found");
    const text = await fetchTextFromUrl(doc.bytesUrl);
    const chunks = chunkText(text);
    for (let i = 0; i < chunks.length; i++) {
      const emb = await embed(chunks[i]);

      await db.$executeRawUnsafe(
        `INSERT INTO "Chunk" ("id","tenantId","documentId","position","content","embedding_vec") VALUES (gen_random_uuid(),${doc.tenantId}, ${doc.id}, ${i}, ${chunks[i]}, ${emb})`
      );
      await db.document.update({
        where: { id: doc.id },
        data: { status: "READY", error: null },
      });

      await db.job.update({ where: { id: job.id }, data: { status: "DONE" } });
    }
  } catch (e: any) {
    console.error(e);
    await db.job.update({
      where: { id: job.id },
      data: {
        status: "FAILED",
        error: e.message?.slice(0, 500) ?? "error",
        attempts: { increment: 1 },
      },
    });
  }
};
async function main() {
  while (true) {
    await runOnce();
    await new Promise((r) => setTimeout(r, 2000));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
