# Homologação de isolamento de dados — JuridIA

Data: 10/10/2026. Branch: `fix/juridia-rag-safety-audit-20261010`.

## Implementações

- `/api/clients`: GET filtrado por `userId`, POST vincula ao usuário autenticado (não à conta demonstrativa), PATCH/DELETE limitados ao proprietário, com acesso administrativo institucional.
- `/api/cases`: GET e mutações condicionados à titularidade do cliente, com escopo de administrador; POST exige cliente acessível.
- `/api/documents`: GET, PATCH e DELETE usam `userId`; alteração do conteúdo volta a `draft`.
- `/api/case-analysis`: POST grava no usuário autenticado; GET impede leitura cruzada para não administradores.
- `/api/grafo?view=case`: exige acesso ao caso antes de gerar o grafo.
- `/api/citations/verify`: quando informado `documentId`, verifica titularidade antes de processar o texto.
- Estatísticas de clientes: documentos de outros advogados não integram a contagem do usuário comum; usa queries agrupadas para evitar N+1.

## Ensaios reais isolados (não produção)

Um banco SQLite temporário foi criado a partir da cópia de homologação na VPS. Foram inseridos **apenas usuários, clientes, casos, documentos e análises fictícios**.

1. Autenticação via cookie assinado para dois advogados e um administrador.
2. GET clientes, casos, documentos e análises: A enxerga A e não B; B enxerga B e não A.
3. PATCH/DELETE com identificador de registro de outro advogado: 404 em clientes, casos e documentos.
4. Grafo de caso e verificação de citação com identificadores estrangeiros: 404.
5. Administrador visualiza clientes e casos de A e B; novo cliente criado por A não aparece para B.

**Resultado:** 20 verificações, 20 aprovações, nenhuma falha.

O segundo ensaio, executado **após recompilar o Next.js** no código com agregação de estatísticas, vinculou dois documentos de usuários diferentes ao mesmo caso:

| Perfil | Contagem permitida | Contagem observada |
|---|---:|---:|
| Advogado proprietário | 1 | 1 |
| Administrador | 2 | 2 |

A primeira tentativa desse segundo ensaio havia usado build desatualizado e mostrou 2 ao advogado. A recompilação da versão atual eliminou a divergência. Isso reforça a necessidade de **testar o mesmo commit compilado**, não apenas a árvore TypeScript.

Os bancos temporários foram descartados ao fim dos ensaios. Não foram usados dados de clientes reais.

## Gates da branch

- `tsc --noEmit`: aprovado.
- `bun test tests/*.test.ts`: **93 testes, 0 falhas, 135 verificações**, 11 arquivos.
- `next build`: aprovado na VPS após o commit com filtros, clientes e agregação.
- **Serviços e dados de produção**: não alterados nesta etapa.

## Riscos remanescentes

- Registros históricos com `Client.userId = NULL` ou vinculados à conta `demo@juridia.com.br` não são automaticamente atribuídos a advogados; permanecem sob recuperação administrativa controlada. Fazer reconciliação por titularidade **sem atribuição automática**.
- Acesso de administrador tem abrangência institucional para clientes/casos; documentação/consentimento do escritório e logs de auditoria devem refletir essa política.
- A matriz HTTP cobre fluxos críticos acima, **não todas as rotas da aplicação**. Futuras rotas com acesso a casos, documentos, anexos ou análises devem reutilizar verificação de titularidade.
- A publicação do PR #11 permanece bloqueada por revisão humana do acervo jurídico, atualização de fontes, migração do Atlas legado, avaliação de mérito e prova de rollback.
