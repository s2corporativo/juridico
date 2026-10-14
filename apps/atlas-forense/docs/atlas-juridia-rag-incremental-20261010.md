# Atlas Forense → JuridIA: implementação incremental auditável

Data de revisão: 2026-10-10. Base de trabalho: `atlas-forense`, commit `1a07ecc5e6821bbc266dd081325eea9e003a8a43`.

## Estado desta branch (escopo controlado)

Esta branch contém somente **fundação de descoberta CKAN** e testes. Não ativa jobs, não altera schema, não coleta arquivo em texto integral, não publica conhecimento no JuridIA e não faz deploy.

- `server/stj-ckan-incremental.ts`: pagina `package_search` usando `start`/`rows`, limitado a no máximo 10 páginas de 100 datasets, valida respostas, expõe recursos e licenças como **metadados não verificados** e calcula `metadataFingerprint`.
- `server/stj-ckan-incremental.test.ts`: casos de paginação, alteração de metadados, licença ausente, URL sem HTTPS, resposta inválida e HTTP 429.
- Hash dos metadados **não equivale ao SHA-256 dos bytes do documento**; nenhuma decisão recebe automaticamente `approved`.

## Constatações de arquitetura

1. Há API protegida `/api/internal/brain/*`, consumidor em `apps/juridia/src/lib/atlas_client.ts`, e fila `editorial_updates`. Reutilizar isso antes de criar novas rotas.
2. `editorial_updates` usa índice exclusivo `(sourceKey, externalKey)`. Em `enqueueEditorialCandidates`, itens anteriores são ignorados sem verificar novo `contentHash`. **Não usar essa tabela como histórico de versões**, sem nova estrutura/migração.
3. `editorial_update_runs` reutiliza `runKey` com `onDuplicateKeyUpdate` para voltar a `running`. Isso **não é um lock seguro** entre instâncias. Usar transação/lock no banco com expiração e recuperação.
4. Conector de jurisprudência já consulta CKAN, porém normaliza datasets como se fossem `JurisItem`. Dataset não é acórdão. Corrigir essa semântica antes de promover qualquer conteúdo a citação.
5. `editorial-scheduled.ts` já tem rota autenticada ligada a `sdk.authenticateRequest` e `taskUid`. Verificar o scheduler existente e como obter credencial sem alterar a política de autenticação.
6. `setInterval` em `djen.ts` e `jurisprudencia.ts` não garante execução diária única. Substituir somente depois de provar que o scheduler nativo funciona.
7. `apps/juridia/prisma/schema.prisma` usa SQLite; comprovar FTS5 disponível em produção antes de criar tabelas virtuais/triggers por migration explícita.

## Etapas propostas após a fundação

### Etapa 1: dados oficiais em modo dry-run

- STJ: consultar datasets alterados e recursos por `id`, `metadata_modified`, licença, `resourceUrl`.
- Revisar licença de cada dataset antes de baixar/processar arquivos. Download posteriormente com limite de bytes, timeout, MIME, SHA-256 real, conferência da origem e proteção contra SSRF.
- DJEN: reutilizar o conector atual, separar coleta editorial pública da sincronização de intimações por OAB. Uma comunicação não é precedente.
- LexML, STF, TJMG, TST: manter como descoberta/manual até comprovação de API autorizada.
- DataJud: **desativado por padrão para uso comercial** até análise do termo e do enquadramento jurídico.

### Etapa 2: migrações aditivas e invariantes

Planejar, testar e revisar migrações MariaDB antes da aplicação:
- `official_source_resources`: fonte, dataset, resource ID, URL oficial, licença e último fingerprint;
- `official_source_resource_versions`: versões imutáveis, hash **do arquivo**, instante, arquivo/caminho protegido e status;
- `official_ingestion_runs`: provedor, cursor, janela, status, erro sanitizado;
- `official_ingestion_locks`: chave por provedor, owner, expiração e recuperação;
- `official_editorial_reviews`: decisão humana versionada, usuário, data, observação.

Não criar tabelas duplicadas de `editorial_updates` se elas puderem ser reutilizadas com chave referencial. Um registro já aprovado nunca muda automaticamente por atualização da fonte.

### Etapa 3: snapshot Atlas → JuridIA

Preferir ampliar a API interna **já autenticada** `/api/internal/brain/` com rotas de leitura `knowledge/snapshot`, `knowledge/items/:id`, `knowledge/health`. Exigir token forte, paginação, `since` monotônico, schema versionado, ETag/hash, somente revisados, política de revogação/superseded e limite de bytes.

JuridIA importa por HTTP autenticado para **seu SQLite**, sem acesso a MariaDB. Em indisponibilidade do Atlas, mantém último snapshot validado e reporta antiguidade. Adotar escrita transacional e posição do cursor somente após conclusão.

### Etapa 4: RAG local

- Migração SQLite aditiva para itens e chunks; FTS5 com BM25, filtros jurídicos e reindexação determinística.
- Embeddings locais são opcionais; o sistema permanece funcional sem eles.
- Toda citação exibe URL oficial, `atlasItemId`, SHA-256 do documento verificado, data e revisão humana.
- Snippet de busca web não vira precedente aprovado; separar os quatro conceitos de confiança e registrar só métricas de consulta sanitizadas.

### Etapa 5: orquestração e homologação

- Scheduler externo persistente, respeitando `REQUIRE_PREDEPLOY_BACKUP=1`, credencial de job e lock no banco.
- Dry-run sem persistência; segunda execução idempotente; falha de um provedor não derruba os demais.
- Suites atuais de Atlas e JuridIA, integração HTTP autenticada, migrações reversíveis, restauração testada, healthchecks e contrato de rotas.
- Deploy apenas com CI verde, backups validados e identificação inequívoca do checkout da VPS. Preservar 3010, 3003 e 3005.

## Bloqueio jurídico: DataJud

A **Portaria CNJ 374/2026**, que alterou a Portaria CNJ 160/2020, expressamente prevê uso não comercial e veda exploração comercial dos dados e derivados. Fontes:
- https://atos.cnj.jus.br/atos/detalhar/6972
- https://atos.cnj.jus.br/atos/detalhar/3453
- https://datajud-wiki.cnj.jus.br/api-publica/termo-uso/

Nenhum job automático DataJud deve ser ligado em produto comercial sem revisão da finalidade e eventual autorização do CNJ.

## Limitação de validação deste trabalho

Não foi executado build completo, migração, coleta real, conexão com bases ou deploy. Os testes novos são unitários com HTTP simulado; o resultado verde exige execução no runner `pnpm test` e `tsc --noEmit`. Não afirmar ingestão diária em produção até um ciclo real auditável.
