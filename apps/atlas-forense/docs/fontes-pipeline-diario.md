# Fontes e governança do pipeline diário

## Escopo inicial

O pipeline diário deve coletar somente metadados e avisos públicos de fontes institucionais, gravando novos itens em fila de revisão humana. Nenhum conteúdo deve ser publicado automaticamente como tese, orientação jurídica, vigência normativa ou precedente aplicável.

| Fonte | Uso inicial | Regra de ingestão |
|---|---|---|
| STF — Pesquisa de Jurisprudência | Julgamentos relevantes, Informativos, súmulas e publicações temáticas | Capturar título, tipo, data pública, URL oficial e resumo descritivo; exigir revisão antes de publicar. |
| STJ — portal e pesquisa de jurisprudência | Notícias institucionais, informativos, jurisprudência e bibliografias selecionadas | Capturar somente metadados públicos; não baixar nem armazenar inteiro teor automaticamente. |
| Planalto — legislação federal | Alterações, consolidações e textos oficiais | Registrar espécie, número, data, ementa, URL e status de revisão; não inferir vigência sem checagem humana. |
| TJMG — fontes institucionais | Comunicados e jurisprudência local pertinente ao piloto RMBH | Manter escopo separado do DataJud; preservar comarca/órgão apenas quando a fonte primária confirmar. |
| CNJ — DataJud e publicações oficiais | Metadados e séries agregadas já autorizadas | Não misturar atualizações editoriais com o censo nacional ou pilotos temáticos. |

## Governança

A rotina diária, prevista para 06:00 UTC (03:00 em Brasília), deve ser idempotente. Cada item novo permanece com estado `pending_review`; somente revisão humana pode promover para `approved` e torná-lo público. Falhas de fonte geram estado sanitizado e não interrompem necessariamente as demais fontes. Conteúdos de terceiros não oficiais ficam fora do escopo inicial.

O mapa de teses deve usar relações já catalogadas entre tese, tema, código TPU, fonte e órgão. A pesquisa de uma tese não deve gerar aconselhamento individual, probabilidade de êxito, inferência de vigência ou relação causal não comprovada.

## Fontes verificadas

1. [STF — Pesquisa de Jurisprudência](https://portal.stf.jus.br/jurisprudencia/), incluindo pesquisa, Informativo STF, publicações temáticas, súmulas e julgamentos de especial relevância.
2. [STJ — Portal institucional](https://www.stj.jus.br/), com pesquisa e publicações institucionais abertas.
3. [Planalto — Lei Complementar nº 95/1998](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp95.htm), fonte oficial consultada para estrutura e consolidação de legislação.
4. [CNJ — DataJud](https://www.cnj.jus.br/sistemas/datajud/), fonte pública para dados processuais agregados conforme escopo autorizado.
