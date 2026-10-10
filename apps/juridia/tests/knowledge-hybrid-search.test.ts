import { test, expect } from "bun:test";
import { Database } from "bun:sqlite";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ensureKnowledgeFts } from "../src/lib/knowledge-local-index";
import { hybridKnowledgeSearch } from "../src/lib/knowledge-hybrid-search";

test("hybrid search uses local embeddings and preserves BM25 on provider failure", async () => {
  const folder=mkdtempSync(join(tmpdir(),"juridia-hybrid-"));
  const db=new Database(join(folder,"test.db"),{create:true});
  try {
    db.exec("CREATE TABLE LegalSource(id TEXT PRIMARY KEY,diploma TEXT,numero TEXT,textoTrecho TEXT,urlOficial TEXT,vigente INTEGER,revisadoPor TEXT,embedding TEXT,embeddingModel TEXT)");
    db.exec("CREATE TABLE KnowledgeDocument(id TEXT PRIMARY KEY,status TEXT,vigente INTEGER,dadosFicticios INTEGER,urlFonte TEXT)");
    db.exec("CREATE TABLE KnowledgeChunk(id TEXT PRIMARY KEY,documentId TEXT,contexto TEXT,texto TEXT,embedding TEXT,embeddingModel TEXT)");
    const vec = Array(768).fill(0);vec[0]=1;
    db.query("INSERT INTO LegalSource VALUES(?,?,?,?,?,?,?,?,?)")
      .run("s1","CDC","18","responsabilidade solidaria consumidor","https://www.planalto.gov.br",1,"advogado",JSON.stringify(vec),"nomic-embed-text:latest");
    ensureKnowledgeFts(db);
    const fetchImpl=(async () => new Response(JSON.stringify({embeddings:[vec]}))) as unknown as typeof fetch;
    const semantic=await hybridKnowledgeSearch(db,"responsabilidade consumidor",{enabled:true,fetchImpl});
    expect(semantic.strategy).toBe("bm25_local_embedding");
    expect(semantic.hits[0].id).toBe("s1");
    const unavailable=(async()=>{throw new Error("offline")}) as unknown as typeof fetch;
    const lexical=await hybridKnowledgeSearch(db,"responsabilidade consumidor",{enabled:true,fetchImpl:unavailable});
    expect(lexical.strategy).toBe("bm25");
    expect(lexical.hits[0].id).toBe("s1");
  } finally {db.close();rmSync(folder,{recursive:true,force:true});}
});
