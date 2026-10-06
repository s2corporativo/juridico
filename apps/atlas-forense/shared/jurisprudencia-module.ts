/**
 * Módulo do conector de Jurisprudência (fontes públicas sem credencial):
 * - LexML (SRU/SearchRetrieve, XML) — parser tolerante com rejeição explícita de
 *   payload não-SRU (challenge anti-bot nunca conta como sucesso vazio).
 * - STJ Dados Abertos (CKAN package_search) — normalizador do catálogo.
 * - Registro manual TJMG — validação auditável.
 */

import { apenasDigitos, cnjValido, extractValidCnj, formatarCnj } from "./office-module";
import { sanitizeDjenHtml } from "./djen-module";

export const JURIS_PROVIDER_KEYS = ["stj-dados-abertos", "lexml-sru"] as const;
export type JurisProviderKey = (typeof JURIS_PROVIDER_KEYS)[number];

export const JURIS_STATUS = ["nova", "destacada", "aplicada", "descartada"] as const;
export type JurisStatus = (typeof JURIS_STATUS)[number];

export const JURIS_SOURCE_KEYS: Record<JurisProviderKey, string> = {
  "stj-dados-abertos": "stj-dados-abertos",
  "lexml-sru": "lexml-sru",
};

export interface JurisItem {
  externalId: string;
  provider: JurisProviderKey;
  tribunal: string;
  orgao: string | null;
  cnjNumber: string | null;
  ementa: string;
  url: string | null;
  dataJulgamento: string | null;
}

export interface JurisIngestionStats {
  recebidos: number;
  novos: number;
  duplicados: number;
  invalidos: number;
}

export class LexmlRespostaNaoSruError extends Error {
  constructor(mensagem = "LEXML_RESPOSTA_NAO_SRU") {
    super(mensagem);
    this.name = "LexmlRespostaNaoSruError";
  }
}

