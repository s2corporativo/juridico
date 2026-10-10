# Validação real do modelo local, fontes e qualidade — 10/10/2026

**Branch:** `fix/juridia-rag-safety-audit-20261010`  
**Código homologado:** `2b3521c`  
**Ambiente:** checkout isolado em VPS Contabo, banco de homologação e Ollama `127.0.0.1:11434`; nenhum release do DPT/Atlas foi substituído.  
**Decisão:** **REPROVADO para geração autônoma de peças jurídicas de produção**. A integração técnica é válida; inferência local e qualidade jurídica não satisfazem o gate.

## 1. Infraestrutura

- VPS: 6 vCPU, ~12 GB RAM e 115 GB livres na inspeção inicial.
- Ollama com `nomic-embed-text:latest` (embeddings) e novo `qwen3:4b-instruct` (Q4, ~2,5 GB; digest `0edcdef34593`), modelo **não-thinking**, licença Apache 2.0.
- `qwen3:4b` (thinking) e `qwen2.5:3b-instruct` baixados apenas para avaliação foram **removidos** para evitar variante inadequada e risco de licença de pesquisa.
- CPU do serviço Ollama apresenta limite `CPUQuotaPerSecUSec=800ms` (~80% de um core). Foi tentada uma alteração **temporária** para 200% durante a medição; estado final **800ms**. Nenhuma mudança permanente de cgroup, proxy ou credencial.
- Serviços `atlas-juridico`, `dpt-erp` e `dpt-notificacao` permaneceram ativos.

## 2. Código implementado

- `src/lib/local-chat-provider.ts`: provedor Ollama em loopback somente, seleção explícita `JURIDIA_LOCAL_AI_ENABLED=true`, sem fallback externo, limite de tamanho dos prompts, limite de tokens e timeout, SSE real dos chunks NDJSON, rejeição de streams sem marcador final.
- `src/lib/external-ai-boundary.ts`: `createGovernedZai` roteia para Ollama **somente quando habilitado**, preservando a política que proíbe envio de fatos a providers externos sem autorização explícita.
- `src/lib/ai_governance.ts`: registry local elegível só com flag.
- `src/lib/minuta_run.ts`: auditoria registra provedor e modelo reais; peças geradas permanecem `draft` até revisão humana; rascunhos incompletos não viram peça final nem consomem crédito.
- `scripts/benchmark-local-legal-model.ts`: 4 cenários fictícios reproduzíveis, medição de tempo, abstenção sobre precedente, separação de prova/alegação, fonte sintética e prazo sem dados; **avaliação heurística, não conjunto-ouro jurídico**.
- `scripts/audit-official-source-urls.ts`: auditoria apenas leitura, whitelist HTTPS de domínio `.gov.br`/`.jus.br`, sem aprovação automática.

## 3. Medições do modelo — respostas reais

**Qwen3 4B thinking (`qwen3:4b`)**, com até 110 tokens, usando 200% de quota temporária:

| Caso fictício | Tempo | Observação |
|---|---:|---|
| REsp sem fonte oficial | 58,91 s | Em vez de resposta final, começou a produzir planejamento em inglês |
| Separação de prova de pagamento | 42,82 s | Começou a produzir planejamento, geração cortada em 110 tokens |

**Qwen3 4B Instruct**, pelo **adaptador real** `createGovernedZai`, com limite de 160 tokens:

| Caso fictício | Tempo | Resultado |
|---|---:|---|
| REsp 9.999.999/SP sem fonte oficial | 106,61 s | Admitiu ausência de comprovação, **mas afirmou sem consulta que não havia registro oficial**: avaliação jurídica manual **REPROVADA** |
| Alegação verbal sem comprovante de pagamento | Estourou o timeout | **REPROVADA** |

O script inicialmente marcou o primeiro teste como aprovado pela regex, mas a revisão do conteúdo detectou afirmação negativa infundada. O critério foi corrigido para impedir esse **falso positivo**. Nota final dos dois cenários executados, com o critério corrigido: **0/2 aprovados**. Não foram executados os outros dois cenários: não inventar resultados para a suíte não executada.

**Conclusão sobre velocidade:** CPU atual e modelo local não suportam tempo de resposta profissional nessa configuração. Não ligar a flag de geração local em produção.

