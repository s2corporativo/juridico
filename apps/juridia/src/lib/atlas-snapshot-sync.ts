/**
 * Atlas -> JuridIA: atomic, full, version-verified DISCOVERY snapshot.
 * The cache is NOT legal jurisprudence. It cannot feed the Citation Gate.
 * No direct read of Atlas database, no duplicate KnowledgeDocument records.
 */
import { Database } from "bun:sqlite";
import { createHash } from "node:crypto";
import {
  fetchAtlasKnowledgeSnapshot,
  type AtlasKnowledgeMetadataItem,
  type AtlasConfig,
} from "./atlas_client";

type FetchLike = typeof fetch;

function verifyItem(item: AtlasKnowledgeMetadataItem): boolean {
  if (!item || item.editorialStatus !== "approved" ||
      item.documentStatus !== "discovery_only" ||
      item.citableAsPrecedent !== false || item.text !== null ||
      !/^[a-f0-9]{64}$/.test(item.provenanceHash) ||
      !/^[0-9]{1,12}$/.test(item.atlasItemId) ||
      item.title.length > 500 || item.title.length < 1) return false;
  const origins: Record<string, string> = {
    "stj-dados-abertos": "https://dadosabertos.web.stj.jus.br",
    "cnj-djen-daily": "https://comunica.pje.jus.br",
  };
  if (!Object.prototype.hasOwnProperty.call(origins, item.sourceKey)) return false;
  try {
    const u = new URL(item.officialUrl);
    return u.origin === origins[item.sourceKey] && !u.username && !u.password && !u.hash;
  } catch {
    return false;
  }
}

function initializeCache(db: Database): void {
  db.exec("CREATE TABLE IF NOT EXISTS AtlasDiscoveryCache(" +
    "sourceKey TEXT NOT NULL, atlasItemId TEXT NOT NULL, title TEXT NOT NULL, " +
    "tribunal TEXT NOT NULL, officialUrl TEXT NOT NULL, publishedAt TEXT, " +
    "provenanceHash TEXT NOT NULL, snapshotVersion TEXT NOT NULL, " +
    "PRIMARY KEY (sourceKey, atlasItemId))");
  db.exec("CREATE TABLE IF NOT EXISTS AtlasSnapshotState(" +
    "singleton INTEGER PRIMARY KEY CHECK(singleton=1), " +
    "snapshotVersion TEXT NOT NULL, itemCount INTEGER NOT NULL, updatedAt TEXT NOT NULL)");
}

export type SnapshotSyncResult = { status: "updated" | "unchanged"; version: string; total: number };

export async function syncApprovedDiscovery(
  db: Database,
  deps: { config?: AtlasConfig | null; fetchImpl?: FetchLike } = {},
): Promise<SnapshotSyncResult> {
  // Fetch and validate the entire remote snapshot BEFORE any local DB mutations.
  const all: AtlasKnowledgeMetadataItem[] = [];
  let version: string | undefined;
  let total: number | undefined;
  let page = 0;
  let completed = false;
  while (!completed && page < 100) {
    const res = await fetchAtlasKnowledgeSnapshot(page, version, deps);
    if (!res.ok) throw new Error("ATLAS_SNAPSHOT_FETCH_FAILED_" + (res.status ?? 0));
    const data = res.data;
    if (data.page !== page || data.items.length > data.pageSize || !Number.isSafeInteger(data.total) ||
        data.total > 5_000 || (total !== undefined && data.total !== total) ||
        (version && data.snapshotVersion !== version) ||
        data.items.some(item => !verifyItem(item))) {
      throw new Error("ATLAS_SNAPSHOT_CONTRACT_INVALID");
    }
    total = data.total;
    version = data.snapshotVersion;
    all.push(...data.items);
    if (all.length > data.total) throw new Error("ATLAS_SNAPSHOT_COUNT_INVALID");
    completed = data.complete;
    page++;
  }
  if (!completed || all.length !== total || !version) throw new Error("ATLAS_SNAPSHOT_INCOMPLETE");
  const unique = new Set(all.map(item => item.sourceKey + ":" + item.atlasItemId));
  if (unique.size !== all.length) throw new Error("ATLAS_SNAPSHOT_DUPLICATE");
  const computed = "v1:" + createHash("sha256").update(JSON.stringify(all)).digest("hex");
  if (computed !== version) throw new Error("ATLAS_SNAPSHOT_DIGEST_MISMATCH");

  db.exec("BEGIN IMMEDIATE");
  try {
    initializeCache(db);
    const existing = db.query("SELECT snapshotVersion FROM AtlasSnapshotState WHERE singleton=1")
      .get() as { snapshotVersion: string } | null;
    if (existing?.snapshotVersion === version) {
      db.exec("COMMIT");
      return { status: "unchanged", version, total: all.length };
    }
    const insert = db.prepare("INSERT INTO AtlasDiscoveryCache(sourceKey,atlasItemId,title,tribunal," +
      "officialUrl,publishedAt,provenanceHash,snapshotVersion) VALUES (?,?,?,?,?,?,?,?) " +
      "ON CONFLICT(sourceKey,atlasItemId) DO UPDATE SET title=excluded.title,tribunal=excluded.tribunal," +
      "officialUrl=excluded.officialUrl,publishedAt=excluded.publishedAt," +
      "provenanceHash=excluded.provenanceHash,snapshotVersion=excluded.snapshotVersion");
    for (const item of all) {
      insert.run(item.sourceKey,item.atlasItemId,item.title,item.tribunal,
        item.officialUrl,item.publishedAt,item.provenanceHash,version);
    }
    db.query("DELETE FROM AtlasDiscoveryCache WHERE snapshotVersion <> ?").run(version);
    db.query("INSERT INTO AtlasSnapshotState(singleton,snapshotVersion,itemCount,updatedAt)" +
      " VALUES(1,?,?,?) ON CONFLICT(singleton) DO UPDATE SET " +
      "snapshotVersion=excluded.snapshotVersion,itemCount=excluded.itemCount," +
      "updatedAt=excluded.updatedAt").run(version,all.length,new Date().toISOString());
    db.exec("COMMIT");
    return { status: "updated", version, total: all.length };
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

/** Metadata-only catalogue. Not a source of case-law citations. */
export function listApprovedDiscovery(db: Database, count = 20) {
  const n = Math.max(1, Math.min(100, count));
  return db.query("SELECT sourceKey,atlasItemId,title,tribunal,officialUrl,publishedAt," +
    "provenanceHash FROM AtlasDiscoveryCache ORDER BY sourceKey,atlasItemId LIMIT ?").all(n);
}
