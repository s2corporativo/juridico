# Matriz de compatibilidade — especificação do Compêndio

**Base analisada:** especificação recebida em 28/08/2026.  
**Decisão de arquitetura:** o Atlas mantém MariaDB próprio e isolado; o EJC poderá atuar apenas como provedor de identidade quando isso for necessário.

| Requisito da especificação | Decisão no Atlas | Justificativa e limite |
| --- | --- | --- |
| Consulta por área, fonte, tribunal, cidade e tema | **Incorporado** | Já há busca pública tipada e filtros sobre o acervo validado. A pesquisa não indexa notas internas, casos ou dados pessoais. |
| Tese, fonte, proveniência, força documental e citação | **Incorporado e ampliado** | O dossiê preserva fonte oficial, lote, taxonomia, tese e auditoria pública sanitizada. O score mede completude, não mérito, vigência ou probabilidade. |
| Governaça de vigência e sinalização de revisão | **A incorporar** | Será calculada a partir de `lastReviewedAt` e fonte oficial, com situação explícita. Nenhuma tese nasce “vigente” apenas por importação. |
| Copiar citação para petição | **A incorporar** | A ação será limitada à citação de fonte pública confirmada e terá ressalva de revisão profissional. |
| Exportação CSV / impressão | **Parcialmente incorporado** | O dossiê já imprime/exporta Markdown. Exportação estruturada ficará restrita ao escopo público ou à área autenticada, conforme o conteúdo. |
| Importação de APIs oficiais | **Incorporado com governança** | Só fontes aprovadas e rotas de servidor; não serão persistidos PDFs, respostas brutas, chaves ou processos individuais. Importado entra em revisão. |
| Arquivo JSON compartilhado | **Recusado** | Substituído por MariaDB isolado com migrações, índices, trilha de auditoria e idempotência. JSON como armazenamento concorrente aumenta risco de colisão e perda de governança. |
| Senha única de equipe e token em localStorage | **Recusado** | O Atlas permanece público para consulta e, quando necessário, terá autenticação OIDC e papéis. Senha coletiva reduz rastreabilidade e armazenamento local de token é inadequado para a área administrativa. |
| Campos de casos, resultado, responsável e notas internas | **Adaptado para área interna futura** | Esses dados não entram no modelo público. Só poderão existir em módulo autenticado com finalidade, minimização, controle de acesso e revisão humana definidos. |
| Limpar tudo / excluir verbetes | **Recusado na área pública** | Preservação de acervo e auditoria é prioritária. Qualquer manutenção futura exigirá papel administrativo, trilha e estratégia de reversão. |

## Escopo de implementação aprovado

Nesta etapa, o Atlas aproveitará dois elementos: **sinalização documental de revisão** para teses e julgados com fonte já catalogada e **citação copiável** no dossiê público. Eles não criam novos dados jurídicos, não movem informações ao EJC e não desbloqueiam a Central de Controle.

> Registros trazidos por fonte pública permanecem em estado de evidência explícita e exigem revisão humana antes de uso profissional. A interface não declarará tese “vigente”, força vinculante ou aplicabilidade ao caso concreto sem fonte e verificação adequadas.
