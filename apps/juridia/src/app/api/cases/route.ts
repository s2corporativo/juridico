import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";
import { requireAuth } from "@/lib/auth";
import { beforeLegalCursor, encodeLegalCursor, parseLegalPageParams } from "@/lib/legal-list-cursor";

export const dynamic = "force-dynamic";

// GET: lista casos com filtros
export async function GET(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  const url = new URL(req.url);
  const clientId = url.searchParams.get("clientId");
  const status = url.searchParams.get("status");
  const area = url.searchParams.get("area");
  const page = parseLegalPageParams(url.searchParams);
  if (!page.ok) return NextResponse.json({ error: page.error }, { status: 400 });

  const where: import("@prisma/client").Prisma.CaseWhereInput = {
    client: { is: { userId: authUser.uid } },
  };
  if (clientId) where.clientId = clientId;
  if (status) where.status = status;
  else where.status = { not: "arquivado" };
  if (area) where.area = area;
  if (page.cursor) where.AND = [beforeLegalCursor(page.cursor)];

  const rows = await db.case.findMany({
    where,
    orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
    take: page.limit + 1,
    include: {
      client: { select: { id: true, name: true, color: true } },
      _count: { select: { documents: true, movimentos: true, audiencias: true } },
    },
  });

  const hasMore = rows.length > page.limit;
  const cases = rows.slice(0, page.limit);
  const nextCursor = hasMore ? encodeLegalCursor(cases[cases.length - 1]) : null;
  return NextResponse.json({
    nextCursor,
    hasMore,
    cases: cases.map((c) => ({
      id: c.id,
      title: c.title,
      number: c.number,
      area: c.area,
      responsavel: c.responsavel,
      prioridade: c.prioridade,
      valor: c.valor,
      status: c.status,
      dataDistribuicao: c.dataDistribuicao?.toISOString(),
      dataEncerramento: c.dataEncerramento?.toISOString(),
      resultado: c.resultado,
      notes: c.notes,
      processosVinculados: JSON.parse(c.processosVinculados || "[]"),
      clientId: c.clientId,
      clientName: c.client?.name,
      clientColor: c.client?.color,
      documentsCount: c._count.documents,
      movimentosCount: c._count.movimentos,
      audienciasCount: c._count.audiencias,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    })),
  });
}

// POST: cria novo caso
export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  let body: {
    clientId?: string;
    title?: string;
    number?: string;
    area?: string;
    responsavel?: string;
    prioridade?: string;
    valor?: string;
    notes?: string;
    dataDistribuicao?: string;
    processosVinculados?: string[];
  } = {};
  try { body = await req.json(); } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }

  if (!body.clientId) return NextResponse.json({ error: "clientId obrigatório" }, { status: 400 });
  if (!body.title?.trim()) return NextResponse.json({ error: "Título do caso obrigatório" }, { status: 400 });
  const ownClient = await db.client.findFirst({
    where: { id: body.clientId, userId: authUser.uid },
    select: { id: true },
  });
  if (!ownClient) return NextResponse.json({ error: "client_not_found" }, { status: 404 });

  const newCase = await db.case.create({
    data: {
      clientId: body.clientId,
      title: body.title.trim(),
      number: body.number?.trim() || null,
      area: body.area || "civil",
      responsavel: body.responsavel?.trim() || null,
      prioridade: body.prioridade || "media",
      valor: body.valor?.trim() || null,
      notes: body.notes?.trim() || null,
      dataDistribuicao: body.dataDistribuicao ? new Date(body.dataDistribuicao) : null,
      processosVinculados: JSON.stringify(body.processosVinculados || []),
    },
  });

  await logAuditEvent({
    action: "create_case",
    resource: "case",
    resourceId: newCase.id,
    metadata: { title: newCase.title, area: newCase.area, responsavel: newCase.responsavel },
  });

  return NextResponse.json({
    id: newCase.id,
    title: newCase.title,
    number: newCase.number,
    area: newCase.area,
    responsavel: newCase.responsavel,
    prioridade: newCase.prioridade,
    valor: newCase.valor,
    status: newCase.status,
  });
}

// PATCH: atualiza caso (inclui encerramento)
export async function PATCH(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  let body: {
    id?: string;
    title?: string;
    number?: string;
    area?: string;
    responsavel?: string;
    prioridade?: string;
    valor?: string;
    status?: string;
    notes?: string;
    dataDistribuicao?: string;
    dataEncerramento?: string;
    resultado?: string;
    processosVinculados?: string[];
  } = {};
  try { body = await req.json(); } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }

  if (!body.id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });

  const data: Record<string, unknown> = {};
  if (body.title !== undefined) data.title = body.title.trim();
  if (body.number !== undefined) data.number = body.number.trim() || null;
  if (body.area !== undefined) data.area = body.area;
  if (body.responsavel !== undefined) data.responsavel = body.responsavel.trim() || null;
  if (body.prioridade !== undefined) data.prioridade = body.prioridade;
  if (body.valor !== undefined) data.valor = body.valor.trim() || null;
  if (body.status !== undefined) data.status = body.status;
  if (body.notes !== undefined) data.notes = body.notes.trim() || null;
  if (body.dataDistribuicao !== undefined) data.dataDistribuicao = body.dataDistribuicao ? new Date(body.dataDistribuicao) : null;
  if (body.dataEncerramento !== undefined) data.dataEncerramento = body.dataEncerramento ? new Date(body.dataEncerramento) : null;
  if (body.resultado !== undefined) data.resultado = body.resultado;
  if (body.processosVinculados !== undefined) data.processosVinculados = JSON.stringify(body.processosVinculados);

  const existing = await db.case.findFirst({
    where: { id: body.id, client: { is: { userId: authUser.uid } } },
    select: { title: true, status: true, resultado: true },
  });
  if (!existing) return NextResponse.json({ error: "case_not_found" }, { status: 404 });
  const updated = await db.case.updateMany({
    where: { id: body.id, client: { is: { userId: authUser.uid } } },
    data,
  });
  if (updated.count !== 1) return NextResponse.json({ error: "case_not_found" }, { status: 404 });

  await logAuditEvent({
    action: body.status === "encerrado" ? "close_case" : "update_case",
    resource: "case",
    resourceId: body.id,
    metadata: { title: data.title ?? existing.title, status: data.status ?? existing.status, resultado: data.resultado ?? existing.resultado },
  });

  return NextResponse.json({ ok: true });
}

// DELETE: exclui caso
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });

  const c = await db.case.findFirst({
    where: { id, client: { is: { userId: authUser.uid } } },
    select: { title: true },
  });
  if (!c) return NextResponse.json({ error: "case_not_found" }, { status: 404 });
  const deleted = await db.case.deleteMany({
    where: { id, client: { is: { userId: authUser.uid } } },
  });
  if (deleted.count !== 1) return NextResponse.json({ error: "case_not_found" }, { status: 404 });

  await logAuditEvent({
    action: "delete_case",
    resource: "case",
    resourceId: id,
    metadata: { title: c?.title },
  });

  return NextResponse.json({ ok: true });
}
