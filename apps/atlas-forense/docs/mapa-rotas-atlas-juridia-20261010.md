# Mapa de rotas Atlas + JuridIA, auditoria em 10/10/2026

Gerado por varredura somente leitura da branch `feat/atlas-graphify-audit-vps-20261010`. Inventário estático, não comprova endpoints em produção. Grafo completo no relatório Graphify adjacente.

## Atlas Forense

O Atlas usa Express/tRPC, OAuth/SSO e API interna protegida. Namespaces encontrados: `auth`, `sources`, `editorial`, `datajud`, `integration`, `office`, `clients`, `matters`, `attendances`, `comms`, `djen`, `jurisprudencia`, `nationalCensus`, `metropolitan`, `civilConsumer`, `compendium`, `reviewQueue`, `ingestion`.

Endpoints Express inspecionados: `GET /healthz`; `GET /api/internal/brain/compendium/search`, `/jurimetry`, `/knowledge/snapshot`, `/knowledge/items/:id`, `/knowledge/health`; `POST /api/internal/brain/theses`, `/api/scheduled/editorial-daily`; `GET /api/oauth/callback`, `/api/ejc-sso/start`, `/api/ejc-sso/callback`; `POST /api/ejc-sso/logout`; tRPC em `/api/trpc/*`.

## JuridIA

Identificados **59 arquivos de rotas Next.js e 96 métodos HTTP exportados**. O funcionamento exige serviço ativo, credenciais, autenticação e Prisma.

| Rota | Métodos |
|---|---|
| `/api/advogados` | GET, POST, PATCH |
| `/api/alertas` | GET |
| `/api/anonymize` | POST |
| `/api/assistente` | GET, POST |
| `/api/atlas/theses` | POST |
| `/api/audiencias` | GET, POST, PATCH, DELETE |
| `/api/audit` | GET, POST |
| `/api/auth/login` | POST |
| `/api/auth/logout` | POST |
| `/api/auth/me` | GET |
| `/api/auth/oidc/.well-known/openid-configuration` | GET |
| `/api/auth/oidc/authorize` | GET |
| `/api/auth/oidc/jwks` | GET |
| `/api/auth/oidc` | GET |
| `/api/auth/oidc/token` | POST |
| `/api/auth/oidc/verify` | POST |
| `/api/brain` | POST, GET |
| `/api/calculadora-juridica` | POST |
| `/api/case-analysis` | POST, GET |
| `/api/cases/hearings` | GET, POST, PATCH, DELETE |
| `/api/cases/movements` | GET, POST, DELETE |
| `/api/cases` | GET, POST, PATCH, DELETE |
| `/api/caso-mapa` | GET |
| `/api/citations/verify` | POST |
| `/api/clients` | GET, POST, PATCH, DELETE |
| `/api/datajud` | GET, POST |
| `/api/documents` | GET, DELETE, PATCH |
| `/api/financeiro` | GET, POST, PATCH, DELETE |
| `/api/fontes/ibge` | GET |
| `/api/fontes/querido-diario` | GET |
| `/api/generate-minuta` | POST |
| `/api/generate-minuta/stream` | POST |
| `/api/grafo` | GET |
| `/api/intelligence/graph` | GET, POST |
| `/api/intelligence/map` | POST, GET |
| `/api/intelligence/review` | POST |
| `/api/intimacoes` | GET, POST |
| `/api/julgador-checklist` | GET, POST |
| `/api/legal-sources` | GET, POST, PATCH, DELETE |
| `/api/lexvalida/pipeline` | POST |
| `/api/molde` | POST |
| `/api/news` | GET |
| `/api/prazos` | GET, POST, PATCH, DELETE |
| `/api/produtividade` | GET |
| `/api/proximos` | GET |
| `/api/salvaguardas` | POST |
| `/api/skill-router` | POST |
| `/api/skills` | GET |
| `/api/stats` | GET |
| `/api/suggest` | POST |
| `/api/superior/calculate` | POST |
| `/api/superior/check-thesis` | POST |
| `/api/superior/proof-matrix` | POST |
| `/api/superior/simulate-judge` | POST |
| `/api/templates` | GET |
| `/api/triagem-documento` | POST |
| `/api/valor-causa` | GET, POST |
| `/api/vedacao-surpresa` | POST |
| `/api/visual-law` | POST |

## Conexões e conflitos identificados

- Novo Atlas: porta preferencial 3010 já ocupada pelo Atlas legado. Correção na branch de auditoria passa a falhar com status de saída 1 em produção em caso de colisão, sem fallback.
- Realtime Atlas: porta fixa 3003 pertence ao serviço de notificações do DPT; para staging usar `ATLAS_REALTIME_ENABLED=false`.
- JuridIA: sem serviço na porta 3005; preservar SQLite existente e comprovar migrações antes de publicar.
- MariaDB: serviço local inativo, sem escuta TCP 3306 identificada na VPS. Nenhuma migração deve ser executada sem conexão correta e backup verificado.
- Atlas↔JuridIA: contrato HTTP Bearer e snapshot metadata-only estão implementados; faltam importação persistente própria e índice FTS5/BM25.
- DJEN: HTTP 403 na VPS; STJ CKAN acessível em ensaio read-only.

## Homologação isolada

- Porta 3114, `/healthz` → HTTP 200, sem trocar o Atlas ativo.
- Snapshot interno sem token → HTTP 503 (falha fechada).
- `/api/trpc/sources.list` → HTTP 500 em staging sem banco; demanda verificação integrada, não prova falha da produção.
- Tentativa de usar porta ocupada 3010 → exit code 1 com `ATLAS_PORT_ALREADY_IN_USE`.
- Atlas: TypeScript aprovado, 215 testes aprovados, build concluído na VPS em diretório isolado.
- DPT e Atlas legados continuaram ativos.
