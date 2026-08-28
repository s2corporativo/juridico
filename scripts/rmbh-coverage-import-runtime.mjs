const FORBIDDEN_KEYS = new Set([
  "numeroProcesso",
  "cpf",
  "telefone",
  "email",
  "documento",
  "authorization",
  "apiKey",
  "_source",
  "hits",
]);

const REQUIRED_FACET_KEYS = new Set([
  "municipality",
  "municipalityIbgeCode",
  "judgingBodyCode",
  "judgingBodyLabel",
  "amount",
]);

export function hasForbiddenStructuredKey(value) {
  if (Array.isArray(value)) return value.some(hasForbiddenStructuredKey);
  if (!value || typeof value !== "object") return false;

  return Object.entries(value).some(([key, nested]) => FORBIDDEN_KEYS.has(key) || hasForbiddenStructuredKey(nested));
}

export function validateRmbhCoverageImport(manifest, facets) {
  if (!manifest || typeof manifest !== "object" || !Array.isArray(facets)) {
    throw new Error("A importação RMBH exige manifesto e facetas agregadas válidos.");
  }
  if (manifest.alias !== "tjmg" || manifest.mode !== "execute" || manifest.state !== "completed") {
    throw new Error("A importação RMBH exige coleta TJMG concluída em modo execute.");
  }
  if (hasForbiddenStructuredKey(facets)) {
    throw new Error("A importação RMBH rejeitou campo individual ou resposta bruta.");
  }
  if (!facets.length || facets.some(facet => {
    const keys = Object.keys(facet).filter(key => facet[key] !== undefined);
    return keys.some(key => !REQUIRED_FACET_KEYS.has(key))
      || [...REQUIRED_FACET_KEYS].some(key => !(key in facet))
      || !Number.isInteger(Number(facet.municipalityIbgeCode))
      || !/^[0-9]+$/.test(String(facet.judgingBodyCode))
      || !Number.isInteger(Number(facet.amount))
      || Number(facet.amount) < 0;
  })) {
    throw new Error("A importação RMBH exige apenas linhas agregadas válidas por município e órgão.");
  }

  return {
    expectedMunicipalities: Number(manifest.scope?.municipalities ?? 0),
    mappedMunicipalities: new Set(facets.map(facet => String(facet.municipalityIbgeCode))).size,
    totalBodies: facets.length,
  };
}
