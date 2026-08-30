import "dotenv/config";
import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { eq, sql } from "drizzle-orm";
import { getDb } from "../server/db";
import { createDraft } from "../server/thesis-bank";
import { auditEvents, evidenceSources, ingestionBatches, jurisprudenceRecords, legalTopics, users } from "../drizzle/schema";
import { knowledgeChunks, knowledgeDocuments, knowledgeRelationships, legislationLibrary, ragTests } from "../drizzle/knowledge-base.schema";

/**
 * Importa o corpus do EJC (Zai GLM) — 639 documentos, 2.484 chunks, 553
 * relacionamentos, 29 lotes, 600 execuções de teste do RAG — a partir do
 * banco SQLite original (data/ejc-import/custom.db), não dos arquivos-fonte
 * .ts/.mjs.
 *
 * Desvio deliberado do plano original (que previa ler data/ejc/lote-*.ts):
 * os arquivos-fonte são heterogêneos (dois estilos de literal JS distintos)
 * e pelo menos um lote de geradores (scripts/2b/gen-*.mjs) não está
 * referenciado por nenhum script de ingestão encontrado — não é possível
 * confirmar que a soma dos arquivos-fonte reproduz o corpus real. O SQLite
 * já populado é o que o próprio EJC auditou (score 98/100) e publicou; é a
 * fonte mais confiável disponível.
 *
 * Idempotente por slug do EJC via audit_events (entityType='ejc_document'):
 * documentos já importados são pulados, sem sobrescrever edições humanas
 * feitas depois pela curadoria do Atlas.
 */

const SYSTEM_USER_OPEN_ID = "ejc-import-system";
const SQLITE_PATH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "data", "ejc-import", "custom.db");

const GENERIC_TYPE_MAP: Record<string, (typeof knowledgeDocuments.$inferInsert)["documentType"]> = {
  PECA: "peca",
  CONTRATO: "contrato",
  CHECKLIST: "checklist",
  FLUXO: "fluxo",
  TABELA_DOCUMENTOS: "tabela_documentos",
  TRIAGEM: "triagem",
  PRAZO: "prazo",
  DOUTRINA: "doutrina",
  REGRA_INTELIGENCIA: "regra_inteligencia",
  REGRAS_CONTRATUAIS: "regras_contratuais",
  ARGUMENTACAO: "argumentacao",
  JURIMETRIA: "jurimetria",
};

const CONFIANCA_TO_GENERIC_STATUS: Record<string, "official_confirmed" | "attachment_reviewed" | "editorial_review" | "secondary_pending" | "not_for_use"> = {
  A: "official_confirmed",
  B: "editorial_review",
  C: "secondary_pending",
};
const CONFIANCA_TO_JURISPRUDENCE_STATUS: Record<string, "official_confirmed" | "official_without_number" | "attachment_reviewed" | "secondary_pending" | "movement_observed" | "search_thematic"> = {
  A: "official_confirmed",
  B: "attachment_reviewed",
  C: "secondary_pending",
};
const EJC_STATUS_TO_ATLAS: Record<string, "ativo" | "revisao_humana" | "desativado" | "demonstracao"> = {
  ATIVO: "ativo",
  REVISAO_HUMANA: "revisao_humana",
  DESATIVADO: "desativado",
  DEMONSTRACAO: "demonstracao",
};

/** Áreas do EJC sem correspondente entre as 11 sementes de legal_topics do Atlas. */
const EXTRA_TOPIC_AREAS: Record<string, string> = {
  "processual-civil": "Direito Processual Civil",
  geral: "Geral",
};
/** Áreas do EJC cujo slug difere do slug já semeado em legal_topics. */
const AREA_SLUG_ALIAS: Record<string, string> = { digital: "digital-lgpd" };

type EjcDocumentRow = {
  id: string;
  slug: string;
  titulo: string;
  tipoDocumento: string;
  area: string;
  subarea: string | null;
  assunto: string | null;
  conteudo: string;
  metadados: string | null;
  fonte: string | null;
  urlFonte: string | null;
  dataConsulta: string | null;
  confiabilidade: string;
  status: string;
  lote: string | null;
};

