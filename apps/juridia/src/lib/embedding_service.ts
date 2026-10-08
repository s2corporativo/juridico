// embedding_service.ts — embeddings semânticos locais para o índice jurídico.
// Padrão: Ollama /api/embed. Sem provider configurado, o retrieval degrada
// explicitamente para BM25 + TF-IDF; nunca finge que houve busca vetorial.

export interface EmbeddingBatchResult {
  model: string;
  vectors: number[][];
}

function baseUrl(): string {
  return (process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434").replace(/\/$/, "");
}

export function embeddingModel(): string {
  return process.env.OLLAMA_EMBEDDING_MODEL?.trim() || "nomic-embed-text";
}

export function embeddingsEnabled(): boolean {
  const v = process.env.EMBEDDINGS_ENABLED?.trim().toLowerCase();
  if (v === "false" || v === "0" || v === "off") return false;
  return Boolean(process.env.OLLAMA_BASE_URL || v === "true" || v === "1" || v === "on");
}

export async function embedTexts(input: string[]): Promise<EmbeddingBatchResult | null> {
  if (!embeddingsEnabled() || input.length === 0) return null;
  const model = embeddingModel();
  const resp = await fetch(`${baseUrl()}/api/embed`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ model, input, truncate: true }),
    signal: AbortSignal.timeout(300_000),
  });
  if (!resp.ok) throw new Error(`Embedding provider ${resp.status}: ${await resp.text()}`);
  const data = await resp.json() as { model?: string; embeddings?: number[][] };
  if (!Array.isArray(data.embeddings) || data.embeddings.length !== input.length) {
    throw new Error("Resposta de embeddings inválida");
  }
  return { model: data.model || model, vectors: data.embeddings };
}

export async function embedText(input: string): Promise<{ model: string; vector: number[] } | null> {
  const r = await embedTexts([input]);
  if (!r) return null;
  return { model: r.model, vector: r.vectors[0] || [] };
}

export function cosineVector(a: number[], b: number[]): number {
  if (!a.length || a.length !== b.length) return 0;
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export function parseEmbedding(raw: string | null): number[] | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) && v.every((x) => typeof x === "number") ? v : null;
  } catch {
    return null;
  }
}
