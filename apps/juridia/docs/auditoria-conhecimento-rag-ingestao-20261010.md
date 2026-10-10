# Auditoria de conhecimento, RAG, inteligência e ingestão — Atlas Forense + JuridIA

**Data-base:** 10/10/2026 · **Versão examinada:** branch `feat/vps-integracao-fts5-20261010` em cópia isolada da VPS, referência inicial `25fea46` · **Método:** código-fonte, inspeção de SQLite *read-only*, simulações com dados sintéticos, 12 consultas BM25/Ollama, provas de citação e governança, testes automatizados e verificação de conectores e cron.

## Resposta objetiva

**Não está homologado para emitir, por conta própria, pareceres, petições ou afirmações jurisprudenciais com confiabilidade profissional.** O motor de armazenamento, indexação e transporte tem base funcional, mas há falhas críticas de sigilo, confirmação de citações, seleção de fontes e governança efetiva. Os 215 testes do Atlas e 7 testes específicos do JuridIA não medem o conhecimento jurídico ou a veracidade das respostas do modelo.

**A auditoria não alterou os bancos originais nem publicou nova versão.** O SQLite original e a cópia de homologação estavam íntegros; Atlas legado, DPT ERP e notificações permaneceram ativos.

## 1. Inventário, integridade e atualização

| Medida | Resultado | Interpretação |
|---|---:|---|
| KnowledgeDocument | 712 | Base local; não confundir com jurisprudência integral de tribunais |
| Documentos ativos, vigentes, não fictícios | 692 | Elegíveis ao filtro atual do BM25 para chunks |
| KnowledgeChunk | 2.719 | Zero órfãos e zero textos muito curtos |
| LegalSource | 717 | 689 artigos de lei, 15 súmulas e 13 jurisprudências |
| KnowledgeDocument sem `urlFonte` | 249 / 712 (**35,0%**) | Falta trilha de origem para parte do corpus |
| LegalSource sem URL oficial | 0 / 717 | URLs informadas; autenticidade não checada individualmente |
| URLs LegalSource sem HTTPS | 5 / 717 | Necessário revalidar fonte e redirecionamentos |
| Revisor informado em LegalSource | `atlas-curadoria` em **717/717** | Não comprova aprovação individual por advogado |
| Fontes com última `dataConsulta` há mais de 30 dias | **717/717** | Datas entre 29/08 e 01/09/2026; vigência atual não revalidada |
| Datas `dataUltimaVerificacao` nos documentos | 712/712 | Últimas verificações entre 26/08 e 08/09/2026 |
| Documentos sem data de próxima revisão | 161 | Revisão não agendada |
| Repetição exata de texto entre chunks (grupos) | 19 | Exige avaliar duplicidade sem apagar documentos relevantes |
| Embeddings originais LegalSource + KnowledgeChunk | **3.436/3.436** | JSON válido, 768 dimensões, não nulos e sem vetores nulos |
| `PRAGMA integrity_check` | `ok` | Integridade estrutural; não é validação jurídica |

**Importante:** data de consulta desatualizada não significa que cada norma foi revogada. Um `urlOficial` preenchido tampouco comprova que o trecho reproduz integralmente a norma atual.

## 2. Teste da recuperação

12 consultas sintéticas de áreas diferentes, em cópia da base com FTS5; medida: 30 candidatos BM25 e estratégia selecionada ao tentar reranquear localmente.

- **11/12** consultas ficaram no modo BM25; **1/12** usou a combinação com embedding.
- Os vetores originais estão identificados como `nomic-embed-text`, enquanto o código `local-embeddings.ts` exige `nomic-embed-text:latest`. O re-ranker compara literalmente `embeddingModel`, ignorando a maioria dos 3.436 vetores existentes.
- Em 12 consultas, o topo frequentemente foi ocupado por `KnowledgeChunk`, que não é citável pelo mecanismo. Depois o Cérebro descarta os chunks e busca só `LegalSource`, desperdiçando posições do `top-k`.
- Consulta deliberadamente sem tema jurídico válido (`inexiste assunto xyzqwertysemfato`) retornou **30** candidatos por correspondência lexical parcial (`OR`); **0** eram fontes citáveis. Falta um critério de abstenção calibrado em vez de aceitar aproximações fracas.
- O método `ragSearch` converte posição do resultado em número `0.45 - rank * 0.015`, e o Cérebro o transforma em `confidence = score + 0.3`. Essa pontuação **não mede qualidade jurídica, pertinência fática ou probabilidade de êxito**.

