import { NextRequest, NextResponse } from "next/server";
import { aiGatewayJson } from "@/lib/ai_gateway";
import { scanDocumentForPromptInjection, wrapUntrustedDocument } from "@/lib/document_security";
import { requireAuth } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";
import { buildDeterministicMoldeFallback } from "@/lib/molde";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

interface MoldeChange {
  operation: "replace" | "add" | "remove";
  anchor: string;       // trecho exato do documento-base
  replacement?: string;  // novo trecho (para replace/add)
  reason: string;        // justificativa
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  let body: {
    baseDocument?: string;
    instruction?: string;
    templateName?: string;
  } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const baseDocument = body.baseDocument || "";
  const instruction = (body.instruction || "").trim();
  const templateName = body.templateName || "minuta jurídica";

  if (!baseDocument || baseDocument.length < 50) {
    return NextResponse.json(
      { error: "Documento-base muito curto (mínimo 50 caracteres)" },
      { status: 400 }
    );
  }
  if (!instruction) {
    return NextResponse.json(
      { error: "Instrução obrigatória (o que alterar no documento)" },
      { status: 400 }
    );
  }

  const systemPrompt = `Você é a Atlas Jurídico operando em Modo Molde. Sua tarefa é analisar um documento-base jurídico e uma instrução do advogado, e produzir uma LISTA de alterações estruturadas que devem ser aplicadas ao documento.

NÃO reescreva o documento inteiro. Produza apenas as alterações necessárias, cada uma com:
- operation: "replace" (substituir trecho), "add" (adicionar após o anchor), "remove" (remover o trecho)
- anchor: o trecho EXATO do documento-base que deve ser localizado (mínimo 10 caracteres, máximo 200)
- replacement: o novo trecho (para "replace" e "add"; null para "remove")
- reason: justificativa curta da alteração

REGRAS CRÍTICAS:
1. O anchor DEVE ser um trecho que existe literalmente no documento-base. Não invente.
2. Se a instrução não se aplicar a nenhum trecho existente, use "add" com um anchor no final de uma seção relevante.
3. Preserve marcadores [TIPO_0001] existentes no documento.
4. Máximo de 10 alterações por resposta.
5. Responda APENAS com JSON válido, sem markdown, sem texto antes/depois.

Formato da resposta:
{
  "changes": [
    {
      "operation": "replace",
      "anchor": "trecho exato do documento-base...",
      "replacement": "novo trecho...",
      "reason": "motivo da alteração"
    }
  ]
}`;

  const security = scanDocumentForPromptInjection(baseDocument);
  if (security.severity === "block") {
    await logAuditEvent({
      action: "molde_blocked_prompt_injection",
      resource: "document",
      userId: authUser.uid,
      metadata: {
        templateName,
        score: security.score,
        findings: security.findings.map((x) => x.code),
      },
    });
    return NextResponse.json({
      error: "prompt_injection_detected",
      security: { severity: security.severity, score: security.score, findings: security.findings },
      changes: [],
    }, { status: 422 });
  }

  try {
    const { data: parsed } = await aiGatewayJson<{ changes?: MoldeChange[] }>({
      taskType: "minuta",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `## Tipo de documento\n${templateName}\n\n${wrapUntrustedDocument(baseDocument.slice(0, 12000), "molde")}\n\n## Instrução do advogado\n${instruction}` },
      ],
      temperature: 0.4,
      maxTokens: 2000,
    });
    let changes: MoldeChange[] = [];
    if (Array.isArray(parsed.changes)) {
      changes = parsed.changes
        .filter((c) => c.operation && c.anchor && typeof c.anchor === "string" && c.anchor.length >= 5)
        .slice(0, 10)
        .map((c) => ({
          operation: c.operation,
          anchor: c.anchor.slice(0, 300),
          replacement: c.replacement || undefined,
          reason: c.reason || "",
        }));
    }

    // Validação: cada anchor deve existir no documento-base.
    let validated = changes.filter((c) => {
      const anchorShort = c.anchor.slice(0, 40).toLowerCase();
      return baseDocument.toLowerCase().includes(anchorShort);
    });

    if (validated.length === 0) {
      validated = [buildDeterministicMoldeFallback(baseDocument, instruction)];
    }

    await logAuditEvent({
      action: "molde_analyze",
      resource: "document",
      userId: authUser.uid,
      metadata: {
        templateName,
        requestedChanges: changes.length,
        validatedChanges: validated.length,
        securitySeverity: security.severity,
        securityScore: security.score,
      },
    });

    return NextResponse.json({
      changes: validated,
      total: validated.length,
      security: { severity: security.severity, score: security.score, findings: security.findings.slice(0, 10) },
    });
  } catch (e) {
    const fallback = buildDeterministicMoldeFallback(baseDocument, instruction);
    await logAuditEvent({
      action: "molde_fallback",
      resource: "document",
      userId: authUser.uid,
      metadata: {
        templateName,
        reason: e instanceof Error ? e.message.slice(0, 200) : "provider_unavailable",
        securitySeverity: security.severity,
        securityScore: security.score,
      },
    });
    return NextResponse.json({
      changes: [fallback],
      total: 1,
      fallback: true,
      security: { severity: security.severity, score: security.score, findings: security.findings.slice(0, 10) },
    });
  }
}
