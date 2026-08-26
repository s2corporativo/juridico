const DATAJUD_BASE_URL = "https://api-publica.datajud.cnj.jus.br";
const DATAJUD_ACCESS_URL = "https://datajud-wiki.cnj.jus.br/api-publica/acesso/";

const aliases = ["tjmg", "trt3", "trf6", "tre-mg", "tjmmg"] as const;
export type DataJudAlias = (typeof aliases)[number];

export const DATAJUD_ALIASES = aliases;
export const NATIONAL_DATAJUD_ALIASES = ["tjac", "tjal", "tjam", "tjap", "tjba", "tjce", "tjdft", "tjes", "tjgo", "tjma", "tjmg", "tjms", "tjmt", "tjpa", "tjpb", "tjpe", "tjpi", "tjpr", "tjrj", "tjrn", "tjro", "tjrr", "tjrs", "tjsc", "tjse", "tjsp", "tjto"] as const;
export type NationalDataJudAlias = (typeof NATIONAL_DATAJUD_ALIASES)[number];

export function getDataJudConnectionStatus() {
  const configured = Boolean(process.env.DATAJUD_API_KEY?.trim());
  return {
    configured: true,
    label: configured ? "Conector pronto com chave temporária do ambiente" : "Conector pronto para obter a chave pública oficial em memória",
    citation: "Fonte: Conselho Nacional de Justiça — DataJud.",
    storagePolicy: "A chave pública é resolvida apenas em memória no momento da consulta e não é gravada em código, banco de dados, interface, log ou trilha de auditoria.",
  };
}

export function extractPublicDataJudKey(accessPage: string) {
  const text = accessPage.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ");
  const marker = text.indexOf("Authorization: APIKey");
  if (marker < 0) return null;
  return text.slice(marker, marker + 280).match(/[A-Za-z0-9_-]{40,}={0,2}/)?.[0] ?? null;
}

async function getDataJudKey() {
  const key = process.env.DATAJUD_API_KEY?.trim();
  if (key) return key;
  const response = await fetch(DATAJUD_ACCESS_URL, { signal: AbortSignal.timeout(10_000), headers: { Accept: "text/html" } });
  if (!response.ok) throw new Error("Não foi possível consultar a página oficial de acesso do DataJud.");
  const publicKey = extractPublicDataJudKey(await response.text());
  if (!publicKey) throw new Error("A Wiki oficial do DataJud não apresentou uma chave pública reconhecível.");
  return publicKey;
}

export async function checkDataJudCoverage(requestedAliases: readonly NationalDataJudAlias[] = NATIONAL_DATAJUD_ALIASES) {
  const key = await getDataJudKey();
  const checkedAt = new Date().toISOString();
  const uniqueAliases = Array.from(new Set(requestedAliases));
  const items: Array<{ alias: NationalDataJudAlias; status: "available" | "unavailable" | "rejected" }> = [];

  for (const alias of uniqueAliases) {
    try {
      const response = await fetch(`${DATAJUD_BASE_URL}/api_publica_${alias}/_search`, {
        method: "POST",
        headers: { Authorization: `APIKey ${key}`, "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ size: 0, track_total_hits: false, query: { match_none: {} } }),
        signal: AbortSignal.timeout(15_000),
      });
      items.push({ alias, status: response.ok ? "available" : response.status === 401 || response.status === 403 ? "rejected" : "unavailable" });
    } catch {
      items.push({ alias, status: "unavailable" });
    }
  }

  const available = items.filter(item => item.status === "available").length;
  return {
    checkedAt,
    total: items.length,
    available,
    coveragePct: items.length ? Math.round((available / items.length) * 1000) / 10 : 0,
    items,
    citation: "Fonte: Conselho Nacional de Justiça — DataJud. A verificação confirma apenas resposta do alias, não completude nem comparabilidade do acervo.",
  };
}

function readName(value: unknown) {
  if (!value || typeof value !== "object") return null;
  const candidate = value as { nome?: unknown };
  return typeof candidate.nome === "string" ? candidate.nome : null;
}

function sanitizeHit(source: Record<string, unknown>) {
  const rawMovements = Array.isArray(source.movimentos) ? source.movimentos : [];
  return {
    numeroProcesso: typeof source.numeroProcesso === "string" ? source.numeroProcesso : null,
    tribunal: typeof source.tribunal === "string" ? source.tribunal : null,
    updatedAt: typeof source["@timestamp"] === "string" ? source["@timestamp"] : null,
    classe: readName(source.classe),
    orgaoJulgador: readName(source.orgaoJulgador),
    assuntos: (Array.isArray(source.assuntos) ? source.assuntos : []).map(readName).filter((value): value is string => Boolean(value)).slice(0, 12),
    movimentos: rawMovements.map(movement => {
      const record = movement && typeof movement === "object" ? movement as Record<string, unknown> : {};
      return {
        date: typeof record.dataHora === "string" ? record.dataHora : typeof record.data === "string" ? record.data : null,
        name: readName(record) ?? (typeof record.nome === "string" ? record.nome : null),
      };
    }).filter(movement => movement.date || movement.name).slice(-40),
  };
}

export async function lookupDataJudByProcess(alias: DataJudAlias, processNumber: string) {
  const normalizedNumber = processNumber.replace(/[^0-9]/g, "");
  if (normalizedNumber.length < 15 || normalizedNumber.length > 25) throw new Error("Informe um número CNJ válido para a consulta DataJud.");

  const key = await getDataJudKey();
  const response = await fetch(`${DATAJUD_BASE_URL}/api_publica_${alias}/_search`, {
    method: "POST",
    headers: { Authorization: `APIKey ${key}`, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ size: 1, query: { match: { numeroProcesso: normalizedNumber } }, _source: ["numeroProcesso", "tribunal", "@timestamp", "classe", "assuntos", "orgaoJulgador", "movimentos"] }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`DataJud indisponível para a consulta (${response.status}).`);
  const body = await response.json() as { hits?: { hits?: Array<{ _source?: Record<string, unknown> }> } };
  const hit = body.hits?.hits?.[0]?._source;
  return { found: Boolean(hit), record: hit ? sanitizeHit(hit) : null, citation: "Fonte: Conselho Nacional de Justiça — DataJud." };
}
