/**
 * JuridIA: SQLite FTS5/BM25 over EXISTING LegalSource + KnowledgeChunk rows.
 * This module does not create a second knowledge corpus and never touches Atlas DB.
 * Initialization is additive; original tables remain untouched.
 */
import { Database } from "bun:sqlite";

export type LocalHit = {
  entityKind: "legal_source" | "knowledge_chunk";
  id: string;
  title: string;
  snippet: string;
  documentId: string | null;
  url: string | null;
  bm25: number;
  citable: boolean; // false for unpublished chunks
};
const FTS = "JuridIAKnowledgeFTS";

export function openKnowledgeDb(dbPath: string, readonly = false): Database {
  if (!dbPath || !dbPath.startsWith("/") || !dbPath.endsWith(".db")) {
    throw new Error("JURIDIA_SQLITE_PATH_REQUIRED");
  }
  const db = new Database(dbPath, { readonly, create: false });
  db.exec("PRAGMA busy_timeout=4000");
  db.exec("PRAGMA foreign_keys=ON");
  return db;
}

function assertKnowledgeTables(db: Database) {
  const existing = new Set(db.query("SELECT name FROM sqlite_master WHERE type='table'").all()
    .map(r => String((r as { name: string }).name)));
  if (!existing.has("LegalSource") || !existing.has("KnowledgeChunk") || !existing.has("KnowledgeDocument")) {
    throw new Error("JURIDIA_EXISTING_KNOWLEDGE_SCHEMA_MISSING");
  }
}

function addInitialIndex(db: Database): void {
  db.exec("DELETE FROM " + FTS);
  db.exec("INSERT INTO " + FTS + "(rowid,entityKind,entityId,title,body) " +
    "SELECT rowid*2,'legal_source',id,diploma || ' ' || numero,textoTrecho FROM LegalSource WHERE vigente=1");
  db.exec("INSERT INTO " + FTS + "(rowid,entityKind,entityId,title,body) " +
    "SELECT rowid*2+1,'knowledge_chunk',id,contexto,texto FROM KnowledgeChunk");
}

/** Additive on the existing database. Never reset it, never change its Prisma tables.
 * Backfills at most once unless integrity counters detect a mismatch.
 */
