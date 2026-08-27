import { describe, expect, it } from "vitest";

const runtime = await import("../scripts/national-lower-runtime.mjs");

describe("national lower run telemetry", () => {
  it("records page totals, alias failure and partial coverage without identifiers", () => {
    const first = runtime.createAliasTelemetry("tjmg", "MG");
    runtime.recordLowerPage(first, { processedRecords: 250, eligibleMovements: 18, deduplicatedProcessMonths: 16 });
    runtime.recordLowerPage(first, { processedRecords: 20, eligibleMovements: 3, deduplicatedProcessMonths: 3 });
    const second = runtime.failAlias(runtime.createAliasTelemetry("tjsp", "SP"), "HTTP 503");
    const summary = runtime.summarizeLowerRun({ aliases: 2, telemetry: [runtime.finishAlias(first), second], metricRows: 4, queryFingerprint: "fingerprint", startedAt: "start", completedAt: "end" });
    expect(summary).toMatchObject({ state: "partial", respondedTribunals: 1, failedTribunals: 1, coveragePct: 50, pagesProcessed: 2, processedRecords: 270, eligibleMovements: 21, deduplicatedProcessMonths: 19 });
    expect(JSON.stringify(summary)).not.toContain("numeroProcesso");
  });

  it("preserves a limited pilot as partial instead of completed coverage", () => {
    const pilot = runtime.createAliasTelemetry("tjmg", "MG");
    runtime.recordLowerPage(pilot, { processedRecords: 250, eligibleMovements: 4, deduplicatedProcessMonths: 4 });
    const summary = runtime.summarizeLowerRun({ aliases: 1, telemetry: [runtime.limitAlias(pilot)], metricRows: 1, queryFingerprint: "fingerprint", startedAt: "start", completedAt: "end" });
    expect(summary).toMatchObject({ state: "partial", respondedTribunals: 0, limitedTribunals: 1, coveragePct: 0, pagesProcessed: 1, processedRecords: 250, deduplicatedProcessMonths: 4 });
  });

  it("limits exponential retry delays and records only sanitized retry telemetry", () => {
    const telemetry = runtime.createAliasTelemetry("tjmg", "MG");
    runtime.recordRetry(telemetry, "acesso_publico", runtime.retryDelayMs(1_500, 1));
    runtime.recordRetry(telemetry, "acesso_publico", runtime.retryDelayMs(1_500, 2));
    const failed = runtime.failAlias(telemetry, new Error("fetch failed for https://datajud.example/123456789"));
    const summary = runtime.summarizeLowerRun({ aliases: 1, telemetry: [failed], metricRows: 0, queryFingerprint: "fingerprint", startedAt: "start", completedAt: "end" });

    expect(runtime.retryDelayMs(1_500, 1)).toBe(1_500);
    expect(runtime.retryDelayMs(1_500, 2)).toBe(3_000);
    expect(runtime.retryDelayMs(10_000, 4)).toBe(30_000);
    expect(summary).toMatchObject({ retryCount: 2, retryDelayMs: 4_500, state: "partial" });
    expect(JSON.stringify(summary)).toContain("falha de conexão");
    expect(JSON.stringify(summary)).not.toContain("123456789");
    expect(JSON.stringify(summary)).not.toContain("https://");
  });

  it("stops retrying after the configured cap without retaining raw error content", async () => {
    const delays: number[] = [];
    let attempts = 0;
    await expect(runtime.retryDataJudRequest({
      run: async () => {
        attempts += 1;
        throw new Error("fetch failed for numeroProcesso 123456789");
      },
      maxRetries: 2,
      retryBaseDelayMs: 1_500,
      onRetry: (delay: number) => delays.push(delay),
      sleep: async () => undefined,
    })).rejects.toThrow("fetch failed");

    const summary = runtime.summarizeLowerRun({
      aliases: 1,
      telemetry: [runtime.failAlias(runtime.createAliasTelemetry("tjmg", "MG"), new Error("fetch failed for numeroProcesso 123456789"))],
      metricRows: 0,
      queryFingerprint: "fingerprint",
      startedAt: "start",
      completedAt: "end",
    });
    expect(attempts).toBe(3);
    expect(delays).toEqual([1_500, 3_000]);
    expect(JSON.stringify(summary)).not.toContain("123456789");
  });

  it("builds a limited territorial query only for valid official judging-body codes", () => {
    const codes = runtime.parseJudgingBodyCodes("40011,8161");
    const query = runtime.buildLowerQuery({ judgingBodyCodes: codes });
    const serialized = JSON.stringify(query);

    expect(codes).toEqual(["40011", "8161"]);
    expect(serialized).toContain('"orgaoJulgador.codigo":["40011","8161"]');
    expect(query._source).toContain("orgaoJulgador.codigo");
    expect(serialized).not.toContain("parte");
    expect(serialized).not.toContain("cpf");
    expect(() => runtime.parseJudgingBodyCodes("40011,abc")).toThrow("códigos de órgão");
    expect(() => runtime.parseJudgingBodyCodes("1,2,3,4")).toThrow("códigos de órgão");
  });
});
