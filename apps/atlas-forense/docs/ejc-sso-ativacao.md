# Ativação da ponte SSO Atlas ⇄ EJC (JuridIA)

**Data da aprovação:** 2026-10-07
**Titular que aprovou:** Clovis José Soares — OAB/MG 253.274
**Regra aplicada:** `docs/ejc-sso-preparacao.md` (Authorization Code Flow, issuer HTTPS, discovery validado, cliente registrado, mapeamento de identidade, escopo de sigilo, revisão humana)
**Estado:** implementada e ativada por ambiente — homologada ponta a ponta na sandbox; produção depende exclusivamente das variáveis no servidor.

## 1. Arquitetura

```
Navegador                    Atlas Forense (RP)                JuridIA (IdP)
    │  GET /api/ejc-sso/start     │                                │
    ├──────────────────────────►  │ state assinado (HMAC) + PKCE   │
    │  ◄──302── authorize?client_id&redirect_uri&nonce&challenge ─►│
    │                              │                    /authorize  │
    │  (sem sessão EJC) ◄── /login?next=…  → login scrypt → code   │
    │                              │   code single-use (TTL 120 s)  │
    │  GET /api/ejc-sso/callback?code&state                         │
    ├──────────────────────────►  │ POST /token (client_secret +   │
    │                              │        code_verifier PKCE)     │
    │                              │ ◄── id_token RS256 ────────────│
    │                              │ valida JWKS + iss/aud/exp/nonce│
    │                              │ upsertUser(ejc:<sub>) → sessão │
    │  ◄──302── /  com cookie app_session_id (SameSite=Lax) ────────│
```

Controles (todos verificados em teste e no smoke):

| Controle | Onde |
| --- | --- |
| PKCE S256 (RFC 7636 — vetor oficial validado em teste) | `src/lib/oidc.ts` (JuridIA) |
| Código single-use, TTL 120 s, vinculado a client+redirect+challenge | `OidcAuthCode` |
| `state` assinado HMAC-SHA256 + cookie de dupla submissão (10 min) | `server/_core/ejc-sso.ts` |
| `nonce` validado contra o state (anti-replay) | idem (jose 6 não valida nativamente — comparação explícita) |
| ID Token RS256 validado OFFLINE via JWKS do emissor | `jose.createRemoteJWKSet` |
| Descoberta OIDC validada (issuer deve coincidir) e em cache 5 min | `fetchValidatedDiscovery` |
| Papel: nunca elevado por claim — SSO cria `user`; promoção a admin é manual (etapa 5 da regra) | `ejcSsoCallback` |
| Falha fechada: 503 em qualquer estado ≠ enabled | `getEjcSsoRuntime` |
| Auditoria: início, emissão e criação de sessão logados (sem payload sensível) | `[EJC-SSO]` + AuditEvent do EJC |

## 2. Sequência da regra — cumprimento

1. **Registrar o cliente no provedor EJC** — feito por env: `EJC_OIDC_CLIENT_ID=atlas-forense`, segredo e `EJC_OIDC_REDIRECT_URIS` exatos (produção: `https://atlas.depaulateixeira.adv.br/api/ejc-sso/callback`).
2. **Validar discovery e issuer** — `GET /api/ejc-sso/start` valida o documento e recusa divergência de issuer antes de qualquer redirecionamento.
3. **Configurar ambiente e reiniciar** — sem `EJC_SSO_ENABLED=true` o status permanece `configured_not_activated` (nenhuma rota SSO responde 302).
4. **Login, callback, PKCE, state, nonce e logout implementados e testados** — homologação na sandbox (seção 3).
5. **Promover usuário real a admin após primeira sessão válida** — o SSO cria apenas `user` com `loginMethod="ejc-oidc"`; a promoção no Atlas é operacional (`role=admin` via banco/painel pelo titular), com a claim `role` registrada nos logs para revisão.

## 3. Homologação executada (sandbox, 2026-10-07)

- JuridIA como IdP em `http://localhost:3005` (SQLite local), Atlas em `http://localhost:3000` (MySQL `atlas_ejc`).
- Fluxo completo no navegador: `/api/ejc-sso/start` → `/login?next=…` → login scrypt → authorize → código → callback → **sessão Atlas criada**; `auth.me` retorna `{ openId: "ejc:ops@juridia.local", loginMethod: "ejc-oidc", role: "user" }`.
- Controles negativos verificados: rota confidencial sem sessão → 401; token sem client auth → 401; discovery sem configuração → 503.
- Testes: Atlas 180/180 (inclui 9 novos de `ejc-sso-config`), JuridIA gates 28/28 + auth/oidc 23/23, `tsc` zerado nos dois apps, build de produção OK.

## 4. Ativação em produção (VPS)

No **Atlas** (`/etc/atlas-ejc/atlas.env`, `root:atlas`, `0640` — nunca no Git/chat):

```bash
EJC_SSO_ENABLED=true
EJC_OIDC_ISSUER=https://sso.<dominio-do-ejc>/api/auth/oidc   # HTTPS obrigatório em produção
EJC_OIDC_CLIENT_ID=atlas-forense
EJC_OIDC_CLIENT_SECRET=<segredo fornecido pelo EJC por canal seguro>
# EJC_SSO_REDIRECT_URI=https://atlas.depaulateixeira.adv.br/api/ejc-sso/callback  # opcional; deriva do Host se ausente
```

No **JuridIA** (ambiente protegido do app):

```bash
JURIDIA_SESSION_SECRET=<≥32 caracteres aleatórios>            # sem isso, login e rotas protegidas ficam 503 (fail-closed)
JURIDIA_OIDC_ISSUER=https://sso.<dominio-do-ejc>/api/auth/oidc
EJC_OIDC_CLIENT_ID=atlas-forense
EJC_OIDC_CLIENT_SECRET=<o mesmo segredo>
EJC_OIDC_REDIRECT_URIS=https://atlas.depaulateixeira.adv.br/api/ejc-sso/callback
```

Depois: `systemctl restart atlas-ejc` (e o serviço do EJC), conferir `curl -fsS http://127.0.0.1:<porta>/healthz`, acessar `/api/ejc-sso/start`, concluir o login e **só então** promover o usuário real a admin. Reversão: remover/zerar `EJC_SSO_ENABLED` e reiniciar — o status volta a `configured_not_activated` sem tocar no resto.

## 5. Fronteira de dados (inalterada)

O banco `atlas_ejc` permanece autônomo. A ponte transporta **somente identidade** (`sub` = e-mail, `name`, `role`): nenhum caso, documento, parte, CPF, credencial ou dado processual atravessa o SSO. A regra de confidencialidade do `shared/ejc-integration.ts` continua válida.

## 6. Nota ao responsável do bot (JuridIA Auto-Deploy)

- O IdP legado (HS256 com segredo de dev embutido e `/token` aberto) foi **substituído** — emitir token sem cliente registrado retorna 401. Integrações que dependiam disso precisam migrar ao fluxo de código.
- Schema Prisma ganhou campos/models aditivos (ver docs/auditoria-rotas-juridia.md §5) e o Next requer `@types/node` pré-instalado.
- A matriz de rotas autenticadas desse documento é o contrato mínimo a preservar em futuros merges do bot; divergências devem ser levadas ao titular antes de qualquer reescrita.
