import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";
import { buildCausalPilotQuery, DATAJUD_ACCESS_URL, DATAJUD_BASE_URL, DEFAULT_MAX_PAGES_PER_BATCH, DEFAULT_PAGE_SIZE, deriveAnnotations, extractSearchPage, JEC_CLASS_CODE, JEC_DEGREE, queryFingerprint, toPersistableCausalRecord } from "./causal-rmbh-pilot-runtime.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const scope = JSON.parse(await readFile(path.join(root, "data/rmbh-civil-consumer-scope.json"), "utf8"));
const subjectFilter = JSON.parse(await readFile(path.join(root, "data/rmbh-civil-consumer-descendant-filter.json"), "utf8"));
const execute = process.argv.includes("--execute");
const authorized = process.env.ATLAS_CAUSAL_PILOT_AUTHORIZATION === "approved";
const persist = process.argv.includes("--persist");
const alias = "tjmg";
const from = process.env.ATLAS_CAUSAL_PILOT_FROM ?? "2025-01-01";
const to = process.env.ATLAS_CAUSAL_PILOT_TO ?? "2026-08-27";
const pageSize = Number(process.env.ATLAS_CAUSAL_PILOT_PAGE_SIZE ?? DEFAULT_PAGE_SIZE);
const maxPages = Number(process.env.ATLAS_CAUSAL_PILOT_MAX_PAGES ?? DEFAULT_MAX_PAGES_PER_BATCH);
const batchSize = 24;
const outputDir = process.env.ATLAS_CAUSAL_PILOT_OUTPUT_DIR ?? path.join(root, "data", "rmbh-causal-pilot");
const runKey = `datajud-${alias}-rmbh-jec-causal-${from}-${to}-v1`;
if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > DEFAULT_PAGE_SIZE) throw new Error("ATLAS_CAUSAL_PILOT_PAGE_SIZE deve estar entre 1 e 100.");
if (!Number.isInteger(maxPages) || maxPages < 1 || maxPages > 12) throw new Error("ATLAS_CAUSAL_PILOT_MAX_PAGES deve estar entre 1 e 12.");
if (persist && !process.env.ATLAS_CAUSAL_DATABASE_URL) throw new Error("ATLAS_CAUSAL_DATABASE_URL é obrigatória para persistência.");
if (execute && !process.env.ATLAS_CAUSAL_CASE_KEY_SECRET) throw new Error("ATLAS_CAUSAL_CASE_KEY_SECRET é obrigatória para execução.");

const bodyBatches = [];
for (let i = 0; i < scope.bodies.length; i += batchSize) bodyBatches.push(scope.bodies.slice(i, i + batchSize));
const queryTemplates = bodyBatches.map(batch => buildCausalPilotQuery({ bodyCodes: batch.map(body => body.judgingBodyCode), subjectCodes: subjectFilter.subjectCodes, from, to, pageSize }));
const manifestBase = {
  runKey, sourceKey: "datajud_public_api", alias, scope: "rmbh_jec_causal_pilot", classCode: JEC_CLASS_CODE, degree: JEC_DEGREE,
  period: { from, to }, municipalities: scope.municipalities, bodies: scope.bodies.length, subjectCodes: subjectFilter.subjectCodes.length,
  pageSize, maxPagesPerBatch: maxPages, batchCount: bodyBatches.length, queryFingerprint: createHash("sha256").update(JSON.stringify(queryTemplates.map(queryFingerprint))).digest("hex"),
  privacy: "Não persiste nomes de partes, CPF/CNPJ, número CNJ bruto, resposta bruta, documentos integrais ou campos fora da lista sanitizada.",
  limitation: "DataJud fornece metadados de capa e movimentações; assunto não prova causa concreta e movimento não prova resultado de mérito.",
  sources: ["https://datajud-wiki.cnj.jus.br/api-publica/", DATAJUD_BASE_URL],
};
await mkdir(outputDir, { recursive: true });
if (!(execute && authorized)) {
  await writeFile(path.join(outputDir, "manifesto_rmbh_causal_pilot_dry_run.json"), `${JSON.stringify({ ...manifestBase, mode: "dry_run", authorization: "ATLAS_CAUSAL_PILOT_AUTHORIZATION=approved required", persist: false, batches: bodyBatches.map(batch => batch.map(body => body.judgingBodyCode)) }, null, 2)}\n`);
  console.log(`ATLAS_CAUSAL_PILOT_DRY_RUN: ${scope.bodies.length} órgãos, ${bodyBatches.length} lotes, ${subjectFilter.subjectCodes.length} assuntos; sem chamada DataJud e sem gravação.`);
  process.exit(0);
}

