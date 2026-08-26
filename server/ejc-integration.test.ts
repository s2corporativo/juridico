import { describe, expect, it } from "vitest";
import { ejcIntegrationManifest, getEjcIntegrationStatus } from "@shared/ejc-integration";

describe("EJC integration manifest", () => {
  it("keeps the planned integration inactive and prohibits confidential data transfer", () => {
    expect(ejcIntegrationManifest.integrationMode).toBe("pending_approval");
    expect(ejcIntegrationManifest.modules.every(module => module.route.startsWith("/"))).toBe(true);
    expect(ejcIntegrationManifest.confidentiality.prohibitedTransfer).toContain("credenciais");
    expect(getEjcIntegrationStatus()).toMatchObject({ mode: "pending_approval", authBridgeMode: "disabled" });
  });
});
