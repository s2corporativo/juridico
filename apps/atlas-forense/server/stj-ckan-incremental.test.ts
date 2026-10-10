import { describe, expect, it } from "vitest";
import {
  discoverStjCkanResources,
  normalizeStjCkanResources,
  planStjMetadataChanges,
} from "./stj-ckan-incremental";

const source = {
  id: "dataset-1", name: "jurisprudencia", title: "Coleção STJ",
  metadata_modified: "2026-10-10T00:00:00",
  license_id: "cc-by-4.0",
  resources: [
    { id: "resource-1", url: "https://dadosabertos.web.stj.jus.br/dataset/example.csv", format: "csv", last_modified: "2026-10-10" },
  ],
};

function mockedCkan(pages: unknown[]): typeof fetch {
  return (async (input: string | URL | Request) => {
    const url = new URL(String(input));
    const start = Number(url.searchParams.get("start") ?? "0");
    const pageSize = Number(url.searchParams.get("rows") ?? "1");
    const page = Math.floor(start / pageSize);
    const body = pages[page] ?? pages[pages.length - 1];
    return new Response(JSON.stringify(body), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;
}

describe("STJ CKAN incremental metadata foundation", () => {
  it("pages with CKAN start/rows and returns resource metadata, not a legal decision", async () => {
    const fetchImpl = mockedCkan([
      { success: true, result: { count: 2, results: [source] } },
      { success: true, result: { count: 2, results: [{ ...source, id: "dataset-2" }] } },
    ]);
    const result = await discoverStjCkanResources({ pageSize: 1, maxPages: 3, fetchImpl });
    expect(result.reportedCount).toBe(2);
    expect(result.pagesScanned).toBe(2);
    expect(result.resources).toHaveLength(2);
    expect(result.resources[0].metadataFingerprint).toMatch(/^[a-f0-9]{64}$/);
    expect(result.resources[0].licenseStatus).toBe("declared_unverified");
    expect(result.resources[0]).not.toHaveProperty("decisionDate");
    expect(result.resources[0]).not.toHaveProperty("ratioDecidendi");
  });

  it("changes fingerprints when source metadata changes without treating them as file hashes", () => {
    const [original] = normalizeStjCkanResources(source);
    const [revised] = normalizeStjCkanResources({
      ...source, metadata_modified: "2026-10-11T00:00:00",
    });
    const previous = new Map([[`${original.datasetId}:${original.resourceId}`, original.metadataFingerprint]]);
    expect(planStjMetadataChanges([original], previous)).toEqual({ changed: [], unchanged: 1 });
    expect(planStjMetadataChanges([revised], previous)).toEqual({ changed: [revised], unchanged: 0 });
  });

  it("does not declare missing licence as approved and rejects insecure resource URLs", () => {
    const [resource] = normalizeStjCkanResources({
      id: "dataset-x", resources: [{ id: "resource-x", url: "http://example.org/download" }],
    });
    expect(resource.licenseStatus).toBe("needs_review");
    expect(resource.resourceUrl).toBeNull();
  });

  it("fails clearly on premature empty pages instead of reporting successful empty collection", async () => {
    const fetchImpl = mockedCkan([{ success: true, result: { count: 3, results: [] } }]);
    await expect(discoverStjCkanResources({ pageSize: 1, fetchImpl })).rejects.toThrow("STJ_CKAN_PREMATURE_EMPTY_PAGE");
  });

  it("fails on non-CKAN responses and on rate limiting", async () => {
    const invalid = mockedCkan([{ success: true, result: { count: 2, results: "HTML challenge" } }]);
    await expect(discoverStjCkanResources({ fetchImpl: invalid })).rejects.toThrow("STJ_CKAN_INVALID_PAYLOAD");
    const rateLimited = (async () => new Response("blocked", { status: 429 })) as typeof fetch;
    await expect(discoverStjCkanResources({ fetchImpl: rateLimited })).rejects.toThrow("STJ_CKAN_HTTP_429");
  });
  it("rejects truncated intermediate pages and changing counts", async () => {
    const truncated = mockedCkan([
      { success: true, result: { count: 4, results: [source] } },
    ]);
    await expect(discoverStjCkanResources({ pageSize: 2, fetchImpl: truncated })).rejects.toThrow("STJ_CKAN_INCOMPLETE_PAGE");

    const racing = mockedCkan([
      { success: true, result: { count: 2, results: [source] } },
      { success: true, result: { count: 3, results: [source] } },
    ]);
    await expect(discoverStjCkanResources({ pageSize: 1, fetchImpl: racing })).rejects.toThrow("STJ_CKAN_PAGINATION_RACE");
  });

});
