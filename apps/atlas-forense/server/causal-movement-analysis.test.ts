import { describe, expect, it } from "vitest";
import { analyzeCase, analyzeMovements, classifyMovement, deriveCausalCandidates, summarizeAnalyses } from "../scripts/causal-movement-analysis.mjs";

describe("análise causal de movimentos", () => {
  it("classifica marcos sem depender de resultado inventado", () => {
    expect(classifyMovement("Sentença parcialmente procedente")).toEqual({ type: "sentenca", phase: "origin" });
    expect(classifyMovement("Acordo homologado")).toEqual({ type: "acordo", phase: "origin" });
    expect(classifyMovement("Interposição de recurso inominado")).toEqual({ type: "recurso", phase: "appeal" });
    expect(classifyMovement("Bloqueio/penhora on line")).toEqual({ type: "cumprimento", phase: "execution" });
  });
  it("ordena timeline e detecta sinais de mérito, recurso e execução", () => {
    const result = analyzeMovements([
      { name: "Sentença parcialmente procedente", date: "2026-03-02T10:00:00.000Z", code: 1 },
      { name: "Distribuição", date: "2025-01-02T10:00:00.000Z", code: 26 },
      { name: "Recurso inominado", date: "2026-04-02T10:00:00.000Z", code: 2 },
      { name: "Cumprimento de sentença", date: "2026-06-02T10:00:00.000Z", code: 3 },
    ]);
    expect(result.timeline[0].type).toBe("ajuizamento");
    expect(result.hasMeritSignal).toBe(true);
    expect(result.hasAppealSignal).toBe(true);
    expect(result.hasExecutionSignal).toBe(true);
    expect(result.outcomes[0].outcome).toBe("parcialmente_procedente");
  });
  it("gera candidato de fato gerador com confiança baixa e revisão obrigatória", () => {
    const record = { subjects: [{ code: 1, label: "Dano moral por negativação indevida" }], movements: [{ name: "Sentença", date: "2026-01-01T00:00:00.000Z" }] };
    const analysis = analyzeCase(record);
    expect(analysis.causalCandidates).toEqual(expect.arrayContaining([expect.objectContaining({ claimType: "dano_moral", role: "fato_gerador", confidence: 0.55, reviewStatus: "pending" })]));
    expect(analysis.review.required).toBe(true);
  });
  it("não transforma movimento em resultado definitivo", () => {
    const candidates = deriveCausalCandidates({ subjects: [], movements: [{ name: "Sentença", date: null }] }, analyzeMovements([{ name: "Sentença", date: null }]));
    expect(candidates.every(candidate => candidate.reviewStatus === "pending")).toBe(true);
    expect(candidates.every(candidate => candidate.confidence < 0.5)).toBe(true);
  });
  it("resume análises por sinais processuais", () => {
    const analyses = [analyzeCase({ subjects: [], movements: [{ name: "Acordo homologado", date: null }] }), analyzeCase({ subjects: [], movements: [{ name: "Recurso", date: null }] })];
    expect(summarizeAnalyses(analyses)).toMatchObject({ cases: 2, withMeritSignal: 1, withAppealSignal: 1, candidatesPendingReview: 2 });
  });
});
