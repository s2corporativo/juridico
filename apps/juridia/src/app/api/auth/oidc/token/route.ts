// POST /api/auth/oidc/token — troca do código por ID Token (RS256).
//
// Substitui a versão anterior (que emitia JWT para qualquer e-mail sem
// autenticação de cliente). Agora exige, todos obrigatórios:
//   - client_id + client_secret registrados (client_secret_post);
//   - code válido, NÃO usado, não expirado, emitido para este client e
//     redirect_uri idêntico ao do /authorize;
//   - code_verifier PKCE cujo S256 bate com o challenge do código.
// Role: sempre do registro do usuário — nunca aceita do chamador.
import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";
import {
  getIssuerConfig,
  isRegisteredRedirectUri,
  issueIdToken,
  s256Challenge,
} from "@/lib/oidc";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const cfg = getIssuerConfig();
  if ("error" in cfg) {
    return NextResponse.json({ error: cfg.error }, { status: 503 });
  }

  let body: Record<string, string>;
  try {
    body = (await req.json()) as Record<string, string>;
  } catch {
    // Também aceita application/x-www-form-urlencoded (padrão OAuth).
    try {
      const form = await req.formData();
      body = Object.fromEntries(
        Array.from(form.entries()).map(([k, v]) => [k, typeof v === "string" ? v : ""]),
      );
    } catch {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }
  }

  const clientId = (body.client_id || "").trim();
  const clientSecret = (body.client_secret || "").trim();
  const code = (body.code || "").trim();
  const redirectUri = (body.redirect_uri || "").trim();
  const codeVerifier = (body.code_verifier || "").trim();

  // Autenticação de cliente OBRIGATÓRIA (timing-safe).
  const secretBuf = Buffer.from(clientSecret);
  const expectedBuf = Buffer.from(cfg.clientSecret);
  if (
    clientId !== cfg.clientId ||
    secretBuf.length !== expectedBuf.length ||
    !timingSafeEqual(secretBuf, expectedBuf)
  ) {
    return NextResponse.json({ error: "invalid_client" }, { status: 401 });
  }

  if (!code || !redirectUri || !codeVerifier) {
    return NextResponse.json({ error: "invalid_request", required: ["code", "redirect_uri", "code_verifier"] }, { status: 400 });
  }
  if (!isRegisteredRedirectUri(cfg, redirectUri)) {
    return NextResponse.json({ error: "invalid_redirect_uri" }, { status: 400 });
  }

  const record = await db.oidcAuthCode.findUnique({ where: { code } });
  if (!record || record.used) {
    return NextResponse.json({ error: "invalid_grant", error_description: "code_unknown_or_reused" }, { status: 400 });
  }
  // Single-use: marca como usado ANTES de validar o restante (impede replay).
  await db.oidcAuthCode.update({ where: { code }, data: { used: true } });

  if (record.expiresAt.getTime() < Date.now()) {
    return NextResponse.json({ error: "invalid_grant", error_description: "code_expired" }, { status: 400 });
  }
  if (record.clientId !== clientId || record.redirectUri !== redirectUri) {
    return NextResponse.json({ error: "invalid_grant", error_description: "binding_mismatch" }, { status: 400 });
  }
  if (record.codeChallengeMethod !== "S256" || !record.codeChallenge || s256Challenge(codeVerifier) !== record.codeChallenge) {
    return NextResponse.json({ error: "invalid_grant", error_description: "pkce_mismatch" }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { email: record.sub } });
  if (!user) {
    return NextResponse.json({ error: "invalid_grant", error_description: "subject_unknown" }, { status: 400 });
  }

  const { token, expiresAt } = await issueIdToken({
    issuer: cfg.issuer,
    sub: user.email,
    role: user.role,
    nonce: record.nonce,
    name: user.name,
    email: user.email,
  });
  await logAuditEvent({
    action: "oidc_token_issued",
    resource: "user",
    resourceId: user.id,
    metadata: { clientId },
    userId: user.id,
  });

  return NextResponse.json({
    access_token: token, // por referência: mesmo JWT, consumível via /verify
    token_type: "Bearer",
    id_token: token,
    expires_in: 600,
    scope: record.scope,
  });
}
