# Prontidão do Censo Nacional

Data da validação: **26/08/2026**.

O Atlas Forense passou a possuir uma camada persistente para executar e auditar o futuro censo nacional DataJud. A estrutura separa **execução** de **métrica agregada mensal**, sem guardar número de processo, partes, conteúdo de petições ou credenciais.

| Componente | Estado atual | Regra de uso |
|---|---|---|
| `national_census_runs` | Execução parcial persistida; 27 de 27 aliases responderam e as distribuições foram coletadas. | Cada coleta registra período, situação, cobertura, versão metodológica e impressão digital de consulta sem segredo. |
| `national_census_metrics` | 540 linhas de distribuição persistidas; baixas ainda ausentes. | Apenas distribuições e baixas agregadas por tribunal, UF e mês podem ser armazenadas. |
| Página `/nacional` | Validada com estado **Cobertura Parcial**, 100% de endpoints e 540 séries mensais. | Exibe somente distribuições e facetas; não apresenta taxa, baixa ou resultado processual. |
| Conector DataJud | Chave pública resolvida somente em memória durante operação administrativa. | Consulta pontual e cobertura de alias; sem banco, cache, interface ou log de credencial. |

> A ausência de uma camada nacional não é preenchida por estimativa. O Atlas hoje possui distribuições e facetas agregadas auditáveis, mas continua sem baixas nacionais e sem inferências de mérito.

## Execução planejada

Foi persistida a execução `datajud-jec-nacional-2025-2026-v1`, com escopo de **JEC estadual — distribuições e baixas mensais agregadas**, período de **2025-01 a 2026-08**, expectativa de 27 tribunais e disponibilidade de endpoint de **27 de 27**. Ela contém métricas agregadas de distribuição, mas não guarda corpo de consulta, processos ou credenciais; baixas permanecem fora deste lote.

## Verificação de aliases estaduais

Em **26/08/2026**, os **27 aliases estaduais** receberam consulta agregada vazia (`size: 0`, `match_none`) e responderam HTTP 200. A chave pública foi obtida da página oficial apenas em memória. O resultado confirma disponibilidade dos endpoints; não comprova completude, comparabilidade, atualização, histórico ou qualidade das métricas futuras.

## Distribuições nacionais agregadas

Na mesma data, o executor realizou o recorte de **Procedimento do Juizado Especial Cível** (classe CNJ 436), grau `JE`, por mês de ajuizamento de **2025-01 a 2026-08**. Foram obtidas **540 de 540 células mensais exatas** — 27 tribunais por 20 meses — com `hits.total.relation = eq`, sem falhas reportadas. O banco recebeu somente essas linhas agregadas, totalizando **4.006.686 distribuições** no recorte.

| Camada | Situação | Afirmação permitida |
|---|---|---|
| Disponibilidade de endpoint | 27 de 27 aliases responderam. | Há rota pública verificável para coleta agregada. |
| Distribuições | 540 de 540 células exatas persistidas. | Volume mensal agregado da classe 436, grau JE, no período. |
| Baixas | Não coletadas. | Nenhuma taxa de baixa, estoque, produtividade ou clearance rate. |
| Ano de 2026 | Parcial até 26/08/2026. | Não comparar o acumulado parcial com ano fechado sem ajuste explícito. |

> A execução nacional está classificada como **parcial** porque as distribuições são somente uma camada do censo. Ela não é taxa de êxito, taxa de baixa ou análise de resultados processuais.

## Assuntos e órgãos agregados

O mesmo recorte nacional produziu **2.108 assuntos CNJ** e **3.307 órgãos julgadores** distintos em facetas agregadas. A coleta usou agregação `composite` paginada até a ausência de `after_key` em cada alias: foram concluídas **88 páginas de assuntos** e **59 páginas de órgãos**, sem erro nos 27 tribunais. Assim, o banco recebeu todas as facetas retornadas pelo recorte, e o painel exibe apenas as 12 maiores de cada categoria para leitura.