## 4. Fontes oficiais

- Corpus `LegalSource`: **717 registros**, 0 com revisão `human:<uid>`.
- Auditoria inicial: 5 URLs HTTP incompatíveis com política. Eram 5 registros idênticos de `http://dspace.mj.gov.br/handle/1/1844`.
- Verificação independente de URL confirmou redirecionamento para `https://bibliotecadigital.mj.gov.br/handle/1/1844`. **Cinco URLs foram normalizadas apenas na base de homologação**, com backup prévio em `/opt/atlas-juridico/staging/juridia-url-fix-before-20261010.db`; nenhuma aprovação humana atribuída.
- Após correção: **0 URLs fora da whitelist**. Teste de conectividade à URL do Planalto na VPS permaneceu **indisponível (0/1)**, mesmo com a página visível na navegação pública.
- Amostra CDC art. 18 foi comparada visualmente ao texto de `https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm`. Conferência pontual da parte introdutória **NÃO** constitui revisão jurídica profissional, certificação integral, nem checagem de vigência de toda a base.
- **Não executar migração de `revisadoPor` para `human:` por robô**. Os 717 registros permanecem pendentes de revisão jurídica.

## 5. Gates e regressões técnicas

| Controle | Evidência |
|---|---|
| TypeScript `--noEmit` | Aprovado |
| Bun suite completa | **100 testes; 154 expectativas** no commit testado antes do último ajuste heurístico; **100 testes; 155 expectativas** no commit `2b3521c` |
| Next.js build | Aprovado no commit `2b3521c` |
| Transporte loopback / privacidade / falha controlada | Testes unitários e requisições reais no Ollama |
| Streaming / resposta truncada | Testes unitários com chunks NDJSON reais simulados e rejeição de stream incompleto |
| Histórico de modelo e consumo | Atribuição local, nenhum status final sem revisão |
| Acervo original de produção | Não modificado nesta etapa |

## 6. Falhas que impedem homologação no nível MinutaIA

1. Modelo gerativo profissional com latência e capacidade adequadas: **não aprovado** na VPS compartilhada.
2. Conjunto-ouro jurídico **anotado e assinado por advogado**, com pelo menos 60 casos: **não existe**. Testes sintéticos não o substituem.
3. Fontes citáveis com conferência humana individual, aderência da tese e vigência: **0/717**.
4. Ingestão contínua DJEN: API responde HTTP 403 na VPS; não contornar restrições.
5. Arquivamento criptografado dos documentos originais, OCR de páginas digitalizadas e citação visual página-trecho: **pendentes**.
6. Configuração OIDC, migração dos dados Atlas legados, validação de backup/restore e release profissional: **pendentes**.

## 7. Decisão e parâmetros operacionais

O código fica em PR **DRAFT**. Não mudar proxy de produção, não alterar bancos originais e não ativar `JURIDIA_LOCAL_AI_ENABLED` antes de resolver desempenho e gates jurídicos.

Para novos testes isolados, `JURIDIA_LOCAL_AI_ENABLED=true`, `JURIDIA_LOCAL_AI_MODEL=qwen3:4b-instruct`, `JURIDIA_EXTERNAL_AI_ENABLED=false`, `JURIDIA_LOCAL_AI_MAX_TOKENS=64..1800`. Nunca usar tais flags para liberar produção sem homologação.

A alternativa técnica para qualidade e tempo de resposta é instância de inferência dedicada com CPUs/GPU dimensionadas e teste comparativo, ou provider externo **somente mediante aprovação expressa e controles de sigilo**; não presumir autorização.

### Fontes verificáveis

- Ollama Qwen3 tags: https://ollama.com/library/qwen3/tags
- Qwen3-4B-Instruct-2507 licença Apache 2.0: https://huggingface.co/Qwen/Qwen3-4B-Instruct-2507/blob/main/LICENSE
- Qwen2.5 3B licença de pesquisa: https://huggingface.co/Qwen/Qwen2.5-3B/blob/refs%2Fpr%2F3/LICENSE
- CDC oficial art. 18: https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm
- Ministério da Justiça documento 1844: https://bibliotecadigital.mj.gov.br/handle/1/1844
