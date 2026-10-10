/** Public, metadata-only discovery. Never collects case text or party identities.
 * Dataset listings are NOT precedents. Every result enters editorial pending_review.
 */
import { createHash } from "node:crypto";
import { discoverStjCkanResources } from "./stj-ckan-incremental";

export type PublicCandidate = {
  sourceKey: string;
  externalKey: string;
  kind: "official_update";
  title: string;
  summary: string;
  canonicalUrl: string;
  publishedAt: Date | null;
  contentHash: string;
};

const sha = (value: string) => createHash("sha256").update(value).digest("hex");
const allowedStj = "https://dadosabertos.web.stj.jus.br/";
const comunicaUrl = "https://comunicaapi.pje.jus.br/api/v1/comunicacao";
const djenPortal = "https://comunica.pje.jus.br/";

function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + "T12:00:00Z");
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/** Interpret date at America/Sao_Paulo, not the server's timezone. */
export function previousSaoPauloDate(now = new Date()): string {
  const local = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(now);
  if (!validDate(local)) throw new Error("LOCAL_DATE_INVALID");
  const yesterday = new Date(local + "T12:00:00Z");
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  return yesterday.toISOString().slice(0, 10);
}

export async function collectStjResourceCandidates(options: {
  fetchImpl?: typeof fetch;
  maxPages?: number;
} = {}): Promise<{ candidates: PublicCandidate[]; truncated: boolean; discoveredResources: number }> {
  const maxPages = Math.max(1, Math.min(10, options.maxPages ?? 3));
  const manifest = await discoverStjCkanResources({
    fetchImpl: options.fetchImpl, pageSize: 50, maxPages,
  });
  const candidates: PublicCandidate[] = [];
  const newestFirst = [...manifest.resources].sort((a, b) =>
    (b.resourceUpdatedAt ?? b.datasetUpdatedAt ?? "").localeCompare(
      a.resourceUpdatedAt ?? a.datasetUpdatedAt ?? "",
    ),
  );
  for (const resource of newestFirst) {
    if (!resource.resourceUrl || !resource.license || resource.licenseStatus !== "declared_unverified") continue;
    // Resources can be hosted elsewhere. We publish only the trusted STJ dataset page,
    // never download unverified URLs or claim any licence is approved.
    const catalog = new URL("dataset/" + encodeURIComponent(resource.datasetSlug ?? resource.datasetId), allowedStj).toString();
    const key = "stj:" + sha(resource.datasetId + ":" + resource.resourceId).slice(0, 24) +
      ":" + resource.metadataFingerprint.slice(0, 24);
    const title = "STJ, dataset atualizado: " + resource.title.slice(0, 425);
    const summary = "Metadados de recurso CKAN (" + (resource.format ?? "desconhecido") +
      "). Licença declarada: " + resource.license.slice(0, 110) +
      ". Conteúdo e aplicabilidade não verificados. Exige revisão.";
    // The fingerprint tracks CKAN METADATA; it is never presented as an official file hash.
    candidates.push({
      sourceKey: "stj-dados-abertos",
      externalKey: key,
      kind: "official_update",
      title: title.slice(0, 500),
      summary,
      canonicalUrl: catalog,
      publishedAt: null,
      contentHash: resource.metadataFingerprint,
    });
  }
  // Do not claim comprehensive coverage if the bounded discovery stops early.
  return {
    candidates, discoveredResources: manifest.resources.length,
    truncated: manifest.pagesScanned === maxPages && manifest.reportedCount > maxPages * 50,
  };
}

/** Bounded database-write plan, resuming from existing keys on the next daily run. */
export function selectUnseenCandidates(
  candidates: readonly PublicCandidate[],
  existingKeys: ReadonlySet<string>,
  maxPerRun = 250,
): { selected: PublicCandidate[]; deferred: number; alreadyKnown: number } {
  const limit = Number.isSafeInteger(maxPerRun) ? Math.max(1, Math.min(500, maxPerRun)) : 250;
  const selected: PublicCandidate[] = [];
  let deferred = 0;
  let alreadyKnown = 0;
  const seen = new Set<string>();
  for (const item of candidates) {
    if (existingKeys.has(item.externalKey) || seen.has(item.externalKey)) {
      alreadyKnown++;
      continue;
    }
    seen.add(item.externalKey);
    if (selected.length < limit) selected.push(item);
    else deferred++;
  }
  return { selected, deferred, alreadyKnown };
}

