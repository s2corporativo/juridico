/**
 * Camada de serviço dos módulos do Escritório: clientes, matérias, atendimentos
 * e caixa de comunicações (DJEN + manual). Gravação sempre com sanitização LGPD
 * herdada do conector e auditoria em audit_events.
 */

import { and, asc, desc, eq, inArray, or, sql } from "drizzle-orm";
import {
  auditEvents,
  officeAttendances,
  officeClients,
  officeCommunications,
  officeMatters,
} from "../drizzle/schema";
import { getDb } from "./db";
import { sanitizeDjenHtml } from "@shared/djen-module";
import { COMUNICACAO_STATUS } from "@shared/office-module";

async function audit(entityType: string, entityKey: string, action: string, note: string) {
  const db = await getDb();
  if (!db) return;
  await db.insert(auditEvents).values({
    entityType,
    entityKey,
    action,
    actorLabel: "office",
    note: note.slice(0, 500),
  });
}

// ---------------------------------------------------------------------------
// Clientes
// ---------------------------------------------------------------------------

export async function listClients() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(officeClients).orderBy(asc(officeClients.name));
}

export async function getClient(id: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(officeClients).where(eq(officeClients.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createClient(input: { name: string; document?: string | null; email?: string | null; phone?: string | null; note?: string | null }) {
  const db = await getDb();
  if (!db) throw new Error("Banco indisponível");
  const [row] = await db
    .insert(officeClients)
    .values({
      name: input.name.trim().slice(0, 191),
      document: input.document?.trim() || null,
      email: input.email?.trim() || null,
      phone: input.phone?.trim() || null,
      note: input.note?.trim() || null,
    })
    .$returningId();
  await audit("office_client", String(row.id), "create", `Cliente ${input.name.trim()} cadastrado`);
  return row.id;
}

export async function updateClient(id: number, input: Partial<{ name: string; document: string | null; email: string | null; phone: string | null; note: string | null }>) {
  const db = await getDb();
  if (!db) throw new Error("Banco indisponível");
  const patch: Record<string, unknown> = {};
  if (input.name !== undefined) patch.name = input.name.trim().slice(0, 191);
  if (input.document !== undefined) patch.document = input.document?.trim() || null;
  if (input.email !== undefined) patch.email = input.email?.trim() || null;
  if (input.phone !== undefined) patch.phone = input.phone?.trim() || null;
  if (input.note !== undefined) patch.note = input.note?.trim() || null;
  if (Object.keys(patch).length > 0) {
    await db.update(officeClients).set(patch).where(eq(officeClients.id, id));
    await audit("office_client", String(id), "update", Object.keys(patch).join(","));
  }
}

// ---------------------------------------------------------------------------
// Matérias
// ---------------------------------------------------------------------------

export async function listMatters(clientId?: number) {
  const db = await getDb();
  if (!db) return [];
  if (clientId) {
    return db.select().from(officeMatters).where(eq(officeMatters.clientId, clientId)).orderBy(desc(officeMatters.updatedAt));
  }
  return db.select().from(officeMatters).orderBy(desc(officeMatters.updatedAt));
}

export async function createMatter(input: { clientId: number; title: string; cnjNumber?: string | null; area?: string | null; note?: string | null }) {
  const db = await getDb();
  if (!db) throw new Error("Banco indisponível");
  const [row] = await db
    .insert(officeMatters)
    .values({
      clientId: input.clientId,
      title: input.title.trim().slice(0, 255),
      cnjNumber: input.cnjNumber?.trim() || null,
      area: input.area?.trim() || null,
      note: input.note?.trim() || null,
    })
    .$returningId();
  await audit("office_matter", String(row.id), "create", input.title.trim());
  return row.id;
}

// ---------------------------------------------------------------------------
// Atendimentos
// ---------------------------------------------------------------------------

export async function listAttendances(clientId?: number) {
  const db = await getDb();
  if (!db) return [];
  if (clientId) {
    return db.select().from(officeAttendances).where(eq(officeAttendances.clientId, clientId)).orderBy(desc(officeAttendances.occurredAt));
  }
  return db.select().from(officeAttendances).orderBy(desc(officeAttendances.occurredAt)).limit(100);
}

export async function createAttendance(input: { clientId: number; matterId?: number | null; occurredAt?: Date | null; channel?: string | null; summary: string }) {
  const db = await getDb();
  if (!db) throw new Error("Banco indisponível");
  const [row] = await db
    .insert(officeAttendances)
    .values({
      clientId: input.clientId,
      matterId: input.matterId ?? null,
      occurredAt: input.occurredAt ?? new Date(),
      channel: (input.channel || "presencial").trim().slice(0, 64),
      summary: input.summary.trim().slice(0, 4000),
    })
    .$returningId();
  await audit("office_attendance", String(row.id), "create", input.summary.trim().slice(0, 120));
  return row.id;
}

// ---------------------------------------------------------------------------
// Comunicações
// ---------------------------------------------------------------------------

export async function listCommunications(status?: "nova" | "lida" | "arquivada") {
  const db = await getDb();
  if (!db) return [];
  if (status) {
    return db.select().from(officeCommunications).where(eq(officeCommunications.status, status)).orderBy(desc(officeCommunications.receivedAt));
  }
  return db.select().from(officeCommunications).orderBy(desc(officeCommunications.receivedAt));
}

export async function updateCommunicationStatus(id: number, status: (typeof COMUNICACAO_STATUS)[number]) {
  const db = await getDb();
  if (!db) throw new Error("Banco indisponível");
  await db.update(officeCommunications).set({ status }).where(eq(officeCommunications.id, id));
  await audit("office_communication", String(id), `status:${status}`, "");
}

export async function registerManualCommunication(input: {
  cnjNumber?: string | null;
  kind?: string | null;
  title: string;
  content?: string | null;
  receivedAt?: Date | null;
  deadlineDays?: number | null;
}) {
  const db = await getDb();
  if (!db) throw new Error("Banco indisponível");
  const [row] = await db
    .insert(officeCommunications)
    .values({
      cnjNumber: input.cnjNumber?.trim() || null,
      kind: (input.kind || "outro").trim().slice(0, 32),
      title: input.title.trim().slice(0, 255),
      status: "nova",
      channel: "manual",
      sourceKey: "manual",
      sourceExternalId: null,
      receivedAt: input.receivedAt ?? new Date(),
      deadlineDays: input.deadlineDays ?? null,
      content: input.content ? sanitizeDjenHtml(input.content, 4000) : null,
    })
    .$returningId();
  await audit("office_communication", String(row.id), "register_manual", input.title.trim().slice(0, 120));
  return row.id;
}

/** Comunicações por número CNJ (18+ dígitos comparados sem pontuação). */
export async function communicationsByCnj(cnjNumber: string) {
  const db = await getDb();
  if (!db) return [];
  const digits = cnjNumber.replace(/\D/g, "");
  if (digits.length !== 20) return [];
  const rows = await db
    .select()
    .from(officeCommunications)
    .where(eq(officeCommunications.cnjNumber, cnjNumber))
    .orderBy(desc(officeCommunications.receivedAt));
  return rows;
}
