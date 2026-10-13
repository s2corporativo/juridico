# Paridade MinutaIA — plano enxuto

**Objetivo:** aproximar a JuridIA do fluxo documental do MinutaIA sem acoplar o banco da aplicação ao Atlas.

**Entrega desta rodada:** criar contratos persistentes para autos/páginas, versões/comentários/sugestões, uso versionado de skills e lotes retomáveis; evoluir a jurimetria do Atlas para decompor danos por causas/assuntos geradores; expor um fluxo único de trabalho na interface.

**Restrições:** anonimização antes do backend; Atlas recebe somente metadados públicos; jurimetria é descritiva; nenhuma publicação ou integração externa será ativada automaticamente.

## Tarefas

- [x] Adicionar modelos Prisma da JuridIA para ingestão documental, páginas, versões, comentários, sugestões, perfil de estilo, uso de skills e lotes.
- [x] Adicionar funções locais de hash, ingestão de texto/OCR e anonimização de campos antes do envio.
- [x] Registrar versões persistentes ao salvar documentos e uso auditável das skills.
- [x] Ampliar o lote com status retomável e persistência por item.
- [x] Criar decomposição causal de danos no resumo jurimétrico do Atlas, usando `theme`/assuntos e sem publicar dados sensíveis.
- [x] Reorganizar a navegação em uma jornada de trabalho única.
- [x] Executar geração Prisma, build, check e testes existentes; registrar os gates na documentação técnica dos agentes.

## Entregas adicionais da branch

- [x] Catálogo de cinco agentes jurídicos com mapeamento por estágio e revisão humana obrigatória.
- [x] Auditoria persistente por `AgentRun` e `AgentRunStep`.
- [x] Exportação documental real para DOCX e PDF.
- [x] Perfis de estilo com aprovação explícita.
- [x] Documentação detalhada em `docs/ARQUITETURA_AGENTES_JURIDICOS.md`.

## Pendências deliberadas

- [ ] Extensão local-first para garantir que o original não deixe o dispositivo.
- [ ] Editor documental rico baseado em ProseMirror, TipTap ou equivalente.
- [ ] Conectores independentes para PJe, eproc, SEEU e e-SAJ.
- [ ] Testes específicos autenticados da rota `/api/agents` e do catálogo.
