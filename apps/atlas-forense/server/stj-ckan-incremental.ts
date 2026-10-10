/**
 * Descoberta incremental de metadados CKAN do STJ.
 *
 * Não baixa documentos, não classifica datasets como acórdãos e não os aprova.
 * metadataFingerprint NÃO é hash do conteúdo do recurso: somente dos metadados CKAN.
 */
import { createHash } from "node:crypto";

export const STJ_CKAN_PACKAGE_SEARCH = "https://dadosabertos.web.stj.jus.br/api/3/action/package_search";

type CkanResource = {
  id?: unknown;
  name?: unknown;
  url?: unknown;
  format?: unknown;
  last_modified?: unknown;
  created?: unknown;
  size?: unknown;
  hash?: unknown;
};
type CkanPackage = {
  id?: unknown;
  name?: unknown;
  title?: unknown;
  metadata_modified?: unknown;
  license_title?: unknown;
  license_id?: unknown;
  license_url?: unknown;
  resources?: unknown;
};
type CkanEnvelope = {
  success?: unknown;
  result?: { count?: unknown; results?: unknown };
};

export type StjCatalogResource = {
  datasetId: string;
  resourceId: string;
  title: string;
  format: string | null;
  resourceUrl: string | null;
  datasetUpdatedAt: string | null;
  resourceUpdatedAt: string | null;
  license: string | null;
  licenseUrl: string | null;
  licenseStatus: "declared_unverified" | "needs_review";
  metadataFingerprint: string;
};

export type StjCatalogDiscovery = {
  reportedCount: number;
  pagesScanned: number;
  resources: StjCatalogResource[];
};

function nonEmpty(value: unknown, max = 1024): string | null {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, max) : null;
}

function httpsUrl(value: unknown): string | null {
  const raw = nonEmpty(value, 4096);
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function digest(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

/** Manifesto somente de metadados; licenças não são aprovadas automaticamente. */
export function normalizeStjCkanResources(dataset: CkanPackage): StjCatalogResource[] {
  const datasetId = nonEmpty(dataset.id, 191) ?? nonEmpty(dataset.name, 191);
  if (!datasetId || !Array.isArray(dataset.resources)) return [];
  const license = nonEmpty(dataset.license_id, 191) ?? nonEmpty(dataset.license_title, 191);
  const licenseUrl = httpsUrl(dataset.license_url);
  const title = nonEmpty(dataset.title, 500) ?? nonEmpty(dataset.name, 500) ?? "Dataset STJ";
  const updatedAt = nonEmpty(dataset.metadata_modified, 64);
  const result: StjCatalogResource[] = [];

  for (const raw of dataset.resources) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue;
    const item = raw as CkanResource;
    const resourceId = nonEmpty(item.id, 191);
    if (!resourceId) continue;
    const resourceUrl = httpsUrl(item.url);
    const format = nonEmpty(item.format, 48)?.toUpperCase() ?? null;
    const resourceUpdatedAt = nonEmpty(item.last_modified, 64) ?? nonEmpty(item.created, 64);
    const metadataFingerprint = digest({
      datasetId, resourceId, resourceUrl, title, format, updatedAt,
      resourceUpdatedAt, license, licenseUrl,
      size: typeof item.size === "number" && Number.isFinite(item.size) ? item.size : null,
      sourceDeclaredHash: nonEmpty(item.hash, 191),
    });
    result.push({
      datasetId, resourceId, title, format, resourceUrl,
      datasetUpdatedAt: updatedAt, resourceUpdatedAt,
      license, licenseUrl,
      licenseStatus: license ? "declared_unverified" : "needs_review",
      metadataFingerprint,
    });
  }
  return result;
}

/**
 * Paginação limitada e injetável para testes offline.
 * Erros de rede, HTTP, payload inválido e página inesperadamente vazia falham de modo explícito.
 */
export async function discoverStjCkanResources(options: {
  query?: string;
  pageSize?: number;
  maxPages?: number;
  fetchImpl?: typeof fetch;
} = {}): Promise<StjCatalogDiscovery> {
  const query = options.query?.trim() || "jurisprudencia";
  const bounded = (value: number | undefined, fallback: number, max: number) =>
    value === undefined || !Number.isFinite(value) ? fallback : Math.max(1, Math.min(max, Math.trunc(value)));
  const pageSize = bounded(options.pageSize, 50, 100);
  const maxPages = bounded(options.maxPages, 3, 10);
  const fetchImpl = options.fetchImpl ?? fetch;
  const seen = new Map<string, StjCatalogResource>();
  let reportedCount = 0;
  let pagesScanned = 0;

  for (let page = 0; page < maxPages; page++) {
    const url = new URL(STJ_CKAN_PACKAGE_SEARCH);
    url.searchParams.set("q", query);
    url.searchParams.set("rows", String(pageSize));
    url.searchParams.set("start", String(page * pageSize));
    const response = await fetchImpl(url.toString(), {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok) throw new Error(`STJ_CKAN_HTTP_${response.status}`);
    const envelope: unknown = await response.json();
    if (!envelope || typeof envelope !== "object" || Array.isArray(envelope)) {
      throw new Error("STJ_CKAN_INVALID_PAYLOAD");
    }
    const body = envelope as CkanEnvelope;
    if (body.success !== true || !body.result || !Array.isArray(body.result.results)) {
      throw new Error("STJ_CKAN_INVALID_PAYLOAD");
    }
    const count = body.result.count;
    if (typeof count !== "number" || !Number.isSafeInteger(count) || count < 0) {
      throw new Error("STJ_CKAN_INVALID_COUNT");
    }
    if (page === 0) reportedCount = count;
    if (page > 0 && count !== reportedCount) {
      throw new Error("STJ_CKAN_PAGINATION_RACE");
    }
    const datasets = body.result.results;
    pagesScanned += 1;
    if (datasets.length === 0 && page * pageSize < reportedCount) {
      throw new Error("STJ_CKAN_PREMATURE_EMPTY_PAGE");
    }
    if (datasets.length < pageSize && page * pageSize + datasets.length < reportedCount) {
      throw new Error("STJ_CKAN_INCOMPLETE_PAGE");
    }
    for (const raw of datasets) {
      if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue;
      for (const item of normalizeStjCkanResources(raw as CkanPackage)) {
        seen.set(`${item.datasetId}:${item.resourceId}`, item);
      }
    }
    if (datasets.length < pageSize || (page + 1) * pageSize >= reportedCount) break;
  }
  return { reportedCount, pagesScanned, resources: [...seen.values()] };
}

export function planStjMetadataChanges(
  current: readonly StjCatalogResource[],
  previousFingerprints: ReadonlyMap<string, string>,
): { changed: StjCatalogResource[]; unchanged: number } {
  const changed: StjCatalogResource[] = [];
  let unchanged = 0;
  for (const resource of current) {
    const key = `${resource.datasetId}:${resource.resourceId}`;
    if (previousFingerprints.get(key) === resource.metadataFingerprint) unchanged += 1;
    else changed.push(resource);
  }
  return { changed, unchanged };
}
