// POST /api/auth/oidc/verify — introspecção compatível (body: { token }).
// Validação RS256 local; útil para diagnóstico e para consumidores que
// preferem validação centralizada. Prefira validação via JWKS.
import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/oidc";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { token?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const token = (body.token || "").trim();
  if (!token) {
    return NextResponse.json({ error: "missing_token" }, { status: 400 });
  }
  const result = await verifyIdToken(token);
  if (result.valid) {
    return NextResponse.json({ valid: true, claims: result.claims });
  }
  return NextResponse.json({ valid: false, error: result.error }, { status: 401 });
}
