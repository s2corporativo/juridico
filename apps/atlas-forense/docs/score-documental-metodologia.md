# Score Documental e Cobertura de Evidência

O **score documental** é um indicador de completude do registro e de sua rastreabilidade. Ele não é pontuação de tese, opinião sobre magistrado, probabilidade de êxito ou substituto para a revisão jurídica.

| Critério verificável | Pontos | Finalidade |
|---|---:|---|
| Fonte oficial confirmada | 25 | Distinguir fonte documental apta de fonte pendente. |
| URL pública HTTPS | 15 | Permitir conferência direta da origem. |
| Hash SHA-256 | 10 | Registrar integridade do material de origem. |
| Número processual | 10 | Permitir identificação pública quando disponível. |
| Data da decisão | 10 | Permitir análise temporal e conferência. |
| Tribunal e órgão julgador | 10 | Preservar contexto institucional mínimo. |
| Nota de validação | 5 | Tornar explícito o critério humano/documental aplicado. |
| Taxonomia | 5 | Vincular o registro ao vocabulário controlado. |
| Tese associada | 5 | Evidenciar a relação temática, sem converter em precedente vinculante. |
| Lote auditado | 5 | Manter a proveniência da ingestão. |

Os níveis são **robusta** (85 a 100), **suficiente** (65 a 84) e **incompleta** (até 64). A cobertura, por sua vez, consolida apenas quantidade de registros, fontes, tribunais, URLs oficiais e intervalo temporal. Ambos os indicadores devem ser lidos junto com a fonte, o inteiro teor e a nota metodológica.

## Validação da apresentação e da fórmula

Em **27/08/2026**, o procedimento de qualidade respondeu ao acervo piloto com média documental de **88/100**, cartões por julgado e cobertura por fonte/tribunal. O indicador permanece acompanhado da advertência de que mede **completude e rastreabilidade**, não mérito, vigência ou prognóstico. A seção foi validada em desktop e em viewport móvel de **375 × 812 px**, mantendo os cartões e a ressalva em fluxo de uma coluna.

Os testes automatizados cobrem resultados de **100 pontos/robusta**, **70 pontos/suficiente**, **0 ponto/incompleta**, cobertura de **33%** e **100%**, e média de **88 pontos** para o conjunto controlado `[90, 85, 90]`, além de conjunto vazio. A inspeção do contrato público mostrou somente campos de identificação pública do registro, tema, tribunal, fonte, data, score, níveis e contagens agregadas; não há atributos de CPF, e-mail, telefone, endereço, parte ou credencial.

Nesta versão, o score é atribuído aos **julgados**. A pontuação autônoma de teses permanece pendente de critérios próprios, para evitar uma equivalência imprópria entre completude da evidência e qualidade da formulação jurídica.

## Score autônomo de teses

As teses passaram a receber avaliação independente: fonte (15), redação de título/descrição (20), posição declarada (10), fundamentação (15), requisitos de prova (10), fatores adversos (10), vínculo taxonômico (5), autoridade relacionada (10) e revisão datada (5). A escala totaliza 100 pontos e mantém os níveis robusta, suficiente e incompleta, mas sua ressalva é própria: mede a completude de redação e dos vínculos documentais, jamais correção jurídica, força persuasiva, vigência ou prognóstico.

O cálculo foi validado com tese integral (100 pontos, nível robusta) e tese sem metadados (nível incompleta), dentro da bateria de testes. Os cartões de tese passaram a exibir o score separado dos julgados e foram verificados em desktop e em viewport móvel de **375 × 812 px**, sem truncamento do selo ou da ressalva metodológica.

## Validação da apresentação

Em **27/08/2026**, o procedimento de qualidade respondeu ao acervo piloto com média documental de **88/100**, cartões por julgado e cobertura por fonte/tribunal. O painel preservou a advertência de que a métrica descreve **completude e rastreabilidade**, não mérito, vigência ou prognóstico. A seção foi verificada em desktop e em viewport móvel de **375 × 812 px**, sem expor identificadores pessoais. Nesta versão, o score é atribuído aos **julgados**; a pontuação autônoma de teses continua pendente de critérios próprios.
