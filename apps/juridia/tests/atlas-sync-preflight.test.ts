/// <reference types="bun-types" />
import { describe, expect, test } from "bun:test";
import { mkdtempSync, writeFileSync, rmSync, utimesSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { checkKnowledgeSyncPreflight } from "../scripts/sync-atlas-knowledge";

describe("Atlas→JuridIA: gates antes de abrir o banco", () => {
  test("rejeita config ausente, caminho relativo e backup inexistente", () => {
    const dir = mkdtempSync(join(tmpdir(), "atlas-sync-gate-"));
    const db = join(dir, "juridia.db");
    const marker = join(dir, "backup-verified.marker");
    writeFileSync(db, "");
    try {
      const env = {
        NODE_ENV: "production",
        ATLAS_API_URL: "http://127.0.0.1:3114",
        ATLAS_BRAIN_API_TOKEN: "x".repeat(40),
        JURIDIA_KNOWLEDGE_DB_PATH: db,
        JURIDIA_SYNC_VERIFIED_BACKUP: marker,
      };
      expect(() => checkKnowledgeSyncPreflight({})).toThrow("ATLAS_API_NOT_CONFIGURED");
      expect(() => checkKnowledgeSyncPreflight({ ...env, JURIDIA_KNOWLEDGE_DB_PATH: "relative.db" })).toThrow("JURIDIA_KNOWLEDGE_DB_PATH_MISSING");
      expect(() => checkKnowledgeSyncPreflight(env)).toThrow("JURIDIA_SYNC_VERIFIED_BACKUP_MISSING");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test("aceita arquivos existentes e marcador recente, rejeita marcador vencido", () => {
    const dir = mkdtempSync(join(tmpdir(), "atlas-sync-gate-"));
    const db = join(dir, "juridia.db");
    const marker = join(dir, "backup-verified.marker");
    writeFileSync(db, "");
    writeFileSync(marker, "backup sintético - teste");
    const now = Date.now();
    const env = {
      NODE_ENV: "production",
      ATLAS_API_URL: "http://127.0.0.1:3114",
      ATLAS_BRAIN_API_TOKEN: "x".repeat(40),
      JURIDIA_KNOWLEDGE_DB_PATH: db,
      JURIDIA_SYNC_VERIFIED_BACKUP: marker,
    };
    try {
      expect(checkKnowledgeSyncPreflight(env, now).dbPath).toBe(db);
      const oldTime = new Date(now - 26 * 60 * 60 * 1000);
      utimesSync(marker, oldTime, oldTime);
      expect(() => checkKnowledgeSyncPreflight(env, now)).toThrow("SYNC_BACKUP_NOT_RECENT");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
