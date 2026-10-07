// iterative_research.ts — pesquisa jurídica iterativa do modo agêntico.
// Objetivo: não parar na primeira resposta favorável; buscar cobertura mínima.

import { aiGatewayJson, governedWebSearch, type WebSearchResult } from "@/lib/ai_gateway";
import { legalSearch, type LegalRetrievalResult } from "@/lib/legal_retrieval";
import { assessResearchCoverage, buildResearchPlan, type ResearchCoverage } from "@/lib/research_coverage";
import { atlasKnowledgeSearch, type AtlasKnowledgeHit } from "@/lib/atlas_knowledge_retrieval";

export interface ClassifiedPrecedent extends WebSearchResult {
  favorable: boolean | null;
  relevance: number;
  verified: boolean;
}

export interface IterativeResearchResult {
  issue: string;
  area: string;
  cycles: number;
  laws: LegalRetrievalResult[];
  atlasKnowledge: AtlasKnowledgeHit[];
  precedents: ClassifiedPrecedent[];
  coverage: ResearchCoverage;
  queries: { purpose: string; query: string; results: number }[];
  insufficient: boolean;
}

function dedupe<T extends { url?: string; name?: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((x) => {
    const key = (x.url || x.name || "").trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function looksOfficial(url: string): boolean {
  try {
    const h = new URL(url).hostname.toLowerCase();
    return [
      "stf.jus.br","stj.jus.br","tst.jus.br","cnj.jus.br","tjmg.jus.br",
      "trf1.jus.br","trf2.jus.br","trf3.jus.br","trf4.jus.br","trf5.jus.br","trf6.jus.br",
      "planalto.gov.br","senado.leg.br","camara.leg.br","gov.br",
    ].some((d) => h === d || h.endsWith("." + d));
  } catch { return false; }
}

async function classifyPrecedents(
  issue: string,
  results: WebSearchResult[],
  taskType: string,
): Promise<ClassifiedPrecedent[]> {
  if (!results.length) return [];
  try {
    const { data } = await aiGatewayJson<{ items: { index: number; favorable: boolean | null; relevance: number }[] }>({
      taskType,
      temperature: 0.1,
      maxTokens: 900,
      messages: [
        {
          role: "system",
          content: 'Classifique apenas a aderência dos snippets ao problema jurídico. Não crie fatos nem complemente ementas. JSON: {"items":[{"index":0,"favorable":true|false|null,"relevance":0.0}]}',
        },
        {
          role: "user",
          content: JSON.stringify({ issue, results: results.map((r, index) => ({ index, name: r.name, snippet: r.snippet, host: r.host_name })) }),
        },
      ],
    });
    return results.map((r, index) => {
      const c = data.items?.find((x) => x.index === index);
      return {
        ...r,
        favorable: c?.favorable ?? null,
        relevance: Math.max(0, Math.min(1, Number(c?.relevance) || 0)),
        verified: looksOfficial(r.url),
      };
    });
  } catch {
    return results.map((r) => ({ ...r, favorable: null, relevance: 0, verified: looksOfficial(r.url) }));
  }
}

export async function runIterativeLegalResearch(params: {
  issue: string;
  area: string;
  taskType?: string;
  maxCycles?: number;
}): Promise<IterativeResearchResult> {
  const taskType = params.taskType || "pesquisa";
  const maxCycles = Math.max(1, Math.min(params.maxCycles || 3, 4));
  const plan = buildResearchPlan(params.issue, params.area);
  const queries: IterativeResearchResult["queries"] = [];
  let laws: LegalRetrievalResult[] = [];
  let atlasKnowledge: AtlasKnowledgeHit[] = [];
  let precedents: ClassifiedPrecedent[] = [];
  let coverage = assessResearchCoverage({ laws: [], precedents: [], factualFit: false });

  for (let cycle = 1; cycle <= maxCycles; cycle++) {
    const localQuery = `${params.area} ${params.issue} ${cycle > 1 ? coverage.missing.join(" ") : ""}`;
    laws = dedupeLegal([...laws, ...(await legalSearch(localQuery, 12))]);

    const internalPrecedents = laws
      .filter((x) => ["jurisprudencia", "sumula"].includes(x.source.tipo) && Boolean(x.source.urlOficial))
      .map((x) => ({
        url: x.source.urlOficial || "",
        name: [x.source.tribunal, x.source.diploma, x.source.numero].filter(Boolean).join(" "),
        snippet: x.source.textoTrecho.slice(0, 900),
        host_name: (() => { try { return new URL(x.source.urlOficial || "").hostname; } catch { return ""; } })(),
      }));
    if (internalPrecedents.length) {
      const classifiedInternal = await classifyPrecedents(params.issue, internalPrecedents, taskType);
      precedents = dedupe([...precedents, ...classifiedInternal])
        .sort((a, b) => (b.relevance + Number(b.verified) * 0.15) - (a.relevance + Number(a.verified) * 0.15))
        .slice(0, 40);
      queries.push({ purpose: "precedentes internos híbridos", query: localQuery, results: classifiedInternal.length });
    }
    try {
      atlasKnowledge = dedupeAtlas([...atlasKnowledge, ...(await atlasKnowledgeSearch(localQuery, 16))]);
      queries.push({ purpose: "acervo jurídico interno híbrido", query: localQuery, results: atlasKnowledge.length });
    } catch {
      queries.push({ purpose: "acervo jurídico interno híbrido", query: localQuery, results: 0 });
    }

    for (const step of plan.steps.filter((s) => s.sourceClasses.includes("precedent"))) {
      const query = cycle === 1 ? step.query : `${step.query} ${coverage.missing.join(" ")}`;
      try {
        const raw = await governedWebSearch(query, taskType, 8);
        queries.push({ purpose: step.purpose, query, results: raw.length });
        const classified = await classifyPrecedents(params.issue, raw, taskType);
        precedents = dedupe([...precedents, ...classified])
          .sort((a, b) => (b.relevance + Number(b.verified) * 0.15) - (a.relevance + Number(a.verified) * 0.15))
          .slice(0, 40);
      } catch {
        queries.push({ purpose: step.purpose, query, results: 0 });
      }
    }

    coverage = assessResearchCoverage({
      laws: laws.map((l) => ({ vigente: l.source.vigente, urlOficial: l.source.urlOficial })),
      precedents,
      factualFit: laws.length > 0 && precedents.some((p) => p.relevance >= 0.45),
    });
    if (coverage.complete) {
      return { issue: params.issue, area: params.area, cycles: cycle, laws, atlasKnowledge, precedents, coverage, queries, insufficient: false };
    }
  }

  return { issue: params.issue, area: params.area, cycles: maxCycles, laws, atlasKnowledge, precedents, coverage, queries, insufficient: true };
}

function dedupeLegal(items: LegalRetrievalResult[]): LegalRetrievalResult[] {
  const best = new Map<string, LegalRetrievalResult>();
  for (const item of items) {
    const prev = best.get(item.source.id);
    if (!prev || item.score > prev.score) best.set(item.source.id, item);
  }
  return [...best.values()].sort((a, b) => b.score - a.score).slice(0, 30);
}


function dedupeAtlas(items: AtlasKnowledgeHit[]): AtlasKnowledgeHit[] {
  const best = new Map<string, AtlasKnowledgeHit>();
  for (const item of items) {
    const prev = best.get(item.documentId);
    if (!prev || item.score > prev.score) best.set(item.documentId, item);
  }
  return [...best.values()].sort((a,b)=>b.score-a.score).slice(0,40);
}
