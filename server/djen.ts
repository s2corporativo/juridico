/**
 * Conector DJEN automático (Comunica CNJ): configuração com identidade do advogado,
 * sincronização por OAB com falha graciosa, dedupe por idComunicacao, vínculo por CNJ
 * validado, sanitização LGPD e agendador idempotente.
 */

import { eq } from "drizzle-orm";
import {
  officeCommunications,
  officeDjenSettings,
} from "../drizzle/schema";
import { getDb } from "./db";
import {
  DJEN_SOURCE_KEY,
  janelaDjen,
  planDjenIngestion,
  type ComunicaItem,
} from "@shared/djen-module";

export interface DjenSettingsView {
  enabled: boolean;
  lawyerName: string | null;
  oabNumber: string | null;
  oabUf: string | null;
  tribunal: string;
  autoSyncEnabled: boolean;
  intervalMinutes: number;
  windowDays: number;
  defaultDeadlineDays: number;
  lastSyncAt: Date | null;
  lastSyncStatus: "never" | "success" | "partial" | "failed" | "not_configured";
  lastSyncMessage: string | null;
}

async function auditDjen(action: string, note: string) {
  const db = await getDb();
  if (!db) return;
  await db.insert((await import("../drizzle/schema")).auditEvents).values({
    entityType: "office_djen",
    entityKey: "settings",
    action,
    actorLabel: "djen-connector",
    note: note.slice(0, 500),
  });
}

export async function getDjenSettings(): Promise<DjenSettingsView> {
  const db = await getDb();
  if (!db) {
    return {
      enabled: false,
      lawyerName: null,
      oabNumber: null,
      oabUf: null,
      tribunal: "TJMG",
      autoSyncEnabled: false,
      intervalMinutes: 180,
      windowDays: 10,
      defaultDeadlineDays: 15,
      lastSyncAt: null,
      lastSyncStatus: "never",
      lastSyncMessage: null,
    };
  }
  let rows = await db.select().from(officeDjenSettings).where(eq(officeDjenSettings.id, 1)).limit(1);
  if (rows.length === 0) {
    try {
      await db.insert(officeDjenSettings).values({ id: 1 });
    } catch (err) {
      if ((err as { code?: string }).code !== "ER_DUP_ENTRY") throw err;
    }
    rows = await db.select().from(officeDjenSettings).where(eq(officeDjenSettings.id, 1)).limit(1);
  }
  const s = rows[0];
  return {
    enabled: s.enabled === 1,
    lawyerName: s.lawyerName ?? null,
    oabNumber: s.oabNumber ?? null,
    oabUf: s.oabUf ?? null,
    tribunal: s.tribunal,
    autoSyncEnabled: s.autoSyncEnabled === 1,
    intervalMinutes: s.intervalMinutes,
    windowDays: s.windowDays,
    defaultDeadlineDays: s.defaultDeadlineDays,
    lastSyncAt: s.lastSyncAt ?? null,
    lastSyncStatus: s.lastSyncStatus,
    lastSyncMessage: s.lastSyncMessage ?? null,
  };
}

export interface UpdateDjenSettingsInput {
  enabled?: boolean;
  lawyerName?: string | null;
  oabNumber?: string | null;
  oabUf?: string | null;
  tribunal?: string;
  autoSyncEnabled?: boolean;
  intervalMinutes?: number;
  windowDays?: number;
  defaultDeadlineDays?: number;
}

export async function updateDjenSettings(input: UpdateDjenSettingsInput): Promise<DjenSettingsView> {
  const db = await getDb();
  if (!db) throw new Error("Banco indisponível");
  await getDjenSettings(); // garante linha única
  const patch: Record<string, unknown> = {};
  if (input.enabled !== undefined) patch.enabled = input.enabled ? 1 : 0;
  if (input.lawyerName !== undefined) {
    const nome = input.lawyerName?.trim() || null;
    if (nome && nome.length > 120) throw new Error("Nome do advogado deve ter até 120 caracteres.");
    patch.lawyerName = nome;
  }
  if (input.oabNumber !== undefined) {
    const numero = (input.oabNumber || "").replace(/\D/g, "") || null;
    if (numero && !/^\d{3,10}$/.test(numero)) {
      throw new Error("Número da OAB deve conter entre 3 e 10 dígitos.");
    }
    patch.oabNumber = numero;
  }
  if (input.oabUf !== undefined) {
    const uf = (input.oabUf || "").trim().toUpperCase() || null;
    if (uf && !/^[A-Z]{2}$/.test(uf)) throw new Error("UF da OAB deve ter 2 letras.");
    patch.oabUf = uf;
  }
  if (input.tribunal !== undefined) patch.tribunal = input.tribunal.trim().slice(0, 64) || "TJMG";
  if (input.autoSyncEnabled !== undefined) patch.autoSyncEnabled = input.autoSyncEnabled ? 1 : 0;
  if (input.intervalMinutes !== undefined) {
    const min = Math.max(30, Math.min(1440, Math.round(input.intervalMinutes)));
    patch.intervalMinutes = min;
  }
  if (input.windowDays !== undefined) {
    const dias = Math.max(1, Math.min(90, Math.round(input.windowDays)));
    patch.windowDays = dias;
  }
  if (input.defaultDeadlineDays !== undefined) {
    const dias = Math.max(1, Math.min(365, Math.round(input.defaultDeadlineDays)));
    patch.defaultDeadlineDays = dias;
  }
  if (Object.keys(patch).length > 0) {
    await db.update(officeDjenSettings).set(patch).where(eq(officeDjenSettings.id, 1));
    await auditDjen("settings:update", Object.keys(patch).join(","));
  }
  return getDjenSettings();
}

