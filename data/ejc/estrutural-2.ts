// LOTE-001 P0 — ESTRUTURAL (2/2): PEÇAS, CONTRATOS, CHECKLISTS, FLUXOS,
// TABELAS DE DOCUMENTOS, TRIAGEM, REGRAS DE INTELIGÊNCIA, JURIMETRIA
// Modelos usam campos variáveis {{...}} — nenhum fato fictício apresentado como real.
import type { InputDocument } from '../../src/lib/ejc/types';

const D = '2026-08-29';
const FONTE = 'Elaboração EJC — conteúdo estrutural original';

function base(
  slug: string, titulo: string, tipoDocumento: string, area: string, subarea: string,
  assunto: string, conteudo: string, tags: string[], prioridade = 'P0',
): InputDocument {
  return {
    slug, titulo, tipoDocumento, area, subarea, assunto, prioridade, lote: 'LOTE-001',
    conteudo, metadados: {}, tags, fonte: FONTE, urlFonte: null, dataConsulta: null,
    confiabilidade: 'B', vigente: true, status: 'ATIVO', dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-11-29',
  };
}

export default [
  // ================= PEÇAS (4) =================
  base('peca-defesa-administrativa-ambiental', 'Peça: Defesa Administrativa Ambiental (contra Auto de Infração)',
    'PECA', 'ambiental', 'auto-infracao', 'Defesa administrativa', `## Situação de uso
Autuado notificado de auto de infração ambiental (âmbito federal — Decreto 6.514/2008; conferir norma estadual/local conforme o órgão autuador). Prazo de defesa: **20 dias da ciência da autuação** (Decreto 6.514/2008, art. 113 — confirmado em 2026-08-29).

## Requisitos e documentos necessários
- Cópia integral do AI (frente/verso) e da notificação com data de ciência.
- Procuração e documentos do autuado.
- AI técnico próprio (se houver): laudo, geoprocessamento, série histórica.
- Documentos de regularização (CAR, PRA, licenças, PRAD).

## Estrutura da peça
1. Endereçamento à autoridade competente do órgão.
2. Qualificação e objeto (defesa contra o AI {{NUMERO_AI}}).
3. Preliminares (incompetência, nulidade formal, decadência/prescrição).
4. Mérito (materialidade, nexo causal, enquadramento, dosimetria).
5. Provas (documental, laudos, imagens, requerimento de perícia).
6. Pedidos.

## Fundamentos possíveis
- CF art. 5º, LV (contraditório/ampla defesa); Lei 9.605/1998, arts. 70 e 72; Decreto 6.514/2008, arts. 21, 113 e 127; in dubio pro natura (entendimento consolidado STJ — BANCO 02); Súmula 467/STJ (fase de cobrança).
- **REGRA EJC:** citar número de julgado somente após confirmação na fonte oficial na data da peça.

## Riscos
- Intempestividade (perda das instâncias administrativas); retenção do AI por erro de endereçamento; fortalecimento involuntário dos fatos do órgão sem contraprova técnica.

## Checklist de revisão (antes de protocolar)
- [ ] Data de ciência conferida e prazo calculado.
- [ ] Todos os fatos do AI rebatidos ponto a ponto (ou admitidos conscientemente).
- [ ] Laudo próprio juntado ou requerido.
- [ ] Documentos de regularização anexados.
- [ ] Pedidos completos (cancelamento, nulidade, atenuação, conversão).
- [ ] Procuração e documentos de representação anexados.

## Texto-base (campos variáveis)
---
EXCELENTÍSSIMO(A) SENHOR(A) AUTORIDADE COMPETENTE DO {{ORGAO_AUTUADOR}} — {{UNIDADE_JULGADORA}}

Ref.: Processo Administrativo {{NUMERO_AI}} — Auto de Infração nº {{NUMERO_AI}}/{{ANO}}

{{NOME_AUTUADO}}, {{NACIONALIDADE}}, {{ESTADO_CIVIL}}, {{PROFISSAO}}, portador do {{TIPO_INSCRICAO}} sob nº {{CPF_OU_CNPJ}}, residente/sede em {{ENDERECO}}, por seu(sua) advogado(a) (procuração anexa), vem, respeitosamente, no prazo de 20 (vinte) dias contado da ciência da autuação (Decreto 6.514/2008, art. 113), apresentar

DEFESA ADMINISTRATIVA
contra o Auto de Infração acima referido, pelos fatos e fundamentos a seguir.

I — PRELIMINARES
1. ({{PRELIMINAR_1}} — ex.: incompetência do órgão autuador para fiscalizar a atividade/local, com indicação da norma de competência aplicável.)
2. ({{PRELIMINAR_2}} — ex.: nulidade formal do AI por ausência de descrição essencial da conduta/local, com indicação do prejuízo à defesa.)
3. ({{PRELIMINAR_3}} — ex.: decadência/prescrição da pretensão punitiva administrativa, com linha do tempo anexa e indicação do regime aplicável — Decreto 6.514/2008, art. 21.)

II — MÉRITO
4. Materialidade: ({{ARGUMENTO_MATERIALIDADE}} — ausência/insuficiência de laudo; divergência técnica; in dubio pro natura — entendimento consolidado do STJ.)
5. Nexo causal: ({{ARGUMENTO_NEXO}} — causa exclusiva de terceiro, evento natural, ausência de poder de controle no período, com série histórica anexa.)
6. Enquadramento: ({{ARGUMENTO_ENQUADRAMENTO}} — dispositivo aplicável diverso; erro na unidade de cálculo da multa — Decreto 6.514/2008, art. 8º e ss.)

III — DOSIMETRIA E ATENUAÇÃO
7. A sanção desconsiderou a gravidade real, os antecedentes e o esforço de regularização: ({{DOSSIE_REGULARIZACAO}} — CAR nº, PRA, licenças, PRAD em execução). Requer-se a atenuação e, alternativamente, a conversão da multa em serviços de preservação e recuperação, nos termos da legislação vigente.

IV — PROVAS
8. Requer-se a juntada dos documentos anexos, o contraditório sobre o laudo do órgão e, se necessário, {{REQUERIMENTO_PERICIA}}.

V — PEDIDOS
a) O acolhimento das preliminares, com a nulidade do AI {{NUMERO_AI}};
b) Subsidiariamente, o cancelamento do AI por ausência de materialidade/nexo;
c) Subsidiariamente, a revisão da dosimetria ({{VALOR_MULTA}} → sanção proporcional) e a atenuação/conversão da multa;
d) A intimação da decisão e o regular prosseguimento do processo.

Termos em que pede deferimento.
{{CIDADE}}, {{DATA}}.

{{NOME_ADVOGADO}} — OAB/{{UF}} nº {{OAB}}

Documentos anexos: {{LISTA_DOCUMENTOS}}`,
    ['ambiental/auto-infracao'], 'P0'),
  base('peca-peticao-inicial-civel-generico', 'Peça: Petição Inicial Cível (modelo empresarial genérico)',
    'PECA', 'processual-civil', 'contestacao', 'Petição inicial', `## Situação de uso
Ajuizamento de ação cível de direito comum (ex.: cobrança, indenização) pelo EJC, com ou sem pedido de tutela de urgência.

## Requisitos
- Endereçamento ao juízo competente; partes qualificadas; fatos; fundamentos; pedidos; valor da causa; provas; documentos essenciais.
- Tutela de urgência (CPC art. 300): probabilidade do direito + perigo de dano ou risco ao resultado útil.

## Estrutura e fundamentos possíveis
- CC art. 927 (obrigação de reparar) e arts. contratuais aplicáveis; CDC (se relação de consumo); CPC arts. 300 (urgência), 319 (requisitos da inicial), 330 (emenda/citação).

## Checklist de revisão
- [ ] Competência verificada (foro, valor, matéria).
- [ ] Documentos indispensáveis anexos (título, contrato, notificação, provas do dano).
- [ ] Tutela de urgência fundamentada com perigo concreto (não genérico).
- [ ] Valor da causa e custas corretos.

## Texto-base
---
EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA {{VARA}} DO FORO DE {{COMARCA}} — {{UF}}

{{NOME_AUTOR}}, {{QUALIFICACAO_AUTOR}}, por seu advogado (procuração anexa), vem propor

AÇÃO {{NATUREZA}} COM PEDIDO DE TUTELA DE URGÊNCIA
em face de {{NOME_REU}}, {{QUALIFICACAO_REU}}, pelos fatos e fundamentos a seguir.

I — DOS FATOS
{{FATOS}} (descrever cronologia objetiva com datas e documentos correspondentes)

II — DO DIREITO
{{FUNDAMENTOS}} (enquadramento legal + jurisprudência confirmada na fonte oficial na data da peça)

III — DA TUTELA DE URGÊNCIA (se aplicável)
Presentes a probabilidade do direito e o perigo de dano/risco ao resultado útil (CPC, art. 300): {{PERIGO_CONCRETO}}.

IV — DOS PEDIDOS
a) A concessão da tutela de urgência para {{PEDIDO_URGENCIA}};
b) A citação do réu;
c) A procedência com {{PEDIDOS_MERITO}};
d) A condenação do réu em custas e honorários (CPC, art. 85).

Dá-se à causa o valor de {{VALOR_CAUSA}}.

{{CIDADE}}, {{DATA}}. {{NOME_ADVOGADO}} — OAB/{{UF}} nº {{OAB}}`,
    ['processual-civil/contestacao'], 'P0'),
  base('peca-contestacao-civel-generico', 'Peça: Contestação Cível (modelo genérico robusto)',
    'PECA', 'processual-civil', 'contestacao', 'Defesa judicial', `## Situação de uso
Resposta do réu no processo civil — prazo de 15 dias úteis (CPC, art. 335), contado conforme o inciso aplicável (juntada do AR etc.).

## Estrutura e fundamentos possíveis
- Preliminares do CPC art. 337 (incompetência, impedimento/suspeição, litispendência, coisa julgada, conexão, incapacidade, ilegitimidade, falta de caução, inépcia da inicial) + prescrição/decadência (CPC art. 337, § 5º — defesa indireta de mérito).
- Mérito: impugnação especificada dos fatos (CPC art. 341 — ônus); contraprovas; presunções do art. 345 afastadas.
- Regra EJC: fundamento citado somente da lista confiável/validada; jurisprudência confirmada na fonte oficial.

## Checklist de revisão
- [ ] Prazo conferido (data da juntada do AR + 15 úteis).
- [ ] Preliminares e prescrição alegados (senão preclusão — art. 337 § 5º).
- [ ] Impugnação especificada de TODOS os documentos do autor.
- [ ] Contraprova anexada (documentos, testemunhas, perícia requerida).
- [ ] Pedidos de julgamento de improcedência + eventuais reconvenções.

## Texto-base
---
EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA {{VARA}} DO FORO DE {{COMARCA}} — {{UF}}

Processo nº {{PROCESSO}}

{{NOME_REU}}, já qualificado nos autos, vem apresentar

CONTESTAÇÃO

I — PRELIMINARES (CPC, art. 337)
1. {{PRELIMINAR_1}} (ex.: incompetência relativa — requer-se a extinção/remessa).
2. {{PRELIMINAR_2}} (ex.: ilegitimidade passiva).
3. Prescrição/decadência: {{ANALISE_PRESCRICIONAL}} (defesa indireta de mérito — art. 337, § 5º).

II — MÉRITO
4. Impugnação especificada dos fatos e documentos: {{IMPUGNACAO_FATOS}}.
5. {{TESE_DEFESA_MERITO}} com contraprovas anexas ({{CONTRAPROVAS}}).
6. Provas: requerem-se {{PROVAS_REQUERIDAS}} (documental, testemunhal, pericial — CPC, art. 345-370).

III — PEDIDOS
a) O acolhimento das preliminares;
b) Subsidiariamente, a improcedência integral dos pedidos;
c) A condenação do autor em custas e honorários.

{{CIDADE}}, {{DATA}}. {{NOME_ADVOGADO}} — OAB/{{UF}} nº {{OAB}}`,
    ['processual-civil/contestacao'], 'P0'),
  base('peca-recurso-administrativo-ambiental', 'Peça: Recurso Administrativo Ambiental (reconsideração/instância superior)',
    'PECA', 'ambiental', 'auto-infracao', 'Recurso administrativo', `## Situação de uso
Recurso contra decisão administrativa ambiental desfavorável na defesa de AI — prazo de 20 dias (Decreto 6.514/2008, art. 127 — redação vigente a confirmar no caso concreto).

## Estrutura e fundamentos possíveis
- Síntese do que ficou decidido e do que não foi apreciado (novos fatos/provas).
- Vícios da decisão: falta de fundamentação, não apreciação de quesitos essenciais, erro de cálculo/dosimetria, ignorância de provas.
- Fundamentos: CF art. 5º LV; Decreto 6.514/2008 (recurso — art. 127); princípios da Lei 9.784/1999 (mencionar genericamente); in dubio pro natura (BANCO 02).

## Checklist de revisão
- [ ] Prazo de 20 dias conferido a partir da ciência da decisão.
- [ ] Tempestividade e legitimidade; tempestividade de provas novas justificada.
- [ ] Todos os fundamentos da defesa recursais preservados (preclusão).

## Texto-base
---
EXCELENTÍSSIMO(A) SENHOR(A) {{AUTORIDADE_RECURSO}} — {{ORGAO_AUTUADOR}}

Ref.: Processo {{NUMERO_AI}} — decisão de {{DATA_DECISAO}}

{{NOME_RECORRENTE}}, por seu advogado, vem, no prazo de 20 dias (Decreto 6.514/2008, art. 127), apresentar

RECURSO ADMINISTRATIVO
contra a decisão que manteve o AI {{NUMERO_AI}}, pelos fundamentos a seguir.

1. Síntese da decisão recorrida: {{RESUMO_DECISAO}}.
2. Vícios: {{VICIOS_DECISAO}} (falta de fundamentação; não apreciação da preliminar de {{PRELIMINAR_NAO_ApreciADA}}; desconsideração do laudo particular juntado; erro na base de cálculo — Decreto 6.514/2008, art. 8º e ss.).
3. Provas supervenientes (se houver): {{PROVAS_NOVAS}} com justificativa.
4. Requerimento: o provimento do recurso, com cancelamento/reviseão da sanção e, subsidiariamente, atenuação/conversão da multa.

{{CIDADE}}, {{DATA}}. {{NOME_ADVOGADO}} — OAB/{{UF}} nº {{OAB}}`,
    ['ambiental/auto-infracao'], 'P0'),

  // ================= CONTRATOS (3) =================
  base('contrato-prestacao-servicos-advocaticios', 'Contrato: Prestação de Serviços Advocatícios (com análise de cláusulas críticas)',
    'CONTRATO', 'geral', 'metodologia', 'Contrato de honorários e serviços', `## Situação de uso
Contratação de serviços advocatícios por pessoa física/jurídica. Uso profissional com revisão por advogado responsável (OAB) e compliance com o Estatuto da Advocacia e o Código de Ética e Disciplina da OAB.

## Estrutura do modelo
1. Qualificação das partes e objeto ({{SERVICOS}}).
2. Honorários: honorários iniciais ({{VALOR_INICIAL}}), parcelamento ({{PARCELAS}}), honorários de êxito ({{PERCENTUAL_EXITO}}), custas e despesas à conta do cliente.
3. Obrigações do cliente: fornecer documentos verídicos, manter contato, não ocultar fatos.
4. Obrigações do advogado: diligência, sigilo, atualização sobre andamentos.
5. Substabelecimento e equipe ({{EQUIPE}}).
6. Duração e encerramento: por objeto ou prazo ({{PRAZO}}); extinção com pagamento proporcional.
7. Rescisão e honorários proporcionais + multa por abandono ({{MULTA_ABANDONO}}).
8. Sigilo profissional e LGPD (tratamento de dados para a finalidade do caso; retenção mínima; direitos do titular — Lei 13.709/2018).
9. Foro de eleição ({{FORO}}) e disputas.
10. Assinaturas eletrônicas ou manuais.

## Análise das cláusulas críticas
- **Honorários de êxito:** base de cálculo clara (o quê exatamente — condenação, economia, valor do litígio); momento do vencimento (efetivo recebimento?); tratamento de acordos parciais. Risco: litígio sobre o "êxito" sem definição.
- **Rescisão unilateral:** prazos de aviso e compensação; evitar cláusula que transfira todo o risco ao cliente.
- **LGPD:** finalidade específica, retenção, compartilhamento com terceiros (correspondentes) e segurança.
- **Foro de eleição:** no consumidor há limites; em relação entre pessoas jurídicas é mais flexível — conferir o caso.
- **Multa por abandono:** proporcionalidade (CC art. 413 — redução se desproporcional).

## Riscos
- Ausência de previsão de custas e despesas (litígio posterior); êxito mal definido; falta de cláusula de dados pessoais.

## Checklist de revisão
- [ ] Base de cálculo do êxito definida com exemplos.
- [ ] Cláusula LGPD presente.
- [ ] Regime de rescisão equilibrado.
- [ ] Foro e disputa definidos.

## Texto-base
---
CONTRATO DE PRESTAÇÃO DE SERVIÇOS ADVOCATÍCIOS

{{CIDADE}}, {{DATA}}.

{{NOME_CLIENTE}} ({{QUALIFICACAO_CLIENTE}}), doravante CLIENTE, e {{NOME_ADVOGADO_ESCRITORIO}} (OAB/{{UF}} nº {{OAB}}), doravante ADVOGADO, celebram:

1. OBJETO: a prestação dos serviços de representação jurídica relativa a {{OBJETO_SERVICO}}, compreendendo {{ESCOPO}}.
2. HONORÁRIOS: iniciais de {{VALOR_INICIAL}} em {{PARCELAS}}; de êxito de {{PERCENTUAL_EXITO}} sobre {{BASE_EXITO}} (definida como: {{DEFINICAO_EXITO}}), vencíveis no {{MOMENTO_EXITO}}; custas e despesas correm por conta do CLIENTE.
3. OBRIGAÇÕES: o CLIENTE fornecerá documentos verídicos e manterá contato; o ADVOGADO atuará com diligência e sigilo, informando andamentos.
4. DURAÇÃO: até a decisão de {{INSTANCIA_FIM}} ou encerramento do objeto; após, nova negociação.
5. RESCISÃO: qualquer parte pode rescindir com aviso de {{AVISO_DIAS}} dias; devidos os honorários proporcionais; abandono da causa pelo CLIENTE implica multa de {{MULTA_ABANDONO}}.
6. SIGILO E LGPD: o tratamento de dados pessoais restringe-se à finalidade do caso (Lei 13.709/2018), com retenção pelo prazo legal e segurança compatível.
7. FORO: {{FORO}}.

{{ASSINATURAS}}`,
    ['geral/metodologia', 'civil/contratos'], 'P0'),
  base('contrato-prestacao-servicos-empresarial', 'Contrato: Prestação de Serviços Empresarial (com análise de cláusulas críticas)',
    'CONTRATO', 'empresarial', 'contratos-empresariais', 'Contrato empresarial', `## Situação de uso
Contratação entre empresas de serviços com entregáveis definidos (consultoria, TI, serviços técnicos).

## Estrutura do modelo
1. Partes e objeto ({{SERVICO}}), escopo e exclusões.
2. Prazo e cronograma ({{PRAZO}}); SLA ({{SLA}}).
3. Preço e pagamento ({{PRECO}}; condições; mora — juros/multa).
4. Aceitação e qualidade: critérios objetivos, período de garantia ({{GARANTIA}}).
5. Propriedade intelectual: titularidade das entregas ({{TITULARIDADE_PI}}) e licenças pré-existentes.
6. LGPD: dados pessoais tratados como operador/controlador ({{PAPEL_LGPD}}); finalidade; segurança; incidentes com notificação (Lei 13.709/2018).
7. Confidencialidade e sigilo.
8. Responsabilidade: limitação ({{LIMITE_RESP}}), exclusão de lucros cessantes, indenização por dolo.
9. Rescisão: por inadimplemento grave, falência, interesse (aviso {{AVISO_DIAS}} dias).
10. Foro ({{FORO}}).

## Análise das cláusulas críticas
- **SLA e aceitação:** sem critérios objetivos, o pagamento fica indefinido — definir métricas e processo de aceitação com prazo tácito.
- **PI:** quem fica com melhorias derivadas? licenças retroativas?
- **LGPD:** papel (controlador/operador) define obrigações e sanções; incluir cláusula de subcontratação autorizada.
- **Limitação de responsabilidade:** teto (ex.: valor pago nos últimos 12 meses) e exclusões mútuas.
- **Reajuste:** ausência de índice → risco inflacionário (definir {{INDICE_REAJUSTE}} e data-base).

## Checklist de revisão
- [ ] Escopo com entregáveis e critérios de aceitação.
- [ ] SLA mensurável.
- [ ] Cláusula LGPD com papel definido.
- [ ] Limite de responsabilidade e seguro ({{SEGURO}}).

## Texto-base
---
CONTRATO DE PRESTAÇÃO DE SERVIÇOS

{{CIDADE}}, {{DATA}}.

{{CONTRATANTE}} e {{CONTRATADA}} celebram:

1. OBJETO: {{DESCRICAO_SERVICO}}, conforme Anexo I (escopo/exclusões).
2. PRAZO: {{PRAZO}}; cronograma no Anexo II; SLA: {{SLA}}.
3. REMUNERAÇÃO: {{PRECO}}, paga em {{CONDICOES}}; reajuste anual pelo {{INDICE_REAJUSTE}}.
4. ACEITAÇÃO: entregas sujeitas a aceitação conforme critérios objetivos do Anexo I; silêncio por {{DIAS_TACITOS}} dias após entrega = aceitação.
5. PI: {{TITULARIDADE_PI}}; licenças pré-existentes permanecem do contratado.
6. LGPD: a contratada atuará como {{PAPEL_LGPD}}, tratando dados apenas conforme instruções da contratante, com segurança compatível e notificação de incidentes em {{PRAZO_INCIDENTE}}.
7. CONFIDENCIALIDADE: informações trocadas sigilosas por {{PRAZO_SIGILO}} anos.
8. RESPONSABILIDADE: limitada a {{LIMITE_RESP}}; excluídos lucros cessantes, salvo dolo.
9. RESCISÃO: inadimplemento grave, falência, ou por interesse com aviso de {{AVISO_DIAS}} dias.
10. FORO: {{FORO}}.

{{ASSINATURAS}}`,
    ['empresarial/contratos-empresariais'], 'P0'),
  base('contrato-confidencialidade-nda', 'Contrato: Confidencialidade (NDA) — com análise de cláusulas críticas',
    'CONTRATO', 'empresarial', 'compliance', 'Proteção de informações', `## Situação de uso
Troca de informações sigilosas em negociações, parcerias, due diligence.

## Estrutura do modelo
1. Partes e propósito da troca de informações.
2. Definição de informação confidencial (marcação, natureza, exclusões — conhecimento público, desenvolvida independentemente, exigência legal de divulgação).
3. Obrigações: sigilo, uso restrito ao propósito, controle de acesso, notificação de vazamentos.
4. Prazo: vigência da negociação + {{PRAZO_SIGILO}} anos após.
5. LGPD: dados pessoais tratados como confidenciais e conforme a Lei 13.709/2018.
6. Penalidade: multa de {{MULTA}} + perdas e danos comprovados; guarda dos dados devolvida/destruída ao fim.
7. Foro ({{FORO}}).

## Análise das cláusulas críticas
- **Definição:** NDAs "tudo é confidencial" sem marcação dificultam prova; incluir processo de marcação e exceções.
- **Prazo:** sigilo perpétuo é contestável; 3-5 anos é usual; segredos comerciais podem ter regime próprio.
- **Penalidade:** multa desproporcional pode ser reduzida (CC art. 413); definir dano presumido vs. real.
- **Vazamento com LGPD:** notificar incidentes em prazo determinado e cooperar com a ANPD/titulares.

## Checklist de revisão
- [ ] Exclusões de confidencialidade presentes.
- [ ] Prazo razoável e definido.
- [ ] Multa proporcional e mensurável.
- [ ] Cláusula LGPD para dados pessoais trocados.

## Texto-base
---
CONTRATO DE CONFIDENCIALIDADE

{{CIDADE}}, {{DATA}}.

{{PARTE_DIVULGANTE}} (Divulgante) e {{PARTE_RECEPTORA}} (Receptora) celebram:

1. PROPÓSITO: avaliação/negociação relativa a {{PROPOSITO}}.
2. INFORMAÇÃO CONFIDENCIAL: qualquer informação não pública divulgada, marcada como confidencial ou razoavelmente compreendida como tal. EXCLUSÕES: (i) domínio público sem culpa; (ii) posse legítima anterior com prova; (iii) desenvolvimento independente com prova; (iv) exigência legal de divulgação (com aviso prévio quando possível).
3. OBRIGAÇÕES: sigilo; uso apenas para o Propósito; acesso restrito a colaboradores com "need to know"; proteção compatível.
4. PRAZO: vigência de {{VIGENCIA}} + {{PRAZO_SIGILO}} anos após o fim.
5. DEVOLUÇÃO/DESTRUÇÃO: ao fim, ao critério do Divulgante.
6. DADOS PESSOAIS: tratamento conforme a LGPD (Lei 13.709/2018); notificação de incidentes em {{PRAZO_INCIDENTE}}.
7. PENALIDADE: {{MULTA}}, sem prejuízo de perdas e danos.
8. FORO: {{FORO}}.

{{ASSINATURAS}}`,
    ['empresarial/compliance'], 'P1'),

  // ================= CHECKLISTS (6) =================
  base('checklist-defesa-ambiental-antes-protocolar', 'Checklist: Defesa Administrativa Ambiental (antes de protocolar)',
    'CHECKLIST', 'ambiental', 'auto-infracao', 'Controle de qualidade da defesa', `## Objetivo
Garantir que nenhuma etapa crítica da defesa contra AI seja esquecida antes do protocolo (prazo: 20 dias da ciência — Decreto 6.514/2008, art. 113).

## Seção 1 — Análise inicial
- [ ] AI íntegrado (frente/verso, anexos, laudo referido).
- [ ] Data de ciência identificada com prova documental.
- [ ] Prazo de 20 dias calculado e registrado no controle de prazos.
- [ ] Órgão autuador identificado e competência verificada.

## Seção 2 — Análise técnica
- [ ] Linha do tempo construída (prática do ato → AI → ciência).
- [ ] Regime de decadência/prescrição aplicável verificado (Decreto 6.514/2008, art. 21 — conferir redação vigente e datas).
- [ ] Laudo do órgão analisado (metodologia, medições, fotos).
- [ ] Necessidade de laudo técnico particular avaliada (geoprocessamento).

## Seção 3 — Estratégia
- [ ] Preliminares mapeadas (nulidade, incompetência, prescrição).
- [ ] Teses de mérito priorizadas (BANCO 03).
- [ ] Dosimetria analisada (base de cálculo, gradação, atenuantes).
- [ ] Regularização superveniente documentada (CAR/PRA/licenças).

## Seção 4 — Produção e protocolo
- [ ] Peça revisada contra o modelo do BANCO 04.
- [ ] Procuração válida anexada.
- [ ] Documentos digitalizados e nomeados.
- [ ] Protocolo registrado + comprovante arquivado.
- [ ] Controle de prazo do recurso (20 dias da decisão — art. 127) ativado.

## Riscos da omissão
Perda das instâncias administrativas por intempestividade; defesa genérica enfraquecida; preclusão de preliminares; surpresa com multa diária.`,
    ['ambiental/auto-infracao'], 'P0'),
  base('checklist-ajuizamento', 'Checklist: Ajuizamento de ação',
    'CHECKLIST', 'processual-civil', 'contestacao', 'Controle de ajuizamento', `## Objetivo
Padronizar a decisão e a preparação de ajuizamento.

## Seção 1 — Viabilidade
- [ ] Legitimidade ativa e passiva verificadas.
- [ ] Prescrição/decadência analisada (regime aplicável).
- [ ] Competência (foro, valor, matéria) definida.
- [ ] Prova mínima disponível (documental essencial).
- [ ] Análise custo-benefício documentada no caso.

## Seção 2 — Preparação
- [ ] Petição inicial revisada (CPC art. 319).
- [ ] Tutela de urgência: perigo concreto demonstrável (CPC art. 300).
- [ ] Documentos: contrato, títulos, notificações, laudos.
- [ ] Valor da causa e custas calculados.
- [ ] Atendimento do cliente finalizado com expectativas alinhadas (honorários, prazos).

## Seção 3 — Protocolo
- [ ] Assinatura eletrônica válida; procurações anexas.
- [ ] Guias e recolhimentos corretos.
- [ ] Controle de prazos aberto (citação, defesa da parte contrária).

## Riscos da omissão
Emenda inicial (atraso); indeferimento da inicial; tutela denegada por falta de perigo concreto; surpresa com prescrição.`,
    ['processual-civil/contestacao'], 'P0'),
  base('checklist-contestacao', 'Checklist: Contestação',
    'CHECKLIST', 'processual-civil', 'contestacao', 'Controle de resposta', `## Objetivo
Garantir resposta processual completa e tempestiva (15 dias úteis — CPC art. 335).

## Seção 1 — Prazo e procedimento
- [ ] Data da juntada do AR/aviso identificada.
- [ ] Prazo calculado em dias úteis (CPC art. 219).
- [ ] Regime de prazos do tribunal conferido.

## Seção 2 — Conteúdo
- [ ] Todas as preliminares do CPC art. 337 avaliadas (preclusão de prescrição — § 5º).
- [ ] Impugnação especificada de cada documento (CPC art. 341/428).
- [ ] Fatos admitidos escolhidos conscientemente.
- [ ] Contraprovas: documentos, testemunhas, perícia requerida.
- [ ] Eventual reconvenção/compensação avaliada.

## Seção 3 — Produção
- [ ] Peça revisada (modelo BANCO 04).
- [ ] Anexos nomeados e completos.
- [ ] Protocolo tempestivo com comprovante.

## Riscos da omissão
Presunção de veracidade (CPC art. 344); preclusão de prescrição; perda de direito de requerer provas.`,
    ['processual-civil/contestacao'], 'P0'),
  base('checklist-analise-contratual', 'Checklist: Análise de contrato',
    'CHECKLIST', 'empresarial', 'compliance', 'Controle de revisão contratual', `## Objetivo
Análise padronizada de contrato para o cliente (fornecedor, cliente, parceiro).

## Seção 1 — Identificação
- [ ] Partes e capacidade verificadas (CNPJ, poderes do signatário).
- [ ] Objeto claro e exequível; exclusões definidas.
- [ ] Prazo/vigência e renovação definidos.

## Seção 2 — Riscos (usar BANCO 14 — Regras Contratuais)
- [ ] Multa/responsabilidade desproporcionais.
- [ ] Ausência de índice de reajuste.
- [ ] Foro de eleição e disputa.
- [ ] LGPD (dados pessoais presentes? papel definido?).
- [ ] PI (titularidade das entregas).
- [ ] Rescisão e renovação automática.
- [ ] Garantias e seguros.

## Seção 3 — Conformidade
- [ ] Cláusulas abusivas marcadas (BANCO 14).
- [ ] Propostas de redação alternativa preparadas.
- [ ] Parecer/summary executivo entregue ao cliente com riscos por severidade.

## Riscos da omissão
Aceitação tácita de cláusula abusiva; litígio futuro evitável; exposição LGPD.`,
    ['empresarial/compliance'], 'P0'),
  base('checklist-atendimento-inicial', 'Checklist: Atendimento inicial do cliente',
    'CHECKLIST', 'geral', 'triagem', 'Roteiro de primeira entrevista', `## Objetivo
Capturar o caso corretamente na primeira entrevista (combina com BANCO 09 — Triagem).

## Seção 1 — Identificação
- [ ] Cliente e pessoas envolvidas (CPF/CNPJ, contatos).
- [ ] Contraparte identificada.
- [ ] Datas-chave do problema (início, eventos, alertas).

## Seção 2 — Fatos e documentos
- [ ] Narrativa cronológica capturada (sem conclusões jurídicas prematuras).
- [ ] Documentos existentes listados; faltantes solicitados por escrito.
- [ ] Alerta de urgência: prazos correndo? (verificar BANCO 10 imediatamente)

## Seção 3 — Classificação EJC
- [ ] Área e subárea atribuídas (Taxonomia).
- [ ] Urgência (alta/média/baixa) justificada.
- [ ] Possíveis teses preliminares anotadas (BANCO 03).
- [ ] Riscos e expectativas alinhadas por escrito (sem promessa de resultado).

## Seção 4 — Conflitos e confidencialidade
- [ ] Checagem de conflito de interesses no escritório.
- [ ] Sigilo e LGPD explicados; autorização de tratamento de dados registrada.

## Riscos da omissão
Prazo perdido (prescrição/decadência); conflito de interesses descoberto tarde; expectativa mal alinhada.`,
    ['geral/triagem'], 'P0'),
  base('checklist-encerramento-caso', 'Checklist: Encerramento do caso',
    'CHECKLIST', 'geral', 'metodologia', 'Encerramento e arquivamento', `## Objetivo
Encerrar o caso com rastreabilidade e aprendizado para o EJC.

## Seção 1 — Jurídico
- [ ] Decisão/acordo final arquivado (com trânsito em julgado, se aplicável).
- [ ] Obrigações de fazer cumpridas ou monitoradas (ex.: PRAD, cláusulas de acordo).
- [ ] Cumprimento de sentença/valores recebidos ou pagos.

## Seção 2 — Cliente e financeiro
- [ ] Honorários totais fechados; recibo/termo de encerramento assinado.
- [ ] Devolução de originais ao cliente (com recibo) ou política de arquivo definida.
- [ ] LGPD: retenção mínima necessária; descarte seguro do restante.

## Seção 3 — Conhecimento (realimentação do EJC)
- [ ] Tema/situação classificado e registrado na base privada do caso (item 25 — segregação de bases).
- [ ] Lições aprendidas (tese funcionou? prova faltou? prazo?).
- [ ] Modelos atualizados se houver melhoria.

## Riscos da omissão
Obrigação de acordo esquecida (nova multa); dados retidos indevidamente (LGPD); lições perdidas.`,
    ['geral/metodologia'], 'P0'),

  // ================= FLUXOS (4) =================
  base('fluxo-ai-ambiental', 'Fluxo: Recebimento de Auto de Infração Ambiental',
    'FLUXO', 'ambiental', 'auto-infracao', 'Mapa processual administrativo ambiental', `Formato: evento → prazo → providência → responsável → documento necessário → risco → próxima etapa.

| # | Evento | Prazo | Providência | Responsável | Documento necessário | Risco | Próxima etapa |
|---|--------|-------|-------------|-------------|---------------------|-------|---------------|
| 1 | Recebimento/notificação do AI | — | Conferir destinatário e endereço; não ignorar | Advogado sênior | AI completo + notificação | Perda do prazo por extravio interno | Abrir controle de prazos |
| 2 | Abertura de controle de prazos | Dia 0 (ciência) | Calcular prazo de 20 dias (Decreto 6.514/2008, art. 113) | Assistente jurídico | Notificação com data | Erro de contagem → intempestividade | Reunião de análise |
| 3 | Linha do tempo do caso | Dia 0-2 | Reconstruir: prática do ato → AI → ciência | Advogado júnior + sênior | AI, laudos, imagens | Premissas temporais erradas | Análise de prescrição |
| 4 | Análise de prescrição/decadência | Dia 2-4 | Verificar regime aplicável (art. 21 — redação vigente; entendimento STJ) | Advogado sênior | Linha do tempo + normas | Tese descartada por verificação insuficiente | Preliminares |
| 5 | Coleta de documentos | Dia 2-8 | Solicitar ao cliente: titularidade, licenças, CAR/PRA, contratos | Cliente + assistente | Lista de documentos (BANCO 08) | Lacunas probatórias | Análise técnica |
| 6 | Análise técnica do laudo do órgão | Dia 4-8 | Conferir metodologia, medições, fotos, georreferenciamento | Consultor técnico/advogado | Laudo do órgão | Aceitar premissas equivocadas | Laudo próprio |
| 7 | Laudo técnico próprio (se cabível) | Dia 5-12 | Contratar engenheiro/agrônomo/geoprocessamento | Advogado sênior | Laudo particular + série histórica | Custo alto; melhor investir em casos com valor real | Defesa |
| 8 | Estratégia e peça | Dia 8-14 | Elaborar defesa (BANCO 04) com preliminares + mérito + dosimetria | Advogado sênior | Modelo + teses (BANCO 03) | Defesa genérica | Revisão |
| 9 | Revisão dupla | Dia 14-16 | Revisar por outro advogado contra o checklist | Advogado revisor | Checklist defesa ambiental | Erros materiais | Protocolo |
| 10 | Protocolo da defesa | Até dia 20 | Protocolar e registrar comprovante | Assistente | Peça + anexos + procuração | Intempestividade | Acompanhamento |
| 11 | Acompanhamento | Contínuo | Monitorar intimações; preparar recurso (20 dias da decisão — art. 127) | Assistente + advogado | Processo administrativo | Decisão surpresa sem preparo | Recurso/judicialização |
| 12 | Pós-decisão | Conforme decisão | Recurso administrativo ou judicialização (MS/anulatória — MS: 120 dias, Lei 12.016/2009, art. 23) | Advogado sênior | Decisão + provas | Preclusão administrativa | Encerramento/monitoramento |`,
    ['ambiental/auto-infracao'], 'P0'),
  base('fluxo-citacao-civel', 'Fluxo: Recebimento de citação judicial cível',
    'FLUXO', 'processual-civil', 'contestacao', 'Mapa processual de defesa', `Formato: evento → prazo → providência → responsável → documento necessário → risco → próxima etapa.

| # | Evento | Prazo | Providência | Responsável | Documento necessário | Risco | Próxima etapa |
|---|--------|-------|-------------|-------------|---------------------|-------|---------------|
| 1 | Recebimento da citação | Dia 0 | Registrar processo e petição inicial íntegra | Assistente | Citação + inicial + documentos | Perda de prazos | Cálculo de prazo |
| 2 | Cálculo do prazo | Dia 0-1 | 15 dias úteis da juntada do AR (CPC art. 335) | Assistente | AR com data | Erro de contagem | Análise do caso |
| 3 | Leitura completa da inicial | Dia 1-3 | Mapear pedidos, fatos e provas do autor | Advogado | Inicial + anexos | Subestimar pedidos acessórios | Preliminares |
| 4 | Preliminares e prescrição | Dia 3-5 | Avaliar CPC art. 337 + prescrição/decadência (defesa indireta § 5º) | Advogado sênior | Linha do tempo | Preclusão por omissão | Estratégia |
| 5 | Coleta de contraprovas | Dia 3-8 | Documentos do cliente, contratos, pagamentos, e-mails | Cliente + assistente | Lista por tipo de ação (BANCO 08) | Lacuna probatória | Redação |
| 6 | Redação da contestação | Dia 5-10 | Impugnação especificada de tudo (CPC art. 341) | Advogado | Modelo BANCO 04 | Fato não impugnado = presumido (art. 344) | Revisão |
| 7 | Revisão e anexos | Dia 10-12 | Revisão dupla; checklist contestação | Advogado revisor | Checklist | Erros materiais | Protocolo |
| 8 | Protocolo tempestivo | Até o prazo | Protocolar; abrir controle de prazos seguintes | Assistente | Peça + anexos | Intempestividade | Acompanhamento |
| 9 | Acompanhamento | Contínuo | Esclarecimentos, audiência de conciliação, provas determinadas | Advogado | Autos | Perda de oportunidade probatória | Sentença/apelação |`,
    ['processual-civil/contestacao'], 'P0'),
  base('fluxo-execucao-fiscal', 'Fluxo: Execução Fiscal (defesa do executado)',
    'FLUXO', 'tributario', 'execucao-fiscal', 'Mapa processual da LEF', `Formato: evento → prazo → providência → responsável → documento necessário → risco → próxima etapa.

| # | Evento | Prazo | Providência | Responsável | Documento necessário | Risco | Próxima etapa |
|---|--------|-------|-------------|-------------|---------------------|-------|---------------|
| 1 | Recebimento da citação na execução | Dia 0 | Ler a CDA integralmente | Advogado | CDA + petição inicial | CDA com erro ignorado | Análise da CDA |
| 2 | Análise da CDA e do crédito | Dia 1-5 | Conferir lançamento, notificação, correção, juros, prescrição (CTN art. 174; LEF art. 40) | Advogado sênior | CDA, notificações, laudos do fisco | Prescrição não alegada (preclusão nos embargos) | Decisão: garantia? |
| 3 | Decisão sobre garantia | Dia 5-10 | Depósito, fiança, seguro garantia, penhora (LEF art. 16 § 1º) | Cliente + advogado | Demonstrativos, apólices | Embargos inadmissíveis sem garantia | Embargos |
| 4 | Embargos à execução | 30 dias (LEF art. 16) | Impugnar CDA e crédito (mérito + processuais) | Advogado | Garantia + peça (BANCO 04) | Intempestividade | Instrução |
| 5 | Acompanhamento | Contínuo | Manifestar sobre peritos, impugnações, embargos de declaração | Advogado | Autos | Perda de perícia | Julgamento |
| 6 | Pós-julgamento | 15 dias úteis | Avaliar apelação (CPC art. 1.003 § 5º) | Advogado sênior | Sentença | Preclusão | Recurso/encerramento |
| 7 | Redirecionamento (se sócios) | Conforme autos | Analisar responsabilidade tributária e redirecionamento (CTN arts. 134-135; SRF 304? — validar em cada caso) | Advogado sênior | Demonstrativos societários | Redirecionamento por omissão genérica | Defesa específica |`,
    ['tributario/execucao-fiscal'], 'P0'),
  base('fluxo-cobranca-empresarial', 'Fluxo: Cobrança empresarial (extrajudicial → judicial)',
    'FLUXO', 'civil', 'cobranca', 'Mapa de recuperação de crédito', `Formato: evento → prazo → providência → responsável → documento necessário → risco → próxima etapa.

| # | Evento | Prazo | Providência | Responsável | Documento necessário | Risco | Próxima etapa |
|---|--------|-------|-------------|-------------|---------------------|-------|---------------|
| 1 | Vencimento em atraso | Dia 0-5 | Conciliar extratos; confirmar débito | Financeiro | Contrato, notas, extratos | Débito contestável sem documentos | Notificação |
| 2 | Cobrança amigável | Dia 5-15 | Contato direto; proposta de renegociação por escrito | Financeiro/advogado | E-mails/termos | Promessa oral sem registro | Notificação extrajudicial |
| 3 | Notificação extrajudicial | Dia 15-30 | Enviar por meio com prova de recebimento (AR/cartório) | Advogado | Notificação + AR | Notificação sem prova | Avaliação |
| 4 | Avaliação do título | Dia 30-40 | Verificar liquidez/certeza, rito adequado (monitória/ordinária/executiva), prescrição (CC art. 206) | Advogado | Títulos e contratos | Rito errado → perda de tempo | Ajuizamento |
| 5 | Ajuizamento | Dia 40-50 | Protocolar com documentos (checklist ajuizamento) | Advogado | Checklist + peça | Ação frágil | Acompanhamento |
| 6 | Acompanhamento | Contínuo | Citação, defesa, provas, acordos | Advogado | Autos | Acordo ruim por pressão | Sentença/entrega |
| 7 | Pós-sentença | Conforme decisão | Cumprimento de sentença/execução; avaliar insolvência (RJ/falência) | Advogado sênior | Sentença + demonstrativos | Crédito irrecuperável | Encerramento/atualização de provisões |`,
    ['civil/cobranca'], 'P0'),

  // ================= TABELAS DE DOCUMENTOS (3) =================
  base('tabela-documentos-defesa-ai-ambiental', 'Tabela: Documentos necessários — Defesa em AI ambiental',
    'TABELA_DOCUMENTOS', 'ambiental', 'auto-infracao', 'Controle documental', `| Tipo de demanda | Documentos indispensáveis | Documentos recomendados | Provas complementares | Documentos que normalmente faltam | Risco causado pela ausência |
|---|---|---|---|---|---|
| Defesa administrativa ambiental | AI completo; notificação/ciência com data; procuração; documentos do autuado (CPF/CNPJ) | Licenças existentes; CAR; protocolo PRA; contratos de arrendamento/posse; fotos datadas | Laudo técnico particular; série histórica de imagens; perícias; declarações de vizinhos/funcionários | Data exata de ciência; laudo próprio; documentos de regularização; histórico do processo administrativo | Intempestividade não evitável; tese de materialidade sem prova técnica; dosimetria sem dossiê de conformidade — multa cheia |`,
    ['ambiental/auto-infracao'], 'P0'),
  base('tabela-documentos-acp-ambiental-res', 'Tabela: Documentos necessários — ACP ambiental (posição de rés)',
    'TABELA_DOCUMENTOS', 'ambiental', 'acao-civil-publica', 'Controle documental', `| Tipo de demanda | Documentos indispensáveis | Documentos recomendados | Provas complementares | Documentos que normalmente faltam | Risco causado pela ausência |
|---|---|---|---|---|---|
| Ação civil pública ambiental (réu) | Petição inicial + laudos do MP/autor; citação; procuração | Licenciamento integral (LP, LI, LO); TAC existente; auditorias; planos de contingência | Perícias; monitoramentos ambientais; séries históricas; documentos de conformidade | Cadastro de monitoramento contínuo; provas de atuação fiscalizatória própria (contra Estado); evidências de nexo/exclusão | Perícia única do autor prevalece; impossibilidade de demonstrar conformidade; condenação por omissão sem contraprova |`,
    ['ambiental/acao-civil-publica'], 'P0'),
  base('tabela-documentos-cobranca', 'Tabela: Documentos necessários — Cobrança/execução de crédito',
    'TABELA_DOCUMENTOS', 'civil', 'cobranca', 'Controle documental', `| Tipo de demanda | Documentos indispensáveis | Documentos recomendados | Provas complementares | Documentos que normalmente faltam | Risco causado pela ausência |
|---|---|---|---|---|---|
| Cobrança empresarial (credor) | Título/contrato com débito; notas fiscais; comprovante de entrega/prestação | Notificação extrajudicial com AR; extratos de conta; e-mails de reconhecimento | Declarações; perícias técnicas (qualidade); testemunhas | Prova de entrega/prestação; termo de aceite; reconhecimento escrito do débito | Contestação genérica vence pela falta de prova; perda de honorários; rito inadequado |`,
    ['civil/cobranca'], 'P0'),

  // ================= TRIAGEM (3) =================
  base('triagem-ai-ambiental', 'Triagem: Auto de infração ambiental (roteiro de entrevista)',
    'TRIAGEM', 'ambiental', 'auto-infracao', 'Roteiro inteligente de triagem', `## Objetivo
Classificar o caso de AI ambiental em 15-20 minutos, identificando área, urgência, prazos, documentos e teses possíveis — sem inventar fatos.

## Roteiro (pergunta → respostas → próxima etapa)
1. **"Recebeu que documento e quando?"** → coletar: AI/notificação, DATA DE CIÊNCIA (crítica). Se ciência < 20 dias: URGÊNCIA ALTA (defesa no prazo). Se já passado: verificar recurso/decisão.
2. **"Qual órgão autuou e qual a infração descrita?"** → classificar órgão (federal/estadual/municipal) e tipo (vegetação, fauna, água, resíduo, licença). Define competência e normas aplicáveis.
3. **"Onde ocorreu (município/propriedade) e qual sua relação com o local (proprietário/arrendatário/vizinho)?"** → imputação e nexo causal.
4. **"Há laudo? Como descreve o dano (área, extensão)?"** → materialidade. Sem laudo = tese de materialidade.
5. **"Houve licença/CAR/PRA/regularização? Em que estágio?"** → teses de regularização e atenuação.
6. **"Já houve autuação anterior no mesmo local?"** → reincidência (dosimetria) e duplicidade.
7. **"Foi pago algo ou há multa diária/embargo?"** → urgência reforçada (embargo → avaliar tutela de urgência — CPC art. 300).

## Classificação automática sugerida (para o EJC)
- Área: ambiental/auto-infracao; Urgência: alta se ciência < 20 dias ou embargo; Risco: multa + sanções restritivas + penal (se dano significativo).
- Documentos a solicitar imediatamente: AI íntegro, notificação, laudo, titularidade, CAR/PRA, licenças, fotos.
- Possíveis teses: nulidade formal; decadência/prescrição (verificar regime); materialidade; nexo; dosimetria; regularização (BANCO 03).

## Saída da triagem
Resumo estruturado do caso + checklist de documentos + teses priorizadas + prazo crítico no controle de prazos.`,
    ['ambiental/auto-infracao', 'geral/triagem'], 'P0'),
  base('triagem-cobranca-empresarial', 'Triagem: Cobrança empresarial (roteiro de entrevista)',
    'TRIAGEM', 'civil', 'cobranca', 'Roteiro inteligente de triagem', `## Roteiro
1. **"Qual o valor e quem é o devedor (PF/PJ, situação financeira)?"** → viabilidade econômica e rito.
2. **"Existe título/contrato? Qual?"** → tipo (nota promissória, duplicata, contrato simples) define rito e prescrição (CC art. 206 — verificar).
3. **"Há reconhecimento do débito (e-mail, acordo, pagamento parcial)?"** → interrupção de prescrição + prova forte.
4. **"A cobrança extrajudicial já foi feita? Com prova?"** → etapa do fluxo (BANCO 07).
5. **"O devedor alega o quê (defeito, falta de entrega, compensação)?"** → defesa provável e provas necessárias.
6. **"Data do vencimento/último pagamento?"** → prescrição (crítica).

## Classificação sugerida
- Área: civil/cobranca; Urgência: alta se prescrição próxima; Risco: insolvência do devedor.
- Documentos: título, notas, AR, extratos, e-mails.
- Teses: cobrança/monitória/executiva conforme título; juros/correção; cláusula penal (limites).`,
    ['civil/cobranca', 'geral/triagem'], 'P0'),
  base('triagem-consulta-ambiental-licenciamento', 'Triagem: Consulta ambiental — licenciamento/regularização',
    'TRIAGEM', 'ambiental', 'licenciamento', 'Roteiro inteligente de triagem', `## Roteiro
1. **"Qual a atividade/empreendimento e onde?"** → tipo de licença (LP/LI/LO), órgão (federal/estadual/municipal).
2. **"Qual o estágio atual (pretende iniciar, em licenciamento, licenciado, autuado por falta)?"** → definição do problema.
3. **"Existe APP/reserva legal no imóvel? Há CAR?"** → Lei 12.651/2012 — APP/RL/CAR.
4. **"Há TAC/acordo com o órgão? Prazos de condicionantes correndo?"** → urgência.
5. **"Há autos de infração relacionados?"** → conexão com BANCO triagem AI.

## Classificação sugerida
- Área: ambiental/licenciamento; Urgência: média/alta se condicionantes ou embargo.
- Documentos: licenças, CAR, PRA, laudos, planos.
- Teses/providências: correção de rota de licenciamento, conversão de sanções, regularização via PRA/PRAD.`,
    ['ambiental/licenciamento', 'geral/triagem'], 'P1'),

  // ================= REGRAS DE INTELIGÊNCIA PROCESSUAL (8) =================
  base('regra-se-ai-ambiental', 'Regra: SE tipo_processo = auto_infracao_ambiental ENTÃO...',
    'REGRA_INTELIGENCIA', 'ambiental', 'auto-infracao', 'Árvore de verificação', `SE tipo_processo = auto_infracao_ambiental ENTÃO verificar, nesta ordem:

1. **Existência e integridade do AI** → AI íntegro? anexos? → SE ausente: requerer vista integral ANTES de qualquer ato.
2. **Data de ciência** → notificação com data? → CALCULAR prazo de 20 dias (Decreto 6.514/2008, art. 113) → SE vencido: verificar recurso/decisão pendente.
3. **Linha do tempo e prescrição/decadência** → prática do ato → AI → ciência → aplicar art. 21 (redação vigente) + jurisprudência (validar regime) → SE decorrido prazo: preliminar.
4. **Competência do órgão** → norma aplicável (federal/estadual/municipal; UC; bacia) → SE conflito: preliminar.
5. **Materialidade** → laudo técnico existe? medições? fotos? → SE ausente/dubio: tese de materialidade + in dubio pro natura.
6. **Nexo causal** → relação autuado-conduta-dano → arrendamento? terceiro? evento natural? → SE dúvida: tese de nexo.
7. **Enquadramento** → dispositivo citado correto? unidade de cálculo correta (art. 8º e ss.)? → SE erro: tese de enquadramento.
8. **Dosimetria** → gradação? antecedentes? capacidade? → SE não: tese de proporcionalidade.
9. **Regularização** → CAR/PRA/licenças/PRAD em curso? → SE sim: atenuação/conversão.
10. **Documentos necessários** → lista do BANCO 08 (tabela AI ambiental).
11. **Riscos** → penal (dano significativo — Lei 9.605/1998 arts. 2º-3º) → SE indícios: alertar cliente e separar estratégias.
12. **Jurisprudência aplicável** → BANCO 02 + validar precedentes na fonte oficial na data da peça.
13. **Peça correspondente** → BANCO 04 — Defesa Administrativa Ambiental.`,
    ['ambiental/auto-infracao'], 'P0'),
  base('regra-se-busca-apreensao-fiduciaria', 'Regra: SE tipo_processo = busca_e_apreensao (alienação fiduciária) ENTÃO...',
    'REGRA_INTELIGENCIA', 'bancario', 'alienacao-fiduciaria', 'Árvore de verificação', `SE tipo_processo = busca_e_apreensao ENTÃO verificar:

1. **Existência do contrato** → contrato com cláusula fiduciária? registrado? (DL 911/1969)
2. **Constituição em mora** → vencimento? inadimplemento real?
3. **Notificação** → extrajudicial/cartório? CONTEÚDO (débito específico)? ENDEREÇO correto? → SE endereço desatualizado ou notificação genérica: tese de nulidade da mora.
4. **Pagamento** → valores pagos após a notificação? créditos não abatidos?
5. **Purgação da mora** → prazo de 5 dias (DL 911/1969, art. 2º) foi respeitado? purgação recusada sem motivo?
6. **Consolid da propriedade** → registro após prazo? intimação correta?
7. **Venda do bem** → avaliação justa? valor inferior ao mercado? dano? (art. 3º do DL 911 — conferir texto vigente)
8. **Prescrição/decadência** → datas de cada fase.
9. **Abusividades** → cláusulas (juros, tarifa, seguro embutido) → BANCO 14.
10. **Jurisprudência aplicável** → STJ sobre alienação fiduciária (validar precedentes na fonte oficial).
11. **Peças** → defesa (resposta à busca e apreensão), impugnação de crédito, tutela de urgência para suspender leilão.`,
    ['bancario/alienacao-fiduciaria'], 'P0'),
  base('regra-se-execucao-fiscal', 'Regra: SE tipo_processo = execucao_fiscal ENTÃO...',
    'REGRA_INTELIGENCIA', 'tributario', 'execucao-fiscal', 'Árvore de verificação', `SE tipo_processo = execucao_fiscal ENTÃO verificar:

1. **CDA** → existe? indica: valor, fato gerador, contribuinte, lançamento? → SE omissão grave: nulidade (LEF art. 2º § 5º — conferir).
2. **Linha do tempo CTN** → fato gerador → lançamento/notificação → constituição definitiva → ajuizamento → CTN art. 150 § 4º/173/174 → SE prazo excedido: prescrição/decadência.
3. **Prescrição intercorrente** → paralisação → LEF art. 40 § 4º (1 ano suspensão + 5 anos) → SE configurado: reconhecer de ofício (requerer).
4. **Redirecionamento** → dissolução irregular? sócios geradores? (CTN arts. 134-135) → SE genérico: tese contra redirecionamento.
5. **Embargos** → garantia disponível? prazo 30 dias (LEF art. 16)? → estratégia de garantia (seguro garantia x depósito).
6. **Penhora** → bens impenhoráveis? avaliação irregular?
7. **Transação/negociação** → PGFN (transação — Lei 13.988/2020 — mencionar como via) → verificar programas vigentes.
8. **Documentos** → CDA, notificação, contrato social, provas de dissolução, demonstrativos.
9. **Jurisprudência** → STJ sobre CDA/redirecionamento (validar antes de citar).
10. **Peças** → embargos (BANCO 04), impugnação de penhora, defesa em redirecionamento.`,
    ['tributario/execucao-fiscal'], 'P0'),
  base('regra-se-contestacao-civel', 'Regra: SE tipo_processo = contestacao_civel ENTÃO...',
    'REGRA_INTELIGENCIA', 'processual-civil', 'contestacao', 'Árvore de verificação', `SE tipo_processo = contestacao_civel ENTÃO verificar:

1. **Prazo** → juntada do AR + 15 dias úteis (CPC art. 335) → registrar no controle.
2. **Preliminares** → rodar CPC art. 337 item a item (incompetência, ilegitimidade, litispendência, coisa julgada, conexão, incapacidade, inépcia).
3. **Prescrição/decadência** → regime aplicável (CC art. 206; CDC arts. 26-27; CTN se tributário) → art. 337 § 5º (senão preclusão).
4. **Impugnação específica** → cada documento do autor (CPC art. 341) → fato não impugnado = presumido (art. 344).
5. **Fatos admitidos** → escolher conscientemente (não prejudicar outras teses).
6. **Provas** → contraprovas necessárias (documental/testemunhal/pericial); requerer explicitamente.
7. **Reconvenção/compensação** → contracredito disponível?
8. **Jurisprudência** → BANCO 02 (validar precedentes na fonte oficial).
9. **Peça** → BANCO 04 — Contestação (modelo).`,
    ['processual-civil/contestacao'], 'P0'),
  base('regra-se-res-acp-ambiental', 'Regra: SE tipo_processo = acao_civil_publica_ambiental (rés) ENTÃO...',
    'REGRA_INTELIGENCIA', 'ambiental', 'acao-civil-publica', 'Árvore de verificação', `SE a empresa/cliente é réu em ACP ambiental ENTÃO verificar:

1. **Legitimidade e objeto** → Lei 7.347/1985 (art. 1º e 5º) — objeto dentro da lei? → SE improcedente o objeto: preliminar.
2. **TAC prévio** → existe acordo com o MP sobre o mesmo objeto? → SE sim: litispendência/identidade de objeto (avaliar).
3. **Dano e nexo** → laudo do autor? nexo? → tese de materialidade/nexo (BANCO 03).
4. **Conformidade** → licenças, condicionantes cumpridas, monitoramentos → dossiê de conformidade.
5. **Risco integral** → responsabilidade objetiva consolidada (STJ) → DEFESA EFICAZ: atacar nexo e extensão, não culpa.
6. **Reparação in natura** → propor PRAD/planos de recuperação com cronograma (mitigação da condenação).
7. **Perícia** → requerer contraditório técnico desde o início (quesitos).
8. **Provas** → séries históricas, monitoramentos, auditorias (BANCO 08 — tabela ACP).
9. **Jurisprudência** → Súmula 652/STJ (Estado omissivo — solidariedade) se aplicável contra terceiros/Estado.
10. **Peças** → contestação ACP + impugnação de laudo.`,
    ['ambiental/acao-civil-publica'], 'P0'),
  base('regra-se-mandado-seguranca', 'Regra: SE tipo_processo = mandado_de_seguranca ENTÃO...',
    'REGRA_INTELIGENCIA', 'administrativo', 'mandado-seguranca', 'Árvore de verificação', `SE impetração de mandado de segurança ENTÃO verificar:

1. **Ata concreta** → existe ato de autoridade concreto? (não serve para dúvida abstrata).
2. **Direito líquido e certo** → prova pré-constituída documental (não depende de perícia).
3. **Prazo** → 120 dias da ciência do ato (Lei 12.016/2009, art. 23) → decadencial, sem interrupção.
4. **Autoridade coatora correta** → quem efetivamente praticou/ordenou o ato.
5. **Ausência de via ordinária adequada** → não existe outro recurso cabal.
6. **Perigo** → urgência (liminar — CPC art. 300 aplicado subsidiariamente).
7. **Peça** → impetração com documentos essenciais anexos (certidões, ofícios, decisões).`,
    ['administrativo/mandado-seguranca'], 'P0'),
  base('regra-se-cobranca-empresarial', 'Regra: SE tipo_processo = cobranca_empresarial ENTÃO...',
    'REGRA_INTELIGENCIA', 'civil', 'cobranca', 'Árvore de verificação', `SE caso de cobrança empresarial ENTÃO verificar:

1. **Título/contrato** → qual? liquidez e certeza? → define rito (monitória/executiva/ordinária).
2. **Prescrição** → CC art. 206 (verificar regime do título) → datas: vencimento/último pagamento/reconhecimento.
3. **Mora** → constituição (protesto/notificação) → juros/correção aplicáveis.
4. **Defesa provável** → defeito/falta de entrega/compensação → preparar provas contrárias ANTES do ajuizamento.
5. **Situação do devedor** → capacidade de pagamento? recuperação judicial em curso? (habilitação de crédito).
6. **Garantias** → aval, fiança, alienação → incluir na ação.
7. **Estratégia** → extrajudicial estruturada (fluxo BANCO 07) → acordo com garantia x ajuizamento.
8. **Peças** → petição inicial de cobrança (BANCO 04), notificação extrajudicial.`,
    ['civil/cobranca'], 'P0'),
  base('regra-se-fiscalizacao-trabalhista', 'Regra: SE evento = fiscalizacao_trabalhista ENTÃO...',
    'REGRA_INTELIGENCIA', 'trabalhista', 'fiscalizacao', 'Árvore de verificação', `SE o cliente recebeu notificação de fiscalização trabalhista ENTÃO verificar:

1. **Alcance da fiscalização** → auditoria, termo de constatação, auto de infração?
2. **Documentos exigidos** → folha, contratos, registros de jornada, EPIs, normas de segurança → organizar PRIMEIRO.
3. **Riscos identificados** → vínculo de terceiros? jornada? segurança? → mapear por tema.
4. **Defesa administrativa** → prazo da notificação; apresentação tempestiva com documentação.
5. **LGPD** → dados de empregados solicitados → fornecer minimamente necessário (Lei 13.709/2018).
6. **Encargos/autos de infração** → contencioso trabalhista e tributário (contribuições) simultâneos.
7. **Prevenção** → plano de conformidade (jornada, contratos, segurança) com cronograma.`,
    ['trabalhista/fiscalizacao'], 'P1'),

  // ================= REGRAS CONTRATUAIS (1 mestre) =================
  base('regras-contratuais-deteccao-riscos', 'Regras: Inteligência contratual — detecção de riscos (BANCO 14)',
    'REGRAS_CONTRATUAIS', 'geral', 'metodologia', 'Regras de detecção em cláusulas', `Cada regra: gatilho → severidade → recomendação → redação alternativa sugerida.

| # | Regra | Gatilho (padrão a detectar) | Severidade | Recomendação | Redação alternativa sugerida |
|---|-------|------------------------------|-----------|--------------|------------------------------|
| 1 | Cláusula abusiva | Exclusão total de responsabilidade de uma parte | Alta | Equilibrar exclusões; dolo nunca excludente | "Cada parte responde por dolo e por falhas graves; limites simétricos de responsabilidade." |
| 2 | Ausência de prazo | Contrato sem vigência/entregas indefinidas | Alta | Definir prazo + marco de entrega | "Vigência de X meses; entregas conforme cronograma (Anexo)." |
| 3 | Multa excessiva | Multa > 10-20% do valor ou sem teto | Alta | Limitar e vincular a perda real | "Multa limitada a 10% do valor da obrigação inadimplida, cumulável com perdas comprovadas." (CC art. 413 — redução) |
| 4 | Responsabilidade desproporcional | Limites assimétricos (uma parte ilimitada) | Alta | Simetrizar | "Responsabilidade de cada parte limitada a R$ X ou aos pagamentos dos últimos 12 meses." |
| 5 | Sem índice de reajuste | Valores fixos sem reajuste em contratos longos | Média | Definir índice e data-base | "Reajuste anual pelo {{INDICE}} a partir da data-base." |
| 6 | Rescisão/renovação automática | Renovação automática sem aviso | Média | Aviso prévio e janela de decisão | "Renovação automática por períodos iguais, facultada a denúncia com 60 dias de aviso." |
| 7 | Foro de eleição | Foro desfavorável sem ligação | Média | Negociar foro razoável | "Foro de {{FORO}} para questões decorrentes deste contrato." |
| 8 | Garantias ausentes | Entrega de valor sem garantia do contraponto | Média | Exigir garantia (seguro/fiança/retenção) | "A contratada apresentará seguro garantia de X% do valor." |
| 9 | Confidencialidade ausente | Troca de informações sensíveis sem NDA | Alta | Incluir NDA (modelo BANCO 05) | Cláusula de confidencialidade com prazo e exclusões. |
| 10 | LGPD ausente | Tratamento de dados pessoais sem cláusula | Alta | Definir papel e obrigações | "A contratada atuará como operadora, tratando dados conforme instruções, com segurança e notificação de incidentes (Lei 13.709/2018)." |
| 11 | PI indefinida | Entregáveis sem titularidade definida | Média | Definir titularidade e licenças | "As entregas pertencem ao contratante; licenças pré-existentes permanecem do contratado." |
| 12 | Rescisão assimétrica | Uma parte rescinde livremente, outra só por descumprimento | Alta | Simetrizar hipóteses e avisos | "Qualquer parte poderá rescindir por inadimplemento grave ou por interesse com 60 dias de aviso." |

**Uso pelo EJC:** ao analisar contrato, executar cada gatilho contra o texto; gerar relatório de riscos por severidade com as redações alternativas.`,
    ['geral/metodologia', 'empresarial/contratos-empresariais'], 'P0'),

  // ================= JURIMETRIA (1) =================
  base('jurimetria-metodologia-ejc', 'Jurimetria: Metodologia EJC (estrutura para dados REAIS)',
    'JURIMETRIA', 'geral', 'metodologia', 'Metodologia de coleta estatística', `## AVISO FUNDAMENTAL
**NUNCA INVENTAR ESTATÍSTICAS.** Este banco só receberá números quando houver dados empíricos reais, com fonte verificável e metodologia declarada. Separar sempre: **DADO ESTATÍSTICO REAL** de **ANÁLISE QUALITATIVA**.

## Estrutura de registro para cada conjunto de dados (quando houver)
- **tribunal:** (ex.: TJMG, TRT3, TRF6, STJ)
- **classe:** (ex.: apelação cível, agravo)
- **assunto:** (ex.: infração administrativa ambiental)
- **período:** (ex.: 2024-2026)
- **quantidade_de_julgados:** número bruto analisado
- **resultado:** (ex.: X procedentes / Y improvientos / Z parcial) — derivado do conjunto analisado
- **orgao_julgador:** (ex.: 1ª Câmara Cível)
- **tese:** tese objeto da medição
- **metodologia:** como a amostra foi coletada (busca por descritores no portal, filtros, data de extração)
- **amostra:** tamanho e critérios de inclusão/exclusão
- **fonte:** URL oficial e data da coleta

## Fontes preferenciais para coleta futura
- Portais de jurisprudência dos tribunais (dados abertos, APIs públicas quando disponíveis).
- Relatórios estatísticos oficiais (CNJ — Justiça em Números; corregedorias).
- Painéis do próprio escritório (dados privados do EJC — item 25, base privada segregada).

## Separadores obrigatórios em qualquer saída
- \`[DADO ESTATÍSTICO REAL]\` — apenas com fonte + período + metodologia.
- \`[ANÁLISE QUALITATIVA]\` — opinião técnica EJC, sem número.

## Status
Estrutura pronta; nenhum dado estatístico registrado no LOTE-001 (base iniciando em 2026-08-29).`,
    ['geral/metodologia'], 'P1'),
];
