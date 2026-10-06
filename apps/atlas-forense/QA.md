# Verificação visual — 26/08/2026

## Desktop

O painel apresenta corretamente a linguagem Atlas Forense: barra lateral institucional, hero editorial, fichas de evidência, trilha lateral recorrente, régua de 2026 parcial, comparativos por causa/unidade/tempo e notas metodológicas. Os gráficos e rótulos permanecem legíveis no viewport de 1440 px.

## Móvel

No viewport de 390 px, a barra lateral se reduz ao bloco de marca, filtros e indicadores permanecem utilizáveis, e todos os gráficos seguem em coluna única sem sobreposição. As fichas de evidência preservam rótulos e a leitura da tabela por unidade continua disponível por rolagem.

## Validações técnicas

- `pnpm check`: aprovado.
- `pnpm build`: aprovado.
- Não há dados pessoais expostos no painel.
- A métrica de tempo é apresentada como último movimento observado, não como duração definitiva ou taxa de êxito.
