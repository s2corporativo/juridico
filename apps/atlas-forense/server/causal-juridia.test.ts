import { describe, expect, it } from "vitest";
import {
  MAX_QUESTIONS_PER_MINUTE,
  causaliaQuestionInput,
  checkRateLimit,
  formatContextForPrompt,
  respostaLocal,
  type CausalJuridiaContext,
} from "./causal-juridia";

const contextoVazio: CausalJuridiaContext = {
  enabled: true,
  resumo: { causasComprovadas: 0, casosComCausaAprovada: 0, filaDeRevisao: 3 },
  causasComprovadas: [],
  pedidosComprovados: [],
  dashboard: { casos: 0, evidencias: 0, fatosGeradores: 0, pendentes: 3, revisadas: 0 },
  notice: "Causas comprovadas = candidatos aprovados por revisão humana com evidência.",
};

const contextoCheio: CausalJuridiaContext = {
  enabled: true,
  resumo: { causasComprovadas: 2, casosComCausaAprovada: 4, filaDeRevisao: 0 },
  causasComprovadas: [
    { familyKey: "transporte", familyLabel: "Transporte aéreo, terrestre e turismo", claimType: "dano_moral", claimLabel: "Dano moral", casos: 2, mencoes: 2 },
    { familyKey: "credito", familyLabel: "Crédito, cobrança e negativação", claimType: "dano_material", claimLabel: "Dano material", casos: 1, mencoes: 1 },
  ],
  pedidosComprovados: [
    { claimType: "dano_moral", claimLabel: "Dano moral", casos: 3 },
    { claimType: "dano_material", claimLabel: "Dano material", casos: 2 },
  ],
  dashboard: { casos: 8, evidencias: 30, fatosGeradores: 6, pendentes: 0, revisadas: 30 },
  notice: "Menções não são mutuamente exclusivas.",
};

describe("causal-juridia (JuridIA dentro do Atlas)", () => {
  it("valida tamanho da pergunta", () => {
    expect(causaliaQuestionInput.safeParse({ question: "ab" }).success).toBe(false);
    expect(causaliaQuestionInput.safeParse({ question: "  " }).success).toBe(false);
    expect(causaliaQuestionInput.safeParse({ question: "quais as causas?" }).success).toBe(true);
    expect(causaliaQuestionInput.safeParse({ question: "x".repeat(1_001) }).success).toBe(false);
  });

  it("resposta local sem causas orienta o próximo passo", () => {
    const resposta = respostaLocal("Quais as causas mais presentes?", contextoVazio);
    expect(resposta).toContain("0 causas comprovadas");
    expect(resposta).toContain("ingeste o inteiro teor");
    expect(resposta).toContain("modo local");
  });

  it("resposta local com dados cita a família líder e a não exclusividade", () => {
    const resposta = respostaLocal("O que ensejou as indenizações por dano moral?", contextoCheio);
    expect(resposta).toContain("Transporte aéreo, terrestre e turismo");
    expect(resposta).toContain("Dano moral: 3");
    expect(resposta).toContain("não são mutuamente exclusivas");
  });

  it("contexto formatado expõe números e nota metodológica para o LLM", () => {
    const texto = formatContextForPrompt(contextoCheio);
    expect(texto).toContain("Casos no banco causal: 8");
    expect(texto).toContain("Evidências com hash de origem: 30");
    expect(texto).toContain("Transporte aéreo, terrestre e turismo | Dano moral | casos: 2 | menções: 2");
    expect(texto).toContain("Menções não são mutuamente exclusivas.");
  });

  it("limite de perguntas bloqueia acima de 20 por minuto e libera outro usuário", () => {
    const userId = Math.floor(Math.random() * 100_000) + 10_000;
    for (let i = 0; i < MAX_QUESTIONS_PER_MINUTE; i++) expect(checkRateLimit(userId)).toBe(true);
    expect(checkRateLimit(userId)).toBe(false);
    expect(checkRateLimit(userId + 1)).toBe(true);
  });
});
