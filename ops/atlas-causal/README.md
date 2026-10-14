# Atlas Causal — implantação controlada em homologação

**Escopo:** servidor `ejc-vps`, repositório `s2corporativo/juridico`, commit **`fb2fb4dc5b9f1599df89856b37c5578d3972974e`**, serviço de **homologação** `atlas-forense-stage` (porta local 3114). O Atlas legado (`atlas-juridico`, porta 3010) e JuridIA não serão alterados.

## Estado verificado em 14/10/2026

- Atlas em staging: saudável, mas executa commit antigo `7dcb025...`.
- GitHub: Atlas Causal + correção de privacidade PR #34 no commit acima.
- MariaDB de staging: contêiner `atlas-mariadb-staging-20261010`, porta interna exposta exclusivamente em `127.0.0.1:3317`. **Não equivale** a um banco causal provisionado.
- Arquivo `/opt/atlas-juridico/staging/unified/secrets/atlas-stage.env`: existe, root:root, modo 0600; contém configuração métrica, mas NÃO contém `ATLAS_CAUSAL_DATABASE_URL`, `ATLAS_CAUSAL_CASE_KEY_SECRET` ou `ATLAS_CAUSAL_PILOT_AUTHORIZATION`.
- SentinelX: a política `file_ops` permite leitura em `/opt`, mas **não autoriza escrita** nos diretórios Atlas, em `/etc/systemd/system/atlas-forense-stage.service.d` nem em `/var/lib/atlas-juridico`. Não contornar por `sudo`, script, container, symlink ou outro intermediário; solicitar inclusão dos caminhos necessários ao operador.
- Validação isolada: **50 arquivos/228 testes aprovados**, TypeScript, build e check Drizzle aprovados.
- Execução real anterior com DataJud (sem banco) em diretório temporário privado: **2 lotes consultados, zero casos retornados**. A PR #36 adicionou bloqueio explícito para amostras vazias, retorno com `timed_out`, shards com falha e payload incompleto; 50 arquivos e 229 testes passaram nessa atualização. Testes diagnósticos subsequentes sofreram timeouts HTTP e resposta 429. **Nenhuma coleta persistente deve ser ativada antes de obter casos válidos e aprovar seu exame.**
- A execução experimental utilizou segredo HMAC efêmero somente em memória; diretório temporário eliminado. Isto **não** substitui segredo HMAC persistente de operação.

## Autorização inicial do SentinelX (somente operador da VPS)

