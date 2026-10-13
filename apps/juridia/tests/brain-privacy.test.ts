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
    expect(routeSource).toContain("const safeFacts = pseudonymizedFacts.text");
    expect(routeSource).not.toMatch(/content:\\s*facts\\b/);
    expect(routeSource).not.toContain("${facts}");
    expect(routeSource).not.toContain("${facts.slice");
    expect(routeSource).toContain("factsInput: facts");
    expect(routeSource).toContain("rehydrate(value, pseudonymizedFacts.map)");
  });

  test("authorization is checked before any provider interaction", () => {
    expect(routeSource.indexOf("await ownsCase(authUser.uid, body.caseId)"))
      .toBeLessThan(routeSource.indexOf("ZAI.create()"));
  });

  test("central analysis failures cannot return a success response", () => {
    expect(routeSource).toContain("mandatorySteps");
    expect(routeSource).toContain("Análise incompleta; nenhum parecer foi salvo como concluído.");
  });
});
