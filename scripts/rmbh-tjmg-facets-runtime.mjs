const normalize = (value) => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");

export function buildRmbhJudgingBodyQuery({ after, pageSize = 250 }) {
  return {
    size: 0,
    track_total_hits: true,
    query: {
      bool: {
        must: [
          { match: { grau: "JE" } },
          { terms: { "classe.codigo": [436] } },
          { range: { dataAjuizamento: { gte: "20250101000000", lte: "20260826235959" } } },
        ],
      },
    },
    aggs: {
      facets: {
        composite: {
          size: pageSize,
          sources: [{ code: { terms: { field: "orgaoJulgador.codigo" } } }],
          ...(after ? { after } : {}),
        },
        aggs: {
          sample: { top_hits: { size: 1, _source: { includes: ["orgaoJulgador"] } } },
        },
      },
    },
  };
}

export function municipalityFromJudgingBody(label, municipalities) {
  const normalizedLabel = normalize(label);
  for (const municipality of municipalities) {
    const municipalityName = normalize(municipality.name);
    const pattern = new RegExp(`\\bcomarca de ${municipalityName}(?=$|\\s[-–—]|\\s*\\(|\\s*,)`, "u");
    if (pattern.test(normalizedLabel)) return municipality;
  }
  return null;
}

export function toRmbhJudgingBodyRow(bucket, municipalities) {
  const body = bucket?.sample?.hits?.hits?.[0]?._source?.orgaoJulgador;
  const label = typeof body?.nome === "string" ? body.nome : null;
  const municipality = label ? municipalityFromJudgingBody(label, municipalities) : null;
  if (!municipality) return null;
  const code = String(bucket?.key?.code ?? "");
  const amount = Number(bucket?.doc_count ?? NaN);
  if (!/^\d+$/.test(code) || !Number.isSafeInteger(amount) || amount < 0) return null;
  return { municipality: municipality.name, municipalityIbgeCode: municipality.ibgeCode, judgingBodyCode: code, judgingBodyLabel: label, amount };
}

export function summarizeRmbhFacetRows(rows) {
  return {
    municipalitiesWithBodies: new Set(rows.map((row) => row.municipalityIbgeCode)).size,
    distinctBodies: new Set(rows.map((row) => row.judgingBodyCode)).size,
    totalBuckets: rows.length,
  };
}