function extractKey(text) { const plain = text.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " "); const marker = plain.indexOf("Authorization: APIKey"); return marker < 0 ? null : plain.slice(marker, marker + 280).match(/[A-Za-z0-9_-]{40,}={0,2}/)?.[0] ?? null; }
async function getKey() {
  const configured = process.env.DATAJUD_API_KEY?.trim();
  if (configured) return configured;
  const response = await fetch(DATAJUD_ACCESS_URL, { headers: { Accept: "text/html" }, signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`Acesso público DataJud indisponível (HTTP ${response.status}).`);
  const key = extractKey(await response.text());
  if (!key) throw new Error("Chave pública DataJud não encontrada na página oficial.");
  return key;
}
async function requestPage(key, query) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch(`${DATAJUD_BASE_URL}/api_publica_${alias}/_search`, { method: "POST", headers: { Authorization: `APIKey ${key}`, "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(query), signal: AbortSignal.timeout(45_000) });
    if (response.ok) return response.json();
    if (response.status !== 429 && response.status < 500) throw new Error(`DataJud recusou a consulta (HTTP ${response.status}).`);
    if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 1_000 * 2 ** attempt));
  }
  throw new Error("DataJud indisponível após três tentativas.");
}

const key = await getKey();
const records = [];
const counts = { pages: 0, apiHits: 0, rejected: 0, totalReported: 0, totalRelation: "eq" };
for (const batch of bodyBatches) {
  let searchAfter = undefined;
  for (let page = 0; page < maxPages; page += 1) {
    const payload = await requestPage(key, buildCausalPilotQuery({ bodyCodes: batch.map(body => body.judgingBodyCode), subjectCodes: subjectFilter.subjectCodes, from, to, pageSize, searchAfter }));
    const extracted = extractSearchPage(payload);
    counts.pages += 1; counts.apiHits += extracted.records.length; counts.totalReported += extracted.total;
    if (extracted.totalRelation !== "eq") counts.totalRelation = extracted.totalRelation;
    for (const record of extracted.records) {
      if (!batch.some(body => String(body.judgingBodyCode) === String(record.bodyCode))) { counts.rejected += 1; continue; }
      records.push(record);
    }
    if (!extracted.nextSearchAfter || extracted.records.length < pageSize) break;
    searchAfter = extracted.nextSearchAfter;
  }
}
const unique = [...new Map(records.map(record => [record.processNumber, record])).values()];
const bodyByCode = new Map(scope.bodies.map(body => [String(body.judgingBodyCode), body]));
const normalized = unique.map(record => toPersistableCausalRecord({ ...record, municipality: bodyByCode.get(String(record.bodyCode))?.municipality ?? null, municipalityIbgeCode: bodyByCode.get(String(record.bodyCode))?.municipalityIbgeCode ?? record.municipalityIbgeCode }, alias, process.env.ATLAS_CAUSAL_CASE_KEY_SECRET));
const manifest = { ...manifestBase, mode: "execute", state: "collected", counts: { ...counts, uniqueRecords: normalized.length }, collectedAt: new Date().toISOString(), persistence: persist ? "requested" : "not_requested" };
await writeFile(path.join(outputDir, "manifesto_rmbh_causal_pilot.json"), `${JSON.stringify(manifest, null, 2)}\n`);
await writeFile(path.join(outputDir, "rmbh_causal_pilot_sanitized.json"), `${JSON.stringify(normalized, null, 2)}\n`);

