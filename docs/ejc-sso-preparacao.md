# Preparação de SSO do EJC

**Estado:** estrutura pronta, autenticação EJC ainda desativada.  
**Escopo:** identidade e papel; não há sincronização de casos, documentos, partes ou dados processuais.

O Atlas será um *Relying Party* OIDC. A ativação futura usará **Authorization Code Flow**, discovery do emissor e validação do ID Token. OIDC usa a camada OAuth 2.0 para autenticar e retornar *claims* de identidade; o fluxo de código entrega o código antes da troca de tokens no endpoint seguro do provedor.[1] O discovery fornece a configuração pública do emissor, incluindo os endpoints de autorização, token e o conjunto de chaves públicas para validação.[2]

| Item | Valor de preparação | Regra de segurança |
| --- | --- | --- |
| Protocolo | `oidc_authorization_code` | Não usar fluxo implícito nem token no navegador. |
| Callback reservado | `https://atlas.depaulateixeira.adv.br/api/ejc-sso/callback` | Registrar exatamente esta URL no cliente EJC antes de ativar. |
| Claims obrigatórios | `iss`, `sub`, `aud`, `exp` | Validar emissor HTTPS, público, audiência e expiração do ID Token.[1] |
| Papel esperado | Claim `role`, com allowlist `admin` e `user` | Claim ausente, desconhecida ou divergente resulta em `user`; nunca elevar privilégio por padrão. |
| Variáveis protegidas | `EJC_OIDC_ISSUER`, `EJC_OIDC_CLIENT_ID`, `EJC_OIDC_CLIENT_SECRET` | Somente em `/etc/atlas-ejc/atlas.env`, `root:atlas`, modo `0640`; nunca no Git, logs, browser ou documentos. |

## Sequência de ativação

1. Registrar o cliente Atlas no provedor EJC com a callback reservada e solicitar o **issuer HTTPS** do provedor, o `client_id` e o segredo por canal seguro.
2. Validar o documento `/.well-known/openid-configuration`, a identidade do `issuer`, os endpoints HTTPS e `jwks_uri` antes de inserir qualquer variável no ambiente protegido.[2]
3. Configurar os valores na VPS, reiniciar somente `atlas-ejc.service` e confirmar que o status fique `configured_not_activated` — ainda sem liberar `/controle`.
4. Implementar e testar login, callback, PKCE, validação de assinatura/JWKS, `state`, `nonce` e *logout* em homologação.
5. Promover um **usuário real** para `admin` após a primeira sessão válida e validar fila, decisão e auditoria com registro já existente. Não criar usuário, lote ou decisão fictícia.

> Até a etapa 5, a Central de Controle permanece bloqueada. A preparação atual não transmite nem solicita dados de casos, partes, documentos ou credenciais de usuários.

## Referências

[1] [OpenID Connect Core 1.0 — OpenID Foundation](https://openid.net/specs/openid-connect-core-1_0.html)  
[2] [OpenID Connect Discovery 1.0 — OpenID Foundation](https://openid.net/specs/openid-connect-discovery-1_0.html)
