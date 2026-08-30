import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { getDb } from "./db";
import { auditEvents } from "../drizzle/schema";
import { knowledgeChunks, knowledgeDocuments, knowledgeRelationships, legislationLibrary, ragTests } from "../drizzle/knowledge-base.schema";
import { buildSearchIndex, searchIndex, type SearchableChunk } from "@shared/knowledge-search";
import { checkRagHealth, checkSemanticDuplicates, checkSourceConsistency, scanLgpd, summarizeAudit, type AuditSection, type CuratedAudit } from "@shared/knowledge-audit";

function dbRequired<T>(db: T | null): T {
  if (!db) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Banco de dados não configurado." });
  return db;
}

export async function existingKnowledgeSlugs(slugs: string[]) {
  const db = await getDb();
  if (!db || !slugs.length) return new Set<string>();
  const [docs, legislation] = await Promise.all([
    db.select({ slug: knowledgeDocuments.slug }).from(knowledgeDocuments).where(inArray(knowledgeDocuments.slug, slugs)),
    db.select({ slug: legislationLibrary.slug }).from(legislationLibrary).where(inArray(legislationLibrary.slug, slugs)),
  ]);
  return new Set([...docs, ...legislation].map((x) => x.slug));
}

const SENSITIVE_KEYS = /^(cpf|cnpj|nome|name|email|telefone|phone|endereco|address|parte|partes|documento|document|token|secret|password)$/i;

export type KnowledgeIngestionCandidate = {
  slug: string;
  documentType: (typeof knowledgeDocuments.$inferInsert)["documentType"];
  area: string;
  sourceStatus: (typeof knowledgeDocuments.$inferInsert)["sourceStatus"];
  officialUrl?: string;
  metadata?: Record<string, unknown>;
};

