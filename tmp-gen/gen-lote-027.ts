// Gerador do LOTE-027 — Penal II (compêndio EJC, foco MG)
// Literais: CP arts. 1-11, 13-29, 138-140, 155, 157, 163, 168; CPP arts. 282-283, 310-317;
// CF art. 5º LXI-LXVII; Lei 14.155/2021 (fraude eletrônica). Planalto, consulta 2026-08-30.
import { readFileSync, writeFileSync } from 'fs';

const T = (p: string) => readFileSync(`/tmp/leis-oficiais/${p}`, 'utf-8')
  .replace(/\s+/g, ' ')
  .replace(/`/g, "'")
  .trim();

const D = '2026-08-30';
const PLANALTO = 'Presidência da República — Planalto';
const URL_CP = 'https://www.planalto.gov.br/ccivil_03/decreto-lei/del2848compilado.htm';
const URL_CPP = 'https://www.planalto.gov.br/ccivil_03/decreto-lei/del3689compilado.htm';
const URL_CF = 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm';
const URL_L14155 = 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14155.htm';
const EJC = 'Elaboração EJC — conteúdo estrutural original';
const MG_NOTA = 'NADA estadual é citado como verbatim nesta rodada: portais MG (almg.gov.br, mg.gov.br, iof.mg.gov.br, sefaz.mg.gov.br, tjmg.jus.br) BLOQUEADOS para captura em 2026-08-30.';

function lei(slug: string, titulo: string, subarea: string | null, assunto: string, conteudo: string, norma: string, urlFonte: string, artigos: string[], tags: string[]): string {
  return JSON.stringify({
    slug, titulo, tipoDocumento: 'LEGISLACAO', area: 'penal', subarea, assunto,
    prioridade: 'P1', conteudo,
    metadados: { numero: norma, orgao: 'Congresso Nacional', artigos_principais: artigos, vigente: true, confirmacao_texto: 'Extração literal do texto oficial do Planalto em 2026-08-30. Redações empilhadas com notas "(Redação dada pela ...)" registradas como consta.' },
    tags, fonte: PLANALTO, urlFonte, dataConsulta: D, confiabilidade: 'A',
    vigente: true, status: 'ATIVO', dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
  });
}

function derivado(slug: string, titulo: string, tipoDocumento: string, subarea: string | null, assunto: string, conteudo: string, tags: string[], opts: { conf?: string; status?: string; urlFonte?: string; fonte?: string; rel?: string } = {}): string {
  return JSON.stringify({
    slug, titulo, tipoDocumento, area: 'penal', subarea, assunto, prioridade: 'P1',
    conteudo,
    metadados: { elaboracao: 'EJC — redação estrutural própria com base nos textos oficiais capturados em 2026-08-30', aviso_mg: MG_NOTA },
    tags, fonte: opts.fonte ?? EJC, urlFonte: opts.urlFonte ?? null, dataConsulta: D,
    confiabilidade: opts.conf ?? 'B', vigente: true, status: opts.status ?? 'ATIVO',
    dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
    rel: opts.rel,
  });
}

const cp1_11 = T('cp_arts-1-11.txt');
const cp13_29 = T('cp_arts-13-29.txt');
const cp138_140 = T('cp_arts-138-140.txt');
const cp155 = T('cp_art155.txt');
const cp157 = T('cp_art157.txt');
const cp163 = T('cp_art163.txt');
const cp168 = T('cp_art168.txt');
const cpp282 = T('cpp_art282.txt');
const cpp283 = T('cpp_art283.txt');
const cpp310 = T('cpp_art310.txt');
const cpp311 = T('cpp_art311.txt');
const cpp312 = T('cpp_art312.txt');
const cpp313 = T('cpp_art313.txt');
const cpp317 = T('cpp_art317.txt');
const cf5 = T('cf5_lxi-lxvii.txt');
const l14155 = T('L14155.htm');

const docs: string[] = [];

docs.push(lei('cp-arts-1-11-aplicacao-lei-penal', 'CP arts. 1º-11 — Aplicação da lei penal: legalidade, retroatividade benigna, tempo e lugar (texto literal)', 'aplicacao-lei-penal', 'CP — aplicação da lei penal',
`## Código Penal — Arts. 1º a 11 (texto literal, Planalto compilado — consulta ${D})

${cp1_11}`,
  'CP/1940 arts. 1º-11', URL_CP, ['1', '2', '3', '4', '7', '11'],
  ['penal/aplicacao-lei-penal', 'geral/legislacao']));

docs.push(lei('cp-arts-13-29-crime-autoria-participacao', 'CP arts. 13-29 — Relação de causalidade, dolo/culpa, tentativa, erro, autoria e participação (texto literal)', 'teoria-do-crime', 'CP — teoria do crime',
`## Código Penal — Arts. 13 a 29 (texto literal, Planalto compilado — consulta ${D})

${cp13_29}`,
  'CP/1940 arts. 13-29', URL_CP, ['13', '14', '17', '18', '22', '26', '28', '29'],
  ['penal/teoria-do-crime']));

docs.push(lei('cp-arts-138-140-honra-texto-literal', 'CP arts. 138-140 — Calúnia, difamação e injúria (texto literal)', 'honra', 'CP — crimes contra a honra',
`## Código Penal — Arts. 138 a 140 (texto literal, Planalto compilado — consulta ${D})

${cp138_140}`,
  'CP/1940 arts. 138-140', URL_CP, ['138', '139', '140'],
  ['penal/honra']));

docs.push(lei('cp-art-155-furto-texto-literal', 'CP art. 155 — Furto: caput, majorantes, furto privilegiado e equiparado (texto literal)', 'crimes-patrimoniais', 'CP — furto',
`## Código Penal — Art. 155 (texto literal, Planalto compilado — consulta ${D})

${cp155}`,
  'CP/1940 art. 155', URL_CP, ['155', '155 § 1º', '155 § 2º', '155 § 4º'],
  ['penal/crimes-patrimoniais']));

docs.push(lei('cp-art-157-roubo-texto-literal', 'CP art. 157 — Roubo: caput, formas qualificadas e latrocínio (texto literal)', 'crimes-patrimoniais', 'CP — roubo',
`## Código Penal — Art. 157 (texto literal, Planalto compilado — consulta ${D})

${cp157}`,
  'CP/1940 art. 157', URL_CP, ['157', '157 § 1º', '157 § 3º'],
  ['penal/crimes-patrimoniais']));

docs.push(lei('cp-art-163-dano-texto-literal', 'CP art. 163 — Dano: caput e parágrafo único (texto literal)', 'crimes-patrimoniais', 'CP — dano',
`## Código Penal — Art. 163 (texto literal, Planalto compilado — consulta ${D})

${cp163}`,
  'CP/1940 art. 163', URL_CP, ['163'],
  ['penal/crimes-patrimoniais']));

docs.push(lei('cp-art-168-apropriacao-indebita-texto-literal', 'CP art. 168 — Apropriação indébita: caput e majorantes (texto literal)', 'crimes-patrimoniais', 'CP — apropriação indébita',
`## Código Penal — Art. 168 (texto literal, Planalto compilado — consulta ${D})

${cp168}`,
  'CP/1940 art. 168', URL_CP, ['168', '168 § 1º'],
  ['penal/crimes-patrimoniais']));

docs.push(lei('cpp-arts-282-283-cautelares-fundamentos', 'CPP arts. 282-283 — Medidas cautelares: requisitos e admissibilidade (texto literal)', 'prisoes-cautelares', 'CPP — medidas cautelares',
`## Código de Processo Penal — Arts. 282 e 283 (texto literal, Planalto compilado — consulta ${D})

### Art. 282 — Cautelaridade e excepcionalidade
${cpp282}

### Art. 283 — Prisão como última medida
${cpp283}`,
  'CPP/1941 arts. 282-283', URL_CPP, ['282', '283'],
  ['penal/prisoes-cautelares']));

docs.push(lei('cpp-arts-310-317-flagrante-custodia', 'CPP arts. 310-317 — Flagrante, audiência de custódia e substituição por cautelares (texto literal)', 'prisoes-cautelares', 'CPP — flagrante e custódia',
`## Código de Processo Penal — Arts. 310, 311, 312, 313 e 317 (texto literal, Planalto compilado — consulta ${D})

### Art. 310 — Conduta diante do preso em flagrante
${cpp310}

### Art. 311 — Auto de flagrante
${cpp311}

### Art. 312 — Prisão preventiva
${cpp312}

### Art. 313 — Cabimento
${cpp313}

### Art. 317 — Comparecimento obrigatório
${cpp317}

NOTA EJC: a audiência de custódia em 24h decorre do art. 310 (texto acima) e do CF art. 5º LXII (doc cf-art-5-lxi-lxvii-prisoes); recomendações complementares da Resolução CNJ [VERIFICAR RESOLUÇÃO CNJ VIGENTE].`,
  'CPP/1941 arts. 310-317', URL_CPP, ['310', '311', '312', '313', '317'],
  ['penal/prisoes-cautelares', 'penal/prazos']));

docs.push(lei('cf-art-5-lxi-lxvii-prisoes', 'CF/88 art. 5º, LXI-LXVII — Garantias individuais da prisão e do processo penal (texto literal)', 'garantias', 'CF — garantias penais',
`## CF/1988 — Art. 5º, incisos LXI a LXVII (texto literal, Planalto — consulta ${D})

${cf5}`,
  'CF/1988 art. 5º LXI-LXVII', URL_CF, ['5º LXI', '5º LXII', '5º LXVII'],
  ['penal/garantias', 'penal/prisoes-cautelares']));

docs.push(lei('l14155-fraude-eletronica-alteracoes', 'Lei 14.155/2021 — Alterações no estelionato e na fraude eletrônica (texto literal)', 'crimes-patrimoniais', 'Lei 14.155 — fraude eletrônica',
`## Lei 14.155/2021 (texto literal, Planalto — consulta ${D})

${l14155}

NOTA EJC: esta lei inseriu o § 2º VII no art. 171 do CP (estelionato por meios eletrônicos) e redefiniu o art. 311-A — o texto do CP compilado já reflete as alterações (doc cp-art171-estelionato-fraude-eletronica do LOTE-025 e cp-art311-a-fraude-certames).`,
  'Lei 14.155/2021', URL_L14155, ['171 § 2º VII', '311-A'],
  ['penal/crimes-patrimoniais', 'digital/fraude-eletronica']));

// ===== DERIVADOS =====

docs.push(derivado('doutrina-teoria-do-crime-aplicacao-defesa', 'Doutrina — Teoria do crime aplicada à defesa: tipicidade, ilicitude e culpabilidade', 'DOUTRINA', 'teoria-do-crime', 'Teoria do crime — aplicação',
`## Teoria do crime — aplicação prática à defesa (EJC)

Conceito EJC: um fato é punível quando reúne TIPICIDADE (conduta amoldada ao tipo legal — CP arts. 13-29 LITERAIS), ILICITUDE (ausência de excludentes) e CULPABILIDADE (imputabilidade, potencial consciência da ilicitude, exigibilidade de conduta diversa — fundamentos nos arts. 22/26/28 LITERAIS).

### Roteiro de análise da defesa
1. Tipicidade: descrever a conduta real (não a imputada) e verificar se ela cabe literalmente no tipo do doc de LEGISLACAO correspondente; olhar para elementos descritivos e normativos.
2. Antijuridicidade: excludentes com base nos LITERAIS (ex.: coação irresistível art. 22; inexigibilidade art. 26 para semi-imputáveis).
3. Culpabilidade: verificar idade, intoxicação, coação moral, erro de tipo/proibição (arts. 20-21 LITERAIS — erro sobre elemento do tipo; erro sobre ilicitude inescusável).
4. Concausa: art. 13 (LITERAL) — concausas preexistentes/supervenientes relativamente independentes.
5. Tentativa: art. 14 II (LITERAL) — somente nos crimes dolosos com início de execução e não consumação; crimes culposos não admitem tentativa (fundamento direto no texto).

### Riscos
- Confundir erro de tipo (art. 20) com erro de proibição (art. 21) — consequências penais distintas (excludente × reduzida).
- Aplicar excludente sem amparo textual — o EJC NÃO sustenta tese sem base literal ou doutrina própria marcada.

### Probabilidade qualitativa
Alta para teses de tipicidade quando a descrição fática não se encaixa literalmente no tipo; média para excludentes subjetivas.`,
  ['penal/teoria-do-crime', 'penal/doutrina'],
  { rel: 'cp-arts-13-29-crime-autoria-participacao|COMPLEMENTA|Fundamentos nos arts. 13-29 LITERAIS' }));

docs.push(derivado('doutrina-crimes-patrimoniais-distincoes', 'Doutrina — Crimes patrimoniais: distinções entre furto, roubo, apropriação indébita, dano e estelionato', 'DOUTRINA', 'crimes-patrimoniais', 'Crimes patrimoniais — distinções',
`## Crimes patrimoniais — distinções aplicadas (EJC)

Base LITERAL: cp-art-155-furto (subtração de coisa alheia móvel), cp-art-157-roubo (subtração após violência ou grave ameaça), cp-art-168-apropriacao-indébita (inversão da posse de coisa que já estava legitimamente com o agente), cp-art-163-dano (destruição/deterioração sem subtração), cp-art171-estelionato-fraude-eletronica (LOTE-025 — obtenção de vantagem ilícita por astúcia/artifício) e cp-art311-a-fraude-certames (LOTE-025).

### Critério de distinção (sequência de perguntas)
1. Houve SUBTRAÇÃO (retirada da posse com apoderamento)? Não → dano/apropriação/estelionato.
2. Houve violência ou grave ameaça à PESSOA ANTES/SIMULTÂNEO à subtração? Sim → roubo (157); não → furto (155).
3. A coisa já estava com o agente por título legítimo (depósito, mandato, guarda)? Sim → apropriação indébita (168).
4. Houve falsidade/astúcia para induzir a vítima a entregar vantagem voluntariamente? Sim → estelionato (171).
5. Houve apenas destruição/ineficaciação sem apoderamento? → dano (163).

### Enquadramento processual
- Menor potencial ofensivo: furto simples (155 caput) pode ter pena máxima ≤ 2 anos (aplicação do privilégio § 2º depende do caso — LITERAL) → potencial cabimento JECrim (Lei 9.099 art. 61 LITERAL LOTE-012) — analisar sempre.
- Fraude eletrônica (171 § 2º VII): competência comum (NÃO JECrim pela pena) — verificar pena atual no texto LITERAL.

### Riscos
- Confundir apropriação indébita com estelionato (vítima entrega por erro no estelionato; entrega legítima sem erro na apropriação).
- Furto × roubo: a violência deve ser MEIO para subtração, não fim em si.

### Probabilidade qualitativa
Alta para revisão de enquadramento por via de defesa preliminar no JECrim quando a narrativa não sustenta violência/grave ameaça.`,
  ['penal/crimes-patrimoniais', 'penal/doutrina'],
  { rel: 'cp-art-155-furto-texto-literal|COMPLEMENTA|Distinções fundamentadas nos tipos LITERAIS' }));

docs.push(derivado('doutrina-honra-online-digital', 'Doutrina — Crimes contra a honra no ambiente digital: adaptações e provas', 'DOUTRINA', 'honra', 'Honra online',
`## Crimes contra a honra no ambiente digital (EJC)

Base LITERAL: cp-arts-138-140-honra (calúnia/difamação/injúria, incluindo injúria qualificada § 3º). Contexto digital: a conduta é praticada por plataformas (redes sociais, mensagens, avaliações públicas).

### Pontos práticos da defesa e da vitimização
1. Preservação de prova: captura com data/hora, URL e conteúdo integral; LGPD como vetor de acesso ao autor (art. 18-19 LGPD — direitos do titular; doc lgpd-arts-18-19 LOTE digital) e requisição via autoridades.
2. Autoria: conta fake não exclui autoria — prova técnica de autenticação é necessária; NÃO afirmar que "o IP prova autoria" sem perícia.
3. Difamação × injúria: difamação ofende REPUTAÇÃO (fato determinado); injúria ofende DIGNIDADE/DECORO (qualificação da pessoa) — distinção aplicável ao post ofensivo.
4. JECrim: crimes de honra são de menor potencial ofensivo (penas ≤ 2 anos — verificar literal) → rota Lei 9.099 (representação, transação, suspensão — docs LOTE-025).
5. Excludentes: direito de crítica (art. 142 — [VERIFICAR TEXTO], não capturado nesta rodada) e verdade nos casos do art. 138 § III (LITERAL).

### Riscos
- Avaliação pública negativa sem fato determinado pode não configurar difamação (subjetividade judicial).
- Reprodução de conteúdo de terceiro: possibilidade de responsabilidade autônoma por republicação.

### Probabilidade qualitativa
Média-Alta para desclassificação de calúnia → difamação quando falta o elemento "fato criminoso" definido no art. 138 caput (LITERAL).`,
  ['penal/honra', 'digital/medidas-despenalizadoras'],
  { rel: 'cp-arts-138-140-honra-texto-literal|COMPLEMENTA|Aplicação digital dos tipos LITERAIS' }));

docs.push(derivado('doutrina-prisoes-cautelares-panorama', 'Doutrina — Prisões e medidas cautelares: panorama aplicado (CF + CPP)', 'DOUTRINA', 'prisoes-cautelares', 'Prisões e cautelares — panorama',
`## Prisões e medidas cautelares — panorama aplicado (EJC)

Base LITERAL: cf-art-5-lxi-lxvii-prisoes (flagrante ou ordem escrita; comunicação em 24h; MP/Defensor; estados; banimento; juiz de exceção), cpp-arts-310-317-flagrante-custodia (audiência de custódia, substituição por cautelares, preventiva) e cpp-arts-282-283-cautelares-fundamentos (necessidade + adequação; prisão como exceção).

### Roteiro prático após flagrante
1. Custódia (art. 310 CPP LITERAL): avaliar ilegalidade do flagrante → relaxamento; presença de necessidade → preventiva; caso contrário → substituição por cautelares diversas (art. 319 — [VERIFICAR TEXTO COMPLETO]).
2. Requisitos da preventiva (art. 312 LITERAL): prova da materialidade + indício de autoria + necessidade cautelar (garantia da ordem, instrução, aplicação da lei penal, tutela da vítima — incisos LITERAIS).
3. Cabimento (art. 313 LITERAL): crimes dolosos punidos com pena privativa máxima superior a 4 anos; reincidência etc. — verificar incisos LITERAIS antes de sustentar.
4. Adequação (art. 282 LITERAL): se cautelar diversa é suficiente, a prisão é desproporcional.
5. Periculum libertatis: o pedido de liberdade deve atacar a necessidade cautelar (falta de necessidade), não apenas a inocência.

### Riscos
- A audiência de custódia não é uma "audiência de defesa plena" — foco em legalidade do flagrante e tortura/maus-tratos.
- Recusa de comparecimento obrigatório (art. 317 LITERAL) pode gerar conduzida — instruir o cliente antes.

### Probabilidade qualitativa
Alta quando o flagrante tem vício formal (não observado 24h, não comunicada a família) ou quando há substituição razoável por cautelares.`,
  ['penal/prisoes-cautelares', 'penal/doutrina'],
  { rel: 'cpp-arts-310-317-flagrante-custodia|COMPLEMENTA|Roteiro fundamentado nos arts. 310-317 LITERAIS' }));

docs.push(derivado('tese-furto-menor-potencial-ofensivo-jecrim', 'Tese — Furto simples de pequeno valor como menor potencial ofensivo (JECrim)', 'TESE', 'crimes-patrimoniais', 'Tese — furto JECrim',
`## Tese: furto simples como menor potencial ofensivo — rota JECrim

### Fundamentos (somente textos oficiais capturados — ${D})
1. CP art. 155 (LITERAL): furto simples — pena de reclusão de 1 a 6 anos (com nota "(Redação dada pela Lei 15.397, de 2026)" registrada como consta); furto privilegiado (§ 2º LITERAL) permite substituição/diminuição quando primário e de pequeno valor.
2. Lei 9.099 art. 61 (LITERAL — LOTE-012): competência do JECrim para contravenções e crimes com pena máxima ≤ 2 anos.
3. CP art. 14 II (LITERAL): tentativa tem pena reduzida de 1 a 2/3 — pode tornar a pena máxima ≤ 2 anos em furtos tentados.
4. Lei 9.099 arts. 76/89 (LITERAL — LOTE-025): transação penal e suspensão condicional do processo.

### Requisitos
- Furto simples (sem majorantes — § 1º LITERAL) OU hipótese com redução objetiva da pena (tentativa/privilégio).
- Antecedentes compatíveis (primariedade para o privilégio do § 2º).

### Riscos
- Majorantes (repouso noturno § 1º LITERAL; escalada; destreza) podem exceder o limite de 2 anos — verificar antes.
- "Pequeno valor" depende do parâmetro do art. 155 § 4º (LITERAL) — conferir o valor de referência transcrito.

### Probabilidade qualitativa
Média-Alta para furto simples com privilégio aplicado; baixa quando há majorantes que excedem o limite de competência.

### Links EJC
- cp-art-155-furto-texto-literal, lei-9099-jecrim-arts-60-61-72-76 (LOTE-012), fluxo-jecrim (LOTE-025).`,
  ['penal/crimes-patrimoniais', 'penal/teses'],
  { rel: 'cp-art-155-furto-texto-literal|COMPLEMENTA|Fundamenta a tese no art. 155 LITERAL' }));

docs.push(derivado('tese-desclassificacao-fraude-eletronica', 'Tese — Desclassificação entre estelionato (171 caput) e fraude eletrônica (171 § 2º VII / 311-A)', 'TESE', 'crimes-patrimoniais', 'Tese — desclassificação fraudes',
`## Tese: desclassificação entre estelionato, fraude eletrônica (171 § 2º VII) e fraude em negócio por meios eletrônicos (311-A)

### Fundamentos (somente textos oficiais capturados — ${D})
1. CP art. 171 (LITERAL LOTE-025): estelionato — vantagem ilícita por astúcia/artifício; § 2º VII: estelionato por meio eletrônico OU contra pessoa por meio eletrônico.
2. CP art. 311-A (LITERAL LOTE-025): fraude para alterar/adulterar funcionamento de sistema informático/econômico/administrativo para obter vantagem indevida.
3. Lei 14.155/2021 (LITERAL neste lote): origem normativa das alterações — registrada como consta.

### Critérios de desclassificação (rotas)
- Vítima entrega vantagem POR ERRO induzido (mesmo que o meio seja eletrônico) → 171 § 2º VII (não 311-A).
- Agente interfere no SISTEMA (adulteração técnica sem "erro da vítima") → 311-A.
- Meio NÃO eletrônico e sem § 2º aplicável → estelionato simples (caput).

### Requisitos para sustentar
- Narrativa técnica do meio usado (phishing, clonagem, troca de terminal, adulteração de software).
- Evidência se houve erro da vítima ou apenas manipulação do sistema.

### Riscos
- Jurisprudência local pode consolidar entendimentos específicos — não afirmar julgados aqui (anti-invenção).
- Acúmulo de fraudes em série pode agregar crimes — verificar continuidade delitiva nos LITERAIS (arts. 70-71 não capturados nesta rodada — pendência).

### Probabilidade qualitativa
Média-Alta para desclassificação 311-A → 171 § 2º VII quando há erro da vítima documentado; baixa sem prova técnica.`,
  ['penal/crimes-patrimoniais', 'digital/fraude-eletronica', 'penal/teses'],
  { rel: 'l14155-fraude-eletronica-alteracoes|COMPLEMENTA|Fundamenta no histórico legislativo LITERAL' }));

docs.push(derivado('peca-liberdade-provisoria-flagrante', 'Peça — Liberdade provisória / relaxamento de flagrante com variáveis', 'PECA', 'prisoes-cautelares', 'Peça — liberdade provisória',
`## MODELO EJC — Pedido de liberdade provisória com/sem fiança + relaxamento de flagrante

EXCELENTÍSSIMO(A) SENHOR(A) JUIZ(A) DE DIREITO DA {VARA_COMPETENTE} DA COMARCA DE {COMARCA}

Autos do Auto de Prisão em Flagrante nº {NUMERO_APF} | Preso: {NOME_PREZO} | Qualificação: {QUALIFICACAO} | Data e local do flagrante: {DATA_LOCAL_FLAGRANTE}

I — SÍNTESE: requer-se (a) relaxamento do flagrante por ilegalidade (CF art. 5º LXI LITERAL — prisão sem flagrante e sem ordem escrita, ou vício do APF) e, subsidiariamente, (b) liberdade provisória sem fiança ou com fiança, com substituição por medidas cautelares (CPP art. 310 § 2º LITERAL).

II — FUNDAMENTOS:
1. Flagrante — vício alegado: {DESCRICAO_VICIO_FLAGRANTE} (ex.: ausência de situação de flagrância nos termos do CPP; atraso na comunicação — CF art. 5º LXII LITERAL de 24h).
2. Não preenchimento dos requisitos da preventiva (CPP art. 312 LITERAL): prova da materialidade {SIM_NAO}; indícios de autoria {SIM_NAO}; necessidade cautelar de garantia da ordem pública/econômica, instrução ou aplicação da lei penal {SIM_NAO} — nada comprovado nos autos.
3. Inadmissibilidade pelo art. 313 (LITERAL): o crime do caso tem pena máxima {PENA_MAXIMA} — [VERIFICAR INCISO APLICÁVEL].
4. Proporcionalidade (CPP art. 282 LITERAL): medidas cautelares diversas suficientes — sugeridas: comparecimento periódico ao juízo, proibição de contato com a vítima, proibição de acesso a {LOCAL}, suspensão de {ATIVIDADE}.
5. Circunstâncias pessoais: {CIRCUNSTANCIAS_FAVORAVEIS} (residência fixa, trabalho, família, primeiros antecedentes).

III — PEDIDOS: a) relaxamento imediato (CF art. 5º LXV LITERAL — prisão ilegal); b) subsidiariamente, liberdade provisória com fiança em valor compatível; c) aplicação das cautelares listadas; d) expedição de alvará.

