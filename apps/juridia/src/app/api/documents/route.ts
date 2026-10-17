import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";
import type { DocumentDTO } from "@/lib/types";
import { requireAuth } from "@/lib/auth";
import { beforeLegalCursor, encodeLegalCursor, parseLegalPageParams } from "@/lib/legal-list-cursor";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  const params = new URL(req.url).searchParams;
  const page = parseLegalPageParams(params);
  if (!page.ok) return NextResponse.json({ error: page.error }, { status: 400 });
  const includeArchived = params.get("includeArchived") === "1";
  const rows = await db.document.findMany({
    where: {
      userId: authUser.uid,
      ...(!includeArchived && { status: { not: "archived" } }),
      ...(page.cursor && beforeLegalCursor(page.cursor)),
    },
    orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
    take: page.limit + 1,
  });
  const hasMore = rows.length > page.limit;
  const docs = rows.slice(0, page.limit);
  const nextCursor = hasMore ? encodeLegalCursor(docs[docs.length - 1]) : null;
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
  return NextResponse.json({ documents: dtos, nextCursor, hasMore });
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });

  const doc = await db.document.findFirst({
    where: { id, userId: authUser.uid },
    select: { title: true, templateName: true },
  });
  if (!doc) return NextResponse.json({ error: "document_not_found" }, { status: 404 });
  // Exclusão pelo usuário significa arquivamento reversível, não perda de prova/documento.
  const archived = await db.document.updateMany({
    where: { id, userId: authUser.uid },
    data: { status: "archived" },
  });
  if (archived.count !== 1) return NextResponse.json({ error: "document_not_found" }, { status: 404 });

  await logAuditEvent({
    action: "archive_document",
    resource: "document",
    resourceId: id,
    metadata: { title: doc.title, templateName: doc.templateName },
    userId: authUser.uid,
  });

  return NextResponse.json({ ok: true, archived: true });
}

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  const body = (await req.json().catch(() => null)) as { id?: string; content?: string; title?: string; status?: string } | null;
  if (!body?.id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
  const data: { generatedContent?: string; title?: string; status?: string } = {};
  if (body.status !== undefined && !["draft", "generated", "archived"].includes(body.status)) {
    return NextResponse.json({ error: "invalid_status" }, { status: 400 });
  }
  if (body.status !== undefined) data.status = body.status;
  if (typeof body.content === "string") data.generatedContent = body.content;
  if (typeof body.title === "string") data.title = body.title;
  const updated = await db.document.updateMany({
    where: { id: body.id, userId: authUser.uid },
    data,
  });
  if (updated.count !== 1) return NextResponse.json({ error: "document_not_found" }, { status: 404 });
  const owned = await db.document.findFirst({
    where: { id: body.id, userId: authUser.uid },
    select: { id: true, title: true },
  });
  if (!owned) return NextResponse.json({ error: "document_not_found" }, { status: 404 });

  const last = await db.documentVersion.findFirst({
    where: { documentId: body.id },
    orderBy: { version: "desc" },
    select: { version: true },
  });
  const version = (last?.version ?? 0) + 1;
  const snapshot = await db.document.findUnique({
    where: { id: body.id },
    select: { title: true, generatedContent: true },
  });
  if (snapshot) {
    await db.documentVersion.create({
      data: {
        documentId: body.id,
        userId: authUser.uid,
        version,
        title: snapshot.title,
        content: snapshot.generatedContent,
        source: "human",
        changeNote: "Salvamento pelo editor",
      },
    });
  }

  await logAuditEvent({
    action: "edit_document",
    resource: "document",
    resourceId: body.id,
    metadata: {
      title: owned.title,
      changedContent: typeof body.content === "string",
      changedTitle: typeof body.title === "string",
      contentLength: body.content?.length || 0,
    },
  });

  return NextResponse.json({ ok: true, document: { id: owned.id, title: owned.title, version } });
}

function safeParseArr(raw: string | null): string[] {
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}
