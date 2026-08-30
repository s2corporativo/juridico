import { baseDoc } from "./_base.mjs";

const TAGS_BASE = ["ambiental/auto-infracao", "defesa-administrativa", "P0"];

function tese(d) {
  return baseDoc({
    tipoDocumento: "TESE",
    area: "ambiental",
    subarea: "defesa-administrativa-ambiental",
    assunto: "Auto de Infração Ambiental",
    subassunto: d.subassunto,
    prioridade: "P0",
    tags: [...TAGS_BASE, ...d.tagsExtra],
    metadados: {
      nomeTese: d.nomeTese,
      tipoDemanda: "defesa_administrativa_ambiental",
      probabilidadeSucesso: d.probabilidade,
      prazoReferencia: d.prazo,
      pecaCorrespondente: "peca-defesa-administrativa-ambiental",
      checklistCorrespondente: "checklist-defesa-ambiental-protocolo",
      documentosCriticos: d.docsCriticos,
      jurisprudencia: "Somente entendimentos consolidados, sem citação numérica (VALIDAR antes de citar em peça)"
    },
    conteudo: d.conteudo
  });
}

const AVISO = "> **Aviso de conformidade EJC:** só citar dispositivos presentes na lista confiável do projeto. Qualquer outro dispositivo deve ser substituído por [DISPOSITIVO A VALIDAR]. Jurisprudência: apenas entendimentos consolidados descritos qualitativamente; NUNCA inventar número de julgado, súmula ou percentual.";

