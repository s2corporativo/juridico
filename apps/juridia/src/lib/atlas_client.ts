// atlas_client.ts — Cliente da API interna do Atlas Forense (Compêndio + jurimetria + retorno de teses).
//
// Contrato: apps/atlas-forense/shared/brain-api.ts · rotas em /api/internal/brain/*.
// Governança (decisão do titular, 2026-10-10):
//  - Atlas → Cérebro: somente metadados públicos do Compêndio e jurimetria DESCRITIVA.
//  - Cérebro → Atlas: somente teses aprovadas por advogado, sem dado de caso/parte, com fonte oficial.
//  - Nenhum fato do caso é enviado ao Atlas: as buscas usam apenas termos jurídicos genéricos
//    (palavras minúsculas, sem dígitos, sem marcadores), nunca nomes, números ou valores.
// Falha graciosa: nunca lança; o chamador recebe { ok:false } e segue em modo degradado sinalizado.

const ATLAS_TOKEN_MIN_LENGTH = 32;
const DEFAULT_TIMEOUT_MS = 8_000;

export interface AtlasConfig {
  baseUrl: string;
  token: string;
}

export type AtlasResult<T> = { ok: true; data: T } | { ok: false; error: string; status?: number };

export interface AtlasDecision {
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
}

export interface AtlasJurimetry {
  partial: boolean;
  limits: string[];
  summary: unknown;
  promptBlock: string;
}

function isLoopback(url: URL) {
  return url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "[::1]";
}

/**
 * Configuração por env. Fail-closed: sem URL válida e token forte, a integração fica desligada.
 * Em produção exige HTTPS, exceto loopback (Atlas e JuridIA na mesma VPS).
 */
export function getAtlasConfig(env: NodeJS.ProcessEnv = process.env): AtlasConfig | null {
  const rawUrl = env.ATLAS_API_URL?.trim();
  const token = env.ATLAS_BRAIN_API_TOKEN?.trim();
  if (!rawUrl || !token || token.length < ATLAS_TOKEN_MIN_LENGTH) return null;
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && !(url.protocol === "http:" && (isLoopback(url) || env.NODE_ENV !== "production"))) return null;
  if (url.username || url.password) return null;
  return { baseUrl: url.origin, token };
}

export function isAtlasConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
  return getAtlasConfig(env) !== null;
}

type FetchLike = typeof fetch;

export async function atlasRequest<T>(
  path: string,
  init: { method?: "GET" | "POST"; query?: Record<string, string | number | undefined>; body?: unknown; timeoutMs?: number } = {},
  deps: { config?: AtlasConfig | null; fetchImpl?: FetchLike } = {},
): Promise<AtlasResult<T>> {
  const config = deps.config === undefined ? getAtlasConfig() : deps.config;
  if (!config) return { ok: false, error: "atlas_not_configured" };
  const fetchImpl = deps.fetchImpl ?? fetch;
  const url = new URL(`/api/internal/brain${path}`, config.baseUrl);
  for (const [key, value] of Object.entries(init.query ?? {})) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }
  try {
    const res = await fetchImpl(url, {
      method: init.method ?? "GET",
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: "application/json",
        ...(init.body !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
      signal: AbortSignal.timeout(init.timeoutMs ?? DEFAULT_TIMEOUT_MS),
    });
    let payload: unknown = null;
    try {
      payload = await res.json();
    } catch {
      payload = null;
    }
    if (!res.ok) {
      const error = (payload as { error?: string } | null)?.error ?? `atlas_http_${res.status}`;
      return { ok: false, error, status: res.status };
    }
    return { ok: true, data: payload as T };
  } catch (e) {
    return { ok: false, error: e instanceof Error && e.name === "TimeoutError" ? "atlas_timeout" : "atlas_unreachable" };
  }
}

// ── Snapshot aprovado do Atlas (somente metadados, sem banco compartilhado) ───
export interface AtlasKnowledgeMetadataItem {
  atlasItemId: string;
  sourceKey: "stj-dados-abertos" | "cnj-djen-daily";
  sourceType: "official_update";
  tribunal: "STJ" | "CNJ";
  title: string;
  officialUrl: string;
  publishedAt: string | null;
  provenanceHash: string;
  editorialStatus: "approved";
  documentStatus: "discovery_only";
  citableAsPrecedent: false;
  text: null;
}

export interface AtlasKnowledgeSnapshot {
  ok: true;
  contractVersion: 1;
  snapshotVersion: string;
  total: number;
  page: number;
  pageSize: number;
  items: AtlasKnowledgeMetadataItem[];
  complete: boolean;
  methodology: string;
}

