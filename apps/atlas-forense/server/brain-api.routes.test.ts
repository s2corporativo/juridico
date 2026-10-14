import express from "express";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { attachRequestId } from "./_core/request-id";
import { BRAIN_API_PREFIX, BRAIN_API_LEGACY_PREFIX, BRAIN_LEGACY_SUNSET } from "@shared/brain-api";

const TOKEN = "t".repeat(48);
let server: Server;
let base = "";       // prefixo canônico v1
let baseLegacy = ""; // alias legado

beforeAll(async () => {
  process.env.ATLAS_BRAIN_API_TOKEN = TOKEN;
  const { registerBrainApiRoutes } = await import("./brain-api");
  const app = express();
  app.use(express.json());
  app.use(attachRequestId);
  registerBrainApiRoutes(app);
  await new Promise<void>(resolve => {
    server = app.listen(0, "127.0.0.1", () => resolve());
  });
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}${BRAIN_API_PREFIX}`;
  baseLegacy = `http://127.0.0.1:${(server.address() as AddressInfo).port}${BRAIN_API_LEGACY_PREFIX}`;
});

afterAll(async () => {
  await new Promise<void>(resolve => server.close(() => resolve()));
  delete process.env.ATLAS_BRAIN_API_TOKEN;
});

const auth = { Authorization: `Bearer ${TOKEN}` };

describe("brain API HTTP guards (no database required)", () => {
  it("serves the same contract on the canonical v1 prefix and the legacy alias", async () => {
    for (const root of [base, baseLegacy]) {
      for (const [method, path] of [["GET", "/compendium/search"], ["GET", "/jurimetry"], ["POST", "/theses"], ["GET", "/knowledge/snapshot"], ["GET", "/knowledge/items/1"], ["GET", "/knowledge/health"]] as const) {
        const missing = await fetch(root + path, { method, headers: { "Content-Type": "application/json" }, body: method === "POST" ? "{}" : undefined });
        expect(missing.status, `${method} ${root}${path} sem token`).toBe(401);
      }
    }
  });

  it("marks the legacy prefix with Deprecation/Sunset/Link headers pointing to v1", async () => {
    const res = await fetch(`${baseLegacy}/jurimetry`, { headers: auth });
    expect(res.headers.get("deprecation")).toBe("true");
    expect(res.headers.get("sunset")).toBe(BRAIN_LEGACY_SUNSET);
    expect(res.headers.get("link")).toContain(`${BRAIN_API_PREFIX}/jurimetry`);
    const canonical = await fetch(`${base}/jurimetry`, { headers: auth });
    expect(canonical.status).toBe(200);
    expect(canonical.headers.get("deprecation")).toBeNull();
  });

  it("errors use the standard envelope with requestId and echo X-Request-Id", async () => {
    const customId = "req_test-corr-id-001";
    const res = await fetch(`${base}/jurimetry?from=2026-13`, { headers: { ...auth, "x-request-id": customId } });
    expect(res.status).toBe(400);
    expect(res.headers.get("x-request-id")).toBe(customId);
    const body = await res.json() as { ok: boolean; error: string; status: number; requestId: string | null };
    expect(body).toMatchObject({ ok: false, error: "invalid_filter", status: 400, requestId: customId });

    const noHeader = await fetch(`${base}/jurimetry?from=2026-13`, { headers: auth });
    const generated = noHeader.headers.get("x-request-id");
    expect(generated ?? "").toMatch(/^req_[0-9a-f]{24}$/);
    const noHeaderBody = await noHeader.json() as { requestId: string | null };
    expect(noHeaderBody.requestId).toBe(generated);
  });

  it("rejects every route without a valid bearer token", async () => {
    for (const [method, path] of [["GET", "/compendium/search"], ["GET", "/jurimetry"], ["POST", "/theses"], ["GET", "/knowledge/snapshot"], ["GET", "/knowledge/items/1"], ["GET", "/knowledge/health"]] as const) {
      const missing = await fetch(base + path, { method, headers: { "Content-Type": "application/json" }, body: method === "POST" ? "{}" : undefined });
      expect(missing.status, `${method} ${path} sem token`).toBe(401);
      const wrong = await fetch(base + path, { method, headers: { Authorization: "Bearer " + "x".repeat(48), "Content-Type": "application/json" }, body: method === "POST" ? "{}" : undefined });
      expect(wrong.status, `${method} ${path} token errado`).toBe(401);
    }
  });

  it("rejects malformed knowledge pagination and IDs before touching the database", async () => {
    const missingVersion = await fetch(`${base}/knowledge/snapshot?page=1`, { headers: auth });
    expect(missingVersion.status).toBe(400);
    expect(await missingVersion.json()).toMatchObject({ error: "snapshot_version_required" });

    const invalidId = await fetch(`${base}/knowledge/items/not-a-number`, { headers: auth });
    expect(invalidId.status).toBe(400);
    expect(await invalidId.json()).toMatchObject({ error: "invalid_item_id" });

    // Alias legado mantém o mesmo comportamento (compatibilidade F1.2)
    const legacySnapshot = await fetch(`${baseLegacy}/knowledge/snapshot?page=1`, { headers: auth });
    expect(legacySnapshot.status).toBe(400);
    expect(await legacySnapshot.json()).toMatchObject({ ok: false, error: "snapshot_version_required" });
  });

  it("validates jurimetry filters before touching the database", async () => {
    const res = await fetch(`${base}/jurimetry?from=2026-13`, { headers: auth });
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ ok: false, error: "invalid_filter" });
  });

  it("rejects invalid or personal-data theses with 422 and details", async () => {
    const res = await fetch(`${base}/theses`, {
      method: "POST",
      headers: { ...auth, "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Tese válida sobre vício oculto", summary: "Resumo com CPF 123.456.789-09 que não pode seguir adiante para a fila editorial.", kind: "legislation", canonicalUrl: "https://blog.exemplo.com/x" }),
    });
    expect(res.status).toBe(422);
    const body = await res.json() as { details: string[] };
    expect(body.details.join(" ")).toMatch(/canonicalUrl/);
    expect(body.details.join(" ")).toMatch(/dado pessoal/);
  });
});
