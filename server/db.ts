import { and, asc, desc, eq, gte, inArray, like, lte, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { auditEvents, editorialUpdates, editorialUpdateRuns, evidenceReviewItems, evidenceSources, ingestionBatches, InsertUser, jurisprudenceRecords, jurisprudenceTopics, legalTheses, legalTopics, metropolitanCoverageRuns, metropolitanJudgingBodyFacets, rmbhCivilConsumerMetrics, rmbhCivilConsumerRuns, editorialUpdateSchedules, nationalCensusFacets, nationalCensusMetrics, nationalCensusRuns, publicDataSources, thesisAuthorities, users } from "../drizzle/schema";
import { getNationalDistributionStatus, normalizeNationalCensusFilter, selectNationalCensusRun, summarizeNationalCensusReadiness, type NationalCensusFilter } from "./national-census";
import { validateReviewDecision, validateReviewRequest, type ReviewDecision, type ReviewPriority } from "./evidence-review";
import { calculateAverageEvidenceScore, calculateEvidenceQuality, calculateThesisQuality, summarizeEvidenceCoverage } from "@shared/evidence-quality";
import { isSafePublicCitationAuditEvent, PUBLIC_CITATION_AUDIT_ENTITY_TYPE } from "./compendium.utils";
import { ENV } from './_core/env';
import { INITIAL_LEGAL_BRANCHES, RMBH_MUNICIPALITIES } from "@shared/atlas-expansion";
import { buildMetropolitanCoverageRows } from "@shared/metropolitan-coverage";
import { describeDocumentFreshness, summarizeDocumentFreshness } from "@shared/document-freshness";
import { THESIS_MAP_RELATED_LIMIT } from "@shared/thesis-map-contract";

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
  const runs = await db.select().from(nationalCensusRuns).orderBy(desc(nationalCensusRuns.createdAt));
  const nationalRun = selectNationalCensusRun(runs);
  if (!nationalRun?.id) return summarizeNationalCensusReadiness([], 0);
  const metricCount = await db.select({ count: sql<number>`count(*)` }).from(nationalCensusMetrics).where(eq(nationalCensusMetrics.runId, nationalRun.id));
  return summarizeNationalCensusReadiness([nationalRun], Number(metricCount[0]?.count ?? 0));
}

