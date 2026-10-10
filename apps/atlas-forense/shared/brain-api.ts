/**
 * Contrato da API interna Atlas ⇄ Cérebro Jurídico (JuridIA/EJC).
 *
 * Funções puras (sem I/O) para validação e montagem de respostas, testáveis
 * isoladamente. A rota Express que as usa fica em server/brain-api.ts.
 *
 * Regras de governança (decisão do titular, 2026-10-10, sobre o manifesto de
 * 27/08/2026):
 * - Atlas → Cérebro: somente metadados públicos do Compêndio e jurimetria
 *   DESCRITIVA (contagens agregadas com cobertura e limites declarados).
 * - Cérebro → Atlas: somente teses/citações aprovadas por advogado, sem dado de
 *   caso ou de parte, com fonte oficial obrigatória e entrada na Fila Editorial
 *   como `pending_review` (nunca publicação automática).
 * - Proibido: taxa de êxito, ranking de magistrados, perfil de litigante,
 *   previsão de resultado (ver docs/roadmap-melhorias-benchmark.md).
 */

import { createHash } from "node:crypto";

export const BRAIN_API_PREFIX = "/api/internal/brain";
export const BRAIN_TOKEN_MIN_LENGTH = 32;
export const BRAIN_SEARCH_MAX_PAGE_SIZE = 20;
export const BRAIN_THESIS_SOURCE_KEY = "juridia-ejc";

/** Status de fonte aceitos como base de citação pelo Cérebro. */
export const BRAIN_CITABLE_SOURCE_STATUSES = ["official_confirmed", "official_without_number", "attachment_reviewed"] as const;

export const BRAIN_JURIMETRY_LIMITS = [
  "Contagens agregadas de processos distribuídos; não medem resultado, taxa de êxito, posição de magistrado ou perfil de parte.",
  "A cobertura depende da execução registrada de cada coleta (ver readiness/coverageNote); lacunas não equivalem a zero.",
  "Escopos distintos (nacional, RMBH cível/consumidor) não devem ser somados entre si.",
] as const;

const OFFICIAL_HOST_SUFFIXES = [".jus.br", ".gov.br", ".leg.br", ".mp.br", ".def.br"] as const;

/** URL oficial: HTTPS e domínio do Judiciário, Executivo, Legislativo, MP ou Defensoria. */
export function isOfficialSourceUrl(value: string | null | undefined): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    if (url.username || url.password) return false;
    const host = url.hostname.toLowerCase();
    return OFFICIAL_HOST_SUFFIXES.some(suffix => host.endsWith(suffix) && host.length > suffix.length);
  } catch {
    return false;
  }
}

const CPF_RE = /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/;
const CNPJ_RE = /\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/;
const EMAIL_RE = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const PHONE_RE = /\(?\b\d{2}\)?[\s-]?\d{4,5}-?\d{4}\b/;
const MARKER_RE = /\[[A-Z_]+_\d{4}\]/;

/** Detecta dado pessoal direto ou marcador de anonimização esquecido no texto. */
export function detectPersonalData(text: string): string[] {
  const found: string[] = [];
  if (CPF_RE.test(text)) found.push("CPF");
  if (CNPJ_RE.test(text)) found.push("CNPJ");
  if (EMAIL_RE.test(text)) found.push("EMAIL");
  if (PHONE_RE.test(text)) found.push("TELEFONE");
  if (MARKER_RE.test(text)) found.push("MARCADOR_ANONIMIZACAO");
  return found;
}

export type ThesisSubmissionInput = {
  title?: unknown;
  summary?: unknown;
  kind?: unknown;
  canonicalUrl?: unknown;
  authorityRefs?: unknown;
};

export type ValidThesisSubmission = {
  title: string;
  summary: string;
  kind: "jurisprudence" | "legislation";
  canonicalUrl: string;
  authorityRefs: string[];
  thesisKey: string;
};

export type ThesisValidation = { ok: true; value: ValidThesisSubmission } | { ok: false; errors: string[] };

function normalizeForKey(value: string) {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
}

