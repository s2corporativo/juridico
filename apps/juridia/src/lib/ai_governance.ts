// ai_governance.ts — governança central de IA, portada e endurecida a partir do EJC.
// Este módulo é server-side: nenhuma rota deve decidir provider ou política de sigilo por conta própria.

export interface ProviderSpec {
  name: "zai" | "ollama" | "groq" | "maritaca" | "anthropic";
  external: boolean;
  enabled: boolean;
  supportsJsonSchema: boolean;
  supportsTools: boolean;
  priority: number;
  model?: string;
}

function envFlag(name: string, fallback: boolean): boolean {
  const value = process.env[name]?.trim().toLowerCase();
  if (value == null || value === "") return fallback;
  return value === "1" || value === "true" || value === "yes" || value === "on";
}

export const AI_ENABLED = envFlag("AI_ENABLED", true);
export const AI_EXTERNAL_PROVIDERS_ALLOWED = envFlag("AI_EXTERNAL_PROVIDERS_ALLOWED", true);

export const PROVIDERS: Record<ProviderSpec["name"], ProviderSpec> = {
  zai: {
    name: "zai",
    external: true,
    enabled: envFlag("ZAI_ENABLED", true),
    supportsJsonSchema: true,
    supportsTools: true,
    priority: 40,
    model: process.env.ZAI_MODEL?.trim() || undefined,
  },
  ollama: {
    name: "ollama",
    external: false,
    enabled: envFlag("OLLAMA_ENABLED", Boolean(process.env.OLLAMA_BASE_URL)),
    supportsJsonSchema: true,
    supportsTools: false,
    priority: 10,
    model: process.env.OLLAMA_MODEL?.trim() || "qwen2.5:14b",
  },
  groq: {
    name: "groq",
    external: true,
    enabled: envFlag("GROQ_ENABLED", Boolean(process.env.GROQ_API_KEY && process.env.GROQ_BASE_URL)),
    supportsJsonSchema: true,
    supportsTools: false,
    priority: 20,
    model: process.env.GROQ_MODEL?.trim() || undefined,
  },
  maritaca: {
    name: "maritaca",
    external: true,
    enabled: envFlag("MARITACA_ENABLED", Boolean(process.env.MARITACA_API_KEY && process.env.MARITACA_BASE_URL)),
    supportsJsonSchema: true,
    supportsTools: false,
    priority: 30,
    model: process.env.MARITACA_MODEL?.trim() || undefined,
  },
  anthropic: {
    name: "anthropic",
    external: true,
    enabled: envFlag("ANTHROPIC_ENABLED", false),
    supportsJsonSchema: false,
    supportsTools: true,
    priority: 50,
    model: process.env.ANTHROPIC_MODEL?.trim() || undefined,
  },
};

export enum SanitizationMode {
  LOCAL_COMPLETO = "local_completo",
  EXTERNO_PSEUDONIMIZADO = "externo_pseudonimizado",
  EXTRACAO_LOCAL = "extracao_local",
  MASCARAMENTO = "mascaramento",
}

const TASK_SANITIZATION_MAP: Record<string, SanitizationMode> = {
  brain_classify: SanitizationMode.EXTERNO_PSEUDONIMIZADO,
  analise_caso: SanitizationMode.EXTERNO_PSEUDONIMIZADO,
  case_analysis: SanitizationMode.EXTERNO_PSEUDONIMIZADO,
  minuta: SanitizationMode.EXTERNO_PSEUDONIMIZADO,
  dossie: SanitizationMode.EXTERNO_PSEUDONIMIZADO,
  pesquisa: SanitizationMode.EXTERNO_PSEUDONIMIZADO,
  resumo: SanitizationMode.EXTERNO_PSEUDONIMIZADO,
  lexvalida: SanitizationMode.EXTERNO_PSEUDONIMIZADO,
  criminal: SanitizationMode.LOCAL_COMPLETO,
  penal: SanitizationMode.LOCAL_COMPLETO,
  debate_penal: SanitizationMode.LOCAL_COMPLETO,
  menores: SanitizationMode.LOCAL_COMPLETO,
  default: SanitizationMode.EXTERNO_PSEUDONIMIZADO,
};

export function getSanitizationMode(taskType: string): SanitizationMode {
  return TASK_SANITIZATION_MAP[taskType] ?? TASK_SANITIZATION_MAP.default;
}

