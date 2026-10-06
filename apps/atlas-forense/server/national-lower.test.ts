import { describe, expect, it } from "vitest";
import { aggregateTemporaryFinalLowers } from "./national-lower";

describe("temporary final-lower aggregation", () => {
  it("counts exact final-lower movements once per process and month without returning identifiers", () => {
    const output = aggregateTemporaryFinalLowers([
      { processNumber: "0000001-00.2025.8.00.0000", movements: [{ name: "Baixa Definitiva", date: "20250201120000" }, { name: "Baixa Definitiva", date: "20250202130000" }, { name: "Arquivamento", date: "20250203" }] },
      { processNumber: "0000001-00.2025.8.00.0000", movements: [{ name: "Baixa Definitiva", date: "20250301090000" }] },
      { processNumber: "0000002-00.2025.8.00.0000", movements: [{ name: "baixa definitiva", date: "20250204150000" }] },
    ], "ephemeral-test-secret");

    expect(output).toEqual({ monthly: [{ month: "2025-02", amount: 2 }, { month: "2025-03", amount: 1 }], processedRecords: 3, eligibleMovements: 4, deduplicatedProcessMonths: 3 });
    expect(JSON.stringify(output)).not.toContain("0000001");
  });
});
