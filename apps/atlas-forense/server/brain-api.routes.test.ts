import express from "express";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const TOKEN = "t".repeat(48);
let server: Server;
let base = "";

beforeAll(async () => {
  process.env.ATLAS_BRAIN_API_TOKEN = TOKEN;
  const { registerBrainApiRoutes } = await import("./brain-api");
  const app = express();
  app.use(express.json());
  registerBrainApiRoutes(app);
  await new Promise<void>(resolve => {
    server = app.listen(0, "127.0.0.1", () => resolve());
  });
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/internal/brain`;
});

afterAll(async () => {
  await new Promise<void>(resolve => server.close(() => resolve()));
  delete process.env.ATLAS_BRAIN_API_TOKEN;
});

const auth = { Authorization: `Bearer ${TOKEN}` };

describe("brain API HTTP guards (no database required)", () => {
  it("rejects every route without a valid bearer token", async () => {
    for (const [method, path] of [["GET", "/compendium/search"], ["GET", "/jurimetry"], ["GET", "/knowledge/snapshot"], ["GET", "/knowledge/items/1"], ["GET", "/knowledge/health"], ["POST", "/theses"]] as const) {
      const missing = await fetch(base + path, { method, headers: { "Content-Type": "application/json" }, body: method === "POST" ? "{}" : undefined });
      expect(missing.status, `${method} ${path} sem token`).toBe(401);
      const wrong = await fetch(base + path, { method, headers: { Authorization: "Bearer " + "x".repeat(48), "Content-Type": "application/json" }, body: method === "POST" ? "{}" : undefined });
      expect(wrong.status, `${method} ${path} token errado`).toBe(401);
    }
  });

  it("requires snapshot version for additional pages without querying the database", async () => {
    const res = await fetch(base + "/knowledge/snapshot?page=1", { headers: auth });
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ ok: false, error: "snapshot_version_required" });
  });

  it("rejects invalid IDs before accessing the database", async () => {
    const res = await fetch(base + "/knowledge/items/abc", { headers: auth });
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ ok: false, error: "invalid_item_id" });
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
