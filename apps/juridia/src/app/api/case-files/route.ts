import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ownsCase } from "@/lib/owned-case";
import { extractCaseFile, sha256 } from "@/lib/case-files";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;
  const caseId = new URL(req.url).searchParams.get("caseId") || "";
  if (!caseId || caseId === "default-case" || caseId === "cerebro-session" || !await ownsCase(auth.user.uid, caseId)) return NextResponse.json({ error: "case_not_found" }, { status: 404 });
  const files = await db.caseFile.findMany({ where: { userId: auth.user.uid, caseId }, orderBy: { createdAt: "desc" }, include: { pages: { orderBy: { pageNo: "asc" }, select: { id: true, pageNo: true, text: true, evidence: true, sha256: true } } } });
  return NextResponse.json({ files });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;
  const form = await req.formData();
  const item = form.get("file");
  if (!(item instanceof File)) return NextResponse.json({ error: "file obrigatório" }, { status: 400 });
  const caseId = String(form.get("caseId") || "");
  if (!caseId || caseId === "default-case" || caseId === "cerebro-session" || !await ownsCase(auth.user.uid, caseId)) {
    return NextResponse.json({ error: "case_not_found" }, { status: 404 });
  }
  const buffer = Buffer.from(await item.arrayBuffer());
  const digest = sha256(buffer);
  const existing = await db.caseFile.findFirst({ where: { userId: auth.user.uid, sha256: digest } });
  if (existing) return NextResponse.json({ file: existing, duplicate: true });
  const extracted = await extractCaseFile(buffer, item.type, item.name);
  const file = await db.caseFile.create({
    data: {
      caseId,
      userId: auth.user.uid,
      originalName: item.name,
      mimeType: item.type || "application/octet-stream",
      sha256: digest,
      sizeBytes: buffer.byteLength,
      pageCount: extracted.pages.length,
      status: extracted.status,
      extractedText: extracted.text,
      pages: { create: extracted.pages.map((page) => ({ pageNo: page.pageNo, text: page.text, sha256: sha256(page.text), evidence: JSON.stringify(page.evidence) })) },
    },
    include: { pages: true },
  });
  return NextResponse.json({ file, privacy: "original preserved only in this request; backend received extracted text and markers, not an Atlas payload" }, { status: 201 });
}
