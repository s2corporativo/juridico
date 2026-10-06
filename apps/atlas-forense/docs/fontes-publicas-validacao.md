# Validação de Fontes Públicas

Data da validação: **26/08/2026**.

| Fonte | Verificação realizada | Situação no Atlas |
|---|---|---|
| DataJud / CNJ | A documentação oficial confirma acesso público a metadados processuais e movimentações, com proteção de processos sigilosos e dados de partes. | Catalogada; exige chave temporária fora do código e do banco. |
| Dados Abertos do STJ | O portal oficial confirmou API CKAN e a consulta em tempo real retornou 11 conjuntos relacionados a jurisprudência, incluindo espelhos de acórdãos e acervo de decisões do DJe. | Integrada somente em modo catálogo; sem download ou ingestão automática de recursos. |
| LexML | A documentação oficial do Senado confirma pesquisa SRU em XML; a chamada de validação encontrou verificação de conexão. | Catalogada como consulta manual, sem automação. |
| Jurisprudência TJMG | Portal oficial identificado, sem API pública documentada no material validado. | Mantida para consulta manual; sem scraping ou automação de navegação. |
| Interface responsiva | A matriz de fontes, o catálogo do STJ e as ressalvas de uso mantiveram leitura em coluna única a 375 px. | Validada em desenvolvimento. |

> A matriz de fontes apresenta situação de integração, autenticação, cobertura, limite de uso e links de documentação. Nenhuma decisão, PDF, recurso do STJ ou dado do DataJud foi importado por essa etapa.

## Evidência de indisponibilidade do SRU LexML

Em **26/08/2026**, uma consulta mínima ao endereço SRU divulgado pelo portal LexML foi realizada sem qualquer técnica de contorno. Após a verificação de conexão do próprio Senado Federal, o servidor oficial retornou **HTTP 404 — “The requested resource [/busca/SRU] is not available”**. Por esse motivo, o conector permanece classificado como **consulta manual**. A plataforma não fará nova automação desse endpoint sem documentação atualizada ou resposta funcional oficial.

## Referências

[1] [CNJ — API Pública DataJud](https://datajud-wiki.cnj.jus.br/api-publica/)

[2] [STJ — Portal de Dados Abertos](https://dadosabertos.web.stj.jus.br/)

[3] [Senado Federal — Acervo LexML e Webservice](https://www12.senado.leg.br/dados-abertos/legislativo/legislacao/acervo-do-portal-lexml)

[4] [Projeto LexML — Dados Abertos](https://projeto.lexml.gov.br/transparencia/dados-abertos)
