import { describe, expect, it } from "vitest";
import {
  BASE_CONFIDENCE,
  CONFIDENCE_MULTI_TERM,
  CONFIDENCE_WITH_CLAIM_SIGNAL,
  MAX_EXCERPT_CHARS,
  causalFamilyLabel,
  extractCausalCandidates,
} from "./causal-extraction";

const sentencaVoo = `DISPOSITIVO: ante o exposto, julgo procedente em parte o pedido para condenar a ré.
Nos autos, o autor relata cancelamento de voo sem aviso prévio e atraso de voo na viagem de retorno,
o que lhe causou prejuízos materiais com hospedagem, buscando indenização por dano moral.`;

const sentencaCredito = `Trata-se de ação em que a autora alega inscrição indevida nos cadastros de
inadimplentes em razão de débito não contratado, além de cobrança indevida após a portabilidade.
Requer indenização por danos morais e repetição do indébito.`;

const sentencaSaude = `O autor narra negativa de cobertura de procedimento recomendado pela equipe
médica, sob plano de saúde. Alegou falha na prestação do serviço e pediu obrigação de fazer para
autorização imediata do tratamento.`;

const sentencaTransito = `Constato que o sinistro decorreu de colisão traseira entre os veículos.
O autor pleiteia reparação de danos materiais relativos ao conserto e dano moral pela perda do bem.`;

