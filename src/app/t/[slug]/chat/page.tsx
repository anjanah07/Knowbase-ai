"use client";
import { useState } from "react";

export default function ChatPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const ask = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAnswer(null);

    const res = await fetch("/api/rag/query", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        tenantSlug: (await params).slug,
        question,
        topK: 5,
      }),
    });

    const data = await res.json();
    setLoading(false);
    setAnswer(data.answer || "Error: " + data.error);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">💬 Chat with your Documents</h1>

      <form className="space-y-3" onSubmit={ask}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask something about your docs ..."
          className="border p-2 w-full rounded"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded-md"
          disabled={loading}
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>

      {answer && (
        <div className="p-4 border rounded bg-gray-50">
          <strong>Answer :</strong>
          <p className="mt-2 whitespace-pre-line">{answer}</p>
        </div>
      )}
    </div>
  );
}
