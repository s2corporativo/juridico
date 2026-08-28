# Árvore TPU Cível/Consumidor — mapeamento metodológico

**Data de obtenção:** 28/08/2026  
**Fonte primária:** Conselho Nacional de Justiça — Consulta Pública de Assuntos TPU  
**Versão informada pela fonte:** 26/05/2026  
**Estado:** árvore taxonômica oficial mapeada; validação de indexação DataJud ainda pendente.

## Resultado do mapeamento

O artefato versionado [`data/tpu-civil-consumer-tree.json`](../data/tpu-civil-consumer-tree.json) contém **405 nós**, formados pelas duas raízes autorizadas e **403 descendentes** retornados pela expansão pública sequencial da árvore do CNJ. A raiz `899` (Direito Civil) possui 338 descendentes e a raiz `1156` (Direito do Consumidor), 65. Cada nó registra somente `code`, `label`, `parentCode`, `rootCode`, `depth` e, quando aplicável, `expandable`.

| Raiz TPU | Rótulo | Descendentes mapeados | Regra de inclusão futura |
| ---: | --- | ---: | --- |
| 899 | Direito Civil | 338 | A raiz e cada descendente com cadeia `parentCode` íntegra até 899. |
| 1156 | Direito do Consumidor | 65 | A raiz e cada descendente com cadeia `parentCode` íntegra até 1156. |

## Método e controles

O gerador `scripts/refresh-tpu-civil-consumer-tree.mjs` lê a página oficial em ISO-8859-1, respeita uma pausa entre expansões e percorre somente pastas que a própria interface marca com controle de expansão. Ele limita a travessia a 2.000 nós, rejeita duplicidades, ciclos, raízes estranhas e filhos sem ancestral previamente registrado. O resultado não armazena HTML, resposta bruta, identificador processual, parte, documento, credencial ou dado pessoal.

> A árvore TPU descreve taxonomia de assuntos. Ela não prova competência, município, órgão julgador, cobertura territorial, quantidade de processos, resultado processual ou adequação automática do filtro para o DataJud.

## Uso futuro permitido

Quando houver validação específica no DataJud/TJMG, uma consulta poderá usar a lista de códigos desta árvore em `terms` sobre `assuntos.codigo`, sempre com `size: 0`, `_source: false`, período, classe, grau e órgão explicitamente declarados. A consulta deverá permanecer agregada e produzir manifesto sanitizado. A série nacional continua isolada e não poderá absorver o futuro piloto Cível/Consumidor.

Antes de qualquer coleta temática, deverão ser comprovados: a indexação de cada código efetivamente usado, a compatibilidade do limite de termos, a classe 436, o grau `JE` e os órgãos DataJud com proveniência TJMG. Municípios sem órgão confirmado continuarão excluídos.

## Referências

[1] [CNJ — Consulta Pública de Assuntos TPU](https://www.cnj.jus.br/sgt/consulta_publica_assuntos.php).

[2] [TJMG — Lista de Assuntos CNJ](https://www4.tjmg.jus.br/juridico/sf/listaAssuntosCNJ.jsp).
