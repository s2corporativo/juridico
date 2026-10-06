import { createHash } from "node:crypto";
import { fetchStjJurisprudenceCatalog } from "./public-sources";

export type EditorialCandidate = {
  sourceKey: string;
  externalKey: string;
  kind: "jurisprudence" | "legislation" | "official_update";
  title: string;
  summary: string;
  canonicalUrl: string;
  publishedAt: Date | null;
  contentHash: string;
};

const STF_RESEARCH_URL = "https://portal.stf.jus.br/jurisprudencia/";
const PLANALTO_LEGISLATION_URL = "https://www.planalto.gov.br/ccivil_03/";

export function editorialMetadataHash(candidate: Omit<EditorialCandidate, "contentHash">) {
  return createHash("sha256").update(JSON.stringify({
    sourceKey: candidate.sourceKey,
    externalKey: candidate.externalKey,
    kind: candidate.kind,
    title: candidate.title,
    summary: candidate.summary,
    canonicalUrl: candidate.canonicalUrl,
    publishedAt: candidate.publishedAt?.toISOString() ?? null,
  })).digest("hex");
}

function candidate(input: Omit<EditorialCandidate, "contentHash">): EditorialCandidate {
  return { ...input, contentHash: editorialMetadataHash(input) };
}

export async function collectOfficialEditorialCandidates(): Promise<EditorialCandidate[]> {
  const candidates: EditorialCandidate[] = [];
  const stj = await fetchStjJurisprudenceCatalog("jurisprudencia");
  for (const entry of stj.entries) {
    candidates.push(candidate({
      sourceKey: "stj-dados-abertos",
      externalKey: `catalog:${entry.id}`,
      kind: "official_update",
      title: `STJ — ${entry.title}`.slice(0, 500),
      summary: entry.summary.slice(0, 1_000),
      canonicalUrl: entry.catalogUrl,
      publishedAt: entry.updatedAt ? new Date(entry.updatedAt) : null,
    }));
  }

  candidates.push(candidate({
    sourceKey: "stf-jurisprudencia",
    externalKey: "research-portal",
    kind: "jurisprudence",
    title: "STF — Pesquisa de Jurisprudência",
    summary: "Fonte oficial para pesquisa de jurisprudência, Informativo STF, súmulas e julgamentos de especial relevância. Revisão humana necessária antes de qualquer síntese pública.",
    canonicalUrl: STF_RESEARCH_URL,
    publishedAt: null,
  }));
  candidates.push(candidate({
    sourceKey: "planalto-legislacao",
    externalKey: "legislation-portal",
    kind: "legislation",
    title: "Planalto — Legislação Federal",
    summary: "Portal oficial de legislação federal. A existência de texto no portal não substitui a verificação humana de vigência, alteração ou consolidação.",
    canonicalUrl: PLANALTO_LEGISLATION_URL,
    publishedAt: null,
  }));
  return candidates;
}

export function sanitizeEditorialError(error: unknown) {
  const text = error instanceof Error ? error.message : "erro desconhecido";
  return text.replace(/https?:\/\/\S+/gi, "[url]").replace(/[\r\n\t]+/g, " ").slice(0, 480);
}

import { enqueueEditorialCandidates, finishEditorialRun, recordEditorialRunStart } from "./db";

export async function runEditorialUpdate() {
  const runKey = `editorial-daily-${new Date().toISOString().slice(0, 10)}`;
  const runId = await recordEditorialRunStart(runKey, 3);
  if (!runId) throw new Error("Execução editorial não pôde ser criada.");
  try {
    const candidates = await collectOfficialEditorialCandidates();
    const queuedCount = await enqueueEditorialCandidates(runId, candidates);
    await finishEditorialRun(runId, { status: "completed", discoveredCount: candidates.length, queuedCount, failedCount: 0 });
    return { runKey, status: "completed" as const, discoveredCount: candidates.length, queuedCount };
  } catch (error) {
    const errorSummary = sanitizeEditorialError(error);
    await finishEditorialRun(runId, { status: "failed", discoveredCount: 0, queuedCount: 0, failedCount: 1, errorSummary });
    throw error;
  }
}
