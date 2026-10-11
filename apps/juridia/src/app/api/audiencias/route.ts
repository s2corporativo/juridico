import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";
import { parseJsonBody } from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth";
import { accessibleCaseIds, hasCaseAccess } from "@/lib/case-access";

export const dynamic = "force-dynamic";

// GET /api/audiencias?caseId=xxx
export async function GET(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  const url = new URL(req.url);
  const caseId = url.searchParams.get("caseId");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const status = url.searchParams.get("status");

  const where: { caseId?: string | { in: string[] }; data?: { gte?: Date; lte?: Date }; status?: string } = {};
  if (caseId) {
    if (!(await hasCaseAccess(caseId, authUser.uid, authUser.role))) {
      return NextResponse.json({ error: "case_not_found" }, { status: 404 });
    }
    where.caseId = caseId;
  } else {
    const ids = await accessibleCaseIds(authUser.uid, authUser.role);
    if (ids !== null) where.caseId = { in: ids };
  }
  if (status) where.status = status;
  if (from || to) {
    where.data = {};
    if (from) {
      const parsed = new Date(from);
      if (Number.isNaN(parsed.getTime())) return NextResponse.json({ error: "invalid_from" }, { status: 400 });
      where.data.gte = parsed;
    }
    if (to) {
      const parsed = new Date(to);
      if (Number.isNaN(parsed.getTime())) return NextResponse.json({ error: "invalid_to" }, { status: 400 });
      where.data.lte = parsed;
    }
  }

  const audiencias = await db.caseHearing.findMany({
    where,
    orderBy: { data: "asc" },
    take: 200,
  });

  return NextResponse.json({
    audiencias: audiencias.map((a) => ({
      id: a.id,
      caseId: a.caseId,
      data: a.data.toISOString(),
      tipo: a.tipo,
      local: a.local,
      orgao: a.orgao,
      status: a.status,
      resultado: a.resultado,
      observacoes: a.observacoes,
    })),
    total: audiencias.length,
  });
}

// POST /api/audiencias
export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  const parsed = await parseJsonBody<{
    caseId?: string;
    data?: string;
    tipo?: string;
    local?: string;
    orgao?: string;
    observacoes?: string;
  }>(req);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const { caseId, data, tipo, local, orgao, observacoes } = parsed.body;
  if (!caseId) return NextResponse.json({ error: "caseId obrigatório" }, { status: 400 });
  if (!data) return NextResponse.json({ error: "data obrigatória" }, { status: 400 });

  if (!(await hasCaseAccess(caseId, authUser.uid, authUser.role))) {
    return NextResponse.json({ error: "case_not_found" }, { status: 404 });
  }
  const parsedDate = new Date(data);
  if (Number.isNaN(parsedDate.getTime())) {
    return NextResponse.json({ error: "invalid_hearing_date" }, { status: 400 });
  }

  const aud = await db.caseHearing.create({
    data: {
      caseId,
      data: parsedDate,
      tipo: tipo || "outra",
      local: local || null,
      orgao: orgao || null,
      observacoes: observacoes || null,
    },
  });

  await logAuditEvent({
    action: "audiencia_create",
    userId: authUser.uid,
    resource: "case_hearing",
    resourceId: aud.id,
    metadata: { caseId, data: aud.data.toISOString(), tipo: aud.tipo },
  });

  return NextResponse.json({
    id: aud.id,
    caseId: aud.caseId,
    data: aud.data.toISOString(),
    tipo: aud.tipo,
    local: aud.local,
    orgao: aud.orgao,
    status: aud.status,
  });
}

// PATCH /api/audiencias
export async function PATCH(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  const parsed = await parseJsonBody<{
    id?: string;
    data?: string;
    tipo?: string;
    local?: string;
    orgao?: string;
    status?: string;
    resultado?: string;
    observacoes?: string;
  }>(req);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const { id, data, tipo, local, orgao, status, resultado, observacoes } = parsed.body;
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });

  const existing = await db.caseHearing.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Audiência não encontrada" }, { status: 404 });
  if (!(await hasCaseAccess(existing.caseId, authUser.uid, authUser.role))) {
    return NextResponse.json({ error: "hearing_not_found" }, { status: 404 });
  }

  const updateData: Record<string, unknown> = {};
  if (data !== undefined) {
    const parsedDate = new Date(data);
    if (Number.isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: "invalid_hearing_date" }, { status: 400 });
    }
    updateData.data = parsedDate;
  }
  if (tipo !== undefined) updateData.tipo = tipo;
  if (local !== undefined) updateData.local = local || null;
  if (orgao !== undefined) updateData.orgao = orgao || null;
  if (status !== undefined) updateData.status = status;
  if (resultado !== undefined) updateData.resultado = resultado;
  if (observacoes !== undefined) updateData.observacoes = observacoes || null;

  await db.caseHearing.update({ where: { id }, data: updateData });

  await logAuditEvent({
    action: "audiencia_update",
    userId: authUser.uid,
    resource: "case_hearing",
    resourceId: id,
    metadata: { ...updateData, prevStatus: existing.status },
  });

  return NextResponse.json({ ok: true });
}

// DELETE /api/audiencias?id=xxx
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });

  const existing = await db.caseHearing.findUnique({ where: { id }, select: { caseId: true } });
  if (!existing) return NextResponse.json({ error: "Audiência não encontrada" }, { status: 404 });
  if (!(await hasCaseAccess(existing.caseId, authUser.uid, authUser.role))) {
    return NextResponse.json({ error: "hearing_not_found" }, { status: 404 });
  }

  await db.caseHearing.delete({ where: { id } });

  await logAuditEvent({
    action: "audiencia_delete",
    userId: authUser.uid,
    resource: "case_hearing",
    resourceId: id,
    metadata: { caseId: existing.caseId },
  });

  return NextResponse.json({ ok: true });
}
