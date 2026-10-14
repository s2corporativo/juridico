# Fontes oficiais — coletor-piloto DataJud/JEC/RMBH

- [API Pública DataJud — DataJud-Wiki](https://datajud-wiki.cnj.jus.br/api-publica/): a API fornece metadados processuais, capas e movimentações, observando o resguardo de processos sigilosos e dados das partes.
- [Endpoints](https://datajud-wiki.cnj.jus.br/api-publica/endpoints/): endpoint base `https://api-publica.datajud.cnj.jus.br/` seguido do alias do tribunal; para TJMG, o coletor usa `api_publica_tjmg/_search`.
- [Glossário de Dados](https://datajud-wiki.cnj.jus.br/api-publica/glossario/): campos relevantes são `numeroProcesso`, `dataAjuizamento`, `grau`, `classe`, `assuntos`, `orgaoJulgador` e `movimentos`.
- [Exemplo de filtro por classe e órgão](https://datajud-wiki.cnj.jus.br/api-publica/exemplos/exemplo2): demonstra consulta POST com Query DSL e filtros por `classe.codigo` e `orgaoJulgador.codigo`.
- [Exemplo de paginação](https://datajud-wiki.cnj.jus.br/api-publica/exemplos/exemplo3): recomenda `size` + `sort` por `@timestamp` + `search_after` para percorrer resultados.
- [Termo de uso](https://datajud-wiki.cnj.jus.br/api-publica/termo-uso): responsabiliza o usuário pelo uso e alerta que o CNJ não garante precisão, integridade ou atualidade dos dados; o uso deve observar finalidade legal e o termo aplicável.
- [CNJ — API Pública](https://www.cnj.jus.br/sistemas/datajud/api-publica/): confirma o escopo de metadados e movimentações da API pública.

## Decisões aplicadas

O coletor não solicita nomes de partes, CPF, documentos integrais ou `_source` bruto. A resposta é reduzida a identificador técnico, tribunal, grau, classe, assuntos, órgão julgador, município, data de ajuizamento e movimentos selecionados. A causa jurídica e o resultado de mérito ficam como anotação/evidência posterior, salvo quando a movimentação fornecer somente um indício explicitamente rotulado como tal.

O piloto usa o alias `tjmg`, a classe JEC `436`, o grau `JE`, os órgãos julgadores previamente materializados no escopo RMBH e os descendentes de assuntos Cível/Consumidor já aprovados no filtro local. O limite padrão é de 100 registros por página e 12 páginas por órgão, totalizando no máximo 28.800 hits por execução, antes da revisão de custo e cobertura.
