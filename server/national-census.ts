export type CensusRunSnapshot = {
  status: "planned" | "running" | "partial" | "completed" | "failed" | "rejected";
  expectedTribunals: number;
  respondedTribunals: number;
  periodStart: string;
  periodEnd: string;
  methodologyVersion: string;
  coverageNote: string;
};

export function summarizeNationalCensusReadiness(runs: CensusRunSnapshot[], metricRows: number) {
  const latest = runs[0];
  if (!latest) return { state: "not_started" as const, label: "Censo ainda não iniciado", coveragePct: 0, latest: null, metricRows };
  const coveragePct = latest.expectedTribunals > 0 ? Math.round((latest.respondedTribunals / latest.expectedTribunals) * 100) : 0;
  return { state: latest.status, label: latest.status === "completed" ? "Censo concluído" : latest.status === "partial" ? "Cobertura parcial" : latest.status === "running" ? "Coleta em andamento" : "Coleta planejada", coveragePct, latest, metricRows };
}
