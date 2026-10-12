import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";
import { requireAuth } from "@/lib/auth";
import { ownedCaseIds } from "@/lib/owned-case";

export const dynamic = "force-dynamic";

// GET /api/alertas — alertas jurídicos de prazos e audiências próximos
export async function GET(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  const url = new URL(req.url);
  const dias = Math.min(parseInt(url.searchParams.get("dias") || "3", 10), 30);
  const agora = new Date();
  const limite = new Date(agora.getTime() + dias * 86400000);

  const caseIdsAllowed = await ownedCaseIds(authUser.uid);

  // Prazos vencendo
  const prazos = await db.caseDeadline.findMany({
    where: {
      caseId: { in: caseIdsAllowed },
      vencimento: { lte: limite },
    },
    orderBy: { vencimento: "asc" },
    take: 100,
  });

  // Audiências próximas
  const audiencias = await db.caseHearing.findMany({
    where: {
      caseId: { in: caseIdsAllowed },
      data: { gte: agora, lte: limite },
      status: "agendada",
    },
    orderBy: { data: "asc" },
    take: 100,
  });

  // Caso título lookup
  const caseIds = new Set<string>([
    ...prazos.map((p) => p.caseId),
    ...audiencias.map((a) => a.caseId),
  ]);
  const cases = caseIds.size > 0
    ? await db.case.findMany({ where: { id: { in: Array.from(caseIds) }, client: { is: { userId: authUser.uid } } }, select: { id: true, title: true, number: true } })
    : [];
  const caseMap = new Map<string, { id: string; title: string; number: string | null }>(cases.map((c) => [c.id, c] as const));

  const alertas = [
    ...prazos.map((p) => ({
      tipo: "prazo",
      id: p.id,
      caseId: p.caseId,
      caseTitle: caseMap.get(p.caseId)?.title || "",
      caseNumber: caseMap.get(p.caseId)?.number || "",
      descricao: p.descricao,
      vencimento: p.vencimento.toISOString(),
      prazoDias: p.prazoDias,
      tipoContagem: p.tipoContagem,
      diasRestantes: Math.ceil((p.vencimento.getTime() - agora.getTime()) / 86400000),
    })),
    ...audiencias.map((a) => ({
      tipo: "audiencia",
      id: a.id,
      caseId: a.caseId,
      caseTitle: caseMap.get(a.caseId)?.title || "",
      caseNumber: caseMap.get(a.caseId)?.number || "",
      descricao: `Audiência de ${a.tipo}`,
      vencimento: a.data.toISOString(),
      prazoDias: null,
      tipoContagem: null,
      diasRestantes: Math.ceil((a.data.getTime() - agora.getTime()) / 86400000),
      local: a.local,
      orgao: a.orgao,
    })),
  ].sort((a, b) => {
    // Ordenação cronológica das atividades jurídicas; nenhum dado financeiro.
    const va = new Date(a.vencimento ?? 0).getTime();
    const vb = new Date(b.vencimento ?? 0).getTime();
    return va - vb;
  });

  await logAuditEvent({
    action: "alertas_query",
    resource: "case",
    metadata: { dias, total: alertas.length, prazos: prazos.length, audiencias: audiencias.length },
  });

  return NextResponse.json({
    alertas,
    total: alertas.length,
    janelaDias: dias,
    agora: agora.toISOString(),
    limite: limite.toISOString(),
  });
}
