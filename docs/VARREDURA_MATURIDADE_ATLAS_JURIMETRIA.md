# Varredura de maturidade — Atlas Forense / Jurimetria JEC

**Data da análise:** 14/10/2026
**Branch analisada:** `feat/minutaia-parity`
**Escopo:** Atlas Forense, especialmente Jurimetria JEC, API interna do Cérebro EJC, Compêndio e coletores DataJud.

## 1. Resultado direto

O Atlas já possui uma base consistente para **jurimetria descritiva auditável**, mas ainda não entrega a camada analítica que o objetivo exige:

> identificar os casos que geraram os números de dano moral, dano material e obrigação de fazer; reconstruir a causa fática/jurídica; verificar como o caso foi julgado; e vincular cada conclusão à fonte e à evidência correspondente.

Hoje, o sistema responde principalmente:

- quantos processos foram distribuídos no recorte;
- quais assuntos CNJ aparecem com maior frequência;
- quais órgãos julgadores aparecem nas facetas;
- quantas baixas definitivas foram observadas em pilotos limitados;
- quais metadados de julgados estão catalogados no Compêndio;
- quais teses, fontes e vínculos editoriais foram curados.

Ele **não responde de forma sistemática**, por processo, às perguntas:

1. Qual foi a causa concreta do litígio?
2. O pedido foi dano moral, material, obrigação de fazer ou combinação?
3. Qual fato gerador foi reconhecido ou rejeitado?
4. Houve procedência, improcedência, procedência parcial, extinção ou acordo?
5. Qual fundamento foi usado na sentença/acórdão?
6. Qual valor foi fixado, quando existente?
7. Qual movimento é apenas processual e qual contém decisão de mérito?
8. Qual trecho da fonte comprova cada classificação?

**Conclusão:** o próximo amadurecimento deve ser tratado como a criação de uma camada de **Casos e Resultados Documentais**, separada das atuais métricas agregadas.

---

## 2. O que já está implementado

### 2.1 Jurimetria agregada

O banco contém execuções e métricas agregadas para:

- censo nacional JEC;
- cobertura territorial da RMBH;
- recorte Cível/Consumidor do TJMG;
- distribuições mensais;
- facetas por assunto, órgão e município;
- piloto de baixas definitivas por mês e órgão.

As consultas agregadas usam, em geral, `size: 0` e `_source: false`, preservando o desenho de não persistir processos individuais nessa camada.

### 2.2 Decomposição atual de danos

O contrato do Cérebro já possui `buildDamageCausalBreakdown`, que tenta decompor rótulos textuais com expressões como:

- “dano moral por ...”;
- “dano material decorrente de ...”;
- “dano em razão de ...”.

Isso é útil como **normalização preliminar de rótulos**, mas não equivale à causalidade jurídica de um caso. Se o DataJud retornar apenas “Indenização por dano moral”, o sistema não consegue descobrir, por esse campo isolado, se a causa foi negativação indevida, atraso de voo, falha bancária, cobrança indevida, vício de produto ou outro fato.

### 2.3 Compêndio de jurisprudência

O modelo de jurisprudência já possui campos relevantes:

- tipo de decisão;
- data;
- tema;
- resultado na origem;
- resultado no recurso;
- tipo de disposição;
- valor de dano moral;
- resumo da fundamentação;
- status e fonte da evidência;
- vínculo com temas, teses e autoridades.

Esse modelo serve como embrião da camada de casos julgados, mas hoje o Compêndio é um acervo curado de jurisprudência/metadados, não uma base sistemática de processos JEC do recorte estatístico.

### 2.4 Governança e proveniência

Há controles relevantes já disponíveis:

- fontes oficiais e URL canônica;
- hash de lote;
- fila de revisão humana;
- auditoria de decisões editoriais;
- bloqueio de dados pessoais em metadados públicos;
- separação entre Atlas e casos privados do EJC;
- ressalvas expressas contra taxa de êxito, ranking de magistrados e previsão de resultado;
- integração do Cérebro EJC apenas com dados públicos e jurimetria descritiva.

