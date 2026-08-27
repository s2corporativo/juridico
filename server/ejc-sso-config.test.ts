import { describe, expect, it } from "vitest";
import { EJC_SSO_REQUIRED_ENV, getEjcSsoReadiness } from "./ejc-sso-config";

describe("EJC SSO readiness", () => {
  it("stays disabled while configuration is absent", () => {
    const readiness = getEjcSsoReadiness({});
    expect(readiness).toMatchObject({ enabled: false, status: "configuration_required", callbackPath: "/api/ejc-sso/callback" });
    expect(readiness.missingConfiguration).toEqual([...EJC_SSO_REQUIRED_ENV]);
  });

  it("recognizes complete configuration without activating login", () => {
    const readiness = getEjcSsoReadiness({
      EJC_OIDC_ISSUER: "https://sso.exemplo.org",
      EJC_OIDC_CLIENT_ID: "atlas-forense",
      EJC_OIDC_CLIENT_SECRET: "not-a-real-secret",
    });
    expect(readiness).toMatchObject({ enabled: false, status: "configured_not_activated", protocol: "oidc_authorization_code" });
    expect(readiness.missingConfiguration).toEqual([]);
  });
});
