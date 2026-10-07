# Arquitetura do Atlas Jurídico

## Visão geral

O Atlas Jurídico é dividido em duas aplicações especializadas dentro do mesmo monorepo:

- **Atlas Data** — fontes públicas, DataJud, jurimetria, compêndio, ingestão e governança do acervo.
- **Atlas Intelligence** — conhecimento jurídico, RAG, modo agêntico, redação, revisão e homologação.

A integração entre as duas aplicações deve ocorrer por contratos explícitos e identidade OIDC. Dados operacionais não devem ser duplicados entre aplicações.

## Fluxo canônico

1. Caso e documentos entram no sistema.
2. Evidências são extraídas com referência de origem.
3. O Cérebro identifica questões, lacunas e riscos.
4. A pesquisa jurídica combina base interna e fontes externas governadas.
5. O advogado revisa o plano.
6. A redação ocorre por pipeline controlado.
7. Evidence Gate e Citation Gate validam a saída.
8. O advogado revisa e homologa.

## Snapshot Graphify

Mapa regenerado sobre a árvore profissionalizada:

- **2.588 nós**
- **5.980 relações**
- **135 comunidades**
- **395 arquivos de código analisados**
- **26 arquivos não-código excluídos do grafo por política**
- **43 arquivos de código sem símbolos extraíveis**, majoritariamente configuração, scripts e testes simples

Hubs de maior impacto:

| Símbolo | Relações |
| --- | ---: |
| `requireAuth` | 131 |
| `logAuditEvent` | 86 |
| `getDb` | 58 |
| `runMinutaPipeline` | 42 |
| `Editor` | 36 |
| `Generator` | 29 |
| `AppShell` | 21 |

O comando `graphify affected` deve ser usado antes de alterações nesses hubs.

## Hubs arquiteturais

O Graphify identifica como principais pontos de acoplamento:

- `requireAuth` — autenticação de rotas confidenciais;
- `logAuditEvent` — trilha de auditoria;
- `runMinutaPipeline` — produção de documentos;
- `db/getDb` — persistência;
- `AppShell` — navegação;
- `Generator` e `Editor` — jornada de produção.

Qualquer alteração nesses hubs deve ser precedida por:

```bash
graphify affected "<símbolo>" --depth 3
```

## Regra de arquitetura

Não criar:
- novo gateway de IA fora de `ai_gateway`;
- nova rota quando um endpoint canônico já atender a função;
- nova entidade paralela para Cliente/Caso/Documento;
- chamada direta de provider em camada de negócio;
- novo fluxo de geração fora de `runMinutaPipeline`.

## Atualização do mapa

```bash
./scripts/architecture-map.sh
```

O grafo completo é local e não deve ser publicado no frontend.