Nestes termos, pede deferimento. {CIDADE}, {DATA}.
{NOME_E_OAB_ADVOGADO}

CHECKLIST EJC: (1) verificar data-hora exata do flagrante e da comunicação (24h); (2) conferir assinaturas e dados do APF; (3) listar provas do vício; (4) mencionar cautelares propostas com endereço/telefone atualizável; (5) não afirmar ausência de antecedentes sem consulta {CONSULTA_REALIZADA}.`,
  ['penal/prisoes-cautelares', 'penal/pecas'],
  { rel: 'cf-art-5-lxi-lxvii-prisoes|COMPLEMENTA|Fundamenta no art. 5º LITERAL' }));

docs.push(derivado('peca-defesa-direta-crime-patrimonial-jecrim', 'Peça — Defesa direta em crime patrimonial no JECrim (após citação) com variáveis', 'PECA', 'crimes-patrimoniais', 'Peça — defesa JECrim patrimonial',
`## MODELO EJC — Defesa direta em crime patrimonial no JECrim (complementa peca-defesa-preliminar-jecrim LOTE-025)

EXCELENTÍSSIMO(A) SENHOR(A) JUIZ(A) DO {JUIZADO_ESPECIAL_CRIMINAL} DE {COMARCA}

Processo nº {NUMERO_PROCESSO} | Acusado: {NOME_ACUSADO} | Acusação: {CRIME_DESCRITO} (termo circunscrito nº {NUMERO_TCR})

