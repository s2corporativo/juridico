import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function owns(req: NextRequest, id: string) {
  const auth = await requireAuth(req);
  if (!auth.ok) return { auth, doc: null } as const;
  const doc = await db.document.findFirst({ where: { id, userId: auth.user.uid }, select: { id: true } });
  return { auth, doc } as const;
}

export async function GET(req: NextRequest) {
  const documentId = new URL(req.url).searchParams.get("documentId");
  if (!documentId) return NextResponse.json({ error: "documentId obrigatório" }, { status: 400 });
  const { auth, doc } = await owns(req, documentId);
  if (!auth.ok) return auth.response;
  if (!doc) return NextResponse.json({ error: "document_not_found" }, { status: 404 });
  const [versions, comments, suggestions] = await Promise.all([
    db.documentVersion.findMany({ where: { documentId }, orderBy: { version: "desc" } }),
    db.documentComment.findMany({ where: { documentId }, orderBy: { createdAt: "desc" } }),
    db.documentSuggestion.findMany({ where: { documentId }, orderBy: { createdAt: "desc" } }),
  ]);
  return NextResponse.json({ versions, comments, suggestions });
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { documentId?: string; type?: string; anchor?: string; body?: string; operation?: string; replacement?: string; reason?: string } | null;
  if (!body?.documentId || !body.type) return NextResponse.json({ error: "documentId e type obrigatórios" }, { status: 400 });
  const { auth, doc } = await owns(req, body.documentId);
  if (!auth.ok) return auth.response;
  if (!doc) return NextResponse.json({ error: "document_not_found" }, { status: 404 });
  if (body.type === "comment") {
    if (!body.anchor || !body.body) return NextResponse.json({ error: "anchor e body obrigatórios" }, { status: 400 });
    return NextResponse.json({ comment: await db.documentComment.create({ data: { documentId: body.documentId, userId: auth.user.uid, anchor: body.anchor, body: body.body } }) }, { status: 201 });
  }
  if (body.type === "suggestion") {
    if (!body.anchor || !body.operation || typeof body.replacement !== "string") return NextResponse.json({ error: "sugestão incompleta" }, { status: 400 });
    return NextResponse.json({ suggestion: await db.documentSuggestion.create({ data: { documentId: body.documentId, userId: auth.user.uid, anchor: body.anchor, operation: body.operation, replacement: body.replacement, reason: body.reason } }) }, { status: 201 });
  }
  return NextResponse.json({ error: "type inválido" }, { status: 400 });
}

export async function PATCH(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { documentId?: string; suggestionId?: string; status?: "accepted" | "rejected"; commentId?: string; commentStatus?: "open" | "resolved" } | null;
  if (!body?.documentId) return NextResponse.json({ error: "documentId obrigatório" }, { status: 400 });
  const { auth, doc } = await owns(req, body.documentId);
  if (!auth.ok) return auth.response;
  if (!doc) return NextResponse.json({ error: "document_not_found" }, { status: 404 });
  if (body.suggestionId && body.status) {
    return NextResponse.json({ suggestion: await db.documentSuggestion.update({ where: { id: body.suggestionId }, data: { status: body.status, decidedAt: new Date() } }) });
  }
  if (body.commentId && body.commentStatus) {
    return NextResponse.json({ comment: await db.documentComment.update({ where: { id: body.commentId }, data: { status: body.commentStatus } }) });
  }
  return NextResponse.json({ error: "alteração incompleta" }, { status: 400 });
}
