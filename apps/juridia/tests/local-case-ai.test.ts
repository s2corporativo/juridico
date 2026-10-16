import { afterEach, describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { completeLocalCase } from "../src/lib/local-case-ai";

const previousFetch = globalThis.fetch;
const previousModel = process.env.JURIDIA_LOCAL_CASE_MODEL;
afterEach(() => {
  globalThis.fetch = previousFetch;
  if (previousModel === undefined) delete process.env.JURIDIA_LOCAL_CASE_MODEL;
  else process.env.JURIDIA_LOCAL_CASE_MODEL = previousModel;
});

describe("local-only confidential case analysis", () => {
  const messages = [
    { role: "system" as const, content: "Somente rascunho, sem inventar fatos." },
    { role: "user" as const, content: "Pessoa [NOME_1] relata cobrança." },
  ];

  test("connects only to loopback Ollama and returns compatible completion", async () => {
    let target = "";
    let requestBody: { messages?: typeof messages; model?: string; stream?: boolean } = {};
    globalThis.fetch = (async (url, init) => {
      target = String(url);
      requestBody = JSON.parse(String(init?.body));
      return new Response(JSON.stringify({
        message: { content: '{"facts":[]}' },
        prompt_eval_count: 12,
        eval_count: 8,
      }), { status: 200 });
    }) as typeof fetch;
    const result = await completeLocalCase(messages, { max_tokens: 256 });
    expect(target).toBe("http://127.0.0.1:11434/api/chat");
    expect(requestBody.model).toBe("qwen3:4b-instruct");
    expect(requestBody.stream).toBe(false);
    expect(requestBody.messages?.[1].content).toContain("[NOME_1]");
    expect(result.choices[0].message.content).toBe('{"facts":[]}');
    expect(result.usage.total_tokens).toBe(20);
  });

  test("does not allow configured arbitrary URLs or model names", async () => {
    process.env.JURIDIA_LOCAL_CASE_MODEL = "https://remote.example/chat";
    await expect(completeLocalCase(messages)).rejects.toThrow("LOCAL_CASE_AI_MODEL_INVALID");
  });

  test("fails closed if local Ollama is unavailable", async () => {
    globalThis.fetch = (async () => new Response("unavailable", { status: 503 })) as unknown as typeof fetch;
    await expect(completeLocalCase(messages)).rejects.toThrow("LOCAL_CASE_AI_UNAVAILABLE");
  });

  test("all four sensitive routes no longer import external SDK", () => {
    for (const name of [
      "case-analysis", "molde", "suggest", "intelligence/map",
    ]) {
      const source = readFileSync(new URL("../src/app/api/" + name + "/route.ts", import.meta.url), "utf8");
      expect(source).toContain("createLocalCaseClient()");
      expect(source).not.toContain('from "z-ai-web-dev-sdk"');
      expect(source).toContain("content: externalPrompt.text");
    }
  });
});
