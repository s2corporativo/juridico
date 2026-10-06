import { readFile, realpath } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import mysql from "mysql2/promise";

export const LOWER_PILOT_RUN_KEY = "datajud-jec-tjmg-betim-igarape-baixas-pilot-v1";
export const ALLOWED_TJMG_BODIES = new Set(["40011", "8161"]);

export function hasForbiddenIndividualField(value) {
  if (Array.isArray(value)) return value.some(hasForbiddenIndividualField);
  if (!value || typeof value !== "object") return false;
  return Object.entries(value).some(([key, nestedValue]) => {
    const normalizedKey = key.replace(/[^a-z0-9]/gi, "").toLowerCase();
    return ["numeroprocesso", "cpf", "email", "telefone", "hmac", "scrollid", "respostabruta", "rawresponse"].includes(normalizedKey)
      || hasForbiddenIndividualField(nestedValue);
  });
}

export function parseTerritorialLowerPilot({ manifestText, metricsText }) {
  const manifest = JSON.parse(manifestText);
  const metrics = JSON.parse(metricsText);

  if (manifest.mode !== "pilot" || manifest.state !== "completed" || manifest.expectedTribunals !== 1 || manifest.respondedTribunals !== 1) {
    throw new Error("O manifesto não descreve um piloto territorial TJMG concluído e isolado.");
  }
  if (!Array.isArray(manifest.scope?.judgingBodyCodes) || manifest.scope.judgingBodyCodes.length !== 2 || !manifest.scope.judgingBodyCodes.every(code => ALLOWED_TJMG_BODIES.has(code))) {
    throw new Error("O manifesto contém órgão julgador fora do recorte territorial aprovado.");
  }
  if (!Array.isArray(metrics) || metrics.length === 0 || metrics.some(row => row.alias !== "tjmg" || row.uf !== "MG" || !/^20\d{2}-(0[1-9]|1[0-2])$/.test(row.month) || !Number.isSafeInteger(row.amount) || row.amount < 0)) {
    throw new Error("As métricas não são agregados TJMG válidos por órgão e mês.");
  }
  if (metrics.some(row => !ALLOWED_TJMG_BODIES.has(String(row.judgingBodyCode)))) {
    throw new Error("A métrica contém órgão julgador fora do recorte territorial aprovado.");
  }
  if (hasForbiddenIndividualField(manifest) || hasForbiddenIndividualField(metrics)) {
    throw new Error("O artefato de piloto contém marcador de dado individual não permitida para importação.");
  }

  return { manifest, metrics };
}

async function main() {
  if (process.env.NATIONAL_LOWER_IMPORT_AUTHORIZATION !== "approved") {
    throw new Error("Importação bloqueada. Defina NATIONAL_LOWER_IMPORT_AUTHORIZATION=approved para executar.");
  }
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL indisponível para importação agregada.");
  const outputDir = process.env.NATIONAL_LOWER_OUTPUT_DIR;
  if (!outputDir) throw new Error("NATIONAL_LOWER_OUTPUT_DIR é obrigatório para importar um lote territorial explícito.");

  const [manifestText, metricsText] = await Promise.all([
    readFile(`${outputDir}/manifesto_baixas_nacionais_piloto.json`, "utf8"),
    readFile(`${outputDir}/baixas_nacionais_jec_agregadas_piloto.json`, "utf8"),
  ]);
  const { manifest, metrics } = parseTerritorialLowerPilot({ manifestText, metricsText });
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    await connection.beginTransaction();
    await connection.query(
      "INSERT INTO national_census_runs (runKey, sourceKey, status, scope, periodStart, periodEnd, expectedTribunals, respondedTribunals, methodologyVersion, queryFingerprint, coverageNote) VALUES (?, 'datajud', 'partial', 'tjmg_territorial_lower_pilot', '2025-01', '2026-08', 1, 1, 'lower-pilot-v2', ?, ?) ON DUPLICATE KEY UPDATE status = VALUES(status), respondedTribunals = VALUES(respondedTribunals), queryFingerprint = VALUES(queryFingerprint), coverageNote = VALUES(coverageNote)",
      [LOWER_PILOT_RUN_KEY, manifest.queryFingerprint ?? null, "Piloto territorial de baixas definitivas observadas no TJMG, limitado aos órgãos 40011 (Betim) e 8161 (Igarapé), com teto de 3 páginas. Série parcial, não comparável a censo, estoque, taxa de baixa, produtividade ou êxito."],
    );
    const [[run]] = await connection.query("SELECT id FROM national_census_runs WHERE runKey = ? LIMIT 1", [LOWER_PILOT_RUN_KEY]);
    if (!run?.id) throw new Error("Não foi possível localizar a execução territorial após a criação.");

    const observedAt = new Date(manifest.finishedAt ?? manifest.createdAt ?? Date.now());
    const rows = metrics.map(row => [run.id, row.alias, "TJMG", row.uf, row.month, "baixa", "436", "", String(row.judgingBodyCode), row.amount, observedAt]);
    await connection.query(
      "INSERT INTO national_census_metrics (runId, tribunalAlias, tribunal, uf, month, metric, classCode, subjectCode, judgingBodyCode, amount, sourceObservedAt) VALUES ? ON DUPLICATE KEY UPDATE amount = VALUES(amount), sourceObservedAt = VALUES(sourceObservedAt)",
      [rows],
    );
    await connection.query(
      "INSERT INTO audit_events (entityType, entityKey, action, sourceStatus, actorLabel, note) SELECT 'national_census_run', ?, 'imported_aggregated_lower_pilot', 'movement_observed', 'atlas-collector', ? WHERE NOT EXISTS (SELECT 1 FROM audit_events WHERE entityType = 'national_census_run' AND entityKey = ? AND action = 'imported_aggregated_lower_pilot')",
      [LOWER_PILOT_RUN_KEY, "Importação idempotente de células agregadas por mês e órgão do piloto territorial TJMG; sem processos ou respostas brutas.", LOWER_PILOT_RUN_KEY],
    );
    await connection.commit();
    console.log(`IMPORTACAO_BAIXAS_TERRITORIAL: ${rows.length} células agregadas importadas no run ${LOWER_PILOT_RUN_KEY}.`);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.destroy();
  }
}

const invokedScript = process.argv[1] ? await realpath(process.argv[1]).catch(() => null) : null;

if (invokedScript && import.meta.url === pathToFileURL(invokedScript).href) {
  main().catch(error => {
    console.error(`IMPORTACAO_BAIXAS_TERRITORIAL_ERRO: ${error instanceof Error ? error.message : "erro desconhecido"}`);
    process.exitCode = 1;
  });
}
