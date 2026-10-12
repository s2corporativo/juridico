/// <reference types="bun-types" />
/**
 * Sincronização ATÔMICA de metadados aprovados Atlas → cache próprio do JuridIA.
 * Não indexa metadados de descoberta como jurisprudência citável.
 * Uso: bun scripts/sync-atlas-knowledge.ts
 *
 * Exige:
 *  - ATLAS_API_URL + ATLAS_BRAIN_API_TOKEN (API privada autenticada)
 *  - JURIDIA_KNOWLEDGE_DB_PATH = caminho absoluto do SQLite próprio e existente
 *  - JURIDIA_SYNC_VERIFIED_BACKUP = arquivo de atestação gerado após backup validado
 *
 * Falha fechada: jamais cria banco em caminho novo, nem altera banco do Atlas.
 */
import { Database } from "bun:sqlite";
import { isAbsolute, resolve } from "node:path";
import { existsSync, realpathSync, statSync } from "node:fs";
import { getAtlasConfig } from "../src/lib/atlas_client";
import { syncApprovedDiscovery } from "../src/lib/atlas-snapshot-sync";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function existingFile(value: string | undefined, label: string): string {
  if (!value || !isAbsolute(value) || !existsSync(value)) throw new Error(`${label}_MISSING`);
  const real = realpathSync(resolve(value));
  if (!statSync(real).isFile()) throw new Error(`${label}_NOT_A_FILE`);
  return real;
}

export function checkKnowledgeSyncPreflight(
  env: NodeJS.ProcessEnv = process.env,
  now = Date.now(),
): { dbPath: string } {
  if (!getAtlasConfig(env)) throw new Error("ATLAS_API_NOT_CONFIGURED");
  const dbPath = existingFile(env.JURIDIA_KNOWLEDGE_DB_PATH, "JURIDIA_KNOWLEDGE_DB_PATH");
  const markerPath = existingFile(env.JURIDIA_SYNC_VERIFIED_BACKUP, "JURIDIA_SYNC_VERIFIED_BACKUP");
  if (dbPath === markerPath) throw new Error("SYNC_BACKUP_MARKER_INVALID");
  const age = now - statSync(markerPath).mtimeMs;
  if (age < 0 || age > ONE_DAY_MS) throw new Error("SYNC_BACKUP_NOT_RECENT");
  return { dbPath };
}

export async function runAtlasSync() {
  const { dbPath } = checkKnowledgeSyncPreflight();
  const db = new Database(dbPath, { create: false });
  try {
    db.exec("PRAGMA busy_timeout=5000");
    const result = await syncApprovedDiscovery(db);
    // Não registrar o token nem dados jurídicos sigilosos nos logs.
    return { ok: true, ...result, synchronizedAt: new Date().toISOString() };
  } finally {
    db.close();
  }
}

if (import.meta.main) {
  try {
    console.log(JSON.stringify(await runAtlasSync()));
  } catch (error) {
    console.error("ATLAS_SYNC_FAILED", error instanceof Error ? error.message : "unexpected_error");
    process.exitCode = 1;
  }
}
