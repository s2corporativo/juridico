# Requisitos Públicos Confirmados — DataJud

Data de verificação: **26/08/2026**.

## Resultado da consulta oficial

A Wiki oficial do DataJud confirma que a API Pública utiliza uma **chave pública dinâmica**, publicada pelo CNJ, enviada no cabeçalho `Authorization` com o prefixo `APIKey`. A credencial pode ser alterada pelo CNJ a qualquer tempo; por esse motivo, o sistema não a grava em código, banco, interface, logs ou checkpoints. [1]

Em consulta técnica mínima e não persistida, uma chave pública localizada na página oficial foi aceita por uma pesquisa com `match_none` e `size: 0` no endpoint estadual do TJMG. O teste não solicitou nem armazenou processo, parte, movimento ou resposta de conteúdo. A resolução atual é feita em memória pelo conector, sem arquivo auxiliar.

Em nova verificação de **26/08/2026**, a mesma sequência foi executada inteiramente em memória: a página oficial foi recebida em variável de processo, a chave foi extraída e enviada no cabeçalho da consulta agregada vazia, e ambas as variáveis foram descartadas ao fim. Nenhum arquivo temporário, log de aplicação, linha de banco ou artefato de projeto recebeu o valor da chave.

| Aspecto | Regra adotada no Atlas Forense |
|---|---|
| Autenticação | Buscar dinamicamente na Wiki oficial apenas no momento da execução controlada. |
| Aliases | Usar a base oficial e o alias de cada tribunal, validando resposta antes de incluir na cobertura. [2] |
| Escopo | Guardar somente métricas agregadas de distribuição/baixa e metadados metodológicos do censo. |
| Citação | Identificar CNJ/DataJud como fonte e conservar versão metodológica, cobertura e data da coleta. |
| Limites | Não declarar completude, atualidade ou comparabilidade sem verificação por tribunal. |

### Política operacional aprovada

O Atlas Forense admite apenas dois meios para obter a chave pública: variável temporária de ambiente, quando disponibilizada pelo operador, ou leitura direta da página oficial do CNJ durante a requisição administrativa. Em ambos os casos, a chave existe somente na memória do processo, é usada em consulta mínima e não integra cache, banco, interface, log ou checkpoint. A rota administrativa de cobertura testa somente aliases e expõe contagens/estados, não processos ou respostas brutas.

> A API pública não garante precisão, integridade ou atualização dos dados; os termos também restringem o uso a finalidades legais, não comerciais e autorizadas. [3]

## Referências

[1] [DataJud Wiki — Acesso](https://datajud-wiki.cnj.jus.br/api-publica/acesso/)

[2] [DataJud Wiki — Endpoints](https://datajud-wiki.cnj.jus.br/api-publica/endpoints/)

[3] [DataJud Wiki — Termo de Uso](https://datajud-wiki.cnj.jus.br/api-publica/termo-uso/)
