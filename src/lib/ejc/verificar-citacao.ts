// Jurimetria DPT — Verificação de citação jurídica.
// 1) Números de processo no padrão CNJ (NNNNNNN-DD.AAAA.J.TR.OOOO.P):
//    - validação do dígito verificador (módulo 97, base 10.000 — ISO 7064);
//    - consulta AO VIVO à API Pública DataJud (runtime — NADA é persistido; LGPD);
//    - rastreabilidade: link para a página pública dos autos do tribunal competente.
// 2) Súmulas e precedentes citados no texto: localização na base curada (BM25+emb)
//    → CONFIRMADA_COM_FONTE apenas com documento verbatim e URL oficial.
// Nada é inventado: veredictos possíveis sempre explicitam o que foi (não) confirmado.
import { buildCorpus, buscarHibrido, type CorpusBM25, type DocParaRetrieval } from './bm25';
import { db } from '@/lib/db';

const BASE_DATAJUD = 'https://api-publica.datajud.cnj.jus.br';
const TRIBUNAIS_INDEX: Record<string, string> = {
  '4.01': 'TRF-1', '5.03': 'TRT-3', '8.13': 'TJMG', '1.00': 'STF', '2.00': 'STJ',
};

export interface AutosLink {
  tribunal: string;
  url: string;
  descricao: string;
}

export interface Verificacao {
  tipo: 'PROCESSO_CNJ' | 'SUMULA' | 'PRECEDENTE' | 'DESCONHECIDO';
  citacao: string;
  veredicto: 'VALIDA' | 'NUMERO_INVALIDO' | 'NAO_INDEXADO' | 'CONFIRMADA_BASE' | 'NAO_LOCALIZADA';
  detalhe: string;
  tribunal?: string;
  classe?: string;
  orgaoJulgador?: string;
  dataAjuizamento?: string;
  autos?: AutosLink;
  baseSlug?: string;
  baseTitulo?: string;
  baseUrl?: string | null;
  trecho?: string;
}

/** Valida dígito verificador do padrão CNJ (módulo 97 base 10.000). Aceita 24 (P=4) ou 25 (P=5) dígitos. */
export function validarChecksumCNJ(num: string): boolean {
  const d = num.replace(/\D/g, '');
  if (d.length !== 24 && d.length !== 25) return false;
  try {
    // substitui DD (pos. 8-9) por 00 e calcula 98 - (N mod 97)
    const parcial = d.slice(0, 7) + '00' + d.slice(9);
    const mod = BigInt(parcial) % 97n;
    const dv = 98n - mod;
    return Number(dv) === Number(d.slice(7, 9));
  } catch {
    return false;
  }
}

export function formatarCNJ(d: string): string {
  const x = d.replace(/\D/g, '');
  if (x.length === 25) return `${x.slice(0, 7)}-${x.slice(7, 9)}.${x.slice(9, 13)}.${x.slice(13, 14)}.${x.slice(14, 16)}.${x.slice(16, 20)}.${x.slice(20)}`;
  if (x.length === 24) return `${x.slice(0, 7)}-${x.slice(7, 9)}.${x.slice(9, 13)}.${x.slice(13, 14)}.${x.slice(14, 16)}.${x.slice(16, 20)}.${x.slice(20)}`;
  return d;
}

function linkAutos(j: string, tr: string): AutosLink | undefined {
  const chave = `${j}.${tr.padStart(2, '0')}`;
  if (chave === '8.13') return { tribunal: 'TJMG', url: 'https://pje-consulta-publica.tjmg.jus.br/', descricao: 'PJe — Consulta Pública TJMG (insira o número para abrir os autos)' };
  if (chave === '5.03') return { tribunal: 'TRT-3', url: 'https://pje.trt3.jus.br/consulta-processual/', descricao: 'PJe — Consulta Processual TRT-3 (Minas Gerais)' };
  if (chave === '4.01') return { tribunal: 'TRF-1', url: 'https://processo.trf1.jus.br/consultaprocessual/', descricao: 'Consulta Processual TRF-1 (Seção Judiciária de MG inclusa)' };
  return undefined;
}

