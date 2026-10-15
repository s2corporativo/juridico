import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { validateBrainExtraction } from "../src/lib/brain-ejc-evidence-gate";

const empty = () => ({ parties: [], timeline: [], requests: [], values: [] });
const routeSource = readFileSync(new URL("../src/app/api/brain/route.ts", import.meta.url), "utf8");
const contextSource = readFileSync(new URL("../src/lib/brain-ejc.ts", import.meta.url), "utf8");
const deterministicSource = readFileSync(new URL("../src/lib/legal_brain.ts", import.meta.url), "utf8");

describe("Cérebro EJC integrado — rastreabilidade e privacidade", () => {
  test("mantém somente fatos respaldados por evidência do caso", () => {
    const got = validateBrainExtraction({
      ...empty(),
      parties: [
        { name: "[NOME_1]", state: "fato_extraido", evidence_ref_ids: ["ref_caso_1", "ref_caso_1"] },
        { name: "Pessoa inventada", state: "fato_extraido", evidence_ref_ids: ["ref_outro_caso"] },
        { name: "Sem fonte", state: "fato_extraido", evidence_ref_ids: [] },
      ],
    }, new Set(["ref_caso_1"]));
    expect(got.parties).toHaveLength(1);
    expect(got.parties[0].evidenceRefIds).toEqual(["ref_caso_1"]);
    expect(got.parties[0].state).toBe("fato_extraido");
  });
  test("não aceita item textual sem evidência e reduz estado desconhecido a inferência", () => {
    const got = validateBrainExtraction({
      ...empty(), requests: [
        "O modelo inventou um pedido",
        { text: "Pedido alegado", state: "certeza", evidence_ref_ids: ["ok"] },
      ],
    }, new Set(["ok"]));
    expect(got.requests).toHaveLength(1);
    expect(got.requests[0].state).toBe("inferencia_ia");
  });
  test("bloqueia resposta malformada do provedor em vez de criar falso sucesso", () => {
    expect(() => validateBrainExtraction({ parties: [] }, new Set())).toThrow(/incompleta/);
    expect(routeSource).toContain("validateBrainExtraction(p, new Set(context.evidence.map");
    expect(routeSource).toContain("const mandatorySteps");
    expect(routeSource).toContain('status: "failed"');
    expect(routeSource).not.toContain("const facts = context.rawText");
  });
  test("o original não aparece no contrato de contexto nem é duplicado em metadata", () => {
    expect(contextSource).not.toContain("  rawText: string;");
    expect(contextSource).not.toContain("    rawText,");
    expect(deterministicSource).not.toContain("metadata: { original: cpf }");
    expect(routeSource).toContain("const safeFacts = context.safeText");
  });
});
