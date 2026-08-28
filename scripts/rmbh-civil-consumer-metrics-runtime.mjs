import { createHash } from "node:crypto";

export const CATEGORY_DEFINITIONS = [
  { code: "899", label: "Direito Civil" },
  { code: "1156", label: "Direito do Consumidor" },
];

export function buildCivilConsumerMetricsQuery({ bodyCodes, civilCodes, consumerCodes, from = "2025-01-01", to = "2026-08-27" }) {
  if (!Array.isArray(bodyCodes) || bodyCodes.length < 1 || bodyCodes.length > 24) throw new Error("O lote deve conter entre 1 e 24 órgãos.");
  if (!Array.isArray(civilCodes) || !civilCodes.length || !Array.isArray(consumerCodes) || !consumerCodes.length) throw new Error("A árvore TPU deve conter as duas categorias.");
  return {
    size: 0,
    track_total_hits: true,
    _source: false,
    query: {
      bool: {
        filter: [
          { term: { grau: "JE" } },
          { term: { "classe.codigo": 436 } },
          { terms: { "orgaoJulgador.codigo": bodyCodes } },
          { range: { dataAjuizamento: { gte: from, lt: to } } },
        ],
      },
    },
    aggs: {
      by_category: {
        filters: {
          filters: {
            civil: { terms: { "assuntos.codigo": civilCodes } },
            consumer: { terms: { "assuntos.codigo": consumerCodes } },
          },
        },
        aggs: {
          by_body: {
            terms: { field: "orgaoJulgador.codigo", size: 24 },
            aggs: {
              by_month: { date_histogram: { field: "dataAjuizamento", calendar_interval: "month", format: "yyyy-MM", min_doc_count: 1 } },
            },
          },
        },
      },
    },
  };
}

export function queryFingerprint(query) {
  return createHash("sha256").update(JSON.stringify(query)).digest("hex");
}

function number(value) {
  return Number.isFinite(Number(value)) ? Number(value) : 0;
}

export function summarizeCivilConsumerResponse(payload, { categoryDefinitions = CATEGORY_DEFINITIONS } = {}) {
  const categories = payload?.aggregations?.by_category?.buckets;
  if (!categories || typeof categories !== "object") throw new Error("Resposta agregada sem buckets de categoria.");
  const rows = [];
  for (const category of categoryDefinitions) {
    const bucket = categories[category.code === "899" ? "civil" : "consumer"];
    if (!bucket) continue;
    for (const body of bucket.by_body?.buckets ?? []) {
      for (const month of body.by_month?.buckets ?? []) {
        const amount = number(month.doc_count);
        if (amount > 0) rows.push({
          judgingBodyCode: String(body.key),
          month: String(month.key_as_string),
          categoryCode: category.code,
          categoryLabel: category.label,
          amount,
        });
      }
    }
  }
  return { matchedDocuments: number(payload?.hits?.total?.value), totalRelation: payload?.hits?.total?.relation ?? "unknown", rows };
}

export function validateCivilConsumerRows(rows, allowedBodies) {
  const allowed = new Set(allowedBodies.map((body) => String(body.judgingBodyCode)));
  const keys = new Set();
  for (const row of rows) {
    if (!allowed.has(String(row.judgingBodyCode))) throw new Error("Métrica fora do escopo de órgão permitido.");
    if (!(row.categoryCode === "899" || row.categoryCode === "1156")) throw new Error("Categoria TPU não autorizada.");
    if (!/^\d{4}-\d{2}$/.test(row.month) || !Number.isInteger(row.amount) || row.amount < 1) throw new Error("Célula mensal inválida.");
    const key = `${row.judgingBodyCode}|${row.month}|${row.categoryCode}`;
    if (keys.has(key)) throw new Error(`Célula duplicada: ${key}`);
    keys.add(key);
  }
  return { rows: rows.length, bodies: new Set(rows.map((row) => row.judgingBodyCode)).size, months: new Set(rows.map((row) => row.month)).size };
}
