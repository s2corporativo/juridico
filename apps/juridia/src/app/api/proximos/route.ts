import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";
import { requireAuth } from "@/lib/auth";
import { accessibleCaseIds } from "@/lib/case_access";

export const dynamic = "force-dynamic";

// GET /api/proximos — agenda 7 dias (prazos + audiências)
export async function GET(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  const url = new URL(req.url);
  const dias = Math.min(parseInt(url.searchParams.get("dias") || "7", 10), 30);
  const agora = new Date();
  agora.setHours(0, 0, 0, 0);
  const limite = new Date(agora.getTime() + dias * 86400000);

  const allowedCaseIds = await accessibleCaseIds(authUser);
  const [prazos, audiencias] = await Promise.all([
    db.caseDeadline.findMany({
      where: { caseId: { in: allowedCaseIds }, vencimento: { gte: agora, lte: limite } },
      orderBy: { vencimento: "asc" },
      take: 200,
    }),
    db.caseHearing.findMany({
      where: { caseId: { in: allowedCaseIds }, data: { gte: agora, lte: limite } },
      orderBy: { data: "asc" },
      take: 200,
    }),
  ]);

  // Lookup de casos
  const caseIds = new Set<string>([
    ...prazos.map((p) => p.caseId),
    ...audiencias.map((a) => a.caseId),
  ]);
  const cases = caseIds.size > 0
    ? await db.case.findMany({ where: { id: { in: Array.from(caseIds) } }, select: { id: true, title: true, number: true, responsavel: true } })
    : [];
  const caseMap = new Map<string, { id: string; title: string; number: string | null; responsavel: string | null }>(cases.map((c) => [c.id, c] as const));

  interface AgendaItem {
    data: string;
    tipo: string;
    descricao: string;
    caseId: string;
    caseTitle: string;
    caseNumber: string | null;
    responsavel: string | null;
    dias: number;
  }

  const agenda: AgendaItem[] = [
    ...prazos.map((p) => ({
      data: p.vencimento.toISOString(),
      tipo: "prazo",
      descricao: `${p.descricao} (${p.prazoDias} ${p.tipoContagem})`,
      caseId: p.caseId,
      caseTitle: caseMap.get(p.caseId)?.title || "",
      caseNumber: caseMap.get(p.caseId)?.number || null,
      responsavel: caseMap.get(p.caseId)?.responsavel || null,
      dias: Math.ceil((p.vencimento.getTime() - agora.getTime()) / 86400000),
    })),
    ...audiencias.map((a) => ({
      data: a.data.toISOString(),
      tipo: "audiencia",
      descricao: `Audiência de ${a.tipo}${a.orgao ? ` (${a.orgao})` : ""}${a.local ? ` @ ${a.local}` : ""}`,
      caseId: a.caseId,
      caseTitle: caseMap.get(a.caseId)?.title || "",
      caseNumber: caseMap.get(a.caseId)?.number || null,
      responsavel: caseMap.get(a.caseId)?.responsavel || null,
      dias: Math.ceil((a.data.getTime() - agora.getTime()) / 86400000),
    })),
  ].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

  await logAuditEvent({
    action: "proximos_query",
    resource: "case",
    metadata: { dias, total: agenda.length, prazos: prazos.length, audiencias: audiencias.length },
    userId: authUser.uid,
  });

  return NextResponse.json({
    agenda,
    total: agenda.length,
    janelaDias: dias,
    hoje: agora.toISOString(),
    limite: limite.toISOString(),
  });
}
