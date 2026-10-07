import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createEvidence } from "@/lib/evidence";
import { scanDocumentForPromptInjection } from "@/lib/document_security";
import { logAuditEvent } from "@/lib/audit";
import { canAccessCase } from "@/lib/case_access";

export const dynamic = "force-dynamic";

type PageInput = {
  pageNumber: number;
  text: string;
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null) as {
    caseId?: string;
    documentId?: string;
    fileName?: string;
    pages?: PageInput[];
  } | null;

  const caseId = String(body?.caseId || "").trim();
  const documentId = String(body?.documentId || "").trim() || undefined;
  const fileName = String(body?.fileName || documentId || "documento").trim();
  const pages = Array.isArray(body?.pages) ? body!.pages! : [];

  if (!caseId || !pages.length) {
    return NextResponse.json({ error: "caseId e pages são obrigatórios" }, { status: 400 });
  }
  if (!(await canAccessCase(caseId, auth.user))) {
    return NextResponse.json({ error: "case_not_found_or_forbidden" }, { status: 403 });
  }

  const normalizedPages = pages
    .filter((p) => Number.isInteger(p.pageNumber) && p.pageNumber > 0 && typeof p.text === "string" && p.text.trim())
    .map((p) => ({ pageNumber: p.pageNumber, text: p.text.trim().slice(0, 50000) }));

  if (!normalizedPages.length) {
    return NextResponse.json({ error: "nenhuma página válida" }, { status: 400 });
  }

  const security = normalizedPages.map((p) => ({
    pageNumber: p.pageNumber,
    report: scanDocumentForPromptInjection(p.text),
  }));
  const blocked = security.filter((x) => x.report.severity === "block");
  if (blocked.length) {
    await logAuditEvent({
      action: "evidence_ingest_blocked",
      resource: "case",
      resourceId: caseId,
      userId: auth.user.uid,
      metadata: {
        fileName,
        blockedPages: blocked.map((x) => x.pageNumber),
        findings: blocked.flatMap((x) => x.report.findings.map((f) => ({ page: x.pageNumber, code: f.code }))).slice(0, 50),
      },
    });
    return NextResponse.json({
      error: "prompt_injection_detected",
      quarantined: true,
      blockedPages: blocked.map((x) => ({
        pageNumber: x.pageNumber,
        score: x.report.score,
        findings: x.report.findings,
      })),
      evidence: [],
    }, { status: 422 });
  }

  const documentHash = createHash("sha256")
    .update(normalizedPages.map((p) => `p.${p.pageNumber}\n${p.text}`).join("\n\f\n"))
    .digest("hex");

  const evidence: Awaited<ReturnType<typeof createEvidence>>[] = [];
  for (const page of normalizedPages) {
    const report = security.find((x) => x.pageNumber === page.pageNumber)!.report;
    const chunks = page.text
      .split(/\n{2,}/)
      .map((x) => x.replace(/\s+/g, " ").trim())
      .filter((x) => x.length >= 40)
      .slice(0, 50);

    const sourceChunks = chunks.length ? chunks : [page.text.replace(/\s+/g, " ").trim().slice(0, 6000)];
    for (const quote of sourceChunks) {
      evidence.push(await createEvidence({
        caseId,
        documentId,
        pageNumber: page.pageNumber,
        quote,
        sourceKind: "text",
        retrievalMethod: "deterministic",
        documentHash,
        metadata: {
          fileName,
          securitySeverity: report.severity,
          securityScore: report.score,
          securityFindings: report.findings.map((f) => f.code),
        },
      }));
    }
  }

  await logAuditEvent({
    action: "evidence_ingest",
    resource: "case",
    resourceId: caseId,
    userId: auth.user.uid,
    metadata: {
      fileName,
      documentId: documentId || null,
      pages: normalizedPages.length,
      evidence: evidence.length,
      warnings: security.filter((x) => x.report.severity === "warning").map((x) => x.pageNumber),
      documentHash,
    },
  });

  return NextResponse.json({
    ok: true,
    fileName,
    documentId: documentId || null,
    documentHash,
    pages: normalizedPages.length,
    evidence,
  });
}
