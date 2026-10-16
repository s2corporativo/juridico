/**
 * Sugestões temáticas editoriais. Não usam dados de casos, nomes, números de
 * processos ou resultado judicial. A correspondência com atualização aprovada
 * NÃO constitui análise jurídica, fonte citável nem recomendação de litigar.
 */
export type EditorialSignal = { title: string; summary?: string | null };

export type ContentIdea = {
  id: string;
  category: string;
  question: string;
  keywords: readonly string[];
};

export type RankedIdea = ContentIdea & {
  matched: boolean;
  matches: number;
};

export const CONTENT_IDEAS: readonly ContentIdea[] = [
  { id: "pix", category: "Bancário", question: "Caiu no golpe do Pix? Quais medidas são possíveis?", keywords: ["pix", "fraude banc", "transferencia fraud", "fortuito interno"] },
  { id: "emprestimo", category: "Bancário", question: "Descobriu um empréstimo que nunca contratou?", keywords: ["emprestimo", "consignad", "fraude de identidade", "contratacao fraud"] },
  { id: "loja", category: "Consumidor", question: "Comprou em rede social e o produto nunca chegou?", keywords: ["comercio eletronico", "compra online", "rede social", "entrega", "marketplace"] },
  { id: "cancelou", category: "Consumidor", question: "Cancelou um serviço e a cobrança continuou?", keywords: ["telecomunic", "operadora", "cancelamento", "cobranca indevida"] },
  { id: "gravidez", category: "Trabalhista", question: "Descobriu a gravidez depois da demissão?", keywords: ["gestante", "gravidez", "estabilidade gestacional", "maternidade"] },
  { id: "ir", category: "Tributário", question: "Aposentado com doença grave pode ter isenção de IR?", keywords: ["doenca grave", "imposto de renda", "isencao", "aposentadoria"] },
  { id: "itbi", category: "Tributário", question: "Pagou ITBI sobre valor superior ao da compra?", keywords: ["itbi", "valor venal", "base de calculo", "transmissao imobili"] },
  { id: "pensao", category: "Família", question: "Completou 18 anos: a pensão termina automaticamente?", keywords: ["pensao alimenticia", "alimentos", "maioridade", "familia"] },
  { id: "voo", category: "Viagens", question: "Seu voo foi cancelado: quais são suas opções?", keywords: ["transporte aereo", "voo cancelado", "companhia aerea", "reembolso"] },
] as const;

function normalize(text: string): string {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function rankContentIdeas(updates: readonly EditorialSignal[], count = 6): RankedIdea[] {
  const signals = updates.slice(0, 40).map(row =>
    normalize(String(row.title || "").slice(0, 180) + " " + String(row.summary || "").slice(0, 350))
  );
  return CONTENT_IDEAS.map((idea, order) => {
    const matches = signals.filter(signal => idea.keywords.some(word => signal.includes(normalize(word)))).length;
    return { ...idea, matches, matched: matches > 0, order };
  })
    .sort((a, b) => b.matches - a.matches || a.order - b.order)
    .slice(0, Math.max(0, Math.min(count, CONTENT_IDEAS.length)))
    .map(({ order: _order, ...idea }) => idea);
}

const DEFAULT_STUDIO = "https://pauta-jur-estudio-juridico-de-conteudo-dhql6m.v2.appdeploy.ai/";

/** Retorna apenas um identificador de pauta presente na lista permitida. */
export function buildPautaJurUrl(id: string, studioBase = DEFAULT_STUDIO): string | null {
  if (!CONTENT_IDEAS.some(idea => idea.id === id)) return null;
  try {
    const url = new URL(studioBase);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    url.searchParams.set("pauta", id);
    url.searchParams.set("origem", "atlas");
    return url.toString();
  } catch {
    return null;
  }
}
