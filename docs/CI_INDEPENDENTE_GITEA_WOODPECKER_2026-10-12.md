# CI independente do GitHub Actions — implantação operacional

**Data:** 12/10/2026 · **Escopo:** Atlas Forense + JuridIA, sem deploy automático.

## Instalação executada na VPS

- **Serviço:** `legal-ai-ci.service`; **timer:** `legal-ai-ci.timer` (a cada 30 minutos, desvio aleatório de até 2 minutos).
- **Usuário dedicado:** `legal-ci`, sem shell interativo, sem Docker, sem permissões de root e sem variáveis de segredo do Atlas/JuridIA.
- **Script de validação:** `/usr/local/libexec/legal-ai-ci/verify.sh`; estado `/var/lib/legal-ci/`; logs `history/<sha>.log`; resultado `history/<sha>.status`; último SHA aprovado `last-success.sha`.
- Ao detectar SHA distinto da última versão aprovada, clona apenas `atlas-forense`, compara SHA remoto e local e executa: Bun/Prisma/TypeScript/lint/testes/build do JuridIA, pnpm/TypeScript/testes/build do Atlas.
- `flock` impede concorrência entre execuções, `TimeoutStartSec=1800`, `CPUQuota=150%`, `MemoryMax=5G`, `ProtectSystem=strict`, `ProtectHome=yes`, `PrivateTmp=yes`, `NoNewPrivileges=yes`. Apenas `/var/lib/legal-ci` e cache do serviço são graváveis. **Nenhum deploy ou alteração em produção.**
- O executor é solução provisória enquanto Woodpecker não estiver habilitado para este projeto. GitHub Actions continua bloqueado por cobrança e não é requisito deste serviço.

### Operação e auditoria
```bash
sudo systemctl status legal-ai-ci.timer
sudo systemctl status legal-ai-ci.service
sudo journalctl -u legal-ai-ci.service --no-pager -n 60
sudo cat /var/lib/legal-ci/last-success.sha
sudo ls -la /var/lib/legal-ci/history
# Forçar uma rodada de testes:
sudo systemctl start --no-block legal-ai-ci.service
# Pausar futuras execuções, preservando dados:
sudo systemctl disable --now legal-ai-ci.timer
```
`last-success.sha` só deve ser considerado aprovado depois do serviço encerrar com exit 0. Uma falha deve bloquear promoção/publicação, não ser ignorada.

## Git espelhado e backup do Gitea
- Espelho local do projeto: `/opt/gitea/mirrors/s2corporativo/juridico.git` (clone `--mirror` com 53 referências, `git fsck --full` aprovado e SHA da branch `atlas-forense` verificado contra origem remota).
- Backup pré-migração do Gitea: `/opt/gitea/backups/pre-git-migration-20261012/gitea.db` (SQLite com `PRAGMA integrity_check=ok`) e `gitea-data.tgz` (tar validado). Arquivos protegidos.
- O espelho local é **cópia Git válida**, mas **não é ainda um repositório cadastrado no Gitea**. Não alegar migração concluída.
- O repositório DPT é privado e não acessível via clone Git anônimo. Não copiar/pedir senhas como alternativa.

## Woodpecker CI já instalado
- `woodpecker-woodpecker-server-1`, quatro agentes, PostgreSQL, todos ativos na última inspeção.
- Integração OAuth atualmente `WOODPECKER_GITHUB=true`; não alterar integração sem migração cuidadosa: há cinco repositórios ativos e 3.036 pipelines históricos.
- Workflows versionados por PR #25: `.woodpecker/juridia.yml` e `.woodpecker/atlas.yml`, com TypeScript, testes e build, **sem credenciais e sem deploy**.
- Falta habilitar **`s2corporativo/juridico`** pelo painel conectado em `https://ci.depaulateixeira.adv.br` (login GitHub do administrador, sincronizar repositórios, ativar, observar os dois pipelines). O serviço atual do Woodpecker permanece preservado até essa ativação.

## Gitea como código mestre — transição controlada, não concluída
- Gitea 1.27.3 saudável localmente na porta `127.0.0.1:8300`, com Gitea Actions habilitado e banco SQLite próprio.
- `ROOT_URL` configurado para `https://ci.depaulateixeira.adv.br/`, mas o Nginx encaminha esse endereço ao **Woodpecker**. Não reusar esse domínio para ambos sem correção coordenada.
- `git.depaulateixeira.adv.br` não possui DNS A/CNAME verificável nesta data, não dispõe de HTTPS configurado e não existe Gitea runner habilitado. **Não publicar somente em HTTP.**
- Procedimento após provisionar DNS e acesso administrativo: (1) TLS válido; (2) Nginx exclusivo `git...`→`127.0.0.1:8300`, com cabeçalhos de proxy corretos; (3) ajustar o `ROOT_URL`/DOMAIN/SSH_DOMAIN do Gitea; (4) importar `s2corporativo/juridico` via recurso de migração, configurando privacidade e permissões; (5) comparar contagem de refs e SHA por branch com o espelho; (6) criar/validar runners e proteções; (7) promover Gitea a código mestre e GitHub a espelho apenas após testes/rollback.
- A emissão de token administrativo temporário do Gitea foi bloqueada pelas proteções da sessão; nenhuma tentativa de contorno foi feita e nenhum token foi entregue a outra pessoa. Sem este acesso não se deve declarar que repositórios foram migrados.

**Regra de publicação:** nenhuma promoção automática à VPS. Testes → revisão → staging → validação jurídica e de segurança → promoção manual, com backup/restauração e rollback comprovados. O bloqueio de faturamento do GitHub Actions não autoriza eliminar esses gates.