**Limite metodológico:** são testes de canal de recuperação, não aferição de *precision@k* contra precedentes anotados por advogado. Isso exige conjunto-ouro com fontes, teses, vigência e aderência conhecida.

## 3. Testes sintéticos de integridade de citação

| Cenário | Esperado | Observado | Veredito |
|---|---|---|---|
| REsp inventado fora do catálogo | Não autorizar como comprovado | `identificada`, `bloquear=false` | **CRÍTICO** |
| Artigo de lei inexistente fora do catálogo | Bloquear | `suspeita`, `bloquear=true` | OK |
| Artigo conhecido mas fonte sem URL/revisão | Não dar selo de fonte verificada | `verificada`, `bloquear=false` | **CRÍTICO** |
| Identificador de precedente existe, mas texto sustenta tese distinta | Não classificar aderência como confirmada | `verificada`, `bloquear=false` | **CRÍTICO** |

Arquivo: `src/lib/citation_gate.ts`. A verificação compara tipo/diploma/número e vigência booleana; ela **não comprova** teor, tese, aderência fática, alteração temporal da norma ou conferência de URL. `src/app/api/citations/verify/route.ts` é endpoint separado; não é gate obrigatório do `/api/brain`.

## 4. Testes sintéticos de validação de saída

`validateResponse` em `src/lib/ai_governance.ts`:

- Referência a precedente não comprovado: **`valid=true`**, apenas aviso.
- Referência a uma lei fictícia: **`valid=true`**, nenhuma violação.
- Alegação de **98% de chance de sucesso**: **`valid=true`**, nenhuma violação.

O mecanismo faz verificações simples por expressões regulares. Não é validador jurídico semântico, gate de citação ou mecanismo de segurança suficiente para protocolo.

## 5. Segredo profissional, provedores e dados do caso

**P0 — sigilo.** `src/app/api/brain/route.ts` passa `facts` diretamente ao `z-ai-web-dev-sdk` em múltiplas etapas. Quando o Atlas não está configurado, pode incluir o começo de `facts` na chamada a `web_search`. O mesmo caminho não chama `pseudonymize` ou o seletor `isProviderEligible`.

Foram identificados **9 componentes que importam e instanciam diretamente o SDK externo**. Os sinalizadores `AI_ENABLED` e `AI_EXTERNAL_PROVIDERS_ALLOWED` são constantes `true` no arquivo de governança; `isProviderEligible` não é aplicado aos nove chamadores. A proteção existente no `minuta_run` por pseudonimização é **local àquele fluxo**, não uma barreira transversal.

**Recomendação de arquitetura:** introduzir um único gateway para requisições de IA que imponha pseudonimização, tipo de tarefa, política por provedor, limites de token, logging sem PII, saída estritamente estruturada, citação auditável e falha fechada. Migração gradual das nove chamadas; não reescrever todos os módulos ao mesmo tempo.

## 6. Governança de ingestão e revisão editorial

- Atlas: existe rotina de descoberta CKAN do STJ, captura de metadados, hash desses metadados, fila `pending_review`, trava diária no DB e exportação de **metadados aprovados** em snapshot com SHA-256 e autenticação. **Não representa corpus integral de acórdãos.**
- DB MariaDB de homologação: `editorial_updates=0`, `editorial_update_runs=0`, `editorial_update_schedules=0` no momento da auditoria. Integração ponta a ponta anterior foi testada com fixture que depois foi removida. **Não houve carga diária real homologada.**
- STJ CKAN: HTTP 200 da VPS. DJEN/Comunica: HTTP 403. Não criar solução de contorno de restrições da API. O sistema deve registrar fonte indisponível, parcialidade e tentativas legítimas.
- `scripts/ingestor-fontes.ts` pode gravar HTML simplificado do CPC no `LegalSource` com `revisadoPor='ingestor-automatico'`. Um coletor automático **não é revisor humano**. Ativação desse script deve depender de separação entre `ingested`, `validated` e `approved`.
- `POST /api/legal-sources` exige administrador, mas aceita `revisadoPor` no corpo e usa `curador` como padrão. Falta identidade assinada do curador e evento de aprovação independente.
- Snapshot `AtlasDiscoveryCache` contém referências de catálogo, **não trechos de decisão aptos a servir de fundamentação**. Não os incluir nos resultados citáveis.

