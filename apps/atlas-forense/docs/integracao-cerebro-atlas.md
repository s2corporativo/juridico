# Integração Cérebro Jurídico (JuridIA/EJC) ↔ Atlas Forense

Autorização do titular: 10/10/2026 (revisa a decisão de 27/08/2026 em `ejc-integracao-manifesto.md`).

## Fluxos

| Sentido | O que trafega | Rota | Controle |
|---|---|---|---|
| Atlas → Cérebro | Metadados públicos do Compêndio (somente `official_confirmed`, `official_without_number`, `attachment_reviewed`) | `GET /api/internal/brain/compendium/search` | Bearer `ATLAS_BRAIN_API_TOKEN` |
| Atlas → Cérebro | Jurimetria descritiva com cobertura e limites | `GET /api/internal/brain/jurimetry` | idem |
| Cérebro → Atlas | Teses aprovadas por advogado, com fonte oficial HTTPS e sem dado pessoal | `POST /api/internal/brain/theses` | idem; entra em `editorial_updates` como `pending_review` |

Lado JuridIA: `src/lib/atlas_client.ts`, passo 4 de `/api/brain` e `POST /api/atlas/theses` (papéis admin ou advogado, confirmação `approved: true`, auditoria `atlas_thesis_submitted`).

## Limites obrigatórios

- Jurimetria exclusivamente descritiva. Não há taxa de êxito, probabilidade de procedência nem ranking de magistrados.
- Nenhum fato do caso, nome, número ou valor sai do JuridIA. As buscas usam até 3 termos jurídicos genéricos (minúsculas, sem dígitos, sem marcadores de anonimização).
- Tese enviada exige fonte em domínio oficial (`.jus.br`, `.gov.br`, `.leg.br`, `.mp.br`, `.def.br`), HTTPS, sem CPF, CNPJ, e-mail, telefone ou marcador. Chave de idempotência: SHA-256 de título normalizado mais URL.
- Nada é publicado automaticamente: toda tese passa por revisão humana na fila editorial.
- Resultado de busca web aberta usado como contingência é marcado `hipotese` (confiança 0,3) e exibido como "não verificado".

## Segurança

- Token mínimo de 32 caracteres, comparação SHA-256 com `timingSafeEqual`, fail-closed (503), limite de 120 requisições por minuto em memória.
- Cliente exige HTTPS fora de loopback em produção; timeout de 8 s; falha graciosa (o Cérebro segue sem Atlas, sinalizando `atlas.status`).
- Segredos: `render-env.sh` gera `ATLAS_BRAIN_API_TOKEN` e o espelha nos dois arquivos de env. Nunca em Git.

## Pendências de segurança (fora deste escopo, registradas)

1. Isolamento por usuário nos dados do JuridIA.
2. Restringir as rotas `office.*` do Atlas.
3. Anonimizar os fatos enviados ao LLM em `/api/brain`.
4. Rate limit nas rotas do Cérebro.
5. Proteção da chave privada OIDC em repouso.

## Publicação e verificação

Ordem na VPS (como root; arquitetura de releases em `publicacao-vps.md`):

1. Backup pré-deploy (gate `REQUIRE_PREDEPLOY_BACKUP=1` permanece ligado) do MariaDB `atlas_ejc` e do SQLite do JuridIA.
2. Atualizar o código da branch `atlas-forense` (`git pull --ff-only`), registrando o commit anterior para reversão.
3. `bash apps/atlas-forense/deploy/render-env.sh --check` e, havendo pendência, `--render`. Gera `ATLAS_BRAIN_API_TOKEN` e `ATLAS_API_URL` sem imprimir valores. Não há migration de banco neste conjunto de mudanças.
4. Build e testes: Atlas (`pnpm install --frozen-lockfile`, `tsc --noEmit`, `npx vitest run`, `pnpm build`); JuridIA (`bun install`, `tsc --noEmit`, `bun run tests/atlas-client.test.ts`, build do Next).
5. Reiniciar `atlas-ejc` e o serviço do JuridIA (porta 3005).
6. `bash apps/atlas-forense/deploy/verify-brain-integration.sh` e `node apps/juridia/scripts/contract-check.mjs`. Ambos devem terminar íntegros.

Reversão: voltar ao commit (ou release) anterior, restaurar os `.bak` dos arquivos de env se necessário, reiniciar os dois serviços e repetir a verificação. Sem o token, a API do Atlas responde 503 e o Cérebro segue em modo degradado sinalizado, sem queda do JuridIA.
