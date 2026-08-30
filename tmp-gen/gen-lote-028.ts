// Gerador do LOTE-028 — Consumidor II (compêndio EJC, foco MG)
// Literais: CF art. 5º XXXII + art. 170 V; CDC arts. 30-41, 43-48, 53-55, 71-74, 83-90;
// Decreto 11.034/2022 (SAC) arts. 1º-10. Planalto, consulta 2026-08-30.
import { readFileSync, writeFileSync } from 'fs';

const T = (p: string) => readFileSync(`/tmp/leis-oficiais/${p}`, 'utf-8')
  .replace(/\s+/g, ' ')
  .replace(/`/g, "'")
  .trim();

const D = '2026-08-30';
const PLANALTO = 'Presidência da República — Planalto';
const URL_CF = 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm';
const URL_CDC = 'https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm';
const URL_SAC = 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/decreto/d11034.htm';
const EJC = 'Elaboração EJC — conteúdo estrutural original';
const MG_NOTA = 'NADA estadual é citado como verbatim nesta rodada: portais MG (almg.gov.br, mg.gov.br, iof.mg.gov.br, sefaz.mg.gov.br, tjmg.jus.br) BLOQUEADOS para captura em 2026-08-30.';

function lei(slug: string, titulo: string, subarea: string | null, assunto: string, conteudo: string, norma: string, urlFonte: string, artigos: string[], tags: string[]): string {
  return JSON.stringify({
    slug, titulo, tipoDocumento: 'LEGISLACAO', area: 'consumidor', subarea, assunto,
    prioridade: 'P1', conteudo,
    metadados: { numero: norma, orgao: 'Congresso Nacional', artigos_principais: artigos, vigente: true, confirmacao_texto: 'Extração literal do texto oficial do Planalto em 2026-08-30. Redações empilhadas com notas "(Redação dada pela ...)" e itens "(VETADO)" registrados como consta.' },
    tags, fonte: PLANALTO, urlFonte, dataConsulta: D, confiabilidade: 'A',
    vigente: true, status: 'ATIVO', dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
  });
}

function derivado(slug: string, titulo: string, tipoDocumento: string, subarea: string | null, assunto: string, conteudo: string, tags: string[], opts: { conf?: string; status?: string; urlFonte?: string; fonte?: string; rel?: string } = {}): string {
  return JSON.stringify({
    slug, titulo, tipoDocumento, area: 'consumidor', subarea, assunto, prioridade: 'P1',
    conteudo,
    metadados: { elaboracao: 'EJC — redação estrutural própria com base nos textos oficiais capturados em 2026-08-30', aviso_mg: MG_NOTA },
    tags, fonte: opts.fonte ?? EJC, urlFonte: opts.urlFonte ?? null, dataConsulta: D,
    confiabilidade: opts.conf ?? 'B', vigente: true, status: opts.status ?? 'ATIVO',
    dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
    rel: opts.rel,
  });
}

const cdc30_35 = [30, 31, 32, 33, 34, 35].map((n) => T(`cdc_art${n}.txt`)).join('\n\n');
const cdc36_38 = [36, 37, 38].map((n) => T(`cdc_art${n}.txt`)).join('\n\n');
const cdc39_41 = [39, 40, 41].map((n) => T(`cdc_art${n}.txt`)).join('\n\n');
const cdc43_44 = [43, 44].map((n) => T(`cdc_art${n}.txt`)).join('\n\n');
const cdc46_48 = [46, 47, 48].map((n) => T(`cdc_art${n}.txt`)).join('\n\n');
const cdc53_55 = [53, 54, 55].map((n) => T(`cdc_art${n}.txt`)).join('\n\n');
const cdc71_74 = [71, 72, 73, 74].map((n) => T(`cdc_art${n}.txt`)).join('\n\n');
const cdc83_85 = [83, 84, 85].map((n) => T(`cdc_art${n}.txt`)).join('\n\n');
const cdc86_90 = [86, 87, 88, 89, 90].map((n) => T(`cdc_art${n}.txt`)).join('\n\n');
const cf5x = T('cf_art5_xxxii.txt');
const cf170 = T('cf_art170.txt');
const sac = T('d11034_1-10.txt');
const cdc7 = T('cdc_art7.txt');

const docs: string[] = [];

docs.push(lei('cf-art5-xxxii-art170-v-consumidor-constitucional', 'CF/88 art. 5º XXXII e art. 170 V — Defesa do consumidor como direito fundamental e princípio da ordem econômica (texto literal)', 'geral', 'Defesa do consumidor — fundamento constitucional',
`## CF/1988 — Fundamento constitucional da defesa do consumidor (texto literal, Planalto — consulta ${D})

### Art. 5º, XXXII — Direito fundamental
${cf5x}

### Art. 170, V — Princípio da ordem econômica
${cf170}`,
  'CF/1988 art. 5º XXXII; art. 170 V', URL_CF, ['5º XXXII', '170 V'],
  ['consumidor/geral', 'geral/legislacao']));

docs.push(lei('cdc-art-7-direitos-basicos-marcos', 'CDC art. 7º — Direitos básicos: conexão com o rol do art. 6º e normas de melhor proteção (texto literal)', 'geral', 'CDC — direitos básicos',
`## CDC — Art. 7º (texto literal, Planalto — consulta ${D})

${cdc7}`,
  'CDC/1990 art. 7º', URL_CDC, ['7'],
  ['consumidor/geral']));

docs.push(lei('cdc-arts-30-35-oferta-vinculacao', 'CDC arts. 30-35 — Oferta e apresentação: vinculação, inexecução e obrigação de fazer (texto literal)', 'publicidade-oferta', 'CDC — oferta e apresentação',
`## CDC — Arts. 30 a 35 (texto literal, Planalto — consulta ${D})

${cdc30_35}`,
  'CDC/1990 arts. 30-35', URL_CDC, ['30', '31', '32', '33', '34', '35'],
  ['consumidor/publicidade-oferta']));

docs.push(lei('cdc-arts-36-38-publicidade', 'CDC arts. 36-38 — Publicidade: identificação, enganosa e abusiva, inversão do ônus da prova (texto literal)', 'publicidade-oferta', 'CDC — publicidade',
`## CDC — Arts. 36 a 38 (texto literal, Planalto — consulta ${D})

${cdc36_38}`,
  'CDC/1990 arts. 36-38', URL_CDC, ['36', '37', '38'],
  ['consumidor/publicidade-oferta']));

docs.push(lei('cdc-arts-39-41-praticas-abusivas', 'CDC arts. 39-41 — Práticas abusivas: rol do art. 39 e sanções (texto literal)', 'clausulas-abusivas', 'CDC — práticas abusivas',
`## CDC — Arts. 39 a 41 (texto literal, Planalto — consulta ${D})

${cdc39_41}`,
  'CDC/1990 arts. 39-41', URL_CDC, ['39', '40', '41'],
  ['consumidor/clausulas-abusivas']));

docs.push(lei('cdc-arts-43-44-cadastro-cobranca-info', 'CDC arts. 43-44 — Cadastros de consumo: acesso, retificação e notificação (texto literal)', 'cobranca-e-indebito', 'CDC — cadastros e cobrança',
`## CDC — Arts. 43 e 44 (texto literal, Planalto — consulta ${D})

${cdc43_44}`,
  'CDC/1990 arts. 43-44', URL_CDC, ['43', '43 § 4º', '44'],
  ['consumidor/cobranca-e-indebito']));

docs.push(lei('cdc-arts-46-48-informacao-contratos', 'CDC arts. 46-48 — Informação prévia, cláusulas iníquas e direito de arrependimento (texto literal)', 'contratos-consumidor', 'CDC — contratos e informação',
`## CDC — Arts. 46 a 48 (texto literal, Planalto — consulta ${D})

${cdc46_48}`,
  'CDC/1990 arts. 46-48', URL_CDC, ['46', '47', '48'],
  ['consumidor/contratos-consumidor']));

docs.push(lei('cdc-arts-53-55-contratos-credito', 'CDC arts. 53-55 — Contratos de crédito ao consumo e execução (texto literal)', 'credito-e-financiamento', 'CDC — crédito ao consumo',
`## CDC — Arts. 53 a 55 (texto literal, Planalto — consulta ${D})

${cdc53_55}`,
  'CDC/1990 arts. 53-55', URL_CDC, ['53', '54', '55'],
  ['consumidor/credito-e-financiamento']));

docs.push(lei('cdc-arts-71-74-cobranca-crimes-sancoes', 'CDC arts. 71-74 — Crimes e sanções administrativas de cobrança e publicidade (texto literal)', 'cobranca-e-indebito', 'CDC — crimes de cobrança',
`## CDC — Arts. 71 a 74 (texto literal, Planalto — consulta ${D})

${cdc71_74}`,
  'CDC/1990 arts. 71-74', URL_CDC, ['71', '72', '73', '74'],
  ['consumidor/cobranca-e-indebito', 'penal/crimes-consumidor']));

docs.push(lei('cdc-arts-83-85-defesa-juizo', 'CDC arts. 83-85 — Defesa em juízo: vias de acesso, tutela específica e honorários (texto literal)', 'defesa-em-juizo', 'CDC — defesa em juízo',
`## CDC — Arts. 83 a 85 (texto literal, Planalto — consulta ${D})

${cdc83_85}`,
  'CDC/1990 arts. 83-85', URL_CDC, ['83', '84', '85'],
  ['consumidor/defesa-em-juizo', 'processual-civil/juizados-especiais']));

docs.push(lei('cdc-arts-86-90-procedimentos-litigiosidade', 'CDC arts. 86-90 — Procedimentos das ações de consumo e consumidor por equiparação (texto literal)', 'defesa-em-juizo', 'CDC — procedimentos',
`## CDC — Arts. 86 a 90 (texto literal, Planalto — consulta ${D})

${cdc86_90}`,
  'CDC/1990 arts. 86-90', URL_CDC, ['86', '87', '88', '89', '90'],
  ['consumidor/defesa-em-juizo']));

docs.push(lei('decreto-11034-sac-eletronico-prazos', 'Decreto 11.034/2022 arts. 1º-10 — SAC eletrônico: atendimento, prazos e cancelamento (texto literal)', 'atendimento-sac', 'SAC eletrônico — Decreto 11.034',
`## Decreto 11.034/2022 — Arts. 1º a 10 (texto literal, Planalto — consulta ${D})

${sac}`,
  'Decreto 11.034/2022 arts. 1º-10', URL_SAC, ['1', '4', '5', '7'],
  ['consumidor/atendimento-sac']));

// ===== DERIVADOS =====

docs.push(derivado('doutrina-publicidade-enganosa-vs-abusiva', 'Doutrina — Publicidade enganosa × abusiva: distinção, prova e efeitos', 'DOUTRINA', 'publicidade-oferta', 'Publicidade enganosa × abusiva',
`## Publicidade enganosa × abusiva — panorama EJC

Base LITERAL: cdc-arts-36-38-publicidade (art. 37 caput: proibição de publicidade enganosa e abusiva; § 1º enganosa por omissão; § 2º abusiva — discriminação, exploração de medo/superstição, violência, incitação, infantilização etc.) e cdc-arts-30-35-oferta-vinculacao (art. 30: informação/publicidade VINCULA o fornecedor).

### Distinção aplicada
- ENGANOSA: afirmação falsa ou omissão essencial que induz em erro o consumidor (art. 37 § 1º LITERAL) — foco em VERDADE e COMPLETUDE.
- ABUSIVA: não depende de erro — ofende valores/sensibilidades protegidos (art. 37 § 2º LITERAL) — foco em LEGITIMIDADE DO CONTEÚDO.
- Pode ser simultânea: anúncio abusivo com declarações falsas.

### Ônus da prova (art. 38 LITERAL)
A publicidade presume-se VERDADEIRA e o ônus de provar o contrário é do FORNECEDOR — inversão por natureza do art. 38. Na peça: invocar o art. 38 e pedir exibição de material publicitário, briefings e autorizações (conexão com CPC arts. 396+ exibição — [VERIFICAR]).

### Efeitos práticos (art. 37 § único? art. 35 LITERAL)
- Vinculação da oferta (art. 30 LITERAL): execução da oferta pelo preço/prazo informado.
- Indenização por danos (art. 14 LITERAL — LOTE-009) quando o produto/serviço não corresponde à publicidade.
- Tutela específica via CDC art. 84 (LITERAL neste lote).

### Riscos
- Mera exageração publicitária ("puffery") pode não ser enganosa — avaliar o consumidor médio e o contexto.
- Terceiro (influenciador/plataforma) veiculador: cadeia de fornecimento (tese-marketplace LOTE-009).

### Probabilidade qualitativa
Alta quando há divergência objetiva entre anúncio e entrega (preço, prazo, quantidade).`,
  ['consumidor/publicidade-oferta', 'consumidor/doutrina'],
  { rel: 'cdc-arts-36-38-publicidade|COMPLEMENTA|Distinções fundamentadas nos arts. 36-38 LITERAIS' }));

docs.push(derivado('doutrina-cobranca-indevida-panorama', 'Doutrina — Cobrança indevida: extrajudicial, judicial, cadastro e dobro', 'DOUTRINA', 'cobranca-e-indebito', 'Cobrança indevida — panorama',
`## Cobrança indevida — panorama EJC

Base LITERAL: cdc-arts-42-42-a-cobranca-debitos-indebito-dobro (LOTE-006 — art. 42: vedação de cobrança não elucidada; § único: repetição em DOBRO); cdc-arts-43-44-cadastro-cobranca-info (cadastro, retificação em 5 dias, distrato multimídia); cdc-arts-71-74-cobranca-crimes-sancoes (art. 71: crime de cobrança vexatória).

### Roteiro de análise (extrajudicial → judicial)
1. Natureza da cobrança: dívida realmente devida? Parcialmente? Nula (contrato irregular — CDC art. 51 LITERAL LOTE-006)?
2. Meios utilizados: ameaça/constrangimento (art. 71 LITERAL → crime + reparação); exposição em listas (arts. 71/72 LITERAL).
3. Cadastro negativo: notificação prévia (art. 43 § 2º LITERAL); retificação em 5 dias (art. 43 § 4º LITERAL).
4. Repetição em dobro (art. 42 § único LITERAL): exigir pagamento indevido já efetuado → dobro com correção; sem majoração se haja justo erro defendível.
5. Cobrança digital: SAC (Decreto 11.034 LITERAL neste lote) com prazos; WhatsApp/ligações repetidas → prova de constância (prints com data).

### Combinação com JEC
- JEC estadual (até 40 SM — LOTE-012 LITERAL) para repetição/danos; JEC Fazenda quando o credor é ente público (LOTE-024).
- Tutela específica: CDC art. 84 LITERAL — cancelamento de inscrição/cobrança em curso.

### Riscos
- Contratos bancários: verificar cláusulas de encargos (checklist-analise-contrato-bancario-consumidor) antes de afirmar repetição integral.
- Dano moral × dobro: cumulação possível com fundamentos próprios em cada um (art. 42 § único + art. 6º VI LITERAL).

### Probabilidade qualitativa
Alta para cobrança não elucidada com pagamento indevido documentado; média em casos bancários com cláusulas complexas.`,
  ['consumidor/cobranca-e-indebito', 'consumidor/doutrina'],
  { rel: 'cdc-arts-71-74-cobranca-crimes-sancoes|COMPLEMENTA|Panorama fundamentado nos arts. LITERAIS' }));

docs.push(derivado('doutrina-atendimento-extrajudicial-procon-mg', 'Doutrina — Atendimento extrajudicial de defesa do consumidor em MG (REVISAO_HUMANA)', 'DOUTRINA', 'atendimento-extrajudicial-mg', 'Extrajudicial MG — panorama',
`## Atendimento extrajudicial de defesa do consumidor em MG [REVISAO_HUMANA — NÃO usar como fundamento definitivo]

STATUS: REVISAO_HUMANA, confiabilidade C. Portais MG bloqueados em ${D} — NENHUM número de resolução/ato estadual citado como verbatim. URLs de verificação futura: https://www.mg.gov.br/ e portal do PROCON-MG [VERIFICAR URL OFICIAL ATUAL].

### Estrutura típica (genérica, sem afirmar atos específicos)
1. Reclamação administrativa: formulário + documentos (nota, contrato, prints, e-mails) + identificação do fornecedor.
2. Designação de audiência: convocação das partes; acordo homologado tem força de título executivo judicial conforme CPC [VERIFICAR FUNDAMENTO NORMATIVO ESTADUAL].
3. Auto de infração e processo administrativo sancionador: em caso de descumprimento de compromisso — rito próprio estadual [VERIFICAR].
4. SENACON/PROCONs: recall e comunicações (docs LOTE-014 já ingeridos — portaria-mjsp-618-2019 e portaria-conjunta-3-2019).

### Como usar com segurança no EJC
- Antes de citar qualquer prazo/ato estadual MG: consultar o portal oficial e registrar URL + data (regra do sistema).
- Enquanto não verificado: manter [VERIFICAR] e usar apenas o federal (CDC arts. LITERAIS) como fundamento.

### Pontos de contato com o compêndio
- ponte-mg-procon-defesa-consumidor (LOTE-024) — ponte principal.
- fluxo-reclamacao-sac-procon-jec (neste lote) — rota operacional com prazos federais.`,
  ['consumidor/atendimento-extrajudicial-mg', 'consumidor/doutrina'],
  { conf: 'C', status: 'REVISAO_HUMANA', fonte: 'EJC — ponte de verificação (portais MG bloqueados nesta rodada)', urlFonte: 'https://www.mg.gov.br/', rel: 'ponte-mg-procon-defesa-consumidor|CONEXO_TEMATICO|Ponte principal do atendimento extrajudicial MG' }));

docs.push(derivado('tese-publicidade-enganosa-indenizacao-vinculacao', 'Tese — Publicidade enganosa: vinculação da oferta, execução forçada e danos', 'TESE', 'publicidade-oferta', 'Tese — publicidade enganosa',
`## Tese: publicidade enganosa como fator de vinculação e responsabilidade do fornecedor

### Fundamentos (somente textos oficiais capturados — ${D})
1. CDC art. 30 (LITERAL): toda informação/publicidade precisa e veiculada por qualquer meio VINCULA o fornecedor quanto aos produtos/serviços oferecidos.
2. CDC art. 35 (LITERAL): inexecução da oferta → alternativas de execução forçada, compra equivalente ou resilição com perdas e danos.
3. CDC art. 37 (LITERAL): proibição de publicidade enganosa (total ou parcialmente falsa, ou por omissão — § 1º).
4. CDC art. 38 (LITERAL): publicidade PRESUMIDA verídica — ônus do fornecedor.
5. CDC art. 14 (LITERAL LOTE-009): responsabilidade por fato do serviço/defeito de informação.
6. CDC art. 84 (LITERAL neste lote): tutela específica da obrigação de fazer/não fazer.

### Requisitos probatórios
- Material publicitário (print datado, URL arquivada, vídeo) e prova da entrega divergente.
- Se possível, arquivamento forense simples (prints com data + URL + hash opcional).
- Demonstração do consumidor médio enganado (contexto, público-alvo).

### Pedidos modeláveis
Execução da oferta (art. 35 I-II LITERAL) ou rescisão + perdas e danos (art. 35 III) + indenização (art. 14) + multa (art. 84 § 3º LITERAL) + honorários (art. 85 LITERAL conforme inciso aplicável).

### Riscos
- Divergência técnica de interpretação do anúncio (ambiguidade pode favorecer o fornecedor).
- Oferta por prazo determinado encerrada — verificar vinculação temporal (art. 30 LITERAL).

### Probabilidade qualitativa
Alta com prova objetiva de divergência anúncio×entrega; média em anúncios ambíguos.

### Links EJC
- cdc-arts-30-35-oferta-vinculacao, cdc-arts-36-38-publicidade, peca-inicial-publicidade-enganosa (neste lote).`,
  ['consumidor/publicidade-oferta', 'consumidor/teses'],
  { rel: 'cdc-arts-30-35-oferta-vinculacao|COMPLEMENTA|Fundamenta nos arts. 30/35 LITERAIS' }));

docs.push(derivado('peca-inicial-publicidade-enganosa', 'Peça — Petição inicial por publicidade enganosa (CDC arts. 30/35/37/38) com variáveis', 'PECA', 'publicidade-oferta', 'Peça — publicidade enganosa',
`## MODELO EJC — Petição inicial: publicidade enganosa (JEC estadual, até 40 SM — LOTE-012 LITERAL; ou juízo comum conforme valor)

EXCELENTÍSSIMO(A) SENHOR(A) JUIZ(A) DO {JUIZADO_ESPECIAL_CIVEL} DA COMARCA DE {COMARCA} / {VARA_CIVEL}

Autos nº {RESERVADO} | Autor: {NOME_AUTOR}, {NACIONALIDADE}, {ESTADO_CIVIL}, {PROFISSAO}, RG {RG}, CPF {CPF}, residente {ENDERECO_AUTOR} | Réu: {RAZAO_SOCIAL_FORNECEDOR}, CNPJ {CNPJ_REU}, com sede em {ENDERECO_REU}

I — DOS FATOS: o Autor viu/leu a publicidade do Réu (anexo A — print datado de {DATA_ANUNCIO}, URL {URL_ANUNCIO}) que ofertava {PRODUTO_SERVICO} por {PRECO_ANUNCIADO} com {PROMESSA_ESPECIFICA}. Ao adquirir/consumir (recibo anexo B — {DATA_COMPRA}, valor {VALOR_PAGO}), constatou divergência: {DIVERGENCIA_CONSTATADA}.

II — DOS DIREITOS:
1. CDC art. 30 (LITERAL): publicidade/informação VINCULA o fornecedor — a oferta anunciada integra o contrato.
2. CDC art. 37 (LITERAL): publicidade enganosa é proibida (total/parcialmente falsa ou por omissão essencial — § 1º).
3. CDC art. 38 (LITERAL): presunção de veracidade da publicidade — o ônus de desconstituição é do Réu.
4. CDC art. 35 (LITERAL): inexecução da oferta autoriza — a) cumprimento forçado; b) aceitação de equivalente; c) rescisão com perdas e danos (Autor opta por {OPCAO_ART35}).
5. CDC art. 14 (LITERAL LOTE-009): danos decorrentes do serviço/defeito de informação — indenização.
6. CDC art. 84 (LITERAL): tutela específica com multa por descumprimento (§ 3º — {VALOR_MULTA_DIARIA}).
7. Honorários: CDC art. 85 (LITERAL) — no JEC, conforme art. 55 Lei 9.099 [VERIFICAR APLICAÇÃO NO CASO].

