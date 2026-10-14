import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import { ENV } from "./_core/env";
import { getCausalDashboard } from "./causal-dashboard";
import { getProvenCauses, type ProvenCausesSummary } from "./causal-pilot-service";

/**
 * JuridIA integrada ao Atlas (painel causal).
 *
 * A JuridIA funciona DENTRO do Atlas e é ALIMENTADA PELO ATLAS: o contexto da
 * conversa é montado a partir do banco causal isolado (causas comprovadas,
 * fila de revisão e agregados do dashboard). Sem chave de LLM configurada, o
 * serviço degrada com uma resposta determinística construída sobre os mesmos
 * dados — nunca inventa números.
 */

export const causaliaQuestionInput = z.object({
  question: z.string().trim().min(3).max(1_000),
});

export const MAX_QUESTIONS_PER_MINUTE = 20;
const rateWindow = new Map<number, number[]>();

/** Janela deslizante por usuário — pura o suficiente para testes com clock real. */
export function checkRateLimit(userId: number): boolean {
  const now = Date.now();
  const hits = (rateWindow.get(userId) ?? []).filter(time => now - time < 60_000);
  if (hits.length >= MAX_QUESTIONS_PER_MINUTE) {
    rateWindow.set(userId, hits);
    return false;
  }
  hits.push(now);
  rateWindow.set(userId, hits);
  return true;
}

export type CausalJuridiaContext = {
  enabled: boolean;
  resumo: ProvenCausesSummary["resumo"];
  causasComprovadas: ProvenCausesSummary["causasComprovadas"];
  pedidosComprovados: ProvenCausesSummary["pedidosComprovados"];
  dashboard: {
    casos: number;
    evidencias: number;
    fatosGeradores: number;
    pendentes: number;
    revisadas: number;
  };
  notice: string;
};

export async function getCausalJuridiaContext(): Promise<CausalJuridiaContext> {
  const [causas, dashboard] = await Promise.all([getProvenCauses(), getCausalDashboard()]);
  return {
    enabled: true,
    resumo: causas.resumo,
    causasComprovadas: causas.causasComprovadas,
    pedidosComprovados: causas.pedidosComprovados,
    dashboard: {
      casos: dashboard.summary.cases,
      evidencias: dashboard.summary.evidence,
      fatosGeradores: dashboard.summary.factGenerators,
      pendentes: dashboard.summary.pendingAnnotations,
      revisadas: dashboard.summary.reviewedAnnotations,
    },
    notice: causas.notice,
  };
}

/** Formata o contexto para o prompt e para exibição — puro, testável sem banco. */
export function formatContextForPrompt(context: CausalJuridiaContext): string {
  const linhas: string[] = [];
  linhas.push(`Casos no banco causal: ${context.dashboard.casos}`);
  linhas.push(`Evidências com hash de origem: ${context.dashboard.evidencias}`);
  linhas.push(`Anotações revisadas (aprovadas): ${context.dashboard.revisadas}`);
  linhas.push(`Anotações pendentes de revisão: ${context.dashboard.pendentes}`);
  linhas.push(`Causas comprovadas distintas: ${context.resumo.causasComprovadas}`);
  linhas.push(`Casos com causa aprovada: ${context.resumo.casosComCausaAprovada}`);
  linhas.push(`Fila de revisão: ${context.resumo.filaDeRevisao}`);
  linhas.push("");
  linhas.push("Causas comprovadas (família × pedido, com contagem de casos e menções; menções não são mutuamente exclusivas):");
  if (context.causasComprovadas.length === 0) {
    linhas.push("(nenhuma causa comprovada ainda)");
  } else {
    for (const causa of context.causasComprovadas) {
      linhas.push(`- ${causa.familyLabel} | ${causa.claimLabel} | casos: ${causa.casos} | menções: ${causa.mencoes}`);
    }
  }
  linhas.push("");
  linhas.push("Pedidos comprovados (por tipo):");
  if (context.pedidosComprovados.length === 0) {
    linhas.push("(nenhum pedido comprovado ainda)");
  } else {
    for (const pedido of context.pedidosComprovados) {
      linhas.push(`- ${pedido.claimLabel} | casos: ${pedido.casos}`);
    }
  }
  linhas.push("");
  linhas.push(`Nota metodológica: ${context.notice}`);
  return linhas.join("\n");
}

