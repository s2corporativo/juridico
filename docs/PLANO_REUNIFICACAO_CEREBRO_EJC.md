# Reunificação do Cérebro Jurídico com o Núcleo EJC — Plano de Implementação

**Objetivo:** fazer `/api/brain` produzir e consumir um contexto de inteligência baseado em `EvidenceRef` e `IntelligenceSnapshot`, sem enviar fatos identificáveis ao provedor.

**Arquitetura:** o endpoint continuará sendo o supervisor de alto nível, mas passará a preparar o caso a partir de `CaseFile`, criar/validar evidências autorizadas e persistir um snapshot append-only. O `case_mapper` determinístico será reutilizado como núcleo factual; a análise estratégica continuará no Cérebro, usando somente texto pseudonimizado e fontes permitidas.

**Tecnologias:** Next.js App Router, TypeScript, Prisma/SQLite, ZAI, `pseudonymizer.ts`, `legal_brain.ts`, `evidence.ts`.

**Especificação:** solicitação de reunificação do `/api/brain` com o Núcleo de Inteligência EJC.

## Restrições globais

- `caseId` deve ser real e pertencer ao usuário autenticado; `default-case` e `cerebro-session` não serão aceitos.
- Nenhum nome, número de processo, documento pessoal, telefone, e-mail ou valor identificável será enviado ao provedor ou ao Atlas.
- Toda saída começa como candidata/rascunho e exige revisão humana.
- Jurimetria será exclusivamente descritiva; não haverá percentual ou previsão de êxito.
- `EvidenceRef` será a fonte autorizada de fatos e terá hash de integridade.
- `IntelligenceSnapshot` será append-only e terá status de rascunho até aprovação humana.
- O Atlas receberá apenas termos jurídicos genéricos extraídos do conteúdo pseudonimizado.

## Focos de revisão

1. Requisição sem caso real: deve falhar antes de qualquer chamada ao modelo.
2. Autos com PII: devem ser pseudonimizados antes de classificação, extração, RAG, Atlas ou fallback web.
3. Afirmação sem `evidence_ref_id` válido: deve ser descartada ou causar degradação controlada, nunca ser confirmada.
4. Snapshot anterior: nova análise deve criar nova versão sem sobrescrever a anterior.
5. Falha do Atlas: o Cérebro deve seguir sinalizado como parcial/indisponível, sem transformar web aberta em fonte oficial.

## Tarefas

### Tarefa 1 — Preparação factual e evidências autorizadas

**Arquivos:**
- Modificar: `apps/juridia/src/app/api/brain/route.ts`
- Reutilizar: `apps/juridia/src/lib/evidence.ts`, `apps/juridia/src/lib/pseudonymizer.ts`, `apps/juridia/src/lib/legal_brain.ts`

**Resultado:** exigir `caseId`, carregar autos prontos do usuário, criar evidências por arquivo/página e montar o texto pseudonimizado para todas as chamadas externas.

### Tarefa 2 — Supervisão por snapshot

**Arquivos:**
- Modificar: `apps/juridia/src/app/api/brain/route.ts`
- Modificar: `apps/juridia/src/app/api/intelligence/map/route.ts` apenas se necessário para contrato comum

**Resultado:** salvar um `IntelligenceSnapshot` append-only contendo fatos, eventos, assertions, lacunas, estratégia, fontes, evidências autorizadas e estado Atlas; associar a execução `AgentRun`.

### Tarefa 3 — Integração da geração

**Arquivos:**
- Modificar: `apps/juridia/src/components/app/cerebro.tsx`
- Modificar: `apps/juridia/src/components/app/generator.tsx`
- Modificar: `apps/juridia/src/lib/types.ts` se necessário

**Resultado:** usar o caso atual, abandonar IDs fictícios e transportar `snapshotId`/contexto somente após o usuário escolher o resultado para a minuta.

### Tarefa 4 — Testes e gates

**Arquivos:**
- Criar/modificar testes existentes da JuridIA conforme a estrutura disponível.

**Verificações:**
- teste de tipo, lint, Prisma e build da JuridIA;
- testes e check do Atlas;
- inspeção de que `/api/brain` não contém envio de `facts` bruto ao provedor;
- teste de que a versão do snapshot é incrementada;
- `git diff --check`.

## Consolidação técnica da integração na JuridIA — 15/10/2026

O Cérebro EJC **não foi descartado**. Seu núcleo TypeScript vive em
`apps/juridia/src/lib/brain-ejc.ts`, `legal_brain.ts`, `evidence.ts`,
`pseudonymizer.ts` e `src/app/api/brain/route.ts`.
A UI `src/components/app/cerebro.tsx` apresenta o Cérebro EJC.
Os antigos quatro fragmentos Python FastAPI, removidos no PR #49, não compõem
o runtime da JuridIA e seguem recuperáveis no histórico.

O novo portão `brain-ejc-evidence-gate.ts` exige estrutura JSON reconhecida,
elimina referências inexistentes/outro caso e **não transforma dados sem
EvidenceRef autorizado em fatos comprovados**. Falhas do modelo/provedor
impedem gravação de um parecer como concluído, preservando a extração
determinística realizada localmente. Metadados redundantes com CPF/CNPJ
originais deixaram de ser gravados em novas evidências.

**Gates antes de produção:** teste autenticado com usuários distintos e
documentos sintéticos; comprovação de que prompts ao provedor são
pseudonimizados; revisão humana de fontes Atlas; backups restauráveis;
migrações comprovadamente não destrutivas; rollback e verificação de HTTPS.


### Complemento da auditoria concorrente — 15/10/2026

Sobre a integração EJC já incorporada em atlas-forense, a reconciliação acrescenta:
verificação criptográfica das referências por caso antes do provedor; rejeição integral
de itens com IDs de evidência mistos (autorizados e inventados); validação também
da classificação e dos campos essenciais antes de concluir; consultas web apenas
com áreas jurídicas genéricas; leitura dos documentos anexados diretamente pelo
backend sem colar a extração duas vezes no formulário; permissão para analisar
casos que já possuem autos prontos mesmo com narrativa manual vazia; e
identificador do snapshot no contexto enviado ao gerador como rascunho.

Os testes antigos brain-privacy.test.ts foram alinhados ao contrato vigente.
Isto reforça validação de origem, não comprova apoio semântico da prova
à afirmação nem substitui conferência do advogado. Os serviços da VPS e os
bancos permanecem inalterados até a homologação operacional.
