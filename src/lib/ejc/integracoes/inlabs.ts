// EJC — Cliente INLABS / Imprensa Nacional (guia de integrações, seção 2.5 — prioridade 5).
// Texto integral do Diário Oficial da União (XML/PDF por seção). Exige cadastro
// PESSOAL gratuito (credencial vinculada ao CPF/e-mail do usuário em
// https://inlabs.in.gov.br/) — o sistema nunca gera nem armazena essa credencial;
// ela entra por env (INTEGR_INLABS_USERNAME / INTEGR_INLABS_PASSWORD) e a sessão
// vive apenas em memória nesta instância. Sem credencial: estado honesto de
// "não configurado" — nada é simulado.

import { ErroIntegracao, fetchComRetry } from './base';

const BASE = 'https://inlabs.in.gov.br';

interface SessaoInlabs {
  token: string;
  expiraEm: number;
}

let sessao: SessaoInlabs | null = null;

export function inlabsConfigurado(): boolean {
  return Boolean(process.env.INTEGR_INLABS_USERNAME?.trim() && process.env.INTEGR_INLABS_PASSWORD?.trim());
}

export function statusInlabs(): { configurado: boolean; mensagem: string; portal: string } {
  return inlabsConfigurado()
    ? { configurado: true, mensagem: 'Credencial presente (env) — login efetuado sob demanda.', portal: BASE }
    : {
        configurado: false,
        mensagem:
          'INLABS exige cadastro pessoal gratuito em inlabs.in.gov.br (credencial do usuário). Configure INTEGR_INLABS_USERNAME e INTEGR_INLABS_PASSWORD no .env para ativar o monitoramento do DOU.',
        portal: BASE,
      };
}

async function logar(): Promise<string> {
  if (sessao && sessao.expiraEm > Date.now()) return sessao.token;
  const usuario = process.env.INTEGR_INLABS_USERNAME?.trim();
  const senha = process.env.INTEGR_INLABS_PASSWORD?.trim();
  if (!usuario || !senha) throw new ErroIntegracao('inlabs', 'credencial não configurada (INTEGR_INLABS_USERNAME/INTEGR_INLABS_PASSWORD)');
  const res = await fetchComRetry(`${BASE}/api/v1/authenticate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: usuario, password: senha }),
  });
  if (!res.ok) throw new ErroIntegracao('inlabs', `login recusado (HTTP ${res.status}) — confira a credencial em inlabs.in.gov.br`, res.status);
  const token = (await res.text()).replace(/"/g, '').trim();
  sessao = { token, expiraEm: Date.now() + 6 * 60 * 60 * 1000 };
  return token;
}

export interface PublicacaoDou {
  secao: string;
  titulo: string;
  pdf?: string;
  data: string;
}

/**
 * Busca no DOU (pesquisa unificada do INLABS). Campos mínimos retornados;
 * o inteiro teor não é baixado por padrão (apenas metadados + link do PDF).
 */
export async function buscarDou(termo: string, maximo = 8): Promise<PublicacaoDou[]> {
  const termoLimpo = termo.trim();
  if (termoLimpo.length < 3) throw new ErroIntegracao('inlabs', 'termo de busca muito curto (mín. 3 caracteres)');
  const token = await logar();
  const res = await fetchComRetry(`${BASE}/api/v1/pesquisar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization-Bearer': token },
    body: JSON.stringify({ q: termoLimpo, size: maximo }),
  });
  if (res.status === 401 || res.status === 403) {
    sessao = null;
    throw new ErroIntegracao('inlabs', `sessão recusada (HTTP ${res.status}) — token expirado ou credencial inválida`, res.status);
  }
  if (!res.ok) throw new ErroIntegracao('inlabs', `HTTP ${res.status}`, res.status);
  const json = (await res.json()) as {
    data?: { secao?: string; title?: string; pdf?: string; pubDate?: string; pubName?: string }[];
  };
  return (json.data ?? []).slice(0, maximo).map((p) => ({
    secao: p.secao ?? p.pubName ?? 'DOU',
    titulo: p.title ?? '(sem título)',
    pdf: p.pdf ? `${BASE}${p.pdf}` : undefined,
    data: p.pubDate ?? '',
  }));
}
