import { NextRequest, NextResponse } from "next/server";
import { checkThesisAdherence, deterministicCheck } from "@/lib/thesis_checker";
import { logAuditEvent } from "@/lib/audit";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  let body: { claim?: string; precedentQuote?: string; caseFacts?: string; precedentLabel?: string } = {};
  try { body = await req.json(); } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }

  if (!body.claim?.trim() || !body.precedentQuote?.trim()) {
    return NextResponse.json({ error: "claim e precedentQuote obrigatórios" }, { status: 400 });
  }

  const input = {
    claim: body.claim!,
    precedentQuote: body.precedentQuote!,
    caseFacts: body.caseFacts || "",
    precedentLabel: body.precedentLabel,
  };

  // 1. Verificação determinística primeiro (sem LLM)
  const detResult = deterministicCheck(input);
  if (detResult) {
    await logAuditEvent({
      action: "thesis_check_deterministic",
      resource: "document",
      metadata: { adherence: detResult.adherence, confidence: detResult.confidence },
    });
    return NextResponse.json({ ...detResult, method: "deterministic" });
  }

  // 2. Verificação via LLM (se determinístico não decidiu)
  const result = await checkThesisAdherence(input);
  await logAuditEvent({
    action: "thesis_check_llm",
    resource: "document",
    metadata: { adherence: result.adherence, confidence: result.confidence },
  });

  return NextResponse.json({ ...result, method: "llm" });
}
