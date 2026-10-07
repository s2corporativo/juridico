// research_coverage.ts — cobertura mínima de pesquisa do cérebro jurídico.
// Pesquisa não é considerada suficiente só porque encontrou precedente favorável.

export interface ResearchCoverage {
  primarySource: boolean;
  currentValidity: boolean;
  supportingPrecedent: boolean;
  adversePrecedent: boolean;
  factualFit: boolean;
  complete: boolean;
  missing: string[];
}

export interface ResearchPlanStep {
  order: number;
  purpose: string;
  query: string;
  sourceClasses: string[];
  mandatory: boolean;
}

export interface ResearchPlan {
  issue: string;
  area: string;
  maxCycles: number;
  steps: ResearchPlanStep[];
  stopWhen: string[];
  insufficientEvidenceMessage: string;
}

export function buildResearchPlan(issue: string, area: string): ResearchPlan {
  return {
    issue,
    area,
    maxCycles: 3,
    steps: [
      { order: 1, purpose: "fonte primária e texto vigente", query: `${area} ${issue} legislação vigente`, sourceClasses: ["legislation", "official"], mandatory: true },
      { order: 2, purpose: "precedentes favoráveis", query: `${area} ${issue} jurisprudência favorável`, sourceClasses: ["precedent", "official"], mandatory: true },
      { order: 3, purpose: "precedentes contrários/distinguishing", query: `${area} ${issue} jurisprudência improcedente contrário distinguishing`, sourceClasses: ["precedent", "official"], mandatory: true },
      { order: 4, purpose: "aderência fática", query: `${area} ${issue} fatos requisitos elementos`, sourceClasses: ["legislation", "precedent"], mandatory: true },
    ],
    stopWhen: ["fonte primária", "vigência", "precedente favorável", "precedente contrário", "aderência aos fatos"],
    insufficientEvidenceMessage: "EVIDÊNCIA JURÍDICA INSUFICIENTE PARA CONCLUSÃO SEGURA.",
  };
}

export function assessResearchCoverage(input: {
  laws: { vigente: boolean; urlOficial?: string | null }[];
  precedents: { favorable: boolean | null; url?: string; snippet?: string }[];
  factualFit?: boolean;
}): ResearchCoverage {
  const primarySource = input.laws.some((l) => Boolean(l.urlOficial));
  const currentValidity = input.laws.length > 0 && input.laws.every((l) => l.vigente);
  const supportingPrecedent = input.precedents.some((p) => p.favorable === true);
  const adversePrecedent = input.precedents.some((p) => p.favorable === false);
  const factualFit = Boolean(input.factualFit);
  const missing: string[] = [];
  if (!primarySource) missing.push("fonte primária");
  if (!currentValidity) missing.push("vigência atual");
  if (!supportingPrecedent) missing.push("precedente favorável");
  if (!adversePrecedent) missing.push("precedente contrário");
  if (!factualFit) missing.push("aderência fática");
  return {
    primarySource, currentValidity, supportingPrecedent, adversePrecedent, factualFit,
    complete: missing.length === 0,
    missing,
  };
}
