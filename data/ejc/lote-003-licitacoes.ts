// LOTE-003 — Lei 14.133/2021 detalhada (P1) — textos LITERAIS extraídos do Planalto em 2026-08-29
// + conteúdo estrutural de licitações (peça, checklist, regra, tese, argumentação).
import type { InputDocument } from '../../src/lib/ejc/types';

const D = '2026-08-29';
const PLANALTO = 'Presidência da República — Planalto';
const URL14133 = 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm';
const FONTE = 'Elaboração EJC — conteúdo estrutural original';

function lei14133(
  slug: string, titulo: string, subarea: string, assunto: string, conteudo: string, artigos: string[],
): InputDocument {
  return {
    slug, titulo, tipoDocumento: 'LEGISLACAO', area: 'administrativo', subarea,
    assunto, prioridade: 'P1', lote: 'LOTE-003',
    conteudo,
    metadados: { numero: 'Lei 14.133/2021', data_norma: '2021-04-01', orgao: 'Congresso Nacional', artigos_principais: artigos, vigente: true, confirmacao_texto: 'Extracao literal do texto oficial do Planalto em 2026-08-29.' },
    tags: ['administrativo/licitacao-14133'],
    fonte: PLANALTO,
    urlFonte: URL14133,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-29',
  };
}

export default [
  lei14133(
    'lei-14133-2021-habilitacao',
    'Lei 14.133/2021 — Habilitação (art. 62 e ss.): jurídica, técnica, fiscal/trabalhista e econômico-financeira',
    'licitacao-14133',
    'Fase de habilitação das licitações',
    `## Ficha da Norma
- **Norma:** Lei nº 14.133, de 1º de abril de 2021 — Capítulo de habilitação.
- **Vigência:** vigente (conferir alterações posteriores a cada consulta).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-29)
"Art. 62. A habilitação é a fase da licitação em que se verifica o conjunto de informações e documentos necessários e suficientes para demonstrar a capacidade do licitante de realizar o objeto da licitação, dividindo-se em:
I - jurídica;
II - técnica;
III - fiscal, social e trabalhista;
IV - econômico-financeira."

## Interpretação aplicada
- **Jurídica:** atos constitutivos, procuração, regularidade cadastral (SICAF no federal), Regularidade Fiscal/FGTSS/FGTS.
- **Técnica:** atestados de capacidade técnica proporcionais ao objeto (vedada exigência excessiva — proporcionalidade é controle em impugnações).
- **Fiscal, social e trabalhista:** regularidade fiscal (federal/estadual/municipal), regularidade trabalhista (FGTS, CNDT em contratos sujeitos).
- **Econômico-financeira:** certidões/índices, coeficientes conforme o objeto — nunca como instrumento de direcionamento.

## Hipóteses de aplicação no EJC
- Impugnação de edital por exigência desproporcional na habilitação (art. 62 lido com os princípios do art. 5º da própria lei).
- Recurso administrativo contra inabilitação (contraditório — conferir prazos no edital e na lei).
- Planejamento de participação: checklist documental por modalidade.

## Relacionamentos
- Peça-modelo de impugnação de edital (BANCO 04 — LOTE-003); checklist de participação (BANCO 06).`,
    ['62', '63'],
  ),
  lei14133(
    'lei-14133-2021-contratacao-direta',
    'Lei 14.133/2021 — Contratação direta: inexigibilidade (art. 74) e dispensa (art. 75)',
    'licitacao-14133',
    'Inexigibilidade e dispensa de licitação',
    `## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta 2026-08-29)

### Art. 74 (inexigibilidade)
"Art. 74. É inexigível a licitação quando inviável a competição, em especial nos casos de:
I - aquisição de materiais, de equipamentos ou de gêneros ou contratação de serviços que só possam ser fornecidos por produtor, empresa ou representante comercial exclusivos;
II - contratação de profissional do setor artístico..." (continua na fonte)

### Art. 75 (dispensa — trecho inicial)
"Art. 75. É dispensável a licitação:
I - para contratação que envolva valores inferiores a R$ 100.000,00 (cem mil reais), no caso de obras e serviços de engenharia ou de serviços de manutenção de veículos automotores..." (continua na fonte, com múltiplos incisos e notas de vigência citadas no próprio texto oficial)

## Ponto de atenção — valores da dispensa
- Os VALORES do art. 75 já sofreram alterações legislativas (o texto oficial traz notas de vigência e referências a decretos). **Sempre conferir o valor vigente na data do caso** — não fixar valor em peça sem verificação.

## Interpretação aplicada
- Inexigibilidade exige **inviabilidade de competição** + justificativa de preço e escolha do fornecedor.
- Dispensa é hipótese legal taxativa; o processo deve demonstrar preço razoável e escolha objetiva.
- Abuso na contratação direta é vetor de processo sancionador (arts. 155-156) e de controle (TCU).

## Hipóteses de aplicação no EJC
- Defesa de ato de contratação direta questionado por tribunal de contas ou licitante.
- Impugnação de inexigibilidade com concorrência viável.`,
    ['74', '75'],
  ),
  lei14133(
    'lei-14133-2021-sancoes',
    'Lei 14.133/2021 — Infrações e sanções administrativas (arts. 155-156)',
    'sancoes',
    'Processo administrativo sancionador licitatório',
    `## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta 2026-08-29)

### Art. 155 (infrações — trecho inicial)
"Art. 155. O licitante ou o contratado será responsabilizado administrativamente pelas seguintes infrações:
I - dar causa à inexecução parcial do contrato;
II - dar causa à inexecução parcial do contrato que cause grave dano à Administração, ao funcionamento dos serviços públicos ou ao interesse coletivo;
III - dar causa à inexecução total do contrato;
IV - deixar de entregar a documentação exigida..." (continua na fonte)

### Art. 156 (sanções)
"Art. 156. Serão aplicadas ao responsável pelas infrações administrativas previstas nesta Lei as seguintes sanções:
I - advertência;
II - multa;
III - impedimento de licitar e contratar;
IV - declaração de inidoneidade para licitar ou contratar.
§ 1º Na aplicação das sanções serão considerados:
I - a natureza..." (continua na fonte — critérios de dosimetria)

## Interpretação aplicada
- O processo sancionador exige contraditório e ampla defesa (CF art. 5º LV), com dosimetria fundamentada (natureza e gravidade da infração, circunstâncias agravantes/atenuantes, danos, implantação de programa de integridade — conferir integralmente o § 1º na fonte).
- A declaração de inidoneidade é a sanção mais grave — requisitos e prazo restritivos na própria lei.
- Sanções aplicadas pelo órgão geram efeitos no SICAF/PNCP (consulta de habilitação de qualquer empresa).

## Hipóteses de aplicação no EJC
- Defesa administrativa em processo sancionador (infrações do art. 155) — combinar com peça de defesa administrativa do BANCO 04.
- Impugnação de dosimetria desproporcional (multa x dano real).
- Consulta de risco: verificação de impedimento/inidoneidade antes de participações.`,
    ['155', '156'],
  ),
  lei14133(
    'lei-14133-2021-modalidades-e-clausulas',
    'Lei 14.133/2021 — Modalidades (art. 28) e cláusulas necessárias dos contratos (art. 92)',
    'contratos-administrativos',
    'Modalidades de licitação e conteúdo contratual mínimo',
    `## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta 2026-08-29)

### Art. 28 (modalidades)
"Art. 28. São modalidades de licitação:
I - pregão;
II - concorrência;
III - concurso;
IV - leilão;
V - diálogo competitivo.
§ 1º Além das modalidades referidas no caput deste artigo, a Administração pode servir-se dos procedimentos auxiliares previstos no art. 78 desta Lei.
§ 2º É vedada a criação de outras modalidades de lic..."

### Art. 92 (cláusulas necessárias — trecho inicial)
"Art. 92. São necessárias em todo contrato cláusulas que estabeleçam:
I - o objeto e seus elementos característicos;
II - a vinculação ao edital de licitação e à proposta do licitante vencedor ou ao ato que tiver autorizado a contratação direta e à respectiva proposta..." (continua na fonte)

## Interpretação aplicada
- Pregão para bens e serviços comuns; concorrência para obras e especiais; diálogo competitivo para soluções inovadoras; leilão para alienações; concurso para trabalho técnico/artístico.
- Procedimentos auxiliares (art. 78): registro de preços, sistema de cotação eletrônica, pré-qualificação, carta-convite (conferir texto vigente).
- Contrato administrativo sem as cláusulas do art. 92 é fonte de litígio (gestão contratual, reajuste, rescisão).

## Hipóteses de aplicação no EJC
- Análise de contratos administrativos (checklist de cláusulas obrigatórias — art. 92).
- Escolha correta de modalidade em planejamento de contratação pública (clientes fornecedores do Estado).`,
    ['28', '78', '92'],
  ),
  {
    slug: 'peca-impugnacao-edital-14133',
    titulo: 'Peça: Impugnação de Edital / Pedido de Esclarecimento (Lei 14.133/2021)',
    tipoDocumento: 'PECA',
    area: 'administrativo',
    subarea: 'licitacao-14133',
    assunto: 'Contestação de termos do edital',
    prioridade: 'P1',
    lote: 'LOTE-003',
    conteudo: `## Situação de uso
Licitante impugna cláusula do edital (exigência desproporcional, restrição de competição, erro material) ou pede esclarecimento — antes da abertura da sessão pública, pelo prazo do edital (verificar o prazo específico em cada caso na lei/edital).

## Requisitos e documentos
- Edital completo + a cláusula impugnada.
- Demonstração do prejuízo à competição (proporcionalidade).
- Qualificação do impugnante e procuração.

## Estrutura da peça
1. Endereçamento à autoridade do órgão.
2. Identificação do certame e da cláusula.
3. Vício apontado (restrição indevida, exigência desproporcional — art. 62 lido com princípios da lei; erro material; violação de competitividade).
4. Fundamentos (Lei 14.133/2021 — artigos citados somente da lista validada; CF art. 37 XXI — mencionar genericamente como princípio da competitividade; Lei 9.784/1999 mencionar genericamente).
5. Pedidos (esclarecimento; retificação/reeditoração; quanto ao mérito).

## Riscos
- Impugnação intempestiva (preclusão); cláusula sem prejuízo concreto (inadmissão); necessidade de recorrer da resposta negativa.

## Checklist de revisão
- [ ] Prazo do edital respeitado e comprovado.
- [ ] Prejuízo à competição demonstrado objetivamente.
- [ ] Alternativa de redação proposta (facilita acolhimento).
- [ ] Controle do prazo de recurso aberto.

## Texto-base (campos variáveis)
---
AO {{AUTORIDADE}} DO {{ORGAO}} — {{UNIDADE}}

Ref.: Certame {{NUMERO_PREGAO_EDITAL}}/{{ANO}} — {{OBJETO}}

{{EMPRESA}}, CNPJ {{CNPJ}}, por seu advogado (procuração anexa), no prazo do edital, vem

IMPUGNAR O EDITAL / SOLICITAR ESCLARECIMENTO

1. Da cláusula {{NUMERO_CLAUSULA}}: transcrição "{{TEXTO_CLAUSULA}}".
2. Do vício: {{VICIO_ALEGADO}} (ex.: exigência de atestado com quantitativo desproporcional ao objeto — restrição à competição).
3. Da consequência: {{PREJUIZO_COMPETICAO}}.
4. Da proposta alternativa: {{REDAÇÃO_ALTERNATIVA}}.
5. Pedidos: (a) o esclarecimento/retificação da cláusula, com reabertura/reeditoração; (b) a resposta tempestiva; (c) subsidiariamente, o recebimento como recurso, se for o caso.

{{CIDADE}}, {{DATA}}. {{ADVOGADO}} — OAB/{{UF}} {{OAB}}`,
    tags: ['administrativo/licitacao-14133'],
    fonte: FONTE,
    urlFonte: null,
    dataConsulta: null,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-11-29',
  },
  {
    slug: 'checklist-licitacao-14133-participacao',
    titulo: 'Checklist: Participação em licitação (Lei 14.133/2021)',
    tipoDocumento: 'CHECKLIST',
    area: 'administrativo',
    subarea: 'licitacao-14133',
    assunto: 'Preparação documental e estratégica',
    prioridade: 'P1',
    lote: 'LOTE-003',
    conteudo: `## Objetivo
Garantir participação segura e habilitável em certames regidos pela Lei 14.133/2021.

## Seção 1 — Análise do edital
- [ ] Objeto, escopo e exclusões compreendidos.
- [ ] Modalidade correta (art. 28) e critérios de julgamento.
- [ ] Prazos: impugnação, esclarecimentos, sessão, propostas.
- [ ] Cláusulas de risco (reajuste, equilíbrio, sanções — arts. 92, 155-156).

## Seção 2 — Habilitação (art. 62)
- [ ] Jurídica: atos constitutivos, procuração com poderes, regularidade cadastral.
- [ ] Técnica: atestados proporcionais ao objeto (quantitativos mínimos verificados).
- [ ] Fiscal/trabalhista: certidões federais/estaduais/municipais + FGTS válidas na sessão.
- [ ] Econômico-financeira: índices/certidões dentro dos coeficientes do edital.

## Seção 3 — Proposta
- [ ] Composição de preços completa e sem erros de cálculo.
- [ ] Modelos/minutas (contrato, especificações) conforme exigido.
- [ ] Riscos precificados (multas, prazos, insumos).

## Seção 4 — Defesa e acompanhamento
- [ ] Impugnações/questões enviadas no prazo.
- [ ] Recurso preparado caso desclassificação/inabilitação.
- [ ] Vigilância de sanções (arts. 155-156) em toda a execução contratual.

## Riscos da omissão
Inabilitação por documentação desatualizada; proposta desclassificada por erro formal; assunção de cláusulas de risco não precificadas.`,
    tags: ['administrativo/licitacao-14133'],
    fonte: FONTE,
    urlFonte: null,
    dataConsulta: null,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-11-29',
  },
  {
    slug: 'regra-se-processo-sancionador-licitatorio',
    titulo: 'Regra: SE tipo_processo = processo_sancionador_licitatorio ENTÃO...',
    tipoDocumento: 'REGRA_INTELIGENCIA',
    area: 'administrativo',
    subarea: 'sancoes',
    assunto: 'Árvore de verificação — sanções da Lei 14.133',
    prioridade: 'P1',
    lote: 'LOTE-003',
    conteudo: `SE tipo_processo = processo_sancionador_licitatorio (Lei 14.133/2021, arts. 155-156) ENTÃO verificar:

1. **Enquadramento** → qual inciso do art. 155? descreve exatamente a conduta imputada? → SE enquadramento esticado: tese de tipicidade.
2. **Processo regular** → intimação com prazo de defesa? contraditório efetivo? → SE ausente: preliminar.
3. **Prova do dano** → inexecução parcial/total comprovada? dano grave mensurável? → SE laudo/demonstração ausente: tese de materialidade.
4. **Causalidade** → a inexecução decorre da conduta do contratado ou de fato da Administração (atraso de pagamento, não entrega de área)? → SE fato do príncipe: tese de exclusão.
5. **Dosimetria (art. 156 § 1º)** → natureza, gravidade, agravantes/atenuantes, programa de integridade considerado? → SE dosimetria genérica: tese de proporcionalidade.
6. **Proporcionalidade da sanção final** → advertência x multa x impedimento x inidoneidade — gradação coerente com o dano?
7. **Efeitos práticos** → registro no SICAF/PNCP? pedidos de suspensão de efeitos (tutela de urgência — CPC art. 300 aplicável)?
8. **Documentos** → contrato, termos de reciprocidade, notificações, medições, e-mails, programa de integridade (comprovantes).
9. **Jurisprudência** → TCU/STJ aplicável — citar número SOMENTE após confirmação na fonte oficial.
10. **Peça** → defesa administrativa (adaptação do BANCO 04) + eventual mandado de segurança (120 dias — Lei 12.016/2009, art. 23) contra sanção sem processo regular.`,
    tags: ['administrativo/sancoes', 'administrativo/licitacao-14133'],
    fonte: FONTE,
    urlFonte: null,
    dataConsulta: null,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-11-29',
  },
  {
    slug: 'tese-sancao-14133-dosimetria-proporcionalidade',
    titulo: 'Tese: Dosimetria e proporcionalidade nas sanções da Lei 14.133/2021',
    tipoDocumento: 'TESE',
    area: 'administrativo',
    subarea: 'sancoes',
    assunto: 'Revisão de multa/impedimento/inidoneidade desproporcionais',
    prioridade: 'P1',
    lote: 'LOTE-003',
    conteudo: `## Problema jurídico
Sanção aplicada (multa, impedimento, inidoneidade) desproporcional à conduta e ao dano, com dosimetria genérica ou que ignora atenuantes (programa de integridade, compensações, esforço de regularização).

## Hipótese de aplicação
A lei exige consideração dos critérios de dosimetria (art. 156 § 1º — texto confirmado na fonte); sanção sem fundamentação individualizada viola proporcionalidade e deve ser revisada.

## Fundamentação legal
Lei 14.133/2021, arts. 155-156 (textos literais confirmados no Planalto em 2026-08-29); CF art. 5º LV (devido processo); princípios de razoabilidade (mencionar genericamente).

## Fundamentação jurisprudencial
Verificar TCU/STJ na fonte oficial na data da peça (não citar números não confirmados).

## Requisitos necessários
- Sanção aplicada com dosimetria genérica ou excessiva.
- Demonstração objetiva do desproporção (dano real x sanção).
- Atenuantes documentadas (integridade, cooperação, reparação).

## Documentos necessários
- Processo sancionador completo; contrato e notificações; comprovantes de programa de integridade; demonstrativos do dano real.

## Riscos
- Discricionariedade técnica da administração limita revisão; inidoneidade tem requisitos próprios (gravidade).

## Argumentos contrários e contra-argumentos
- Contrário: "a lei fixa os critérios e a autoridade observou".
- Contra-argumento: observância formal sem fundamentação concreta não cumpre o § 1º do art. 156; a gradação entre as sanções deve refletir a gravidade real.

## Estratégia processual sugerida
Defesa administrativa → recurso → MS (se negativa de prestação/vício) com pedido de tutela para suspender efeitos no SICAF.

## Pedidos possíveis
Anulação da sanção; redução da multa; substituição por advertência; exclusão dos efeitos de inabilitação.

## Probabilidade qualitativa
**média** (qualitativa — não é estatística).`,
    tags: ['administrativo/sancoes'],
    fonte: FONTE,
    urlFonte: null,
    dataConsulta: null,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-11-29',
  },
  {
    slug: 'argumentacao-sancoes-licitatorias-dois-lados',
    titulo: 'Argumentação — Sanções licitatórias: os dois lados',
    tipoDocumento: 'ARGUMENTACAO',
    area: 'administrativo',
    subarea: 'sancoes',
    assunto: 'Análise bilateral do processo sancionador',
    prioridade: 'P1',
    lote: 'LOTE-003',
    conteudo: `## Argumento da Administração (sancionadora)
- Inexecução parcial/total comprovada (medições, notificações, termos).
- Legalidade estrita das sanções (arts. 155-156) e dosimetria pelo § 1º.
- Necessidade de proteção ao interesse público e ao certame (efeito pedagógico/repressivo).

## Argumento do contratado (sancionado)
- Falta de tipicidade exata (conduta não descreve o inciso).
- Fato da Administração (atrasos de pagamento, ordens contraditórias) rompe causalidade.
- Dosimetria genérica; atenuantes ignoradas (programa de integridade, cooperação, compensação de prejuízos).
- Sanção desproporcional (inidoneidade para falhas parciais pontuais).

## Jurisprudência favorável à Administração
- Legalidade estrita das sanções e respeito ao processo regular.
- **REGRA EJC:** citar julgados somente com número confirmado na fonte oficial.

## Jurisprudência favorável ao contratado
- Necessidade de nexo causal e dosimetria fundamentada; vedação de sanção sem processo regular.
- **REGRA EJC:** validar na fonte oficial.

## Pontos controvertidos
- Gravidade do dano; quem causou a inexecução; suficiência da fundamentação da dosimetria; alcance dos efeitos (SICAF).

## Provas relevantes
- Contrato, cronograma, medições, ordens de serviço, e-mails/notificações, atas de reunião, comprovantes do programa de integridade, demonstrativos financeiros.

## Estratégia recomendada
1. Defesa administrativa tempestiva com prova documental robusta.
2. Recurso reforçando dosimetria.
3. MS com tutela se sanção sem processo regular ou efeitos desproporcionais.
4. Gestão preventiva: registrar toda comunicação com a fiscalização do contrato.`,
    tags: ['administrativo/sancoes'],
    fonte: FONTE,
    urlFonte: null,
    dataConsulta: null,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-11-29',
  },
];
