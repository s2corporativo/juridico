import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createEvidence } from "@/lib/evidence";
import { logAuditEvent } from "@/lib/audit";
import { scanDocumentForPromptInjection } from "@/lib/document_security";
import { canAccessCase } from "@/lib/case_access";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

function chunks(text: string, max = 1600): string[] {
  const paragraphs = text.split(/\n\s*\n|(?<=\.)\s+(?=[A-ZÁÉÍÓÚÂÊÔÃÕÇ])/).map((x) => x.trim()).filter(Boolean);
  const out: string[] = [];
  let buf = "";
  for (const p of paragraphs) {
    if ((buf + "\n" + p).length > max && buf) { out.push(buf); buf = ""; }
    if (p.length > max) {
      for (let i = 0; i < p.length; i += max) out.push(p.slice(i, i + max));
    } else {
      buf = buf ? buf + "\n" + p : p;
    }
  }
  if (buf) out.push(buf);
  return out;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null) as {
    caseId?: string;
    documentId?: string;
    fileName?: string;
    documentHash?: string;
    pages?: { pageNumber: number; text: string }[];
  } | null;

  if (!body?.caseId || !Array.isArray(body.pages) || body.pages.length === 0) {
    return NextResponse.json({ error: "caseId e pages são obrigatórios" }, { status: 400 });
  }
  if (!(await canAccessCase(body.caseId, auth.user))) {
    return NextResponse.json({ error: "case_not_found_or_forbidden" }, { status: 403 });
  }
  if (body.pages.length > 1000) {
    return NextResponse.json({ error: "Máximo de 1000 páginas por chamada; envie o restante em blocos." }, { status: 413 });
  }

  const documentId = (body.documentId || crypto.randomUUID()).slice(0, 120);
  const fileName = (body.fileName || "documento").slice(0, 240);
  const security = body.pages.map((p) => ({
    pageNumber: p.pageNumber,
    report: scanDocumentForPromptInjection(String(p.text || "").slice(0, 100_000)),
  }));
  const blocked = security.filter((x) => x.report.severity === "block");
  if (blocked.length) {
    return NextResponse.json({
      error: "prompt_injection_detected",
      documentId,
      blockedPages: blocked.map((x) => ({ pageNumber: x.pageNumber, score: x.report.score, findings: x.report.findings })),
      message: "O documento não foi indexado. Um advogado deve revisar e aprovar explicitamente a ingestão.",
    }, { status: 422 });
  }

  const wholeHash = body.documentHash || createHash("sha256")
    .update(body.pages.map((p) => `${p.pageNumber}:${p.text}`).join("\n"))
    .digest("hex");

  let evidenceCount = 0;
  for (const page of body.pages) {
    const sec = security.find((x) => x.pageNumber === page.pageNumber)!.report;
    for (const quote of chunks(sec.normalizedText)) {
      if (quote.length < 30) continue;
      await createEvidence({
        caseId: body.caseId,
        documentId,
        pageNumber: page.pageNumber,
        quote,
        sourceKind: "text",
        retrievalMethod: "deterministic",
        documentHash: wholeHash,
        metadata: {
          fileName,
          securitySeverity: sec.severity,
          securityScore: sec.score,
        },
      });
      evidenceCount++;
    }
  }

  await logAuditEvent({
    action: "ingest_case_document_pages",
    resource: "case",
    resourceId: body.caseId,
    userId: auth.user.uid,
    metadata: {
      documentId, fileName, documentHash: wholeHash, pages: body.pages.length,
      evidenceCount, blockedPages: blocked.map((x) => x.pageNumber),
    },
  });

  return NextResponse.json({
    documentId,
    fileName,
    documentHash: wholeHash,
    pages: body.pages.length,
    evidenceCount,
    security: {
      severity: security.some((x) => x.report.severity === "warning") ? "warning" : "safe",
      blockedPages: blocked.map((x) => x.pageNumber),
      findings: security.flatMap((x) => x.report.findings.map((f) => ({ pageNumber: x.pageNumber, ...f }))).slice(0, 100),
    },
  });
}
