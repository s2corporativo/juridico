// EJC — Cliente BrasilAPI (guia de integrações, seção 2.4 — prioridade 2).
// Sem autenticação. Uso: due diligence cadastral (CNPJ), validação de endereço
// (CEP) e feriados nacionais para cálculo de prazos.

import { buscarComCache, ErroIntegracao, fetchComRetry } from './base';

const BASE = 'https://brasilapi.com.br/api';
// BrasilAPI (endpoint CNPJ) recusa fetch sem User-Agent de navegador (HTTP 403).
const HEADERS = { Accept: 'application/json', 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 JurimetriaDPT/1.0' };

export interface CnpjInfo {
  cnpj: string;
  razao_social?: string;
  nome_fantasia?: string;
  descricao_situacao_cadastral?: string;
  data_situacao_cadastral?: string;
  cnae_fiscal_descricao?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  municipio?: string;
  uf?: string;
  cep?: string;
  ddd_telefone_1?: string;
  qsa?: { nome_socio?: string; qualificacao_socio?: string }[];
}

export interface CepInfo {
  cep: string;
  state?: string;
  city?: string;
  neighborhood?: string;
  street?: string;
}

export interface FeriadoInfo {
  date: string;
  name: string;
  type: 'national' | string;
}

export async function consultarCnpj(cnpjEntrada: string): Promise<CnpjInfo> {
  const soDigitos = cnpjEntrada.replace(/\D/g, '');
  if (soDigitos.length !== 14) throw new ErroIntegracao('brasilapi', `CNPJ deve ter 14 dígitos (recebido: ${soDigitos.length})`);
  return buscarComCache('brasilapi', `cnpj:${soDigitos}`, 24 * 60 * 60 * 1000, async () => {
    const res = await fetchComRetry(`${BASE}/cnpj/v1/${soDigitos}`, { headers: HEADERS });
    if (res.status === 404) throw new ErroIntegracao('brasilapi', 'CNPJ não encontrado na base nacional', 404);
    if (!res.ok) throw new ErroIntegracao('brasilapi', `HTTP ${res.status}`, res.status);
    return (await res.json()) as CnpjInfo;
  });
}

export async function consultarCep(cepEntrada: string): Promise<CepInfo> {
  const soDigitos = cepEntrada.replace(/\D/g, '');
  if (soDigitos.length !== 8) throw new ErroIntegracao('brasilapi', `CEP deve ter 8 dígitos (recebido: ${soDigitos.length})`);
  return buscarComCache('brasilapi', `cep:${soDigitos}`, 7 * 24 * 60 * 60 * 1000, async () => {
    const res = await fetchComRetry(`${BASE}/cep/v2/${soDigitos}`, { headers: HEADERS });
    if (res.status === 404) throw new ErroIntegracao('brasilapi', 'CEP não encontrado', 404);
    if (!res.ok) throw new ErroIntegracao('brasilapi', `HTTP ${res.status}`, res.status);
    return (await res.json()) as CepInfo;
  });
}

export async function consultarFeriados(ano: number): Promise<FeriadoInfo[]> {
  if (ano < 1900 || ano > 2200) throw new ErroIntegracao('brasilapi', `ano inválido: ${ano}`);
  return buscarComCache('brasilapi', `feriados:${ano}`, 30 * 24 * 60 * 60 * 1000, async () => {
    const res = await fetchComRetry(`${BASE}/feriados/v1/${ano}`, { headers: HEADERS });
    if (!res.ok) throw new ErroIntegracao('brasilapi', `HTTP ${res.status}`, res.status);
    return (await res.json()) as FeriadoInfo[];
  });
}