export const teses = [

// ============ TESE 1 ============
tese({
  slug: "tese-nulidade-formal-ai-ambiental",
  nomeTese: "Nulidade formal do Auto de Infração Ambiental",
  subassunto: "Nulidade e vícios formais",
  probabilidade: "média",
  prazo: "Defesa administrativa em 20 dias (Decreto 6.514/2008, art. 141 [VALIDAR ARTIGO])",
  docsCriticos: ["Auto de Infração original", "Auto de Constatação (se houver)", "Notificação do autuado", "Laudo de verificação"],
  tagsExtra: ["nulidade", "vicio-formal"],
  conteudo: `# TESE DE DEFESA — Nulidade formal do Auto de Infração Ambiental

## 1. Classificação
- **Área:** ambiental | **Subárea:** defesa em autos de infração
- **Natureza:** tese de forma (vício formal) — atacada por preliminar na defesa administrativa

## 2. Problema jurídico
O auto de infração ambiental é o documento que inaugura a fase punitiva do poder de polícia e, por isso, deve conter os elementos mínimos que permitam ao autuado conhecer, com clareza, a conduta que lhe é atribuída, o local, a data, a fundamentação legal e a sanção proposta. Quando o AI carece de elementos essenciais — descrição genérica da infração ("degradação ambiental" sem especificação), ausência de localização precisa, falta de indicação do dispositivo legal infringido, ausência de assinatura ou qualificação do agente autuador, ou ausência de medidas administrativas indicadas — o direito de defesa plena (CF/88, art. 5º, LV) fica comprometido, e o ato se torna nulo ou anulável, conforme a gravidade do vício.

## 3. Hipótese de aplicação
A tese é cabível quando, na conferência documental do AI, verifica-se qualquer das seguintes situações:
1. Descrição da infração genérica, ininteligível ou contraditória com o laudo.
2. Ausência ou ilegibilidade de identificação do autuado, do local ou da data da autuação.
3. Falta de indicação da norma legal ou regulamentar supostamente violada.
4. Ausência de assinatura, matrícula ou identificação funcional do autuante.
5. Notificação feita fora das formas legais ou sem comprovante válido de ciência.
6. Inconsistência entre o AI, o auto de constatação e o laudo técnico.

## 4. Fundamentação legal
- **CF/88, art. 5º, LV** — contraditório e ampla defesa como garantia processual, inclusive administrativa.
- **Decreto 6.514/2008** — disciplina o processo administrativo federal para apuração de infrações à legislação ambiental; requisitos do auto de infração e prazo de defesa de 20 dias (**Decreto 6.514/2008, art. 141** — nota: [VALIDAR ARTIGO] no arquivo de legislação do agente 2-a antes de citar em peça final).
- Outros dispositivos estaduais/municipais aplicáveis: [DISPOSITIVO A VALIDAR] — cada estado tem regulamento próprio de infrações.

## 5. Fundamentação jurisprudencial (sem números)
Entendimento consolidado nos tribunais superiores no sentido de que o ato administrativo sancionador exige motivação e especificidade suficientes para permitir a defesa; auto de infração cuja descrição não permite identificar a conduta censurada fere a garantia do contraditório. (Consultar e confirmar julgados no painel oficial do STJ/STF antes de citar número em peça — proibido inventar.)

${AVISO}

## 6. Requisitos de aplicabilidade
1. Cópia integral e legível do AI e dos autos administrativos.
2. Demonstração objetiva do vício (citar a página/linha do AI onde ele aparece).
3. Prova da impossibilidade (ou severa dificuldade) de exercício da defesa em razão do vício.
4. Comprovação da tempestividade da defesa.

## 7. Documentos necessários
| Documento | Finalidade | Obrigatório? |
| --- | --- | --- |
| Auto de Infração (original ou cópia integral) | Verificar elementos formais | Sim |
| Auto de Constatação | Comparar com o AI | Sim, se existir |
| Laudo de verificação técnico | Testar coerência da descrição | Recomendado |
| Comprovante de notificação/ciência | Verificar forma e prazo | Sim |
| Fotos/vídeos do local | Confrontar com descrição do AI | Recomendado |

## 8. Riscos e limites
- Vício puramente formal sem prejuízo à defesa tende a ser sanado (princípio da verdade real no processo administrativo); o juízo administrativo pode convalidar.
- Se a mérito há infração evidente e comprovada, a nulidade apenas atrasa, não evita, a sanção.
- Atenção ao efeito de "vitória de Pirro": anulação leva à reautuação com melhor fundamentação.

## 9. Argumentos contrários × contra-argumentos
| Argumento do órgão autuador | Contra-argumento do autuado |
| --- | --- |
| O vício é irrelevante e pode ser corrigido de ofício | Correção de ofício não pode piorar a situação nem suprir falta de descrição da conduta, pois isso viola o contraditório |
| O laudo supre a descrição genérica do AI | O laudo deve integrar o ato desde a origem; descrever depois é reconstituir fatos sem ampla defesa prévia |
| O autuado foi notificado e não alegou nada antes | A ciência da notificação não sana ausência de elementos essenciais do próprio ato |

## 10. Estratégia processual sugerida
1. Protocolar defesa administrativa dentro dos 20 dias, com preliminar de nulidade + mérito subsidiário (nunca sustentar só a preliminar).
2. Juntar o AI destacando objetivamente cada vício.
3. Requerer, no caso de vício insanável, o cancelamento do AI; no caso de vício sanável, que a convalidação ocorra com direito a nova defesa.

## 11. Pedidos possíveis
- Cancelamento/arquivamento do AI por nulidade formal.
- Nova autuação regular, se reconhecido vício sanável, com reposição do prazo de defesa.
- Não aplicação de multa até regularização do processo.

## 12. Probabilidade qualitativa
- **Classificação: média.** Alta quando o vício impede efetivamente a defesa (ex.: autuado ou local incorretos); baixa quando é mera irregularidade sem prejuízo.

## 13. Fontes
- Elaboração EJC — conteúdo estrutural original.
- Lista confiável de fundamentos EJC (CF/88 art. 5º LV; Decreto 6.514/2008 com nota de validação).`
}),

// ============ TESE 2 ============
tese({
  slug: "tese-decadencia-administrativa-ambiental",
  nomeTese: "Decadência administrativa ambiental (3 anos) para aplicar sanção de multa",
  subassunto: "Decadência do poder de polícia",
  probabilidade: "alta",
  prazo: "3 anos da constatação da infração (Decreto 6.514/2008 — decadência administrativa)",
  docsCriticos: ["Auto de Infração", "Auto de Constatação", "Boletim de ocorrência ou registro da fiscalização", "Prova da data da conduta/constatação"],
  tagsExtra: ["decadencia", "prazo"],
  conteudo: `# TESE DE DEFESA — Decadência administrativa ambiental (3 anos)

## 1. Classificação
- **Área:** ambiental | **Subárea:** defesa em autos de infração
- **Natureza:** tese de mérito preliminar (extinção do poder de aplicar a sanção)

## 2. Problema jurídico
O poder de polícia ambiental não é eterno. A administração deve apurar a infração e aplicar a sanção dentro de prazo decadencial — no âmbito federal, 3 anos contados da constatação da infração (Decreto 6.514/2008). Se a constatação ocorreu há mais de 3 anos e o AI de multa foi lavrado fora desse intervalo, o ato punitivo alcança fato decadido e deve ser cancelado, pois a inércia da administração não pode ser transferida ao administrado. A tese é objetiva: depende apenas de datas, o que a torna especialmente valiosa quando documentada.

## 3. Hipótese de aplicação
Cabível quando:
1. A conduta (ou sua constatação pela fiscalização) ocorreu há mais de 3 anos.
2. O AI de multa foi lavrado após o termo decadencial.
3. Não há, nos autos, ato idôneo de interrupção/suspensão válido comprovadamente registrado.
4. A sanção pretendida é a multa (atenção: análises técnicas de dano e embargos/destruição de obra seguem regras próprias — conferir [DISPOSITIVO A VALIDAR]).

## 4. Fundamentação legal
- **Decreto 6.514/2008** — regula o processo administrativo de apuração de infrações ambientais federais e fixa decadência administrativa de 3 anos.
- **CF/88, art. 5º, LV** — segurança jurídica e defesa.
- Regulamento estadual equivalente: [DISPOSITIVO A VALIDAR] — verificar o prazo e a contagem no regulamento do órgão autuador.

## 5. Fundamentação jurisprudencial (sem números)
O STJ reconhece de forma consolidada que a multa ambiental só pode ser aplicada dentro do prazo decadencial, com início na data da constatação pela autoridade competente; a contagem não se confunde com a data da conduta, e a carga de demonstrar a regularidade do lançamento cabe à administração. (NÃO citar número de julgado sem verificação oficial.)

${AVISO}

## 6. Requisitos de aplicabilidade
1. Demonstração cronológica precisa: data da conduta/constatação × data da lavratura do AI.
2. Exclusão ou impugnação de atos alegados como interrupção.
3. Prova documental da linha do tempo (fotos datadas, relatórios, correspondências, BO).

## 7. Documentos necessários
| Documento | Finalidade | Obrigatório? |
| --- | --- | --- |
| AI com data de lavratura | Fixar termo final | Sim |
| Auto de constatação/visita técnica | Fixar termo inicial (constatação) | Sim |
| Protocolos administrativos anteriores | Verificar atos interruptivos alegados | Sim |
| Prova da data do fato (fotos datadas, satélite, BO) | Contestar termo inicial | Recomendado |

## 8. Riscos e limites
- Confusão entre decadência administrativa (multa) e prescrição da pretensão executória/punitiva do Estado — prazos e naturezas distintas.
- Se houve embargo/destruição ou "ação de natureza alternativa" determinada junto à multa, o órgão pode sustentar regimes distintos — impugnar ponto por ponto.
- Termo inicial controvertido: a fiscalização pode alegar "constatação" apenas na data do AI; produzir prova antecipada de constatação anterior.
- Documento central de apoio: FLUXO e TABELA_DOCUMENTOS do lote (fluxo-auto-infracao-ambiental).

## 9. Argumentos contrários × contra-argumentos
| Argumento do órgão autuador | Contra-argumento do autuado |
| --- | --- |
| A constatação só ocorreu na data do AI | Provar constatação anterior (visita, relatório, imagem) — a "constatação" exige efetiva verificação, não mero interesse posterior |
| O processo administrativo interrompeu o prazo | Interrompção exige ato válido e comprovado antes do termo; procedimento vago ou simples diligência interna não basta |
| A infração é permanente, renovando-se a cada dia | A decadência da multa conta-se da constatação; teoria da atividade/conduta permanente não revive poder decadido |

## 10. Estratégia processual sugerida
1. Montar cronologia documental (linha do tempo anexa à defesa).
2. Preliminar de decadência + mérito subsidiário.
3. Requisitar do órgão, se possível, registro completo do processo de origem (inclusive visitas anteriores).
4. Se indeferida na defesa, manter em recurso administrativo e, persistindo, avaliar MS ou anulação judicial.

## 11. Pedidos possíveis
- Cancelamento integral do AI de multa por decadência.
- Desconstituição do termo inicial alegado, com recontagem.
- Condenação em ônus apenas administrativos (não há sucumbência em sede administrativa).

## 12. Probabilidade qualitativa
- **Classificação: alta** quando as datas documentais confirmam transcurso de mais de 3 anos da constatação até a lavratura; média/baixa quando o termo inicial é controvertido.

## 13. Fontes
- Elaboração EJC — conteúdo estrutural original.
- Lista confiável de fundamentos EJC (Decreto 6.514/2008 — decadência 3 anos; CF/88 art. 5º LV).`
}),

// ============ TESE 3 ============
tese({
  slug: "tese-ausencia-materialidade-ai-ambiental",
  nomeTese: "Ausência de materialidade da infração ambiental",
  subassunto: "Materialidade e prova do fato",
  probabilidade: "média",
  prazo: "Defesa administrativa em 20 dias (Decreto 6.514/2008, art. 141 [VALIDAR ARTIGO])",
  docsCriticos: ["Laudo técnico", "Fotos e vídeos da fiscalização", "Auto de constatação"],
  tagsExtra: ["materialidade", "prova", "laudo"],
  conteudo: `# TESE DE DEFESA — Ausência de materialidade da infração ambiental

## 1. Classificação
- **Área:** ambiental | **Subárea:** defesa em autos de infração
- **Natureza:** tese de mérito (falta de prova do fato)

## 2. Problema jurídico
Toda sanção ambiental exige prova da existência material da infração: o fato deve ser demonstrado objetivamente, por laudo técnico ou elementos equivalentes. Não basta afirmar genericamente que houve "degradação" — é preciso indicar o que foi degradado, onde, em que extensão, e qual o dano ou risco concreto. Quando o auto se apoia apenas em impressões do agente fiscal, em denúncia anônima não confirmada, ou em laudo que não descreve metodologia, o nexo entre a conduta e o suposto dano fica sem lastro, e a multa não pode subsistir.

## 3. Hipótese de aplicação
Cabível quando:
1. Não há laudo técnico cirúrgico (área, coordenada, extensão, tipo de dano).
2. O laudo existente é contraditório, sem metodologia ou sem assinatura de responsável técnico.
3. As fotografias não permitem identificar o local ou a autoria.
4. O "dano" é meramente potencial/abstrato sem demonstração técnica mínima, quando a norma exige dano material.
5. A atividade exercida é licenciada e a alegação refere-se a supressão/uso fora dos termos, sem prova concreta.

## 4. Fundamentação legal
- **CF/88, art. 5º, LV** — ampla defesa e contraditório; verdade processual exige prova.
- **Decreto 6.514/2008** — a apuração de infração envolve constatação e instrução com laudo/prova da materialidade.
- **CC, art. 186 e art. 927** — a responsabilidade civil exige ato ilícito e dano; por analogia argumentativa, sem dano provado não há reparação nem sanção reparatória.
- **Lei 6.938/1981, art. 14, §1º** — responsabilidade objetiva pressupõe atividade, dano e nexo; ausência de dano afasta a pretensão indenizatória correspondente.

## 5. Fundamentação jurisprudencial (sem números)
Entendimento consolidado de que o ato sancionatório ambiental exige prova da materialidade, admitindo-se, contudo, inferências razoáveis a partir de documentos e imagens quando robustas; a ausência total de prova técnica ou documental impede a multa. (Confirmar julgados antes de citar.)

${AVISO}

## 6. Requisitos de aplicabilidade
1. Demonstração de que o acervo probatório não descreve o fato concreto.
2. Impugnação técnica específica do laudo (apontar lacunas metodológicas, falta de medição, ausência de georreferenciamento).
3. Contraprova do autuado (fotos próprias, parecer técnico particular, imagens de satélite) quando possível.

## 7. Documentos necessários
| Documento | Finalidade | Obrigatório? |
| --- | --- | --- |
| Laudo do órgão (integral) | Impugnar metodologia e conclusões | Sim |
| Fotos/vídeos da fiscalização | Verificar identificação do local/fato | Sim |
| Parecer técnico particular (engenheiro florestal/ambiental) | Contraprova | Fortemente recomendado |
| Imagens de satélite/histórico da área | Demonstração de ausência de alteração | Recomendado |
| Licenças e documentos da atividade | Mostrar regularidade operacional | Recomendado |

## 8. Riscos e limites
- Responsabilidade ambiental é objetiva: dificuldade probatória NÃO é escudo absoluto; a fiscalização pode instruir depois com novo laudo.
- Contraprova fraca pode consolidar a versão fiscal.
- Em infrações permanentes ou contínuas, a fiscalização pode refazer a constatação — pedir definição clara do fato imputado.

## 9. Argumentos contrários × contra-argumentos
| Argumento do órgão autuador | Contra-argumento do autuado |
| --- | --- |
| A presença do fiscal no local é prova suficiente | A presença comprova a visita, não o dano; sem descrição técnica não há materialidade |
| O laudo é presunção técnica válida | Presunção exige elementos objetivos (medidas, metodologia, assinatura); laudo genérico não se sustenta |
| O ônus da prova é do autuado | No processo sancionador, a prova do fato é da administração; o autuado apenas se defende |

## 10. Estratégia processual sugerida
1. Requerer acesso integral ao processo (laudo completo, anexos, fotos).
2. Apresentar contraprova técnica em 20 dias, com parecer assinado por profissional habilitado.
3. Requerer diligência inspectiva nova, se útil, com acompanhamento do autuado.
4. Subsidiariamente, discutir dosimetria e proporcionalidade.

## 11. Pedidos possíveis
- Cancelamento do AI por ausência de materialidade.
- Realização de nova perícia/diligência com acompanhamento.
- Insubsistência da multa e demais sanções correlatas.

## 12. Probabilidade qualitativa
- **Classificação: média.** Alta quando não há laudo nenhum ou ele é objetivamente contraditório; baixa quando há laudo técnico consistente que só se impugna retoricamente.

## 13. Fontes
- Elaboração EJC — conteúdo estrutural original.
- Lista confiável de fundamentos EJC (CF/88 art. 5º LV; Lei 6.938/1981 art. 14 §1º; CC arts. 186, 927).`
}),

// ============ TESE 4 ============
tese({
  slug: "tese-in-dubio-pro-natura-ai-ambiental",
  nomeTese: "In dubio pro natura na dúvida probatória do AI",
  subassunto: "Interpretação favorável ao meio ambiente",
  probabilidade: "média",
  prazo: "Defesa administrativa em 20 dias (Decreto 6.514/2008, art. 141 [VALIDAR ARTIGO])",
  docsCriticos: ["AI", "Laudo", "Provas do autuado"],
  tagsExtra: ["in-dubio-pro-natura", "stj"],
  conteudo: `# TESE DE DEFESA — In dubio pro natura (interpretação em benefício do meio ambiente)

## 1. Classificação
- **Área:** ambiental | **Subárea:** defesa em autos de infração e interpretação de normas ambientais
- **Natureza:** tese interpretativa subsidiária

## 2. Problema jurídico
O princípio do in dubio pro natura orienta que, havendo dúvida na interpretação da norma ou na valoração das provas, deve prevalecer a solução que melhor proteja o meio ambiente. Na defesa do autuado, a tese opera em duas frentes: (i) na interpretação de normas e termos técnicos — a dúvida sobre o sentido da exigência normativa não pode ser resolvida em prejuízo de quem a ela se sujeita de boa-fé; e (ii) na dúvida probatória — quando os elementos não permitem certeza sobre autoria, extensão do dano ou existência da infração, a incerteza não pode ser convertida em punição. O EJC registra: o in dubio pro natura é entendimento consolidado no STJ em sua aplicação interpretativa e probatória (sem citação de número — validar julgado específico no painel oficial antes de qualquer peça).

## 3. Hipótese de aplicação
Cabível quando:
1. A norma imputada é ambígua quanto à conduta exigida ou proibida.
2. As provas permitem interpretações concorrentes (fato ocorreu ou não; extensão menor ou maior).
3. Há dúvida sobre qual norma específica incide, com sanções diferentes.
4. A dúvida favorece a preservação ambiental ou a absolvência do autuado, simultaneamente.

## 4. Fundamentação legal
- **CF/88, art. 225** — dever de proteção do meio ambiente; fundamento axiológico do in dubio pro natura.
- **CF/88, art. 5º, LV** — a dúvida probatória não pode ser resolvida contra o acusado em processo sancionador.
- **Lei 9.605/1998, arts. 2º-3º e 70-76D** — regime de sanções; aplicação exige certeza do enquadramento.
- **Decreto 6.514/2008** — instrução processual deve delimitar o fato; dúvida insanável impede punição.

## 5. Fundamentação jurisprudencial (sem números)
- STJ: consolidação do in dubio pro natura como critério hermenêutico do Direito Ambiental (aplicado tanto para proteger o ecossistema quanto para afastar punições quando a prova é dúbia).
- Consolidado também: em direito penal ambiental, a dúvida favorece o réu (corolário da presunção de inocência) e, em direito administrativo sancionador, exige-se menor grau de certeza que o penal, mas sempre superior à mera suspeita.
- ATENÇÃO EJC: nunca citar número de julgado/súmula sem verificação no painel oficial; descrever o entendimento qualitativamente.

${AVISO}

## 6. Requisitos de aplicabilidade
1. Demonstração objetiva da dúvida (duas leituras plausíveis da norma ou da prova).
2. Indicação da solução que simultaneamente protege o ambiente e o autuado de punição indevida.
3. Não ser caso de dúvida meramente estratégica fabricada pela defesa.

## 7. Documentos necessários
| Documento | Finalidade | Obrigatório? |
| --- | --- | --- |
| AI e norma aplicada | Demonstrar ambiguidade do enquadramento | Sim |
| Laudo e anexos | Demonstrar dúvida probatória | Sim |
| Parecer técnico | Suportar a leitura alternativa | Recomendado |
| Documentação de boa-fé do autuado (licenças, histórico) | Reforçar interpretação favorável | Recomendado |

## 8. Riscos e limites
- O órgão pode argumentar que a dúvida deve gerar mais fiscalização, não menos sanção.
- Se a prova é forte contra o autuado, invocar dúvida soa artificial e mina credibilidade da defesa.
- A tese é subsidiária: nunca deve ser a única — combinar com nulidade, decadência, materialidade.

## 9. Argumentos contrários × contra-argumentos
| Argumento do órgão autuador | Contra-argumento do autuado |
| --- | --- |
| In dubio pro natura serve ao ambiente, não ao infrator | Quando a prova é dúbia, punir incerto viola garantia constitucional E não protege o ambiente; a proteção real é fiscalizar com técnica |
| A norma tem sentido claro | Demonstrar com doutrina e comparação de regulamentos que há mais de uma leitura razoável |
| Presunção de legitimidade do ato | Presunção é relativa; cede diante de dúvida objetiva documentada nos autos |

## 10. Estratégia processual sugerida
1. Usar como tese subsidiária após preliminares.
2. Estruturar a defesa em "árvore de decisões": se reconhecido o fato, discutir extensão; se reconhecida a extensão, discutir dosimetria.
3. Ancorar em parecer técnico independente.

## 11. Pedidos possíveis
- Rejeição do enquadramento por ambiguidade não sanável.
- Absolvição administrativa por dúvida probatória.
- Redução da extensão imputada (efeito prático na dosimetria da multa).

## 12. Probabilidade qualitativa
- **Classificação: média.** Depende da qualidade da contraprova; alta em casos de ambiguidade normativa real e baixa quando a prova fiscal é robusta.

## 13. Fontes
- Elaboração EJC — conteúdo estrutural original.
- Lista confiável de fundamentos EJC (CF/88 art. 225 e art. 5º LV; Lei 9.605/1998 arts. 2º-3º e 70-76D).`
}),

// ============ TESE 5 ============
tese({
  slug: "tese-erro-sobre-proibicao-ai-ambiental",
  nomeTese: "Erro sobre a proibição (erro de tipo e de proibição) em infração ambiental",
  subassunto: "Culpabilidade e erro do agente",
  probabilidade: "baixa",
  prazo: "Defesa administrativa em 20 dias (Decreto 6.514/2008, art. 141 [VALIDAR ARTIGO])",
  docsCriticos: ["Licenças anteriores", "Pareceres técnicos recebidos", "Correspondências com o órgão"],
  tagsExtra: ["erro", "culpabilidade", "boa-fe"],
  conteudo: `# TESE DE DEFESA — Erro sobre a proibição em infração ambiental

## 1. Classificação
- **Área:** ambiental | **Subárea:** defesa em autos de infração
- **Natureza:** tese de exclusão/atenuação da culpabilidade sancionatória

## 2. Problema jurídico
A sanção administrativa (como a responsabilidade penal ambiental, regida pela Lei 9.605/1998) pressupõe, ao menos em certa medida, a possibilidade de o agente conhecer a proibição. O autuado que agiu com base em licença válida, parecer técnico oficial, autorização provisória ou orientação expressa do próprio órgão ambiental não age com a consciência da ilicitude que a punição plena pressupõe. Reconhecido o erro sobre a proibição (ou erro de tipo sobre elementos do fato), a sanção deve ser afastada ou reduzida, conforme a inevitabilidade do erro.

## 3. Hipótese de aplicação
Cabível quando o autuado demonstra:
1. Possuir licença, autorização ou alvará emitido pelo próprio órgão que depois o autua, e a conduta se enquadra nos termos daquele título.
2. Ter consultado formalmente o órgão e recebido orientação escrita que autorizava a prática.
3. Alteração posterior de regulamento ou entendimento que transformou conduta lícita em ilícita sem adaptação razoável de transição.
4. Erro de fato escusável sobre elementos materiais (ex.: localização de limites de reserva legal em certidões oficiais equivocadas).

## 4. Fundamentação legal
- **Lei 9.605/1998, arts. 2º-3º** — requisitos de imputação; a pessoa jurídica só responde quando a conduta configurada é comprovada e vinculada a interesse/benefício da entidade.
- **Lei 9.605/1998, art. 18** — mecanismos de atenuação/substituição de penas, indicando a graduação da resposta estatal conforme a culpabilidade.
- **Lei 9.605/1998, art. 14** — circunstâncias atenuantes (arrependimento, reparação) — princípio que se estende argumentativamente à esfera administrativa.
- **CF/88, art. 5º, LV** — devido processo e defesa.
- Dispositivo específico sobre erro no regulamento administrativo aplicável: [DISPOSITIVO A VALIDAR].

## 5. Fundamentação jurisprudencial (sem números)
Entendimento geral consolidado: a responsabilidade ambiental é objetiva no plano civil, mas a esfera sancionatória (penal e administrativa) admite discussão de culpabilidade e erro — a existência de título autorizativo emitido pelo próprio Estado pesa contra a punição do particular que o seguiu de boa-fé. (Validar julgados antes de citar.)

${AVISO}

## 6. Requisitos de aplicabilidade
1. Prova documental da fonte do erro (licença, parecer, ofício, certidão).
2. Demonstração de escusabilidade: o erro seria inevitável para um leigo razoável no setor.
3. Ausência de má-fé (não houve simulação ou contorno deliberado de exigência).

## 7. Documentos necessários
| Documento | Finalidade | Obrigatório? |
| --- | --- | --- |
| Licença/autorização/parecer invocado | Provar a fonte do erro | Sim |
| Protocolos e respostas do órgão | Provar consulta formal | Sim, quando houver |
| Histórico de fiscalizações anteriores favoráveis | Demonstrar confiança legítima | Recomendado |
| Contrato com consultor técnico | Contextualizar diligência do autuado | Opcional |

## 8. Riscos e limites
- Tese de baixa probabilidade quando a norma era de conhecimento universal (ex.: proibição generalíssima de desmate em APP).
- O órgão costuma sustentar que "a licença de uma atividade não licencia outra".
- Se o autuado tem histórico de infrações, a boa-fé fica comprometida.

## 9. Argumentos contrários × contra-argumentos
| Argumento do órgão autuador | Contra-argumento do autuado |
| --- | --- |
| Ignorância da lei não é escusa | Não é ignorância da lei: é confiança legítima em ato estatal específico (licença/parecer) que autorizava a conduta |
| Responsabilidade ambiental é objetiva | A objetividade é regra do plano civil; no plano sancionador, erro sobre proibição incide na graduação e na própria imputação |
| A licença tinha escopo diverso | Demonstração por documentos de que a conduta autuada estava dentro do objeto autorizado |

## 10. Estratégia processual sugerida
1. Centralizar a defesa na prova documental do título autorizativo (nunca só na alegação subjetiva).
2. Pedir, subsidiariamente, atenuação máxima (gradação da multa, Lei 9.605/1998 art. 18 como parâmetro e Decreto 6.514/2008 nos critérios de gradação [DISPOSITIVO A VALIDAR]).
3. Em paralelo, requerer ao próprio órgão a retificação/revisão da licença, criando prova de boa-fé.

## 11. Pedidos possíveis
- Cancelamento do AI por inexigibilidade de sanção (erro escusável).
- Redução substantiva da multa por atenuação da culpabilidade.
- Suspensão da exigibilidade até decisão sobre o título autorizativo.

## 12. Probabilidade qualitativa
- **Classificação: baixa** (média quando existe licença/parecer emitido pelo próprio órgão autuador cobrindo a conduta).

## 13. Fontes
- Elaboração EJC — conteúdo estrutural original.
- Lista confiável de fundamentos EJC (Lei 9.605/1998 arts. 2º-3º, 14, 18; CF/88 art. 5º LV).`
}),

// ============ TESE 6 ============
tese({
  slug: "tese-atenuacao-multa-proporcionalidade-ambiental",
  nomeTese: "Atenuação da multa ambiental — gradação e proporcionalidade",
  subassunto: "Dosimetria e proporcionalidade",
  probabilidade: "alta",
  prazo: "Defesa administrativa em 20 dias (Decreto 6.514/2008, art. 141 [VALIDAR ARTIGO])",
  docsCriticos: ["AI com valor da multa", "Documentos de porte econômico", "Prova de regularização/reparação"],
  tagsExtra: ["dosimetria", "proporcionalidade", "multa"],
  conteudo: `# TESE DE DEFESA — Atenuação da multa ambiental (gradação e proporcionalidade)

## 1. Classificação
- **Área:** ambiental | **Subárea:** defesa em autos de infração
- **Natureza:** tese de mérito quantitativa (dosimetria)

## 2. Problema jurídico
A multa ambiental deve observar estrita gradação: a sanção deve considerar a gravidade do fato, os antecedentes do infrator, a situação econômica e a extensão do dano (regime da Lei 9.605/1998, arts. 70-76D, e critérios do Decreto 6.514/2008). Multas calculadas no patamar máximo sem demonstração de agravantes, ou desproporcionais à extensão real do dano, violam o princípio da proporcionalidade e podem — e devem — ser rebaixadas na defesa administrativa. A tese raramente anula o AI sozinha, mas é a que mais produz economia concreta ao cliente e tem altíssima aderência comprovável nos dados do próprio órgão (avaliar caso a caso, sem inventar percentuais).

## 3. Hipótese de aplicação
Cabível quando:
1. O valor da multa foi calculado no teto sem indicação motivada de agravantes.
2. Há discordância sobre a unidade de medida/hectares/metros cúbicos utilizados no cálculo.
3. O autuado é reincidente "de ofício" por autos cancelados ou antigos, sem análise real.
4. A situação econômica e o porte da atividade não foram considerados.
5. Houve reparação espontânea ou regularização superveniente ignorada no cálculo.

## 4. Fundamentação legal
- **Lei 9.605/1998, arts. 70-76D** — sistema de sanções administrativas; gradação de multas conforme gravidade, antecedentes e porte econômico.
- **Lei 9.605/1998, art. 14 e art. 18** — circunstâncias atenuantes e substituição de penas (parâmetro interpretativo para a esfera administrativa).
- **Decreto 6.514/2008** — critérios de gradação da multa (conferir artigos específicos: [DISPOSITIVO A VALIDAR]).
- **CF/88, art. 5º, LV** — proporcionalidade como corolário do devido processo.

## 5. Fundamentação jurisprudencial (sem números)
Entendimentos consolidados: (i) a dosimetria ambiental exige motivação qualificada para o patamar máximo; (ii) reincidentes só se consideram, em regra, as infrações definitivas (não canceladas); (iii) a extensão do dano deve ser medida objetivamente; (iv) multa deve guardar proporcionalidade com a capacidade econômica. (Validar julgados no painel oficial antes de citar.)

${AVISO}

## 6. Requisitos de aplicabilidade
1. Cálculo refeito (parecer econômico/contábil quando cabível) demonstrando distorção.
2. Documentos de porte econômico (balanço, faturamento) quando a tese de proporcionalidade econômica for usada.
3. Prova de atenuantes concretas: reparação, colaboração, primariedade.

## 7. Documentos necessários
| Documento | Finalidade | Obrigatório? |
| --- | --- | --- |
| AI com memória de cálculo | Analisar parâmetros da dosimetria | Sim |
| Balanço/faturamento do autuado | Proporcionalidade econômica | Recomendado |
| Documentos de reparação (projetos, notas, fotos) | Atenuação | Recomendado |
| Certidões/consultas de antecedentes administrativos | Impugnar reincidência | Recomendado |

## 8. Riscos e limites
- Não invalida a infração: o cliente continua autuado; comunicar expectativa corretamente.
- Se o cálculo estiver tecnicamente correto, resta apenas discussão de mérito da infração.
- Cuidado com renúncia implícita: discutir só dosimetria pode ser lido como aceitação da infração — sempre formular pedidos subsidiários.

## 9. Argumentos contrários × contra-argumentos
| Argumento do órgão autuador | Contra-argumento do autuado |
| --- | --- |
| A tabela de gradação foi aplicada corretamente | Tabela exige valoração motivada dos parâmetros; aplicação automática é vício de dosimetria |
| A reincidência eleva o patamar | Impugnar reincidência sem decisão definitiva prévia |
| O dano tem grande extensão | Contraprova de medição e parecer técnico rebaixando a extensão |

## 10. Estratégia processual sugerida
1. Sempre apresentar dosimetria como tese subsidiária à de mérito.
2. Apresentar contracálculo documentado.
3. Negociar conversão de multa em medida compensatória quando o regulamento admitir (verificar: [DISPOSITIVO A VALIDAR]).

## 11. Pedidos possíveis
- Redução do valor da multa para o patamar mínimo.
- Exclusão de agravantes (reincidência, valoração indevida de extensão).
- Substituição/conversão da sanção quando cabível.

## 12. Probabilidade qualitativa
- **Classificação: alta** quando o cálculo ignora atenuantes ou usa extensão inflada; média quando a dosimetria foi razoável.

## 13. Fontes
- Elaboração EJC — conteúdo estrutural original.
- Lista confiável de fundamentos EJC (Lei 9.605/1998 arts. 70-76D, 14, 18; Decreto 6.514/2008).`
}),

// ============ TESE 7 ============
tese({
  slug: "tese-ilegitimidade-competencia-orgao-autuador",
  nomeTese: "Ilegitimidade e incompetência do órgão autuador",
  subassunto: "Competência federativa e legitimidade ativa",
  probabilidade: "média",
  prazo: "Defesa administrativa em 20 dias (Decreto 6.514/2008, art. 141 [VALIDAR ARTIGO])",
  docsCriticos: ["AI", "Atos normativos de criação do órgão", "Localização geográfica da infração"],
  tagsExtra: ["competencia", "legitimidade", "federativismo"],
  conteudo: `# TESE DE DEFESA — Ilegitimidade e incompetência do órgão autuador

## 1. Classificação
- **Área:** ambiental | **Subárea:** defesa em autos de infração
- **Natureza:** tese de forma (competência federativa e institucional)

## 2. Problema jurídico
A fiscalização ambiental é exercida por entes distintos conforme o bem protegido: a União atua em bens e atividades de sua competência (incluindo casos com licença federal, terras federais, unidades de conservação federais e potencial de impacto regional ou multinacional); os estados e municípios atuam nos demais casos, por licenciamento local. Órgão sem competência sobre o fato autuado pratica ato viciado — a sanção dele decorrente é nula. A tese exige mapeamento preciso: quem licenciou a atividade? onde está o bem? qual o impacto? A resposta define o órgão legitimado.

## 3. Hipótese de aplicação
Cabível quando:
1. O licenciamento da atividade é estadual/municipal e o órgão autuador é federal (ou vice-versa), sem hipótese legal de atuação supletiva.
2. A infração ocorreu em bem de domínio de outro ente.
3. Órgão autua sem previsão legal de competência (criação irregular ou atuação extraterritorial).
4. Duplicidade: dois órgãos autuam pelo mesmo fato (impugnar bis in idem e indicar competente).

## 4. Fundamentação legal
- **CF/88, art. 225** — competência comum à proteção do meio ambiente, com repartição de papéis pela legislação de licenciamento/fiscalização.
- **Lei 9.605/1998, arts. 70-76D** — sanções aplicáveis pela autoridade ambiental competente.
- **Decreto 6.514/2008** — âmbito federal de aplicação; competência do IBAMA/órgãos federais nos casos previstos.
- Regulamento estadual de competência do órgão autuador: [DISPOSITIVO A VALIDAR].

## 5. Fundamentação jurisprudencial (sem números)
Consolidado: a competência para licenciar e fiscalizar decorre do bem, do local e da natureza do impacto; o licenciamento pelo ente menor (com ou sem adaptação) afasta, em regra, a fiscalização pelo ente maior para o mesmo fato, salvo situações legais específicas de atuação supletiva. (Validar antes de citar julgado.)

${AVISO}

## 6. Requisitos de aplicabilidade
1. Demonstração documental do regime de licenciamento da atividade (licenças existentes e ente emissor).
2. Localização georreferenciada do fato (onde está o bem — federais/estaduais/municipais).
3. Demonstração de ausência de hipótese legal de atuação do órgão autuador.

## 7. Documentos necessários
| Documento | Finalidade | Obrigatório? |
| --- | --- | --- |
| Licenças e autorizações da atividade | Identificar ente licenciador | Sim |
| Matrícula/CCIR/localização do imóvel | Identificar domínio do bem | Sim |
| Atos normativos do órgão autuador | Verificar base legal de atuação | Sim |
| Georreferenciamento do fato | Localizar competência | Recomendado |

## 8. Riscos e limites
- O sistema de licenciamento ambientalmente adaptado pode legitimar o ente local, mas há exceções — estudar caso concreto.
- Tese técnica: exige boa instrução; alegada sem prova vira formalismo descartável.
- Vitória aqui não afasta nova autuação pelo órgão competente — gerenciar expectativa do cliente.

## 9. Argumentos contrários × contra-argumentos
| Argumento do órgão autuador | Contra-argumento do autuado |
| --- | --- |
| Competência comum permite atuação de qualquer ente | Competência comum não é ilimitada: a legislação reparte papéis; suprimento só nas hipóteses previstas |
| A infração tem repercussão regional | Demonstrar, com laudo e licenciamento, o âmbito local do impacto |
| Atuação em razão de convênio delegado | Exigir prova do convênio vigente e da adesão do fato autuado ao seu objeto |

## 10. Estratégia processual sugerida
1. Mapear "árvore de competência" do caso antes de protocolar.
2. Preliminar de incompetência + comunicação ao órgão presumidamente competente (estrategicamente, avaliar antes se ele também pretenderá multar).
3. Se autuação dupla, propor ao cliente a defesa centralizada e o pedido de uniformização.

## 11. Pedidos possíveis
- Anulação do AI por incompetência do órgão autuador.
- Remessa dos autos ao órgão competente, com preservação do direito de defesa.
- Reconhecimento de bis in idem na autuação duplicada.

## 12. Probabilidade qualitativa
- **Classificação: média.** Alta em situações de fronteira federativa clara (ex.: licença federal presente e autuação municipal sem base); baixa quando há convênio vigente demonstrável.

## 13. Fontes
- Elaboração EJC — conteúdo estrutural original.
- Lista confiável de fundamentos EJC (CF/88 art. 225; Lei 9.605/1998 arts. 70-76D; Decreto 6.514/2008).`
}),

// ============ TESE 8 ============
tese({
  slug: "tese-vicios-dosimetria-multa-ambiental",
  nomeTese: "Vícios na dosimetria da multa ambiental",
  subassunto: "Dosimetria — vícios de cálculo e motivação",
  probabilidade: "alta",
  prazo: "Defesa administrativa em 20 dias (Decreto 6.514/2008, art. 141 [VALIDAR ARTIGO])",
  docsCriticos: ["Memória de cálculo do AI", "Tabela de gradação aplicável", "Laudo de extensão do dano"],
  tagsExtra: ["dosimetria", "calculo", "multa"],
  conteudo: `# TESE DE DEFESA — Vícios na dosimetria da multa ambiental

## 1. Classificação
- **Área:** ambiental | **Subárea:** defesa em autos de infração
- **Natureza:** tese técnica de revisão quantitativa (distinta da tese genérica de proporcionalidade — aqui atacam-se erros objetivos do cálculo)

## 2. Problema jurídico
A multa ambiental decorre da aplicação de regras de gradação (Lei 9.605/1998, arts. 70-76D; Decreto 6.514/2008): valor-base por unidade, multiplicadores por gravidade, agravantes, atenuantes e limite. Erros objetivos — dupla valoração do mesmo agravante (ex.: extensão usada tanto para definir o número de unidades quanto para majorar o patamar), aplicação de multiplicador sem motivação, contagem errada de hectares/unidades, uso de reincidência inexistente ou de infração cancelada — tornam o cálculo ilegal e o valor exigível deve ser refeito ou anulado.

## 3. Hipótese de aplicação
Cabível quando há:
1. Dupla valoração de parâmetro (extensão, gravidade) no cálculo.
2. Divergência entre a extensão do laudo e a usada no cálculo.
3. Multiplicador máximo aplicado sem motivação individualizada.
4. Reincidência computada com base em autos não definitivos, cancelados ou prescritos.
5. Erro aritmético ou de tabela (patamar errado, unidade de medida errada).
6. Superposição de sanções (multa + embargo) usando o mesmo fundamento para resultados distintos sem previsão.

## 4. Fundamentação legal
- **Lei 9.605/1998, arts. 70-76D** — estrutura das multas e limites.
- **Lei 9.605/1998, art. 14 e art. 18** — atenuantes e substituição (parâmetros de gradação).
- **Decreto 6.514/2008** — gradação e critérios (conferir artigos: [DISPOSITIVO A VALIDAR]).
- **CC, art. 944** — a indenização mede-se pela extensão do dano: a sanção não pode ultrapassar o prejuízo demonstrado (argumento por analogia).

## 5. Fundamentação jurisprudencial (sem números)
Consolidado nos tribunais: a imposição do patamar máximo exige motivação analítica; parâmetros não podem ser valorados duas vezes; a reincidência pressupõe sanção definitiva. (Validar julgados antes de citar.)

${AVISO}

## 6. Requisitos de aplicabilidade
1. Decomposição matemática completa do cálculo do AI (tabela própria da defesa).
2. Identificação objetiva do erro (linha, parâmetro, fórmula).
3. Contracálculo demonstrando o valor correto.

## 7. Documentos necessários
| Documento | Finalidade | Obrigatório? |
| --- | --- | --- |
| Memória de cálculo do AI | Decompor parâmetros | Sim |
| Laudo de extensão do dano | Confrontar medidas | Sim |
| Tabela de gradação vigente na lavratura | Verificar patamares | Sim |
| Documentos de antecedentes | Impugnar reincidência | Recomendado |

## 8. Riscos e limites
- Requer familiaridade com a tabela do órgão (federal × estadual diferem) — usar parecer técnico.
- Revisão de cálculo não encerra discussão de mérito; combinar com teses de fundo.
- Risco de a fiscalização "corrigir" o cálculo para patamar intermediário — gerir expectativa de redução máxima.

## 9. Argumentos contrários × contra-argumentos
| Argumento do órgão autuador | Contra-argumento do autuado |
| --- | --- |
| O cálculo seguiu a tabela padrão | Tabela não dispensa motivação nem impede dupla valoração ilegal |
| A extensão foi medida no laudo | Se laudo e cálculo divergem, prevalece o laudo; cálculo com medida diversa é ilegal |
| Reincidência está registrada no sistema | Registro administrativo não é sanção definitiva; exige-se decisão transitada/irrecorrível |

## 10. Estratégia processual sugerida
1. Apresentar planilha de decomposição do cálculo com o contracálculo.
2. Combinar sempre com tese de proporcionalidade e de mérito (subsidiariedade).
3. Em caso de indeferimento, recorrer administrativamente mantendo a planilha em primeira mão.

## 11. Pedidos possíveis
- Refação do cálculo com exclusão dos parâmetros viciados.
- Fixação da multa no mínimo legal.
- Anulação da dosimetria, com reposição da instrução.

## 12. Probabilidade qualitativa
- **Classificação: alta** quando o erro é objetivo e demonstrável aritmeticamente; média quando a discussão é de valoração subjetiva.

## 13. Fontes
- Elaboração EJC — conteúdo estrutural original.
- Lista confiável de fundamentos EJC (Lei 9.605/1998 arts. 70-76D, 14, 18; Decreto 6.514/2008; CC art. 944).`
}),

// ============ TESE 9 ============
tese({
  slug: "tese-regularizacao-superveniente-atenuante",
  nomeTese: "Regularização superveniente como causa de atenuação/extinção da sanção",
  subassunto: "Reparação e regularização",
  probabilidade: "média",
  prazo: "Apresentável a qualquer momento da defesa administrativa; idealmente nos 20 dias (Decreto 6.514/2008, art. 141 [VALIDAR ARTIGO])",
  docsCriticos: ["Licenças requeridas/obtidas", "Projeto de reparação", "Compromisso de ajustamento ou termo administrativo"],
  tagsExtra: ["regularizacao", "atenuante", "reparacao"],
  conteudo: `# TESE DE DEFESA — Regularização superveniente como atenuante

## 1. Classificação
- **Área:** ambiental | **Subárea:** defesa em autos de infração
- **Natureza:** tese atenuante/subsidiária (não ataca a existência da infração — ataca a medida da resposta)

## 2. Problema jurídico
O sistema ambiental valoriza a reparação: a Lei 9.605/1998 (art. 14 — arrependimento e reparação como atenuantes; art. 18 — substituição de penas) e o Decreto 6.514/2008 reconhecem que o infrator que cessa a infração, repara o dano e regulariza sua atividade merece tratamento sancionatório menor. A regularização superveniente — licenciamento protocolado ou obtido, recuperação de área, compensação, conversão de multa em medidas de reparação — deve reduzir a multa, permitir substituição ou até impedir sua agravada aplicação. É tese de grande valor prático: transforma a defesa em plano de regularização, que costuma ser também o interesse real do cliente.

## 3. Hipótese de aplicação
Cabível quando o autuado:
1. Cessou a atividade irregular antes ou logo após a autuação.
2. Protocolou (ou obteve) licenças e autorizações para a atividade.
3. Executou ou contratou recuperação da área degradada.
4. Propôs ou assinou termo/compromisso de reparação junto ao órgão.
5. Tem histórico limpo ou colaborou com a fiscalização.

## 4. Fundamentação legal
- **Lei 9.605/1998, art. 14** — arrependimento, reparação do dano e colaboração como atenuantes.
- **Lei 9.605/1998, art. 18** — substituição de penas por restritivas/perda de bens quando cabível (parâmetro à esfera administrativa).
- **Lei 9.605/1998, arts. 70-76D** — gradação considerando reparação e comportamento do infrator.
- **Decreto 6.514/2008** — mecanismos de conversão de multa em medidas de reparação (verificar artigos: [DISPOSITIVO A VALIDAR]).
- **CF/88, art. 225** — o fim último é a restauração do bem ambiental, não a arrecadação.

## 5. Fundamentação jurisprudencial (sem números)
Consolidado: a reparação integral e o licenciamento subsequente são circunstâncias favoráveis obrigatoriamente consideradas na dosimetria; multa que ignora reparação superveniente já comprovada contraria a finalidade restaurativa da sanção. (Validar antes de citar.)

${AVISO}

## 6. Requisitos de aplicabilidade
1. Prova material da regularização (protocolos numerados, licenças, contratos de recuperação, imagens).
2. Comprovação do vínculo entre a regularização e a infração autuada (a mesma área/atividade).
3. Pedido expresso de aplicação da atenuante com demonstração do momento (antes/depois do AI).

## 7. Documentos necessários
| Documento | Finalidade | Obrigatório? |
| --- | --- | --- |
| Protocolo/definitividade de licenças | Provar regularização | Sim |
| Projeto/contrato/relatório de recuperação | Provar reparação | Sim, quando houver |
| Termo de compromisso ou ajustamento | Provar compromisso formal | Recomendado |
| Imagens comparativas (antes/depois) | Provar cessação e recuperação | Recomendado |

## 8. Riscos e limites
- Não apaga a infração nem garante cancelamento da multa — communicate ao cliente como mitigação.
- Regularização meramente "prometida" tem peso reduzido: documentar o máximo possível.
- Cuidado: licença para atividade que se pretende manter pode contradizer defesa de "cessação" — alinhar narrativa.

## 9. Argumentos contrários × contra-argumentos
| Argumento do órgão autuador | Contra-argumento do autuado |
| --- | --- |
| A regularização é obrigação, não atenuante | A obrigação existe, mas sua execução espontânea e comprovada é atenuante expressa (Lei 9.605/1998, art. 14) |
| A reparação não está concluída | Comprovar início efetivo, investimento e cronograma — atenuação parcial é devida |
| A multa tem função pedagógica preventiva | Pedagogia já se satisfez com a autuação e a regularização em curso; manter multa máxima anula o estímulo legal à reparação |

## 10. Estratégia processual sugerida
1. Montar dossiê de regularização em paralelo à defesa (projetos, protocolos, imagens).
2. Pedir expressamente a aplicação de atenuantes + conversão quando cabível.
3. Negociar termo administrativo formalizando cronograma, com redução proporcional.

## 11. Pedidos possíveis
- Aplicação das atenuantes com redução da multa.
- Conversão da multa em medidas de reparação (quando o regulamento admitir).
- Suspensão da exigibilidade até conclusão da regularização.

## 12. Probabilidade qualitativa
- **Classificação: média** (alta quando a reparação é integral, comprovada e anterior à decisão administrativa).

## 13. Fontes
- Elaboração EJC — conteúdo estrutural original.
- Lista confiável de fundamentos EJC (Lei 9.605/1998 arts. 14, 18, 70-76D; Decreto 6.514/2008; CF/88 art. 225).`
}),

// ============ TESE 10 ============
tese({
  slug: "tese-ausencia-nexo-causal-ambiental",
  nomeTese: "Ausência de nexo causal entre a conduta e o dano ambiental",
  subassunto: "Nexo causal e autoria",
  probabilidade: "média",
  prazo: "Defesa administrativa em 20 dias (Decreto 6.514/2008, art. 141 [VALIDAR ARTIGO])",
  docsCriticos: ["Laudo", "Prova de domínio/posse", "Histórico de terceiros na área", "Imagens de satélite"],
  tagsExtra: ["nexo-causal", "autoria", "causalidade"],
  conteudo: `# TESE DE DEFESA — Ausência de nexo causal em infração ambiental

## 1. Classificação
- **Área:** ambiental | **Subárea:** defesa em autos de infração
- **Natureza:** tese de mérito (elemento do ilícito)

## 2. Problema jurídico
A responsabilidade ambiental — ainda que objetiva (Lei 6.938/1981, art. 14, §1º) e lastreada na teoria do risco — exige nexo causal entre a conduta do autuado e o dano apurado. A objetividade afasta a discussão de culpa, mas não dispensa a demonstração de que FOI AQUELE AGENTE quem praticou o fato ou de quem é a área. Autos que multam o proprietário por dano de terceiro sem investigação mínima de autoria, ou que atribuem a um operador dano cuja origem é outra atividade vizinha, carecem do elemento causal e devem ser cancelados. O contributo do autuado (informar quem praticou, pedir apuração de terceiros) é relevante e pode até reorganizar a autuação.

## 3. Hipótese de aplicação
Cabível quando:
1. O dano foi causado por terceiro (invaders, arrendatários, vizinhos) e não há apuração mínima.
2. A área autuada não pertence ao autuado ou o fato ocorreu fora dos limites do imóvel.
3. Há outra atividade no entorno capaz de explicar o dano (contaminação difusa) e o laudo não isola a origem.
4. A conduta autuada é materialmente incapaz de produzir o dano descrito (ex.: pastoreio extensivo vs. corte de floresta).

## 4. Fundamentação legal
- **Lei 6.938/1981, art. 14, §1º** — responsabilidade objetiva: atividade + dano + nexo; sem nexo, sem responsabilidade.
- **CC, arts. 186, 927 e 944** — ilícito, responsabilidade e medida do dano pela extensão (apoio argumentativo).
- **CF/88, art. 5º, LV** — ninguém responde por fato que não lhe é atribuível sem direito de demonstrar.
- **Lei 9.605/1998, arts. 2º-3º** — imputação exige conduta vinculada ao agente (pessoa física/jurídica).

## 5. Fundamentação jurisprudencial (sem números)
Consolidado: a responsabilidade objetiva ambiental não dispensa o nexo causal; proprietário responde por omissão/omissão de dever de cuidado quando comprovada, mas a mera propriedade não substitui, automaticamente, a investigação de autoria. (Validar antes de citar.)

${AVISO}

## 6. Requisitos de aplicabilidade
1. Prova do domínio/limites do imóvel (matrícula, georreferenciamento) quando a tese for de localização.
2. Indicação fundamentada de terceiros ou fato externo (BO, notícia de fato, imagens com data).
3. Parecer técnico demonstrando incompatibilidade entre a conduta autuada e o dano descrito.

## 7. Documentos necessários
| Documento | Finalidade | Obrigatório? |
| --- | --- | --- |
| Matrícula e plantas/georreferenciamento | Delimitar a área de responsabilidade | Sim |
| Boletim de ocorrência / comunicação de terceiros | Provar fato de outrem | Recomendado |
| Imagens de satélite históricas | Cronologia do dano | Recomendado |
| Parecer técnico de compatibilidade conduta × dano | Impugnar causalidade | Fortemente recomendado |

## 8. Riscos e limites
- NÃO alegar terceiro sem prova: vira agravante (omissão) e pode configurar denunciação falsa.
- O dano ambiental tem natureza difusa: o Estado pode eleger a quem cobrar em certas hipóteses de guarda — impugnar com técnica, não só com retórica.
- Em dano de origem difusa (contaminação de aquífero), a tese exige perícia robusta.

## 9. Argumentos contrários × contra-argumentos
| Argumento do órgão autuador | Contra-argumento do autuado |
| --- | --- |
| O proprietário responde pelo imóvel | Resposta pressupõe omissão comprovada (dever de cuidado) ou autoria; propriedade não é autoria automática |
| A responsabilidade é objetiva | Objetiva dispensa culpa, NÃO dispensa nexo causal (Lei 6.938/1981, art. 14, §1º) |
| O dano está dentro do imóvel | Demonstração cartorial/tecnológica de que o dano está fora ou em zona não sob guarda do autuado |

## 10. Estratégia processual sugerida
1. Reunir prova de limites e cronologia ANTES da defesa.
2. Comunicar o órgão da autoria de terceiro com prova (isso protege o cliente e às vezes redireciona a autuação).
3. Pedir subsidiariamente a dosimetria correta caso restar alguma responsabilidade.

## 11. Pedidos possíveis
- Cancelamento do AI por ausência de nexo causal.
- Redirecionamento da apuração ao real causador.
- Reconhecimento da responsabilidade apenas parcial/limitada à extensão imputável.

## 12. Probabilidade qualitativa
- **Classificação: média.** Alta quando a prova de limites/terceiro é documental e robusta; baixa quando o dano é inerente à atividade do próprio autuado.

## 13. Fontes
- Elaboração EJC — conteúdo estrutural original.
- Lista confiável de fundamentos EJC (Lei 6.938/1981 art. 14 §1º; CC arts. 186, 927, 944; Lei 9.605/1998 arts. 2º-3º; CF/88 art. 5º LV).`
})
];
