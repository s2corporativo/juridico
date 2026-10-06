export type LowerPageCursor = string[] | null;

export function buildNationalLowerPageQuery(cursor: LowerPageCursor) {
  return {
    size: 250,
    track_total_hits: true,
    _source: ["numeroProcesso", "movimentos.nome", "movimentos.dataHora"],
    sort: [{ numeroProcesso: "asc" }, { _id: "asc" }],
    ...(cursor ? { search_after: cursor } : {}),
    query: {
      bool: {
        filter: [
          { match: { grau: "JE" } },
          { terms: { "classe.codigo": [436] } },
          { range: { dataAjuizamento: { gte: "20250101000000", lt: "20260901000000" } } },
          { term: { "movimentos.nome.keyword": "Baixa Definitiva" } },
        ],
      },
    },
  };
}

export function pageState(hits: Array<{ sort?: unknown }>) {
  if (hits.length === 0) return { done: true, nextCursor: null as LowerPageCursor };
  const last = hits.at(-1)?.sort;
  if (!Array.isArray(last) || last.some(value => typeof value !== "string")) return { done: true, nextCursor: null as LowerPageCursor, reason: "invalid_sort_cursor" as const };
  return { done: false, nextCursor: last as string[] };
}
