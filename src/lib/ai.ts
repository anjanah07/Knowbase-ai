import "dotenv/config";
import { decode, encode } from "gpt-tokenizer";

export const embed = async (text: string): Promise<number[]> => {
  const tokens = encode(text);
  const safeTokens = tokens.slice(0, 8000);
  const safeText = decode(safeTokens);
  const res = await fetch("https://api.jina.ai/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.JINA_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "jina-embeddings-v3", // ✅ correct tag
      input: [safeText],
    }),
  });

  const body = await res.text();
  if (!res.ok) {
    throw new Error(`Jina API ${res.status}: ${body.slice(0, 400)}`);
  }

  const data = JSON.parse(body);
  return data?.data?.[0]?.embedding;
};
export const generate = async (prompt: string): Promise<string> => {
  const res = await fetch(
    "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 200, temperature: 0.7 },
      }),
    }
  );

  const body = await res.text();
  if (!res.ok) {
    throw new Error(
      `HF Mistral ${res.status} ${res.statusText}: ${body.slice(0, 400)}`
    );
  }

  const data = JSON.parse(body);
  return data[0]?.generated_text || "";
};
