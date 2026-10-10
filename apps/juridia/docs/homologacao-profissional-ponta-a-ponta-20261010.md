# Homologação profissional ponto a ponto — JuridIA + Atlas

**Data:** 10/10/2026  
**Branch/commit de código verificado:** `fix/juridia-rag-safety-audit-20261010` / `72da4fd`  
**Escopo:** worktree isolado da VPS, SQLite de homologação e MariaDB isolado do Atlas; sem publicar e sem usar dados de cliente.  
**Decisão de aceite:** **REPROVADO para equivalência funcional ao MinutaIA e para geração jurídica autônoma em produção.** A engenharia básica e vários fluxos passaram, mas dependências externas, curadoria e validação da própria redação ainda estão insuficientes.

## 1. Resultado por funcionalidade

| Fluxo | Verificação executada | Estado |
|---|---|---|
| Build/compilação JuridIA | `tsc --noEmit`, `next build` no último código | PASSOU |
| Testes automatizados JuridIA | 94 testes, 139 expectativas, 0 falhas | PASSOU |
| Atlas backend | última execução no ciclo de auditoria: 216 testes, TS OK | PASSOU no estágio anterior |
| Autenticação, ownership | 20/20 checagens HTTP com dois advogados e administrador, SQLite descartável | PASSOU |
| Contagem de documentos entre usuários | advogado 1 documento, admin 2 documentos | PASSOU depois de recompilar |
| Rotas HTTP sem login | 60 GETs; 31 x 401, 24 x 405, 3 x 503 OIDC, 2 x 200 públicos esperados | PASSOU no teste de acesso anônimo; não mede fluxos autenticados integrais |
| Upload DOCX/PDF/TXT | 9 testes sintéticos HTTP: formato, autenticação, outro caso, documento falso, hash, evidências | PASSOU para **extração textual** e anotação de fonte |
| Arquivo original arquivado | upload devolve `originalRetained:false` | AUSENTE |
| OCR PDF escaneado | não há OCR no caminho executado, mensagem 422 | AUSENTE |
| Citação por página com destaque no original | extrai página/hash, mas não mantém PDF original para confronto visual | AUSENTE |
| Modelos operacionais | SQLite inicial: 0; script exclusivo de templates executado após backup no staging: 10 | PASSOU no staging; não comprova configuração da produção |
| Geração clássica e SSE | 2 testes reais em cópia com template e caso fictício | PASSOU tecnicamente como **rascunho degradado** |
| Modelos de redação disponíveis | Ollama só contém `nomic-embed-text:latest` (vetorizador); IA externa desligada por padrão | NÃO OPERACIONAL para redação generativa |
| Débito de créditos com IA indisponível | após correção: 2 rascunhos, 0 tokens, 0 créditos e 0 minutas usadas, auditoria corretamente atribuída | PASSOU |
| Validação obrigatória na minuta | ambas as rotas JSON/SSE usam `runMinutaPipeline`; Citation Gate agora executa na saída | PASSOU controle estrutural; sem prova de acerto jurídico |
| Skills manuais | tabela `Skill` vazia | AUSENTE |
| Skills automáticas | 2.000 `SkillVersion` aprovadas por `system:atlas-office-catalog-v1`; sem prova de humano | BLOQUEADAS por segurança até assinatura humana |
| Fontes citáveis | 717 `LegalSource`, **0** `revisadoPor=human:...` | NÃO HOMOLOGADAS |
| Documentos internos | 712 `KnowledgeDocument`; 2.719 chunks; 249 docs sem URL oficial | PARCIAL |
| Pesquisa lexical FTS5/BM25 | 3.436 entradas indexadas, integridade e busca testadas | PASSOU |
| Embeddings | 768 dimensões, mas identificador histórico não garante compatibilidade de modelo | PARCIAL |
| Atlas STJ CKAN | endpoint acessível, metadados de catálogo; ingestão diária completa não demonstrada | PARCIAL |
| DJEN/Comunica | HTTP 403 da VPS | BLOQUEADO EXTERNAMENTE |
| Snapshot Atlas→JuridIA | transporte HTTP autenticado versionado com SHA256, inserção e remoção da cache validados com fixture | PASSOU em estágio, sem precedente real citável |
| OIDC | 3 rotas retornam 503 porque IdP ainda não está configurado | NÃO HOMOLOGADO |
| PDF | impressão por navegador; dependente do cliente, não PDF gerado/assinado pelo backend | PARCIAL |
| Word | exporta HTML em arquivo `.doc`, não um `.docx` nativo | PARCIAL |
| Proteção contra prompt injection | regex antes de upload, Cérebro e minuta; testes sintéticos | PRIMEIRA BARREIRA, não análise adversarial de dois estágios |
| Dados, serviços e proxy de produção | nenhuma migração/cutover efetuado; Atlas legado e DPT preservados | PRESERVADOS, não versão nova publicada |

## 2. Correções confirmadas nesta fase