Esse é um bom fundamento para ampliar a análise sem transformar o Atlas em um repositório indiscriminado de autos.

---

## 3. Lacunas críticas encontradas

### 3.1 O painel chama “causa” o que é principalmente assunto CNJ

O painel atual exibe itens como:

- Indenização por dano moral;
- Indenização por dano material;
- Atraso de voo;
- Cancelamento de voo;
- Negativação indevida;
- Cláusulas abusivas;
- Bancários;
- Obrigação de fazer/não fazer.

Esses itens não têm o mesmo nível semântico:

| Tipo | Exemplo | O que representa |
|---|---|---|
| Pedido/efeito | Dano moral | Pretensão ou consequência alegada |
| Pedido/efeito | Dano material | Pretensão ou consequência alegada |
| Fato gerador | Atraso de voo | Evento narrado/classificado |
| Fato gerador | Negativação indevida | Conduta alegada |
| Relação jurídica | Bancários | Setor ou relação contratual |
| Tutela | Obrigação de fazer | Tipo de providência requerida |
| Fundamento possível | Cláusulas abusivas | Questão jurídica ou contratual |

Somar esses rótulos em um mesmo ranking produz uma visão útil de frequência, mas não uma árvore causal. O sistema precisa separar **fato gerador → relação jurídica → pedido → fundamento → decisão → resultado**.

### 3.2 As métricas RMBH não contêm casos individuais

`rmbhCivilConsumerMetrics` possui células agregadas por:

- execução;
- tribunal;
- município;
- órgão julgador;
- mês;
- código e rótulo de categoria;
- quantidade.

Não há, nessa tabela, identificador de processo, movimento individual, documento, sentença, valor, resultado ou trecho probatório. Portanto, a camada atual não pode, legitimamente, abrir os casos que compõem uma célula.

### 3.3 O coletor de baixas não é coletor de julgamentos

O coletor de baixas foi desenhado para observar o movimento exato “Baixa Definitiva”, deduplicar processo-mês em memória e persistir apenas totais agregados. Isso não informa:

- se houve sentença;
- se houve acordo;
- se houve procedência;
- qual pedido foi acolhido;
- qual fundamento foi utilizado;
- qual valor foi arbitrado.

Uma baixa definitiva é um evento de encerramento/andamento, não um resultado de mérito por si só.

### 3.4 A consulta pontual DataJud é insuficiente para o objetivo

A consulta administrativa por número de processo retorna metadados, assuntos, órgão e movimentos. Ela não foi estruturada para montar uma ficha causal nem para extrair decisão de mérito. Para isso seria necessário obter e revisar, quando juridicamente permitido e tecnicamente disponível:

- sentença ou acórdão;
- tipo de decisão;
- dispositivo;
- fundamentos;
- pedidos;
- valores;
- eventos relevantes da tramitação.

### 3.5 O Compêndio tem campos de resultado, mas não um esquema causal formal

Os campos `outcomeOrigin`, `outcomeAppeal`, `dispositionType`, `moralDamageValue` e `reasoningSummary` são úteis, porém livres e insuficientes para análises confiáveis. Faltam, no mínimo:

- classificação controlada do fato gerador;
- classificação controlada dos pedidos;
- classificação controlada dos fundamentos;
- resultado por pedido;
- tipo de documento que sustenta a classificação;
- trecho ou referência interna da evidência;
- nível de confiança;
- status de revisão humana da anotação;
- distinção entre alegação da parte e fato reconhecido pelo julgador.

### 3.6 “Como foram julgadas” ainda não é uma dimensão analítica

O sistema registra alguns resultados em texto, mas ainda não normaliza uma matriz como:

| Pedido | Alegado | Reconhecido no fundamento | Resultado no dispositivo | Valor | Evidência |
|---|---|---|---|---|---|
| Dano moral | Sim | Sim/Não/Incerto | Procedente/Improcedente/Parcial | R$ ... | sentença, p. ... |
| Dano material | Sim | Sim/Não/Incerto | Procedente/Improcedente/Parcial | R$ ... | sentença, p. ... |
| Obrigação de fazer | Sim | Sim/Não/Incerto | Deferida/Negada/Prejudicada | — | sentença, p. ... |

Sem essa matriz, a expressão “dano moral” continua misturando pedido, assunto cadastrado e resultado.

---

## 4. Modelo de maturidade recomendado

### Nível 0 — Agregado descritivo

**Já implementado.** Contagens, facetas, distribuição territorial, período e limitações metodológicas.

### Nível 1 — Catálogo de casos públicos

**Próximo passo recomendado.** Criar uma entidade sanitizada de caso com:

- identificador técnico interno;
- identificador público ou chave HMAC, conforme a finalidade;
- tribunal, órgão, classe e período;
- assuntos CNJ;
- movimentos selecionados;
- fonte e hash da coleta;
- status de cobertura;
- sem partes, CPF ou conteúdo bruto na camada pública.

### Nível 2 — Extração documental estruturada

Para cada documento elegível:

- sentença;
- acórdão;
- decisão interlocutória relevante;
- acordo homologado, quando disponível;
- movimento de julgamento.

Extrair somente campos definidos no contrato, preservando:

- tipo documental;
- data;
- classificação do resultado;
- pedidos identificados;
- fatos geradores;
- fundamentos;
- valores;
- referência de página/trecho;
- hash do documento;
- confiança da extração.

### Nível 3 — Revisão humana causal

Nenhum caso deve entrar na análise causal publicada apenas porque um modelo classificou o texto. A revisão deve confirmar, por item:

1. o que foi alegado;
2. o que foi provado ou reconhecido;
3. o que foi decidido;
4. qual trecho comprova a conclusão;
5. se a classificação é adequada ou deve ficar “incerta”.

### Nível 4 — Jurimetria causal

Somente após cobertura suficiente e revisão:

- causas mais frequentes por pedido;
- causas que mais aparecem em procedência, improcedência e parcialidade;
- fundamentos associados a cada resultado;
- valores por tipo de dano, com mediana, quartis e quantidade válida;
- tempo entre ajuizamento, julgamento e baixa;
- distribuição por órgão e período;
- análise de combinações de pedidos;
- casos representativos com dossiê rastreável.

### Nível 5 — Integração com o Cérebro EJC

O Cérebro deve receber apenas um `IntelligenceSnapshot` com:

- estatísticas agregadas;
- `EvidenceRef` para cada conclusão;
- cobertura e limitações;
- versão da metodologia;
- status de revisão humana;
- nenhuma parte ou dado pessoal desnecessário.

O Cérebro não deve tratar o ranking causal como probabilidade de êxito nem como recomendação automática de tese.

---

## 5. Arquitetura de dados sugerida

### 5.1 Entidades novas

#### `jurimetry_case_runs`

Registra a execução de coleta e sua metodologia:

- `runKey`;
- tribunal/alias;
- classe e grau;
- período;
- filtros de assunto e órgão;
- status;
- cobertura;
- fingerprint da consulta;
- nota de privacidade;
- versão do protocolo.

#### `jurimetry_cases`

Representa um caso público ou uma chave técnica sanitizada:

- `caseKey` ou HMAC efêmero/persistente conforme finalidade;
- tribunal;
- órgão;
- classe;
- data de ajuizamento;
- situação de cobertura;
- hash do registro de origem;
- `runId`;
- timestamps.

Não deve guardar nomes de partes na camada analítica pública.

#### `jurimetry_case_subjects`

Relação entre caso e assunto CNJ, com:

- código;
- rótulo;
- ancestralidade na TPU;
- papel semântico: fato, relação, pedido, fundamento ou outro;
- fonte da classificação.

#### `jurimetry_documents`

