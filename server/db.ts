import { and, asc, desc, eq, gte, inArray, like, lte, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { evidenceSources, ingestionBatches, InsertUser, jurisprudenceRecords, jurisprudenceTopics, legalTheses, legalTopics, nationalCensusFacets, nationalCensusMetrics, nationalCensusRuns, publicDataSources, users } from "../drizzle/schema";
import { getNationalDistributionStatus, normalizeNationalCensusFilter, summarizeNationalCensusReadiness, type NationalCensusFilter } from "./national-census";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getPublicDataSources() {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  return db.select().from(publicDataSources).orderBy(asc(publicDataSources.label));
}

export async function getNationalCensusReadiness() {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const [runs, metricCount] = await Promise.all([
    db.select().from(nationalCensusRuns).orderBy(desc(nationalCensusRuns.createdAt)),
    db.select({ count: sql<number>`count(*)` }).from(nationalCensusMetrics),
  ]);
  return summarizeNationalCensusReadiness(runs, Number(metricCount[0]?.count ?? 0));
}

export async function getNationalCensusOverview(input: NationalCensusFilter = {}) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const readiness = await getNationalCensusReadiness();
  const filter = normalizeNationalCensusFilter(input);
  const runId = readiness.latest?.id;
  if (!runId) return { readiness, filter, distributionStatus: getNationalDistributionStatus(readiness), monthly: [], tribunals: [], availableTribunals: [], rows: [], subjects: [], judgingBodies: [] };
  const conditions = [eq(nationalCensusMetrics.runId, runId), eq(nationalCensusMetrics.metric, "distribution")];
  if (filter.from) conditions.push(gte(nationalCensusMetrics.month, filter.from));
  if (filter.to) conditions.push(lte(nationalCensusMetrics.month, filter.to));
  if (filter.tribunalAlias) conditions.push(eq(nationalCensusMetrics.tribunalAlias, filter.tribunalAlias));
  const condition = and(...conditions);
  const baseCondition = and(eq(nationalCensusMetrics.runId, runId), eq(nationalCensusMetrics.metric, "distribution"));
  const [monthly, tribunals, availableTribunals, rows, subjects, judgingBodies] = await Promise.all([
    db.select({ month: nationalCensusMetrics.month, amount: sql<number>`sum(${nationalCensusMetrics.amount})` }).from(nationalCensusMetrics).where(condition).groupBy(nationalCensusMetrics.month).orderBy(asc(nationalCensusMetrics.month)),
    db.select({ alias: nationalCensusMetrics.tribunalAlias, uf: nationalCensusMetrics.uf, amount: sql<number>`sum(${nationalCensusMetrics.amount})` }).from(nationalCensusMetrics).where(condition).groupBy(nationalCensusMetrics.tribunalAlias, nationalCensusMetrics.uf).orderBy(desc(sql`sum(${nationalCensusMetrics.amount})`)).limit(10),
    db.select({ alias: nationalCensusMetrics.tribunalAlias, uf: nationalCensusMetrics.uf }).from(nationalCensusMetrics).where(baseCondition).groupBy(nationalCensusMetrics.tribunalAlias, nationalCensusMetrics.uf).orderBy(asc(nationalCensusMetrics.tribunalAlias)),
    db.select({ alias: nationalCensusMetrics.tribunalAlias, uf: nationalCensusMetrics.uf, month: nationalCensusMetrics.month, amount: nationalCensusMetrics.amount }).from(nationalCensusMetrics).where(condition).orderBy(asc(nationalCensusMetrics.month), asc(nationalCensusMetrics.tribunalAlias)),
    db.select({ code: nationalCensusFacets.code, label: nationalCensusFacets.label, amount: nationalCensusFacets.amount }).from(nationalCensusFacets).where(and(eq(nationalCensusFacets.runId, runId), eq(nationalCensusFacets.kind, "subject"))).orderBy(desc(nationalCensusFacets.amount)).limit(12),
    db.select({ code: nationalCensusFacets.code, label: nationalCensusFacets.label, amount: nationalCensusFacets.amount }).from(nationalCensusFacets).where(and(eq(nationalCensusFacets.runId, runId), eq(nationalCensusFacets.kind, "judging_body"))).orderBy(desc(nationalCensusFacets.amount)).limit(12),
  ]);
  return {
    readiness,
    filter,
    distributionStatus: getNationalDistributionStatus(readiness),
    monthly: monthly.map(row => ({ month: row.month, amount: Number(row.amount ?? 0) })),
    tribunals: tribunals.map(row => ({ alias: row.alias, uf: row.uf, amount: Number(row.amount ?? 0) })),
    availableTribunals,
    rows: rows.map(row => ({ alias: row.alias, uf: row.uf, month: row.month, amount: Number(row.amount ?? 0) })),
    subjects: subjects.map(row => ({ code: row.code, label: row.label, amount: Number(row.amount ?? 0) })),
    judgingBodies: judgingBodies.map(row => ({ code: row.code, label: row.label, amount: Number(row.amount ?? 0) })),
  };
}

