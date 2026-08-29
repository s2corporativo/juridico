# Validação sem GitHub Actions

O Atlas **não utiliza GitHub Actions**.

## Gate obrigatório

No checkout que será publicado:

```bash
node scripts/verify-release.mjs
```

O gate executa `pnpm check`, `pnpm test` e `pnpm build`. A instalação de dependências deve ter sido feita com lockfile revisado e ambiente Node 22.

## Mudanças de banco

1. backup do banco;
2. `pnpm db:preflight`;
3. revisar versão MySQL/MariaDB e suporte a FULLTEXT;
4. `pnpm db:migrate`;
5. se aplicável, `pnpm db:normalize:jurisprudence`;
6. iniciar aplicação;
7. smoke test de `/`, `/compendio`, `/teses`, `/jurimetria/jec`, `/api/health`;
8. verificar rollback.

## Governança de branch

A proteção recomendada não depende de status check do Actions:

- pull request obrigatório;
- bloquear force-push e exclusão;
- conversas resolvidas antes de merge;
- revisão humana para migrations, autenticação, segurança, DataJud e metodologia;
- registrar evidência do gate local/servidor no PR.
