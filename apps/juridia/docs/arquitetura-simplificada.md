# Arquitetura simplificada — Atlas/JuridIA

## Fluxo canônico do escritório

`Caso → Evidências → Cérebro/Pesquisa → Plano agêntico → Redação → Gates → Editor/Revisão humana`

A interface mostra tarefas do advogado; motores internos não são módulos de navegação.

## Superfícies principais

- **Início**: visão de trabalho.
- **Cérebro**: análise do caso, lacunas, estratégia e contexto jurídico.
- **Produção**: Individual, Agêntico, Molde e Lote.
- **Biblioteca**: fontes jurídicas e skills.
- **Editor**: revisão e versão final.
- **Pesquisa**: DataJud e fontes oficiais.
- **Cálculos** e **Visual Law**: ferramentas auxiliares.
- **Governança**: configurações, auditoria e políticas.

Intelligence Map/Graph, Pipeline LexValida, Homologação e grafo técnico permanecem como motores/diagnóstico, fora do menu principal.

## Rotas canônicas

- Geração: `/api/generate-minuta`, `/stream` e `/agentic`, todos usando `runMinutaPipeline`.
- Audiências: `/api/audiencias`.
- Grafo persistente: `/api/intelligence/graph`.
- Cérebro: `/api/brain`.
- Pesquisa híbrida: `legal_retrieval` + `atlas_knowledge_retrieval`.
- IA: toda chamada de modelo deve passar por `ai_gateway`.

## Removidos nesta consolidação

- `/api/intelligence/agent`: agente genérico sem consumidor; substituído pelo modo agêntico de produção.
- `/api/cases/hearings`: duplicava `/api/audiencias`.
- `/api/assistente`: a tela usa classificador local e a rota não tinha consumidor.
- `/api/grafo`: duplicava o grafo persistente usado pela interface.
- `/api/calculadora-juridica`: substituído por `/api/superior/calculate`.

Regra para novas rotas: **não criar endpoint quando um serviço canônico já puder atender o caso**.
