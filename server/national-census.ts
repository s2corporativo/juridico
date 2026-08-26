export type CensusRunSnapshot = {
  id?: number;
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

export function getNationalDistributionStatus(readiness: ReturnType<typeof summarizeNationalCensusReadiness>) {
  const available = readiness.metricRows > 0 && readiness.coveragePct > 0 && (readiness.state === "partial" || readiness.state === "completed");
  return {
    available,
    label: available ? "Distribuições agregadas disponíveis" : "Distribuições agregadas indisponíveis",
    limitation: "A camada exibida contém somente distribuições JEC. Baixas, taxas e rankings comparativos permanecem indisponíveis até coleta e revisão específicas.",
  };
}

export type FacetCollectionSnapshot = {
  aliases: number;
  successfulAliases: number;
  errors: unknown[];
  pages: { subject: number; judging_body: number };
};

export function hasCompleteNationalFacetCollection(snapshot: FacetCollectionSnapshot) {
  return snapshot.aliases > 0 && snapshot.successfulAliases === snapshot.aliases && snapshot.errors.length === 0 && snapshot.pages.subject > 0 && snapshot.pages.judging_body > 0;
}
