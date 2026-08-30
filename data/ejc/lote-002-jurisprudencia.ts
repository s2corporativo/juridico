// LOTE-002 — Jurisprudência ambiental qualificada (P0) — confirmada em 2026-08-29
// Precedentes com URL OFICIAL (scon.stj.jus.br / stj.jus.br revista eletrônica).
// Campos não confirmados permanecem nulos (regra anti-invenção).
import type { InputDocument } from '../../src/lib/ejc/types';

const CONSULTA = '2026-08-29';

export default [
  {
    slug: 'resp-1225489-sp-execucao-multa-ambiental-5-anos',
    titulo: 'STJ — REsp 1.225.489/SP (2010/0211303-0): execução da multa ambiental prescreve em 5 anos do término do processo administrativo',
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'ambiental',
    subarea: 'responsabilidade-administrativa',
    assunto: 'Prescrição da execução de multa administrativa ambiental',
    prioridade: 'P0',
    lote: 'LOTE-002',
    conteudo: `## Identificação (fonte oficial STJ)
- **Tribunal:** Superior Tribunal de Justiça (STJ)
- **Classe:** Recurso Especial
- **Número:** REsp 1.225.489 - SP (registro 2010/0211303-0)
- **Data de publicação:** 04/03/2011 (parâmetro oficial de publicação no sistema scon)
- **Relator:** não confirmado na consulta de 2026-08-29 (não preencher por inferência)
- **Fonte oficial:** Sistema de Consultas do STJ (scon.stj.jus.br) — inteiro teor indexado oficialmente

## Trecho confirmado na fonte oficial (consulta 2026-08-29)
"...em cinco anos, contados do término do processo administrativo, a pretensão da Administração Pública de promover a execução da multa por infração ambiental".

## Questão jurídica
Quando começa e qual é o prazo prescricional para a Administração executar judicialmente a multa aplicada por infração ambiental?

## Entendimento
O prazo de 5 anos para a execução da multa ambiental conta-se do **término regular do processo administrativo** (constituição definitiva do crédito), alinhado com o art. 1º-A da Lei 9.873/1999 (texto literal confirmado no Planalto em 2026-08-29) e com a Súmula 467/STJ (5 anos para cobrança).

## Aplicação prática
- Defesa em execução fiscal de multa ambiental: reconstruir a linha do tempo (aplicação da multa → término do processo administrativo → inscrição → ajuizamento) e alegar prescrição quinquenal quando ultrapassado o prazo sem interrupção válida.
- Combinar com a Súmula 467/STJ e o art. 1º-A da Lei 9.873/1999 (docs vinculados).

## Limitações
- Verificar datas concretas do caso e atos interruptivos (art. 2º-A da Lei 9.873/1999 — despacho de citação etc.).
- Ao citar em peça, conferir o texto integral no portal oficial do STJ na data do uso.`,
    metadados: {
      tribunal: 'STJ',
      classe: 'Recurso Especial',
      numero_processo: 'REsp 1.225.489 - SP (2010/0211303-0)',
      relator: null,
      data_publicacao: '2011-03-04',
      data_julgamento: null,
      sumitulo: false,
      vinculante: false,
      data_consulta_confirmacao: CONSULTA,
    },
    tags: ['ambiental/responsabilidade-administrativa', 'ambiental/auto-infracao', 'geral/prazos'],
    fonte: 'STJ — Sistema de Consultas (scon.stj.jus.br), inteiro teor oficial',
    urlFonte: 'https://scon.stj.jus.br/SCON/GetInteiroTeorDoAcordao?num_registro=201002113030&dt_publicacao=04/03/2011',
    dataConsulta: CONSULTA,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: CONSULTA,
    proximaVerificacaoRecomendada: '2026-11-29',
    relacionamentos: [
      { destinoSlug: 'sumula-467-stj-cobranca-multa-ambiental-5-anos', tipo: 'PRECEDENTE_RELAZIONADO', descricao: 'Mesma matéria: prazo quinquenal de cobrança da multa ambiental.' },
      { destinoSlug: 'lei-9873-1999-prescricao-acao-punitiva-ambiental', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Regime legal da prescrição da ação punitiva e executória ambiental federal.' },
    ],
  },
  {
    slug: 'resp-1363107-risco-integral-herman-benjamin',
    titulo: 'STJ — REsp 1.363.107 (Min. Herman Benjamin): risco integral e poluidor-pagador na responsabilidade civil ambiental',
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'ambiental',
    subarea: 'responsabilidade-civil',
    assunto: 'Teoria do risco integral — fundamentação do relator',
    prioridade: 'P0',
    lote: 'LOTE-002',
    conteudo: `## Identificação (fonte oficial STJ — Revista Eletrônica)
- **Tribunal:** Superior Tribunal de Justiça (STJ)
- **Classe:** Recurso Especial
- **Número:** REsp nº 1.363.107 (registro nº 201300238686)
- **Relator:** Ministro Herman Benjamin (identificação confirmada no documento oficial)
- **Data de publicação na Revista Eletrônica:** 17/12/2015 (parâmetro oficial dt=20151217)
- **Fonte oficial:** Revista Eletrônica do STJ (websecstj.stj.jus.br — documento oficial em PDF)

## Tema confirmado na fonte oficial
O acórdão trata da responsabilidade civil ambiental com fundamentação do relator na **teoria do risco integral** aplicada ao **poluidor-pagador** (trecho oficial: "...risco integral ao poluidor/pagador... risco integral e da responsabilidade...").

## Questão jurídica
Qual o regime de responsabilidade civil aplicável ao poluidor por danos ambientais?

## Entendimento
Reforça a consolidação do risco integral na jurisprudência do STJ: o poluidor responde objetivamente pelos danos, sob o princípio do poluidor-pagador, com fundamentação expressa na teoria do risco integral.

## Aplicação prática
- Peças sobre responsabilidade civil ambiental: citar como precedente de consolidação (confirmar texto integral no portal na data do uso).
- Combina com os documentos "stj-responsabilidade-objetiva-ambiental-risco-integral" e "doutrina-teoria-risco-integral" (BANCO 02/12).

## Limitações
- O escopo completo do julgado (partes, dispositivo final) deve ser conferido no PDF oficial antes da citação em peça — o EJC registrou apenas o que a fonte oficial evidenciou na consulta.`,
    metadados: {
      tribunal: 'STJ',
      classe: 'Recurso Especial',
      numero_processo: 'REsp 1.363.107 (201300238686)',
      relator: 'Ministro Herman Benjamin',
      data_publicacao: '2015-12-17',
      data_julgamento: null,
      sumitulo: false,
      vinculante: false,
      data_consulta_confirmacao: CONSULTA,
    },
    tags: ['ambiental/responsabilidade-civil', 'ambiental/acao-civil-publica'],
    fonte: 'STJ — Revista Eletrônica (websecstj.stj.jus.br, documento oficial PDF)',
    urlFonte: 'https://www.stj.jus.br/websecstj/cgi/revista/REJ.cgi/ITA?seq=1462384&tipo=0&nreg=201300238686&SeqCgrmaSessao=&CodOrgaoJgdr=&dt=20151217&formato=PDF&salvar=false',
    dataConsulta: CONSULTA,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: CONSULTA,
    proximaVerificacaoRecomendada: '2026-11-29',
    relacionamentos: [
      { destinoSlug: 'stj-responsabilidade-objetiva-ambiental-risco-integral', tipo: 'PRECEDENTE_RELAZIONADO', descricao: 'Consolida o entendimento registrado a partir de fonte institucional.' },
      { destinoSlug: 'doutrina-teoria-risco-integral', tipo: 'CONCEITO_RELAZIONADO' },
    ],
  },
  {
    slug: 'lei-9873-1999-prescricao-acao-punitiva-ambiental',
    titulo: 'Lei 9.873/1999 — Prescrição da ação punitiva e executória ambiental federal (textos literais confirmados)',
    tipoDocumento: 'LEGISLACAO',
    area: 'ambiental',
    subarea: 'auto-infracao',
    assunto: 'Prazos prescricionais da ação punitiva ambiental',
    prioridade: 'P0',
    lote: 'LOTE-002',
    conteudo: `## Ficha da Norma
- **Norma:** Lei nº 9.873, de 23 de novembro de 1999.
- **Ementa oficial:** estabelece prazo de prescrição para o exercício de ação punitiva pela Administração Pública Federal, direta e indireta, e dá outras providências.
- **Vigência:** vigente (com alterações da Lei 11.941/2009).

## Textos CONFIRMADOS LITERALMENTE na fonte oficial (Planalto, consulta 2026-08-29)
- **Art. 1º** — "Prescreve em cinco anos a ação punitiva da Administração Pública Federal, direta e indireta, no exercício do poder de polícia, objetivando apurar infração à legislação em vigor, contados da data da prática do ato ou, no caso de infração permanente ou continuada, do dia em que tiver cessado."
  - **§ 1º** — "Incide a prescrição no procedimento administrativo paralisado por mais de três anos, pendente de julgamento ou despacho, cujos autos serão arquivados de ofício ou mediante requerimento da parte interessada, sem prejuízo da apuração da responsabilidade funcional decorrente da paralisação, se for o caso."
  - **§ 2º** — quando o fato também constituir crime, a prescrição reger-se-á pelo prazo da lei penal.
- **Art. 1º-A** (incluído pela Lei 11.941/2009) — "Constituído definitivamente o crédito não tributário, após o término regular do processo administrativo, prescreve em 5 (cinco) anos a ação de execução..." (alinhado com a Súmula 467/STJ e o REsp 1.225.489/SP).
- **Art. 2º** — interrupção da prescrição da ação punitiva (notificação/citação do indiciado ou acusado etc. — redação da Lei 11.941/2009).
- **Art. 2º-A** — interrupção do prazo prescricional da ação executória (despacho que ordena citação em execução fiscal, protesto judicial etc.).
- **Art. 5º** — o disposto nesta Lei não se aplica às infrações de natureza funcional nem aos processos de natureza tributária.

## Ponto de atenção — coerência com o Decreto 6.514/2008
- O art. 21 do Decreto 6.514/2008 (redação atual, confirmada em 2026-08-29) reproduz o regime quinquenal da ação de apuração.
- Regimes ESTADUAIS podem ter prazos distintos (verificar a norma local do órgão autuador em cada caso).

## Aplicação prática no EJC
- Linha do tempo obrigatória em toda defesa de AI: prática do ato → lavratura → ciência → julgamento → execução.
- Preliminares de prescrição (art. 1º/§ 1º) e de prescrição executória (art. 1º-A + Súmula 467/STJ).`,
    metadados: {
      numero: 'Lei 9.873/1999',
      data_norma: '1999-11-23',
      orgao: 'Congresso Nacional',
      artigos_principais: ['1', '1-A', '2', '2-A', '5'],
      vigente: true,
      alteracoes_relevantes: ['Lei 11.941/2009'],
      confirmacao_texto: 'Extracao literal do texto oficial do Planalto em 2026-08-29.',
    },
    tags: ['ambiental/auto-infracao', 'geral/prazos', 'ambiental/responsabilidade-administrativa'],
    fonte: 'Presidência da República — Planalto',
    urlFonte: 'https://www.planalto.gov.br/ccivil_03/leis/l9873.htm',
    dataConsulta: CONSULTA,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: CONSULTA,
    proximaVerificacaoRecomendada: '2026-11-29',
    relacionamentos: [
      { destinoSlug: 'decreto-6514-2008-processo-administrativo-ambiental', tipo: 'REGULAMENTO_RELAZIONADO', descricao: 'Art. 21 do Decreto 6.514/2008 alinha-se ao regime quinquenal da Lei 9.873/1999.' },
      { destinoSlug: 'sumula-467-stj-cobranca-multa-ambiental-5-anos', tipo: 'PRECEDENTE_APLICAVEL' },
      { destinoSlug: 'resp-1225489-sp-execucao-multa-ambiental-5-anos', tipo: 'PRECEDENTE_APLICAVEL' },
    ],
  },
  {
    slug: 'decaencia-administrativa-ambiental-stj-validar',
    titulo: 'Decadência administrativa ambiental (3 anos) — entendimento do STJ — REVISÃO HUMANA PENDENTE (atualizado LOTE-002)',
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'ambiental',
    subarea: 'auto-infracao',
    assunto: 'Decadência para instauração do processo administrativo ambiental',
    prioridade: 'P0',
    lote: 'LOTE-002',
    conteudo: `## AVISO CRÍTICO — REGISTRO EM REVISÃO HUMANA (atualizado em 2026-08-29, LOTE-002)
O número do precedente repetitivo sobre **decadência de 3 anos** ainda NÃO foi confirmado em fonte oficial na consulta de 2026-08-29. O que ESTÁ confirmado está listado abaixo com fonte.

## O que ESTÁ CONFIRMADO (com fonte oficial)
1. **Lei 9.873/1999, art. 1º** (texto literal no Planalto, 2026-08-29): prescrição em **5 anos** da ação punitiva da Administração Pública Federal ambiental, contados da prática do ato (ou cessação, se permanente/continuada). § 1º: prescrição do procedimento paralisado por mais de 3 anos.
2. **Decreto 6.514/2008, art. 21** (texto literal no Planalto, 2026-08-29, redação atual): mesmo regime quinquenal federal.
3. **REsp 1.225.489/SP** (URL oficial scon.stj.jus.br, publicação 04/03/2011): execução da multa ambiental prescreve em 5 anos do término do processo administrativo.
4. **Súmula 467/STJ** (banco oficial de súmulas): 5 anos para a cobrança da multa ambiental.

## O que PERMANECE PENDENTE DE VALIDAÇÃO
- O entendimento histórico do STJ sobre **decadência de 3 anos** (aplicável a certos regimes/époças e a legislações estaduais específicas): o número do precedente repetitivo não foi confirmado nesta consulta. **Não citar em peça sem validação no portal do STJ.**
- Regimes estaduais/municipais: cada estado pode ter lei própria (ex.: regras de prescrição/decadência estaduais) — verificar a norma aplicável ao órgão autuador.

## Como o EJC deve usar este registro
- **Nunca afirmar** "decadência de 3 anos" sem conferir: (i) data do fato; (ii) regime aplicável (federal atual x anteriores x estaduais); (iii) jurisprudência atualizada.
- Fluxo defensivo: linha do tempo → identificar regime → alegar a tese mais protetiva com fundamento verificável.

## Ação pendente
- [ ] Confirmar o número do precedente repetitivo sobre decadência de 3 anos (scon.stj.jus.br) e atualizar este registro.`,
    metadados: {
      tribunal: 'STJ',
      classe: 'Jurisprudência consolidada',
      numero_processo: null,
      relator: null,
      sumitulo: false,
      data_consulta_confirmacao: CONSULTA,
      pendencia: 'Confirmar precedente repetitivo de 3 anos antes de citar em peça.',
      atualizacao: 'LOTE-002: acrescentados os fundamentos confirmados (Lei 9.873/1999; REsp 1.225.489/SP).',
    },
    tags: ['ambiental/auto-infracao', 'geral/prazos'],
    fonte: 'STJ (portal institucional e bases jurídicas) — número do precedente de 3 anos pendente de confirmação',
    urlFonte: 'https://scon.stj.jus.br/',
    dataConsulta: CONSULTA,
    confiabilidade: 'C',
    vigente: true,
    status: 'REVISAO_HUMANA',
    dataUltimaVerificacao: CONSULTA,
    proximaVerificacaoRecomendada: '2026-09-29',
    relacionamentos: [
      { destinoSlug: 'lei-9873-1999-prescricao-acao-punitiva-ambiental', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Regime federal confirmado: 5 anos (art. 1º).' },
    ],
  },
];
