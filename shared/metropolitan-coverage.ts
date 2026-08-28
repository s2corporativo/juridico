import type { RmbhMunicipality } from "./atlas-expansion";

export type MetropolitanBodyFacet = {
  municipalityName: string;
  municipalityIbgeCode: string;
  judgingBodyCode: string;
  judgingBodyLabel: string;
  amount: number;
};

export function classifyJudgingBodyLabel(label: string) {
  return /juizado especial|unidade jurisdicional/i.test(label) ? "jec_named" as const : "other_named" as const;
}

export function buildMetropolitanCoverageRows(municipalities: RmbhMunicipality[], facets: MetropolitanBodyFacet[]) {
  return municipalities.map(municipality => {
    const bodies = facets.filter(facet => String(facet.municipalityIbgeCode) === String(municipality.ibgeCode)).map(body => ({ ...body, institutionalStatus: classifyJudgingBodyLabel(body.judgingBodyLabel) }));
    return {
      ...municipality,
      state: bodies.length ? "mapped" as const : "not_mapped" as const,
      bodyCount: bodies.length,
      jecNamedBodyCount: bodies.filter(body => body.institutionalStatus === "jec_named").length,
      otherNamedBodyCount: bodies.filter(body => body.institutionalStatus === "other_named").length,
      facetAmount: bodies.reduce((sum, body) => sum + body.amount, 0),
      bodies: bodies.map(body => ({ code: body.judgingBodyCode, label: body.judgingBodyLabel, amount: body.amount, institutionalStatus: body.institutionalStatus })),
    };
  });
}