A soma de assuntos é superior ao total de distribuições porque a classificação é multivalorada; a soma de órgãos é ligeiramente inferior quando o metadado de órgão não está preenchido. Nenhuma dessas listas permite inferir mérito, procedência, desempenho ou comparabilidade institucional sem análise adicional.

## Validação de interface

A rota `/nacional` foi revisada em desktop e em viewport móvel de **375 × 812 px** após a importação integral. A série mensal, os maiores volumes, os 12 assuntos e os 12 órgãos mais frequentes mantiveram leitura, sem dados pessoais, com as ressalvas de parcialidade, sobreposição de assuntos e ausência de baixas visíveis no próprio painel.

Os filtros do painel foram testados com o recorte **TJMG, 2026-01 a 2026-08**, retornando somente as oito células mensais do tribunal e o total correspondente. A exportação CSV do mesmo recorte é gerada no navegador com fonte, escopo, parcialidade de 2026, ausência de baixas e cinco colunas estritamente agregadas: tribunal, UF, mês, métrica e quantidade. O relatório de impressão usa o mesmo estado de filtro, omitindo navegação e controles no papel.

Após a revisão final, o CSV passou a declarar também **cobertura de 100% (27/27 TJs)** e estado **cobertura parcial**. O contrato de exportação tem teste automatizado. As facetas de assunto e órgão aparecem em bloco próprio, rotulado como **“Facetas nacionais integrais · fora do recorte ativo”**, para não sugerir que os filtros de período ou tribunal as alteram. A página foi verificada em desktop e em tela móvel após essa separação visual.

**Decisão de escopo:** enquanto não houver facetas mensais por tribunal na base, assuntos e órgãos permanecem deliberadamente fora do recorte ativo. O rótulo e a nota explicam que se referem ao período-base completo de 2025-01 a 2026-08; não se deve ler seus valores como resultado do filtro selecionado.

O acionamento de **Relatório / imprimir** abriu o diálogo nativo do navegador, que não pôde ser inspecionado pela automação por depender da interface local de impressão. Em substituição à inspeção visual do diálogo, há teste automatizado do contrato de impressão: ele verifica que a folha oculta trilho, barra superior e controles de filtro, preserva os blocos nacionais e evita quebra interna desses blocos. A confirmação material em impressora ou pré-visualização do sistema continua como validação operacional a ser feita pelo usuário antes do uso externo.

Posteriormente, a rota `/nacional` foi renderizada por Chromium headless com tempo de hidratação de 12 segundos. O PDF resultante usou **cinco páginas A4**: a primeira preservou título, estado **Cobertura Parcial**, 100% de cobertura e período; a segunda preservou o recorte ativo, a série mensal e a ressalva de ausência de baixas, sem trilho, barra de navegação, campos de seleção ou botões. Essa renderização confirma o contrato de impressão sem depender do diálogo nativo.

A extração textual do mesmo PDF confirmou as expressões **“Cobertura Parcial”**, **“100%”**, **“Filtro ativo: 2025-01 — 2026-08 · Brasil”**, a indicação de que **“Baixas não foram coletadas”** e a ressalva de que taxas e rankings comparativos permanecem indisponíveis. A busca não encontrou textos dos controles interativos (`CSV do recorte`, `Relatório / imprimir`, `Início` ou seletor de tribunal), corroborando sua ocultação na saída impressa.

## Diagnóstico para baixas

O alias TJMG aceitou agregação de nomes de movimentos para o mesmo recorte JEC, o que confirma disponibilidade técnica inicial do campo. Contudo, a série de baixa exige correlacionar **nome exato “Baixa Definitiva”**, data do respectivo movimento e número de processo para deduplicação por processo/mês. Uma agregação simples de campos de movimento pode misturar datas de atos distintos; por isso, o Atlas não a utilizará como série de baixa. A próxima etapa requer extração paginada e minimizada do coorte, deduplicação local e auditoria do total percorrido antes de qualquer publicação.