function parseJson(raw: string | null): Record<string, unknown> {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function stringField(meta: Record<string, unknown>, key: string): string | undefined {
  const value = meta[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function isoDate(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : undefined;
}

async function ensureSystemUser(db: Awaited<ReturnType<typeof getDb>>) {
  if (!db) throw new Error("DATABASE_URL não configurada.");
  const [existing] = await db.select().from(users).where(eq(users.openId, SYSTEM_USER_OPEN_ID));
  if (existing) return existing.id;
  const ids = await db
    .insert(users)
    .values({ openId: SYSTEM_USER_OPEN_ID, name: "Importação EJC (Zai GLM)", loginMethod: "system", role: "admin" })
    .$returningId();
  const id = ids[0]?.id;
  if (!id) throw new Error("Falha ao criar usuário de sistema para a importação.");
  return id;
}

async function ensureEvidenceSource(db: Awaited<ReturnType<typeof getDb>>) {
  if (!db) throw new Error("DATABASE_URL não configurada.");
  const label = "Corpus EJC (Zai GLM)";
  const [existing] = await db.select().from(evidenceSources).where(eq(evidenceSources.label, label));
  if (existing) return existing.id;
  const ids = await db
    .insert(evidenceSources)
    .values({
      label,
      sourceType: "manual",
      publicStatus: "secondary_pending",
      note: "Fonte agregada para jurisprudência importada do corpus EJC. Cada registro carrega sua própria confiabilidade (A/B/C) — este agregado marca que a fonte oficial por registro ainda precisa ser conferida individualmente na curadoria do Atlas.",
    })
    .$returningId();
  const id = ids[0]?.id;
  if (!id) throw new Error("Falha ao criar evidence_source da importação.");
  return id;
}

async function ensureBatches(db: Awaited<ReturnType<typeof getDb>>, sqlite: DatabaseSync) {
  if (!db) throw new Error("DATABASE_URL não configurada.");
  const rows = sqlite.prepare("SELECT codigo,descricao,pesquisado,criados,duplicatasEvitadas FROM IngestBatch").all() as {
    codigo: string;
    descricao: string;
    pesquisado: number;
    criados: number;
    duplicatasEvitadas: number;
  }[];
  const map = new Map<string, number>();
  for (const row of rows) {
    const batchKey = `EJC-${row.codigo}`;
    const [existing] = await db.select().from(ingestionBatches).where(eq(ingestionBatches.batchKey, batchKey));
    if (existing) {
      map.set(row.codigo, existing.id);
      continue;
    }
    const ids = await db
      .insert(ingestionBatches)
      .values({
        batchKey,
        sourceLabel: `Corpus EJC (Zai GLM) — ${row.codigo}`,
        status: "imported",
        itemsDiscovered: row.pesquisado,
        itemsImported: row.criados,
        itemsExcluded: row.duplicatasEvitadas,
        method: "Importação em lote a partir do banco SQLite curado do EJC (Zai GLM).",
        note: row.descricao,
      })
      .$returningId();
    const id = ids[0]?.id;
    if (!id) throw new Error(`Falha ao criar ingestion_batch para ${row.codigo}.`);
    map.set(row.codigo, id);
  }
  return map;
}

async function ensureTopics(db: Awaited<ReturnType<typeof getDb>>) {
  if (!db) throw new Error("DATABASE_URL não configurada.");
  const seeded = await db.select().from(legalTopics).where(sql`${legalTopics.parentId} IS NULL`);
  const map = new Map<string, number>(seeded.map((t) => [t.slug, t.id]));
  for (const [slug, title] of Object.entries(EXTRA_TOPIC_AREAS)) {
    if (map.has(slug)) continue;
    const ids = await db
      .insert(legalTopics)
      .values({ parentId: null, kind: "area", title, slug, pathKey: slug, summary: "Área temática para classificação editorial.", sourceStatus: "editorial_review" })
      .$returningId();
    const id = ids[0]?.id;
    if (!id) throw new Error(`Falha ao criar legal_topics para ${slug}.`);
    map.set(slug, id);
  }
  return map;
}

function topicIdFor(area: string, map: Map<string, number>): number {
  const slug = AREA_SLUG_ALIAS[area] ?? area;
  const id = map.get(slug);
  if (!id) throw new Error(`Área sem legal_topics correspondente: ${area}`);
  return id;
}

async function alreadyImportedSlugs(db: Awaited<ReturnType<typeof getDb>>): Promise<Set<string>> {
  if (!db) throw new Error("DATABASE_URL não configurada.");
  const rows = await db.select({ entityKey: auditEvents.entityKey }).from(auditEvents).where(eq(auditEvents.entityType, "ejc_document"));
  return new Set(rows.map((r) => r.entityKey));
}

async function recordImported(db: NonNullable<Awaited<ReturnType<typeof getDb>>>, slug: string, destination: string) {
  await db.insert(auditEvents).values({ entityType: "ejc_document", entityKey: slug, action: "imported", actorLabel: "ejc-import-script", note: `Importado para ${destination}.` });
}

async function main() {
  const db = await getDb();
  if (!db) throw new Error("DATABASE_URL não configurada.");
  const sqlite = new DatabaseSync(SQLITE_PATH, { readOnly: true });

  const systemUserId = await ensureSystemUser(db);
  const evidenceSourceId = await ensureEvidenceSource(db);
  const batchMap = await ensureBatches(db, sqlite);
  const topicMap = await ensureTopics(db);
  const imported = await alreadyImportedSlugs(db);

  const docs = sqlite
    .prepare(
      "SELECT id,slug,titulo,tipoDocumento,area,subarea,assunto,conteudo,metadados,fonte,urlFonte,dataConsulta,confiabilidade,status,lote FROM KnowledgeDocument",
    )
    .all() as EjcDocumentRow[];

  const ejcIdToKnowledgeDocId = new Map<string, number>();
  const counts = { jurisprudencia: 0, tese: 0, legislacao: 0, generico: 0, pulados: 0, erros: 0 };

  for (const doc of docs) {
    if (imported.has(doc.slug)) {
      counts.pulados += 1;
      if (GENERIC_TYPE_MAP[doc.tipoDocumento]) {
        const [existing] = await db.select({ id: knowledgeDocuments.id }).from(knowledgeDocuments).where(eq(knowledgeDocuments.slug, doc.slug));
        if (existing) ejcIdToKnowledgeDocId.set(doc.id, existing.id);
      }
      continue;
    }

    const meta = parseJson(doc.metadados);
    const batchId = doc.lote ? batchMap.get(doc.lote) : undefined;

    try {
      if (doc.tipoDocumento === "JURISPRUDENCIA") {
        if (!batchId) throw new Error(`Lote ${doc.lote} não mapeado.`);
        await db.insert(jurisprudenceRecords).values({
          externalId: `ejc:${doc.slug}`,
          batchId,
          sourceId: evidenceSourceId,
          cnjNumber: stringField(meta, "numero_processo") ?? null,
          tribunal: stringField(meta, "tribunal") ?? "Não informado",
          justice: stringField(meta, "tribunal") ?? "Não informado",
          decisionType: stringField(meta, "classe") ?? "Não especificado",
          decisionDate: isoDate(stringField(meta, "data_julgamento")) ? new Date(stringField(meta, "data_julgamento")!) : undefined,
          legalArea: doc.subarea ? `${doc.area}/${doc.subarea}` : doc.area,
          theme: (doc.assunto ?? doc.titulo).slice(0, 500),
          reasoningSummary: doc.conteudo,
          sourceStatus: CONFIANCA_TO_JURISPRUDENCE_STATUS[doc.confiabilidade] ?? "secondary_pending",
        });
        await recordImported(db, doc.slug, "jurisprudence_records");
        counts.jurisprudencia += 1;
      } else if (doc.tipoDocumento === "TESE") {
        const tipoDemanda = stringField(meta, "tipoDemanda");
        const probabilidade = stringField(meta, "probabilidadeSucesso");
        await createDraft(
          {
            topicId: topicIdFor(doc.area, topicMap),
            title: doc.titulo.slice(0, 500),
            description: doc.conteudo,
            position: "em_debate",
            useType: "both",
            argumentation: doc.conteudo,
            whenToUse: tipoDemanda,
            riskNotes: probabilidade ? `Probabilidade qualitativa estimada pelo EJC (Zai GLM): ${probabilidade}. Não substitui a avaliação de Atlas Confidence, que exige revisão humana própria.` : undefined,
          },
          systemUserId,
        );
        await recordImported(db, doc.slug, "legal_theses");
        counts.tese += 1;
      } else if (doc.tipoDocumento === "LEGISLACAO") {
        const officialUrl = doc.urlFonte;
        const consultedAt = isoDate(doc.dataConsulta);
        if (!officialUrl || !consultedAt) throw new Error("LEGISLACAO sem urlFonte/dataConsulta válidos.");
        await db.insert(legislationLibrary).values({
          slug: doc.slug,
          title: doc.titulo,
          norm: stringField(meta, "numero") ?? doc.titulo,
          provision: Array.isArray(meta.artigos_principais) ? String(meta.artigos_principais[0] ?? "") || null : null,
          area: doc.area,
          subarea: doc.subarea,
          content: doc.conteudo,
          officialUrl,
          sourceLabel: doc.fonte,
          consultedAt,
          sourceStatus: CONFIANCA_TO_GENERIC_STATUS[doc.confiabilidade] ?? "editorial_review",
        });
        await recordImported(db, doc.slug, "legislation_library");
        counts.legislacao += 1;
      } else {
        const documentType = GENERIC_TYPE_MAP[doc.tipoDocumento];
        if (!documentType) throw new Error(`Tipo de documento desconhecido: ${doc.tipoDocumento}`);
        const ids = await db
          .insert(knowledgeDocuments)
          .values({
            slug: doc.slug,
            title: doc.titulo,
            documentType,
            area: doc.area,
            subarea: doc.subarea,
            subject: doc.assunto,
            batchId: batchId ?? null,
            content: doc.conteudo,
            metadata: meta,
            sourceLabel: doc.fonte,
            officialUrl: doc.urlFonte,
            consultedAt: isoDate(doc.dataConsulta) ?? null,
            sourceStatus: CONFIANCA_TO_GENERIC_STATUS[doc.confiabilidade] ?? "editorial_review",
            status: EJC_STATUS_TO_ATLAS[doc.status] ?? "revisao_humana",
          })
          .$returningId();
        const id = ids[0]?.id;
        if (!id) throw new Error("Falha ao inserir knowledge_documents.");
        ejcIdToKnowledgeDocId.set(doc.id, id);

        const chunks = sqlite.prepare("SELECT ordem,contexto,texto,palavras FROM KnowledgeChunk WHERE documentId = ?").all(doc.id) as {
          ordem: number;
          contexto: string | null;
          texto: string;
          palavras: number;
        }[];
        if (chunks.length) {
          await db.insert(knowledgeChunks).values(chunks.map((c) => ({ documentId: id, position: c.ordem, context: c.contexto, text: c.texto, wordCount: c.palavras })));
        }
        await recordImported(db, doc.slug, "knowledge_documents");
        counts.generico += 1;
      }
    } catch (error) {
      counts.erros += 1;
      console.error(`[import-ejc] falhou: ${doc.slug} (${doc.tipoDocumento}) — ${error instanceof Error ? error.message : error}`);
    }
  }

  const relationships = sqlite.prepare("SELECT origemId,destinoId,tipo,descricao FROM KnowledgeRelationship").all() as {
    origemId: string;
    destinoId: string;
    tipo: string;
    descricao: string | null;
  }[];
  let relacionamentosImportados = 0;
  let relacionamentosPulados = 0;
  for (const rel of relationships) {
    const sourceId = ejcIdToKnowledgeDocId.get(rel.origemId);
    const targetId = ejcIdToKnowledgeDocId.get(rel.destinoId);
    if (!sourceId || !targetId) {
      relacionamentosPulados += 1;
      continue;
    }
    await db
      .insert(knowledgeRelationships)
      .values({ sourceDocumentId: sourceId, targetDocumentId: targetId, relationType: rel.tipo.toLowerCase(), description: rel.descricao })
      .onDuplicateKeyUpdate({ set: { description: rel.descricao } });
    relacionamentosImportados += 1;
  }

  const ragTestsMarker = "ejc_rag_tests_bulk";
  let ragTestsImportados = 0;
  if (!imported.has(ragTestsMarker)) {
    const rows = sqlite.prepare("SELECT pergunta,resposta,documentosEncontrados,score,status,observacao FROM RagTest").all() as {
      pergunta: string;
      resposta: string | null;
      documentosEncontrados: string | null;
      score: number | null;
      status: string;
      observacao: string | null;
    }[];
    const STATUS_MAP: Record<string, "pendente" | "sucesso" | "parcial" | "falha"> = { PENDENTE: "pendente", SUCESSO: "sucesso", PARCIAL: "parcial", FALHA: "falha" };
    if (rows.length) {
      const batchSize = 200;
      for (let i = 0; i < rows.length; i += batchSize) {
        const slice = rows.slice(i, i + batchSize);
        await db.insert(ragTests).values(
          slice.map((r) => ({
            question: r.pergunta,
            answer: r.resposta,
            foundDocuments: parseJson(r.documentosEncontrados),
            score: r.score,
            status: STATUS_MAP[r.status] ?? "pendente",
            observation: r.observacao,
          })),
        );
      }
      ragTestsImportados = rows.length;
    }
    await recordImported(db, ragTestsMarker, "rag_tests");
  }

  await db.insert(auditEvents).values({
    entityType: "knowledge_base_import",
    entityKey: "ejc_corpus",
    action: "import_run",
    actorLabel: "ejc-import-script",
    note: JSON.stringify({ ...counts, relacionamentosImportados, relacionamentosPulados, ragTestsImportados }),
  });

  console.log("[import-ejc] concluído:", { ...counts, relacionamentosImportados, relacionamentosPulados, ragTestsImportados });
  sqlite.close();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("[import-ejc] erro fatal:", error);
    process.exit(1);
  });
