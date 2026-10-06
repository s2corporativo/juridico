// Tipos compartilhados entre frontend e backend

export interface TemplateField {
  key: string;
  label: string;
  type: "text" | "textarea" | "select";
  options?: string[];
  placeholder?: string;
}

export interface TemplateDTO {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  fields: TemplateField[];
}

export interface SkillDTO {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  content: string;
  locked: boolean;
}

export interface NewsDTO {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  category: string;
  date: string;
}

export interface DocumentDTO {
  id: string;
  title: string;
  templateSlug: string;
  templateName: string;
  anonymizedFacts: string;
  generatedContent: string;
  skillSlugs: string[];
  status: string;
  batchId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateMinutaRequest {
  templateSlug: string;
  fields: Record<string, string>;
  skillSlugs: string[];
  title?: string;
  batchId?: string;
  /**
   * Minuta-molde já aprovada pelo advogado (geração em lote).
   * Quando presente, o redator segue a estrutura/tom da molde, adaptando
   * os dados ao caso atual. Limitada a 60k caracteres (normalizeMoldContent).
   */
  moldContent?: string;
  /** Contexto estratégico vindo do Cérebro Jurídico (é pseudonimizado antes da IA) */
  brainContext?: string;
  /** Perfil de estilo: formal | objetivo | tecnico */
  writingStyle?: string;
}

export interface ReferenceUsed {
  diploma: string;
  numero: string;
  tribunal: string | null;
  urlOficial: string | null;
  score: number;
}

export interface PipelineStageInfo {
  stage: string; // outline | draft | review
  ok: boolean;
  ms: number;
  tokens: number;
  note?: string;
}

export interface ValidationViolationDTO {
  rule: string;
  severity: "error" | "warning";
  detail: string;
  excerpt?: string;
}

export interface GenerateMinutaResponse {
  document: DocumentDTO;
  rawMarkers: Record<string, string>;
  tokensUsed?: number;
  /** Validação deontológica visível ao advogado (antes só virava metadado) */
  validation?: {
    valid: boolean;
    violations: ValidationViolationDTO[];
    markedAsDraft: boolean;
  };
  /** Fontes normativas rastreáveis usadas na fundamentação (RAG na base curada) */
  references?: ReferenceUsed[];
  /** Telemetria do pipeline multi-etapas */
  pipeline?: {
    stages: PipelineStageInfo[];
    degraded: boolean; // true = IA falhou em etapa essencial (usado fallback)
    skillsAutoRouted: string[];
    reviewCorrections: { applied: number; skipped: number };
  };
}

export interface JurisprudenceResult {
  url: string;
  name: string;
  snippet: string;
  host_name: string;
  rank: number;
  date?: string;
}

export interface JurisprudenceResponse {
  query: string;
  mode: string;
  results: JurisprudenceResult[];
  cached?: boolean;
}
