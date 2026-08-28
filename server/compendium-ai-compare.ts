import { invokeLLM } from "./_core/llm";
import { getPublicRelatedDecisionInputs } from "./db";
import {
  AI_COMPARE_MAX_ITEMS,
  buildPublicComparisonPayload,
  isSafeAiComparison,
} from "@shared/compendium-ai-compare";

const comparisonWindows = new Map<string, number[]>();
const WINDOW_MS = 5 * 60 * 1_000;
const LIMIT = 4;

function enforceComparisonRateLimit(key: string) {
  const now = Date.now();
  const recent = (comparisonWindows.get(key) ?? []).filter(timestamp => now - timestamp < WINDOW_MS);
  if (recent.length >= LIMIT) throw new Error("Limite temporário de comparações atingido. Tente novamente em alguns minutos.");
  recent.push(now);
  comparisonWindows.set(key, recent);
}

export async function comparePublicRelatedDecisions(externalIds: string[], requestKey: string) {
  if (externalIds.length < 2 || externalIds.length > AI_COMPARE_MAX_ITEMS) throw new Error("Selecione entre 2 e 4 julgados relacionados.");
  enforceComparisonRateLimit(requestKey);
  const records = await getPublicRelatedDecisionInputs(externalIds);
  if (records.length !== externalIds.length) throw new Error("Um ou mais julgados não estão disponíveis no acervo público.");
  const payload = buildPublicComparisonPayload(records);
  const response = await invokeLLM({
    model: "claude-haiku-4-5",
    max_tokens: 620,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "comparacao_julgados_publicos",
        strict: true,
        schema: {
          type: "object",
          properties: {
            similarities: { type: "array", items: { type: "string", minLength: 8, maxLength: 280 }, maxItems: 6 },
            differences: { type: "array", items: { type: "string", minLength: 8, maxLength: 280 }, maxItems: 6 },
            caveats: { type: "array", items: { type: "string", minLength: 8, maxLength: 280 }, maxItems: 6 },
          },
          required: ["similarities", "differences", "caveats"],
          additionalProperties: false,
        },
      },
    },
    messages: [
      { role: "system", content: "Compare apenas os metadados públicos fornecidos. Produza semelhanças, diferenças e ressalvas documentais em português do Brasil. Não invente fatos, normas, fundamentos, partes ou identificadores. Não conclua qual decisão é correta, não avalie chance de êxito e não transforme posição catalogada em aconselhamento jurídico. Se faltar informação, registre a limitação." },
      { role: "user", content: `Compare os julgados públicos abaixo. Use apenas os rótulos internos Julgado 1, Julgado 2 etc.\n${JSON.stringify(payload)}` },
    ],
  });
  const raw = response.choices[0]?.message.content;
  if (typeof raw !== "string") throw new Error("A comparação não retornou conteúdo estruturado.");
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { throw new Error("A comparação retornou formato inválido."); }
  if (!isSafeAiComparison(parsed)) throw new Error("A comparação não atendeu ao contrato público de segurança.");
  return { ...parsed, comparedItems: records.length, generatedFrom: "julgados_relacionados_sanitizados" as const };
}
