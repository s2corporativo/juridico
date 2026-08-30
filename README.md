# ⚖️ EJC — Ecossistema Jurídico Clovis

Sistema de inteligência jurídica com base de conhecimento curada (RAG), compêndio estruturado e jurimetria — desenvolvido para a **De Paula Teixeira Advocacia** (grupo S2 Corporativo), com foco no estado de **Minas Gerais**.

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Prisma](https://img.shields.io/badge/Prisma-SQLite-darkgreen) ![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4)

---

## 📚 Base de conhecimento

| Métrica | Valor |
|---|---|
| Documentos curados | **639** |
| Chunks semânticos (RAG) | **2.484** |
| Lotes de ingestão | **29** |
| Áreas do direito | **12** |
| Capítulos do compêndio | **81** |
| Score de integridade da curadoria | **98/100** |

### Temas cobertos (com foco MG)
- **Tributário** — CF/CTN/LC 116/LC 123 literais, compensação, transação, imunidades, ICMS×ISS
- **Penal** — CP/CPP literais, teoria do crime, prisões cautelares, crimes patrimoniais e de honra
- **Consumidor** — CDC literal, publicidade e oferta, cobrança, SAC, defesa em juízo
- **Juizados Especiais** — Lei 9.099/12.153 literais, admissibilidade, recursos, jurimetria JEC (DataJud/CNJ)
- Civil · Bancário · Processual · Ambiental · Trabalhista · LGPD · Licitações · Execução fiscal · Alienação fiduciária

### Rastreabilidade e anti-invenção
- Textos **literais verbatim** do Planalto, sempre com `urlFonte` + `dataConsulta`
- Nenhum julgado/tese inventado — jurisprudência apenas com fonte oficial
- Conteúdo não-verificável marcado como `REVISAO_HUMANA` (confiabilidade **C**)
- Confiabilidade por documento: **A** (oficial) / **B** (institucional) / **C** (revisão humana)

## 🧩 Funcionalidades

- **Dashboard SaaS** com marca, métricas da base e navegação em 9 abas
- **Compêndio** navegável Área → Capítulo → Documento
- **Consulta RAG** com recuperação semântica e stemmer PT-BR (singular/plural)
- **Testes RAG** — suíte de 36 perguntas padrão com histórico persistido
- **Integridade** — auditoria da curadoria em 7 seções (estrutura, taxonomia, CHECK 1-10, LGPD, anti-invenção, duplicidade, saúde do RAG), reexecutável via UI/CLI/API
- **Atualizações** — fontes públicas (API da Câmara dos Deputados) com *inteiro teor* oficial e anti-loop
- **Jurimetria JEC** — agregados públicos DataJud/CNJ (índice TJMG), sem dados processuais pessoais

## 🚀 Como rodar

```bash
# 1. Instalar dependências
bun install

# 2. Configurar ambiente
cp .env.example .env

# 3. Aplicar schema e regenerar cliente Prisma
bun run db:push

# 4. (Opcional) Reconstruir a base a partir dos lotes versionados
bun scripts/ejc-ingest.ts && bun scripts/ejc-ingest-6-7.ts   # ...demais lotes em scripts/
# Alternativa: o banco db/custom.db já vem populado com as 639 entradas curadas

# 5. Desenvolvimento
bun run dev
```

> **Nota:** o repositório inclui `db/custom.db` já populado — contém exclusivamente a biblioteca jurídica **geral e pública** (auditoria LGPD: zero CPF, e-mails, telefones ou dados processuais de clientes). O model `CaseWorkspace` (casos privados) é separado e nasce vazio.

### Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | Caminho do SQLite (ex.: `file:./db/custom.db`) |
| `DATAJUD_API_KEY` | *(opcional)* Chave pública da API DataJud/CNJ para jurimetria em tempo real |

## 🔍 Auditoria da curadoria

```bash
bun scripts/ejc-audit-curadoria.ts   # CLI reproduzível — score 0-100
```

Ou na UI: aba **Integridade** → *Re-auditar* (ou `GET /api/ejc/integridade?refresh=1`).

## 📁 Estrutura

```
src/app/            App Router (dashboard, 9 abas, APIs /api/ejc/*)
src/components/ejc/ Componentes das abas (compêndio, consulta, testes, integridade…)
src/lib/ejc/        RAG, taxonomia (81 capítulos), auditoria, ingestão
data/ejc/           Lotes 001-029 versionados (fonte da base)
scripts/            Ingestão idempotente por lote + auditoria CLI (CHECK 1-10)
tmp-gen/            Geradores de lotes com injeção literal (origem documentada)
prisma/             Schema do conhecimento jurídico
public/             Marca De Paula Teixeira Advocacia
```

## 🔒 LGPD & boas práticas

- Biblioteca jurídica geral (pública) **separada** de casos privados (`CaseWorkspace`)
- `.env`, anexos de clientes (`upload/`) e artefatos internos **fora do versionamento**
- `REVISAO_HUMANA` obrigatório em conteúdo estadual MG não-verificável em fonte oficial
- Documentos de peças usam apenas variáveis `{PLACEHOLDER}` — nenhum dado real

---

**De Paula Teixeira Advocacia** · Curadoria jurídica assistida por IA com rastreabilidade total.
