export function createAliasTelemetry(alias, uf) {
  return { alias, uf, state: "running", pages: 0, processedRecords: 0, eligibleMovements: 0, deduplicatedProcessMonths: 0, error: null };
}

export function recordLowerPage(telemetry, { processedRecords, eligibleMovements, deduplicatedProcessMonths }) {
  telemetry.pages += 1;
  telemetry.processedRecords += processedRecords;
  telemetry.eligibleMovements += eligibleMovements;
  telemetry.deduplicatedProcessMonths += deduplicatedProcessMonths;
}

export function finishAlias(telemetry) { telemetry.state = "completed"; return telemetry; }

export function failAlias(telemetry, error) { telemetry.state = "failed"; telemetry.error = error; return telemetry; }

export function summarizeLowerRun({ aliases, telemetry, metricRows, queryFingerprint, startedAt, completedAt }) {
  const completed = telemetry.filter(row => row.state === "completed");
  const failed = telemetry.filter(row => row.state === "failed");
  return {
    expectedTribunals: aliases,
    respondedTribunals: completed.length,
    failedTribunals: failed.length,
    coveragePct: aliases === 0 ? 0 : Math.round((completed.length / aliases) * 10000) / 100,
    state: failed.length === 0 && completed.length === aliases ? "completed" : "partial",
    pagesProcessed: completed.reduce((sum, row) => sum + row.pages, 0),
    processedRecords: completed.reduce((sum, row) => sum + row.processedRecords, 0),
    eligibleMovements: completed.reduce((sum, row) => sum + row.eligibleMovements, 0),
    deduplicatedProcessMonths: completed.reduce((sum, row) => sum + row.deduplicatedProcessMonths, 0),
    metricRows,
    queryFingerprint,
    startedAt,
    completedAt,
    aliases: telemetry.map(({ error, ...safe }) => error ? { ...safe, error } : safe),
  };
}
