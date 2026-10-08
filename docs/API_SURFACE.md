# Superfície de API — Atlas Jurídico

Estado consolidado: **50 rotas HTTP** no JuridIA.

O inventário canônico é validado automaticamente por:

```bash
bun run routes:audit
```

Taxonomia automatizada atual: **identity 9 · core 10 · knowledge 8 · office 11 · internal 12**.

A regra é simples: rota pública existe apenas quando há consumidor real, integração externa necessária ou fronteira operacional clara. Motores internos devem permanecer em bibliotecas/serviços, não como wrappers HTTP redundantes.

## 1. Identidade e infraestrutura — 9

- `/api/auth/login`
- `/api/auth/logout`
- `/api/auth/me`
- `/api/auth/oidc`
- `/api/auth/oidc/.well-known/openid-configuration`
- `/api/auth/oidc/authorize`
- `/api/auth/oidc/jwks`
- `/api/auth/oidc/token`
- `/api/auth/oidc/verify`

## 2. Produto jurídico principal — 18

- `/api/brain`
- `/api/cases`
- `/api/cases/movements`
- `/api/citations/verify`
- `/api/clients`
- `/api/datajud`
- `/api/documents`
- `/api/evidence/ingest`
- `/api/generate-minuta`
- `/api/generate-minuta/agentic`
- `/api/generate-minuta/stream`
- `/api/legal-sources`
- `/api/molde`
- `/api/skills`
- `/api/skills/versions`
- `/api/stats`
- `/api/suggest`
- `/api/templates`

## 3. Operação do escritório — 10

- `/api/advogados`
- `/api/alertas`
- `/api/audiencias`
- `/api/audit`
- `/api/financeiro`
- `/api/intimacoes`
- `/api/news`
- `/api/prazos`
- `/api/produtividade`
- `/api/proximos`

## 4. Motores e ferramentas internas — 13

- `/api/anonymize`
- `/api/case-analysis`
- `/api/fontes/ibge`
- `/api/fontes/querido-diario`
- `/api/intelligence/graph`
- `/api/intelligence/map`
- `/api/intelligence/review`
- `/api/skills/bootstrap`
- `/api/superior/calculate`
- `/api/superior/check-thesis`
- `/api/superior/proof-matrix`
- `/api/superior/simulate-judge`
- `/api/visual-law`

Essas rotas não pertencem à navegação principal. Devem ser consumidas apenas por fluxos contextuais ou administração.

## Removidos na consolidação

Foram eliminados os wrappers HTTP sem consumidor:

- `/api/julgador-checklist`
- `/api/valor-causa`
- `/api/triagem-documento`
- `/api/vedacao-surpresa`
- `/api/salvaguardas`
- `/api/lexvalida/pipeline`

A lógica determinística correspondente continua nas bibliotecas internas, especialmente `lexvalida_port` e serviços canônicos.

## Regras permanentes

1. Não criar rota nova quando serviço canônico existente puder atender.
2. Geração de documentos passa por `runMinutaPipeline`.
3. Toda chamada de modelo passa por `ai_gateway`.
4. Rotas confidenciais exigem `requireAuth`.
5. Mudanças em rotas devem atualizar este inventário e rodar Graphify.
