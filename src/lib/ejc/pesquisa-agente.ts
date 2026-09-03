// Jurimetria DPT — Pesquisa jurídica AGÊNTICA iterativa sobre a base curada.
// Loop: planejar → buscar (BM25+embeddings, RRF) → criticar lacunas → refinar consultas → síntese.
// Fontes externas (web_search) aparecem apenas como PISTAS de leitura com URL oficial —
// NUNCA são injetadas na base de conhecimento (regra anti-loop do sistema).
// Degradê honesta: se o LLM/SDK estiver indisponível, o memo é montado deterministicamente
// a partir dos hits e o modo 'degradado' é reportado.
import type ZAI from 'z-ai-web-dev-sdk';
import { buscarHibrido, type HitHibrido } from './bm25';
import { carregarCorpus } from './verificar-citacao';

const criarZai = (): Promise<ZAI> => import('z-ai-web-dev-sdk').then((m) => m.default.create());

export interface IteracaoPesquisa {
  n: number;
  consulta: string;
  novosSlugs: string[];
  motivo: string;
}

export interface FonteWeb {
  titulo: string;
  url: string;
  origem: 'web_search (pista externa — não injetada na base)';
}

export interface MemoPesquisa {
  modo: 'agente' | 'degradado';
  resumo: string;
  fundamentos: { tese: string; aplicacao: string; fontes: string[] }[];
  contra_argumentos: { ponto: string; resposta: string; fontes: string[] }[];
  sugestao_peca: string;
  lacunas: string[];
}

export interface ResultadoPesquisa {
  pergunta: string;
  motor: string;
  iteracoes: IteracaoPesquisa[];
  fontes: HitHibrido[];
  fontesWeb: FonteWeb[];
  memo: MemoPesquisa;
  tempoMs: number;
}

