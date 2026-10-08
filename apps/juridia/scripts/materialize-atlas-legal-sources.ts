import { createHash } from "node:crypto";
import { db } from "../src/lib/db";

type ProjectedSource = {
  tipo: "artigo_lei" | "sumula" | "jurisprudencia";
  diploma: string;
  numero: string;
  tribunal: string | null;
  textoTrecho: string;
  vigente: boolean;
  urlOficial: string;
  hashConteudo: string;
  dataConsulta: Date | null;
  revisadoPor: string;
};

function parseJson(raw: string | null): Record<string, unknown> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

function officialUrl(url: string | null): url is string {
  if (!url) return false;
  try {
    const host = new URL(url).hostname.toLowerCase();
    return [
      "planalto.gov.br", "stf.jus.br", "stj.jus.br", "tst.jus.br", "cnj.jus.br",
      "senado.leg.br", "camara.leg.br", "gov.br", "tjmg.jus.br",
      "trf1.jus.br", "trf2.jus.br", "trf3.jus.br", "trf4.jus.br", "trf5.jus.br", "trf6.jus.br",
    ].some((d) => host === d || host.endsWith("." + d));
  } catch {
    return false;
  }
}

function toDate(value: unknown): Date | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function normalizeArticle(value: string): string {
  return `art. ${value.replace(/^(?:art\.?|artigo)\s*/i, "").replace(/º/g, "").trim()}`;
}

function shortExcerpt(content: string, needle?: string): string {
  const normalized = content.replace(/\r/g, "");
  if (needle) {
    const idx = normalized.toLowerCase().indexOf(needle.toLowerCase());
    if (idx >= 0) return normalized.slice(Math.max(0, idx - 180), idx + 1400).trim();
  }
  return normalized.slice(0, 1600).trim();
}

function projectLegislation(doc: {
  conteudo: string; metadados: string | null; vigente: boolean; urlFonte: string; dataConsulta: string | null; dataUltimaVerificacao: string | null;
}): ProjectedSource[] {
  const meta = parseJson(doc.metadados);
  const diploma = typeof meta.numero === "string" && meta.numero.trim() ? meta.numero.trim() : "";
  const articles = Array.isArray(meta.artigos_principais)
    ? meta.artigos_principais.filter((x): x is string => typeof x === "string" && x.trim().length > 0)
    : [];
  if (!diploma || !articles.length) return [];
  const date = toDate(doc.dataUltimaVerificacao) || toDate(doc.dataConsulta);
  return articles.map((article) => {
    const numero = normalizeArticle(article);
    const textoTrecho = shortExcerpt(doc.conteudo, numero);
    return {
      tipo: "artigo_lei",
      diploma,
      numero,
      tribunal: null,
      textoTrecho,
      vigente: doc.vigente,
      urlOficial: doc.urlFonte,
      hashConteudo: createHash("sha256").update(`${diploma}|${numero}|${textoTrecho}`).digest("hex"),
      dataConsulta: date,
      revisadoPor: "atlas-curadoria",
    };
  });
}

function projectJurisprudence(doc: {
  titulo: string; conteudo: string; metadados: string | null; vigente: boolean; urlFonte: string; dataConsulta: string | null; dataUltimaVerificacao: string | null;
}): ProjectedSource[] {
  const meta = parseJson(doc.metadados);
  const tribunal = typeof meta.tribunal === "string" ? meta.tribunal.trim().toUpperCase() : null;
  const date = toDate(doc.dataUltimaVerificacao) || toDate(doc.dataConsulta);
  const out: ProjectedSource[] = [];

  const sumula = doc.titulo.match(/S[úu]mula\s+(?:Vinculante\s+)?(\d+)/i);
  if (sumula) {
    const numero = `Súmula ${sumula[1]}`;
    const textoTrecho = shortExcerpt(doc.conteudo, numero);
    out.push({
      tipo: "sumula", diploma: "Súmula", numero, tribunal, textoTrecho,
      vigente: doc.vigente, urlOficial: doc.urlFonte,
      hashConteudo: createHash("sha256").update(`Súmula|${numero}|${tribunal || ""}|${textoTrecho}`).digest("hex"),
      dataConsulta: date, revisadoPor: "atlas-curadoria",
    });
  }

  const text = `${doc.titulo}\n${doc.conteudo.slice(0, 1200)}`;
  const re = /\b(REsp|RE|AgInt|AgRg|HC|HD|RHC|RMS|ARE|ADI|ADO|ADC|AO|Pet)\s*(\d[\d.\-]*)/gi;
  const seen = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const diploma = m[1];
    const numero = m[2].replace(/\.$/, "");
    const key = `${diploma}|${numero}|${tribunal || ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const textoTrecho = shortExcerpt(doc.conteudo, `${diploma} ${numero}`);
    out.push({
      tipo: "jurisprudencia", diploma, numero, tribunal, textoTrecho,
      vigente: doc.vigente, urlOficial: doc.urlFonte,
      hashConteudo: createHash("sha256").update(`${key}|${textoTrecho}`).digest("hex"),
      dataConsulta: date, revisadoPor: "atlas-curadoria",
    });
  }
  return out;
}

async function main() {
  const docs = await db.knowledgeDocument.findMany({
    where: {
      status: "ATIVO",
      vigente: true,
      dadosFicticios: false,
      tipoDocumento: { in: ["LEGISLACAO", "JURISPRUDENCIA"] },
    },
    select: {
      id: true, titulo: true, tipoDocumento: true, conteudo: true, metadados: true,
      vigente: true, urlFonte: true, dataConsulta: true, dataUltimaVerificacao: true,
    },
  });

  const projected: ProjectedSource[] = [];
  for (const doc of docs) {
    if (!officialUrl(doc.urlFonte)) continue;
    const normalized = { ...doc, urlFonte: doc.urlFonte };
    if (doc.tipoDocumento === "LEGISLACAO") projected.push(...projectLegislation(normalized));
    else projected.push(...projectJurisprudence(normalized));
  }

  let created = 0, updated = 0, skipped = 0;
  for (const source of projected) {
    const existing = await db.legalSource.findFirst({
      where: {
        tipo: source.tipo,
        diploma: source.diploma,
        numero: source.numero,
        tribunal: source.tribunal,
      },
    });
    if (existing) {
      if (
        existing.hashConteudo === source.hashConteudo &&
        existing.urlOficial === source.urlOficial &&
        existing.vigente === source.vigente
      ) {
        skipped++;
        continue;
      }
      await db.legalSource.update({
        where: { id: existing.id },
        data: { ...source, embedding: null, embeddingModel: null, embeddedAt: null },
      });
      updated++;
    } else {
      await db.legalSource.create({ data: source });
      created++;
    }
  }

  const counts = await db.legalSource.groupBy({ by: ["tipo"], _count: { _all: true } });
  console.log(JSON.stringify({
    knowledgeDocumentsConsidered: docs.length,
    projected: projected.length,
    created, updated, skipped,
    totalsByType: counts.map((x) => ({ tipo: x.tipo, count: x._count._all })),
  }, null, 2));
}

main()
  .catch((error) => { console.error(error); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