function decodeXmlEntities(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

function tagContent(xml: string, tag: string): string | null {
  // Busca tolerante: prefixo de namespace opcional (zs:, dc:, etc.) e CDATA/entidades.
  const re = new RegExp(`<[^>]*:?${tag}\\b[^>]*>([\\s\\S]*?)</[^>]*:?${tag}\\s*>`, "i");
  const m = xml.match(re);
  if (!m) return null;
  const cru = m[1];
  const cdata = cru.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  const conteudo = cdata ? cdata[1] : cru;
  return decodeXmlEntities(conteudo).trim();
}

/**
 * Extrai a URN LexML de um campo identifier: aceita URN crua
 * ("urn:lex:br:federal:acordao:...") ou URL de resolução que a embute.
 */
export function extrairUrn(valor: string | null | undefined): string | null {
  if (!valor) return null;
  const m = valor.match(/urn:lex:[^\s"'<>]+/i);
  return m ? m[0] : null;
}

/**
 * Parser SRU tolerante. Rejeita explicitamente payload que não seja SearchRetrieve
 * (HTML de challenge anti-bot, JSON, vazio) — nunca retorna sucesso vazio.
 */
export function parseSruResponse(xml: string, maxItens = 20): JurisItem[] {
  const corpo = xml || "";
  if (!/<[\w-]*:?(searchRetrieveResponse|searchRetrieveResponse)/i.test(corpo)) {
    throw new LexmlRespostaNaoSruError(
      "Resposta não é SRU/SearchRetrieve (challenge anti-bot ou payload desconhecido)."
    );
  }
  const registros = corpo.split(/<(?:[\w-]*:)?record\b/i).slice(1);
  const itens: JurisItem[] = [];
  for (const bruto of registros) {
    if (itens.length >= maxItens) break;
    const identifier =
      tagContent(bruto, "identifier") ||
      tagContent(bruto, "recordIdentifier") ||
      tagContent(bruto, "recordId");
    const urn = extrairUrn(identifier);
    if (!urn) continue;
    const titulo = tagContent(bruto, "title") || "";
    const descricao = tagContent(bruto, "description") || "";
    const data = tagContent(bruto, "date") || tagContent(bruto, "datePublicacao") || null;
    const urlMatch = (identifier || "").match(/https?:\/\/[^\s"'<>]+/i);
    itens.push({
      externalId: urn.slice(0, 191),
      provider: "lexml-sru",
      tribunal: "LexML",
      orgao: null,
      cnjNumber: extractValidCnj(`${titulo} ${descricao}`),
      ementa: sanitizeDjenHtml(`${titulo}${descricao ? ` — ${descricao}` : ""}`, 2000),
      url: urlMatch ? urlMatch[0] : null,
      dataJulgamento: data ? data.slice(0, 10) : null,
    });
  }
  return itens;
}

export interface CkanPackage {
  id?: string;
  name?: string;
  title?: string;
  notes?: string;
  url?: string;
  metadata_modified?: string;
  organization?: { title?: string };
}

/** Normaliza resultados CKAN (package_search) do portal de Dados Abertos do STJ. */
export function normalizeCkanResult(pkgs: CkanPackage[], maxItens = 20): JurisItem[] {
  const itens: JurisItem[] = [];
  for (const p of pkgs || []) {
    if (itens.length >= maxItens) break;
    const externalId = (p.id || p.name || "").trim();
    if (!externalId) continue;
    const texto = `${p.title || ""} ${p.notes || ""}`;
    itens.push({
      externalId: externalId.slice(0, 191),
      provider: "stj-dados-abertos",
      tribunal: p.organization?.title || "STJ",
      orgao: null,
      cnjNumber: extractValidCnj(texto),
      ementa: sanitizeDjenHtml(p.notes || p.title || "", 2000),
      url: p.url || null,
      dataJulgamento: p.metadata_modified ? p.metadata_modified.slice(0, 10) : null,
    });
  }
  return itens;
}

/** Plano determinístico de ingestão de jurisprudência (dedupe por externalId). */
export function planJurisprudenciaIngestion(
  itens: JurisItem[],
  existentes: Set<string>
): { itens: JurisItem[]; stats: JurisIngestionStats } {
  const stats: JurisIngestionStats = {
    recebidos: itens.length,
    novos: 0,
    duplicados: 0,
    invalidos: 0,
  };
  const vistos = new Set<string>();
  const plano: JurisItem[] = [];
  for (const it of itens) {
    const id = (it.externalId || "").trim();
    if (!id) {
      stats.invalidos += 1;
      continue;
    }
    if (existentes.has(id) || vistos.has(id)) {
      stats.duplicados += 1;
      continue;
    }
    vistos.add(id);
    plano.push(it);
    stats.novos += 1;
  }
  return { itens: plano, stats };
}

/** Monta URL SRU do LexML com consulta CQL (endpoint configurável). */
export function buildLexmlSearchUrl(endpoint: string, query: string, maxItems: number): string {
  const base = (endpoint || "http://lexml.gov.br/busca/sru").trim();
  const cql = `(any all "${query.replace(/"/g, " ")}")`;
  const url = new URL(base);
  url.searchParams.set("operation", "searchRetrieve");
  url.searchParams.set("version", "1.2");
  url.searchParams.set("query", cql);
  url.searchParams.set("maximumRecords", String(Math.max(1, Math.min(50, maxItems))));
  url.searchParams.set("startRecord", "1");
  url.searchParams.set("recordSchema", "oai_dc");
  return url.toString();
}

/** URL da action CKAN do STJ. */
export function buildStjCkanUrl(query: string, maxItems: number): string {
  const url = new URL("https://dadosabertos.stj.jus.br/api/3/action/package_search");
  url.searchParams.set("q", query);
  url.searchParams.set("rows", String(Math.max(1, Math.min(50, maxItems))));
  return url.toString();
}

export interface JurisManualInput {
  externalId: string;
  tribunal: string;
  orgao?: string | null;
  cnjNumber?: string | null;
  ementa: string;
  url?: string | null;
  dataJulgamento?: string | null;
}

/** Valida entrada manual (registro TJMG auditável). Lança erro com mensagem amigável. */
export function validateJurisManualInput(input: Partial<JurisManualInput>): JurisManualInput {
  const externalId = (input.externalId || "").trim();
  if (externalId.length < 3 || externalId.length > 191) {
    throw new Error("Identificador externo deve ter entre 3 e 191 caracteres.");
  }
  const tribunal = (input.tribunal || "").trim();
  if (!tribunal || tribunal.length > 64) {
    throw new Error("Informe o tribunal (máx. 64 caracteres).");
  }
  const ementa = sanitizeDjenHtml(input.ementa || "", 2000);
  if (ementa.trim().length < 10) {
    throw new Error("Ementa/julgamento deve ter pelo menos 10 caracteres após sanitização.");
  }
  let cnjNumber: string | null = null;
  if (input.cnjNumber && input.cnjNumber.trim()) {
    const d = apenasDigitos(input.cnjNumber);
    if (d.length !== 20 || !cnjValido(d)) {
      throw new Error("Número CNJ inválido: o dígito verificador não confere (Resolução 65/2008).");
    }
    cnjNumber = formatarCnj(d);
  }
  const url = (input.url || "").trim() || null;
  if (url && !/^https?:\/\//i.test(url)) {
    throw new Error("URL deve começar com http:// ou https://.");
  }
  return {
    externalId,
    tribunal,
    orgao: (input.orgao || "").trim() || null,
    cnjNumber,
    ementa,
    url,
    dataJulgamento: (input.dataJulgamento || "").trim() || null,
  };
}