async function persistRecords() {
  const connection = await mysql.createConnection(process.env.ATLAS_CAUSAL_DATABASE_URL);
  try {
    await connection.beginTransaction();
    await connection.query("INSERT INTO causal_runs (runKey, sourceKey, tribunalAlias, scope, periodStart, periodEnd, methodologyVersion, status, coverageNote) VALUES (?, ?, ?, ?, ?, ?, ?, 'running', ?) ON DUPLICATE KEY UPDATE status='running', coverageNote=VALUES(coverageNote), id=LAST_INSERT_ID(id)", [runKey, manifestBase.sourceKey, alias, manifestBase.scope, from, to, "causal-pilot-v1", "Coleta limitada por órgãos da RMBH, assuntos descendentes Cível/Consumidor, páginas limitadas e revisão pendente; não é censo nem mede êxito."]);
    const [runRows] = await connection.query("SELECT id FROM causal_runs WHERE runKey=? LIMIT 1", [runKey]);
    const runId = runRows[0]?.id;
    if (!runId) throw new Error("Execução causal não foi criada.");
    for (const record of normalized) {
      const recordHash = record.sourceHashSha256;
      const caseKey = record.caseKey;
      await connection.query("INSERT INTO causal_cases (runId, caseKey, publicProcessKey, tribunal, justice, municipality, classCode, classLabel, filingDate, sourceHashSha256, privacyNote) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id), sourceHashSha256=VALUES(sourceHashSha256), updatedAt=CURRENT_TIMESTAMP", [runId, caseKey, caseKey, record.tribunal, "Estadual", record.municipality, String(record.classCode), record.classLabel, record.filingDate ? new Date(record.filingDate) : null, recordHash, "Chave HMAC; sem número CNJ bruto, partes ou documento integral."]);
      const [caseRows] = await connection.query("SELECT id FROM causal_cases WHERE caseKey=? LIMIT 1", [caseKey]);
      const caseId = caseRows[0]?.id;
      if (!caseId) continue;
      await connection.query("INSERT INTO causal_documents (caseId, documentType, sourceUrl, sourceLabel, contentHashSha256, available) VALUES (?, 'movimento', ?, ?, ?, 1) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)", [caseId, `${DATAJUD_BASE_URL}/api_publica_${alias}/_search`, "Metadados e movimentos DataJud", recordHash]);
      const [docRows] = await connection.query("SELECT id FROM causal_documents WHERE caseId=? AND contentHashSha256=? LIMIT 1", [caseId, recordHash]);
      const documentId = docRows[0]?.id;
      const excerpt = record.movements.map(movement => `${movement.date ?? "data não informada"}: ${movement.name ?? "movimento sem nome"}`).join("; ").slice(0, 4_000) || "Nenhum movimento retornado no recorte.";
      const [evidenceResult] = await connection.query("INSERT INTO causal_evidence_refs (caseId, documentId, sourceUrl, sourceLabel, sourceHashSha256, excerpt, evidenceType) VALUES (?, ?, ?, ?, ?, ?, 'official_api')", [caseId, documentId, `${DATAJUD_BASE_URL}/api_publica_${alias}/_search`, "Resposta sanitizada da API Pública DataJud", recordHash, excerpt]);
      const evidenceId = evidenceResult.insertId;
      for (const annotation of deriveAnnotations(record, evidenceId)) await connection.query("INSERT INTO causal_annotations (caseId, evidenceRefId, role, claimType, label, normalizedLabel, sourceKind, confidence) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [caseId, evidenceId, annotation.role, annotation.claimType, annotation.label, annotation.normalizedLabel, annotation.sourceKind, annotation.confidence.toFixed(4)]);
    }
    await connection.query("UPDATE causal_runs SET status='completed', updatedAt=CURRENT_TIMESTAMP WHERE id=?", [runId]);
    await connection.commit();
  } catch (error) { await connection.rollback(); throw error; } finally { await connection.end(); }
}
if (persist) { await persistRecords(); manifest.state = "persisted"; manifest.persistence = "completed"; await writeFile(path.join(outputDir, "manifesto_rmbh_causal_pilot.json"), `${JSON.stringify(manifest, null, 2)}\n`); }
console.log(`ATLAS_CAUSAL_PILOT: ${normalized.length} casos sanitizados; páginas=${counts.pages}; hits=${counts.apiHits}; persistência=${manifest.persistence}.`);