async function djNumero(numero: string): Promise<{ total: number; fonte0?: { classe?: string; orgao?: string; data?: string; tribunalNome?: string } } | null> {
  const KEY = process.env.DATAJUD_API_KEY?.trim() ?? '';
  if (!KEY) return null;
  const j = numero.split('.')[2] ?? '';
  const tr = numero.split('.')[3] ?? '';
  const endpoint = j === '8' && tr === '13' ? 'api_publica_tjmg'
    : j === '5' && tr === '03' ? 'api_publica_trt3'
      : j === '4' && tr === '01' ? 'api_publica_jfmg'
        : 'api_publica_tjmg';
  const digitos = numero.replace(/\D/g, '');
  // número sem a parcela final (P) → busca por prefixo; completo → term exato
  const consulta = digitos.length >= 24
    ? { term: { 'numeroProcesso.keyword': numero } }
    : { wildcard: { 'numeroProcesso.keyword': `${numero}*` } };
  try {
    const res = await fetch(`${BASE_DATAJUD}/${endpoint}/_search`, {
      method: 'POST',
      headers: { Authorization: `APIKey ${KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ size: 1, query: consulta, _source: ['classe.nome', 'orgaoJulgador.nome', 'dataAjuizamento', 'tribunal'] }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      hits: { total: { value: number }; hits: { _source: { classe?: { nome?: string }; orgaoJulgador?: { nome?: string }; dataAjuizamento?: string; tribunal?: string } }[] };
    };
    const src = json.hits?.hits?.[0]?._source;
    return { total: json.hits?.total?.value ?? 0, fonte0: src ? { classe: src.classe?.nome, orgao: src.orgaoJulgador?.nome, data: src.dataAjuizamento, tribunalNome: src.tribunal } : undefined };
  } catch {
    return null; // degradação honesta — sem rede, sem invenção
  }
}

function extrair(texto: string): { tipo: Verificacao['tipo']; bruto: string; num?: string; tr?: string; tribunal?: string }[] {
  const achados: { tipo: Verificacao['tipo']; bruto: string; num?: string; tr?: string; tribunal?: string }[] = [];
  // CNJ: 0000000-00.0000.0.00.0000(.P) — P com 4 ou 5 dígitos (variação entre tribunais)
  const reCnj = /\d{7}-?\d{2}\.?\d{4}\.?\d\.?\d{2}\.?\d{4}(?:[-.]?\d{4,5})?/g;
  for (const m of texto.match(reCnj) ?? []) achados.push({ tipo: 'PROCESSO_CNJ', bruto: m, num: m });
  // Súmula N do STF/STJ
  const reSum = /s[úu]mula\s+n?[ºº°]?\s*(\d{1,3})\s*(?:do|da)?\s*(STF|STJ)/gi;
  for (const m of texto.matchAll(reSum)) achados.push({ tipo: 'SUMULA', bruto: m[0], num: m[1], tribunal: m[2].toUpperCase() });
  // Precedentes REsp/RE/AgRg etc. 0000000/UF
  const rePrec = /\b(REsp|RE|AgRg|AgInt|AREsp|EDcl|ED|HC|RMS|RO|RR|AIRR|ED-REsp)\s+n?[ºº°]?\s*([\d\.]{6,9})(?:\s*\/\s*([A-Z]{2}))?/g;
  for (const m of texto.matchAll(rePrec)) achados.push({ tipo: 'PRECEDENTE', bruto: m[0], num: m[2].replace(/\./g, ''), tr: m[3] });
  return achados;
}

export async function verificarCitacao(texto: string, corpus?: CorpusBM25): Promise<Verificacao[]> {
  const achados = extrair(texto);
  const resultados: Verificacao[] = [];

  for (const a of achados.slice(0, 12)) {
    if (a.tipo === 'PROCESSO_CNJ' && a.num) {
      const ok = validarChecksumCNJ(a.num);
      const formatado = formatarCNJ(a.num);
      if (!ok) {
        resultados.push({ tipo: a.tipo, citacao: formatado, veredicto: 'NUMERO_INVALIDO', detalhe: 'Dígito verificador falha no módulo 97 (ISO 7064) — número digitado incorretamente ou fictício. Corrija antes de protocolar qualquer peça.' });
        continue;
      }
      const seg = formatado.split('.');
      const j = seg[2], tr = seg[3];
      const tribunal = TRIBUNAIS_INDEX[`${j}.${tr}`] ?? `segmento ${j}/${tr}`;
      const autos = linkAutos(j, tr);
      const dj = await djNumero(formatado);
      if (dj && dj.total > 0 && dj.fonte0) {
        resultados.push({
          tipo: a.tipo, citacao: formatado, veredicto: 'VALIDA', tribunal: dj.fonte0.tribunalNome ?? tribunal,
          classe: dj.fonte0.classe, orgaoJulgador: dj.fonte0.orgao, dataAjuizamento: dj.fonte0.data,
          autos, detalhe: `Processo existente no índice oficial DataJud/CNJ (${dj.fonte0.tribunalNome ?? tribunal}). Verificado ao vivo na consulta; nenhum dado pessoal foi armazenado (verificação runtime, LGPD).`,
        });
      } else if (dj && dj.total === 0) {
        resultados.push({ tipo: a.tipo, citacao: formatado, veredicto: 'NAO_INDEXADO', tribunal, autos, detalhe: `Checksum válido, mas o número NÃO aparece no índice DataJud do tribunal consultado — pode ser sigiloso, recente ou de outra origem (ex.: STJ/STF não consultados aqui). NÃO afirme a existência do processo em peça sem conferir na página dos autos.` });
      } else {
        resultados.push({ tipo: a.tipo, citacao: formatado, veredicto: 'VALIDA', tribunal, autos, detalhe: 'Checksum válido (módulo 97). Consulta ao DataJud indisponível no momento — confirme na página oficial dos autos antes de citar.' });
      }
      continue;
    }

    if (a.tipo === 'SUMULA') {
      const c = corpus ?? (await carregarCorpus());
      const hits = buscarHibrido(c, `súmula ${a.num} ${a.tribunal} enunciado verbatim`, 6);
      const alvo = hits.find((h) => new RegExp(`sumula-${a.num}-(stf|stj)`).test(h.slug) && h.tipoDocumento === 'JURISPRUDENCIA');
      if (alvo) {
        resultados.push({
          tipo: a.tipo, citacao: `Súmula ${a.num} ${a.tribunal}`, veredicto: 'CONFIRMADA_BASE',
          baseSlug: alvo.slug, baseTitulo: alvo.titulo, baseUrl: alvo.urlFonte, trecho: alvo.chunkTexto.slice(0, 300),
          detalhe: `Enunciado localizado na base curada com fonte oficial (${alvo.urlFonte ?? '—'}) e data de consulta ${alvo.dataConsulta ?? '—'}. Use o trecho abaixo como citação literal.`,
        });
      } else {
        resultados.push({ tipo: a.tipo, citacao: `Súmula ${a.num} ${a.tribunal}`, veredicto: 'NAO_LOCALIZADA', detalhe: 'Enunciado não encontrado na base curada — confirme em fonte oficial antes de citar (não é possível afirmar que existe).' });
      }
      continue;
    }

    if (a.tipo === 'PRECEDENTE') {
      const c = corpus ?? (await carregarCorpus());
      const numFmt = a.num?.replace(/\D/g, '') ?? '';
      const hits = buscarHibrido(c, `${numFmt} ${a.tr ?? ''} acórdão relator julgado`, 6);
      const alvo = hits.find((h) => h.chunkTexto.includes(numFmt) || h.titulo.includes(numFmt));
      if (alvo) {
        resultados.push({
          tipo: a.tipo, citacao: a.bruto, veredicto: 'CONFIRMADA_BASE',
          baseSlug: alvo.slug, baseTitulo: alvo.titulo, baseUrl: alvo.urlFonte, trecho: alvo.chunkTexto.slice(0, 300),
          detalhe: `Precedente com este número citado no documento da base "${alvo.slug}" (fonte: ${alvo.urlFonte ?? '—'}). Confira o inteiro teor no portal oficial do tribunal antes do protocolo.`,
        });
      } else {
        resultados.push({
          tipo: a.tipo, citacao: a.bruto, veredicto: 'NAO_LOCALIZADA',
          detalhe: 'Número não localizado na base curada. Antes de citar: verifique o inteiro teor no portal oficial (STJ: scon.stj.jus.br · STF: portal.stf.jus.br) — o sistema NUNCA inventa dados de precedente.',
        });
      }
    }
  }
  return resultados;
}

/** Carrega e indexa a base (cache global 5 min — reutilizado pelas rotas). */
export async function carregarCorpus(): Promise<CorpusBM25> {
  const g = globalThis as unknown as { ejcCorpusHibrido?: { dados: CorpusBM25; geradoEm: number } };
  const TTL = 5 * 60 * 1000;
  if (g.ejcCorpusHibrido && Date.now() - g.ejcCorpusHibrido.geradoEm < TTL) return g.ejcCorpusHibrido.dados;
  const all = await db.knowledgeChunk.findMany({ include: { document: true } });
  const paraRetrieval: DocParaRetrieval[] = all.map((c) => ({
    documentId: c.documentId,
    slug: c.document.slug,
    titulo: c.document.titulo,
    tipoDocumento: c.document.tipoDocumento,
    area: c.document.area,
    confiabilidade: c.document.confiabilidade ?? 'B',
    status: c.document.status,
    fonte: c.document.fonte,
    urlFonte: c.document.urlFonte,
    dataConsulta: c.document.dataConsulta,
    prioridade: c.document.prioridade,
    tags: c.document.tags ? JSON.parse(c.document.tags) : [],
    chunkId: c.id,
    chunkContexto: c.contexto,
    chunkTexto: c.texto,
  }));
  const corpus = buildCorpus(paraRetrieval);
  g.ejcCorpusHibrido = { dados: corpus, geradoEm: Date.now() };
  return corpus;
}
