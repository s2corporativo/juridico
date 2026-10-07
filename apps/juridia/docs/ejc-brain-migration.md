# Migração do cérebro EJC → Atlas/JuridIA

## Objetivo

Trazer o núcleo de conhecimento e raciocínio do EJC para o JuridIA sem restaurar o ERP antigo nem duplicar Cliente/Caso/Documento.

## Fase 1 — aplicada nesta branch

- AI Gateway único para LLMs.
- Política de sanitização por tarefa.
- Matéria penal/menores em modo LOCAL_COMPLETO, sem fallback externo.
- Adapters: ZAI, Ollama e providers OpenAI-compatible configurados explicitamente.
- Recuperação jurídica híbrida SQLite-friendly:
  - TF-IDF;
  - BM25;
  - match exato;
  - bônus de fonte oficial;
  - RRF.
- Research Coverage:
  - fonte primária;
  - vigência;
  - precedente favorável;
  - precedente contrário;
  - aderência fática.
- Cérebro conectado ao gateway e à recuperação híbrida.
- Citation Gate conectado ao pipeline de minutas; citação suspeita mantém documento em rascunho.
- Loop agêntico com orçamento, tools registradas e pausa HITL.
- Agent tools somente leitura na primeira fase.
- Endpoint autenticado: POST /api/intelligence/agent.

## Invariáveis

1. Nenhum dado sensível deve sair para provider externo sem política de sanitização.
2. LOCAL_COMPLETO não possui fallback externo.
3. Citation Gate suspeito bloqueia homologação automática.
4. Pesquisa jurídica incompleta deve ser explicitamente marcada como insuficiente.
5. O agente não cria evidência confirmada e não altera dados do processo por conta própria.
6. Não persistir cadeia privada de raciocínio; apenas ação, tool e observação auditável.

## Fase 2 — necessária para atingir o nível completo do EJC

- Banco jurídico único em PostgreSQL.
- pgvector e embeddings jurídicos.
- FTS português + trigram + RRF com vetores.
- KnowledgeDoc/KnowledgeChunk com proveniência, hash, vigência e escopo.
- Ingestores oficiais Planalto, LexML, STF, STJ, TST, TJMG, Senado, Câmara, DJEN/DataJud.
- Versionamento temporal de normas e precedentes.
- Indexação por página/trecho do inteiro teor.
- Gold Set e avaliação automática de qualidade jurídica.

## Fase 3

- Pipeline estilo MinutaIA: perguntas → roteiro → pesquisa iterativa → redação por seção → adversarial → Citation Gate → homologação.
- Conectar editor e UI ao Agent Loop/HITL.
- Aprendizado controlado do estilo do advogado.
