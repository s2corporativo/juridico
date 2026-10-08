# Módulo Treinamento do Escritório (Task 10)

## Propósito

O módulo Treinamento (`/escritorio/treinamento`) é o ponto de entrada da equipe no
Atlas Jurídico. Ele reúne, em uma única página do sistema, o conhecimento necessário
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

1. **Como o Atlas Jurídico se organiza** — cartões explicando os seis módulos
   principais (Home/Jurimetria, Clientes, Comunicações, Jurisprudência, Fontes),
   com o papel de cada um no fluxo do escritório.
2. **Fluxo de trabalho recomendado** — seis passos numerados, da configuração do
   Conector DJEN até a vinculação de jurisprudência às matérias, incluindo o uso
   do botão "Calcular pelo teor" e a leitura do badge de origem do prazo.
3. **Motor de prazos LexValida** — tabela das regras implementadas (CPC arts. 219,
   220, 224, 229; Lei 11.419/2006 art. 5º; CPP art. 798) com demonstração dos dois
   estados do badge: "Extraído do teor" (verde) e "Fallback" (âmbar).
4. **LGPD e boas práticas** — princípio da necessidade, proibição de transferência
   de dados do escritório para camadas públicas e política de dados reais
   (nenhum registro fictício no sistema).
5. **Checklist de treinamento** — oito itens com barra de progresso e persistência
   local; permite ao responsável acompanhar a curva da equipe sem backend.
6. **Quiz de verificação** — seis questões de múltipla escolha com gabarito
   comentado imediato e pontuação final, cobrindo publicação no DJe, termo inicial,
   badge fallback, recesso do art. 220, dobra em autos eletrônicos e falha graciosa
   do conector.
7. **Perguntas frequentes** — erros 403/fetch failed, limites da memória de cálculo,
   ajuste manual de prazo e política de dados reais.

## Política de dados reais (Task 11)

O Atlas Jurídico não deve usar dados fictícios em operação. Materiais de treinamento
que existiu nas Tasks 6–10 (clientes, matérias, atendimentos, comunicações e
julgados com `isDemoData = 1`) foi integralmente purgado: 79 registros removidos,
coluna `isDemoData` eliminada do schema e seeds de demonstração excluídos do
repositório. A política vigente, as origens legítimas de dados e as queries de
auditoria estão documentadas em `docs/politica-de-dados.md`.

Para treinar a equipe, use os recursos desta página (módulos, regras, checklist e
quiz): nada do que é feito aqui grava registros no banco. Cenários novos do motor
de prazos entram como *fixtures* em `server/prazos-module.test.ts`, nunca como
linhas no banco de dados.

## Treinamento do motor (regressão)

O arquivo `server/prazos-module.test.ts` ganhou treze cenários avançados que fixam o
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
- **Extração com teores de referência (fixtures)**: "quinze dias úteis" → 15 úteis;
  "vinte dias úteis" → 20 úteis; "5 (cinco) dias úteis" → 5 úteis; "trinta dias" →
  30 sem unidade; "quarenta e oito horas" → null (horas não são dias); acórdão sem
  prazo declarado → null (o sistema não presume).

Esses testes servem de régua para qualquer evolução futura do motor: se um novo
cenário de calendário ou de texto do DJEN falhar, o caso já está documentado aqui.

## Como estender

- Novos cenários do motor de prazos: adicionar casos com *fixtures* de teor em
  `server/prazos-module.test.ts` (nunca semear dados de teste no banco).
- Novas questões do quiz: ampliar o array `QUIZ` em
  `client/src/pages/OfficeTreinamentoPage.tsx` (a pontuação e o gabarito se adaptam
  automaticamente).
- Novos itens de checklist: atualizar `CHECKLIST` e, se a quantidade mudar,
  bumpar a chave do `localStorage` (ex.: `...-v2`) para invalidar progressos antigos.
