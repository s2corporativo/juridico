import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { extractCaseFile, sha256 } from "../src/lib/case-files";

const source = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
describe("Document analysis connection", () => {
  test("existing local extraction supports text and preserves page hashes", async () => {
    const content = Buffer.from("Documento de teste sem dados pessoais.\fOutra página de teste.", "utf8");
    const result = await extractCaseFile(content, "text/plain", "evidencia.txt");
    expect(result.status).toBe("ready");
    expect(result.pages.length).toBe(2);
    expect(sha256(result.text).length).toBe(64);
  });
  test("Brain UI uses real selected case and existing authenticated document route", () => {
    const brain = source("../src/components/app/cerebro.tsx");
    expect(brain).not.toContain("cerebro-session");
    expect(brain).not.toContain('"/api/upload"');
    expect(brain).toContain('fetch("/juridia/api/case-files"');
    expect(brain).toContain('fetch("/juridia/api/cases")');
    expect(brain).toContain("body: JSON.stringify({ facts, title: title || undefined, caseId })");
  });
  test("case-files endpoint rejects cross-case access before reading bytes", () => {
    const route = source("../src/app/api/case-files/route.ts");
    expect(route).toContain("ownsCase(auth.user.uid, caseId)");
    expect(route.indexOf("ownsCase(auth.user.uid, caseId)", route.indexOf("export async function POST")))
      .toBeLessThan(route.indexOf("await item.arrayBuffer()"));
    expect(route).toContain("10 * 1024 * 1024");
    expect(route).toContain('status: 422');
    expect(route).toContain("existing.caseId !== caseId");
  });
});
