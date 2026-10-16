# JuridIA + Atlas — governança de agentes e skills

**Referência:** consolidação de 15/10/2026, ramo atlas-forense.

## Agentes
O catálogo declarativo contém dez perfis delimitados. Cinco são os agentes
originais do pipeline de minutas (privacy_auditor, case_mapper, legal_research,
legal_draft, legal_review), e cinco completam a organização de tarefas já
existentes (workflow_coordinator, document_analyst, evidence_auditor,
legal_brain, citation_verifier). Criar um nome no catálogo não cria um
serviço externo independente ou aumenta permissões: a execução fica nos
endpoints autenticados /api/case-files, /api/brain, /api/atlas/knowledge,
/api/generate-minuta e /api/citations/verify. A rota /api/agents mostra
o catálogo e monta planos limitados sem executar ações arbitrárias.

Na geração de minutas, o coordenador registra um plano no próprio AgentRunStep;
os agentes da cadeia preexistente continuam registrando as etapas executadas.
Todo documento é rascunho e depende de aprovação do advogado antes de uso,
protocolo, publicação ou assinatura. Não existe autorização automática para
excluir dados, acessar certificados, protocolar em PJe/eproc ou enviar mensagens.
Não há chamadas adicionais a LLM apenas pelo aumento do catálogo.

## Skills encontradas no código
- scripts/seed.ts: 33 slugs definidos, incluindo funções de demonstração.
- scripts/seed-consumer-skills.ts: 10 slugs de consumidor/bancário.
- scripts/seed-extra-skills.ts: 10 slugs de áreas diversas.
- scripts/import-lexvalida-skills.ts: importador legado que aponta para /tmp
  e requer fonte não confirmada. Não executado.
- scripts/seed-skill-versions.ts: migração antiga que aprovava
  automaticamente. Não executado.
- O conteúdo no repositório não prova o total persistido nas tabelas reais.

## Política de uso
A base Skill permanece apenas como legado e histórico; o seletor normal e
o roteador só expõem SkillVersion quando há status=approved, data de
aprovação, identificação de aprovador não automatizado e hash SHA-256 íntegro.
Aprovações originadas por migration, seed, curador-juridico e
importacao-lexvalida exigem nova curadoria, não são validadas automaticamente.
A verificação de hash comprova integridade textual, não a verdade jurídica.

GET /api/skills?audit=1 (administrador) informa contagem, estados e
motivos de alerta, sem expor texto ou dados pessoais. Nenhum registro é
removido ou reclassificado sem revisão jurídica. A ausência de skills
habilitadas não autoriza inventar legislação ou jurisprudência.

## Homologação pendente
Comprovar inventário da base ativa de skills, origem das aprovações,
teste autenticado multiusuário e revisão de cada habilidade antes de
habilitação em produção. Separar atualização do GitHub da ativação da
VPS, verificando backups restauráveis e rollback.
