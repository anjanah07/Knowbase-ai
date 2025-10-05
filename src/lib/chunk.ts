import { encode, decode } from "gpt-tokenizer";

export function chunkText(
  text: string,
  maxTokens = 1000,
  overlap = 100
): string[] {
  const tokens = encode(text);
  const chunks: string[] = [];

  let i = 0;
  while (i < tokens.length) {
    const slice = tokens.slice(i, i + maxTokens);
    chunks.push(decode(slice));
    i += maxTokens - overlap;
  }

  return chunks;
}
export const fetchTextFromUrl = async (url: string): Promise<string> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch text from url");
  const ct = res.headers.get("content-type");
  if (!ct?.includes("text") && !ct?.includes("json")) {
  }
  return res.text();
};