III — DO VALOR: {VALOR_CAUSA} (rescisão + perdas/danos + indenização).

IV — DOS PEDIDOS: a) execução da oferta nos termos do art. 35 {ALTERNATIVA}; b) condenação em perdas e danos; c) indenização por danos {MATERIAIS_MORAIS}; d) multa do art. 84 § 3º; e) gratuidade de justiça {SIM_NAO}; f) inversão do ônus (CDC art. 6º VIII — LITERAL LOTE-009); g) citação do Réu.

V — PROVAS: anexos A-B, testemunhas (rol), levantamento técnico {SE_APLICAVEL}.

Nestes termos, pede deferimento. {CIDADE}, {DATA}.
{NOME_E_OAB_ADVOGADO}

CHECKLIST EJC: (1) prints com data e URL; (2) recibo/nota da compra; (3) cálculo do valor da causa; (4) conferir competência JEC × comum × JEC Fazenda (triagem-consumidor-fazenda LOTE-024); (5) testemunhas com endereço; (6) pedido de exibição do material publicitário completo (art. 38 LITERAL).`,
  ['consumidor/publicidade-oferta', 'consumidor/pecas'],
  { rel: 'tese-publicidade-enganosa-indenizacao-vinculacao|COMPLEMENTA|Peça aplicada da tese do lote' }));

docs.push(derivado('peca-notificacao-sac-reclamacao', 'Peça — Notificação extrajudicial / reclamação formal via SAC com variáveis', 'PECA', 'atendimento-sac', 'Peça — SAC extrajudicial',
`## MODELO EJC — Reclamação formal / notificação extrajudicial (SAC e extrajudicial)