/** Dry-run — mesmo padrão de previewControlledIngestion (server/compendium.ingestion.ts): nunca grava. */
export async function previewKnowledgeIngestion(batchKey: string, candidates: KnowledgeIngestionCandidate[]) {
  const existing = await existingKnowledgeSlugs(candidates.map((c) => c.slug));
  const seen = new Set<string>();
  const items = candidates.map((candidate) => {
    const reasons: string[] = [];
    if (existing.has(candidate.slug)) reasons.push("slug já catalogado.");
    if (seen.has(candidate.slug)) reasons.push("slug duplicado no lote.");
    seen.add(candidate.slug);
    if (candidate.metadata && Object.keys(candidate.metadata).some((k) => SENSITIVE_KEYS.test(k))) reasons.push("metadata contém chave potencialmente pessoal/confidencial.");
    if (candidate.sourceStatus === "official_confirmed" && (!candidate.officialUrl || !/^https:\/\//i.test(candidate.officialUrl))) reasons.push("Fonte marcada como oficial sem URL HTTPS verificável.");
    return { slug: candidate.slug, accepted: reasons.length === 0, reasons };
  });
  return { batchKey, total: items.length, accepted: items.filter((x) => x.accepted).length, rejected: items.filter((x) => !x.accepted).length, items, warning: "Pré-validação apenas. Nenhum candidato foi gravado." };
}

/** Um chunk representativo por documento (o primeiro), mesmo critério de unicidade que searchIndex() já aplica quando há query. */
function dedupeByDocument(chunks: SearchableChunk[]): SearchableChunk[] {
  const seen = new Map<string, SearchableChunk>();
  for (const c of chunks) {
    const key = `${c.documentKind}:${c.documentId}`;
    if (!seen.has(key)) seen.set(key, c);
  }
  return [...seen.values()];
}

export type KnowledgeSearchInput = { query?: string; documentType?: string; area?: string; kind?: "knowledge_document" | "legislation"; page?: number; pageSize?: number };

export async function searchKnowledgeBase(input: KnowledgeSearchInput) {
  const db = await getDb();
  if (!db) return { hits: [], total: 0, page: 0, pageSize: input.pageSize ?? 20 };
  const page = input.page ?? 0;
  const pageSize = Math.min(50, input.pageSize ?? 20);

  const chunks: SearchableChunk[] = [];
  if (input.kind !== "legislation") {
    const docFilters = [eq(knowledgeDocuments.active, 1)];
    if (input.documentType) docFilters.push(eq(knowledgeDocuments.documentType, input.documentType as (typeof knowledgeDocuments.$inferInsert)["documentType"]));
    if (input.area) docFilters.push(eq(knowledgeDocuments.area, input.area));
    const rows = await db
      .select({
        documentId: knowledgeDocuments.id,
        documentType: knowledgeDocuments.documentType,
        slug: knowledgeDocuments.slug,
        title: knowledgeDocuments.title,
        area: knowledgeDocuments.area,
        sourceStatus: knowledgeDocuments.sourceStatus,
        priority: knowledgeDocuments.priority,
        chunkId: knowledgeChunks.id,
        chunkContext: knowledgeChunks.context,
        chunkText: knowledgeChunks.text,
      })
      .from(knowledgeChunks)
      .innerJoin(knowledgeDocuments, eq(knowledgeChunks.documentId, knowledgeDocuments.id))
      .where(and(...docFilters));
    for (const r of rows) chunks.push({ ...r, documentKind: "knowledge_document" });
  }
  if (input.kind !== "knowledge_document") {
    const legFilters = [];
    if (input.area) legFilters.push(eq(legislationLibrary.area, input.area));
    const rows = await db
      .select({ documentId: legislationLibrary.id, slug: legislationLibrary.slug, title: legislationLibrary.title, area: legislationLibrary.area, sourceStatus: legislationLibrary.sourceStatus, content: legislationLibrary.content })
      .from(legislationLibrary)
      .where(legFilters.length ? and(...legFilters) : undefined);
    for (const r of rows) chunks.push({ documentId: r.documentId, documentKind: "legislation", slug: r.slug, title: r.title, area: r.area, sourceStatus: r.sourceStatus, chunkId: null, chunkContext: null, chunkText: r.content });
  }

  const query = input.query?.trim();
  const index = buildSearchIndex(chunks);
  const hits = query ? searchIndex(query, index, 200) : dedupeByDocument(chunks).map((c) => ({ ...c, score: 0 }));
  const total = hits.length;
  const paged = hits.slice(page * pageSize, page * pageSize + pageSize).map((h) => ({ ...h, chunkText: h.chunkText.length > 600 ? `${h.chunkText.slice(0, 600)}…` : h.chunkText }));
  return { hits: paged, total, page, pageSize };
}

export async function knowledgeDocumentDetail(kind: "knowledge_document" | "legislation", slug: string) {
  const db = dbRequired(await getDb());
  if (kind === "legislation") {
    const [row] = await db.select().from(legislationLibrary).where(eq(legislationLibrary.slug, slug));
    if (!row) throw new TRPCError({ code: "NOT_FOUND", message: "Legislação não encontrada." });
    return { kind, document: row, chunks: [], relationships: { outgoing: [], incoming: [] } };
  }
  const [row] = await db.select().from(knowledgeDocuments).where(eq(knowledgeDocuments.slug, slug));
  if (!row) throw new TRPCError({ code: "NOT_FOUND", message: "Documento não encontrado." });
  const [chunks, outgoing, incoming] = await Promise.all([
    db.select().from(knowledgeChunks).where(eq(knowledgeChunks.documentId, row.id)),
    db.select({ id: knowledgeRelationships.id, relationType: knowledgeRelationships.relationType, description: knowledgeRelationships.description, target: knowledgeDocuments }).from(knowledgeRelationships).innerJoin(knowledgeDocuments, eq(knowledgeRelationships.targetDocumentId, knowledgeDocuments.id)).where(eq(knowledgeRelationships.sourceDocumentId, row.id)),
    db.select({ id: knowledgeRelationships.id, relationType: knowledgeRelationships.relationType, description: knowledgeRelationships.description, source: knowledgeDocuments }).from(knowledgeRelationships).innerJoin(knowledgeDocuments, eq(knowledgeRelationships.sourceDocumentId, knowledgeDocuments.id)).where(eq(knowledgeRelationships.targetDocumentId, row.id)),
  ]);
  return { kind, document: row, chunks, relationships: { outgoing, incoming } };
}

/**
 * Auditoria de integridade — porta parcial de auditarCuradoria() (EJC).
 * Escopo: knowledge_documents + legislation_library, as duas tabelas que
 * este bloco introduz e que não passam pelo workflow de 4 gates que
 * jurisprudência/teses já têm no Atlas.
 */
export async function auditKnowledgeBase(actorUserId: number): Promise<CuratedAudit> {
  const db = dbRequired(await getDb());
  const [docs, legislation, recentTests, chunkCountRow] = await Promise.all([
    db.select({ slug: knowledgeDocuments.slug, title: knowledgeDocuments.title, content: knowledgeDocuments.content, sourceStatus: knowledgeDocuments.sourceStatus, officialUrl: knowledgeDocuments.officialUrl, documentType: knowledgeDocuments.documentType, area: knowledgeDocuments.area }).from(knowledgeDocuments),
    db.select({ slug: legislationLibrary.slug, title: legislationLibrary.title, content: legislationLibrary.content, sourceStatus: legislationLibrary.sourceStatus, officialUrl: legislationLibrary.officialUrl }).from(legislationLibrary),
    db.select({ status: ragTests.status, score: ragTests.score }).from(ragTests).orderBy(desc(ragTests.createdAt)).limit(50),
    db.select({ count: sql<number>`count(*)` }).from(knowledgeChunks),
  ]);

  const lgpd = scanLgpd([...docs, ...legislation].map((d) => ({ key: d.slug, text: `${d.title}\n${d.content}` })));
  const consistency = checkSourceConsistency([...docs, ...legislation].map((d) => ({ key: d.slug, sourceStatus: d.sourceStatus, officialUrl: d.officialUrl })));
  const duplicates = checkSemanticDuplicates(docs.map((d) => ({ key: d.slug, group: `${d.documentType}|${d.area}`, title: d.title, content: d.content })));
  const ragHealth = checkRagHealth(recentTests, Number(chunkCountRow[0]?.count ?? 0));

  const sections: AuditSection[] = [lgpd, consistency, duplicates, ragHealth];
  const { score, verdict } = summarizeAudit(sections);

  await db.insert(auditEvents).values({
    entityType: "knowledge_base_audit",
    entityKey: "knowledge_base",
    action: "audit_run",
    actorLabel: `user:${actorUserId}`,
    note: `score=${score}; ${verdict}`,
  });

  return { generatedAt: new Date().toISOString(), score, verdict, sections };
}

export async function knowledgeBaseStats() {
  const db = await getDb();
  if (!db) return { documents: 0, legislation: 0, chunks: 0, byType: [] as { documentType: string; total: number }[] };
  const [docCount, legCount, chunkCount, byType] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(knowledgeDocuments),
    db.select({ count: sql<number>`count(*)` }).from(legislationLibrary),
    db.select({ count: sql<number>`count(*)` }).from(knowledgeChunks),
    db.select({ documentType: knowledgeDocuments.documentType, total: sql<number>`count(*)` }).from(knowledgeDocuments).groupBy(knowledgeDocuments.documentType),
  ]);
  return {
    documents: Number(docCount[0]?.count ?? 0),
    legislation: Number(legCount[0]?.count ?? 0),
    chunks: Number(chunkCount[0]?.count ?? 0),
    byType: byType.map((x) => ({ documentType: x.documentType, total: Number(x.total) })),
  };
}
