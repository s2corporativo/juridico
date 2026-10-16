# Reconciliação auditável — acervo EJC/Z.ai, Atlas e JuridIA

**Data:** 16/10/2026. **Escopo:** `s2corporativo/juridico`, Atlas Forense e JuridIA. O DPT ERP não foi alterado.

## Método e limites

Consulta de metadados SQLite **somente leitura** (`mode=ro`) na VPS `ejc-vps`, sem acesso ao conteúdo de processos pessoais nem exportação de corpus. Verificados `sqlite_master`, `PRAGMA table_info`, contagens, distribuição por status e identidade por `slug`. Os números representam o instante da inspeção; não são sincronização em tempo real.

Os documentos legados não devem virar precedentes, legislação vigente ou skills utilizáveis só porque seus campos de banco informam `ATIVO`, `vigente` ou `approved`. Aprovação textual antiga não prova identidade e decisão jurídica humana, nem integridade e atualidade de fonte oficial.

## Inventário observado

| Fonte | KnowledgeDocument | KnowledgeChunk | LegalSource | SkillVersion | Clientes/Casos |
| --- | ---: | ---: | ---: | ---: | ---: |
| `/opt/atlas-juridico/shared/custom.db` | 714 | 2.727 | tabela ausente | tabela ausente | não comparável |
| `/opt/atlas-juridico/shared/juridia.db` | 712 | 2.719 | 717 | 2.000 | 0 / 0 |
| `/opt/atlas-juridico/staging/unified/data/juridia-stage.db` | tabela ausente | tabela ausente | 0 | 90 | 0 / 0 |

### Diferenças e condições de integridade

- Os **dois slugs** presentes em `custom.db` mas ausentes em `juridia.db` correspondem aos **dois registros demonstrativos** excluídos desta última base; nenhum slug aparece na relação inversa. Preservar exclusão de demonstrações.
- No legado `custom.db`: **692 ATIVO**, **20 REVISAO_HUMANA**, **2 DEMONSTRACAO**. Há **463/714 com URL de origem** e 714/714 com campo de data de verificação preenchido, cujo preenchimento não constitui verificação humana comprovada.
- Na cópia `juridia.db`: **692 ATIVO** e **20 REVISAO_HUMANA**. **717 LegalSource** têm campos de URL, revisão e hash preenchidos; esses campos exigem validação individual do conteúdo, domínio, integridade criptográfica, vigência e identidade do revisor.
- As **2.000 SkillVersion** antigas estão marcadas `approved`, com campos `approvedBy`, `approvedAt` e `contentHash` preenchidos. Uma segunda consulta mostrou **um único identificador de aprovador** para as 2.000, **zero marcadores `human:`** e **zero usuários na tabela `User`** desse banco. **Não** transferir essa aprovação automaticamente; o campo textual não comprova decisão humana.
- Em homologação, há **90 SkillVersion** em `draft`, nenhuma aprovada, sem interseção de slug com as 2.000 antigas. As 90 propostas exigem revisão editorial.
- A homologação atual não possui tabelas `KnowledgeDocument`/`KnowledgeChunk`. Isso **não prova perda** do acervo, que segue disponível nos bancos antigos e exige integração por fluxo controlado.

## O que já existe no código e não deve ser duplicado

1. `apps/atlas-forense/scripts/import-legacy-knowledge.ts` e `scripts/legacy-import-policy.ts`: importação de legislação/jurisprudência ativa para **quarentena**, `dry-run` por padrão e `--apply` bloqueado sem URL, banco e backup de staging atestados.
2. `apps/atlas-forense/docs/migracao-legado-quarentena-20261012.md`: registra importação prévia **de 284 documentos para revisão no Atlas stage**, com restauração de backup. **Esse dado é relato documental da operação anterior, não foi reconfirmado no MariaDB durante esta auditoria.**
3. `apps/juridia/src/lib/knowledge-local-index.ts`: índice SQLite FTS5/BM25 sobre **tabelas legadas preexistentes**, sem gerar outra cópia do corpus e sem aceitar chunk genérico como citação validada.
4. `apps/juridia/src/lib/atlas-snapshot-sync.ts`: sincronização de metadados de descoberta **já aprovados**, com hash/versionamento; o snapshot não é jurisprudência citável.
5. `apps/juridia/src/lib/skill-governance.ts` e fluxo editorial: versões novas apenas após governança e decisão humana rastreável.

## Decisões de integração

- **Fonte canônica única:** Atlas é a autoridade sobre dados públicos de pesquisa/revisão e JuridIA sobre execução cognitiva e rascunhos; nenhum espelhamento direto de arquivos SQLite entre serviços. Fluxos privados de cliente/caso dependem de titularidade e contrato de API autenticado.
- **Sem seed ou aprovações automáticas:** identificar candidato pelo `slug`, hash de conteúdo, origem e versão; conflituosos seguem `pending` com decisão de revisor jurídico autorizado.
- **Quarentena antes de citação:** não servir registros `DEMONSTRACAO`/`REVISAO_HUMANA`, não classificar `ATIVO` como sinônimo de validado, não expor dados do cliente ao Atlas público.
- **Sem migração destrutiva:** preservar o acervo intacto, backups, provas de restauração, histórico e audit trails. Não executar `db:push`, `db:reset` ou scripts de preview em produção.
- **Privacidade:** as quatro rotas alteradas (case-analysis, intelligence/map, molde, suggest) usam exclusivamente o adaptador de inferência **Ollama localhost**, com pseudonimização e fallback seguro, e não enviam texto à Z.ai. A revisão permanece **parcial**: outras rotas ainda usam SDK externo e precisam de inventário e política de saída. Os dois testes sintéticos de inferência real no Ollama excederam 50s/22s sem resposta; esse aspecto **não foi homologado** e impede a promoção da release.

## Bloqueios de publicação definitiva

1. **Confirmar** com consulta autenticada e auditoria transacional a presença dos 284 registros em quarentena no MariaDB de staging.
2. Revisão jurídica nominal, fonte oficial, vigência e licenças de uso; prova individual da identidade dos 2.000 aprovadores antigos antes de qualquer promoção.
3. Testes de confidencialidade de contexto real e proteção de dados em **todas** as rotas de IA, não apenas nas quatro mitigadas nesta branch.
4. SSO Atlas/JuridIA, backend canônico do dashboard, navegação E2E, modelo de identidade de clientes/casos, mapeamento dos serviços e rollback comprovado.
5. Bateria de testes (TypeScript, ESLint, Bun, Next build, Vitest e navegador) executada no **commit candidato**, com evidências e aprovação técnica antes do merge e do deploy.
6. Verificar e rotular a divergência entre a produção legada `atlas-juridico.service` (release em `/opt/atlas-juridico/current/app`) e os serviços de homologação `atlas-forense-stage` e `juridia-stage`, atualmente apontados para `unified-portal-b0b3810`.

**Estado nesta auditoria:** inventário concluído; alterações de código somente em branch de correção; nenhum banco, serviço, migration, credencial ou dado operacional alterado. Não declarar o sistema integralmente unificado ou publicado até a homologação comprovada.
