import { readFile } from "node:fs/promises";
import mysql from "mysql2/promise";

const RUN_KEY = "datajud-jec-nacional-2025-2026-v1";
const outputDir = process.env.NATIONAL_OUTPUT_DIR ?? "/home/ubuntu/juizados_pesquisa/output_nacional_jec";
const inputPath = `${outputDir}/censo_nacional_jec_distribuicoes_2025_2026.csv`;
const manifestPath = `${outputDir}/manifesto_censo_nacional_jec_distribuicoes.json`;

function parseCsv(text) {
  const [header, ...lines] = text.trim().split(/\r?\n/);
  const columns = header.split(",");
  return lines.map(line => Object.fromEntries(line.split(",").map((value, index) => [columns[index], value])));
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL indisponível para importação agregada.");
  const [csv, manifestText] = await Promise.all([readFile(inputPath, "utf8"), readFile(manifestPath, "utf8")]);
  const manifest = JSON.parse(manifestText);
  const records = parseCsv(csv);
  if (!records.length || records.some(record => record.state !== "ok" || record.total_relation !== "eq")) {
    throw new Error("A importação exige células exatas e sem falha.");
  }

  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  try {
    const observedAt = new Date(manifest.collectedAt);
    const rows = records.map(record => [
      1,
      record.tribunal_alias,
      record.tribunal_alias.toUpperCase(),
      record.uf,
      record.month,
      record.metric,
      record.class_code,
      "",
      "",
      Number(record.amount),
      observedAt,
    ]);
    await connection.query(
      "INSERT INTO national_census_metrics (runId, tribunalAlias, tribunal, uf, month, metric, classCode, subjectCode, judgingBodyCode, amount, sourceObservedAt) VALUES ? ON DUPLICATE KEY UPDATE amount = VALUES(amount), sourceObservedAt = VALUES(sourceObservedAt)",
      [rows],
    );
    const note = "Distribuições JEC classe 436, grau JE, 2025-01 a 2026-08: 540 de 540 células mensais agregadas com total exato (relation=eq). Baixas não foram coletadas e permanecem fora deste lote.";
    await connection.query(
      "UPDATE national_census_runs SET status = 'partial', respondedTribunals = 27, queryFingerprint = ?, coverageNote = ? WHERE runKey = ?",
      [manifest.queryFingerprint, note, RUN_KEY],
    );
    const [countRows] = await connection.query("SELECT COUNT(*) AS count FROM national_census_metrics WHERE runId = 1 AND metric = 'distribution'");
    console.log(`IMPORTACAO_NACIONAL: ${countRows[0].count} métricas agregadas de distribuição persistidas; baixas permanecem pendentes.`);
  } finally {
    connection.destroy();
  }
}

main().catch(error => {
  console.error(`IMPORTACAO_NACIONAL_ERRO: ${error instanceof Error ? error.message : "erro desconhecido"}`);
  process.exitCode = 1;
});
