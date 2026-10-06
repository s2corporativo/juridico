// OIDC discovery document — /.well-known/openid-configuration
// Fail-closed: sem configuração do emissor (issuer/cliente), responde 503.
import { NextResponse } from "next/server";
import { discoveryDocument, getIssuerConfig } from "@/lib/oidc";

export const dynamic = "force-dynamic";

export async function GET() {
  const cfg = getIssuerConfig();
  if ("error" in cfg) {
    return NextResponse.json({ error: cfg.error }, { status: 503 });
  }
  return NextResponse.json(discoveryDocument(cfg.issuer), {
    headers: { "Cache-Control": "public, max-age=300" },
  });
}
