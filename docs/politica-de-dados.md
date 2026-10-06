# Política de dados — Atlas Forense

## Escopo

O Atlas Forense é uma ferramenta de pesquisa, consulta e análise jurídica com
fontes públicas e revisão humana. Ele não cadastra clientes, casos, atendimentos,
comunicações particulares nem prazos do escritório. Também não recebe dados
privados do EJC por integração automática.

Dados publicados devem ter fonte, período, cobertura, limitações e estado de
revisão identificáveis. Exemplos usados em testes não são inseridos no banco de
produção. Conteúdo de IA é apresentado como síntese ou comparação assistida,
com fonte verificável e sem conclusão automática do caso concreto.

## Entrada de dados permitida

- Metadados e agregados de fontes oficiais, importados por processos controlados.
- Registros do Compêndio com origem e lote identificados, após revisão humana.
- Metadados editoriais aprovados pela fila administrativa.

O catálogo de fontes pode mencionar DJEN e LexML como referências institucionais.
Isso não habilita coleta de comunicações por OAB nem cadastro de processos ou
clientes. O catálogo STJ consulta somente metadados públicos de datasets.

## Dados legados

Tabelas `office_*` criadas por versões anteriores são preservadas exclusivamente
para transferência segura. Nenhuma rota, página, serviço ou agendador do Atlas
deve lê-las ou alterá-las. A política de isolamento e migração está em
[`dados-legados-isolados.md`](dados-legados-isolados.md). Elas não fazem parte do
produto Atlas.
