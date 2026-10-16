# JuridIA — Núcleo de Inteligência, Curadoria e Maturação v1

Data: 16/10/2026. Escopo exclusivo do monorepo `s2corporativo/juridico`, JuridIA + Atlas Forense + Cérebro EJC. **DPT ERP integralmente excluído.**

## O que foi implementado

1. `legal-intelligence-core.ts` é um núcleo local, determinístico e isolado, sem contrato de API externo, que identifica intenções, forma de peça e fase processual de forma preliminar; filtra por área, exige gatilhos positivos, executa dois canais de BM25 (gatilhos e texto) e faz fusão RRF com justificativa. Respostas incertas trazem perguntas, sem forçar uma classificação.
2. `skill_router.ts` integra o núcleo sob `JURIDIA_SKILL_INTELLIGENCE_MODE=active` (substitui apenas o ranking), ou `shadow` (ensaios sem trocar o resultado), sem gravar fatos sigilosos. Sem configuração, conserva o roteador atual.
3. `skill-maturation.ts` mede completude mecânica do cadastro (não mérito jurídico): presença de fontes com URL oficial, quantidade e repetição de gatilhos, conteúdo minimamente útil e proibições explícitas.
4. `GET /api/skills/intelligence` fornece relatório somente para administradores. `POST /api/skills/intelligence` permite análise preliminar para usuário autenticado, **não persiste fatos**, não envia informações ao Atlas e aplica apenas versões previamente aprovadas, atestadas por hash integral e dupla revisão.
5. `scripts/seed-legal-proposals.ts` contém **50 propostas de metodologia jurídica**, em dez conjuntos temáticos com fontes oficiais declaradas; importa somente como `draft`, `authorUserId=null`, nenhum aprovador e nenhum hash de manifesto aprovado. Importação exige `--commit` e `JURIDIA_PROPOSALS_IMPORT=review-only` em base isolada com nome stage/qa. Executar sem `--commit` só exibe dry-run.
6. `POST /api/skills/workflow`, ação `claim`, permite que um administrador autenticado assuma a autoria de uma proposta órfã, justificando a atuação; ainda é necessária submissão e aprovação por **outro administrador** com cadastro profissional. O sistema não declara habilitação OAB oficialmente comprovada.
7. `scripts/audit-legal-maturation.ts` executa inspeção local somente leitura, gerando relatório agregado em arquivo seguro `/var/lib/atlas-juridico/...`, acionável por timer no ambiente de homologação. Nenhum resultado é automaticamente aprovado, retirado ou excluído.
8. A interface existente de curadoria apresenta `Assumir proposta` e uma seção recolhida de diagnóstico de maturidade; não cria outro menu.

## Política legal e editorial

- Fontes oficiais citadas são **indicações de pesquisa**, não comprovação de vigência, aplicabilidade ou revisão jurídica. As fontes precisam ser abertas, conferidas e vinculadas ao conteúdo com citação contextual pelo revisor.
- Não inserir conteúdo histórico ou de scripts no prompt automaticamente. A presença de URL de lei não significa que a tese jurídica esteja correta.
- Bibliotecas com 2.000 registros legados sem autoria verificável **não são migradas ou aprovadas em massa**. A meta de 25 áreas/273 tipos de peça é uma trajetória de curadoria, não uma contagem implantada.
- Nenhuma proposta automática se converte em `approved`. O controle editorial mantém criador identificado, revisor independente, manifesto hash e histórico imutável.
- Dados de clientes, processos e documentos não entram no relatório de maturidade; seu conteúdo deve permanecer na JuridIA conforme controles de acesso e pseudonimização.
- Toda atualização jurídica real exige confrontar fonte oficial consolidada, data/vigência, jurisprudência citável verificável e aplicação ao caso.

## Testes e critérios

- Compilação TypeScript, ESLint, Bun tests e Next.js build obrigatórios antes do merge.
- Ensaiar em SQLite `qa` isolado com migrações versionadas; importar as 50 propostas duas vezes e exigir `inseridos=50`, `segunda importação inseridos=0`.
- A biblioteca de minutas não pode oferecer as 50 propostas antes de revisão por dois usuários reais.
- Simular via HTTP um usuário administrador e um autor, testar `claim` e aprovação independente, `GET/POST /api/skills/intelligence`, bloqueio de acesso anônimo e relatório administrativo.
- Confirmar que ninguém recebe conteúdo jurídico não aprovado como orientação de minuta.
- Antes de ampliar o catálogo: benchmark jurídico anotado por advogados (Recall@5, precisão, abstinência, falsos positivos, fontes e latência p95), índice local persistente e eventual embeddings sob avaliação. O núcleo v1 **não é uma busca semântica por embeddings**, nem uma validação de precedentes.

## Rollout

Publicar apenas em `juridia-stage`, com backup de SQLite e rollback da unit. Criar snapshots de maturidade automáticos no mesmo ambiente sem modificar o banco. Não publicar comercialmente até revisão jurídica efetiva das propostas e testes visuais/acessibilidade.
