# Banco de dados após a reconstrução

O código foi reconstruído em um novo repositório. **Não execute `drizzle/0001_atlas_rebuild.sql` cegamente sobre uma base já existente.**

Fluxo obrigatório:
1. backup consistente do banco;
2. confirmar versão MySQL/MariaDB e suporte a FULLTEXT;
3. executar `pnpm db:preflight`;
4. comparar schema existente com a migration consolidada;
5. aplicar migration em ambiente de teste;
6. executar normalização quantitativa, se aplicável;
7. smoke tests das rotas públicas e administrativas;
8. só depois promover para produção.

A restauração do repositório não restaura automaticamente dados. O snapshot JEC antigo não foi recuperado e não foi substituído por dados inventados.
