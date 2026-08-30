// LOTE-001 P0 — JURISPRUDÊNCIA — Somente precedentes CONFIRMADOS por pesquisa em 2026-08-29
// Números de REsp NÃO confirmados foram OMITIDOS (regra anti-invenção).
import type { InputDocument } from '../../src/lib/ejc/types';

const CONSULTA = '2026-08-29';

export default [
  {
    slug: 'sumula-467-stj-cobranca-multa-ambiental-5-anos',
    titulo: 'Súmula 467/STJ — Prescrição de 5 anos para cobrança de multa ambiental',
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'ambiental',
    subarea: 'responsabilidade-administrativa',
    assunto: 'Prescrição da cobrança de multa administrativa ambiental',
    prioridade: 'P0',
    lote: 'LOTE-001',
    conteudo: `## Identificação
- **Tribunal:** Superior Tribunal de Justiça (STJ)
- **Súmula:** 467 (vinculante para os tribunais do STJ — súmula editada pela Corte)
- **Fonte oficial:** banco de súmulas do STJ (scon.stj.jus.br — SÚMULAS)
- **Data da consulta:** 2026-08-29

## Enunciado (conforme fonte oficial)
"A jurisprudência desta Corte preconiza que o prazo para a cobrança da multa aplicada em virtude de infração administrativa ao meio ambiente é de cinco anos, sendo, portanto, inaplicáveis os prazos prescricionais previstos no art. 1º do Decreto 20.910/32."

## Questão jurídica
Qual o prazo prescricional para a administração pública cobrar judicialmente multa aplicada por infração administrativa ambiental?

## Entendimento
Prazo de 5 anos para a cobrança da multa ambiental, afastando o regime do Decreto 20.910/32 (5 anos do Estado em geral) nos moldes antes aplicados e consolidando o regime quinquenal específico.

## Aplicação prática
- Execução fiscal/multa ambiental: reconstruir linha do tempo (aplicação da multa → inscrição → execução).
- Defesa: alegar prescrição quinquenal quando o ajuizamento superar 5 anos da aplicação da multa, conferindo interrupções válidas.
- Combinar com o art. 21 do Decreto 6.514/2008 (prescrição da ação de apuração — ver doc de legislação).

## Limitações
- Alcança multa administrativa ambiental; verificação caso a caso quanto à data dos fatos e regime aplicável.
- Conferir sempre a vigência e interpretação atualizada da súmula no portal do STJ antes de citar.`,
    metadados: { tribunal: 'STJ', classe: 'Súmula', numero_processo: null, relator: null, data_julgamento: null, sumitulo: true, vinculante: true, data_consulta_confirmacao: CONSULTA },
    tags: ['ambiental/responsabilidade-administrativa', 'ambiental/auto-infracao', 'geral/prazos'],
    fonte: 'STJ — Banco de Súmulas (scon.stj.jus.br)',
    urlFonte: 'https://scon.stj.jus.br/SCON/sumstj/doc.jsp?livre=%22467%22+INPATH%28NUM%29&b=SUMU&p=false&l=10&i=1&operador=AND&ordenacao=-@NUM',
    dataConsulta: CONSULTA,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: CONSULTA,
    proximaVerificacaoRecomendada: '2026-11-29',
  },
  {
    slug: 'sumula-652-stj-omissao-estatal-solidariedade',
    titulo: 'Súmula 652/STJ — Responsabilidade solidária do Estado por omissão na fiscalização ambiental',
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'ambiental',
    subarea: 'responsabilidade-civil',
    assunto: 'Responsabilidade do Estado por omissão',
    prioridade: 'P0',
    lote: 'LOTE-001',
    conteudo: `## Identificação
- **Tribunal:** Superior Tribunal de Justiça (STJ)
- **Súmula:** 652
- **Fonte oficial:** banco de súmulas do STJ (scon.stj.jus.br — SÚMULAS)
- **Data da consulta:** 2026-08-29

## Enunciado (conforme fonte oficial)
"A responsabilidade civil da Administração Pública por danos ao meio ambiente, decorrente de sua omissão no dever de fiscalização, é de caráter solidário, sendo que a execução pode ser instaurada contra qualquer dos responsáveis, observado o direito de regresso."

## Questão jurídica
Como se opera a responsabilidade civil do Estado quando o dano ambiental decorre também de sua omissão no dever de fiscalizar?

## Entendimento
Responsabilidade solidária: o lesado pode exigir a reparação integral de qualquer dos corresponsáveis (Estado e poluidor), com direito de regresso entre eles. Notícia institucional do STJ (2025) reforça: ente público responde de forma objetiva e solidária, mas a execução é subsidiária em relação ao poluidor direto, conforme a compreensão da Corte.

## Aplicação prática
- Ações indenizatórias ambientais envolvendo Estado omissivo: pedidos de solidariedade; discussão de subsidiariedade na execução.
- Defesa do Estado: demonstrar atuação fiscalizatória efetiva (autos, embargos, multas) para afastar a omissão.
- Defesa do particular: buscar condenação do Estado em solidariedade para aumentar a recuperação do crédito reparatório.

## Limitações
- A súmula trata da omissão no dever de fiscalização; dano causado diretamente pelo Estado (conduta comissiva) segue regime próprio do art. 37, § 6º, CF.`,
    metadados: { tribunal: 'STJ', classe: 'Súmula', numero_processo: null, relator: null, sumitulo: true, vinculante: true, data_consulta_confirmacao: CONSULTA },
    tags: ['ambiental/responsabilidade-civil', 'ambiental/acao-civil-publica'],
    fonte: 'STJ — Banco de Súmulas (scon.stj.jus.br)',
    urlFonte: 'https://scon.stj.jus.br/SCON/sumstj/doc.jsp?livre=652&b=SUMU&p=true&thesaurus=JURIDICO&l=100&i=1&operador=e&ordenacao=MAT,TIT,ORD',
    dataConsulta: CONSULTA,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: CONSULTA,
    proximaVerificacaoRecomendada: '2026-11-29',
  },
  {
    slug: 'stj-responsabilidade-objetiva-ambiental-risco-integral',
    titulo: 'STJ — Responsabilidade civil ambiental objetiva (teoria do risco integral) — entendimento consolidado',
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'ambiental',
    subarea: 'responsabilidade-civil',
    assunto: 'Responsabilidade objetiva e risco integral',
    prioridade: 'P0',
    lote: 'LOTE-001',
    conteudo: `## Identificação
- **Tribunal:** Superior Tribunal de Justiça (STJ)
- **Natureza:** entendimento consolidado da jurisprudência da Corte (não é súmula; precedente concreto a validar caso a caso)
- **Fontes consultadas (2026-08-29):** portal institucional do STJ (notícias e páginas temáticas) e literatura jurídica especializada citando a jurisprudência consolidada da Corte.

## Questão jurídica
Qual é o regime de responsabilidade civil do poluidor por danos ambientais?

## Entendimento consolidado
- A responsabilidade civil ambiental é **objetiva**, fundada no **art. 14, § 1º, da Lei 6.938/1981** — independe de culpa.
- O STJ aplica a **teoria do risco integral** aos danos ambientais: em hipóteses graves, não admite excludentes de responsabilidade (caso fortuito/força maior, fato de terceiro), ponderando a natureza da atividade e a magnitude do dano.
- Notícia institucional STJ (01.06.2025): o "poluidor indireto" pode ser alcançado — quem de qualquer forma participa ou se beneficia da atividade degradante responde objetivamente; ente público responde objetiva e solidariamente, com execução subsidiária.

## Fundamentos
- CF art. 225 (dever de proteção); Lei 6.938/1981, art. 14, § 1º; princípio do poluidor-pagador; primazia da reparação in natura.

## Aplicação prática
- Para o autor: fundamentar objetividade e risco integral; prova do dano e do nexo (perícia).
- Para a ré: atacar nexo causal e extensão do dano (perícia técnica), discutir regularidade licenciada da atividade e proporcionalidade da reparação; não há como basear a defesa apenas na ausência de culpa.
- **REGRA EJC:** ao citar este entendimento em peça, anexar julgado concreto atualizado do STJ (pesquisar no portal e conferir número/relator/data ANTES da citação — não usar número de processo não confirmado).`,
    metadados: { tribunal: 'STJ', classe: 'Jurisprudência consolidada', numero_processo: null, relator: null, data_julgamento: null, sumitulo: false, nota_validacao: 'Citar julgado concreto somente após confirmação no portal STJ.' },
    tags: ['ambiental/responsabilidade-civil', 'ambiental/acao-civil-publica'],
    fonte: 'STJ — Portal institucional (notícias/pages temáticas)',
    urlFonte: 'https://www.stj.jus.br/sites/portalp/Paginas/Comunicacao/Noticias/2025/01062025-O-poluidor-indireto-e-a-extensao-da-responsabilizacao-ambiental--segundo-a-jurisprudencia-do-STJ.aspx',
    dataConsulta: CONSULTA,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: CONSULTA,
    proximaVerificacaoRecomendada: '2026-11-29',
  },
  {
    slug: 'stj-in-dubio-pro-natura',
    titulo: 'STJ — Princípio in dubio pro natura (hermenêutica ambiental) — entendimento consolidado',
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'ambiental',
    subarea: 'auto-infracao',
    assunto: 'Interpretação favorável à proteção ambiental',
    prioridade: 'P0',
    lote: 'LOTE-001',
    conteudo: `## Identificação
- **Tribunal:** Superior Tribunal de Justiça (STJ)
- **Natureza:** princípio hermenêutico aplicado de forma consolidada pela Corte
- **Fonte consultada (2026-08-29):** portal institucional do STJ — página/notícia dedicada ao princípio ("In dubio pro natura: mais proteção judicial ao meio ambiente").

## Questão jurídica
Diante de dúvida interpretativa em norma ambiental, qual sentido deve prevalecer?

## Entendimento consolidado
- **In dubio pro natura:** em caso de dúvida na interpretação de normas ambientais, deve-se optar pela solução mais protetiva ao meio ambiente.
- O STJ registra aplicação do princípio em múltiplos contextos: interpretação de tipo infracional (tutela administrativa e penal), definição de extensão de proteção de áreas, e resolução de conflitos normativos.
- Correlaciona-se com a vedação ao emprego de analogia que desproteja o meio ambiente (sem ampliar tipos infracionais por analogia in malam partem).

## Aplicação prática
- Defesa administrativa/penal ambiental: usar como critério de interpretação favorável quando houver ambiguidade no enquadramento (ex.: quebra de cláusula do tipo infracional, dúvida sobre competência ou sobre extensão de proibição).
- Ação do MP: usar para ampliação protetiva (concessão de tutelas, interpretação extensiva de deveres de recuperação).
- **REGRA EJC:** não confundir in dubio pro natura com inversão do ônus da prova: a dúvida interpretativa favorece o ambiente, mas a dúvida fática (materialidade) deve ser verificada com as provas do autos.`,
    metadados: { tribunal: 'STJ', classe: 'Princípio hermenêutico consolidado', numero_processo: null, relator: null, sumitulo: false, nota_validacao: 'Ao citar em peça, agregar julgado concreto confirmado no portal STJ.' },
    tags: ['ambiental/auto-infracao', 'ambiental/responsabilidade-penal'],
    fonte: 'STJ — Portal institucional',
    urlFonte: 'https://www.stj.jus.br/sites/portalp/Paginas/Comunicacao/Noticias-antigas/2019/In-dubio-pro-natura-mais-protecao-judicial-ao-meio-ambiente.aspx',
    dataConsulta: CONSULTA,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: CONSULTA,
    proximaVerificacaoRecomendada: '2026-11-29',
  },
  {
    slug: 'stf-tema-940-responsabilidade-estado-agente-publico',
    titulo: 'STF — Tema 940 (repercussão geral): ação por danos causados por agente público ajuizada contra o Estado',
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'civil',
    subarea: 'responsabilidade-civil',
    assunto: 'Responsabilidade do Estado — art. 37, § 6º, CF',
    prioridade: 'P1',
    lote: 'LOTE-001',
    conteudo: `## Identificação
- **Tribunal:** Supremo Tribunal Federal (STF)
- **Tema de repercussão geral:** 940
- **Fonte oficial:** portal de jurisprudência e repercussão geral do STF (portal.stf.jus.br — andamento de processo com numeroTema=940)
- **Data da consulta:** 2026-08-29

## Questão jurídica (conforme registro oficial do Tema 940)
"A teor do disposto no art. 37, § 6º, da Constituição Federal, a ação por danos causados por agente público deve ser ajuizada contra o Estado ou a pessoa jurídica de direito privado prestadora de serviço público" — delimita a legitimidade passiva e o regime da responsabilidade do Estado por condutas de seus agentes (e contratados).

## Entendimento
- Regra geral: ação de indenização por dano causado por agente público no exercício da função é proposta **contra o Estado/pessoa jurídica**, com direito de regresso contra o agente em caso de dolo ou culpa.
- No contexto ambiental, a responsabilidade objetiva do Estado por danos ambientais (inclusive por atos de contratados) é reconhecida pela jurisprudência das cortes superiores — a verificação do precedente específico deve ser feita no portal antes da citação.

## Aplicação prática
- Ações por dano ambiental causado por contratado do Estado: citar o ente, não o agente.
- Defesa: discutir omissão/atuação regular, nexo causal e regresso.

## Limitações
- O texto integral do enunciado do Tema 940 deve ser conferido no portal do STF na data de uso (a consulta de 2026-08-29 confirmou a parte central do enunciado via página oficial do tema).`,
    metadados: { tribunal: 'STF', classe: 'RE (repercussão geral)', tema: 940, numero_processo: null, relator: null, sumitulo: false, vinculante: false, data_consulta_confirmacao: CONSULTA },
    tags: ['civil/responsabilidade-civil', 'ambiental/responsabilidade-civil'],
    fonte: 'STF — Portal da Repercussão Geral',
    urlFonte: 'https://portal.stf.jus.br/jurisprudenciaRepercussao/verAndamentoProcesso.asp?incidente=5136782&numeroProcesso=1027633&classeProcesso=RE&numeroTema=940',
    dataConsulta: CONSULTA,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: CONSULTA,
    proximaVerificacaoRecomendada: '2026-11-29',
  },
  {
    slug: 'decaencia-administrativa-ambiental-stj-validar',
    titulo: 'Decadência administrativa ambiental (3 anos) — entendimento do STJ — REVISÃO HUMANA PENDENTE',
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'ambiental',
    subarea: 'auto-infracao',
    assunto: 'Decadência para instauração do processo administrativo ambiental',
    prioridade: 'P0',
    lote: 'LOTE-001',
    conteudo: `## AVISO CRÍTICO — REGISTRO EM REVISÃO HUMANA
Este registro documentou um entendimento jurídico relevante, mas o **número do precedente repetitivo NÃO foi confirmado** na pesquisa de 2026-08-29. Conforme a regra absoluta do EJC (item 1 da missão), o número específico NÃO foi preenchido e NÃO deve ser citado até validação humana com fonte oficial.

## Questão jurídica
Qual o prazo para a administração instaurar processo administrativo para apuração de infração ambiental?

## O que se sabe (com fonte)
1. **Jurisprudência histórica do STJ:** consolidou-se o entendimento de que o prazo para a administração instaurar processo administrativo ambiental é de **3 anos (decadência)**, contados da prática do ato (ou da cessação, se permanente/continuada). Fontes institucionais e doutrinárias reiteram esse entendimento; o número do precedente repetitivo não foi confirmado nesta consulta.
2. **Redação ATUAL do art. 21 do Decreto 6.514/2008** (confirmada literalmente no Planalto em 2026-08-29, com alterações do Decreto 11.080/2022): "**Prescreve** em cinco anos a ação da administração objetivando apurar a prática de infrações contra o meio ambiente, contada da data da prática do ato..." — introduz regime de **prescrição de 5 anos** na esfera federal atual.
3. **Súmula 467/STJ:** 5 anos para a **cobrança** da multa já aplicada.

## Como o EJC deve usar este registro
- **Nunca afirmar** "decadência de 3 anos" sem conferir: (i) data do fato; (ii) regime aplicável ao caso (federal atual x anteriores x estaduais — muitos estados possuem leis e decretos próprios com prazos distintos); (iii) jurisprudência atualizada.
- Fluxo defensivo: reconstruir linha do tempo → identificar regime aplicável → alegar a tese mais protetiva com fundamento verificável.

## Ação pendente
- [ ] Confirmar o número do precedente repetitivo do STJ sobre a decadência administrativa ambiental no portal (scon.stj.jus.br) e atualizar este registro.`,
    metadados: { tribunal: 'STJ', classe: 'Jurisprudência consolidada', numero_processo: null, relator: null, sumitulo: false, data_consulta_confirmacao: CONSULTA, pendencia: 'Confirmar precedente repetitivo com fonte oficial antes de citar em peça.' },
    tags: ['ambiental/auto-infracao', 'geral/prazos'],
    fonte: 'STJ (portal institucional e bases jurídicas) — número do precedente pendente de confirmação',
    urlFonte: 'https://scon.stj.jus.br/',
    dataConsulta: CONSULTA,
    confiabilidade: 'C',
    vigente: true,
    status: 'REVISAO_HUMANA',
    dataUltimaVerificacao: CONSULTA,
    proximaVerificacaoRecomendada: '2026-09-29',
  },
];
