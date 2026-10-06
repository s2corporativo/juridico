import { readFile } from "node:fs/promises";
import mysql from "mysql2/promise";
import { validateCivilConsumerRows } from "./rmbh-civil-consumer-metrics-runtime.mjs";

const RUN_KEY = "datajud-tjmg-rmbh-civil-consumer-2025-2026-v1";
const outputDir = process.env.RMBH_CIVIL_CONSUMER_METRICS_OUTPUT_DIR ?? "/var/lib/atlas-ejc/civil-consumer-metrics/20260828";
const manifestPath = `${outputDir}/manifesto_rmbh_civil_consumer_metrics.json`;
const metricsPath = `${outputDir}/rmbh_civil_consumer_metrics.json`;
const FORBIDDEN = /process|cpf|parte|address|document|_source|hits|authorization|apikey|hmac/i;

function assertSafe(value) {
  if (value && typeof value === "object") for (const [key, child] of Object.entries(value)) {
    if (FORBIDDEN.test(key)) throw new Error(`Campo proibido no artefato: ${key}`);
    assertSafe(child);
  }
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL indisponível para importação temática.");
  const [manifest, rows] = await Promise.all([
    readFile(manifestPath, "utf8").then(JSON.parse),
    readFile(metricsPath, "utf8").then(JSON.parse),
  ]);
  assertSafe(rows);
  if (manifest.mode !== "execute" || manifest.state !== "completed" || manifest.alias !== "tjmg") throw new Error("Manifesto temático não está pronto para importação.");
  const scope = JSON.parse(await readFile(new URL("../data/rmbh-civil-consumer-scope.json", import.meta.url), "utf8"));
  const validation = validateCivilConsumerRows(rows, scope.bodies);
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  try {
    await connection.beginTransaction();
    const coverageNote = `Piloto agregado Cível/Consumidor TJMG: ${validation.rows} células em ${validation.bodies} órgãos e ${validation.months} meses; árvore TPU ${manifest.subjectTreeVersion}. Não é censo nacional, taxa, estoque, produtividade, duração ou êxito.`;
    await connection.query(
      "INSERT INTO rmbh_civil_consumer_runs (runKey, sourceKey, tribunalAlias, status, scope, periodStart, periodEnd, subjectTreeVersion, termsCount, queryFingerprint, coverageNote) VALUES (?, ?, 'tjmg', 'completed', 'rmbh_civil_consumer', '2025-01-01', '2026-08-26', ?, ?, ?, ?) ON DUPLICATE KEY UPDATE status = VALUES(status), subjectTreeVersion = VALUES(subjectTreeVersion), termsCount = VALUES(termsCount), queryFingerprint = VALUES(queryFingerprint), coverageNote = VALUES(coverageNote), updatedAt = CURRENT_TIMESTAMP, id = LAST_INSERT_ID(id)",
      [RUN_KEY, manifest.sourceKey, manifest.subjectTreeVersion, manifest.termsCount, manifest.queryFingerprint, coverageNote],
    );
    const [runRows] = await connection.query("SELECT id FROM rmbh_civil_consumer_runs WHERE runKey = ? LIMIT 1", [RUN_KEY]);
    const runId = runRows[0]?.id;
    if (!runId) throw new Error("A execução temática não foi criada.");
    const values = rows.map((row) => [runId, "tjmg", row.municipality, String(row.municipalityIbgeCode), String(row.judgingBodyCode), row.judgingBodyLabel, row.month, row.categoryCode, row.categoryLabel, Number(row.amount)]);
    if (values.length) await connection.query(
      "INSERT INTO rmbh_civil_consumer_metrics (runId, tribunalAlias, municipalityName, municipalityIbgeCode, judgingBodyCode, judgingBodyLabel, month, categoryCode, categoryLabel, amount) VALUES ? ON DUPLICATE KEY UPDATE judgingBodyLabel = VALUES(judgingBodyLabel), categoryLabel = VALUES(categoryLabel), amount = VALUES(amount)",
      [values],
    );
    await connection.commit();
    console.log(`IMPORTACAO_RMBH_CIVIL_CONSUMER: ${validation.rows} células; ${validation.bodies} órgãos; ${validation.months} meses; run=${RUN_KEY}.`);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.destroy();
  }
}

main().catch((error) => {
  console.error(`IMPORTACAO_RMBH_CIVIL_CONSUMER_ERRO: ${error instanceof Error ? error.message : "erro desconhecido"}`);
  process.exitCode = 1;
});