I — SÍNTESE: responde-se à denúncia/termo com desclassificação e/ou absolvição conforme fundamentos abaixo.

II — FUNDAMENTOS DE MÉRITO:
1. Inexistência do elemento típico alegado: {ELEMENTO_FALTANTE} — p.ex. sem violência/grave ameaça (roubo→furto); sem astúcia/artifício (estelionato→inexistente); coisa não "alheia móvel" ou sem subtração (cp-art-155 LITERAL).
2. Desclassificação: diante do LITERAL do CP {ARTIGO_APLICAVEL}, o fato desclassifica-se para {CRIME_DESCLASSIFICADO}, de menor potencial ofensivo — cabendo JECrim (Lei 9.099 arts. 60-61 LITERAL LOTE-012).
3. Autoria negada: {NARRATIVA_AUTORIA} — não houve reconhecimento válido; depoimentos contraditórios {ESCLARECER}.
4. Excludentes: {EXCLUDENTE_ALEGADA} (coação — art. 22 LITERAL; erro de tipo — art. 20 LITERAL; excludente de antijuridicidade específica {QUAL}).
5. Tentativa: se alegado, verificar se houve início de execução (art. 14 II LITERAL) — mero ato preparatório não configura tentativa.

III — PROVAS E DOCUMENTOS: {LISTA_PROVAS} (notas, mensagens, testemunhas {NOMES_TESTEMUNHAS_ou_LISTA_NO_FL}).