describe("Extração de candidatos causais do inteiro teor", () => {
  it("detecta fato gerador de transporte com sinal de pedido na mesma janela", () => {
    const result = extractCausalCandidates(sentencaVoo);
    const transporte = result.candidates.filter(c => c.familyKey === "transporte");
    expect(transporte.length).toBeGreaterThan(0);
    const cancelamento = transporte.find(c => c.label === "Cancelamento ou atraso de voo");
    expect(cancelamento).toBeDefined();
    // dois termos distintos (cancelamento + atraso) na mesma janela elevam à confiança multi-termo
    expect(cancelamento!.confidence).toBe(CONFIDENCE_MULTI_TERM);
    expect(cancelamento!.matchedTerms).toContain("cancelamento de voo");
    expect(cancelamento!.matchedTerms).toContain("atraso de voo");
    expect(cancelamento!.excerpt).toContain("cancelamento de voo");
    expect(cancelamento!.role).toBe("fato_gerador");
    // pedido de dano moral detectado
    const pedidoMoral = result.candidates.find(c => c.role === "pedido" && c.claimType === "dano_moral");
    expect(pedidoMoral).toBeDefined();
    expect(pedidoMoral!.label).toBe("Pedido de Dano moral");
  });

  it("normaliza acentos e maiúsculas ao casar termos", () => {
    const text = "A ré promoveu INSCRIÇÃO INDEVIDA do autor, causando apontamento indevido no mercado.";
    const result = extractCausalCandidates(text);
    const credito = result.candidates.filter(c => c.familyKey === "credito");
    expect(credito.length).toBeGreaterThan(0);
    expect(credito.some(c => c.label === "Negativação indevida")).toBe(true);
  });

  it("detecta negativação indevida e débito não contratado como crédito/cobrança", () => {
    const result = extractCausalCandidates(sentencaCredito);
    const labels = result.candidates.filter(c => c.familyKey === "credito").map(c => c.label);
    expect(labels).toContain("Negativação indevida");
    expect(labels).toContain("Cobrança indevida e débito não contratado");
    const pedidos = result.candidates.filter(c => c.role === "pedido").map(c => c.claimType);
    expect(pedidos).toContain("dano_moral");
  });

  it("detecta plano de saúde com pedido de obrigação de fazer", () => {
    const result = extractCausalCandidates(sentencaSaude);
    const servicos = result.candidates.filter(c => c.familyKey === "servicos");
    expect(servicos.length).toBeGreaterThan(0);
    const pedidoObf = result.candidates.find(c => c.role === "pedido" && c.claimType === "obrigacao_fazer");
    expect(pedidoObf).toBeDefined();
  });

  it("detecta acidente de trânsito e dano material", () => {
    const result = extractCausalCandidates(sentencaTransito);
    const transito = result.candidates.find(c => c.familyKey === "transito");
    expect(transito).toBeDefined();
    const pedidoMaterial = result.candidates.find(c => c.role === "pedido" && c.claimType === "dano_material");
    expect(pedidoMaterial).toBeDefined();
  });

  it("texto sem sinais relevantes não gera candidatos", () => {
    const result = extractCausalCandidates("Trata-se de execução fiscal. Sem manifestação das partes, citem-se os réus.");
    expect(result.candidates).toHaveLength(0);
    expect(result.occurrencesScanned).toBe(0);
  });

  it("recorta trecho limitado e preserva offsets coerentes com o texto original", () => {
    const padding = "X".repeat(500);
    const text = `${padding} O juiz reconheceu o cancelamento de voo e fixou indenização. ${padding}`;
    const result = extractCausalCandidates(text);
    const hit = result.candidates.find(c => c.label === "Cancelamento ou atraso de voo");
    expect(hit).toBeDefined();
    expect(hit!.excerpt.length).toBeLessThanOrEqual(MAX_EXCERPT_CHARS + 10);
    const sliceFromOriginal = text.slice(hit!.offsetStart, hit!.offsetEnd).toLowerCase();
    expect(sliceFromOriginal).toContain("cancelamento de voo");
  });

  it("deduplica grupo canônico e eleva confiança com múltiplos termos", () => {
    const text = "Houve cancelamento de voo e, depois, novo cancelamento de voo na mesma reserva.";
    const result = extractCausalCandidates(text);
    const grupos = result.candidates.filter(c => c.label === "Cancelamento ou atraso de voo");
    expect(grupos).toHaveLength(1);
    expect(grupos[0].matchedTerms.filter(t => t === "cancelamento de voo").length).toBe(2);
    expect(grupos[0].confidence).toBeGreaterThan(BASE_CONFIDENCE);
  });

  it("rótulo de família tem fallback seguro", () => {
    expect(causalFamilyLabel(null)).toContain("Outros");
    expect(causalFamilyLabel("transito")).toContain("trânsito");
    expect(causalFamilyLabel("inexistente")).toContain("Outros");
  });

  it("não extrai candidato de fato gerador a partir do cabeçalho de metadados do PJe", () => {
    // Falso positivo real observado no piloto PJe: "ASSUNTO: [Inadimplemento]"
    // no cabeçalho do documento gerava candidato de dano_moral sem narrativa causal.
    const inteiroTeorHomologacao = `PODER JUDICIÁRIO DO ESTADO DE MINAS GERAIS

Comarca de Três Corações / Unidade Jurisdicional da Comarca de Três Corações

PROCESSO Nº: 0913965-29.2009.8.13.0693
CLASSE: [CÍVEL] PROCEDIMENTO DO JUIZADO ESPECIAL CÍVEL (436)
ASSUNTO: [Inadimplemento]
AUTOR: (nome suprimido)
RÉU: BANCO SANTANDER (BRASIL) S.A.

SENTENÇA

Vistos, etc. Trata-se de ação manejada pela parte autora em face do banco réu.
As partes noticiaram a celebração de acordo, conforme petições protocoladas nos autos.
Diante do exposto, HOMOLOGO O ACORDO, JULGANDO EXTINTO O FEITO com resolução do mérito.
P.R.I. Arquivando-se, oportunamente.`;
    const result = extractCausalCandidates(inteiroTeorHomologacao);
    const fatos = result.candidates.filter(c => c.role === "fato_gerador");
    expect(fatos).toHaveLength(0);
    // Descartes por cabeçalho devem ser registrados para auditoria do detector.
    expect(result.candidatesDropped).toBeGreaterThan(0);
  });
});