type DjenEnvelope = {
  status?: unknown;
  count?: unknown;
  items?: unknown;
};
function communicationId(item: Record<string, unknown>): string | null {
  const value = item.hash ?? item.idComunicacao ?? item.id;
  return typeof value === "string" && /^[a-zA-Z0-9_-]{1,128}$/.test(value) ? value : null;
}

/** Ingests metadata, not personal communications; no process number, names, or HTML stored. */
export async function collectDjenDailyCandidates(options: {
  date?: string;
  tribunals?: readonly string[];
  maxPages?: number;
  pageSize?: number;
  fetchImpl?: typeof fetch;
  backoffMs?: number;
} = {}): Promise<{ candidates: PublicCandidate[]; truncated: boolean; total: number }> {
  const date = options.date ?? previousSaoPauloDate();
  if (!validDate(date)) throw new Error("DJEN_INVALID_DATE");
  const tribunals = options.tribunals ?? ["TJMG"];
  const maxPages = Math.max(1, Math.min(10, options.maxPages ?? 3));
  const pageSize = Math.max(1, Math.min(100, options.pageSize ?? 100));
  const fetchImpl = options.fetchImpl ?? fetch;
  const candidates: PublicCandidate[] = [];
  let truncated = false;
  let total = 0;
  for (const tribunal of tribunals) {
    if (!/^[A-Z0-9]{2,12}$/.test(tribunal)) throw new Error("DJEN_INVALID_TRIBUNAL");
    for (let page = 1; page <= maxPages; page++) {
      const url = new URL(comunicaUrl);
      for (const [k, v] of Object.entries({
        siglaTribunal: tribunal,
        dataDisponibilizacaoInicio: date,
        dataDisponibilizacaoFim: date,
        pagina: String(page),
        itensPorPagina: String(pageSize),
      })) url.searchParams.set(k, v);
      const response = await fetchImpl(url.toString(), {
        headers: { Accept: "application/json" }, signal: AbortSignal.timeout(15000),
      });
      if (response.status === 429) {
        // A caller/scheduler decides when to retry. Never rotate IPs.
        throw new Error("DJEN_HTTP_429_RETRY_AFTER_60S");
      }
      if (!response.ok) throw new Error("DJEN_HTTP_" + response.status);
      const parsed: unknown = await response.json();
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("DJEN_INVALID_PAYLOAD");
      const data = parsed as DjenEnvelope;
      if (data.status !== undefined && data.status !== "success") throw new Error("DJEN_SOURCE_NOT_SUCCESS");
      if (!Array.isArray(data.items) || typeof data.count !== "number" || !Number.isSafeInteger(data.count) || data.count < 0) {
        throw new Error("DJEN_INVALID_PAYLOAD");
      }
      total += page === 1 ? data.count : 0;
      const remaining = data.count - (page - 1) * pageSize;
      if (remaining > data.items.length && data.items.length < pageSize) throw new Error("DJEN_INCOMPLETE_PAGE");
      for (const raw of data.items) {
        if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue;
        const id = communicationId(raw as Record<string, unknown>);
        if (!id) continue;
        const sourceKey = "cnj-djen-daily";
        const externalKey = "djen:" + sha(tribunal + ":" + date + ":" + id).slice(0, 48);
        const summary = "Registro de publicação pública disponibilizado em " + date +
          " pelo " + tribunal + ". Sem conteúdo pessoal. Não constitui precedente.";
        candidates.push({
          sourceKey, externalKey, kind: "official_update",
          title: "DJEN: publicação oficial " + tribunal + " em " + date,
          summary,
          canonicalUrl: djenPortal,
          publishedAt: new Date(date + "T12:00:00Z"),
          contentHash: sha(externalKey),
        });
      }
      if (page * pageSize >= data.count) break;
      if (page === maxPages) truncated = true;
    }
  }
  return { candidates, truncated, total };
}
