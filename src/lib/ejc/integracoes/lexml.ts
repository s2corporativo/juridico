// EJC — Cliente LexML Brasil (guia de integrações, seção 2.2 — prioridade 4).
// Camada de DESCUBRIMENTO de referências normativas: SRU + CQL, retorno é XML
// com metadados (URN, título, tipo, data, esfera) — remete à fonte oficial,
// não é backend de conteúdo.

import { buscarComCache, ErroIntegracao, fetchComRetry } from './base';

const BASE = 'https://www.lexml.gov.br/busca/SRU';

export interface ItemLexML {
  urn: string;
  titulo: string;
  tipoDocumento?: string;
  autoridade?: string;
  data?: string;
  url: string;
}

/** Extrai campos simples do XML SRU (recordData Dublin Core do LexML). */
function extrairItens(xml: string): ItemLexML[] {
  const itens: ItemLexML[] = [];
  const registros = xml.split(/<record>/).slice(1);
  for (const reg of registros) {
    const campo = (tag: string): string | undefined =>
      reg
        .match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'))?.[1]
        ?.replace(/<!\[CDATA\[|\]\]>/g, '')
        .replace(/<[^>]*>/g, '')
        .trim();
    const urn = campo('dc:identifier') ?? '';
    itens.push({
      urn,
      titulo: campo('dc:title') ?? '(sem título)',
      tipoDocumento: campo('lexml:tipoDocumento') ?? campo('dc:type') ?? undefined,
      autoridade: campo('dc:creator') ?? undefined,
      data: campo('dc:date') ?? undefined,
      url: urn.startsWith('urn:') ? `https://www.lexml.gov.br/urn/${urn}` : urn,
    });
  }
  return itens;
}

export async function buscarReferencias(termo: string, maximo = 10): Promise<ItemLexML[]> {
  const termoLimpo = termo.trim();
  if (termoLimpo.length < 3) throw new ErroIntegracao('lexml', 'termo de busca muito curto (mín. 3 caracteres)');
  return buscarComCache('lexml', `${termoLimpo.toLowerCase()}:${maximo}`, 12 * 60 * 60 * 1000, async () => {
    const cql = `urn any "${termoLimpo.replace(/"/g, '')}" or title any "${termoLimpo.replace(/"/g, '')}"`;
    const url = `${BASE}?operation=searchRetrieve&query=${encodeURIComponent(cql)}&maximumRecords=${maximo}&recordSchema=oitavez`;
    const res = await fetchComRetry(url, { headers: { Accept: 'application/xml' } });
    if (!res.ok) throw new ErroIntegracao('lexml', `HTTP ${res.status}`, res.status);
    const xml = await res.text();
    // Desafio anti-bot (Senado) — estado honesto, sem tentativa de burlar o controle.
    if (/Verifica[çc][ãa]o de seguran[çc]a/i.test(xml) && /Senado/i.test(xml)) {
      throw new ErroIntegracao('lexml', 'fonte sob verificação de segurança do Senado Federal, indisponível para consulta automatizada neste ambiente');
    }
    const itens = extrairItens(xml);
    if (!itens.length && /<diagnostics[\s\S]*?<message>([^<]+)/i.test(xml)) {
      throw new ErroIntegracao('lexml', `SRU reportou: ${xml.match(/<message>([^<]+)/i)?.[1]}`);
    }
    return itens;
  });
}
