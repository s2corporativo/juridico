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
  const batch = body.batchId
    ? await db.batchJob.update({ where: { id: body.batchId }, data: { moldDocumentId: body.moldDocumentId, total: body.items.length } })
    : await db.batchJob.create({ data });
  return NextResponse.json({ batch }, { status: body.batchId ? 200 : 201 });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;
  const body = (await req.json().catch(() => null)) as {
    batchId?: string;
    itemId?: string;
    itemNo?: number;
    status?: string;
    documentId?: string;
    error?: string;
    paused?: boolean; // alias para status=paused/resumed no lote
  } | null;
  if (!body?.batchId) return NextResponse.json({ error: "batchId obrigatório" }, { status: 400 });
  const owned = await db.batchJob.findFirst({ where: { id: body.batchId, userId: auth.user.uid }, include: { items: true } });
  if (!owned) return NextResponse.json({ error: "batch_not_found" }, { status: 404 });

  // Pausa/retomada no nível do lote (via paused: true/false)
  if (body.paused !== undefined) {
    const newBatchStatus = body.paused ? "paused" : "running";
    const batch = await db.batchJob.update({
      where: { id: body.batchId },
      data: { status: newBatchStatus },
    });
    // Pausa/retoma todos os itens pendentes
    if (body.paused) {
      await db.batchItem.updateMany({
        where: { batchId: body.batchId, status: "running" },
        data: { status: "paused" },
      });
    } else {
      await db.batchItem.updateMany({
        where: { batchId: body.batchId, status: "paused" },
        data: { status: "queued" },
      });
    }
    return NextResponse.json({ batch });
  }

  // Atualização por item específico
  if (body.itemId || typeof body.itemNo === "number") {
    const item = body.itemId
      ? await db.batchItem.findFirst({ where: { id: body.itemId, batchId: body.batchId } })
      : await db.batchItem.findFirst({ where: { batchId: body.batchId, itemNo: body.itemNo } });
    if (!item) return NextResponse.json({ error: "batch_item_not_found" }, { status: 404 });
    await db.batchItem.update({
      where: { id: item.id },
      data: {
        status: body.status || "completed",
        documentId: body.documentId,
        error: body.error,
      },
    });
  }

  // Atualização de status do lote — recalcula completude
  if (body.status !== undefined) {
    const completed = await db.batchItem.count({ where: { batchId: body.batchId, status: "completed" } });
    const paused = await db.batchItem.count({ where: { batchId: body.batchId, status: "paused" } });
    const failed = await db.batchItem.count({ where: { batchId: body.batchId, status: "failed" } });
    const running = await db.batchItem.count({ where: { batchId: body.batchId, status: "running" } });
    let batchStatus = body.status;
    if (completed >= owned.total) batchStatus = "completed";
    else if (paused > 0) batchStatus = "paused";
    else if (running > 0) batchStatus = "running";
    else if (failed > 0 && completed < owned.total) batchStatus = "failed";
    const batch = await db.batchJob.update({
      where: { id: body.batchId },
      data: { status: batchStatus, completed },
    });
    return NextResponse.json({ batch });
  }

  return NextResponse.json({ batch: owned });
}
