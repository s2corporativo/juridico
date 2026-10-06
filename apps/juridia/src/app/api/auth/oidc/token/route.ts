// Token endpoint — issues an HS256 JWT for a given email + persona.
// Body: { email: string, persona: string, role?: string }
// Returns: { access_token, token_type: "Bearer", expires_in: 3600 }
import { NextRequest, NextResponse } from "next/server";
import { issueJwt } from "@/lib/oidc";

export const dynamic = "force-dynamic";

const ALLOWED_PERSONAS = new Set(["admin", "user", "advogado", "promotor", "juiz"]);

export async function POST(req: NextRequest) {
  let body: { email?: string; persona?: string; role?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  const persona = (body.persona || "").trim().toLowerCase();

  if (!email || !persona) {
    return NextResponse.json(
      { error: "missing_fields", required: ["email", "persona"] },
      { status: 400 },
    );
  }
  if (!ALLOWED_PERSONAS.has(persona)) {
    return NextResponse.json(
      {
        error: "invalid_persona",
        allowed: Array.from(ALLOWED_PERSONAS),
      },
      { status: 400 },
    );
  }

  // NOTE: This minimal IdP trusts the caller (Atlas) to have already authenticated the
  // user. In production, this endpoint should validate a client_assertion or an
  // authorization_code. The X-API-Token header can be required by upstream middleware.
  const apiToken = req.headers.get("x-api-token");
  if (process.env.JURIDIA_API_TOKEN && apiToken !== process.env.JURIDIA_API_TOKEN) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { token, expiresAt } = issueJwt({ email, persona, role: body.role });
  return NextResponse.json({
    access_token: token,
    token_type: "Bearer",
    expires_in: 3600,
    expires_at: expiresAt,
    persona,
  });
}
