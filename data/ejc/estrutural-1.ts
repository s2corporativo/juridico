// LOTE-001 P0 — ESTRUTURAL (1/2): TESES, ARGUMENTAÇÃO, DOUTRINA
// Conteúdo original EJC. Fundamentos citados apenas da lista confiável validada.
import type { InputDocument } from '../../src/lib/ejc/types';

const D = '2026-08-29';
const FONTE = 'Elaboração EJC — conteúdo estrutural original';

function tese(
  slug: string,
  nome: string,
  problema: string,
  hipotese: string,
  fundamentos: string,
  requisitos: string[],
  documentos: string[],
  riscos: string,
  contra: string,
  contraArgs: string,
  estrategia: string,
  pedidos: string,
  probabilidade: string,
): InputDocument {
  return {
    slug,
    titulo: `Tese: ${nome}`,
    tipoDocumento: 'TESE',
    area: 'ambiental',
    subarea: 'auto-infracao',
    assunto: problema,
    prioridade: 'P0',
    lote: 'LOTE-001',
    conteudo: `## Problema jurídico
${problema}

## Hipótese de aplicação
${hipotese}

## Fundamentação legal
${fundamentos}

## Fundamentação jurisprudencial
Consultar o BANCO 02 (Jurisprudência) do EJC. **REGRA:** citar número de julgado somente após confirmação na fonte oficial (portal do tribunal) na data da peça.

## Requisitos necessários
${requisitos.map((r) => `- ${r}`).join('\n')}

## Documentos necessários
${documentos.map((r) => `- ${r}`).join('\n')}

## Riscos
${riscos}

## Possíveis argumentos contrários
${contra}

## Contra-argumentos
${contraArgs}

## Estratégia processual sugerida
${estrategia}

## Pedidos possíveis
${pedidos}

## Probabilidade qualitativa
**${probabilidade}** (classificação qualitativa do EJC — não é estimativa estatística e não se baseia em amostra empírica).

## Data da última atualização
${D} — LOTE-001 P0.`,
    metadados: { probabilidade, banco: 'BANCO 03 — Teses Jurídicas' },
    tags: ['ambiental/auto-infracao', 'ambiental/responsabilidade-administrativa'],
    fonte: FONTE,
    urlFonte: null,
    dataConsulta: null,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-11-29',
  };
}

