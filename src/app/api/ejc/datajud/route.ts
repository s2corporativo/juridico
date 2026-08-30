import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Consulta processual pública via API DataJud/CNJ.
// A chave pública (gratuita) é obtida da wiki oficial OU configurada via env DATAJUD_API_KEY.
// Sem chave: erro HONESTO — nada é simulado.
const DATAJUD_BASE = 'https://api-publica.datajud.cnj.jus.br';
const WIKI_ACESSO = 'https://datajud-wiki.cnj.jus.br/api-publica/acesso/';

function extrairChavePublica(html: string): string | null {
  const texto = html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ');
  const marcador = texto.indexOf('Authorization: APIKey');
  if (marcador < 0) return null;
  return texto.slice(marcador, marcador + 280).match(/[A-Za-z0-9_-]{40,}={0,2}/)?.[0] ?? null;
}

async function obterChave(): Promise<string> {
  const daEnv = process.env.DATAJUD_API_KEY?.trim();
  if (daEnv) return daEnv;
  const res = await fetch(WIKI_ACESSO, {
    signal: AbortSignal.timeout(10_000),
    headers: { Accept: 'text/html' },
  });
  if (!res.ok) throw new Error(`wiki do DataJud indisponível (HTTP ${res.status})`);
  const chave = extrairChavePublica(await res.text());
  if (!chave) throw new Error('a wiki oficial não apresentou chave pública reconhecível nesta consulta');
  return chave;
}

export async function GET() {
  const configurada = Boolean(process.env.DATAJUD_API_KEY?.trim());
  return NextResponse.json({
    conector: 'CNJ — DataJud (API pública de metadados processuais)',
    status: configurada ? 'ATIVA' : 'AGUARDANDO_CHAVE',
    comoHabilitar: 'Obtenha a chave pública gratuita em ' + WIKI_ACESSO + ' e configure a variável de ambiente DATAJUD_API_KEY.',
    nota: 'A consulta devolve apenas metadados públicos do processo (classe, órgão, assuntos, movimentos). Nada é injetado na base de conhecimento do EJC.',
    citacao: 'Fonte: Conselho Nacional de Justiça — DataJud.',
  });
}

export async function POST(req: NextRequest) {
  try {
    const corpo = (await req.json()) as { numero?: string; tribunal?: string };
    const numero = (corpo.numero ?? '').replace(/[^0-9]/g, '');
    const tribunal = (corpo.tribunal ?? 'tjmg').toLowerCase();
    if (numero.length < 15 || numero.length > 25) {
      return NextResponse.json(
        { error: 'Informe um número de processo no padrão CNJ (15 a 25 dígitos).' },
        { status: 400 },
      );
    }
    const chave = await obterChave();
    const res = await fetch(`${DATAJUD_BASE}/api_publica_${tribunal}/_search`, {
      method: 'POST',
      headers: {
        Authorization: `APIKey ${chave}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        size: 1,
        query: { match: { numeroProcesso: numero } },
        _source: ['numeroProcesso', 'tribunal', '@timestamp', 'classe', 'assuntos', 'orgaoJulgador', 'movimentos'],
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `DataJud respondeu HTTP ${res.status} para o tribunal "${tribunal}".`, citacao: 'Fonte: Conselho Nacional de Justiça — DataJud.' },
        { status: 502 },
      );
    }
    const j = (await res.json()) as { hits?: { hits?: Array<{ _source?: Record<string, unknown> }> } };
    const src = j.hits?.hits?.[0]?._source;
    if (!src) {
      return NextResponse.json(
        { encontrado: false, mensagem: 'Processo não encontrado no acervo público do tribunal consultado.', citacao: 'Fonte: Conselho Nacional de Justiça — DataJud.' },
      );
    }
    const ler = (v: unknown): string | null =>
      v && typeof v === 'object' && typeof (v as { nome?: unknown }).nome === 'string'
        ? (v as { nome: string }).nome
        : null;
    const movs = Array.isArray(src.movimentos) ? src.movimentos : [];
    return NextResponse.json({
      encontrado: true,
      registro: {
        numeroProcesso: src.numeroProcesso ?? null,
        tribunal: src.tribunal ?? tribunal.toUpperCase(),
        atualizadoEm: src['@timestamp'] ?? null,
        classe: ler(src.classe),
        orgaoJulgador: ler(src.orgaoJulgador),
        assuntos: (Array.isArray(src.assuntos) ? src.assuntos : []).map(ler).filter(Boolean).slice(0, 12),
        movimentos: movs
          .map((m) => {
            const r = (m ?? {}) as Record<string, unknown>;
            return { data: (r.dataHora as string) ?? (r.data as string) ?? null, nome: ler(r) ?? (r.nome as string) ?? null };
          })
          .filter((m) => m.data || m.nome)
          .slice(-25),
      },
      citacao: 'Fonte: Conselho Nacional de Justiça — DataJud. Metadados públicos; sem injeção na base de conhecimento.',
    });
  } catch (e) {
    return NextResponse.json(
      {
        error: `Consulta DataJud indisponível nesta rodada: ${e instanceof Error ? e.message : String(e)}`,
        comoHabilitar: 'Configure a chave pública gratuita (datajud-wiki.cnj.jus.br) via DATAJUD_API_KEY, ou tente novamente quando a rede liberar o acesso.',
        citacao: 'Fonte: Conselho Nacional de Justiça — DataJud.',
      },
      { status: 502 },
    );
  }
}
