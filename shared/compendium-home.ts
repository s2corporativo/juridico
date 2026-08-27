export type CompendiumCityCoverage = {
  city: string | null;
  decisionCount: number;
};

export type CompendiumHomeMetrics = {
  decisionCount: number;
  officialSourceCount: number;
  sourceCount: number;
  authorityCount: number;
};

export function buildComarcaCoverage(rows: CompendiumCityCoverage[]) {
  const normalized = new Map(rows.map(row => [row.city?.trim().toLocaleLowerCase("pt-BR"), row.decisionCount]));
  return [
    { label: "Betim/MG", catalogued: true, decisionCount: normalized.get("betim") ?? 0 },
    { label: "Igarapé/MG", catalogued: normalized.has("igarapé"), decisionCount: normalized.get("igarapé") ?? 0 },
  ];
}

export function buildCompendiumHomeStats({ topics, theses, metrics, cityCoverage }: {
  topics: Array<unknown>;
  theses: Array<unknown>;
  metrics: CompendiumHomeMetrics;
  cityCoverage: CompendiumCityCoverage[];
}) {
  return {
    themes: topics.length,
    theses: theses.length,
    authorities: metrics.authorityCount,
    decisions: metrics.decisionCount,
    officialSources: metrics.officialSourceCount,
    totalSources: metrics.sourceCount,
    comarcas: buildComarcaCoverage(cityCoverage),
  };
}
