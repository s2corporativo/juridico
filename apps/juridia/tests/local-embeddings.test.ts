import { test, expect } from "bun:test";
import { LOCAL_EMBED_URL, embedWithLocalOllama, cosineSimilarity } from "../src/lib/local-embeddings";

test("embeddings use fixed localhost URL and never paid API endpoints", async () => {
  let received = "";
  const fetchImpl = (async (url: URL | string, init?: RequestInit) => {
    received = String(url);
    expect(init?.method).toBe("POST");
    const p = JSON.parse(String(init?.body));
    expect(p.model).toBe("nomic-embed-text:latest");
    return new Response(JSON.stringify({ embeddings: [Array(768).fill(0).map((_, i) => i === 0 ? 1 : 0)] }), {status:200});
  }) as typeof fetch;
  const out=await embedWithLocalOllama("lei processual", {fetchImpl});
  expect(received).toBe(LOCAL_EMBED_URL);
  expect(received).toBe("http://127.0.0.1:11434/api/embed");
  expect(out.vector).toHaveLength(768);
  expect(cosineSimilarity(out.vector, out.vector)).toBeCloseTo(1);
});
test("invalid response and inaccessible Ollama fail with no external fallback", async () => {
  const broken = (async () => new Response(JSON.stringify({ embeddings: [["invalid"]] }))) as typeof fetch;
  await expect(embedWithLocalOllama("jurisprudencia", {fetchImpl:broken})).rejects.toThrow("LOCAL_OLLAMA_INVALID_VECTOR");
  const down=(async()=>{throw new Error("connection refused")}) as typeof fetch;
  await expect(embedWithLocalOllama("jurisprudencia", {fetchImpl:down})).rejects.toThrow();
  await expect(embedWithLocalOllama("", {fetchImpl:broken})).rejects.toThrow("EMBEDDING_INPUT_INVALID");
});