export async function getNationalCensusOverview(input: NationalCensusFilter = {}) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const readiness = await getNationalCensusReadiness();
  const filter = normalizeNationalCensusFilter(input);
  const runId = readiness.latest?.id;
  if (!runId) return { readiness, filter, distributionStatus: getNationalDistributionStatus(readiness), monthly: [], tribunals: [], availableTribunals: [], rows: [], subjects: [], judgingBodies: [], comarcaHighlights: [] };
  const conditions = [eq(nationalCensusMetrics.runId, runId), eq(nationalCensusMetrics.metric, "distribution")];
  if (filter.from) conditions.push(gte(nationalCensusMetrics.month, filter.from));
  if (filter.to) conditions.push(lte(nationalCensusMetrics.month, filter.to));
  if (filter.tribunalAlias) conditions.push(eq(nationalCensusMetrics.tribunalAlias, filter.tribunalAlias));
  const condition = and(...conditions);
  const baseCondition = and(eq(nationalCensusMetrics.runId, runId), eq(nationalCensusMetrics.metric, "distribution"));
  const [monthly, tribunals, availableTribunals, rows, subjects, judgingBodies, comarcaHighlights] = await Promise.all([
    db.select({ month: nationalCensusMetrics.month, amount: sql<number>`sum(${nationalCensusMetrics.amount})` }).from(nationalCensusMetrics).where(condition).groupBy(nationalCensusMetrics.month).orderBy(asc(nationalCensusMetrics.month)),
    db.select({ alias: nationalCensusMetrics.tribunalAlias, uf: nationalCensusMetrics.uf, amount: sql<number>`sum(${nationalCensusMetrics.amount})` }).from(nationalCensusMetrics).where(condition).groupBy(nationalCensusMetrics.tribunalAlias, nationalCensusMetrics.uf).orderBy(desc(sql`sum(${nationalCensusMetrics.amount})`)).limit(10),
    db.select({ alias: nationalCensusMetrics.tribunalAlias, uf: nationalCensusMetrics.uf }).from(nationalCensusMetrics).where(baseCondition).groupBy(nationalCensusMetrics.tribunalAlias, nationalCensusMetrics.uf).orderBy(asc(nationalCensusMetrics.tribunalAlias)),
    db.select({ alias: nationalCensusMetrics.tribunalAlias, uf: nationalCensusMetrics.uf, month: nationalCensusMetrics.month, amount: nationalCensusMetrics.amount }).from(nationalCensusMetrics).where(condition).orderBy(asc(nationalCensusMetrics.month), asc(nationalCensusMetrics.tribunalAlias)),
    db.select({ code: nationalCensusFacets.code, label: nationalCensusFacets.label, amount: nationalCensusFacets.amount }).from(nationalCensusFacets).where(and(eq(nationalCensusFacets.runId, runId), eq(nationalCensusFacets.kind, "subject"))).orderBy(desc(nationalCensusFacets.amount)).limit(12),
    db.select({ code: nationalCensusFacets.code, label: nationalCensusFacets.label, amount: nationalCensusFacets.amount }).from(nationalCensusFacets).where(and(eq(nationalCensusFacets.runId, runId), eq(nationalCensusFacets.kind, "judging_body"))).orderBy(desc(nationalCensusFacets.amount)).limit(12),
    db.select({ code: nationalCensusFacets.code, label: nationalCensusFacets.label, amount: nationalCensusFacets.amount }).from(nationalCensusFacets).where(and(eq(nationalCensusFacets.runId, runId), eq(nationalCensusFacets.kind, "judging_body"), inArray(nationalCensusFacets.code, ["40011", "8161"]))).orderBy(desc(nationalCensusFacets.amount)),
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
    comarcaHighlights: comarcaHighlights.map(row => ({ code: row.code, label: row.label, amount: Number(row.amount ?? 0) })),
  };
}

/** Cobertura territorial TJMG com alias e município preservados; não é censo municipal de processos. */
export async function getMetropolitanCoverageOverview() {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const runs = await db.select().from(metropolitanCoverageRuns).where(eq(metropolitanCoverageRuns.tribunalAlias, "tjmg")).orderBy(desc(metropolitanCoverageRuns.createdAt));
  const latest = runs.find(run => run.status === "completed") ?? runs[0];
  if (!latest?.id) {
    return {
      readiness: { state: "unavailable" as const, expectedMunicipalities: RMBH_MUNICIPALITIES.length, mappedMunicipalities: 0, totalBodies: 0, facetAmount: 0 },
      municipalities: buildMetropolitanCoverageRows(RMBH_MUNICIPALITIES, []),
      legalBranches: INITIAL_LEGAL_BRANCHES,
    };
  }
  const facets = await db.select({
    municipalityName: metropolitanJudgingBodyFacets.municipalityName,
    municipalityIbgeCode: metropolitanJudgingBodyFacets.municipalityIbgeCode,
    judgingBodyCode: metropolitanJudgingBodyFacets.judgingBodyCode,
    judgingBodyLabel: metropolitanJudgingBodyFacets.judgingBodyLabel,
    amount: metropolitanJudgingBodyFacets.amount,
  }).from(metropolitanJudgingBodyFacets).where(eq(metropolitanJudgingBodyFacets.runId, latest.id)).orderBy(asc(metropolitanJudgingBodyFacets.municipalityName), desc(metropolitanJudgingBodyFacets.amount));
  const municipalities = buildMetropolitanCoverageRows(RMBH_MUNICIPALITIES, facets.map(facet => ({ ...facet, amount: Number(facet.amount ?? 0) })));
  return {
    readiness: {
      state: latest.status,
      runKey: latest.runKey,
      sourceKey: latest.sourceKey,
      tribunalAlias: latest.tribunalAlias,
      periodStart: latest.periodStart,
      periodEnd: latest.periodEnd,
      expectedMunicipalities: latest.expectedMunicipalities,
      mappedMunicipalities: latest.mappedMunicipalities,
      totalBodies: facets.length,
      facetAmount: facets.reduce((sum, facet) => sum + Number(facet.amount ?? 0), 0),
      coverageNote: latest.coverageNote,
    },
    municipalities,
    legalBranches: INITIAL_LEGAL_BRANCHES,
  };
}

