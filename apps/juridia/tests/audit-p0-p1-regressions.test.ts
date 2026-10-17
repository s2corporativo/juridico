import { describe, test, expect } from "bun:test";
import { encodeLegalCursor, decodeLegalCursor, parseLegalPageParams, beforeLegalCursor } from "../src/lib/legal-list-cursor";
import { getEligibleProviders, getSanitizationMode, SanitizationMode, AI_EXTERNAL_PROVIDERS_ALLOWED } from "../src/lib/ai_governance";

describe("legal record pagination", () => {
  test("roundtrip preserves stable timestamp and record key", () => {
    const sample = { updatedAt: new Date("2026-10-17T20:20:30.123Z"), id: "cmetest_0001" };
    const cursor = encodeLegalCursor(sample);
    expect(decodeLegalCursor(cursor)).toEqual(sample);
    expect(beforeLegalCursor(sample)).toEqual({ OR: [
      { updatedAt: { lt: sample.updatedAt } },
      { updatedAt: sample.updatedAt, id: { lt: sample.id } },
    ] });
  });
  test("malformed and untrusted cursors are rejected", () => {
    for (const value of ["!", "e30", "abc", "a".repeat(520), Buffer.from('{"t":"2026-02-31T00:00:00.000Z","i":"abc"}').toString("base64url")]) {
      expect(decodeLegalCursor(value)).toBeNull();
    }
  });
  test("page size is validated and bounded", () => {
    expect(parseLegalPageParams(new URLSearchParams()).ok).toBe(true);
    for (const value of ["0", "101", "10000", "-1", "NaN"]) {
      expect(parseLegalPageParams(new URLSearchParams({ limit: value }))).toEqual({ ok: false, error: "invalid_limit" });
    }
    expect(parseLegalPageParams(new URLSearchParams({ limit: "25" }))).toEqual({ ok: true, limit: 25, cursor: null });
  });
});

describe("confidential legal AI defaults", () => {
  test("cloud providers do not become eligible by default", () => {
    expect(AI_EXTERNAL_PROVIDERS_ALLOWED).toBe(false);
    expect(getEligibleProviders().every(provider => !provider.external)).toBe(true);
    expect(getEligibleProviders().some(provider => provider.name === "ollama")).toBe(true);
  });
  test("all case and draft workflows require local-only treatment", () => {
    for (const task of ["analise_caso", "minuta", "criminal", "menores", "dossie", "resumo", "unknown"]) {
      expect(getSanitizationMode(task)).toBe(SanitizationMode.LOCAL_COMPLETO);
    }
  });
});
