import { isSafePublicMetadata } from "../server/compendium.utils";

export const AI_SUMMARY_MAX_CHARS = 720;
export const AI_SUMMARY_RATE_LIMIT = 6;
export const AI_SUMMARY_RATE_WINDOW_MS = 5 * 60 * 1_000;

export type PublicDecisionSummaryInput = {
  theme: string | null;
  tribunal: string;
  city: string | null;
  decisionType: string;
  decisionDate: Date | string | null;
  legalArea: string | null;
  outcomeOrigin: string | null;
  outcomeAppeal: string | null;
  reasoningSummary: string | null;
  sourceStatus: string;
};

export function buildPublicSummaryPayload(record: PublicDecisionSummaryInput) {
  const payload = {
    tema: record.theme ?? "Não classificado",
    tribunal: record.tribunal,
    cidade: record.city ?? "Não informada",
    tipoDeDecisao: record.decisionType,
    dataDaDecisao: record.decisionDate ? new Date(record.decisionDate).toISOString().slice(0, 10) : "Não informada",
    areaJuridica: record.legalArea ?? "Não informada",
    resultadoDeOrigem: record.outcomeOrigin ?? "Não informado",
    resultadoRecursal: record.outcomeAppeal ?? "Não informado",
    sintesePublicaJaCatalogada: record.reasoningSummary ?? "Sem resumo público disponível",
    situacaoDaFonte: record.sourceStatus,
  };
  if (!isSafePublicMetadata(payload)) throw new Error("A ficha não atende ao contrato de privacidade da síntese.");
  return payload;
}

export function isSafeAiSummary(value: unknown): value is string {
  return typeof value === "string"
    && value.trim().length >= 40
    && value.trim().length <= AI_SUMMARY_MAX_CHARS
    && isSafePublicMetadata({ summary: value });
}
