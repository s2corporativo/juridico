# ⚖️ Jurimetria DPT

Sistema de inteligência jurídica com base de conhecimento curada (RAG), compêndio estruturado e jurimetria — desenvolvido para a **De Paula Teixeira Advocacia** (grupo S2 Corporativo), com foco no estado de **Minas Gerais**.

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Prisma](https://img.shields.io/badge/Prisma-SQLite-darkgreen) ![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4)

---

## 📚 Base de conhecimento

| Métrica | Valor |
|---|---|
| Documentos curados | **703** |
| Chunks semânticos (RAG) | **2.716** |
| Lotes de ingestão | **34** |
| Áreas do direito | **12** |
| Capítulos do compêndio | **90** |
| Score de integridade da curadoria | **100/100** |

### Temas cobertos (com foco MG)
- **Tributário** — CF/CTN/LC 116/LC 123 literais, compensação, transação, imunidades, ICMS×ISS
- **Penal** — CP/CPP literais, teoria do crime, prisões cautelares, crimes patrimoniais e de honra
- **Consumidor** — CDC literal, publicidade e oferta, cobrança, SAC, defesa em juízo
- **Juizados Especiais** — Lei 9.099/12.153 literais, admissibilidade, recursos, jurimetria JEC (DataJud/CNJ)
- **Recuperação Judicial e Falência** — Lei 11.101/2005 literal (arts. 1º-173, redações da Lei 14.112/2021 como consta), prazos consolidados, checklist de admissibilidade, fluxo, peça-modelo
- Civil · Bancário · Processual · Ambiental · Trabalhista · LGPD · Licitações · Execução fiscal · Alienação fiduciária

### Rastreabilidade e anti-invenção
- Textos **literais verbatim** do Planalto, sempre com `urlFonte` + `dataConsulta`
- Nenhum julgado/tese inventado — jurisprudência apenas com fonte oficial
- Conteúdo não-verificável marcado como `REVISAO_HUMANA` (confiabilidade **C**)
- Confiabilidade por documento: **A** (oficial) / **B** (institucional) / **C** (revisão humana)

## 🧩 Funcionalidades

- **Dashboard SaaS** com marca (cabeçalho verde institucional), métricas da base e navegação em 12 abas · PWA instalável · tour guiado de boas-vindas · paleta de comandos ⌘K
- **Jurimetria** — estatísticas processuais em tempo real por **cidade (IBGE), vara, classe, grau e ano** (DataJud/CNJ): métricas, distribuição anual, rankings clicáveis e amostra com timeline de movimentos
- **Casos privados** — workspace por caso com documentos vinculados por referência, anotações e **relatório executivo .docx** gerado localmente
- **Compêndio** navegável Área → Capítulo → Documento
- **Consulta RAG** com recuperação híbrida BM25 + embeddings e stemmer PT-BR (singular/plural), respostas com citações `[FONTE n]` rastreáveis
- **Pesquisa agêntica** — planeja, busca, critica e sintetiza em iterações um **memo de fundamentação** com contra-argumentos e exportação **.docx**
- **Verificação de citação** — checksum CNJ (ISO 7064), súmulas/precedentes na base e consulta **DataJud ao vivo**, com veredictos honestos (`CONFIRMADA_BASE` / `NAO_INDEXADO` / `NAO_LOCALIZADA`) e link para a página dos autos
- **Testes RAG** — suíte de 39 perguntas-âncora com **Recall@10, MRR e Hit Rate** e histórico persistido
- **Integridade** — auditoria da curadoria em 7 seções (estrutura, taxonomia, CHECK 1-10, LGPD, anti-invenção, duplicidade, saúde do RAG), reexecutável via UI/CLI/API
- **Atualizações** — fontes públicas (API da Câmara dos Deputados) com *inteiro teor* oficial e anti-loop
- **Consulta processual** — metadados públicos por número CNJ (DataJud) sem injeção na base

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
# Alternativa: o banco db/custom.db já vem populado com as 703 entradas curadas

# 5. Desenvolvimento
bun run dev
```

> **Nota:** o repositório inclui `db/custom.db` já populado — contém exclusivamente a biblioteca jurídica **geral e pública** (auditoria LGPD: zero CPF, e-mails, telefones ou dados processuais de clientes). O model `CaseWorkspace` (casos privados) é separado e nasce vazio.

### Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | Caminho do SQLite (ex.: `file:./db/custom.db`) |
| `DATAJUD_API_KEY` | Chave pública da API DataJud/CNJ para jurimetria e consulta processual (o `.env.example` já traz a chave pública divulgada na wiki oficial do CNJ) |

## 🔍 Auditoria da curadoria

```bash
bun scripts/ejc-audit-curadoria.ts   # CLI reproduzível — score 0-100
```

Ou na UI: aba **Integridade** → *Re-auditar* (ou `GET /api/ejc/integridade?refresh=1`).

## 🔌 Integrações públicas gratuitas

| Fonte | Uso no sistema | Estado |
|---|---|---|
| **DataJud (CNJ)** — P1 | Monitoramento de processos por número CNJ (classe, órgão, movimentações ao vivo) — aba Ferramentas · cron diário de sincronização | ✅ ATIVA |
| **BrasilAPI** — P2 | Due diligence de CNPJ (situação, endereço, QSA) e CEP — aba Ferramentas · cache 24h/7d | ✅ ATIVA |
| **Querido Diário** — P3 | Diários oficiais municipais (BH, Betim, Contagem, Igarapé) — aba Fontes | ⚠️ depende de saída de rede do ambiente |
| **LexML Brasil** — P4 | Descoberta de referências normativas (SRU) — aba Fontes | ⚠️ sob verificação anti-bot do Senado neste ambiente |
| **INLABS (DOU)** — P5 | Texto integral do DOU — exige cadastro pessoal do(a) usuário(a) (`INTEGR_INLABS_*` no .env) | 🔑 não configurado |
| **TSE Dados Abertos** — P6 | Contencioso eleitoral — prioridade baixa (perfil de atuação atual) | 📋 adiado |

Princípios das integrações: cache em memória com TTL por fonte · retentativa com backoff · **estados honestos** (fonte bloqueada é exibida como bloqueada — nada é simulado) · nenhuma credencial versionada · dados de partes nunca persistidos (LGPD) · nada é injetado automaticamente na base RAG (anti-loop).

## 📁 Estrutura

```
src/app/            App Router (dashboard, 13 abas, APIs /api/ejc/*)
src/components/ejc/ Componentes das abas (jurimetria, compêndio, consulta, casos…)
src/lib/ejc/        RAG (BM25+embeddings), taxonomia (90 capítulos), auditoria, ingestão
data/ejc/           Lotes 001-034 versionados (fonte da base)
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
