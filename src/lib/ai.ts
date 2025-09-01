import "dotenv/config";
export const embed = async (text: string): Promise<number[]> => {
  const res = await fetch("https://api.jina.ai/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.JINA_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "jina-embeddings-v3-small",
      input: [text], // batch of 1
    }),
  });

  const body = await res.text();
  if (!res.ok) {
    throw new Error(`Jina API ${res.status}: ${body.slice(0, 400)}`);
  }

  const data = JSON.parse(body);
  const vec = data?.data?.[0]?.embedding;
  if (!Array.isArray(vec)) {
    throw new Error(`Unexpected Jina response: ${body.slice(0, 200)}`);
  }
  return vec as number[];
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

  if (!res.ok) {
    throw new Error(`HuggingFace API error: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();

  return data[0]?.generated_text || "";
};
