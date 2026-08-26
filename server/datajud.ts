const DATAJUD_BASE_URL = "https://api-publica.datajud.cnj.jus.br";

const aliases = ["tjmg", "trt3", "trf6", "tre-mg", "tjmmg"] as const;
export type DataJudAlias = (typeof aliases)[number];

export const DATAJUD_ALIASES = aliases;

export function getDataJudConnectionStatus() {
  const configured = Boolean(process.env.DATAJUD_API_KEY?.trim());
  return {
    configured,
    label: configured ? "Conector pronto para consulta administrativa" : "Aguardando chave temporária em ambiente seguro",
    citation: "Fonte: Conselho Nacional de Justiça — DataJud.",
    storagePolicy: "A chave não é gravada em código, banco de dados, interface ou trilha de auditoria.",
  };
}

function getDataJudKey() {
  const key = process.env.DATAJUD_API_KEY?.trim();
  if (!key) throw new Error("A consulta DataJud requer chave temporária configurada no ambiente seguro.");
  return key;
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

  const key = getDataJudKey();
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
