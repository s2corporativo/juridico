import { describe, expect, test } from "bun:test";
import { oidcLoginRedirect } from "../src/lib/oidc-login-redirect";

describe("OIDC atrás do proxy — URL pública, nunca origem interna", () => {
  test("issuer HTTPS governa login e retorno para /juridia/api/authorize", () => {
    const issuer = "https://atlas.13.140.167.153.sslip.io/juridia/api/auth/oidc";
    const params = new URLSearchParams({
      client_id: "atlas-forense",
      redirect_uri: "https://atlas.13.140.167.153.sslip.io/api/ejc-sso/callback",
      response_type: "code",
      code_challenge_method: "S256",
      code_challenge: "a".repeat(43),
      state: "qa-state",
    });
    const login = oidcLoginRedirect(issuer, params);
    expect(login.origin).toBe("https://atlas.13.140.167.153.sslip.io");
    expect(login.pathname).toBe("/juridia/login");
    const next = new URL(login.searchParams.get("next") ?? "");
    expect(next.pathname).toBe("/juridia/api/auth/oidc/authorize");
    expect(next.origin).toBe(login.origin);
    expect(next.searchParams.get("code_challenge")).toBe("a".repeat(43));
    expect(next.searchParams.get("redirect_uri")).toBe(params.get("redirect_uri"));
    expect(login.toString()).not.toContain("localhost:3005");
  });

  test("issuer localhost funciona somente quando explicitamente configurado no ambiente de desenvolvimento", () => {
    const login = oidcLoginRedirect("http://localhost:3005/juridia/api/auth/oidc", new URLSearchParams("state=qa"));
    expect(login.pathname).toBe("/juridia/login");
    expect(new URL(login.searchParams.get("next") ?? "").pathname).toBe("/juridia/api/auth/oidc/authorize");
  });
});