Metadados do documento analisado:

- caso;
- tipo documental;
- data;
- hash;
- origem;
- disponibilidade;
- número de páginas;
- status de revisão;
- não necessariamente o texto integral.

#### `jurimetry_claims`

Pedidos e fatos classificados:

- `claimType`: moral, material, obrigação de fazer, repetição, rescisão etc.;
- `role`: pedido, fato gerador, fundamento, consequência;
- `label` controlado;
- `source`: assunto, movimento, sentença, acórdão ou revisão manual;
- `confidence`;
- `reviewStatus`.

#### `jurimetry_outcomes`

Resultado por pedido:

- `claimId`;
- `outcome`: procedente, improcedente, parcial, extinto, prejudicado, acordo, incerto;
- valor monetário, quando expressamente identificado;
- fase: origem, recurso ou cumprimento;
- dispositivo e referência de evidência;
- revisor e data.

#### `jurimetry_evidence_refs`

Contrato comum de evidência:

- `sourceId`;
- URL ou identificador oficial;
- hash;
- documento;
- página/parágrafo/posição;
- trecho minimizado, se autorizado;
- tipo de evidência;
- versão da extração;
- status de revisão.

### 5.2 Regra de separação

As tabelas agregadas atuais não devem ser substituídas. O desenho correto é:

```text
DataJud / fonte oficial
        |
        v
Execução de coleta auditada
        |
        +--> Métricas agregadas atuais
        |
        +--> Casos sanitizados, quando permitido
                    |
                    +--> Documentos e EvidenceRef
                    +--> Anotações causais revisadas
                    +--> Resultados por pedido
                    +--> Jurimetria causal
                              |
                              v
                    IntelligenceSnapshot do EJC
```

---

## 6. Taxonomia causal recomendada

A taxonomia deve evitar que tudo seja reduzido a “dano moral”. Uma estrutura inicial:

### 6.1 Fato gerador

- negativação indevida;
- cobrança indevida;
- fraude ou contratação não reconhecida;
- desconto ou empréstimo não reconhecido;
- falha de serviço;
- interrupção de serviço essencial;
- atraso/cancelamento de voo;
- extravio de bagagem;
- vício ou defeito de produto;
- descumprimento contratual;
- atraso na entrega;
- recusa de cobertura;
- falha de atendimento;
- vazamento ou uso indevido de dados;
- acidente de trânsito;
- outro fato controlado;
- incerto.

### 6.2 Relação jurídica/setor

- banco/financiamento;
- telefonia;
- energia;
- transporte aéreo;
- comércio eletrônico;
- educação;
- saúde;
- seguros;
- serviços públicos;
- compra e venda;
- prestação de serviços;
- outro.

### 6.3 Pedido

- dano moral;
- dano material;
- obrigação de fazer;
- obrigação de não fazer;
- repetição do indébito;
- rescisão/resolução contratual;
- restituição;
- tutela de urgência;
- declaração de inexistência de débito;
- outro.

### 6.4 Resultado

- procedente;
- improcedente;
- parcialmente procedente;
- extinto sem mérito;
- acordo homologado;
- prejudicado;
- não localizado;
- incerto.

**Regra essencial:** “incerto” é resultado válido e preferível a uma classificação inventada.

---

## 7. Riscos técnicos e jurídicos

### Risco 1 — Confundir assunto com causa

**Alto.** Um assunto CNJ pode ser múltiplo, genérico, selecionado administrativamente ou associado a pedido, não necessariamente ao fato provado.

**Controle:** separar papel semântico e exibir a origem da classificação.

### Risco 2 — Confundir movimento com julgamento

**Alto.** “Baixa Definitiva”, “sentença proferida”, “homologação” e “arquivamento” não têm automaticamente o mesmo significado jurídico.

**Controle:** taxonomia de movimentos e confirmação por documento/dispositivo.

### Risco 3 — Falsa taxa de êxito

