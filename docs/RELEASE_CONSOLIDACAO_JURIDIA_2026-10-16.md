# Consolidação Atlas Forense + JuridIA + Cérebro EJC — release de correções

Data: 16/10/2026. **Escopo exclusivo:** repositório `s2corporativo/juridico`. O DPT ERP não faz parte deste release.

## Estado comprovado por inspeção

- Aplicações: `apps/atlas-forense`, `apps/juridia`, ponte do Cérebro EJC e `packages/shared`.
- Grafo local Graphify do candidato: **3.751 nós e 7.826 arestas**, 229 comunidades, 548 arquivos; sem ciclos de importação detectados. Inclui 96 relações inferidas, que não são prova de chamadas reais.
- Branch de correção: `feat/consolidacao-juridia-skills-design-20261015`; não confundir teste local com publicação em produção.
- Banco isolado de homologação `juridia-stage.db`: 0 registros em SkillVersion na leitura de 16/10/2026.
- Banco operacional em `/opt/atlas-juridico/shared/juridia.db`: 2.000 SkillVersion passaram pela **verificação técnica existente** (status, preenchimento da aprovação, aprovador não pertencente à lista de automações e SHA-256 do corpo). Isso **não atesta** revisão jurídica individual nem a identidade real de cada aprovador. Não modificar/aprovar esses registros automaticamente.

## Alterações implantadas na branch

- Correção de roteamento de gatilhos: normalização Unicode, limites de palavras, sem bônus de área como prova suficiente, sem penalizar skills com mais gatilhos, bloqueio da versão aprovada mais recente inválida.
- Registro de habilidades: captura dos IDs e versões na seleção, conservação dos metadados após corte do prompt, snapshot literal do texto aplicado e persistência atômica com o documento. Documentos históricos anteriores a esta alteração continuam com proveniência não atestada.
- Consulta de snapshots apenas pelo titular autenticado; painel expansível dentro do editor, sem reconstruir artificialmente o prompt com a versão atualmente ativa.
- Busca híbrida: degrada integralmente ao ranking lexical quando candidatos não têm embeddings, em vez de penalizá-los seletivamente.
- `db:migrate` aponta para `prisma migrate deploy`; `db:migrate:dev` reservado a desenvolvimento.
- JuridIA: 6 seções primárias, ferramentas técnicas no menu secundário, dashboard simplificado, cabeçalho único, atalhos de inclusão `#` das habilidades **elegíveis** e esclarecimento de pseudonimização no servidor.
- Atlas: navegação de pesquisa e curadoria em destaque, recursos complementares recolhidos.

## Homologação obrigatória

1. Validar backup recuperável dos bancos de homologação e os caminhos atuais dos dois serviços; não reaproveitar o banco operacional em homologação.
2. Validar `bun x tsc --noEmit`, lint, testes e build da JuridIA; build e testes do Atlas; checar portas, login, health checks e endpoints autenticados.
3. Testar seleção manual e automática com habilidade **de teste** aprovada por pessoa autenticada. Sem esse dado o teste de integração de habilidades reais permanece pendente.
4. Registrar o SHA do build e do Graphify, não promover commits diferentes dos testados.
5. Restaurar unit files/drop-ins e bases em caso de falha após a troca.

## Pendências que impedem declarar a plataforma inteira concluída

- Confirmar lastro **humano** e proveniência jurídica das 2.000 aprovações do banco operacional; a string `approvedBy` não equivale a revisão jurídica nominal comprovada.
- Criar baseline de migrations Prisma após inspecionar o banco em uso, sem executar `migrate dev` ou `db push` em produção.
- Fortalecer hash para englobar **todos** os campos estruturados da habilidade (com migração versionada e compatibilidade).
- Implementar curadoria com workflow real, autoria, versões aprovadas imutáveis, overlays por escopo e merge de três vias sujeito à revisão jurídica.
- Estender a busca híbrida às habilidades e aferir relevância em banco de casos jurídicos revisados; melhorar tratamento de indisponibilidade/abstenção.
- Persistir o ID imutável da SkillVersion além de slug+versão e distinguir digest da versão integral do digest do trecho aplicado ao prompt.
- Executar testes E2E visuais (desktop/mobile, acessibilidade, seleção `#`, editor, login, auditoria), carga e cenários com dados sintéticos antes de produção.
- Validar fontes oficiais, atualidade jurisprudencial, atos da OAB, sigilo profissional e diretrizes éticas; revisão humana antes de qualquer protocolo.
- Confirmar CI e backup/restore com logs após merge e após publicação.

**Sem atalhos:** não rodar scripts de seed obsoletos para criar falsas aprovações. Não excluir modelos legados, dados de clientes, migracões históricas ou releases existentes sem inventário verificável e rollback.
