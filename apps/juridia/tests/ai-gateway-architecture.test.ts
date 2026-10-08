import { describe, expect, test } from "bun:test";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = join(process.cwd(), "src");
const ALLOWED = new Set(["lib/ai_gateway.ts", "lib/ai_governance.ts"]);
const BANNED = [
  /from\s+["']z-ai-web-dev-sdk["']/,
  /ZAI\.create\s*\(/,
  /api\.anthropic\.com/i,
  /api\.groq\.com/i,
  /chat\.maritaca\.ai/i,
];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

describe("AI Gateway architecture", () => {
  test("nenhum módulo de negócio chama provider diretamente", () => {
    const violations: string[] = [];

    for (const file of walk(ROOT).filter((p) => /\.(ts|tsx)$/.test(p))) {
      const rel = relative(ROOT, file).replaceAll("\\", "/");
      if (ALLOWED.has(rel)) continue;

      const content = readFileSync(file, "utf8");
      if (BANNED.some((pattern) => pattern.test(content))) {
        violations.push(rel);
      }
    }

    expect(violations).toEqual([]);
  });
});
