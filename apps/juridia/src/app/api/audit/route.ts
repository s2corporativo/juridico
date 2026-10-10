import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET: lista eventos de auditoria
export async function GET(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req, { admin: true });
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  const url = new URL(req.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 200);
  const action = url.searchParams.get("action");

  const where: { action?: string } = {};
  if (action) where.action = action;

  const events = await db.auditEvent.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json({
    events: events.map((e) => ({
      id: e.id,
      userId: e.userId,
      action: e.action,
      resource: e.resource,
      resourceId: e.resourceId,
      metadata: safeParse(e.metadata),
      ip: e.ip,
      createdAt: e.createdAt.toISOString(),
    })),
  });
}

// POST: registra novo evento de auditoria (chamado por outras APIs)
export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req, { admin: true });
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  let body: {
    action?: string;
    resource?: string;
    resourceId?: string;
    metadata?: Record<string, unknown>;
  } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!body.action) {
    return NextResponse.json({ error: "action obrigatório" }, { status: 400 });
  }

  const event = await db.auditEvent.create({
    data: {
      userId: authUser.uid,
      action: body.action,
      resource: body.resource || "unknown",
      resourceId: body.resourceId || null,
      metadata: JSON.stringify(body.metadata || {}),
      ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || null,
    },
  });

  return NextResponse.json({ id: event.id, ok: true });
}

function safeParse(raw: string | null): Record<string, unknown> {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}
