# JuridIA — Inteligência Jurídica do Atlas

Motor cognitivo do **Atlas Jurídico** para pesquisa, análise, produção e revisão jurídica assistidas por IA.

## Responsabilidades

- Cérebro jurídico e análise estruturada de casos.
- Pesquisa híbrida sobre fontes jurídicas e acervo interno.
- Geração de minutas por pipeline multi-etapas.
- Citation Gate e Evidence Gate.
- Pseudonimização antes de providers externos.
- Editor, modo molde, lote e Visual Law.
- OIDC Identity Provider do Atlas.
- Auditoria de execuções, fontes e decisões de revisão.

## Fluxo canônico

```text
Caso
→ evidências
→ plano de pesquisa
→ pesquisa favorável e contrária
→ plano de redação
→ minuta
→ Citation/Evidence Gates
→ revisão humana
→ documento final
```

## Segurança

- Rotas confidenciais exigem sessão autenticada.
- OIDC usa Authorization Code + PKCE S256 e tokens RS256.
- Matérias sensíveis podem operar em modo local fail-closed.
- Providers externos recebem conteúdo pseudonimizado conforme política.
- Nenhuma saída de IA é homologada sem revisão humana.

## Validação

```bash
bun install --frozen-lockfile
bun run db:generate
bun x tsc --noEmit
bun test
bun run build
```

Consulte `../../docs/ARCHITECTURE.md` e `../../docs/OPERATIONS.md`.