IV — PEDIDOS: a) absolvição (art. 386 {CODIGO_PROCESSO_PENAL_APPLICAVEL}); b) subsidiariamente, desclassificação e aplicação de medidas despenalizadoras (transação — art. 76 LITERAL; suspensão — art. 89 LITERAL); c) compensação/delação {SE_APLICAVEL}.

Nestes termos, pede deferimento. {CIDADE}, {DATA}.
{NOME_E_OAB_ADVOGADO}

CHECKLIST EJC: (1) conferir prazo de resposta (10 dias LITERAL — prazo-jecrim-apelacao-embargos-10-5-dias LOTE-025); (2) anexar prova de eventual pagamento/reparação; (3) testemunhas arroladas com endereço; (4) não inventar valores/julgados; (5) verificar se há transação prévia recusada/aceita.`,
  ['penal/crimes-patrimoniais', 'penal/pecas'],
  { rel: 'cp-art-155-furto-texto-literal|COMPLEMENTA|Defesa fundamentada nos tipos LITERAIS' }));

docs.push(derivado('checklist-triagem-defesa-criminal-patrimonial', 'Checklist — Triagem de defesa criminal patrimonial (15 pontos)', 'CHECKLIST', 'crimes-patrimoniais', 'Checklist — defesa patrimonial',
`## Checklist EJC — defesa criminal patrimonial (fatos: furto/roubo/apropriação/estelionato/fraude eletrônica)

