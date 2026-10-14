# Atlas Causal

## Objetivo

O Atlas Causal é a camada de casos individuais do ecossistema jurídico. Sua função é explicar quais fatos, pedidos e fundamentos originam os números agregados de dano moral, dano material e obrigação de fazer exibidos pelo Atlas Métrico.

A implementação cobre o núcleo de persistência, o coletor-piloto DataJud e a análise determinística de movimentos. Ela não substitui a revisão humana nem o exame do inteiro teor quando a conclusão depender do conteúdo da decisão.

## Isolamento de banco

O módulo usa exclusivamente `ATLAS_CAUSAL_DATABASE_URL`. A variável `DATABASE_URL`, usada pelo Atlas Métrico, não é fallback e não deve ser reutilizada.

A migração é executada com:

```bash
cd apps/atlas-forense
ATLAS_CAUSAL_DATABASE_URL='mysql://usuario:senha@host:3306/atlas_causal' pnpm db:causal:generate
ATLAS_CAUSAL_DATABASE_URL='mysql://usuario:senha@host:3306/atlas_causal' pnpm db:causal:migrate
```

## Coletor-piloto DataJud/JEC/RMBH

O coletor está em `scripts/collect-rmbh-causal-pilot.mjs` e usa a consulta oficial `POST /api_publica_tjmg/_search`. O escopo atual contém 33 órgãos em Belo Horizonte, Betim, Contagem, Igarapé, Lagoa Santa e Santa Luzia. A consulta aplica grau `JE`, classe `436`, os 405 assuntos Cível/Consumidor materializados e período configurável. A paginação usa `search_after` com `@timestamp` ascendente.

Primeiro executar apenas a prévia:

```bash
pnpm collect:causal:rmbh
```

Para consultar e salvar somente no artefato sanitizado, após revisão do manifesto:

```bash
ATLAS_CAUSAL_PILOT_AUTHORIZATION=approved \
ATLAS_CAUSAL_CASE_KEY_SECRET="$(openssl rand -hex 32)" \
pnpm collect:causal:rmbh -- --execute
```

Para persistir no banco causal, acrescentar `ATLAS_CAUSAL_DATABASE_URL` e `--persist`. O coletor não grava o número CNJ bruto: usa HMAC com `ATLAS_CAUSAL_CASE_KEY_SECRET`. A execução é limitada por padrão a 100 registros por página e duas páginas por lote; ajustar `ATLAS_CAUSAL_PILOT_MAX_PAGES` somente após avaliar custo, cobertura e termo de uso.

## Análise dos movimentos e fatos geradores

Depois da coleta, a análise determinística deve ser executada sobre o artefato sanitizado:

```bash
pnpm analyze:causal:rmbh
```

O analisador cria uma linha do tempo por caso e classifica sinais de ajuizamento, citação/intimação, audiência, defesa, prova, sentença, acordo, recurso, julgamento recursal, extinção, cumprimento e baixa. Também identifica sinais textuais de resultado, mas os registra como `outcomeSignals`, nunca como resultado confirmado.

Os assuntos TPU podem gerar candidatos preliminares de dano moral, dano material ou obrigação de fazer. Esses candidatos têm baixa confiança, fonte `cnj_subject` e status `pending`. Movimentos podem gerar candidatos de consequência, também pendentes. A classificação não afirma que o fato ocorreu, que houve nexo causal ou que o pedido foi acolhido.

O fluxo de revisão é: conferir o movimento na fonte; obter o inteiro teor quando juridicamente permitido; separar alegação, prova e fundamento; identificar o fato gerador concreto; registrar o pedido correspondente; registrar a conclusão da decisão; e só então aprovar a anotação e eventual resultado. Sem inteiro teor ou evidência suficiente, o caso deve permanecer como `metadata_only` ou `incerto`.

O arquivo de saída da análise é `rmbh_causal_pilot_analysis.json`. Ele é um artefato de trabalho e não deve ser usado diretamente em petição, parecer, ranking de êxito ou comunicação a cliente sem revisão profissional humana.

O banco causal deve possuir usuário, senha, permissões e política de backup próprios. A criação do banco e o fornecimento de credenciais permanecem sob responsabilidade do operador.

## Entidades

