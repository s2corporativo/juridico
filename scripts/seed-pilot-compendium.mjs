import { readFile } from "node:fs/promises";
import mysql from "mysql2/promise";

const batchKey = "jurisprudencia-local-lote-1-20260826";
const sourceHash = "217e61c596707b38ac1e2b1815b22c2c3c92109f661cd260333001e0167e6f31";
const inputPath = process.env.COMPENDIUM_PILOT_CSV;

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '"') {
      if (quoted && text[index + 1] === '"') { value += '"'; index += 1; } else quoted = !quoted;
    } else if (char === "," && !quoted) { row.push(value); value = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[index + 1] === "\n") index += 1;
      row.push(value); rows.push(row); row = []; value = "";
    } else value += char;
  }
  if (value || row.length) { row.push(value); rows.push(row); }
  const header = rows.shift().map(item => item.replace(/^\uFEFF/, ""));
  return rows.filter(rowItem => rowItem.length === header.length).map(rowItem => Object.fromEntries(header.map((key, index) => [key, rowItem[index]])));
}

function toDate(value) {
  if (!value) return null;
  const [day, month, year] = value.split("/");
  return `${year}-${month}-${day} 12:00:00`;
}

async function main() {
  if (!process.env.DATABASE_URL || !inputPath) throw new Error("DATABASE_URL e COMPENDIUM_PILOT_CSV são obrigatórios para carga auditável.");
  const records = parseCsv(await readFile(inputPath, "utf8"));
  if (records.length !== 6 || records.some(record => record.status_validacao !== "VALIDADO_DOCUMENTO_INTEIRO_TEOR" || !record.fonte_url.startsWith("https://"))) {
    throw new Error("O lote piloto precisa conter exatamente seis registros validados com fonte HTTPS oficial.");
  }
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  try {
    await connection.query(
      "INSERT INTO ingestion_batches (batchKey, sourceLabel, sourceHash, status, itemsDiscovered, itemsImported, itemsExcluded, method, note) VALUES (?, ?, ?, 'imported', 6, 6, 0, ?, ?) ON DUPLICATE KEY UPDATE sourceHash=VALUES(sourceHash), status='imported', itemsDiscovered=6, itemsImported=6, itemsExcluded=0",
      [batchKey, "Jurisprudências Execute e Pesquise Profundamente", sourceHash, "CSV validado manualmente; PDFs não persistidos; URLs oficiais preservadas.", "Lote piloto local TJMG; não representativo nacionalmente."],
    );
    const [[batch]] = await connection.query("SELECT id FROM ingestion_batches WHERE batchKey = ?", [batchKey]);
    for (const record of records) {
      await connection.query(
        "INSERT INTO evidence_sources (label, sourceType, sourceUrl, publicStatus, note) VALUES (?, 'official_url', ?, 'official_confirmed', ?) ON DUPLICATE KEY UPDATE sourceUrl=VALUES(sourceUrl), publicStatus='official_confirmed', note=VALUES(note)",
        [`${record.tribunal} · ${record.numero_cnj}`, record.fonte_url, "URL oficial vinculada ao acórdão validado no lote piloto."],
      );
      const [[source]] = await connection.query("SELECT id FROM evidence_sources WHERE sourceUrl = ?", [record.fonte_url]);
      await connection.query(
        "INSERT INTO jurisprudence_records (externalId,batchId,sourceId,cnjNumber,tribunal,justice,city,comarca,court,judgingBody,decisionType,decisionDate,publicationDate,legalArea,theme,outcomeOrigin,outcomeAppeal,dispositionType,moralDamageValue,reasoningSummary,validationNote,sourceStatus,recordVersion) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, 'official_confirmed', 1) ON DUPLICATE KEY UPDATE sourceId=VALUES(sourceId), legalArea=VALUES(legalArea), theme=VALUES(theme), reasoningSummary=VALUES(reasoningSummary), validationNote=VALUES(validationNote)",
        [record.process_id, batch.id, source.id, record.numero_cnj || null, record.tribunal, record.justica, record.cidade || null, record.comarca || null, record.vara || null, record.orgao_julgador || null, record.tipo_decisao, toDate(record.data_decisao), toDate(record.data_publicacao), record.area || null, record.tema || null, record.resultado_origem || null, record.resultado_recurso || null, record.merito_ou_processo || null, record.valor_dano_moral || null, record.fundamento_resumo || null, record.observacao || null],
      );
    }
    console.log("CARGA_PILOTO: 6 julgados públicos e 6 fontes oficiais importados.");
  } finally { connection.destroy(); }
}

main().catch(error => { console.error(`CARGA_PILOTO_ERRO: ${error instanceof Error ? error.message : "erro desconhecido"}`); process.exitCode = 1; });
