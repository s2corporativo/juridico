import { invokeLLM } from "./_core/llm";
import { getPublicDecisionSummaryInput } from "./db";
import {
  AI_SUMMARY_MAX_CHARS,
  AI_SUMMARY_RATE_LIMIT,
  AI_SUMMARY_RATE_WINDOW_MS,
  buildPublicSummaryPayload,
  isSafeAiSummary,
} from "@shared/compendium-ai-summary";

const requestWindows = new Map<string, number[]>();

function enforceRateLimit(key: string) {
  const now = Date.now();
  const recent = (requestWindows.get(key) ?? []).filter(timestamp => now - timestamp < AI_SUMMARY_RATE_WINDOW_MS);
  if (recent.length >= AI_SUMMARY_RATE_LIMIT) throw new Error("Limite temporário de resumos atingido. Tente novamente em alguns minutos.");
  recent.push(now);
  requestWindows.set(key, recent);
}

export async function summarizePublicDecision(externalId: string, requestKey: string) {
  enforceRateLimit(requestKey);
  const record = await getPublicDecisionSummaryInput(externalId);
  if (!record) throw new Error("Ficha jurídica não encontrada.");
  const payload = buildPublicSummaryPayload(record);
  const response = await invokeLLM({
    model: "claude-haiku-4-5",
    max_tokens: 420,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "resumo_ficha_juridica",
        strict: true,
        schema: {
          type: "object",
          properties: { summary: { type: "string", minLength: 40, maxLength: AI_SUMMARY_MAX_CHARS } },
          required: ["summary"],
          additionalProperties: false,
        },
      },
    },
    messages: [
      { role: "system", content: "Você resume fichas jurídicas públicas. Produza 2 ou 3 frases em português do Brasil. Restrinja-se aos dados fornecidos; não invente fatos, normas, precedentes, partes, identificadores, valores ou prognósticos. Não conclua mérito, vigência ou chance de êxito. Termine com linguagem condicional e cite que a fonte deve ser conferida." },
      { role: "user", content: `Sintetize a seguinte ficha pública sanitizada:\n${JSON.stringify(payload)}` },
    ],
  });
  const raw = response.choices[0]?.message.content;
  if (typeof raw !== "string") throw new Error("A síntese não retornou texto estruturado.");
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { throw new Error("A síntese retornou formato inválido."); }
  const summary = (parsed as { summary?: unknown }).summary;
  if (!isSafeAiSummary(summary)) throw new Error("A síntese não atendeu ao contrato público de segurança.");
  return { summary: summary.trim(), generatedFrom: "ficha_publica_sanitizada" as const };
}
