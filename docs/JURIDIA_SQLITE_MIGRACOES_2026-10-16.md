# Migrações SQLite da JuridIA — implantação controlada

Data da preparação: 16/10/2026. Escopo **exclusivo JuridIA** no monorepo jurídico. Não envolve DPT ERP, Atlas MariaDB nem banco SQLite compartilhado/legado.

## Diagnóstico comprovado

O banco SQLite isolado de homologação `/opt/atlas-juridico/staging/unified/data/juridia-stage.db` possuía 31 tabelas de aplicação, sem `_prisma_migrations`, e apresentava uma divergência em relação ao `prisma/schema.prisma`: 9 tabelas e seus índices não existiam. O SQL aditivo contém **zero comandos DROP**.

As migrações foram geradas pelo Prisma v6.19.3, sem criar o schema manualmente:

1. `20261016000000_juridia_legacy_baseline` — materialização da estrutura de 31 tabelas já existente na homologação (**não executar** em um banco que já tenha essas tabelas).
2. `20261016001000_juridia_complete_schema` — 9 tabelas e índices complementares.

## Ensaios obrigatórios e realizados

- Em uma cópia SQLite da homologação: `prisma migrate resolve --applied 20261016000000_juridia_legacy_baseline`, seguido de `prisma migrate deploy`; `prisma migrate diff` para o schema atual retornou **código 0** (nenhum drift), `PRAGMA integrity_check=ok`, `foreign_key_check` vazio.
- Em um SQLite novo e vazio: `prisma migrate deploy` aplicou as duas migrações e `prisma migrate diff` retornou **código 0**.
- Esses ensaios **não modificaram** o banco ativo da homologação nem qualquer ambiente de produção.

## Procedimento para homologação com 31 tabelas existentes

1. Fixar o SHA da release, bloquear escritas e efetuar backup SQLite consistente; verificar `PRAGMA integrity_check`, `PRAGMA foreign_key_check` e funcionamento de restauração.
2. Confirmar que o banco **não** possui `_prisma_migrations` e que sua estrutura corresponde exatamente ao script de baseline. Abortar se houver qualquer diferença.
3. Utilizar a versão de Prisma fixada no lockfile do monorepo. **Nunca** usar `db push` ou `migrate dev` nesse banco.
4. Com `DATABASE_URL` explicitamente apontando ao SQLite isolado de homologação, executar:
   - `bun x prisma migrate resolve --applied 20261016000000_juridia_legacy_baseline`
   - `bun x prisma migrate deploy`
5. Conferir `migrate status`, `migrate diff --from-url <url-isolada> --to-schema-datamodel prisma/schema.prisma --exit-code` (esperado 0), integridade SQLite, chaves estrangeiras, autenticação, APIs e geração sobre dados sintéticos.
6. Se algum passo falhar, restaurar o backup do SQLite e os arquivos anteriores da release, reiniciar somente `juridia-stage` e verificar login e API.

## Procedimento para banco novo

Executar somente `prisma migrate deploy` num SQLite vazio e verificado, então validar o schema e o serviço.

## Restrições

- A linha de base representa a estrutura **da homologação inspecionada**, não uma afirmação de que todos os outros ambientes têm a mesma estrutura.
- **Nunca** executar `migrate deploy` sobre SQLite legado existente sem primeiro determinar quais migrações devem ser marcadas como aplicadas; isso pode gerar tentativas de criar tabelas já existentes.
- Não aplicar estas migrações ao arquivo legado compartilhado de 2.000 habilidades, nem a bancos do DPT ERP. Não existe confirmação de que tal arquivo seja o banco operacional da JuridIA.
- Alterações de schema não constituem aprovação jurídica das 2.000 habilidades e não substituem testes E2E autenticados.
- Só promover à publicação externa mediante aceite operacional e jurídico, com recuperação comprovada.
