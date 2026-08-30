import { baseDoc } from "./_base.mjs";

const CAMPOS_COMUNS = ["{{CLIENTE}}", "{{CPF}}", "{{CNPJ}}", "{{PROCESSO}}", "{{JUIZO}}", "{{FATOS}}", "{{VALOR}}", "{{DATA}}", "{{PEDIDOS}}", "{{CONTRAPARTE}}"];

export const pecas = [

// ============ PEÇA 1 ============
baseDoc({
  slug: "peca-defesa-administrativa-ambiental",
  titulo: "Peça — Defesa Administrativa em Auto de Infração Ambiental",
  tipoDocumento: "PECA",
  area: "ambiental",
  subarea: "defesa-administrativa-ambiental",
  assunto: "Auto de Infração Ambiental",
  subassunto: "Defesa administrativa (impugnação)",
  tags: ["ambiental/auto-infracao", "peca", "defesa-administrativa", "P0"],
  metadados: {
    tipoPeca: "DEFESA_ADMINISTRATIVA",
    situacaoUso: "Recebimento de AI com prazo de defesa de 20 dias (Decreto 6.514/2008, art. 141 [VALIDAR ARTIGO]) — modelo federal, adaptar ao regulamento estadual/municipal",
    requisitos: ["Tempestividade (20 dias)", "Interessado qualificado", "Procuração", "Cópia integral do AI e anexos"],
    documentosNecessarios: ["AI + anexos", "Procuração", "Documentos de identificação e representação", "Laudos contraprovas", "Licenças", "Provas de regularização"],
    camposVariaveis: ["{{AUTORIDADE}}", "{{NUMERO_AI}}", "{{ORGAO_AUTUADOR}}", "{{INFRACAO_ALEGADA}}", "{{MULTA}}", "{{DATA}}", "{{FATOS}}", "{{CLIENTE}}", "{{CNPJ}}", "{{CPF}}", "{{ENDERECO}}", "{{PEDIDOS}}"],
    modelo: true,
    paresComTese: ["tese-nulidade-formal-ai-ambiental", "tese-decadencia-administrativa-ambiental", "tese-ausencia-materialidade-ai-ambiental", "tese-in-dubio-pro-natura-ai-ambiental", "tese-erro-sobre-proibicao-ai-ambiental", "tese-atenuacao-multa-proporcionalidade-ambiental", "tese-ilegitimidade-competencia-orgao-autuador", "tese-vicios-dosimetria-multa-ambiental", "tese-regularizacao-superveniente-atenuante", "tese-ausencia-nexo-causal-ambiental"]
  },
  conteudo: `# PEÇA — DEFESA ADMINISTRATIVA EM AUTO DE INFRAÇÃO AMBIENTAL (MODELO)

## A. FICHA DA PEÇA
- **Situação de uso:** autuado recebeu Auto de Infração (AI) ambiental e deve apresentar defesa administrativa no prazo de **20 dias** (Decreto 6.514/2008, art. 141 — [VALIDAR ARTIGO] no arquivo de legislação antes da versão final; adaptar ao regulamento do órgão estadual/municipal).
- **Requisitos:** tempestividade; legitimidade (autuado ou procurador); documentos de representação; impugnação específica de fatos e fundamentos.
- **Documentos necessários:** AI integral + anexos (laudo, fotos, autos de constatação); procuração; documentos societários/identificação; contraprovas técnicas; licenças; prova de regularização.
- **Estrutura:** I — qualificação e tempestividade; II — preliminares (nulidade; incompetência; decadência); III — mérito (materialidade; nexo causal; erro; in dubio pro natura); IV — dosimetria subsidiária (gradação; proporcionalidade; atenuantes); V — pedidos.
- **Fundamentos possíveis:** CF/88, art. 5º, LV e art. 225; Lei 9.605/1998, arts. 70-76D, 14 e 18; Decreto 6.514/2008 (defesa 20 dias — art. 141 [VALIDAR ARTIGO]; decadência 3 anos); Lei 6.938/1981, art. 14, §1º; CC, arts. 186, 927 e 944. Outros dispositivos: [DISPOSITIVO A VALIDAR].
- **Riscos:** atraso (decadência do direito de defesa); defesa genérica (não impugnar especificamente presume veracidade); revelar prova própria sem necessidade; discussão só de forma sem mérito subsidiário.
- **Campos variáveis:** ver lista em "metadados.camposVariaveis" — preencher TODOS antes do protocolo; nunca inserir fato fictício.

## B. TEXTO-BASE COMPLETO

AO(A) {{AUTORIDADE}}
{{ORGAO_AUTUADOR}} — Setor/Unidade de Julgamento Administrativo

DEFESA ADMINISTRATIVA EM AUTO DE INFRAÇÃO
Processo administrativo nº {{PROCESSO}}
Auto de Infração nº {{NUMERO_AI}}

**{{CLIENTE}}**, pessoa {{física/jurídica}}, inscrita sob o CPF {{CPF}} / CNPJ {{CNPJ}}, com endereço em {{ENDERECO}}, por seu procurador infra-assinado, vem, respeitosamente, com fundamento no art. 5º, LV, da Constituição Federal e no Decreto 6.514/2008, apresentar DEFESA ADMINISTRATIVA contra o Auto de Infração nº {{NUMERO_AI}}, lavrado em {{DATA}}, que lhe imputa {{INFRACAO_ALEGADA}} e aplica multa no valor de {{MULTA}}, pelos fatos e fundamentos a seguir.

### I — TEMPESTIVIDADE E DO INTERESSE
A presente defesa é interposta dentro do prazo legal de 20 (vinte) dias contados da notificação (Decreto 6.514/2008, art. 141 — [VALIDAR ARTIGO]), conforme comprovante de ciência anexo (doc. 01). O interesse de agir decorre da imputação concreta de sanção.

### II — DOS FATOS
{{FATOS}}
(Narrativa objetiva: contexto da atividade, licenças vigentes, circunstância da fiscalização, atuação do autuado. **NUNCA inserir fato fictício — preencher exclusivamente com a versão documentada pelo cliente.**)

### III — PRELIMINARES

#### III.1 — Da nulidade formal do Auto de Infração
O AI nº {{NUMERO_AI}} descreve {{descrever objetivamente o vício: descrição genérica, ausência de fundamentação legal, local impreciso, autuação de pessoa/local equivocados, ausência de assinatura do autuante}}. A imputação que não permite ao autuado conhecer com precisão a conduta censurada viola o contraditório e a ampla defesa (CF/88, art. 5º, LV). Precedente argumentativo: os tribunais exigem motivação e especificidade do ato sancionador (entendimentos consolidados — não citar número sem verificação oficial).

#### III.2 — Da incompetência do órgão autuador
[Quando aplicável] O fato imputado ocorre em {{local/bem}} e a atividade é licenciada pelo ente {{federal/estadual/municipal}} (doc. XX). O {{ORGAO_AUTUADOR}} não detém competência sobre o fato, pois {{fundamento}}. O ato praticado por autoridade sem competência é nulo.

#### III.3 — Da decadência administrativa
A infração foi constatada em {{DATA}} e o AI foi lavrado apenas em {{DATA}}, superando o prazo decadencial de 3 (três) anos previsto no Decreto 6.514/2008. Não há, nos autos, ato idôneo e comprovado de interrupção. Impõe-se o cancelamento do AI, pois poder administrativo decadido não se revive.

### IV — DO MÉRITO

#### IV.1 — Da ausência de materialidade
O AI não se apoia em prova técnica da infração: {{descrever: laudo inexistente/genérico/contraditório; fotos sem identificação; ausência de medição}}. A materialidade é elemento essencial da sanção; sua ausência impede a punição.

#### IV.2 — Da ausência de nexo causal
O dano descrito não decorre da conduta do autuado: {{prova de autoria de terceiro / localização fora do imóvel / incompatibilidade técnica}}. A responsabilidade objetiva (Lei 6.938/1981, art. 14, §1º) dispensa a culpa, mas exige atividade, dano e nexo causal — sem o terceiro elemento, não há imputação válida.

#### IV.3 — Do erro sobre a proibição / boa-fé
[Quando aplicável] O autuado agiu amparado por {{licença/autorização/parecer}} (doc. XX), emitido pelo próprio órgão, de modo que {{descrever}}. O erro é escusável e afasta ou reduz a sanção.

#### IV.4 — Do in dubio pro natura
A dúvida sobre o enquadramento e sobre a extensão do fato deve ser interpretada de modo a não punir com base em incerteza (entendimento consolidado no STJ — in dubio pro natura; validar julgado específico antes de citar número).

### V — SUBSIDIARIAMENTE: DA DOSIMETRIA E DA PROPORCIONALIDADE
Ainda que superadas as questões anteriores (o que se impugna), a multa de {{MULTA}} é desproporcional:
1. **Gradação:** a Lei 9.605/1998, arts. 70-76D, exige considerar gravidade, antecedentes e porte econômico; o cálculo aplicou {{patamar/multiplicador}} sem motivação individualizada, com dupla valoração de {{parâmetro}}.
2. **Reincidência inexistente:** {{impugnar, se o caso}}.
3. **Atenuantes:** houve {{cessação/reparação/regularização — Lei 9.605/1998, art. 14}}: docs. XX a XX. Solicita-se a aplicação da atenuante e, quando cabível, a conversão em medidas de reparação (Lei 9.605/1998, art. 18; Decreto 6.514/2008 — [DISPOSITIVO A VALIDAR]).
4. **Contracálculo:** anexa planilha demonstrando o valor tecnicamente devido de {{VALOR}}, se subsistir qualquer sanção.

### VI — DOS PEDIDOS
a) O acolhimento das preliminares, com a **nulidade/cancelamento** do AI nº {{NUMERO_AI}}, por vício formal, incompetência e decadência;
b) No mérito, a **insubsistência** da imputação por ausência de materialidade e nexo causal;
c) Subsidiariamente, a **refação da dosimetria**, com exclusão de agravantes, aplicação de atenuantes e fixação no patamar mínimo;
d) A **conversão** da multa em medidas de reparação, quando admitida;
e) A juntada e consideração de todos os documentos anexos;
f) A expedição de decisão fundamentada e a intimação do autuado.

Termos em que pede deferimento.
{{LOCAL}}, {{DATA}}.
_______________________________
Advogado(a) — OAB/{{UF}} nº {{OAB}}

**Anexos:** 1) procuração; 2) AI e notificação; 3) contraprovas; 4) licenças; 5) planilha de contracálculo; 6) demais docs.

## C. CHECKLIST DE REVISÃO (antes de protocolar)
- [ ] Prazo de 20 dias confirmado com prova de notificação
- [ ] Todos os campos {{VARIÁVEIS}} preenchidos — zero lacunas
- [ ] Cada preliminar aponta o vício com referência objetiva (página/linha do AI)
- [ ] Mérito sempre apresentado (mesmo com preliminar forte)
- [ ] Contraprova técnica anexada e identificada
- [ ] Contracálculo conferido por segundo revisor
- [ ] Regulamento do órgão (federal/estadual) conferido — artigos [VALIDADOS]
- [ ] Nenhum dispositivo fora da lista confiável sem marcação [DISPOSITIVO A VALIDAR]
- [ ] Nenhum número de julgado/súmula sem verificação oficial
- [ ] Assinatura, OAB e anexos conferidos`
}),

// ============ PEÇA 2 ============
baseDoc({
  slug: "peca-peticao-inicial-civel-repeticao-indenizacao",
  titulo: "Peça — Petição Inicial Cível (repetição de indébito / indenização empresarial genérica)",
  tipoDocumento: "PECA",
  area: "processual-civil",
  subarea: "peticao-inicial",
  assunto: "Ação de repetição de indébito e indenização",
  subassunto: "Demanda cível genérica empresarial",
  tags: ["civel/indicacao", "peca", "peticao-inicial", "P0"],
  metadados: {
    tipoPeca: "PETICAO_INICIAL",
    situacaoUso: "Cliente pessoa jurídica/física busca recuperar valores pagos indevidamente e/ou indenização por prejuízo — modelo estrutural genérico a adaptar",
    requisitos: ["Legitimidade e interesse", "Causa de pedir narrada com documentos", "Valores discriminados", "Prova do pagamento e do indevido"],
    documentosNecessarios: ["Contratos", "Comprovantes de pagamento", "Correspondências/notificações", "Prova do dano", "Documentos de representação"],
    camposVariaveis: ["{{JUIZO}}", "{{CLIENTE}}", "{{CPF}}", "{{CNPJ}}", "{{CONTRAPARTE}}", "{{VALOR}}", "{{DATA}}", "{{FATOS}}", "{{PEDIDOS}}", "{{PROCESSO}}"],
    modelo: true
  },
  conteudo: `# PEÇA — PETIÇÃO INICIAL CÍVEL: REPETIÇÃO DE INDÉBITO E INDENIZAÇÃO (MODELO)

## A. FICHA DA PEÇA
- **Situação de uso:** cliente pagou valores indevidos e/ou sofreu prejuízo decorrente de conduta ilícita da contraparte; modelo estrutural genérico para demandas cíveis empresariais, a adaptar ao caso concreto (relação de consumo, contratual ou extracontratual).
- **Requisitos:** pressupostos processuais; legitimidade das partes; interesse; causa de pedir com lastro documental; valor da causa; pedido líquido ou com método de líquidação.
- **Documentos necessários:** contrato e aditivos; comprovantes de pagamento (extratos, recibos); correspondências e notificações; prova do "indevido" (contracálculo); prova do dano (laudo, orçamentos, demonstrações); procuração; documentos de representação societária.
- **Estrutura:** I — parte e representação; II — resumo dos fatos; III — fundamentos (enriquecimento sem causa / ato ilícito / responsabilidade contratual); IV — tutela de urgência (se cabível — CPC, art. 300); V — pedidos; VI — valor da causa; VII — provas; VIII — audiência de conciliação.
- **Fundamentos possíveis (lista confiável EJC):** CC, arts. 186, 927 e 944 (ato ilícito, responsabilidade, medida da indenização pela extensão do dano); CC, art. 206, §3º, V (prescrição trienal da pretensão de reparação civil — ATENÇÃO à data do fato); CDC, art. 6º (direitos básicos — quando relação de consumo) e arts. 26-27 (prazos); CPC, art. 300 (tutela de urgência) e art. 219 (dias úteis). Enriquecimento sem causa — dispositivo específico: [DISPOSITIVO A VALIDAR].
- **Riscos:** prescrição (CC, art. 206, §3º, V — 3 anos para reparação civil; validar termo inicial); pedido genérico sem liquidez; ausência de prova do pagamento; transparência insuficiente dos cálculos.
- **Campos variáveis:** {{JUIZO}} {{CLIENTE}} {{CPF}} {{CNPJ}} {{CONTRAPARTE}} {{VALOR}} {{DATA}} {{FATOS}} {{PEDIDOS}} {{PROCESSO}} {{ENDERECO}} {{INDEXADOR}}.

## B. TEXTO-BASE COMPLETO

EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA {{VARA}} DO {{JUIZO}}

Autos nº: a distribuir

**{{CLIENTE}}**, {{nacionalidade/estado}}, pessoa jurídica de direito privado inscrita no CNPJ sob o nº {{CNPJ}}, com sede em {{ENDERECO}}, representada na forma de seus atos constitutivos, por seu procurador infra-assinado, vem propor a presente **AÇÃO DE REPETIÇÃO DE INDÉBITO COM CUMULAÇÃO DE INDENIZAÇÃO POR DANOS {{MATERIAIS/MORAIS}}** em face de **{{CONTRAPARTE}}** ({{CPF/CNPJ}}), pelos fatos e fundamentos a seguir.

### I — DOS FATOS
{{FATOS}}
(Narrativa cronológica objetiva: natureza da relação; pagamento(s) efetuado(s) em {{DATA}}, no valor de {{VALOR}}; por que o pagamento foi indevido; tentativas extrajudiciais de solução {{notificações, e-mails}}; dano suportado.)

### II — DO DIREITO

#### II.1 — Do pagamento indevido e da repetição
O autor efetuou pagamentos que não eram devidos, pois {{causa do indevido: cobrança sem base contratual, cobrança de valor superior ao contratado, serviço não prestado}} (docs. XX). A retenção sem causa configura enriquecimento injusto, impondo-se a devolução [fundamento específico: DISPOSITIVO A VALIDAR], com correção pelo índice {{INDEXADOR}} desde cada desembolso (termo: validar critério aplicável no caso).

#### II.2 — Da responsabilidade civil e do dano
A conduta da ré {{descrever}} constitui ato ilícito (CC, art. 186) e gera o dever de indenizar (CC, art. 927). A indenização mede-se pela extensão do dano (CC, art. 944): danos materiais de {{VALOR}} comprovados por {{docs}}, além de dano {{moral}} {{justificativa qualitativa — sem valor arbitrário em doutrina, sustentar por elementos do caso}}.

#### II.3 — Da prescrição (atenção interna — NÃO constar da peça quando desfavorável)
Pretensão de reparação civil: 3 anos (CC, art. 206, §3º, V). Termo inicial a validar pela tese adotada (ato/dano/ciência). Se o caso for de consumo, prazos próprios: CDC, arts. 26 e 27.

#### II.4 — Da tutela de urgência (se cabível)
Presentes probabilidade do direito e perigo de dano/risco de resultado inútil (CPC, art. 300), requer-se {{tutela específica: suspensão de cobrança, bloqueio, obrigação de fazer}}.

### III — DOS PEDIDOS
a) A condenação da ré à **repetição** dos valores pagos indevidamente de {{VALOR}}, corrigidos pelo {{INDEXADOR}} e acrescidos de juros na forma legal;
b) A condenação da ré ao pagamento de **danos materiais** de {{VALOR}};
c) A condenação da ré em **danos {{moriais}}** que o juízo arbitrar com justiça [ou valor líquido: {{VALOR}}];
d) A condenação da ré em custas e honorários;
e) A produção de todas as provas admitidas (documental, testemunhal, pericial);
f) A intimação para audiência de conciliação (CPC);
g) {{PEDIDOS}} — Tutela de urgência: {{especificar}}.

Dá-se à causa o valor de {{VALOR}}.

Termos em que pede deferimento.
{{LOCAL}}, {{DATA}}.
_______________________________
Advogado(a) — OAB/{{UF}} nº {{OAB}}

## C. CHECKLIST DE REVISÃO
- [ ] Todos os campos {{VARIÁVEIS}} preenchidos; nenhum fato fictício
- [ ] Comprovação documental de CADA pagamento repetendo
- [ ] Contracálculo anexado (memória de cálculo)
- [ ] Prescrição analisada (CC, art. 206, §3º, V) antes do protocolo
- [ ] Valor da causa = soma coerente dos pedidos
- [ ] Tutela de urgência só com prova do perigo (CPC, art. 300)
- [ ] Dispositivos fora da lista confiável marcados [DISPOSITIVO A VALIDAR]
- [ ] Procuração e documentos de representação válidos`
}),

// ============ PEÇA 3 ============
baseDoc({
  slug: "peca-contestacao-civel-generica",
  titulo: "Peça — Contestação Cível Genérica Robusta",
  tipoDocumento: "PECA",
  area: "processual-civil",
  subarea: "contestacao",
  assunto: "Resposta à ação civil",
  subassunto: "Contestação com preliminares e mérito",
  tags: ["civel/defesa", "peca", "contestacao", "P0"],
  metadados: {
    tipoPeca: "CONTESTACAO",
    situacaoUso: "Cliente citado em ação cível; prazo de contestação de 15 dias úteis (CPC, art. 335; contagem em dias úteis — CPC, art. 219)",
    requisitos: ["Tempestividade", "Impugnação especificada dos fatos", "Preliminares processuais oportunas", "Provas e contraprovas"],
    documentosNecessarios: ["Petição inicial e documentos", "Contrato entre as partes", "Prova dos pagamentos", "Comprovantes de atos praticados", "Documentos de defesa (cálculos, laudos)"],
    camposVariaveis: ["{{JUIZO}}", "{{PROCESSO}}", "{{CLIENTE}}", "{{CNPJ}}", "{{CPF}}", "{{CONTRAPARTE}}", "{{FATOS}}", "{{VALOR}}", "{{DATA}}", "{{PEDIDOS}}"],
    modelo: true
  },
  conteudo: `# PEÇA — CONTESTAÇÃO CÍVEL GENÉRICA (MODELO ROBUSTO)

## A. FICHA DA PEÇA
- **Situação de uso:** réu citado em ação cível qualquer (cobrança, indenização, obrigação de fazer). Prazo: **15 dias úteis** (CPC, art. 335), contados em dias úteis (CPC, art. 219), salvo regras especiais.
- **Requisitos:** impugnação especificada de cada fato (defesa indireta não supre omissões relevantes); alegação de TODAS as preliminares na primeira oportunidade (preclusão); apresentação de contraprovas.
- **Documentos necessários:** inicial + anexos; contrato; comprovantes de pagamento; cronologia documental; parecer técnico (quando o litígio envolver matéria técnica); documentos societários.
- **Estrutura:** I — tempestividade e legitimidade; II — preliminares processuais (inépcia; incompetência; prescrição; ilegitimidade); III — impugnação especificada dos fatos; IV — mérito (ausência de obrigação; pagamento; compensação; culpa exclusiva da parte contrária; measure da indenização); V — requerimentos probatórios; VI — pedidos.
- **Fundamentos possíveis (lista confiável EJC):** CPC, arts. 219, 300 (contra tutela), 335 e 1.003, §5º (recursos — prazos úteis); CC, arts. 186, 927 e 944 (para atacar a extensão do dano e o ilícito alegado); CC, art. 206, §3º, V (prescrição trienal); CDC, arts. 6º, 26 e 27 (quando aplicável). Dispositivos sobre presunção de veracidade e ônus da prova: [DISPOSITIVO A VALIDAR].
- **Riscos:** omissão de impugnação especificada (presunção de veracidade); perda de preliminares; contraprova tardia; admitir fatos por narrativa descuidada.
- **Campos variáveis:** ver metadados.

## B. TEXTO-BASE COMPLETO

EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA {{VARA}} DO {{JUIZO}}
Processo nº {{PROCESSO}}

**{{CLIENTE}}** ({{CPF/CNPJ}}), réu, por seu procurador, vem apresentar **CONTESTAÇÃO** à ação movida por **{{CONTRAPARTE}}**, o fazendo na forma a seguir.

### I — TEMPESTIVIDADE
A citação ocorreu em {{DATA}} e a presente contestação é protocolada no prazo de 15 dias úteis (CPC, arts. 219 e 335).

### II — PRELIMINARES PROCESSUAIS

#### II.1 — Da prescrição (quando cabível)
O fato que sustenta a pretensão autoral ocorreu em {{DATA}}, prazo superior a 3 anos, consumando-se a prescrição da pretensão de reparação civil (CC, art. 206, §3º, V). Não há causa impeditiva/suspensiva nos autos.

#### II.2 — Da incompetência relativa (quando cabível)
O foro eleito/competente é {{foro}}, pois {{fundamento: lugar do cumprimento da obrigação / contrato com cláusula de eleição}}.

#### II.3 — Da inépcia/ilegitimidade (quando cabível)
{{fundamento específico}}.

### III — IMPUGNAÇÃO ESPECIFICADA DOS FATOS
O réu impugna ESPECIFICAMENTE, um a um, os fatos narrados na inicial:
1. **Sobre a existência da obrigação:** {{negativa fundamentada}}.
2. **Sobre os pagamentos/debitos alegados:** {{concordância parcial com contracálculo; divergências numeradas}}.
3. **Sobre o dano alegado:** {{não ocorrência; ou ocorrência por fato exclusivo de terceiro/culpa exclusiva do autor; ou extensão menor}}.
*(Regra prática: cada parágrafo da inicial deve ter contraponto expresso ou reconhecimento dosado.)*

### IV — DO MÉRITO (DEFESAS DIRETAS)

#### IV.1 — Da inexistência/inadimplemento não configurado
{{fundamento}}.

#### IV.2 — Do pagamento/compensação
O réu pagou {{VALOR}} em {{DATA}} (docs.) — a repetição pretendida ignora os créditos compensáveis.

#### IV.3 — Da extensão da indenização
Ainda que houvesse dever de indenizar (o que se nega), a indenização mede-se pela extensão do dano (CC, art. 944), e a inicial não demonstra {{dano; nexo; quantum}}, limitando-se a {{arbitrariedade}}. O ato ilícito (CC, art. 186) e o dever de indenizar (CC, art. 927) não se presumem.

#### IV.4 — Da eventual abusividade dos pedidos acessórios
{{juros/multas/tutela — atacar na medida}}.

### V — PROVAS
Requer-se: {{juntada de docs}}, {{testemunhas rol}}, {{perícia contábil/técnica}}, {{expedição de ofícios}}.

### VI — DOS PEDIDOS
a) O acolhimento das preliminares, com a extinção do feito;
b) No mérito, a total improcedência dos pedidos;
c) Subsidiariamente, a redução dos valores à extensão comprovada (CC, art. 944);
d) A condenação da parte autora em custas e honorários;
e) A julgamento antecipado, caso dispensada prova oral.

Termos em que pede deferimento.
{{LOCAL}}, {{DATA}}.
_______________________________
Advogado(a) — OAB/{{UF}} nº {{OAB}}

## C. CHECKLIST DE REVISÃO
- [ ] Prazo de 15 dias úteis conferido (CPC, arts. 219 e 335)
- [ ] TODAS as preliminares cabíveis arguidas (preclusão!)
- [ ] Impugnação específica parágrafo a parágrafo
- [ ] Contracálculo anexado
- [ ] Tese de prescrição avaliada (CC, art. 206, §3º, V) com termo inicial documentado
- [ ] Nenhuma confissão inadvertida em narrativa
- [ ] Rol de testemunhas/rol de provas finalizado no prazo
- [ ] Campos {{VARIÁVEIS}} 100% preenchidos; dispositivos não confiáveis marcados [DISPOSITIVO A VALIDAR]`
}),

// ============ PEÇA 4 ============
baseDoc({
  slug: "peca-recurso-administrativo-reconsideracao-ambiental",
  titulo: "Peça — Recurso Administrativo Ambiental (pedido de reconsideração)",
  tipoDocumento: "PECA",
  area: "ambiental",
  subarea: "defesa-administrativa-ambiental",
  assunto: "Auto de Infração Ambiental",
  subassunto: "Recurso administrativo / reconsideração",
  tags: ["ambiental/auto-infracao", "peca", "recurso-administrativo", "P0"],
  metadados: {
    tipoPeca: "RECURSO_ADMINISTRATIVO",
    situacaoUso: "Decisão administrativa desfavorável na defesa de primeiro grau; reconsideração junto à mesma autoridade ou recurso à instância superior — prazos: validar no regulamento do órgão [DISPOSITIVO A VALIDAR]",
    requisitos: ["Tempestividade", "Novo argumento/prova ou reexame integral conforme cabimento", "Interesse (resultado efetivamente possível)"],
    documentosNecessarios: ["Decisão recorrida", "Provas novas", "Memoriais anteriores", "Procuração"],
    camposVariaveis: ["{{AUTORIDADE}}", "{{ORGAO_AUTUADOR}}", "{{NUMERO_AI}}", "{{PROCESSO}}", "{{MULTA}}", "{{DATA}}", "{{FATOS}}", "{{CLIENTE}}", "{{CPF}}", "{{CNPJ}}"],
    modelo: true
  },
  conteudo: `# PEÇA — RECURSO ADMINISTRATIVO AMBIENTAL / PEDIDO DE RECONSIDERAÇÃO (MODELO)

## A. FICHA DA PEÇA
- **Situação de uso:** indeferimento (parcial ou total) da defesa em AI; instância recursal administrativa. Prazos e formato do recurso variam por órgão — verificar o regulamento aplicável antes de protocolar: [DISPOSITIVO A VALIDAR]. Em regime federal, a infração apurada pelo Decreto 6.514/2008 admite hierárquico em instância superior.
- **Requisitos:** tempestividade; interesse; motivação (não basta repetir a defesa — evidenciar o erro da decisão); provas novas quando disponíveis.
- **Documentos necessários:** decisão recorrida integral; autos de primeiro grau (cópia); provas novas; procuração.
- **Estrutura:** I — tempestividade; II — síntese da decisão recorrida; III — pontos impugnados numerados; IV — fundamentos (duplicar teses fortes + acrescer novos elementos); V — pedidos.
- **Fundamentos possíveis:** CF/88, art. 5º, LV (duplo grau administrativo como garantia processual plena); Lei 9.605/1998, arts. 70-76D, 14 e 18; Decreto 6.514/2008 (defesa/recursos — art. 141 [VALIDAR ARTIGO]; decadência 3 anos); Lei 6.938/1981, art. 14, §1º; demais dispositivos do regulamento do órgão: [DISPOSITIVO A VALIDAR].
- **Riscos:** recurso meramente repetitivo (minado de antemão); prazo perdido; ausência de provas novas reduz expectativa; decisão de recurso pode regravar pontos sem prejuízo — estratégia de preservação para judicialização.
- **Campos variáveis:** ver metadados.

## B. TEXTO-BASE COMPLETO

AO(A) {{AUTORIDADE}}
{{ORGAO_AUTUADOR}} — Instância {{Reconsideração/Recursal}}

RECURSO ADMINISTRATIVO / PEDIDO DE RECONSIDERAÇÃO
Processo nº {{PROCESSO}} — Auto de Infração nº {{NUMERO_AI}}

**{{CLIENTE}}** ({{CPF/CNPJ}}), por seu procurador, inconformado com a decisão proferida em {{DATA}}, que {{síntese: manteve a multa de {{MULTA}} / rejeitou a preliminar de {{}}}}, interpõe o presente recurso, pelos fundamentos a seguir.

### I — TEMPESTIVIDADE
Interposto no prazo regulamentar [confirmar dias no regulamento do órgão — DISPOSITIVO A VALIDAR], conforme ciência de {{DATA}} (doc. 01).

### II — DA DECISÃO RECORRIDA
A decisão entendeu que: (i) {{ponto 1}}; (ii) {{ponto 2}}; (iii) {{ponto 3}}. O recorrente impugna, de modo isolado e específico, os itens a seguir.

### III — DOS PONTOS IMPUGNADOS

#### III.1 — Erro na valoração da prova
A decisão acolheu o laudo de origem sem enfrentar a contraprova técnica (docs.), que demonstra {{objetivamente}}. Motivação que desconsidera prova carreada aos autos é insuficiente (CF/88, art. 5º, LV).

#### III.2 — Erro na dosimetria
Ainda que mantida a imputação, o cálculo mantém {{dupla valoração / reincidência indevida / multiplicador sem motivação}} (Lei 9.605/1998, arts. 70-76D; Decreto 6.514/2008 — critérios: [DISPOSITIVO A VALIDAR]). A decisão não se manifestou sobre o contracálculo apresentado — omissão que vicia o ato.

#### III.3 — Da decadência (se aplicável)
Persiste a nulidade por lavratura além do prazo de 3 anos do Decreto 6.514/2008; a decisão não afastou a cronologia documentada.

#### IV.4 — Da regularização superveniente e atenuantes
Novos elementos (docs.): {{licença obtida / recuperação executada / termo assinado}}. A Lei 9.605/1998, art. 14, exige consideração do arrependimento e da reparação; o art. 18 autoriza substituição. A decisão ignorou tais circunstâncias.

### IV — DOS PEDIDOS
a) O provimento do recurso, com a **cancelamento** do AI nº {{NUMERO_AI}};
b) Subsidiariamente, a **refação da dosimetria** nos termos do contracálculo;
c) A apreciação específica de cada ponto impugnado, com decisão fundamentada;
d) {{PEDIDOS}} — reconhecimento de efeitos suspensivos do recurso quanto à inscrição/exigibilidade, conforme regulamento [DISPOSITIVO A VALIDAR].

Termos em que pede deferimento.
{{LOCAL}}, {{DATA}}.
_______________________________
Advogado(a) — OAB/{{UF}} nº {{OAB}}

## C. CHECKLIST DE REVISÃO
- [ ] Prazo recursal do órgão confirmado [VALIDADO]
- [ ] Pontos impugnados numerados e referenciados à decisão
- [ ] Provas novas identificadas como tais
- [ ] Contracálculo reapresentado
- [ ] Teses de preservação para judicialização consideradas (listar quais se discutiram)
- [ ] Campos {{VARIÁVEIS}} preenchidos; dispositivos marcados [DISPOSITIVO A VALIDAR] quando fora da lista confiável`
})
];
