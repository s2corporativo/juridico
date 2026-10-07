import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";
import { requireAuth } from "@/lib/auth";
import { canAccessCase } from "@/lib/case_access";

export const dynamic = "force-dynamic";

// POST /api/intelligence/review — revisa uma assertion ou node (HITL)
// Princípio 9: Confirmação jurídica depende de revisão humana.
// Princípio 10: Confirmação exige evidência (node sem source_evidence_id não pode ser confirmado).
export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  let body: {
    type?: "assertion" | "node";
    id?: string;
    action?: "confirm" | "correct" | "reject";
    caseId?: string;
    correctedText?: string;
  } = {};
  try { body = await req.json(); } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }

  if (!body.type || !body.id || !body.action) {
    return NextResponse.json({ error: "type, id, action obrigatórios" }, { status: 400 });
  }

  const caseId = (body.caseId || "").trim();
  if (!caseId) return NextResponse.json({ error: "caseId obrigatório" }, { status: 400 });
  if (!(await canAccessCase(caseId, authUser))) return NextResponse.json({ error: "Caso não encontrado ou sem acesso" }, { status: 404 });
  const reviewer = authUser.uid;

  if (body.type === "assertion") {
    const assertion = await db.legalAssertion.findUnique({ where: { id: body.id } });
    if (!assertion || assertion.caseId !== caseId) return NextResponse.json({ error: "Assertion não encontrada no caso" }, { status: 404 });

    // Princípio 11: assertion com support=absent não pode ser confirmada
    if (body.action === "confirm" && assertion.supportStatus === "absent") {
      return NextResponse.json({
        error: "Assertion com suporte ausente não pode ser confirmada — adicione evidência primeiro"
      }, { status: 422 });
    }

    const newReviewStatus = body.action === "confirm" ? "confirmed" : body.action === "correct" ? "corrected" : "rejected";
    const updated = await db.legalAssertion.update({
      where: { id: body.id },
      data: {
        reviewStatus: newReviewStatus,
        reviewedBy: reviewer,
        reviewedAt: new Date(),
        ...(body.correctedText ? { text: body.correctedText } : {}),
      },
    });

    await logAuditEvent({
      action: `review_assertion_${body.action}`,
      resource: "assertion",
      resourceId: body.id,
      metadata: { caseId, kind: assertion.kind, newStatus: newReviewStatus },
      userId: authUser.uid,
    });

    return NextResponse.json({ ok: true, reviewStatus: newReviewStatus });
  }

  if (body.type === "node") {
    const node = await db.graphNode.findUnique({ where: { id: body.id } });
    if (!node || node.caseId !== caseId) return NextResponse.json({ error: "Node não encontrado no caso" }, { status: 404 });

    // Princípio 10: Confirmação exige evidência
    if (body.action === "confirm" && !node.sourceEvidenceId) {
      return NextResponse.json({
        error: "Confirmação exige evidência — node sem source_evidence_id não pode ser confirmado"
      }, { status: 422 });
    }

    const newStatus = body.action === "confirm" ? "confirmed" : "rejected";
    const updated = await db.graphNode.update({
      where: { id: body.id },
      data: {
        status: newStatus,
        reviewedBy: reviewer,
        reviewedAt: new Date(),
      },
    });

    await logAuditEvent({
      action: `review_node_${body.action}`,
      resource: "node",
      resourceId: body.id,
      metadata: { caseId, nodeType: node.nodeType, newStatus },
      userId: authUser.uid,
    });

    return NextResponse.json({ ok: true, status: newStatus });
  }

  return NextResponse.json({ error: "Tipo inválido (use 'assertion' ou 'node')" }, { status: 400 });
}
