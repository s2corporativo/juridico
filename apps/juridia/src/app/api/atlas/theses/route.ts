import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";
import { detect } from "@/lib/anonymize";
import { isAtlasConfigured, submitThesisToAtlas, type ThesisSubmission } from "@/lib/atlas_client";

export const dynamic = "force-dynamic";

// Retorno Cérebro → Atlas: somente teses aprovadas por advogado, com fonte oficial e sem dado pessoal.
// A tese entra na fila editorial do Atlas (pending_review); nada é publicado automaticamente.
const ALLOWED_ROLES = new Set(["admin", "advogado"]);
const BLOCKED_PII = new Set(["CPF", "CNPJ", "RG", "TELEFONE", "EMAIL", "CEP", "PIS", "PLACA", "CONTA"]);

export async function POST(req: NextRequest): Promise<NextResponse> {
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const user = __auth.user;
  if (!ALLOWED_ROLES.has(user.role)) {
    return NextResponse.json({ error: "forbidden", need: "admin|advogado" }, { status: 403 });
  }
  if (!isAtlasConfigured()) {
    return NextResponse.json({ error: "atlas_not_configured" }, { status: 503 });
  }

  let body: Partial<ThesisSubmission> & { approved?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  if (body.approved !== true) {
    return NextResponse.json({ error: "approval_required", details: ["Confirme a revisão e aprovação da tese pelo advogado responsável."] }, { status: 400 });
  }

  const submission: ThesisSubmission = {
    title: String(body.title ?? ""),
    summary: String(body.summary ?? ""),
    kind: body.kind === "legislation" ? "legislation" : "jurisprudence",
    canonicalUrl: String(body.canonicalUrl ?? ""),
    authorityRefs: Array.isArray(body.authorityRefs) ? body.authorityRefs.map(String).slice(0, 6) : [],
  };

  // Pré-checagem local de dados pessoais (o Atlas valida de novo; defesa em profundidade).
  const text = [submission.title, submission.summary, ...(submission.authorityRefs ?? [])].join("\n");
  const pii = detect(text).filter((f) => BLOCKED_PII.has(f.type)).map((f) => f.type);
  if (pii.length > 0) {
    return NextResponse.json(
      { error: "personal_data_detected", details: [`Possível dado pessoal (${Array.from(new Set(pii)).join(", ")}). Anonimize antes de enviar.`] },
      { status: 422 },
    );
  }

  const result = await submitThesisToAtlas(submission);
  if (!result.ok) {
    const status = result.status && result.status >= 400 && result.status < 500 ? result.status : 502;
    await logAuditEvent({ action: "atlas_thesis_rejected", resource: "atlas_thesis", userId: user.uid, metadata: { error: result.error } });
    return NextResponse.json({ error: result.error }, { status });
  }

  await logAuditEvent({
    action: "atlas_thesis_submitted",
    resource: "atlas_thesis",
    resourceId: result.data.thesisKey,
    userId: user.uid,
    metadata: { duplicate: result.data.duplicate, status: result.data.status },
  });
  return NextResponse.json({ ok: true, ...result.data }, { status: result.data.duplicate ? 200 : 201 });
}
