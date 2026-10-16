# Auditoria de consolidação e alisamento — Atlas Forense e JuridIA

**Data:** 16/10/2026. **Repositório:** `s2corporativo/juridico`. **Exclusão expressa:** DPT ERP não integra este trabalho.

## Inventário verificável

- 62 referências de branches remotas obtidas por `git fetch` e inventariadas.
- Quatro branches são ancestrais completos da principal `atlas-forense`: `feat/atlas-design-simplification`, `feat/juridia-autonomous-curation-seed-20261016`, `feat/minutaia-parity` e `feature/cerebro-brain-api`.
- As outras **não são ancestrais completos**, o que pode refletir *squash merges*, outras bases, commits únicos ou reescrita de histórico; **não é prova de trabalho pendente**, nem autoriza exclusão.
- A branch principal no inventário estava no commit `2fd934db35bebf1af66fd6e1065c5dc8eda66ee5`, com cerca de 607 arquivos rastreados.
- Nenhuma PR aberta foi retornada pela consulta a PRs na ocasião da auditoria.

## Melhorias de outras IAs examinadas por arquivos / grupos de mudanças

| Conjunto | Trabalho útil identificado | Conduta |
| --- | --- | --- |
| `audit/juridia-owner-isolation-20261012` | Escopo por usuário, revisão dos endpoints de clientes/casos/documentos | Preservar os controles vigentes na principal; comparar diferenças de autorização antes de promover qualquer linha antiga. |
| `audit/oidc-atomic-redemption-20261012` | Prevenção de troca/reutilização de códigos OIDC | Manter o código de resgate e os testes atuais; exigir teste de concorrência antes de substituição. |
| `audit/juridia-remove-demo-residues-20261012` | Retirada de dados demonstrativos e métricas inventadas | Valor permanente: nunca publicar perfis, contagens ou atos jurídicos falsos. Não apagar dados reais nem testes de regressão. |
| `feat/atlas-pautajur-editorial-integracao-20261014` | Sugestões editoriais e interface do Atlas | A principal já contém `ContentSuggestionsPanel` e `editorial-content-suggestions`; evitar novo painel duplicado. |
| `feat/cerebro-ejc-integrado-juridia-20261015` | Análise de provas e salvaguarda de dados privados | Manter Cérebro EJC interno à JuridIA; revisar `brain-ejc-evidence-gate` em comparação sem recriar serviço externo. |
| `feat/juridia-agent-skills-governance-20261015` | Agentes declarativos e bloqueio de skills não aprovadas | Reusar registros e a governança atual; não duplicar agentes que executam a mesma etapa. |
| `fix/juridia-maturity-calibration-20261016` | Penalidade para roteiros de curadoria genéricos | Incorporada a detecção do segundo formato de roteiro na principal proposta. |
| `fix/juridia-citation-provenance-gate-20261014` | Preservação de proveniência de fontes | A principal já possui `citation_gate.ts` e testes; manter entrada humana antes de citação em peça. |
| `feat/atlas-legacy-review-import-20261012` | Quarentena de legado importado | Preservar migrations, estados editoriais e a distinção entre documento encontrado e precedente citável. |
| `feat/ejc-brain-core`, `feat/tribunal-multiragente`, `f0/f1/f2` | Grandes árvores históricas não consolidadas | **Não mesclar em bloco**: introduziriam aplicações, rotas ou estados incompatíveis com a arquitetura estabilizada. Avaliar apenas funcionalidades individualizadas e testáveis. |

Esta é uma triagem de mudanças, **não auditoria de segurança exaustiva linha a linha** das 62 branches.

## Limpeza efetivamente proposta nesta branch

1. Eliminar `apps/juridia/scripts/scan-skill-maturity.ts`: duplicata sem referências rastreadas; manter **apenas** a execução canônica `apps/juridia/scripts/audit-legal-maturation.ts`, que seleciona a versão mais recente por habilidade, exclui conteúdo sensível do relatório, restringe caminho de saída e grava arquivo atomicamente.
2. Expor `bun run maturity:audit` como entrada única para diagnóstico e `bun run curation:import-drafts` para a importação supervisionada. A segunda permanece bloqueada sem `JURIDIA_CURATION_IMPORT=draft_only`.
3. Corrigir `assessSkillMaturity` para classificar tanto `RASCUNHO METODOLÓGICO PARA REVISÃO JURÍDICA` quanto `PROTOCOLO DE ANÁLISE SUPERVISIONADA` como *roteiro genérico sem densidade jurídica*, exigindo revisão humana prioritária.
4. Acrescentar regressão para impedir que um formulário genérico sem fontes oficiais receba pontuação indevidamente alta.

## Alerta P0 — resíduo de automação de banco

O pacote JuridIA ainda expõe `db:push` e `db:reset` e scripts legados da Z.ai em `.zscripts`. `.zscripts/database-runtime-build.sh` copia um banco de preview e usa `bun run db:push` na montagem do artefato. Esses arquivos **não foram apagados nesta etapa**, porque têm testes e ainda podem ser chamados por pipelines legados. O caminho correto é desligá-los de deploy de produção e substituir o fluxo por `prisma migrate deploy` após identificação exata do banco e da baseline. Não executar esses scripts com dados operacionais.

## Regras de arquitetura

- **Uma única fonte canônica** para cada fluxo: curadoria, versão aprovada, citação, geração, inteligência de caso.
- **Menu simples**: fluxos principais visíveis; ferramentas administrativas e diagnósticos recolhidos.
- **Dados jurídicos verificáveis**: conteúdo importado continua rascunho; nunca elevar status mediante seed ou pontuação automática.
- **Separação do Atlas**: apenas snapshots editoriais aprovados; dados privados de clientes não circulam pelo Atlas.
- **Sem exclusão destrutiva** de migrations, logs úteis, backups, branches com commits únicos, artefatos necessários a rollback, certificados ou dados reais.

## Critérios para futura exclusão de branches

Só considerar exclusão após evidência de que todo conteúdo útil foi mesclado (comparação dos patches, não só SHA), testes passaram, tags/snapshots preservam recuperação e nenhuma PR/runner/release ativa usa a referência. Branch não ancestral **não é sinônimo** de branch descartável.

**Estado de implantação:** este documento registra a consolidação do repositório; não autoriza publicação operacional nem eliminação de dados em VPS.
