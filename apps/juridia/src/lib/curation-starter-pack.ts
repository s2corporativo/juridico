/** Pacote inicial de modelos de análise para curadoria supervisionada.
 * Conteúdo não validado como orientação jurídica; nunca aprovar por script.
 * Referências oficiais concretas devem ser anexadas e verificadas por revisor.
 */
export type CuratedDraft = {
  area: string; slug: string; title: string; keywords: string[]; focus: string;
};
export const CURATION_STARTER_PACK: readonly CuratedDraft[] = [
  {
    "area": "consumidor",
    "slug": "nucleo-fraude-pix",
    "title": "Fraude Pix e transferência contestada",
    "keywords": [
      "fraude pix",
      "transferencia indevida",
      "golpe pix"
    ],
    "focus": "Comprovação da operação, canais de contestação, comunicação ao banco e cronologia; verificar mecanismo de devolução sem presumir resultado."
  },
  {
    "area": "consumidor",
    "slug": "nucleo-perfil-falso",
    "title": "Perfil falso em redes sociais",
    "keywords": [
      "perfil falso",
      "conta fake",
      "identidade falsa"
    ],
    "focus": "Prova do perfil e URL, prints com contexto, comunicação à plataforma, danos e atribuição de autoria."
  },
  {
    "area": "consumidor",
    "slug": "nucleo-cobranca-indevida",
    "title": "Cobrança indevida e repetição",
    "keywords": [
      "cobranca indevida",
      "debito indevido",
      "pagamento duplicado"
    ],
    "focus": "Origem da cobrança, contrato, pagamento, protestos, respostas e eventuais exceções."
  },
  {
    "area": "consumidor",
    "slug": "nucleo-negativacao",
    "title": "Inscrição em cadastro restritivo",
    "keywords": [
      "negativacao indevida",
      "restricao credito",
      "serasa"
    ],
    "focus": "Notificação, legitimidade da dívida, data e causa da anotação, registros preexistentes."
  },
  {
    "area": "consumidor",
    "slug": "nucleo-vicio-produto",
    "title": "Vício de produto e garantia",
    "keywords": [
      "vicio do produto",
      "produto defeituoso",
      "garantia"
    ],
    "focus": "Nota fiscal, datas, tentativas de reparo, oferta, garantia aplicável e destino do produto."
  },
  {
    "area": "consumidor",
    "slug": "nucleo-cancelamento-servico",
    "title": "Cancelamento de serviço e cobrança",
    "keywords": [
      "cancelamento contrato",
      "servico cancelado",
      "cobranca posterior"
    ],
    "focus": "Solicitação, protocolo, cláusulas, prestação efetiva, multas e faturamentos posteriores."
  },
  {
    "area": "digital",
    "slug": "nucleo-dados-pessoais",
    "title": "Exercício de direitos de dados pessoais",
    "keywords": [
      "dados pessoais",
      "lgpd",
      "eliminacao de dados"
    ],
    "focus": "Papel de controlador/operador, titularidade, bases legais, finalidade e hipóteses de retenção."
  },
  {
    "area": "digital",
    "slug": "nucleo-vazamento",
    "title": "Incidente de segurança de dados",
    "keywords": [
      "vazamento dados",
      "incidente seguranca",
      "exposicao dados"
    ],
    "focus": "Natureza da exposição, medidas de contenção, prova do incidente, riscos e comunicação exigível."
  },
  {
    "area": "civil",
    "slug": "nucleo-dano-material",
    "title": "Danos materiais e reparação",
    "keywords": [
      "dano material",
      "prejuizo financeiro",
      "reparacao"
    ],
    "focus": "Nexo, valor, documentos do prejuízo, mitigação e causas alternativas."
  },
  {
    "area": "civil",
    "slug": "nucleo-dano-moral",
    "title": "Análise de dano extrapatrimonial",
    "keywords": [
      "dano moral",
      "ofensa honra",
      "abalo moral"
    ],
    "focus": "Conduta, contexto, lesão, nexo e parâmetros de proporcionalidade; não presumir dano."
  },
  {
    "area": "civil",
    "slug": "nucleo-inadimplemento",
    "title": "Inadimplemento contratual",
    "keywords": [
      "descumprimento contratual",
      "inadimplemento",
      "multa contratual"
    ],
    "focus": "Contrato, obrigações, termo, comunicações, mora, exceções e medidas de mitigação."
  },
  {
    "area": "civil",
    "slug": "nucleo-tutela-urgencia",
    "title": "Tutela de urgência",
    "keywords": [
      "tutela urgencia",
      "liminar",
      "risco dano"
    ],
    "focus": "Probabilidade, risco concreto, reversibilidade, provas e contraditório."
  },
  {
    "area": "civil",
    "slug": "nucleo-prescricao",
    "title": "Prescrição e decadência",
    "keywords": [
      "prescricao",
      "decadencia",
      "prazo prescricional"
    ],
    "focus": "Marco inicial, causas de interrupção/suspensão, natureza da pretensão e calendário."
  },
  {
    "area": "civil",
    "slug": "nucleo-prova-documental",
    "title": "Organização de prova documental",
    "keywords": [
      "prova documental",
      "documentos probatorios",
      "cadeia documental"
    ],
    "focus": "Autenticidade, origem, integridade, cronologia, pertinência e lacunas."
  },
  {
    "area": "trabalhista",
    "slug": "nucleo-horas-extras",
    "title": "Jornada e horas extras",
    "keywords": [
      "horas extras",
      "jornada excedente",
      "cartao ponto"
    ],
    "focus": "Controles de jornada, banco de horas, convenção coletiva, cargo e cálculos alternativos."
  },
  {
    "area": "trabalhista",
    "slug": "nucleo-rescisao-indireta",
    "title": "Hipóteses de rescisão indireta",
    "keywords": [
      "rescisao indireta",
      "descumprimento empregador",
      "faltas patronais"
    ],
    "focus": "Fatos, gravidade, reiteração, continuidade contratual, provas e soluções alternativas."
  },
  {
    "area": "trabalhista",
    "slug": "nucleo-verbas-rescisorias",
    "title": "Verbas rescisórias",
    "keywords": [
      "verbas rescisorias",
      "termino contrato trabalho",
      "acerto rescisao"
    ],
    "focus": "Modalidade da ruptura, remuneração, datas, documentos, descontos e parcelas controvertidas."
  },
  {
    "area": "trabalhista",
    "slug": "nucleo-assedio",
    "title": "Assédio moral no trabalho",
    "keywords": [
      "assedio moral",
      "humilhacao trabalho",
      "perseguicao trabalho"
    ],
    "focus": "Condutas, frequência, autoria, prova, danos, testemunhos e deveres de cautela."
  },
  {
    "area": "trabalhista",
    "slug": "nucleo-adicional-insalubridade",
    "title": "Adicional de insalubridade",
    "keywords": [
      "insalubridade",
      "agente nocivo",
      "pericia trabalho"
    ],
    "focus": "Exposição, intensidade, habitualidade, EPI, laudos, enquadramento e necessidade de perícia."
  },
  {
    "area": "tributario",
    "slug": "nucleo-cda",
    "title": "Nulidades e defesa contra CDA",
    "keywords": [
      "certidao divida ativa",
      "execucao fiscal",
      "cda tributaria"
    ],
    "focus": "Origem do crédito, lançamento, notificação, requisitos formais, prescrição e garantia."
  },
  {
    "area": "tributario",
    "slug": "nucleo-mei-desenquadramento",
    "title": "Desenquadramento do MEI",
    "keywords": [
      "desenquadramento mei",
      "limite faturamento mei",
      "simples nacional"
    ],
    "focus": "Receita documentada, período, notificação, tributo envolvido, regime e competências fiscais."
  },
  {
    "area": "tributario",
    "slug": "nucleo-icms",
    "title": "Auto de infração de ICMS",
    "keywords": [
      "auto infracao icms",
      "icms nao declarado",
      "fiscalizacao"
    ],
    "focus": "Fato gerador, operações, provas fiscais, competência, intimação, lançamento e multa."
  },
  {
    "area": "tributario",
    "slug": "nucleo-itbi",
    "title": "Base de cálculo do ITBI",
    "keywords": [
      "itbi",
      "valor venal referencia",
      "transmissao imobiliaria"
    ],
    "focus": "Negócio, avaliação, procedimento administrativo, município e fontes atuais."
  },
  {
    "area": "tributario",
    "slug": "nucleo-repeticao",
    "title": "Restituição de tributos",
    "keywords": [
      "repeticao indebito",
      "tributo pago indevido",
      "compensacao tributaria"
    ],
    "focus": "Pagamentos, contribuinte legitimado, fato gerador, prazo, procedimento e cálculo."
  },
  {
    "area": "penal",
    "slug": "nucleo-habeas-corpus",
    "title": "Habeas corpus e constrangimento",
    "keywords": [
      "habeas corpus",
      "prisao ilegal",
      "liberdade locomocao"
    ],
    "focus": "Ato coator, autoridade, decisão impugnada, atualidade da coação e documentos integrais."
  },
  {
    "area": "penal",
    "slug": "nucleo-trafico-privilegiado",
    "title": "Exame do redutor no tráfico",
    "keywords": [
      "trafico privilegiado",
      "artigo 33 paragrafo 4",
      "lei drogas"
    ],
    "focus": "Dados pessoais relevantes nos autos, dedicação criminosa, organização, prova e fundamentação judicial."
  },
  {
    "area": "penal",
    "slug": "nucleo-cadeia-custodia",
    "title": "Cadeia de custódia de provas",
    "keywords": [
      "cadeia custodia",
      "apreensao prova",
      "vestigio"
    ],
    "focus": "Coleta, lacres, armazenamento, transportes, peritos e consequências verificáveis."
  },
  {
    "area": "penal",
    "slug": "nucleo-resposta-acusacao",
    "title": "Resposta à acusação",
    "keywords": [
      "resposta acusacao",
      "defesa preliminar",
      "citacao penal"
    ],
    "focus": "Denúncia, recebimento, provas, preliminares, teses e prazos pelo rito correto."
  },
  {
    "area": "previdenciario",
    "slug": "nucleo-beneficio-incapacidade",
    "title": "Benefício por incapacidade",
    "keywords": [
      "beneficio incapacidade",
      "auxilio incapacidade",
      "pericia inss"
    ],
    "focus": "Qualidade de segurado, carência, laudos, atividade habitual, datas e perícia."
  },
  {
    "area": "previdenciario",
    "slug": "nucleo-aposentadoria",
    "title": "Planejamento previdenciário",
    "keywords": [
      "aposentadoria",
      "tempo contribuicao",
      "ctps inss"
    ],
    "focus": "CNIS, períodos, indicadores, regras de transição, simulações e documentos."
  },
  {
    "area": "previdenciario",
    "slug": "nucleo-bpc",
    "title": "Benefício assistencial BPC",
    "keywords": [
      "beneficio assistencial",
      "bpc loas",
      "cadunico"
    ],
    "focus": "Composição familiar, condição pertinente, renda, documentação e avaliação administrativa."
  },
  {
    "area": "ambiental",
    "slug": "nucleo-licenciamento",
    "title": "Licenciamento ambiental empresarial",
    "keywords": [
      "licenciamento ambiental",
      "licenca ambiental",
      "empreendimento ambiental"
    ],
    "focus": "Atividade, localização, porte, impactos, competência, condicionantes e validade."
  },
  {
    "area": "ambiental",
    "slug": "nucleo-auto-infracao",
    "title": "Defesa em auto ambiental",
    "keywords": [
      "auto infracao ambiental",
      "multa ambiental",
      "embargo ambiental"
    ],
    "focus": "Competência, materialidade, autoria, relatórios, ciência, prazo e documentação ambiental."
  },
  {
    "area": "ambiental",
    "slug": "nucleo-residuos",
    "title": "Gestão e transporte de resíduos",
    "keywords": [
      "residuos solidos",
      "manifesto transporte residuos",
      "destinacao residuos"
    ],
    "focus": "Classificação, geradores, transportadores, licenças, documentos de transporte e destinação."
  },
  {
    "area": "administrativo",
    "slug": "nucleo-licitacoes",
    "title": "Impugnação de edital",
    "keywords": [
      "impugnacao edital",
      "licitacao",
      "habilitacao certame"
    ],
    "focus": "Edital, objeto, regras de participação, vinculação, competitividade e prazos."
  },
  {
    "area": "administrativo",
    "slug": "nucleo-sancoes",
    "title": "Defesa em processo sancionador",
    "keywords": [
      "processo administrativo sancionador",
      "multa administrativa",
      "contraditorio"
    ],
    "focus": "Competência, tipicidade, prova, proporcionalidade, motivação e oportunidade de defesa."
  },
  {
    "area": "empresarial",
    "slug": "nucleo-contratos-societarios",
    "title": "Revisão de contrato empresarial",
    "keywords": [
      "contrato empresarial",
      "clausula contratual",
      "obrigacoes societarias"
    ],
    "focus": "Partes, representação, obrigações, garantias, inadimplemento, conflitos e execução."
  },
  {
    "area": "empresarial",
    "slug": "nucleo-cobranca-b2b",
    "title": "Cobrança empresarial",
    "keywords": [
      "cobranca empresarial",
      "titulo executivo",
      "inadimplencia cliente"
    ],
    "focus": "Documento constitutivo, valor, juros, vencimento, protesto, defesas e recuperação."
  },
  {
    "area": "familia",
    "slug": "nucleo-alimentos",
    "title": "Fixação e revisão de alimentos",
    "keywords": [
      "pensao alimenticia",
      "revisao alimentos",
      "necessidade possibilidade"
    ],
    "focus": "Necessidades, capacidade, prova de renda, proporcionalidade e fatos supervenientes."
  },
  {
    "area": "familia",
    "slug": "nucleo-guarda",
    "title": "Guarda e convivência",
    "keywords": [
      "guarda compartilhada",
      "regulamentacao visitas",
      "convivencia familiar"
    ],
    "focus": "Interesse de crianças, rotina, rede de apoio, situações de risco e evidências."
  }
];
