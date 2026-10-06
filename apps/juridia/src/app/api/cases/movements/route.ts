import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/cases/movements?caseId=xxx
export async function GET(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  const url = new URL(req.url);
  const caseId = url.searchParams.get("caseId");
  if (!caseId) return NextResponse.json({ error: "caseId obrigatório" }, { status: 400 });

  const movimentos = await db.caseMovement.findMany({
    where: { caseId },
    orderBy: { data: "desc" },
  });

  return NextResponse.json({
    movimentos: movimentos.map((m) => ({
      id: m.id,
      data: m.data.toISOString(),
      tipo: m.tipo,
      descricao: m.descricao,
      numeroProc: m.numeroProc,
      criadoPor: m.criadoPor,
    })),
  });
}

// POST
export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  let body: { caseId?: string; tipo?: string; descricao?: string; numeroProc?: string } = {};
  try { body = await req.json(); } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }

  if (!body.caseId || !body.descricao) return NextResponse.json({ error: "caseId e descricao obrigatórios" }, { status: 400 });

  const mov = await db.caseMovement.create({
    data: {
      caseId: body.caseId,
      tipo: body.tipo || "outro",
      descricao: body.descricao,
      numeroProc: body.numeroProc || null,
    },
  });

  return NextResponse.json({ id: mov.id, ok: true });
}

// DELETE
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
  await db.caseMovement.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
