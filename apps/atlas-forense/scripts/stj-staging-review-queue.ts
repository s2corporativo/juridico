/**
 * Bounded STJ CKAN staging-only editorial evidence.
 * Does NOT download jurisprudence full text or approve any candidate.
 *
 * Bun/tsx:
 *   DATABASE_URL='mysql://...@127.0.0.1:3317/atlas_stage' \
 *   EDITORIAL_STAGING_ONLY=yes bun scripts/stj-staging-review-queue.ts
 *
 * Idempotent by runKey and (sourceKey,externalKey); no production DB writes.
 */
import {
  collectStjResourceCandidates, selectUnseenCandidates,
} from "../server/public-knowledge-collectors";
import {
  claimDailyEditorialRun, enqueueEditorialCandidates,
  existingEditorialKeys, finishEditorialRun,
} from "../server/db";

export function isStagingEditorialDb(raw: string | undefined) {
  if (!raw) return false;
  try {
    const url = new URL(raw);
    return ["mysql:", "mariadb:"].includes(url.protocol) &&
      url.hostname === "127.0.0.1" && url.port === "3317" &&
      url.pathname === "/atlas_stage" && !url.search && !url.hash;
  } catch { return false; }
}
export const PROOF_RUN_KEY = "manual-staging-stj-catalog-20261010";

export async function queueStjStaging() {
  if (process.env.EDITORIAL_STAGING_ONLY !== "yes" ||
      !isStagingEditorialDb(process.env.DATABASE_URL)) {
    throw new Error("EDITORIAL_STAGING_GUARD_REQUIRED");
  }

  const discovery = await collectStjResourceCandidates({ maxPages: 1 });
  const previous = await existingEditorialKeys("stj-dados-abertos");
  const plan = selectUnseenCandidates(discovery.candidates, previous, 20);
  const runId = await claimDailyEditorialRun(PROOF_RUN_KEY, 1);
  if (!runId) return {
    runKey: PROOF_RUN_KEY, status: "already_claimed", queuedCount: 0,
  };
  try {
    const queuedCount = await enqueueEditorialCandidates(runId, plan.selected);
    // This proof is deliberately partial: STJ metadata, not jurisprudence
    // and not a DJEN ingest. Retain the backlog for later authorized batches.
    await finishEditorialRun(runId, {
      status: "partial",
      discoveredCount: discovery.discoveredResources,
      queuedCount,
      failedCount: 0,
      errorSummary: "STJ_METADATA_ONLY_DJEN_NOT_EVALUATED; PENDING_HUMAN_REVIEW; BACKLOG_" + plan.deferred,
    });
    return {
      runKey: PROOF_RUN_KEY, status: "partial", queuedCount,
      discoveredResources: discovery.discoveredResources,
      candidateCount: discovery.candidates.length,
      existing: plan.alreadyKnown, remaining: plan.deferred,
    };
  } catch (error) {
    await finishEditorialRun(runId, {
      status: "failed", discoveredCount: discovery.discoveredResources,
      queuedCount: 0, failedCount: 1, errorSummary: "STAGING_QUEUE_WRITE_FAILED",
    });
    throw error;
  }
}

if (import.meta.main) {
  queueStjStaging()
    .then(result => console.log(JSON.stringify(result)))
    .catch(error => {
      console.error("STJ_STAGING_QUEUE_FAILED", error instanceof Error ? error.message : "unknown");
      process.exitCode = 2;
    });
}
