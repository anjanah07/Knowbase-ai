export const chunkText = (text: string, size = 800, overlap = 200) => {
  const words = text.split("/s+/");
  const chunks: string[] = [];
  let i = 0;
  while (i < words.length) {
    const slice = words.slice(i, i + size).join(" ");
    chunks.push(slice);
    if (i + size >= words.length) break;
    i += size - overlap;
  }
  return chunks;
};
export const fetchTextFromUrl = async (url: string): Promise<string> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch text from url");
  const ct = res.headers.get("content-type");
  if (!ct?.includes("text") && !ct?.includes("json")) {
  }
  return res.text();
};
