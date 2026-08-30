// EJC — Fontes públicas oficiais para atualização diária
// PRINCÍPIO ABSOLUTO (regra do usuário): o EJC busca APENAS METADADOS das APIs públicas e
// exibe SEMPRE o link para o inteiro teor no site oficial. NADA é injetado na base RAG —
// sem contaminação do conhecimento e sem loops (feed ≠ base de conhecimento).
// Fontes indisponíveis são reportadas com status honesto (nunca inventadas).

export type StatusFonte = 'ATIVA' | 'BLOQUEADA' | 'AGUARDANDO_CHAVE' | 'ERRO';

export interface EstadoFonte {
  id: string;
  nome: string;
  tipo: 'LEGISLATIVA' | 'JURISPRUDENCIAL' | 'PROCESSUAL' | 'INSTITUCIONAL';
  urlBase: string;
  status: StatusFonte;
  detalhe: string;
  latenciaMs: number | null;
}

export interface ItemFonte {
  id: string;
  fonteId: string;
  origem: string;
  categoria: 'PROPOSICAO' | 'CONJUNTO_DADOS' | 'LEGISLACAO' | 'INSTITUCIONAL';
  titulo: string;
  ementa?: string;
  dataISO: string | null;
  url: string; // página oficial (detalhe)
  urlInteiroTeor: string; // SEMPRE presente — inteiro teor / documento oficial
}

export interface SnapshotFontes {
  atualizadoEm: string;
  proximaAtualizacao: string;
  duracaoMs: number;
  fontes: EstadoFonte[];
  itens: ItemFonte[];
  aviso?: string;
}

const TTL_MS = 6 * 60 * 60 * 1000; // 6h — com acesso diário o feed está sempre fresco
const TIMEOUT_FETCH = 9_000;

// Cache global (sobrevive a HMR) com controle de execução concorrente
const g = globalThis as unknown as {
  __ejcFontesCache?: { snapshot: SnapshotFontes; expiresAt: number };
  __ejcFontesInflight?: Promise<SnapshotFontes> | null;
};

export function politicaFontes() {
  return {
    principio:
      'Somente metadados + link direto ao inteiro teor oficial. Nada é injetado na base RAG do EJC (sem contaminação, sem loops).',
    cadencia: 'Feed renovado a cada 6 horas (e sempre que um dia novo se iniciar).',
    confiabilidade:
      'Itens do feed NÃO recebem confiabilidade A/B/C — não são conhecimento validado, apenas atualizações oficiais para leitura no site da fonte.',
    antiduplicacao:
      'A ingestão de conhecimento continua passando pelo pipeline CHECK 1-10 com pesquisa manual documentada; o feed automático nunca escreve na base.',
  };
}

function seteDiasAtrasISO(): string {
  return new Date(Date.now() - 7 * 86_400_000).toISOString().slice(0, 10);
}

// ---------- Fonte 1: Câmara dos Deputados (API v2 oficial — funciona) ----------
async function buscarCamara(): Promise<{ estado: Omit<EstadoFonte, 'urlBase'>; itens: ItemFonte[] }> {
  const inicio = Date.now();
  const base = 'https://dadosabertos.camara.leg.br/api/v2';
  try {
    const url = `${base}/proposicoes?dataInicio=${seteDiasAtrasISO()}&itens=15&ordenarPor=id&ordem=DESC`;
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const corpo = (await res.json()) as {
      dados?: Array<{
        id: number;
        siglaTipo: string;
        numero: number;
        ano: number;
        ementa?: string;
        dataApresentacao?: string;
        descricaoTipo?: string;
      }>;
    };
    const props = corpo.dados ?? [];
    // Detalhes APENAS das 6 primeiras (latência do portal varia; o restante recebe link
    // oficial da ficha de tramitação, que também contém o inteiro teor) — cache 6h.
    const detalhes = await Promise.allSettled(
      props.slice(0, 6).map(async (p) => {
        const r = await fetch(`${base}/proposicoes/${p.id}`, {
          headers: { Accept: 'application/json' },
          signal: AbortSignal.timeout(10_000),
        });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const j = (await r.json()) as { dados?: { urlInteiroTeor?: string | null } };
        return j.dados?.urlInteiroTeor ?? null;
      }),
    );
    const itens: ItemFonte[] = props.map((p, i) => {
      const inteiro = i < detalhes.length && detalhes[i].status === 'fulfilled' ? (detalhes[i] as PromiseFulfilledResult<string | null>).value : null;
      return {
        id: `camara-${p.id}`,
        fonteId: 'camara',
        origem: 'Câmara dos Deputados',
        categoria: 'PROPOSICAO',
        titulo: `${p.siglaTipo} ${p.numero}/${p.ano}`,
        ementa: p.ementa,
        dataISO: p.dataApresentacao ?? null,
        url: `https://dadosabertos.camara.leg.br/api/v2/proposicoes/${p.id}`,
        urlInteiroTeor:
          inteiro ?? `https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=${p.id}`,
      };
    });
    return {
      estado: {
        id: 'camara',
        nome: 'Câmara dos Deputados — Dados Abertos (API v2)',
        tipo: 'LEGISLATIVA',
        status: 'ATIVA',
        detalhe: `${itens.length} proposições dos últimos 7 dias, com inteiro teor oficial.`,
        latenciaMs: Date.now() - inicio,
      },
      itens,
    };
  } catch (e) {
    return {
      estado: {
        id: 'camara',
        nome: 'Câmara dos Deputados — Dados Abertos (API v2)',
        tipo: 'LEGISLATIVA',
        status: 'ERRO',
        detalhe: `Indisponível nesta consulta: ${e instanceof Error ? e.message : String(e)}`,
        latenciaMs: Date.now() - inicio,
      },
      itens: [],
    };
  }
}

