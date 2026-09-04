// EJC — Cliente DataJud/CNJ (guia de integrações, seção 2.1 — prioridade 1).
// Metadados processuais e movimentações por número CNJ. NÃO retorna inteiro teor.
// A chave pública é a publicada pela wiki oficial do CNJ (compartilhada por design).

import { ErroIntegracao, fetchComRetry } from './base';

export const DATAJUD_BASE = 'https://api-publica.datajud.cnj.jus.br';

export const ALIAS_TRIBUNAL: Record<string, string> = {
  TJMG: 'api_publica_tjmg',
  TJSP: 'api_publica_tjsp',
  TRT3: 'api_publica_trt3',
  TRF1: 'api_publica_trf1',
  STJ: 'api_publica_stj',
  STF: 'api_publica_stf',
  TST: 'api_publica_tst',
};

export interface MovimentoDataJud {
  codigo?: number;
  nome: string;
  dataHora?: string;
  complementos?: string[];
}

export interface ProcessoDataJud {
  numeroProcesso: string;
  tribunal?: string;
  grau?: string;
  classe?: { codigo?: number; nome?: string };
  assunto?: { codigo?: number; nome?: string }[];
  orgaoJulgador?: { codigo?: number; nome?: string };
  dataAjuizamento?: string;
  dataUltimaAtualizacao?: string;
  movimentos?: MovimentoDataJud[];
}

/** Consulta um processo pelo número CNJ no alias informado (aceita "TJMG" ou "api_publica_tjmg"). */
export async function buscarProcesso(aliasEntrada: string, numeroProcesso: string): Promise<ProcessoDataJud[]> {
  const chave = await obterChave();
  const soDigitos = numeroProcesso.replace(/\D/g, '');
  if (soDigitos.length !== 20) {
    throw new ErroIntegracao('datajud', `número deve ter 20 dígitos no padrão CNJ (recebido: ${soDigitos.length})`);
  }
  // Aceita o código curto (TJMG) ou o alias completo (api_publica_tjmg).
  const alias = ALIAS_TRIBUNAL[aliasEntrada] ?? aliasEntrada;
  if (!/^api_publica_[a-z0-9]+$/.test(alias)) {
    throw new ErroIntegracao('datajud', `alias de tribunal inválido: ${aliasEntrada}`);
  }
  const res = await fetchComRetry(`${DATAJUD_BASE}/${alias}/_search`, {
    method: 'POST',
    headers: { Authorization: `APIKey ${chave}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: { match: { numeroProcesso: soDigitos } }, size: 5 }),
  });
  if (!res.ok) throw new ErroIntegracao('datajud', `HTTP ${res.status} em ${alias}`, res.status);
  const envelope = (await res.json()) as { hits?: { total?: unknown; hits?: { _source?: ProcessoDataJud }[] } };
  const fontes = envelope.hits?.hits ?? [];
  if (!Array.isArray(fontes)) {
    throw new ErroIntegracao('datajud', `resposta inesperada da API em ${alias}`);
  }
  return fontes.map((h) => h._source).filter((s): s is ProcessoDataJud => Boolean(s));
}

/** Último movimento legível (para o resumo do monitoramento). */
export function ultimoMovimento(p: ProcessoDataJud): MovimentoDataJud | null {
  const lista = p.movimentos ?? [];
  if (!lista.length) return null;
  const ordenado = [...lista].sort((a, b) => (b.dataHora ?? '').localeCompare(a.dataHora ?? ''));
  return ordenado[0] ?? null;
}

// ── Chave: env primeiro; fallback = wiki oficial do CNJ (mesmo padrão da rota
// /api/ejc/datajud, que mantém este comportamento desde o início). ──
const WIKI_ACESSO = 'https://datajud-wiki.cnj.jus.br/api-publica/acesso/';
let chaveCache: string | null = null;

function extrairChavePublica(html: string): string | null {
  const texto = html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ');
  const marcador = texto.indexOf('Authorization: APIKey');
  if (marcador < 0) return null;
  return texto.slice(marcador, marcador + 280).match(/[A-Za-z0-9_-]{40,}={0,2}/)?.[0] ?? null;
}

async function obterChave(): Promise<string> {
  if (chaveCache) return chaveCache;
  // Precedência: .env do disco → process.env → wiki do CNJ.
  // Racional: o Next congela process.env no startup — edições posteriores do
  // .env (ex.: restauração pós-reset do sandbox) não refletem no processo e
  // podem divergir; o arquivo é a fonte autoritativa deste deploy.
  try {
    const { readFileSync } = await import('node:fs');
    const { join } = await import('node:path');
    const dotEnv = readFileSync(join(process.cwd(), '.env'), 'utf8');
    const doArquivo = dotEnv.match(/^DATAJUD_API_KEY=(.+)$/m)?.[1]?.trim();
    if (doArquivo) {
      chaveCache = doArquivo;
      return doArquivo;
    }
  } catch {
    /* .env ausente/ilegível — segue para env/wiki */
  }
  const daEnv = process.env.DATAJUD_API_KEY?.trim();
  if (daEnv) {
    chaveCache = daEnv;
    return daEnv;
  }
  const res = await fetchComRetry(WIKI_ACESSO, { headers: { Accept: 'text/html' } });
  if (!res.ok) throw new ErroIntegracao('datajud', `wiki do CNJ indisponível (HTTP ${res.status}) e DATAJUD_API_KEY ausente`, res.status);
  const chave = extrairChavePublica(await res.text());
  if (!chave) throw new ErroIntegracao('datajud', 'wiki oficial não apresentou chave pública reconhecível e DATAJUD_API_KEY ausente');
  chaveCache = chave;
  return chave;
}
