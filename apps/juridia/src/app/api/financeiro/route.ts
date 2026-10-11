import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parseJsonBody } from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth";
import { accessibleCaseIds, hasCaseAccess } from "@/lib/case-access";
import { parseHonorariumInput, replayHonoraria, type Honorarium } from "@/lib/finance-ledger";

export const dynamic = "force-dynamic";

const ACTIONS = ["honorario_create", "honorario_update", "honorario_delete"];
const MAX_ROWS = 10_000;

async function ledger(): Promise<Honorarium[] | null> {
  // Never silently truncate accounting information. If the volume grows,
  // migrate to a dedicated honorarium table with paginated projections.
  const rows = await db.auditEvent.findMany({
    where: { resource: "financeiro", action: { in: ACTIONS } },
    orderBy: { createdAt: "asc" }, take: MAX_ROWS + 1,
  });
  return rows.length > MAX_ROWS ? null : replayHonoraria(rows);
}
async function visible(auth: { uid: string; role: string }) {
  const list = await ledger();
  if (!list) return null;
  const cases = await accessibleCaseIds(auth.uid, auth.role);
  const allowed = cases === null ? null : new Set(cases);
  return list.filter(row =>
    auth.role === "admin" ||
    (row.ownerId === auth.uid && (row.caseId === null || allowed?.has(row.caseId)))
  );
}
function money(value: unknown): number | null {
  if (typeof value === "number") return value;
  if (typeof value !== "string" || value.length > 22) return null;
  const s = value.trim();
  if (/^\d{1,3}(?:\.\d{3})+,(?:\d{1,2})?$/.test(s)) {
    return Number(s.replace(/\./g, "").replace(",", "."));
  }
  if (/^\d+(?:[.,]\d{1,2})?$/.test(s)) return Number(s.replace(",", "."));
  return null;
}
function fail(code: string, status: number) {
  return NextResponse.json({ error: code }, { status });
}
function csvCell(value: unknown) {
  const s = String(value ?? "");
  const protectedText = /^[\s]*[=+@-]/.test(s) ? "'" + s : s;
  return '"' + protectedText.replace(/"/g, '""') + '"';
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;
  const url = new URL(req.url);
  const caseId = url.searchParams.get("caseId");
  const status = url.searchParams.get("status");
  if (caseId && !(await hasCaseAccess(caseId, auth.user.uid, auth.user.role))) {
    return fail("case_not_found", 404);
  }
  if (status && !["pendente", "pago", "atrasado"].includes(status)) return fail("invalid_status", 400);
  const all = await visible(auth.user);
  if (!all) return fail("finance_ledger_requires_migration", 503);
  const honorarios = all.filter(h => (!caseId || h.caseId === caseId) && (!status || h.status === status));
  if (url.searchParams.get("export") === "csv") {
    const cols = ["id", "caseId", "descricao", "valor", "vencimento", "status", "createdAt"];
    const csv = cols.join(",") + "\n" + honorarios.map(h =>
      [h.id, h.caseId, h.descricao, h.valor.toFixed(2), h.vencimento, h.status, h.createdAt].map(csvCell).join(",")
    ).join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="honorarios.csv"',
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }
  return NextResponse.json({
    honorarios: honorarios.map(({ ownerId: _ownerId, ...h }) => h),
    total: honorarios.length,
    soma: honorarios.reduce((sum,h) => sum + h.valor,0),
    pagos: honorarios.filter(h=>h.status==="pago").reduce((sum,h)=>sum+h.valor,0),
    pendentes: honorarios.filter(h=>h.status==="pendente").reduce((sum,h)=>sum+h.valor,0),
    atrasados: honorarios.filter(h=>h.status==="atrasado").reduce((sum,h)=>sum+h.valor,0),
  }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;
  const parsed = await parseJsonBody<{
    caseId?: string; descricao?: string; valor?: number | string; vencimento?: string; status?: string;
  }>(req);
  if (!parsed.ok) return fail(parsed.error,400);
  const input = parsed.body;
  if (input.caseId && !(await hasCaseAccess(input.caseId,auth.user.uid,auth.user.role))) {
    return fail("case_not_found",404);
  }
  const data = parseHonorariumInput({
    caseId: input.caseId || null,
    descricao: input.descricao,
    valor: money(input.valor),
    vencimento: input.vencimento || null,
    status: input.status || "pendente",
  });
  if (!data) return fail("invalid_honorarium_input",400);
  const event = await db.auditEvent.create({
    data: {
      userId: auth.user.uid,
      action: "honorario_create", resource: "financeiro",
      resourceId: data.caseId,
      metadata: JSON.stringify({ ...data, ledgerVersion: 2 }),
    },
  });
  return NextResponse.json({
    id: event.id, ...data, createdAt: event.createdAt.toISOString(),
  });
}

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;
  const parsed = await parseJsonBody<{
    id?: string; caseId?: string; descricao?: string; valor?: number | string; vencimento?: string | null; status?: string;
  }>(req);
  if (!parsed.ok) return fail(parsed.error,400);
  const body = parsed.body;
  if (!body.id || body.id.length > 128) return fail("invalid_honorarium_id",400);
  const all = await visible(auth.user);
  if (!all) return fail("finance_ledger_requires_migration",503);
  const prior = all.find(x=>x.id===body.id);
  if (!prior) return fail("honorarium_not_found",404);
  if (body.caseId !== undefined && body.caseId !== prior.caseId) {
    return fail("case_reassignment_requires_new_record",422);
  }
  const data = parseHonorariumInput({
    descricao: body.descricao === undefined ? prior.descricao : body.descricao,
    valor: body.valor === undefined ? prior.valor : money(body.valor),
    vencimento: body.vencimento === undefined ? prior.vencimento : body.vencimento || null,
    status: body.status === undefined ? prior.status : body.status,
    caseId: prior.caseId,
  },prior);
  if (!data) return fail("invalid_honorarium_input",400);
  const event = await db.auditEvent.create({ data: {
    userId: auth.user.uid, action: "honorario_update",
    resource: "financeiro", resourceId: prior.id,
    metadata: JSON.stringify({ ...data, ledgerVersion: 2 }),
  } });
  return NextResponse.json({ ok:true, id:prior.id, ...data, updatedAt:event.createdAt.toISOString() });
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;
  const id = new URL(req.url).searchParams.get("id");
  if (!id || id.length > 128) return fail("invalid_honorarium_id",400);
  const all = await visible(auth.user);
  if (!all) return fail("finance_ledger_requires_migration",503);
  const prior = all.find(x=>x.id===id);
  if (!prior) return fail("honorarium_not_found",404);
  await db.auditEvent.create({ data: {
    userId: auth.user.uid, action: "honorario_delete",
    resource: "financeiro", resourceId: prior.id,
    metadata: JSON.stringify({ caseId: prior.caseId, ledgerVersion: 2, deletedAt: new Date().toISOString() }),
  } });
  return NextResponse.json({ ok: true });
}
