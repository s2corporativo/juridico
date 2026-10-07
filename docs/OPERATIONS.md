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

## Release Gate

A validação oficial não depende de GitHub Actions. O commit exato é validado no ambiente de engenharia/VPS antes de qualquer publicação:

```bash
npm run gate:release
```

O gate instala dependências com lockfile congelado, executa TypeScript, testes críticos e builds de produção do Atlas e do JuridIA.

Regra de publicação: somente promover commits que terminem com `RELEASE GATE APROVADO`. GitHub permanece como controle de versão e revisão; indisponibilidade de runner remoto não bloqueia manutenção ou publicação.

## Mapa arquitetural

```bash
./scripts/architecture-map.sh
graphify affected "runMinutaPipeline" --depth 3
graphify affected "requireAuth" --depth 3
```

O grafo completo é artefato local de engenharia e não deve ser servido pelo frontend.