export async function getRmbhCivilConsumerOverview(input: { from?: string; to?: string; municipalityIbgeCode?: string } = {}) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const runs = await db.select().from(rmbhCivilConsumerRuns).orderBy(desc(rmbhCivilConsumerRuns.createdAt));
  const latest = runs.find(run => run.status === "completed") ?? runs[0];
  const empty = { readiness: { state: "not_started" as const, runKey: null, sourceKey: null, periodStart: null, periodEnd: null, subjectTreeVersion: null, coverageNote: "Ainda não há execução temática concluída." }, filter: input, categories: [], monthly: [], municipalities: [], bodies: [], total: 0 };
  if (!latest?.id) return empty;
  const conditions = [eq(rmbhCivilConsumerMetrics.runId, latest.id)];
  if (input.from) conditions.push(gte(rmbhCivilConsumerMetrics.month, input.from));
  if (input.to) conditions.push(lte(rmbhCivilConsumerMetrics.month, input.to));
  if (input.municipalityIbgeCode) conditions.push(eq(rmbhCivilConsumerMetrics.municipalityIbgeCode, input.municipalityIbgeCode));
  const condition = and(...conditions);
  const [categories, monthly, municipalities, bodies] = await Promise.all([
    db.select({ code: rmbhCivilConsumerMetrics.categoryCode, label: rmbhCivilConsumerMetrics.categoryLabel, amount: sql<number>`sum(${rmbhCivilConsumerMetrics.amount})` }).from(rmbhCivilConsumerMetrics).where(condition).groupBy(rmbhCivilConsumerMetrics.categoryCode, rmbhCivilConsumerMetrics.categoryLabel).orderBy(desc(sql`sum(${rmbhCivilConsumerMetrics.amount})`)),
    db.select({ month: rmbhCivilConsumerMetrics.month, amount: sql<number>`sum(${rmbhCivilConsumerMetrics.amount})` }).from(rmbhCivilConsumerMetrics).where(condition).groupBy(rmbhCivilConsumerMetrics.month).orderBy(asc(rmbhCivilConsumerMetrics.month)),
    db.select({ municipalityIbgeCode: rmbhCivilConsumerMetrics.municipalityIbgeCode, municipalityName: rmbhCivilConsumerMetrics.municipalityName, amount: sql<number>`sum(${rmbhCivilConsumerMetrics.amount})` }).from(rmbhCivilConsumerMetrics).where(condition).groupBy(rmbhCivilConsumerMetrics.municipalityIbgeCode, rmbhCivilConsumerMetrics.municipalityName).orderBy(desc(sql`sum(${rmbhCivilConsumerMetrics.amount})`)),
    db.select({ judgingBodyCode: rmbhCivilConsumerMetrics.judgingBodyCode, judgingBodyLabel: rmbhCivilConsumerMetrics.judgingBodyLabel, municipalityName: rmbhCivilConsumerMetrics.municipalityName, amount: sql<number>`sum(${rmbhCivilConsumerMetrics.amount})` }).from(rmbhCivilConsumerMetrics).where(condition).groupBy(rmbhCivilConsumerMetrics.judgingBodyCode, rmbhCivilConsumerMetrics.judgingBodyLabel, rmbhCivilConsumerMetrics.municipalityName).orderBy(desc(sql`sum(${rmbhCivilConsumerMetrics.amount})`)),
  ]);
  return {
    readiness: { state: latest.status, runKey: latest.runKey, sourceKey: latest.sourceKey, periodStart: latest.periodStart, periodEnd: latest.periodEnd, subjectTreeVersion: latest.subjectTreeVersion, termsCount: latest.termsCount, coverageNote: latest.coverageNote },
    filter: input,
    categories: categories.map(row => ({ ...row, amount: Number(row.amount ?? 0) })),
    monthly: monthly.map(row => ({ ...row, amount: Number(row.amount ?? 0) })),
    municipalities: municipalities.map(row => ({ ...row, amount: Number(row.amount ?? 0) })),
    bodies: bodies.map(row => ({ ...row, amount: Number(row.amount ?? 0) })),
    total: categories.reduce((sum, row) => sum + Number(row.amount ?? 0), 0),
  };
}

