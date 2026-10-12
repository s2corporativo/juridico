import { createHash } from "node:crypto";

export type LegacyKnowledgeRow = {
  id: string;
  titulo: string;
  tipoDocumento: string;
  conteudo: string;
  status: string;
  dadosFicticios: number | boolean | null;
  confiabilidade: string | null;
  urlFonte: string | null;
  fonte: string | null;
};

export type ReviewCandidate = {
  legacyId: string;
  title: string;
  docType: "LEGISLACAO" | "JURISPRUDENCIA";
  documentText: string;
  sourceUrl: string;
  sourceLabel: string | null;
  sourceSha256: string;
  legacyQuality: string | null;
  legacyStatus: string;
};

export type LegacyClass =
  | "staged_pending_review"
  | "excluded_demo"
  | "excluded_non_active"
  | "excluded_non_official_kind"
  | "excluded_source_url"
  | "excluded_empty_content";

export function classifyLegacy(row: LegacyKnowledgeRow): { status: LegacyClass; candidate?: ReviewCandidate } {
  if (row.dadosFicticios === 1 || row.dadosFicticios === true || row.status === "DEMONSTRACAO")
    return { status: "excluded_demo" };
  if (row.status !== "ATIVO") return { status: "excluded_non_active" };
  if (row.tipoDocumento !== "LEGISLACAO" && row.tipoDocumento !== "JURISPRUDENCIA")
    return { status: "excluded_non_official_kind" };
  if (!row.conteudo || row.conteudo.trim().length < 10) return { status: "excluded_empty_content" };
  let sourceUrl: string;
  try {
    const url = new URL(row.urlFonte ?? "");
    // HTTPS is necessary but NOT sufficient for legal or editorial approval.
    if (url.protocol !== "https:" || url.username || url.password || !url.hostname || url.hash)
      return { status: "excluded_source_url" };
    sourceUrl = url.toString();
  } catch {
    return { status: "excluded_source_url" };
  }
  const content = row.conteudo;
  const sourceSha256 = createHash("sha256").update(JSON.stringify({
    id: row.id, kind: row.tipoDocumento, title: row.titulo, sourceUrl, content,
  })).digest("hex");
  return {
    status: "staged_pending_review",
    candidate: {
      legacyId: row.id,
      title: row.titulo.slice(0, 500),
      docType: row.tipoDocumento,
      documentText: content,
      sourceUrl,
      sourceLabel: row.fonte?.slice(0, 255) ?? null,
      sourceSha256,
      legacyQuality: row.confiabilidade,
      legacyStatus: row.status,
    },
  };
}
