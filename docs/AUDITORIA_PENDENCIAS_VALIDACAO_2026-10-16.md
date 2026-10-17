# Auditoria de pendências — Atlas Forense / JuridIA

**Data de referência:** 16/10/2026 (Brasil). **Escopo:** GitHub `s2corporativo/juridico` e VPS `ejc-vps`.
**Aviso:** testes de regressão e estado de produção são evidências distintas. Nenhuma alteração foi aplicada aos bancos de produção.

## Fontes e versões efetivamente verificadas

- Branch canônica `atlas-forense` no SHA `61f5a377cc961cc7193be655ee587d26418d252d`.
- Checkout de QA isolado: `/opt/juridico-review-20261016`.
- Serviços atuais de homologação `atlas-forense-stage.service` e `juridia-stage.service` apontavam para a release `unified-portal-b0b3810` (verificado com `systemctl show`).
- `atlas-juridico.service` mantém aplicação legada em `/opt/atlas-juridico/current/app`. NÃO confundir disponibilidade HTTP com release atualizada.
- A cópia histórica `/opt/juridico-deploy` estava em detached HEAD `64414f0`, com apenas dois lockfiles untracked, e foi usada como origem de um worktree **isolado**; não foi feito reset nem limpeza desse checkout.

## Verificações de regressão

- SHA `61f5a37` antes das mudanças: JuridIA **156 testes / 0 falhas**; Atlas **254 testes / 0 falhas**.
- Branch `fix/brain-private-inference-health-20261016`: JuridIA **157 testes / 0 falhas**.
- TypeScript `bun x tsc --noEmit` e `bun run lint` aprovados na branch de correção.
- Nenhuma das execuções listadas acima homologa SSO real, restauração de backup, modelo Ollama real, renderização mobile, nem corte de produção.

## Correções implementadas nesta branch

1. `/api/brain`: cliente de completions passou para `createLocalCaseClient`, restrito ao Ollama de loopback, mantendo autenticação, ownership, trilha de evidências e bloqueio de conclusão incompleta. Não chama o SDK de IA externo.
2. `/api/brain`: quando o Atlas não entrega resultado, o sistema **não** executa pesquisa web pública com termos derivados do caso e **não** cria precedentes substitutos. Sinaliza ausência/degradação da consulta e retorna lista vazia.
3. `/api/health`: verificação pública mínima de liveness, sem banco, identidades, tokens, ou alegação de prontidão.
4. Testes de privacidade e health para impedir regressão.

## Análise de branches: preservar histórico e não mesclar indiscriminadamente

- `feat/juridia-editorial-workspace-20261016` diverge da principal. O diff de sua API é **anterior** à ação protegida `claim` e substituiria o fluxo de autoria/revisão; exige seleção de trechos, não merge integral.
- `feat/atlas-unified-portal-20261016` diverge em CSS e dashboard; avaliar contra a versão canônica, que já incorporou PR #65 e outras correções posteriores.
- `feat/juridia-curation-maturation-v2-20261016` diverge em scripts/corpus; o núcleo de curadoria está presente na linha principal, e novas cargas não devem ser importadas automaticamente.
- Branches de auditoria antigas e `feat/tribunal-multiragente` não podem ser promovidas sem confronto de governança, autorização por cliente e ausência de regressões jurídicas.

## Pendências de bloqueio para produção

1. Homologar identidade OIDC/PKCE, logon e autorização por usuários reais. O relatório anterior mediu HTTP 503 em `/api/ejc-sso/start` na homologação.
2. Fazer e **restaurar em ambiente isolado** backups consistentes de SQLite, MariaDB, documentos e configuração Nginx/systemd antes de migrar ou cortar serviços.
3. Confirmar base de quarentena do Atlas stage e registrar decisão humana individual para importação. Não considerar 2.000 skills legadas como aprovadas apenas pelos campos textuais antigos.
4. Testar latência e qualidade do modelo local Ollama: o único modelo generativo local listado nesta inspeção foi `qwen3:4b-instruct`, anteriormente reportado com timeout. A privacidade agora é maior; a disponibilidade funcional continua não demonstrada.
5. Auditar outras rotas e bibliotecas que ainda usam o SDK externo (incluindo `judge_simulator.ts`, `thesis_checker.ts`, `lexvalida_pipeline.ts` e `minuta_run.ts`) e estabelecer política de saída/consentimento por fluxo.
6. Reexecutar pipeline CI; a falha anterior de GitHub Actions foi reportada como anterior ao início dos passos. O resultado desse CI não foi inferido como aprovado.
7. Homologar o app em navegador com usuário real, casos, documentos, habilidades, editor, mobile, dashboard, API, SSO, restauração de dados e rollback.
8. Só promover mediante SHA fixo de release, teste autenticado pós-corte e prova de reversão. Não promover a branch desta auditoria diretamente a produção.

**Conclusão:** o trabalho deste PR corrige duas lacunas concretas e audita o estado, mas a solicitação de concluir todas as pendências do ecossistema **não está integralmente homologada**.
