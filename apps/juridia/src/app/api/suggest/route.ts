import { NextRequest, NextResponse } from "next/server";
import { aiGatewayChat, inferSensitiveTask } from "@/lib/ai_gateway";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const STYLE_HINTS: Record<string, string> = {
  formal:
    "Use linguagem jurídica formal tradicional, com citações de artigos (ex: 'art. 927 do CC') e fundamentação completa.",
  sintetico:
    "Seja conciso e direto. Fundamentação essencial apenas, sem prolixidade. Ideal para processos repetitivos.",
  academic:
    "Inclua citações doutrinárias (ex: 'Conforme ensina Maria Helena Diniz...') e jurisprudência detalhada.",
  direto:
    "Use linguagem clara e acessível, sem jargão excessivo. Adequado para audiências de conciliação.",
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  let body: {
    instruction?: string;
    currentContent?: string;
    templateName?: string;
    style?: string;
  } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const instruction = (body.instruction || "").trim();
  const currentContent = body.currentContent || "";
  const templateName = body.templateName || "minuta jurídica";
  const style = body.style || "formal";

  if (!instruction) {
    return NextResponse.json({ error: "Instrução obrigatória" }, { status: 400 });
  }

  const styleHint = STYLE_HINTS[style] || STYLE_HINTS.formal;

  const systemPrompt = `Você é a Atlas Jurídico, uma IA jurídica brasileira especialista em redação de minutas. Sua tarefa é gerar UM TRECHO de peça jurídica que o usuário pediu. Responda APENAS com o trecho solicitado, sem comentários ou explicações. Use formatação Markdown (### para subtítulos, listas, parágrafos). Estilo: ${styleHint}. Conformidade: CPC, CC, legislação especial, Resolução CNJ 615/2025.`;

  const userPrompt = `## Contexto
Tipo de minuta: ${templateName}

## Conteúdo atual (para contexto)
${currentContent.slice(-1500) || "(documento vazio)"}

## Pedido do usuário
${instruction}

## Resposta
Gere apenas o trecho solicitado, em português jurídico brasileiro, pronto para ser inserido no documento. Não use marcadores [TIPO_0001] — escreva o texto completo com dados genéricos onde necessário (____ para campos a preencher).`;

  try {
    const inferred = inferSensitiveTask(`${templateName}\n${instruction}\n${currentContent.slice(-1500)}`);
    const taskType = inferred === "brain_classify" ? "minuta" : inferred;
    const response = await aiGatewayChat({
      taskType,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.5,
      maxTokens: 1200,
    });

    return NextResponse.json({
      suggestion: response.text,
      tokensUsed: response.totalTokens,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao gerar sugestão";
    // Fallback offline com trechos pré-formatados
    const fallback = generateFallback(instruction, templateName);
    return NextResponse.json({
      suggestion: fallback,
      offline: true,
      error: msg,
    });
  }
}

function generateFallback(instruction: string, templateName: string): string {
  const lower = instruction.toLowerCase();
  if (lower.includes("fundament")) {
    return `### Fundamentação

[Insira aqui apenas normas e precedentes verificados em fonte oficial e aderentes aos fatos do caso.]

Aplique os fundamentos jurídicos aos fatos comprovados e identifique expressamente qualquer lacuna que ainda dependa de pesquisa ou prova.`;
  }
  if (lower.includes("pedido")) {
    return `### Pedidos

1. [Pedido principal, conforme os fatos e a base jurídica verificada];
2. [Pedido acessório, se cabível];
3. [Requerimentos probatórios pertinentes].

Valor da causa: R$ ____ [conferir critério legal aplicável].`;
  }
  if (lower.includes("relat") || lower.includes("fato")) {
    return `### Dos Fatos

[Descreva cronologicamente apenas os fatos comprovados ou expressamente alegados, vinculando-os aos documentos do caso quando disponíveis.]`;
  }
  return `### ${templateName}

Trecho solicitado: ${instruction}

[Conteúdo pendente de fundamentação e conferência jurídica. Não inserir lei, precedente, valor, prazo ou fato sem fonte/evidência verificada.]`;
}
