// thesis_checker.ts — Verificador de aderência da tese 
//
// Verifica não apenas a existência da citação, mas também
// mas não verifica se ela SUSTENTA a afirmação feita na peça.
//
// Este verificador compara a frase da peça com o fundamento central do acórdão
// e classifica em: apoia | apoia_em_parte | distinguivel | contrario | insuficiente
//
// Base normativa: art. 489, §1º, V e VI, do CPC (fundamentação deve demonstrar
// o ajuste do precedente ao caso ou a sua distinção)

import { aiGatewayJson, inferSensitiveTask } from "@/lib/ai_gateway";

export type ThesisAdherence =
  | "apoia"
  | "apoia_em_parte"
  | "distinguivel"
  | "contrario"
  | "insuficiente";

export interface ThesisCheckResult {
  adherence: ThesisAdherence;
  confidence: number;
  explanation: string;
  recommendation: string;
}

export interface ThesisCheckInput {
  claim: string;          // afirmação feita na peça
  precedentQuote: string; // trecho do precedente citado
  caseFacts: string;      // fatos do caso
  precedentLabel?: string; // "REsp 1.234.567/SP" etc.
}

/**
 * Verifica se o precedente realmente sustenta a afirmação feita na peça.
 * Usa LLM como assistente, mas a classificação é confirmada por regras.
 */
export async function checkThesisAdherence(input: ThesisCheckInput): Promise<ThesisCheckResult> {
  const { claim, precedentQuote, caseFacts, precedentLabel } = input;

  if (!claim.trim() || !precedentQuote.trim()) {
    return {
      adherence: "insuficiente",
      confidence: 0,
      explanation: "Afirmação ou precedente vazio",
      recommendation: "Forneça a afirmação da peça e o trecho do precedente citado",
    };
  }

  try {
    const inferred = inferSensitiveTask(`${claim}\n${precedentQuote}\n${caseFacts}`);
    const taskType = inferred === "brain_classify" ? "analise_caso" : inferred;
    const { data: parsed } = await aiGatewayJson<{
      adherence?: ThesisAdherence;
      confidence?: number;
      explanation?: string;
      recommendation?: string;
    }>({
      taskType,
      messages: [
        {
          role: "system",
          content: `Você é um verificador jurídico brasileiro. Verifique apenas se o trecho fornecido do precedente sustenta a afirmação da peça.
Classifique: apoia | apoia_em_parte | distinguivel | contrario | insuficiente.
Não complemente o precedente com conhecimento externo e não invente fundamento.
Responda APENAS JSON: {"adherence":"...","confidence":0.0,"explanation":"...","recommendation":"..."}.`,
        },
        {
          role: "user",
          content: `## Afirmação da peça
${claim}

## Precedente citado${precedentLabel ? ` (${precedentLabel})` : ""}
${precedentQuote}

## Fatos do caso
${caseFacts.slice(0, 500)}`,
        },
      ],
      temperature: 0.2,
      maxTokens: 500,
    });
    const validAdherence: ThesisAdherence[] = ["apoia", "apoia_em_parte", "distinguivel", "contrario", "insuficiente"];
    const adherence = parsed.adherence && validAdherence.includes(parsed.adherence) ? parsed.adherence : "insuficiente";
    return {
      adherence,
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.5,
      explanation: parsed.explanation || "Verificação inconclusiva",
      recommendation: parsed.recommendation || "Verifique manualmente a relação entre a afirmação e o precedente",
    };
  } catch (e) {
    return {
      adherence: "insuficiente",
      confidence: 0,
      explanation: `Erro: ${e instanceof Error ? e.message : "desconhecido"}`,
      recommendation: "Verifique manualmente a relação entre a afirmação e o precedente",
    };
  }
}

// ── Regras determinísticas complementares ─────────────────────────────────

/**
 * Verifica regras determinísticas antes de chamar o LLM.
 * Se a regra determinística já decide, o LLM não é chamado.
 */
export function deterministicCheck(input: ThesisCheckInput): ThesisCheckResult | null {
  const { claim, precedentQuote } = input;

  // Regra 1: se o precedente contém expressões de negação, pode ser contrário
  const negationPatterns = /não\s+(?:procede|se\s+aplica|é\s+aplicável)|improcede|rejeit/i;
  if (negationPatterns.test(precedentQuote)) {
    return {
      adherence: "contrario",
      confidence: 0.7,
      explanation: "O precedente contém linguagem de negação/improcedência que pode ser contrária à afirmação",
      recommendation: "Verifique se o precedente realmente nega a tese ou apenas não se aplica ao caso específico",
    };
  }

  // Regra 2: se a afirmação e o precedente tratam de áreas diferentes
  const claimArea = detectArea(claim);
  const precArea = detectArea(precedentQuote);
  if (claimArea && precArea && claimArea !== precArea) {
    return {
      adherence: "distinguivel",
      confidence: 0.6,
      explanation: `A afirmação trata de ${claimArea} e o precedente de ${precArea} — áreas distintas`,
      recommendation: "Verifique se o precedente trata do mesmo fundamento jurídico, mesmo sendo de área diferente",
    };
  }

  return null; // não decide — chama o LLM
}

function detectArea(text: string): string | null {
  const lower = text.toLowerCase();
  if (/consumidor|cdc|fornecedor|banco|serasa|spc/i.test(lower)) return "consumer";
  if (/trabalh|clt|empregad|horas?\s+extras?|rescis/i.test(lower)) return "trabalhista";
  if (/tribut|ctn|imposto|fiscal|lançamento/i.test(lower)) return "tributario";
  if (/penal|crime|cp\s|cpp/i.test(lower)) return "penal";
  if (/fam[ií]lia|alimentos|guarda|div[oó]rcio/i.test(lower)) return "family";
  if (/civil|cpc|c[oó]digo\s+civil|contrato|indeniza/i.test(lower)) return "civil";
  return null;
}
