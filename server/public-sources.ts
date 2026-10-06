const STJ_CKAN_API = "https://dadosabertos.web.stj.jus.br/api/3/action/package_search";
const STJ_CACHE_MS = 10 * 60 * 1000;

// Metadados públicos canônicos. Neutralizam notas antigas até a migração de dados
// ser aplicada, sem tocar nas tabelas legadas que aguardam transferência segura.
const atlasSourceScope: Record<string, {
  integrationStatus: "integrated" | "not_integrated" | "manual_only";
  contentScope?: string;
  usageNote: string;
  privacyNote: string;
}> = {
  "cnj-djen-comunica": {
    integrationStatus: "not_integrated",
    contentScope: "Referência institucional ao Diário de Justiça Eletrônico Nacional; sem coleta de comunicações pelo Atlas.",
    usageNote: "Consulte o portal oficial. O Atlas não coleta nem armazena comunicações individualizadas.",
    privacyNote: "O Atlas não armazena teor de comunicações do DJEN.",
  },
  lexml: {
    integrationStatus: "not_integrated",
    usageNote: "Referência ao serviço público LexML; consulta automatizada não habilitada nesta versão.",
    privacyNote: "O Atlas não armazena documentos individualizados desta fonte.",
  },
  "stj-dados-abertos": {
    integrationStatus: "integrated",
    usageNote: "O Atlas consulta apenas metadados do catálogo CKAN; confirme o inteiro teor no portal oficial do STJ.",
    privacyNote: "O Atlas armazena apenas metadados públicos aprovados para o catálogo.",
  },
  "tjmg-jurisprudencia": {
    integrationStatus: "manual_only",
    usageNote: "Consulta manual nos formulários oficiais do tribunal; sem importação automática nesta versão.",
    privacyNote: "O catálogo do Atlas não importa dados de processos individuais desta fonte.",
  },
  "imprensa-oficial-mg": {
    integrationStatus: "not_integrated",
    contentScope: "Diário eletrônico do Executivo e atos públicos oficiais.",
    usageNote: "Consulta manual no portal oficial; confira atos e datas na origem.",
    privacyNote: "O Atlas não importa publicações individualizadas desta fonte.",
  },
};

export function applyAtlasPublicSourceScope<T extends { sourceKey: string }>(source: T): T {
  const override = atlasSourceScope[source.sourceKey];
  return override ? { ...source, ...override } : source;
}

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
