const STJ_CKAN_API = "https://dadosabertos.web.stj.jus.br/api/3/action/package_search";
const STJ_CACHE_MS = 10 * 60 * 1000;

type StjResource = { id?: string; format?: string; name?: string; url?: string };
type StjPackage = {
  id?: string;
  name?: string;
  title?: string;
  notes?: string;
  metadata_modified?: string;
  license_title?: string;
  license_url?: string;
  resources?: StjResource[];
};

type StjResponse = { success?: boolean; result?: { count?: number; results?: StjPackage[] } };

export type StjCatalogEntry = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  updatedAt: string | null;
  license: string;
  resourceCount: number;
  formats: string[];
  catalogUrl: string;
};

let cachedCatalog: { key: string; expiresAt: number; payload: { total: number; entries: StjCatalogEntry[] } } | null = null;

export function normalizeStjPackage(item: StjPackage): StjCatalogEntry {
  const resources = item.resources ?? [];
  return {
    id: item.id ?? item.name ?? "recurso-sem-identificador",
    slug: item.name ?? "",
    title: item.title ?? "Conjunto sem título",
    summary: (item.notes ?? "Sem descrição fornecida pelo catálogo.").replace(/<[^>]*>/g, "").slice(0, 320),
    updatedAt: item.metadata_modified ?? null,
    license: item.license_title ?? "Licença a conferir no catálogo",
    resourceCount: resources.length,
    formats: Array.from(new Set(resources.map(resource => resource.format?.toUpperCase()).filter((format): format is string => Boolean(format)))).slice(0, 6),
    catalogUrl: item.name ? `https://dadosabertos.web.stj.jus.br/dataset/${item.name}` : "https://dadosabertos.web.stj.jus.br/",
  };
}

export async function fetchStjJurisprudenceCatalog(rawQuery = "jurisprudencia") {
  const query = rawQuery.trim() || "jurisprudencia";
  const cacheKey = query.toLocaleLowerCase("pt-BR");
  if (cachedCatalog && cachedCatalog.key === cacheKey && cachedCatalog.expiresAt > Date.now()) return cachedCatalog.payload;

  const url = new URL(STJ_CKAN_API);
  url.searchParams.set("q", query);
  url.searchParams.set("rows", "12");
  const response = await fetch(url, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(12_000) });
  if (!response.ok) throw new Error(`Catálogo STJ indisponível (${response.status}).`);
  const body = await response.json() as StjResponse;
  if (!body.success || !body.result) throw new Error("O catálogo STJ retornou uma resposta sem confirmação de sucesso.");

  const payload = {
    total: Number(body.result.count ?? 0),
    entries: (body.result.results ?? []).map(normalizeStjPackage),
  };
  cachedCatalog = { key: cacheKey, expiresAt: Date.now() + STJ_CACHE_MS, payload };
  return payload;
}
