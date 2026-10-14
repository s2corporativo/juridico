import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { pseudonymize, rehydrate } from "../src/lib/pseudonymizer";

const routeSource = readFileSync(new URL("../src/app/api/brain/route.ts", import.meta.url), "utf8");

describe("Brain case privacy regression", () => {
  test("known Brazilian identifiers are replaced locally and can be restored", () => {
    const original = "Maria Silva, CPF 123.456.789-09, e-mail maria@example.com, telefone (31) 99999-1234.";
    const prepared = pseudonymize(original);
    expect(prepared.text).not.toContain("Maria Silva");
    expect(prepared.text).not.toContain("123.456.789-09");
    expect(prepared.text).not.toContain("maria@example.com");
    expect(rehydrate(prepared.text, prepared.map)).toBe(original);
  });

  test("Brain route uses pseudonymized facts in prompts, preserving raw facts only locally", () => {
    // Fluxo simplificado (2026-10): a pseudonimização acontece em prepareBrainEjcContext
    // (src/lib/brain-ejc.ts) e a rota só injeta context.safeText nos prompts.
    expect(routeSource).toContain("const safeFacts = context.safeText");
    expect(routeSource).toContain("prepareBrainEjcContext");
    // Nenhum prompt pode receber o texto cru do caso:
    expect(routeSource).not.toMatch(/content:\s*facts\b/);
    expect(routeSource).not.toContain("${facts}");
    expect(routeSource).not.toContain("${facts.slice");
    // Persistência também só recebe fatos pseudonimizados:
    expect(routeSource).toContain("factsInput: safeFacts");
  });

  test("authorization is checked before any provider interaction", () => {
    expect(routeSource.indexOf("await ownsCase(authUser.uid, body.caseId)"))
      .toBeLessThan(routeSource.indexOf("ZAI.create()"));
  });

  test("analysis is saved as draft pending human review, never as concluded", () => {
    expect(routeSource).toContain('reviewStatus: "pending"');
    expect(routeSource).toContain("isDraft: true");
    // Etapa que falha recebe fallback explícito, nunca resultado inventado:
    expect(routeSource).toContain("Análise indisponível");
  });
});
