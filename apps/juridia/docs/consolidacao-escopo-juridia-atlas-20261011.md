# Consolidação de escopo JuridIA × Atlas — 11/10/2026

## Princípio de produto

**JuridIA:** pesquisa de jurisprudência e legislação com fontes rastreáveis, análise de documentos/provas e proposta de minuta jurídica sujeita a revisão por advogado.

**Atlas:** coleta de atualizações jurídicas em fontes oficiais, catalogação por origem, validação editorial, consulta do corpus e monitoramento diário verificável.

**DPT ERP:** único produto para clientes, financeiro, prazos, audiências, compromissos e administração do escritório. Nenhuma tabela real foi excluída, migrada ou ligada a outro sistema nesta rodada.

## JuridIA: cinco módulos navegáveis

| Módulo visível | Composição preservada |
|---|---|
| Assistente Jurídico | Classificação de entrada para pesquisa/análise/minuta; não se anuncia como IA jurídica executora |
| Pesquisa Jurídica | Biblioteca de fontes e pesquisa no corpus, com revisão e rastreabilidade |
| Análise Jurídica | Cérebro, mapa de afirmações/evidências e etapas internas de validação |
| Minutas IA | Gerador, editor e apresentação/Visual Law na mesma área |
| Biblioteca | Minutas pertencentes ao usuário autenticado e modelos de redação com reabertura no editor |

- O store Zustand foi migrado de v1 para v2; tabs antigas são convertidas aos cinco destinos. Chamar `setAppTab("editor")` abre `Minutas IA > Editor`, sem perda do fluxo de rascunho existente.
- O assistente visual e `/api/assistente` anunciam somente as cinco áreas. Foram retirados comandos sugeridos de financeiro, clientes, prazos, audiências e produtividade.
- O antigo dashboard de métricas de escritório deixa de ser a página de entrada. Governança e componentes técnicos permanecem internos, não são menus adicionais.
- Os modelos `Case`, `Client` e `EvidenceRef` ainda são necessários para autorização por caso e provas; **não** equivalem a um ERP de clientes.
- **Importante:** os arquivos e endpoints legados de ERP ainda existem no branch para compatibilidade/rollback e não foram migrados ou eliminados fisicamente. Eles não aparecem na interface reduzida. A desativação de APIs deve ser feita em migração separada, verificando consumidores e preservando o histórico.

## Atlas: quatro módulos navegáveis

| Módulo | Endereço | Escopo |
|---|---|---|
| Atualizações diárias | `/` | Exibe apenas entradas aprovadas da fila editorial; ausência não significa nenhum julgado novo |
| Acervo jurídico | `/compendio` | Consulta e rastreabilidade de jurisprudência e fontes |
| Pesquisa de fontes | `/fontes` | Matriz oficial, consulta do catálogo CKAN STJ e limites |
| Monitoramento | `/controle` | Últimas execuções do coletor e estado real da fila, com autorização administrativa |

- `/controle/fila-editorial` continua como **subfunção interna do Monitoramento**, não como quinto módulo.
- Dossiês individuais `/dossie/:externalId` continuam disponíveis a partir de pesquisas; as demais páginas legadas de clientes, comunicações, RMBH, censo e treinamento não são mais roteadas pelo App.
- `editorial.health` é uma query **admin-only**, retorna execução diária real, estados, contagens e data no fuso America/Sao_Paulo; o endpoint público `editorial.approved` mantém apenas itens aprovados.
- Metadados STJ coletados, inclusive o lote de staging, **não** são jurisprudência conferida ou íntegra de acórdão.

## Agendamento Atlas: configuração corrigida, **não instalada**

- O timer `atlas-editorial-daily.timer` já expressa `04:15:00 America/Sao_Paulo`, `Persistent=true`, intervalo aleatório de 120 segundos. Calendário analisado com `systemd-analyze calendar`.
- O template de serviço foi alinhado ao layout comprovado da VPS: `User=sentinelx`, script em `/opt/atlas-juridico/shared/bin/run-editorial-daily.sh`, segredo injetado de `/etc/atlas-juridico/editorial.env`. Ambos devem ser provisionados e protegidos no momento do **deploy autorizado**.
- O invocador só usa loopback `127.0.0.1:3010`, segredo por stdin do curl e nunca registra chave. `completed` retorna sucesso; `partial` e `failed` retornam erro, mesmo quando a API devolve HTTP 200.
- **O timer não consta como instalado na VPS**. Não criá-lo/ativá-lo enquanto o release antigo não contém o endpoint compatível, as fontes não têm confiabilidade jurídica aprovada e o rollback integrado está pendente.
- Para ativação futura, o release deverá comprovar rota autenticada, segredo de 32+ caracteres gerado e guardado em cofre, permissão do script ao usuário do serviço, `systemd-analyze verify`, backup/restauração, teste real de duas datas consecutivas e alertas de falha/execução parcial.
- DJEN continua HTTP 403 no ambiente VPS, exigindo correção legítima de acesso. A execução STJ + DJEN não pode ser marcada como concluída enquanto DJEN não estiver validado.

## Gates

- Stage JuridIA `tsc --noEmit`, `bun test tests/*.test.ts` e `next build`.
- Stage Atlas `tsc --noEmit`, `vitest run` e `vite build`.
- Testes de regressão para número de itens da navegação, destinos de atalhos antigos e endpoint de saúde exclusivamente administrativo.
- `knowledge-release-readiness.ts`: deve permanecer com exit code 2 devido à ausência de revisão humana de fontes, 60 casos de benchmark jurídico, integrações, performance e rollback.

## Política de publicação

A implementação permanece no branch `fix/juridia-rag-safety-audit-20261010`, PR #11 em `DRAFT`, sem merge, alteração do proxy, serviços, bancos ou release de produção. O layout e os fluxos foram simplificados **em código/staging**; não afirmar que o novo Atlas atualiza diariamente na produção atual.
