# Critérios de retomada operacional

**Data de consolidação:** 27/08/2026  
**Estado do Atlas:** publicação pública ativa; rotas administrativas bloqueadas sem autenticação externa.

Este documento separa o que está pronto para operação pública do que depende de evento externo. Não autoriza coleta adicional, mudança de DNS ou liberação de controles administrativos por si só.

| Frente | Estado atual | Pré-condição de retomada | Limite obrigatório | Evidência mínima |
| --- | --- | --- | --- | --- |
| DNS e Cloudflare | Não há mudança pendente no DNS. O token anterior deve ser revogado ao encerramento do projeto, conforme orientação do usuário. | Token anterior revogado e novo token de escopo mínimo criado fora do chat. | Usar somente `Zone:Read` e `DNS:Edit` na zona necessária; nunca salvar o valor no repositório, VPS, logs ou documentos. | Confirmação do responsável no painel Cloudflare, sem compartilhar segredo. |
| Baixas TJMG | Coletor implementado com `--execute`, autorização transitória, pausa, teto de páginas e retentativas. A última tentativa parou antes de consultar processos porque o acesso oficial à chave excedeu o tempo. Em 27/08/2026, nova pré-validação na VPS recebeu HTTP 403 na página pública de acesso. | Página oficial de acesso à chave pública DataJud acessível a partir da VPS e chave válida resolvida somente em memória. | Primeiro lote: apenas TJMG, até 3 páginas, 750 ms entre páginas, até 2 retentativas, saída isolada e revisão humana do manifesto. | Manifesto sanitizado com pré-validação concluída, páginas processadas e nenhum identificador, HMAC, resposta bruta ou chave persistido. |
| Baixas nacionais | Não iniciada integralmente; censo de distribuições e facetas já existe, mas a camada de baixas é parcial. | Piloto TJMG aprovado e confirmação expressa para ampliar o escopo. | Executar por tribunal e período, com baixa concorrência, backoff e ponto de parada; nunca inferir taxa de êxito, clearance ou duração a partir de recorte. | Manifesto por lote contendo cobertura, falhas, limites e totais agregados. |
| Central de Controle | Interface e contratos protegidos; acesso anônimo recebeu HTTP 403 para fila de revisão e cobertura DataJud. | Vínculo OAuth/SSO do EJC configurado e usuário real promovido a `admin`. | Validar com registro público já catalogado; não criar usuário, decisão, lote ou evidência fictícia. | Registro de login, resultado de perfil, evento de auditoria e revisão humana confirmados. |

## Sequência de retomada segura

1. **Rotacionar a credencial Cloudflare** no final do projeto e confirmar a revogação sem enviar valores sensíveis.
2. **Restabelecer a disponibilidade oficial DataJud** e fazer somente o piloto TJMG limitado. Caso a pré-validação falhe, encerrar a execução e manter o censo como `partial`.
3. **Revisar o manifesto sanitizado** antes de qualquer importação de totais. Somente agregados por mês, alias e UF podem prosseguir para a base.
4. **Vincular OAuth/SSO do EJC e testar um administrador real** antes de disponibilizar a Central de Controle externamente.

> O ambiente público atual é apropriado para consulta e para as métricas agregadas já validadas. Ele não deve ser apresentado como fonte de taxa de sucesso, previsão judicial, censo completo de baixas ou repositório de documentos processuais.

## Controles de reversão

O Atlas continua em releases versionadas sob `/opt/atlas-ejc/releases`, com `/opt/atlas-ejc/current` como ponteiro atômico. A aplicação escuta somente em `127.0.0.1:3010`; Caddy é o único ponto de entrada externa em HTTPS. Antes de atualizar o release, preservar o caminho atual, instalar o próximo em diretório novo, validar `/healthz` localmente e só então trocar o ponteiro. Caso a saúde falhe, restaurar o ponteiro anterior e reiniciar apenas `atlas-ejc.service`.

## Validação consolidada do domínio público

Em 27/08/2026, o domínio externo retornou o estado saudável em `/healthz`. O contrato público de censo retornou as facetas de órgão `40011` para Betim/MG (**7.148 registros**) e `8161` para Igarapé/MG (**1.328 registros**). Em acesso anônimo, `compendium.reviewQueue.list` respondeu **HTTP 403 / FORBIDDEN**, confirmando que a fila de revisão não foi exposta. Os totais territoriais permanecem facetas agregadas integrais e não devem ser tratados como série mensal, estoque, taxa ou censo completo por comarca.

## Fontes operacionais

1. [API Pública DataJud — CNJ](https://datajud-wiki.cnj.jus.br/api-publica/acesso/)
2. [Portal DataJud — Conselho Nacional de Justiça](https://datajud.cnj.jus.br/)
