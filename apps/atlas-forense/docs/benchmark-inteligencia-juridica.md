# Benchmark de Inteligência Jurídica e Jurimetria

Pesquisa realizada em **26/08/2026**, com verificação de fontes institucionais e de documentação oficial. As referências abaixo servem para identificar padrões de produto; não comprovam cobertura, preço ou adequação automática ao contexto brasileiro.

| Referência | Padrão verificável | Aplicação prudente no Atlas |
|---|---|---|
| DataJud/CNJ | Base nacional centralizada, API pública e painéis temáticos. | Continuar a separar fonte, cobertura, métrica, período e limitações em cada visualização. |
| Lex Machina | Dados estruturados, curadoria, métricas de eventos e integração por API. | Criar fichas de evento processual somente após taxonomia e validação humana; não inferir êxito por movimento. |
| vLex Vincent | RAG sobre fontes verificáveis, citação e política de retenção zero. | Construir pesquisa assistida que responda apenas a partir de fontes catalogadas e apresente trecho, URL e status de evidência. |
| Jusbrasil Soluções | API com recursos, paginação, credenciais, monitoramento e webhooks. | Projetar conectores opcionais por fonte, com escopo mínimo, credencial isolada e trilha de evento; sem ligar monitoramento por padrão. |
| Bloomberg Law | Pesquisa conversacional com fontes, classificação de tipos e visualização analítica. | Inserir comparação apenas sobre taxonomia estável e manifestos de cobertura; manter cartões de evidência antes de qualquer ranking. |
| Westlaw / CoCounsel | Pesquisa verificável, análise de documento e investigação que mostra fontes. | Adotar protocolo de “resposta com prova”: tese, fonte, trecho, recorte, confiança e alerta de revisão humana. |

## Padrões de governança encontrados

As referências verificadas convergem em cinco controles: **fonte identificável**, **citação verificável**, **curadoria ou revisão humana**, **segregação de dados sensíveis** e **integração com trilha de eventos**. O Atlas já possui base forte em fonte, escopo, cobertura e limitações; os ganhos mais relevantes são uma camada de pesquisa assistida com evidência, fila de revisão e alertas de alteração de precedentes.

## Referências

[1] [CNJ — DataJud](https://www.cnj.jus.br/sistemas/datajud/)

[2] [Lex Machina — How it Works](https://lexmachina.com/what-we-do/how-it-works/)

[3] [vLex — Modelos, RAG e Privacidade do Vincent](https://support.vlex.com/vincent-by-vlex/vincent/security-privacy-and-compliance/understanding-the-ai-models-used-by-vincent)

[4] [Jusbrasil Soluções — Documentação da API](https://api.jusbrasil.com.br/docs/index.html)

[5] [Bloomberg Law — Legal AI](https://pro.bloomberglaw.com/products/ai-and-bloomberg-law/)

[6] [Thomson Reuters — Westlaw Precision](https://legal.thomsonreuters.com/en/products/westlaw-precision)
