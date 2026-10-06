# Auditoria de rotas e fluxos — JuridIA (EJC)

**Data:** 2026-10-07 · **Executada por:** sessão de engenharia Atlas Forense, a pedido do titular (Clovis José Soares, OAB/MG 253.274)
**Escopo:** todas as rotas HTTP do app `apps/juridia` (Next.js 16) + fluxos de navegação, com correção da autenticação por rota.

## 1. Estado encontrado (antes da auditoria)

- **55 rotas API, nenhuma autenticada.** Todo o acervo (casos, clientes, documentos, prazos, audiências, financeiro, minutas, auditoria) respondia a qualquer chamador anônimo — a "postura pré-existente do JuridIA" reportada na Task 12.
- **Falha crítica no IdP OIDC legado:** `POST /api/auth/oidc/token` emitia JWT válido (incluindo papel `admin`) para qualquer e-mail informado, sem autenticação de cliente obrigatória (o `X-API-Token` era opcional quando a variável não estava configurada) e com segredo HS256 de desenvolvimento embutido no código como fallback. Qualquer pessoa com acesso à rede poderia fabricar identidade para a ponte SSO.
- Login client-side simulado (`auth-dialog.tsx` gravava o usuário apenas no Zustand) — nenhum segredo, nenhuma sessão real.
- Sem rate limiting, sem cookie de sessão assinado, sem mapeamento de identidade no servidor.

## 2. Controles implementados

| Controle | Implementação |
| --- | --- |
| Senha | scrypt (N=16384, salt aleatório por usuário), comparação `timingSafeEqual` (`src/lib/auth.ts`) |
| Sessão local | cookie HttpOnly `ejc_session`, payload HMAC-SHA256, TTL 7 dias, `SameSite=Lax`, `Secure` automático atrás de HTTPS |
| Fail-closed | sem `JURIDIA_SESSION_SECRET` em produção, login e rotas protegidas retornam 503 — nunca segredo padrão |
| Guards de rota | `requireAuth(req, { admin })` aplicado dentro de cada handler confidencial (43 arquivos); 401/403 centralizados |
| Rate limit | login: 8 tentativas/min por IP (memória; documento recomenda store externo em multi-instância) |
| IdP OIDC | RS256 (chave 2048 gerada uma única vez, persistida em `OidcKey`), JWKS público real, Authorization Code Flow + PKCE S256, código single-use com TTL 120 s |
| Cliente OIDC | registrado por env (`EJC_OIDC_CLIENT_ID/SECRET/REDIRECT_URIS`), `redirect_uri` com allowlist exata, `client_secret_post` obrigatório (timing-safe) |
| Papel | sempre lido do registro do usuário autenticado; nunca aceito do chamador; allowlist `admin/advogado/user/promotor/juiz` |
| Auditoria | `login_success`, `login_failed`, `oidc_authorize`, `oidc_token_issued` em `AuditEvent` |
| UI | página `/login` real com anti open-redirect (mesma origem apenas); `auth-dialog.tsx` usa a API real |

## 3. Matriz de rotas (depois da auditoria)

### Públicas por design (6)

| Rota | Justificativa |
| --- | --- |
| `POST /api/auth/login` · `POST /api/auth/logout` · `GET /api/auth/me` | autenticação em si (rate-limited) |
| `GET /api/auth/oidc` · `/.well-known/openid-configuration` | discovery OIDC (503 sem configuração) |
| `GET /api/auth/oidc/jwks` | chave pública do IdP |
| `GET /api/fontes/ibge` · `GET /api/fontes/querido-diario` | dados públicos externos, sem dado do escritório |
| `GET /api/news` | conteúdo público editorial |

> Revisão 2026-10-07 (refatoração/paridade MinutaIA): `GET /api/skills` e `GET /api/legal-sources`
> deixaram de ser públicos — skills são conteúdo proprietário e a base curada alimenta o
> Citation Gate; `POST/PATCH/DELETE /api/legal-sources` passaram a exigir `role=admin`.
> O stub `GET /api` ("Hello, world!") foi removido.

### Somente admin (2 arquivos)

| Rota | Métodos |
| --- | --- |
| `/api/advogados` | `POST`/`PUT`/`PATCH`/`DELETE` exigem `role=admin`; `GET` autenticado |
| `/api/audit` | todos os métodos exigem `role=admin` (trilha de auditoria) |
| `/api/legal-sources` | `POST`/`PATCH`/`DELETE` exigem `role=admin` (base curada do Citation Gate); `GET` autenticado |

### Autenticadas (43 arquivos — todo o acervo e IA)

`alertas, anonymize, assistente, audiencias, brain, calculadora-juridica, case-analysis, cases, cases/hearings, cases/movements, caso-mapa, citations/verify, clients, datajud, documents, financeiro, generate-minuta, grafo, intelligence/graph, intelligence/map, intelligence/review, intimacoes, julgador-checklist, lexvalida/pipeline, molde, prazos, produtividade, proximos, salvaguardas, skill-router, stats, suggest, superior/calculate, superior/check-thesis, superior/proof-matrix, superior/simulate-judge, templates, triagem-documento, valor-causa, vedacao-surpresa, visual-law`

Sem sessão válida: **401** (`{"error":"unauthenticated"}`), verificado por smoke.

## 4. Fluxos verificados

1. **Login local**: `/login` → `POST /api/auth/login` → cookie assinado → retorno ao `next` (mesma origem).
2. **SSO do Atlas** (ver docs/ejc-sso-ativacao.md): start → authorize (exige sessão; sem ela, volta ao `/login` preservando o pedido) → código single-use → troca com PKCE → ID Token RS256 → sessão Atlas.
3. **Fluxos de navegação client-side**: `store.ts` agora normaliza tabs legadas (`resolveAppTab`) — navegação para ids consolidados deixou de renderizar tela em branco.

## 5. Observações para o responsável do bot (JuridIA Auto-Deploy)

1. **Schema Prisma**: `User` ganhou `passwordHash`, `role`, `lastSignedIn`; novos models `OidcKey` e `OidcAuthCode` — migração aditiva, `prisma db push` sem perda de dados (executado na sandbox).
2. **Breaking change intencional**: `POST /api/auth/oidc/token` **exige** client_id/client_secret/código/verifier PKCE. Integrantes que emitiam token direto vão receber 401 — é a correção da falha de fabricação de identidade.
3. **Dependência nova esperada**: `@types/node` dev (Next 16 tenta instalá-la no primeiro boot; pré-instalar evita travamento em ambientes sem npm funcional).
4. **Variáveis novas** (definir no ambiente protegido do JuridIA): `JURIDIA_SESSION_SECRET`, `JURIDIA_OIDC_ISSUER`, `EJC_OIDC_CLIENT_ID`, `EJC_OIDC_CLIENT_SECRET`, `EJC_OIDC_REDIRECT_URIS`; opcional `EJC_ADMIN_EMAIL/PASSWORD/NAME` para o seed do administrador (`scripts/seed-admin.ts`).
5. **Admin do JuridIA**: criar apenas com identidade real do escritório; não há seed de demonstração.
6. Se o bot reescrever estes arquivos, a matriz da seção 3 é o contrato mínimo a preservar; divergências devem ser reportadas ao titular antes do merge.
