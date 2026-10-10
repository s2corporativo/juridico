/** Optional local-only Ollama embeddings. BM25 is always available without Ollama. */
export const LOCAL_EMBED_URL = "http://127.0.0.1:11434/api/embed";
export const LOCAL_EMBED_MODEL = "nomic-embed-text:latest";

export function validEmbedding(value: unknown): value is number[] {
  return Array.isArray(value) && value.length >= 32 && value.length <= 4096
    && value.every(n => typeof n === "number" && Number.isFinite(n));
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (!validEmbedding(a) || !validEmbedding(b) || a.length !== b.length) return 0;
  let dot = 0, aa = 0, bb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]; aa += a[i] ** 2; bb += b[i] ** 2;
  }
  return aa && bb ? dot / Math.sqrt(aa * bb) : 0;
}

/** Requests never include case details unless an explicit caller supplies them.
 * Intended for reviewed public source passages and sanitized legal search terms.
 */
export async function embedWithLocalOllama(
  text: string,
  deps: { fetchImpl?: typeof fetch; model?: string } = {},
): Promise<{ model: string; vector: number[] }> {
  if (!text.trim() || text.length > 10000) throw new Error("EMBEDDING_INPUT_INVALID");
  const model = deps.model ?? LOCAL_EMBED_MODEL;
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,90}$/.test(model)) {
    throw new Error("EMBEDDING_MODEL_INVALID");
  }
  const res = await (deps.fetchImpl ?? fetch)(LOCAL_EMBED_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, input: text }),
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) throw new Error("LOCAL_OLLAMA_HTTP_" + res.status);
  const raw: unknown = await res.json();
  const vector = (raw as { embeddings?: unknown[] } | null)?.embeddings?.[0];
  if (!validEmbedding(vector)) throw new Error("LOCAL_OLLAMA_INVALID_VECTOR");
  return { model, vector };
}
