// POST /api/auth/login — autenticação local (e-mail + senha, scrypt).
// Define cookie de sessão HttpOnly assinado (HMAC-SHA256).
// Fail-closed: sem JURIDIA_SESSION_SECRET em produção, retorna 503.
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";
import {
  SESSION_COOKIE,
  sessionCookieOptions,
  signSession,
  isSessionAvailable,
  verifyPassword,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

// Rate limit simples em memória por IP (produção multi-instância: usar store externo).
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 8;

function rateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export async function POST(req: NextRequest) {
  if (!isSessionAvailable()) {
    return NextResponse.json({ error: "sso_login_disabled", reason: "missing_session_secret" }, { status: 503 });
  }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "too_many_attempts" }, { status: 429 });
  }

  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";
  if (!email || !password) {
    return NextResponse.json({ error: "missing_credentials" }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { email } });
  // Mensagem única para usuário inexistente/senha errada (não revela existência).
  if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
    await logAuditEvent({
      action: "login_failed",
      resource: "user",
      resourceId: user?.id ?? null,
      metadata: { via: "password", ip },
      userId: user?.id ?? null,
    });
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  const token = signSession({ uid: user.id, email: user.email, role: user.role });
  if (!token) {
    return NextResponse.json({ error: "sso_login_disabled", reason: "missing_session_secret" }, { status: 503 });
  }
  await db.user.update({ where: { id: user.id }, data: { lastSignedIn: new Date() } });
  await logAuditEvent({
    action: "login_success",
    resource: "user",
    resourceId: user.id,
    metadata: { via: "password", role: user.role },
    userId: user.id,
  });

  const res = NextResponse.json({
    ok: true,
    user: { email: user.email, name: user.name, role: user.role, plan: user.plan },
  });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(req));
  return res;
}