AO SERVIÇO DE ATENDIMENTO AO CONSUMIDOR — {RAZAO_SOCIAL_FORNECEDOR} (SAC/Canal oficial) e/ou AO PROCON {PROCON_LOCAL} [VERIFICAR CANAL ESTADUAL MG]

Reclamante: {NOME_CONSUMIDOR} | Contato: {TELEFONE_E_MAIL} | Protocolo de origem {PROTOCOLO_PREVIO}

I — QUALIFICAÇÃO DO CASO: serviço/produto {PRODUTO_SERVICO}; contrato/pedido nº {NUMERO_PEDIDO}; valor envolvido {VALOR}; data do problema {DATA_PROBLEMA}.

II — RELATO OBJETIVO: {RELATO_CONCISO} — tentativas anteriores: {TENTATIVAS_E_PROTOCOLOS}.

III — DIREITOS INVOCADOS (fundamentação mínima federal):
1. CDC art. 6º (LITERAL LOTE-009): informação adequada (III) e proteção contra publicidade enganosa (IV).
2. Decreto 11.034/2022 (LITERAL neste lote): atendimento eletrônico com protocolo, e prazos de resposta; cancelamento de contratos por canais gratuitos conforme aplicável ao serviço {VERIFICAR INCISO APLICAVEL}.
3. CDC arts. 43-44 (LITERAL neste lote): retificação de cadastro em 5 dias quando aplicável.
4. CDC art. 42 (LITERAL LOTE-006): cobrança não elucidada — {SE_COBRANCA}.

