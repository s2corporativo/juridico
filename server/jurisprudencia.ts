/**
 * Conector de jurisprudência de fontes públicas sem credencial:
 * - STJ Dados Abertos (CKAN package_search)
 * - LexML SRU (endpoint configurável)
 * - Registro manual TJMG auditável
 *
 * Sincronização multi-provedor: todos falhando → failed; parcial → partial.
 * Persistência idempotente (ER_DUP_ENTRY benigno), auditoria completa.
 */

import { desc, eq, sql } from "drizzle-orm";
import {
  auditEvents,
  officeJurisprudencia,
  officeJurisprudenciaSettings,
} from "../drizzle/schema";
import { getDb } from "./db";
import {
  buildLexmlSearchUrl,
  buildStjCkanUrl,
  LexmlRespostaNaoSruError,
  normalizeCkanResult,
  parseSruResponse,
  planJurisprudenciaIngestion,
  validateJurisManualInput,
  type JurisItem,
  type JurisProviderKey,
  type JurisStatus,
} from "@shared/jurisprudencia-module";

export interface JurisSettingsView {
  enabled: boolean;
  query: string;
  lexmlEndpoint: string;
  maxItems: number;
  autoSyncEnabled: boolean;
  intervalMinutes: number;
  lastSyncAt: Date | null;
  lastSyncState: string | null;
  lastSyncStatus: "never" | "success" | "partial" | "failed";
}

async function auditJuris(action: string, note: string) {
  const db = await getDb();
  if (!db) return;
  await db.insert(auditEvents).values({
    entityType: "office_jurisprudencia",
    entityKey: "connector",
    action,
    actorLabel: "jurisprudencia-connector",
    note: note.slice(0, 500),
  });
}

export async function getJurisSettings(): Promise<JurisSettingsView> {
  const db = await getDb();
  if (!db) {
    return {
      enabled: false,
      query: "consumidor boa fe",
      lexmlEndpoint: "http://lexml.gov.br/busca/sru",
      maxItems: 5,
      autoSyncEnabled: false,
      intervalMinutes: 240,
      lastSyncAt: null,
      lastSyncState: null,
      lastSyncStatus: "never",
    };
  }
  let rows = await db
    .select()
    .from(officeJurisprudenciaSettings)
    .where(eq(officeJurisprudenciaSettings.id, 1))
    .limit(1);
  if (rows.length === 0) {
    try {
      await db.insert(officeJurisprudenciaSettings).values({ id: 1 });
    } catch (err) {
      if ((err as { code?: string }).code !== "ER_DUP_ENTRY") throw err;
    }
    rows = await db
      .select()
      .from(officeJurisprudenciaSettings)
      .where(eq(officeJurisprudenciaSettings.id, 1))
      .limit(1);
  }
  const s = rows[0];
  return {
    enabled: s.enabled === 1,
    query: s.query,
    lexmlEndpoint: s.lexmlEndpoint,
    maxItems: s.maxItems,
    autoSyncEnabled: s.autoSyncEnabled === 1,
    intervalMinutes: s.intervalMinutes,
    lastSyncAt: s.lastSyncAt ?? null,
    lastSyncState: s.lastSyncState ?? null,
    lastSyncStatus: s.lastSyncStatus,
  };
}

export interface UpdateJurisSettingsInput {
  enabled?: boolean;
  query?: string;
  lexmlEndpoint?: string;
  maxItems?: number;
  autoSyncEnabled?: boolean;
  intervalMinutes?: number;
}

