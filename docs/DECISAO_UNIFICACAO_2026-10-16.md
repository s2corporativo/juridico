# Decisão de Unificação — Atlas Forense + Atlas Jurídico + JuridIA

**Data:** 2026-10-16 · **Branch canônica resultante:** `f3/consolidacao-integrada-f2-juridia`
**Princípio:** máxima integração funcional com a menor complexidade arquitetural; nenhum merge cego.

## 1. Linhagens incorporadas (ancestrais completos da canônica)

f0 (profissionalização), f1 (API v1 + observabilidade), f2 (piloto Atlas Causal:
ingestão → extração → revisão → causas comprovadas; dashboard `/causal`; JuridIA
dentro do Atlas), feat/atlas-design-simplification, feat/causal-piloto-
causas-comprovadas, feat/fato-gerador-candidato, feat/minutaia-parity,
feature/cerebro-brain-api, feat/juridia-autonomous-curation-seed-20261016,
refactor/atlas-juridia-consolidation-cleanup-20261016 (consolidação JuridIA/
Cérebro EJC — skills fail-closed, gate de evidência, auditoria canônica de
maturação, busca híbrida FTS5/BM25, coletor editorial STJ/DJEN, Pauta.Jur).

## 2. Incorporadas nesta unificação (merge verificado, sem conflitos)

| Branch | Conteúdo incorporado | Verificação |
| --- | --- | --- |
| `feat/atlas-unified-portal-20261016` | **Painel único** na Home do Atlas (01 PESQUISAR `/compendio` · 02 PRODUZIR `/juridia` · 03 VALIDAR `/fontes`); header da JuridIA aponta ao dashboard canônico | merge ort limpo; 3 arquivos |
| `feat/atlas-graphify-audit-vps-20261010` | Apenas os 3 relatórios de auditoria (graphify, rotas Atlas↔JuridIA, gates de deploy) | docs-only; código antigo de 2026-10-10 **não** trazido (conflito em db.ts abortado) |

## 3. Exclusões deliberadas (com prova de superssedição)

| Branch | Motivo da exclusão |
| --- | --- |
| `feat/ejc-brain-core` (195 arquivos, 2026-10-10) | App EJC standalone da era antiga — recriaria a fragmentação extinta. O Cérebro hoje vive integrado (`apps/juridia/src/app/api/brain`, `brain-ejc-evidence-gate`, contrato `packages/shared/brain-api`) |
| `feat/tribunal-multiragente` (47 arquivos) | Experimento multiagente sem consumo atual; reavaliar apenas funcionalidades individualizadas |
| `fix/juridia-rag-safety-audit-20261010` (62 arquivos) | Árvore pré-refactor; equivalentes presentes (rotas atuais) e scripts antigos suplantados pela auditoria canônica `audit-legal-maturation.ts` + gates de citação/CNJ/sigilo |
| `feat/vps-integracao-fts5-20261010` | Superseded pela busca híbrida FTS5/BM25 com curadoria (08d9c28, na linha B1→B5) |
| `fix/minutaia-security-batch` | Baixa qualidade: import `XCircle` duplicado (quebraria build), pausa client-side hackiada, `MAX_BATCH_CASES` 10→100 sem limite server-side comprovado, package-lock npm conflitante com padrão pnpm. **Única parte aproveitada:** documentação de `DATAJUD_TOKEN` no `.env.example` |
| `feat/juridia-curation-maturation-v2-20261016` | `scan-skill-maturity.ts` é a duplicata que a consolidação eliminou deliberadamente (canônico: `audit-legal-maturation.ts`) |

Branches restantes não-ancestrais: **0 arquivos únicos** — todo o conteúdo já
chegou à canônica por outras linhagens (tabela completa em
`download/auditoria-branches-20261016.txt`).

## 4. Regras de arquitetura vigentes

- **Um dashboard canônico** (Home do Atlas) com navegação Pesquisar/Produzir/Validar.
- JuridIA como módulo de inteligência dentro do ecossistema — sem terceira experiência.
- Uma fonte canônica por fluxo (curadoria, versão aprovada, citação, geração).
- Dados jurídicos verificáveis; sem seed de aprovações; fail-closed em sigilo.
- Sem exclusão destrutiva sem inventário + rollback.
