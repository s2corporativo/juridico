// Autenticação do JuridIA — sessão local + guards de rota.
//
// Modelo de segurança:
// - Senha: scrypt (N=16384) com salt aleatório por usuário, comparação timing-safe.
// - Sessão: cookie HttpOnly `ejc_session` = base64url(payload).HMAC-SHA256.
//   Payload: { uid, email, role, iat, exp } — assinado com JURIDIA_SESSION_SECRET.
// - Fail-closed: em produção, JURIDIA_SESSION_SECRET ausente DESLIGA o login e
//   todas as rotas protegidas (nunca usa segredo padrão conhecido).
// - Cookies: Secure + SameSite=Lax (SSO autoriza top-level navigation);
//   HttpOnly sempre; Secure automático atrás de proxy HTTPS (x-forwarded-proto).
//
// Esta biblioteca é a única fonte de verdade para guards de rota; não use
// auth "client-side" (store.ts) para decisão de segurança.

import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const SESSION_COOKIE = "ejc_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 dias

export const ROLES = ["admin", "advogado", "user", "promotor", "juiz"] as const;
export type Role = (typeof ROLES)[number];

interface SessionPayload {
  uid: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

function getSessionSecret(): string | null {
  const secret = process.env.JURIDIA_SESSION_SECRET?.trim();
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV === "production") {
    console.error(
      "[Auth] JURIDIA_SESSION_SECRET ausente ou curta em produção — login e rotas protegidas ficarão INDISPONÍVEIS (fail-closed).",
    );
    return null;
  }
  // Dev: segredo efêmero por processo (inválido entre restarts — aceitável em dev).
  return "dev-only-ephemeral-session-secret-0123456789abcdef";
}

function base64UrlEncode(input: Buffer | string): string {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): Buffer {
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  return Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

// ── Senha (scrypt) ───────────────────────────────────────────────────────────

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const salt = Buffer.from(parts[1], "base64");
  const expected = Buffer.from(parts[2], "base64");
  const actual = scryptSync(password, salt, expected.length, { N: 16384, r: 8, p: 1 });
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

// ── Sessão (cookie assinado) ─────────────────────────────────────────────────

export function isSessionAvailable(): boolean {
  return getSessionSecret() !== null;
}

export function signSession(payload: { uid: string; email: string; role: string }): string | null {
  const secret = getSessionSecret();
  if (!secret) return null;
  const now = Math.floor(Date.now() / 1000);
  const body: SessionPayload = { ...payload, iat: now, exp: now + SESSION_TTL_SECONDS };
  const bodyB64 = base64UrlEncode(JSON.stringify(body));
  const sig = base64UrlEncode(createHmac("sha256", secret).update(bodyB64).digest());
  return `${bodyB64}.${sig}`;
}

export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  const secret = getSessionSecret();
  if (!secret || !token) return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const bodyB64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expectedSig = base64UrlEncode(createHmac("sha256", secret).update(bodyB64).digest());
  const sigBuf = base64UrlDecode(sig);
  const expBuf = base64UrlDecode(expectedSig);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return null;
  try {
    const payload = JSON.parse(base64UrlDecode(bodyB64).toString("utf8")) as SessionPayload;
    if (typeof payload.exp !== "number" || Math.floor(Date.now() / 1000) >= payload.exp) return null;
    if (typeof payload.uid !== "string" || typeof payload.email !== "string") return null;
    return payload;
  } catch {
    return null;
  }
}

export function readSessionCookie(req: NextRequest): SessionPayload | null {
  return verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
}

export function sessionCookieOptions(req: NextRequest) {
  const forwardedProto = req.headers.get("x-forwarded-proto");
  const isHttps = req.nextUrl.protocol === "https:" ||
    (forwardedProto ? forwardedProto.split(",")[0]?.trim() === "https" : false);
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isHttps,
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

// ── Guards de rota ───────────────────────────────────────────────────────────

export interface AuthedUser {
  uid: string;
  email: string;
  role: string;
  name: string | null;
}

export type GuardResult = { ok: true; user: AuthedUser } | { ok: false; response: NextResponse };

/**
 * Valida a sessão do cookie e recarrega o usuário do banco (role fresca).
 * Retorna 401/403 pronto para resposta quando não autorizado.
 */
export async function requireAuth(req: NextRequest, opts: { admin?: boolean } = {}): Promise<GuardResult> {
  const session = readSessionCookie(req);
  if (!session) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "unauthenticated", hint: "Faça login em /api/auth/login" },
        { status: 401 },
      ),
    };
  }
  const dbUser = await db.user.findUnique({ where: { id: session.uid } });
  if (!dbUser || dbUser.email !== session.email) {
    return { ok: false, response: NextResponse.json({ error: "session_invalid" }, { status: 401 }) };
  }
  if (opts.admin && dbUser.role !== "admin") {
    return { ok: false, response: NextResponse.json({ error: "forbidden", need: "admin" }, { status: 403 }) };
  }
  return {
    ok: true,
    user: { uid: dbUser.id, email: dbUser.email, role: dbUser.role, name: dbUser.name },
  };
}

/**
 * Envolve um handler exigindo sessão válida. Uso:
 *   export const GET = withAuth(async (req, user) => { ... });
 *   export const POST = withAuth(async (req, user) => { ... }, { admin: true });
 */
type Handler = (req: NextRequest, user: AuthedUser) => Promise<NextResponse> | NextResponse;

export function withAuth(handler: Handler, opts: { admin?: boolean } = {}) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const guard = await requireAuth(req, opts);
    if (!guard.ok) return guard.response;
    try {
      return await handler(req, guard.user);
    } catch (e) {
      console.error("[Auth] handler error:", e instanceof Error ? e.message : e);
      return NextResponse.json({ error: "internal_error" }, { status: 500 });
    }
  };
}
