# Segredos definitivos de produção — VPS (Atlas Forense + JuridIA)

**Data:** 2026-10-07 · **Titular:** Clovis José Soares — OAB/MG 253.274
**Regra de ouro:** nenhum valor de segredo vive no Git, no chat ou em logs. Este
documento define O QUE existe, COMO é gerado e ONDE fica; a execução é do
`deploy/render-env.sh` **na própria VPS**, como root.

## 1. Inventário definitivo

### Atlas Forense — `/etc/atlas-ejc/atlas.env` (`root:atlas`, 0640)

| Variável | Tipo | Geração/valor |
| --- | --- | --- |
| `NODE_ENV` | literal | `production` |
| `PORT` | literal | `3010` (Caddy → `/` em 127.0.0.1:3010) |
| `DATABASE_URL` | fornecida | `mysql://atlas_app:<SENHA_FORTE>@127.0.0.1:3306/atlas_ejc` — senha criada no MariaDB (`ALTER USER`), nunca a senha de root |
| `JWT_SECRET` | **segredo** | `openssl rand -hex 32` (cookie/sessão do Atlas) |
| `SESSION_SECRET` | **segredo** | idem (fallback do cookie SSO — `server/_core/ejc-sso.ts`) |
| `NOTIFICATION_SERVICE_PORT` | literal | `3003` (loopback; rota externa fixa `/socket.io/*`) |
| `NOTIFICATION_INTERNAL_SECRET` | **segredo** | `openssl rand -hex 32` (endpoint `/emit`) |
| `ATLAS_ALLOWED_ORIGINS` | literal | `https://atlas.depaulateixeira.adv.br` (CORS do WebSocket, sem wildcard) |
| `DATAJUD_API_KEY` | fornecida | credencial pública do DataJud/CNJ (operador cadastra) |
| `EJC_SSO_ENABLED` | literal | `true` (ativação da ponte SSO — `docs/ejc-sso-ativacao.md`) |
| `EJC_OIDC_ISSUER` | literal | issuer HTTPS do IdP do EJC (ex.: `https://sso.<dominio>/api/auth/oidc`) |
| `EJC_OIDC_CLIENT_ID` | literal | `atlas-forense` |
| `EJC_OIDC_CLIENT_SECRET` | **segredo** | `openssl rand -hex 32` — **o MESMO valor nos dois apps** (cliente OIDC único) |
| `ATLAS_BRAIN_API_TOKEN` | **segredo** | `openssl rand -hex 32` (>= 32 chars) — **o MESMO valor nos dois apps** (API interna Cérebro ↔ Atlas; sem ele a API responde 503) |
| `EJC_SSO_REDIRECT_URI` | opcional | deriva do Host se ausente |

**Intencionalmente AUSENTES na VPS:** `OAUTH_SERVER_URL`, `OWNER_OPEN_ID`,
`VITE_APP_ID` (OAuth/Manus permanece desabilitado — `docs/publicacao-vps.md`).

### JuridIA (EJC) — `/etc/juridia/juridia.env` (`root:juridia`, 0640)

| Variável | Tipo | Geração/valor |
| --- | --- | --- |
| `NODE_ENV` | literal | `production` |
| `PORT` | literal | `3005` (porta fixa do JuridIA — ver contrato do bot) |
| `DATABASE_URL` | fornecida | SQLite: `file:/opt/juridia/data/juridia.db` (fora do diretório do app) |
| `JURIDIA_SESSION_SECRET` | **segredo** | `openssl rand -hex 32` — sem ela, login e rotas protegidas ficam 503 (fail-closed) |
| `JURIDIA_OIDC_ISSUER` | literal | **idêntico** ao `EJC_OIDC_ISSUER` do Atlas |
| `EJC_OIDC_CLIENT_ID` | literal | `atlas-forense` |
| `EJC_OIDC_CLIENT_SECRET` | **segredo** | **idêntico** ao do Atlas (espelhado pelo script) |
| `ATLAS_BRAIN_API_TOKEN` | **segredo** | **idêntico** ao do Atlas (espelhado pelo script) |
| `ATLAS_API_URL` | literal | `http://127.0.0.1:3010` (loopback; HTTPS obrigatório fora dela) |
| `EJC_OIDC_REDIRECT_URIS` | literal | `https://atlas.depaulateixeira.adv.br/api/ejc-sso/callback` (allowlist exata) |
| `EJC_ADMIN_EMAIL/PASSWORD/NAME` | opcional | somente para `scripts/seed-admin.ts` (uma vez, depois remover do env) |

**PROIBIDO em produção:** `EJC_SSO_DEV_ALLOW_LOCAL=1` — o `--check` sinaliza e o
código já recusa (só vale com `NODE_ENV != production`).

## 2. Execução na VPS

```bash
# ajuste os domínios reais antes, se necessário:
sudo ATLAS_PUBLIC_URL="https://atlas.depaulateixeira.adv.br" \
     EJC_ISSUER="https://sso.<dominio-do-ejc>/api/auth/oidc" \
     bash deploy/render-env.sh --check     # auditoria (não altera nada)

sudo ATLAS_PUBLIC_URL="..." EJC_ISSUER="..." \
     bash deploy/render-env.sh --render    # gera o que falta (0640, backup 0600)
```

- O script **nunca imprime valores** — só nomes e status; backup `.bak.<epoch>`
  do arquivo anterior é criado com permissão 0600.
- Segredos fortes existentes não são sobrescritos (idempotente).
- `DATABASE_URL` e `DATAJUD_API_KEY` são fornecidas pelo operador (não geradas).

## 3. Ativação e verificação

```bash
sudo systemctl restart atlas-ejc          # Atlas 3010 + notificações 3003
sudo systemctl restart <servico-juridia>  # JuridIA 3005
curl -fsS http://127.0.0.1:3010/healthz   # "ok"
curl -fsS http://127.0.0.1:3005/api/auth/me   # 401 esperado (sem sessão)
node apps/juridia/scripts/contract-check.mjs http://127.0.0.1:3005   # matriz de rotas
# SSO: GET https://atlas.depaulateixeira.adv.br/api/ejc-sso/start → 302 ao IdP
```

## 4. Rotação

- **Trimestral ou por suspeita** (política sugerida): regenerar com
  `--render --force JWT_SECRET` etc., reiniciar os serviços.
- **`EJC_OIDC_CLIENT_SECRET`**: regenerar e espelhar nos DOIS arquivos na mesma
  janela (o script já espelha automaticamente), reiniciar os dois apps — a
  ponte SSO falha fechada durante a janela entre as trocas.
- **`JURIDIA_SESSION_SECRET`**: rotaciona invalida todas as sessões locais do
  JuridIA (re-login); sessões Atlas não são afetadas.
- **Valores de homologação (sandbox) jamais reutilizar em produção** — estão
  marcados para rotação desde a Task 14 e vivem apenas nos daemons locais.
