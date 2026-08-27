export function createAliasTelemetry(alias, uf) {
  return {
    alias,
    uf,
    state: "running",
    pages: 0,
    processedRecords: 0,
    eligibleMovements: 0,
    deduplicatedProcessMonths: 0,
    retries: 0,
    retryDelayMs: 0,
    retryStages: [],
    error: null,
  };
}

export function recordLowerPage(telemetry, { processedRecords, eligibleMovements, deduplicatedProcessMonths }) {
  telemetry.pages += 1;
  telemetry.processedRecords += processedRecords;
  telemetry.eligibleMovements += eligibleMovements;
  telemetry.deduplicatedProcessMonths += deduplicatedProcessMonths;
}

export function retryDelayMs(baseDelayMs, retryAttempt) {
  return Math.min(30_000, baseDelayMs * 2 ** Math.max(0, retryAttempt - 1));
}

export function isRetryableDataJudError(error) {
  const message = error instanceof Error ? error.message : String(error ?? "");
  const status = Number(message.match(/HTTP\s+(\d{3})/)?.[1] ?? 0);
  return [408, 425, 429, 500, 502, 503, 504].includes(status)
    || /fetch failed|network|socket|connect|timeout|timed out|econn/i.test(message);
}

export function sanitizeDataJudError(error) {
  const message = error instanceof Error ? error.message : String(error ?? "");
  const status = message.match(/HTTP\s+(\d{3})/)?.[1];
  if (status) return `HTTP ${status}`;
  if (/timeout|timed out/i.test(message)) return "tempo de conexão excedido";
  if (/fetch failed|network|socket|connect|econn/i.test(message)) return "falha de conexão";
  return "falha de resposta DataJud";
}

export function recordRetry(telemetry, stage, delayMs) {
  telemetry.retries += 1;
  telemetry.retryDelayMs += delayMs;
  if (!telemetry.retryStages.includes(stage)) telemetry.retryStages.push(stage);
}

export async function retryDataJudRequest({ run, maxRetries, retryBaseDelayMs, onRetry, sleep = delay => new Promise(resolve => setTimeout(resolve, delay)) }) {
  for (let retryAttempt = 0; ; retryAttempt += 1) {
    try {
      return await run();
    } catch (error) {
      if (!isRetryableDataJudError(error) || retryAttempt >= maxRetries) throw error;
      const delayMs = retryDelayMs(retryBaseDelayMs, retryAttempt + 1);
      onRetry?.(delayMs);
      await sleep(delayMs);
    }
  }
}

export function finishAlias(telemetry) { telemetry.state = "completed"; return telemetry; }

export function limitAlias(telemetry) { telemetry.state = "limited"; return telemetry; }

export function failAlias(telemetry, error) { telemetry.state = "failed"; telemetry.error = sanitizeDataJudError(error); return telemetry; }

export function summarizeLowerRun({ aliases, telemetry, metricRows, queryFingerprint, startedAt, completedAt }) {
  const completed = telemetry.filter(row => row.state === "completed");
  const failed = telemetry.filter(row => row.state === "failed");
  const limited = telemetry.filter(row => row.state === "limited");
  const measured = [...completed, ...limited];
  return {
    expectedTribunals: aliases,
    respondedTribunals: completed.length,
    failedTribunals: failed.length,
    limitedTribunals: limited.length,
    coveragePct: aliases === 0 ? 0 : Math.round((completed.length / aliases) * 10000) / 100,
    state: failed.length === 0 && limited.length === 0 && completed.length === aliases ? "completed" : "partial",
    pagesProcessed: measured.reduce((sum, row) => sum + row.pages, 0),
    processedRecords: measured.reduce((sum, row) => sum + row.processedRecords, 0),
    eligibleMovements: measured.reduce((sum, row) => sum + row.eligibleMovements, 0),
    deduplicatedProcessMonths: measured.reduce((sum, row) => sum + row.deduplicatedProcessMonths, 0),
    retryCount: telemetry.reduce((sum, row) => sum + row.retries, 0),
    retryDelayMs: telemetry.reduce((sum, row) => sum + row.retryDelayMs, 0),
    metricRows,
    queryFingerprint,
    startedAt,
    completedAt,
    aliases: telemetry.map(({ error, ...safe }) => error ? { ...safe, error } : safe),
  };
}
