import { baseDoc } from "./_base.mjs";

function fluxo(d) {
  return baseDoc({
    tipoDocumento: "FLUXO",
    area: d.area,
    subarea: d.subarea,
    assunto: d.assunto,
    subassunto: d.subassunto,
    tags: [...d.tagsBase, "fluxo", "P0"],
    metadados: {
      formato: "tabela_markdown",
      colunas: ["Etapa", "Evento", "Prazo", "Providencia", "Responsavel", "DocumentoNecessario", "Risco", "ProximaEtapa"],
      totalEtapas: d.totalEtapas,
      prazoCritico: d.prazoCritico
    },
    conteudo: d.conteudo
  });
}

export const fluxos = [

// ============ FLUXO 1 ============
fluxo({
  slug: "fluxo-auto-infracao-ambiental",
  titulo: "Fluxo — Recebimento de Auto de Infração Ambiental",
  area: "ambiental",
  subarea: "defesa-administrativa-ambiental",
  assunto: "Auto de Infração Ambiental",
  subassunto: "Gestão completa do caso administrativo",
  tagsBase: ["ambiental/auto-infracao"],
  totalEtapas: 12,
  prazoCritico: "Defesa administrativa em 20 dias (Decreto 6.514/2008, art. 141 [VALIDAR ARTIGO])",
  conteudo: `# FLUXO — RECEBIMENTO DE AUTO DE INFRAÇÃO AMBIENTAL

**Prazo crítico:** defesa administrativa em 20 dias da notificação (Decreto 6.514/2008, art. 141 — [VALIDAR ARTIGO]; regulamento estadual pode diferir: validar). **Objetivo:** assegurar defesa tempestiva, tecnicamente instruída e com gestão de expectativa do cliente.

| Etapa | Evento | Prazo | Providência | Responsável | Documento necessário | Risco | Próxima etapa |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Recebimento/notícia do AI | Dia 0 | Protocolar no sistema; fotografar/scannear o documento; registrar data de ciência | Advogado coordenador | AI integral | Perda da data real de ciência (prazo começa a contar) | Etapa 2 |
| 2 | Triagem de urgência | Dia 0 | Aplicar triagem-auto-infracao-ambiental; classificar prioridade | Advogado júnior | Roteiro de triagem | Alocar caso com prazo vencido | Etapa 3 |
| 3 | Análise preliminar do AI | Dia 1-2 | Verificar: nº, data de lavratura, autuado, local, descrição, enquadramento legal, multa, medidas aplicadas (multa/embargo/interdição) | Advogado sênior | AI + anexos | Análise superficial perde vício evidente | Etapa 4 |
| 4 | Teste de decadência | Dia 2 | Montar cronologia: data da constatação × data do AI (3 anos — Decreto 6.514/2008) | Advogado sênior | AI, auto de constatação, BO, imagens | Renúncia tácita à tese mais objetiva | Etapa 5 |
| 5 | Coleta de documentos | Dia 2-8 | Reunir licenças, contratos, fotos do cliente, provas de terceiros, histórico de fiscalizações | Advogado júnior + cliente | Checklist-defesa-ambiental-protocolo | Defesa sem lastro probatório | Etapa 6 |
| 6 | Contraprova técnica | Dia 3-10 | Contratar parecer técnico (eng. florestal/ambiental); visita técnica se necessário | Engenheiro parceiro + advogado | Contrato de serviço técnico, parecer | Sem contraprova, tese de materialidade fica retórica | Etapa 7 |
| 7 | Análise da dosimetria | Dia 5-10 | Decompor o cálculo da multa; conferir gradação (Lei 9.605/1998, arts. 70-76D), reincidência, multiplicadores; elaborar contracálculo | Advogado sênior + calculista | Memória de cálculo do AI | Multa consolidada com valores indevidos | Etapa 8 |
| 8 | Definição de estratégia com cliente | Dia 8-12 | Reunião: teses (alta/média/baixa — qualitativa), custos, expectativas, plano de regularização paralelo | Advogado coordenador + cliente | Termo de instruções | Expectativa inflacionada; conflito futuro | Etapa 9 |
| 9 | Redação da defesa | Dia 10-15 | Usar peca-defesa-administrativa-ambiental; preliminares + mérito + dosimetria subsidiária | Advogado sênior | Modelo de peça + dossiê | Defesa genérica; confissão inadvertida | Etapa 10 |
| 10 | Revisão e checklist | Dia 15-17 | Aplicar checklist-defesa-ambiental-protocolo integralmente; revisão por segundo advogado | Revisor sênior | Checklist assinado | Vazamento de campo, dispositivo não validado | Etapa 11 |
| 11 | Protocolo | Até dia 20 | Protocolar no canal oficial; guardar comprovante; requerer acesso integral ao processo | Advogado júnior | Defesa + anexos | Protocolo falho (sistema fora do ar — não esperar dia 20) | Etapa 12 |
| 12 | Acompanhamento | Contínuo | Monitorar intimações; preparar recurso administrativo (peca-recurso-administrativo-reconsideracao-ambiental) ou plano de regularização conforme decisão | Advogado coordenador | Sistema de prazos | Decisão desfavorável sem recurso por perda de prazo | Recurso ou encerramento com plano de regularização |

## NOTAS OPERACIONAIS
- **Embargo/interdição aplicados com a multa:** avaliar medida cautelar independente (o embargo pode parar a atividade — impacto de negócio maior que a multa); estudar MS com Lei 12.016/2009, art. 23 (120 dias) quando não houver recurso administrativo eficaz.
- **Regularização paralela:** o plano de licenciamento/reparação deve correr em paralelo à defesa — é atenuante (Lei 9.605/1998, art. 14) e frequentemente é o interesse real do cliente.
- **Prorrogação:** verificar se o regulamento do órgão admite prorrogação do prazo de defesa [DISPOSITIVO A VALIDAR]; nunca contar com ela.
- **Autuação duplicada:** mapear se estado e união autuaram pelo mesmo fato (bis in idem — tese-ilegitimidade-competencia-orgao-autuador).
- **Documentos que normalmente faltam:** auto de constatação integral, laudo completo com fotos, comprovante de data de ciência — requisitar por escrito no dia 1.`
}),

// ============ FLUXO 2 ============
fluxo({
  slug: "fluxo-citacao-judicial-civel",
  titulo: "Fluxo — Recebimento de Citação Judicial Cível",
  area: "processual-civil",
  subarea: "resposta-judicial",
  assunto: "Citação e contestação",
  subassunto: "Gestão completa da resposta",
  tagsBase: ["civel/defesa"],
  totalEtapas: 12,
  prazoCritico: "Contestação em 15 dias úteis (CPC, arts. 219 e 335)",
  conteudo: `# FLUXO — RECEBIMENTO DE CITAÇÃO JUDICIAL CÍVEL

**Prazo crítico:** contestação em 15 dias úteis da juntada do comprovante de citação (CPC, arts. 219 e 335). **Objetivo:** responder com defesa completa antes da preclusão, sem confissões inadvertidas.

| Etapa | Evento | Prazo | Providência | Responsável | Documento necessário | Risco | Próxima etapa |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Recebimento da citação/notificação | Dia 0 | Registrar data de juntada do AR no sistema; digitalizar inicial + anexos | Advogado júnior | Mandado/AR + inicial | Perda do termo inicial | Etapa 2 |
| 2 | Triagem | Dia 0-1 | Classificar matéria, valor, urgência (tutela?), conflito de interesses | Advogado coordenador | Sistema de casos | Conflito não detectado | Etapa 3 |
| 3 | Leitura técnica da inicial | Dia 1-2 | Mapear: pedidos, fundamentos, documentos do autor, provas requeridas, valor da causa | Advogado sênior | Inicial + anexos | Ignorar pedido acessório que vira passivo | Etapa 4 |
| 4 | Checagem de tutela de urgência | Dia 1-2 | Identificar se há pedido de tutela e prazo de resposta próprio | Advogado sênior | Inicial | Perder prazo de impugnação de tutela | Etapa 5 |
| 5 | Coleta de provas do réu | Dia 2-7 | Contrato, pagamentos, e-mails, notas; cronologia documental | Advogado júnior + cliente | Checklist-contestacao-civel | Defesa sem contraprova | Etapa 6 |
| 6 | Análise de prescrição | Dia 2-3 | Termo inicial × CC, art. 206, §3º, V (reparação civil: 3 anos); CDC arts. 26-27 quando aplicável | Advogado sênior | Documentos de data | Preliminar perdida por preclusão | Etapa 7 |
| 7 | Mapeamento de preliminares | Dia 3-5 | Incompetência, ilegitimidade, inépcia, caução — TUDO na primeira oportunidade | Advogado sênior | Contratos, cláusulas de foro | Preliminar preclusa | Etapa 8 |
| 8 | Estratégia com cliente | Dia 3-6 | Reunião: hipóteses (reconhecer/reduzir/litigar), custos, riscos, probabilidade qualitativa | Advogado coordenador + cliente | Termo de instruções | Expectativa de "ganhar tudo" | Etapa 9 |
| 9 | Redação da contestação | Dia 5-10 | Usar peca-contestacao-civel-generica; impugnação específica parágrafo a parágrafo | Advogado sênior | Modelo + dossiê | Omissão de impugnação = presunção de veracidade | Etapa 10 |
| 10 | Rol de testemunhas e provas | Junto à contestação | Requerer provas; rol de testemunhas no prazo próprio | Advogado júnior | Lista assinada | Prova oral preclusa | Etapa 11 |
| 11 | Revisão e protocolo | Dia 10-13 | Revisão sênior; conferir campos; protocolar com folga | Revisor + advogado júnior | Checklist | Protocolo no limite do prazo (sistema falha) | Etapa 12 |
| 12 | Acompanhamento | Contínuo | Monitorar: tutela julgada, réplica do autor, audiência de conciliação — preparar presença com poderes e proposta | Advogado coordenador | Proposta de conciliação | Absolutismo na conciliação perde saída econômica | Fase instrutória ou acordo |

## NOTAS OPERACIONAIS
- **Conciliação:** CPC prevê audiência de conciliação — preparar teto e piso da proposta ANTES da audiência.
- **Tutela de urgência deferida:** avaliar agravo imediato e/ou contracautela; o impacto de negócio do réu é o critério de urgência real.
- **Múltiplos réus:** coordenar defesa comum (consórcio de advogados) para evitar contradição entre contestações.
- **Recursos:** se improcedente parcial, avaliar apelação em 15 dias úteis (CPC, art. 1.003, §5º); se procedente contra o cliente, idem.
- **Comunicação com o cliente:** cada evento relevante (tutela, audiência, sentença) comunicado por escrito em 48h.`
}),

// ============ FLUXO 3 ============
fluxo({
  slug: "fluxo-execucao-fiscal-embargos",
  titulo: "Fluxo — Execução Fiscal (defesa via embargos e acompanhamento)",
  area: "tributario",
  subarea: "execucao-fiscal",
  assunto: "Execução fiscal",
  subassunto: "Embargos à execução e acompanhamento",
  tagsBase: ["tributario/execucao-fiscal"],
  totalEtapas: 12,
  prazoCritico: "Embargos: 30 dias (Lei 6.830/1980, art. 16); prescrição intercorrente: Lei 6.830/1980, art. 40",
  conteudo: `# FLUXO — EXECUÇÃO FISCAL (DEFESA VIA EMBARGOS E ACOMPANHAMENTO)

**Prazos críticos:** embargos em 30 dias (Lei 6.830/1980, art. 16); prescrição intercorrente (Lei 6.830/1980, art. 40). **Objetivo:** defesa do devedor com controle de atos executivos (penhora, redirecionamento) e das teses extintivas.

| Etapa | Evento | Prazo | Providência | Responsável | Documento necessário | Risco | Próxima etapa |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Recebimento da citação em execução fiscal | Dia 0 | Registrar data; obter cópia da CDA integral | Advogado júnior | Citação + CDA | Perder termo inicial dos embargos | Etapa 2 |
| 2 | Análise da CDA | Dia 1-5 | Conferir requisitos da CDA (tributo, base, datas, juros/multa); verificar vícios | Advogado sênior | CDA + documentos do crédito | CDA irregular não impugnada | Etapa 3 |
| 3 | Teste de prescrição/decadência | Dia 2-5 | Decadência de lançamento (CTN, art. 173, I); prescrição da cobrança (CTN, art. 174); intercorrente (Lei 6.830/1980, art. 40) | Advogado sênior | Datas de constituição e movimentação | Renúncia à tese extintiva mais forte | Etapa 4 |
| 4 | Garantia × embargos | Dia 5-15 | Decidir: embargos com/sem garantia conforme processabilidade; avaliar risco de penhora | Advogado coordenador + cliente | Termo de instruções | Embargos inadmitidos sem garantia quando exigida | Etapa 5 |
| 5 | Coleta de provas | Dia 5-20 | Recibos, declarações, compensações, erro de cálculo, pagamentos parciais | Advogado júnior + cliente | Recibos, extratos | Tese de pagamento sem prova documental | Etapa 6 |
| 6 | Redação dos embargos | Dia 10-25 | Preliminares (CDA; prescrição CTN arts. 173 I e 174) + mérito (pagamento, compensação [VALIDAR cabimento], excesso de execução) | Advogado sênior | Modelo estrutural | Embargos genéricos | Etapa 7 |
| 7 | Protocolo tempestivo | Até 30 dias da intimação da garantia/julgamento (Lei 6.830/1980, art. 16) | Protocolar; monitorar admissibilidade | Advogado júnior | Embargos + anexos | Inadmissão por intempestividade | Etapa 8 |
| 8 | Impugnação à penhora (se houver) | Conforme intimação | Definir bem mais útil; impugnar constrição indevida; discutir prioridades | Advogado sênior | Documentos de propriedade | Penhora sobre bem essencial à atividade | Etapa 9 |
| 9 | Monitorar redirecionamento | Contínuo | Vigiar redirecionamento a sócio — defender contra responsabilidade sem prova de dissolução irregular | Advogado sênior | Documentos societários | Redirecionamento indevido consolidado | Etapa 10 |
| 10 | Transação (se possível) | Periódico | Avaliar programa de transação/parcelamento do credor [VALIDAR condições vigentes] | Advogado coordenador | Proposta formal | Perder janela de redução | Etapa 11 |
| 11 | Recursos | Conforme decisões | Apelação/recursos nos prazos processuais (CPC, art. 1.003, §5º quando aplicável) | Advogado sênior | Minutas | Decisão desfavorável consolidada | Etapa 12 |
| 12 | Encerramento/acompanhamento | Contínuo | Suspensão por prescrição intercorrente (Lei 6.830/1980, art. 40) quando aplicável; quitação e baixa | Advogado coordenador | Petição + certidões | Execução ativa sem defesa ativa | Extinção/baixa |

## NOTAS OPERACIONAIS
- **CDA:** é o título executivo; vício na CDA (omissão de requisitos) é tese de preliminar clássica — sempre comparar CDA × constituição do crédito.
- **Prescrição intercorrente:** paralisia injustificada do processo por prazo superior ao da prescrição da cobrança gera extinção (Lei 6.830/1980, art. 40) — montar linha do tempo de movimentação.
- **Penhora:** discutir ordem legal de bens e necessidade (atividade produtiva) — validação dos dispositivos de ordem de penhora: [DISPOSITIVO A VALIDAR].
- **Redirecionamento:** exigir prova concreta de dissolução irregular/interposição; não aceitar presunção.
- **Cliente alerta:** execução fiscal tem regime próprio (Lei 6.830/1980) — não aplicar automaticamente prazos do CPC; conferir sempre.`
}),

// ============ FLUXO 4 ============
fluxo({
  slug: "fluxo-cobranca-empresarial-extrajudicial-judicial",
  titulo: "Fluxo — Cobrança Empresarial (extrajudicial → judicial)",
  area: "civil",
  subarea: "cobranca",
  assunto: "Crédito empresarial",
  subassunto: "Estratégia de recuperação de crédito",
  tagsBase: ["civel/cobranca"],
  totalEtapas: 11,
  prazoCritico: "Prescrição da pretensão de cobrança/liquidar crédito: CC, art. 206, §3º, V (3 anos — reparação) e demais hipóteses [VALIDAR terminologia do crédito]; atuar antes",
  conteudo: `# FLUXO — COBRANÇA EMPRESARIAL (EXTRAJUDICIAL → JUDICIAL)

**Objetivo:** recuperar crédito empresarial com escala extrajudicial primeiro (custo menor) e escalonamento judicial planejado. **Prazo-guia:** prescrição trienal da pretensão de reparação civil (CC, art. 206, §3º, V) quando aplicável; demais prazos por natureza do crédito [VALIDAR]. Regra de ouro: nunca deixar a prescrição definir a agenda.

| Etapa | Evento | Prazo | Providência | Responsável | Documento necessário | Risco | Próxima etapa |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Crédito vencido (inadimplemento) | Dia 0 | Conferir contrato, notas, recibos; montar dossiê do crédito | Advogado júnior | Contrato, notas fiscais, ordens de serviço | Crédito sem prova documental sólida | Etapa 2 |
| 2 | Checagem do devedor | Dia 1-3 | Pesquisar situação societária, endereço, bens, processos (fontes oficiais) | Advogado júnior | Consultas públicas | Cobrar empresa falida sem plano | Etapa 3 |
| 3 | Notificação extrajudicial 1 | Dia 3-10 | Notificação amigável com proposta de parcelamento | Advogado júnior | Carta/e-mail com AR | Escalada prematura perde acordo fácil | Etapa 4 |
| 4 | Negociação/parcelamento | Dia 10-30 | Negociar; formalizar acordo com cláusula de aceleração e confissão de dívida quando cabível | Advogado sênior | Contrato de parcelamento | Acordo sem garantia de execução | Etapa 5 |
| 5 | Notificação extrajudicial 2 (grave) | Se sem acordo em 30 dias | Notificação formal com prazo para pagamento e anúncio de litígio | Advogado sênior | Notificação com AR | Devedor alega surpresa; judge percebe falta de esforço | Etapa 6 |
| 6 | Decisão de ajuizamento | 30-60 dias | Análise custo × benefício × garantias; escolher procedimento; verificar caução | Advogado coordenador + cliente | Termo de instruções | Ação de custo alto para crédito baixo | Etapa 7 |
| 7 | Ajuizamento (ação de cobrança/monitória [VALIDAR admissibilidade] ou execução) | Semana seguinte | Ajuizar com peça-base EJC; requerer tutela/sequestro quando cabível (CPC, art. 300) | Advogado sênior | Petição inicial + provas | Erro de procedimento (extinção) | Etapa 8 |
| 8 | Acompanhamento da citação | Contínuo | Monitorar citação; preparar resposta a contestação | Advogado júnior | Sistema de prazos | Revelia não aproveitada (pedidos não bem formulados) | Etapa 9 |
| 9 | Audiência de conciliação | Conforme designação | Proposta com teto/piso definidos; parcelamento com aceleração | Advogado sênior | Termo de proposta | Acordo ruim por falta de preparo | Etapa 10 |
| 10 | Fase de execução do título/sentença | Após trânsito/decisão | Penhora, bloqueio, avaliação, leilão; ou acordo executado | Advogado coordenador | Sentença/título | Crédito ganho e não executado | Etapa 11 |
| 11 | Encerramento e lições | Conclusão | Baixa, quitação, registro do resultado QUALITATIVO no EJC (sem estatística inventada) | Advogado júnior | Checklist-encerramento-caso | Histórico perdido para a base de conhecimento | Fim |

## NOTAS OPERACIONAIS
- **Título executivo:** existindo (duplicata, cheque, confissão de dívida), avaliar via executiva direta — mais rápida que cognição plena; validação do rol de títulos: [DISPOSITIVO A VALIDAR].
- **Protesto:** instrumento de pressão e prova de mora; usar com estratégia [VALIDAR requisitos].
- **Devedor estruturado em holding:** mapear bens e responsabilização societária antes de ajuizar (evitar sentença vencedora sem patrimônio).
- **Custo-benefício:** honorários, custas e tempo vs. valor líquido esperado — apresentar matrizes ao cliente em cada decisão de escalada.
- **Prescrição:** interrupções e novas datas documentadas; monitorar automaticamente no sistema (CC, art. 206, §3º, V como referência; validar natureza do crédito).`
})
];
