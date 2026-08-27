# Validação da preparação EJC/SSO

**Data:** 27/08/2026  
**Release:** `/opt/atlas-ejc/releases/20260827-1955`  
**Estado:** preparação OIDC inativa, sem segredo configurado.

O endpoint público `integration.ejcStatus` foi consultado no domínio Atlas após a publicação. Ele retornou `enabled: false`, `status: configuration_required` e `configurationComplete: false`, confirmando que não há ativação prematura. A mesma resposta não continha nomes de variáveis, identificadores de cliente, segredo de cliente, `missingConfiguration` ou valor de ambiente.

| Controle | Resultado | Limite |
| --- | --- | --- |
| Saúde externa | `/healthz` respondeu `200` | Não prova fluxo de login, apenas disponibilidade do serviço. |
| Prontidão OIDC | Estado abstrato e inativo | Não há provedor EJC configurado. |
| Exposição pública | Sem nomes/configurações de ambiente | A documentação interna conserva apenas os nomes necessários para a futura configuração protegida. |
| Área administrativa | Permanece bloqueada | A validação operacional exige usuário real com papel `admin`. |

> A ativação depende do issuer HTTPS, cliente OIDC registrado e credenciais inseridas somente em `/etc/atlas-ejc/atlas.env`, além da validação final com um administrador real. Nenhuma credencial deve ser transmitida em conversa ou versionada.
