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
| Pesquisa no servidor | A consulta inicial retornou os seis julgados sem transferir o snapshot integral de fontes e julgados para o filtro local. |
| Filtros estruturados | Tribunal, cidade, área jurídica e situação da fonte foram carregados a partir das facetas persistidas no banco. |
| Combinação de filtros | Cidade `Contagem` combinada com `Fonte oficial confirmada` retornou os dois acórdãos TJMG compatíveis, após a atualização da consulta no servidor. |

> O lote continua explicitamente classificado como **piloto local** de Betim, Contagem e Belo Horizonte. Ele não representa censo nacional, nem permite inferência estatística nacional ou por estrato inferior a dez registros.

A revisão visual também confirmou que **Atlas Forense / JEC** é a marca-mãe da página; o Compêndio aparece como módulo jurídico subordinado e declara a natureza da evidência em seus blocos principais.

| Dossiê de citação | Registro real do lote piloto exibiu identificação pública, origem, lote, hash, taxonomia, tese, estado de revisão e ressalva de uso profissional. |

Em **27/08/2026**, a rota de dossiê foi validada com um julgado real já catalogado. A tela exibiu apenas metadados públicos necessários à citação e não mostrou dados de partes, contato ou documento pessoal.

Em viewport de **375 × 812 px**, o dossiê preservou leitura de identificação, proveniência, taxonomia, tese, estado de revisão e ressalva profissional em coluna única. A central de controle exibiu a fila sem registros e manteve a barreira de autenticação antes de qualquer ação administrativa.
