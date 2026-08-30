import{date,decimal,index,int,json,longtext,mysqlEnum,mysqlTable,text,timestamp,uniqueIndex,varchar}from"drizzle-orm/mysql-core";import{ingestionBatches}from"./schema";

/**
 * Base de conhecimento importada do EJC (Zai GLM): balde genérico para os
 * tipos de documento sem tabela própria no Atlas (peça, contrato, checklist,
 * fluxo, tabela de documentos, triagem, prazo, doutrina, regra de
 * inteligência, regras contratuais). Jurisprudência e teses continuam em
 * jurisprudenceRecords/legalTheses; legislação em legislationLibrary.
 */
export const knowledgeDocuments=mysqlTable("knowledge_documents",{
 id:int("id").autoincrement().primaryKey(),
 slug:varchar("slug",{length:191}).notNull(),
 title:varchar("title",{length:500}).notNull(),
 documentType:mysqlEnum("document_type",["peca","contrato","checklist","fluxo","tabela_documentos","triagem","prazo","doutrina","regra_inteligencia","regras_contratuais","argumentacao","jurimetria"]).notNull(),
 area:varchar("area",{length:64}).notNull(),
 subarea:varchar("subarea",{length:128}),
 subject:varchar("subject",{length:255}),
 subsubject:varchar("subsubject",{length:255}),
 priority:mysqlEnum("priority",["P0","P1","P2","P3"]).notNull().default("P2"),
 batchId:int("batch_id").references(()=>ingestionBatches.id,{onDelete:"set null",onUpdate:"restrict"}),
 content:longtext("content").notNull(),
 metadata:json("metadata"),
 tags:json("tags"),
 sourceLabel:varchar("source_label",{length:255}),
 officialUrl:varchar("official_url",{length:1024}),
 consultedAt:date("consulted_at",{mode:"string"}),
 sourceStatus:mysqlEnum("source_status",["official_confirmed","attachment_reviewed","editorial_review","secondary_pending","not_for_use"]).notNull().default("editorial_review"),
 status:mysqlEnum("status",["ativo","revisao_humana","desativado","demonstracao"]).notNull().default("revisao_humana"),
 fictitious:int("fictitious").notNull().default(0),
 active:int("active").notNull().default(1),
 version:int("version").notNull().default(1),
 verifiedAt:date("verified_at",{mode:"string"}),
 nextVerificationRecommendedAt:date("next_verification_recommended_at",{mode:"string"}),
 createdAt:timestamp("created_at").notNull().defaultNow(),
 updatedAt:timestamp("updated_at").notNull().defaultNow().onUpdateNow()
},t=>({
 slugUq:uniqueIndex("uq_knowledge_documents_slug").on(t.slug),
 typeIdx:index("idx_knowledge_documents_type").on(t.documentType),
 areaIdx:index("idx_knowledge_documents_area").on(t.area,t.subarea),
 priorityIdx:index("idx_knowledge_documents_priority").on(t.priority),
 statusIdx:index("idx_knowledge_documents_status").on(t.status)
}));

/** Chunks para busca lexical (RAG) — um documento vira vários chunks semânticos. */
export const knowledgeChunks=mysqlTable("knowledge_chunks",{
 id:int("id").autoincrement().primaryKey(),
 documentId:int("document_id").notNull().references(()=>knowledgeDocuments.id,{onDelete:"cascade",onUpdate:"restrict"}),
 position:int("position").notNull(),
 context:varchar("context",{length:500}),
 text:longtext("text").notNull(),
 wordCount:int("word_count").notNull().default(0),
 embedding:longtext("embedding")
},t=>({
 documentIdx:index("idx_knowledge_chunks_document").on(t.documentId)
}));

/** Grafo genérico entre documentos de knowledgeDocuments (jurisprudência/teses usam suas próprias junctions tipadas). */
export const knowledgeRelationships=mysqlTable("knowledge_relationships",{
 id:int("id").autoincrement().primaryKey(),
 sourceDocumentId:int("source_document_id").notNull().references(()=>knowledgeDocuments.id,{onDelete:"cascade",onUpdate:"restrict"}),
 targetDocumentId:int("target_document_id").notNull().references(()=>knowledgeDocuments.id,{onDelete:"cascade",onUpdate:"restrict"}),
 relationType:varchar("relation_type",{length:64}).notNull(),
 description:text("description"),
 createdAt:timestamp("created_at").notNull().defaultNow()
},t=>({
 relationUq:uniqueIndex("uq_knowledge_relationship").on(t.sourceDocumentId,t.targetDocumentId,t.relationType),
 sourceIdx:index("idx_knowledge_relationships_source").on(t.sourceDocumentId),
 targetIdx:index("idx_knowledge_relationships_target").on(t.targetDocumentId),
 typeIdx:index("idx_knowledge_relationships_type").on(t.relationType)
}));

/** Biblioteca de legislação citável independentemente de qualquer tese — legalThesisLegalBasis é escopado a uma tese e não serve para isso. */
export const legislationLibrary=mysqlTable("legislation_library",{
 id:int("id").autoincrement().primaryKey(),
 slug:varchar("slug",{length:191}).notNull(),
 title:varchar("title",{length:500}).notNull(),
 norm:varchar("norm",{length:255}).notNull(),
 provision:varchar("provision",{length:255}),
 area:varchar("area",{length:64}).notNull(),
 subarea:varchar("subarea",{length:128}),
 content:longtext("content").notNull(),
 officialUrl:varchar("official_url",{length:1024}).notNull(),
 sourceLabel:varchar("source_label",{length:255}),
 consultedAt:date("consulted_at",{mode:"string"}).notNull(),
 sourceStatus:mysqlEnum("source_status",["official_confirmed","attachment_reviewed","editorial_review","secondary_pending","not_for_use"]).notNull().default("official_confirmed"),
 verifiedAt:date("verified_at",{mode:"string"}),
 version:int("version").notNull().default(1),
 createdAt:timestamp("created_at").notNull().defaultNow(),
 updatedAt:timestamp("updated_at").notNull().defaultNow().onUpdateNow()
},t=>({
 slugUq:uniqueIndex("uq_legislation_library_slug").on(t.slug),
 normIdx:index("idx_legislation_library_norm").on(t.norm),
 areaIdx:index("idx_legislation_library_area").on(t.area,t.subarea)
}));

/** Suíte de QA do RAG (feature de produto, não teste de engenharia) — histórico das execuções das perguntas canônicas. */
export const ragTests=mysqlTable("rag_tests",{
 id:int("id").autoincrement().primaryKey(),
 question:text("question").notNull(),
 answer:longtext("answer"),
 foundDocuments:json("found_documents"),
 score:decimal("score",{precision:5,scale:2,mode:"number"}),
 status:mysqlEnum("status",["pendente","sucesso","parcial","falha"]).notNull().default("pendente"),
 observation:text("observation"),
 createdAt:timestamp("created_at").notNull().defaultNow()
},t=>({
 statusIdx:index("idx_rag_tests_status").on(t.status)
}));
