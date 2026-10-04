/**
 * Módulo do Conector DJEN (Comunica CNJ): tipos da API pública, sanitização LGPD
 * e plano determinístico de ingestão com dedupe por idComunicacao.
 */

import { apenasDigitos, cnjValido, formatarCnj } from "./office-module";

export interface ComunicaItem {
  idComunicacao: string;
  numeroProcesso: string | null;
  tribunal: string | null;
  orgao: string | null;
  tipoComunicacao: string | null;
  meio: string | null;
  dataDisponibilizacao: string | null;
  texto: string | null;
  link: string | null;
}

export interface DjenIngestionPlanItem {
  item: ComunicaItem;
  cnjNumber: string | null;
  kind: string;
  title: string;
  sourceKey: string;
  content: string;
  receivedAt: Date | null;
  deadlineDays: number;
}

export interface DjenIngestionStats {
  recebidas: number;
  novas: number;
  duplicadas: number;
  invalidas: number;
}

export const DJEN_SOURCE_KEY = "cnj-djen-comunica";

/** Mascara e-mails preservando o domínio (LGPD). */
export function mascararEmails(texto: string): string {
  return texto.replace(/([A-Za-z0-9._%+-])[A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+/g, "$1***@***");
}

/** Mascara CPF/CNPJ (11 ou 14 dígitos com ou sem pontuação) preservando finais (LGPD). */
export function mascararDocumentoFiscal(texto: string): string {
  return texto
    .replace(/\b\d{3}\.?\d{3}\.?\d{3}[- ]?\d{2}\b/g, (m) => `***.***.***-${m.slice(-2)}`)
    .replace(/\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g, (m) => `**.***.***/****-${m.slice(-2)}`);
}

/** Sanitiza texto de comunicação: HTML off, entidades decodificadas, LGPD e tamanho limitado. */
export function sanitizeDjenHtml(html: string, maxLen = 4000): string {
  let t = html || "";
  t = t.replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n\n");
  t = t.replace(/<[^>]+>/g, " ");
  t = t
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
  t = mascararDocumentoFiscal(mascararEmails(t));
  t = t.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
  return t.slice(0, maxLen);
}

export function classificarTipoComunicacao(tipo: string | null | undefined): string {
  const t = (tipo || "").toLowerCase();
  if (t.includes("senten")) return "sentenca";
  if (t.includes("despacho")) return "despacho";
  if (t.includes("decis")) return "decisao";
  if (t.includes("edital")) return "edital";
  if (t.includes("cita")) return "citacao";
  if (t.includes("intima")) return "intimacao";
  if (t.includes("of")) return "oficio";
  return "outro";
}

/**
 * Plano determinístico de ingestão: valida CNJ quando presente, dedupe por idComunicacao
 * (lote + lista de existentes) e estatísticas auditáveis. Não grava no banco.
 */
export function planDjenIngestion(
  itens: ComunicaItem[],
  existentes: Set<string>
): { itens: DjenIngestionPlanItem[]; stats: DjenIngestionStats } {
  const stats: DjenIngestionStats = {
    recebidas: itens.length,
    novas: 0,
    duplicadas: 0,
    invalidas: 0,
  };
  const vistosNoLote = new Set<string>();
  const plano: DjenIngestionPlanItem[] = [];
  for (const item of itens) {
    const id = (item.idComunicacao || "").trim();
    if (!id) {
      stats.invalidas += 1;
      continue;
    }
    if (existentes.has(id) || vistosNoLote.has(id)) {
      stats.duplicadas += 1;
      continue;
    }
    vistosNoLote.add(id);
    let cnjNumber: string | null = null;
    if (item.numeroProcesso) {
      const d = apenasDigitos(item.numeroProcesso);
      if (d.length === 20 && cnjValido(d)) {
        cnjNumber = formatarCnj(d);
      }
    }
    const content = sanitizeDjenHtml(item.texto || "");
    plano.push({
      item,
      cnjNumber,
      kind: classificarTipoComunicacao(item.tipoComunicacao),
      title:
        (item.tipoComunicacao || "Comunicação eletrônica").trim().slice(0, 160) ||
        "Comunicação eletrônica",
      sourceKey: DJEN_SOURCE_KEY,
      content,
      receivedAt: item.dataDisponibilizacao ? new Date(`${item.dataDisponibilizacao}T12:00:00`) : null,
      deadlineDays: 15,
    });
    stats.novas += 1;
  }
  return { itens: plano, stats };
}

/** Janela de consulta DJEN (data de disponibilização), em dias corridos retroativos. */
export function janelaDjen(diasJanela: number, agora = new Date()): { inicio: string; fim: string } {
  const fmt = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };
  const fim = new Date(agora.getTime());
  const inicio = new Date(agora.getTime());
  inicio.setDate(inicio.getDate() - Math.max(1, Math.min(90, diasJanela)));
  return { inicio: fmt(inicio), fim: fmt(fim) };
}
