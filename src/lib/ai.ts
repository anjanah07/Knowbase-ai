import OpenAI from "openai";
const openAI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export const embed = async (text: string): Promise<number[]> => {
  const res = await openAI.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return res.data[0].embedding;
};
export const generate = async (prompt: string): Promise<string> => {
  const res = await openAI.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });
  return res.choices[0]?.message?.content || "";
};