1. Logs não associam ações sem identidade à conta `demo@juridia.com.br`; Cérebro grava cobrança e auditoria com `authUser.uid`.
2. Removidas métricas infladas: contagens reais na API; a landing não fabrica números quando a consulta falha.
3. Perfil de exemplo substituído por dados vazios; estado persistido antigo com identidade demonstrativa é migrado sem apagar preferências legítimas.
4. Citation Gate integrado ao pipeline ÚNICO de minutas (JSON e SSE).
5. Fallback degradado é marcado explicitamente como inválido e rascunho e **não debita** minutas nem créditos.
6. `LexValida` não converte pesquisa genérica da web em jurisprudência validada.
7. Título na impressão PDF escapado para impedir injeção de HTML.
8. Rota `/api/upload` criada para formatos autorizados, tamanho limitado, extracção textual controlada por `pdftotext`/`unzip`, hash SHA256 e verificações de titularidade.
9. Telas de upload deixam de afirmar que o original foi guardado quando isso não aconteceu; vínculo de evidências usa caso selecionado válido.
10. Detecção determinística de instruções externas suspeitas adicionada a upload, Cérebro e pipeline de redação.
11. Rota IBGE e Querido Diário agora exigem sessão, aceitam parâmetros limitados e falham com erros controlados.
12. Retirados do código ativo dois scripts `seed` depreciados, capazes de gerar dados fictícios e aprovações automáticas; templates legítimos mantidos em seed idempotente separado.
13. Roteador de skills exige revisão `approvedBy=human:` e palavras-chave efetivamente presentes; 2.000 skills sistemicamente aprovadas não entram mais automaticamente em peças.
14. Dez modelos carregados **somente no SQLite de homologação**, após backup e verificação de integridade.

## 3. Testes executados (e suas limitações)

- **94** testes Bun, **139** expectativas e nenhuma falha na versão `72da4fd`.
- **216** testes do Atlas na etapa anterior do ciclo (nenhuma alteração posterior nas rotas Atlas nessa fase).
- **20/20** provas de autorização HTTP com usuários fictícios.
- **9/9** provas de upload, extração e vínculo de evidências; arquivos sintéticos PDF, DOCX, TXT.
- **2/2** provas de degradação do pipeline clássico e streaming sem provedor: status `draft`, 0 cobranças, 0 tokens, auditoria com usuário real.
- **60** rotas API examinadas sem login; nenhuma abertura inesperada após correções.
- Build Next.js e TypeScript concluídos no commit verificado, mas **não** houve avaliação de mérito da geração com um modelo LLM real autorizado, comparação com peças aprovadas, teste de OCR nem teste de fidelidade de arquivo DOCX nativo.

## 4. Mapa de arquitetura e sombras

Graphify foi executado sobre o checkout em staging e gerou mapa local de **2.774 nós, 6.443 arestas, 132 comunidades**; as contagens não representam número de defeitos ou módulos dispensáveis. Mapa `/opt/atlas-juridico/audit-vps-rag-20261010/graphify-out`. A fotografia do mapa foi gerada no commit `972401e` e **precede as correções finais**, devendo ser atualizada na promoção.

Sombras removidas: scripts fictícios obsoletos, conta demo em log/ledger, estatísticas fabricadas, chamada à web sem jurisprudência validada, rota de upload ausente e cobrança em geração incompleta. **Não foram removidos** dados históricos, serviços produtivos, backups, integrações legítimas ou branches antigos sem análise individual de impacto.

## 5. Comparação de critérios com MinutaIA

Baseados nas funcionalidades **declaradas publicamente pelo fornecedor**, e não em auditoria independente:

- Pesquisa iterativa em tribunais com justificativa da aplicabilidade dos precedentes: JuridIA **não homologado**.
- Referência rastreável a documento e página com destaque do original: JuridIA tem hash e página, mas **não retém original**, portanto **não equivalente**.
- Análise de processos extensos e documentação em PDF: JuridIA suporta texto até 8MB/60 páginas por upload, sem OCR; **não equivalente**.
- Bloqueio híbrido de prompt injection antes e depois da redação: JuridIA tem somente uma triagem determinística; **não equivalente**.
- Redação jurídica com modelos LLM disponíveis: **não operacional** no ambiente isolado, pois existe apenas modelo de embeddings e provedor externo desligado.
- Revisão humana, prevenção de citações inventadas, segurança de propriedade de casos, FTS e auditoria: **controles implementados**, sem prova de precisão jurídica geral.

Fontes comerciais para essa comparação:
`https://www.minutaia.com.br/blog/pesquisa-inteligente`,
`https://www.minutaia.com.br/blog/referencias`,
`https://www.minutaia.com.br/blog/prompt-injection`.

## 6. Gates objetivos para aceitar uso profissional

**Bloqueadores para publicação como IA jurídica profissional (não improvisar):**
- Modelos gerativos aptos e política explícita de confidencialidade; teste de qualidade com respostas reais e orçamento.
- Revisão humana e registro temporal das fontes que efetivamente serão citadas; verificar legislação e precedentes oficiais.
- Arquivamento seguro e versionado dos arquivos originais com páginas rastreáveis, governança LGPD e proteção de acesso.
- OCR com evidência rastreável, benchmark de compreensão de autos, provas e relação fatos-argumentos.
- Conjunto-ouro de 60 casos anotados por advogado e verificação de aderência, vigência, alucinação, falso positivo e abstenção.
- Configuração e homologação do OIDC, ingestão DJEN e jobs de monitoramento oficiais sem burlar HTTP 403.
- Migração/reconciliação do Atlas legado e plano de backup e rollback testado.
- Deploy do mesmo commit verificado, rotas autenticadas ponta a ponta após publicação, sem alterar DPT.

**Conclusão:** os controles técnicos estão significativamente melhores e os fluxos isolados funcionam como descritos, mas **o JuridIA ainda não oferece a geração jurídica completa, segura e rastreável divulgada pelo MinutaIA**. PR permanece rascunho. Não transformar testes sintéticos em alegações de acerto jurídico.
