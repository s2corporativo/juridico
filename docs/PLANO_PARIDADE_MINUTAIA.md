# Paridade MinutaIA — plano enxuto

**Objetivo:** aproximar a JuridIA do fluxo documental do MinutaIA sem acoplar o banco da aplicação ao Atlas.

**Entrega desta rodada:** criar contratos persistentes para autos/páginas, versões/comentários/sugestões, uso versionado de skills e lotes retomáveis; evoluir a jurimetria do Atlas para decompor danos por causas/assuntos geradores; expor um fluxo único de trabalho na interface.

**Restrições:** anonimização antes do backend; Atlas recebe somente metadados públicos; jurimetria é descritiva; nenhuma publicação ou integração externa será ativada automaticamente.

## Tarefas

- [ ] Adicionar modelos Prisma da JuridIA para ingestão documental, páginas, versões, comentários, sugestões, perfil de estilo, uso de skills e lotes.
- [ ] Adicionar funções locais de hash, ingestão de texto/OCR básico e anonimização de campos antes do envio.
- [ ] Registrar versões persistentes ao salvar documentos e uso auditável das skills.
- [ ] Ampliar o lote com status retomável e persistência por item.
- [ ] Criar decomposição causal de danos no resumo jurimétrico do Atlas, usando `theme`/assuntos e sem publicar dados sensíveis.
- [ ] Reorganizar a navegação em uma jornada de trabalho única.
- [ ] Executar geração Prisma, lint/check e testes existentes; relatar qualquer gate bloqueado.
