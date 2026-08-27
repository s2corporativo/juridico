export type CompendiumCityCoverage = {
  city: string | null;
  decisionCount: number;
};

export type ComarcaFacet = {
  code: string;
  label: string;
  amount: number;
};

export type CompendiumHomeMetrics = {
  decisionCount: number;
  officialSourceCount: number;
  sourceCount: number;
  authorityCount: number;
};

export function buildComarcaCoverage(rows: CompendiumCityCoverage[], facets: ComarcaFacet[] = []) {
  const normalized = new Map(rows.map(row => [row.city?.trim().toLocaleLowerCase("pt-BR"), row.decisionCount]));
  const official = new Map(facets.map(facet => [facet.code, facet]));
  return [
    { label: "Betim/MG", catalogued: true, decisionCount: normalized.get("betim") ?? 0, facet: official.get("40011") ?? null },
    { label: "Igarapé/MG", catalogued: normalized.has("igarapé"), decisionCount: normalized.get("igarapé") ?? 0, facet: official.get("8161") ?? null },
  ];
}

export function buildCompendiumHomeStats({ topics, theses, metrics, cityCoverage, comarcaFacets }: {
  topics: Array<unknown>;
  theses: Array<unknown>;
  metrics: CompendiumHomeMetrics;
  cityCoverage: CompendiumCityCoverage[];
  comarcaFacets?: ComarcaFacet[];
}) {
  return {
    themes: topics.length,
    theses: theses.length,
    authorities: metrics.authorityCount,
    decisions: metrics.decisionCount,
    officialSources: metrics.officialSourceCount,
    totalSources: metrics.sourceCount,
    comarcas: buildComarcaCoverage(cityCoverage, comarcaFacets),
  };
}
