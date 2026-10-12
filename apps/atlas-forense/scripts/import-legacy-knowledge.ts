/**
 * One-shot, fail-closed migration to Atlas' STAGING review queue.
 * Never promotes legacy records to approved/citable. No production writes.
 *
 * Preview: bun scripts/import-legacy-knowledge.ts
 * Apply (after verified backup and schema migration):
 *   ATLAS_IMPORT_STAGING=1 ... bun scripts/import-legacy-knowledge.ts --apply
 */
import { Database } from "bun:sqlite";
import mysql from "mysql2/promise";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { isAbsolute } from "node:path";
import { classifyLegacy, type LegacyKnowledgeRow, type LegacyClass, type ReviewCandidate } from "./legacy-import-policy";

type Preview = { total: number; breakdown: Record<LegacyClass, number>; candidates: ReviewCandidate[] };
const allClasses: LegacyClass[] = [
  "staged_pending_review", "excluded_demo", "excluded_non_active",
  "excluded_non_official_kind", "excluded_source_url", "excluded_empty_content",
];

function requireSourcePath(env: NodeJS.ProcessEnv): string {
  const value = env.ATLAS_LEGACY_SOURCE_DB ?? "";
  if (!isAbsolute(value) || !existsSync(value) || !statSync(value).isFile()) throw new Error("LEGACY_SOURCE_INVALID");
  return value;
}

export function collectLegacyPreview(path: string): Preview {
  const db = new Database(path, { readonly: true, create: false });
  try {
    const rows = db.query(`SELECT
      id, titulo, tipoDocumento, conteudo, status, dadosFicticios, confiabilidade, urlFonte, fonte
      FROM KnowledgeDocument ORDER BY id`).all() as LegacyKnowledgeRow[];
    const breakdown = Object.fromEntries(allClasses.map(value => [value, 0])) as Record<LegacyClass, number>;
    const candidates: ReviewCandidate[] = [];
    for (const row of rows) {
      const result = classifyLegacy(row);
      breakdown[result.status]++;
      if (result.candidate) candidates.push(result.candidate);
    }
    return { total: rows.length, breakdown, candidates };
  } finally {
    db.close();
  }
}

function assertReadyForApply(env: NodeJS.ProcessEnv) {
  if (env.ATLAS_IMPORT_STAGING !== "1") throw new Error("STAGING_GATE_DISABLED");
  const databaseUrl = new URL(env.DATABASE_URL ?? "invalid:");
  if (databaseUrl.protocol !== "mysql:" || !["127.0.0.1", "localhost"].includes(databaseUrl.hostname) ||
      databaseUrl.port !== "3317" || databaseUrl.pathname !== "/atlas_stage") {
    throw new Error("IMPORT_TARGET_MUST_BE_LOCAL_ATLAS_STAGE");
  }
  const backup = env.ATLAS_STAGING_BACKUP_PATH ?? "";
  const checksum = env.ATLAS_STAGING_BACKUP_SHA256 ?? "";
  if (!isAbsolute(backup) || !existsSync(backup) || !/^[a-f0-9]{64}$/.test(checksum)) {
    throw new Error("STAGING_BACKUP_NOT_ATTESTED");
  }
  const stat = statSync(backup);
  if (!stat.isFile() || Date.now() - stat.mtimeMs > 24 * 60 * 60 * 1000 ||
      stat.mtimeMs > Date.now() + 60_000) {
    throw new Error("STAGING_BACKUP_STALE");
  }
  const actual = createHash("sha256").update(readFileSync(backup)).digest("hex");
  if (checksum !== actual) throw new Error("STAGING_BACKUP_DIGEST_MISMATCH");
  return databaseUrl.toString();
}

async function stageCandidates(dbUrl: string, rows: ReviewCandidate[]) {
  const conn = await mysql.createConnection(dbUrl);
  const totals = { inserted: 0, changedResetToPending: 0, unchanged: 0 };
  try {
    const [table] = await conn.query<import("mysql2").RowDataPacket[]>(
      "SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema=DATABASE() AND table_name='legacy_knowledge_review'",
    );
    if (Number(table[0]?.count) !== 1) throw new Error("MIGRATION_REQUIRED");
    await conn.beginTransaction();
    try {
      for (const row of rows) {
        const [found] = await conn.query<import("mysql2").RowDataPacket[]>(
          "SELECT sourceSha256 FROM legacy_knowledge_review WHERE legacyId=? FOR UPDATE", [row.legacyId],
        );
        if (found.length === 0) {
          await conn.execute(
            "INSERT INTO legacy_knowledge_review (legacyId,docType,title,sourceUrl,sourceLabel,documentText,sourceSha256,legacyQuality,legacyStatus,reviewStatus) VALUES (?,?,?,?,?,?,?,?,?,'pending')",
            [row.legacyId,row.docType,row.title,row.sourceUrl,row.sourceLabel,row.documentText,row.sourceSha256,row.legacyQuality,row.legacyStatus],
          );
          totals.inserted++;
        } else if (found[0].sourceSha256 !== row.sourceSha256) {
          await conn.execute(
            "UPDATE legacy_knowledge_review SET docType=?,title=?,sourceUrl=?,sourceLabel=?,documentText=?,sourceSha256=?,legacyQuality=?,legacyStatus=?,reviewStatus='pending',reviewedBy=NULL,reviewedAt=NULL WHERE legacyId=?",
            [row.docType,row.title,row.sourceUrl,row.sourceLabel,row.documentText,row.sourceSha256,row.legacyQuality,row.legacyStatus,row.legacyId],
          );
          totals.changedResetToPending++;
        } else {
          totals.unchanged++;
        }
      }
      await conn.commit();
      return totals;
    } catch (error) {
      await conn.rollback();
      throw error;
    }
  } finally {
    await conn.end();
  }
}

export async function importLegacy(env: NodeJS.ProcessEnv = process.env, apply = false) {
  const preview = collectLegacyPreview(requireSourcePath(env));
  const result: Record<string, unknown> = {
    ok: true, mode: apply ? "stage_pending_review" : "dry_run",
    totalLegacyDocuments: preview.total,
    ...preview.breakdown,
  };
  if (apply) {
    const url = assertReadyForApply(env);
    result.persistence = await stageCandidates(url, preview.candidates);
  }
  // Only counts. No document content, names, database URLs or secrets in logs.
  return result;
}

if (import.meta.main) {
  try {
    console.log(JSON.stringify(await importLegacy(process.env, process.argv.includes("--apply"))));
  } catch (error) {
    console.error("ATLAS_LEGACY_IMPORT_FAILED", error instanceof Error ? error.message : "unexpected_error");
    process.exitCode = 1;
  }
}
