import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import { requireAuth } from "@/lib/auth";
import { pseudonymize, rehydrate } from "@/lib/pseudonymizer";

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

  const systemPrompt = `Você é a JuridIA, uma IA jurídica brasileira especialista em redação de minutas. Sua tarefa é gerar UM TRECHO de peça jurídica que o usuário pediu. Responda APENAS com o trecho solicitado, sem comentários ou explicações. Use formatação Markdown (### para subtítulos, listas, parágrafos). Estilo: ${styleHint}. Conformidade: CPC, CC, legislação especial, Resolução CNJ 615/2025.`;

  const userPrompt = `## Contexto
Tipo de minuta: ${templateName}

## Conteúdo atual (para contexto)
${currentContent.slice(-1500) || "(documento vazio)"}

## Pedido do usuário
${instruction}

## Resposta
Gere apenas o trecho solicitado, em português jurídico brasileiro, pronto para ser inserido no documento. Não use marcadores [TIPO_0001] — escreva o texto completo com dados genéricos onde necessário (____ para campos a preencher).`;

  const externalPrompt = pseudonymize(userPrompt);
  try {
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: externalPrompt.text },
      ],
      thinking: { type: "disabled" },
      temperature: 0.5,
      max_tokens: 1200,
    });

    const suggestion = rehydrate(completion.choices[0]?.message?.content || "", externalPrompt.map);
    return NextResponse.json({
      suggestion,
      tokensUsed:
        (completion as unknown as { usage?: { total_tokens?: number } }).usage
          ?.total_tokens || 0,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao gerar sugestão";
    // Fallback offline com trechos pré-formatados
    const fallback = generateFallback();
    return NextResponse.json({
      suggestion: fallback,
      offline: true,
      error: msg,
    });
  }
}

function generateFallback(): string {
  // Sem fatos e fontes verificadas não se fabrica fundamento jurídico offline.
  return "Sugestão não gerada. Confira os fatos e as fontes oficiais antes de redigir o trecho.";
}