function extrairJson(texto: string): unknown | null {
  const limpo = texto.replace(/```json/gi, '```').split('```').filter((b) => b.trim().startsWith('{'))[0] ?? texto;
  const inicio = limpo.indexOf('{');
  const fim = limpo.lastIndexOf('}');
  if (inicio === -1 || fim === -1 || fim <= inicio) return null;
  try { return JSON.parse(limpo.slice(inicio, fim + 1)); } catch { return null; }
}

const TRECHO = (h: HitHibrido, n = 260) => h.chunkTexto.replace(/\s+/g, ' ').slice(0, n);

async function planejar(zai: ZAI, pergunta: string, hits: HitHibrido[]): Promise<{ consultas: string[]; lacunas: string[] } | null> {
  try {
    const ctx = hits.slice(0, 8).map((h, i) => `[${i + 1}] ${h.slug} — ${h.titulo} :: ${TRECHO(h, 140)}`).join('\n');
    const r = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: 'Você é um advogado pesquisador sênior. Responda APENAS JSON: {"consultas": ["..."], "lacunas": ["..."]}. Gere 2-3 consultas de busca REFINADAS (sinônimos jurídicos, nomes de institutos, leis/artigos correlatos) para cobrir lacunas visíveis. Nada de explicações fora do JSON.' },
        { role: 'user', content: `PERGUNTA DE PESQUISA: ${pergunta}\n\nDOCUMENTOS JÁ ENCONTRADOS:\n${ctx}\n\nO que ainda falta? Gere as consultas complementares.` },
      ],
      thinking: { type: 'disabled' },
    });
    const json = extrairJson(String(r?.choices?.[0]?.message?.content ?? '')) as { consultas?: unknown; lacunas?: unknown } | null;
    if (!json || !Array.isArray(json.consultas)) return null;
    return {
      consultas: json.consultas.filter((c): c is string => typeof c === 'string').slice(0, 3),
      lacunas: Array.isArray(json.lacunas) ? json.lacunas.filter((c): c is string => typeof c === 'string').slice(0, 5) : [],
    };
  } catch {
    return null;
  }
}

function memoDegradado(pergunta: string, fontes: HitHibrido[], lacunas: string[]): MemoPesquisa {
  const porTipo = new Map<string, HitHibrido[]>();
  for (const h of fontes) {
    const k = h.tipoDocumento;
    if (!porTipo.has(k)) porTipo.set(k, []);
    porTipo.get(k)!.push(h);
  }
  return {
    modo: 'degradado',
    resumo: `Síntese determinística (agente IA indisponível — degradação honesta) para: "${pergunta}". Documentos mais relevantes listados abaixo por natureza; cada fonte traz rastreabilidade completa (fonte oficial, URL, data de consulta).`,
    fundamentos: [...porTipo.entries()].slice(0, 5).map(([tipo, hs]) => ({
      tese: `Apoio documental de natureza ${tipo}`,
      aplicacao: hs.slice(0, 3).map((h) => h.titulo).join('; '),
      fontes: hs.slice(0, 4).map((h) => h.slug),
    })),
    contra_argumentos: [{ ponto: 'Nenhum contra-argumento analisado por IA nesta execução (modo degradado).', resposta: 'Reexecute a pesquisa com o agente disponível para análise adversarial completa.', fontes: [] }],
    sugestao_peca: 'Cada fonte abaixo pode ser citada na peça com a URL oficial e a data de consulta registradas — verifique o trecho citado no documento original antes do protocolo.',
    lacunas: lacunas.length ? lacunas : ['Análise adversarial não executada (agente indisponível).'],
  };
}

function synthesize(zai: ZAI, pergunta: string, fontes: HitHibrido[], lacunasPlanejadas: string[], web: FonteWeb[]): Promise<MemoPesquisa | null> {
  return (async () => {
    try {
      const ctx = fontes.slice(0, 14).map((h, i) => `[F${i + 1}] ${h.slug} | ${h.titulo} | tipo:${h.tipoDocumento} | conf:${h.confiabilidade} | fonte:${h.fonte ?? '—'} | url:${h.urlFonte ?? '—'} | consulta:${h.dataConsulta ?? '—'}\n${TRECHO(h, 340)}`).join('\n\n');
      const webCtx = web.length ? `\n\nPISTAS EXTERNAS (apenas leitura — citar somente se puder conferir no site oficial):\n${web.map((w) => `- ${w.titulo} :: ${w.url}`).join('\n')}` : '';
      const r = await zai.chat.completions.create({
        messages: [
          { role: 'system', content: 'Você é advogado sênior redator de fundamentação. REGRAS ABSOLUTAS: (1) cite APENAS os documentos fornecidos, referenciando por slug exato; (2) NUNCA invente número de processo, relator, data ou enunciado; (3) trechos literais só os fornecidos; (4) aponte lacunas honestamente. Responda APENAS JSON: {"resumo": "...", "fundamentacoes": [{"tese": "...", "aplicacao": "...", "fontes": ["slug"]}], "contra_argumentos": [{"ponto": "...", "resposta": "...", "fontes": ["slug"]}], "sugestao_peca": "...", "lacunas": ["..."]}.' },
          { role: 'user', content: `PERGUNTA/TESE A FUNDAMENTAR: ${pergunta}\n\nFONTES DISPONÍVEIS (as únicas permitidas):\n${ctx}${webCtx}${lacunasPlanejadas.length ? `\n\nLACUNAS DETECTADAS NA PLANEJAMENTO: ${lacunasPlanejadas.join('; ')}` : ''}` },
        ],
        thinking: { type: 'disabled' },
      });
      const json = extrairJson(String(r?.choices?.[0]?.message?.content ?? '')) as Record<string, unknown> | null;
      if (!json || typeof json.resumo !== 'string') return null;
      // Normalização de referências: o LLM pode citar "F2" (marcador de contexto) ou o slug.
      // Tudo é mapeado para slugs reais; referências desconhecidas são descartadas (anti-invenção).
      const slugPorIndice = fontes.map((f) => f.slug);
      const refParaSlug = (ref: string): string | null => {
        const r2 = ref.trim();
        const m = /^F(\d+)$/i.exec(r2);
        if (m) {
          const idx = Number(m[1]) - 1;
          return idx >= 0 && idx < slugPorIndice.length ? slugPorIndice[idx] : null;
        }
        return fontes.some((f) => f.slug === r2) ? r2 : null;
      };
      const refsLista = (v: unknown): string[] => (Array.isArray(v) ? v.map(String).map(refParaSlug).filter((s): s is string => s !== null) : []);
      const norm = (v: unknown): { tese: string; aplicacao: string; fontes: string[] }[] =>
        Array.isArray(v) ? v.slice(0, 8).map((x) => {
          const o = x as Record<string, unknown>;
          return { tese: String(o.tese ?? o.ponto ?? ''), aplicacao: String(o.aplicacao ?? o.resposta ?? ''), fontes: refsLista(o.fontes) };
        }) : [];
      return {
        modo: 'agente',
        resumo: json.resumo,
        fundamentos: norm(json.fundamentacoes ?? json.fundamentos),
        contra_argumentos: Array.isArray(json.contra_argumentos) ? json.contra_argumentos.map((x) => {
          const o = x as Record<string, unknown>;
          return { ponto: String(o.ponto ?? ''), resposta: String(o.resposta ?? ''), fontes: refsLista(o.fontes) };
        }).slice(0, 6) : [],
        sugestao_peca: String(json.sugestao_peca ?? ''),
        lacunas: Array.isArray(json.lacunas) ? json.lacunas.map(String).slice(0, 6) : [],
      };
    } catch {
      return null;
    }
  })();
}

export async function pesquisarAgenticamente(pergunta: string, maxIteracoes = 3): Promise<ResultadoPesquisa> {
  const inicio = Date.now();
  const corpus = await carregarCorpus();
  const fontes = new Map<string, HitHibrido>();
  const iteracoes: IteracaoPesquisa[] = [];

  // Iteração 1 — consulta original
  const h1 = buscarHibrido(corpus, pergunta, 10);
  h1.forEach((h) => fontes.set(h.slug, h));
  iteracoes.push({ n: 1, consulta: pergunta, novosSlugs: h1.map((h) => h.slug), motivo: 'consulta original (BM25 + embeddings locais, RRF)' });

  // Planejamento do agente
  let zai: ZAI | null = null;
  try { zai = await criarZai(); } catch { zai = null; }
  let lacunas: string[] = [];
  if (zai) {
    const plano = await planejar(zai, pergunta, h1);
    if (plano) {
      lacunas = plano.lacunas;
      for (let i = 0; i < Math.min(plano.consultas.length, maxIteracoes - 1); i++) {
        const consulta = plano.consultas[i];
        const hi = buscarHibrido(corpus, consulta, 6);
        const novos = hi.filter((h) => !fontes.has(h.slug));
        novos.forEach((h) => fontes.set(h.slug, h));
        iteracoes.push({ n: i + 2, consulta, novosSlugs: novos.map((h) => h.slug), motivo: 'refinamento do agente (lacunas e institutos correlatos)' });
      }
    }
  }

  // Pistas externas (opcional) — nunca injetadas na base
  const fontesWeb: FonteWeb[] = [];
  if (zai) {
    try {
      const r = await zai.functions.invoke('web_search', { query: `${pergunta} jurisprudência site:jus.br`, count: 4 });
      for (const item of r ?? []) {
        if (item?.original_url) fontesWeb.push({ titulo: item.caption ?? item.source ?? item.original_url, url: item.original_url, origem: 'web_search (pista externa — não injetada na base)' });
      }
    } catch { /* degradação silenciosa e honesta */ }
  }

  const lista = [...fontes.values()];
  const memo = zai ? (await synthesize(zai, pergunta, lista, lacunas, fontesWeb)) ?? memoDegradado(pergunta, lista, lacunas) : memoDegradado(pergunta, lista, lacunas);

  return {
    pergunta,
    motor: `bm25+emb-local (RRF) · ${corpus.nChunks} chunks indexados · ${iteracoes.length} iteração(ões)`,
    iteracoes,
    fontes: lista,
    fontesWeb,
    memo,
    tempoMs: Date.now() - inicio,
  };
}
