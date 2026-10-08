import { afterEach, describe, expect, it } from "vitest";
import { ATLAS_SSO_REQUIRED_ENV, getAtlasSsoReadiness, getAtlasSsoRuntime } from "./sso-config";

const COMPLETE_HTTPS = {
  JURIDIA_OIDC_ISSUER: "https://juridia.exemplo.org/api/auth/oidc",
  ATLAS_OIDC_CLIENT_ID: "atlas-juridico",
  ATLAS_OIDC_CLIENT_SECRET: "not-a-real-secret",
} as const;

const PREV_NODE_ENV = process.env.NODE_ENV;

afterEach(() => {
  for (const key of [
    "ATLAS_SSO_ENABLED", "JURIDIA_OIDC_ISSUER", "ATLAS_OIDC_CLIENT_ID",
    "ATLAS_OIDC_CLIENT_SECRET", "ATLAS_SSO_REDIRECT_URI", "JURIDIA_APP_URL",
  ]) delete process.env[key];
  process.env.NODE_ENV = PREV_NODE_ENV;
});

describe("Atlas SSO readiness", () => {
  it("fails closed without configuration", () => {
    expect(getAtlasSsoReadiness({})).toMatchObject({
      enabled: false,
      status: "configuration_required",
      configurationComplete: false,
      callbackPath: "/api/sso/callback",
    });
  });

  it("enables only with explicit flag, complete env and HTTPS issuer", () => {
    const readiness = getAtlasSsoReadiness({ ...COMPLETE_HTTPS, ATLAS_SSO_ENABLED: "true" });
    expect(readiness).toMatchObject({ enabled: true, status: "enabled", pkce: "S256", signing: "RS256" });
  });

  it("rejects insecure issuer in production", () => {
    const readiness = getAtlasSsoReadiness({
      ...COMPLETE_HTTPS,
      JURIDIA_OIDC_ISSUER: "http://juridia.exemplo.org/api/auth/oidc",
      ATLAS_SSO_ENABLED: "true",
      NODE_ENV: "production",
    });
    expect(readiness).toMatchObject({ enabled: false, status: "insecure_issuer" });
  });

  it("keeps canonical required variables", () => {
    expect(ATLAS_SSO_REQUIRED_ENV).toEqual([
      "JURIDIA_OIDC_ISSUER", "ATLAS_OIDC_CLIENT_ID", "ATLAS_OIDC_CLIENT_SECRET",
    ]);
  });
});

describe("Atlas SSO runtime", () => {
  it("uses canonical callback", () => {
    Object.assign(process.env, COMPLETE_HTTPS, {
      ATLAS_SSO_ENABLED: "true",
      ATLAS_SSO_REDIRECT_URI: "https://atlas.exemplo.org/api/sso/callback",
    });
    const runtime = getAtlasSsoRuntime();
    expect(runtime).toMatchObject({
      status: "enabled",
      redirectUri: "https://atlas.exemplo.org/api/sso/callback",
    });
  });
});
