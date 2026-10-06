// OIDC provider root — informação + ponteiro para discovery.
// Estado honesto: "active" somente com cliente registrado e issuer válido.
import { NextResponse } from "next/server";
import { getIssuerConfig } from "@/lib/oidc";

export const dynamic = "force-dynamic";

export async function GET() {
  const cfg = getIssuerConfig();
  if ("error" in cfg) {
    return NextResponse.json({ provider: "juridia-oidc", mode: "not_configured", error: cfg.error }, { status: 503 });
  }
  return NextResponse.json({
    issuer: cfg.issuer,
    provider: "juridia-oidc",
    mode: "active",
    signing: "RS256",
    pkce: "S256",
    discovery: `${cfg.issuer}/.well-known/openid-configuration`,
    token_endpoint: `${cfg.issuer}/token`,
    jwks_endpoint: `${cfg.issuer}/jwks`,
    verify_endpoint: `${cfg.issuer}/verify`,
    registered_redirect_uris: cfg.redirectUris,
    note: "EJC (JuridIA) é o provedor de identidade OIDC do sistema unificado Atlas Forense + JuridIA.",
  });
}
