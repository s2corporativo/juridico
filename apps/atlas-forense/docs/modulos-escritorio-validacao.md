# Módulos do Escritório — validação (Painel JEC BH e Betim)

Atlas Forense · Tasks 1–4 reconstruídas e validadas em 04/10/2026

## Escopo entregue

| Módulo | Rota | Conteúdo |
|---|---|---|
| Clientes | `/escritorio/clientes` | cadastro (nome, CPF/CNPJ, contato) e lista com dossiê |
| Dossiê | `/escritorio/clientes/:id` | matérias com CNJ validado + atendimentos por canal |
| Comunicações | `/escritorio/comunicacoes` | conector DJEN (Comunica CNJ), caixa de comunicações, ferramentas de prazo e prescrição |
| Jurisprudência | `/escritorio/jurisprudencia` | STJ Dados Abertos + LexML SRU + registro manual TJMG (ver `docs/jurisprudencia-conector.md`) |

## Conector DJEN automático

- Fonte: API pública **Comunica CNJ** (`comunicapi.cnj.jus.br`), consulta por inscrição OAB
  com janela de disponibilização configurável (1–90 dias).
- Configuração (linha única em `office_djen_settings`): advogado responsável
  (**Clovis José Soares**), inscrição **OAB/MG 253.274**, conector habilitado,
  sincronização automática armada (ciclo 180 min; janela 10 dias; prazo padrão 15).
- Dedupe por `idComunicacao` (`sourceExternalId` único; ER_DUP_ENTRY benigno), vínculo
  por número CNJ validado (mod 97, Resolução 65/2008), sanitização LGPD do teor
  (e-mails e CPF/CNPJ mascarados, HTML removido, tamanho limitado).
- Botão **"Sincronizar agora"** e agendador idempotente (`startDjenAutoSync`).
- Falha graciosa: sem rede até o host da API, o estado é `failed` com mensagem
  "Falha na consulta DJEN: fetch failed" — servidor íntegro, estado e horário persistidos.

## Motor de prazos (portado do LexValida)

Detalhes normativos e casos em `docs/motor-prazos-lexvalida.md`. Interface na página de
Comunicações: calculadora (termo DJe/portal/ciência, úteis/corridos, dobra, feriados
locais), consulta de prescrição (catálogo com previsão legal expressa) e botão
**"Calcular pelo teor"** por comunicação.

## Validação executada em 04/10/2026

- Banco: migração `0009` aplicada em datadir restaurado (22 tabelas do Compêndio
  preservadas + 7 tabelas office_* recriadas); seeds P0 (7 fontes p0_obrigatoria com
  notas dos conectores) e office demo (4 clientes, 5 matérias, 7 atendimentos,
  8 comunicações — 3 DJEN com teor sanitizado).
- `tsc --noEmit` limpo; **145/145** testes Vitest verdes (44 arquivos).
- Navegador (agent-browser), zero erros de console em 7 páginas
  (/, /compendio, /escritorio/comunicacoes, /escritorio/clientes,
  /escritorio/clientes/1, /escritorio/jurisprudencia, /fontes):
  - Painel DJEN hidrata Clovis José Soares · OAB 253274 · MG · checkboxes ativos.
  - "Sincronizar agora" → `failed — Falha na consulta DJEN: fetch failed` (sandbox sem
    DNS para comunicapi.cnj.jus.br), estado persistido e visível após reload.
  - "Calcular pelo teor" no despacho DJEN ("no prazo de dez dias"): pré-preenche
    29/09/2026, **10 dias úteis extraídos do extenso**, termo DJe, vencimento
    **15/10/2026** com exclusão do 12/10 (Lei 6.802/1980) — conferido manualmente.
  - Jurisprudência: sync com diagnóstico por provedor; registro manual aceita CNJ
    válido e rejeita DV impossível; destacar/vincular operacionais.
  - Fontes: 7/7 cartões exibem selo **P0** e notas apontando os conectores.

## Salvaguarda de rede (importante)

Este ambiente de execução não alcança `comunicapi.cnj.jus.br` (DNS bloqueado) nem os
catálogos STJ/LexML de forma estável. A primeira coleta legítima do DJEN e a primeira
coleta real de jurisprudência ocorrem automaticamente assim que o sistema rodar com
internet — o ciclo automático está armado e o botão "Sincronizar agora" está
disponível. Nenhuma ação adicional de configuração é necessária.

## Evidências

- `download/djen-painel-pos-sincronizacao.png` — painel com estado `failed` persistido.
- `download/sincronizar-agora-djen.png` — "Calcular pelo teor": 10 dias extraídos do teor,
  vencimento 15/10/2026, memória auditável com exclusão do feriado de 12/10.
- `download/jurisprudencia-manual-registrada.png` — acervo com item manual destacado.
