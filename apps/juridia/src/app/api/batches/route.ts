import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;
  const batches = await db.batchJob.findMany({ where: { userId: auth.user.uid }, orderBy: { updatedAt: "desc" }, take: 50, include: { items: { orderBy: { itemNo: "asc" } } } });
  return NextResponse.json({ batches });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;
  const body = (await req.json().catch(() => null)) as { templateSlug?: string; batchId?: string; moldDocumentId?: string; items?: Array<{ itemNo: number; title?: string; fields: Record<string, string> }> } | null;
  if (!body?.templateSlug || !Array.isArray(body.items)) return NextResponse.json({ error: "templateSlug e items obrigatórios" }, { status: 400 });
  const data = {
    userId: auth.user.uid,
    templateSlug: body.templateSlug,
    moldDocumentId: body.moldDocumentId,
    total: body.items.length,
    items: { create: body.items.map((item) => ({ itemNo: item.itemNo, title: item.title, fields: JSON.stringify(item.fields) })) },
  };
  if (body.batchId) {
    // A alteração é condicionada ao proprietário no próprio comando de escrita.
    // Não modificar o total sem sincronizar os BatchItem persistidos.
    const changed = await db.batchJob.updateMany({
      where: { id: body.batchId, userId: auth.user.uid },
      data: { moldDocumentId: body.moldDocumentId },
    });
    if (changed.count === 0) return NextResponse.json({ error: "batch_not_found" }, { status: 404 });
    const batch = await db.batchJob.findFirst({ where: { id: body.batchId, userId: auth.user.uid } });
    return NextResponse.json({ batch });
  }
  if (body.items.length < 1 || body.items.length > 10) {
    return NextResponse.json({ error: "O lote deve conter de 1 a 10 casos" }, { status: 400 });
  }
  if (new Set(body.items.map(item => item.itemNo)).size !== body.items.length ||
      body.items.some(item => !Number.isInteger(item.itemNo) || item.itemNo < 1 || item.itemNo > body.items.length)) {
    return NextResponse.json({ error: "Numeração dos itens inválida" }, { status: 400 });
  }
  const batch = await db.batchJob.create({ data });
  return NextResponse.json({ batch }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;
  const body = (await req.json().catch(() => null)) as { batchId?: string; itemId?: string; itemNo?: number; status?: string; documentId?: string; error?: string } | null;
  if (!body?.batchId) return NextResponse.json({ error: "batchId obrigatório" }, { status: 400 });
  const owned = await db.batchJob.findFirst({ where: { id: body.batchId, userId: auth.user.uid }, include: { items: true } });
  if (!owned) return NextResponse.json({ error: "batch_not_found" }, { status: 404 });
  if (body.itemId || typeof body.itemNo === "number") {
    const item = body.itemId ? await db.batchItem.findFirst({ where: { id: body.itemId, batchId: body.batchId } }) : await db.batchItem.findFirst({ where: { batchId: body.batchId, itemNo: body.itemNo } });
    if (!item) return NextResponse.json({ error: "batch_item_not_found" }, { status: 404 });
    await db.batchItem.update({ where: { id: item.id }, data: { status: body.status || "completed", documentId: body.documentId, error: body.error } });
  }
  const completed = await db.batchItem.count({ where: { batchId: body.batchId, status: "completed" } });
  const status = completed >= owned.total ? "completed" : body.status === "failed" ? "paused" : "running";
  const batch = await db.batchJob.update({ where: { id: body.batchId }, data: { status, completed } });
  return NextResponse.json({ batch });
}
