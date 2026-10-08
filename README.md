# Atlas Jurídico

Sistema jurídico interno do escritório, organizado como monorepo.

## Arquitetura

- `apps/atlas-forense`: dados jurídicos, jurimetria, fontes públicas, DataJud, compêndio e governança do acervo.
- `apps/juridia`: inteligência jurídica, pesquisa, RAG, modo agêntico, geração de minutas, editor, gates e revisão.
- `packages/shared`: contratos TypeScript compartilhados entre as aplicações.

O fluxo principal é:

```text
Caso
  → Evidências
  → Pesquisa jurídica
  → Plano agêntico
  → Redação
  → Citation/Evidence Gates
  → Revisão humana
  → Documento final
```

## Desenvolvimento

```bash
pnpm dev:atlas
pnpm dev:juridia
```

## Validação

```bash
pnpm test:atlas
pnpm check:atlas
pnpm check:juridia
pnpm test:juridia
pnpm build:atlas
pnpm build:juridia
```

## Mapa arquitetural

O repositório usa Graphify para manter um grafo navegável da arquitetura.

```bash
./scripts/architecture-map.sh
```

Os artefatos completos são gerados em `graphify-out/`. O relatório resumido fica em `docs/ARCHITECTURE.md`.

## Segurança

- autenticação obrigatória nas rotas confidenciais;
- OIDC Authorization Code + PKCE;
- política de IA centralizada;
- pseudonimização antes de providers externos;
- matérias sensíveis podem operar em modo local fail-closed;
- revisão humana obrigatória antes de homologação;
- logs e trilhas de auditoria não devem armazenar segredos nem PII desnecessária.