export function ensureKnowledgeFts(db: Database): { indexed: number; rebuilt: boolean } {
  assertKnowledgeTables(db);
  db.exec("BEGIN IMMEDIATE");
  try {
    db.exec("CREATE VIRTUAL TABLE IF NOT EXISTS " + FTS +
      " USING fts5(entityKind UNINDEXED,entityId UNINDEXED,title,body,tokenize='unicode61 remove_diacritics 2')");
    db.exec("CREATE TRIGGER IF NOT EXISTS JuridiaLegalSourceFtsIns AFTER INSERT ON LegalSource WHEN new.vigente=1 BEGIN " +
      "INSERT INTO " + FTS + "(rowid,entityKind,entityId,title,body) VALUES(new.rowid*2,'legal_source',new.id,new.diploma || ' ' || new.numero,new.textoTrecho); END");
    db.exec("CREATE TRIGGER IF NOT EXISTS JuridiaLegalSourceFtsUpd AFTER UPDATE ON LegalSource BEGIN " +
      "DELETE FROM " + FTS + " WHERE rowid=old.rowid*2; " +
      "INSERT INTO " + FTS + "(rowid,entityKind,entityId,title,body) " +
      "SELECT new.rowid*2,'legal_source',new.id,new.diploma || ' ' || new.numero,new.textoTrecho WHERE new.vigente=1; END");
    db.exec("CREATE TRIGGER IF NOT EXISTS JuridiaLegalSourceFtsDel AFTER DELETE ON LegalSource BEGIN " +
      "DELETE FROM " + FTS + " WHERE rowid=old.rowid*2; END");
    db.exec("CREATE TRIGGER IF NOT EXISTS JuridiaKnowledgeChunkFtsIns AFTER INSERT ON KnowledgeChunk BEGIN " +
      "INSERT INTO " + FTS + "(rowid,entityKind,entityId,title,body) VALUES(new.rowid*2+1,'knowledge_chunk',new.id,new.contexto,new.texto); END");
    db.exec("CREATE TRIGGER IF NOT EXISTS JuridiaKnowledgeChunkFtsUpd AFTER UPDATE ON KnowledgeChunk BEGIN " +
      "DELETE FROM " + FTS + " WHERE rowid=old.rowid*2+1; " +
      "INSERT INTO " + FTS + "(rowid,entityKind,entityId,title,body) VALUES(new.rowid*2+1,'knowledge_chunk',new.id,new.contexto,new.texto); END");
    db.exec("CREATE TRIGGER IF NOT EXISTS JuridiaKnowledgeChunkFtsDel AFTER DELETE ON KnowledgeChunk BEGIN " +
      "DELETE FROM " + FTS + " WHERE rowid=old.rowid*2+1; END");
    const indexed = Number((db.query("SELECT count(*) as n FROM " + FTS).get() as { n: number }).n);
    const expected = Number((db.query("SELECT (SELECT count(*) FROM LegalSource WHERE vigente=1)+" +
      "(SELECT count(*) FROM KnowledgeChunk) as n").get() as { n: number }).n);
    const rebuilt = indexed !== expected;
    if (rebuilt) addInitialIndex(db);
    db.exec("COMMIT");
    return { indexed: expected, rebuilt };
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

/** Strict literal tokenization: no arbitrary FTS5 operators, no SQL interpolation. */
export function safeFtsQuery(query: string): string {
  const tokens = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .match(/[\p{L}\p{N}]{3,32}/gu) ?? [];
  const unique = Array.from(new Set(tokens)).slice(0, 10);
  return unique.map(term => '"' + term + '"*').join(" OR ");
}

export function searchKnowledgeBm25(db: Database, query: string, topK = 8): LocalHit[] {
  assertKnowledgeTables(db);
  const match = safeFtsQuery(query.slice(0, 500));
  if (!match) return [];
  const limit = Math.max(1, Math.min(50, Number.isSafeInteger(topK) ? topK : 8));
  type Row = {
    entityKind: "legal_source" | "knowledge_chunk"; entityId: string;
    title: string; snippet: string; docId: string | null; url: string | null;
    score: number; status: string | null; vigente: number | null; revisadoPor: string | null;
  };
  const sql = "SELECT f.entityKind, f.entityId, f.title, " +
    "substr(f.body,1,480) AS snippet, d.id AS docId, " +
    "COALESCE(ls.urlOficial,d.urlFonte) AS url, bm25(" + FTS + ",1.0,3.0) AS score," +
    "d.status, COALESCE(ls.vigente,d.vigente) AS vigente,ls.revisadoPor " +
    "FROM " + FTS + " f " +
    "LEFT JOIN LegalSource ls ON f.entityKind='legal_source' AND ls.id=f.entityId " +
    "LEFT JOIN KnowledgeChunk kc ON f.entityKind='knowledge_chunk' AND kc.id=f.entityId " +
    "LEFT JOIN KnowledgeDocument d ON kc.documentId=d.id " +
    "WHERE " + FTS + " MATCH ? AND " +
    "((f.entityKind='legal_source' AND ls.vigente=1) OR " +
    "(f.entityKind='knowledge_chunk' AND d.status='ATIVO' AND d.vigente=1 AND d.dadosFicticios=0)) " +
    "ORDER BY score ASC LIMIT ?";
  return (db.query(sql).all(match, limit) as Row[]).map(r => ({
    entityKind: r.entityKind, id: r.entityId, title: r.title,
    snippet: r.snippet, documentId: r.docId, url: r.url, bm25: -r.score,
    citable: r.entityKind === "legal_source" && Boolean(r.revisadoPor) && Boolean(r.url),
  }));
}
