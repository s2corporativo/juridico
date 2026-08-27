# Projeto de Baixas Nacionais — DataJud

## Objetivo e escopo

Apurar **baixas definitivas observadas do coorte JEC** por tribunal e mês, sem converter a série em estoque, produtividade, taxa de baixa ou `clearance rate`. A definição adotada é o movimento de nome exatamente normalizado como **“Baixa Definitiva”**, deduplicado por processo e mês. [1]

## Minimização e trilha de auditoria

| Etapa | Dado tratado | Regra de proteção |
|---|---|---|
| Consulta | Classe 436, grau JE, coorte de ajuizamento e movimento elegível. | Solicitar somente `numeroProcesso`, nome e data de movimentos. |
| Deduplicação | Número de processo em memória. | Converter imediatamente em HMAC com segredo efêmero por execução; não escrever identificador, hash ou segredo em disco/banco/log. |
| Persistência | Tribunal, UF, mês, métrica e contagem. | Gravar somente agregados após o encerramento controlado da execução; nenhuma página bruta é persistida. |
| Manifesto | Total percorrido, movimentos elegíveis, processo-mês deduplicados, aliases, erros e versão do método. | Não incluir resposta bruta, números de processo, credenciais ou partes. |

## Paginação e critério de parada

O coletor consulta cada alias com filtro de classe, grau, intervalo de ajuizamento e movimento elegível. A implementação atual usa cursor `scroll` de vida curta, com lote de 250 registros, processamento e descarte de cada página em memória e limpeza explícita do cursor ao fim do alias. A cobertura é auditada por páginas e registros efetivamente percorridos; qualquer alias com erro, limite de páginas, estrutura incompatível ou paginação interrompida impede apresentação como série nacional completa.

> A coleta nacional integral permanece bloqueada. A autorização recebida foi usada apenas para o piloto TJMG descrito abaixo; cada futura execução exige `--execute`, autorização transitória explícita e teto operacional declarado.

## Dry-run verificado

Em **26/08/2026**, o coletor foi executado sem a autorização de produção. O manifesto registrou modo `dry_run`, **27 tribunais esperados**, lote de **250 registros por página**, período de **2025-01 a 2026-08**, classe **436**, grau **JE** e movimento exato **Baixa Definitiva**. O bloqueio ocorreu antes de buscar chave, chamar endpoint de processos ou criar arquivo de respostas. A execução só prossegue com o argumento `--execute` e a variável transitória `NATIONAL_LOWER_AUTHORIZATION=approved`.

O modo de execução possui agora telemetria por alias: páginas percorridas, registros processados, movimentos elegíveis, pares processo-mês deduplicados, erro sanitizado e estado final. O manifesto consolida tribunais respondidos/falhos, percentual de cobertura e totais de paginação; não admite marcadores pendentes nem identificadores individuais. Os testes simulam término por página vazia, cursor inválido, falha de alias, cobertura parcial e descarte dos identificadores após agregação.

## Piloto TJMG concluído

Em **27/08/2026**, houve uma única execução limitada no alias `tjmg`, com teto de **3 páginas**. O manifesto sanitizado registrou **750 registros processados**, **806 movimentos elegíveis** e **756 pares processo-mês deduplicados**, resultando em **10 células mensais agregadas**. Como o teto foi alcançado, o estado permaneceu `partial`, a cobertura nacional foi **0%** e nenhum total foi importado no painel. Os identificadores, HMACs efêmeros, cursor, chave e respostas foram descartados ao fim da execução.

## Referência

[1] [Skill Jurimetria de Juizados Públicos — consultas DataJud](../skills/jurimetria-juizados-publicos/references/datajud_queries.md)
