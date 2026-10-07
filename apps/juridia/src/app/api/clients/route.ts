import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const guard = await requireAuth(req);
  if (!guard.ok) return guard.response;

  const clients = await db.client.findMany({
    where: guard.user.role === "admin" ? {} : { userId: guard.user.uid },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { cases: true } } },
  });

  const clientsWithStats = await Promise.all(
    clients.map(async (client) => {
      const cases = await db.case.findMany({
        where: { clientId: client.id },
        select: { id: true },
      });
      const caseIds = cases.map((item) => item.id);
      const documentsCount = caseIds.length
        ? await db.document.count({ where: { caseId: { in: caseIds } } })
        : 0;
      return {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        document: client.document,
        notes: client.notes,
        color: client.color,
        casesCount: client._count.cases,
        documentsCount,
        createdAt: client.createdAt.toISOString(),
        updatedAt: client.updatedAt.toISOString(),
      };
    }),
  );

  return NextResponse.json({ clients: clientsWithStats });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const guard = await requireAuth(req);
  if (!guard.ok) return guard.response;

  let body: {
    name?: string;
    email?: string;
    phone?: string;
    document?: string;
    notes?: string;
    color?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Nome obrigatório" }, { status: 400 });
  }

  const client = await db.client.create({
    data: {
      userId: guard.user.uid,
      name: body.name.trim(),
      email: body.email?.trim() || null,
      phone: body.phone?.trim() || null,
      document: body.document?.trim() || null,
      notes: body.notes?.trim() || null,
      color: body.color || "",
    },
  });

  await logAuditEvent({
    userId: guard.user.uid,
    action: "create_client",
    resource: "client",
    resourceId: client.id,
    metadata: { name: client.name },
  });

  return NextResponse.json(client, { status: 201 });
}

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  const guard = await requireAuth(req);
  if (!guard.ok) return guard.response;

  let body: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    document?: string;
    notes?: string;
    color?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!body.id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });

  const owned = await db.client.findFirst({
    where: guard.user.role === "admin" ? { id: body.id } : { id: body.id, userId: guard.user.uid },
    select: { id: true },
  });
  if (!owned) return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });

  const data: {
    name?: string;
    email?: string | null;
    phone?: string | null;
    document?: string | null;
    notes?: string | null;
    color?: string;
  } = {};
  if (body.name !== undefined) data.name = body.name.trim();
  if (body.email !== undefined) data.email = body.email.trim() || null;
  if (body.phone !== undefined) data.phone = body.phone.trim() || null;
  if (body.document !== undefined) data.document = body.document.trim() || null;
  if (body.notes !== undefined) data.notes = body.notes.trim() || null;
  if (body.color !== undefined) data.color = body.color;

  const updated = await db.client.update({ where: { id: body.id }, data });
  await logAuditEvent({
    userId: guard.user.uid,
    action: "update_client",
    resource: "client",
    resourceId: body.id,
    metadata: { name: updated.name },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  const guard = await requireAuth(req);
  if (!guard.ok) return guard.response;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });

  const client = await db.client.findFirst({
    where: guard.user.role === "admin" ? { id } : { id, userId: guard.user.uid },
    select: { id: true, name: true },
  });
  if (!client) return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });

  await db.client.delete({ where: { id } });
  await logAuditEvent({
    userId: guard.user.uid,
    action: "delete_client",
    resource: "client",
    resourceId: id,
    metadata: { name: client.name },
  });
  return NextResponse.json({ ok: true });
}
