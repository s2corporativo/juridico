// GET /api/auth/oidc/jwks — chave pública RS256 real do IdP.
// O Atlas valida a assinatura do ID Token OFFLINE via este JWKS
// (jose.createRemoteJWKSet), conforme a regra de ativação documentada.
import { NextResponse } from "next/server";
import { jwksResponse } from "@/lib/oidc";

export const dynamic = "force-dynamic";

export async function GET() {
  const jwks = await jwksResponse();
  return NextResponse.json(jwks, {
    headers: { "Cache-Control": "public, max-age=300" },
  });
}
