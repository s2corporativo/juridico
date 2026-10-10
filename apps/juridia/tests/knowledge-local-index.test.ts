import { test, expect } from "bun:test";
import { Database } from "bun:sqlite";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ensureKnowledgeFts, safeFtsQuery, searchKnowledgeBm25, openKnowledgeDb } from "../src/lib/knowledge-local-index";

test("FTS5 indexes EXISTING knowledge and filters unapproved/fictitious material", () => {
  const dir = mkdtempSync(join(tmpdir(), "juridia-fts-audit-"));
  const path = join(dir, "test.db");
  const db = new Database(path, {create: true});
  try {
    db.exec("CREATE TABLE LegalSource(id TEXT PRIMARY KEY,diploma TEXT,numero TEXT,textoTrecho TEXT,urlOficial TEXT,vigente INTEGER,revisadoPor TEXT)");
    db.exec("CREATE TABLE KnowledgeDocument(id TEXT PRIMARY KEY,status TEXT,vigente INTEGER,dadosFicticios INTEGER,urlFonte TEXT)");
    db.exec("CREATE TABLE KnowledgeChunk(id TEXT PRIMARY KEY,documentId TEXT,contexto TEXT,texto TEXT)");
    db.exec("INSERT INTO LegalSource VALUES('L1','CDC','art. 18','responsabilidade solidaria defeito do produto','https://www.planalto.gov.br/',1,'human:lawyer-1')");
    db.exec("INSERT INTO KnowledgeDocument VALUES('D1','ATIVO',1,0,'https://www.stj.jus.br/')");
    db.exec("INSERT INTO KnowledgeDocument VALUES('D2','ATIVO',1,1,NULL)");
    db.exec("INSERT INTO KnowledgeChunk VALUES('C1','D1','STJ','prazo processual de consumidor')");
    db.exec("INSERT INTO KnowledgeChunk VALUES('C2','D2','ficticio','prazo processual ficticio')");
    const first = ensureKnowledgeFts(db);
    expect(first).toEqual({indexed: 3, rebuilt: true});
    expect(ensureKnowledgeFts(db)).toEqual({indexed: 3, rebuilt: false});
    const cases = searchKnowledgeBm25(db, "responsabilidade defeito", 5);
    expect(cases).toHaveLength(1);
    expect(cases[0].entityKind).toBe("legal_source");
    expect(cases[0].citable).toBe(true);
    const chunks = searchKnowledgeBm25(db, "prazo processual", 5);
    expect(chunks.map(r => r.id)).toEqual(["C1"]);
    expect(chunks[0].citable).toBe(false);
    const onlyLaw = searchKnowledgeBm25(db, "prazo processual", 5, "legal_source");
    expect(onlyLaw.every(h => h.entityKind === "legal_source")).toBe(true);
    expect(searchKnowledgeBm25(db, "inexiste assunto xyzqwertysemfato", 5)).toHaveLength(0);
    db.exec("UPDATE LegalSource SET revisadoPor='atlas-curadoria' WHERE id='L1'");
    expect(searchKnowledgeBm25(db, "responsabilidade defeito", 5)
      .find(h => h.id === "L1")?.citable).toBe(false);
    db.exec("UPDATE LegalSource SET revisadoPor='human:lawyer-1' WHERE id='L1'");

    db.exec("UPDATE KnowledgeChunk SET texto='prazo legal prorrogado' WHERE id='C1'");
    expect(searchKnowledgeBm25(db, "prorrogado")[0]?.id).toBe("C1");
    db.exec("DELETE FROM KnowledgeChunk WHERE id='C1'");
    expect(searchKnowledgeBm25(db, "prorrogado")).toHaveLength(0);
    expect(safeFtsQuery("x OR y DROP TABLE;\"")).not.toContain("DROP TABLE");
    db.close();
    const reopened = openKnowledgeDb(path, true);
    expect(searchKnowledgeBm25(reopened, "defeito")[0]?.id).toBe("L1");
    reopened.close();
  } finally {
    try {db.close()} catch{}
    rmSync(dir,{recursive:true,force:true});
  }
});

test("Sqlite path must be explicit, no accidental production creation", () => {
  expect(() => openKnowledgeDb("juridia.db")).toThrow("JURIDIA_SQLITE_PATH_REQUIRED");
});
