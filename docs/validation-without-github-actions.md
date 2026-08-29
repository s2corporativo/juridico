# Validação sem GitHub Actions

O Atlas Forense não utiliza GitHub Actions.

## Gate obrigatório

Antes de qualquer deploy:

```bash
node scripts/verify-release.mjs
```

Esse gate executa:

1. `pnpm install --frozen-lockfile`;
2. `pnpm check`;
3. `pnpm test`;
4. `pnpm build`.

Para alterações de banco:

```bash
pnpm db:preflight
pnpm db:migrate
```

## Ambiente de produção

O deploy oficial é direto na VPS. O repositório contém:

- `deploy/vps/deploy.sh` — release isolada, gate, preflight, backup, migration, restart, healthcheck e rollback de aplicação;
- `deploy/vps/atlas-forense.service` — unidade systemd;
- `deploy/vps/nginx-atlas.conf` — reverse proxy para `127.0.0.1:3010`;
- `docs/production-deploy.md` — runbook completo.

O endpoint público de saúde deve responder exatamente:

```json
{"service":"atlas-forense","status":"ok"}
```

## Regra de segurança

Nunca aplicar migration antes de:

- backup lógico válido com checksum;
- `check/test/build` aprovados;
- `db:preflight` aprovado;
- confirmação de que o banco alvo é o banco correto;
- rollback de aplicação disponível.

A troca do Nginx deve acontecer somente após o serviço novo responder corretamente em `127.0.0.1:3010`.

## Recuperação de 2026-08-29

O repositório recuperado não continha `pnpm-lock.yaml`. Portanto, a primeira recuperação exige gerar e revisar o lockfile em ambiente com acesso ao registry antes do release definitivo. O bootstrap excepcional permitido pelo script de deploy é apenas para essa recuperação inicial; o lockfile resultante deve ser versionado depois.