/** Chave estável de idempotência: mesma tese + mesma fonte oficial = mesmo item na fila. */
export function buildThesisKey(title: string, canonicalUrl: string) {
  return createHash("sha256").update(`${normalizeForKey(title)}|${canonicalUrl.trim()}`).digest("hex").slice(0, 40);
}

export function validateThesisSubmission(input: ThesisSubmissionInput): ThesisValidation {
  const errors: string[] = [];
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const summary = typeof input.summary === "string" ? input.summary.trim() : "";
  const canonicalUrl = typeof input.canonicalUrl === "string" ? input.canonicalUrl.trim() : "";
  const kind = input.kind === "jurisprudence" || input.kind === "legislation" ? input.kind : null;

  if (title.length < 5 || title.length > 300) errors.push("title deve ter entre 5 e 300 caracteres");
  if (summary.length < 30 || summary.length > 900) errors.push("summary deve ter entre 30 e 900 caracteres");
  if (!kind) errors.push("kind deve ser 'jurisprudence' ou 'legislation'");
  if (!isOfficialSourceUrl(canonicalUrl) || canonicalUrl.length > 1_000) {
    errors.push("canonicalUrl deve ser uma URL HTTPS oficial (.jus.br, .gov.br, .leg.br, .mp.br ou .def.br)");
  }

  let authorityRefs: string[] = [];
  if (input.authorityRefs !== undefined) {
    if (!Array.isArray(input.authorityRefs) || input.authorityRefs.length > 5 || input.authorityRefs.some(ref => typeof ref !== "string" || ref.trim().length === 0 || ref.length > 200)) {
      errors.push("authorityRefs deve ser uma lista de até 5 textos de até 200 caracteres");
    } else {
      authorityRefs = (input.authorityRefs as string[]).map(ref => ref.trim());
    }
  }

  for (const [field, text] of [["title", title], ["summary", summary], ["authorityRefs", authorityRefs.join(" ")]] as const) {
    const personal = detectPersonalData(text);
    if (personal.length > 0) errors.push(`${field} contém dado pessoal ou marcador de anonimização (${personal.join(", ")}); remova antes de enviar`);
  }

  if (errors.length > 0 || !kind) return { ok: false, errors };
  return { ok: true, value: { title, summary, kind, canonicalUrl, authorityRefs, thesisKey: buildThesisKey(title, canonicalUrl) } };
}

type DecisionRow = {
  externalId: string;
  cnjNumber: string | null;
  tribunal: string;
  justice: string;
  city: string | null;
  court: string | null;
  judgingBody: string | null;
  decisionType: string;
  decisionDate: Date | string | null;
  legalArea: string | null;
  theme: string | null;
  reasoningSummary: string | null;
  sourceStatus: string;
  sourceId: number;
};

type SourceRow = { id: number; sourceUrl: string | null; publicStatus: string; lastVerifiedAt: Date | string | null };

export type BrainDecision = {
  externalId: string;
  citationId: string;
  tribunal: string;
  justice: string;
  city: string | null;
  court: string | null;
  judgingBody: string | null;
  decisionType: string;
  decisionDate: string | null;
  legalArea: string | null;
  theme: string | null;
  summary: string | null;
  sourceStatus: string;
  officialUrl: string | null;
  sourceVerifiedAt: string | null;
};

function toIso(value: Date | string | null | undefined) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

/**
 * Projeta um julgado do Compêndio para o Cérebro. A URL só segue adiante quando
 * for oficial e a fonte não estiver marcada como `not_for_use`; resumo é limitado.
 */
export function toBrainDecision(decision: DecisionRow, source: SourceRow | undefined): BrainDecision {
  const usable = source && source.publicStatus !== "not_for_use" && isOfficialSourceUrl(source.sourceUrl);
  return {
    externalId: decision.externalId,
    citationId: `atlas:${decision.externalId}`,
    tribunal: decision.tribunal,
    justice: decision.justice,
    city: decision.city,
    court: decision.court,
    judgingBody: decision.judgingBody,
    decisionType: decision.decisionType,
    decisionDate: toIso(decision.decisionDate),
    legalArea: decision.legalArea,
    theme: decision.theme,
    summary: decision.reasoningSummary ? decision.reasoningSummary.slice(0, 600) : null,
    sourceStatus: decision.sourceStatus,
    officialUrl: usable ? (source!.sourceUrl as string) : null,
    sourceVerifiedAt: toIso(source?.lastVerifiedAt),
  };
}