export async function getEditorialUpdateQueue(input: { status?: "pending_review" | "approved" | "rejected" | "superseded"; kind?: "jurisprudence" | "legislation" | "official_update" } = {}) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const conditions = [];
  if (input.status) conditions.push(eq(editorialUpdates.status, input.status));
  if (input.kind) conditions.push(eq(editorialUpdates.kind, input.kind));
  const rows = await db.select({ id: editorialUpdates.id, sourceKey: editorialUpdates.sourceKey, externalKey: editorialUpdates.externalKey, kind: editorialUpdates.kind, title: editorialUpdates.title, summary: editorialUpdates.summary, canonicalUrl: editorialUpdates.canonicalUrl, publishedAt: editorialUpdates.publishedAt, status: editorialUpdates.status, createdAt: editorialUpdates.createdAt, reviewNote: editorialUpdates.reviewNote }).from(editorialUpdates).where(conditions.length ? and(...conditions) : undefined).orderBy(desc(editorialUpdates.createdAt)).limit(100);
  return rows;
}

export async function getPublicEditorialUpdates() {
  return getEditorialUpdateQueue({ status: "approved" });
}

export async function decideEditorialUpdate(id: number, decision: "approved" | "rejected" | "superseded", reviewNote: string, reviewedByUserId: number) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  await db.update(editorialUpdates).set({ status: decision, reviewNote, reviewedByUserId, reviewedAt: new Date() }).where(eq(editorialUpdates.id, id));
  await db.insert(auditEvents).values({ entityType: "editorial_update", entityKey: String(id), action: `review_${decision}`, actorLabel: `user:${reviewedByUserId}`, sourceStatus: decision, note: reviewNote });
  return { success: true } as const;
}

export async function getEditorialScheduleByTaskUid(taskUid: string) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const rows = await db.select().from(editorialUpdateSchedules).where(eq(editorialUpdateSchedules.scheduleCronTaskUid, taskUid)).limit(1);
  return rows[0] ?? null;
}

export async function upsertEditorialScheduleTaskUid(name: string, taskUid: string) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  await db.insert(editorialUpdateSchedules).values({ name, cronExpression: "0 0 6 * * *", scheduleCronTaskUid: taskUid, enabled: 1 }).onDuplicateKeyUpdate({ set: { scheduleCronTaskUid: taskUid, enabled: 1 } });
}

export async function recordEditorialRunStart(runKey: string, sourceCount: number) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  await db.insert(editorialUpdateRuns).values({ runKey, status: "running", sourceCount }).onDuplicateKeyUpdate({ set: { status: "running", sourceCount, errorSummary: null } });
  const row = await db.select({ id: editorialUpdateRuns.id }).from(editorialUpdateRuns).where(eq(editorialUpdateRuns.runKey, runKey)).limit(1);
  return row[0]?.id ?? null;
}

export async function finishEditorialRun(runId: number, result: { status: "completed" | "partial" | "failed"; discoveredCount: number; queuedCount: number; failedCount: number; errorSummary?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  await db.update(editorialUpdateRuns).set({ status: result.status, discoveredCount: result.discoveredCount, queuedCount: result.queuedCount, failedCount: result.failedCount, finishedAt: new Date(), errorSummary: result.errorSummary ?? null }).where(eq(editorialUpdateRuns.id, runId));
}

export async function enqueueEditorialCandidates(runId: number, candidates: Array<{ sourceKey: string; externalKey: string; kind: "jurisprudence" | "legislation" | "official_update"; title: string; summary: string; canonicalUrl: string; publishedAt: Date | null; contentHash: string }>) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  let queuedCount = 0;
  for (const item of candidates) {
    const existing = await db.select({ id: editorialUpdates.id }).from(editorialUpdates).where(and(eq(editorialUpdates.sourceKey, item.sourceKey), eq(editorialUpdates.externalKey, item.externalKey))).limit(1);
    if (existing.length) continue;
    await db.insert(editorialUpdates).values({ runId, ...item });
    queuedCount += 1;
  }
  return queuedCount;
}

