// OIDC provider root — returns a minimal info + points to discovery.
// The full OIDC discovery document lives at /.well-known/openid-configuration.
import { NextResponse } from "next/server";
import { discoveryDocument, OIDC_ISSUER } from "@/lib/oidc";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    issuer: OIDC_ISSUER,
    provider: "juridia-oidc",
    mode: "active",
    discovery: `${OIDC_ISSUER}/.well-known/openid-configuration`,
    token_endpoint: `${OIDC_ISSUER}/token`,
    jwks_endpoint: `${OIDC_ISSUER}/jwks`,
    verify_endpoint: `${OIDC_ISSUER}/verify`,
    note:
      "EJC (JuridIA) is the active OIDC identity provider for the Atlas Forense + JuridIA monorepo.",
  });
}