// ---------- Fonte 2: STJ Dados Abertos (CKAN) ----------
async function buscarStj(): Promise<{ estado: Omit<EstadoFonte, 'urlBase'>; itens: ItemFonte[] }> {
  const inicio = Date.now();
  const url = 'https://dadosabertos.web.stj.jus.br/api/3/action/package_search?q=jurisprudencia&rows=10';
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(TIMEOUT_FETCH),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const corpo = (await res.json()) as {
      success?: boolean;
      result?: {
        count?: number;
        results?: Array<{
          name?: string;
          title?: string;
          notes?: string;
          metadata_modified?: string;
          resources?: Array<{ format?: string }>;
        }>;
      };
    };
    if (!corpo.success || !corpo.result) throw new Error('resposta sem confirmação');
    const itens: ItemFonte[] = (corpo.result.results ?? []).map((p) => ({
      id: `stj-${p.name}`,
      fonteId: 'stj',
      origem: 'STJ — Dados Abertos',
      categoria: 'CONJUNTO_DADOS',
      titulo: p.title ?? 'Conjunto sem título',
      ementa: (p.notes ?? '').replace(/<[^>]*>/g, '').slice(0, 280),
      dataISO: p.metadata_modified ?? null,
      url: p.name ? `https://dadosabertos.web.stj.jus.br/dataset/${p.name}` : 'https://dadosabertos.web.stj.jus.br/',
      urlInteiroTeor: p.name
        ? `https://dadosabertos.web.stj.jus.br/dataset/${p.name}`
        : 'https://dadosabertos.web.stj.jus.br/',
    }));
    return {
      estado: {
        id: 'stj',
        nome: 'STJ — Portal de Dados Abertos (CKAN)',
        tipo: 'JURISPRUDENCIAL',
        status: 'ATIVA',
        detalhe: `${itens.length} conjuntos de jurisprudência do catálogo aberto.`,
        latenciaMs: Date.now() - inicio,
      },
      itens,
    };
  } catch (e) {
    return {
      estado: {
        id: 'stj',
        nome: 'STJ — Portal de Dados Abertos (CKAN)',
        tipo: 'JURISPRUDENCIAL',
        status: 'BLOQUEADA',
        detalhe: `Portal respondeu bloqueio nesta consulta (${e instanceof Error ? e.message : String(e)}). Link oficial mantido para consulta manual.`,
        latenciaMs: Date.now() - inicio,
      },
      itens: [],
    };
  }
}

