import { describe, expect, it } from "vitest";
import {
  collectStjResourceCandidates,
  collectDjenDailyCandidates,
  previousSaoPauloDate,
  selectUnseenCandidates,
} from "./public-knowledge-collectors";

const fake = (body: unknown, status = 200) =>
  (async () => new Response(JSON.stringify(body), {
    status, headers: { "Content-Type": "application/json" },
  })) as typeof fetch;

describe("Public ingestion: bounded and privacy-first", () => {
  it("creates a STJ discovery item per resource/version, never a court precedent", async () => {
    const source = { success: true, result: { count: 1, results: [{
      id: "ds-1", title: "Dataset teste", license_id: "cc-by-4.0",
      metadata_modified: "2026-10-10T00:00:00", resources: [
        { id: "res-1", url: "https://dadosabertos.web.stj.jus.br/resource.csv", format: "CSV" },
      ],
    }] } };
    const result = await collectStjResourceCandidates({ fetchImpl: fake(source) });
    expect(result.candidates).toHaveLength(1);
    expect(result.candidates[0]).toMatchObject({
      sourceKey: "stj-dados-abertos", kind: "official_update",
    });
    expect(result.candidates[0].contentHash).toMatch(/^[a-f0-9]{64}$/);
    expect(result.candidates[0].summary).toContain("Conteúdo e aplicabilidade não verificados");
    expect(result.candidates[0].title).not.toContain("acórdão");
    expect(result.truncated).toBe(false);
  });

  it("sanitizes DJEN response by whitelist, never preserving names, CNJ number or HTML", async () => {
    const payload = { status: "success", count: 1, items: [{
      idComunicacao: "comp-88", numeroProcesso: "11111111111111111111",
      nomeParte: "Pessoa Teste", nomeDestinatario: "Outra Pessoa",
      cpf: "12345678909", texto: "<div>segredo do processo</div>",
    }] };
    const result = await collectDjenDailyCandidates({
      date: "2026-10-09", tribunals: ["TJMG"], fetchImpl: fake(payload),
    });
    expect(result.candidates).toHaveLength(1);
    const serialized = JSON.stringify(result);
    for (const secret of ["Pessoa Teste", "Outra Pessoa", "12345678909", "segredo do processo", "11111111111111111111"]) {
      expect(serialized).not.toContain(secret);
    }
    expect(result.candidates[0].kind).toBe("official_update");
    expect(result.candidates[0].canonicalUrl).toBe("https://comunica.pje.jus.br/");
  });

  it("deduplicates same DJEN identifier deterministically across daily runs", async () => {
    const payload = { count: 1, items: [{ id: "hash-stable" }] };
    const opts = { date: "2026-10-09", fetchImpl: fake(payload) };
    const first = await collectDjenDailyCandidates(opts);
    const second = await collectDjenDailyCandidates(opts);
    expect(first.candidates[0].externalKey).toBe(second.candidates[0].externalKey);
  });

  it("rejects HTTP 429, invalid data and unsupported tribunal", async () => {
    await expect(collectDjenDailyCandidates({ fetchImpl: fake({}, 429) })).rejects.toThrow("DJEN_HTTP_429_RETRY_AFTER_60S");
    await expect(collectDjenDailyCandidates({ fetchImpl: fake({ items: [] }) })).rejects.toThrow("DJEN_INVALID_PAYLOAD");
    await expect(collectDjenDailyCandidates({ tribunals: ["TJMG?"] })).rejects.toThrow("DJEN_INVALID_TRIBUNAL");
  });

  it("limits daily STJ ingestion while resuming from not-yet-queued keys", () => {
    const prototype = {
      sourceKey: "stj-dados-abertos", kind: "official_update" as const,
      title: "STJ", summary: "metadados", canonicalUrl: "https://dadosabertos.web.stj.jus.br/",
      publishedAt: null, contentHash: "a".repeat(64),
    };
    const batch = [1, 2, 3, 4].map(n => ({ ...prototype, externalKey: "r:" + n }));
    const first = selectUnseenCandidates(batch, new Set<string>(), 2);
    expect(first.selected.map(x => x.externalKey)).toEqual(["r:1", "r:2"]);
    expect(first.deferred).toBe(2);
    const next = selectUnseenCandidates(batch, new Set(["r:1", "r:2"]), 2);
    expect(next.selected.map(x => x.externalKey)).toEqual(["r:3", "r:4"]);
    expect(next.deferred).toBe(0);
  });

  it("uses Sao Paulo date around UTC midnight, not the VPS clock", () => {
    expect(previousSaoPauloDate(new Date("2026-10-10T01:00:00Z"))).toBe("2026-10-08");
    expect(previousSaoPauloDate(new Date("2026-10-10T15:00:00Z"))).toBe("2026-10-09");
  });
});
