# Operação do Compêndio Jurídico

Data de consolidação: **26/08/2026**.

> O Compêndio é uma camada de pesquisa auditável. A existência de um registro, uma tese ou um vínculo temático não substitui a leitura do inteiro teor, a conferência da fonte primária e a revisão humana antes de qualquer uso profissional.

## Separação de funções

| Camada | Finalidade | Estado atual | Limite de atuação |
|---|---|---|---|
| Atlas Forense | Censo, recortes, série mensal e exportações metodológicas. | Operacional. | Não converte amostra ou movimento em taxa de êxito. |
| Compêndio público | Pesquisa de julgados, fontes, teses e taxonomia. | Operacional. | Exibe somente metadados públicos compatíveis. |
| Curadoria | Conferência da fonte, taxonomia, tese e elegibilidade. | Processo definido. | Exige revisão humana e documento ou URL oficial. |
| Central de controle | Pré-validação técnica de lotes candidatos. | Operacional para perfil `admin`. | Não grava, publica ou armazena documentos. |

## Fluxo de entrada de um novo lote

| Ordem | Controle | Resultado esperado |
|---|---|---|
| 1 | Inventário | Identificação da origem, do formato e do hash do conjunto recebido. |
| 2 | Pré-validação administrativa | Rejeição de duplicidades internas, campos pessoais proibidos e URL inadequada para fonte oficial. |
| 3 | Curadoria humana | Conferência da existência de fonte primária e da adequação do conteúdo ao escopo jurídico. |
| 4 | Normalização | Definição de `externalId`, status da fonte, tribunal, ramo de justiça, tipo de decisão, tema e taxonomia. |
| 5 | Revisão de elegibilidade | Registro dos itens importáveis, excluídos e pendentes, com motivo. |
| 6 | Importação controlada | Etapa futura, sempre com lote, versão, fonte e evento de auditoria. |
| 7 | Publicação | Exposição somente do contrato público, sem dados pessoais desnecessários. |

## Contrato da pré-validação

A central aceita uma lista JSON de candidatos apenas para simulação. Cada candidato deve ter identificador externo, tribunal, ramo de justiça, tipo de decisão e situação da fonte. Quando a situação for `official_confirmed`, exige-se URL HTTPS. A pré-validação também bloqueia chaves de metadados associadas a parte, CPF, endereço, telefone, e-mail ou documento pessoal.

| Verificação | Regra aplicada | Efeito |
|---|---|---|
| Identificador externo | Deve ser informado e único dentro do lote. | Rejeita duplicidade interna. |
| Número CNJ | Quando informado, não pode se repetir no mesmo lote. | Rejeita duplicidade interna. |
| Campos mínimos | Tribunal, ramo de justiça e tipo de decisão são obrigatórios. | Rejeita registro incompleto. |
| Privacidade | Metadados com campos incompatíveis com a camada pública são vedados. | Rejeita antes da curadoria. |
| Fonte oficial | Status confirmado exige URL HTTPS. | Rejeita fonte oficial sem endereço verificável. |

## Papéis técnicos

| Papel | Pode consultar | Pode pré-validar | Pode importar/publicar |
|---|---:|---:|---:|
| Público | Sim, no contrato público. | Não. | Não. |
| Usuário autenticado sem papel administrativo | Conforme escopo de consulta. | Não. | Não. |
| `admin` | Sim. | Sim, em modo de simulação. | Ainda não; a importação persistente permanece deliberadamente fora desta versão. |

## Escopo e não escopo

A versão atual é deliberadamente conservadora. Ela não recebe PDFs, não armazena bytes de documentos, não publica conteúdo automaticamente, não contorna CAPTCHA, autenticação ou sigilo e não cria uma conclusão estatística a partir do lote piloto local. A expansão nacional dependerá de cobertura comparável, fonte pública acessível, chave temporária do DataJud quando necessária e manifesto de execução auditável.
