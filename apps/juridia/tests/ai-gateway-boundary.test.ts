import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = join(import.meta.dir, "..", "src");
const ALLOWED = new Set(["lib/ai_gateway.ts"]);

function files(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...files(path));
    else if (/\.(ts|tsx)$/.test(name)) out.push(path);
  }
  return out;
}

describe("AI Gateway boundary", () => {
  test("nenhum módulo operacional acessa provider diretamente", () => {
    const forbidden = [
      /z-ai-web-dev-sdk/,
      /\bZAI\.create\s*\(/,
      /chat\.completions\.create\s*\(/,
      /api\.openai\.com/i,
      /api\.groq\.com/i,
      /api\.anthropic\.com/i,
      /api\.maritaca\.ai/i,
    ];

    const violations: string[] = [];
    for (const path of files(ROOT)) {
      const rel = relative(ROOT, path).replaceAll("\\", "/");
      if (ALLOWED.has(rel)) continue;
      const source = readFileSync(path, "utf8");
      if (forbidden.some((pattern) => pattern.test(source))) violations.push(rel);
    }

    expect(violations).toEqual([]);
  });
});