1. Identificar o crime imputado e o dispositivo citado no auto/termo (comparar com o LITERAL correspondente: 155/157/168/163/171 § 2º VII/311-A).
2. Verificar a narrativa dos fatos: subtração? violência? entrega por erro? manipulação de sistema?
3. Data-hora do flagrante e da comunicação à família/juízo (24h — CF art. 5º LXII LITERAL).
4. Vícios do APF: assinaturas, testemunhas, local da prisão, descrição da conduta.
5. Pena máxima do caso (LITERAL do tipo) → cabimento JECrim (≤ 2 anos — Lei 9.099 art. 61 LITERAL)?
6. Majorantes aplicadas (155 § 1º LITERAL — repouso noturno etc.) — verificadas uma a uma?
7. Privilégio do § 2º (LITERAL): primariedade e pequeno valor — {SIM_NAO}.
8. Autoria: provas de reconhecimento, câmeras, testemunhas, biometria — solicitadas?
9. Materialidade: laudo do bem, nota, avaliação — anexados aos autos?
10. Provas de defesa: alibi, mensagens, recibos, e-mails, histórico de uso de dispositivos.
11. Excludentes cabíveis (coação art. 22, erro art. 20-21, inexigibilidade — LITERAIS).
12. Reparação do dano (reduz pena — art. 59/155 § 3º [VERIFICAR TEXTO]) — negociada?
13. Medidas despenalizadoras: transação/suspensão (arts. 76/89 LITERAL LOTE-025) — cabíveis?
14. Custódia: houve audiência e decisão substitutiva (CPP art. 310 LITERAL)? Risco de preventiva — art. 313 LITERAL aplicável?
15. Prazos: defesa preliminar (art. 81 LITERAL? [VERIFICAR]) e apelação (10 dias — prazo-jecrim-apelacao-embargos-10-5-dias LOTE-025).

