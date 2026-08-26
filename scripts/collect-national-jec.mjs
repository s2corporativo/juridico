import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";

const ACCESS_URL = "https://datajud-wiki.cnj.jus.br/api-publica/acesso/";
const BASE_URL = "https://api-publica.datajud.cnj.jus.br";
const PERIOD_START = "2025-01";
const PERIOD_END = "2026-08";
const CONCURRENCY = 3;
const CLASS_CODE = 436;
const aliases = [
  ["tjac", "AC"], ["tjal", "AL"], ["tjam", "AM"], ["tjap", "AP"], ["tjba", "BA"], ["tjce", "CE"], ["tjdft", "DF"], ["tjes", "ES"], ["tjgo", "GO"], ["tjma", "MA"], ["tjmg", "MG"], ["tjms", "MS"], ["tjmt", "MT"], ["tjpa", "PA"], ["tjpb", "PB"], ["tjpe", "PE"], ["tjpi", "PI"], ["tjpr", "PR"], ["tjrj", "RJ"], ["tjrn", "RN"], ["tjro", "RO"], ["tjrr", "RR"], ["tjrs", "RS"], ["tjsc", "SC"], ["tjse", "SE"], ["tjsp", "SP"], ["tjto", "TO"],
];

function monthsBetween(start, end) {
  const values = [];
  const [startYear, startMonth] = start.split("-").map(Number);
  const [endYear, endMonth] = end.split("-").map(Number);
  for (let year = startYear, month = startMonth; year < endYear || (year === endYear && month <= endMonth); month += 1) {
    if (month === 13) { year += 1; month = 1; }
    values.push(`${year}-${String(month).padStart(2, "0")}`);
  }
  return values;
}

function monthBounds(month) {
  const [year, number] = month.split("-").map(Number);
  const next = number === 12 ? { year: year + 1, month: 1 } : { year, month: number + 1 };
  return {
    gte: `${year}${String(number).padStart(2, "0")}01000000`,
    lt: `${next.year}${String(next.month).padStart(2, "0")}01000000`,
  };
}

function buildQuery(month) {
  return {
    size: 0,
    track_total_hits: true,
    query: {
      bool: {
        must: [
          { match: { grau: "JE" } },
          { terms: { "classe.codigo": [CLASS_CODE] } },
          { range: { dataAjuizamento: monthBounds(month) } },
        ],
      },
    },
  };
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

async function publicKeyInMemory() {
  const response = await fetch(ACCESS_URL, { headers: { Accept: "text/html" }, signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`Página oficial de acesso indisponível (HTTP ${response.status}).`);
  const text = (await response.text()).replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ");
  const marker = text.indexOf("Authorization: APIKey");
  const key = marker >= 0 ? text.slice(marker, marker + 280).match(/[A-Za-z0-9_-]{40,}={0,2}/)?.[0] : null;
  if (!key) throw new Error("Chave pública não localizada na página oficial.");
  return key;
}

async function collectCell(key, alias, uf, month, fingerprint) {
  const response = await fetch(`${BASE_URL}/api_publica_${alias}/_search`, {
    method: "POST",
    headers: { Authorization: `APIKey ${key}`, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(buildQuery(month)),
    signal: AbortSignal.timeout(25_000),
  });
  if (!response.ok) return { alias, uf, month, state: "http_error", httpStatus: response.status, amount: null, relation: null, fingerprint };
  const body = await response.json();
  const total = body?.hits?.total;
  const amount = typeof total === "number" ? total : Number(total?.value ?? NaN);
  const relation = typeof total === "object" ? total?.relation ?? "unknown" : "eq";
  if (!Number.isFinite(amount)) return { alias, uf, month, state: "invalid_total", httpStatus: 200, amount: null, relation, fingerprint };
  return { alias, uf, month, state: relation === "eq" ? "ok" : "lower_bound", httpStatus: 200, amount, relation, fingerprint };
}

async function main() {
  const outputDir = new URL("../../juizados_pesquisa/output_nacional_jec/", import.meta.url);
  await mkdir(outputDir, { recursive: true });
  const startedAt = new Date().toISOString();
  let key = await publicKeyInMemory();
  const months = monthsBetween(PERIOD_START, PERIOD_END);
  const fingerprint = createHash("sha256").update(JSON.stringify(buildQuery(PERIOD_START))).digest("hex");
  const cells = aliases.flatMap(([alias, uf]) => months.map(month => ({ alias, uf, month })));
  const results = [];
  let cursor = 0;

  async function worker() {
    while (cursor < cells.length) {
      const current = cells[cursor++];
      results.push(await collectCell(key, current.alias, current.uf, current.month, fingerprint));
      await new Promise(resolve => setTimeout(resolve, 220));
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  key = undefined;
  const sorted = results.sort((a, b) => `${a.alias}-${a.month}`.localeCompare(`${b.alias}-${b.month}`));
  const csv = ["tribunal_alias,uf,month,metric,class_code,amount,total_relation,state,http_status,query_fingerprint", ...sorted.map(row => [row.alias, row.uf, row.month, "distribution", CLASS_CODE, row.amount ?? "", row.relation ?? "", row.state, row.httpStatus, row.fingerprint].map(csvEscape).join(","))].join("\n");
  const manifest = {
    title: "Censo mensal nacional JEC — distribuições agregadas",
    source: "CNJ/DataJud API Pública",
    collectedAt: new Date().toISOString(),
    period: { start: PERIOD_START, end: PERIOD_END, currentYearPartialThrough: "2026-08-26" },
    scope: { degree: "JE", classCode: CLASS_CODE, metric: "distribution" },
    expectedTribunals: aliases.length,
    queriedCells: sorted.length,
    exactCells: sorted.filter(row => row.state === "ok").length,
    lowerBoundCells: sorted.filter(row => row.state === "lower_bound").length,
    failedCells: sorted.filter(row => row.state !== "ok" && row.state !== "lower_bound").length,
    queryFingerprint: fingerprint,
    startedAt,
    privacy: "Somente agregados mensais; nenhuma parte, número processual, corpo de resposta ou chave pública foi gravado.",
    limitation: "Baixas exigem coleta de movimentos do coorte e não são produzidas por este executor.",
  };
  await Promise.all([
    writeFile(new URL("censo_nacional_jec_distribuicoes_2025_2026.csv", outputDir), csv, "utf8"),
    writeFile(new URL("manifesto_censo_nacional_jec_distribuicoes.json", outputDir), `${JSON.stringify(manifest, null, 2)}\n`, "utf8"),
  ]);
  console.log(`CENSO_NACIONAL: ${manifest.exactCells}/${manifest.queriedCells} células exatas; ${manifest.failedCells} falhas; saída em ${outputDir.pathname}`);
}

main().catch(error => {
  console.error(`CENSO_NACIONAL_ERRO: ${error instanceof Error ? error.message : "erro desconhecido"}`);
  process.exitCode = 1;
});
