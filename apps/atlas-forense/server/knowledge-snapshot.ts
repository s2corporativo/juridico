/**
 * Atlas -> JuridIA read-only knowledge contract.
 * Full-snapshot replacement, never a direct read of the other app's database.
 *
 * This initial version deliberately exports discovery metadata only.
 * It does not export text of decisions, party identities, personal notices,
 * or treat CKAN datasets/DJEN publications as precedent.
 */
import { createHash } from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { editorialUpdateRuns, editorialUpdates } from "../drizzle/schema";
import { getDb } from "./db";

export type ApprovedKnowledgeItem = {
  atlasItemId: string;
  sourceKey: "stj-dados-abertos" | "cnj-djen-daily";
  sourceType: "official_update";
  tribunal: "STJ" | "CNJ";
  title: string;
  officialUrl: string;
  publishedAt: string | null;
  provenanceHash: string;
  editorialStatus: "approved";
  documentStatus: "discovery_only";
  citableAsPrecedent: false;
  text: null;
};

const allowed = {
  "stj-dados-abertos": { origin: "https://dadosabertos.web.stj.jus.br", tribunal: "STJ", title: "Dataset oficial STJ catalogado" },
  "cnj-djen-daily": { origin: "https://comunica.pje.jus.br", tribunal: "CNJ", title: "Metadados de publicação DJEN" },
} as const;

function safeUrl(sourceKey: string, value: string): string | null {
  const config = allowed[sourceKey as keyof typeof allowed];
  if (!config) return null;
  try {
    const url = new URL(value);
    if (url.origin !== config.origin || url.username || url.password) return null;
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

type Candidate = {
  id: number;
  sourceKey: string;
  kind: string;
  contentHash: string;
  canonicalUrl: string;
  status: string;
  publishedAt: Date | null;
  reviewedAt: Date | null;
};

export function projectApprovedKnowledge(records: Candidate[]): { snapshotVersion: string; items: ApprovedKnowledgeItem[] } {
  const items: ApprovedKnowledgeItem[] = [];
  const sorted = [...records].sort((a, b) => a.id - b.id);
  for (const record of sorted) {
    if (record.status !== "approved" || !record.reviewedAt || record.kind !== "official_update") continue;
    if (!/^[a-f0-9]{64}$/.test(record.contentHash)) continue;
    const config = allowed[record.sourceKey as keyof typeof allowed];
    const url = safeUrl(record.sourceKey, record.canonicalUrl);
    if (!config || !url) continue;
    items.push({
      atlasItemId: String(record.id),
      sourceKey: record.sourceKey as ApprovedKnowledgeItem["sourceKey"],
      sourceType: "official_update",
      tribunal: config.tribunal,
      title: config.title,
      officialUrl: url,
      publishedAt: record.publishedAt ? record.publishedAt.toISOString().slice(0, 10) : null,
      provenanceHash: record.contentHash,
      editorialStatus: "approved",
      documentStatus: "discovery_only",
      citableAsPrecedent: false,
      text: null,
    });
  }
  const digest = createHash("sha256").update(JSON.stringify(items)).digest("hex");
  return { snapshotVersion: "v1:" + digest, items };
}

export async function readApprovedKnowledgeSnapshot() {
  const db = await getDb();
  if (!db) throw new Error("KNOWLEDGE_DB_UNAVAILABLE");
  // Hard cap avoids unbounded export. Fail rather than publish incomplete snapshot.
  const records = await db.select({
    id: editorialUpdates.id,
    sourceKey: editorialUpdates.sourceKey,
    kind: editorialUpdates.kind,
    contentHash: editorialUpdates.contentHash,
    canonicalUrl: editorialUpdates.canonicalUrl,
    status: editorialUpdates.status,
    publishedAt: editorialUpdates.publishedAt,
    reviewedAt: editorialUpdates.reviewedAt,
  }).from(editorialUpdates)
    .where(eq(editorialUpdates.status, "approved"))
    .orderBy(editorialUpdates.id).limit(5001);
  if (records.length > 5000) throw new Error("KNOWLEDGE_SNAPSHOT_LIMIT");
  return projectApprovedKnowledge(records);
}

export async function readKnowledgeHealth() {
  const db = await getDb();
  if (!db) throw new Error("KNOWLEDGE_DB_UNAVAILABLE");
  const rows = await db.select({
    startedAt: editorialUpdateRuns.startedAt,
    finishedAt: editorialUpdateRuns.finishedAt,
    status: editorialUpdateRuns.status,
    discoveredCount: editorialUpdateRuns.discoveredCount,
    queuedCount: editorialUpdateRuns.queuedCount,
    failedCount: editorialUpdateRuns.failedCount,
  }).from(editorialUpdateRuns)
    .orderBy(desc(editorialUpdateRuns.startedAt)).limit(1);
  const run = rows[0];
  return {
    ok: true, contractVersion: 1,
    lastRunStatus: run?.status ?? "never",
    lastRunStartedAt: run?.startedAt?.toISOString() ?? null,
    lastRunFinishedAt: run?.finishedAt?.toISOString() ?? null,
    lastRunCounts: run ? {
      discovered: run.discoveredCount, queued: run.queuedCount, failed: run.failedCount,
    } : null,
  };
}