// ---------- Fonte 3: Senado Federal ----------
async function buscarSenado(): Promise<{ estado: Omit<EstadoFonte, 'urlBase'>; itens: ItemFonte[] }> {
  const inicio = Date.now();
  const url = 'https://legis.senado.leg.br/dados/api/materias?ano=2026&sigla=MPE&itens=10';
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(TIMEOUT_FETCH),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const corpo = (await res.json()) as {
      PesquisaBasicaMateriaLog?: {
        Materias?: {
          Materia?: Array<{
            Codigo?: string;
            Sigla?: string;
            Numero?: string;
            Ano?: string;
            Ementa?: string;
            DataApresentacao?: string;
            UrlTextosFinais?: string;
          }>;
        };
      };
    };
    const mats = corpo.PesquisaBasicaMateriaLog?.Materias?.Materia ?? [];
    const itens: ItemFonte[] = mats.map((m) => ({
      id: `senado-${m.Codigo}`,
      fonteId: 'senado',
      origem: 'Senado Federal',
      categoria: 'PROPOSICAO',
      titulo: `${m.Sigla ?? 'Materia'} ${m.Numero ?? '?'}/${m.Ano ?? '?'}`,
      ementa: m.Ementa,
      dataISO: m.DataApresentacao ?? null,
      url: m.Codigo ? `https://legis.senado.leg.br/dados/api/materia/${m.Codigo}` : 'https://legis.senado.leg.br/dados/',
      urlInteiroTeor:
        m.UrlTextosFinais ??
        (m.Codigo
          ? `https://legis.senado.leg.br/legislacao/${m.Codigo}`
          : 'https://legis.senado.leg.br/'),
    }));
    return {
      estado: {
        id: 'senado',
        nome: 'Senado Federal — Dados Abertos (SILEG)',
        tipo: 'LEGISLATIVA',
        status: itens.length ? 'ATIVA' : 'ERRO',
        detalhe: itens.length
          ? `${itens.length} matérias recuperadas.`
          : 'Resposta sem matérias nesta consulta.',
        latenciaMs: Date.now() - inicio,
      },
      itens,
    };
  } catch (e) {
    return {
      estado: {
        id: 'senado',
        nome: 'Senado Federal — Dados Abertos (SILEG)',
        tipo: 'LEGISLATIVA',
        status: 'BLOQUEADA',
        detalhe: `Bloqueio 403 observado nesta consulta (${e instanceof Error ? e.message : String(e)}). Link oficial mantido para consulta manual.`,
        latenciaMs: Date.now() - inicio,
      },
      itens: [],
    };
  }
}

// ---------- Fonte 4: DataJud/CNJ (consulta processual — precisa de chave) ----------
function estadoDataJud(): Omit<EstadoFonte, 'urlBase'> {
  const configurada = Boolean(process.env.DATAJUD_API_KEY?.trim());
  return {
    id: 'datajud',
    nome: 'CNJ — DataJud (consulta processual pública)',
    tipo: 'PROCESSUAL',
    status: configurada ? 'ATIVA' : 'AGUARDANDO_CHAVE',
    detalhe: configurada
      ? 'Chave configurada — consulta por número de processo disponível na aba Ferramentas.'
      : 'Conector pronto; aguardando chave oficial (gratuita em datajud-wiki.cnj.jus.br) via variável DATAJUD_API_KEY. Sem a chave, o EJC NÃO consulta — nada é simulado.',
    latenciaMs: null,
  };
}