export async function updateJurisSettings(input: UpdateJurisSettingsInput): Promise<JurisSettingsView> {
  const db = await getDb();
  if (!db) throw new Error("Banco indisponível");
  await getJurisSettings();
  const patch: Record<string, unknown> = {};
  if (input.enabled !== undefined) patch.enabled = input.enabled ? 1 : 0;
  if (input.query !== undefined) {
    const q = input.query.trim().slice(0, 160);
    if (!q) throw new Error("Consulta não pode ficar vazia.");
    patch.query = q;
  }
  if (input.lexmlEndpoint !== undefined) {
    const ep = input.lexmlEndpoint.trim().slice(0, 512);
    if (!/^https?:\/\//i.test(ep)) throw new Error("Endpoint SRU deve começar com http:// ou https://.");
    patch.lexmlEndpoint = ep;
  }
  if (input.maxItems !== undefined) {
    const n = Math.max(1, Math.min(20, Math.round(input.maxItems)));
    patch.maxItems = n;
  }
  if (input.autoSyncEnabled !== undefined) patch.autoSyncEnabled = input.autoSyncEnabled ? 1 : 0;
  if (input.intervalMinutes !== undefined) {
    patch.intervalMinutes = Math.max(30, Math.min(1440, Math.round(input.intervalMinutes)));
  }
  if (Object.keys(patch).length > 0) {
    await db.update(officeJurisprudenciaSettings).set(patch).where(eq(officeJurisprudenciaSettings.id, 1));
    await auditJuris("settings:update", Object.keys(patch).join(","));
  }
  return getJurisSettings();
}

async function fetchJson(url: string, timeoutMs = 12_000): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json, text/xml, */*" },
    });
    if (!res.ok) throw new Error(`HTTP_${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchText(url: string, timeoutMs = 12_000): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "text/xml, application/xml, */*" },
    });
    if (!res.ok) throw new Error(`HTTP_${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchProvider(provider: JurisProviderKey, query: string, lexmlEndpoint: string, maxItems: number): Promise<JurisItem[]> {
  if (provider === "stj-dados-abertos") {
    const json = (await fetchJson(buildStjCkanUrl(query, maxItems))) as {
      success?: boolean;
      result?: { results?: unknown[] };
    };
    if (!json?.success) throw new Error("STJ_CKAN_RESPOSTA_INVALIDA");
    return normalizeCkanResult((json.result?.results ?? []) as never, maxItems);
  }
  const xml = await fetchText(buildLexmlSearchUrl(lexmlEndpoint, query, maxItems));
  return parseSruResponse(xml, maxItems); // pode lançar LexmlRespostaNaoSruError
}

export interface ProviderDiagnostico {
  provedor: string;
  status: "ok" | "falhou" | "ignorado";
  codigo?: string;
  novos?: number;
}

export interface JurisSyncResult {
  status: "success" | "partial" | "failed";
  message: string;
  diagnosticos: ProviderDiagnostico[];
  stats?: { recebidos: number; novos: number; duplicados: number; invalidos: number };
}

async function persistJuris(itens: JurisItem[]): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Banco indisponível");
  let novas = 0;
  for (const it of itens) {
    try {
      await db.insert(officeJurisprudencia).values({
        externalId: it.externalId,
        provider: it.provider,
        tribunal: it.tribunal,
        orgao: it.orgao,
        cnjNumber: it.cnjNumber,
        ementa: it.ementa,
        url: it.url,
        decisionDate: it.dataJulgamento,
        status: "nova",
      });
      novas += 1;
    } catch (err) {
      if ((err as { code?: string }).code === "ER_DUP_ENTRY") continue;
      throw err;
    }
  }
  return novas;
}

export async function syncJurisprudencia(): Promise<JurisSyncResult> {
  const settings = await getJurisSettings();
  const diagnosticos: ProviderDiagnostico[] = [];
  const itens: JurisItem[] = [];
  if (!settings.enabled) {
    return {
      status: "failed",
      message: "Conector de jurisprudência desabilitado nas configurações.",
      diagnosticos,
    };
  }
  for (const provider of ["stj-dados-abertos", "lexml-sru"] as JurisProviderKey[]) {
    try {
      const resultado = await fetchProvider(provider, settings.query, settings.lexmlEndpoint, settings.maxItems);
      itens.push(...resultado);
      diagnosticos.push({ provedor: provider, status: "ok", novos: resultado.length });
    } catch (err) {
      const codigo =
        err instanceof LexmlRespostaNaoSruError
          ? "LEXML_RESPOSTA_NAO_SRU"
          : err instanceof Error
            ? err.name === "AbortError" || err.name === "TimeoutError"
              ? "TIMEOUT_12S"
              : err.message
            : "ERRO_DESCONHECIDO";
      diagnosticos.push({ provedor: provider, status: "falhou", codigo });
    }
  }
  const okCount = diagnosticos.filter(d => d.status === "ok").length;
  let status: JurisSyncResult["status"];
  let message: string;
  let stats: JurisSyncResult["stats"] = undefined;
  if (okCount === 0) {
    status = "failed";
    message = `Todos os provedores falharam: ${diagnosticos
      .map(d => `${d.provedor} — ${d.codigo}`)
      .join("; ")}.`;
  } else {
    const existentesRows = await getDb();
    const existentes = new Set<string>();
    if (existentesRows) {
      const rows = await existentesRows
        .select({ id: officeJurisprudencia.externalId })
        .from(officeJurisprudencia);
      for (const r of rows) existentes.add(r.id);
    }
    const plano = planJurisprudenciaIngestion(itens, existentes);
    const persistidas = await persistJuris(plano.itens);
    stats = plano.stats;
    status = okCount === 2 ? "success" : "partial";
    message = `Coleta parcial/total concluída: ${plano.stats.novos} novos (${persistidas} gravados), ${plano.stats.duplicados} duplicados.`;
  }
  const estado = JSON.stringify({
    quando: new Date().toISOString(),
    diagnosticos,
  }).slice(0, 500);
  const db = await getDb();
  if (db) {
    await db
      .update(officeJurisprudenciaSettings)
      .set({
        lastSyncAt: new Date(),
        lastSyncState: estado,
        lastSyncStatus: status === "failed" ? "failed" : status,
      })
      .where(eq(officeJurisprudenciaSettings.id, 1));
  }
  await auditJuris("sync", message);
  return { status, message, diagnosticos, stats };
}

export async function listJurisprudencia(filtros: { status?: JurisStatus; tribunal?: string } = {}) {
  const db = await getDb();
  if (!db) return [];
  const condicoes = [];
  if (filtros.status) condicoes.push(eq(officeJurisprudencia.status, filtros.status));
  if (filtros.tribunal) condicoes.push(eq(officeJurisprudencia.tribunal, filtros.tribunal));
  const q = db.select().from(officeJurisprudencia).orderBy(desc(officeJurisprudencia.updatedAt)).limit(200);
  if (condicoes.length > 0) {
    return q.where(sql.join(condicoes, sql` and `));
  }
  return q;
}

export async function updateJurisStatus(id: number, status: JurisStatus) {
  const db = await getDb();
  if (!db) throw new Error("Banco indisponível");
  await db.update(officeJurisprudencia).set({ status }).where(eq(officeJurisprudencia.id, id));
  await auditJuris(`status:${status}`, `#${id}`);
}

