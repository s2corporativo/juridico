import { describe, expect, test } from "bun:test";
import { GET } from "../src/app/api/health/route";

describe("JuridIA public liveness probe", () => {
  test("returns minimal health JSON without leaking secrets or readiness claims", async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    const payload = await response.json();
    expect(payload).toEqual({ status: "ok", service: "juridia", check: "liveness" });
    expect(JSON.stringify(payload)).not.toContain("DATABASE_URL");
  });
});
