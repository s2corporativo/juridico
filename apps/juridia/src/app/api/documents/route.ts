import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";
import type { DocumentDTO } from "@/lib/types";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  const docs = await db.document.findMany({
    orderBy: { updatedAt: "desc" },
    take: 100,
  });
  const dtos: DocumentDTO[] = docs.map((d) => ({
    id: d.id,
    title: d.title,
    templateSlug: d.templateSlug,
    templateName: d.templateName,
    anonymizedFacts: d.anonymizedFacts,
    generatedContent: d.generatedContent,
    skillSlugs: safeParseArr(d.skillSlugs),
    status: d.status,
    batchId: d.batchId,
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
  }));
  return NextResponse.json({ documents: dtos });
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });

  const doc = await db.document.findUnique({ where: { id }, select: { title: true, templateName: true } });
  await db.document.delete({ where: { id } });

  await logAuditEvent({
    action: "delete_document",
    resource: "document",
    resourceId: id,
    metadata: { title: doc?.title, templateName: doc?.templateName },
  });

  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  const body = (await req.json().catch(() => null)) as { id?: string; content?: string; title?: string } | null;
  if (!body?.id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
  const data: { generatedContent?: string; title?: string } = {};
  if (typeof body.content === "string") data.generatedContent = body.content;
  if (typeof body.title === "string") data.title = body.title;
  const updated = await db.document.update({
    where: { id: body.id },
    data,
  });

  await logAuditEvent({
    action: "edit_document",
    resource: "document",
    resourceId: body.id,
    metadata: {
      title: updated.title,
      changedContent: typeof body.content === "string",
      changedTitle: typeof body.title === "string",
      contentLength: body.content?.length || 0,
    },
  });

  return NextResponse.json({ ok: true, document: { id: updated.id, title: updated.title } });
}

function safeParseArr(raw: string | null): string[] {
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}