export async function getCompendiumOverview() {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const [topics, theses, thesisAuthorityCounts, batches, decisionCounts, officialSourceCounts, sourceCounts, tribunals, cities, cityCoverage, legalAreas, sourceStatuses] = await Promise.all([
    db.select().from(legalTopics).orderBy(asc(legalTopics.pathKey)),
    db.select().from(legalTheses).orderBy(desc(legalTheses.updatedAt)),
    db.select({ thesisId: thesisAuthorities.thesisId, count: sql<number>`count(*)` }).from(thesisAuthorities).groupBy(thesisAuthorities.thesisId),
    db.select().from(ingestionBatches).orderBy(desc(ingestionBatches.createdAt)),
    db.select({ count: sql<number>`count(*)` }).from(jurisprudenceRecords),
    db.select({ count: sql<number>`count(*)` }).from(evidenceSources).where(eq(evidenceSources.publicStatus, "official_confirmed")),
    db.select({ count: sql<number>`count(*)` }).from(evidenceSources),
    db.select({ value: jurisprudenceRecords.tribunal }).from(jurisprudenceRecords).groupBy(jurisprudenceRecords.tribunal),
    db.select({ value: jurisprudenceRecords.city }).from(jurisprudenceRecords).where(sql`${jurisprudenceRecords.city} is not null`).groupBy(jurisprudenceRecords.city),
    db.select({ city: jurisprudenceRecords.city, decisionCount: sql<number>`count(*)` }).from(jurisprudenceRecords).where(sql`${jurisprudenceRecords.city} is not null`).groupBy(jurisprudenceRecords.city),
    db.select({ value: jurisprudenceRecords.legalArea }).from(jurisprudenceRecords).where(sql`${jurisprudenceRecords.legalArea} is not null`).groupBy(jurisprudenceRecords.legalArea),
    db.select({ value: jurisprudenceRecords.sourceStatus }).from(jurisprudenceRecords).groupBy(jurisprudenceRecords.sourceStatus),
  ]);
  const authorityCount = new Map(thesisAuthorityCounts.map(row => [row.thesisId, Number(row.count ?? 0)]));
  return {
    topics,
    theses: theses.map(thesis => ({ ...thesis, quality: calculateThesisQuality({ ...thesis, authorityCount: authorityCount.get(thesis.id) ?? 0 }) })),
    batches,
    metrics: {
      decisionCount: Number(decisionCounts[0]?.count ?? 0),
      officialSourceCount: Number(officialSourceCounts[0]?.count ?? 0),
      sourceCount: Number(sourceCounts[0]?.count ?? 0),
      authorityCount: thesisAuthorityCounts.reduce((sum, row) => sum + Number(row.count ?? 0), 0),
    },
    facets: {
      tribunals: tribunals.map(row => row.value).filter((value): value is string => Boolean(value)),
      cities: cities.map(row => row.value).filter((value): value is string => Boolean(value)),
      cityCoverage: cityCoverage.map(row => ({ city: row.city, decisionCount: Number(row.decisionCount ?? 0) })),
      legalAreas: legalAreas.map(row => row.value).filter((value): value is string => Boolean(value)),
      sourceStatuses: sourceStatuses.map(row => row.value),
    },
  };
}