IV — PRETENSÃO: {PRETENSAO_EXATA} (ex.: cancelamento sem custo, estorno de {VALOR_ESTORNO}, retificação de cadastro, cumprimento da oferta conforme anúncio {ANUNCIO}).

V — PRAZO E RESERVA: aguardo resposta no prazo do Decreto {PRAZO_APLICAVEL} dias; o silêncio/recusa autoriza medidas administrativas (PROCON) e judiciais (JEC — até 40 SM).

Documentos anexos: nota/recibo, prints do anúncio, protocolos, correspondências.

{CIDADE}, {DATA}. {NOME_CONSUMIDOR}

CHECKLIST EJC: (1) guardar nº de protocolo DE CADA contato; (2) anexar prova do anúncio; (3) conferir o prazo do Decreto aplicável ao setor; (4) registrar a data-limite para próxima etapa; (5) usar depois como prova no JEC (peca-inicial-publicidade-enganosa / peca-reclamacao-vicio-produto LOTE-009).`,
  ['consumidor/atendimento-sac', 'consumidor/pecas'],
  { rel: 'decreto-11034-sac-eletronico-prazos|COMPLEMENTA|Peça fundamentada no Decreto LITERAL' }));

docs.push(derivado('checklist-analise-contrato-bancario-consumidor', 'Checklist — Análise de contrato bancário sob a ótica do CDC (15 pontos)', 'CHECKLIST', 'credito-e-financiamento', 'Checklist — contrato bancário',
`## Checklist EJC — análise de contrato bancário/consumo (base: CDC arts. LITERAIS; sem números de leis especiais não capturadas)

