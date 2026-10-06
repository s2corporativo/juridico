import { NextRequest, NextResponse } from "next/server";
import { simulateJudge } from "@/lib/judge_simulator";
import { logAuditEvent } from "@/lib/audit";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  let body: { caseFacts?: string; claim?: string; area?: string; valorCausa?: string; documentoTexto?: string } = {};
  try { body = await req.json(); } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }

  if (!body.caseFacts?.trim() || !body.claim?.trim()) {
    return NextResponse.json({ error: "caseFacts e claim obrigatórios" }, { status: 400 });
  }

  const result = await simulateJudge({
    caseFacts: body.caseFacts,
    claim: body.claim,
    area: body.area || "civil",
    valorCausa: body.valorCausa,
    documentoTexto: body.documentoTexto,
  });

  await logAuditEvent({
    action: "simulate_judge",
    resource: "case",
    metadata: { area: body.area, probabilidade: result.merito.probabilidade, risksCount: result.risks.length },
  });

  return NextResponse.json(result);
}
