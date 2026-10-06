# Contrato operacional — JuridIA (app gerenciado pelo bot)

**Vigência:** a partir de 2026-10-07 · **Autoridade:** titular Clovis José Soares (OAB/MG 253.274)
**Aplica-se a:** toda execução/rewrite/deploy do app `apps/juridia` pelo JuridIA Auto-Deploy.
**Base técnica:** `apps/atlas-forense/docs/auditoria-rotas-juridia.md` (matriz completa),
`apps/atlas-forense/docs/segredos-producao-vps.md` (segredos), `docs/paridade-minutaia.md` (IA).

## 1. Portas e serviços (fixas, não negociáveis)

| Serviço | Porta | Acesso |
| --- | --- | --- |
| Atlas Forense (Express/tRPC) | 3000 (sandbox) · 3010 (VPS atrás do Caddy) | público via proxy |
| Notificações WebSocket do Atlas | 3003 | **loopback**; externa fixa `/socket.io/*` |
| **JuridIA (Next.js)** | **3005** | sandbox: `next dev -p 3005`; VPS: serviço próprio na 3005, loopback atrás de proxy |
| MySQL do Atlas | 33061 (sandbox) · 3306 (VPS) | loopback |
| JuridIA SQLite | `file:…/juridia.db` (sandbox) · `/opt/juridia/data/juridia.db` (VPS) | arquivo local |

- A porta 3005 é a IDENTIDADE do JuridIA: o Atlas resolve o issuer do SSO a partir dela
  (`EJC_OIDC_ISSUER`/`JURIDIA_OIDC_ISSUER`). Mudar a porta quebra a ponte SSO ponta a ponta.
- Proibido: portas dinâmicas escolhidas pelo usuário (`?XTransformPort=`), proxy reverso
  dinâmico e qualquer exposição além das fixas acima (ver `docs/notificacao-websocket.md`).

## 2. Matriz de rotas — contrato mínimo a preservar

Verificação automatizada após CADA deploy/rewrite (exit 1 = violado):

```bash
node scripts/contract-check.mjs http://127.0.0.1:3005
```

Estado em 2026-10-07 (executado, ÍNTEGRO):

- **Públicas por design (6):** `GET /api/auth/oidc`, `GET /api/auth/oidc/jwks`,
  `GET /api/auth/oidc/.well-known/openid-configuration` (200 ativo / 503 sem configuração —
  caminho EXATO: o discovery vive sob o prefixo `/api/auth/oidc/.well-known/…`),
  `GET /api/fontes/ibge`, `GET /api/fontes/querido-diario`, `GET /api/news`; mais
  `POST /api/auth/login`, `POST /api/auth/logout` (autenticação em si, rate-limited).
- **Somente admin:** `POST/PUT/PATCH/DELETE /api/advogados`,
  `POST/PATCH/DELETE /api/legal-sources`, todos os métodos de `/api/audit`.
- **Autenticadas (43 arquivos):** todo o acervo e IA — incluindo
  `POST /api/generate-minuta` e `POST /api/generate-minuta/stream` (SSE).
- Anônimo em rota confidencial → **401** `{"error":"unauthenticated"}` — comportamento
  testado e obrigatório. Nenhuma rota pode voltar a responder 200 sem sessão.

Regras para o bot:

1. **Preservar os guards** (`requireAuth`/`withAuth` em cada handler confidencial; admin
   nos métodos listados). O guard roda DENTRO do handler — nunca "mover para middleware
   e esquecer handler".
2. **IdP OIDC não rebaixar**: RS256 persistido, Authorization Code Flow + PKCE S256,
   código single-use 120 s, `client_secret_post` timing-safe, papel sempre do registro.
   O antigo `POST /token` aberto (HS256 embutido) não pode retornar em nenhuma forma.
3. **LGPD**: o mapa marcador→PII NUNCA é persistido (`Document.markers === "[]"`);
   reidratação só em memória, na mesma requisição.
4. **Schema Prisma**: campos/models de auth (`passwordHash`, `role`, `lastSignedIn`,
   `OidcKey`, `OidcAuthCode`) são aditivos e obrigatórios. `prisma db push` antes dos testes.
5. **Divergência = parada**: se um rewrite precisar alterar a matriz, o bot deve parar e
   escalar ao titular ANTES do merge.

## 3. Pipeline de IA (paridade MinutaIA) — invariáveis

- Pipeline multi-etapas único em `src/lib/minuta_pipeline.ts` + `src/lib/minuta_run.ts`
  (`runMinutaPipeline`): roteirista → redator → revisor; as rotas JSON e SSE são wrappers.
- `POST /api/generate-minuta/stream`: SSE com eventos `stage`/`draft`/`done`/`error`;
  auth idêntica à rota clássica; header `X-Accel-Buffering: no` já enviado.
- Lote: `moldContent` (minuta-molde aprovada, teto 60k chars) + `batchId` por lote;
  UI em `components/app/batch-panel.tsx` (limite 10 casos; orquestração no cliente é
  decisão deliberada — manter o servidor como fonte de verdade por caso).
- Fallback offline permanece SINALIZADO (`pipeline.degraded`, status `draft`).

## 4. Ambiente e segredos

- Envs de produção definitivas: `apps/atlas-forense/docs/segredos-producao-vps.md`;
  execução pelo `apps/atlas-forense/deploy/render-env.sh` na VPS (nunca valores no Git/chat).
- `JURIDIA_SESSION_SECRET` ≥ 32 chars: sem ela login/rotas protegidas = 503 fail-closed.
- `EJC_SSO_DEV_ALLOW_LOCAL` **proibido** em produção (o `--check` do script sinaliza).
- `@types/node` pré-instalado (Next 16 tenta npm install no primeiro boot e trava sem npm).
- Seeds obrigatórios após reset de banco: `scripts/seed-templates.ts` (sem ele o gerador
  é inutilizável), `scripts/seed-legal-sources.ts` (RAG/Citation Gate) e
  `scripts/seed-admin.ts` (apenas com identidade real do escritório).

## 5. Portões de validação (todos verdes = deploy aceito)

| Portão | Comando |
| --- | --- |
| Tipo | `./node_modules/.bin/tsc --noEmit` (0 erros; `ignoreBuildErrors` é proibido) |
| Gates de segurança | `bun test tests/gates.test.ts` (28) |
| Auth/OIDC | `bun test tests/auth-oidc.test.ts` (23) |
| Pipeline | `bun test tests/minuta-pipeline.test.ts` (10) + `bun test tests/paginate.test.ts` (9) |
| Build | `next build` (exit 0) |
| Contrato de rotas | `node scripts/contract-check.mjs http://127.0.0.1:3005` (exit 0) |

## 6. Coordenação com o Atlas Forense

- O Atlas é o relying party do SSO (mesmo `EJC_OIDC_CLIENT_ID/SECRET` nos dois apps);
  alterar client/redirect/issuer deve ser feito nos DOIS lados na mesma janela.
- O atalho "Minutas · JuridIA" do Atlas aparece somente com a ponte `enabled` (fail-closed).
- Fronteira de dados inalterada: o SSO transporta SOMENTE identidade — nenhum dado
  processual ou documento atravessa a ponte (`shared/ejc-integration.ts`).
