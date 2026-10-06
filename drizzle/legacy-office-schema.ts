import { index, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

// ---------------------------------------------------------------------------
// Tabelas legadas preservadas até migração segura dos dados reais.
// Não há rotas ou serviços do Atlas que leiam ou escrevam estes registros.
// ---------------------------------------------------------------------------

/** Clientes do escritório. */
export const officeClients = mysqlTable("office_clients", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 191 }).notNull(),
  document: varchar("document", { length: 32 }),
  email: varchar("email", { length: 191 }),
  phone: varchar("phone", { length: 32 }),
  note: text("note"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [index("office_clients_name_idx").on(table.name)]);

/** Matérias/casos por cliente, com vínculo opcional a processo CNJ. */
export const officeMatters = mysqlTable("office_matters", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  cnjNumber: varchar("cnjNumber", { length: 32 }),
  area: varchar("area", { length: 128 }),
  status: mysqlEnum("status", ["ativo", "suspenso", "arquivado", "encerrado"]).default("ativo").notNull(),
  note: text("note"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [
  index("office_matters_client_idx").on(table.clientId),
  index("office_matters_cnj_idx").on(table.cnjNumber),
]);

/** Atendimentos registrados por cliente/matéria. */
export const officeAttendances = mysqlTable("office_attendances", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  matterId: int("matterId"),
  occurredAt: timestamp("occurredAt").defaultNow().notNull(),
  channel: varchar("channel", { length: 64 }).default("presencial").notNull(),
  summary: text("summary").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [index("office_attendances_client_idx").on(table.clientId)]);

/** Caixa de comunicações (DJEN automático + registro manual), LGPD desde a origem. */
export const officeCommunications = mysqlTable("office_communications", {
  id: int("id").autoincrement().primaryKey(),
  cnjNumber: varchar("cnjNumber", { length: 32 }),
  kind: varchar("kind", { length: 32 }).default("outro").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["nova", "lida", "arquivada"]).default("nova").notNull(),
  channel: varchar("channel", { length: 64 }).default("manual").notNull(),
  sourceKey: varchar("sourceKey", { length: 191 }),
  sourceExternalId: varchar("sourceExternalId", { length: 191 }).unique(),
  receivedAt: timestamp("receivedAt").defaultNow().notNull(),
  deadlineAt: timestamp("deadlineAt"),
  deadlineDays: int("deadlineDays"),
  matterId: int("matterId"),
  content: text("content"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [
  index("office_communications_status_idx").on(table.status),
  index("office_communications_cnj_idx").on(table.cnjNumber),
  index("office_communications_received_idx").on(table.receivedAt),
]);

/** Configuração única do Conector DJEN (linha única id=1). */
export const officeDjenSettings = mysqlTable("office_djen_settings", {
  id: int("id").autoincrement().primaryKey(),
  enabled: int("enabled").default(1).notNull(),
  lawyerName: varchar("lawyerName", { length: 120 }),
  oabNumber: varchar("oabNumber", { length: 16 }),
  oabUf: varchar("oabUf", { length: 2 }),
  tribunal: varchar("tribunal", { length: 64 }).default("TJMG").notNull(),
  autoSyncEnabled: int("autoSyncEnabled").default(1).notNull(),
  intervalMinutes: int("intervalMinutes").default(180).notNull(),
  windowDays: int("windowDays").default(10).notNull(),
  defaultDeadlineDays: int("defaultDeadlineDays").default(15).notNull(),
  lastSyncAt: timestamp("lastSyncAt"),
  lastSyncStatus: mysqlEnum("lastSyncStatus", ["never", "success", "partial", "failed", "not_configured"]).default("never").notNull(),
  lastSyncMessage: varchar("lastSyncMessage", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** Acervo de jurisprudência do escritório (STJ/LexML automáticos + registro manual TJMG). */
export const officeJurisprudencia = mysqlTable("office_jurisprudencia", {
  id: int("id").autoincrement().primaryKey(),
  externalId: varchar("externalId", { length: 191 }).notNull().unique(),
  provider: varchar("provider", { length: 64 }).notNull(),
  tribunal: varchar("tribunal", { length: 64 }).notNull(),
  orgao: varchar("orgao", { length: 128 }),
  cnjNumber: varchar("cnjNumber", { length: 32 }),
  ementa: text("ementa").notNull(),
  url: varchar("url", { length: 1024 }),
  decisionDate: varchar("decisionDate", { length: 10 }),
  status: mysqlEnum("status", ["nova", "destacada", "aplicada", "descartada"]).default("nova").notNull(),
  matterId: int("matterId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [
  index("office_juris_status_idx").on(table.status),
  index("office_juris_tribunal_idx").on(table.tribunal),
]);

/** Configuração única do conector de jurisprudência (linha única id=1). */
export const officeJurisprudenciaSettings = mysqlTable("office_jurisprudencia_settings", {
  id: int("id").autoincrement().primaryKey(),
  enabled: int("enabled").default(1).notNull(),
  query: varchar("query", { length: 160 }).default("consumidor boa fe").notNull(),
  lexmlEndpoint: varchar("lexmlEndpoint", { length: 512 }).default("http://lexml.gov.br/busca/sru").notNull(),
  maxItems: int("maxItems").default(5).notNull(),
  autoSyncEnabled: int("autoSyncEnabled").default(1).notNull(),
  intervalMinutes: int("intervalMinutes").default(240).notNull(),
  lastSyncAt: timestamp("lastSyncAt"),
  lastSyncState: varchar("lastSyncState", { length: 500 }),
  lastSyncStatus: mysqlEnum("lastSyncStatus", ["never", "success", "partial", "failed"]).default("never").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
