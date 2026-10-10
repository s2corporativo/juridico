# AGENTS.md — Atlas Forense e JuridIA

Este repositório é o monorepo jurídico contendo `apps/atlas-forense`, `apps/juridia` e contratos em `packages/shared`. Instruções para agentes de programação, auditoria, teste e deploy que trabalham com o repositório.

## Preparação e continuidade entre sessões

- Descobrir estado atual no GitHub e no ambiente autorizado; nunca presumir que o código da branch padrão `atlas-forense` já está publicado.
- Ler `README.md`, `package.json`, contratos compartilhados, scripts de teste e os documentos de arquitetura aplicáveis antes de alterar código.
- O controlador institucional DPT Atlas Ops está versionado em `s2corporativo/DTP-ESCRITORIO` (repositório privado). Ele fornece auditoria read-only, inventário, seis skills e plano de release. Acesso exige permissões; não duplicar sua lógica neste repositório público.
- Em ambientes compatíveis, retomar contexto SentinelX `sentinelx_context_sxc_QZ7XHW9T` e **revalidar o estado ao vivo**. Este identificador não fornece credenciais nem acesso por si só.
- Não alterar uma aplicação baseada na hipótese de que sua outra aplicação compartilhe a mesma versão, base de dados ou runtime.
- Aplicações futuras e novas aquisições devem adotar inventário, testes e documentação de operação antes de habilitar release; consultar `ops/dpt_atlas_ops/NEW_PROJECT.md` no repositório institucional autorizado.

## Contratos de integração e segurança jurídica

- Atlas e JuridIA possuem funções distintas; manter contratos tipados `packages/shared` e testar consumidor e produtor após mudar rotas e dados.
- Autenticação OIDC exige testes de issuer, audience, assinatura, PKCE, expiração, redirecionamentos e revogação. Não aceitar descrição histórica de README como garantia do estado atual.
- Testar ingestão, OCR, indexação, recuperação, grounding, referências, vigência temporal, concordância do precedente com tese e abstenção quando a fonte é insuficiente.
- Usar dados sintéticos ou devidamente anonimizados nos testes; não enviar peças sigilosas, dados de clientes, certificados, segredos ou tokens a ferramentas públicas.
- Não criar afirmações jurídicas, jurisprudência ou legislação fictícia. Exigir revisão humana para atos formais.

## Fluxo de execução

1. Auditar repositório e runtime; identificar commit, branch e versões realmente em execução.
2. Criar alteração pequena em branch própria, verificando interferência com outras branches ou PRs.
3. Executar testes proporcionais ao diff; para alterações compartilhadas, validar ambas as aplicações.
4. Verificar credenciais por existência/configuração e não por exposição de valores.
5. Não promover versões sem backup e restauração verificáveis, migrações ensaiadas, acesso restrito e rollback específico.
6. Documentar diagnóstico, correção, testes, publicação e homologação como **estados distintos**.
7. Não apagar versões, dados, histórico Git nem alterar migrações já aplicadas por iniciativa do agente.

## Comandos documentados no monorepo

`pnpm build:atlas`, `pnpm build:juridia`, `pnpm lint:juridia`, `pnpm test:atlas` e comandos dos próprios pacotes. Verificar dependências instaladas e scripts reais antes de executar. Em produção, não rodar `dev` ou modificar diretórios ativos para testar hipótese.

Estas instruções não significam que um MCP local da VPS esteja automaticamente disponível em todos os chats: o agente deve conectar-se pelas ferramentas autorizadas.
