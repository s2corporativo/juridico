import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { ownsCase } from "@/lib/owned-case";
import { JURIDIA_AGENTS, buildAgentWorkflow, isWorkflowGoal } from "@/lib/agent-registry";

export const dynamic = "force-dynamic";

// Read-only registry: no agent obtains permissions through this endpoint.
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;
  return NextResponse.json({
    agents: JURIDIA_AGENTS,
    workflows: ["case_analysis", "draft_document", "source_research", "document_review"],
    policy: "Execução automática só em rotinas já autorizadas; aprovação humana para atos jurídicos. Nenhum agente protocola, publica ou exclui documentos.",
  });
}

// The coordinator creates a bounded, auditable plan. Actual processing happens
// only at existing protected endpoints and under their normal authorization.
export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;
  const body: unknown = await req.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
  }
  const values = body as Record<string, unknown>;
  if (!isWorkflowGoal(values.goal)) {
    return NextResponse.json({ error: "Fluxo indisponível" }, { status: 400 });
  }
  const caseId = values.caseId;
  if (caseId !== undefined && (typeof caseId !== "string" || !caseId.trim())) {
    return NextResponse.json({ error: "caseId inválido" }, { status: 400 });
  }
  if (values.goal === "case_analysis" && typeof caseId !== "string") {
    return NextResponse.json({ error: "Selecione um caso autorizado" }, { status: 400 });
  }
  if (typeof caseId === "string" && !await ownsCase(auth.user.uid, caseId)) {
    return NextResponse.json({ error: "case_not_found" }, { status: 404 });
  }
  if (values.execute === true) {
    return NextResponse.json({ error: "Execução exige ação explícita no fluxo protegido existente" }, { status: 400 });
  }
  return NextResponse.json({
    plan: buildAgentWorkflow(values.goal),
    caseId: caseId || null,
    status: "plan_only",
    note: "Este endpoint não executa automaticamente uma ação externa nem substitui revisão humana.",
  });
}
