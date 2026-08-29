# Atlas Forense

Plataforma jurídica para **Compêndio**, **Banco Nacional de Teses**, **Jurimetria**, **fontes oficiais**, **curadoria** e **governança**.

Este repositório é uma reconstrução controlada do Atlas após a exclusão do repositório anterior. A reconstrução preserva o desenho funcional registrado no projeto e recupera o snapshot agregado JEC disponível, sem inventar dados ausentes.

## Princípios

- fontes e proveniência visíveis;
- tese validada exige revisão humana cruzada;
- score não é probabilidade de êxito;
- jurimetria exige universo, período, metodologia e cobertura;
- nenhuma informação administrativa sensível atravessa rotas públicas;
- nenhuma credencial é versionada;
- **GitHub Actions não é utilizado** no fluxo do Atlas.

## Stack

- React 19 + Vite 7;
- Express 5;
- tRPC 11;
- Drizzle ORM + MySQL/MariaDB;
- JWT/OIDC;
- TypeScript;
- Vitest.

## Execução local

```bash
corepack enable
pnpm install
cp .env.example .env
pnpm db:migrate
pnpm dev
```

Frontend de desenvolvimento: `http://127.0.0.1:5173`  
Backend: `http://127.0.0.1:3010`

## Gate de release

O projeto não usa GitHub Actions. Antes de merge/deploy:

```bash
node scripts/verify-release.mjs
```

Para mudanças de banco:

```bash
pnpm db:preflight
pnpm db:migrate
```

## Produção

A VPS oficial roda a aplicação atrás de reverse proxy em `127.0.0.1:3010`.

Runbook e artefatos de deploy:

- `docs/production-deploy.md`;
- `deploy/vps/deploy.sh`;
- `deploy/vps/atlas-forense.service`;
- `deploy/vps/nginx-atlas.conf`.

O deploy deve passar por build, preflight e backup antes de migration e troca de tráfego.
