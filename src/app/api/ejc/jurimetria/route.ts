import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Jurimetria — estatísticas processuais agregadas em tempo real via API pública DataJud/CNJ.
// Nada é simulado e nada é injetado na base de conhecimento: leitura de metadados públicos.
// Campos verificados contra o índice real (2026-08): orgaoJulgador.codigoMunicipioIBGE (numérico),
// orgaoJulgador.codigo (numérico), classe.codigo (numérico), grau.keyword, assuntos.nome.keyword,
// dataAjuizamento (date, formato compacto yyyyMMddHHmmss).

const DATAJUD_BASE = 'https://api-publica.datajud.cnj.jus.br';
const WIKI_ACESSO = 'https://datajud-wiki.cnj.jus.br/api-publica/acesso/';

const TRIBUNAIS: Array<{ id: string; nome: string; destaque?: boolean }> = [
  { id: 'tjmg', nome: 'TJMG — Tribunal de Justiça de Minas Gerais', destaque: true },
  { id: 'trf6', nome: 'TRF-6 — Tribunal Regional Federal da 6ª Região (MG)', destaque: true },
  { id: 'trt3', nome: 'TRT-3 — Tribunal Regional do Trabalho (MG)', destaque: true },
  { id: 'tre-mg', nome: 'TRE-MG — Tribunal Regional Eleitoral de MG', destaque: true },
  { id: 'tjsp', nome: 'TJSP — Tribunal de Justiça de São Paulo' },
  { id: 'tjrj', nome: 'TJRJ — Tribunal de Justiça do Rio de Janeiro' },
  { id: 'tjdft', nome: 'TJDFT — Tribunal de Justiça do Distrito Federal' },
  { id: 'tjba', nome: 'TJBA — Tribunal de Justiça da Bahia' },
  { id: 'tjrs', nome: 'TJRS — Tribunal de Justiça do Rio Grande do Sul' },
  { id: 'tjpr', nome: 'TJPR — Tribunal de Justiça do Paraná' },
  { id: 'tjsc', nome: 'TJSC — Tribunal de Justiça de Santa Catarina' },
];

// Municípios MG com código IBGE — códigos verificados contra o acervo real do DataJud
// (cada um devolveu órgão julgador da comarca correspondente em consulta direta, 2026-08).
const MUNICIPIOS_MG: Array<{ codigo: string; nome: string }> = [
  { codigo: '3106200', nome: 'Belo Horizonte' },
  { codigo: '3118601', nome: 'Contagem' },
  { codigo: '3170206', nome: 'Uberlândia' },
  { codigo: '3136702', nome: 'Juiz de Fora' },
  { codigo: '3106705', nome: 'Betim' },
  { codigo: '3131307', nome: 'Ipatinga' },
  { codigo: '3143302', nome: 'Montes Claros' },
  { codigo: '3170107', nome: 'Uberaba' },
  { codigo: '3122306', nome: 'Divinópolis' },
  { codigo: '3157807', nome: 'Santa Luzia' },
  { codigo: '3148004', nome: 'Patos de Minas' },
  { codigo: '3118304', nome: 'Conselheiro Lafaiete' },
  { codigo: '3170404', nome: 'Unaí' },
  { codigo: '3127701', nome: 'Governador Valadares' },
  { codigo: '3105608', nome: 'Barbacena' },
  { codigo: '3152501', nome: 'Pouso Alegre' },
  { codigo: '3168606', nome: 'Teófilo Otoni' },
  { codigo: '3143906', nome: 'Muriaé' },
  { codigo: '3120706', nome: 'Patrocínio' },
  { codigo: '3136207', nome: 'João Monlevade' },
  { codigo: '3119401', nome: 'Coronel Fabriciano' },
  { codigo: '3162500', nome: 'São João del-Rei' },
];

const GRAUS = ['G1', 'G2', 'JE', 'TR'];
const ANOS_DISPONIVEIS = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

function obterChave(): string {
  const daEnv = process.env.DATAJUD_API_KEY?.trim();
  if (daEnv) return daEnv;
  throw new Error('DATAJUD_API_KEY não configurada no ambiente.');
}

const AMBITO =
  'Fonte: Conselho Nacional de Justiça — DataJud (API pública). Metadados processuais públicos; leitura apenas, sem injeção na base de conhecimento; acervo reflete a sincronização do CNJ (sistemas como PJe) e pode não cobrir 100% dos processos de cada comarca.';

