import { requireMembershipBySlug } from "@/lib/guards";
import React from "react";
const upload = async (formData: FormData) => {
  "use server";
  const tenantSlug = String(formData.get("tenantSlug"));
  const title = String(formData.get("title"));
  const bytesUrl = String(formData.get("bytesUrl"));
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  await fetch(`${baseUrl}/api/rag/upload`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      tenantSlug,
      title,
      bytesUrl,
      mimeType: "text/plain", // for now, only text
    }),
  });
};
const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const ctx = await requireMembershipBySlug(slug);
  console.log("ctx", ctx);
  if (!ctx) return <div>Not authorized</div>;
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Upload a document</h1>
      <form action={upload} className="space-y-3">
        <input type="hidden" name="tenantSlug" value={slug} />
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            name="title"
            placeholder="My Document"
            className="border p-2 w-full rounded-xl"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold">File URL</label>
          <input
            name="bytesUrl"
            placeholder="https://example.com/sample.pdf"
            className="border p-2 w-full rounded-xl"
            required
          />
        </div>
        <button
          type="submit"
          className="px-3 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Enqueue Ingestion
        </button>
      </form>
      <p className="text-sm text-gray-500">
        Tip: For testing, paste a raw text file URL (e.g. GitHub Gist raw link).
      </p>
    </div>
  );
};

export default page;
