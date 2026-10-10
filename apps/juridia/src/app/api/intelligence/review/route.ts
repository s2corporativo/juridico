import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { requireAuth } from "@/lib/auth";
import { hasCaseAccess } from "@/lib/case-access";
import { quoteHash } from "@/lib/evidence";

export const dynamic = "force-dynamic";

function failure(code: string, status: number) {
  return NextResponse.json({ error: code }, { status });
}

/** Only a lawyer/admin with explicit case access can review case intelligence. */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;
  const actor = auth.user;
  if (!["advogado", "admin"].includes(actor.role)) return failure("review_requires_lawyer", 403);

  let body: {
    type?: "assertion" | "node" | "evidence";
    id?: string;
    action?: "confirm" | "correct" | "reject";
    caseId?: string;
    correctedText?: string;
  } = {};
  try { body = await req.json(); }
  catch { return failure("invalid_json", 400); }
  if (!body.type || !["assertion", "node", "evidence"].includes(body.type) ||
      !body.id || body.id.length > 128 ||
      !body.action || !["confirm", "correct", "reject"].includes(body.action)) {
    return failure("invalid_review_request", 400);
  }
  const caseId = body.caseId ?? "";
  if (!(await hasCaseAccess(caseId, actor.uid, actor.role))) return failure("case_not_found", 404);
  const reviewer = "human:" + actor.uid;
  const reviewedAt = new Date();
  // Review mutations and their audit records must be committed atomically.
  // A missing AuditEvent table or failed audit write rolls back the review.
  const auditedChange = async (
    kind: "evidence" | "assertion" | "node",
    metadata: Record<string, unknown>,
    change: (tx: Prisma.TransactionClient) => Promise<{ count: number }>,
  ): Promise<boolean> => {
    try {
      return await db.$transaction(async tx => {
        const result = await change(tx);
        if (result.count !== 1) throw new Error("REVIEW_WRITE_CONFLICT");
        await tx.auditEvent.create({
          data: {
            action: "review_" + kind + "_" + body.action,
            resource: kind,
            resourceId: body.id,
            userId: actor.uid,
            metadata: JSON.stringify({ caseId, ...metadata }),
          },
        });
        return true;
      });
    } catch {
      return false;
    }
  };

  if (body.type === "evidence") {
    if (body.action === "correct") return failure("correct_evidence_requires_new_reference", 422);
    const ref = await db.evidenceRef.findFirst({ where: { id: body.id, caseId } });
    if (!ref) return failure("evidence_not_found", 404);
    if (body.action === "confirm" && (quoteHash(ref.quote) !== ref.quoteHash ||
        !["text", "ocr", "manual"].includes(ref.sourceKind))) {
      return failure("evidence_integrity_or_source_unverified", 422);
    }
    const saved = await auditedChange("evidence",
      { verified: body.action === "confirm", quoteHash: ref.quoteHash },
      tx => tx.evidenceRef.updateMany({
        where: { id: ref.id, caseId, quoteHash: ref.quoteHash },
        data: { verified: body.action === "confirm", verifiedBy: reviewer, verifiedAt: reviewedAt },
      }),
    );
    if (!saved) return failure("review_or_audit_unavailable", 503);
    return NextResponse.json({ ok: true, verified: body.action === "confirm" });
  }

  if (body.type === "assertion") {
    const assertion = await db.legalAssertion.findFirst({ where: { id: body.id, caseId } });
    if (!assertion) return failure("assertion_not_found", 404);
    if (body.action === "correct" && (typeof body.correctedText !== "string" ||
        body.correctedText.trim().length < 10 || body.correctedText.length > 8000)) {
      return failure("corrected_text_required", 422);
    }
    if (body.action === "confirm") {
      if (assertion.supportStatus !== "supported") return failure("assertion_support_not_confirmed", 422);
      let ids: unknown;
      try { ids = JSON.parse(assertion.evidenceIds); } catch { return failure("invalid_evidence_references", 422); }
      if (!Array.isArray(ids) || ids.length < 1 || ids.length > 30 ||
          ids.some(x => typeof x !== "string" || !x)) return failure("evidence_references_required", 422);
      const evidence = await db.evidenceRef.findMany({
        where: { id: { in: ids as string[] }, caseId, verified: true },
        select: { id: true, quote: true, quoteHash: true },
      });
      if (new Set(ids).size !== evidence.length ||
          evidence.some(ref => quoteHash(ref.quote) !== ref.quoteHash)) {
        return failure("human_verified_evidence_required", 422);
      }
    }
    const status = body.action === "confirm" ? "confirmed"
      : body.action === "correct" ? "corrected" : "rejected";
    const saved = await auditedChange("assertion",
      { kind: assertion.kind, status, supportStatus: assertion.supportStatus },
      tx => tx.legalAssertion.updateMany({
        where: { id: assertion.id, caseId },
        data: {
          reviewStatus: status, reviewedBy: reviewer, reviewedAt,
          ...(body.action === "correct" ? {
            text: body.correctedText!.trim(),
            supportStatus: "absent", evidenceIds: "[]",
          } : {}),
        },
      }),
    );
    if (!saved) return failure("review_or_audit_unavailable", 503);
    return NextResponse.json({ ok: true, reviewStatus: status });
  }

  const node = await db.graphNode.findFirst({ where: { id: body.id, caseId } });
  if (!node) return failure("node_not_found", 404);
  if (body.action === "correct") return failure("correct_node_requires_new_candidate", 422);
  if (body.action === "confirm") {
    const evidence = node.sourceEvidenceId
      ? await db.evidenceRef.findFirst({
          where: { id: node.sourceEvidenceId, caseId, verified: true },
          select: { quote: true, quoteHash: true },
        }) : null;
    if (!evidence || quoteHash(evidence.quote) !== evidence.quoteHash) {
      return failure("human_verified_node_evidence_required", 422);
    }
  }
  const status = body.action === "confirm" ? "confirmed" : "rejected";
  const saved = await auditedChange("node", { nodeType: node.nodeType, status },
    tx => tx.graphNode.updateMany({
      where: { id: node.id, caseId },
      data: { status, reviewedBy: reviewer, reviewedAt },
    }),
  );
  if (!saved) return failure("review_or_audit_unavailable", 503);
  return NextResponse.json({ ok: true, status });
}
