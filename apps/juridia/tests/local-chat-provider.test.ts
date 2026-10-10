import { test, expect } from "bun:test";
import { assertLocalAiEnabled, createLocalChatAdapter, localModelName } from "../src/lib/local-chat-provider";

const flags = {
  enabled: process.env.JURIDIA_LOCAL_AI_ENABLED,
  model: process.env.JURIDIA_LOCAL_AI_MODEL,
  disabled: process.env.JURIDIA_AI_ENABLED,
};
function restore() {
  if (flags.enabled === undefined) delete process.env.JURIDIA_LOCAL_AI_ENABLED;
  else process.env.JURIDIA_LOCAL_AI_ENABLED = flags.enabled;
  if (flags.model === undefined) delete process.env.JURIDIA_LOCAL_AI_MODEL;
  else process.env.JURIDIA_LOCAL_AI_MODEL = flags.model;
  if (flags.disabled === undefined) delete process.env.JURIDIA_AI_ENABLED;
  else process.env.JURIDIA_AI_ENABLED = flags.disabled;
}
const withLocal = (fn: () => Promise<void> | void) => {
  process.env.JURIDIA_LOCAL_AI_ENABLED = "true";
  delete process.env.JURIDIA_AI_ENABLED;
  delete process.env.JURIDIA_LOCAL_AI_MODEL;
  return Promise.resolve().then(fn).finally(restore);
};

test("local model gate is disabled unless the operator explicitly enables it", () => {
  delete process.env.JURIDIA_LOCAL_AI_ENABLED;
  expect(() => assertLocalAiEnabled()).toThrow("LOCAL_GENERATION_DISABLED");
  restore();
});

test("local provider excludes embedding-only and unsafe model names", () => {
  expect(() => localModelName({ JURIDIA_LOCAL_AI_MODEL: "nomic-embed-text:latest" })).toThrow();
  expect(() => localModelName({ JURIDIA_LOCAL_AI_MODEL: "../inject" })).toThrow();
  expect(localModelName({ JURIDIA_LOCAL_AI_MODEL: "qwen3:4b" })).toBe("qwen3:4b");
});

test("local adapter posts only to loopback and parses real token totals", async () => {
  await withLocal(async () => {
    let actualUrl = "";
    let actualBody: Record<string, unknown> = {};
    const adapter = createLocalChatAdapter(async (url, init) => {
      actualUrl = String(url);
      actualBody = JSON.parse(String(init?.body));
      return new Response(JSON.stringify({
        message: { content: "Rascunho sob revisão." }, prompt_eval_count: 10, eval_count: 7,
      }), { status: 200 });
    });
    const result = await adapter.chat.completions.create({
      messages: [{ role: "user", content: "Fatos fictícios" }], max_tokens: 100000,
    });
    if (result instanceof ReadableStream) throw new Error("unexpected stream");
    expect(actualUrl).toBe("http://127.0.0.1:11434/api/chat");
    expect(result.choices[0].message.content).toBe("Rascunho sob revisão.");
    expect(result.usage.total_tokens).toBe(17);
    expect((actualBody.options as { num_predict: number }).num_predict).toBe(1800);
    expect(actualBody.stream).toBe(false);
  });
});

test("local adapter forwards incremental Ollama NDJSON as OpenAI-compatible SSE", async () => {
  await withLocal(async () => {
    const ndjson = [
      JSON.stringify({ message: { content: "Primeiro" }, done: false }),
      JSON.stringify({ message: { content: " trecho" }, done: false }),
      JSON.stringify({ message: { content: "" }, done: true, prompt_eval_count: 8, eval_count: 3 }),
    ].join("\n") + "\n";
    const adapter = createLocalChatAdapter(async () => new Response(ndjson, { status: 200 }));
    const result = await adapter.chat.completions.create({
      messages: [{ role: "user", content: "Teste" }], stream: true,
    });
    if (!(result instanceof ReadableStream)) throw new Error("stream missing");
    const output = await new Response(result).text();
    expect(output).toContain("Primeiro");
    expect(output).toContain(" trecho");
    expect(output).toContain('"total_tokens":11');
    expect(output).toContain("[DONE]");
  });
});

test("local adapter fails closed when upstream is unavailable", async () => {
  await withLocal(async () => {
    const adapter = createLocalChatAdapter(async () => new Response("offline", { status: 502 }));
    await expect(adapter.chat.completions.create({
      messages: [{ role: "user", content: "test" }],
    })).rejects.toThrow("LOCAL_MODEL_UNAVAILABLE");
  });
});
