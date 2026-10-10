import { createHash } from "node:crypto";

/** One canonical source gate shared by RAG and the final Citation Gate. */
export interface ReviewedLegalSourceSnapshot {
  vigente: boolean;
  textoTrecho: string;
  urlOficial?: string | null;
  revisadoPor?: string | null;
  dataConsulta?: Date | string | null;
  hashConteudo?: string | null;
}

export function isReviewedCurrentLegalSource(
  source: ReviewedLegalSourceSnapshot, now = Date.now(),
): boolean {
  if (!source.vigente || source.textoTrecho.trim().length < 25 ||
      !/^human:[A-Za-z0-9_-]{1,128}$/.test(source.revisadoPor ?? "")) return false;
  try {
    const u = new URL(source.urlOficial ?? "");
    if (u.protocol !== "https:" || u.username || u.password || u.port ||
        !(u.hostname.endsWith(".gov.br") || u.hostname.endsWith(".jus.br"))) return false;
  } catch { return false; }

  const date = source.dataConsulta instanceof Date
    ? source.dataConsulta : source.dataConsulta ? new Date(source.dataConsulta) : null;
  const age = date ? now - date.getTime() : NaN;
  if (!Number.isFinite(age) || age < -86_400_000 || age > 30 * 86_400_000) return false;

  const hash = source.hashConteudo ?? "";
  if (!/^[a-f0-9]{64}$/i.test(hash)) return false;
  return createHash("sha256").update(source.textoTrecho).digest("hex") === hash.toLowerCase();
}
