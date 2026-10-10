import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { readPrivateOriginal } from "@/lib/private-originals";
import { logAuditEvent } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HASH = /^[a-f0-9]{64}$/;
const CASE_ID = /^[a-zA-Z0-9_-]{8,128}$/;

export async function GET(req: NextRequest): Promise<NextResponse> {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;
  const params = new URL(req.url).searchParams;
  const caseId = params.get("caseId") ?? "";
  const hash = params.get("hash") ?? "";
  if (!CASE_ID.test(caseId) || !HASH.test(hash)) {
    return NextResponse.json({ error: "invalid_original_reference" }, { status: 400 });
  }

  const permitted = await db.case.findFirst({
    where: {
      id: caseId,
      ...(auth.user.role === "admin" ? {} : { client: { is: { userId: auth.user.uid } } }),
    },
    select: { id: true },
  });
  if (!permitted) return NextResponse.json({ error: "original_not_found" }, { status: 404 });

  // Do not allow guessing valid hashes or opening unlinked orphan objects.
  const refs = await db.evidenceRef.findMany({
    where: { caseId, documentHash: hash },
    select: { metadata: true },
    take: 10,
  });
  let name = "";
  let extension = "";
  for (const ref of refs) {
    try {
      const data = JSON.parse(ref.metadata) as {
        originalRetained?: unknown; fileName?: unknown; uploadKind?: unknown;
      };
      if (data.originalRetained !== true) continue;
      if (typeof data.fileName !== "string" || typeof data.uploadKind !== "string") continue;
      if (!["pdf", "docx", "txt", "md"].includes(data.uploadKind)) continue;
      name = data.fileName.replace(/[^a-zA-Z0-9_. -]/g, "_").slice(0, 120);
      extension = data.uploadKind;
      break;
    } catch { /* ignore corrupt older metadata */ }
  }
  if (!extension) return NextResponse.json({ error: "original_not_found" }, { status: 404 });

  let buffer: Buffer;
  try {
    buffer = await readPrivateOriginal(caseId, hash);
  } catch {
    return NextResponse.json({ error: "original_unavailable_or_integrity_failed" }, { status: 503 });
  }
  await logAuditEvent({
    action: "case_original_download",
    resource: "case",
    resourceId: caseId,
    userId: auth.user.uid,
    metadata: { hash, bytes: buffer.length },
  });
  const safeName = name || ("documento." + extension);
  const type = extension === "pdf" ? "application/pdf"
    : extension === "docx" ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    : "text/plain; charset=utf-8";
  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": type,
      "Content-Disposition": 'attachment; filename="' + safeName + '"',
      "Cache-Control": "private, no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