1. Identificar o produto: crédito pessoal, cartão, consignado, financiamento, conta/serviços — cada um com regime próprio de encargos [VERIFICAR REGULAMENTAÇÃO SETORIAL].
2. Informação prévia (CDC art. 46 LITERAL): o consumidor teve acesso ANTES à minuta e ao conteúdo? {SIM_NAO}
3. Publicidade vs. contrato (CDC art. 30 LITERAL): taxa/juros/preço anunciados batem com o contrato? {SIM_NAO}
4. Cláusulas limitativas (CDC art. 54 LITERAL): destacadas em negrito/assinatura específica? {SIM_NAO}
5. Vantagem manifestamente excessiva (CDC art. 51 IV LITERAL LOTE-006): comparar encargos praticados com o mercado usual {AVALIAR}.
6. Cobrança: encargos moratórios previstos e sem acúmulo ilegal (CDC arts. 52-53 LITERAL LOTE-006/este lote) {AVALIAR}.
7. Cadastro negativo: notificação prévia (CDC art. 43 § 2º LITERAL) {SIM_NAO}.
8. Reclamações no SAC: protocolos obtidos (Decreto 11.034 LITERAL) {LISTAR}.
9. Seguros/adesões acessórias não solicitadas {IDENTIFICAR}.
10. Cobrança de tarifa por serviço não efetivamente prestado {IDENTIFICAR}.
11. Extrato/demonstrativo completo de parcelas e encargos {OBTIDO}.
12. Pontos de litígio: repetição em dobro (CDC art. 42 § único LITERAL LOTE-006) quando pago indevidamente {SIM_NAO}.
13. Tutela específica: cancelamento/retificação (CDC art. 84 LITERAL) {NECESSARIA}.
14. Competência: JEC estadual até 40 SM (Lei 9.099 art. 3º LITERAL LOTE-012); JEC Fazenda se ente público (LOTE-024); contratos com prazo/juros complexos podem exigir perícia contábil {AVALIAR}.
15. Documentar tudo com data/fonte; itens não confirmados → [VERIFICAR] + REVISAO_HUMANA antes de peça.`,
  ['consumidor/credito-e-financiamento', 'consumidor/checklists'],
  { rel: 'cdc-arts-53-55-contratos-credito|COMPLEMENTA|Checklist fundamentado nos arts. 53-55 LITERAIS' }));

docs.push(derivado('fluxo-reclamacao-sac-procon-jec', 'Fluxo — Reclamação do consumidor: SAC → PROCON → JEC (7 etapas)', 'FLUXO', 'atendimento-sac', 'Fluxo — SAC→PROCON→JEC',
`## Fluxo EJC — reclamação do consumidor (fundamentos: Decreto 11.034 LITERAL; CDC arts. LITERAIS; Lei 9.099 art. 3º LITERAL LOTE-012)

