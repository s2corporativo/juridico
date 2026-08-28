import { describe, expect, it } from "vitest";
import { buildPublicComparisonPayload, isSafeAiComparison } from "@shared/compendium-ai-compare";

describe("compendium ai compare contract", () => {
  const record = (externalId: string) => ({ externalId, title: "Tese pública", tribunal: "TJMG", city: "Belo Horizonte", decisionType: "Acórdão", decisionDate: "2026-01-10", sourceStatus: "official_confirmed", stance: "Aderente" });

  it("rotula os itens internamente e limita a seleção", () => {
    const payload = buildPublicComparisonPayload([record("a"), record("b")]);
    expect(payload).toHaveLength(2);
    expect(payload[0]).toMatchObject({ identificadorInterno: "Julgado 1", tribunal: "TJMG" });
    expect(payload[0]).not.toHaveProperty("externalId");
    expect(() => buildPublicComparisonPayload([record("a"), record("b"), record("c"), record("d"), record("e")])).toThrow();
  });

  it("aceita apenas listas estruturadas e rejeita conteúdo sensível", () => {
    expect(isSafeAiComparison({ similarities: ["Mesma classificação documental"], differences: [], caveats: ["A fonte pública não informa o fundamento integral"] })).toBe(true);
    expect(isSafeAiComparison({ similarities: ["CPF 000.000.000-00"], differences: [], caveats: [] })).toBe(false);
    expect(isSafeAiComparison({ similarities: ["curto"], differences: [], caveats: [] })).toBe(false);
  });
});