## 7. Invariantes de segurança, testes e execução real

- Atlas: **48 arquivos de testes, 215 testes aprovados** em worktree isolado.
- JuridIA: **7 testes focados / 32 expectativas**, TypeScript sem erros.
- Bancos original e staging: integridade SQLite `ok`, sem alteração de produção.
- O sistema legado Atlas segue ativo em 3010; DPT notificações em 3003; novo JuridIA não possui serviço produtivo comprovado na 3005.
- O build de Next.js passou em etapa intermediária, mas o **último commit** não possui gate de build final comprovado.
- `tests/gates.test.ts`, `tests/auth-oidc.test.ts` e `tests/atlas-client.test.ts` usam `process.exit` diretamente. Isso pode encerrar prematuramente `bun test` quando executados na suíte agrupada: **não usar um “0 fail” isolado como prova da suíte completa**.
- Não foi executado teste ponta a ponta de **resposta de LLM comparada a pareceres humanos**. Não afirmar precisão jurídica, índice de alucinações ou taxa de acerto sem esse experimento.

## 8. Priorização por risco e esforço

| Prioridade | Alteração mínima | Gate de aceite obrigatório |
|---|---|---|
| **P0** | Impedir envio de fatos identificáveis ao provedor externo no Cérebro e no web fallback | Teste negativo com CPF/nome/numero processual, sem vazamento |
| **P0** | Fazer citação não confirmada ou sem origem bloquear exportação/uso como prova | REsp inventado, fonte sem URL e tese não aderente rejeitados |
| **P0** | Proibir marcador de revisão automático como prova humana | Autor real, data, hash do conteúdo e URL oficial rastreáveis |
| **P1** | Compatibilizar identificadores do Ollama; preservar versão efetiva do modelo | Re-rank comprovado sobre vetores existentes e dimensões consistentes |
| **P1** | Reranking separado para corpus de artigos e chunks, com política de abstenção | Benchmark por área com falsos positivos controlados e teste sem resposta |
| **P1** | Calibrar/retirar confiança numérica artificial | Nenhuma pontuação de ranking apresentada como chance de êxito |
| **P1** | Plano de revisão temporal de legislação/jurisprudência | Checagem `validFrom/validTo`, data dos fatos e alerta para norma alterada |
| **P1** | Executar ingestão diária oficial com métricas e erro parcial | 7 dias de execuções rastreáveis, deduplicação e licenças verificadas |
| **P1** | Completar gate do build + suíte JuridIA sem `process.exit` em nível global | Build final e testes integrados reproduzíveis na VPS |
| **P2** | Rever 249 documentos sem URL e duplicidades | Recuperação/justificativa de origem ou classificação como não citável |
| **P2** | Consolidar SKILL/RAG, LexValida, Brain e Minuta em políticas compartilhadas | Mesmos guards, proveniência e audit logs em todas as saídas |

## 9. Critério de aceitação para a IA jurídica

Construir conjunto-ouro anotado por advogado, inicialmente com **60 questões** (10 para cada grupo: direito positivo, jurisprudência, aplicação no tempo, aderência fática, lacuna probatória e pergunta sem resposta). Cada teste informa: fatos sintéticos, data relevante, fontes oficiais, resposta esperada, citações aceitas, falsos precedentes e resposta de abstenção quando faltarem provas.

Medir separadamente: **Recall@10** por fonte, **nDCG@10** de ranking, taxa de citação inexistente, taxa de citação não aderente, precisão temporal, vazamento de dados e taxa de abstenção correta. Não inventar percentuais-alvo nem alegar taxa de acerto antes de rodar o conjunto.

## 10. Veredito

**Infraestrutura de indexação:** funcional no staging.

**Cérebro e validação jurídica:** **não homologados para confiança autônoma** devido a falhas P0 de sigilo e confirmação de citação.

**Ingestão e atualização contínuas:** parcialmente codificadas, ainda sem rotina real comprovada.

**Uso recomendado enquanto pendente:** análise preliminar com conferência obrigatória de cada norma, precedente e conclusão por advogado, nunca emissão/protocolo automático.
