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
    where: { userId: authUser.uid },
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

  // Never inspect or mutate another user's document, even with a guessed ID.
  const doc = await db.document.findFirst({
    where: { id, userId: authUser.uid },
    select: { title: true, templateName: true },
  });
  if (!doc) return NextResponse.json({ error: "document_not_found" }, { status: 404 });
  const deleted = await db.document.deleteMany({ where: { id, userId: authUser.uid } });
  if (deleted.count !== 1) return NextResponse.json({ error: "document_not_found" }, { status: 404 });

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
  if ((body.content !== undefined && (typeof body.content !== "string" || body.content.length > 150_000)) ||
      (body.title !== undefined && (typeof body.title !== "string" || body.title.length > 240))) {
    return NextResponse.json({ error: "invalid_document_update" }, { status: 400 });
  }
  const data: { generatedContent?: string; title?: string; status?: string } = {};
  if (typeof body.content === "string") {
    data.generatedContent = body.content;
    // Editing invalidates any prior generated/reviewed status.
    data.status = "draft";
  }
  if (typeof body.title === "string") data.title = body.title.trim();
  if (Object.keys(data).length === 0) return NextResponse.json({ error: "no_changes" }, { status: 400 });
  const changed = await db.document.updateMany({
    where: { id: body.id, userId: authUser.uid },
    data,
  });
  if (changed.count !== 1) return NextResponse.json({ error: "document_not_found" }, { status: 404 });
  const updated = await db.document.findFirst({
    where: { id: body.id, userId: authUser.uid },
    select: { id: true, title: true },
  });
  if (!updated) return NextResponse.json({ error: "document_not_found" }, { status: 404 });

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
