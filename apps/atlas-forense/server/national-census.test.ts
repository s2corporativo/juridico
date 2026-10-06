import { describe, expect, it } from "vitest";
import { getNationalDistributionStatus, hasCompleteNationalFacetCollection, normalizeNationalCensusFilter, selectNationalCensusRun, summarizeNationalCensusReadiness } from "./national-census";

describe("national census readiness", () => {
  it("does not represent a censo as available without a persisted run", () => {
    expect(summarizeNationalCensusReadiness([], 0)).toMatchObject({ state: "not_started", coveragePct: 0, metricRows: 0 });
  });

  it("reports coverage from responded tribunals without inferring representativeness", () => {
    const summary = summarizeNationalCensusReadiness([{ status: "partial", expectedTribunals: 27, respondedTribunals: 18, periodStart: "2025-01", periodEnd: "2026-08", coverageNote: "Cobertura parcial." }], 216);
    expect(summary).toMatchObject({ state: "partial", coveragePct: 67, metricRows: 216 });
  });

  it("keeps the 27-tribunal census as the public source when a newer territorial pilot exists", () => {
    const selected = selectNationalCensusRun([
      { id: 2, runKey: "pilot", scope: "tjmg_territorial_lower_pilot", status: "partial", expectedTribunals: 1, respondedTribunals: 1, periodStart: "2025-01", periodEnd: "2026-08", methodologyVersion: "lower-pilot-v2", coverageNote: "piloto" },
      { id: 1, runKey: "national", scope: "JEC estadual: distribuições; baixas pendentes", status: "partial", expectedTribunals: 27, respondedTribunals: 27, periodStart: "2025-01", periodEnd: "2026-08", methodologyVersion: "1.0", coverageNote: "censo" },
    ]);
    expect(selected).toMatchObject({ id: 1, runKey: "national" });
  });

  it("does not present distributions when only endpoint coverage exists", () => {
    const readiness = summarizeNationalCensusReadiness([{ status: "planned", expectedTribunals: 27, respondedTribunals: 27, periodStart: "2025-01", periodEnd: "2026-08", methodologyVersion: "1.0", coverageNote: "aliases" }], 0);
    expect(getNationalDistributionStatus(readiness)).toMatchObject({ available: false });
  });

  it("presents distributions only for a partial or completed run with metrics", () => {
    const readiness = summarizeNationalCensusReadiness([{ status: "partial", expectedTribunals: 27, respondedTribunals: 27, periodStart: "2025-01", periodEnd: "2026-08", methodologyVersion: "1.0", coverageNote: "agregados" }], 540);
    expect(getNationalDistributionStatus(readiness)).toMatchObject({ available: true });
  });

  it("requires complete alias and page coverage before calling facets consolidated", () => {
    expect(hasCompleteNationalFacetCollection({ aliases: 27, successfulAliases: 27, errors: [], pages: { subject: 88, judging_body: 59 } })).toBe(true);
    expect(hasCompleteNationalFacetCollection({ aliases: 27, successfulAliases: 26, errors: [{ alias: "tjmg" }], pages: { subject: 88, judging_body: 59 } })).toBe(false);
  });

  it("normalizes valid national period and tribunal filters without accepting invalid months", () => {
    expect(normalizeNationalCensusFilter({ from: "2026-08", to: "2025-01", tribunalAlias: " TJMG " })).toEqual({ from: "2025-01", to: "2026-08", tribunalAlias: "tjmg" });
    expect(normalizeNationalCensusFilter({ from: "2026-99", tribunalAlias: "" })).toEqual({ from: undefined, to: undefined, tribunalAlias: undefined });
  });
});