export async function getCompendiumOverview() {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const [topics, theses, batches, decisionCounts, officialSourceCounts, sourceCounts, tribunals, cities, legalAreas, sourceStatuses] = await Promise.all([
    db.select().from(legalTopics).orderBy(asc(legalTopics.pathKey)),
    db.select().from(legalTheses).orderBy(desc(legalTheses.updatedAt)),
    db.select().from(ingestionBatches).orderBy(desc(ingestionBatches.createdAt)),
    db.select({ count: sql<number>`count(*)` }).from(jurisprudenceRecords),
    db.select({ count: sql<number>`count(*)` }).from(evidenceSources).where(eq(evidenceSources.publicStatus, "official_confirmed")),
    db.select({ count: sql<number>`count(*)` }).from(evidenceSources),
    db.select({ value: jurisprudenceRecords.tribunal }).from(jurisprudenceRecords).groupBy(jurisprudenceRecords.tribunal),
    db.select({ value: jurisprudenceRecords.city }).from(jurisprudenceRecords).where(sql`${jurisprudenceRecords.city} is not null`).groupBy(jurisprudenceRecords.city),
    db.select({ value: jurisprudenceRecords.legalArea }).from(jurisprudenceRecords).where(sql`${jurisprudenceRecords.legalArea} is not null`).groupBy(jurisprudenceRecords.legalArea),
    db.select({ value: jurisprudenceRecords.sourceStatus }).from(jurisprudenceRecords).groupBy(jurisprudenceRecords.sourceStatus),
  ]);
  return {
    topics,
    theses,
    batches,
    metrics: {
      decisionCount: Number(decisionCounts[0]?.count ?? 0),
      officialSourceCount: Number(officialSourceCounts[0]?.count ?? 0),
      sourceCount: Number(sourceCounts[0]?.count ?? 0),
    },
    facets: {
      tribunals: tribunals.map(row => row.value).filter((value): value is string => Boolean(value)),
      cities: cities.map(row => row.value).filter((value): value is string => Boolean(value)),
      legalAreas: legalAreas.map(row => row.value).filter((value): value is string => Boolean(value)),
      sourceStatuses: sourceStatuses.map(row => row.value),
    },
  };
}

export type CompendiumSearchInput = {
  query?: string;
  tribunal?: string;
  city?: string;
  legalArea?: string;
  sourceStatus?: "official_confirmed" | "official_without_number" | "attachment_reviewed" | "secondary_pending" | "movement_observed" | "search_thematic";
  page?: number;
  pageSize?: number;
};

export async function searchCompendium(input: CompendiumSearchInput) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const query = input.query?.trim() ?? "";
  const page = Math.max(0, input.page ?? 0);
  const pageSize = Math.min(50, Math.max(1, input.pageSize ?? 12));
  const conditions = [];
  if (query) {
    const pattern = `%${query}%`;
    conditions.push(or(like(jurisprudenceRecords.theme, pattern), like(jurisprudenceRecords.reasoningSummary, pattern), like(jurisprudenceRecords.tribunal, pattern), like(jurisprudenceRecords.city, pattern), like(jurisprudenceRecords.cnjNumber, pattern)));
  }
  if (input.tribunal) conditions.push(eq(jurisprudenceRecords.tribunal, input.tribunal));
  if (input.city) conditions.push(eq(jurisprudenceRecords.city, input.city));
  if (input.legalArea) conditions.push(eq(jurisprudenceRecords.legalArea, input.legalArea));
  if (input.sourceStatus) conditions.push(eq(jurisprudenceRecords.sourceStatus, input.sourceStatus));
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  const [totalRows, decisions] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(jurisprudenceRecords).where(whereClause),
    db.select().from(jurisprudenceRecords).where(whereClause).orderBy(desc(jurisprudenceRecords.decisionDate)).limit(pageSize).offset(page * pageSize),
  ]);
  const decisionIds = decisions.map(decision => decision.id);
  const sourceIds = Array.from(new Set(decisions.map(decision => decision.sourceId)));
  const [sources, topicLinks] = await Promise.all([
    sourceIds.length > 0 ? db.select().from(evidenceSources).where(inArray(evidenceSources.id, sourceIds)) : Promise.resolve([]),
    decisionIds.length > 0 ? db.select().from(jurisprudenceTopics).where(inArray(jurisprudenceTopics.jurisprudenceId, decisionIds)) : Promise.resolve([]),
  ]);
  return { decisions, sources, topicLinks, total: Number(totalRows[0]?.count ?? 0), page, pageSize };
}
