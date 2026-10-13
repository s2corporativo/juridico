export type JuridiaAgentSlug = "case_mapper" | "legal_research" | "legal_draft" | "legal_review" | "privacy_auditor";

export type JuridiaAgent = {
  slug: JuridiaAgentSlug;
  label: string;
  mode: "deterministic" | "llm" | "hybrid";
  purpose: string;
  input: string;
  output: string;
  requiresHumanReview: boolean;
};

export const JURIDIA_AGENTS: readonly JuridiaAgent[] = [
  { slug: "case_mapper", label: "Mapeador do caso", mode: "hybrid", purpose: "Extrair fatos, eventos, questões e lacunas com evidências.", input: "autos pseudonimizados", output: "snapshot de inteligência", requiresHumanReview: true },
  { slug: "legal_research", label: "Pesquisador jurídico", mode: "deterministic", purpose: "Buscar fontes aprovadas e manter referências rastreáveis.", input: "questões e termos jurídicos", output: "dossiê de fontes", requiresHumanReview: true },
  { slug: "legal_draft", label: "Redator jurídico", mode: "llm", purpose: "Redigir a minuta conforme template, skills, fontes e estilo.", input: "fatos, fontes e molde", output: "rascunho documental", requiresHumanReview: true },
  { slug: "legal_review", label: "Revisor de conformidade", mode: "hybrid", purpose: "Detectar citações frágeis, lacunas, marcadores inventados e desvios do template.", input: "rascunho e regras", output: "correções e ressalvas", requiresHumanReview: true },
  { slug: "privacy_auditor", label: "Auditor de privacidade", mode: "deterministic", purpose: "Confirmar pseudonimização, ausência de PII no Atlas e rastreabilidade do dado.", input: "payload e marcadores", output: "relatório de privacidade", requiresHumanReview: true },
];

export function agentForStage(stage: "prepare" | "outline" | "draft" | "review" | "finalize"): JuridiaAgent {
  const slug: JuridiaAgentSlug = stage === "prepare" ? "privacy_auditor" : stage === "outline" ? "case_mapper" : stage === "draft" ? "legal_draft" : stage === "review" ? "legal_review" : "legal_research";
  return JURIDIA_AGENTS.find((agent) => agent.slug === slug)!;
}
