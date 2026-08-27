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

export function parseJudgingBodyCodes(value) {
  if (!value?.trim()) return [];
  const codes = [...new Set(value.split(",").map(code => code.trim()).filter(Boolean))];
  if (codes.length === 0 || codes.length > 3 || codes.some(code => !/^\d{1,12}$/.test(code))) {
    throw new Error("Os códigos de órgão devem conter de 1 a 3 números CNJ válidos.");
  }
  return codes;
}

export function buildLowerQuery({ judgingBodyCodes = [], pageSize = 250 } = {}) {
  const filters = [
    { match: { grau: "JE" } },
    { terms: { "classe.codigo": [436] } },
    { range: { dataAjuizamento: { gte: "20250101000000", lt: "20260901000000" } } },
    { match: { "movimentos.nome": "Baixa Definitiva" } },
  ];
  if (judgingBodyCodes.length > 0) filters.push({ terms: { "orgaoJulgador.codigo": judgingBodyCodes } });

  return {
    size: pageSize,
    track_total_hits: true,
    _source: judgingBodyCodes.length > 0
      ? ["numeroProcesso", "movimentos.nome", "movimentos.dataHora", "orgaoJulgador.codigo"]
      : ["numeroProcesso", "movimentos.nome", "movimentos.dataHora"],
    sort: ["_doc"],
    query: { bool: { filter: filters } },
  };
}

export function addLowerAggregate(monthTotals, { month, judgingBodyCode }) {
  const key = `${judgingBodyCode ?? ""}|${month}`;
  monthTotals.set(key, (monthTotals.get(key) ?? 0) + 1);
}

export function buildLowerMetricRows({ alias, uf, monthTotals, territorial }) {
  return [...monthTotals.entries()].map(([key, amount]) => {
    const [judgingBodyCode, month] = key.split("|");
    return territorial
      ? { alias, uf, month, amount, judgingBodyCode }
      : { alias, uf, month, amount };
  });
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
