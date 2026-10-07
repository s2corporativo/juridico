// GET /api/auth/oidc/authorize — início do Authorization Code Flow + PKCE.
//
// Requisitos de segurança do fluxo OIDC:
// - usuário autenticado no Atlas Jurídico (sessão local) — sem sessão, redireciona
//   para /login?next=<authorize-url> preservando a requisição original;
// - client_id registrado + redirect_uri EXATO (allowlist);
// - response_type=code e PKCE S256 obrigatórios;
// - emite código single-use (TTL 120 s) e redireciona com code + state.
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";
import { readSessionCookie } from "@/lib/auth";
import {
  getIssuerConfig,
  isRegisteredRedirectUri,
  generateAuthCode,
  codeExpiry,
} from "@/lib/oidc";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const cfg = getIssuerConfig();
  if ("error" in cfg) {
    return NextResponse.json({ error: cfg.error }, { status: 503 });
  }

  const url = req.nextUrl;
  const clientId = url.searchParams.get("client_id") || "";
  const redirectUri = url.searchParams.get("redirect_uri") || "";
  const responseType = url.searchParams.get("response_type") || "";
  const state = url.searchParams.get("state") || "";
  const nonce = url.searchParams.get("nonce") || "";
  const codeChallenge = url.searchParams.get("code_challenge") || "";
  const codeChallengeMethod = url.searchParams.get("code_challenge_method") || "";

  if (clientId !== cfg.clientId) {
    return NextResponse.json({ error: "unauthorized_client" }, { status: 401 });
  }
  if (!isRegisteredRedirectUri(cfg, redirectUri)) {
    // redirect_uri inválido NUNCA redireciona — resposta direta ao chamador.
    return NextResponse.json({ error: "invalid_redirect_uri" }, { status: 400 });
  }
  if (responseType !== "code") {
    return NextResponse.redirect(new URL(`${redirectUri}?error=unsupported_response_type&state=${encodeURIComponent(state)}`));
  }
  if (!codeChallenge || codeChallengeMethod !== "S256") {
    return NextResponse.redirect(new URL(`${redirectUri}?error=invalid_request&error_description=pkce_required&state=${encodeURIComponent(state)}`));
  }

  // Sessão obrigatória: sem identidade autenticada não há authorization code.
  const session = readSessionCookie(req);
  if (!session) {
    const loginUrl = new URL("/login", url.origin);
    loginUrl.searchParams.set("next", url.toString());
    return NextResponse.redirect(loginUrl);
  }

  const dbUser = await db.user.findUnique({ where: { id: session.uid } });
  if (!dbUser || dbUser.email !== session.email) {
    const loginUrl = new URL("/login", url.origin);
    loginUrl.searchParams.set("next", url.toString());
    return NextResponse.redirect(loginUrl);
  }

  const code = generateAuthCode();
  await db.oidcAuthCode.create({
    data: {
      code,
      clientId,
      sub: dbUser.email,
      redirectUri,
      scope: "openid profile email role persona",
      nonce: nonce || null,
      codeChallenge,
      codeChallengeMethod,
      expiresAt: codeExpiry(),
    },
  });
  await logAuditEvent({
    action: "oidc_authorize",
    resource: "user",
    resourceId: dbUser.id,
    metadata: { clientId, redirectUri },
    userId: dbUser.id,
  });

  const redirect = new URL(redirectUri);
  redirect.searchParams.set("code", code);
  if (state) redirect.searchParams.set("state", state);
  return NextResponse.redirect(redirect);
}
