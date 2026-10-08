# Inventário de Rotas — JuridIA

A superfície HTTP do JuridIA é auditada por `scripts/audit-routes.ts`.

## Estado consolidado

Total atual: **56 rotas**.

| Grupo | Rotas | Função |
| --- | ---: | --- |
| Fluxo jurídico principal | 10 | Cérebro, geração, Molde, evidências, documentos, templates e sugestões |
| Conhecimento e pesquisa | 8 | Skills, fontes jurídicas, DataJud e fontes públicas |
| Domínio do escritório | 11 | Clientes, casos, movimentos, audiências, prazos, intimações e financeiro |
| Identidade / OIDC | 9 | Login, sessão e integração Atlas ↔ JuridIA |
| Ferramentas internas/contextuais | 18 | Auditoria, inteligência, validações e utilitários jurídicos |

## Rotas aposentadas

As rotas abaixo foram removidas por duplicidade e não podem reaparecer sem revisão arquitetural:

- `/api/skill-router` — o roteamento de skills é serviço interno do pipeline;
- `/api/intelligence/ingest-pages` — substituída por `/api/evidence/ingest`;
- `/api/caso-mapa` — sobrepunha funções de inteligência/Visual Law sem consumidor.

## Regra de crescimento

Antes de criar um endpoint novo:

1. verificar se a função já existe em um serviço interno;
2. verificar se uma rota canônica já atende o fluxo;
3. executar `bun run routes:audit`;
4. justificar qualquer crescimento acima de 56 rotas.

Rotas sem referência estática não são automaticamente órfãs: OIDC, integrações externas, APIs administrativas e serviços de domínio podem ser chamadas fora do frontend.

## Comando

```bash
cd apps/juridia
bun run routes:audit
```

O comando falha se uma rota aposentada reaparecer ou se a superfície crescer sem revisão.
