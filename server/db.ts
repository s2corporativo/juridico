import { asc, desc, eq, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { evidenceSources, ingestionBatches, InsertUser, jurisprudenceRecords, jurisprudenceTopics, legalTheses, legalTopics, users } from "../drizzle/schema";
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

export async function getCompendiumOverview() {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const [topics, theses, decisions, sources, batches] = await Promise.all([
    db.select().from(legalTopics).orderBy(asc(legalTopics.pathKey)),
    db.select().from(legalTheses).orderBy(desc(legalTheses.updatedAt)),
    db.select().from(jurisprudenceRecords).orderBy(desc(jurisprudenceRecords.decisionDate)),
    db.select().from(evidenceSources).orderBy(desc(evidenceSources.createdAt)),
    db.select().from(ingestionBatches).orderBy(desc(ingestionBatches.createdAt)),
  ]);
  const topicLinks = await db.select().from(jurisprudenceTopics);
  return { topics, theses, decisions, sources, batches, topicLinks };
}

export async function searchCompendium(rawQuery: string) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const query = rawQuery.trim();
  if (!query) return { topics: [], decisions: [], theses: [] };
  const pattern = `%${query}%`;
  const [topics, decisions, theses] = await Promise.all([
    db.select().from(legalTopics).where(or(like(legalTopics.title, pattern), like(legalTopics.summary, pattern))).limit(30),
    db.select().from(jurisprudenceRecords).where(or(like(jurisprudenceRecords.theme, pattern), like(jurisprudenceRecords.reasoningSummary, pattern), like(jurisprudenceRecords.tribunal, pattern))).limit(30),
    db.select().from(legalTheses).where(or(like(legalTheses.title, pattern), like(legalTheses.description, pattern))).limit(30),
  ]);
  return { topics, decisions, theses };
}
