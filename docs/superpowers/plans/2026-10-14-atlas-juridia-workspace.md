# Atlas–JuridIA Workspace Implementation Plan

> **For agentic workers:** use the native execution flow for this repository.

**Goal:** tornar a JuridIA um módulo de primeira classe do dashboard Atlas, com navegação unificada, destino configurável e estado de integração fail-closed.

**Architecture:** o Atlas continuará sendo o shell de navegação e o ponto de entrada. A página `/juridia` exibirá a situação da ponte e abrirá a aplicação JuridIA por `JURIDIA_PUBLIC_URL`; o SSO permanece responsável apenas pela identidade, enquanto os bancos do Atlas e da JuridIA continuam isolados.

**Tech Stack:** React, Wouter, tRPC, Express, TypeScript, Vitest, CSS existente do Atlas.

**Spec:** solicitação do usuário em 14/10/2026: acesso da JuridIA pelo mesmo dashboard do Atlas e melhoria geral.

## Global Constraints

- Nunca apontar a interface para o issuer OIDC; issuer é endpoint técnico.
- Exigir URL pública explícita para a aplicação JuridIA.
- Falhar fechado quando a URL for ausente, inválida ou insegura em produção.
- Não misturar o banco da JuridIA com o banco métrico ou causal do Atlas.
- Não expor segredos ou dados processuais na resposta de status.

## Review Focus

- URL ausente ou inválida: módulo visível, mas sem ação de abertura.
- URL HTTP em produção: rejeitada.
- SSO incompleto: página informa configuração pendente sem prometer autenticação.
- Navegação em qualquer shell: JuridIA deve permanecer acessível pelo menu unificado.
- Regressão do contrato `integration.ejcStatus`: testes existentes permanecem válidos.

### Task 1: Contrato de integração

- [x] Adicionar `getJuridIAPublicUrl` e o campo público `juridia` ao readiness do EJC.
- [x] Testar URL HTTPS, localhost em desenvolvimento e rejeição em produção.

### Task 2: Workspace visual e navegação

- [x] Criar `JuridIAWorkspacePage` em `/juridia` usando o shell Atlas.
- [x] Adicionar JuridIA ao grupo Operar e remover o link incorreto para o issuer.
- [x] Criar estados de pronto, pendente e indisponível.

### Task 3: Configuração e documentação

- [x] Documentar `JURIDIA_PUBLIC_URL` sem versionar valores reais.
- [x] Executar check, testes, build e validação HTTP local da rota.