export async function getCompendiumQualityOverview() {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const [records, topicRows, thesisRows] = await Promise.all([
    db.select({ record: jurisprudenceRecords, source: evidenceSources, batch: ingestionBatches })
      .from(jurisprudenceRecords)
      .innerJoin(evidenceSources, eq(jurisprudenceRecords.sourceId, evidenceSources.id))
      .innerJoin(ingestionBatches, eq(jurisprudenceRecords.batchId, ingestionBatches.id)),
    db.select({ jurisprudenceId: jurisprudenceTopics.jurisprudenceId, count: sql<number>`count(*)` }).from(jurisprudenceTopics).groupBy(jurisprudenceTopics.jurisprudenceId),
    db.select({ jurisprudenceId: thesisAuthorities.jurisprudenceId, count: sql<number>`count(*)` }).from(thesisAuthorities).groupBy(thesisAuthorities.jurisprudenceId),
  ]);
  const topicCount = new Map(topicRows.map(row => [row.jurisprudenceId, Number(row.count ?? 0)]));
  const thesisCount = new Map(thesisRows.map(row => [row.jurisprudenceId, Number(row.count ?? 0)]));
  const items = records.map(({ record, source, batch }) => {
    const quality = calculateEvidenceQuality({ sourceStatus: record.sourceStatus, sourceUrl: source.sourceUrl, sourceHash: source.hashSha256, cnjNumber: record.cnjNumber, decisionDate: record.decisionDate, tribunal: record.tribunal, court: record.court, judgingBody: record.judgingBody, validationNote: record.validationNote, topicCount: topicCount.get(record.id) ?? 0, thesisCount: thesisCount.get(record.id) ?? 0, batchStatus: batch.status });
    return { externalId: record.externalId, theme: record.theme, tribunal: record.tribunal, sourceLabel: source.label, sourceStatus: record.sourceStatus, decisionDate: record.decisionDate, quality, hasOfficialUrl: Boolean(source.sourceUrl?.startsWith("https://")) };
  });
  const grouped = new Map<string, { sourceLabel: string; sourceStatus: string; tribunal: string; records: number; officialUrlCount: number; firstDecisionDate: Date | null; lastDecisionDate: Date | null }>();
  for (const item of items) {
    const key = `${item.sourceLabel}|${item.sourceStatus}|${item.tribunal}`;
    const existing = grouped.get(key) ?? { sourceLabel: item.sourceLabel, sourceStatus: item.sourceStatus, tribunal: item.tribunal, records: 0, officialUrlCount: 0, firstDecisionDate: null, lastDecisionDate: null };
    existing.records += 1;
    existing.officialUrlCount += item.hasOfficialUrl ? 1 : 0;
    if (item.decisionDate && (!existing.firstDecisionDate || item.decisionDate < existing.firstDecisionDate)) existing.firstDecisionDate = item.decisionDate;
    if (item.decisionDate && (!existing.lastDecisionDate || item.decisionDate > existing.lastDecisionDate)) existing.lastDecisionDate = item.decisionDate;
    grouped.set(key, existing);
  }
  const coverage = Array.from(grouped.values()).sort((a, b) => b.records - a.records || a.sourceLabel.localeCompare(b.sourceLabel));
  const averageScore = calculateAverageEvidenceScore(items.map(item => item.quality));
  return { items, coverage, summary: { ...summarizeEvidenceCoverage(coverage), averageScore } };
}

