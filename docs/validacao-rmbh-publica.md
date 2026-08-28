# Validação pública — cobertura RMBH

**Data:** 28/08/2026  
**URL:** `https://atlas.depaulateixeira.adv.br/rmbh`  
**Método:** navegação e árvore acessível em navegador isolado.

A rota pública carregou com estado `completed`, **20 de 34 municípios** com vínculo literal no recorte, **66 órgãos** retornados e período `2025-01` a `2026-08`. A árvore acessível confirmou os dois filtros: os 34 municípios legais da RMBH e as seis frentes temáticas iniciais — Cível e consumidor; Família, sucessões e registros; Público, tributário e saúde; Penal e JECRIM; Ambiental; Trabalho e previdenciário. A exportação CSV metodológica estava disponível.

O conteúdo público desta verificação ainda correspondia ao release anterior à correção de qualificação institucional. A alteração local já concluída distingue órgãos cujo rótulo menciona Juizado Especial/Unidade Jurisdicional daqueles que foram retornados pela classe 436, mas não trazem essa identificação no nome. Ela precisa ser promovida antes da validação final.

> A rota não apresentou processos individuais, partes, documentos, números de processo, respostas brutas ou credenciais. As lacunas foram exibidas como ausência de vínculo literal, sem inferência por município-sede ou proximidade.

## Validação após a qualificação institucional

Após a promoção da release `20260828-134318-rmbh-qualified`, a rota pública confirmou os mesmos **20/34 municípios** e **66 órgãos** com alias TJMG preservado. Cada cartão passou a apresentar, separadamente, o total de órgãos no recorte, a contagem de rótulos que identificam expressamente Juizado Especial ou Unidade Jurisdicional e a soma de facetas. Exemplos confirmados: Belo Horizonte exibiu 29 órgãos e 15 rótulos JEC/UJ; Betim, 5 órgãos e 1 rótulo JEC/UJ; Igarapé, 2 órgãos e 1 rótulo JEC/UJ.

Órgãos como Varas Cíveis, Família e CEJUSC continuaram visíveis apenas com a ressalva “Rótulo institucional não identifica JEC/UJ; mantido apenas como retorno do recorte classe 436.” A tela também preservou os filtros de município e de ramo jurídico, bem como o alerta de que a soma de facetas não significa processos únicos, estoque, taxa, produtividade ou êxito.

## Responsividade

Na resolução móvel de **390 × 844 px**, a rota RMBH permaneceu em coluna única, com largura útil de 358 px. O botão de exportação ocupou a largura disponível, os indicadores, filtros e cartões foram empilhados sem corte horizontal e o alerta metodológico permaneceu ao final da leitura. A página teve altura de 10.752 px, compatível com a exibição completa das 34 localidades e respectivas lacunas de cobertura.

O filtro territorial foi selecionado em **Betim** na mesma resolução e reduziu a área de resultados a um único cartão. A sessão isolada, porém, havia sido aberta antes da promoção do release qualificado e manteve recursos já carregados em cache; por isso, a confirmação final de conteúdo deve ocorrer após navegação com parâmetro de cache-busting, sem usar essa leitura prévia como evidência da versão atual.

Após recarga com parâmetro de versão, o navegador externo confirmou o texto atualizado: “Órgãos TJMG retornados no recorte da classe 436” e a ressalva de que a identificação institucional de unidade JEC é exibida separadamente. O limite de leitura também passou a declarar que o retorno pela classe 436 não substitui a identificação institucional de competência. A confirmação foi feita no release `20260828-134318-rmbh-qualified`, sem erro de hidratação observado.
