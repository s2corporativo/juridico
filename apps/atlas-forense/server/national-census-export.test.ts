import { describe, expect, it } from "vitest";
import { buildNationalCensusCsv } from "@shared/national-census-export";

describe("national census CSV export", () => {
  it("includes filter, coverage, execution state and data limitations", () => {
    const csv = buildNationalCensusCsv({ from: "2026-01", to: "2026-08", tribunalLabel: "TJMG", coveragePct: 100, respondedTribunals: 27, expectedTribunals: 27, executionState: "cobertura parcial" }, [{ alias: "tjmg", uf: "MG", month: "2026-01", amount: 18494 }]);
    expect(csv).toContain("Cobertura: 100% (27/27 TJs)");
    expect(csv).toContain("Estado da execução: cobertura parcial");
    expect(csv).toContain("baixas não incluídas");
    expect(csv).toContain("tjmg,MG,2026-01,distribution,18494");
  });
});
