/** Run explicitly after a verified backup; never runs on module import.
 * Modes: index | embed | sync. All writes stay inside JuridIA's own SQLite.
 */
import { openKnowledgeDb, ensureKnowledgeFts } from "../src/lib/knowledge-local-index";
import { embedWithLocalOllama, LOCAL_EMBED_MODEL } from "../src/lib/local-embeddings";
import { syncApprovedDiscovery } from "../src/lib/atlas-snapshot-sync";

export async function maintainKnowledge(
  dbPath: string,
  mode: "index" | "embed" | "sync",
  options: { maxEmbeddings?: number } = {},
) {
  const db = openKnowledgeDb(dbPath);
  try {
    if (mode === "index") {
      const state = ensureKnowledgeFts(db);
      return { mode, ...state };
    }
    if (mode === "sync") {
      const state = await syncApprovedDiscovery(db);
      return { mode, ...state };
    }
    const max = Math.max(1, Math.min(12, options.maxEmbeddings ?? 5));
    // Review gate: no draft, fictitious, or unverified legal source text.
    const sources = db.query("SELECT id, textoTrecho AS text FROM LegalSource " +
      "WHERE vigente=1 AND revisadoPor IS NOT NULL AND urlOficial IS NOT NULL " +
      "AND (embedding IS NULL OR embeddingModel IS NULL OR embeddingModel<>?) " +
      "ORDER BY rowid LIMIT ?").all(LOCAL_EMBED_MODEL,max) as {id:string;text:string}[];
    let processed=0;
    const updateSource = db.prepare("UPDATE LegalSource SET embedding=?,embeddingModel=?,embeddedAt=CURRENT_TIMESTAMP WHERE id=?");
    for (const row of sources) {
      const result=await embedWithLocalOllama(row.text.slice(0,3000));
      updateSource.run(JSON.stringify(result.vector),result.model,row.id);
      processed++;
    }
    if (processed < max) {
      const chunks=db.query("SELECT k.id, k.texto AS text FROM KnowledgeChunk k " +
        "JOIN KnowledgeDocument d ON d.id=k.documentId " +
        "WHERE d.status='ATIVO' AND d.vigente=1 AND d.dadosFicticios=0 " +
        "AND (k.embedding IS NULL OR k.embeddingModel IS NULL OR k.embeddingModel<>?) " +
        "ORDER BY k.rowid LIMIT ?").all(LOCAL_EMBED_MODEL,max-processed) as {id:string;text:string}[];
      const updateChunk=db.prepare("UPDATE KnowledgeChunk SET embedding=?,embeddingModel=?,embeddedAt=CURRENT_TIMESTAMP WHERE id=?");
      for(const row of chunks) {
        const result=await embedWithLocalOllama(row.text.slice(0,3000));
        updateChunk.run(JSON.stringify(result.vector),result.model,row.id);
        processed++;
      }
    }
    return { mode, processed, model: LOCAL_EMBED_MODEL };
  } finally { db.close(); }
}

if (import.meta.main) {
  const path=process.env.JURIDIA_KNOWLEDGE_DB_PATH;
  const mode=process.argv[2];
  if (process.env.JURIDIA_DB_BACKUP_VERIFIED !== "yes" || !path ||
      !["index","embed","sync"].includes(mode)) {
    console.error("Maintenance not authorized: verified backup, absolute DB path and mode required");
    process.exitCode=2;
  } else {
    try {
      const result=await maintainKnowledge(path,mode as "index"|"embed"|"sync");
      console.log(JSON.stringify(result));
    } catch {
      // Avoid exposing upstream response bodies or text from legal documents.
      console.error("KNOWLEDGE_MAINTENANCE_FAILED");
      process.exitCode=1;
    }
  }
}
