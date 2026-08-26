import { describe, expect, it } from "vitest";
import { summarizeNationalCensusReadiness } from "./national-census";

describe("national census readiness", () => {
  it("does not represent a censo as available without a persisted run", () => {
    expect(summarizeNationalCensusReadiness([], 0)).toMatchObject({ state: "not_started", coveragePct: 0, metricRows: 0 });
  });

  it("reports coverage from responded tribunals without inferring representativeness", () => {
    const summary = summarizeNationalCensusReadiness([{ status: "partial", expectedTribunals: 27, respondedTribunals: 18, periodStart: "2025-01", periodEnd: "2026-08", coverageNote: "Cobertura parcial." }], 216);
    expect(summary).toMatchObject({ state: "partial", coveragePct: 67, metricRows: 216 });
  });
});