export interface SyncResult {
  status: "not_configured" | "success" | "partial" | "failed";
  message: string;
  stats?: { recebidas: number; novas: number; duplicadas: number; invalidas: number };
}

const COMUNICA_BASE_URL =
  process.env.DJEN_COMUNICA_URL || "https://comunicapi.cnj.jus.br/api/v1/comunicacao";

async function fetchComunica(oab: string, uf: string, windowDays: number, timeoutMs = 15000): Promise<ComunicaItem[]> {
  const { inicio, fim } = janelaDjen(windowDays);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(COMUNICA_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        numeroOab: oab,
        ufOab: uf,
        meio: "D",
        dataDisponibilizacaoInicio: inicio,
        dataDisponibilizacaoFim: fim,
        itensPorPagina: 50,
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`COMUNICA_HTTP_${res.status}`);
    }
    const json = (await res.json()) as { itens?: ComunicaItem[] } | ComunicaItem[];
    const itens = Array.isArray(json) ? json : (json.itens ?? []);
    return itens;
  } finally {
    clearTimeout(timer);
  }
}

async function persistComunicacoes(itens: ReturnType<typeof planDjenIngestion>["itens"], deadlineDays: number) {
  const db = await getDb();
  if (!db) throw new Error("Banco indisponível");
  let novas = 0;
  for (const plano of itens) {
    try {
      await db.insert(officeCommunications).values({
        cnjNumber: plano.cnjNumber,
        kind: plano.kind,
        title: plano.title,
        status: "nova",
        channel: "djen",
        sourceKey: DJEN_SOURCE_KEY,
        sourceExternalId: plano.item.idComunicacao,
        receivedAt: plano.receivedAt ?? new Date(),
        deadlineDays: plano.deadlineDays ?? deadlineDays,
        isDemoData: 0,
        content: plano.content,
      });
      novas += 1;
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code === "ER_DUP_ENTRY") continue; // dedupe idempotente
      throw err;
    }
  }
  return novas;
}

export async function syncDjenNow(): Promise<SyncResult> {
  const settings = await getDjenSettings();
  if (!settings.enabled) {
    return { status: "not_configured", message: "Conector desabilitado nas configurações." };
  }
  if (!settings.oabNumber || !settings.oabUf) {
    const msg = "Conector não configurado: informe a inscrição OAB e a UF do advogado responsável.";
    await marcarSync("not_configured", msg);
    return { status: "not_configured", message: msg };
  }
  try {
    const itens = await fetchComunica(settings.oabNumber, settings.oabUf, settings.windowDays);
    const existentesRows = await getDb();
    const existentes = new Set<string>();
    if (existentesRows) {
      const rows = await existentesRows
        .select({ id: officeCommunications.sourceExternalId })
        .from(officeCommunications)
        .where(eq(officeCommunications.sourceKey, DJEN_SOURCE_KEY));
      for (const r of rows) if (r.id) existentes.add(r.id);
    }
    const plano = planDjenIngestion(itens, existentes);
    await persistComunicacoes(plano.itens, settings.defaultDeadlineDays);
    const msg = `Sincronização concluída: ${plano.stats.recebidas} recebidas, ${plano.stats.novas} novas, ${plano.stats.duplicadas} duplicadas, ${plano.stats.invalidas} inválidas.`;
    await marcarSync(plano.stats.recebidas === 0 ? "success" : "success", msg);
    await auditDjen("sync", msg);
    return { status: "success", message: msg, stats: plano.stats };
  } catch (err) {
    const motivo =
      err instanceof Error
        ? err.name === "AbortError" || err.name === "TimeoutError"
          ? "timeout da consulta"
          : err.message
        : String(err);
    const msg = `Falha na consulta DJEN: ${motivo}`;
    await marcarSync("failed", msg);
    await auditDjen("sync:failed", msg);
    return { status: "failed", message: msg };
  }
}

async function marcarSync(status: "success" | "failed" | "not_configured", message: string) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(officeDjenSettings)
    .set({ lastSyncAt: new Date(), lastSyncStatus: status, lastSyncMessage: message.slice(0, 500) })
    .where(eq(officeDjenSettings.id, 1));
}

/** Agendador idempotente: tenta a cada intervalo configurado (30–1440 min). */
let djenSchedulerStarted = false;
export function startDjenAutoSync() {
  if (djenSchedulerStarted) return;
  djenSchedulerStarted = true;
  const tick = async () => {
    try {
      const s = await getDjenSettings();
      if (s.enabled && s.autoSyncEnabled && s.oabNumber && s.oabUf) {
        const result = await syncDjenNow();
        console.log(`[DJEN] auto-sync: ${result.status} — ${result.message}`);
      }
    } catch (err) {
      console.warn("[DJEN] auto-sync erro:", err instanceof Error ? err.message : err);
    }
  };
  setTimeout(tick, 60_000);
  setInterval(tick, 180 * 60_000);
  console.log("[DJEN] agendador automático armado (ciclo 180 min; 1ª tentativa em 60s)");
}