**Alto.** Uma amostra de processos com movimento ou documentos disponíveis não representa todos os processos do censo.

**Controle:** publicar cobertura, denominador, exclusões, relação `eq/lower_bound`, período e nível de revisão.

### Risco 4 — Dados pessoais e sigilo

**Alto.** A camada individual pode conter partes, documentos e informação protegida.

**Controle:** minimização, segregação entre cofre operacional e camada analítica, HMAC quando necessário, retenção controlada e revisão de acesso.

### Risco 5 — Extração generativa sem evidência

**Alto.** Modelo pode atribuir causa, resultado ou valor sem suporte textual.

**Controle:** saída estruturada, `EvidenceRef` obrigatório, bloqueio de publicação sem revisão e marcação de incerteza.

### Risco 6 — Inconsistência do schema

**Médio.** A varredura identificou no arquivo `drizzle/schema.ts` uma declaração duplicada de `note` em `thesisAuthorities`. Isso deve ser verificado no estado efetivo do repositório e corrigido se ainda presente, pois pode causar erro de compilação ou divergência de migração.

---

## 8. Priorização de amadurecimento

### P0 — Contrato causal e evidencial

1. definir a taxonomia causal;
2. definir a matriz pedido–fundamento–resultado;
3. definir `EvidenceRef` e `reviewStatus`;
4. criar testes de contrato;
5. impedir que a UI chame agregação de “causa” sem ressalva.

### P1 — Coleta individual limitada e controlada

1. começar apenas pelo TJMG/JEC e órgãos prioritários;
2. limitar o piloto a uma janela temporal e quantidade revisável;
3. não coletar partes na primeira versão;
4. obter apenas metadados, movimentos e documentos elegíveis conforme disponibilidade oficial;
5. produzir manifesto sanitizado por execução.

### P1 — Ficha de caso

Criar uma tela própria com:

- identificação pública;
- linha do tempo;
- assuntos CNJ;
- fatos geradores;
- pedidos;
- documentos;
- resultado por pedido;
- evidências;
- revisão humana;
- limitações.

### P2 — Painel causal

Substituir o ranking único por painéis separados:

- fatos geradores;
- pedidos;
- resultados;
- fundamentos;
- valores;
- tempo processual;
- combinações causais;
- casos representativos.

### P2 — Snapshot para o Cérebro

Exportar apenas estatísticas aprovadas e referências de evidência, com versão de metodologia. A integração deve permanecer descritiva e não preditiva.

---

## 9. Verificação realizada

A varredura foi baseada em:

- `apps/atlas-forense/shared/brain-api.ts`;
- `apps/atlas-forense/server/brain-api.ts`;
- `apps/atlas-forense/server/db.ts`;
- `apps/atlas-forense/drizzle/schema.ts`;
- `apps/atlas-forense/client/src/data/jecDashboardData.ts`;
- `apps/atlas-forense/client/src/pages/Home.tsx`;
- coletores e runtimes de DataJud;
- testes de jurimetria, baixas, privacidade e governança;
- documentação de censo, baixas, Compêndio e integração com o Cérebro EJC.

A análise não presume que a existência de um campo ou rótulo prove a causa concreta ou o resultado de mérito. Para isso, será necessária fonte documental adequada e revisão humana.

## 10. Síntese executiva final

O Atlas não precisa abandonar o que já foi construído. A solução correta é adicionar uma segunda camada:

- **Atlas Métrico:** agregações, cobertura e distribuição;
- **Atlas Causal:** casos, documentos, pedidos, causas, fundamentos, resultados e evidências.

O primeiro já está funcional. O segundo é a lacuna estratégica. A implementação deve começar por um piloto pequeno, rastreável e revisado, evitando transformar o sistema em um ranking de “quem ganha” baseado em assuntos ou movimentos incompletos.

> Toda classificação produzida por IA deverá ser revisada por profissional habilitado antes de ser utilizada em peça, orientação ao cliente, estratégia processual ou publicação.
