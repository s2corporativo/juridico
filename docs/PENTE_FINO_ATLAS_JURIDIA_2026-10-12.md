# Pente-fino técnico — Atlas Forense + JuridIA
**Data:** 12/10/2026  
**Repositório:** `s2corporativo/juridico` • **Branch base:** `atlas-forense`  
**Objetivo:** estabilizar e amadurecer funcionalidades existentes, eliminar resíduos e proteger dados jurídicos sem criar módulos nem destruir dados.

## Diagnóstico resumido

| Dimensão | Achado | Criticidade |
|---|---|---|
| Autorização por recurso | Rotas clientes/casos/documentos tinham consultas e mutações só por ID; cliente novo era atribuído ao usuário fictício `demo@juridia.com.br` | CRÍTICA |
| Superfície remanescente | 60 arquivos de rotas em `apps/juridia/src/app/api`; revisão estática identificou **25 rotas autenticadas com operações DB e sem marcador óbvio de filtro por usuário**. Heurística, NÃO equivalem a 25 vulnerabilidades confirmadas | ALTA / auditoria individual |
| Segurança do IP | `src/lib/api-helpers.ts` usava o primeiro `X-Forwarded-For` sem confiança do proxy | ALTA |
| Financeiro residual | `/api/financeiro`: endpoint de 237 linhas armazenando honorários em `AuditEvent.metadata`; nenhuma chamada à rota identificada na UI. DPT é autoridade financeira | ALTA / inconsistência de escopo |
| Atlas antigo | Serviço `3010` ativo; SQLite 714 documentos e 2.727 chunks, última modificação 09/09/2026 | ALTA / conteúdo desatualizado |
| Novo Atlas editorial | MariaDB staging `3317`: 20 `pending_review` e 284 `legacy_knowledge_review.pending`; **zero fontes editoriais aprovadas para o snapshot** | CRÍTICA para uso como fundamento |
| JuridIA novo | Código unificado e build testado; não há serviço ativo na porta `3005`; porta `3114` também não ativa em produção | BLOQUEIA ACESSO |
| DNS público | `atlas.depaulateixeira.adv.br` atende em infraestrutura externa à VPS auditada; não aponta diretamente para o JuridIA unificado | BLOQUEIA ACESSO |
| Resíduos Atlas | 29 tabelas MySQL, incluindo **7 `office_*`** de operações herdadas, sem equivalência à finalidade exclusiva de inteligência jurídica | MÉDIA |
| PRs legados | #6–#11 ainda abertos; #10 foi reaproveitado parcialmente nos PRs #17 e #18. Evitar merge indiscriminado de branches antigas | MÉDIA |
| Backup | Backup MariaDB antes e após migração restaurado em banco scratch; SQLite legado `integrity_check=ok`, 714 registros. Gate de backup de produção/segredos/deploy separado ainda necessário | PARCIALMENTE VALIDADO |

## Remediações executadas — branches isoladas

### Isolamento por titular — PR #21
- `GET /api/clients` limita a `userId=authUser.uid`, sem cliente demo.
- `PATCH`/`DELETE` de clientes usam updateMany/deleteMany com `id` **e proprietário** na operação atômica.
- Casos: `GET` filtra pelo proprietário de `Client`, `POST` valida `Client.userId`, `PATCH`/`DELETE` aplicam filtro por cliente próprio.
- Documentos: `GET`/`PATCH`/`DELETE` filtram `Document.userId`.
- Helper de IP usa apenas `X-Real-IP` IPv4/IPv6 válido do proxy confiável.
- **E2E com dois usuários e banco sintético**: cada um vê somente 1 cliente, 1 caso e 1 documento próprios. Sete ações com IDs de terceiros retornaram 404.
- TypeScript, ESLint, suíte de testes e build foram aprovados em staging; CI no GitHub e regressão das demais rotas continuam necessários.

### Limpeza financeira — PR #20
- Remoção somente de `/api/financeiro/route.ts`. Não elimina eventos, contratos, tabelas nem registros existentes.
- Não foram encontradas referências `/api/financeiro` na UI do JuridIA.
- Outros serviços ligados a casos, prazos e audiências exigem análise de dependência: **não remover cegamente**.

## Bloqueadores para publicação e para a declaração “100% funcional”

1. **Revisar por recurso as demais rotas que movimentam casos e minutas:** `case-analysis`, `cases/hearings`, `cases/movements`, `prazos`, `audiencias`, `intelligence/graph`, `intelligence/map`, `intelligence/review`, `visual-law`, `brain` e relacionadas. Diferenciar dados compartilhados, conteúdos públicos e sigilo por usuário.
2. **Revisão editorial real:** 284 importados e 20 novas atualizações estão pendentes; nenhuma aprovação automática. Conferir fontes oficiais, vigência, inteiro teor, adequação jurídica e rastreabilidade de revisão.
3. **Provisão dos serviços novos:** Atlas interno 3114, JuridIA interno 3005, MariaDB staging/produção separado, SQLite persistente, segredo de sessão/OIDC e token API com permissões restritas, healthcheck, service/timer e backup restaurável.
4. **Sincronização diária:** o contrato v1 transporta **somente metadados editoriais aprovados**; não é sincronização completa de RAG, inteiro teor ou de jurisprudência citável. A rotina deve permanecer desligada até produção de evidência.
5. **Gate de implantação:** testes de autorização por recurso, sessão única, Next standalone, snapshot/409, páginas, backup/restore de ambos os DBs, upload e documentos, rollback, HTTPS/DNS, logs sem sigilo. Não substituir o Atlas 3010 antes da reconciliação.
6. **Higienização controlada:** revisar 7 tabelas `office_*`, 11 rotas operacionais e PRs #6–#11. Arquivar/refatorar apenas com prova de não uso; **nunca apagar banco**.

## Situação operacional verificada

- `dpt-erp` ativo, health HTTP 200 com banco ok.
- `atlas-juridico` legado ativo, health 714 documentos e 2727 chunks.
- MariaDB `atlas_stage` tem 284 registros de quarentena `pending` e 20 atualizações `pending_review`.
- Novo JuridIA e novo Atlas **não estão publicados** permanentemente; QA local executado com bancos e credenciais fictícios, serviços encerrados depois.
- O código unificado (PRs #17–#19) está na branch principal; esta auditoria e as correções adicionais são a próxima camada de estabilização.

**Critério de aceite:** sem acesso cruzado entre usuários; sem fonte editorial pendente citada como precedente; nenhum dado ou backup perdido; um único login funcional para Atlas + JuridIA; HTTPS e sincronização testados; DPT e Atlas antigo preservados até cutover.
