import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { pseudonymize, rehydrate } from "../src/lib/pseudonymizer";

const route = readFileSync(new URL("../src/app/api/brain/route.ts", import.meta.url), "utf8");
const context = readFileSync(new URL("../src/lib/brain-ejc.ts", import.meta.url), "utf8");

describe("EJC Brain confidentiality and completion", () => {
  test("known personal identifiers are pseudonymized before outside analysis", () => {
    const original = "Maria Silva, CPF 123.456.789-09, e-mail maria@example.com, telefone (31) 99999-1234.";
    const prepared = pseudonymize(original);
    expect(prepared.text).not.toContain("Maria Silva");
    expect(prepared.text).not.toContain("123.456.789-09");
    expect(prepared.text).not.toContain("maria@example.com");
    expect(rehydrate(prepared.text, prepared.map)).toBe(original);
  });
  test("ownership and evidence integrity are checked before any provider initialization", () => {
    expect(route.indexOf("ownsCase(authUser.uid, caseId)")).toBeLessThan(route.indexOf("ZAI.create()"));
    expect(route.indexOf("validateEvidenceIntegrity(caseId, ref.id)")).toBeLessThan(route.indexOf("ZAI.create()"));
    expect(route).toContain("const safeFacts = context.safeText");
    expect(context).toContain("pseudonymize(rawText)");
    expect(route).not.toContain("content: context.rawText");
  });
  test("failed core steps are not stored as completed decisions", () => {
    expect(route).toContain("const mandatorySteps =");
    expect(route).toContain("Análise incompleta; nenhum parecer foi salvo como concluído.");
    expect(route.indexOf("const mandatorySteps")).toBeLessThan(route.indexOf("db.intelligenceSnapshot.create"));
  });
  test("web fallback cannot send narrative facts or identifiers to a public search", () => {
    expect(route).toContain("const genericAreas =");
    expect(route).not.toContain("jurisprudência" + " " + String.fromCharCode(36) + "{safeFacts.slice");
  });
});