export async function linkJurisToMatter(id: number, matterId: number | null) {
  const db = await getDb();
  if (!db) throw new Error("Banco indisponível");
  await db.update(officeJurisprudencia).set({ matterId, status: matterId ? "aplicada" : "destacada" }).where(eq(officeJurisprudencia.id, id));
  await auditJuris("link", `#${id} → matéria ${matterId ?? "nenhuma"}`);
}

export async function registerManualJurisprudencia(input: {
  externalId: string;
  tribunal: string;
  orgao?: string | null;
  cnjNumber?: string | null;
  ementa: string;
  url?: string | null;
  dataJulgamento?: string | null;
}) {
  const db = await getDb();
  if (!db) throw new Error("Banco indisponível");
  const validado = validateJurisManualInput(input);
  try {
    await db.insert(officeJurisprudencia).values({
      externalId: validado.externalId,
      provider: "manual-tjmg",
      tribunal: validado.tribunal,
      orgao: validado.orgao,
      cnjNumber: validado.cnjNumber,
      ementa: validado.ementa,
      url: validado.url,
      decisionDate: validado.dataJulgamento,
      status: "nova",
    });
  } catch (err) {
    if ((err as { code?: string }).code === "ER_DUP_ENTRY") {
      throw new Error("Já existe item com este identificador externo no acervo.");
    }
    throw err;
  }
  await auditJuris("manual", `${validado.tribunal} — ${validado.externalId}`);
  return true;
}

let jurisSchedulerStarted = false;
export function startJurisprudenciaAutoSync() {
  if (jurisSchedulerStarted) return;
  jurisSchedulerStarted = true;
  const tick = async () => {
    try {
      const s = await getJurisSettings();
      if (s.enabled && s.autoSyncEnabled) {
        const result = await syncJurisprudencia();
        console.log(`[JURIS] auto-sync: ${result.status} — ${result.message}`);
      }
    } catch (err) {
      console.warn("[JURIS] auto-sync erro:", err instanceof Error ? err.message : err);
    }
  };
  setTimeout(tick, 90_000);
  setInterval(tick, 240 * 60_000);
  console.log("[JURIS] agendador automático armado (ciclo 240 min; 1ª tentativa em 90s)");
}
