import { describe, expect, it } from "vitest";
import { ATLAS_HEALTH_RESPONSE } from "@shared/deployment";

describe("deployment health contract", () => {
  it("exposes only a minimal public health payload", () => {
    expect(ATLAS_HEALTH_RESPONSE).toEqual({ service: "atlas-forense", status: "ok" });
    expect(Object.keys(ATLAS_HEALTH_RESPONSE)).not.toContain("databaseUrl");
    expect(Object.keys(ATLAS_HEALTH_RESPONSE)).not.toContain("version");
  });
});
