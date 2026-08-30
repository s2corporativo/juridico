import { baseDoc } from "./_base.mjs";

export const contratos = [

// ============ CONTRATO 1 ============
baseDoc({
  slug: "contrato-prestacao-servicos-advocaticios",
  titulo: "Contrato — Prestação de Serviços Advocatícios (com análise das cláusulas críticas)",
  tipoDocumento: "CONTRATO",
  area: "geral",
  subarea: "contratos-advocaticios",
  assunto: "Honorários advocatícios e mandato",
  subassunto: "Prestação de serviços advocatícios",
  tags: ["geral/contratos", "advocacia", "honorarios", "P0"],
  metadados: {
    tipoContrato: "PRESTACAO_SERVICOS_ADVOCATICIOS",
    partes: ["Contratante (cliente)", "Contratado (advogado/escritório)"],
    clausulasCriticas: ["Objeto e escopo do mandato", "Honorários e forma de pagamento", "Rescisão e êxito", "Sigilo profissional", "Responsabilidade e limites", "Foro e resolução de conflitos"],
    modelo: true,
    camposVariaveis: ["{{CLIENTE}}", "{{CPF}}", "{{CNPJ}}", "{{ENDERECO}}", "{{VALOR}}", "{{DATA}}", "{{FATOS}}", "{{PROCESSO}}"]
  },
  conteudo: `# CONTRATO DE PRESTAÇÃO DE SERVIÇOS ADVOCATÍCIOS (MODELO) + ANÁLISE DAS CLÁUSULAS CRÍTICAS

## A. FICHA DO CONTRATO
- **Situação de uso:** contratação de advogado/escritório por pessoa física ou jurídica para atuação judicial e/ou administrativa.
- **Documentos necessários:** documentos de identificação e representação; atos constitutivos (PJ); estimativa de custas; modelo de procuração.
- **Campos variáveis:** {{CLIENTE}} {{CPF}} {{CNPJ}} {{ENDERECO}} {{VALOR}} {{DATA}} {{FATOS}} {{PROCESSO}}.
- **Aviso:** honorários e deveres do advogado são regidos pela legislação da OAB e pelo Código de Ética — dispositivos específicos: [DISPOSITIVO A VALIDAR] antes da versão final. Nenhum dispositivo citado fora da lista confiável EJC.

## B. TEXTO-BASE COMPLETO

CONTRATO DE PRESTAÇÃO DE SERVIÇOS ADVOCATÍCIOS Nº {{DATA}}/01

**CONTRATANTE:** {{CLIENTE}}, {{CPF/CNPJ}}, residente/sediado em {{ENDERECO}}.
**CONTRATADO:** [NOME DO ADVOGADO/ESCRITÓRIO], inscrito na OAB/{{UF}} sob nº [____], com escritório em [____].

### CLÁUSULA 1ª — OBJETO
O CONTRATADO prestará ao CONTRATANTE serviços advocatícios consistentes em: (a) análise do caso relacionado a {{FATOS}}; (b) atuação em {{PROCESSO/procedimento}}; (c) {{PEDIDOS/escopo}}. **Parágrafo único — Escopo limitado:** serviços não contemplados nesta cláusula exigem aditivo expresso.

### CLÁUSULA 2ª — DEVERES DAS PARTES
2.1. O CONTRATADO atuará com diligência, sigilo e lealdade, mantendo o CONTRATANTE informado periodicamente do andamento.
2.2. O CONTRATANTE fornecerá, tempestivamente, todas as informações e documentos necessários e pagará os honorários nas datas avençadas.

### CLÁUSULA 3ª — HONORÁRIOS
3.1. Pelos serviços, o CONTRATANTE pagará: (a) honorários iniciais de {{VALOR}}; (b) parcelas mensais de {{VALOR}}; (c) honorários de êxito de {{% ou valor}} sobre {{base de cálculo definida — ex.: valor efetivamente recebido/economizado}}.
3.2. Custas, emolumentos, taxas judiciárias, despesas com peritos e deslocamentos NÃO integram os honorários e serão reembolsados mediante comprovação.
3.3. Inadimplemento superior a [30] dias habilita o CONTRATADO a suspender os serviços após prévia notificação com prazo de [10] dias.

### CLÁUSULA 4ª — RESCISÃO
4.1. Qualquer parte poderá rescindir mediante notificação com prazo de [15] dias.
4.2. Rescindindo o CONTRATANTE sem culpa do CONTRATADO, serão devidos os honorários proporcionais ao trabalho realizado, acrescidos de {{%}} sobre o êxito posterior obtido com aproveitamento do trabalho já realizado.
4.3. Renúncia de mandato pelo CONTRATADO observará as regras deontológicas (evitar dano ao cliente; manter defesa até ciência expressa — dispositivos: [DISPOSITIVO A VALIDAR]).

### CLÁUSULA 5ª — SIGILO
5.1. As partes manterão sigilo sobre informações trocadas no âmbito do mandato, incluindo após o término do contrato, exceto por determinação legal/judicial ou autorização do cliente.
5.2. O dever de sigilo do advogado é profissional e indeclinável; a presente cláusula reforça, não restringe, esse dever.

### CLÁUSULA 6ª — RESPONSABILIDADE E LIMITES
6.1. O CONTRATADO responde por dolo e culpa grave; a análise jurídica envolve juízo de probabilidade (alta/média/baixa), jamais de garantia de resultado.
6.2. O CONTRATADO não garante resultado favorável nem prazo determinado de conclusão.

### CLÁUSULA 7ª — PROTEÇÃO DE DADOS
O tratamento de dados pessoais no âmbito do mandato observará a LGPD (dispositivos específicos: [DISPOSITIVO A VALIDAR]); o tratamento ocorre para cumprimento de obrigação legal/exercício regular de direitos, com segurança e confidencialidade.

### CLÁUSULA 8ª — FORO E CONFLITOS
Fica eleito o foro de {{foro}} para dirimir controvérsias, após tentativa de composição amigável por [30] dias.

{{LOCAL}}, {{DATA}}.

___________________________          ___________________________
CONTRATANTE                            CONTRATADO — OAB/{{UF}} nº [____]

## C. ANÁLISE DAS CLÁUSULAS CRÍTICAS

| Cláusula | Risco para o CLIENTE | Risco para o ADVOGADO | Ponto de atenção | Alternativa sugerida |
| --- | --- | --- | --- | --- |
| 1ª Objeto | Escopo vago gera disputa sobre o que está incluído | Cliente exige serviços além do combinado sem aditivo | Listar atos concretos (defesa, recursos, audiências) | Tabela de serviços inclusos/exclusos anexa |
| 3ª Honorários | Êxito sobre base mal definida (ex.: "valor da causa" inflaciona) | Êxito cobrável só sobre recebimento real; risco de calote | Definir base: recebido/economizado; eventos que disparam parcelas | Base = crédito efetivamente percebido; êxito proporcional por etapa |
| 3.3 Inadimplemento | Suspensão de defesa em andamento pode causar dano processual | Suspensão sem cautela pode configurar abandono | Prever hipóteses de SUSPENSÃO PROIBIDA (defesa com prazo correndo) | Notificação formal + salvaguarda de atos urgentes |
| 4ª Rescisão | Cláusula de êxito residual sobre trabalho já feito pode ser cobrada mesmo sem cliente continuar | Trabalho realizado sem compensação | Definir critério objetivo de proporcionalidade | Honorários proporcionais por etapa + êxito escalonado |
| 5ª Sigilo | Cliente pode querer divulgar orientação estratégica | Vazamento por equipe — responsabilidade do escritório | Tratamento de dados sensíveis; subcontratados | Sigilo estendido a prepostos; autorização escrita para exceções |
| 6ª Responsabilidade | Cliente pode esperar "garantia" | Expectativa indevida de resultado | Probabilidade sempre QUALITATIVA (alta/média/baixa) — EJC | Declarar expressamente que estimativas não são promessa |
| 8ª Foro | Foro distante encarece conflito | — | Validar admissibilidade da eleição em relação de consumo [VALIDAR] | Mediação prévia obrigatória |

**Riscos globais:** contrato sem cronograma de pagamentos (inadimplemento difícil de provar); ausência de previsão de reajuste de parcelas mensais (sugerir: {{INDEXADOR}}); falta de cláusula de tratamento de dados (LGPD — [DISPOSITIVO A VALIDAR]).`
}),

// ============ CONTRATO 2 ============
baseDoc({
  slug: "contrato-prestacao-servicos-empresarial",
  titulo: "Contrato — Prestação de Serviços Empresarial (com análise das cláusulas críticas)",
  tipoDocumento: "CONTRATO",
  area: "geral",
  subarea: "contratos-empresariais",
  assunto: "Prestação de serviços entre empresas",
  subassunto: "Alcance, SLA, LGPD, PI e garantias",
  tags: ["geral/contratos", "empresarial", "servicos", "P0"],
  metadados: {
    tipoContrato: "PRESTACAO_SERVICOS_EMPRESARIAL",
    partes: ["Contratante (empresa)", "Contratado (prestador)"],
    clausulasCriticas: ["Alcance e entregáveis", "SLA e penalidades", "Reajuste", "LGPD", "Propriedade intelectual", "Garantias", "Rescisão"],
    modelo: true,
    camposVariaveis: ["{{CLIENTE}}", "{{CNPJ}}", "{{CONTRAPARTE}}", "{{VALOR}}", "{{DATA}}", "{{INDEXADOR}}", "{{ENDERECO}}"]
  },
  conteudo: `# CONTRATO DE PRESTAÇÃO DE SERVIÇOS EMPRESARIAL (MODELO) + ANÁLISE DAS CLÁUSULAS CRÍTICAS

## A. FICHA DO CONTRATO
- **Situação de uso:** contratação B2B de serviços (consultoria, TI, manutenção, serviços continuados ou por projeto).
- **Documentos necessários:** atos constitutivos das partes; anexo técnico de escopo; matriz de SLA; lista de dados tratados.
- **Campos variáveis:** {{CLIENTE}} {{CNPJ}} {{CONTRAPARTE}} {{VALOR}} {{DATA}} {{INDEXADOR}} {{ENDERECO}}.
- **Aviso:** LGPD — citar como "Lei Geral de Proteção de Dados" com dispositivos: [DISPOSITIVO A VALIDAR]. Demais normas aplicáveis (Civil, etc.) fora da lista confiável: marcar [DISPOSITIVO A VALIDAR].

## B. TEXTO-BASE COMPLETO

CONTRATO DE PRESTAÇÃO DE SERVIÇOS Nº {{DATA}}/02

**CONTRATANTE:** {{CLIENTE}}, CNPJ {{CNPJ}}, sede em {{ENDERECO}}.
**CONTRATADO:** {{CONTRAPARTE}}, CNPJ [____], sede em [____].

### CLÁUSULA 1ª — OBJETO E ALCANCE
1.1. O CONTRATADO prestará os serviços descritos no **ANEXO I (Escopo)**, incluindo entregáveis, critérios de aceitação e limites.
1.2. Alterações de escopo exigirão aditivo escrito com impacto de prazo e preço. Trabalho fora do escopo não é devido sem aditivo.

### CLÁUSULA 2ª — PRAZO, CRONOGRAMA E SLA
2.1. Vigência de [12] meses a contar de {{DATA}}, renovável por igual período mediante aditivo — **sem renovação automática tácita**.
2.2. Os serviços observarão os níveis de serviço do **ANEXO II (SLA)**: disponibilidade de [__%], tempo máximo de resposta [__h], tempo de solução [__h].
2.3. Descumprimento de SLA gerará desconto de {{VALOR ou %}} sobre a mensalidade do mês, limitado a [__%], sem prejuízo de rescisão por descumprimento grave e reiterado (3 ocorrências em 90 dias).

### CLÁUSULA 3ª — REMUNERAÇÃO E REAJUSTE
3.1. Contraprestação mensal de {{VALOR}}, vencível no dia [05] de cada mês, mediante fatura com prazo de pagamento de [30] dias.
3.2. Reajuste anual pelo {{INDEXADOR}} (ou: proposta indicando índice — evitar lacuna).
3.3. Mora: juros e multa na forma legal [definir % — VALIDAR limites].

### CLÁUSULA 4ª — PROTEÇÃO DE DADOS (LGPD)
4.1. As partes tratam dados pessoais em conformidade com a LGPD ([DISPOSITIVO A VALIDAR]).
4.2. O CONTRATADO atuará como **operador/encarregado subcontratado** quando tratar dados por conta do CONTRATANTE, observando instruções do controlador, segurança, sigilo e registro das operações.
4.3. Incidente de segurança será comunicado ao CONTRATANTE em até [48] horas do conhecimento.
4.4. Subcontratação que envolva tratamento de dados exige autorização prévia e contrato em termos no mínimo equivalentes.

### CLÁUSULA 5ª — PROPRIEDADE INTELECTUAL
5.1. Metodologias, ferramentas e conhecimentos pré-existentes do CONTRATADO permanecem seus.
5.2. Os **entregáveis** desenvolvidos especificamente para o CONTRATANTE, após pagamento integral, pertencem ao CONTRATANTE (ou licença perpétua, mundial, não exclusiva — escolher modelo por caso).
5.3. O CONTRATADO garante que os entregáveis não violam direitos de terceiros.

### CLÁUSULA 6ª — GARANTIAS E RESPONSABILIDADE
6.1. O CONTRATADO garantirá os serviços por [90] dias contra defeitos de execução, corrigindo-os sem custo.
6.2. Responsabilidade por danos diretos limitada ao valor das contraprestações dos últimos [12] meses; **excluídos danos indiretos e lucro cessante**, salvo dolo ou culpa grave.
6.3. Cada parte responde por violação de lei, inclusive trabalhista e tributária, de seus próprios empregados e subcontratados.

### CLÁUSULA 7ª — CONFIDENCIALIDADE
Informações trocadas serão mantidas confidenciais por [3] anos após o término, nas condições do modelo de NDA do EJC (contrato-nda-confidencialidade).

### CLÁUSULA 8ª — RESCISÃO
8.1. Rescisão por: (a) mútuo acordo; (b) descumprimento grave não sanado em [15] dias da notificação; (c) falência/insolvência de qualquer parte.
8.2. Rescindido o contrato, o CONTRATADO entregará todos os artefatos e dados em poder dele, em formato acessível, no prazo de [15] dias.

### CLÁUSULA 9ª — FORO
Eleito o foro de {{foro}}, após tentativa de negociação direta por [30] dias.

{{LOCAL}}, {{DATA}}.
___________________________        ___________________________
CONTRATANTE                          CONTRATADO

## C. ANÁLISE DAS CLÁUSULAS CRÍTICAS

| Cláusula | Risco para o CONTRATANTE | Risco para o CONTRATADO | Ponto de atenção | Alternativa sugerida |
| --- | --- | --- | --- | --- |
| 1ª Escopo | Pedidos informais "extras" não cobertos nem cobrados | Trabalho extra gratuito por pressão operacional | Critérios de aceitação objetivos | Matriz de esforço por entregável; aditivo padrão |
| 2ª SLA | Penalidade apenas com desconto (sem direito de rescisão efetivo) | SLA impossível gera penalidade contínua | Métricas mensuráveis e exceções (força maior, dependência do cliente) | SLA escalonado com crédito de serviço + rescisão por reincidência |
| 3ª Reajuste | Índice omitido = disputa | Inflação corrói margem | Sempre indicar {{INDEXADOR}} | Reajuste anual obrigatório com índice nominal |
| 4ª LGPD | Controle indevido de dados por terceiro | Multa regulatória e responsabilidade solidária percebida | Papel (controlador/operador), incidente, subcontratação | Anexo de tratamento de dados + lista de subprocessadores |
| 5ª PI | Entregável não "pago" permanece do fornecedor | Ceder PI sem remunerar desenvolvimento anterior | Distinguir pré-existente × entregável | Licença perpétua do pré-existente + cessão do entregável pago |
| 6ª Responsabilidade | Limite de valor pode ser baixo demais para o risco | Ilimitação inviabiliza o negócio | Testar cenário de pior caso | Cap escalonado (ex.: 2× contrato) para violação de dados/sigilo |
| 8ª Rescisão | Perda de dados/arteFatos | Trabalho executado não pago | Procedimento de transição | Termo de transição com handover documentado |

**Riscos globais:** contrato sem ANEXO de escopo (litígio quase certo); renovação automática sem janela de aviso; ausência de cláusula de não-concorrência quando sensível (avaliar caso a caso); multa de rescisão antecipada desproporcional (validar limites: [DISPOSITIVO A VALIDAR]).`
}),

// ============ CONTRATO 3 ============
baseDoc({
  slug: "contrato-nda-confidencialidade",
  titulo: "Contrato — NDA / Acordo de Confidencialidade (com análise das cláusulas críticas)",
  tipoDocumento: "CONTRATO",
  area: "geral",
  subarea: "contratos-empresariais",
  assunto: "Confidencialidade",
  subassunto: "NDA mútuo e unilateral",
  tags: ["geral/contratos", "confidencialidade", "nda", "P0"],
  metadados: {
    tipoContrato: "NDA_CONFIDENCIALIDADE",
    partes: ["Parte divulgadora", "Parte receptora (ou mútuas)"],
    clausulasCriticas: ["Definição de informação confidencial", "Exclusões", "Prazo", "Devolução/destruição", "Penalidades", "Não-solicitação"],
    modelo: true,
    camposVariaveis: ["{{CLIENTE}}", "{{CNPJ}}", "{{CONTRAPARTE}}", "{{DATA}}", "{{ENDERECO}}"]
  },
  conteudo: `# ACORDO DE CONFIDENCIALIDADE (NDA) (MODELO) + ANÁLISE DAS CLÁUSULAS CRÍTICAS

## A. FICHA DO CONTRATO
- **Situação de uso:** troca de informações sensíveis antes ou durante negociações, parcerias, due diligence, contratação de serviços.
- **Modelos:** unilateral (um lado divulga) ou mútuo (ambos) — este texto cobre ambos via parágrafo de reciprocidade.
- **Campos variáveis:** {{CLIENTE}} {{CNPJ}} {{CONTRAPARTE}} {{DATA}} {{ENDERECO}}.
- **Aviso:** dispositivos legais específicos sobre segredo empresarial e ilícitos concorrenciais: [DISPOSITIVO A VALIDAR].

## B. TEXTO-BASE COMPLETO

ACORDO DE CONFIDENCIALIDADE Nº {{DATA}}/03

**PARTES:** {{CLIENTE}} (CNPJ {{CNPJ}}) e {{CONTRAPARTE}} (CNPJ [____]).

### CLÁUSULA 1ª — DEFINIÇÕES
1.1. **Informação Confidencial:** qualquer informação, técnica ou comercial, divulgada por qualquer meio (escrito, oral, eletrônico, visual), incluindo planos, dados financeiros, dados pessoais, know-how, códigos, relatórios e estratégias, marcada como confidencial ou que, pela natureza, razoavelmente o seja.
1.2. **Divulgadora:** a parte que revela; **Receptora:** a que recebe. **Este acordo é {{mútuo/unilateral}}** — quando mútuo, cada parte assume ambos os papéis.

### CLÁUSULA 2ª — OBRIGAÇÕES DA RECEPTORA
2.1. Usar as Informações Confidenciais exclusivamente para {{finalidade: avaliação de parceria/due diligence/projeto}}.
2.2. Não revelar a terceiros sem autorização prévia escrita; acesso restrito a empregados e assessores com necessidade de conhecimento, vinculados a obrigação equivalente.
2.3. Proteger com no mínimo o mesmo grau de cuidado que aplica a informações próprias sensíveis e, em qualquer caso, com diligência razoável.
2.4. Notificar imediatamente a Divulgadora sobre acessos não autorizados ou vazamentos.

### CLÁUSULA 3ª — EXCLUSÕES
Não é Informação Confidencial a que: (a) era de domínio público sem culpa da Receptora; (b) já estava validamente em seu poder antes do recebimento, com prova; (c) foi desenvolvida independentemente, com prova documental; (d) foi recebida de terceiro sem restrição; (e) revelação exigida por lei/autoridade — com aviso prévio à Divulgadora quando legalmente possível, limitando-se a divulgação ao necessário.

### CLÁUSULA 4ª — PROPRIEDADE E USO
4.1. As Informações Confidenciais permanecem propriedade da Divulgadora; a Receptora não adquire licença ou direito sobre elas (inclusive marcas e patentes — uso restrito à finalidade).
4.2. É vedada engenharia reversa, cópia em excesso e uso para desenvolvimento concorrente.

### CLÁUSULA 5ª — PRAZO
5.1. O acordo vigora a partir de {{DATA}} por [2] anos; as obrigações de confidencialidade sobrevivem por [3] anos contados do fim da troca de informações ou do término das negociações, o que for posterior.

### CLÁUSULA 6ª — DEVOLUÇÃO E DESTRUIÇÃO
Encerradas as negociações/finalidade ou a pedido da Divulgadora, a Receptora devolverá ou destruirá (confirmando por escrito) todas as cópias e extratos, salvo cópias de backup de sistema e arquivos cuja retenção seja exigida por lei — hipóteses em que o sigilo continua.

### CLÁUSULA 7ª — NÃO-SOLICITAÇÃO (opcional)
Durante [12] meses, as partes não solicitarão empregados-chave da outra que tenham contato com as Informações Confidenciais, exceto anúncio público de vaga.

### CLÁUSULA 8ª — PENALIDADES E RESPONSABILIDADE
8.1. A violação sujeita a Receptora à multa não-penal de {{VALOR}} por infração, sem prejuízo de perdas e danos complementares comprovados e de medida judicial de cessação imediata.
8.2. A responsabilização exige prova do dano ou da infração — a cláusula penal não substitui a demonstração quando exigida (medida do dano: CC, art. 944; ato ilícito: CC, arts. 186 e 927).

### CLÁUSULA 9ª — DADOS PESSOAIS
Eventual tratamento de dados pessoais no âmbito deste acordo observará a LGPD ([DISPOSITIVO A VALIDAR]) e, quando aplicável, contrato instrumental próprio.

### CLÁUSULA 10ª — FORO
Eleito o foro de {{foro}}.

{{LOCAL}}, {{DATA}}.
___________________________        ___________________________
PARTES

## C. ANÁLISE DAS CLÁUSULAS CRÍTICAS

| Cláusula | Risco para a DIVULGADORA | Risco para a RECEPTORA | Ponto de atenção | Alternativa sugerida |
| --- | --- | --- | --- | --- |
| 1ª Definição | Definição estreita deixa informação valiosa fora da proteção | Definição infinita ("tudo é confidencial") cria armadilha | Exigir marcação OU natureza evidente | Definição com dois critérios alternativos (marcada OU razoavelmente confidencial) |
| 3ª Exclusões | Excesso de exclusões esvazia proteção | Exclusões sem prova (burden on receptor: provar domínio prévio) | Exigir registro documental do que já possuía | Cláusula de prova prévia por escrito |
| 5ª Prazo | Prazo curto desprotege segredo industrial | Prazo perpétuo é intangível | Diferenciar vigência × sobrevivência | Vigência 2 anos; sobrevivência 3-5 anos; segredo de negócio indefinido se justificar |
| 6ª Devolução | Dados ficam em backups de terceiros | Impossibilidade técnica de destruir backups | Prever exceção realista | Backup sob sigilo até ciclo de destruição |
| 8ª Penalidade | Multa simbólica não dissuade | Multa exorbitante independente de dano | Multa não-penal + perdas complementares | Multa moderada por evento + ressarcimento provado |
| 7ª Não-solicitação | — | Restrição laboral pode ser questionada | Escopo limitado a contatos diretos | Lista nominativa de pessoas protegidas |

**Riscos globais:** NDA "esquecido" sem registro de quem recebeu o quê (log de entregas); ausência de obrigação dos assessores; silêncio sobre jurisdição e custas.`
})
];
