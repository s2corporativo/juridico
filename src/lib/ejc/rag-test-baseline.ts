/**
 * Linha de base dos testes de recuperação (RAG) — Jurimetria DPT.
 *
 * Regenerada a partir das execuções persistidas na tabela RagTest
 * (execuções de auditoria com score 100% — retrieval top-8).
 * Regra de recorte: documentos com score >= 55% do topo (mín. 3, máx. 6).
 * Função: teste de regressão — garante que a recuperação continua
 * encontrando os documentos âncora de cada pergunta padrão.
 * Revisão 2026-09-01 (LOTE-032): na pergunta do tempo médio JEC/BH removidas as
 * expectativas tangenciais (lei-12153 competência Fazenda; sumula-376 MS) —
 * âncoras reais da pergunta são os docs jurimetria-jec-* (crowd-out legítimo
 * dos novos retratos DataJud de varas/cidades).
 */

export interface PerguntaPadrao {
  pergunta: string;
  esperados: string[];
}

export const PERGUNTAS_PADRAO: PerguntaPadrao[] = [
  {
    "pergunta": "Qual o prazo para compensação de créditos tributários na Lei 9.430?",
    "esperados": [
      "l9430-art-74-compensacao",
      "prazo-compensacao-30-360-dias",
      "fluxo-compensacao-tributaria",
      "adin-4296-stf-mandado-seguranca",
      "tese-ms-liminar-compensacao-creditos-possivel",
      "prazo-prescricao-tributaria-5-anos"
    ]
  },
  {
    "pergunta": "Como funciona a transação tributária da Lei 13.988?",
    "esperados": [
      "peca-pedido-transacao-tributaria",
      "l13988-arts-1-5-transacao",
      "fluxo-transacao-tributaria",
      "ctn-arts-96-112-legislacao-tributaria"
    ]
  },
  {
    "pergunta": "Quando a anterioridade tributária é aplicável?",
    "esperados": [
      "doutrina-anterioridade-tributaria-aplicacao",
      "ctn-arts-96-112-legislacao-tributaria",
      "l13988-arts-1-5-transacao",
      "fluxo-transacao-tributaria",
      "sumula-297-stj-cdc-instituicoes-financeiras",
      "peca-pedido-transacao-tributaria"
    ]
  },
  {
    "pergunta": "Qual a competência para instituir o ICMS?",
    "esperados": [
      "cf-art-155-icms-impostos-estaduais",
      "triagem-servico-tributavel-conflito",
      "doutrina-guerra-fiscal-conflito-icms-iss",
      "prazo-credito-icms-5-anos",
      "cf-art-156-iss-impostos-municipais",
      "ctn-arts-1-11-competencia-tributaria"
    ]
  },
  {
    "pergunta": "O Simples Nacional alcança quais contribuintes?",
    "esperados": [
      "doutrina-simples-nacional-alcance",
      "lc123-arts-13-17-simples-alcance",
      "lei-6938-1981-pnma-responsabilidade-objetiva"
    ]
  },
  {
    "pergunta": "Qual o prazo prescricional do crédito de ICMS?",
    "esperados": [
      "prazo-credito-icms-5-anos",
      "fluxo-processo-administrativo-fiscal-estadual",
      "prazo-prescricao-tributaria-5-anos",
      "lc87-art23-25-observacoes",
      "prazo-prescricao-revisional-bancaria-10-anos",
      "lc24-convenios-icms"
    ]
  },
  {
    "pergunta": "Quais os fundamentos das medidas cautelares no CPP?",
    "esperados": [
      "doutrina-prisoes-cautelares-panorama",
      "cpp-arts-282-283-cautelares-fundamentos",
      "cpp-arts-310-317-flagrante-custodia"
    ]
  },
  {
    "pergunta": "Como funciona o flagrante e a custódia no CPP?",
    "esperados": [
      "prazo-custodia-24h-cpp",
      "cpp-arts-310-317-flagrante-custodia",
      "doutrina-prisoes-cautelares-panorama",
      "fluxo-flagrante-a-decisao-liberdade"
    ]
  },
  {
    "pergunta": "Como defender em furto de pequeno valor no JECrim — princípio da insignificância?",
    "esperados": [
      "tese-furto-menor-potencial-ofensivo-jecrim",
      "lei12153-art9-13-cumprimento-pagamento",
      "argumentacao-bilateral-jec-fazenda"
    ]
  },
  {
    "pergunta": "Quando cabe liberdade provisória após flagrante?",
    "esperados": [
      "peca-liberdade-provisoria-flagrante",
      "fluxo-flagrante-a-decisao-liberdade",
      "prazo-reclamacao-trabalhista-2-anos"
    ]
  },
  {
    "pergunta": "Quais os crimes contra a honra no Código Penal arts. 138 a 140 (calúnia, difamação, injúria)?",
    "esperados": [
      "cp-arts-138-140-honra-texto-literal",
      "doutrina-honra-online-digital",
      "tese-crimes-consumidor-cdc-cp"
    ]
  },
  {
    "pergunta": "Qual o prazo de decadência para vício aparente no CDC?",
    "esperados": [
      "prazo-cdc-reclamacao-vicios-30-90-dias",
      "cdc-art-26-decadencia-vicios-texto-literal",
      "regra-se-vicio-consumidor-prazos",
      "cc-arts-207-210-decadencia",
      "checklist-verificacao-prescricao",
      "doutrina-vicio-vs-fato-consumidor"
    ]
  },
  {
    "pergunta": "Qual o prazo de suspensão das ações e execuções na recuperação judicial (stay period)?",
    "esperados": [
      "l11101-arts-5-6",
      "prazos-rj-consolidado-l11101",
      "sumula-150-stf-prescricao-execucao",
      "l11101-art-20",
      "l11101-arts-7-8",
      "l11101-art-50"
    ]
  },
  {
    "pergunta": "Quais os meios de recuperação judicial previstos na Lei 11.101?",
    "esperados": [
      "l11101-art-50",
      "l11101-art-20",
      "l11101-arts-1-2",
      "l11101-arts-7-8",
      "prazos-rj-consolidado-l11101",
      "l11101-arts-21-22"
    ]
  },
  {
    "pergunta": "O que verificar antes de ajuizar uma recuperação judicial (admissibilidade da petição)?",
    "esperados": [
      "checklist-rj-admissibilidade-peticao",
      "fluxo-rj-peticao-conclusao",
      "peca-rj-peticao-inicial-modelo-variaveis",
      "l11101-art-20",
      "l11101-arts-1-2",
      "l11101-art-50"
    ]
  },
  {
    "pergunta": "O que fazer diante de cobrança de dívida indevida?",
    "esperados": [
      "cc-arts-939-941-cobranca-indevida-penas",
      "doutrina-cobranca-indevida-panorama",
      "tese-repeticao-indebito-dobro-bancario"
    ]
  },
  {
    "pergunta": "Quais as alternativas do consumidor no vício do produto?",
    "esperados": [
      "cdc-art-18-vicio-produto-texto-literal",
      "regra-se-vicio-consumidor-prazos",
      "argumentacao-vicio-produto-dois-lados",
      "tese-vicio-produto-alternativas-30-dias",
      "peca-reclamacao-vicio-produto",
      "fluxo-reclamacao-vicio-produto"
    ]
  },
  {
    "pergunta": "Como reclamar por vício de serviço no CDC?",
    "esperados": [
      "cdc-art-26-decadencia-vicios-texto-literal",
      "cdc-art-20-vicio-servico-texto-literal",
      "cdc-art21-componentes-originais",
      "doutrina-vicio-vs-fato-consumidor",
      "cdc-art-27-fato-produto-5-anos",
      "cdc-art-14-fato-servico-texto-literal"
    ]
  },
  {
    "pergunta": "Como ajuizar ação por vício do produto?",
    "esperados": [
      "argumentacao-vicio-produto-dois-lados",
      "doutrina-vicio-vs-fato-consumidor",
      "cdc-art-18-vicio-produto-texto-literal",
      "peca-reclamacao-vicio-produto",
      "fluxo-reclamacao-vicio-produto",
      "tese-vicio-produto-alternativas-30-dias"
    ]
  },
  {
    "pergunta": "Qual o tempo médio de processo no Juizado Especial de Belo Horizonte?",
    "esperados": [
      "jurimetria-jec-visao-geral-bh-betim-2025-2026",
      "lei9099-art62-63-criterios-competencia",
      "sumula-203-stj-sem-resp-contra-turma-recursal",
      "jurimetria-jec-unidades-judiciarias"
    ]
  },
  {
    "pergunta": "Quais os requisitos de admissibilidade do recurso inominado?",
    "esperados": [
      "regra-se-recurso-inominado-admissibilidade",
      "checklist-admissibilidade-recurso-inominado",
      "peca-recurso-inominado-modelo-jec",
      "sumula-7-tu-tjdft-agravo-recurso-inominado",
      "checklist-admissibilidade-recursal",
    ]
  },
  {
    "pergunta": "Qual o prazo e o preparo do recurso inominado no JEC?",
    "esperados": [
      "prazo-jec-10-48-despachos-literais",
      "lei-9099-arts-41-43-recurso-inominado",
      "fluxo-jec-pedido-a-execucao",
      "prazo-recurso-inominado-jec-10-dias-uteis",
      "prazo-jec-preparo-recurso-48-horas",
      "peca-recurso-inominado-modelo-jec"
    ]
  },
  {
    "pergunta": "Como executar sentença do Juizado Especial?",
    "esperados": [
      "sumula-203-stj-sem-resp-contra-turma-recursal",
      "sumula-376-stj-ms-contra-ato-turma-recursal",
      "lei9099-art62-63-criterios-competencia",
      "lei-12153-jec-fazenda-publica-competencia",
      "sumula-640-stf-cabe-re-turma-recursal",
      "peca-execucao-sentenca-jec"
    ]
  },
  {
    "pergunta": "Quais os princípios dos Juizados Especiais?",
    "esperados": [
      "lei-9099-arts-1-2-principios",
      "sumula-41-tu-tjdft-sem-honorarios-recursais-agravo",
      "sumula-203-stj-sem-resp-contra-turma-recursal",
      "cf-art-98-i-juizados-especiais",
      "doutrina-tres-regimes-jec-estadual-federal-fazenda",
      "sumula-25-tu-tjdft-ms-turma-recursal-competencia"
    ]
  },
  {
    "pergunta": "Qual o prazo geral de prescrição civil?",
    "esperados": [
      "tabela-prazos-prescricao-civil",
      "cc-art-206-a-prescricao-intercorrente",
      "cc-art-206-prazos-especiais",
      "sumula-150-stf-prescricao-execucao",
      "cc-art-202-interrompem-prescricao",
      "jurimetria-vazia-prescricao-civil"
    ]
  },
  {
    "pergunta": "Quais as hipóteses de interrupção da prescrição no Código Civil art. 202?",
    "esperados": [
      "cc-art-202-interrompem-prescricao",
      "cc-arts-1243-1244-acessao-e-aplicacao-prescricao",
      "prazo-reparacao-civil-3-anos",
      "tabela-prazos-prescricao-civil",
      "jurimetria-vazia-prescricao-civil",
      "cc-art-206-a-prescricao-intercorrente"
    ]
  },
  {
    "pergunta": "Como diagnosticar prescrição e decadência no caso concreto?",
    "esperados": [
      "doutrina-prescricao-vs-decadencia",
      "regra-se-prescricao-decadencia-diagnostico",
      "ctn-decadencia-prescricao-tributaria",
      "jurimetria-vazia-prescricao-civil",
      "checklist-verificacao-prescricao",
      "tese-ai-decaencia-prescricao-apuracao"
    ]
  },
  {
    "pergunta": "Quais os tipos de doação no Código Civil?",
    "esperados": [
      "prazo-reparacao-civil-3-anos",
      "cc-arts-538-540-doacao-conceito-aceitacao-tipos",
      "cc-arts-541-543-forma-aceitacao-incapazes",
      "cc-art-544-doacao-adiantamento-heranca",
      "cc-arts-545-546-subvencao-doacao-casamento",
      "cc-arts-547-548-reversao-nulidade-todos-bens"
    ]
  },
  {
    "pergunta": "Como defender de busca e apreensão por alienação fiduciária?",
    "esperados": [
      "stj-2020-consolidacao-nao-extingue-contrato-fiduciario",
      "tese-defesa-busca-apreensao-alienacao-fiduciaria",
      "regra-se-busca-apreensao-fiduciaria",
      "cc-arts-1361-1365-alienacao-fiduciaria-moveis",
      "peca-defesa-busca-apreensao-modelo",
      "dl-911-1969-art-3-busca-apreensao"
    ]
  },
  {
    "pergunta": "Qual o prazo de purgação da mora fiduciária?",
    "esperados": [
      "lei-9514-art-26-purgacao-mora-consolidacao-imovel",
      "tese-defesa-busca-apreensao-alienacao-fiduciaria",
      "prazo-purgacao-mora-fiduciaria-5-dias",
      "peca-defesa-busca-apreensao-modelo",
      "dl-911-1969-art-3-busca-apreensao"
    ]
  },
  {
    "pergunta": "Como funciona a execução extrajudicial do imóvel fiduciário?",
    "esperados": [
      "fluxo-execucao-extrajudicial-imovel-9514",
      "lei-9514-art-27-leilao-alienacao-imovel",
      "lei-9099-arts-52-55-execucao-custas"
    ]
  },
  {
    "pergunta": "Quais os requisitos da tutela de urgência?",
    "esperados": [
      "cpc-2015-art-300-tutela-urgencia",
      "tese-agravabilidade-fora-do-rol-urgencia",
      "tema-988-stj-taxatividade-mitigada-rol-1015"
    ]
  },
  {
    "pergunta": "Qual o prazo de contestação no CPC?",
    "esperados": [
      "prazo-possessoria-citacao-15-dias-liminar",
      "prazo-embargos-declaracao-cpc-5-dias",
      "prazo-contestacao-cpc-15-dias-uteis",
      "prazo-agravo-instrumento-15-dias",
      "prazo-pagamento-voluntario-15-dias",
      "prazo-citacao-denunciado-chamado-30-dias"
    ]
  },
  {
    "pergunta": "Quando cabe agravo de instrumento e qual o prazo?",
    "esperados": [
      "prazo-juntada-copia-origem-3-dias",
      "sumula-7-tu-tjdft-agravo-recurso-inominado",
      "prazo-agravo-instrumento-15-dias",
      "fluxo-agravo-instrumento",
      "cpc-art-1015-cabimento-agravo-texto-atual",
      "doutrina-taxatividade-mitigada"
    ]
  },
  {
    "pergunta": "Qual o prazo dos embargos de declaração?",
    "esperados": [
      "prazo-embargos-declaracao-cpc-5-dias",
      "prazo-jecrim-apelacao-embargos-10-5-dias",
      "cpc-arts-1022-1026-embargos-declaracao",
      "prazo-contrarrazoes-resposta-recursos-15-dias",
      "cpc-arts-1003-1007-prazo-preparo",
      "prazo-embargos-lef-30-dias"
    ]
  },
  {
    "pergunta": "Qual o prazo de defesa contra auto de infração ambiental?",
    "esperados": [
      "prazo-defesa-ai-ambiental-20-dias",
      "peca-defesa-administrativa-ambiental",
      "tese-ai-nulidade-formal",
      "regra-se-ai-ambiental",
      "triagem-ai-ambiental",
      "fluxo-ai-ambiental"
    ]
  },
  {
    "pergunta": "Qual o prazo para ajuizar reclamação trabalhista?",
    "esperados": [
      "prazo-reclamacao-trabalhista-2-anos",
      "peca-reclamacao-trabalhista-modelo-variaveis",
      "fluxo-reclamatoria-trabalhista-comum",
      "clt-art-477-verbas-rescisorias-multas",
      "clt-arts-840-841-reclamacao-notificacao"
    ]
  },
  {
    "pergunta": "Quais as bases legais do tratamento de dados pessoais?",
    "esperados": [
      "lgpd-art-7-bases-legais-texto-literal",
      "lgpd-art-11-dados-sensiveis-hipoteses",
      "lgpd-art-6-principios-tratamento",
      "lgpd-13709-2018-ficha"
    ]
  },
  {
    "pergunta": "Qual a metodologia da jurimetria no EJC?",
    "esperados": [
      "jurimetria-metodologia-ejc",
      "jurimetria-jec-metodologia-fontes-limitacoes",
      "jurimetria-vazia-consumidor-28"
    ]
  }
];
