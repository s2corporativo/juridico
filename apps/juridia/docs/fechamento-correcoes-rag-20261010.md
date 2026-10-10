# Correções da auditoria do conhecimento, IA, RAG e ingestão

**Concluído no código em 10/10/2026.** Repositório `s2corporativo/juridico`, branch `fix/juridia-rag-safety-audit-20261010`. Execução e testes em worktree isolado na VPS. Este relatório **não declara publicação de produção**, migração de base antiga nem validação jurídica humana.

## Falhas críticas corrigidas

1. **Política de provedores externos**: nove chamadas SDK passaram pelo `createGovernedZai`. Padrão: provedor externo de caso desligado, sem exceção silenciosa. Liberação requer `JURIDIA_EXTERNAL_AI_ENABLED=true` e `JURIDIA_CONFIDENTIAL_DATA_EXPORT_APPROVED=true` em ambiente seguro, sujeita a consentimento/avaliação do sigilo. Tarefas marcadas `LOCAL_COMPLETO` não podem usar provedor externo.
2. **Cérebro**: dados de fatos pseudonimizados para chamadas externas; número CNJ, nome, CPF e identificadores estruturados têm padrão de tarja. Desligado fallback para busca pública com fatos e detalhes do processo. Erro sem provedor retorna 503 sem imprimir dados. Acesso a análises e histórico verifica vínculo do caso com usuário/autorização administrativa.
3. **Citation Gate**: citações inexistentes, sem origem oficial HTTPS, sem assinatura de curadoria humana ou sem análise de aderência são bloqueadas. Identificador de precedente NÃO equivale a confirmação do raciocínio ou resultado. Lei vigente não pode ser assumida apenas por haver referência em base.
4. **Fontes curadas**: gravar automaticamente `LegalSource` NÃO preenche `revisadoPor`. Admin registra aprovação explicitamente como `human:<uid>`, com evento de auditoria e SHA256 do texto; mudar URL ou conteúdo invalida aprovação. UI da biblioteca exibe pendente/revisado, URL de origem e idade da última consulta. Corrigido truncamento que ocultava 217 registros do corpus.
5. **Minuta**: validação jurídica com erro mantém documento como `draft`, não `generated`, e marca execução como reprovada; revisão humana requerida antes de promover peça.
6. **Validador textual**: exige confirmação de lei, precedente, prazo computado e percentual de êxito; regex é triagem, não substitui checagem de aderência jurídica.
7. **Indexação**: BM25 usa corpus `legal_source` separado dos trechos, exclui palavras genéricas e exige dois termos independentes quando disponíveis; modo TF-IDF também exclui fontes sem aprovação humana. Consulta deliberadamente sem fundamento retorna zero candidatos no teste. Ranking não é transformado em percentual de acerto.
8. **Runtime**: índice SQLite/FTS5 funciona tanto com Bun quanto com Node 22 via módulos nativos, sem segundo banco nem dependência paga. Teste local executado em ambas as runtimes.
9. **Segurança auxiliar**: grafo de arquitetura restrito a admin e desativado por padrão em produção; scripts legados de teste não podem encerrar a suíte silenciosamente.
10. **Atlas incremental**: deadline de 45s por provedor, preservação das páginas CKAN já lidas em caso de alteração de contagem, com `truncated=true` em vez de afirmar cobertura total.

## Provas executadas na VPS

| Gate | Resultado |
|---|---|
| JuridIA TypeScript | OK |
| JuridIA testes | **93 aprovados**, 0 falhas, **135 expectativas**, 11 arquivos |
| JuridIA `next build` | OK, build isolado |
| Atlas TypeScript | OK |
| Atlas Vitest | **216 aprovados**, 48 arquivos |
| Runtime Node 22 com SQLite FTS5 | OK, consultou índice em cópia |
| Runtime Bun SQLite FTS5 | OK |
| JuridIA staging Node/Next HTTP raiz | 200 |
| JuridIA endpoints sem sessão | 401 quando método apropriado |
| SQLite original/cópia | Integridade `ok` nas checagens anteriores |
| Atlas legado/DPT | Serviços preservados, nenhum release promovido |

**Cenários de teste**: 60 casos sintéticos novos para limites de sigilo e citação. Eles NÃO são a avaliação jurídica de 60 questões anotadas por advogado solicitada como conjunto-ouro.

## Bloqueios que dependem de evidência nova

- **717 LegalSource do acervo original** estão marcadas `atlas-curadoria`, não assinadas por revisor humano individual. A alteração é *fail-closed*: até conferência por advogado, o RAG não as apresentará como juridicamente citáveis. **É proibido converter automaticamente esses 717 registros em `human:`**. A biblioteca oferece revisão explícita, com dados de origem/recência.
- **249 KnowledgeDocument** não trazem URL de origem. Tais chunks não equivalem a precedente citável. Requerem recuperação de fonte oficial ou classificação como estudo interno.
- Todas as 717 fontes têm `dataConsulta` com mais de 30 dias; rechecagem de vigência e versão oficial não foi comprovada. Regra visual foi adicionada, não houve falsificação de data de revisão.
- **Embeddings históricos:** `nomic-embed-text` versus modelo local `nomic-embed-text:latest`. Em duas amostras, o cosseno foi 0,73262 e 0,92956. **Não renomear modelo arbitrariamente**. Rotina existente de embeddings gera novos vetores em lotes pequenos após backup verificado; corpus antigo continua legível até reindexação.
- **Coleta diária**: STJ CKAN GET respondeu HTTP 200 e descoberta de 1 página retornou 3.185 recursos; DJEN na VPS respondeu HTTP 403. A tentativa completa em staging terminou `failed` e foi encerrada sem ativar o timer. A API STJ pode variar ao paginar e agora preserva páginas anteriores quando há divergência. Corrigir autorização/conectividade de forma legítima antes de ativação de DJEN.
- **Ambiente:** MariaDB 11.4 de staging na porta 3317 não contém acervo legado. **Não substituir a base ativa do Atlas** antes de migração demonstrável, backup restaurável e rollback. O JuridIA não deve ser publicado apontando para esse banco de ensaio.
- **Qualidade jurídica:** ainda não existem 60 respostas de referência anotadas por advogados, com fontes, vigência, aderência de tese e critérios de abstenção. Os testes automatizados não medem taxa de alucinação real nem correção de parecer.

## Recomendação de corte

Não promover o PR enquanto não houver revisão humana das fontes usadas em produção, validação das rotas autenticadas, teste end-to-end do conhecimento com casos fictícios e fontes oficiais, backups/restauração e migração dos dados históricos. GitHub continua código-mestre; testes e builds executáveis diretamente na VPS sem depender de GitHub Actions. Woodpecker existente pode automatizar esses gates quando houver configuração de publicação aprovada.

**Estado operacional**: código corrigido e testado em isolamento; nenhum banco original alterado; serviços públicos Atlas legado, DPT ERP e notificações preservados.
