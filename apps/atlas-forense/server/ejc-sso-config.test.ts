import { afterEach, describe, expect, it } from "vitest";
import { EJC_SSO_REQUIRED_ENV, getEjcSsoReadiness, getEjcSsoRuntime } from "./ejc-sso-config";

const COMPLETE_HTTPS = {
  EJC_OIDC_ISSUER: "https://sso.exemplo.org/api/auth/oidc",
  EJC_OIDC_CLIENT_ID: "atlas-forense",
  EJC_OIDC_CLIENT_SECRET: "not-a-real-secret",
} as const;

const PREV_NODE_ENV = process.env.NODE_ENV;

afterEach(() => {
  delete process.env.EJC_SSO_ENABLED;
  delete process.env.EJC_OIDC_ISSUER;
  delete process.env.EJC_OIDC_CLIENT_ID;
  delete process.env.EJC_OIDC_CLIENT_SECRET;
  delete process.env.EJC_SSO_REDIRECT_URI;
  process.env.NODE_ENV = PREV_NODE_ENV;
});

describe("EJC SSO readiness", () => {
  it("stays disabled while configuration is absent", () => {
    const readiness = getEjcSsoReadiness({});
    expect(readiness).toMatchObject({ enabled: false, status: "configuration_required", configurationComplete: false, callbackPath: "/api/ejc-sso/callback" });
    expect(JSON.stringify(readiness)).not.toContain("EJC_OIDC_");
  });

  it("recognizes complete configuration without activating login", () => {
    const readiness = getEjcSsoReadiness({
      EJC_OIDC_ISSUER: "https://sso.exemplo.org",
      EJC_OIDC_CLIENT_ID: "atlas-forense",
      EJC_OIDC_CLIENT_SECRET: "not-a-real-secret",
    });
    expect(readiness).toMatchObject({ enabled: false, status: "configured_not_activated", configurationComplete: true, protocol: "oidc_authorization_code" });
  });

  it("reports enabled only with explicit flag, complete env and HTTPS issuer", () => {
    const readiness = getEjcSsoReadiness({
      ...COMPLETE_HTTPS,
      EJC_SSO_ENABLED: "true",
    });
    expect(readiness).toMatchObject({ enabled: true, status: "enabled", pkce: "S256", signing: "RS256" });
  });

  it("rejects non-HTTPS issuers even when explicitly enabled (fail-closed)", () => {
    const readiness = getEjcSsoReadiness({
      ...COMPLETE_HTTPS,
      EJC_OIDC_ISSUER: "http://sso.exemplo.org/api/auth/oidc",
      EJC_SSO_ENABLED: "true",
    });
    expect(readiness).toMatchObject({ enabled: false, status: "insecure_issuer" });
  });

  it("keeps the documented required env names", () => {
    expect(EJC_SSO_REQUIRED_ENV).toEqual(["EJC_OIDC_ISSUER", "EJC_OIDC_CLIENT_ID", "EJC_OIDC_CLIENT_SECRET"]);
  });
});

describe("EJC SSO runtime (rotas /api/ejc-sso/*)", () => {
  it("is disabled without the explicit flag", () => {
    const runtime = getEjcSsoRuntime("https://atlas.exemplo.org/api/ejc-sso/callback");
    expect(runtime.status).toBe("disabled");
    expect(runtime.enabled).toBe(false);
  });

  it("activates only with flag + env + HTTPS issuer", () => {
    Object.assign(process.env, {
      ...COMPLETE_HTTPS,
      EJC_SSO_ENABLED: "true",
      EJC_SSO_REDIRECT_URI: "https://atlas.depaulateixeira.adv.br/api/ejc-sso/callback",
    });
    const runtime = getEjcSsoRuntime("https://atlas.exemplo.org/api/ejc-sso/callback");
    expect(runtime).toMatchObject({
      status: "enabled",
      enabled: true,
      redirectUri: "https://atlas.depaulateixeira.adv.br/api/ejc-sso/callback",
    });
  });

  it("falls back to the request-derived redirect URI", () => {
    Object.assign(process.env, { ...COMPLETE_HTTPS, EJC_SSO_ENABLED: "true" });
    const runtime = getEjcSsoRuntime("https://atlas.exemplo.org/api/ejc-sso/callback");
    expect(runtime.status).toBe("enabled");
    expect(runtime.redirectUri).toBe("https://atlas.exemplo.org/api/ejc-sso/callback");
  });

  it("never activates with insecure issuer in production", () => {
    process.env.NODE_ENV = "production";
    Object.assign(process.env, {
      ...COMPLETE_HTTPS,
      EJC_OIDC_ISSUER: "http://localhost:3005/api/auth/oidc",
      EJC_SSO_ENABLED: "true",
    });
    const runtime = getEjcSsoRuntime("https://atlas.exemplo.org/api/ejc-sso/callback");
    expect(runtime.status).toBe("insecure_issuer");
    expect(runtime.enabled).toBe(false);
  });

  it("allows localhost http issuer outside production (exceção de homologação documentada)", () => {
    process.env.NODE_ENV = "development";
    Object.assign(process.env, {
      ...COMPLETE_HTTPS,
      EJC_OIDC_ISSUER: "http://localhost:3005/api/auth/oidc",
      EJC_SSO_ENABLED: "true",
    });
    const runtime = getEjcSsoRuntime("http://localhost:3000/api/ejc-sso/callback");
    expect(runtime.status).toBe("enabled");
    expect(runtime.enabled).toBe(true);
  });
});
