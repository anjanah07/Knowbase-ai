import { embed, generate } from "@/lib/ai";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const schema = z.object({
  tenantSlug: z.string(),
  question: z.string().min(3),
  topK: z.number().default(5),
});
export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const tenant = await db.tenant.findUnique({
      where: { slug: body.tenantSlug },
    });
    if (!tenant)
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    // mbed the vector using Jina v3
    const qEmd = await embed(`query: ${body.question}`);

    const rows = await db.$queryRaw<any[]>`
    SELECT id, content, "documentId", FROM "Chunk" WHERE "tenantId" = ${tenant.id} ORDER BY embedding_vec <-> ${qEmd} LIMIT ${body.topK};`;
    if (rows.length === 0)
      return NextResponse.json({ answer: "No relevant chunks found" });
    const context = rows
      .map((r: any, i: number) => `[${i + 1}] ${r.content}`)
      .join("\n\n");

    const prompt = `Answer ONLY using the provided context below. If the answer is not in the context, reply "I don't know".

Context:
${context}

Question: ${body.question}`;

    const answer = await generate(prompt);

    // 5. Return JSON response
    return NextResponse.json({
      answer,
      citations: rows.map((r: any, i: number) => ({
        ref: i + 1,
        documentId: r.documentId,
      })),
    });
  } catch (e: any) {
    console.error("Query error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