REGISTRO EJC: preencher com data e fonte de cada item; itens não confirmados ficam [VERIFICAR] até conferência no processo.`,
  ['penal/crimes-patrimoniais', 'penal/checklists'],
  { rel: 'fluxo-jecrim|CONEXO_TEMATICO|Checklist complementa o fluxo JECrim' }));

docs.push(derivado('fluxo-flagrante-a-decisao-liberdade', 'Fluxo — Do flagrante à decisão de liberdade (7 etapas)', 'FLUXO', 'prisoes-cautelares', 'Fluxo — flagrante→liberdade',
`## Fluxo EJC — do flagrante à decisão de liberdade (fundamentos: CF art. 5º LXI-LXVII LITERAL; CPP arts. 282-283/310-317 LITERAIS)

ETAPA 1 — FLAGRANTE (CF art. 5º LXI LITERAL): prisão só em flagrante ou ordem escrita fundamentada. AÇÃO: anotar hora exata; obter cópia do APF; contato com família.
ETAPA 2 — COMUNICAÇÃO 24H (CF art. 5º LXII LITERAL): prisão e local comunicados imediatamente ao juiz, MP e família; vício de comunicação = argumento de relaxamento.
ETAPA 3 — AUDIÊNCIA DE CUSTÓDIA (CPP art. 310 LITERAL): juiz avalia ilegalidade (relaxa), necessidade (preventiva) ou substituição por cautelares. AÇÃO: peça oral/escrita com peça-liberdade-provisoria-flagrante.
ETAPA 4 — DECISÃO SOBRE A CAUTELAR: se mantida a prisão (preventiva — art. 312 LITERAL), ATACAR a necessidade cautelar, não só a inocência; se concedida liberdade, cumprir cautelares impostas.
ETAPA 5 — MP (CF art. 5º LXIV LITERAL): MP informado — verificar parecer; DPF/autoridade responsável pelo APF (art. 5º LXIII-LXV LITERAL: silêncio direito; ilegalidade relaxamento).
ETAPA 6 — DEFESA TÉCNICA: análise da tipicidade (doutrina-teoria-do-crime + LITERAIS), desclassificação (tese desclassificação fraudes/furto JECrim) e provas de defesa.
ETAPA 7 — DECISÃO/RECURSO: habeas corpus para tribunal [VERIFICAR PROCEDIMENTO DO TRIBUNAL]; apelação de sentença (10 dias — prazo-jecrim-apelacao-embargos-10-5-dias LOTE-025).

