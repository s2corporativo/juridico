import { baseDoc } from "./_base.mjs";

const AREA_POR_CHECK = {
  ambiental: ["ambiental/auto-infracao", "checklist", "P0"],
  civil: ["civel", "checklist", "P0"],
  geral: ["geral/gestao", "checklist", "P0"]
};

function checklist(d) {
  return baseDoc({
    tipoDocumento: "CHECKLIST",
    area: d.area,
    subarea: d.subarea,
    assunto: d.assunto,
    subassunto: d.subassunto,
    tags: [...AREA_POR_CHECK[d.area], d.tagExtra],
    metadados: {
      objetivo: d.objetivo,
      secoes: d.secoes,
      formato: "itens_marcaveis",
      momento: d.momento
    },
    conteudo: d.conteudo
  });
}

export const checklists = [

// ============ CHECKLIST 1 ============
checklist({
  slug: "checklist-defesa-ambiental-antes-protocolar",
  titulo: "Checklist — Defesa ambiental em Auto de Infração (antes de protocolar)",
  area: "ambiental",
  subarea: "defesa-administrativa-ambiental",
  assunto: "Auto de Infração Ambiental",
  subassunto: "Controle de qualidade da defesa",
  tagExtra: "checklist/defesa-ambiental",
  objetivo: "Garantir que a defesa administrativa em AI seja protocolada tempestivamente, impugnada especificamente e instruída com todas as provas necessárias.",
  secoes: ["Prazo e procedural", "Documentos e provas", "Teses", "Qualidade da peça"],
  momento: "Antes do protocolo da defesa (prazo: 20 dias — Decreto 6.514/2008, art. 141 [VALIDAR ARTIGO])",
  conteudo: `# CHECKLIST — DEFESA AMBIENTAL EM AI (ANTES DE PROTOCOLAR)

**Objetivo:** garantir protocolo tempestivo, impugnação específica e instrução completa.
**Momento:** antes do protocolo. **Prazo-base:** 20 dias (Decreto 6.514/2008, art. 141 — [VALIDAR ARTIGO]).

## SEÇÃO 1 — PRAZO E PROCEDIMENTAL
- [ ] Data de notificação/ciência confirmada por documento (data de ciência real, não presumida)
- [ ] Cálculo do prazo conferido por duas pessoas (calendário marcado no sistema)
- [ ] Prazo escalado com folga de 3 dias para emergências
- [ ] Regulamento do órgão (federal/estadual/municipal) identificado e artigos [VALIDADOS]
- [ ] Canal de protocolo definido (SIC/protocolo digital do órgão) e testado
- [ ] Procuração assinada com poderes específicos para atuação administrativa

## SEÇÃO 2 — DOCUMENTOS E PROVAS
- [ ] Cópia integral do AI (todas as páginas, inclusive verso)
- [ ] Autos de constatação e laudo técnico obtidos (requerimento se não anexados)
- [ ] Fotos/vídeos da fiscalização requisitados
- [ ] Licenças, autorizações e alvarás do autuado reunidos
- [ ] Cronologia do fato montada (tabela de datas com fonte de cada data)
- [ ] Contraprova técnica contratada (parecer de profissional habilitado)
- [ ] Imagens de satélite/registro histórico da área obtidas (quando pertinente)
- [ ] Prova de regularização/reparação reunida (protocolos, projetos, contratos)
- [ ] Documentos societários e de representação válidos

## SEÇÃO 3 — TESES
- [ ] Decadência (3 anos) testada com cronologia documental (Decreto 6.514/2008)
- [ ] Nulidades formais mapeadas com referência exata (página/linha do AI)
- [ ] Competência do órgão autuador verificada (ente licenciador × autuador)
- [ ] Materialidade e nexo causal avaliadas (laudo × contraprova)
- [ ] Erro sobre proibição/boa-fé avaliado (licenças e pareceres prévios)
- [ ] Dosimetria decomposta (tabela de cálculo) e contracálculo pronto
- [ ] Atenuantes e regularização superveniente documentadas (Lei 9.605/1998, arts. 14 e 18)
- [ ] Ordem de tese definida: preliminares → mérito → dosimetria subsidiária
- [ ] Jurisprudência: somente entendimentos consolidados descritos sem número; julgados a citar validados no painel oficial

## SEÇÃO 4 — QUALIDADE DA PEÇA
- [ ] Peça-base do EJC usada (peca-defesa-administrativa-ambiental) e campos {{VARIÁVEIS}} 100% preenchidos
- [ ] Nenhum fato fictício; narrativa 100% lastreada em documentos
- [ ] Impugnação específica de cada ponto do AI (nada de defesa genérica)
- [ ] Dispositivos fora da lista confiável marcados [DISPOSITIVO A VALIDAR]
- [ ] Anexos numerados e referenciados na peça
- [ ] Pedido de acesso integral ao processo incluído
- [ ] Revisão final por advogado sênior concluída
- [ ] Comprovante de protocolo arquivado e prazo de resposta monitorado no sistema

**Riscos da omissão (por seção):**
1. Prazo: decadência do direito de defesa e presunção de legitimidade do ato.
2. Documentos: defesa sem contraprova perde força de materialidade/dosimetria.
3. Teses: renúncia tácita a teses de anulação (decadência/nulidade não suscitadas).
4. Qualidade: peça genérica ou com fato não documentado gera dano reputacional e perde credibilidade técnica junto ao órgão.`
}),

// ============ CHECKLIST 2 ============
checklist({
  slug: "checklist-ajuizamento-acao-civel",
  titulo: "Checklist — Ajuizamento de ação cível",
  area: "processual-civil",
  subarea: "peticao-inicial",
  assunto: "Início da demanda judicial",
  subassunto: "Controle de qualidade pré-ajuizamento",
  tagExtra: "checklist/ajuizamento",
  objetivo: "Reduzir riscos de emenda, extinção e prescrição antes do protocolo de qualquer ação cível.",
  secoes: ["Pré-processual e estratégia", "Partes e representação", "Petição inicial", "Custos e logística"],
  momento: "Antes do protocolo da petição inicial",
  conteudo: `# CHECKLIST — AJUIZAMENTO DE AÇÃO CÍVEL

**Objetivo:** protocolar ação tecnicamente robusta, sem risco de extinção sem mérito ou perda de prazo prescricional.

## SEÇÃO 1 — PRÉ-PROCESSUAL E ESTRATÉGIA
- [ ] Toda via extrajudicial esgotada ou justificada (notificações, negociação)
- [ ] Prescrição analisada e documentada (reparação civil: 3 anos — CC, art. 206, §3º, V; consumo: CDC, arts. 26-27)
- [ ] Competência e foro definidos (eleição contratual conferida)
- [ ] Probabilidade da tese classificada QUALITATIVAMENTE (alta/média/baixa) e comunicada ao cliente — sem garantia de resultado
- [ ] Custos estimados (custas, honorários, perícia) apresentados e aprovados
- [ ] Documentos originais digitalizados e índice de provas montado
- [ ] Tutela de urgência avaliada com prova do perigo (CPC, art. 300)
- [ ] Alternativas menos custosas consideradas (mediação/arbitragem)

## SEÇÃO 2 — PARTES E REPRESENTAÇÃO
- [ ] Qualificação completa do autor e do réu (nome, CPF/CNPJ, endereço válido)
- [ ] Consulta de endereço do réu (correios/portais) para viabilizar citação
- [ ] Documentos de representação (contrato social, ata, estatuto) vigentes e assinados
- [ ] Procuração com poderes específicos (transigir, receber, dar quitação — conforme necessidade)
- [ ] Litisconsórcio e assistência avaliados (quando há terceiros no negócio)
- [ ] Conflito de interesses verificado (o escritório não atua contra outro cliente)

## SEÇÃO 3 — PETIÇÃO INICIAL
- [ ] Peça-base EJC adaptada (peca-peticao-inicial-civel-repeticao-indenizacao) — campos {{VARIÁVEIS}} preenchidos
- [ ] Fatos narrados cronologicamente com remissão a cada documento
- [ ] Fundamentos apenas da lista confiável; demais marcados [DISPOSITIVO A VALIDAR]
- [ ] Pedidos líquidos e cumulados com clareza; alternativos quando necessário
- [ ] Valor da causa coerente com os pedidos
- [ ] Memória de cálculo anexada (indébito/danos)
- [ ] Nenhum fato fictício; nada de julgado/súmula sem número validado
- [ ] Requerimento de provas específico (documental/testemunhal/pericial)

## SEÇÃO 4 — CUSTOS E LOGÍSTICA
- [ ] Guia de custas gerada e paga (conferir código e valor)
- [ ] Receita e anexos organizados na ordem da peça (PDF único paginado)
- [ ] Audiência de conciliação prevista no requerimento
- [ ] Calendário de prazos configurado no sistema (citação → resposta)
- [ ] Cliente informado por escrito do protocolo e das etapas seguintes

**Riscos da omissão:**
1. Prescrição não analisada: ação ajuizada "morta" (CC, art. 206, §3º, V).
2. Representação deficiente: emenda, atraso e risco de extinção.
3. Inicial genérica: contestação destrói tese por ausência de impugnação específica do autor aos próprios fatos.
4. Custos não aprovados: conflito de honorários com o cliente.`
}),

// ============ CHECKLIST 3 ============
checklist({
  slug: "checklist-contestacao-civel",
  titulo: "Checklist — Contestação cível",
  area: "processual-civil",
  subarea: "contestacao",
  assunto: "Resposta à demanda",
  subassunto: "Controle de qualidade da contestação",
  tagExtra: "checklist/contestacao",
  objetivo: "Garantir resposta tempestiva, impugnação específica e uso integral de preliminares antes da preclusão.",
  secoes: ["Prazo", "Preliminares", "Mérito e provas", "Encerramento"],
  momento: "Entre a citação e o prazo de 15 dias úteis (CPC, arts. 219 e 335)",
  conteudo: `# CHECKLIST — CONTESTAÇÃO CÍVEL

**Objetivo:** contestação completa, tempestiva e sem confissões inadvertidas. Prazo: 15 dias úteis (CPC, art. 335; contagem em dias úteis — CPC, art. 219).

## SEÇÃO 1 — PRAZO
- [ ] Data de juntada do AR/citação confirmada e termo inicial anotado
- [ ] Contagem em dias úteis conferida por duas pessoas
- [ ] Sistema de prazos atualizado com alerta em D-5, D-3 e D-1
- [ ] Hipóteses de prazo em dobro/novo prazo verificadas (quando aplicável [VALIDAR])

## SEÇÃO 2 — PRELIMINARES (JÁ QUE HÁ PRECLUSÃO)
- [ ] Incompetência relativa arguida? (foro de eleição/lugar do cumprimento)
- [ ] Prescrição/decadência analisada com termo inicial documentado (CC, art. 206, §3º, V)
- [ ] Inépcia da inicial / ilegitimidade avaliadas
- [ ] Caução / procedimentos especiais verificáveis conferidos
- [ ] TODA preliminar cabível arguida na primeira oportunidade
- [ ] Tais questões arguidas antes ou conjuntamente ao mérito (nunca "guardadas")

## SEÇÃO 3 — MÉRITO E PROVAS
- [ ] Peça-base EJC adaptada (peca-contestacao-civel-generica)
- [ ] Impugnação ESPECÍFICA parágrafo a parágrafo da inicial (prevenção de presunção de veracidade)
- [ ] Nenhuma confissão inadvertida em narrativa (releitura crítica de cada parágrafo da defesa)
- [ ] Contracálculo/documentos que provam pagamento/compensação anexados
- [ ] Tese sobre extensão do dano com CC, art. 944 quando cabível
- [ ] Rol de testemunhas preparado dentro do prazo próprio
- [ ] Requerimento de perícia fundamentado (fato que dependa de conhecimento técnico)
- [ ] Provas do autor analisadas uma a uma (contraditório real)

## SEÇÃO 4 — ENCERRAMENTO
- [ ] Pedidos finais coerentes com as teses (extinção → improcedência → redução subsidiária)
- [ ] Honorários e custas requeridos
- [ ] Revisão sênior concluída; campos {{VARIÁVEIS}} preenchidos; dispositivos [DISPOSITIVO A VALIDAR] marcados
- [ ] Protocolo confirmado; comprovante arquivado; cliente informado

**Riscos da omissão:**
1. Prazo: revelia com presunção de veracidade dos fatos.
2. Preliminares: perda por preclusão — não podem ser suscitadas depois.
3. Mérito: presunção de veracidade dos fatos não impugnados especificamente; tese destruída por confissão escrita.
4. Encerramento: pedido incoerente gera cerceamento de defesa e recurso inútil.`
}),

// ============ CHECKLIST 4 ============
checklist({
  slug: "checklist-analise-contratual",
  titulo: "Checklist — Análise de contrato",
  area: "geral",
  subarea: "contratos",
  assunto: "Revisão contratual",
  subassunto: "Detecção de riscos",
  tagExtra: "checklist/contratos",
  objetivo: "Padronizar a revisão de contratos (qualquer espécie) com detecção sistemática de cláusulas de risco, usando as REGRAS_CONTRATUAIS do EJC.",
  secoes: ["Partes e objeto", "Cláusulas econômicas", "Risco e responsabilidade", "Governança e saída"],
  momento: "Antes da assinatura de qualquer contrato (revisão prévia)",
  conteudo: `# CHECKLIST — ANÁLISE DE CONTRATO

**Objetivo:** revisão padronizada com detecção de riscos por categoria. Complemento: regras-contratuais-mestre-deteccao (EJC).

## SEÇÃO 1 — PARTES E OBJETO
- [ ] Qualificação completa das partes (CNPJ/CPF, sede, representação)
- [ ] Poderes do signatário conferidos (ata/estatuto/procuração)
- [ ] Objeto e escopo descritos com entregáveis mensuráveis
- [ ] Anexos (escopo, SLA, preços) numerados e referenciados no corpo
- [ ] Finalidade declarada compatível com a prática de negócio das partes

## SEÇÃO 2 — CLÁUSULAS ECONÔMICAS
- [ ] Preço e forma de pagamento claros (valor, vencimento, meio)
- [ ] Reajuste com índice definido ({{INDEXADOR}}) — ausência = risco (regra-contratual ausência de índice)
- [ ] Multas e juros de mora em valores/percentuais definidos e razoáveis
- [ ] Ausência de multa excessiva (>10% de forma automática — verificar severidade na regra de detecção)
- [ ] Vigência e término definidos; renovação automática identificada e avaliada (janela de aviso?)
- [ ] Cláusula de abuso detectada? (irrevogável, unilateral, renúncia genérica de direitos) — ver regra de cláusula abusiva

## SEÇÃO 3 — RISCO E RESPONSABILIDADE
- [ ] Responsabilidade desproporcional? (uma parte responde por tudo — ver regra de detecção)
- [ ] Limitação/exclusão de danos equilibrada; dolo e culpa grave fora de exclusão
- [ ] Garantias (performance, pagamento, fiança) definidas com prazos
- [ ] Confidencialidade presente quando há troca de informação sensível (modelo EJC: contrato-nda-confidencialidade)
- [ ] LGPD: papel das partes (controlador/operador), incidentes e subprocessadores tratados ([DISPOSITIVO A VALIDAR])
- [ ] Propriedade intelectual: pré-existente × entregável distinguidos
- [ ] Seguro exigido quando o risco justifica

## SEÇÃO 4 — GOVERNANÇA E SAÍDA
- [ ] Rescisão: hipóteses, aviso prévio, consequências (pagamento proporcional; devolução de dados)
- [ ] Foro de eleição avaliado (viabilidade prática para a parte cliente) — ver regra de foro
- [ ] Solução de disputas em camadas (negociação → mediação → foro/arbitragem)
- [ ] Tratamento de casos omissos (lei aplicável; ordem de prevalência dos anexos)
- [ ] Log de alterações e versões do contrato arquivado

**Riscos da omissão:**
1. Objeto vago: litígio de escopo (trabalho extra não pago ou não entregue).
2. Economia: reajuste ausente corrói margem; multa excessiva gera passivo.
3. Risco: responsabilidade ilimitada não mapeada; dados sem guarda (LGPD — [DISPOSITIVO A VALIDAR]).
4. Saída: rescisão travada; foro distante inviabiliza cobrança.`
}),

// ============ CHECKLIST 5 ============
checklist({
  slug: "checklist-atendimento-inicial-cliente",
  titulo: "Checklist — Atendimento inicial do cliente",
  area: "geral",
  subarea: "atendimento",
  assunto: "Onboarding jurídico",
  subassunto: "Triagem e conflitos",
  tagExtra: "checklist/atendimento",
  objetivo: "Padronizar a primeira consulta: captura de fatos, documentos, conflitos de interesse, urgências e expectativas.",
  secoes: ["Identificação e conflitos", "Fatos e documentos", "Urgência e prazos", "Expectativas e fechamento"],
  momento: "Primeiro contato/consulta inicial",
  conteudo: `# CHECKLIST — ATENDIMENTO INICIAL DO CLIENTE

**Objetivo:** primeira consulta completa, com triagem, gestão de conflitos e expectativa calibrada.

## SEÇÃO 1 — IDENTIFICAÇÃO E CONFLITOS
- [ ] Identificação completa do cliente (PF/PJ, CPF/CNPJ, contatos)
- [ ] Se PJ: representante habilitado identificado e documentado
- [ ] Consulta de conflitos de interesse no sistema (partes adversas, contrapartes)
- [ ] Registro da consulta no sistema (data, presentes, matéria)
- [ ] Contrato de honorários/engajamento apresentado ou agendado
- [ ] Sigilo e confidencialidade explicados (termo quando necessário)

## SEÇÃO 2 — FATOS E DOCUMENTOS
- [ ] Narrativa cronológica dos fatos capturada com datas precisas
- [ ] Documentos listados e solicitados por checklist da matéria (ver TRIAGEM correspondente)
- [ ] Perguntas-chave da matéria feitas (roteiros: triagem-auto-infracao-ambiental; triagem-cobranca-empresarial; triagem-consulta-ambiental-licenciamento)
- [ ] Provas existentes identificadas (fotos, e-mails, laudos, contratos)
- [ ] Terceiros envolvidos mapeados (contraparte, testemunhas, órgãos)
- [ ] Histórico de consultas/atividades anteriores nesta matéria

## SEÇÃO 3 — URGÊNCIA E PRAZOS
- [ ] Prazos correntes identificados (notificações recebidas? cartas? intimações?)
- [ ] Urgência classificada (prazo < 5 dias = emergência; < 20 = alta; senão normal)
- [ ] Documentos com prazo: foto digitalizada imediata + calendário marcado
- [ ] Natureza do prazo confirmada (administrativo 20 dias em AI; cível 15 dias úteis; MS 120 dias — Lei 12.016/2009, art. 23; embargos LEF 30 dias — Lei 6.830/1980, art. 16; purgação 5 dias — DL 911/1969, art. 2º)
- [ ] Alertas configurados no sistema de prazos

## SEÇÃO 4 — EXPECTATIVAS E FECHAMENTO
- [ ] Probabilidade da tese comunicada QUALITATIVAMENTE (alta/média/baixa/indeterminada) — jamais promessa de resultado
- [ ] Custos estimados apresentados por escrito
- [ ] Riscos do cliente explicitados (financeiros, reputacionais, prazos)
- [ ] Próximos passos acordados com prazo para cada um
- [ ] Minuta de contrato de honorários enviada; condições de trabalho definidas
- [ ] Dados do cliente armazenados conforme LGPD ([DISPOSITIVO A VALIDAR])

**Riscos da omissão:**
1. Conflitos: nulidade de honorários, dano reputacional, perda de cliente.
2. Fatos: tese construída sobre versão incompleta; surpresa processual.
3. Urgência: prazo perdido é dano irreparável (decadência/prescrição).
4. Expectativas: cliente frustrado gerando conflito de honorários.`
}),

// ============ CHECKLIST 6 ============
checklist({
  slug: "checklist-encerramento-caso",
  titulo: "Checklist — Encerramento do caso",
  area: "geral",
  subarea: "gestao",
  assunto: "Fim do mandato",
  subassunto: "Entrega, arquivo e cobrança final",
  tagExtra: "checklist/encerramento",
  objetivo: "Encerrar o caso com quitação formal, arquivamento adequado, devolução de documentos e preservação de direitos residuais.",
  secoes: ["Conclusão e quitação", "Documentos e arquivo", "Financeiro", "Pós-encerramento"],
  momento: "Decisão final transitada/homologada ou rescisão do mandato",
  conteudo: `# CHECKLIST — ENCERRAMENTO DO CASO

**Objetivo:** encerramento limpo, com quitação, arquivo e monitoramento de obrigações residuais.

## SEÇÃO 1 — CONCLUSÃO E QUITAÇÃO
- [ ] Resultado final documentado (sentença/decisão/acordo — cópia arquivada)
- [ ] Efeitos residuais identificados (obrigações de fazer, parcelas futuras, gestão ambiental)
- [ ] Cliente formalmente informado do resultado e dos efeitos (comunicação escrita)
- [ ] Quitação de honorários emitida/recebida
- [ ] Cessação de mandato formalizada (petição/procuração cancelada quando aplicável)
- [ ] Termo de encerramento assinado pelo cliente (constando que foi orientado sobre os efeitos)

## SEÇÃO 2 — DOCUMENTOS E ARQUIVO
- [ ] Processo físico/digital conferido (nada faltando antes da devolução)
- [ ] Documentos originais do cliente devolvidos com recibo
- [ ] Cópias de trabalho arquivadas com política de retenção definida
- [ ] Dados pessoais tratados conforme LGPD: retenção mínima necessária, eliminação quando exigida ([DISPOSITIVO A VALIDAR])
- [ ] Dossiê de encerramento montado (peças-chave, cálculos, comunicações)

## SEÇÃO 3 — FINANCEIRO
- [ ] Honorários finais calculados (incluindo êxito sobre base efetivamente realizada)
- [ ] Cobrança executada ou parcelamento formalizado
- [ ] Custas e desembolsos conciliados (recibos conferidos)
- [ ] Nenhuma pendência financeira sem registro

## SEÇÃO 4 — PÓS-ENCERRAMENTO
- [ ] Prazos residuais mapeados e monitorados (parcelas, obrigações ambientais, recurso da parte adversa — janela!)
- [ ] Calendário de "check-in" com o cliente definido para obrigações de longo prazo
- [ ] Lições aprendidas registradas no sistema (teses que funcionaram; riscos reais)
- [ ] Atualização da base de conhecimento EJC quando o caso gerar aprendizado estruturável (respeitando sigilo)
- [ ] Encerramento do caso no sistema (status FINALIZADO, data, resultado QUALITATIVO — sem estatística inventada)

**Riscos da omissão:**
1. Quitação: conflito posterior de honorários; mandato formalmente vivo gerando responsabilidade.
2. Documentos: perda de originais; exposição indevida de dados (LGPD — [DISPOSITIVO A VALIDAR]).
3. Financeiro: êxito não cobrado; passivo de custas.
4. Pós: prazo residual perdido (ex.: recurso da parte adversa); obrigações de fazer não cumpridas recaem sobre o cliente sem alerta.`
})
];
