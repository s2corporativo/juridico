# Juridiá dentro do Atlas — arquitetura canônica

**Endereço único:** `https://atlas.depaulateixeira.adv.br`.

- `/`, `/compendio` e demais rotas Atlas: backend Atlas existente, sem alteração.
- `/juridia`, `/juridia/login`, `/juridia/api/*`, `/juridia/_next/*`: Next Juridiá com `basePath=/juridia`.
- Caddy/proxy **não remove** prefixo, pois o Next usa esse `basePath`.
- Login da Juridiá usa cookie `ejc_session` HttpOnly escopado em `/juridia`; as credenciais do Atlas não são reutilizadas como cookie.
- Atlas e Juridiá podem compartilhar login após ativação OIDC: Juridiá atua como IdP, Atlas como cliente (PKCE S256; RS256), sem fundir os bancos ou inventar sessões.
- A URL pública `JURIDIA_PUBLIC_URL` do Atlas passa a ser `https://atlas.depaulateixeira.adv.br/juridia`; issuer `JURIDIA_OIDC_ISSUER` deve ser exatamente `https://atlas.depaulateixeira.adv.br/juridia/api/auth/oidc`, com redirectUri autorizado para `https://atlas.depaulateixeira.adv.br/api/ejc-sso/callback`.
- Mesmo host não equivale a mesma sessão: ambas as aplicações validam autorizações separadamente. A ponte SSO somente será ativada após teste com usuário sintético.
- Remover o pedido anterior de DNS separado. **Não criar** `juridia.depaulateixeira.adv.br`.

## Gate antes de publicação

1. Testes do Next (auth, OIDC, documentação e regras de acesso) + build isolado com prefixo.
2. Testes do Atlas e build da SPA com link **nativo** para `/juridia`, evitando o roteador SPA interceptar.
3. Proxy de QA pode publicar o prefixo em endpoint de homologação isolado, preservando as outras rotas.
4. Confirmar: GET `/juridia` Next HTML; `/juridia/_next/*` recursos 200; `/juridia/api/auth/me` sem cookie = 401; GET `/api/ejc-sso/...` continua Atlas, não Juridiá.
5. Confirmar login, volta ao Atlas, logout e escopos de identidade. Sem SSO homologado, a opção de acesso protegido não deve aparentar login único.
6. Testar domínio público com e sem Cloudflare, backup da configuração e rollback. A rota `/juridia` hoje é uma página interna do Atlas, portanto migrá-la para o Next requer encaminhamento de todo o tráfego público para a versão nova; **a mudança em Caddy da VPS isoladamente pode não atualizar a origem do domínio canônico**.

## Rollback

Guardar configuração original do proxy, release Next anterior e path de serviço. Nunca migrar o banco real por edição de frontend. Nenhuma modificação no certificado A1 do DPT.

## Gate OIDC de origem pública
- O Next.js atrás do proxy pode apresentar `req.nextUrl.origin=http://localhost:3005` e remover `basePath`. No fluxo `/juridia/api/auth/oidc/authorize`, o login e o parâmetro `next` devem ser derivados do `JURIDIA_OIDC_ISSUER` HTTPS, jamais dos headers de origem interna.
- Após configurar SSO na homologação, executar `python3 ops/juridia-in-atlas/preflight-oidc-origin.py https://atlas.13.140.167.153.sslip.io`. O teste precisa confirmar HTTPS, `/juridia/login`, retorno `/juridia/api/auth/oidc/authorize` e manutenção do desafio PKCE.
- Não compartilhar cookies de sessão entre Atlas e Juridiá: IdP mantém cookie HttpOnly `Path=/juridia` e o Atlas valida o código único e cria sua própria sessão com privilégios mínimos.
