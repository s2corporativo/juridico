import { readFile } from "node:fs/promises";
import mysql from "mysql2/promise";
import { validateRmbhCoverageImport } from "./rmbh-coverage-import-runtime.mjs";

const RUN_KEY = "datajud-tjmg-rmbh-jec-facets-2025-2026-v1";
const outputDir = process.env.RMBH_TJMG_OUTPUT_DIR ?? "/var/lib/atlas-ejc/rmbh-facets/20260828";
const manifestPath = `${outputDir}/manifesto_rmbh_tjmg_facetas.json`;
const facetsPath = `${outputDir}/rmbh_tjmg_jec_orgaos_agregados.json`;

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL indisponível para importação RMBH agregada.");
  const [manifestText, facetsText] = await Promise.all([readFile(manifestPath, "utf8"), readFile(facetsPath, "utf8")]);
  const manifest = JSON.parse(manifestText);
  const facets = JSON.parse(facetsText);
  const summary = validateRmbhCoverageImport(manifest, facets);
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    await connection.beginTransaction();
    const coverageNote = `Órgãos JEC TJMG vinculados por rótulo exato a municípios da RMBH: ${summary.mappedMunicipalities} de ${summary.expectedMunicipalities} municípios, ${summary.totalBodies} órgãos. Facetas agregadas em size=0; não representa todos os órgãos, estoque, taxa ou processos individuais.`;
    await connection.query(
      "INSERT INTO metropolitan_coverage_runs (runKey, sourceKey, tribunalAlias, status, scope, periodStart, periodEnd, expectedMunicipalities, mappedMunicipalities, methodologyVersion, queryFingerprint, coverageNote) VALUES (?, 'datajud_public_api', 'tjmg', 'completed', 'rmbh_jec_judging_bodies', '2025-01', '2026-08', ?, ?, 'rmbh-facets-v1', ?, ?) ON DUPLICATE KEY UPDATE status = VALUES(status), mappedMunicipalities = VALUES(mappedMunicipalities), queryFingerprint = VALUES(queryFingerprint), coverageNote = VALUES(coverageNote), updatedAt = CURRENT_TIMESTAMP, id = LAST_INSERT_ID(id)",
      [RUN_KEY, summary.expectedMunicipalities, summary.mappedMunicipalities, manifest.queryFingerprint ?? null, coverageNote],
    );
    const [runRows] = await connection.query("SELECT id FROM metropolitan_coverage_runs WHERE runKey = ? LIMIT 1", [RUN_KEY]);
    const runId = runRows[0]?.id;
    if (!runId) throw new Error("A execução RMBH não foi criada.");

    const rows = facets.map(facet => [
      runId,
      "tjmg",
      facet.municipality,
      String(facet.municipalityIbgeCode),
      String(facet.judgingBodyCode),
      facet.judgingBodyLabel,
      Number(facet.amount),
    ]);
    await connection.query(
      "INSERT INTO metropolitan_judging_body_facets (runId, tribunalAlias, municipalityName, municipalityIbgeCode, judgingBodyCode, judgingBodyLabel, amount) VALUES ? ON DUPLICATE KEY UPDATE municipalityName = VALUES(municipalityName), judgingBodyLabel = VALUES(judgingBodyLabel), amount = VALUES(amount)",
      [rows],
    );
    await connection.commit();
    console.log(`IMPORTACAO_RMBH: ${summary.totalBodies} órgãos agregados em ${summary.mappedMunicipalities} municípios TJMG; run=${RUN_KEY}.`);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.destroy();
  }
}

const executedPath = process.argv[1] ? await import("node:fs/promises").then(({ realpath }) => realpath(process.argv[1])) : "";
if (executedPath && new URL(`file://${executedPath}`).href === import.meta.url) {
  main().catch(error => {
    console.error(`IMPORTACAO_RMBH_ERRO: ${error instanceof Error ? error.message : "erro desconhecido"}`);
    process.exitCode = 1;
  });
}
