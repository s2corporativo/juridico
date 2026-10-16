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


## Remediações adicionais concluídas — 12/10/2026

**Integração na branch principal:**
- PR #21 — cliente, caso e documento com controle por proprietário; `clientIp` não confia em `X-Forwarded-For` falsificável. E2E: duas contas, seis leituras próprias, sete mutações de outros usuários rejeitadas com 404; quatro testes específicos de IP aprovados.
- PR #20 — remove a API financeira residual de 237 linhas; dados antigos e `AuditEvent` preservados. Build limpo, TS, lint e suíte JuridIA aprovados.
- PR #22 — remove `scripts/clean-fictitious.ts`, que apagaria **todos** os documentos, casos, logs e quase todos os usuários, independentemente de serem dados reais. Não executou o script. Elimina atribuição a `demo@juridia.com.br` em análises e auditoria, usa usuário real nos dados/indicadores, remove números de marketing fictícios e perfis/OAB simulados; migração do perfil persistido limpa apenas valores conhecidos do demo. Testes de migração 3/3, TS, ESLint, suíte e build aprovados.
- PR #23 — adiciona workflow GitHub Actions com jobs independentes para TypeScript, ESLint, testes e build de Atlas/JuridIA. **Validação de YAML local aprovada; primeiro resultado de CI remoto ainda não confirmado.**

**Achados residuais críticos:**
- `BrainAnalysis`, `CaseDeadline`, `GraphNode` e `IntelligenceSnapshot` ainda utilizam `caseId` sem uma vinculação de proprietário em seus modelos; o valor legado `default-case` é compartilhável. Necessária autorização por caso e segregação entre advogados antes de publicar.
- `case-analysis` foi corrigida para titularidade via `userId`, mas rotas satélites `brain`, `intelligence/*`, `prazos`, `audiencias`, `visual-law` exigem auditoria dirigida.
- Atlas Forense segue com **zero** metadados editoriais aprovados. Não afirmar que o RAG jurídico completo esteja atualizado/sincronizado apenas pela existência de 284 registros `pending`.
- Os novos serviços (JuridIA 3005 e Atlas 3114) continuam sem publicação permanente. O domínio público permanece independente do release da VPS.
- O script de sincronização diária depende de atestação recente de backup, mas não há implantação homologada do emissor dessa atestação nem dos timers.

**Controle de publicação:** não promover deploy até CI remoto, autorização por recurso das rotas satélites, revisão das fontes, provisão de chaves, teste de restauração e plano de reversão. Manter DPT e Atlas legado ativos enquanto o novo produto não estiver homologado.


### Resultado real do primeiro GitHub Actions (bloqueio)

- Workflow `Atlas e JuridIA — qualidade e segurança` foi adicionado à `main` pelo PR #23.
- Execução do commit do PR `6a30edba27628fa2ac44d209fa2ba94f1eb04727`: run **38302329096**, `conclusion=failure` nos dois jobs Atlas e JuridIA.
- A API forneceu **steps ausentes** e `logs_url=null`; tentativa de obter os logs retornou 404. Não é possível determinar por essa evidência se foi falha de runner/permissão/billing ou do projeto. **Não afirmar CI verde.**
- Os testes e builds locais com dependências reproduzíveis foram aprovados, mas não substituem aprovação de runner remoto. Conferir a página do run no GitHub, configurações de Actions, permissão de runners e políticas/billing antes de retomar publicação.
- Nenhum deploy foi disparado ou autorizado pelo workflow.

## Atualização de consolidação — 15/10/2026

- O clone isolado da branch padrão foi auditado no SHA `1b978de76ae8adac5d1c16edde779ca1fdf500f3`.
- Inventário: 579 arquivos versionados; 65 `route.ts` sob a API JuridIA. A busca textual sinalizou 30 rotas sem chamada literal identificada; **não é prova de desuso** e nenhuma dessas rotas foi excluída.
- Hash SHA-256 dos arquivos pequenos rastreados encontrou somente três `.gitkeep` vazios idênticos, mantidos por terem finalidades distintas; nenhuma duplicação significativa de arquivos de código foi confirmada.
- Excluídos do checkout quatro fragmentos Python órfãos em `app/` e `alembic/`: importavam componentes FastAPI/EJC ausentes, não eram referenciados por nenhum outro arquivo versionado nem pertenciam aos dois runtimes Node. Seus conteúdos continuam recuperáveis no histórico Git. **Não houve exclusão de banco, migração aplicada, backup, conteúdo de produção ou logs.**
- README alinhado ao OIDC real RS256/PKCE; a documentação anterior mencionava incorretamente HS256/JWT secret compartilhado.
- As PRs #6–#11 e #27 foram encerradas sem merge e precisam ser reaproveitadas seletivamente, não por integração automática de branch antiga. PRs #2 e #5 também constam encerradas sem merge, porém seus refs remotos estão indisponíveis.
- VPS auditada: Atlas legado em serviço; Atlas atualizado em homologação e JuridIA em homologação, em SHAs distintos e anteriores ao HEAD do GitHub. Publicação pública requer validação das duas aplicações, fontes jurídicas aprovadas, backup/restauração, autenticação e rollback; não confundir branch atualizada com deploy concluído.
- A fase de limpeza elimina somente resíduos cuja ausência de uso foi demonstrada. As rotas operacionais e documentos históricos permanecem preservados quando o vínculo funcional ainda não pode ser descartado.
