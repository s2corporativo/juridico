# Atlas → JuridIA: relatório de execução e homologação isolada (10/10/2026)

## Escopo implantado no código

- **FTS5/BM25** sobre as próprias tabelas `LegalSource` e `KnowledgeChunk` do SQLite existente do JuridIA; atualização por triggers de INSERT/UPDATE/DELETE, sem replicar documentos em novo banco. Resultados dos chunks excluem documentos fictícios, inativos ou não vigentes.
- **Busca do Cérebro**: o `ragSearch` passa a usar BM25 quando `JURIDIA_KNOWLEDGE_DB_PATH` indica SQLite preparado, preservando o TF-IDF quando o índice não estiver disponível. No fluxo de legislação, somente fontes revisadas com URL oficial são promovidas.
- **Ollama opcional**: `nomic-embed-text:latest` exclusivamente em `127.0.0.1:11434`. Embeddings nos campos já existentes do `LegalSource` e `KnowledgeChunk`; reordenação local de candidatos BM25 mediante `JURIDIA_USE_LOCAL_EMBEDDINGS=true`, com fallback automático para BM25.
- **Snapshot Atlas → JuridIA**: download de todas as páginas com versão fixa, validação do SHA-256 do conjunto, aprovação editorial e origem oficial. Atualização transacional da cache `AtlasDiscoveryCache`, sem tocar nas tabelas do Atlas nem classificar metadados DJEN/CKAN como precedentes.
- **CLI controlada** `scripts/knowledge-maintenance.ts index|embed|sync`, exigindo `JURIDIA_KNOWLEDGE_DB_PATH` e `JURIDIA_DB_BACKUP_VERIFIED=yes`. A confirmação da variável **não substitui** uma cópia de backup efetivamente testada.
- **Estabilidade**: removidos `db:push --accept-data-loss` e atalho `db:reset` do `package.json`; LexValida adia criação do SDK até uso e mantém contagem de tokens por requisição, não global.

## Comprovação realizada diretamente na VPS

1. Cópia íntegra do SQLite original criada em `/opt/atlas-juridico/staging/juridia-fts-homologation.db`. O banco original permanece intacto.
2. No banco de cópia, FTS5 indexou **3.436 entradas**; `PRAGMA integrity_check` retornou `ok`. Consultas com BM25 retornaram registros revisados.
3. Modelo Ollama local existente foi confirmado e gerou vetor de **768 dimensões** para texto genérico. A gravação inicial excedeu timeout; após correção, um vetor foi persistido na cópia de homologação.
4. Busca `ragSearch` foi executada na cópia, com `JURIDIA_USE_LOCAL_EMBEDDINGS=true`, retornando fonte com URL oficial.
5. **7 testes novos / 32 expectativas** passaram, `tsc --noEmit` passou.
6. `prisma generate` passou, sem `prisma db push` e sem migrações no banco original.
7. O **Next.js build passou** na primeira etapa após corrigir a inicialização prematura do LexValida; **o build do commit final precisa ser repetido**, pois a última chamada da ferramenta foi bloqueada por segurança. Não considerar este gate aprovado.
8. Atlas em staging: MariaDB 11.4 dedicado, exclusivo de loopback na porta 3317, com 11 migrações aplicadas. Atlas temporário porta 3114: health 200, fontes tRPC 200, snapshot/health internos autenticados 200, snapshot sem token 401.
9. Teste ponta a ponta inseriu **1 registro de teste editorial aprovado** no MariaDB isolado; o JuridIA importou 1 registro, depois a exclusão e nova sincronização reduziram a cache a 0. O teste foi limpo de ambas as bases e SQLite permaneceu íntegro.
10. O Atlas legado em 3010 e as notificações do DPT em 3003 não foram alterados ou reiniciados.

## Pendências reais antes de promover a produção

- **Não substituir o Atlas legado** por banco novo vazio. Localizar e validar a migração/consolidação do acervo existente e executar backup restaurável de todos os bancos envolvidos.
- Executar `next build` no commit de publicação final e smoke do JuridIA como serviço com autenticação e API de produção configuradas.
- Configurar serviço dedicado do JuridIA (porta e env validados), e Atlas novo com porta e Nginx de destino definidos, verificando rollback.
- Ligar agendamento do STJ e importação JuridIA apenas depois da homologação. Os modelos de serviço/timer ainda não estão ativos.
- DJEN/Comunica e a rota de cadernos oficiais retornam HTTP 403 na VPS. Não contornar bloqueio: registrar falha e manter STJ independente. DataJud permanece desativado até revisão dos termos.
- O Woodpecker já está disponível na VPS; pipelines de deploy automatizado ainda **não foram vinculados** a estes releases. GitHub permanece repositório-mestre, sem dependência do GitHub Actions.

## Operação (apenas com backup comprovado)

```bash
cd apps/juridia
# Use caminho ABSOLUTO do banco exclusivo do JuridIA; não reutilize o banco do Atlas.
export JURIDIA_KNOWLEDGE_DB_PATH=/caminho/validado/juridia.db
export JURIDIA_DB_BACKUP_VERIFIED=yes
bun scripts/knowledge-maintenance.ts index
# O modo embed exige Ollama local e funciona em lotes de até 5 por chamada.
bun scripts/knowledge-maintenance.ts embed
# sync requer ATLAS_API_URL e ATLAS_BRAIN_API_TOKEN, usando somente HTTPS ou loopback.
bun scripts/knowledge-maintenance.ts sync
```

**Publicação:** branch de desenvolvimento, sem mudança de symlink ativo, proxy público, certificado, serviço do DPT ou bases originais. A etapa de homologação do código não deve ser confundida com a publicação real.
