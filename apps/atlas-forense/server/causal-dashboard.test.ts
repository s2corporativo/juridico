import { describe, expect, it } from "vitest";
import { summarizeCausalDashboard } from "./causal-dashboard";

const base = {
  latestRun: {
    runKey: "datajud-tjmg-rmbh",
    sourceKey: "datajud_public_api",
    scope: "rmbh_jec_causal_pilot",
    periodStart: "2025-01-01",
    periodEnd: "2026-08-27",
    methodologyVersion: "causal-pilot-v1",
    status: "completed",
    updatedAt: "2026-10-14T12:00:00.000Z",
  },
  caseCount: 12,
  evidenceCount: 18,
  annotationRows: [
    { claimType: "dano_moral", role: "fato_gerador", label: "Negativação indevida", normalizedLabel: "negativacao indevida", reviewStatus: "pending", caseCount: 5, mentionCount: 6 },
    { claimType: "dano_moral", role: "pedido", label: "Indenização por dano moral", normalizedLabel: "indenizacao por dano moral", reviewStatus: "approved", caseCount: 5, mentionCount: 5 },
    { claimType: "dano_material", role: "fato_gerador", label: "Cobrança indevida", normalizedLabel: "cobranca indevida", reviewStatus: "approved", caseCount: 3, mentionCount: 3 },
    { claimType: "dano_material", role: "fundamento", label: "CDC", normalizedLabel: "cdc", reviewStatus: "approved", caseCount: 3, mentionCount: 3 },
  ],
  outcomeRows: [
    { claimType: "dano_moral", outcome: "procedente", reviewStatus: "approved", caseCount: 2, amountCents: 300000 },
    { claimType: "dano_material", outcome: "parcialmente_procedente", reviewStatus: "pending", caseCount: 1, amountCents: 50000 },
  ],
  reviewRows: [
    { reviewStatus: "pending", count: 6 },
    { reviewStatus: "approved", count: 8 },
  ],
  municipalityRows: [{ municipality: "Betim", count: 7 }, { municipality: null, count: 5 }],
  filter: { claimType: "all" as const, reviewStatus: "all" as const },
};

describe("dashboard do Atlas Causal", () => {
  it("separa fatos geradores de pedidos e fundamentos", () => {
    const result = summarizeCausalDashboard(base);
    expect(result.factGenerators.map(item => item.label)).toEqual(["Negativação indevida", "Cobrança indevida"]);
    expect(result.requests).toHaveLength(1);
    expect(result.requests[0].role).toBe("pedido");
    expect(result.factGenerators.some(item => item.label === "CDC")).toBe(false);
  });

  it("aplica filtros de tipo e revisão sem misturar os danos", () => {
    const result = summarizeCausalDashboard({ ...base, filter: { claimType: "dano_moral", reviewStatus: "pending" } });
    expect(result.factGenerators).toHaveLength(1);
    expect(result.factGenerators[0].claimType).toBe("dano_moral");
    expect(result.factGenerators[0].reviewStatus).toBe("pending");
    expect(result.outcomes).toHaveLength(0);
  });

  it("mantém limites metodológicos e não expõe identificadores individuais", () => {
    const result = summarizeCausalDashboard(base);
    expect(result.limitations.join(" ")).toMatch(/revisão humana/);
    expect(result.limitations.join(" ")).toMatch(/não representa taxa/);
    expect(JSON.stringify(result)).not.toMatch(/000\d{4}-\d{2}/);
    expect(result.latestRun?.sourceKey).toBe("datajud_public_api");
  });

  it("funciona com conjunto vazio", () => {
    const result = summarizeCausalDashboard({ ...base, caseCount: 0, evidenceCount: 0, annotationRows: [], outcomeRows: [], reviewRows: [], municipalityRows: [], latestRun: null });
    expect(result.summary).toEqual({ cases: 0, evidence: 0, factGenerators: 0, reviewedAnnotations: 0, pendingAnnotations: 0 });
    expect(result.factGenerators).toEqual([]);
    expect(result.latestRun).toBeNull();
  });
});
