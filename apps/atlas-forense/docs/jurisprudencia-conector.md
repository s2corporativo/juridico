# Conector de Jurisprudência — verificação de APIs e arquitetura

Atlas Forense · Painel JEC BH e Betim · Task 5 (reconstruída e validada em 04/10/2026)

## 1. Lacuna mapeada

Das fontes P0 do catálogo institucional, apenas a jurisprudência do TJMG cobria
julgados — e somente em modo manual. DataJud entrega metadados processuais, o DJEN
entrega intimações e o LexML estava registrado como fonte sem conector. O módulo
`office.jurisprudencia.*` fecha essa lacuna com três canais complementares.

## 2. Verificação das APIs públicas (realizada neste ambiente)

| Provedor | Endpoint | Autenticação | Resultado da sondagem | Decisão |
|---|---|---|---|---|
| STJ Dados Abertos | `dadosabertos.stj.jus.br/api/3/action/package_search` (CKAN) | nenhuma | `fetch failed` no sandbox (instabilidade de rede já observada; em 04/10/2026 manhã respondeu 403 a partir do ambiente) | conector implementado; diagnóstico `HTTP_403`/`fetch failed` |
| LexML | `lexml.gov.br/busca/sru` (SRU 2.0, `oai_dc`) | nenhuma | redireciona http→https; https bloqueado no sandbox (`fetch failed`); challenge anti-bot documentado responde 200+HTML | parser SRU tolerante; rejeição explícita `LEXML_RESPOSTA_NAO_SRU` |
| TJMG | formulários `.do` da busca unificada | nenhuma | sem API pública de consulta | registro manual auditável com validação CNJ |
| DataJud | `apis.cnj.jus.br` | API Key | 401 sem chave (metadados apenas) | fora do escopo de jurisprudência |
| Comerciais (JusBrasil, Estapar etc.) | — | credencial paga | inacessíveis | fora da política do projeto |

## 3. Arquitetura

```
shared/jurisprudencia-module.ts   parser SRU tolerante · normalizador CKAN ·
                                  extractValidCnj (mod 97) · sanitizeJurisText (LGPD) ·
                                  planJurisprudenciaIngestion (dedupe) · CQL builder ·
                                  validateJurisManualInput
server/jurisprudencia.ts          settings (linha única) · fetch por provedor (timeout 12s) ·
                                  sync multi-provedor (todos falham→failed; parcial→partial) ·
                                  persistência idempotente (ER_DUP_ENTRY benigno) · auditoria ·
                                  list/status/link/manual · startJurisprudenciaAutoSync (90s+240min)
drizzle/schema.ts                 office_jurisprudencia (externalId único, CNJ validado,
                                  ementa sanitizada, esteira nova→destacada→aplicada→descartada)
                                  + office_jurisprudencia_settings
client/OfficeJurisprudenciaPage   /escritorio/jurisprudencia: painel de fontes com diagnóstico
                                  por provedor, config (query, endpoint SRU, limites, checkboxes),
                                  acervo com esteira e vínculo a matéria, registro manual
```

### Estados de sincronização
- `success`: todos os provedores responderam.
- `partial`: pelo menos um provedor respondeu; diagnóstico por provedor preservado.
- `failed`: nenhum provedor respondeu — mensagem lista `provedor — código`.
- Códigos observados de verdade: `fetch failed`, `HTTP_403`, `TIMEOUT_12S`,
  `LEXML_RESPOSTA_NAO_SRU`, `STJ_CKAN_RESPOSTA_INVALIDA`.

### Garantias
- Challenge anti-bot nunca conta como sucesso vazio (`LEXML_RESPOSTA_NAO_SRU`).
- Dedupe por `externalId` (URN LexML cru, sem duplicar prefixo de URL de resolução).
- CNJ vinculado somente se o dígito verificador conferir (Resolução 65/2008, mod 97).
- Texto sanitizado (LGPD) antes de gravar; PII mascarada desde a origem.

## 4. Validação executada (04/10/2026)

- `vitest`: 145/145 testes verdes, incluindo parser SRU (CDATA/entidades/URN),
  rejeição de payload não-SRU, dedupe, CKAN e validações de registro manual.
- `tsc --noEmit` limpo; app HTTP 200 na porta 3000.
- UI `/escritorio/jurisprudencia`: "Sincronizar agora" → painel "Coleta falhou" com
  diagnóstico `stj-dados-abertos: fetch failed` e `lexml-sru: fetch failed` (servidor
  íntegro, estado persistido em `lastSyncState`).
- Registro manual com CNJ válido `0001234-77.2015.8.13.0026` → item Nova; "Destacar" →
  Destacadas; CNJ com DV impossível `0001234-82.…` → erro "o dígito verificador não
  confere"; vínculo a matéria funciona.
- Zero erros de console em /escritorio/jurisprudencia, /fontes e demais páginas.

## 5. Como validar ao vivo (com internet)

1. Abra `/escritorio/jurisprudencia`, ajuste a consulta (ex.: "consumidor boa fé").
2. Clique em **Sincronizar agora**: o STJ deve trazer catálogo e o LexML acórdãos por URN.
3. Confira o diagnóstico por provedor no painel; itens entram como **Nova**.
4. Use **Destacar** para marcar julgados relevantes e **Vincular a matéria** para aplicá-los.
5. Julgados obtidos manualmente no TJMG entram por **Registro manual** (CNJ validado).
