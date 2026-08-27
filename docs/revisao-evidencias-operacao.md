# Operação — Revisão de Evidências e Dossiê de Citação

## Ciclo de revisão

O registro jurídico já catalogado pode ingressar na fila com uma **motivação segura** e prioridade. A decisão é exclusivamente administrativa: **aprovar**, **rejeitar** ou **devolver**. Uma decisão final não é reescrita; nova análise exige novo ciclo de revisão, preservando os eventos anteriores.

| Elemento | Controle implementado |
|---|---|
| Acesso | Fila, entrada e decisão são procedimentos exclusivos do papel `admin`. |
| Conteúdo | Motivação e nota de decisão passam pela mesma triagem que bloqueia CPF, e-mail, telefone, endereço e chaves pessoais. |
| Auditoria | Enfileiramento e decisão geram evento associado ao identificador público do julgado. |
| Persistência | A fila armazena somente estado, prioridade, motivo, decisão, responsável técnico e datas; não recebe PDF ou resposta bruta. |
| Publicação | O dossiê público expõe o estado de revisão e eventos sanitizados, nunca dados de partes. |

## Dossiê de citação

Cada dossiê reúne identificação pública, fonte registrada, lote, hash, taxonomia, teses associadas, nota de validação e estado de revisão. Ele pode ser exportado em Markdown ou renderizado para impressão. Não é parecer, não confirma vigência de precedente e não dispensa a leitura do inteiro teor ou revisão humana.

Em **27/08/2026**, o dossiê de um registro real do lote piloto foi renderizado em PDF por navegador headless. A extração textual confirmou **“Dossiê de citação e evidência”**, **“Proveniência”**, **“Revisão humana”** e a ressalva de limite profissional. A geração Markdown é coberta por teste de contrato que exige proveniência e a advertência de revisão humana. A validação operacional de enfileirar/decidir permanece reservada a um administrador autenticado e não foi simulada com conteúdo artificial.

Na mesma data, a ação **“Baixar Markdown”** foi acionada em navegador automatizado sobre esse mesmo dossiê real. O navegador confirmou a criação e o download do arquivo com identificador público do registro. Assim, a exportação foi validada em ponta a ponta; o conteúdo continua coberto pelo teste de contrato de proveniência, classificação e ressalva profissional.

> Antes do uso profissional, confirme a URL de origem, o inteiro teor, a aderência ao caso concreto e a atualidade da fonte.
