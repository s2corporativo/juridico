import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyCitations } from "@/lib/citation_gate";
import { logAuditEvent } from "@/lib/audit";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

// POST: verifica citações de um texto contra a base curada
export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  let body: { text?: string; documentId?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const text = (body.text || "").trim();
  if (!text || text.length < 20) {
    return NextResponse.json(
      { error: "Texto muito curto (mín. 20 caracteres)" },
      { status: 400 }
    );
  }

  if (body.documentId) {
    const owned = await db.document.findFirst({
      where: { id: body.documentId, userId: authUser.uid },
      select: { id: true },
    });
    if (!owned) return NextResponse.json({ error: "document_not_found" }, { status: 404 });
  }

  // Carrega TODAS as fontes curadas para verificação
  const sources = await db.legalSource.findMany({
    orderBy: [{ diploma: "asc" }, { numero: "asc" }],
  });

  const result = verifyCitations(text, sources);

  // Registra evento de auditoria
  await logAuditEvent({
    action: "verify_citations",
    resource: "document",
    resourceId: body.documentId || null,
    metadata: {
      total: result.total,
      verificadas: result.verificadas,
      suspeitas: result.suspeitas,
      identificadas: result.identificadas,
      bloquear: result.bloquear,
    },
  });

  return NextResponse.json(result);
}
