// EJC — Cliente Querido Diário (guia de integrações, seção 2.3 — prioridade 3).
// Diários oficiais MUNICIPAIS: trechos (excertos) com data, edição e link ao
// documento de origem. Sem autenticação; limite recomendado ~60 req/min.

import { buscarComCache, ErroIntegracao, fetchComRetry } from './base';

const BASE = 'https://api.queridodiario.ok.org.br';

/** Cidades de atuação do EJC (IBGE). */
export const CIDADES: Record<string, string> = {
  '3106200': 'Belo Horizonte/MG',
  '3121106': 'Betim/MG',
  '3119401': 'Contagem/MG',
  '3129301': 'Igarapé/MG',
};

export interface ExcertoGazette {
  data: string;
  edicao?: string;
  isExtraEdition?: boolean;
  texto: string;
  url: string;
  municipio: string;
}

export async function buscarPublicacoes(municipioIbge: string, termo: string, size = 8): Promise<ExcertoGazette[]> {
  if (!CIDADES[municipioIbge]) throw new ErroIntegracao('querido-diario', `município fora da lista de atuação: ${municipioIbge}`);
  const termoLimpo = termo.trim();
  if (termoLimpo.length < 3) throw new ErroIntegracao('querido-diario', 'termo de busca muito curto (mín. 3 caracteres)');
  return buscarComCache('querido-diario', `${municipioIbge}:${termoLimpo.toLowerCase()}`, 6 * 60 * 60 * 1000, async () => {
    const url = `${BASE}/gazettes?territory_ids=${municipioIbge}&querystring=${encodeURIComponent(termoLimpo)}&size=${size}&excerpt_size=320`;
    const res = await fetchComRetry(url, { headers: { Accept: 'application/json', 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 JurimetriaDPT/1.0' } });
    if (!res.ok) throw new ErroIntegracao('querido-diario', `HTTP ${res.status}`, res.status);
    const json = (await res.json()) as {
      gazettes?: { date: string; edition_number?: string; is_extra_edition?: boolean; excerpt_size?: number; excerpts?: string[]; file_url?: string; territory_name?: string }[];
    };
    return (json.gazettes ?? []).map((g) => ({
      data: g.date,
      edicao: g.edition_number,
      isExtraEdition: g.is_extra_edition,
      texto: (g.excerpts ?? []).join(' … ').slice(0, 640),
      url: g.file_url ?? '',
      municipio: g.territory_name ?? CIDADES[municipioIbge],
    }));
  });
}
