import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const guard = await requireAuth(req, { admin: true });
  if (!guard.ok) return guard.response;

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
    events: events.map((event) => ({
      id: event.id,
      userId: event.userId,
      action: event.action,
      resource: event.resource,
      resourceId: event.resourceId,
      metadata: safeParse(event.metadata),
      ip: event.ip,
      createdAt: event.createdAt.toISOString(),
    })),
  });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const guard = await requireAuth(req, { admin: true });
  if (!guard.ok) return guard.response;

  let body: {
    action?: string;
    resource?: string;
    resourceId?: string;
    metadata?: Record<string, unknown>;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!body.action?.trim()) {
    return NextResponse.json({ error: "action obrigatório" }, { status: 400 });
  }

  const event = await db.auditEvent.create({
    data: {
      userId: guard.user.uid,
      action: body.action.trim(),
      resource: body.resource?.trim() || "unknown",
      resourceId: body.resourceId || null,
      metadata: JSON.stringify(body.metadata ?? {}),
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