/** Resposta determinística do modo local — pura, testável sem banco e sem LLM. */
export function respostaLocal(question: string, context: CausalJuridiaContext): string {
  const alvo = question.toLowerCase();
  const partes: string[] = [];
  partes.push(`Contexto atual do Atlas Causal: ${context.dashboard.casos} casos, ${context.resumo.causasComprovadas} causas comprovadas e ${context.resumo.filaDeRevisao} anotações na fila de revisão.`);

  const pedeCausa = /causa|ensejou|fato|motivo|origem/.test(alvo);
  const pedePedido = /pedido|indeniza/.test(alvo);

  if (context.causasComprovadas.length === 0) {
    partes.push("Ainda não há causas comprovadas: ingeste o inteiro teor, extraia candidatos e aprove na fila de revisão.");
  } else if (pedeCausa || pedePedido || partes.length === 1) {
    const topo = context.causasComprovadas.slice(0, 5);
    const lista = topo.map(causa => `${causa.familyLabel} (${causa.claimLabel}: ${causa.casos} ${causa.casos === 1 ? "caso" : "casos"})`).join("; ");
    partes.push(`Causas comprovadas mais presentes: ${lista}.`);
    const pedidos = context.pedidosComprovados.map(pedido => `${pedido.claimLabel}: ${pedido.casos}`).join("; ");
    if (pedidos) partes.push(`Pedidos comprovados por tipo: ${pedidos}.`);
    partes.push("Menções não são mutuamente exclusivas: um caso pode ter mais de uma causa e um processo pode cumular pedidos.");
  }

  partes.push("Resposta determinística do modo local (sem LLM configurado); os números vêm exclusivamente do banco causal do Atlas.");
  return partes.join(" ");
}

function extractAnswerContent(result: Awaited<ReturnType<typeof invokeLLM>>): string {
  const content = result.choices?.[0]?.message?.content;
  if (typeof content === "string") return content.trim();
  if (Array.isArray(content)) {
    return content
      .map(part => (typeof part === "string" ? part : "text" in part ? part.text : ""))
      .join("")
      .trim();
  }
  return "";
}

export type AskJuridiaResult = {
  answer: string;
  modo: "llm" | "local";
  alimentadaPor: "atlas_causal";
  contexto: CausalJuridiaContext;
};

export async function askJuridia(rawQuestion: unknown, userId: number): Promise<AskJuridiaResult> {
  const { question } = causaliaQuestionInput.parse(rawQuestion);
  if (!checkRateLimit(userId)) {
    throw new Error("limite de 20 perguntas por minuto atingido; tente novamente em instantes");
  }

  const context = await getCausalJuridiaContext();
  const contextoFormatado = formatContextForPrompt(context);

  if (!ENV.forgeApiKey) {
    return { answer: respostaLocal(question, context), modo: "local", alimentadaPor: "atlas_causal", contexto: context };
  }

  const systemPrompt = [
    "Você é a JuridIA, assistente cognitiva do Atlas Forense, operando DENTRO do painel Atlas Causal.",
    "Responda em português do Brasil, de forma direta, técnica e concisa (máximo 2 parágrafos curtos).",
    "Use EXCLUSIVAMENTE os dados do contexto fornecido pelo Atlas. Não invente números, percentuais, nomes de partes ou processos.",
    "Deixe claro que menções causais não são mutuamente exclusivas quando relevante.",
    "Se o contexto não responder à pergunta, diga o que falta (ex.: ingestar mais inteiro teor ou revisar pendências).",
    "Não emite parecer jurídico; a leitura é descritiva e administrativa.",
  ].join(" ");

  try {
    const result = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `CONTEXTO DO ATLAS CAUSAL:\n${contextoFormatado}\n\nPERGUNTA: ${question}` },
      ],
      maxTokens: 700,
    });
    const answer = extractAnswerContent(result);
    if (!answer) throw new Error("resposta vazia do LLM");
    return { answer, modo: "llm", alimentadaPor: "atlas_causal", contexto: context };
  } catch (error) {
    console.warn("[causal-juridia] LLM indisponível, respondendo no modo local:", error instanceof Error ? error.message : error);
    return { answer: respostaLocal(question, context), modo: "local", alimentadaPor: "atlas_causal", contexto: context };
  }
}