// ---------- Fonte 5: Planalto — catálogo curado de inteiro teor (sempre disponível) ----------
const CATALOGO_PLANALTO: Array<{ titulo: string; url: string; nota: string }> = [
  { titulo: 'CF/88 — Constituição Federal', url: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm', nota: 'Texto consolidado oficial' },
  { titulo: 'Código Civil (Lei 10.406/2002)', url: 'https://www.planalto.gov.br/ccivil_03/leis/l10406compilada.htm', nota: 'Compilado oficial' },
  { titulo: 'CPC (Lei 13.105/2015)', url: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm', nota: 'Texto oficial' },
  { titulo: 'CDC (Lei 8.078/1990)', url: 'https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm', nota: 'Compilado oficial' },
  { titulo: 'CTN (DL 5.172/1966)', url: 'https://www.planalto.gov.br/ccivil_03/leis/l5172compilado.htm', nota: 'Compilado oficial' },
  { titulo: 'Código Penal (DL 2.848/1940)', url: 'https://www.planalto.gov.br/ccivil_03/decreto-lei/del2848compilado.htm', nota: 'Compilado oficial' },
  { titulo: 'CPP (DL 3.689/1941)', url: 'https://www.planalto.gov.br/ccivil_03/decreto-lei/del3689.htm', nota: 'Texto oficial' },
  { titulo: 'CLT (DL 5.452/1943)', url: 'https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm', nota: 'Texto oficial' },
  { titulo: 'Lei 14.133/2021 (Licitações)', url: 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm', nota: 'Texto oficial' },
  { titulo: 'Lei 9.605/1998 (Ambiental)', url: 'https://www.planalto.gov.br/ccivil_03/leis/l9605.htm', nota: 'Texto oficial' },
  { titulo: 'LGPD (Lei 13.709/2018)', url: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm', nota: 'Texto oficial' },
  { titulo: 'Lei 9.099/1995 (Juizados)', url: 'https://www.planalto.gov.br/ccivil_03/leis/l9099.htm', nota: 'Texto oficial' },
  { titulo: 'Lei 12.153/2009 (JEC Fazenda)', url: 'https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2009/lei/l12153.htm', nota: 'Texto oficial — aplicável em MG' },
  { titulo: 'LC 87/1996 (Lei Kandir — ICMS)', url: 'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp87.htm', nota: 'Texto oficial' },
  { titulo: 'LC 24/1975 (Convênios ICMS)', url: 'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp24.htm', nota: 'Texto oficial' },
  { titulo: 'Legislação estadual MG (ALMG)', url: 'https://www.almg.gov.br/consultar/legislacao/', nota: 'Portal oficial ALMG — para verificação de leis estaduais (ICMS/MG, IPVA, ITCD)' },
];

function itensPlanalto(): ItemFonte[] {
  return CATALOGO_PLANALTO.map((c) => ({
    id: `planalto-${c.titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}`,
    fonteId: 'planalto',
    origem: 'Planalto — Presidência da República',
    categoria: 'LEGISLACAO' as const,
    titulo: c.titulo,
    ementa: c.nota,
    dataISO: null,
    url: c.url,
    urlInteiroTeor: c.url,
  }));
}

// ---------- Orquestração ----------
async function coletar(): Promise<SnapshotFontes> {
  const inicio = Date.now();
  const [camara, stj, senado] = await Promise.all([
    buscarCamara(),
    buscarStj(),
    buscarSenado(),
  ]);
  const dataJud = estadoDataJud();

  const fontes: EstadoFonte[] = [
    { urlBase: 'https://dadosabertos.camara.leg.br/', ...camara.estado },
    { urlBase: 'https://dadosabertos.web.stj.jus.br/', ...stj.estado },
    { urlBase: 'https://legis.senado.leg.br/dados/', ...senado.estado },
    { urlBase: 'https://datajud-wiki.cnj.jus.br/', ...dataJud },
    {
      id: 'planalto',
      nome: 'Planalto — Presidência da República (catálogo curado)',
      tipo: 'LEGISLATIVA',
      urlBase: 'https://www.planalto.gov.br/',
      status: 'ATIVA',
      detalhe: `${CATALOGO_PLANALTO.length} links diretos ao texto oficial compilado.`,
      latenciaMs: 0,
    },
  ];

  const itens = [...camara.itens, ...senado.itens, ...stj.itens, ...itensPlanalto()].sort((a, b) => {
    if (a.dataISO && b.dataISO) return b.dataISO.localeCompare(a.dataISO);
    if (a.dataISO) return -1;
    if (b.dataISO) return 1;
    return a.origem.localeCompare(b.origem);
  });

  const agora = new Date();
  return {
    atualizadoEm: agora.toISOString(),
    proximaAtualizacao: new Date(agora.getTime() + TTL_MS).toISOString(),
    duracaoMs: Date.now() - inicio,
    fontes,
    itens,
    aviso:
      senado.estado.status === 'BLOQUEADA' && stj.estado.status === 'BLOQUEADA'
        ? 'Senado e STJ estão sob bloqueio de rede nesta consulta (403) — os links oficiais permanecem disponíveis para consulta manual. O EJC não inventa conteúdo não confirmado.'
        : undefined,
  };
}

async function renovar(): Promise<SnapshotFontes> {
  if (g.__ejcFontesInflight) return g.__ejcFontesInflight;
  g.__ejcFontesInflight = coletar()
    .then((snap) => {
      g.__ejcFontesCache = { snapshot: snap, expiresAt: Date.now() + TTL_MS };
      return snap;
    })
    .finally(() => {
      g.__ejcFontesInflight = null;
    });
  return g.__ejcFontesInflight;
}

export async function obterSnapshot(opcoes?: { forcar?: boolean }): Promise<SnapshotFontes> {
  const cache = g.__ejcFontesCache;
  const expirado = !cache || cache.expiresAt <= Date.now();
  // Renovação "diária garantida": se o snapshot é de outro dia (mesmo com TTL não vencido), renova em background
  const outroDia = cache ? new Date(cache.snapshot.atualizadoEm).toDateString() !== new Date().toDateString() : true;

  if (cache && !expirado && !outroDia && !opcoes?.forcar) return cache.snapshot;
  if (opcoes?.forcar || !cache) return renovar();

  // stale-while-revalidate: devolve o cache e renova em background
  void renovar().catch(() => undefined);
  return {
    ...cache.snapshot,
    aviso: `${cache.snapshot.aviso ?? ''}Renovação em andamento: exibindo snapshot de ${new Date(cache.snapshot.atualizadoEm).toLocaleString('pt-BR')}.`.trim(),
  };
}

export { TTL_MS as TTL_FONTES_MS };
