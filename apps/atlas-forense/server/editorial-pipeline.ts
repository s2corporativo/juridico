import { createHash } from "node:crypto";
import { fetchStjJurisprudenceCatalog } from "./public-sources";
import { collectDjenDailyCandidates, collectStjResourceCandidates, selectUnseenCandidates } from "./public-knowledge-collectors";

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

import { claimDailyEditorialRun, enqueueEditorialCandidates, existingEditorialKeys, finishEditorialRun } from "./db";

/** Bounds each remote provider. A hung source cannot hold the daily job open forever. */
export async function withinEditorialDeadline<T>(task: Promise<T>, timeoutMs = 45_000): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      task,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error("EDITORIAL_SOURCE_TIMEOUT")), timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * Daily external scheduler entrypoint. Uses existing editorial tables and review queue.
 * No collector can approve its own candidates. DataJud disabled by default.
 */
export async function runEditorialUpdate() {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
  const runKey = "editorial-daily-" + today;
  const runId = await claimDailyEditorialRun(runKey, 2);
  if (!runId) {
    return { runKey, status: "already_claimed" as const, discoveredCount: 0, queuedCount: 0 };
  }

  const candidates: EditorialCandidate[] = [];
  const failed: string[] = [];
  let truncated = false;
  try {
    try {
      const stj = await withinEditorialDeadline(collectStjResourceCandidates());
      const existing = await existingEditorialKeys("stj-dados-abertos");
      const plan = selectUnseenCandidates(stj.candidates, existing, 250);
      candidates.push(...plan.selected);
      truncated ||= stj.truncated || plan.deferred > 0;
    } catch (error) {
      failed.push("STJ:" + sanitizeEditorialError(error));
    }
    try {
      const djen = await withinEditorialDeadline(collectDjenDailyCandidates());
      candidates.push(...djen.candidates);
      truncated ||= djen.truncated;
    } catch (error) {
      failed.push("DJEN:" + sanitizeEditorialError(error));
    }
    if (failed.length === 2) {
      throw new Error("ALL_OFFICIAL_PROVIDERS_UNAVAILABLE");
    }
    const queuedCount = await enqueueEditorialCandidates(runId, candidates);
    const status = failed.length || truncated ? "partial" as const : "completed" as const;
    await finishEditorialRun(runId, {
      status, discoveredCount: candidates.length, queuedCount,
      failedCount: failed.length, errorSummary: ([...failed, ...(truncated ? ["COVERAGE_TRUNCATED_BACKLOG_PENDING"] : [])].join("; ").slice(0, 490) || undefined),
    });
    return { runKey, status, discoveredCount: candidates.length, queuedCount };
  } catch (error) {
    await finishEditorialRun(runId, {
      status: "failed", discoveredCount: candidates.length, queuedCount: 0,
      failedCount: Math.max(1, failed.length), errorSummary: sanitizeEditorialError(error),
    });
    throw error;
  }
}
