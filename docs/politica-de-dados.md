# Política de Dados Reais — Atlas Forense

## Princípio

O Atlas Forense (Painel JEC BH e Betim) opera **exclusivamente com dados reais**.
Nenhum registro fictício, de demonstração ou sintético pode existir no banco de
dados, ser gerado pelo sistema ou ser introduzido por scripts. Todo registro
visível na interface é um fato jurídico real sob responsabilidade do escritório
(Clovis José Soares — OAB/MG 253.274) e deve ser tratado com o cuidado de
sigilo profissional e conformidade com a LGPD.

Esta política foi instituída na Task 11, quando todo o acervo de demonstração
que havia sido semeado entre as Tasks 6 e 10 foi erradicado do sistema.

## Origens legítimas de dados

Somente estes canais podem gravar registros no banco:

1. **Cadastro próprio do escritório** — clientes, matérias, atendimentos e
   comunicações manuais inseridos pelas páginas de `/escritorio/*` (mutations
   tRPC em `server/office.ts`), sempre a partir de casos verdadeiros.
2. **Conector DJEN (Comunica CNJ)** — comunicações efetivamente recebidas para a
   inscrição OAB/MG 253.274 configurada em `/escritorio/comunicacoes`, com
   sanitização LGPD do teor antes da gravação (`server/djen.ts`). Idempotente
   por `idComunicacao` externo.
3. **Conector de jurisprudência** — julgados retornados pelos provedores oficiais
   (Dados Abertos do STJ, LexML SRU) ou registrados manualmente com fonte
   declarada (`server/jurisprudencia.ts`).
4. **Importação auditável de acervo** — o lote piloto do Compêndio Nacional
   (6 julgados TJMG), importado do repositório de documentos do escritório com
   hash SHA-256 do lote, URLs oficiais preservadas e trilha em `audit_events`
   (`scripts/seed-pilot-compendium.mjs` + `scripts/seed-public-compendium-metadata.mjs`).
5. **Catálogo de fontes oficiais** — as 7 fontes P0 (CNJ DataJud, DJEN, STJ,
   LexML, TJMG, e-SAJ, Imprensa Oficial MG) semeadas por
   `scripts/seed-p0-sources.mjs`: URLs reais de catálogo, sem conteúdo fictício.

`scripts/configure-djen-oab.ts` grava apenas a configuração real do conector
(nome do advogado e inscrição OAB fornecidos pelo titular do escritório).

## Garantias estruturais (anti-fictício)

- **A coluna `isDemoData` foi removida do schema** (`office_clients`,
  `office_communications`, `office_jurisprudencia`). Scripts antigos de semente
  de demonstração, se executados, falham imediatamente por coluna inexistente.
- **Os geradores de dados demo foram excluídos do repositório**: o arquivo
  `scripts/seed-office-demo.mjs` não existe mais e nenhum seed de demonstração
  é aceito no repositório.
- **Nenhum auto-seed no startup**: o servidor não semeia dados ao iniciar;
  gravações ocorrem somente em mutations tRPC (entrada do usuário) e nos
  conectores configurados.
- **Fixtures em vez de dados**: cenários de teste do motor LexValida usam
  *fixtures* declaradas em `server/prazos-module.test.ts`; nenhum teste grava no
  banco. Qualquer funcionalidade nova que precise de exemplo deve seguir a mesma
  regra — exemplo em teste ou em documentação, nunca linha no banco.

## Auditoria e verificação periódica

As cinco tabelas operacionais podem (e devem) ser verificadas contra o princípio
da política. Estado certificado na Task 11 (2026-10-06):

| Tabela                    | Registros esperados                                             |
|---------------------------|-----------------------------------------------------------------|
| `office_clients`          | somente cadastros reais do escritório                           |
| `office_matters`          | somente matérias reais vinculadas a clientes reais              |
| `office_attendances`      | somente atendimentos reais                                      |
| `office_communications`   | somente comunicações DJEN reais (`channel='djen'`) ou manuais    |
| `office_jurisprudencia`   | somente julgados de provedores oficiais ou registro manual       |

Query de verificação (esperado: zero em todas as contagens de origem suspeita):

```sql
SELECT 'clients' AS tabela, COUNT(*) AS suspeitos FROM office_clients
WHERE document LIKE '%.456.789-%' OR email LIKE '%@exemplo.com'
UNION ALL
SELECT 'communications', COUNT(*) FROM office_communications
WHERE sourceExternalId LIKE 'djen-demo-%'
UNION ALL
SELECT 'jurisprudencia', COUNT(*) FROM office_jurisprudencia
WHERE provider LIKE '%demo%' OR externalId LIKE 'demo-%';
```

Verificação estrutural (esperado: zero colunas):

```sql
SELECT COUNT(*) FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = 'atlas_ejc' AND COLUMN_NAME = 'isDemoData';
```

## O que foi purgado na Task 11

| Tabela                  | Registros removidos |
|-------------------------|---------------------|
| `office_clients`        | 16                  |
| `office_matters`        | 14                  |
| `office_attendances`    | 15                  |
| `office_communications` | 22                  |
| `office_jurisprudencia` | 12                  |
| **Total**               | **79**              |

A purga foi transacional, precedida de prova de que 100% das linhas eram de
origem demonstrativa, e o acervo real do sistema permaneceu intacto: configuração
do conector DJEN (OAB/MG 253.274), configuração do conector de jurisprudência,
catálogo de 7 fontes P0, lote piloto do Compêndio (6 julgados, 7 tópicos, 3
teses, 4 autoridades, 6 fontes de evidência) e trilha de auditoria.

## Regra de ouro

Se um dado não representa um fato real — cliente real, comunicação real, julgado
real com fonte declarada — ele não entra no Atlas Forense. Exemplos e materiais
de treinamento pertencem a testes, à página Treinamento e à documentação.