/** The caller must verify a stable snapshotVersion on every page and replace its
 * own local cache atomically. This client never accesses the Atlas database.
 */
export async function fetchAtlasKnowledgeSnapshot(
  page = 0,
  version?: string,
  deps: { config?: AtlasConfig | null; fetchImpl?: FetchLike } = {},
): Promise<AtlasResult<AtlasKnowledgeSnapshot>> {
  if (!Number.isSafeInteger(page) || page < 0 || page > 1000 || (page > 0 && !version)) {
    return { ok: false, error: "invalid_snapshot_cursor" };
  }
  const result = await atlasRequest<AtlasKnowledgeSnapshot>("/knowledge/snapshot", {
    query: { page, pageSize: 50, version },
  }, deps);
  if (!result.ok) return result;
  const data = result.data;
  if (!data || data.contractVersion !== 1 || !/^v1:[a-f0-9]{64}$/.test(data.snapshotVersion) ||
      !Array.isArray(data.items) || !Number.isSafeInteger(data.total) || data.total < 0 ||
      data.page !== page || !Number.isSafeInteger(data.pageSize) || data.pageSize < 1 || data.pageSize > 100 ||
      (version && version !== data.snapshotVersion) ||
      data.items.some(item =>
        item.editorialStatus !== "approved" ||
        item.documentStatus !== "discovery_only" ||
        item.citableAsPrecedent !== false ||
        item.text !== null ||
        !/^[a-f0-9]{64}$/.test(item.provenanceHash))) {
    return { ok: false, error: "invalid_atlas_knowledge_contract" };
  }
  return result;
}

// ── Termos de busca (somente vocabulário jurídico genérico) ──────────────────

const STOP_WORDS = new Set([
  "sobre", "entre", "porque", "quando", "quanto", "qualquer", "também", "ainda", "assim", "contra", "durante",
  "desde", "mesmo", "mesma", "outro", "outra", "outros", "outras", "esse", "essa", "esses", "essas", "neste",
  "nesta", "daquele", "daquela", "pelo", "pela", "pelos", "pelas", "seja", "sejam", "será", "serão", "pode",
  "podem", "deve", "devem", "caso", "casos", "parte", "partes", "forma", "modo", "tempo", "ficou", "foram",
  "havia", "houve", "deveria", "podendo", "existe", "existem", "possível", "possibilidade", "cabível",
  "cabimento", "análise", "questão", "questões", "jurídica", "jurídicas", "jurídico", "jurídicos", "direito",
  "fatos", "fato", "autor", "autora", "requerente", "requerido", "requerida", "cliente", "pedido", "pedidos",
]);

/**
 * Extrai até `max` termos do texto para consultar o Compêndio. Só passam palavras escritas
 * integralmente em minúsculas (nomes próprios começam em maiúscula), sem dígitos, sem marcadores
 * de anonimização e fora da lista de palavras vazias. Ordena por frequência e, depois, tamanho.
 */
