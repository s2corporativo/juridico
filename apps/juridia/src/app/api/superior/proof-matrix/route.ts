import { NextRequest, NextResponse } from "next/server";
import { buildProofMatrix } from "@/lib/proof_matrix";
import { logAuditEvent } from "@/lib/audit";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  let body: {
    assertions?: { text: string; kind: string; evidenceRefIds: string[] }[];
    area?: string;
    isConsumer?: boolean;
    isHypossufficient?: boolean;
  } = {};
  try { body = await req.json(); } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }

  if (!body.assertions?.length) {
    return NextResponse.json({ error: "assertions obrigatórias" }, { status: 400 });
  }

  const result = buildProofMatrix({
    assertions: body.assertions,
    area: body.area || "civil",
    isConsumer: body.isConsumer ?? false,
    isHypossufficient: body.isHypossufficient ?? false,
  });

  await logAuditEvent({
    action: "build_proof_matrix",
    resource: "case",
    metadata: { totalFacts: result.summary.totalFacts, factsWithProof: result.summary.factsWithProof, highRisk: result.summary.highRiskFacts, invertedBurden: result.summary.invertedBurden },
  });

  return NextResponse.json(result);
}
