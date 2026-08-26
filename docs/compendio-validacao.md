# Validação do Compêndio Jurídico Nacional

Data da validação: **26/08/2026**.

| Item verificado | Resultado |
|---|---|
| Rota `/compendio` | Renderizada com dados obtidos por tRPC e banco persistido. |
| Lote piloto exibido | 6 julgados, 6 fontes oficiais, 7 tópicos e 3 teses. |
| Busca textual | A pesquisa por `reserva de domínio` retornou um único acórdão TJMG de Belo Horizonte. |
| Filtro por área | A combinação do termo acima com `Bancário/consumerista` retornou corretamente estado vazio, preservando a coerência entre filtros. |
| Busca e área compatíveis | A combinação de `tarifas` com `Bancário/consumerista` retornou dois julgados compatíveis do lote piloto. |
| Rastreabilidade | Cada ficha de julgamento mantém situação da fonte, número de identificação disponível e link oficial. |
| Privacidade | A interface informa a vedação de nomes de partes, CPF, endereço e outros dados pessoais. |
| Desktop (1280 px) | Hierarquia visual, fichas de julgamento, taxonomia, teses e cadeia de custódia renderizaram sem sobreposição. |
| Móvel (375 px) | Navegação, busca, métricas, fichas e blocos metodológicos permanecem legíveis em coluna única. |

> O lote continua explicitamente classificado como **piloto local** de Betim, Contagem e Belo Horizonte. Ele não representa censo nacional, nem permite inferência estatística nacional ou por estrato inferior a dez registros.

A revisão visual também confirmou que **Atlas Forense / JEC** é a marca-mãe da página; o Compêndio aparece como módulo jurídico subordinado e declara a natureza da evidência em seus blocos principais.
