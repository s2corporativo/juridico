import type { RmbhMunicipality } from "./atlas-expansion";

export type MetropolitanBodyFacet = {
  municipalityName: string;
  municipalityIbgeCode: string;
  judgingBodyCode: string;
  judgingBodyLabel: string;
  amount: number;
};

export function buildMetropolitanCoverageRows(municipalities: RmbhMunicipality[], facets: MetropolitanBodyFacet[]) {
  return municipalities.map(municipality => {
    const bodies = facets.filter(facet => String(facet.municipalityIbgeCode) === String(municipality.ibgeCode));
    return {
      ...municipality,
      state: bodies.length ? "mapped" as const : "not_mapped" as const,
      bodyCount: bodies.length,
      facetAmount: bodies.reduce((sum, body) => sum + body.amount, 0),
      bodies: bodies.map(body => ({ code: body.judgingBodyCode, label: body.judgingBodyLabel, amount: body.amount })),
    };
  });
}
