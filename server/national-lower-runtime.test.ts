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
});
