# Validação visual — Home e Compêndio

**Data:** 27/08/2026  
**Escopo:** página inicial do Atlas Forense, painel “Compêndio Jurídico · Cobertura Catalogada”.

| Ambiente | Verificação | Resultado |
| --- | --- | --- |
| Desktop, 1280 × 720 | Painel posicionado após a abertura editorial; quatro métricas renderizadas; cartões de Betim/MG e Igarapé/MG visíveis. | Aprovado. |
| Móvel, 375 × 812 | Métricas e cartões empilhados em uma coluna, sem sobreposição do menu, do botão do acervo ou dos textos metodológicos. | Aprovado. |
| Domínio publicado | Documento inicial respondeu HTTPS 200 e o procedimento público `compendium.overview` retornou `authorityCount`, `cityCoverage` e Betim. | Aprovado no contrato público. |

O cartão de Igarapé/MG declara somente que não há acervo confirmado no catálogo atual. Essa ausência não é tratada como ausência de processos, nem como volume nulo da comarca. O painel usa contagens públicas reais de temas, teses, autoridades, julgados e fontes; ele não expõe partes, documentos, identificadores individuais ou dados de coleta.

> A verificação visual pelo navegador conectado ao domínio publicado não foi concluída porque a extensão excedeu o tempo de resposta. A equivalência visual foi conferida na build idêntica ao release e o contrato de dados foi validado diretamente no domínio externo.
