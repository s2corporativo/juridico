import { describe, expect, it } from "vitest";
import { causalAnnotationInput, causalCaseInput, causalEvidenceInput, causalOutcomeInput, causalDocumentInput, normalizeCausalLabel, validateReviewedState } from "./causal-contract";

const hash = "a".repeat(64);

describe("Atlas Causal contracts", () => {
  it("separa a chave pública do caso e exige hash de origem", () => {
    expect(causalCaseInput.safeParse({ runId: 1, caseKey: "tjmg:case:1", publicProcessKey: "hmac:abc", tribunal: "TJMG", justice: "Estadual", sourceHashSha256: hash, privacyNote: "sem partes e sem dados pessoais" }).success).toBe(true);
    expect(causalCaseInput.safeParse({ runId: 1, caseKey: "tjmg:case:1", tribunal: "TJMG", justice: "Estadual", sourceHashSha256: "não-hash", privacyNote: "sem partes" }).success).toBe(false);
  });

  it("aceita somente fonte HTTPS e hash para evidência", () => {
    const base = { caseId: 1, sourceUrl: "https://www.tjmg.jus.br/documento", sourceLabel: "Sentença oficial", sourceHashSha256: hash, evidenceType: "official_document" as const };
    expect(causalEvidenceInput.safeParse(base).success).toBe(true);
    expect(causalEvidenceInput.safeParse({ ...base, sourceUrl: "http://tjmg.jus.br/documento" }).success).toBe(false);
    expect(causalEvidenceInput.safeParse({ ...base, sourceHashSha256: "b" }).success).toBe(false);
  });

  it("bloqueia CPF, e-mail e marcador de anonimização em textos causais", () => {
    const base = { caseId: 1, sourceUrl: "https://www.tjmg.jus.br/documento", sourceLabel: "Sentença oficial", sourceHashSha256: hash, evidenceType: "official_document" as const };
    expect(causalEvidenceInput.safeParse({ ...base, excerpt: "CPF 123.456.789-09" }).success).toBe(false);
    expect(causalEvidenceInput.safeParse({ ...base, excerpt: "contato fulano@exemplo.com" }).success).toBe(false);
    expect(causalEvidenceInput.safeParse({ ...base, excerpt: "Parte [NOME_0001]" }).success).toBe(false);
  });

  it("exige evidência e confiança entre zero e um para anotação", () => {
    const base = { caseId: 1, evidenceRefId: 2, role: "fato_gerador", claimType: "dano_moral", label: "Negativação indevida", normalizedLabel: "negativacao indevida", sourceKind: "document", confidence: 0.92 } as const;
    expect(causalAnnotationInput.safeParse(base).success).toBe(true);
    expect(causalAnnotationInput.safeParse({ ...base, evidenceRefId: 0 }).success).toBe(false);
    expect(causalAnnotationInput.safeParse({ ...base, confidence: 1.1 }).success).toBe(false);
  });

  it("impede resultado financeiro negativo e documento sem tipo controlado", () => {
    const outcome = { caseId: 1, annotationId: 2, evidenceRefId: 3, phase: "origin", outcome: "parcialmente_procedente", amountCents: -1 } as const;
    expect(causalOutcomeInput.safeParse(outcome).success).toBe(false);
    expect(causalDocumentInput.safeParse({ caseId: 1, documentType: "documento_inventado", sourceLabel: "x", contentHashSha256: hash }).success).toBe(false);
  });

  it("não permite aprovação sem revisor e data", () => {
    expect(validateReviewedState({ reviewStatus: "approved" })).toEqual({ ok: false, error: "revisão não pode ser concluída sem revisor e data" });
    expect(validateReviewedState({ reviewStatus: "approved", reviewedBy: "advogado-1", reviewedAt: new Date() })).toEqual({ ok: true });
  });

  it("normaliza rótulos sem apagar seu valor original", () => {
    expect(normalizeCausalLabel("  Negativação   Indevida ")).toBe("negativacao indevida");
  });
});
