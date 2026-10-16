# Atlas + JuridIA, esteira oficial gratuita, primeira entrega

Revisão: 2026-10-10. Escopo: STJ CKAN incremental, DJEN metadata-only e snapshot aprovado Atlas → JuridIA.

## O que foi efetivamente implementado

- **STJ CKAN**: paginação por `rows/start` e inspeção de recursos com identificador, licença declarada, datas e SHA-256 de **metadados** (não de arquivo). Candidatos `official_update` com chave versionada por mudança. Nenhuma extração automática de acórdão, ratio ou jurisprudência citável.
- **Fila editorial existente**: usa `editorial_updates` e `editorial_update_runs`, sem tabelas redundantes nem migração. Status padrão permanece `pending_review`; nova versão não altera a aprovação anterior. Seleção de 250 chaves novas por dia para não sobrecarregar MariaDB; backlog é explicitamente `partial` e continua nos dias seguintes.
- **DJEN**: consulta GET somente pública e por tribunal/data anterior em America/Sao_Paulo; testa resposta paginada `items/count`; usa apenas hash do identificador, data e sigla. Nomes, CPF, CNJ do processo, corpo de publicação, HTML e demais informações de pessoas físicas não são persistidos no acervo público. Não converte comunicação em precedente.
- **API Atlas**: `GET /api/internal/brain/knowledge/snapshot`, `/knowledge/items/:id`, `/knowledge/health`. Reutiliza `ATLAS_BRAIN_API_TOKEN` com autenticação por hash comparado em tempo constante. Publica somente `official_update` **aprovado por humano**, origem STJ ou DJEN, URL oficial permitida. `snapshotVersion=v1:<sha256>` é digest de **todo o conjunto aprovado**.
- **JuridIA**: `fetchAtlasKnowledgeSnapshot` faz somente HTTP autenticado, rejeita versão/cursor inválidos e dados que pretendem ser precedente; não acessa banco do Atlas.
- **Agendamento externo**: `deploy/atlas-editorial-daily.timer` e `.service` são exemplos para systemd, **desativados**, usando `EDITORIAL_SCHEDULE_SECRET` de pelo menos 32 caracteres. A rota preserva autenticação do agendador legado (cron SDK) quando não há o token VPS. Não usar `setInterval` como único mecanismo da nova esteira.

## Limites de segurança e governança

1. **Não tratar STJ CKAN como texto integral**. As referências encontradas são datasets/recursos. Hash de metadados não é hash de bytes do PDF/CSV.
2. **Snapshot v1 é completo, não delta**. JuridIA deve baixar todas as páginas com a mesma versão e substituir a cache própria de maneira transacional. Se mudar durante a leitura, rota devolve HTTP 409 e a importação é reiniciada. A camada persistente de importação FTS5 do JuridIA ainda é trabalho posterior.
3. `dataJud` não participa deste job nem do snapshot. A intenção de uso exclusivo interno do escritório **não substitui** a avaliação do termo e da finalidade não comercial. Termos CNJ: https://datajud-wiki.cnj.jus.br/api-publica/termo-uso/ e Portaria CNJ 374/2026.
4. STF/TJMG/TST e LexML continuam em consulta/curadoria, sem scraping massivo ou falsa API.
5. `DJEN` pode retornar 403 conforme região e políticas do provedor. Não rotacionar IP ou contornar restrições. Coleta de um provedor pode falhar sem bloquear o outro.
6. Se a execução terminar `partial`, conferir código `COVERAGE_TRUNCATED_BACKLOG_PENDING` e/ou indisponibilidade do provedor. A API de saúde relata último job concluído, não garante que a biblioteca esteja atualizada.
7. RunKey diário com restrição UNIQUE é lock de **uma execução por dia**. Para refazer uma execução falha do mesmo dia, desenhar recuperação explícita e auditada, não resetar silenciosamente a linha.
8. Links de download externos do CKAN **não são acessados** no coletor v1. Download oficial posterior exige whitelist, checagem de licença, limite de bytes, MIME e SHA-256 dos bytes.
9. Snapshot v1 serve a catálogo e descoberta; dados de `jurisprudence` de aprovação própria não estão exportados neste contrato. Próxima evolução pode integrar textos/ratios validados e controle temporal, sem depender de APIs pagas.

## Dry-run seguro

Na cópia isolada do monorepo, sem `DATABASE_URL`, executar:

```bash
cd apps/atlas-forense
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm build
./node_modules/.bin/tsx scripts/dry-run-public-collectors.ts
```

O script de teste vivo não grava dados nem imprime corpos brutos. Em 10/10/2026 a VPS encontrou muitos recursos do STJ, mas recebeu HTTP 403 no endpoint público do DJEN; **não existe comprovação de DJEN diário operacional nessa VPS**.

No JuridIA:

```bash
cd apps/juridia
bun run tests/atlas-client.test.ts
```

## Ativação em produção: portões obrigatórios

**Não instalar nem iniciar timer enquanto qualquer item estiver pendente.**

- Confirmar o checkout Git real, PR aprovado e commit exato na VPS, sem substituir o Atlas legado ou serviços do DPT.
- Executar backups do MariaDB e SQLite, validar conteúdo e restauração; manter `REQUIRE_PREDEPLOY_BACKUP=1`.
- Verificar URL e portas: hoje `atlas-juridico.service` já usa 3010 e DPT usa 3003. O novo Atlas e o JuridIA devem coexistir ou ter migração planejada e rollback.
- Verificar unit `User=atlas`, `WorkingDirectory`, `EnvironmentFile` e `ExecStart` e adequá-los **aos caminhos existentes** sem mudar porta/segredo por suposição.
- Prover `EDITORIAL_SCHEDULE_SECRET` forte **fora do repositório**, arquivo `/etc/atlas-ejc/atlas.env` com acesso restrito, e validar chamadas autenticadas, 401 sem token, 200 autenticado.
- Resolver o acesso público DJEN legitimamente ou documentar o provedor como indisponível. Reavaliar cobertura e limites.
- Validar CI real, testes completos e smoke da API com dados autorizados; ensaiar rollback antes de disponibilizar job.
- Instalar units e habilitar timer apenas após homologação. Uma execução diária de 250 candidatos pode exigir vários dias para o catálogo inicial.

## Relatório necessário após cada ciclo

Registrar em `editorial_update_runs`: inicio/fim, estado `completed/partial/failed`, candidatos encontrados e novos, falhas sanitizadas. Expor através de `/api/internal/brain/knowledge/health` sob autenticação, sem PII e sem prometer cobertura universal. 
