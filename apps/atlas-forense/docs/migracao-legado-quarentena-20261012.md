# Migração do acervo Atlas legado → Atlas Forense — 12/10/2026

## Situação comprovada e escopo

O legado está ativo em `/opt/atlas-juridico/shared/custom.db`, com 714 documentos e 2.727 chunks. O destino é **exclusivamente** o MariaDB `atlas_stage` em `127.0.0.1:3317`. Não mexer nos serviços Atlas 3010, DPT 3000 ou em seus dados.

| Categoria | Documentos |
|---|---:|
| Documentos legados analisados | 714 |
| Legislação/jurisprudência ativa, não fictícia, conteúdo presente, URL HTTPS válida → quarentena | **284** |
| Registros demonstrativos não importados | 2 |
| Registros em revisão no legado não importados | 20 |
| Outras categorias (peças, modelos, prazos, triagem, ferramentas etc.) não importadas | 407 |
| URL não HTTPS não importada | 1 |

Toda linha importada tem `reviewStatus=pending`, `sourceSha256` e `legacyId` único. A classificação `ATIVO`/qualidade `A` no legado **não equivale à revisão editorial do novo Atlas**.

## Backups e verificações executados

- Backup SQLite consistente `atlas-legacy-before-review-20261012.sqlite`, `PRAGMA integrity_check=ok`, 714 documentos.
- Dump do MariaDB antes da migração `atlas-stage-before-review-20261012.sql.gz`: gzip testado, SHA-256 conferido, restaurado em banco temporário com 20 atualizações editoriais; banco temporário removido.
- Migration Drizzle versionada `0011_legacy_review` aplicada somente ao staging.
- Primeiro import: 284 novos, 0 atualizados, 0 inalterados.
- Segundo import: 0 novos, 0 atualizados, 284 inalterados.
- Dump após a importação `atlas-stage-after-review-20261012.sql.gz`, permissão `0600`; restaurado em banco de teste: **284 registros legados + 20 atualizações editoriais**. Banco temporário removido.
- Os backups de staging são dados jurídicos e devem ser mantidos somente sob controle de acesso estrito e política de retenção; antes de armazenamento externo, aplicar criptografia e verificar restauração.

## Código e garantia de idempotência

- `drizzle/schema.ts`: tabela canônica de quarentena `legacy_knowledge_review` e índices.
- `drizzle/0011_legacy_review.sql`, `meta/0011_snapshot.json`, `meta/_journal.json`: migração versionada.
- `scripts/legacy-import-policy.ts`: política pura, fail-closed.
- `scripts/import-legacy-knowledge.ts`: `dry-run` padrão. `--apply` só aceita URL loopback para `atlas_stage`, variável `ATLAS_IMPORT_STAGING=1` e arquivo de backup com digest SHA-256 correto, recente.
- O comando abre o SQLite original em **readonly**, executa toda a escrita do lote dentro de transação MariaDB, nunca publica fonte aprovada. Se o texto mudar, a revisão volta para pendente.
- O serviço Atlas disponibiliza somente as **contagens** da quarentena via API interna autenticada, sem conteúdo não revisado.
- O JuridIA apresenta “Legado aguardando revisão” separadamente das fontes citáveis.

## Pendências, sem declaração de homologação completa

1. Verificar fonte oficial, vigência, texto integral, relação entre documento e entendimento jurídico e eventuais dados pessoais, com **decisão de revisor humano** documentada.
2. Implantar um fluxo explícito de revisão editorial e autorização; não alterar `reviewStatus` automaticamente.
3. Preparar contrato de exportação para **texto validado** com proveniência, licença, status, versão, trechos e tombstones; V1 sincroniza apenas metadados editoriais já aprovados.
4. Validar produção Atlas Forense e JuridIA com SSO real, observabilidade, snapshot, revisão e gate de citação.
5. Liberar domínio novo somente após rollback e migração do acervo revisada.