// Cache em memória por recorte (mesma combinação de filtros) — TTL 10 min.
// Consultas idênticas (drill-down repetido, abas revisitadas) respondem na hora.
const TTL_CACHE_MS = 10 * 60 * 1000;
type EntradaCache = { em: number; resposta: unknown };
const globalCache = globalThis as unknown as { __jurimetriaCache?: Map<string, EntradaCache> };
const CACHE_JURIMETRIA: Map<string, EntradaCache> =
  globalCache.__jurimetriaCache ?? (globalCache.__jurimetriaCache = new Map());

type Bucket = { key: number | string; doc_count: number };
type BucketComRotulo = Bucket & {
  rotulo?: { hits?: { hits?: Array<{ _source?: Record<string, unknown> }> } };
};
type RespostaES = {
  hits?: { total?: { value: number; relation?: string }; hits?: Array<{ _source?: Record<string, unknown> }> };
  aggregations?: Record<string, unknown>;
};

async function consultarDataJud(tribunal: string, body: unknown, tentativa = 1): Promise<RespostaES> {
  const chave = obterChave();
  const res = await fetch(`${DATAJUD_BASE}/api_publica_${tribunal}/_search`, {
    method: 'POST',
    headers: {
      Authorization: `APIKey ${chave}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(25_000),
  });
  // 1 nova tentativa com recuo curto em erro transitório do CNJ (429/5xx) — honesto, sem simulação.
  if ((res.status === 429 || res.status >= 500) && tentativa === 1) {
    await new Promise((r) => setTimeout(r, 1200));
    return consultarDataJud(tribunal, body, 2);
  }
  if (!res.ok) {
    throw new Error(`DataJud respondeu HTTP ${res.status} para o índice "${tribunal}".`);
  }
  return (await res.json()) as RespostaES;
}

function bucketsAno(): Record<string, unknown> {
  // Distribuição anual 2018..2026 — intervalos no formato compacto do campo date.
  const bucketsAno: Record<string, unknown> = {};
  for (const ano of ANOS_DISPONIVEIS) {
    bucketsAno[`a${ano}`] = {
      range: { dataAjuizamento: { gte: `${ano}0101000000`, lt: `${ano + 1}0101000000` } },
    };
  }
  return bucketsAno;
}

function montarFiltros(o: {
  municipioIBGE?: string;
  varaCodigo?: string;
  classeCodigo?: string;
  grau?: string;
  ano?: string;
}): unknown[] {
  const filtros: unknown[] = [];
  if (o.municipioIBGE) {
    filtros.push({ term: { 'orgaoJulgador.codigoMunicipioIBGE': Number(o.municipioIBGE) } });
  }
  if (o.varaCodigo) {
    filtros.push({ term: { 'orgaoJulgador.codigo': Number(o.varaCodigo) } });
  }
  if (o.classeCodigo) {
    filtros.push({ term: { 'classe.codigo': Number(o.classeCodigo) } });
  }
  if (o.grau) {
    filtros.push({ term: { 'grau.keyword': o.grau } });
  }
  if (o.ano) {
    const ano = Number(o.ano);
    filtros.push({
      range: { dataAjuizamento: { gte: `${ano}0101000000`, lt: `${ano + 1}0101000000` } },
    });
  }
  return filtros;
}

type CorpoES = {
  size: number;
  from?: number;
  _source?: { excludes: string[] };
  query: unknown;
  sort?: unknown;
  aggs?: Record<string, unknown>;
  track_total_hits?: boolean;
};

function corpoAmostra(filtros: unknown[], pagina: number): CorpoES {
  return {
    size: 10,
    from: Math.max(0, Math.min(pagina, 20)) * 10,
    _source: { excludes: ['movimentos'] },
    query: filtros.length ? { bool: { filter: filtros } } : { match_all: {} },
    sort: [{ dataAjuizamento: { order: 'desc' as const } }],
    aggs: {
      varas_unicas: { cardinality: { field: 'orgaoJulgador.codigo' } },
      por_grau: { terms: { field: 'grau.keyword', size: 6 } },
      por_ano: { filters: { filters: bucketsAno() } },
    },
  };
}

function corpoAggs(filtros: unknown[]): CorpoES {
  return {
    size: 0,
    query: filtros.length ? { bool: { filter: filtros } } : { match_all: {} },
    aggs: {
      por_vara: {
        terms: { field: 'orgaoJulgador.codigo', size: 12 },
        aggs: { rotulo: { top_hits: { size: 1, _source: ['orgaoJulgador.nome'] } } },
      },
      por_classe: {
        terms: { field: 'classe.codigo', size: 12 },
        aggs: { rotulo: { top_hits: { size: 1, _source: ['classe.nome'] } } },
      },
      por_assunto: { terms: { field: 'assuntos.nome.keyword', size: 12 } },
    },
  };
}

function rotuloDoBucket(
  b: { rotulo?: { hits?: { hits?: Array<{ _source?: Record<string, unknown> }> } } },
  caminho: string[],
): string {
  const src = b.rotulo?.hits?.hits?.[0]?._source;
  let no: unknown = src;
  for (const c of caminho) {
    if (no && typeof no === 'object' && c in (no as Record<string, unknown>)) {
      no = (no as Record<string, unknown>)[c];
    } else {
      no = undefined;
      break;
    }
  }
  return typeof no === 'string' ? no : '';
}

export async function GET() {
  const ativa = Boolean(process.env.DATAJUD_API_KEY?.trim());
  return NextResponse.json({
    conector: 'CNJ — DataJud · jurimetria agregada',
    status: ativa ? 'ATIVA' : 'AGUARDANDO_CHAVE',
    comoHabilitar: ativa ? undefined : `Configure DATAJUD_API_KEY (chave pública gratuita de ${WIKI_ACESSO}).`,
    tribunais: TRIBUNAIS,
    municipios: MUNICIPIOS_MG,
    graus: GRAUS,
    anos: ANOS_DISPONIVEIS,
    nota: 'Filtros por município (código IBGE), vara e classe (códigos do órgão julgador), grau e ano de ajuizamento. A lista de municípios MG foi verificada contra o acervo real do DataJud; outras cidades podem ser consultadas digitando o código IBGE correspondente.',
    citacao: AMBITO,
  });
}

export async function POST(req: NextRequest) {
  try {
    const corpo = (await req.json()) as {
      tribunal?: string;
      municipioIBGE?: string;
      varaCodigo?: string;
      classeCodigo?: string;
      grau?: string;
      ano?: string;
      pagina?: number;
    };

    // Validação estrita — o id do tribunal compõe a URL do índice.
    const tribunal = (corpo.tribunal ?? 'tjmg').toLowerCase().trim();
    if (!/^[a-z0-9-]{2,12}$/.test(tribunal)) {
      return NextResponse.json({ error: 'Identificador de tribunal inválido.' }, { status: 400 });
    }
    const municipioIBGE =
      corpo.municipioIBGE && /^[0-9]{7}$/.test(corpo.municipioIBGE) ? corpo.municipioIBGE : undefined;
    const varaCodigo = corpo.varaCodigo && /^[0-9]{1,8}$/.test(corpo.varaCodigo) ? corpo.varaCodigo : undefined;
    const classeCodigo =
      corpo.classeCodigo && /^[0-9]{1,8}$/.test(corpo.classeCodigo) ? corpo.classeCodigo : undefined;
    const grau = corpo.grau && GRAUS.includes(corpo.grau) ? corpo.grau : undefined;
    const ano = corpo.ano && ANOS_DISPONIVEIS.map(String).includes(corpo.ano) ? corpo.ano : undefined;
    const pagina = Number.isFinite(corpo.pagina) ? Number(corpo.pagina) : 0;

    if (!municipioIBGE && !varaCodigo && !classeCodigo && !grau && !ano) {
      return NextResponse.json(
        {
          error:
            'Escolha ao menos um recorte (município, vara, classe, grau ou ano) — consultas sem filtro em tribunais grandes são recusadas pela política de uso.',
        },
        { status: 400 },
      );
    }

    const filtros = montarFiltros({ municipioIBGE, varaCodigo, classeCodigo, grau, ano });
    const chaveCache = JSON.stringify({ t: tribunal, f: filtros, p: pagina });
    const agora = Date.now();
    const emCache = CACHE_JURIMETRIA.get(chaveCache);
    if (emCache && agora - emCache.em < TTL_CACHE_MS) {
      return NextResponse.json({ ...(emCache.resposta as Record<string, unknown>), doCache: true });
    }

    // Duas consultas paralelas: (1) amostra+total+grau+anos, (2) agregações pesadas de ranking.
    const [dAmostra, dAggs] = await Promise.all([
      consultarDataJud(tribunal, corpoAmostra(filtros, pagina)),
      consultarDataJud(tribunal, corpoAggs(filtros)),
    ]);
    const aggs: Record<string, unknown> = { ...(dAmostra.aggregations ?? {}), ...(dAggs.aggregations ?? {}) };
    const total = dAmostra.hits?.total?.value ?? 0;
    const totalRelacao = dAmostra.hits?.total?.relation ?? 'eq';

    const mapear = (
      campo: string,
      caminho: string[],
    ): Array<{ codigo: string; nome: string; total: number }> => {
      const lista = aggs[campo] as { buckets?: BucketComRotulo[] } | undefined;
      return (lista?.buckets ?? []).map((b) => ({
        codigo: String(b.key),
        nome: rotuloDoBucket(b, caminho) || `Código ${b.key}`,
        total: b.doc_count,
      }));
    };

    const amostra = (dAmostra.hits?.hits ?? [])
      .map((h) => {
        const s = (h._source ?? {}) as Record<string, unknown>;
        const ler = (v: unknown): string | null =>
          v && typeof v === 'object' && typeof (v as { nome?: unknown }).nome === 'string'
            ? (v as { nome: string }).nome
            : null;
        const oj = (s.orgaoJulgador ?? {}) as Record<string, unknown>;
        const data = typeof s.dataAjuizamento === 'string' ? s.dataAjuizamento : null;
        return {
          numeroProcesso: typeof s.numeroProcesso === 'string' ? s.numeroProcesso : null,
          tribunal: typeof s.tribunal === 'string' ? s.tribunal : tribunal.toUpperCase(),
          grau: typeof s.grau === 'string' ? s.grau : null,
          classe: ler(s.classe),
          orgaoJulgador: ler(s.orgaoJulgador),
          municipioIBGE: typeof oj.codigoMunicipioIBGE === 'number' ? String(oj.codigoMunicipioIBGE) : null,
          dataAjuizamento: data,
          assuntos: (Array.isArray(s.assuntos) ? s.assuntos : [])
            .map(ler)
            .filter((x): x is string => Boolean(x))
            .slice(0, 4),
          sistema: ler(s.sistema),
          atualizadoEm: typeof s['@timestamp'] === 'string' ? (s['@timestamp'] as string) : null,
        };
      })
      .filter((r) => r.numeroProcesso);

    const porAnoLista = (() => {
      const fa = aggs.por_ano as { buckets?: Record<string, { doc_count: number }> } | undefined;
      return Object.entries(fa?.buckets ?? {})
        .map((k) => ({ ano: Number(k[0].replace(/^a/, '')), total: k[1].doc_count }))
        .sort((a, b) => a.ano - b.ano);
    })();

    const respostaFinal = {
      filtros: { tribunal, municipioIBGE, varaCodigo, classeCodigo, grau, ano, pagina },
      total,
      totalRelacao,
      porVara: mapear('por_vara', ['orgaoJulgador', 'nome']),
      porClasse: mapear('por_classe', ['classe', 'nome']),
      porGrau: ((aggs.por_grau as { buckets?: Bucket[] } | undefined)?.buckets ?? []).map((b) => ({
        grau: String(b.key),
        total: b.doc_count,
      })),
      porAssunto: ((aggs.por_assunto as { buckets?: Bucket[] } | undefined)?.buckets ?? []).map((b) => ({
        assunto: String(b.key),
        total: b.doc_count,
      })),
      varasUnicas: (aggs.varas_unicas as { value?: number } | undefined)?.value ?? null,
      porAno: porAnoLista,
      amostra,
      doCache: false,
      citacao: AMBITO,
    };
    if (CACHE_JURIMETRIA.size > 120) CACHE_JURIMETRIA.clear();
    CACHE_JURIMETRIA.set(chaveCache, { em: agora, resposta: respostaFinal });
    return NextResponse.json(respostaFinal);
  } catch (e) {
    return NextResponse.json(
      {
        error: `Jurimetria indisponível nesta rodada: ${e instanceof Error ? e.message : String(e)}`,
        citacao: AMBITO,
      },
      { status: 502 },
    );
  }
}
