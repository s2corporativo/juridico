# Relatório de promoção VPS — PR #66 — 16/10/2026

**Situação real: release compilada na VPS em checkout de QA; corte para produção NÃO EXECUTADO porque há bloqueios objetivos.** Não modificar o serviço legado só porque HTTP 200 responde.

## Alvos e evidência observada

- Repositório: `s2corporativo/juridico`, branch `fix/juridia-zai-privacy-legacy-reconciliation-20261016`, PR [#66](https://github.com/s2corporativo/juridico/pull/66).
- Checkout de validação na VPS: `/opt/atlas-juridico/staging/unified/releases/qa-zai-privacy-20261016`.
- Último commit de código validado completamente antes deste relatório: `3c526e49b7a80ae07ff9e4fddddefea88ef737b3`.
- Atlas de produção legado: `atlas-juridico.service`, `127.0.0.1:3010`, caminho `/opt/atlas-juridico/current/app`, não modificado.
- Atlas Forense em homologação: `atlas-forense-stage.service`, `127.0.0.1:3114`, release anterior `unified-portal-b0b3810`.
- JuridIA em homologação: `juridia-stage.service`, `127.0.0.1:3005`, release anterior `unified-portal-b0b3810`.
- Nginx `atlas.13.140.167.153.sslip.io` encaminha atualmente ao legado em `3010`; nenhum redirecionamento público foi modificado.
- `atlas.depaulateixeira.adv.br` responde via Cloudflare. Não se pode inferir o endereço de origem ou homologação apenas do HTTP 200.

## Testes da release candidata na VPS

| Gate | Evidência | Situação |
| --- | --- | --- |
| JuridIA TypeScript | `bun x tsc --noEmit` | aprovado |
| JuridIA ESLint dos arquivos alterados | `bun x eslint ...` | aprovado |
| JuridIA regressão | **156 testes, 0 falhas, 544 expectativas** | aprovado |
| JuridIA build Next.js | `bun run build` | aprovado |
| Atlas TypeScript | `pnpm exec tsc --noEmit` | aprovado |
| Atlas regressão | **254 testes em 55 arquivos** | aprovado |
| Atlas build | `pnpm build` | aprovado |
| Login único | GET `/api/ejc-sso/start` no 3114 | **HTTP 503 — bloqueio** |
| Rotas privadas JuridIA | `/api/auth/me` sem sessão | 401 correto |
| Local LLM CPU / Ollama `qwen3:4b-instruct` | 2 requisições sintéticas sem dados reais | **timeout com 50 s e 22 s; bloqueio funcional** |
| CI GitHub Actions PR | run `38943262510`, 2 jobs de qualidade | **failure antes de iniciar etapas**, 0 steps; provável problema de executor/configuração, causa ainda não demonstrada |
| Atlas legacy | `/ ` em `3010` | HTTP 200; apenas disponibilidade |

O adaptador de IA local sempre usa `http://127.0.0.1:11434/api/chat`, não chama Z.ai nas quatro rotas modificadas e possui timeout limitado para não prender requisições indefinidamente. A resposta *não* foi homologada com o modelo real e isso impede divulgar a função como operacional.

## Backups e integridade

- SQLite homologação: backup consistente usando API `sqlite3.Connection.backup`, salvo no checkout isolado `.audit-backup/juridia-stage-pre-promotion-20261016.sqlite`, permissões `0600`.
- SHA-256: `ece50e29837ea0a08a5190ab30fb793ae232cce5c0e0c37fff4bdfc7c7931b73`.
- `PRAGMA integrity_check=ok` no banco original e no backup, contagens idênticas: 90 `SkillVersion`, 0 `LegalSource`, 0 `Client`, 0 `Case`, 0 `User`.
- **Não é backup de produção:** as bases legadas e MariaDB precisam de cópias consistentes e restauração verificada antes de qualquer substituição.
- Base EJC antiga possui 2.000 `SkillVersion` rotuladas `approved`, mas sem lastro de aprovador humano verificável. Não importar como válidas.

## Critérios de NÃO publicação em produção

1. Habilitar e homologar SSO OIDC/PKCE com usuário real e permissões verificadas, sem expor segredos.
2. Restaurar e verificar backups separados de SQLite produção, MariaDB produção, documentos e Nginx/systemd, com plano de reversão praticável.
3. Reconferir no MariaDB stage os 284 itens de legado importados para quarentena, decidir fluxo de curadoria humana e evitar migrações duplicadas.
4. Solucionar a inferência local (latência, CPU/swap, concorrência, timeout, qualidade jurídica) ou limitar funcionalidade, sem voltar a enviar fatos não autorizados ao provedor externo.
5. Resolver o bloqueio do CI GitHub Actions e homologar ponta a ponta em navegador, com login, documentos, editor, casos, finanças, rotas e mobile.
6. Confirmar se o domínio canônico está apontando para o backend esperado, ativar TLS/proxy e SSO, com rollback por versão e smoke autenticado pós-corte.

**Integridade operacional:** os serviços Atlas/JuridIA atuais e Atlas legado NÃO foram substituídos nesta execução. Nenhum banco real foi migrado, nenhum usuário ou aprovação foi criado artificialmente e nenhuma credencial foi exibida.
