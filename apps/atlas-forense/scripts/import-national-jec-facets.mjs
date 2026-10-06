import { readFile } from "node:fs/promises";
import mysql from "mysql2/promise";

const RUN_KEY = "datajud-jec-nacional-2025-2026-v1";
const outputDir = process.env.NATIONAL_OUTPUT_DIR ?? "/home/ubuntu/juizados_pesquisa/output_nacional_jec";
const csvPath = `${outputDir}/facetas_nacionais_jec_2025_2026.csv`;
const manifestPath = `${outputDir}/manifesto_facetas_nacionais_jec.json`;

function parseLine(line) {
  const values = []; let value = ""; let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"' && quoted && line[index + 1] === '"') { value += '"'; index += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { values.push(value); value = ""; }
    else value += char;
  }
  values.push(value); return values;
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = parseLine(lines.shift());
  return lines.map(line => Object.fromEntries(parseLine(line).map((value, index) => [headers[index], value])));
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL indisponível para importação agregada.");
  const [csv, manifestText] = await Promise.all([readFile(csvPath, "utf8"), readFile(manifestPath, "utf8")]);
  const manifest = JSON.parse(manifestText);
  const records = parseCsv(csv);
  if (manifest.successfulAliases !== 27 || manifest.errors.length !== 0 || !records.length) throw new Error("Facetas sem cobertura integral não podem ser importadas.");
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  try {
    const [runs] = await connection.query("SELECT id FROM national_census_runs WHERE runKey = ? LIMIT 1", [RUN_KEY]);
    const runId = runs[0]?.id;
    if (!runId) throw new Error("Execução nacional planejada não encontrada.");
    for (let start = 0; start < records.length; start += 400) {
      const chunk = records.slice(start, start + 400).map(record => [runId, record.kind, record.code, record.label, Number(record.amount)]);
      await connection.query("INSERT INTO national_census_facets (runId, kind, code, label, amount) VALUES ? ON DUPLICATE KEY UPDATE label = VALUES(label), amount = VALUES(amount)", [chunk]);
    }
    const [counts] = await connection.query("SELECT kind, COUNT(*) AS count FROM national_census_facets WHERE runId = ? GROUP BY kind", [runId]);
    console.log(`IMPORTACAO_FACETAS: ${counts.map(row => `${row.kind}=${row.count}`).join(', ')}`);
  } finally {
    connection.destroy();
  }
}

main().catch(error => { console.error(`IMPORTACAO_FACETAS_ERRO: ${error instanceof Error ? error.message : "erro desconhecido"}`); process.exitCode = 1; });
