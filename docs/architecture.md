# Arquitetura do Atlas Forense

## Módulos

```text
Atlas Forense
├── Visão Geral
├── Inteligência Jurídica
│   ├── Compêndio
│   └── Banco Nacional de Teses
├── Jurimetria
│   ├── JEC
│   ├── Nacional
│   └── RMBH
└── Governança
    ├── Fontes
    ├── Metodologia
    └── Controle
        ├── Evidências / DataJud
        └── Curadoria de Teses
```

## Backend

`server/routers.ts` é somente o ponto de composição. Regras de domínio ficam em `server/api/*`, `server/thesis-bank*`, `server/db.ts` e serviços específicos.

## Banco de Teses

A tese canônica fica em `legal_theses`. Informações estratégicas e de governança são normalizadas em extensões: perfil, versões, fundamentos, requisitos probatórios, contrateses, score, métricas, relações e revisão.

### Versionamento

`Tese -> Versão -> Score + Jurimetria + Revisões`

A primeira aprovação humana congela conteúdo. A aprovação do auditor congela score/jurimetria. Alteração posterior exige nova versão, que reinicia os quatro gates.

### Gates humanos

1. pesquisador;
2. validador;
3. crítico de contratese;
4. auditor final.

A mesma conta não pode aprovar duas etapas da mesma versão.

## Público x administrativo

Rotas públicas recebem projeções mínimas. IDs internos de usuários, responsáveis, motivos administrativos e notas livres de decisão ficam restritos à Central de Controle.
