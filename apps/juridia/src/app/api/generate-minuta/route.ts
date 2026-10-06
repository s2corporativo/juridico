// POST /api/generate-minuta — rota JSON clássica (resposta única).
//
// A lógica inteira do pipeline vive em src/lib/minuta_run.ts (runMinutaPipeline),
// compartilhada com a rota de streaming /api/generate-minuta/stream. Esta rota
// apenas autentica, valida o corpo e devolve o resultado final em JSON — sem
// streaming (para feedback ao vivo, use a rota stream ou a UI do gerador).

import { NextRequest, NextResponse } from "next/server";
import { runMinutaPipeline, PipelineError } from "@/lib/minuta_run";
import type { GenerateMinutaRequest } from "@/lib/types";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  let body: GenerateMinutaRequest;
  try {
    body = (await req.json()) as GenerateMinutaRequest;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!body?.templateSlug || !body?.fields) {
    return NextResponse.json({ error: "templateSlug e fields obrigatórios" }, { status: 400 });
  }

  try {
    const result = await runMinutaPipeline(body, authUser);
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof PipelineError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "falha na geração" },
      { status: 500 }
    );
  }
}
