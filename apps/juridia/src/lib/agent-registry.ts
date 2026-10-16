/**
 * Declarative team for the existing EJC + Atlas + JuridIA pipelines.
 * Registration itself never grants API, file system, legal-signature or court access.
 * Stages already running in minuta_run/brain remain the execution engines.
 */
export type JuridiaAgentSlug =
  | "workflow_coordinator" | "privacy_auditor" | "document_analyst" | "case_mapper"
  | "evidence_auditor" | "legal_research" | "legal_brain" | "legal_draft"
  | "citation_verifier" | "legal_review";
export type AgentMode = "deterministic" | "llm" | "hybrid";
export type AgentAutonomy = "automatic" | "supervised";
export type WorkflowGoal = "case_analysis" | "draft_document" | "source_research" | "document_review";
export type MinutaStage = "prepare" | "outline" | "draft" | "review" | "finalize";

export type JuridiaAgent = {
  slug: JuridiaAgentSlug;
  label: string;
  mode: AgentMode;
  autonomy: AgentAutonomy;
  purpose: string;
  input: string;
  output: string;
  requiresHumanReview: boolean;
  operationalRoute: string;
  mayPublishExternally: false;
};

export const JURIDIA_AGENTS: readonly JuridiaAgent[] = [
  { slug: "workflow_coordinator", label: "Coordenador de fluxo", mode: "deterministic", autonomy: "automatic", purpose: "Ordenar etapas permitidas e registrar a execução.", input: "objetivo autorizado", output: "plano de execução", requiresHumanReview: false, operationalRoute: "/api/agents", mayPublishExternally: false },
  { slug: "privacy_auditor", label: "Auditor de privacidade", mode: "deterministic", autonomy: "automatic", purpose: "Pseudonimizar dados e controlar exposição a provedores.", input: "texto do caso", output: "contexto pseudonimizado", requiresHumanReview: false, operationalRoute: "/api/generate-minuta", mayPublishExternally: false },
  { slug: "document_analyst", label: "Analista documental", mode: "deterministic", autonomy: "automatic", purpose: "Extrair textos e páginas de documentos vinculados ao caso.", input: "autos do caso autorizado", output: "arquivos extraídos e hashes", requiresHumanReview: false, operationalRoute: "/api/case-files", mayPublishExternally: false },
  { slug: "case_mapper", label: "Mapeador do caso", mode: "hybrid", autonomy: "automatic", purpose: "Identificar fatos, eventos e questões com indicação de evidências.", input: "autos pseudonimizados", output: "mapa do caso e lacunas", requiresHumanReview: true, operationalRoute: "/api/brain", mayPublishExternally: false },
  { slug: "evidence_auditor", label: "Auditor de evidências", mode: "deterministic", autonomy: "automatic", purpose: "Validar vínculo ao caso e hashes de evidências, sem inferir prova de fato.", input: "referências e hashes", output: "integridade de evidências", requiresHumanReview: false, operationalRoute: "/api/brain", mayPublishExternally: false },
  { slug: "legal_research", label: "Pesquisador Atlas", mode: "deterministic", autonomy: "automatic", purpose: "Pesquisar fontes jurídicas aprovadas e recuperáveis.", input: "questões genéricas", output: "dossiê de fontes com limites", requiresHumanReview: true, operationalRoute: "/api/atlas/knowledge", mayPublishExternally: false },
  { slug: "legal_brain", label: "Cérebro EJC", mode: "hybrid", autonomy: "supervised", purpose: "Analisar hipóteses, contrateses, riscos e estratégias.", input: "caso e fontes autorizadas", output: "snapshot sujeito a revisão", requiresHumanReview: true, operationalRoute: "/api/brain", mayPublishExternally: false },
  { slug: "legal_draft", label: "Redator de minutas", mode: "llm", autonomy: "supervised", purpose: "Produzir minuta a partir de fontes e skills homologadas.", input: "fatos, molde, fontes e skills", output: "minuta em rascunho", requiresHumanReview: true, operationalRoute: "/api/generate-minuta", mayPublishExternally: false },
  { slug: "citation_verifier", label: "Verificador de citações", mode: "deterministic", autonomy: "automatic", purpose: "Sinalizar citações sem validação independente ou desatualizadas.", input: "citações e fontes", output: "ressalvas de verificação", requiresHumanReview: true, operationalRoute: "/api/citations/verify", mayPublishExternally: false },
  { slug: "legal_review", label: "Revisor jurídico", mode: "hybrid", autonomy: "supervised", purpose: "Revisar coerência e conformidade das peças e pareceres.", input: "rascunho e alertas", output: "correções para aprovação", requiresHumanReview: true, operationalRoute: "/api/generate-minuta", mayPublishExternally: false },
] as const;

const STAGES: Record<MinutaStage, JuridiaAgentSlug> = {
  prepare: "privacy_auditor",
  outline: "case_mapper",
  draft: "legal_draft",
  review: "legal_review",
  finalize: "legal_research",
};

const WORKFLOWS: Record<WorkflowGoal, { route: string; agents: readonly JuridiaAgentSlug[] }> = {
  case_analysis: {
    route: "/api/brain",
    agents: ["workflow_coordinator", "privacy_auditor", "document_analyst", "case_mapper", "evidence_auditor", "legal_research", "legal_brain", "legal_review"],
  },
  draft_document: {
    route: "/api/generate-minuta",
    agents: ["workflow_coordinator", "privacy_auditor", "document_analyst", "case_mapper", "legal_research", "legal_draft", "citation_verifier", "legal_review"],
  },
  source_research: {
    route: "/api/atlas/knowledge",
    agents: ["workflow_coordinator", "privacy_auditor", "legal_research", "citation_verifier"],
  },
  document_review: {
    route: "/api/citations/verify",
    agents: ["workflow_coordinator", "privacy_auditor", "evidence_auditor", "citation_verifier", "legal_review"],
  },
};

export function agentForStage(stage: MinutaStage): JuridiaAgent {
  return JURIDIA_AGENTS.find((agent) => agent.slug === STAGES[stage])!;
}

export function isWorkflowGoal(value: unknown): value is WorkflowGoal {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(WORKFLOWS, value);
}

export function buildAgentWorkflow(goal: WorkflowGoal) {
  const cfg = WORKFLOWS[goal];
  return {
    goal,
    route: cfg.route,
    execution: "user_initiated_existing_pipeline" as const,
    finalApproval: "advogado_responsavel" as const,
    externalActionsAllowed: false as const,
    agents: cfg.agents.map((slug, index) => {
      const agent = JURIDIA_AGENTS.find((entry) => entry.slug === slug)!;
      return { step: index + 1, slug, label: agent.label, autonomy: agent.autonomy,
        requiresHumanReview: agent.requiresHumanReview, operationalRoute: agent.operationalRoute };
    }),
  };
}
