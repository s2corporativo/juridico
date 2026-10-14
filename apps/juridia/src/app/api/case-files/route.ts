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
  if (!await ownsCase(auth.user.uid, caseId)) return NextResponse.json({ error: "case_not_found" }, { status: 404 });
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
  if (!await ownsCase(auth.user.uid, caseId)) return NextResponse.json({ error: "case_not_found" }, { status: 404 });
  if (item.size === 0 || item.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Arquivo vazio ou maior que 10 MB." }, { status: 413 });
  }
  const supported = /\.(pdf|docx|txt|md|png|jpe?g|tiff?|bmp|webp)$/i.test(item.name);
  if (!supported) return NextResponse.json({ error: "Formato não permitido." }, { status: 415 });
  const buffer = Buffer.from(await item.arrayBuffer());
  const digest = sha256(buffer);
  const existing = await db.caseFile.findFirst({ where: { userId: auth.user.uid, sha256: digest } });
  if (existing && existing.caseId !== caseId) {
    return NextResponse.json({ error: "Arquivo já vinculado a outro caso. Faça a análise pelo caso original." }, { status: 409 });
  }
  if (existing) return NextResponse.json({
    file: { id: existing.id, pageCount: existing.pageCount, status: existing.status },
    fileName: existing.originalName, text: existing.extractedText, textLength: existing.extractedText.length,
    totalEvidence: existing.pageCount, duplicate: true,
  });
  const extracted = await extractCaseFile(buffer, item.type, item.name);
  if (extracted.status !== "ready" || !extracted.text.trim()) {
    return NextResponse.json({ error: "Não foi possível extrair texto deste documento. Confira o OCR e tente novamente." }, { status: 422 });
  }
  if (extracted.text.length > 45000) {
    return NextResponse.json({ error: "Documento excede 45 mil caracteres. Separe em partes para análise, sem perder informações." }, { status: 413 });
  }
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
  return NextResponse.json({
    file: { id: file.id, pageCount: file.pageCount, status: file.status },
    fileName: file.originalName, text: file.extractedText, textLength: file.extractedText.length,
    totalEvidence: file.pageCount, sha256: file.sha256,
    privacy: "Texto extraído vinculado ao caso autorizado; original binário não armazenado.",
  }, { status: 201 });
}
