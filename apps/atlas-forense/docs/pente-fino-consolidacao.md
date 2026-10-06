# Pente-fino de Consolidação — Atlas Forense

Data: **26/08/2026**.

| Eixo | Constatação | Tratamento |
|---|---|---|
| Compêndio | Uma decisão com mais de um vínculo taxonômico exibia apenas o último tema. | Corrigido por agrupamento determinístico de todos os temas, com teste unitário. |
| Busca jurídica | Falha da consulta aparecia como resultado vazio. | Corrigido com estado de erro explícito; a ausência de resultado continua distinta da indisponibilidade. |
| Catálogo STJ | Consulta era disparada a cada caractere e não distinguia retorno vazio. | Adicionado atraso controlado de 300 ms e mensagem própria para zero resultados. |
| Migrações | Tabelas haviam sido aplicadas antes da criação do histórico Drizzle. | Histórico reconciliado com os hashes e marcos temporais das três migrações aplicadas, sem reexecução de DDL. |
| Depuração local | Respostas de rede podiam manter valores sensíveis em arquivos de log de desenvolvimento. | Adicionada redação recursiva de chaves, CPF, e-mail, token e número de processo antes da escrita local. |
| Desempenho | A aplicação carregava todos os módulos na entrada e gerava bundle inicial excessivo. | Páginas passaram a usar carregamento sob demanda; bibliotecas de gráficos, interface, dados e React foram separadas em chunks menores. |
| Toolchain | O plugin de localização JSX declarava compatibilidade apenas até Vite 5 e o selo local gerava aviso de resolução em produção. | Plugin não essencial removido; o selo passou a usar URL persistente aplicada pelo componente, e a build terminou sem esses dois avisos. |
| Dados nacionais | Há estrutura e execução planejada, mas não censo Brasil. | Mantida a cobertura de 0% enquanto a chave temporária DataJud não é disponibilizada. |

## Verificação de rotas

Em **26/08/2026**, as rotas `/`, `/compendio`, `/fontes`, `/estrutura`, `/controle` e `/nacional` foram abertas após o reinício do ambiente. A rota `/fontes` apresentou o estado de carregamento durante a consulta inicial ao banco e, em seguida, exibiu a matriz institucional corretamente; não houve falha persistente de carregamento. O catálogo externo do STJ permaneceu em estado de consulta enquanto a fonte remota respondia, sem modificar o catálogo local.

As mesmas rotas públicas e administrativas relevantes foram verificadas em viewport móvel de **375 × 812 px**. A navegação, os títulos editoriais, cartões de fonte, controles de ingestão e estado de prontidão nacional mantiveram leitura e hierarquia sem conteúdo cortado.

Após a referência do selo ser movida para URL persistente no componente, a página inicial confirmou a renderização da marca na barra lateral. A rota `/fontes` também completou a matriz de fontes sem erro; o estado de consulta do catálogo STJ permaneceu visível e separado da matriz local enquanto o serviço externo processava a requisição.

> O conector DataJud, o catálogo STJ e a ponte futura ao EJC permanecem sujeitos aos seus limites declarados: credencial transitória, metadados de catálogo e integração externa desativada, respectivamente.
