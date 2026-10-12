# Atlas Forense + JuridIA — staging integrado e release candidate

**Verificação:** 12/10/2026 · **Origem:** `s2corporativo/juridico`, branch `atlas-forense` · **Commit de código publicado somente em staging:** `ab85078139f4f765e005c7d76e1dbeacaa062bc7`.

## Topologia ativa, somente dentro da VPS

| Serviço | Unidade systemd | Endereço |
|---|---|---|
| Atlas Forense novo | `atlas-forense-stage.service` | `http://127.0.0.1:3114` |
| JuridIA novo | `juridia-stage.service` | `http://127.0.0.1:3005` |
| Notificações isoladas do Atlas | Processo do Atlas stage | `127.0.0.1:3318` |
| MariaDB somente staging | Docker `atlas-mariadb-staging-20261010` | `127.0.0.1:3317`, schema `atlas_stage` |
| SQLite JuridIA novo | `/opt/atlas-juridico/staging/unified/data/juridia-stage.db` | Arquivo persistente próprio |

Os dois serviços de staging estão habilitados no `systemd`, `User=sentinelx`, restrição de escrita por `ProtectSystem=strict`, segredos carregados de `EnvironmentFile` protegidos (0600, root). **Nenhuma publicação Nginx, DNS ou porta pública foi criada.** O Atlas legado `127.0.0.1:3010` (714 docs / 2.727 chunks) e o DPT `127.0.0.1:3000` seguem separados.

O release é imutavelmente identificado pelo SHA e está em `/opt/atlas-juridico/staging/unified/releases/ab85078139f4f765e005c7d76e1dbeacaa062bc7`. Não reutilizar `.next` de outra branch nem alterar código diretamente em produção.

## Evidências de homologação

1. Checkout fresco do GitHub no SHA exato: **Atlas** TypeScript, testes e build aprovados; **JuridIA** Prisma generate, TypeScript, ESLint, testes e Next standalone build aprovados.
2. PR #24 corrigiu acesso cruzado em prazos, audiências, movimentações, Cérebro, Visual Law, mapeamento, grafo, revisão de afirmações, agenda, indicadores e intimações. E2E com duas contas fictícias: 12 ações/leitura de terceiro rejeitadas com HTTP 404, quatro controles de leitura própria aprovados. Primeiro E2E detectou duas exclusões inseguras, **corrigidas e retestadas antes do merge**.
3. Serviços persistentes: Atlas `/healthz` 200; JuridIA `/` 200; ausência de bearer na API Atlas 401; sessão JuridIA ausente 401; rota Atlas integrada sem sessão 401.
4. Login integrado **real dos dois serviços permanentes**, com conta sintética criada somente para teste: `POST /api/auth/login`, `GET /api/auth/me`, leitura do legado e do snapshot via JuridIA retornaram 200. Conta sintética removida; banco voltou a zero usuários.
5. Restart dos dois serviços de staging via `systemd`: recuperaram HTTP em três tentativas; DPT e Atlas legado continuaram em HTTP 200.
6. MariaDB staging: 284 documentos `legacy_knowledge_review.pending` e 20 `editorial_updates.pending_review`. Snapshot editorial aprovado = **0**.
7. O SQLite do staging foi criado com Prisma sem reset/accept-data-loss. `PRAGMA integrity_check=ok`, usuários, clientes, casos e documentos reais = 0; backup bootstrap verificado `unified/backups/juridia-stage-bootstrap-20261012.sqlite`. Backups MariaDB anterior e posterior à importação foram anteriormente restaurados em schema de teste com 20 e 284 registros, respectivamente.

## Qualidade da fila editorial (triagem apenas)

- Dos 284 importados, **243 são classificados como legislação e 41 como jurisprudência**, todos pendentes.
- Há 75 URLs de origem distintas. Várias linhas compartilham páginas oficiais de legislação; isso **não significa documento duplicado**: a verificação `SHA2(tipo+texto)` encontrou 284 textos distintos.
- Os domínios das URLs cadastradas são governamentais ou judiciais no exame sintático; isto **não comprova que o texto está vigente, íntegro, citável ou que a jurisprudência é autêntica e aplicável**. Revisar integralmente antes de aprovar no Atlas.
- O contrato de snapshot V1 transporta **somente metadados de fontes editoriais aprovadas**, não o inteiro teor RAG jurídico. Não ativar sincronização diária sem fonte revisada, backup verificado e Citation Gate.

## Bloqueios de publicação pública

1. **GitHub Actions está impossibilitado de iniciar jobs por cobrança:** execução [38303580790](https://github.com/s2corporativo/juridico/actions/runs/38303580790) exibe `The job was not started because your account is locked due to a billing issue.`. É bloqueio da conta GitHub, não erro demonstrado de build. O titular da conta precisa regularizar o faturamento/limite; o assistente não alterou cobrança. Não chamar CI de verde até haver execução realmente aprovada.
2. **Revisão humana do acervo:** nenhuma das 284 fontes herdadas ou 20 atualizações editoriais está aprovada. Não emitir minutas como se o RAG atualizado já estivesse disponível.
3. **Acesso de advogados:** o SQLite de staging permanece sem usuários permanentes. Configurar conta real e troca de senha por fluxo seguro antes de dar acesso público; não utilizar contas demo ou senha fixa.
4. **Hardening de release público:** HTTPS, proxy com `X-Real-IP` sobrescrito, autenticação, backup **recorrente e criptografado**, restauração real, observabilidade, cron/editorial, DNS e rollback. O backup bootstrap não substitui essa política.

## Reversão segura de staging

Se staging apresentar problema, `sudo systemctl stop juridia-stage.service atlas-forense-stage.service` interrompe **somente os serviços novos**. Não executar `rm` em `/opt/atlas-juridico/shared` ou bases do DPT; backups e release GitHub permanecem preservados. A promoção pública deve ocorrer apenas depois de gates completos e inspeção funcional real dos advogados.

**Decisão:** staging interno homologado tecnicamente para consulta/teste; **produção pública bloqueada** até CI, curadoria jurídica e provisionamento de acesso seguro.
