import { describe, expect, it } from "vitest";
import { atlasIntegrationManifest, getAtlasIntegrationStatus } from "@shared/integration";

describe("Atlas integration contract", () => {
  it("uses one active contract and preserves confidentiality rules", () => {
    expect(atlasIntegrationManifest.product).toBe("Atlas Jurídico");
    expect(atlasIntegrationManifest.integrationMode).toBe("active");
    expect(atlasIntegrationManifest.modules.every((module) => module.route.startsWith("/")).toBe(true);
    expect(atlasIntegrationManifest.confidentiality.prohibitedTransfer).toContain("credenciais");
    expect(getAtlasIntegrationStatus()).toMatchObject({
      mode: "active",
      authBridgeMode: "enabled",
      callbackPath: "/api/sso/callback",
    });
  });
});
