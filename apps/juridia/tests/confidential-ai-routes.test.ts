import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const sensitiveFiles = [
  "../src/app/api/brain/route.ts",
  "../src/lib/judge_simulator.ts",
  "../src/lib/thesis_checker.ts",
  "../src/lib/lexvalida_pipeline.ts",
  "../src/lib/minuta_run.ts",
] as const;

describe("Confidential legal workflows stay on loopback inference", () => {
  for (const relativePath of sensitiveFiles) {
    test(`${relativePath} has no external AI SDK or unverified web search`, () => {
      const source = readFileSync(new URL(relativePath, import.meta.url), "utf8");
      expect(source).toContain("createLocalCaseClient");
      expect(source).not.toContain('import ZAI from "z-ai-web-dev-sdk"');
      expect(source).not.toContain("ZAI.create()");
      expect(source).not.toContain('functions.invoke("web_search"');
    });
  }
  test("minuta streaming is an explicit local full-text compatibility fallback", () => {
    const source = readFileSync(new URL("../src/lib/minuta_run.ts", import.meta.url), "utf8");
    expect(source).toContain("if (text) onDelta(text)");
    expect(source).toContain('provider: "ollama-local"');
    const adapter = readFileSync(new URL("../src/lib/local-case-ai.ts", import.meta.url), "utf8");
    expect(adapter).toContain('fetch("http://127.0.0.1:11434/api/chat"');
    expect(adapter).not.toContain("process.env.JURIDIA_LOCAL_CASE_URL");
  });
});