ETAPA 1 — REUNIR PROVAS: contrato/pedido, nota/recibo, prints do anúncio (com data/URL), protocolos anteriores, extratos.
ETAPA 2 — SAC (Decreto 11.034 LITERAL): registrar com protocolo; prazo de resposta conforme inciso aplicável {VERIFICAR PRAZO SETORIAL}; guardar cópia da reclamação.
ETAPA 3 — NOTIFICAÇÃO EXTRAJUDICIAL: usar peca-notificacao-sac-reclamacao; prazo razoável {PRAZO_INFORMADO}; registrada em canal com AR/protocolo.
ETAPA 4 — PROCON [VERIFICAR CANAL ESTADUAL MG]: reclamação administrativa (genérica sem atos estaduais); audiência de conciliação; acordo homologado = título [VERIFICAR NORMATIVO ESTADUAL]; auto de infração se não acordo.
ETAPA 5 — ESCOLHA DA VIA JUDICIAL: valor até 40 SM → JEC estadual (Lei 9.099 art. 3º LITERAL LOTE-012); ente público → JEC Fazenda (LOTE-024); acima de 40 SM → juízo comum.
ETAPA 6 — PETIÇÃO INICIAL: peca-inicial-publicidade-enganosa / peca-reclamacao-vicio-produto (LOTE-009) / peca-inicial-jec-fazenda-publica (LOTE-024); anexar TODA a cadeia de provas do SAC/PROCON.
ETAPA 7 — EXECUÇÃO/PÓS: cumprimento da sentença (fluxo-jec-pedido-a-execucao LOTE-011); monitorar prazos (docs PRAZO do compêndio).

