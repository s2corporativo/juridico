# Prontidão do Censo Nacional

Data da validação: **26/08/2026**.

O Atlas Forense passou a possuir uma camada persistente para executar e auditar o futuro censo nacional DataJud. A estrutura separa **execução** de **métrica agregada mensal**, sem guardar número de processo, partes, conteúdo de petições ou credenciais.

| Componente | Estado atual | Regra de uso |
|---|---|---|
| `national_census_runs` | Estrutura criada; nenhuma execução persistida. | Cada coleta registrará período, situação, cobertura, versão metodológica e impressão digital de consulta sem segredo. |
| `national_census_metrics` | Estrutura criada; zero linhas persistidas. | Apenas distribuições e baixas agregadas por tribunal, UF e mês poderão ser armazenadas. |
| Página `/nacional` | Validada com estado **Não Iniciado** e cobertura de 0%. | Não apresenta esse estado como estatística nacional. |
| Conector DataJud | Preparado e protegido; chave ainda ausente. | Ativação somente com credencial temporária em ambiente seguro e revisão de cobertura. |

> A inexistência de linhas nacionais é uma condição metodológica visível, e não uma lacuna preenchida por estimativa. O núcleo local do Atlas continua distinto do censo Brasil.
