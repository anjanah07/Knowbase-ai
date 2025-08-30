import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mime, z } from "zod";
export const runtime = "nodejs";
const schema = z.object({
  tenantSlug: z.string().min(1),
  title: z.string().min(1),
  bytesUrl: z.url(),
  mimeType: z.string().default("text/plain"),
});
export const POST = async (req: NextRequest) => {
  const body = schema.parse(req.json());
  const tenant = await db.tenant.findUnique({
    where: { slug: body.tenantSlug },
  });
  if (!tenant)
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });

  const doc = await db.document.create({
    data: {
      tenantId: tenant.id,
      title: body.title,
      bytesUrl: body.bytesUrl,
      mimeType: body.mimeType,
      status: "PENDING",
    },
  });
  await db.job.create({
    data: {
      tenantId: tenant.id,
      type: "INGEST_DOCUMENT",
      payload: {
        documentId: doc.id,
      },
    },
  });
  return NextResponse.json({ ok: true, documentId: doc.id });
};