const TOP_N = 10;

type Amount = { amount: number };

function top<T extends Amount>(rows: T[] | undefined, limit = TOP_N) {
  return [...(rows ?? [])].sort((a, b) => b.amount - a.amount).slice(0, limit);
}

export type JurimetryInput = {
  civilConsumer?: {
    readiness: Record<string, unknown>;
    categories: Array<{ code: string; label: string; amount: number }>;
    municipalities: Array<{ municipalityIbgeCode: string; municipalityName: string; amount: number }>;
    bodies: Array<{ judgingBodyCode: string; judgingBodyLabel: string; municipalityName: string; amount: number }>;
    monthly: Array<{ month: string; amount: number }>;
    total: number;
  } | null;
  national?: {
    readiness: { latest?: unknown } & Record<string, unknown>;
    tribunals: Array<{ alias: string; uf: string | null; amount: number }>;
    subjects: Array<{ code: string; label: string; amount: number }>;
    monthly: Array<{ month: string; amount: number }>;
  } | null;
};

/** Monta o bloco descritivo de jurimetria com limites explícitos; nunca calcula êxito. */
export function buildJurimetrySummary(input: JurimetryInput) {
  const civil = input.civilConsumer;
  const national = input.national;
  const civilAvailable = Boolean(civil && civil.total > 0);
  const nationalAvailable = Boolean(national && national.monthly.length > 0);
  return {
    kind: "descriptive" as const,
    limits: [...BRAIN_JURIMETRY_LIMITS],
    rmbhCivilConsumer: civil
      ? {
          available: civilAvailable,
          readiness: civil.readiness,
          total: civil.total,
          topCategories: top(civil.categories),
          topMunicipalities: top(civil.municipalities),
          topJudgingBodies: top(civil.bodies),
          monthly: civil.monthly,
        }
      : { available: false, readiness: {} as Record<string, unknown>, total: 0, topCategories: [], topMunicipalities: [], topJudgingBodies: [], monthly: [] },
    nationalJec: national
      ? {
          available: nationalAvailable,
          readiness: national.readiness,
          topTribunals: top(national.tribunals),
          topSubjects: top(national.subjects),
          monthly: national.monthly,
        }
      : { available: false, readiness: {} as Record<string, unknown>, topTribunals: [], topSubjects: [], monthly: [] },
  };
}

/** Compacta o resumo em texto curto para ancorar o prompt de viabilidade do Cérebro. */
export function jurimetrySummaryToPrompt(summary: ReturnType<typeof buildJurimetrySummary>): string {
  const lines: string[] = [];
  const civil = summary.rmbhCivilConsumer;
  if (civil.available) {
    lines.push(`RMBH cível/consumidor (JEC): ${civil.total} processos distribuídos no período coberto.`);
    if (civil.topCategories.length) lines.push(`Principais assuntos: ${civil.topCategories.slice(0, 5).map(c => `${c.label} (${c.amount})`).join("; ")}.`);
    if (civil.topMunicipalities.length) lines.push(`Principais municípios: ${civil.topMunicipalities.slice(0, 5).map(m => `${m.municipalityName} (${m.amount})`).join("; ")}.`);
  }
  const national = summary.nationalJec;
  if (national.available) {
    if (national.topTribunals.length) lines.push(`JEC nacional, maiores volumes por tribunal: ${national.topTribunals.slice(0, 5).map(t => `${t.alias} (${t.amount})`).join("; ")}.`);
  }
  if (lines.length === 0) lines.push("Sem dados de jurimetria disponíveis no Atlas para este recorte.");
  lines.push("Limites: dados descritivos de distribuição; NÃO indicam resultado, taxa de êxito nem tendência decisória.");
  return lines.join("\n");
}
