import { describe, expect, it } from "vitest";
import { calculateAverageEvidenceScore, calculateEvidenceQuality, calculateThesisQuality, summarizeEvidenceCoverage } from "@shared/evidence-quality";

describe("qualidade documental", () => {
  it("mede completude sem atribuir força jurídica", () => {
    const quality = calculateEvidenceQuality({
      sourceStatus: "official_confirmed", sourceUrl: "https://example.gov.br/julgado", sourceHash: "a".repeat(64), cnjNumber: "0000000-00.0000.0.00.0000",
      decisionDate: new Date("2026-01-01"), tribunal: "TJMG", court: "Turma Recursal", validationNote: "Fonte conferida.", topicCount: 1, thesisCount: 1, batchStatus: "imported",
    });
    expect(quality).toMatchObject({ score: 100, level: "robusta" });
    expect(quality.disclaimer).toContain("não mede força jurídica");
  });

  it("identifica lacunas do registro sem inventar qualidade", () => {
    const quality = calculateEvidenceQuality({ sourceStatus: "attachment_reviewed", topicCount: 0, thesisCount: 0 });
    expect(quality.score).toBe(0);
    expect(quality.level).toBe("incompleta");
    expect(quality.missing).toContain("URL pública segura");
  });

  it("aplica os limiares de qualidade de forma determinística", () => {
    const sufficient = calculateEvidenceQuality({
      sourceStatus: "official_confirmed", sourceUrl: "https://example.gov.br/julgado", cnjNumber: "0000000-00.0000.0.00.0000",
      decisionDate: new Date("2026-01-01"), tribunal: "TJMG", court: "Turma Recursal", topicCount: 0, thesisCount: 0,
    });
    expect(sufficient).toMatchObject({ score: 70, level: "suficiente" });
    expect(calculateEvidenceQuality({ sourceStatus: "official_confirmed", topicCount: 0, thesisCount: 0 }).level).toBe("incompleta");
  });

  it("resume cobertura por fonte sem expor registros individuais", () => {
    expect(summarizeEvidenceCoverage([
      { sourceLabel: "TJMG", sourceStatus: "official_confirmed", tribunal: "TJMG", records: 2, officialUrlCount: 2 },
      { sourceLabel: "TJMG", sourceStatus: "official_confirmed", tribunal: "TJMG", records: 1, officialUrlCount: 1 },
    ])).toEqual({ totalRecords: 3, officialUrlRecords: 3, officialUrlRate: 100, sourceCount: 1, tribunalCount: 1 });
  });

  it("não propaga o conteúdo de notas potencialmente pessoais ao resultado do score", () => {
    const quality = calculateEvidenceQuality({ sourceStatus: "attachment_reviewed", validationNote: "identificador-sensivel-de-teste", topicCount: 0, thesisCount: 0 });
    expect(JSON.stringify(quality)).not.toContain("identificador-sensivel-de-teste");
    expect(summarizeEvidenceCoverage([{ sourceLabel: "Fonte A", sourceStatus: "official_confirmed", tribunal: "TJMG", records: 3, officialUrlCount: 1 }])).toMatchObject({ officialUrlRate: 33 });
  });

  it("calcula a média agregada com arredondamento explícito e conjunto vazio", () => {
    expect(calculateAverageEvidenceScore([{ score: 90 }, { score: 85 }, { score: 90 }])).toBe(88);
    expect(calculateAverageEvidenceScore([])).toBe(0);
  });

  it("atribui à tese somente um score de completude documental", () => {
    const thesis = calculateThesisQuality({ sourceStatus: "official_confirmed", title: "Tese", description: "Descrição", position: "condicionada", legalBasis: "Base", proofNotes: "Prova", adverseFacts: "Exceção", topicId: 4, authorityCount: 2, lastReviewedAt: new Date("2026-01-01") });
    expect(thesis).toMatchObject({ score: 100, level: "robusta" });
    expect(thesis.disclaimer).toContain("não mede correção jurídica");
    expect(calculateThesisQuality({ sourceStatus: "editorial_review", authorityCount: 0 }).level).toBe("incompleta");
  });
});