ALERTAS EJC: (1) prescrição/decadência do CDC (docs LOTE-001/009 LITERAIS); (2) registro em cadastro: pedir retificação 5 dias (art. 43 § 4º LITERAL); (3) se houver crime de cobrança (art. 71 LITERAL): Boletim de Ocorrência + reparação civil autônoma.`,
  ['consumidor/atendimento-sac', 'consumidor/fluxos'],
  { rel: 'decreto-11034-sac-eletronico-prazos|COMPLEMENTA|Fluxo operacional do SAC' }));

docs.push(derivado('prazo-cadastro-retificacao-5-dias-sac', 'Prazo — Retificação de cadastro em 5 dias (CDC art. 43 § 4º) e prazos do SAC (Decreto 11.034)', 'PRAZO', 'cobranca-e-indebito', 'Prazo — cadastro e SAC',
`## Prazos — cadastro de consumo e SAC (fontes LITERAIS, consulta ${D})

- RETIFICAÇÃO DE CADASTRO: CDC art. 43 § 4º (LITERAL — doc cdc-arts-43-44-cadastro-cobranca-info): o cadastro é corrigido em 5 (cinco) dias úteis após a comunicação do erro ao responsável — termo inicial: comunicação ao responsável pelo cadastro.
- NOTIFICAÇÃO PRÉVIA DE INSCRIÇÃO: CDC art. 43 § 2º (LITERAL): notificação por correspondência/tarifa telefônica com aviso de recebimento (texto LITERAL).
- SAC: Decreto 11.034/2022 (LITERAL — doc decreto-11034-sac-eletronico-prazos): prazos de resposta/encerramento conforme incisos transcritos — conferir o inciso aplicável ao setor do caso antes de citar número específico.

TERMO INICIAL E RISCOS: a contagem do art. 43 § 4º começa na comunicação do erro (documentar com protocolo datado); descumprimento → tutela específica (CDC art. 84 LITERAL) + danos.

FUNDAMENTO: CDC arts. 43-44 (Planalto — consulta ${D}) + Decreto 11.034/2022 (Planalto — consulta ${D}).`,
  ['consumidor/cobranca-e-indebito', 'geral/prazos', 'consumidor/atendimento-sac'],
  { fonte: PLANALTO, urlFonte: URL_CDC, rel: 'cdc-arts-43-44-cadastro-cobranca-info|COMPLEMENTA|Prazos extraídos dos LITERAIS' }));

docs.push(derivado('regra-se-entao-consumidor-rotas-28', 'Regras SE-ENTÃO — rotas de Consumidor II (publicidade, práticas, cobrança, cadastro, SAC, contratos)', 'REGRA_INTELIGENCIA', 'geral', 'Regras SE-ENTÃO — Consumidor II',
`## Regras SE-ENTÃO — Consumidor II (rotas EJC; fundamentos nos docs literais deste lote)