O agente em produção mantém \`/etc/sentinelx/config.yaml\` em **somente leitura** na sua política atual. O comando oficial \`sentinel_edit\` rejeita essa escrita até mesmo com \`sudo\`, de forma que **o próprio agente não pode executar o bootstrap**. O proprietário autorizou a alteração, mas a operação inicial precisa ser executada no console SSH/Contabo pelo administrador do servidor.

Arquivo versionado e revisável: [\`bootstrap-sentinelx-access.py\`](./bootstrap-sentinelx-access.py). Ele adiciona somente quatro caminhos \`rw\` do Atlas, sem incluir segredos, preserva os demais campos YAML, guarda backup datado, altera atomicamente e **não reinicia** o agente automaticamente.

No **console autorizado da VPS**, execute a partir de uma cópia verificada deste repositório, fixando o SHA do commit obtido na PR do bootstrap:

\`\`\`bash
# Substitua o caminho pela cópia do script obtida do repositório de confiança:
sudo python3 ops/atlas-causal/bootstrap-sentinelx-access.py
sudo systemctl restart sentinelx-cloud-core
\`\`\`

Depois que o agente reconectar, confirme via \`sentinel_capabilities\` a existência dos quatro caminhos com \`access: rw\`. Se houver erro de YAML, não reinicie: restaure \`/etc/sentinelx/config.yaml.bak-atlas-<timestamp>\`. Essa operação **não** provisiona o banco nem habilita coleta real; as demais verificações ainda são obrigatórias.

## Pré-requisitos bloqueantes

1. Operador autoriza escrita, via política SentinelX, somente nos caminhos necessários à versão Atlas: `/opt/atlas-juridico/staging/unified/releases`, `/opt/atlas-juridico/staging/unified/rollback-causal`, `/etc/systemd/system/atlas-forense-stage.service.d`, `/var/lib/atlas-juridico/causal-pilot`; conceder acesso ao serviço `atlas-forense-stage`, não ao Atlas legado. Permissões específicas devem ser tão restritas quanto possível.
2. DBA provisiona o banco **`atlas_causal` vazio** em MariaDB de homologação, com usuário e permissões próprios (sem reaproveitar o esquema `DATABASE_URL`). Registrar backup e política de restauração, nunca incluir credenciais no Git.
3. Operador configura de modo protegido em `atlas-stage.env`: `ATLAS_CAUSAL_DATABASE_URL` (URL do banco causal), `ATLAS_CAUSAL_CASE_KEY_SECRET` (segredo estável de alta entropia, ao menos 32 caracteres) e `ATLAS_CAUSAL_PILOT_AUTHORIZATION=approved` somente após revisão jurídica. Segredo jamais deve ser rotacionado automaticamente a cada lote.
4. Validar termos de uso do DataJud e a cobertura real. Corrigir o filtro da consulta se necessário; **não considerar resposta 0 sucesso jurídico** e respeitar respostas 429/backoff.
5. Configurar backup/restauração antes de qualquer migração não trivial. O script incluído permite bootstrap somente em banco sem tabelas; para banco existente, exige plano específico revisado.

## Procedimento

O script `ops/atlas-causal/deploy-stage-once.sh` é uma execução única **exclusivamente para homologação**, com fail-closed. Ele:
- valida saúde do serviço e pré-requisitos, faz clone novo em release isolado no **commit exato** (sem `reset --hard` na instalação ativa);
- executa `pnpm install --frozen-lockfile`, TypeScript, testes, build e check do Drizzle;
- testa o novo banco e rejeita se já contiver tabelas;
- faz piloto real **sem persistência** (100 por página, no máximo duas páginas por lote), valida saída e exige pelo menos um caso;
- só então aplica **migration versionada** via `pnpm db:causal:migrate`, muda o `WorkingDirectory` da unidade do serviço de staging usando drop-in com backup e health check na porta 3114;
- coleta novamente para persistência no banco causal e analisa movimentos; se a implantação do serviço falhar, restaura seu drop-in e reinicia a versão anterior.

**Não executá-lo no servidor atual:** a etapa de pré-requisitos está incompleta. **Não invocar** `db:causal:generate` em produção, `git reset --hard` nem reiniciar `atlas-juridico` ou `dpt-erp`.

## Critérios de conclusão

Relatório de lote real: `caseKey` HMAC estável, número CNJ bruto ausente dos JSON persistidos, ausência de CPF/CNPJ/nomes identificáveis nas evidências, quantidade de casos e órgãos, taxa de rejeição, limites e proveniência; nenhuma conclusão causal ou condenatória inferida só de movimentos. Banco isolado verificado com migrations, backup e restauração. Health check staging OK após reinício e teste de rollback. Conclusão do piloto **não** habilita automaticamente exposição pública ou o fluxo completo do JuridIA (OIDC em staging ainda indisponível).

## Publicar o piloto inteiro teor no staging (branch nova via git pull)

Para ativar o **piloto inteiro teor** (candidatos → causas comprovadas), usar o pacote
`deploy-fase1` (mesmo fluxo da Fase 1, estendido com migrate do banco causal isolado):

1. Pré-requisitos: banco `atlas_causal` vazio provisionado + segredos em `atlas-stage.env`
   (`ATLAS_CAUSAL_DATABASE_URL`, `ATLAS_CAUSAL_CASE_KEY_SECRET`, `ATLAS_CAUSAL_PILOT_AUTHORIZATION=approved`).
2. Na VPS, como root: `./publicar-causal-piloto-staging.sh --check-only` e depois `--via-git`.
3. O script publica a branch `feat/causal-piloto-causas-comprovadas` (contém F0 + F1 +
   candidatos JEC + piloto), aplica `drizzle-causal 0000→0001` e valida saúde/rollback.

Detalhes passo a passo (incluindo o primeiro caso de teste: ingestão → extração →
revisão → `causal.provenCauses`): `LEIA-ME-PUBLICAR-CAUSAL-PILOTO.md` do pacote.
Fluxo do piloto: `docs/ATLAS_CAUSAL.md` → seção "Piloto inteiro teor".

## Publicar a branch nova e rodar o 1º caso piloto (git pull no staging)

Script de um comando (executar NO CONSOLE da VPS, como root): [`publicar-piloto-e-primeiro-caso.sh`](./publicar-piloto-e-primeiro-caso.sh)

```bash
BRANCH=feat/causal-piloto-causas-comprovadas \
  bash ops/atlas-causal/publicar-piloto-e-primeiro-caso.sh
# verificação prévia sem alterar nada:
DRY_RUN=1 BRANCH=feat/causal-piloto-causas-comprovadas bash ops/atlas-causal/publicar-piloto-e-primeiro-caso.sh
```

O script: resolve o SHA da branch no GitHub → cria release imutável por SHA (install + check + test + build + drizzle check) → aplica migração versionada do banco causal isolado → cutover do serviço com reversão automática → valida `healthz` e `readyz` → executa o 1º caso piloto idempotente (`scripts/piloto-primeiro-caso.ts`, salvando o log em `/var/lib/atlas-juridico/causal-pilot/`).

Pré-requisitos (já cobertos pelo pacote `deploy-fase1` + bootstrap `bootstrap-sentinelx-access.py`): segredos causais presentes em `atlas-stage.env` (`ATLAS_CAUSAL_DATABASE_URL` apontando para banco `atlas_causal` vazio/novo, `ATLAS_CAUSAL_CASE_KEY_SECRET` ≥32 chars, `ATLAS_CAUSAL_PILOT_AUTHORIZATION=approved`) e serviço `atlas-forense-stage` ativo na 3114.

Primeira execução validada no banco causal isolado de desenvolvimento: 8 casos reais da amostra (transporte, crédito, serviços/saúde, inadimplemento, contratos, trânsito), 30 candidatos, 30 aprovados em revisão, fila zerada, pedidos comprovados (dano moral 6, dano material 4, obrigação de fazer 3). Dashboard simplificado em `/causal` com funil, causas comprovadas, fila de revisão em 1 clique e JuridIA embutida alimentada pelo Atlas (`causal.juridiaContext`, `causal.juridiaAsk`).
