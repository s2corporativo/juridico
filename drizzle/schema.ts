import { index, int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const legalTopics = mysqlTable("legal_topics", {
  id: int("id").autoincrement().primaryKey(),
  parentId: int("parentId"),
  kind: mysqlEnum("kind", ["area", "subarea", "instituto", "tema", "subtema", "questao"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 191 }).notNull(),
  pathKey: varchar("pathKey", { length: 767 }).notNull().unique(),
  summary: text("summary"),
  synonyms: text("synonyms"),
  cnjCodes: text("cnjCodes"),
  sourceStatus: mysqlEnum("sourceStatus", ["official_confirmed", "attachment_reviewed", "editorial_review", "secondary_pending"]).default("editorial_review").notNull(),
  version: int("version").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [
  uniqueIndex("legal_topics_parent_slug_unique").on(table.parentId, table.slug),
  index("legal_topics_kind_idx").on(table.kind),
]);

export const evidenceSources = mysqlTable("evidence_sources", {
  id: int("id").autoincrement().primaryKey(),
  label: varchar("label", { length: 255 }).notNull(),
  sourceType: mysqlEnum("sourceType", ["official_document", "official_url", "attachment", "secondary", "manual"]).notNull(),
  sourceUrl: varchar("sourceUrl", { length: 1024 }),
  hashSha256: varchar("hashSha256", { length: 64 }),
  publicStatus: mysqlEnum("publicStatus", ["official_confirmed", "official_without_number", "attachment_reviewed", "secondary_pending", "not_for_use"]).notNull(),
  note: text("note"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [index("evidence_sources_status_idx").on(table.publicStatus)]);

/** Catálogo institucional de APIs, dados abertos e fontes de consulta aprovadas. */
export const publicDataSources = mysqlTable("public_data_sources", {
  id: int("id").autoincrement().primaryKey(),
  sourceKey: varchar("sourceKey", { length: 191 }).notNull().unique(),
  label: varchar("label", { length: 255 }).notNull(),
  maintainer: varchar("maintainer", { length: 255 }).notNull(),
  sourceType: mysqlEnum("sourceType", ["api", "catalog", "webservice", "manual"]).notNull(),
  baseUrl: varchar("baseUrl", { length: 1024 }).notNull(),
  documentationUrl: varchar("documentationUrl", { length: 1024 }).notNull(),
  authentication: mysqlEnum("authentication", ["none", "api_key", "manual"]).notNull(),
  integrationStatus: mysqlEnum("integrationStatus", ["integrated", "ready", "credential_required", "manual_only", "not_integrated"]).notNull(),
  coverage: text("coverage").notNull(),
  contentScope: text("contentScope").notNull(),
  usageNote: text("usageNote").notNull(),
  citationText: varchar("citationText", { length: 500 }).notNull(),
  privacyNote: text("privacyNote").notNull(),
  lastVerifiedAt: timestamp("lastVerifiedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [index("public_data_sources_status_idx").on(table.integrationStatus)]);

/** Execuções rastreáveis de censo DataJud; a chave e o corpo de consulta não são armazenados. */
export const nationalCensusRuns = mysqlTable("national_census_runs", {
  id: int("id").autoincrement().primaryKey(),
  runKey: varchar("runKey", { length: 191 }).notNull().unique(),
  sourceKey: varchar("sourceKey", { length: 191 }).notNull(),
  status: mysqlEnum("status", ["planned", "running", "partial", "completed", "failed", "rejected"]).notNull(),
  scope: varchar("scope", { length: 128 }).notNull(),
  periodStart: varchar("periodStart", { length: 7 }).notNull(),
  periodEnd: varchar("periodEnd", { length: 7 }).notNull(),
  expectedTribunals: int("expectedTribunals").notNull(),
  respondedTribunals: int("respondedTribunals").default(0).notNull(),
  methodologyVersion: varchar("methodologyVersion", { length: 64 }).notNull(),
  queryFingerprint: varchar("queryFingerprint", { length: 64 }),
  coverageNote: text("coverageNote").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [index("national_census_runs_status_idx").on(table.status)]);

/** Série agregada mensal por tribunal, sem números de processos ou dados pessoais. */
export const nationalCensusMetrics = mysqlTable("national_census_metrics", {
  id: int("id").autoincrement().primaryKey(),
  runId: int("runId").notNull(),
  tribunalAlias: varchar("tribunalAlias", { length: 64 }).notNull(),
  tribunal: varchar("tribunal", { length: 128 }).notNull(),
  uf: varchar("uf", { length: 2 }).notNull(),
  month: varchar("month", { length: 7 }).notNull(),
  metric: mysqlEnum("metric", ["distribution", "baixa"]).notNull(),
  classCode: varchar("classCode", { length: 32 }).notNull().default(""),
  subjectCode: varchar("subjectCode", { length: 32 }).notNull().default(""),
  judgingBodyCode: varchar("judgingBodyCode", { length: 64 }).notNull().default(""),
  amount: int("amount").notNull(),
  sourceObservedAt: timestamp("sourceObservedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [
  uniqueIndex("national_census_metric_unique").on(table.runId, table.tribunalAlias, table.month, table.metric, table.classCode, table.subjectCode, table.judgingBodyCode),
  index("national_census_metrics_month_idx").on(table.month),
  index("national_census_metrics_tribunal_idx").on(table.tribunalAlias),
]);

/** Facetas nacionais agregadas do recorte, sem processos concretos ou dados de partes. */
export const nationalCensusFacets = mysqlTable("national_census_facets", {
  id: int("id").autoincrement().primaryKey(),
  runId: int("runId").notNull(),
  kind: mysqlEnum("kind", ["subject", "judging_body"]).notNull(),
  code: varchar("code", { length: 64 }).notNull(),
  label: varchar("label", { length: 500 }).notNull(),
  amount: int("amount").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [
  uniqueIndex("national_census_facets_unique").on(table.runId, table.kind, table.code),
  index("national_census_facets_kind_idx").on(table.kind),
]);

/** Execuções rastreáveis de cobertura territorial RMBH, sempre distintas do censo nacional. */
export const metropolitanCoverageRuns = mysqlTable("metropolitan_coverage_runs", {
  id: int("id").autoincrement().primaryKey(),
  runKey: varchar("runKey", { length: 191 }).notNull().unique(),
  sourceKey: varchar("sourceKey", { length: 191 }).notNull(),
  tribunalAlias: varchar("tribunalAlias", { length: 64 }).notNull(),
  status: mysqlEnum("status", ["planned", "running", "partial", "completed", "failed", "rejected"]).notNull(),
  scope: varchar("scope", { length: 128 }).notNull(),
  periodStart: varchar("periodStart", { length: 7 }).notNull(),
  periodEnd: varchar("periodEnd", { length: 7 }).notNull(),
  expectedMunicipalities: int("expectedMunicipalities").notNull(),
  mappedMunicipalities: int("mappedMunicipalities").default(0).notNull(),
  methodologyVersion: varchar("methodologyVersion", { length: 64 }).notNull(),
  queryFingerprint: varchar("queryFingerprint", { length: 64 }),
  coverageNote: text("coverageNote").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [index("metropolitan_coverage_runs_status_idx").on(table.status)]);

/** Facetas DataJud agregadas por órgão e município RMBH, com alias de tribunal preservado. */
export const metropolitanJudgingBodyFacets = mysqlTable("metropolitan_judging_body_facets", {
  id: int("id").autoincrement().primaryKey(),
  runId: int("runId").notNull(),
  tribunalAlias: varchar("tribunalAlias", { length: 64 }).notNull(),
  municipalityName: varchar("municipalityName", { length: 128 }).notNull(),
  municipalityIbgeCode: varchar("municipalityIbgeCode", { length: 16 }).notNull(),
  judgingBodyCode: varchar("judgingBodyCode", { length: 64 }).notNull(),
  judgingBodyLabel: varchar("judgingBodyLabel", { length: 500 }).notNull(),
  amount: int("amount").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [
  uniqueIndex("metropolitan_body_facet_unique").on(table.runId, table.tribunalAlias, table.municipalityIbgeCode, table.judgingBodyCode),
  index("metropolitan_body_facet_municipality_idx").on(table.municipalityIbgeCode),
  index("metropolitan_body_facet_alias_idx").on(table.tribunalAlias),
]);

export const legalTheses = mysqlTable("legal_theses", {
  id: int("id").autoincrement().primaryKey(),
  topicId: int("topicId").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  position: mysqlEnum("position", ["favoravel", "contraria", "condicionada", "em_debate"]).notNull(),
  description: text("description").notNull(),
  legalBasis: text("legalBasis"),
  proofNotes: text("proofNotes"),
  adverseFacts: text("adverseFacts"),
  sourceStatus: mysqlEnum("sourceStatus", ["official_confirmed", "attachment_reviewed", "editorial_review", "secondary_pending"]).default("editorial_review").notNull(),
  lastReviewedAt: timestamp("lastReviewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [index("legal_theses_topic_idx").on(table.topicId), index("legal_theses_position_idx").on(table.position)]);

export const ingestionBatches = mysqlTable("ingestion_batches", {
  id: int("id").autoincrement().primaryKey(),
  batchKey: varchar("batchKey", { length: 191 }).notNull().unique(),
  sourceLabel: varchar("sourceLabel", { length: 255 }).notNull(),
  sourceHash: varchar("sourceHash", { length: 64 }),
  status: mysqlEnum("status", ["planned", "reviewed", "imported", "partial", "rejected"]).notNull(),
  itemsDiscovered: int("itemsDiscovered").default(0).notNull(),
  itemsImported: int("itemsImported").default(0).notNull(),
  itemsExcluded: int("itemsExcluded").default(0).notNull(),
  method: text("method").notNull(),
  note: text("note"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [index("ingestion_batches_status_idx").on(table.status)]);

export const jurisprudenceRecords = mysqlTable("jurisprudence_records", {
  id: int("id").autoincrement().primaryKey(),
  externalId: varchar("externalId", { length: 191 }).notNull().unique(),
  batchId: int("batchId").notNull(),
  sourceId: int("sourceId").notNull(),
  cnjNumber: varchar("cnjNumber", { length: 80 }),
  tribunal: varchar("tribunal", { length: 64 }).notNull(),
  justice: varchar("justice", { length: 64 }).notNull(),
  city: varchar("city", { length: 128 }),
  comarca: varchar("comarca", { length: 128 }),
  court: varchar("court", { length: 255 }),
  judgingBody: varchar("judgingBody", { length: 255 }),
  decisionType: varchar("decisionType", { length: 64 }).notNull(),
  decisionDate: timestamp("decisionDate"),
  publicationDate: timestamp("publicationDate"),
  legalArea: varchar("legalArea", { length: 255 }),
  theme: varchar("theme", { length: 500 }),
  outcomeOrigin: varchar("outcomeOrigin", { length: 255 }),
  outcomeAppeal: varchar("outcomeAppeal", { length: 255 }),
  dispositionType: varchar("dispositionType", { length: 255 }),
  moralDamageValue: varchar("moralDamageValue", { length: 64 }),
  reasoningSummary: text("reasoningSummary"),
  validationNote: text("validationNote"),
  sourceStatus: mysqlEnum("sourceStatus", ["official_confirmed", "official_without_number", "attachment_reviewed", "secondary_pending", "movement_observed", "search_thematic"]).notNull(),
  recordVersion: int("recordVersion").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [
  index("jurisprudence_tribunal_idx").on(table.tribunal),
  index("jurisprudence_city_idx").on(table.city),
  index("jurisprudence_theme_idx").on(table.theme),
  index("jurisprudence_status_idx").on(table.sourceStatus),
]);

/** Fila de revisão humana de registros já catalogados; decisões anteriores permanecem nos eventos de auditoria. */
export const evidenceReviewItems = mysqlTable("evidence_review_items", {
  id: int("id").autoincrement().primaryKey(),
  jurisprudenceId: int("jurisprudenceId").notNull().unique(),
  status: mysqlEnum("status", ["pending", "approved", "rejected", "returned"]).default("pending").notNull(),
  priority: mysqlEnum("priority", ["routine", "elevated", "urgent"]).default("routine").notNull(),
  requestedReason: text("requestedReason").notNull(),
  assignedToUserId: int("assignedToUserId"),
  decisionNote: text("decisionNote"),
  reviewedByUserId: int("reviewedByUserId"),
  reviewedAt: timestamp("reviewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [
  index("evidence_review_status_idx").on(table.status),
  index("evidence_review_priority_idx").on(table.priority),
]);

export const jurisprudenceTopics = mysqlTable("jurisprudence_topics", {
  id: int("id").autoincrement().primaryKey(),
  jurisprudenceId: int("jurisprudenceId").notNull(),
  topicId: int("topicId").notNull(),
  relevance: mysqlEnum("relevance", ["primary", "secondary"]).default("primary").notNull(),
}, table => [
  uniqueIndex("jurisprudence_topics_unique").on(table.jurisprudenceId, table.topicId),
  index("jurisprudence_topics_topic_idx").on(table.topicId),
]);

export const thesisAuthorities = mysqlTable("thesis_authorities", {
  id: int("id").autoincrement().primaryKey(),
  thesisId: int("thesisId").notNull(),
  jurisprudenceId: int("jurisprudenceId").notNull(),
  stance: mysqlEnum("stance", ["supports", "opposes", "context"]).notNull(),
  note: text("note"),
}, table => [
  uniqueIndex("thesis_authorities_unique").on(table.thesisId, table.jurisprudenceId),
  index("thesis_authorities_thesis_idx").on(table.thesisId),
]);

export const auditEvents = mysqlTable("audit_events", {
  id: int("id").autoincrement().primaryKey(),
  entityType: varchar("entityType", { length: 64 }).notNull(),
  entityKey: varchar("entityKey", { length: 191 }).notNull(),
  action: varchar("action", { length: 128 }).notNull(),
  sourceStatus: varchar("sourceStatus", { length: 64 }),
  actorLabel: varchar("actorLabel", { length: 128 }).notNull(),
  note: text("note"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [index("audit_events_entity_idx").on(table.entityType, table.entityKey)]);
