# Validação pública — acesso administrativo

**Data:** 27/08/2026  
**Ambiente:** `https://atlas.depaulateixeira.adv.br/controle`  
**Método:** navegação em navegador isolado, sem sessão autenticada.

A Central de Controle foi exibida com os avisos “**Acesso restrito**”, “**Autenticação necessária**” e “**Sem gravação nesta etapa**”. O único comando operacional visível é “Entrar para continuar”. A fila de revisão, a pré-validação executável, ações de decisão e a consulta administrativa DataJud não foram apresentadas no estado anônimo.

Os contratos administrativos também foram testados sem sessão: `compendium.reviewQueue.list` e `datajud.coverage` retornaram **HTTP 403 / FORBIDDEN** antes de qualquer consulta de cobertura. A tentativa de `GET` contra a mutação de cobertura foi recusada como **HTTP 405**, sem acionar processamento.

> A publicação externa permanece sem OAuth/SSO nesta fase. Essa validação comprova o bloqueio público, mas não substitui a futura validação autenticada por administrador real após a vinculação ao EJC.
