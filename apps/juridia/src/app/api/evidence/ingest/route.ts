import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createEvidence } from "@/lib/evidence";
import { scanDocumentForPromptInjection } from "@/lib/document_security";
import { logAuditEvent } from "@/lib/audit";

export const dynamic = "force-dynamic";

type PageInput = { pageNumber: number; text: string; sectionLabel?: string };

function chunkPage(text: string, max = 1600): string[] {
  const clean = text.replace(/\r/g, "").trim();
  if (!clean) return [];
  if (clean.length <= max) return [clean];
  const paras = clean.split(/\n{2,}/).map((x) => x.trim()).filter(Boolean);
  const out: string[] = [];
  let current = "";
  for (const p of paras) {
    if ((current + "\n\n" + p).trim().length <= max) {
      current = [current, p].filter(Boolean).join("\n\n");
    } else {
      if (current) out.push(current);
      if (p.length <= max) current = p;
      else {
        for (let i = 0; i < p.length; i += max) out.push(p.slice(i, i + max));
        current = "";
      }
    }
  }
  if (current) out.push(current);
  return out;
}

async function canAccessCase(caseId: string, uid: string, role: string) {
  const c = await db.case.findUnique({
    where: { id: caseId },
    include: { client: { select: { userId: true } } },
  });
  return Boolean(c && (role === "admin" || c.client.userId === uid));
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null) as {
    caseId?: string;
    documentId?: string;
    fileName?: string;
    documentHash?: string;
    pages?: PageInput[];
  } | null;

  const caseId = String(body?.caseId || "").trim();
  const fileName = String(body?.fileName || "").trim();
  const pages = Array.isArray(body?.pages) ? body!.pages! : [];

  if (!caseId || !fileName || !pages.length) {
    return NextResponse.json({ error: "caseId, fileName e pages são obrigatórios" }, { status: 400 });
  }
  if (!(await canAccessCase(caseId, auth.user.uid, auth.user.role))) {
    return NextResponse.json({ error: "case_not_found_or_forbidden" }, { status: 403 });
  }

  if (body?.documentId) {
    const doc = await db.document.findUnique({ where: { id: body.documentId } });
    if (!doc || doc.caseId !== caseId || (auth.user.role !== "admin" && doc.userId !== auth.user.uid)) {
      return NextResponse.json({ error: "document_not_found_or_forbidden" }, { status: 403 });
    }
  }

  const reports = pages.map((page) => ({
    page,
    security: scanDocumentForPromptInjection(String(page.text || "")),
  }));
  const blocked = reports.filter((x) => x.security.severity === "block");
  if (blocked.length) {
    return NextResponse.json({
      error: "prompt_injection_detected",
      blockedPages: blocked.map((x) => ({
        pageNumber: x.page.pageNumber,
        score: x.security.score,
        findings: x.security.findings,
      })),
    }, { status: 422 });
  }

  const created = [];
  for (const { page, security } of reports) {
    const pageNumber = Number(page.pageNumber);
    if (!Number.isInteger(pageNumber) || pageNumber < 1) {
      return NextResponse.json({ error: "pageNumber inválido" }, { status: 400 });
    }
    for (const quote of chunkPage(String(page.text || ""))) {
      const evidence = await createEvidence({
        caseId,
        documentId: body?.documentId || null,
        quote,
        pageNumber,
        sectionLabel: page.sectionLabel || null,
        sourceKind: "text",
        retrievalMethod: "deterministic",
        documentHash: body?.documentHash || null,
        metadata: {
          fileName,
          securitySeverity: security.severity,
          securityScore: security.score,
          securityFindings: security.findings,
          ingestedBy: auth.user.uid,
        },
      });
      created.push(evidence);
    }
  }

  await logAuditEvent({
    action: "ingest_case_evidence",
    resource: "case",
    resourceId: caseId,
    userId: auth.user.uid,
    metadata: {
      fileName,
      documentId: body?.documentId || null,
      pages: pages.length,
      evidenceRefs: created.length,
      warnings: reports.filter((x) => x.security.severity === "warning").length,
    },
  });

  return NextResponse.json({
    ok: true,
    fileName,
    pages: pages.length,
    evidenceRefs: created,
  }, { status: 201 });
}
