# Deploy de produção — Atlas Forense

Este projeto **não usa GitHub Actions**. O deploy oficial é feito diretamente na VPS, com gate local, backup obrigatório e rollback por symlink.

## Pré-requisitos da VPS

- Ubuntu com `git`, `node >= 22`, `corepack`, `curl`, `mysqldump`, `gzip`, `sha256sum`, `nginx` e `systemd`;
- usuário de serviço `atlas`;
- `/etc/atlas-forense/atlas.env` com permissões restritas;
- `NODE_ENV=production`;
- `HOST=127.0.0.1`;
- `PORT=3010`;
- `DATABASE_URL` válido;
- `JWT_SECRET` com no mínimo 64 caracteres;
- OIDC configurado quando a administração autenticada for utilizada.

## Primeira recuperação

O repositório recuperado não possuía `pnpm-lock.yaml`. A primeira ativação deve gerar e revisar o lockfile em ambiente com acesso ao registry. Somente para essa recuperação inicial, o script aceita `ALLOW_LOCK_BOOTSTRAP=1`. Depois disso, o lockfile deve ser versionado e o bootstrap excepcional deve voltar a `0`.

## Instalação do serviço

```bash
sudo install -d -m 0750 -o atlas -g atlas /opt/atlas-forense
sudo install -d -m 0750 /etc/atlas-forense
sudo cp deploy/vps/atlas-forense.service /etc/systemd/system/atlas-forense.service
sudo systemctl daemon-reload
sudo systemctl enable atlas-forense
```

## Deploy

Executar a partir de um checkout confiável do repositório:

```bash
sudo ALLOW_LOCK_BOOTSTRAP=1 bash deploy/vps/deploy.sh
```

O script executa, nesta ordem:

1. clone isolado da release;
2. validação das variáveis críticas;
3. `verify-release` (`install --frozen-lockfile`, `check`, `test`, `build`);
4. `db:preflight`;
5. backup MySQL comprimido + SHA-256;
6. migrations;
7. troca atômica do symlink `/opt/atlas-forense/current`;
8. restart do serviço;
9. healthcheck local;
10. rollback automático do symlink se o serviço/healthcheck falhar.

## Troca de tráfego

Somente depois do healthcheck local aprovado:

```bash
sudo cp deploy/vps/nginx-atlas.conf /etc/nginx/sites-available/atlas-forense
sudo ln -sfn /etc/nginx/sites-available/atlas-forense /etc/nginx/sites-enabled/atlas-forense
sudo nginx -t
sudo systemctl reload nginx
curl -fsS https://ejc.depaulateixeira.adv.br/healthz
```

Resposta esperada:

```json
{"service":"atlas-forense","status":"ok"}
```

## Rollback manual

Listar releases:

```bash
ls -lah /opt/atlas-forense/releases
readlink -f /opt/atlas-forense/current
```

Apontar para a release anterior e reiniciar:

```bash
sudo ln -sfn /opt/atlas-forense/releases/<RELEASE_ANTERIOR> /opt/atlas-forense/current
sudo systemctl restart atlas-forense
curl -fsS http://127.0.0.1:3010/healthz
```

Rollback do banco deve usar o backup correspondente e **não deve ser feito automaticamente** sem verificar se a migration é reversível e se houve gravações posteriores.
