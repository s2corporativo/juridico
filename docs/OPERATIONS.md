# Operação do Atlas Jurídico

## Serviços

- **Atlas Data**: porta interna 3010.
- **Realtime**: porta interna 3003, somente loopback.
- **JuridIA**: porta interna 3005.
- O proxy reverso publica apenas os hosts e rotas necessárias.

## Identidade

O JuridIA atua como Identity Provider OIDC do Atlas.

```text
ATLAS_SSO_ENABLED=true
JURIDIA_APP_URL=https://juridia.depaulateixeira.adv.br
JURIDIA_OIDC_ISSUER=https://juridia.depaulateixeira.adv.br/api/auth/oidc
ATLAS_OIDC_CLIENT_ID=atlas-juridico
ATLAS_OIDC_CLIENT_SECRET=<segredo-compartilhado>
ATLAS_OIDC_REDIRECT_URIS=https://atlas.depaulateixeira.adv.br/api/sso/callback
```

## Segredos

Segredos reais não entram no Git. Use arquivos de ambiente com permissão restrita no servidor. O script `apps/atlas-forense/deploy/render-env.sh` gera apenas valores que podem ser gerados localmente e nunca imprime segredos.

## Validação antes de publicar

```bash
cd apps/atlas-forense
pnpm install --frozen-lockfile
pnpm check
pnpm test -- --run
pnpm build

cd ../juridia
bun install --frozen-lockfile
bun run db:generate
bun x tsc --noEmit
bun test
bun run build
```

## Mapa arquitetural

```bash
./scripts/architecture-map.sh
graphify affected "runMinutaPipeline" --depth 3
graphify affected "requireAuth" --depth 3
```

O grafo completo é artefato local de engenharia e não deve ser servido pelo frontend.