MONITORAMENTO EJC: registrar cada decisão com data e fonte; atualizar o caso com riscos (fuga, reiteração — art. 312 LITERAL) e provas pendentes.`,
  ['penal/prisoes-cautelares', 'penal/fluxos'],
  { rel: 'cpp-arts-310-317-flagrante-custodia|COMPLEMENTA|Etapas fundamentadas nos LITERAIS' }));

docs.push(derivado('prazo-custodia-24h-cpp', 'Prazo — Comunicação do flagrante em 24h e audiência de custódia (CF art. 5º LXII + CPP art. 310)', 'PRAZO', 'prisoes-cautelares', 'Prazo — custódia 24h',
`## Prazo — comunicação do flagrante e custódia (fontes LITERAIS, consulta ${D})

- COMUNICAÇÃO: CF art. 5º LXII (LITERAL — doc cf-art-5-lxi-lxvii-prisoes) — "a prisão de qualquer pessoa e o local onde se encontre serão comunicados IMEDIATAMENTE ao juiz competente e à família ou a pessoa por ela indicada" (texto LITERAL; termo "imediatamente" como consta) + o CPP art. 310 (LITERAL — doc cpp-arts-310-317-flagrante-custodia) fixa a apresentação ao juiz "em até 24 horas" após a realização da prisão.
- RELAXAMENTO: CF art. 5º LXV (LITERAL) — prisão ilegal relaxada "imediatamente" pela autoridade judiciária.
- DEFESA PRELIMINAR JECrim: prazo do LOTE-025 (doc prazo-jecrim-apelacao-embargos-10-5-dias).

TERMO INICIAL: momento da prisão (não do APF). RISCO: não comunicação à família não anula o processo, mas vicia a prisão (argumento de relaxamento — fundamentar nos LITERAIS).

FUNDAMENTO: CF/1988 art. 5º LXII/LXV (Planalto — consulta ${D}) + CPP art. 310 (Planalto — consulta ${D}).`,
  ['penal/prisoes-cautelares', 'penal/prazos', 'geral/prazos'],
  { fonte: PLANALTO, urlFonte: URL_CF, rel: 'cf-art-5-lxi-lxvii-prisoes|COMPLEMENTA|Prazos extraídos dos LITERAIS' }));

docs.push(derivado('regra-se-entao-penal-rotas-27', 'Regras SE-ENTÃO — rotas de Penal II (patrimonial, honra, cautelares, fraude eletrônica)', 'REGRA_INTELIGENCIA', 'geral', 'Regras SE-ENTÃO — Penal II',
`## Regras SE-ENTÃO — Penal II (rotas EJC; fundamentos nos docs literais deste lote)

