# Módulo Treinamento do Escritório (Task 10)

## Propósito

O módulo Treinamento (`/escritorio/treinamento`) é o ponto de entrada da equipe no
Atlas Forense. Ele reúne, em uma única página do sistema, o conhecimento necessário
para operar o Painel JEC BH e Betim: a função de cada módulo, o fluxo de trabalho
recomendado do recebimento da comunicação até a vinculação da jurisprudência, as
regras do motor de prazos LexValida, as práticas de LGPD e uma verificação de
aprendizado (checklist + quiz com gabarito comentado).

A página é estática e client-side: o checklist de progresso é persistido apenas no
`localStorage` do navegador (`atlas-treinamento-checklist-v1`) e nenhum dado do
treinamento trafega para o servidor. Isso mantém o módulo livre de exigências de
autenticação ou infraestrutura, alinhado ao princípio do sistema de separar a
camada pública de metadados da camada operacional do escritório.

## Seções implementadas

1. **Como o Atlas Forense se organiza** — cartões explicando os seis módulos
   principais (Home/Jurimetria, Clientes, Comunicações, Jurisprudência, Fontes),
   com o papel de cada um no fluxo do escritório.
2. **Fluxo de trabalho recomendado** — seis passos numerados, da configuração do
   Conector DJEN até a vinculação de jurisprudência às matérias, incluindo o uso
   do botão "Calcular pelo teor" e a leitura do badge de origem do prazo.
3. **Motor de prazos LexValida** — tabela das regras implementadas (CPC arts. 219,
   220, 224, 229; Lei 11.419/2006 art. 5º; CPP art. 798) com demonstração dos dois
   estados do badge: "Extraído do teor" (verde) e "Fallback" (âmbar).
4. **LGPD e boas práticas** — princípio da necessidade, proibição de transferência
   de dados do escritório para camadas públicas e advertência sobre dados demo.
5. **Checklist de treinamento** — oito itens com barra de progresso e persistência
   local; permite ao responsável acompanhar a curva da equipe sem backend.
6. **Quiz de verificação** — seis questões de múltipla escolha com gabarito
   comentado imediato e pontuação final, cobrindo publicação no DJe, termo inicial,
   badge fallback, recesso do art. 220, dobra em autos eletrônicos e falha graciosa
   do conector.
7. **Perguntas frequentes** — erros 403/fetch failed, limites da memória de cálculo,
   ajuste manual de prazo e natureza dos dados de demonstração.

## Expansão de dados de treinamento

> **Nota (Task 11):** a expansão de dados de demonstração descrita abaixo foi
> **revogada** pela política de dados reais — o acervo demo foi purgado e os seeds
> de demonstração excluídos. Ver `docs/politica-de-dados.md`.

O seed `scripts/seed-expansion.mjs` (idempotente e transacional) amplia o acervo de
demonstração para dar matéria-prima realista ao treinamento:

| Tabela                 | Antes | Depois | Conteúdo novo |
|------------------------|-------|--------|---------------|
| `office_clients`       | 4     | 16     | 12 perfis JEC BH/Betim/Contagem (negativação, PIX, plano de saúde, e-commerce, consignado, notebook, academia, garantia, internet, cartão, reforma) |
| `office_matters`       | 5     | 14     | 9 matérias com 6 CNJs gerados e validados pelo DV da Resolução 65/2008 (mesmo algoritmo de `shared/office-module.ts`) |
| `office_attendances`   | 7     | 15     | 8 atendimentos com canal e sumário realista |
| `office_communications`| 8     | 22     | 14 comunicações (6 DJEN com teores que exercitam o extrator do LexValida — extenso, dígitos com parêntese, "quarenta e oito horas" negativo — e 8 manuais de 8 kinds distintos) |
| `office_jurisprudencia`| 0     | 12     | Ementas demo temáticas JEC (STJ/TJMG) com status variados e vínculo por matéria |

Todos os registros carregam `isDemoData = 1` e identificadores `demo-*`/`djen-demo-*`,
permitindo purgação futura em um único `DELETE ... WHERE isDemoData = 1` sem tocar
em dados reais.

## Treinamento do motor (regressão)

O arquivo `server/prazos-module.test.ts` ganhou dez cenários avançados que fixam o
comportamento do motor em situações de calendário e texto verificadas manualmente:

- **Recesso do art. 220**: ciência 15/12/2026 + 15 úteis atravessa a suspensão e
  vence em 05/02/2027; com `aplicarSuspensaoArt220: false`, o mesmo prazo vence em
  07/01/2027 — prova de que a suspensão é configurável por calendário do tribunal.
- **Feriados de novembro**: salto de 15/11 (República) e 20/11 (Consciência Negra,
  Lei 14.759/2023) em contagens de 10 e 5 dias úteis, com registro na memória.
- **Dobra da Fazenda** (CPC, art. 183) com base normativa na memória de cálculo.
- **Portal no limite**: consulta no 10º dia corrido ainda é tempestiva
  (Lei 11.419/2006, art. 5º, § 1º/§ 3º).
- **Vencimento corrido no Natal**: prorrogação para o próximo dia útil
  (CPP, art. 798, § 3º).
- **Extração com teores reais do acervo demo**: "quinze dias úteis" → 15 úteis;
  "vinte dias úteis" → 20 úteis; "5 (cinco) dias úteis" → 5 úteis; "trinta dias" →
  30 sem unidade; "quarenta e oito horas" → null (horas não são dias); acórdão sem
  prazo declarado → null (o sistema não presume).

Esses testes servem de régua para qualquer evolução futura do motor: se um novo
cenário de calendário ou de texto do DJEN falhar, o caso já está documentado aqui.

## Como estender

- Novas questões do quiz: ampliar o array `QUIZ` em
  `client/src/pages/OfficeTreinamentoPage.tsx` (a pontuação e o gabarito se adaptam
  automaticamente).
- Novos itens de checklist: atualizar `CHECKLIST` e, se a quantidade mudar,
  bumpar a chave do `localStorage` (ex.: `...-v2`) para invalidar progressos antigos.
- Novos cenários do motor: adicionar casos em `server/prazos-module.test.ts` —
  com fixtures de teor, nunca com dados semeados no banco.