/** Situação de verificação documental; não declara vigência, força ou aplicabilidade jurídica. */
export async function getCompendiumFreshnessOverview() {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const [sources, theses] = await Promise.all([
    db.select({ label: evidenceSources.label, lastVerifiedAt: evidenceSources.lastVerifiedAt }).from(evidenceSources).orderBy(asc(evidenceSources.label)),
    db.select({ title: legalTheses.title, lastReviewedAt: legalTheses.lastReviewedAt }).from(legalTheses).orderBy(asc(legalTheses.title)),
  ]);
  const sourceItems = sources.map(source => ({ kind: "source" as const, label: source.label, freshness: describeDocumentFreshness(source.lastVerifiedAt) }));
  const thesisItems = theses.map(thesis => ({ kind: "thesis" as const, label: thesis.title, freshness: describeDocumentFreshness(thesis.lastReviewedAt) }));
  return {
    summary: {
      sources: summarizeDocumentFreshness(sourceItems.map(item => item.freshness)),
      theses: summarizeDocumentFreshness(thesisItems.map(item => item.freshness)),
    },
    items: [...sourceItems, ...thesisItems],
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

export type EvidenceReviewQueueFilter = {
  status?: "pending" | "approved" | "rejected" | "returned";
  priority?: "routine" | "elevated" | "urgent";
  tribunal?: string;
};

export async function getEvidenceReviewQueue(input: EvidenceReviewQueueFilter = {}) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const conditions = [];
  if (input.status) conditions.push(eq(evidenceReviewItems.status, input.status));
  if (input.priority) conditions.push(eq(evidenceReviewItems.priority, input.priority));
  if (input.tribunal) conditions.push(eq(jurisprudenceRecords.tribunal, input.tribunal));
  const condition = conditions.length ? and(...conditions) : undefined;
  return db.select({
    id: evidenceReviewItems.id,
    status: evidenceReviewItems.status,
    priority: evidenceReviewItems.priority,
    requestedReason: evidenceReviewItems.requestedReason,
    decisionNote: evidenceReviewItems.decisionNote,
    reviewedAt: evidenceReviewItems.reviewedAt,
    createdAt: evidenceReviewItems.createdAt,
    externalId: jurisprudenceRecords.externalId,
    tribunal: jurisprudenceRecords.tribunal,
    decisionType: jurisprudenceRecords.decisionType,
    theme: jurisprudenceRecords.theme,
    sourceStatus: jurisprudenceRecords.sourceStatus,
    sourceUrl: evidenceSources.sourceUrl,
  }).from(evidenceReviewItems)
    .innerJoin(jurisprudenceRecords, eq(evidenceReviewItems.jurisprudenceId, jurisprudenceRecords.id))
    .leftJoin(evidenceSources, eq(jurisprudenceRecords.sourceId, evidenceSources.id))
    .where(condition)
    .orderBy(asc(evidenceReviewItems.status), desc(evidenceReviewItems.createdAt));
}

export async function enqueueEvidenceReview(externalId: string, priority: ReviewPriority, requestedReason: string, actorUserId: number) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const reason = validateReviewRequest(requestedReason);
  const [record] = await db.select({ id: jurisprudenceRecords.id }).from(jurisprudenceRecords).where(eq(jurisprudenceRecords.externalId, externalId)).limit(1);
  if (!record) throw new Error("Registro jurisprudencial não encontrado.");
  const existing = await db.select().from(evidenceReviewItems).where(eq(evidenceReviewItems.jurisprudenceId, record.id)).limit(1);
  if (existing[0] && (existing[0].status === "pending" || existing[0].status === "returned")) throw new Error("Este registro já possui revisão ativa.");
  if (existing[0]) {
    await db.update(evidenceReviewItems).set({ status: "pending", priority, requestedReason: reason, decisionNote: null, reviewedAt: null, reviewedByUserId: null }).where(eq(evidenceReviewItems.id, existing[0].id));
  } else {
    await db.insert(evidenceReviewItems).values({ jurisprudenceId: record.id, status: "pending", priority, requestedReason: reason, assignedToUserId: actorUserId });
  }
  await db.insert(auditEvents).values({ entityType: "evidence_review", entityKey: externalId, action: "queued_for_review", sourceStatus: null, actorLabel: "admin", note: reason });
  return { success: true } as const;
}

export async function decideEvidenceReview(reviewId: number, decision: ReviewDecision, decisionNote: string, actorUserId: number) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const [review] = await db.select().from(evidenceReviewItems).where(eq(evidenceReviewItems.id, reviewId)).limit(1);
  if (!review) throw new Error("Item de revisão não encontrado.");
  const checked = validateReviewDecision(review.status, decision, decisionNote);
  await db.update(evidenceReviewItems).set({ status: checked.status, decisionNote: checked.note, reviewedByUserId: actorUserId, reviewedAt: new Date() }).where(eq(evidenceReviewItems.id, reviewId));
  const [record] = await db.select({ externalId: jurisprudenceRecords.externalId, sourceStatus: jurisprudenceRecords.sourceStatus }).from(jurisprudenceRecords).where(eq(jurisprudenceRecords.id, review.jurisprudenceId)).limit(1);
  if (record) await db.insert(auditEvents).values({ entityType: "evidence_review", entityKey: record.externalId, action: `review_${decision}`, sourceStatus: record.sourceStatus, actorLabel: "admin", note: checked.note });
  return { success: true } as const;
}

