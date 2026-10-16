import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Snapshots da geração acessíveis apenas ao titular do documento. */
export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;
  const documentId = new URL(request.url).searchParams.get("documentId")?.trim();
  if (!documentId || documentId.length > 128) {
    return NextResponse.json({ error: "documentId inválido" }, { status: 400 });
  }
  const owned = await db.document.findFirst({
    where: { id: documentId, userId: auth.user.uid },
    select: { id: true },
  });
  if (!owned) return NextResponse.json({ error: "document_not_found" }, { status: 404 });

  const usage = await db.documentSkillUsage.findMany({
    where: { documentId: owned.id },
    orderBy: { createdAt: "asc" },
    select: {
      id: true, skillSlug: true, skillVersion: true,
      contentHash: true, contentSnapshot: true, createdAt: true,
    },
  });
  return NextResponse.json({
    usage: usage.map((row) => ({ ...row, createdAt: row.createdAt.toISOString() })),
    // Dados antigos podem registrar o texto integral em vez do trecho efetivo.
    historicalAccuracyNotAttested: true,
  }, { headers: { "Cache-Control": "private, no-store" } });
}