SE houve SUBTRAÇÃO com violência OU grave ameaça à pessoa ENTÃO roubo (cp-art-157 LITERAL); SE subtração SEM violência ENTÃO furto (cp-art-155 LITERAL).

SE a coisa já estava legitimamente com o agente (depósito/guarda/mandato) ENTÃO apropriação indébita (cp-art-168 LITERAL) — não furto.

SE houve astúcia/artifício para induzir a vítima ao erro ENTÃO estelionato (cp-art171 LOTE-025); SE o meio foi eletrônico ENTÃO § 2º VII; SE houve manipulação do sistema sem erro da vítima ENTÃO 311-A (LOTE-025).

SE a pena máxima aplicável ≤ 2 anos ENTÃO menor potencial ofensivo → JECrim (Lei 9.099 art. 61 LITERAL LOTE-012) + medidas despenalizadoras (arts. 76/89 LITERAL LOTE-025).

SE crime de honra praticado em rede social ENTÃO doutrina-honra-online-digital + captura de prova com data/URL antes de qualquer pedido.

SE preso em flagrante ENTÃO etapa 1 do fluxo-flagrante-a-decisao-liberdade; SE comunicada a prisão além de 24h ENTÃO argumento de relaxamento (CF art. 5º LXII/LXV LITERAL).

SE há prova de materialidade + indício de autoria + necessidade cautelar ENTÃO preventiva possível (CPP art. 312 LITERAL); CASO CONTRÁRIO, pedir liberdade com cautelares (art. 282 LITERAL).

SE qualquer item depende de norma estadual MG não capturada ENTÃO marcar REVISAO_HUMANA + [VERIFICAR LEI ESTADUAL MG] (anti-invenção).`,
  ['penal/geral', 'penal/regras'],
  { rel: 'doutrina-teoria-do-crime-aplicacao-defesa|CONEXO_TEMATICO|Rotas usam os LITERAIS deste lote' }));

docs.push(derivado('jurimetria-vazia-penal-mg', 'Jurimetria — Estrutura vazia para dados penais reais (MG) — DataJud', 'JURIMETRIA', 'geral', 'Jurimetria — penal MG (vazia)',
`## Jurimetria — Penal MG (estrutura VAZIA — dadosFicticios: false)

### Por que vazia
O EJC NÃO inventa percentuais, tempos médios ou taxas. Dados processuais penais do TJMG podem ser obtidos pela API pública DataJud/CNJ (https://datajud-wiki.cnj.jus.br/) mediante chave oficial (env DATAJUD_API_KEY). Nesta rodada a chave não está configurada — NENHUM número é citado.

### Estrutura preparada (campos esperados para preenchimento futuro)
- Fonte: API Pública DataJud/CNJ — endpoint {api_publica_tjmg} (tribunal TJMG), classe/juizado conforme consulta.
- Período da amostra: {PERIODO}
- Indicadores planejados: tempo médio de tramitação por classe penal de menor potencial; taxa de transação penal; taxa de suspensão condicional; duração entre flagrante e custódia; % de substituição por cautelares.
- Confiabilidade: A quando capturado diretamente da API; B quando consolidação de terceiro documentada (ver LOTE-022 — jurimetria JEC BH/Betim).
- LGPD: NUNCA ingerir números de processos individuais ou nomes de partes — apenas agregados (regra do LOTE-022).

### Relação com dados existentes
Ver jurimetria-jec-visao-geral-bh-betim-2025-2026 (LOTE-022) para a metodologia de agregação e alertas (2026 parcial; tempo observado ≠ duração definitiva).`,
  ['penal/geral', 'penal/jurimetria'],
  { conf: 'B', rel: 'jurimetria-jec-visao-geral-bh-betim-2025-2026|CONEXO_TEMATICO|Segue a mesma metodologia de agregação' }));

// Monta o arquivo final
const header = `// LOTE-027 — Penal II (compêndio EJC, foco MG): CP arts. 1º-11, 13-29, 138-140, 155, 157, 163, 168
// (literais); CPP arts. 282-283, 310-317 (literais); CF art. 5º LXI-LXVII (literal);
// Lei 14.155/2021 (literal) + derivados EJC (doutrina/teses/peças/fluxos/checklist/prazos/regras).
// Consulta Planalto: ${D}. ANTI-INVENÇÃO: NADA estadual MG citado como verbatim; portais MG bloqueados;
// [VERIFICAR LEI ESTADUAL MG] / [VERIFICAR RESOLUÇÃO CNJ] nos pontos dependentes.
import type { InputDocument } from '../../src/lib/ejc/types';

`;

const body = docs.map((j) => {
  const doc = JSON.parse(j) as Record<string, unknown> & { relacionamentos?: { destinoSlug: string; tipo: string; descricao: string }[] };
  const rel = (doc as unknown as { rel?: string }).rel;
  if (rel) {
    const [destino, tipo, descricao] = rel.split('|');
    doc.relacionamentos = [{ destinoSlug: destino, tipo, descricao }];
  }
  return JSON.stringify(doc, null, 1).replace(/\n/g, '\n  ');
}).join(',\n  ');

const out = header + 'export default [\n  ' + body + ',\n] as InputDocument[];\n';
writeFileSync('/home/z/my-project/data/ejc/lote-027-penal-ii.ts', out);
console.log('LOTE-027 gerado:', docs.length, 'documentos');
