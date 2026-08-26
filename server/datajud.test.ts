import { afterEach, describe, expect, it } from "vitest";
import { checkDataJudCoverage, extractPublicDataJudKey, getDataJudConnectionStatus, lookupDataJudByProcess } from "./datajud";

const originalKey = process.env.DATAJUD_API_KEY;
const originalFetch = global.fetch;

afterEach(() => {
  if (originalKey === undefined) delete process.env.DATAJUD_API_KEY;
  else process.env.DATAJUD_API_KEY = originalKey;
  global.fetch = originalFetch;
});

describe("DataJud transient connector", () => {
  it("reports public resolution state and never returns a key", () => {
    delete process.env.DATAJUD_API_KEY;
    expect(getDataJudConnectionStatus()).toMatchObject({ configured: true });

    process.env.DATAJUD_API_KEY = "temporary-test-key";
    const status = getDataJudConnectionStatus();
    expect(status).toMatchObject({ configured: true });
    expect(JSON.stringify(status)).not.toContain("temporary-test-key");
    expect(status.storagePolicy).toContain("memória");
  });

  it("extracts a public key from an access page in memory", () => {
    const syntheticKey = "A".repeat(44);
    expect(extractPublicDataJudKey(`<p>Authorization: APIKey <strong>${syntheticKey}</strong></p>`)).toBe(syntheticKey);
    expect(extractPublicDataJudKey("sem marcador de autenticação")).toBeNull();
  });

  it("checks alias coverage using only an aggregate empty query", async () => {
    const syntheticKey = "A".repeat(44);
    global.fetch = (async (input: string | URL | Request) => {
      const url = String(input);
      if (url.includes("/acesso/")) return new Response(`Authorization: APIKey ${syntheticKey}`, { status: 200 });
      return new Response("{}", { status: url.includes("api_publica_tjmg") ? 200 : 503 });
    }) as typeof fetch;
    const coverage = await checkDataJudCoverage(["tjmg", "tjsp"]);
    expect(coverage).toMatchObject({ total: 2, available: 1, coveragePct: 50 });
    expect(coverage.items).toEqual([{ alias: "tjmg", status: "available" }, { alias: "tjsp", status: "unavailable" }]);
  });

  it("rejects an invalid process number before any external request", async () => {
    await expect(lookupDataJudByProcess("tjmg", "123")).rejects.toThrow("número CNJ válido");
  });
});