export function extractSearchTerms(text: string, max = 3): string[] {
  const counts = new Map<string, number>();
  for (const raw of text.split(/[^\p{L}\p{N}\[\]_-]+/u)) {
    if (raw.length < 6 || raw.length > 30) continue;
    if (/[\d\[\]_]/.test(raw)) continue;
    if (raw !== raw.toLowerCase()) continue;
    if (STOP_WORDS.has(raw)) continue;
    counts.set(raw, (counts.get(raw) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length || a[0].localeCompare(b[0], "pt-BR"))
    .slice(0, max)
    .map(([term]) => term);
}

// ── Compêndio ────────────────────────────────────────────────────────────────

interface SearchResponse {
  ok: true;
  total: number;
  items: AtlasDecision[];
}

export interface AtlasSearchOutcome {
  items: AtlasDecision[];
  termsUsed: string[];
  failedTerms: number;
}

/** Consulta cada termo em paralelo e funde por externalId, priorizando quem casa mais termos. */
export async function searchAtlasCompendium(
  terms: string[],
  opts: { perTerm?: number; limit?: number } = {},
  deps: { config?: AtlasConfig | null; fetchImpl?: FetchLike } = {},
): Promise<AtlasResult<AtlasSearchOutcome>> {
  const useTerms = terms.slice(0, 3);
  if (useTerms.length === 0) return { ok: true, data: { items: [], termsUsed: [], failedTerms: 0 } };
  const responses = await Promise.all(
    useTerms.map(term => atlasRequest<SearchResponse>("/compendium/search", { query: { q: term, pageSize: opts.perTerm ?? 6 } }, deps)),
  );
  const failed = responses.filter(r => !r.ok);
  if (failed.length === responses.length) {
    const first = failed[0] as { ok: false; error: string; status?: number };
    return { ok: false, error: first.error, status: first.status };
  }
  const merged = new Map<string, { item: AtlasDecision; hits: number }>();
  for (const response of responses) {
    if (!response.ok) continue;
    for (const item of response.data.items ?? []) {
      const current = merged.get(item.externalId);
      if (current) current.hits += 1;
      else merged.set(item.externalId, { item, hits: 1 });
    }
  }
  const items = Array.from(merged.values())
    .sort((a, b) => b.hits - a.hits || (b.item.decisionDate ?? "").localeCompare(a.item.decisionDate ?? ""))
    .slice(0, opts.limit ?? 8)
    .map(entry => entry.item);
  return { ok: true, data: { items, termsUsed: useTerms, failedTerms: failed.length } };
}

// ── Jurimetria ───────────────────────────────────────────────────────────────

export async function fetchAtlasJurimetry(
  filter: { from?: string; to?: string; municipalityIbgeCode?: string } = {},
  deps: { config?: AtlasConfig | null; fetchImpl?: FetchLike } = {},
): Promise<AtlasResult<AtlasJurimetry>> {
  const res = await atlasRequest<{ ok: true; partial: boolean; limits: string[]; summary: unknown; promptBlock: string }>(
    "/jurimetry",
    { query: filter },
    deps,
  );
  if (!res.ok) return res;
  return { ok: true, data: { partial: res.data.partial, limits: res.data.limits, summary: res.data.summary, promptBlock: res.data.promptBlock } };
}

// ── Retorno de teses ─────────────────────────────────────────────────────────

export interface ThesisSubmission {
  title: string;
  summary: string;
  kind: "jurisprudence" | "legislation";
  canonicalUrl: string;
  authorityRefs?: string[];
}

export interface ThesisReceipt {
  queued: boolean;
  duplicate: boolean;
  status: "pending_review";
  thesisKey: string;
}

export async function submitThesisToAtlas(
  submission: ThesisSubmission,
  deps: { config?: AtlasConfig | null; fetchImpl?: FetchLike } = {},
): Promise<AtlasResult<ThesisReceipt>> {
  const res = await atlasRequest<{ ok: true } & ThesisReceipt & { details?: string[] }>("/theses", { method: "POST", body: submission }, deps);
  if (!res.ok) return res;
  return { ok: true, data: { queued: res.data.queued, duplicate: res.data.duplicate, status: res.data.status, thesisKey: res.data.thesisKey } };
}

// ── Mapeamento para o resultado do Cérebro ───────────────────────────────────

/** Qualidade documental da fonte (não é probabilidade de êxito nem força jurídica). */
const SOURCE_QUALITY: Record<string, number> = {
  official_confirmed: 0.9,
  attachment_reviewed: 0.8,
  official_without_number: 0.7,
};

export interface BrainJurisprudenceItem {
  name: string;
  url: string;
  snippet: string;
  host_name: string;
  favorable: boolean | null;
  state: "jurisprudencia" | "hipotese";
  confidence: number;
  origin: "atlas_compendio" | "web_nao_verificado";
  citationId?: string;
  sourceStatus?: string;
  decisionDate?: string | null;
}

export function decisionToBrainItem(decision: AtlasDecision): BrainJurisprudenceItem {
  const ref = [decision.tribunal, decision.court ?? decision.judgingBody, decision.decisionType].filter(Boolean).join(" · ");
  return {
    name: `${decision.theme ?? "Julgado do Compêndio"} (${ref})`.slice(0, 300),
    url: decision.officialUrl ?? "",
    snippet: (decision.summary ?? "Resumo não disponível no Compêndio.").slice(0, 400),
    host_name: `Compêndio Atlas · ${decision.tribunal}`,
    favorable: null,
    state: "jurisprudencia",
    confidence: SOURCE_QUALITY[decision.sourceStatus] ?? 0.5,
    origin: "atlas_compendio",
    citationId: decision.citationId,
    sourceStatus: decision.sourceStatus,
    decisionDate: decision.decisionDate,
  };
}

export function webResultToBrainItem(x: { url: string; name: string; snippet: string; host_name: string }): BrainJurisprudenceItem {
  return {
    name: x.name,
    url: x.url,
    snippet: x.snippet,
    host_name: x.host_name,
    favorable: null,
    // Resultado de busca web aberta não é jurisprudência verificada: entra como hipótese de baixa confiança.
    state: "hipotese",
    confidence: 0.3,
    origin: "web_nao_verificado",
  };
}
