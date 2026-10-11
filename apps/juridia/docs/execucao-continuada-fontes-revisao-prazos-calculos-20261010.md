# Consolidação de correções: ingestão, revisão humana, prazos e cálculos

**Data:** 10/10/2026  
**Branch:** `fix/juridia-rag-safety-audit-20261010` (PR #11, DRAFT)  
**Commit de código homologado:** `bddce34`  
**Critério:** nenhum novo release no Atlas/DPT enquanto o gate de publicação permanecer bloqueado.

## 1. Ingestão STJ real em staging

- O coletor de metadados CKAN do STJ retornou **3.185 recursos** ao processar uma página, **3.184 candidatos do tipo `official_update`**; eles **não** representam 3.184 acórdãos verificados.
- O roteiro `apps/atlas-forense/scripts/stj-staging-review-queue.ts` carregou **20 itens** na MariaDB isolada `atlas_stage` em `127.0.0.1:3317`, todos `pending_review`, `kind=official_update`, com `reviewedByUserId=NULL` e `reviewedAt=NULL`.
- Registro `manual-staging-stj-catalog-20261010`: `partial`, 20 enfileirados, 3.185 recursos descobertos, backlog 3.164 após seleção.
- Um processo de execução inicial permanecia aberto devido a conexões do pool e foi encerrado após confirmar a gravação concluída. O CLI foi corrigido para fechar o pool e terminar limpo.
- Execução subsequente com o mesmo `runKey`: `already_claimed`, `queuedCount=0`, sem consulta externa repetida. **Idempotência comprovada.**
- O DJEN respondeu **HTTP 403** na VPS. Não há contorno de autenticação e nenhuma publicação DJEN foi marcada como ingerida.

## 2. Inteligência jurídica — isolamento e revisão de evidências

- `src/lib/case-access.ts` centraliza a verificação de acesso a casos reais.
- `/api/intelligence/map`, `/api/intelligence/graph` e `/api/intelligence/review` rejeitam casos fictícios e acesso cruzado.
- O componente `inteligencia.tsx` abandonou `default-case`; usa o caso selecionado.
- Afirmações apoiadas em fatos não são confirmadas com referências sem verificação humana. O revisor é registrado como `human:<uid>`, jamais como mero `advogado`.
- A alteração de revisão de evidência, assertion e nó do grafo ocorre **na mesma transação** que a entrada em `AuditEvent`. Falha do log reverte toda a transação.
- **25/25 testes HTTP** de autenticação, isolamento, evidências e revisão em banco descartável.
- **6/6 testes HTTP** de integridade transacional com falha deliberada em `AuditEvent`: mutações rejeitadas e revisão não indevidamente aprovada.

## 3. LegalSource — origem, vigência e curadoria individual

- Um botão simples não é mais suficiente para assinar a curadoria. O administrador precisa atestar, individualmente, abertura da fonte oficial, confronto do trecho, checagem da vigência e conferência da aplicabilidade.
- Cada aprovação vincula hash SHA-256, `updatedAt` esperado e `human:<uid>`; toda alteração posterior de conteúdo/URL invalida a revisão. Atestações são persistidas no evento de auditoria, atomicamente à revisão.
- Exclusões viraram retirada lógica (`vigente=false`) com trilha de auditoria, preservando a proveniência do histórico.
- **12/12 cenários HTTP** de validação de fonte com documentos fictícios passaram, incluindo rejeição de revisão incompleta, hash divergente, falta de permissão e versão alterada.
- `src/lib/legal-source-trust.ts` implementa uma única política de fontes citáveis para o RAG e para o Citation Gate: fonte oficial HTTPS, revisão humana identificada, vigência, texto com hash íntegro e consulta nos últimos 30 dias.
- Não houve assinatura automática das **717 fontes históricas**. Todas seguem sem revisão humana individual registrada.

## 4. Prazos processuais — isolamento

- Antes, `/api/prazos` tinha consulta ampla, edição/exclusão por ID e criação em `default-case` sem validar autorização. Corrigidos GET, POST, PATCH e DELETE.
- Usuários comuns só veem processos próprios; administradores podem acessar o conjunto; IDs de outros casos retornam 404.
- Tipo de contagem é validado (dias úteis/corridos). Logs identificam o usuário autenticado.
- **19/19 cenários HTTP** passaram, incluindo tentativas de acesso cruzado e prazos fictícios.
- O cálculo de dias úteis ainda **não integra calendário de feriados e suspensão de expedientes de cada tribunal**. Permanecem alertas de conferência manual; não declarar prazo homologado.

## 5. Cálculos financeiros e prescrição

- Corrigido o antigo padrão que assumia **1% ao mês** como `CC art. 406` ou `CLT`. A **Lei 14.905/2024** atualizou os juros legais civis; a metodologia da Taxa Legal é definida pelo CMN e divulgada pelo BCB, não por um número fixo no código.
- Agora `calculateInterest` exige `taxaMensal` explícita e `base=informada_pelo_usuario`; os endpoints rejeitam presets históricos e retornam resultado rotulado como **simulação matemática**, não taxa legal.
- Removidas as afirmações `prescrito` ou `não prescrito` baseadas apenas em área + duas datas. A triagem retorna `prescrito:null` e ressalva os fatos e elementos jurídicos a conferir; a UI também deixa de mostrar resultado verde/vermelho sem fundamento.
- **11/11 testes HTTP** dos endpoints e novos testes de regressão passaram.

Fontes oficiais:
- Lei 14.905/2024 — https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l14905.htm
- CC art. 406 consolidado — https://www2.camara.leg.br/legin/fed/lei/2002/lei-10406-10-janeiro-2002-432893-normaatualizada-pl.html
- Taxa Legal BCB — https://www.bcb.gov.br/detalhenoticia/20356/noticia

## 6. Gates finais de engenharia

| Controle | Resultado |
|---|---|
| JuridIA TypeScript | PASSOU no commit `bddce34` |
| JuridIA Bun | **111 testes, 222 expectativas, 0 falhas** |
| JuridIA Next.js build | PASSOU no commit `bddce34` |
| Atlas TypeScript + Vitest | **216 testes**, aprovado nesta rodada |
| HTTP inteligência | **25/25** |
| HTTP rollback auditoria | **6/6** |
| HTTP revisão fonte | **12/12** |
| HTTP prazos | **19/19** |
| HTTP cálculos | **11/11** |
| Bancos SQLite original e staging | `PRAGMA integrity_check=ok` |
| Produção Atlas, DPT ERP e notificações | ativos; release `20260909-011059` preservado |
| Gate jurídico de publicação | **BLOQUEADO, exit 2 esperado** |

**Ainda bloqueiam o uso autônomo:**
1. 717 fontes sem revisão jurídica humana; 2.000 skills com aprovação apenas automática; 249 documentos sem origem oficial; conjunto-ouro de 60 casos jurídicos anotados por advogado ainda não existe
2. IA local Qwen3 Instruct reprovou qualidade/latência; não foi ativada para trabalho real
3. DJEN 403 e agendamento contínuo não homologado; candidatos STJ são metadados, não decisões íntegra verificadas
4. OCR, destaque visual das provas e gestão/backup/segredo do cofre cifrado na produção
5. OIDC, migração do Atlas legado, rollback integral e smoke pós-release ainda não aprovados

**Decisão:** manter PR #11 `draft`, sem merge ou publicação automática, até cumprir as condições de aceite. Evidências de segurança em cópias descartáveis não substituem avaliações jurídicas por advogado.
