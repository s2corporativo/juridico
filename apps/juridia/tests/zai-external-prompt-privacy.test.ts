import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { pseudonymize, rehydrate, rehydrateStructured } from "../src/lib/pseudonymizer";

function route(path: string): string {
  return readFileSync(new URL("../src/app/api/" + path, import.meta.url), "utf8");
}

describe("JuridIA — limites mínimos para contexto enviado à Z.ai", () => {
  test("identificadores estruturados permanecem fora do prompt externo e retornam somente localmente", () => {
    const original = "Maria Silva, CPF 123.456.789-09, telefone (31) 99999-1234";
    const safe = pseudonymize(original);
    expect(safe.text).not.toContain("Maria Silva");
    expect(safe.text).not.toContain("123.456.789-09");
    expect(safe.text).not.toContain("99999-1234");
    const result = { parties: [{ name: "[NOME_1]" }], comments: ["[CPF_1]"] };
    expect(rehydrateStructured(result, safe.map).parties[0].name).toBe("Maria Silva");
    expect(rehydrate(safe.text, safe.map)).toBe(original);
  });

  for (const path of [
    "case-analysis/route.ts",
    "molde/route.ts",
    "suggest/route.ts",
    "intelligence/map/route.ts",
  ]) {
    test(path + " envia somente o contexto pseudonimizado", () => {
      const code = route(path);
      expect(code).toContain("const externalPrompt = pseudonymize(");
      expect(code).toContain("content: externalPrompt.text");
      expect(code).not.toContain('content: userPrompt');
    });
  }

  test("modo molde não retorna sugestões quando a âncora não existe", () => {
    const code = route("molde/route.ts");
    expect(code).toContain("changes: validated,");
    expect(code).not.toContain("validated.length > 0 ? validated : changes");
  });

  test("fallback offline não fabrica fatos jurídicos nem afirmações de jurisprudência", () => {
    const code = route("suggest/route.ts");
    expect(code).toContain("Sugestão não gerada.");
    expect(code).not.toContain("A jurisprudência do STJ consolidou");
    expect(code).not.toContain("restou configurado o dano");
  });
});
