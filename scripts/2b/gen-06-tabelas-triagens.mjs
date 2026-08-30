import { baseDoc } from "./_base.mjs";

export const tabelasDocumentos = [

baseDoc({
  slug: "tabela-documentos-defesa-ai-ambiental",
  titulo: "Tabela de Documentos — Defesa em Auto de Infração Ambiental",
  tipoDocumento: "TABELA_DOCUMENTOS",
  area: "ambiental",
  subarea: "defesa-administrativa-ambiental",
  assunto: "Auto de Infração Ambiental",
  subassunto: "Mapa documental da defesa",
  tags: ["ambiental/auto-infracao", "documentos", "P0"],
  metadados: { colunas: ["TipoDeDemanda","DocumentosIndispensaveis","DocumentosRecomendados","ProvasComplementares","DocumentosQueNormalmenteFaltam","RiscoDaAusencia"], demandas: ["defesa_administrativa_ambiental"] },
  conteudo: `# TABELA DE DOCUMENTOS — DEFESA EM AUTO DE INFRAÇÃO AMBIENTAL

| Tipo de demanda | Documentos indispensáveis | Documentos recomendados | Provas complementares | Documentos que normalmente faltam | Risco causado pela ausência |
| --- | --- | --- | --- | --- | --- |
| Defesa administrativa contra AI | AI integral; comprovante de notificação/ciência; procuração; identificação e documentos societários do autuado | Licenças e autorizações; contratos e ordens de serviço; histórico de fiscalizações; certidões do processo administrativo | Contraprova técnica (parecer assinado); imagens de satélite; fotos datadas do local; memória de contracálculo da multa | Auto de constatação; laudo técnico completo com fotos; comprovante da data real de ciência; anexos citados no AI | Defesa impugna "no vazio" (sem laudo não há contraprova); prazo contestável por falta de prova de ciência; dosimetria sem contracálculo é indeferida; nulidades formais não demonstradas com referência objetiva são rejeitadas |
| Impugnação da dosimetria da multa | Memória de cálculo do AI; tabela de gradação vigente; laudo de extensão do dano | Documentos de porte econômico (balanço/faturamento); provas de reparação e regularização | Planilha de decomposição do cálculo; certidões de antecedentes administrativos; provas de atenuantes (Lei 9.605/1998, arts. 14 e 18) | Memória de cálculo (frequentemente não anexada pelo órgão); documentação de reincidência alegada | Contracálculo sem memória original parece especulação; reincidência não impugnada consolida patamar agravado |
| Tese de decadência (3 anos) | AI com data de lavratura; auto de constatação/visita técnica datada | BO/registro da fiscalização; imagens históricas; correspondências anteriores do órgão | Cronologia documental assinada; protocolos administrativos prévios | Data da "constatação" (o órgão tende a alegar que ocorreu só na lavratura) | Termo inicial disputado derruba a tese mesmo com lapso evidente |
| Regularização superveniente (atenuante) | Protocolos de licenciamento; licenças obtidas; termo/compromisso de reparação | Projetos técnicos de recuperação; contratos de execução; imagens antes/depois | Notas de investimento; relatórios de monitoramento | Prova do vínculo entre a regularização e a área autuada | Atenuante ignorada por falta de vínculo documental com o fato autuado |

## NOTAS DE USO
- Requisição formal do processo administrativo integral no dia 1 do caso (o órgão não anexa tudo ao AI).
- Toda data usada na defesa precisa de fonte documental identificada (nunca afirmar data sem documento).
- Imagens: guardar original com metadados; impressões soltas têm força probatória reduzida.
- Documentos do cliente: colecionar ANTES de redigir a defesa — a ordem correta é prova primeiro, texto depois.`
}),

baseDoc({
  slug: "tabela-documentos-acp-ambiental-res",
  titulo: "Tabela de Documentos — Ação Civil Pública Ambiental (posição de rés)",
  tipoDocumento: "TABELA_DOCUMENTOS",
  area: "ambiental",
  subarea: "contencioso-judicial-ambiental",
  assunto: "Ação Civil Pública ambiental",
  subassunto: "Defesa judicial como réu",
  tags: ["ambiental/acp", "documentos", "P0"],
  metadados: { colunas: ["TipoDeDemanda","DocumentosIndispensaveis","DocumentosRecomendados","ProvasComplementares","DocumentosQueNormalmenteFaltam","RiscoDaAusencia"], demandas: ["acp_ambiental_res"] },
  conteudo: `# TABELA DE DOCUMENTOS — AÇÃO CIVIL PÚBLICA AMBIENTAL (RÉU)

| Tipo de demanda | Documentos indispensáveis | Documentos recomendados | Provas complementares | Documentos que normalmente faltam | Risco causado pela ausência |
| --- | --- | --- | --- | --- | --- |
| ACP ambiental — réu (empresa/pessoa com atividade) | Inicial da ACP + anexos; procuração; documentos societários; licenças e autorizações da atividade | Contratos com prestadores de serviço ambiental; projetos de controle de poluição; boletins de monitoramento; seguros | Laudo técnico judicial (contraperícia); imagens de satélite; relatórios de auto-monitoramento; histórico de autos de infração e seus desfechos | Contraperícia independente; documentos de cessação da conduta; prova de reparação | Ré disputa com retórica enquanto a parte autora instrui com laudo — risco de condenação com base em prova única do autor |
| Discusão de nexo causal e dano | Documentos de limites de imóvel (matrícula, georreferenciamento); cronologia da atividade | BO/comunicações sobre terceiros; estudos do entorno (outras fontes de poluição) | Parecer técnico de compatibilidade conduta × dano; modelagem de dispersão quando aplicável | Prova de que o dano tem outra origem | Responsabilidade objetiva (Lei 6.938/1981, art. 14, §1º) + ausência de impugnação do nexo = condenação integral |
| Dosimetria/valor da condenação | Demonstrações do porte da atividade; composição do dano alegado | Orçamentos de recuperação; planos de reparação; compromissos já assinados | Perícia de valoração; comparativos técnicos de custo | Proposta concreta de reparação pela ré | Condenação em valor global sem alternativa técnica de reparação — magistrado fixa arbitrária |
| Tese de regularização e boa-fé | Licenças obtidas após o fato; protocolos; termo de ajuste | Investimentos documentados; certificações ambientais | Imagens comparativas; relatórios de auditoria | Documentos do tempo ANTERIOR à autuação | Narrativa de "concertação posterior" sem prova de investimento real |

## NOTAS DE USO
- Na ACP o autor é o Ministério Público/entidade (Lei 7.347/1985) — ele instrui com relatório técnico inicial; a defesa precisa de contraprova técnica própria, senão vira "laudo contra laudo vazio".
- Mapear TODOS os processos administrativos paralelos (AI do mesmo fato): decisões administrativas (inclusive cancelamentos) servem de prova no juízo cível.
- Pedidos coletivos (obrigação de fazer) exigem plano técnico viável da ré: apresentar plano de reparação é melhor defesa que negar tudo.
- Tutela de urgência da autora (CPC, art. 300): preparar impugnação com prova de cessação e risco econômico da suspensão da atividade.`
}),

baseDoc({
  slug: "tabela-documentos-cobranca-execucao-credito",
  titulo: "Tabela de Documentos — Cobrança/Execução de Crédito",
  tipoDocumento: "TABELA_DOCUMENTOS",
  area: "civil",
  subarea: "cobranca",
  assunto: "Crédito empresarial",
  subassunto: "Mapa documental da cobrança",
  tags: ["civel/cobranca", "documentos", "P0"],
  metadados: { colunas: ["TipoDeDemanda","DocumentosIndispensaveis","DocumentosRecomendados","ProvasComplementares","DocumentosQueNormalmenteFaltam","RiscoDaAusencia"], demandas: ["cobranca_execucao_credito"] },
  conteudo: `# TABELA DE DOCUMENTOS — COBRANÇA/EXECUÇÃO DE CRÉDITO

| Tipo de demanda | Documentos indispensáveis | Documentos recomendados | Provas complementares | Documentos que normalmente faltam | Risco causado pela ausência |
| --- | --- | --- | --- | --- | --- |
| Ação de cobrança (título não executivo) | Contrato/ordem de serviço; notas fiscais; comprovantes de entrega/prestação | E-mails de cobrança; extratos de recebimento parcial; correspondências | Testemunhas da entrega; laudos de aceite; assinaturas | Prova da entrega/aceite pelo devedor | Sem prova da entrega/prestação, a cobrança vira palavra contra palavra |
| Execução de título executivo | Título (duplicata, cheque, confissão de dívida etc.) + documento que lhe dá suporte | Protesto; extratos; garantias cedidas | Certidões de bens; registros públicos | Demonstração do saldo devedor atualizado | Título sem suporte documental (ex.: duplicata sem prova da entrega) permite embargos fortes |
| Acordo/parcelamento (execução do acordo) | Contrato de parcelamento com cláusula de aceleração; confissão de dívida quando cabível | Garantias (aval, fiança, alienação); notas promissórias | Comprovantes das parcelas pagas | Cláusula de aceleração expressa | Vencimento antecipado indisponível; cobrar todo o saldo sem base contratual |
| Defesa do réu de cobrança (espelho) | Contrato; comprovantes de pagamento; conferência de saldo | Notificações recebidas; correspondências de disputa | Contracálculo; perícia contábil | Histórico de pagamentos organizado cronologicamente | Presunção de veracidade dos fatos não impugnados especificamente |

## NOTAS DE USO
- Antes de ajuizar: conferir se existe TÍTULO EXECUTIVO — muda inteiramente a via processual e a velocidade.
- Saldo devedor: sempre apresentar memória de cálculo atualizada e regravável (índice {{INDEXADOR}} definido).
- Devedor sem patrimônio: mapear bens e sócios ANTES (evitar vitória inútil); considerar responsabilidade societária apenas com base concreta [VALIDAR].
- Prescrição: montar linha do tempo com datas de vencimento e interrupções; CC, art. 206, §3º, V (3 anos) para pretensões de reparação e hipóteses próprias [VALIDAR natureza do crédito].`
})
];

