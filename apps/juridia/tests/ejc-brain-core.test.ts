import { describe, expect, test } from "bun:test";
import { getSanitizationMode, SanitizationMode } from "@/lib/ai_governance";
import { assessResearchCoverage, buildResearchPlan } from "@/lib/research_coverage";

describe("EJC brain core", () => {
  test("criminal é fail-closed local", () => {
    expect(getSanitizationMode("criminal")).toBe(SanitizationMode.LOCAL_COMPLETO);
    expect(getSanitizationMode("debate_penal")).toBe(SanitizationMode.LOCAL_COMPLETO);
  });

  test("minuta usa pseudonimização externa", () => {
    expect(getSanitizationMode("minuta")).toBe(SanitizationMode.EXTERNO_PSEUDONIMIZADO);
  });

  test("plano de pesquisa exige lados favorável e contrário", () => {
    const plan = buildResearchPlan("responsabilidade civil", "consumer");
    expect(plan.steps.some((s) => s.purpose.includes("favoráveis"))).toBe(true);
    expect(plan.steps.some((s) => s.purpose.includes("contrários"))).toBe(true);
  });

  test("cobertura incompleta sem precedente contrário", () => {
    const coverage = assessResearchCoverage({
      laws: [{ vigente: true, urlOficial: "https://www.planalto.gov.br/" }],
      precedents: [{ favorable: true, url: "https://stj.jus.br/" }],
      factualFit: true,
    });
    expect(coverage.complete).toBe(false);
    expect(coverage.missing).toContain("precedente contrário");
  });

  test("cobertura completa exige cinco dimensões", () => {
    const coverage = assessResearchCoverage({
      laws: [{ vigente: true, urlOficial: "https://www.planalto.gov.br/" }],
      precedents: [{ favorable: true }, { favorable: false }],
      factualFit: true,
    });
    expect(coverage.complete).toBe(true);
  });
});