export async function getThesisRelatedDocuments(thesisId: number) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  return db.select({
    id: jurisprudenceRecords.id,
    externalId: jurisprudenceRecords.externalId,
    title: jurisprudenceRecords.theme,
    tribunal: jurisprudenceRecords.tribunal,
    city: jurisprudenceRecords.city,
    decisionType: jurisprudenceRecords.decisionType,
    decisionDate: jurisprudenceRecords.decisionDate,
    sourceStatus: jurisprudenceRecords.sourceStatus,
    sourceUrl: evidenceSources.sourceUrl,
    stance: thesisAuthorities.stance,
  }).from(thesisAuthorities)
    .innerJoin(jurisprudenceRecords, eq(thesisAuthorities.jurisprudenceId, jurisprudenceRecords.id))
    .innerJoin(evidenceSources, eq(jurisprudenceRecords.sourceId, evidenceSources.id))
    .where(eq(thesisAuthorities.thesisId, thesisId))
    .orderBy(desc(jurisprudenceRecords.decisionDate))
    .limit(THESIS_MAP_RELATED_LIMIT);
}

/** Dados estritamente públicos já exibidos em ficha; usados exclusivamente para síntese assistida. */
export async function getPublicDecisionSummaryInput(externalId: string) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const [record] = await db.select({
    theme: jurisprudenceRecords.theme,
    tribunal: jurisprudenceRecords.tribunal,
    city: jurisprudenceRecords.city,
    decisionType: jurisprudenceRecords.decisionType,
    decisionDate: jurisprudenceRecords.decisionDate,
    legalArea: jurisprudenceRecords.legalArea,
    outcomeOrigin: jurisprudenceRecords.outcomeOrigin,
    outcomeAppeal: jurisprudenceRecords.outcomeAppeal,
    reasoningSummary: jurisprudenceRecords.reasoningSummary,
    sourceStatus: jurisprudenceRecords.sourceStatus,
  }).from(jurisprudenceRecords).where(eq(jurisprudenceRecords.externalId, externalId)).limit(1);
  return record ?? null;
}

export async function getCitationDossier(externalId: string) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const [record] = await db.select({ record: jurisprudenceRecords, source: evidenceSources, batch: ingestionBatches }).from(jurisprudenceRecords)
    .innerJoin(evidenceSources, eq(jurisprudenceRecords.sourceId, evidenceSources.id))
    .innerJoin(ingestionBatches, eq(jurisprudenceRecords.batchId, ingestionBatches.id))
    .where(eq(jurisprudenceRecords.externalId, externalId)).limit(1);
  if (!record) return null;
  const topics = await db.select({ id: legalTopics.id, title: legalTopics.title, pathKey: legalTopics.pathKey, relevance: jurisprudenceTopics.relevance }).from(jurisprudenceTopics)
    .innerJoin(legalTopics, eq(jurisprudenceTopics.topicId, legalTopics.id)).where(eq(jurisprudenceTopics.jurisprudenceId, record.record.id));
  const topicIds = topics.map(topic => topic.id);
  const theses = topicIds.length > 0 ? await db.select().from(legalTheses).where(inArray(legalTheses.topicId, topicIds)) : [];
  const [review, events] = await Promise.all([
    db.select().from(evidenceReviewItems).where(eq(evidenceReviewItems.jurisprudenceId, record.record.id)).limit(1),
    db.select().from(auditEvents).where(and(eq(auditEvents.entityType, PUBLIC_CITATION_AUDIT_ENTITY_TYPE), eq(auditEvents.entityKey, externalId))).orderBy(desc(auditEvents.createdAt)),
  ]);
  return { ...record, topics, theses, review: review[0] ?? null, events: events.filter(isSafePublicCitationAuditEvent) };
}