export const triagens = [

baseDoc({
  slug: "triagem-auto-infracao-ambiental",
  titulo: "Triagem Inteligente — Auto de Infração Ambiental",
  tipoDocumento: "TRIAGEM",
  area: "ambiental",
  subarea: "defesa-administrativa-ambiental",
  assunto: "Auto de Infração Ambiental",
  subassunto: "Roteiro de entrevista estruturado",
  tags: ["ambiental/auto-infracao", "triagem", "P0"],
  metadados: {
    objetivo: "Identificar em ≤ 15 minutos: área, urgência/prazo, decadência, documentos, teses possíveis e risco",
    arvoreDecisao: {
      inicio: "P1",
      P1: { pergunta: "Você recebeu algum documento de órgão ambiental? (auto de infração, notificação, embargo)", respostas: { "AI de multa": "P2", "Notificação/embargo": "P10_urgente", "Nada recebido": "P11_preventiva" } },
      P2: { pergunta: "Quando você foi notificado/cientificado?", respostas: { "Menos de 10 dias": "P3_urgencia_alta", "10-20 dias": "P3_urgencia_alta", "Mais de 20 dias": "P3_urgencia_critica_prazo" } },
      P3_urgencia_alta: { pergunta: "A notificação traz a data de lavratura do auto?", respostas: { "Sim": "P4", "Não": "pedir_documento" } },
      P4: { pergunta: "Data da lavratura × data da constatação: diferença > 3 anos?", respostas: { "Sim": "tese_decadencia_alta", "Não": "P5" } },
      P5: { pergunta: "Há laudo técnico anexado?", respostas: { "Sim": "P6", "Não": "tese_materialidade_alta" } },
      P6: { pergunta: "A atividade possui licença/autorização que cubra a conduta autuada?", respostas: { "Sim": "tese_erro_proibicao", "Parcial": "tese_erro_proibicao + enquadramento", "Não": "P7" } },
      P7: { pergunta: "A fiscalização identificou quem praticou o fato?", respostas: { "Sim, o próprio cliente": "P8", "Terceiro": "tese_nexo_causal", "Não": "tese_materialidade_nexo" } },
      P8: { pergunta: "Há reincidente alegado no auto?", respostas: { "Sim": "tese_dosimetria_reincidencia", "Não": "P9" } },
      P9: { pergunta: "Cliente já iniciou regularização/reparação?", respostas: { "Sim": "tese_atenuante_regularizacao", "Não": "planejar_regularizacao_paralela" } }
    },
    regrasClassificacao: ["Prazo < 5 dias = EMERGÊNCIA", "Prazo 5-20 dias = URGENTE", "Embargo/interdição = URGENTE + impacto de negócio", "Lapso > 3 anos constatação-lavratura = tese decadência (alta)", "Sem laudo = tese materialidade (alta)"]
  },
  conteudo: `# TRIAGEM INTELIGENTE — AUTO DE INFRAÇÃO AMBIENTAL

## OBJETIVO
Identificar em até 15 minutos: área do problema, urgência/prazo, hipótese de decadência, documentos necessários, teses possíveis e risco. Operar como árvore: cada pergunta tem respostas previsíveis que apontam a próxima pergunta ou uma classificação.

## ÁRVORE DE DECISÃO

| Nível | Pergunta | Respostas possíveis → próxima pergunta/classificação |
| --- | --- | --- |
| P1 | Você recebeu algum documento de órgão ambiental? | **AI de multa** → P2 • **Notificação/embargo/interdição** → classificação URGENTE (impacto de negócio; avaliar cautelar) • **Nada recebido, só soube da fiscalização** → modo preventivo (levantar risco, preparar documentos) |
| P2 | Quando você foi notificado/cientificado? | **≤ 20 dias** → URGÊNCIA ALTA (prazo de defesa: 20 dias — Decreto 6.514/2008, art. 141 [VALIDAR ARTIGO]) • **> 20 dias** → checar se houve defesa anterior (pedir cópia); reclassificar para acompanhamento/recurso |
| P3 | O documento traz a data de lavratura? | **Sim** → P4 • **Não** → solicitar imediatamente o processo administrativo integral |
| P4 | Data de constatação × data de lavratura: mais de 3 anos? | **Sim** → TESE: decadência administrativa (alta) — tese-decadencia-administrativa-ambiental • **Não** → P5 |
| P5 | Há laudo técnico anexado? | **Não** → TESE: ausência de materialidade (alta) • **Sim** → P6 (e impugnar metodologia: tese-ausencia-materialidade-ai-ambiental) |
| P6 | A atividade tem licença/autorização que cubra a conduta? | **Sim** → TESE: erro sobre a proibição + incompetência se outro órgão autuou • **Parcial** → erro sobre proibição + enquadramento divergente • **Não** → P7 |
| P7 | A fiscalização identificou quem praticou o fato? | **Terceiro** → TESE: nexo causal (tese-ausencia-nexo-causal-ambiental) + comunicar o órgão com prova • **Cliente** → P8 • **Não identificado** → materialidade/nexo |
| P8 | O auto alega reincidência? | **Sim** → TESE: dosimetria (impugnar reincidência não definitiva — tese-vicios-dosimetria-multa-ambiental) • **Não** → P9 |
| P9 | Há regularização/reparação iniciada? | **Sim** → TESE: atenuante (Lei 9.605/1998, art. 14) — tese-regularizacao-superveniente-atenuante • **Não** → planejar regularização PARALELA à defesa |
| P10 | Embargo/interdição aplicado? | **Sim** → URGÊNCIA MÁXIMA: avaliar impugnação administrativa + medida judicial (MS — Lei 12.016/2009, art. 23: 120 dias) |

## REGRAS DE CLASSIFICAÇÃO
| Sinal | Classificação | Providência imediata |
| --- | --- | --- |
| Prazo de defesa < 5 dias | EMERGÊNCIA | Defesa mínima tempestiva hoje + complemento depois (verificar se o órgão admite complementação) |
| Prazo 5-20 dias | URGENTE | Fluxo completo (fluxo-auto-infracao-ambiental) |
| Embargo/interdição | URGENTE + NEGÓCIO | Equipe sênior no mesmo dia |
| Lapso > 3 anos (constatação × lavratura) | TESE FORTE | Cronologia documental antes de qualquer texto |
| Laudo ausente | TESE FORTE | Requerimento de acesso integral ao processo |
| Multa alta + regularização em curso | ESTRATÉGIA MISTA | Defesa + plano de reparação |

## DOCUMENTOS A SOLICITAR (checklist de coleta)
1. AI integral (todas as páginas, frente e verso).
2. Auto de constatação e laudo técnico (com fotos).
3. Comprovante de notificação/data de ciência.
4. Licenças, autorizações, alvarás do cliente.
5. Documentos do imóvel (matrícula, georreferenciamento).
6. Histórico de fiscalizações e processos anteriores.
7. Provas de regularização em curso (protocolos, projetos).
8. Imagens de satélite/registro histórico quando pertinente.

## POSSÍVEIS TESES (ordenadas pela triagem)
- Decadência (3 anos) — quando lapso documentado.
- Nulidade formal — quando vício objetivo no AI.
- Ausência de materialidade — sem laudo/laudo viciado.
- Erro sobre a proibição — licença cobrindo a conduta.
- Ilegitimidade/incompetência — ente licenciador ≠ autuador.
- Nexo causal — fato de terceiro/fora do imóvel.
- Dosimetria e proporcionalidade — sempre subsidiária.
- Regularização superveniente — atenuante obrigatória de considerar (Lei 9.605/1998, arts. 14 e 18).

## ENCERRAMENTO DA TRIAGEM
- [ ] Área, prazo e urgência registrados no sistema
- [ ] Documentos solicitados com lista nominal
- [ ] Teses pré-identificadas anotadas (alta/média/baixa — qualitativas)
- [ ] Fluxo completo iniciado (fluxo-auto-infracao-ambiental)
- [ ] Expectativa do cliente alinhada por escrito`
}),

baseDoc({
  slug: "triagem-cobranca-empresarial",
  titulo: "Triagem Inteligente — Cobrança Empresarial",
  tipoDocumento: "TRIAGEM",
  area: "civil",
  subarea: "cobranca",
  assunto: "Crédito empresarial",
  subassunto: "Roteiro de entrevista estruturado",
  tags: ["civel/cobranca", "triagem", "P0"],
  metadados: {
    objetivo: "Qualificar o crédito (documento, valor, prazo, patrimônio do devedor) e definir via: negociação → cobrança extrajudicial → judicial",
    arvoreDecisao: {
      inicio: "P1",
      P1: { pergunta: "Existe documento que comprove o crédito?", respostas: { "Contrato + NF": "P2", "Só NF": "P2_prova_entrega", "Nada": "reconstruir_prova" } },
      P2: { pergunta: "Existe título executivo (duplicata, confissão de dívida, cheque)?", respostas: { "Sim": "via_executiva", "Não": "via_cognitiva" } },
      P3: { pergunta: "Devedor tem patrimônio/garantia?", respostas: { "Sim": "prosseguir", "Dúvida": "pesquisa_patrimonial", "Não": "avisar_risco_vitoria_inutil" } },
      P4: { pergunta: "Houve negociação extrajudicial?", respostas: { "Sim": "P4_decisao", "Não": "iniciar_notificacao" } }
    },
    regrasClassificacao: ["Título executivo = via rápida", "Sem prova de entrega = reconstruir antes", "Devedor sem patrimônio = informar risco", "Prescrição > 2 anos = prioridade máxima de análise"]
  },
  conteudo: `# TRIAGEM INTELIGENTE — COBRANÇA EMPRESARIAL

## OBJETIVO
Qualificar o crédito e escolher a via de recuperação com menor custo e maior probabilidade de recebimento efetivo (não apenas "vencer" a demanda).

## ÁRVORE DE DECISÃO

| Nível | Pergunta | Respostas possíveis → próxima pergunta/classificação |
| --- | --- | --- |
| P1 | Existe documento que comprove o crédito? | **Contrato + notas + ordens** → P2 • **Só nota fiscal** → checar prova da entrega/aceite (recibos, e-mails) • **Nada** → reconstruir prova ANTES de qualquer cobrança formal |
| P2 | Existe título executivo? (duplicata com prova de entrega, confissão de dívida, cheque, nota promissória) | **Sim** → VIA EXECUTIVA (rápida; penhora direta) • **Não** → VIA COGNITIVA (ação de cobrança; prova completa) |
| P3 | Quanto tempo está vencido? | **< 1 ano** → normal • **1-2 anos** → atenção à prescrição (CC, art. 206, §3º, V para reparação; validar natureza) • **> 2 anos** → ANÁLISE PRESCRICIONAL ANTES DE TUDO |
| P4 | O devedor tem patrimônio/garantias? | **Sim** → prosseguir • **Dúvida** → pesquisa patrimonial/societária • **Não** → informar cliente do risco de "vitória sem recebimento"; considerar acordo |
| P5 | Houve tentativa extrajudicial? | **Sim** → decisão de ajuizamento (custo × benefício) • **Não** → iniciar notificação formal (fluxo-cobranca-empresarial-extrajudicial-judicial, etapas 3-5) |
| P6 | Devedor pediu desconto/parcela? | **Sim** → formalizar acordo com aceleração e garantia • **Não** → escalada |
| P7 | Devedor está estruturado em holding/transferiu bens? | **Sim** → estudar desconsideração com base concreta [VALIDAR requisitos] antes de ajuizar |

## REGRAS DE CLASSIFICAÇÃO
| Sinal | Classificação | Providência |
| --- | --- | --- |
| Título executivo presente | VIA RÁPIDA | Executar em vez de litigar fatos |
| Sem prova de entrega | CRÉDITO FRÁGIL | Reconstruir prova antes de qualquer ação |
| Vencimento > 2 anos | PRESCRIÇÃO EM RISCO | Análise imediata (CC, art. 206, §3º, V) |
| Devedor sem patrimônio | RECEBIMENTO DUVIDOSO | Priorizar acordo; informar cliente por escrito |
| Devedor com disputa comercial pendente | CRÉDITO CONTESTÁVEL | Preparar defesa dos contrapontos técnicos |

## DOCUMENTOS A SOLICITAR
1. Contrato e aditivos; 2. notas fiscais; 3. comprovantes de entrega/aceite (recibos, e-mails, laudos); 4. títulos (duplicatas, cheques, confissões); 5. extratos de pagamentos parciais; 6. correspondências de cobrança; 7. garantias (aval, fiança, alienação); 8. dados societários do devedor.

## POSSÍVEIS CENÁRIOS E ENCARGOS
- **Cobrança amigável:** parcelamento com aceleração, garantia e confissão de dívida quando cabível.
- **Cobrança judicial (cognitiva):** ação de cobrança com provas completas; tutela quando patrimônio em risco (CPC, art. 300).
- **Executiva:** penhora direta sobre título; embargos do devedor previstos no plano.
- **Receito esperado:** comunicar sempre valor líquido estimado (custos descontados) — sem promessa e sem estatística inventada.`
}),

baseDoc({
  slug: "triagem-consulta-ambiental-licenciamento",
  titulo: "Triagem Inteligente — Consulta Ambiental Genérica (licenciamento)",
  tipoDocumento: "TRIAGEM",
  area: "ambiental",
  subarea: "licenciamento-ambiental",
  assunto: "Licenciamento e regularização",
  subassunto: "Roteiro de entrevista estruturado",
  tags: ["ambiental/licenciamento", "triagem", "P0"],
  metadados: {
    objetivo: "Classificar a demanda ambiental preventiva: atividade, ente competente, estágio do licenciamento, passivo existente, riscos e encaminhamento",
    arvoreDecisao: {
      inicio: "P1",
      P1: { pergunta: "Qual a situação da atividade?", respostas: { "Vai iniciar": "P2_planejamento", "Em operação sem licença": "P3_regularizacao", "Em operação com licença": "P4_conformidade", "Sofrendo fiscalização": "triagem-auto-infracao-ambiental" } },
      P2_planejamento: { pergunta: "A atividade tem potencial poluidor/uso de recursos naturais?", respostas: { "Sim": "mapear_ente_e_estudo", "Não": "verificar_exigencias_locais" } },
      P3_regularizacao: { pergunta: "Há autuação ou embargo?", respostas: { "Sim": "teses_defesa + regularizacao", "Não": "licenciamento_retroativo_planejado" } }
    },
    regrasClassificacao: ["Operação sem licença + autuação = URGENTE (defesa + regularização)", "Operação sem licença sem autuação = risco latente (regularizar antes)", "Licença vigente + fiscalização = conferir limites da licença"]
  },
  conteudo: `# TRIAGEM INTELIGENTE — CONSULTA AMBIENTAL GENÉRICA (LICENCIAMENTO)

## OBJETIVO
Classificar demandas ambientais preventivas (não punitivas): atividade, ente competente, estágio do licenciamento, passivo latente, risco de autuação e encaminhamento técnico.

## ÁRVORE DE DECISÃO

| Nível | Pergunta | Respostas possíveis → próxima pergunta/classificação |
| --- | --- | --- |
| P1 | Qual a situação da atividade? | **Vai iniciar** → modo planejamento (P2) • **Em operação sem licença** → modo regularização (P3) • **Em operação com licença** → modo conformidade (P4) • **Sofrendo fiscalização/autuação** → migrar para triagem-auto-infracao-ambiental |
| P2 | A atividade usa recurso natural ou tem potencial poluidor? | **Sim** → mapear ente competente (federal/estadual/municipal) e tipo de estudo exigido (conforme classificação de impacto [VALIDAR critérios do ente]) • **Não** → verificar exigências sanitárias/urbanísticas correlatas |
| P3 | Há autuação, embargo ou denúncia em curso? | **Sim** → DUPLA VIA: defesa (teses de AI) + regularização paralela • **Não** → licenciamento retroativo planejado (risco latente: fiscalização pode autuar a qualquer momento) |
| P4 | A licença vigente cobre a atividade atual? (ampliação, mudança de processo) | **Sim** → conformidade operacional e monitoramento • **Não** → aditamento/renovação antes da fiscalização |
| P5 | Há passivo ambiental no imóvel? (área degradada, resíduos, APP) | **Sim** → plano de recuperação documentado (também serve como atenuante futuro) • **Não** → declaração técnica e manter registro |
| P6 | O imóvel tem restrições? (UC, reserva legal, APP, zona urbana) | **Sim** → análise de sobreposição e regularização fundiária/ambiental articulada • **Não** → prosseguir licenciamento |

## REGRAS DE CLASSIFICAÇÃO
| Sinal | Classificação | Providência |
| --- | --- | --- |
| Operando sem licença + autuação | URGENTE | Defesa administrativa + plano de licenciamento em paralelo |
| Operando sem licença, sem autuação | RISCO LATENTE | Regularizar AGORA (custo de defesa > custo de licença) |
| Licença vigente + atividade ampliada | DESCONFORMIDADE | Aditamento imediato |
| Passivo sem plano | RISCO CRESCENTE | Plano técnico de recuperação com cronograma |
| Restrição sobreposta não avaliada | RISCO DE PROJETO | Estudo de sobreposição antes de investir |

## DOCUMENTOS A SOLICITAR
1. Descrição da atividade (processos, insumos, emissões, efluentes, resíduos); 2. documentos do imóvel (matrícula, CAR [VALIDAR ferramentas vigentes]); 3. licenças existentes e protocolos; 4. autos de infração anteriores e desfechos; 5. estudos técnicos prévios; 6. imagens aéreas/satélite; 7. histórico de denúncias.

## POSSÍVEIS ENCAMINHAMENTOS
- **Planejamento de licenciamento:** cronograma, estudos exigidos, ente correto (evita depois a tese-ilegitimidade-competencia-orgao-autuador).
- **Regularização retroativa:** plano com marcos documentáveis (protege no futuro — Lei 9.605/1998, art. 14).
- **Conformidade operacional:** auditoria de limites da licença; treinamento; registros.
- **Passivo:** plano de recuperação com custos e cronograma realistas.

## ENCERRAMENTO DA TRIAGEM
- [ ] Situação da atividade e estágio registrados
- [ ] Ente competente preliminarmente identificado (validar com regulamento local [DISPOSITIVO A VALIDAR])
- [ ] Risco de autuação classificado (alto/médio/baixo — qualitativo)
- [ ] Plano encaminhado com cronograma e custos`
})
];
