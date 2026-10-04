/**
 * Módulo do Escritório: clientes, matérias, atendimentos, comunicações e utilitários
 * de número CNJ (Resolução 65/2008, padrão NNNNNNN-DD.AAAA.J.TR.OOOO).
 */

export const CNJ_REGEX = /^\d{7}-?\d{2}\.?\d{4}\.?\d\.?\d{2}\.?\d{4}$/;

/** Remove tudo que não é dígito. */
export function apenasDigitos(valor: string | null | undefined): string {
  return (valor || "").replace(/\D/g, "");
}

/**
 * Formata 20 dígitos no padrão CNJ NNNNNNN-DD.AAAA.J.TR.OOOO.
 * Retorna a entrada original se não houver 20 dígitos.
 */
export function formatarCnj(valor: string): string {
  const d = apenasDigitos(valor);
  if (d.length !== 20) return valor;
  return `${d.slice(0, 7)}-${d.slice(7, 9)}.${d.slice(9, 13)}.${d.slice(13, 14)}.${d.slice(14, 16)}.${d.slice(16, 20)}`;
}

/** mod 97 (ISO 7064) sobre string decimal, sem BigInt. */
function mod97(numStr: string): number {
  let resto = 0;
  for (const ch of numStr) {
    resto = (resto * 10 + (ch.charCodeAt(0) - 48)) % 97;
  }
  return resto;
}

/**
 * Calcula o DV do CNJ sobre os 18 primeiros dígitos (NNNNNNN AAAA J TR OOOO):
 * compõe partial + "00", aplica mod 97 e retorna 98 - resto (2 dígitos).
 */
export function cnjCheckDigits(partial18: string): string {
  const dv = 98 - mod97(`${partial18}00`);
  return String(dv).padStart(2, "0");
}

/**
 * Valida o CNJ completo (20 dígitos): o DV (posições 8-9) deve ser igual ao
 * módulo 97 aplicado sobre NNNNNNN AAAA J TR OOOO + "00" (ISO 7064).
 */
export function cnjValido(valor: string): boolean {
  const d = apenasDigitos(valor);
  if (d.length !== 20) return false;
  const partial18 = d.slice(0, 7) + d.slice(9);
  const dd = d.slice(7, 9);
  return cnjCheckDigits(partial18) === dd;
}

/** Extrai e valida o CNJ de um texto livre; devolve formatado ou null. */
export function extractValidCnj(texto: string): string | null {
  const m = (texto || "").match(/\d{7}-?\d{2}\.?\d{4}\.?\d\.?\d{2}\.?\d{4}/);
  if (!m) return null;
  const d = apenasDigitos(m[0]);
  return cnjValido(d) ? formatarCnj(d) : null;
}

// ---------------------------------------------------------------------------
// Tipos de domínio do Escritório
// ---------------------------------------------------------------------------

export const COMUNICACAO_STATUS = ["nova", "lida", "arquivada"] as const;
export type ComunicacaoStatus = (typeof COMUNICACAO_STATUS)[number];

export const COMUNICACAO_KINDS = [
  "sentenca",
  "despacho",
  "decisao",
  "edital",
  "citacao",
  "intimacao",
  "oficio",
  "outro",
] as const;
export type ComunicacaoKind = (typeof COMUNICACAO_KINDS)[number];

/** Chave da fonte DJEN (Conector Comunica CNJ). */
export const DJEN_SOURCE_KEY = "cnj-djen-comunica";

export const TERMO_POR_FONTE: Record<string, TermoPrazo> = {
  [DJEN_SOURCE_KEY]: "dje",
};
export type TermoPrazo = "dje" | "ciencia";

/** Termo inicial do prazo conforme a origem da comunicação: DJEn (disponibilização) ou ciência. */
export function termoPrazoDaFonte(sourceKey: string | null | undefined): TermoPrazo {
  return sourceKey === DJEN_SOURCE_KEY ? "dje" : "ciencia";
}

export interface ClienteResumo {
  id: number;
  nome: string;
  documento: string | null;
  email: string | null;
  telefone: string | null;
  nota: string | null;
}

export interface MateriaResumo {
  id: number;
  clientId: number;
  titulo: string;
  cnjNumber: string | null;
  area: string | null;
  status: string;
}
