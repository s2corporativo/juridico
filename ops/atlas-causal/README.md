# Atlas Causal — implantação controlada em homologação

**Escopo:** servidor `ejc-vps`, repositório `s2corporativo/juridico`, commit **`a492500d6ac5f16484825bce6bf540eb8717decb`**, serviço de **homologação** `atlas-forense-stage` (porta local 3114). O Atlas legado (`atlas-juridico`, porta 3010) e JuridIA não serão alterados.

## Estado verificado em 14/10/2026

- Atlas em staging: saudável, mas executa commit antigo `7dcb025...`.
- GitHub: Atlas Causal + correção de privacidade PR #34 no commit acima.
- MariaDB de staging: contêiner `atlas-mariadb-staging-20261010`, porta interna exposta exclusivamente em `127.0.0.1:3317`. **Não equivale** a um banco causal provisionado.
- Arquivo `/opt/atlas-juridico/staging/unified/secrets/atlas-stage.env`: existe, root:root, modo 0600; contém configuração métrica, mas NÃO contém `ATLAS_CAUSAL_DATABASE_URL`, `ATLAS_CAUSAL_CASE_KEY_SECRET` ou `ATLAS_CAUSAL_PILOT_AUTHORIZATION`.
- SentinelX: a política `file_ops` permite leitura em `/opt`, mas **não autoriza escrita** nos diretórios Atlas, em `/etc/systemd/system/atlas-forense-stage.service.d` nem em `/var/lib/atlas-juridico`. Não contornar por `sudo`, script, container, symlink ou outro intermediário; solicitar inclusão dos caminhos necessários ao operador.
- Validação isolada: **50 arquivos/228 testes aprovados**, TypeScript, build e check Drizzle aprovados.
- Execução real com DataJud (sem banco) em diretório temporário privado: **2 lotes consultados, zero casos retornados**. Testes diagnósticos subsequentes sofreram timeouts HTTP e resposta 429. **Nenhuma coleta persistente deve ser ativada antes de obter casos válidos e aprovar seu exame.**
- A execução experimental utilizou segredo HMAC efêmero somente em memória; diretório temporário eliminado. Isto **não** substitui segredo HMAC persistente de operação.

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
