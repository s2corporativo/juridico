import { PrismaClient } from "@prisma/client";
import { createHash } from "node:crypto";

/**
 * 50 PROPOSTAS, não aprovações: não são jurisprudência, parecer jurídico nem
 * conteúdo pronto para geração. Exigem reivindicação e dupla revisão humana.
 * Nunca conecte este comando a produção. Use somente uma base de homologação.
 */
const groups = [
  {
    "area": "consumidor",
    "source": "https://planalto.gov.br/ccivil_03/leis/l8078compilado.htm",
    "topics": [
      [
        "cobranca-indevida",
        "Cobrança indevida e repetição de indébito",
        "cobranca indevida|devolucao em dobro"
      ],
      [
        "fraude-pix",
        "Fraude em transferências e dever de informação",
        "fraude pix|transferencia indevida"
      ],
      [
        "perfil-falso",
        "Uso indevido de identidade digital de empresa",
        "perfil falso|conta falsa"
      ],
      [
        "vicio-produto",
        "Vício em produto ou serviço",
        "vicio do produto|garantia legal"
      ],
      [
        "superendividamento",
        "Tratamento do superendividamento",
        "superendividamento|repactuacao"
      ]
    ]
  },
  {
    "area": "civil",
    "source": "https://planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105compilada.htm",
    "topics": [
      [
        "tutela-urgencia",
        "Requisitos de tutela de urgência",
        "tutela de urgencia|liminar"
      ],
      [
        "prova-documental",
        "Organização de prova documental",
        "prova documental|documentos probatorios"
      ],
      [
        "obrigacao-fazer",
        "Cumprimento de obrigação de fazer",
        "obrigacao de fazer|cumprimento"
      ],
      [
        "responsabilidade-civil",
        "Elementos da pretensão indenizatória",
        "responsabilidade civil|indenizacao"
      ],
      [
        "recurso-apelacao",
        "Planejamento de recurso de apelação",
        "apelacao|recurso civel"
      ]
    ]
  },
  {
    "area": "trabalhista",
    "source": "https://planalto.gov.br/ccivil_03/decreto-lei/del5452compilado.htm",
    "topics": [
      [
        "jornada",
        "Controle de jornada e horas extras",
        "horas extras|jornada de trabalho"
      ],
      [
        "verbas-rescisorias",
        "Verbas rescisórias e documentos",
        "verbas rescisorias|rescisao contratual"
      ],
      [
        "vinculo",
        "Elementos da relação de emprego",
        "vinculo empregaticio|relacao de emprego"
      ],
      [
        "insalubridade",
        "Prova de exposição a agentes nocivos",
        "insalubridade|pericia trabalhista"
      ],
      [
        "prova-trabalhista",
        "Matriz documental e testemunhal",
        "prova testemunhal|prova trabalhista"
      ]
    ]
  },
  {
    "area": "penal",
    "source": "https://www.planalto.gov.br/ccivil_03/decreto-lei/del3689compilado.htm",
    "topics": [
      [
        "habeas-corpus",
        "Identificação de constrangimento ilegal em HC",
        "habeas corpus|constrangimento ilegal"
      ],
      [
        "prisao-preventiva",
        "Exame de fundamentos da prisão preventiva",
        "prisao preventiva|revogacao de prisao"
      ],
      [
        "custodia",
        "Conferência de audiência de custódia",
        "audiencia de custodia|prisao em flagrante"
      ],
      [
        "resposta-acusacao",
        "Estrutura de resposta à acusação",
        "resposta a acusacao|denuncia criminal"
      ],
      [
        "prova-ilicita",
        "Revisão da licitude de elementos probatórios",
        "prova ilicita|cadeia de custodia"
      ]
    ]
  },
  {
    "area": "digital",
    "source": "https://planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm",
    "topics": [
      [
        "dados-titular",
        "Direitos do titular de dados",
        "direitos do titular|dados pessoais"
      ],
      [
        "incidente-seguranca",
        "Análise preliminar de incidente com dados",
        "incidente de seguranca|vazamento de dados"
      ],
      [
        "base-legal",
        "Verificação de base legal do tratamento",
        "base legal|tratamento de dados"
      ],
      [
        "correcao-dados",
        "Retificação e eliminação de dados pessoais",
        "correcao dos dados|exclusao de dados"
      ],
      [
        "privacidade",
        "Adequação de avisos de privacidade",
        "aviso de privacidade|politica de privacidade"
      ]
    ]
  },
  {
    "area": "ambiental",
    "source": "https://planalto.gov.br/ccivil_03/leis/l9605.htm",
    "topics": [
      [
        "auto-infracao",
        "Exame de auto de infração ambiental",
        "auto de infracao ambiental|autuacao ambiental"
      ],
      [
        "licenciamento",
        "Verificação de obrigações e licenças",
        "licenciamento ambiental|licenca ambiental"
      ],
      [
        "prova-tecnica",
        "Prova técnica em dano ambiental",
        "pericia ambiental|dano ambiental"
      ],
      [
        "responsabilizacao",
        "Diferenciação de responsabilizações ambientais",
        "responsabilidade ambiental|infracao ambiental"
      ],
      [
        "reparacao",
        "Medidas de reparação do dano ambiental",
        "recuperacao ambiental|reparacao ambiental"
      ]
    ]
  },
  {
    "area": "civil",
    "source": "https://www.planalto.gov.br/ccivil_03/leis/l9099.htm",
    "topics": [
      [
        "jec-competencia",
        "Competência e limites do Juizado Especial Cível",
        "juizado especial civel|competencia jec"
      ],
      [
        "jec-conciliacao",
        "Preparação de audiência de conciliação no JEC",
        "audiencia conciliacao jec|acordo jec"
      ],
      [
        "jec-provas",
        "Prova adequada à menor complexidade no JEC",
        "prova jec|audiencia instrucao jec"
      ],
      [
        "jec-recurso",
        "Verificação de recurso inominado",
        "recurso inominado|recurso jec"
      ],
      [
        "jec-execucao",
        "Acompanhamento do cumprimento no JEC",
        "cumprimento de sentenca jec|execucao jec"
      ]
    ]
  },
  {
    "area": "tributario",
    "source": "https://planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105compilada.htm",
    "topics": [
      [
        "cda",
        "Revisão formal de título executivo fiscal",
        "certidao divida ativa|cda"
      ],
      [
        "execucao-fiscal",
        "Mapa processual da execução fiscal",
        "execucao fiscal|cobranca tributaria"
      ],
      [
        "excecao",
        "Análise de exceção de pré-executividade",
        "excecao pre executividade|execucao fiscal"
      ],
      [
        "itbi",
        "Organização probatória sobre base do ITBI",
        "itbi|base de calculo"
      ],
      [
        "icms",
        "Conferência documental de lançamento de ICMS",
        "icms|auto de infracao icms"
      ]
    ]
  },
  {
    "area": "administrativo",
    "source": "https://planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105compilada.htm",
    "topics": [
      [
        "licitacao",
        "Organização de impugnação em licitação",
        "edital licitacao|impugnacao edital"
      ],
      [
        "processo-administrativo",
        "Controle de processo administrativo",
        "processo administrativo|notificacao administrativa"
      ],
      [
        "recurso-administrativo",
        "Estruturação de razões de recurso administrativo",
        "recurso administrativo|decisao administrativa"
      ],
      [
        "penalidade",
        "Análise de decisão sancionatória administrativa",
        "penalidade administrativa|multa administrativa"
      ],
      [
        "motivacao",
        "Conferência da motivação administrativa",
        "motivacao do ato|ato administrativo"
      ]
    ]
  },
  {
    "area": "empresarial",
    "source": "https://planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105compilada.htm",
    "topics": [
      [
        "contrato",
        "Revisão da prova em disputa contratual",
        "inadimplemento contratual|contrato empresarial"
      ],
      [
        "cobranca",
        "Organização de cobrança empresarial",
        "cobranca empresarial|titulo executivo"
      ],
      [
        "sociedade",
        "Delimitação de conflito societário",
        "conflito societario|socio administrador"
      ],
      [
        "tutela",
        "Tutela de urgência em litígio empresarial",
        "liminar empresarial|urgencia societaria"
      ],
      [
        "documentos",
        "Matriz documental de relações empresariais",
        "documentos empresariais|prova societaria"
      ]
    ]
  }
] as ReadonlyArray<{area:string;source:string;topics:ReadonlyArray<readonly [string,string,string]>}>;
const proposals = groups.flatMap((group) => group.topics.map(([id,title,keys]) => {
  const slug = `proposta-${group.area}-${id}`;
  const content = `RASCUNHO METODOLÓGICO PARA REVISÃO JURÍDICA — ${title}.
Delimitar a pergunta jurídica e identificar competência, rito, fase, posição processual e fatos incontroversos.
Separar fatos de hipóteses, relacionar cada afirmação à prova identificável e registrar lacunas e contradições.
Consultar o texto oficial atualizado na fonte declarada, conferir âmbito de aplicação, exceções, mudanças e vigência antes de sugerir fundamento.
Localizar decisões judiciais somente em acervos oficiais, registrar tribunal, identificador, data e contexto; não fabricar precedentes.
Explicitar argumentos contrários, riscos, limitações e fatos que demandam diligência. A redação final e a aprovação dependem de advogado revisor.`;
  return {
    slug, version:1, area:group.area, description:title, content,
    triggers:JSON.stringify({keywords:keys.split("|")}),
    requiredSources:JSON.stringify([group.source]),
    requiredEvidence:JSON.stringify(["Documentação dos fatos alegados","Comprovação da autoria e datas relevantes"]),
    rules:JSON.stringify(["Conferir texto legal consolidado e vigência na data do caso","Revisar competência, procedimento e fonte primária"]),
    exceptions:JSON.stringify(["Verificar legislação especial e hipóteses de inaplicabilidade"]),
    forbiddenClaims:JSON.stringify(["Prometer resultado","Criar jurisprudência inexistente","Afirmar fato sem prova ou versão sem fonte"]),
    allowedTools:"[]", outputSchema:"{}",
    status:"draft" as const,
    contentHash:createHash("sha256").update(content).digest("hex"),
  };
}));
if (proposals.length !== 50 || new Set(proposals.map(x => x.slug)).size !== 50) throw Error("invalid_curation_catalog");

const committing=process.argv.includes("--commit");
const destination=process.env.DATABASE_URL??"";
const stage=/stage|staging|qa|synthetic/i.test(destination);
if (!committing) {
  console.log(JSON.stringify({dryRun:true,proposals:proposals.length,approved:0,areas:[...new Set(proposals.map(x=>x.area))]}));
} else {
  if (process.env.JURIDIA_PROPOSALS_IMPORT !== "review-only" || !stage || /\/shared\/juridia\.db/i.test(destination)) {
    throw Error("import_requires_explicit_isolated_stage_database");
  }
  const db=new PrismaClient();
  try {
    let inserted=0,skipped=0;
    for (const row of proposals) {
      const existing=await db.skillVersion.findFirst({where:{slug:row.slug},select:{id:true}});
      if (existing){skipped++;continue;}
      await db.skillVersion.create({data:{...row,authorUserId:null,reviewerUserId:null,approvedBy:null,approvedAt:null,manifestHash:null}});
      inserted++;
    }
    console.log(JSON.stringify({inserted,skipped,pendingHumanReview:inserted+skipped,approved:0}));
  } finally { await db.$disconnect(); }
}
