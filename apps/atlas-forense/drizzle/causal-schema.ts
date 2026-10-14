import { decimal, index, int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

export const causalRunStatus = ["planned", "running", "partial", "completed", "failed", "rejected"] as const;
export const causalReviewStatus = ["pending", "approved", "rejected", "returned"] as const;
export const causalDocumentTypes = ["sentenca", "acordao", "decisao_interlocutoria", "acordo_homologado", "movimento", "outro"] as const;
export const causalClaimTypes = ["dano_moral", "dano_material", "obrigacao_fazer", "obrigacao_nao_fazer", "repeticao_indebito", "rescisao_contratual", "restituicao", "declaracao_inexistencia_debito", "outro"] as const;
export const causalClaimRoles = ["pedido", "fato_gerador", "fundamento", "consequencia"] as const;
export const causalOutcomeTypes = ["procedente", "improcedente", "parcialmente_procedente", "extinto_sem_merito", "acordo_homologado", "prejudicado", "nao_localizado", "incerto"] as const;

export const causalRuns = mysqlTable("causal_runs", {
  id: int("id").autoincrement().primaryKey(),
  runKey: varchar("runKey", { length: 191 }).notNull().unique(),
  sourceKey: varchar("sourceKey", { length: 191 }).notNull(),
  tribunalAlias: varchar("tribunalAlias", { length: 64 }).notNull(),
  scope: varchar("scope", { length: 128 }).notNull(),
  periodStart: varchar("periodStart", { length: 10 }).notNull(),
  periodEnd: varchar("periodEnd", { length: 10 }).notNull(),
  methodologyVersion: varchar("methodologyVersion", { length: 64 }).notNull(),
  status: mysqlEnum("status", causalRunStatus).default("planned").notNull(),
  coverageNote: text("coverageNote").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [index("causal_runs_status_idx").on(table.status)]);

export const causalCases = mysqlTable("causal_cases", {
  id: int("id").autoincrement().primaryKey(),
  runId: int("runId").notNull(),
  caseKey: varchar("caseKey", { length: 191 }).notNull().unique(),
  publicProcessKey: varchar("publicProcessKey", { length: 191 }),
  tribunal: varchar("tribunal", { length: 64 }).notNull(),
  justice: varchar("justice", { length: 64 }).notNull(),
  municipality: varchar("municipality", { length: 128 }),
  classCode: varchar("classCode", { length: 64 }),
  classLabel: varchar("classLabel", { length: 255 }),
  filingDate: timestamp("filingDate"),
  coverageStatus: mysqlEnum("coverageStatus", ["metadata_only", "documents_available", "reviewed", "excluded"]).default("metadata_only").notNull(),
  sourceHashSha256: varchar("sourceHashSha256", { length: 64 }).notNull(),
  privacyNote: varchar("privacyNote", { length: 500 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [
  index("causal_cases_run_idx").on(table.runId),
  index("causal_cases_tribunal_idx").on(table.tribunal),
  index("causal_cases_coverage_idx").on(table.coverageStatus),
]);

export const causalDocuments = mysqlTable("causal_documents", {
  id: int("id").autoincrement().primaryKey(),
  caseId: int("caseId").notNull(),
  documentType: mysqlEnum("documentType", causalDocumentTypes).notNull(),
  sourceUrl: varchar("sourceUrl", { length: 1024 }),
  sourceLabel: varchar("sourceLabel", { length: 255 }).notNull(),
  contentHashSha256: varchar("contentHashSha256", { length: 64 }).notNull(),
  pageCount: int("pageCount"),
  available: int("available").default(1).notNull(),
  reviewStatus: mysqlEnum("reviewStatus", causalReviewStatus).default("pending").notNull(),
  reviewedBy: varchar("reviewedBy", { length: 191 }),
  reviewedAt: timestamp("reviewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [
  uniqueIndex("causal_documents_case_hash_unique").on(table.caseId, table.contentHashSha256),
  index("causal_documents_case_idx").on(table.caseId),
  index("causal_documents_review_idx").on(table.reviewStatus),
]);

export const causalEvidenceRefs = mysqlTable("causal_evidence_refs", {
  id: int("id").autoincrement().primaryKey(),
  caseId: int("caseId").notNull(),
  documentId: int("documentId"),
  sourceUrl: varchar("sourceUrl", { length: 1024 }).notNull(),
  sourceLabel: varchar("sourceLabel", { length: 255 }).notNull(),
  sourceHashSha256: varchar("sourceHashSha256", { length: 64 }).notNull(),
  pageNumber: int("pageNumber"),
  paragraphRef: varchar("paragraphRef", { length: 128 }),
  excerpt: text("excerpt"),
  evidenceType: mysqlEnum("evidenceType", ["official_document", "official_api", "official_movement", "manual_review"]).notNull(),
  reviewStatus: mysqlEnum("reviewStatus", causalReviewStatus).default("pending").notNull(),
  reviewedBy: varchar("reviewedBy", { length: 191 }),
  reviewedAt: timestamp("reviewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [
  index("causal_evidence_case_idx").on(table.caseId),
  index("causal_evidence_status_idx").on(table.reviewStatus),
]);

export const causalAnnotations = mysqlTable("causal_annotations", {
  id: int("id").autoincrement().primaryKey(),
  caseId: int("caseId").notNull(),
  evidenceRefId: int("evidenceRefId").notNull(),
  role: mysqlEnum("role", causalClaimRoles).notNull(),
  claimType: mysqlEnum("claimType", causalClaimTypes).notNull(),
  label: varchar("label", { length: 255 }).notNull(),
  normalizedLabel: varchar("normalizedLabel", { length: 191 }).notNull(),
  sourceKind: mysqlEnum("sourceKind", ["cnj_subject", "movement", "document", "manual_review"]).notNull(),
  confidence: decimal("confidence", { precision: 5, scale: 4 }).notNull(),
  reviewStatus: mysqlEnum("reviewStatus", causalReviewStatus).default("pending").notNull(),
  reviewedBy: varchar("reviewedBy", { length: 191 }),
  reviewedAt: timestamp("reviewedAt"),
  reviewNote: text("reviewNote"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [
  index("causal_annotations_case_idx").on(table.caseId),
  index("causal_annotations_claim_idx").on(table.claimType),
  index("causal_annotations_status_idx").on(table.reviewStatus),
]);

export const causalOutcomes = mysqlTable("causal_outcomes", {
  id: int("id").autoincrement().primaryKey(),
  caseId: int("caseId").notNull(),
  annotationId: int("annotationId").notNull(),
  evidenceRefId: int("evidenceRefId").notNull(),
  phase: mysqlEnum("phase", ["origin", "appeal", "execution"]).notNull(),
  outcome: mysqlEnum("outcome", causalOutcomeTypes).notNull(),
  amountCents: int("amountCents"),
  currency: varchar("currency", { length: 3 }).default("BRL").notNull(),
  reviewStatus: mysqlEnum("reviewStatus", causalReviewStatus).default("pending").notNull(),
  reviewedBy: varchar("reviewedBy", { length: 191 }),
  reviewedAt: timestamp("reviewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [
  index("causal_outcomes_case_idx").on(table.caseId),
  index("causal_outcomes_annotation_idx").on(table.annotationId),
  index("causal_outcomes_status_idx").on(table.reviewStatus),
]);

export type CausalRun = typeof causalRuns.$inferSelect;
export type CausalCase = typeof causalCases.$inferSelect;
export type CausalDocument = typeof causalDocuments.$inferSelect;
export type CausalEvidenceRef = typeof causalEvidenceRefs.$inferSelect;
export type CausalAnnotation = typeof causalAnnotations.$inferSelect;
export type CausalOutcome = typeof causalOutcomes.$inferSelect;