| Entidade | Função |
|---|---|
| `causal_runs` | Execução de coleta, escopo, período, metodologia e cobertura |
| `causal_cases` | Caso público sanitizado, sem partes ou documentos integrais obrigatórios |
| `causal_documents` | Metadados de sentença, acórdão, movimento ou documento correlato |
| `causal_evidence_refs` | Referências rastreáveis com URL, hash, página e trecho limitado |
| `causal_annotations` | Fatos geradores, pedidos, fundamentos e consequências classificados |
| `causal_outcomes` | Resultado por anotação, fase processual e valor em centavos |

A ligação causal pretendida é:

```text
caso → documento → evidência → anotação causal → resultado por pedido
```

## Contrato de classificação

A anotação usa quatro papéis semânticos:

- `fato_gerador`: evento ou conduta que originou a controvérsia;
- `pedido`: providência pretendida pela parte;
- `fundamento`: fundamento fático ou jurídico identificado;
- `consequencia`: efeito alegado ou reconhecido.

Os tipos de pedido incluem `dano_moral`, `dano_material`, `obrigacao_fazer`, `obrigacao_nao_fazer`, repetição, restituição, rescisão e declaração de inexistência de débito.

Os resultados incluem procedência, improcedência, procedência parcial, extinção sem mérito, acordo homologado, prejudicado, não localizado e incerto. `incerto` é um estado válido e deve ser preferido quando a fonte não permitir conclusão segura.

## Evidência e revisão

Cada anotação e cada resultado referenciam uma evidência. O contrato exige:

- URL HTTPS;
- hash SHA-256;
- tipo de fonte;
- referência opcional de página ou parágrafo;
- trecho limitado, sem dados pessoais;
- estado de revisão.

A classificação pode iniciar como `pending`. Aprovação, rejeição ou devolução devem ser acompanhadas de revisor e data. A extração automática não transforma, sozinha, um dado em fato jurídico reconhecido.

## API administrativa

Os procedimentos tRPC adicionados ao Atlas são:

- `causal.status`;
- `causal.createRun`;
- `causal.createCase`;
- `causal.addDocument`;
- `causal.addEvidence`;
- `causal.annotate`;
- `causal.recordOutcome`;
- `causal.getCase`;
- `causal.dashboard` — agregação administrativa de fatos geradores, pedidos, resultados, revisão e municípios.

Todos são administrativos. O módulo permanece desligado quando `ATLAS_CAUSAL_DATABASE_URL` não está configurada.

## O que ainda não está incluído

Ainda não estão incluídos download automático de sentença, OCR, classificação de documentos integrais, tela de ficha individual ou exportação para `IntelligenceSnapshot` do EJC. O dashboard resumido disponível em `/causal` exibe apenas agregados sanitizados e não substitui a revisão do inteiro teor.

## Conformidade com fontes públicas e publicação

**Bloqueio de exploração comercial:** a Portaria CNJ nº 374/2026 alterou o art. 4º da Portaria CNJ nº 160/2020: dados da API Pública DataJud são fornecidos exclusivamente para fins legais, não comerciais e autorizados, e é proibida a exploração comercial dos dados disponibilizados. Publicações, painéis, aplicativos e estudos derivados devem citar CNJ e DataJud como fontes. Referência oficial: https://atos.cnj.jus.br/atos/detalhar/3453 .

Enquanto o enquadramento da finalidade e a base autorizativa não forem revisados juridicamente, **não ativar coleta ou visualização causal para produto comercial, clientes finais ou previsão de êxito**. A coleta técnica de homologação também exige revisão do escopo e do termo de uso; não se pressupõe autorização comercial pelo mero acesso à chave pública.

**Falha fechada na amostragem:** retornos do DataJud com timeout, falha de shard ou estrutura incompleta são erros de coleta. O manifesto de zero casos é diagnóstico inconclusivo, não coleta bem-sucedida. Não migrar banco nem promover release em razão de resposta vazia. Respeitar 429 e limites técnicos, sem contornar rate limits.

## Regra de uso

Os dados causais não devem ser apresentados como taxa de êxito, previsão de resultado ou ranking de magistrados. Antes de uso em peça, orientação a cliente, estratégia processual ou publicação, toda classificação deve passar por revisão profissional humana.