export function isProviderEligible(providerName: string): { eligible: boolean; reason?: string } {
  if (!AI_ENABLED) return { eligible: false, reason: "AI_ENABLED=false" };
  const spec = PROVIDERS[providerName as ProviderSpec["name"]];
  if (!spec) return { eligible: false, reason: `provider '${providerName}' não registrado` };
  if (!spec.enabled) return { eligible: false, reason: `${providerName} desabilitado` };
  if (spec.external && !AI_EXTERNAL_PROVIDERS_ALLOWED) {
    return { eligible: false, reason: "provedores externos desabilitados" };
  }
  return { eligible: true };
}

export function providerAllowedForMode(provider: ProviderSpec, mode: SanitizationMode): boolean {
  if (mode === SanitizationMode.LOCAL_COMPLETO) return !provider.external;
  return true;
}

export function resolveProviders(
  taskType: string,
  overrideMode?: SanitizationMode,
): ProviderSpec[] {
  const mode = overrideMode ?? getSanitizationMode(taskType);
  return Object.values(PROVIDERS)
    .filter((p) => isProviderEligible(p.name).eligible)
    .filter((p) => providerAllowedForMode(p, mode))
    .sort((a, b) => a.priority - b.priority);
}

export function hasAvailableProvider(taskType = "default"): boolean {
  return resolveProviders(taskType).length > 0;
}

export interface ValidationViolation {
  rule: string;
  severity: "error" | "warning";
  detail: string;
  excerpt?: string;
}

export interface ValidationResult {
  valid: boolean;
  violations: ValidationViolation[];
  markedAsDraft: boolean;
}

export function validateResponse(text: string): ValidationResult {
  const violations: ValidationViolation[] = [];
  const lower = text.toLowerCase();

  const promessaPatterns = [
    /vai\s+ganhar/gi,
    /100\s*%\s*(de\s+chance|de\s+probabilidade)/gi,
    /certeza\s+absoluta/gi,
    /garantia\s+de\s+(?:êxito|sucesso|vit[oó]ria)/gi,
    /sem\s+d[úu]vida\s+vencer/gi,
    /vit[oó]ria\s+garantida/gi,
  ];
  for (const pattern of promessaPatterns) {
    const match = text.match(pattern);
    if (match) {
      violations.push({
        rule: "VEDAÇÃO_PROMESSA_RESULTADO",
        severity: "error",
        detail: "A IA não pode prometer resultado. A comunicação jurídica deve respeitar o Estatuto, o Código de Ética e o Provimento CFOAB 205/2021, inclusive a vedação de promessa de resultados.",
        excerpt: match[0],
      });
    }
  }

  if (lower.includes("você deve") && !lower.includes("revisão") && !lower.includes("advogado")) {
    violations.push({
      rule: "ACONSELHAMENTO_SEM_RESSALVA",
      severity: "warning",
      detail: "A saída sugere ação sem ressalvar revisão jurídica humana.",
    });
  }

  const possibleCaseLaw = text.match(/(?:REsp|RE|AgInt|AREsp|HC|RHC)\s*[\d.]{5,}/gi);
  if (possibleCaseLaw) {
    for (const match of possibleCaseLaw.slice(0, 5)) {
      violations.push({
        rule: "JURISPRUDENCIA_NAO_VERIFICADA",
        severity: "warning",
        detail: `Citação '${match}' deve passar pelo Citation Gate antes de homologação.`,
        excerpt: match,
      });
    }
  }

  const hasDraftMarker =
    lower.includes("rascunho") ||
    lower.includes("revisão humana") ||
    lower.includes("sujeito a revisão") ||
    lower.includes("draft");
  if (!hasDraftMarker) {
    violations.push({
      rule: "AUSENCIA_MARCA_RASCUNHO",
      severity: "warning",
      detail: "Toda saída de IA deve permanecer identificada como rascunho até revisão humana.",
    });
  }

  const prazoPatterns = [
    /prazo\s+(?:de|para)\s+\d+\s+dias?\s+(?:úteis|corridos)/gi,
    /vence\s+em\s+\d+\s+dias/gi,
  ];
  for (const pattern of prazoPatterns) {
    const match = text.match(pattern);
    if (match) {
      violations.push({
        rule: "PRAZO_CALCULADO_AUTOMATICAMENTE",
        severity: "warning",
        detail: "Prazo processual exige conferência de calendário oficial, rito, publicação e suspensões.",
        excerpt: match[0],
      });
    }
  }

  return {
    valid: violations.every((v) => v.severity !== "error"),
    violations,
    markedAsDraft: hasDraftMarker,
  };
}

export function ensureDraftMarker(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("rascunho") || lower.includes("revisão humana") || lower.includes("sujeito a revisão")) {
    return text;
  }
  return text + "\n\n---\n⚠ **RASCUNHO GERADO POR IA** — Revisão por advogado é obrigatória antes de qualquer uso ou protocolo.";
}