SE o anúncio divergiu do entregado OU omitiu informação essencial ENTÃO rota publicidade enganosa (cdc-arts-36-38 + tese-publicidade-enganosa + peca-inicial-publicidade-enganosa); SE a oferta não foi cumprida ENTÃO art. 35 (LITERAL) — execução forçada/equivalente/rescisão.

SE a conduta ofende valores (discriminação, medo, infantilização) SEM precisar de erro ENTÃO rota publicidade abusiva (art. 37 § 2º LITERAL).

SE houve condicionar venda a produto secundário OU vantagem manifestamente excessiva OU recusa de atendimento à demanda ENTÃO práticas abusivas art. 39 (LITERAL) — sanções art. 40.

SE a cobrança expõe ao ridículo/usa ameaça ENTÃO art. 71 (LITERAL) — crime + reparação + boletim de ocorrência.

SE houve pagamento de valor não devido ENTÃO repetição em dobro (art. 42 § único LITERAL LOTE-006) — antes verificar justo erro.

SE inscrição em cadastro SEM notificação prévia OU erro não retificado ENTÃO art. 43 §§ (LITERAL) — retificação 5 dias (prazo-cadastro-retificacao-5-dias-sac) + tutela específica (art. 84 LITERAL).

SE o serviço tem canal SAC regulado ENTÃO usar prazos do Decreto 11.034 (LITERAL) e peca-notificacao-sac-reclamacao antes da via judicial.

SE contrato de crédito com informação prévia ausente OU cláusula limitativa não destacada ENTÃO arts. 46/54 (LITERAL) + art. 51 (LITERAL LOTE-006) para nulidade.

SE o caso é de fato do produto/serviço ENTÃO seguir LOTE-014 (cdc-arts-9-10/12/13/14); SE é vício ENTÃO LOTE-009 (arts. 18/20/26).

SE ente público como fornecedor ENTÃO JEC Fazenda (LOTE-024 — Lei 12.153 LITERAL).

SE qualquer item depende de ato estadual/municipal MG não capturado ENTÃO [VERIFICAR] + REVISAO_HUMANA (anti-invenção).`,
  ['consumidor/geral', 'consumidor/regras'],
  { rel: 'cdc-arts-39-41-praticas-abusivas|CONEXO_TEMATICO|Rotas usam os LITERAIS deste lote' }));

docs.push(derivado('jurimetria-vazia-consumidor-28', 'Jurimetria — Estrutura vazia para dados de consumo reais (publicidade/SAC/cobrança)', 'JURIMETRIA', 'geral', 'Jurimetria — consumo (vazia)',
`## Jurimetria — Consumidor II (estrutura VAZIA — dadosFicticios: false)

### Por que vazia
O EJC NÃO inventa percentuais. Dados de litigiosidade de consumo (publicidade enganosa, cobrança, SAC) podem ser obtidos de fontes oficiais (DataJud/CNJ com DATAJUD_API_KEY; SENACON/Ministério — [VERIFICAR ACESSO]) — nenhum número citado sem fonte + data.

### Estrutura preparada (campos para preenchimento futuro)
- Fonte: API Pública DataJud/CNJ (TJMG) e/ou relatórios oficiais SENACON com URL e data de consulta.
- Indicadores planejados: tempo médio de JEC por assunto de consumo; taxa de acordo em JEC; % de casos de publicidade/cobrança; valores médios de condenação.
- Confiabilidade: A (API direta) ou B (consolidação documentada — padrão LOTE-022).
- LGPD: apenas agregados; nunca números de processos individuais.

### Relação com dados existentes
- jurimetria-consumidor-vicio-plataformas (LOTE-009) e jurimetria-fato-produto-recall (LOTE-014) — metodologia.
- jurimetria-jec-visao-geral-bh-betim-2025-2026 (LOTE-022) — agregação BH/Betim.`,
  ['consumidor/geral', 'consumidor/jurimetria'],
  { conf: 'B', rel: 'jurimetria-jec-visao-geral-bh-betim-2025-2026|CONEXO_TEMATICO|Mesma metodologia de agregação' }));

// Monta o arquivo final
const header = `// LOTE-028 — Consumidor II (compêndio EJC, foco MG): CF art. 5º XXXII + art. 170 V (literais);
// CDC arts. 7, 30-41, 43-48, 53-55, 71-74, 83-90 (literais, com "(VETADO)" como consta);
// Decreto 11.034/2022 SAC arts. 1º-10 (literal) + derivados EJC.
// Consulta Planalto: ${D}. ANTI-INVENÇÃO: NADA estadual MG citado como verbatim;
// doutrina-atendimento-extrajudicial-procon-mg é REVISAO_HUMANA/C.
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
writeFileSync('/home/z/my-project/data/ejc/lote-028-consumidor-ii.ts', out);
console.log('LOTE-028 gerado:', docs.length, 'documentos');
