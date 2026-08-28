import { describe, expect, it } from "vitest";
import { AI_SUMMARY_MAX_CHARS, buildPublicSummaryPayload, isSafeAiSummary } from "@shared/compendium-ai-summary";

describe("contrato de resumo assistido do Compêndio", () => {
  const safeRecord = {
    theme: "Responsabilidade civil", tribunal: "TJMG", city: "Betim", decisionType: "Sentença", decisionDate: new Date("2026-01-12"), legalArea: "Cível", outcomeOrigin: "Parcialmente procedente", outcomeAppeal: null, reasoningSummary: "A ficha registra uma controvérsia civil com metadados públicos disponíveis.", sourceStatus: "official_confirmed",
  };

  it("monta a entrada apenas com os campos públicos sanitizados", () => {
    const payload = buildPublicSummaryPayload(safeRecord);
    expect(payload).not.toHaveProperty("externalId");
    expect(payload).not.toHaveProperty("cnjNumber");
    expect(payload.tema).toBe("Responsabilidade civil");
  });

  it("rejeita síntese com dados pessoais, curta ou excessiva", () => {
    expect(isSafeAiSummary("Esta síntese descreve apenas a ficha pública e recomenda conferência direta da fonte catalogada.")).toBe(true);
    expect(isSafeAiSummary("curta")).toBe(false);
    expect(isSafeAiSummary("Contato 31999998888 incluído de forma indevida na síntese produzida pelo modelo de linguagem.")).toBe(false);
    expect(isSafeAiSummary("a".repeat(AI_SUMMARY_MAX_CHARS + 1))).toBe(false);
  });
});
