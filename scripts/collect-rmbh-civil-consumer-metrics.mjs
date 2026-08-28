import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildCivilConsumerMetricsQuery, queryFingerprint, summarizeCivilConsumerResponse, validateCivilConsumerRows } from "./rmbh-civil-consumer-metrics-runtime.mjs";

const ACCESS_URL = "https://datajud-wiki.cnj.jus.br/api-publica/acesso/";
const BASE_URL = "https://api-publica.datajud.cnj.jus.br";
const ALIAS = "tjmg";
const BATCH_SIZE = 24;
const EXECUTE = process.argv.includes("--execute");
const AUTHORIZED = process.env.RMBH_CIVIL_CONSUMER_METRICS_AUTHORIZATION === "approved";
const MAX_RETRIES = 2;
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const outputDir = process.env.RMBH_CIVIL_CONSUMER_METRICS_OUTPUT_DIR ?? path.resolve(projectRoot, "data", "rmbh-civil-consumer-metrics");

async function publicKeyInMemory() {
  const response = await fetch(ACCESS_URL, { headers: { Accept: "text/html" }, signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`Acesso público DataJud indisponível (HTTP ${response.status}).`);
  const text = (await response.text()).replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ");
  const marker = text.indexOf("Authorization: APIKey");
  const key = marker < 0 ? null : text.slice(marker, marker + 280).match(/[A-Za-z0-9_-]{40,}={0,2}/)?.[0];
  if (!key) throw new Error("Chave pública DataJud indisponível.");
  return key;
}

async function requestAggregate(key, query) {
  let lastStatus = "unknown";
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    const response = await fetch(`${BASE_URL}/api_publica_${ALIAS}/_search`, {
      method: "POST",
      headers: { Authorization: `APIKey ${key}`, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(query),
      signal: AbortSignal.timeout(40_000),
    });
    if (response.ok) return response.json();
    lastStatus = String(response.status);
    if (attempt < MAX_RETRIES) await new Promise((resolve) => setTimeout(resolve, 1_000 * 2 ** attempt));
  }
  throw new Error(`Consulta agregada TJMG indisponível (HTTP ${lastStatus}).`);
}

const tree = JSON.parse(await readFile(path.join(projectRoot, "data", "tpu-civil-consumer-tree.json"), "utf8"));
const scope = JSON.parse(await readFile(path.join(projectRoot, "data", "rmbh-civil-consumer-scope.json"), "utf8"));
const civilCodes = tree.nodes.filter((node) => node.rootCode === 899).map((node) => String(node.code));
const consumerCodes = tree.nodes.filter((node) => node.rootCode === 1156).map((node) => String(node.code));
const batches = [];
for (let index = 0; index < scope.bodies.length; index += BATCH_SIZE) batches.push(scope.bodies.slice(index, index + BATCH_SIZE));

const queries = batches.map((batch) => buildCivilConsumerMetricsQuery({
  bodyCodes: batch.map((body) => body.judgingBodyCode),
  civilCodes,
  consumerCodes,
}));
const manifestBase = {
  title: "Piloto agregado Cível/Consumidor RMBH — métricas por categoria, órgão e mês",
  source: "CNJ/DataJud API Pública",
  collectedAt: new Date().toISOString(),
  alias: ALIAS,
  scope: { degree: "JE", classCode: 436, period: "2025-01 a 2026-08 (até 26/08)", municipalities: scope.municipalities, bodies: scope.bodies.length },
  subjectTreeVersion: tree.version,
  termsCount: civilCodes.length + consumerCodes.length,
  batchCount: batches.length,
  queryFingerprint: createHash("sha256").update(JSON.stringify(queries.map(queryFingerprint))).digest("hex"),
  privacy: "Consultas exclusivamente agregadas com size=0 e _source=false; não são processados hits, identificadores, partes, documentos ou respostas brutas.",
  limitation: "Órgãos e municípios derivam de facetas DataJud RMBH previamente confirmadas por rótulo institucional; o resultado não é censo nacional nem mede êxito, produtividade, estoque ou duração.",
};

await mkdir(outputDir, { recursive: true });
if (!(EXECUTE && AUTHORIZED)) {
  await writeFile(path.join(outputDir, "manifesto_rmbh_civil_consumer_metrics_dry_run.json"), `${JSON.stringify({ ...manifestBase, mode: "dry_run", authorization: "required_for_execution", batches: batches.map((batch) => batch.map((body) => body.judgingBodyCode)) }, null, 2)}\n`);
  console.log(`RMBH_CIVIL_CONSUMER_METRICS_DRY_RUN: ${scope.bodies.length} órgãos em ${batches.length} lotes; sem chamada DataJud.`);
  process.exit(0);
}

const key = await publicKeyInMemory();
const rawRows = [];
let totalMatchedDocuments = 0;
let totalRelation = "eq";
for (const query of queries) {
  const summary = summarizeCivilConsumerResponse(await requestAggregate(key, query));
  totalMatchedDocuments += summary.matchedDocuments;
  if (summary.totalRelation !== "eq") totalRelation = summary.totalRelation;
  rawRows.push(...summary.rows);
}
const bodyByCode = new Map(scope.bodies.map((body) => [body.judgingBodyCode, body]));
const rows = rawRows.map((row) => ({ ...bodyByCode.get(row.judgingBodyCode), ...row })).filter((row) => row.municipality);
validateCivilConsumerRows(rows, scope.bodies);
const manifest = { ...manifestBase, mode: "execute", authorization: "approved", state: "completed", summary: { batches: batches.length, matchedDocuments: totalMatchedDocuments, totalRelation, cells: rows.length, categories: 2, bodies: new Set(rows.map((row) => row.judgingBodyCode)).size, months: new Set(rows.map((row) => row.month)).size } };
await Promise.all([
  writeFile(path.join(outputDir, "rmbh_civil_consumer_metrics.json"), `${JSON.stringify(rows, null, 2)}\n`),
  writeFile(path.join(outputDir, "manifesto_rmbh_civil_consumer_metrics.json"), `${JSON.stringify(manifest, null, 2)}\n`),
]);
console.log(`RMBH_CIVIL_CONSUMER_METRICS: ${manifest.summary.cells} células agregadas; ${manifest.summary.matchedDocuments} documentos; estado=${manifest.state}.`);