export default [
  tese(
    'tese-ai-nulidade-formal',
    'Nulidade formal do auto de infração ambiental',
    'Auto de infração lavrado com defeitos formais que dificultam ou impedem a defesa (identificação equivocada do autuado, local ou da conduta, ausência de descrição da infração, falta de indicação de dispositivo legal).',
    'A conduta do órgão não cumpre os requisitos do ato administrativo sancionador, violando contraditório e ampla defesa (CF, art. 5º, LV) e a legislação do processo administrativo ambiental.',
    'CF art. 5º LV; Lei 9.605/1998, art. 70 (tipicidade); Lei 9.784/1999 (princípios do processo administrativo — mencionar genericamente); Decreto 6.514/2008 (regras do AI — conferir artigos vigentes).',
    ['Defeito formal identificável e material (prejudicialidade à defesa)', 'Documentação do AI e da notificação', 'Demonstração concreta do prejuízo'],
    ['Auto de infração completo (frente e verso)', 'Notificação/ciência com data', 'Fotos/laudos referidos no AI (se existirem)', 'Documentos de titularidade/ocupação do imóvel'],
    'Órgão pode emendar o AI (retificação) ou republicar a autuação, adiando o mérito; tribunais frequentemente admitem convalidação quando o defeito não causa prejuízo real.',
    'O defeito é meramente formal e não impediu a defesa; o AI descreve suficientemente a conduta; a retificação é permitida.',
    'A nulidade por vício formal exige prejuízo à defesa — quando o elemento essencial (conduta, local, autor) é indeterminado, a defesa fica cega e o prejuízo é presumido; a retificação não pode suprir ausência de descrição fática mínima.',
    'Apresentar defesa administrativa (20 dias) alegando preliminar de nulidade + mérito subsidiário; se indeferido, recurso administrativo; judicializar via anulatória/MS se esgotadas as instâncias.',
    'Cancelamento do AI; nulidade da sanção; se aplicável, reabertura do prazo de defesa.',
    'média',
  ),
  tese(
    'tese-ai-decaencia-prescricao-apuracao',
    'Decadência/prescrição da pretensão sancionadora ambiental',
    'Decorrido prazo longo entre a prática do ato (ou cessação) e a lavratura do AI, ou entre o AI e a aplicação da sanção — a pretensão punitiva da administração pode estar extinta.',
    'A aplicação tardia da sanção viola o regime de prazos aplicável (Decreto 6.514/2008, art. 21 na redação atual; entendimento consolidado do STJ sobre decadência — validar regime aplicável ao caso).',
    'Decreto 6.514/2008, art. 21 (prescrição de 5 anos da ação de apuração — redação atual confirmada); Súmula 467/STJ (cobrança da multa — 5 anos); entendimento consolidado do STJ sobre decadência de 3 anos (validar número do precedente antes de citar).',
    ['Linha do tempo completa: prática do ato → lavratura → ciência → defesa → decisão → cobrança', 'Identificação do regime aplicável (federal atual x estadual x datas anteriores)', 'Verificação de interrupções válidas'],
    ['AI com data de lavratura', 'Comprovante/ciência da notificação com data', 'Decisão administrativa (se houver)', 'Documentação do histórico do processo administrativo (se acessível)'],
    'Regimes divergentes (estaduais) e alterações legislativas frequentes; necessidade de perícia documental sobre datas de paralisação.',
    'Houve interrupção válida (defesa, recurso, depósito); a infração é permanente/continuada (prazo conta da cessação); o AI interrompeu o prazo (art. 21, § 1º: a lavratura do AI inicia a apuração).',
    'Combinar tese temporal com prescrição intercorrente (art. 21, § 2º: paralisação por mais de 3 anos) e com Súmula 467/STJ na fase de cobrança; demonstrar ausência de atos válidos de interrupção nos autos administrativos.',
    'Declaração de decadência/prescrição; cancelamento do AI e da sanção; arquivamento do processo administrativo.',
    'alta',
  ),
  tese(
    'tese-ai-ausencia-materialidade',
    'Ausência de materialidade da infração ambiental',
    'O AI não se sustenta em prova técnica (laudo/perícia) que demonstre a infração, sua extensão e autoria.',
    'Sem materialidade comprovada (laudo técnico, imagens, medições), o AI carece de fundamento — presunção de ilicitude não substitui prova.',
    'CF art. 5º LV; Lei 9.605/1998, art. 70 (infração exige conduta violadora); princípio in dubio pro natura (entendimento consolidado do STJ).',
    ['Ausência ou insuficiência de laudo técnico', 'Laudos contrários ou exame particular favorável', 'Dúvida objetiva sobre local/área/conduta'],
    ['AI e referida documentação técnica', 'Laudo técnico particular (agronômico/engenharia florestal/geoprocessamento)', 'Imagens satelitárias de época e relatório', 'Declarações de terceiros/inventário do imóvel'],
    'Órgão pode diligenciar e produzir novo laudo; ônus de produzir prova técnica contrária recai sobre a defesa (custos).',
    'O corpo do AI e o conhecimento presumido da autoridade bastam; a onerosidade da prova não transfere o ônus.',
    'A prova da infração é do órgão autuador (quem alega); a dúvida técnica deve resolver-se pro natura (in dubio pro natura — entendimento consolidado STJ); juntar laudo particular robusto para converter dúvida em certeza favorável.',
    'Cancelamento do AI por insuficiência probatória; abertura de contraditório sobre laudos; perícia administrativa conjunta.',
    'média',
  ),
  tese(
    'tese-ai-in-dubio-pro-natura',
    'Aplicação do princípio in dubio pro natura na dúvida interpretativa',
    'Há dúvida interpretativa no enquadramento da norma ambiental (alcance do tipo infracional, competência, extensão de proibições).',
    'Em caso de dúvida, prevalece a interpretação mais protetiva ao meio ambiente — princípio consolidado no STJ —, que pode favorecer tanto a defesa (dúvida punitiva resolve-se contra a punição ampliada) quanto a tutela (interpretação extensiva de deveres de recuperação).',
    'CF art. 225; Lei 9.605/1998 (interpretação do sistema sancionador); entendimento consolidado do STJ sobre in dubio pro natura (fonte institucional — ver BANCO 02).',
    ['Dúvida interpretativa objetiva identificável', 'Ausência de proibição expressa', 'Análise sistemática da norma'],
    ['AI e dispositivo enquadrado', 'Texto da norma na redação vigente', 'Precedentes confirmados do STJ sobre o princípio'],
    'O princípio não é absoluto: não afasta tipicidade clara nem prova cabal; uso inadequado pode parecer retórico e enfraquecer a peça.',
    'O tipo infracional é claro; a dúvida é artificial; o princípio não se aplica à interpretação contra o legislador.',
    'Usar o princípio como critério de desempate interpretativo após esgotar argumentos literais e sistemáticos; anexar precedente confirmado do STJ aplicando o princípio a caso análogo (pesquisar no portal na data da peça).',
    'Rejeição do enquadramento; interpretação favorável; afastamento de agravantes interpretativas.',
    'média',
  ),
  tese(
    'tese-ai-competencia-orgao-autuador',
    'Ilegitimidade/competência do órgão autuador',
    'O órgão que lavrou o AI não tem competência legal para fiscalizar aquela atividade/local (conflito federal x estadual x municipal, unidades de conservação, recursos hídricos).',
    'A competência sancionadora é atribuída por lei; autuação por órgão incompetente é nula (competência é condição de validade do ato administrativo).',
    'CF art. 225 § 1º e art. 23; Lei 6.938/1981 (SISNAMA — art. 6º); Lei complementar/estadual de competência (identificar no caso concreto); Decreto 6.514/2008 (âmbito federal).',
    ['Mapeamento da competência legal aplicável ao local/atividade', 'Identificação precisa do órgão autuador', 'Ausência de delegação válida'],
    ['AI com identificação do órgão', 'Legislação estadual/local de competência', 'Documentos do licenciamento existente (indicando órgão licenciador)'],
    'Há sobreposição competencial reconhecida (ex.: dualidade federal/estadual); o órgão pode pleitear remessa do processo à autoridade competente.',
    'O órgão integra o SISNAMA e atua supletivamente; delegação convênio válida existe.',
    'Demonstrar a regra de competência específica e a ausência de convênio/delegação; pedir a anulação e não apenas a remessa; na dúvida, subsidiar com mérito para evitar preclusão.',
    'Nulidade do AI por incompetência; remessa à autoridade competente (se aplicável).',
    'média',
  ),
  tese(
    'tese-ai-dosimetria-proporcionalidade',
    'Dosimetria da multa ambiental — proporcionalidade e gradação',
    'Multa aplicada desproporcionalmente (base de cálculo incorreta, não consideração da gravidade real, antecedentes e capacidade econômica; ausência de gradação).',
    'A sanção deve observar proporcionalidade e gradação (Lei 9.605/1998, art. 72 e ss.), com dosimetria fundamentada — aautoridade deve indicar critérios concretos.',
    'Lei 9.605/1998, arts. 72-73 (sanções e critérios); Decreto 6.514/2008 (unidade de cálculo da multa — art. 8º e ss.); CF art. 5º (razoabilidade); Lei 9.784/1999 (moralidade, razoabilidade — mencionar genericamente).',
    ['Demonstração do descolamento entre sanção e conduta/dano', 'Comparação com casos equivalentes (sem inventar estatísticas)', 'Demonstração de regularização ou esforço de conformidade'],
    ['AI e termo de multa com base de cálculo', 'Documentos de regularização (CAR, PRA, licenças)', 'Comprovação de antecedentes limpos ou de conformidade', 'Laudo de extensão real do dano'],
    'Órgão tem discricionariedade técnica na fixação; revisão judicial da discricionariedade é restrita.',
    'A discricionariedade é controlável quanto à proporcionalidade; a ausência de fundamentação específica da dosimetria é vício revisável; gradação é exigência legal.',
    'Atacar a base de cálculo (unidade de medida equivocada — art. 8º e ss. do Decreto) e a ausência de motivação individualizada; requerer reconsideiração com dosimetria fundamentada e, na esfera judicial, revisão proporcional.',
    'Redução da multa; revisão da base de cálculo; aplicação de sanção mínima compatível; conversão em serviços de preservação (quando cabível).',
    'alta',
  ),
  tese(
    'tese-ai-regularizacao-superveniente',
    'Regularização superveniente como fator atenuante e de conversion da sanção',
    'Após a autuação, o autuado regularizou a situação (CAR, PRA, licença, recuperação da área) e busca atenuação ou conversão da multa.',
    'A conformidade superveniente reduz a gravidade e a necessidade punitiva da sanção; legislação admite atenuação e conversão da multa em serviços de preservação/recuperação.',
    'Lei 9.605/1998 (conversão de multa em serviços de preservação — art. 72 e sistema de atenuação — art. 18 para a esfera penal); Decreto 6.514/2008 (conversão e atenuação — conferir artigos vigentes); Lei 12.651/2012 (CAR/PRA).',
    ['Regularização efetiva e comprovada (não apenas iniciada)', 'Documentos atualizados (CAR, protocolo PRA, licenças)', 'Plano/PRAD em execução com evidências'],
    ['Comprovantes do CAR/PRA', 'Licenças expedidas', 'PRAD com relatórios de execução e fotos datadas', 'Recibos de serviços de recuperação'],
    'Conversão depende de requisitos normativos e de disponibilidade do órgão; regularização não apaga a infração pregressa.',
    'A conformidade posterior é fato relevante para a dosimetria e conversão — exatamente o que as normas de atenuação preveem; a negativa sem fundamentação viola proporcionalidade.',
    'Juntar dossiê de regularização com cronologia; requerer atenuação imediata e, alternativamente, conversão da multa; monitorar prazos do PRA para evitar novas multas diárias.',
    'Atenuação da multa; conversão em serviços de preservação; suspensão de multas diárias.',
    'alta',
  ),
  tese(
    'tese-ai-ausencia-nexo-causal',
    'Ausência de nexo causal entre o autuado e o dano alegado',
    'O dano apontado não é atribuível à conduta do autuado (causa exclusiva de terceiro, evento natural, conduta pregressa de outra pessoa, imóvel arrendado/ocupado por terceiro).',
    'Sem nexo causal, não há responsabilidade — a imputação exige vínculo entre a conduta do autuado e o dano verificado.',
    'Lei 6.938/1981, art. 14 (poluidor — responsabilidade objetiva exige nexo); Lei 9.605/1998, art. 70 (conduta/omissão violadora); CC art. 927 (regime geral — mencionar subsidiariamente).',
    ['Demonstração técnica da causa real do dano', 'Documentos que afastam a posse/controle do local no período', 'Prova de conduta de terceiro'],
    ['Laudo técnico particular com análise causal', 'Contrato de arrendamento/posse com datas', 'Imagens satelitárias de série histórica', 'Boletins/registros de eventos naturais (se aplicável)'],
    'Responsabilidade objetiva facilita imputação; órgão pode atribuir responsabilidade por omissão na fiscalização do próprio imóvel.',
    'Objetividade não dispensa nexo causal — é elemento essencial; a omissão exige demonstração de poder de controle efetivo; série histórica e laudo causal podem afastar a imputação.',
    'Centralizar a defesa na prova causal (perícia particular + série histórica); argumentar falta de poder de controle no período; pedir diligência técnica.',
    'Cancelamento do AI; desconstituição da imputação; eventual remessa contra terceiro causador.',
    'média',
  ),
  {
    slug: 'argumentacao-ai-ambiental-dois-lados',
    titulo: 'Argumentação — Defesa em AI ambiental: os dois lados da controvérsia',
    tipoDocumento: 'ARGUMENTACAO',
    area: 'ambiental',
    subarea: 'auto-infracao',
    assunto: 'Análise bilateral da defesa contra auto de infração',
    prioridade: 'P0',
    lote: 'LOTE-001',
    conteudo: `## Argumento do órgão autuador (autor administrativo)
- A infração está caracterizada por laudo/fiscalização presencial (materialidade).
- O tipo infracional é claro e o enquadramento é automático.
- A responsabilidade ambiental é objetiva (Lei 6.938/1981, art. 14, § 1º) — não importa culpa.
- A multa segue tabela/unidade de cálculo normativa — há legalidade estrita.
- A regularização superveniente não apaga a infração consumada.

## Argumento do autuado (réu administrativo)
- Preliminares: nulidade formal; incompetência; decadência/prescrição (Decreto 6.514/2008, art. 21; regime consolidado STJ); violação de contraditório.
- Mérito: ausência de materialidade/laudo; ausência de nexo causal; erro no enquadramento ou na base de cálculo (unidade/hectare); in dubio pro natura.
- Dosimetria: falta de gradação e proporcionalidade; desconsideização de antecedentes e capacidade; regularização superveniente (CAR/PRA) como atenuante e via de conversão da multa.

## Jurisprudência favorável ao órgão
- Responsabilidade objetiva ambiental é consolidada (STJ — ver BANCO 02).
- A legalidade estrita da tabela de multas limita a revisão de valores.
- Infração permanente/continuada conta o prazo da cessação.

## Jurisprudência favorável ao autuado
- In dubio pro natura consolidado (STJ — ver BANCO 02).
- Súmula 467/STJ: cobrança da multa prescreve em 5 anos.
- Prescrição intercorrente do processo administrativo (Decreto 6.514/2008, art. 21, § 2º).
- **REGRA EJC:** citar número de julgado somente após confirmação na fonte oficial.

## Pontos controvertidos
- Regime de decadência x prescrição conforme data dos fatos e norma aplicável.
- Alcance da prova técnica mínima exigível para materialidade.
- Amplitude da regularização superveniente como atenuante.

## Provas relevantes
- AI completo + notificação com data; laudos e fotos do órgão; laudo particular; série histórica de imagens; documentos de regularização; histórico processual administrativo.

## Estratégia recomendada
1. Linha do tempo → checar prazos e preclusões (primeiro dia útil da ciência).
2. Preliminares fortes antes do mérito (nulidade, competência, prescrição).
3. Laudo técnico próprio robusto (geoprocessamento).
4. Dossiê de regularização para dosimetria.
5. Defesa no prazo (20 dias), recurso se necessário, judicialização seletiva (MS/anulatória).`,
    metadados: { banco: 'BANCO 11 — Argumentos e Contra-Argumentos' },
    tags: ['ambiental/auto-infracao', 'ambiental/responsabilidade-administrativa'],
    fonte: FONTE,
    urlFonte: null,
    dataConsulta: null,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'argumentacao-cobranca-empresarial-dois-lados',
    titulo: 'Argumentação — Cobrança empresarial: os dois lados',
    tipoDocumento: 'ARGUMENTACAO',
    area: 'civil',
    subarea: 'cobranca',
    assunto: 'Cobrança e inadimplemento empresarial',
    prioridade: 'P0',
    lote: 'LOTE-001',
    conteudo: `## Argumento do credor (autor)
- Título/documento comprovante do débito; notificação extrajudicial feita; mora caracterizada.
- Correção + juros conforme contrato; honorários e custos.
- CC arts. 389-394 (mora e perdas e danos — mencionar genericamente); ação monitória/ordem de pagamento (se título).

## Argumento do devedor (réu)
- Ausência ou vício do título; inadimplemento por fato do credor (bem/serviço defeituoso); compensação de créditos.
- Usura/abuso na capitalização; cláusula penal excessiva (redução — CC art. 413).
- Prescrição da pretensão (CC art. 206 — conferir o regime do título).

## Jurisprudência favorável ao credor
- Título com liquidez e certeza permite monitória; mora ex re (documento com termo de vencimento).
- **REGRA EJC:** precedentes concretos a confirmar no portal do tribunal antes da citação.

## Jurisprudência favorável ao devedor
- Redução de cláusula penal desproporcional; vedação de enriquecimento sem causa; compensação provada.
- **REGRA EJC:** precedentes concretos a confirmar.

## Pontos controvertidos
- Existência e exigibilidade do débito; incidência de correção/juros; possibilidade de compensação; aplicação de cláusula penal e seu limite.

## Provas relevantes
- Contrato e títulos; notas fiscais; comprovantes de entrega/prestação; notificação extrajudicial; extratos de conta; correspondências; laudos (se discutida qualidade).

## Estratégia recomendada
- Credor: dossiê documental completo antes do ajuizamento; tentar acordo estruturado (parcelamento com garantia); escolher rito conforme o título.
- Devedor: mapear contracredito; checar prazos prescricionais; atacar capitalização e penalidades excessivas.`,
    metadados: { banco: 'BANCO 11 — Argumentos e Contra-Argumentos' },
    tags: ['civil/cobranca'],
    fonte: FONTE,
    urlFonte: null,
    dataConsulta: null,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  // ---------------- DOUTRINA (10 conceitos) ----------------
  conceito('doutrina-poder-de-policia-ambiental', 'Poder de polícia ambiental',
    'Faculdade de agir do Estado que limita e condiciona o exercício de direitos individuais em prol do interesse coletivo ambiental — inclui fiscalizar, licenciar, expedir medidas coercitivas e aplicar sanções.',
    'Art. 78 do CTN define poder de polícia genericamente (mencionar como referência sistêmica); art. 6º da Lei 6.938/1981 (SISNAMA) e legislação ambiental específica atribuem o exercício ambiental.',
    'Assegurar o uso sustentável dos recursos; prevenir e corrigir degradações antes que se tornem irreversíveis.',
    ['Competência legal do órgão', 'Procedimento regular (contraditório)', 'Proporcionalidade das medidas'],
    'Exemplos: lavratura de AI após fiscalização; embargo de obra sem licença; interdição de atividade poluidora.',
    'Controvérsias: alcance das sanções automáticas; concorrência de competências (federal/estadual/municipal); conversão de medidas restritivas em acordos de conduta.',
    'Jurisprudência: competências SISNAMA e controle de abusos — ver BANCO 02.',
    'Fundamenta defesas de excesso (medidas desproporcionais) e orienta órgãos na gradação correta.'),
  conceito('doutrina-responsabilidade-objetiva-ambiental', 'Responsabilidade civil objetiva ambiental',
    'O poluidor responde pelos danos ao ambiente e a terceiros independentemente de culpa — basta dano e nexo causal.',
    'Lei 6.938/1981, art. 14, § 1º.',
    'Distribuir o risco das atividades que geram lucros (quem lucra com o risco responde pelo dano) e proteger o ambiente como bem difuso.',
    ['Atividade do réu relacionada ao dano', 'Dano ambiental ou a terceiros', 'Nexo causal'],
    'Vazamento industrial que contamina rio indeniza a coletividade e terceiros ainda que sem culpa; rompimento de barragem responsabiliza o titular.',
    'Controvérsias: grau de endurecimento (risco integral x risco administrativo); excludentes (fortuito) em hipóteses graves.',
    'STJ: risco integral como linha consolidada — ver doc "stj-responsabilidade-objetiva-ambiental-risco-integral" (BANCO 02).',
    'Base de teses de acusação e defesa: a defesa eficaz ataca nexo/extensão, não culpa.'),
  conceito('doutrina-teoria-risco-integral', 'Teoria do risco integral',
    'Variação máxima da responsabilidade objetiva: o agente responde por todo o dano decorrente da atividade, sem excludentes (nem fortuito interno) em hipóteses graves.',
    'Construção jurisprudencial sobre a base da Lei 6.938/1981, art. 14, § 1º.',
    'Proteção máxima do bem ambiental: o prejuízo não deve recair sobre a coletividade quando a atividade se beneficia do risco.',
    ['Atividade de risco relevante', 'Dano grave e mensurável', 'Vínculo causal'],
    'Operação de risco elevado (barragens, químicos) responde por danos mesmo diante de eventos excepcionais, conforme grau.',
    'Controvérsias: aplicação absoluta x ponderada; limites constitucionais da responsabilidade sem excludentes.',
    'STJ consolidou a aplicação ambiental — ver BANCO 02.',
    'Reduz defesas possíveis: desloca a batalha para nexo, extensão do dano e perícia.'),
  conceito('doutrina-nexo-causal-ambiental', 'Nexo causal ambiental',
    'Vínculo de causalidade entre a conduta (ou omissão) do réu e o dano ambiental — elemento essencial mesmo na responsabilidade objetiva.',
    'Lei 6.938/1981, art. 14 (poluidor — quem causa); CC arts. 186/927 (regime geral, subsidiário).',
    'Evitar responsabilização aleatória; garantir previsibilidade e justiça na imputação.',
    ['Antecedência temporal', 'Adequação causal', 'Ausência de causas exclusivas alternativas'],
    'Série histórica de imagens demonstra degradação anterior à posse do réu — quebra de nexo; dano causado por terceiro invade o imóvel.',
    'Controvérsias: causalidade alternativa/concorrente; omissão fiscalizatória do Estado (solidariedade — Súmula 652/STJ); poluidor indireto.',
    'Ver BANCO 02 (Súmula 652/STJ; entendimento sobre poluidor indireto).',
    'Tese central de defesa em ACPs e autos de infração com dano difuso.'),
  conceito('doutrina-principio-poluidor-pagador', 'Princípio do poluidor-pagador',
    'Quem degrada deve arcar com os custos da prevenção, recuperação e compensação — internalização dos custos ambientais (não é licença para poluir pagando).',
    'CF art. 225, § 3º (responsabilização); Lei 6.938/1981 (instrumentos econômicos e responsabilização).',
    'Incentivar conformidade preventiva; evitar socialização dos custos do dano privado.',
    ['Atividade com potencial degradador', 'Dano ou risco assumido'],
    'Licenciamento com exigência de compensação; multas e serviços de recuperação como custos da atividade.',
    'Controvérsias: patamar adequado das compensações; interação com desenvolvimento econômico (CF art. 170, VI).',
    'Sistematizado na jurisprudência ambiental brasileira — ver BANCO 02.',
    'Fundamenta pedidos de recuperação integral e contrapeso a pedidos de redução de multa.'),
  conceito('doutrina-in-dubio-pro-natura', 'In dubio pro natura',
    'Critério hermenêutico: na dúvida de interpretação de norma ambiental, prevalece a solução mais protetiva ao meio ambiente.',
    'Construção jurisprudencial sistemática — consolidada no STJ (fonte institucional — ver BANCO 02).',
    'Preferir a leitura que maximize a proteção do bem jurídico ambiental, coerente com a natureza imperativa da tutela.',
    ['Dúvida interpretativa real', 'Ausência de proibição expressa em contrário'],
    'Dúvida sobre alcance de proibição de supressão resolve-se pela proteção; dúvida sobre competência para licenciar resolve-se pela proteção efetiva.',
    'Controvérsias: limites com a legalidade sancionadora (não ampliar tipos por analogia in malam partem) e com a segurança jurídica.',
    'STJ aplica o princípio — ver doc "stj-in-dubio-pro-natura" (BANCO 02).',
    'Argumento de reforço em defesas e em ações dos legitimados coletivos.'),
  conceito('doutrina-decaencia-administrativa-ambiental', 'Decadência administrativa ambiental',
    'Perda do direito de a administração instaurar o processo administrativo ambiental pelo decurso do tempo desde a prática do ato (ou cessação da infração continuada).',
    'Decreto 6.514/2008, art. 21 (redação atual — prescrição de 5 anos da ação de apuração); entendimento consolidado do STJ sobre decadência de 3 anos para regimes anteriores (validar precedentes).',
    'Segurança jurídica: evitar perseguições sancionatórias indefinidas.',
    ['Data do fato/cessação', 'Ausência de ato válido de apuração iniciado', 'Regime aplicável à época e ao órgão'],
    'Fato de 2018 sem AI até 2023: verificar regime aplicável (3 anos sob a jurisprudência do período; 5 anos na redação atual federal).',
    'Controvérsias: regime aplicável a fatos pretéritos; normas estaduais distintas; distinção decadência x prescrição em cada fase.',
    'Ver BANCO 02 — registro "decaencia-administrativa-ambiental-stj-validar" (status REVISAO_HUMANA).',
    'Sempre reconstruir a linha do tempo antes de alegar; nunca afirmar prazo sem verificação.'),
  conceito('doutrina-prescricao-penal-ambiental', 'Prescrição penal ambiental',
    'Extinção da punibilidade pelo decurso do tempo antes ou depois da condenação, conforme a pena cominada e os marcos da Lei 9.605/1998 e do Código Penal.',
    'Lei 9.605/1998, arts. 123-124 (prescrição da pretensão punitiva/reexecutória conforme penas); CP (regras gerais de prescrição — arts. 107, IV, 109 e ss., aplicados subsidiariamente).',
    'Segurança jurídica e pacificação social.',
    ['Pena abstrata/concreta aplicável', 'Marcos interruptivos (denúncia, condenação etc.)', 'Idade do réu (reduções do CP)'],
    'Crime com pena privativa de liberdade: prescrição conforme o máximo da pena cominada (art. 123 da Lei 9.605 remete ao CP).',
    'Controvérsias: contagem em crimes permanentes/continuados; interrupções múltiplas.',
    'Verificar precedentes específicos no STJ/STF antes de citar números.',
    'Tese preliminar comum em ações penais ambientais antigas.'),
  conceito('doutrina-desenvolvimento-sustentavel', 'Desenvolvimento sustentável',
    'Modelo de exploração econômica que assegura a conservação dos recursos para as gerações futuras — compatibilização, não hierarquização absoluta.',
    'CF arts. 170, VI e 225; Lei 6.938/1981, art. 2º (compatibilização).',
    'Conciliar atividade produtiva e preservação; garantir equidade intergeracional.',
    ['Licenciamento adequado', 'Medidas mitigadoras/compensatórias', 'Monitoramento'],
    'Empreendimento licenciado com condicionantes de recuperação e monitoramento de área degradada.',
    'Controvérsias: densidade do conceito (aberto); equilíbrio entre desenvolvimento e proteção em casos concretos.',
    'Jurisprudência constitucional reconhece a compatibilização — ver BANCO 02.',
    'Fundamenta tanto autorizações com condicionantes quanto recusas quando as medidas não são suficientes.'),
  conceito('doutrina-instrumentos-economicos-ambientais', 'Instrumentos econômicos de proteção ambiental',
    'Mecanismos de mercado e incentivos (pagamentos por serviços ambientais, crédito verde, compensação, conversão de multas) que orientam comportamentos sem exclusividade punitiva.',
    'Lei 6.938/1981 (instrumentos); Lei 9.605/1998 (conversão de multa em serviços de preservação); Lei 14.119/2021 (PSA — mencionar como referência de expansão).',
    'Conformidade econômica: tornar a proteção mais vantajosa que a degradação.',
    ['Medição do serviço/dano', 'Vínculo com recuperação efetiva'],
    'Conversão de multa em recuperação de nascente; pagamento por serviços ecossistêmicos a proprietários conservadores.',
    'Controvérsias: risco de "compra de impunidade" se descolada da recuperação real; requisitos da conversão.',
    'Ver BANCO 02 e Decreto 6.514/2008 (conversão — conferir artigos vigentes).',
    'Base de teses de conversão de multa e estratégias de regularização.'),
];

function conceito(
  slug: string,
  nome: string,
  definicao: string,
  fundamento: string,
  finalidade: string,
  requisitos: string[],
  exemplos: string,
  controversias: string,
  jurisprudencia: string,
  aplicacao: string,
): InputDocument {
  return {
    slug,
    titulo: `Conceito: ${nome}`,
    tipoDocumento: 'DOUTRINA',
    area: 'ambiental',
    subarea: 'auto-infracao',
    assunto: nome,
    prioridade: 'P0',
    lote: 'LOTE-001',
    conteudo: `## Conceito
${definicao}

## Fundamento
${fundamento}

## Finalidade
${finalidade}

## Requisitos
${requisitos.map((r) => `- ${r}`).join('\n')}

## Exemplos
${exemplos}

## Controvérsias
${controversias}

## Jurisprudência relacionada
${jurisprudencia}

## Aplicação prática
${aplicacao}`,
    metadados: { banco: 'BANCO 12 — Doutrina e Conceitos' },
    tags: ['ambiental/auto-infracao', 'ambiental/responsabilidade-civil'],
    fonte: 'Elaboração EJC — síntese própria (sem reprodução de obras protegidas)',
    urlFonte: null,
    dataConsulta: null,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  };
}
