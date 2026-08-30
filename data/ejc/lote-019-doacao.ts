// LOTE-019 — Doação — CC arts. 538-564 (P1, contratos civis)
// Textos LITERAIS extraídos do Planalto em 2026-08-30:
// https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm
//
// ANTI-INVENÇÃO desta rodada:
// - Todos os textos dos arts. 538-564 extraídos literalmente do texto oficial.
// - Nenhuma súmula/acórdão sobre doação confirmado em fonte oficial nesta consulta
//   (Súmula 49/STF sobre evicção na doação NÃO confirmada verbatim — NÃO incluída).
// - Jurimetria: SEM DADOS (o EJC não inventa percentuais).
import type { InputDocument } from '../../src/lib/ejc/types';

const D = '2026-08-30';
const PLANALTO = 'Presidência da República — Planalto';
const URL_CC = 'https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm';
const EJC = 'Elaboração EJC — conteúdo estrutural original';

function leiCc(
  slug: string, titulo: string, assunto: string, conteudo: string, artigos: string[],
  extra?: Partial<InputDocument>,
): InputDocument {
  return {
    slug, titulo, tipoDocumento: 'LEGISLACAO', area: 'civil', subarea: 'doacao',
    assunto, prioridade: 'P1', lote: 'LOTE-019',
    conteudo,
    metadados: { numero: 'Lei 10.406/2002 (Código Civil)', data_norma: '2002-01-11', orgao: 'Congresso Nacional', artigos_principais: artigos, vigente: true, confirmacao_texto: 'Extração literal do texto oficial do Planalto em 2026-08-30.' },
    tags: ['civil/doacao', 'civil/contratos'],
    fonte: PLANALTO,
    urlFonte: URL_CC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    ...extra,
  };
}

export default [
  leiCc(
    'cc-arts-538-540-doacao-conceito-aceitacao-tipos',
    'CC arts. 538-540 — Conceito de doação, prazo de aceitação e espécies de liberalidade (texto literal confirmado)',
    'Doação — conceito, aceitação e espécies',
    `## Ficha da Norma
- **Norma:** Lei 10.406/2002 (Código Civil) — Título V "Do Contrato de Doação".

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 538. Considera-se doação o contrato em que uma pessoa, por liberalidade, transfere do seu patrimônio bens ou vantagens para o de outra.

Art. 539. O doador pode fixar prazo ao donatário, para declarar se aceita ou não a liberalidade. Desde que o donatário, ciente do prazo, não faça, dentro dele, a declaração, entender-se-á que aceitou, se a doação não for sujeita a encargo.

Art. 540. A doação feita em contemplação do merecimento do donatário não perde o caráter de liberalidade, como não o perde a doação remuneratória, ou a gravada, no excedente ao valor dos serviços remunerados ou ao encargo imposto."

## Leitura aplicada
- **Conceito (art. 538):** transferência por LIBERALIDADE (animus donandi) — elemento distintivo: enriquecimento do donatário sem contraprestação equivalente.
- **Aceitação (art. 539):** doação é contrato bilatéral — exige aceitação; silêncio no prazo fixado = aceitação SOMENTE em doação pura (sem encargo).
- **Espécies (art. 540):** pura e simples; remuneratória (em pagamento de serviços); gravada (com encargo); contemplação do merecimento — nas remuneratórias/gravadas só o EXCEDENTE mantém caráter de liberalidade.

## Hipóteses de aplicação no EJC
- Diferenciar doação verdadeira de doação remuneratória (afeta revogação por ingratidão — art. 564 I e colação — art. 544).`,
    ['538', '539', '540'],
  ),
  leiCc(
    'cc-arts-541-543-forma-aceitacao-incapazes',
    'CC arts. 541-543 — Forma da doação (escritura pública ou particular; verbal) e aceitação por incapazes (texto literal confirmado)',
    'Doação — forma e aceitação',
    `## Ficha da Norma
- **Norma:** Lei 10.406/2002 (Código Civil).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 541. A doação far-se-á por escritura pública ou instrumento particular.

Parágrafo único. A doação verbal será válida, se, versando sobre bens móveis e de pequeno valor, se lhe seguir incontinenti a tradição.

Art. 542. A doação feita ao nascituro valerá, sendo aceita pelo seu representante legal.

Art. 543. Se o donatário for absolutamente incapaz, dispensa-se a aceitação, desde que se trate de doação pura."

## Leitura aplicada
- **Forma (art. 541):** imóveis exigem ESCRITURA PÚBLICA + registro (complemento do art. 1.245 — registro transfere a propriedade); móveis: instrumento particular; verbal: só móveis de pequeno valor com tradição imediata ("incontinenti").
- **Nascituro (art. 542):** aceita pelo representante legal — doação válida.
- **Incapaz absoluto (art. 543):** aceitação dispensada em doação PURA (benefício: sem encargo, o incapaz só recebe vantagem).

## Hipóteses de aplicação no EJC
- Nulidade de doação de imóvel por instrumento particular (falta de forma solene — vício essencial).`,
    ['541', '542', '543'],
  ),
  leiCc(
    'cc-art-544-doacao-adiantamento-heranca',
    'CC art. 544 — Doação de ascendentes a descendentes ou entre cônjuges importa adiantamento de herança (colação) (texto literal confirmado)',
    'Doação — adiantamento de herança',
    `## Ficha da Norma
- **Norma:** Lei 10.406/2002 (Código Civil).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 544. A doação de ascendentes a descendentes, ou de um cônjuge a outro, importa adiantamento do que lhes cabe por herança."

## Leitura aplicada
- **Regra:** doação entre ascendente→descendente e cônjuge→cônjuge presume-se ADIANTAMENTO DA LEGÍTIMA (colação).
- Efeitos: no inventário, o donatário deverá colacionar (imputar o valor doado) salvo dispensa expressa na própria doação (regra do direito sucessório — "dispensa de colação" preserva parte disponível).
- **Atenção:** a regra não se confunde com doação a terceiros (não-familiares), que esgota a parte disponível.

## Hipóteses de aplicação no EJC
- Planejamento sucessório; impugnação de doações que esgotam a legítima (combine com art. 549).`,
    ['544'],
    {
      relacionamentos: [
        { destinoSlug: 'cc-arts-548-549-doacao-nulidades-inoficiosa', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Limites patrimoniais da liberalidade (subsistência e legítima).' },
      ],
    },
  ),
  leiCc(
    'cc-arts-545-546-subvencao-doacao-casamento',
    'CC arts. 545-546 — Subvenção periódica extingue-se com a morte do doador; doação em contemplação de casamento (texto literal confirmado)',
    'Doação — subvenção periódica e contemplação de casamento',
    `## Ficha da Norma
- **Norma:** Lei 10.406/2002 (Código Civil).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 545. A doação em forma de subvenção periódica ao beneficiado extingue-se morrendo o doador, salvo se este outra coisa dispuser, mas não poderá ultrapassar a vida do donatário.

Art. 546. A doação feita em contemplação de casamento futuro com certa e determinada pessoa, quer pelos nubentes entre si, quer por terceiro a um deles, a ambos, ou aos filhos que, de futuro, houverem um do outro, não pode ser impugnada por falta de aceitação, e só ficará sem efeito se o casamento não se realizar."

## Leitura aplicada
- **Subvenção periódica (art. 545):** extingue-se com a morte do doador (pactos em contrário válidos, mas limitados à vida do donatário).
- **Contemplação de casamento (art. 546):** aceitação presumida; condição resolutiva implícita — casamento não realizado → sem efeito.

## Hipóteses de aplicação no EJC
- Cessação de pensão doada após morte do doador; retorno de bens doados para casamento não celebrado.`,
    ['545', '546'],
  ),
  leiCc(
    'cc-arts-547-548-reversao-nulidade-todos-bens',
    'CC arts. 547-548 — Cláusula de reversão (só em favor do doador) e nulidade da doação de todos os bens sem reserva (texto literal confirmado)',
    'Doação — reversão e nulidade da doação de todos os bens',
    `## Ficha da Norma
- **Norma:** Lei 10.406/2002 (Código Civil).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 547. O doador pode estipular que os bens doados voltem ao seu patrimônio, se sobreviver ao donatário.

Parágrafo único. Não prevalece cláusula de reversão em favor de terceiro.

Art. 548. É nula a doação de todos os bens sem reserva de parte, ou renda suficiente para a subsistência do doador."

## Leitura aplicada
- **Reversão (art. 547):** condição resolutiva — sobrevivência do doador ao donatário; NULA se em favor de TERCEIRO.
- **Nulidade (art. 548):** doação de TODO o patrimônio sem reserva de parte/renda para subsistência é NULA (norma de ordem pública — protege o próprio doador e evita-dependência). Nulidade absoluta (vício sanável por reconversão? não — imprescritível quanto ao reconhecimento, conforme regra geral das nulidades).

## Hipóteses de aplicação no EJC
- Alegação de nulidade absoluta (art. 166 CC) em doação integral do patrimônio.`,
    ['547', '548'],
  ),
  leiCc(
    'cc-arts-548-549-doacao-nulidades-inoficiosa',
    'CC art. 549 — Nulidade da doação inoficiosa (excede o que o doador poderia dispor em testamento) (texto literal confirmado)',
    'Doação — inoficiosidade e legítima',
    `## Ficha da Norma
- **Norma:** Lei 10.406/2002 (Código Civil).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 549. Nula é também a doação quanto à parte que exceder à de que o doador, no momento da liberalidade, poderia dispor em testamento."

## Leitura aplicada
- **Inoficiosidade (art. 549):** nula a doação NA PARTE que invade a legítima dos herdeiros necessários (50% do patrimônio — art. 1.846 CC) — redução inoficiosidade, não nulidade total.
- **Marco temporal:** "no momento da liberalidade" — avalia-se o patrimônio e as disposíveis NA DATA DA DOAÇÃO.
- Combina com art. 544 (adiantamento de herança): doações a descendentes somam-se para verificar invasão da legítima.

## Hipóteses de aplicação no EJC
- Ação de redução por herdeiro necessário; cálculo da legítima com colação de doações.`,
    ['549'],
    {
      relacionamentos: [
        { destinoSlug: 'cc-art-544-doacao-adiantamento-heranca', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Doação a descendentes/cônjuge como adiantamento (colação).' },
      ],
    },
  ),
  leiCc(
    'cc-arts-550-551-adultero-doacao-comum',
    'CC arts. 550-551 — Anulabilidade da doação do cônjuge adúltero ao cúmplice (2 anos) e regras da doação em comum (texto literal confirmado)',
    'Doação — cônjuge adúltero e doação em comum',
    `## Ficha da Norma
- **Norma:** Lei 10.406/2002 (Código Civil).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 550. A doação do cônjuge adúltero ao seu cúmplice pode ser anulada pelo outro cônjuge, ou por seus herdeiros necessários, até dois anos depois de dissolvida a sociedade conjugal.

Art. 551. Salvo declaração em contrário, a doação em comum a mais de uma pessoa entende-se distribuída entre elas por igual.

Parágrafo único. Se os donatários, em tal caso, forem marido e mulher, subsistirá na totalidade a doação para o cônjuge sobrevivo."

## Leitura aplicada
- **Cônjuge adúltero (art. 550):** anulável (não nula) — legitimados: cônjuge lesado e herdeiros necessários; prazo decadencial de 2 ANOS após a dissolução da sociedade conjugal.
- **Doação em comum (art. 551):** presunção de distribuição IGUAL entre donatários; entre marido e mulher: doação subsiste INTEGRALMENTE para o sobrevivo (sem extinção da fração do falecido).

## Hipóteses de aplicação no EJC
- Prazo de 2 anos contado da dissolução (não do conhecimento) — decadencial.`,
    ['550', '551'],
  ),
  leiCc(
    'cc-art-552-doacao-eviccao-vicios-juros',
    'CC art. 552 — O doador não responde por juros moratórios, evicção ou vício redibitório (exceção: doação para casamento) (texto literal confirmado)',
    'Doação — garantias do doador',
    `## Ficha da Norma
- **Norma:** Lei 10.406/2002 (Código Civil).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 552. O doador não é obrigado a pagar juros moratórios, nem é sujeito às conseqüências da evicção ou do vício redibitório. Nas doações para casamento com certa e determinada pessoa, o doador ficará sujeito à evicção, salvo convenção em contrário."

## Leitura aplicada
- **Regra:** liberalidade não carrega garantias — sem juros de mora, sem responsabilidade por evicção, sem vício redibitório.
- **Exceção única:** doação para casamento com pessoa determinada → doador responde por evicção (salvo convenção em contrário).

## Hipóteses de aplicação no EJC
- Defesa do doador em ação por vício/evicção; fundamento literal da dispensa.`,
    ['552'],
  ),
  leiCc(
    'cc-arts-553-554-encargo-entidade-futura',
    'CC arts. 553-554 — Cumprimento do encargo (MP pode exigir após morte do doador) e caducidade da doação a entidade futura (2 anos) (texto literal confirmado)',
    'Doação — encargo e entidade futura',
    `## Ficha da Norma
- **Norma:** Lei 10.406/2002 (Código Civil).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 553. O donatário é obrigado a cumprir os encargos da doação, caso forem a benefício do doador, de terceiro, ou do interesse geral.

Parágrafo único. Se desta última espécie for o encargo, o Ministério Público poderá exigir sua execução, depois da morte do doador, se este não tiver feito.

Art. 554. A doação a entidade futura caducará se, em dois anos, esta não estiver constituída regularmente."

## Leitura aplicada
- **Encargo (art. 553):** pode ser em benefício do doador, de terceiro ou interesse geral; encargo de interesse geral: MP pode exigir execução APÓS a morte do doador.
- **Entidade futura (art. 554):** prazo de 2 anos para constituição regular — senão CADUCA (instituto diverso da revogação).

## Hipóteses de aplicação no EJC
- Cobrança de encargo; despejo do encargo violado → revogação (art. 562).`,
    ['553', '554'],
  ),
  leiCc(
    'cc-arts-555-556-revogacao-ingratidao-antecipada',
    'CC arts. 555-556 — Revogação da doação por ingratidão ou inexecução do encargo; renúncia antecipada é vedada (texto literal confirmado)',
    'Doação — revogação: cabimento',
    `## Ficha da Norma
- **Norma:** Lei 10.406/2002 (Código Civil).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 555. A doação pode ser revogada por ingratidão do donatário, ou por inexecução do encargo.

Art. 556. Não se pode renunciar antecipadamente o direito de revogar a liberalidade por ingratidão do donatário."

## Leitura aplicada
- **Duas únicas causas de revogação (art. 555):** (1) ingratidão; (2) inexecução do encargo (doação onerosa/gravada).
- **Vedação (art. 556):** cláusula de renúncia ANTECIPADA à revogação por ingratidão é ineficaz — direito indisponível antes do fato.
- Revogação ≠ invalidade: o contrato nasce válido e desfaz-se por evento posterior.

## Hipóteses de aplicação no EJC
- Diagnóstico: nulidade (548/549) × anulabilidade (550) × revogação (555-564).`,
    ['555', '556'],
  ),
  leiCc(
    'cc-arts-557-558-hipoteses-ingratidao',
    'CC arts. 557-558 — Hipóteses de ingratidão: atentado à vida/homicídio doloso, ofensa física, injúria grave/calúnia, recusa de alimentos; extensão aos familiares (texto literal confirmado)',
    'Doação — revogação: hipóteses de ingratidão',
    `## Ficha da Norma
- **Norma:** Lei 10.406/2002 (Código Civil).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 557. Podem ser revogadas por ingratidão as doações:
I - se o donatário atentou contra a vida do doador ou cometeu crime de homicídio doloso contra ele;
II - se cometeu contra ele ofensa física;
III - se o injuriou gravemente ou o caluniou;
IV - se, podendo ministrá-los, recusou ao doador os alimentos de que este necessitava.

Art. 558. Pode ocorrer também a revogação quando o ofendido, nos casos do artigo anterior, for o cônjuge, ascendente, descendente, ainda que adotivo, ou irmão do doador."

## Leitura aplicada
- **Rol do art. 557 (I-IV):** atentado contra a vida/homicídio doloso; ofensa física; injúria grave ou calúnia; recusa de alimentos possíveis.
- **Extensão (art. 558):** ofensa a cônjuge, ascendente, descendente (mesmo adotivo) ou irmão DO DOADOR também autoriza revogação.
- Atos de simples ingratidão moral fora do rol NÃO revogam (rol taxativo).

## Hipóteses de aplicação no EJC
- Verificar a correspondência exata do fato ao inciso; prova do dolo/crime (condenação criminal auxilia — art. 935 CC nos casos aplicáveis).`,
    ['557', '558'],
  ),
  leiCc(
    'cc-arts-559-561-ingratidao-prazo-legitimacao',
    'CC arts. 559-561 — Prazo de 1 ano para revogar por ingratidão; direito não se transmite; homicídio do doador legitima herdeiros (salvo perdão) (texto literal confirmado)',
    'Doação — revogação: prazo e legitimação',
    `## Ficha da Norma
- **Norma:** Lei 10.406/2002 (Código Civil).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 559. A revogação por qualquer desses motivos deverá ser pleiteada dentro de um ano, a contar de quando chegue ao conhecimento do doador o fato que a autorizar, e de ter sido o donatário o seu autor.

Art. 560. O direito de revogar a doação não se transmite aos herdeiros do doador, nem prejudica os do donatário. Mas aqueles podem prosseguir na ação iniciada pelo doador, continuando-a contra os herdeiros do donatário, se este falecer depois de ajuizada a lide.

Art. 561. No caso de homicídio doloso do doador, a ação caberá aos seus herdeiros, exceto se aquele houver perdoado."

## Leitura aplicada
- **Prazo (art. 559):** 1 ANO, decadencial, com termo inicial DUPLO: (a) conhecimento do fato + (b) ciência de que o donatário foi o autor.
- **Transmissão (art. 560):** direito NÃO transmite aos herdeiros — mas a ação já ajuizada pode ser prosseguida por eles contra os herdeiros do donatário.
- **Homicídio doloso (art. 561):** exceção — herdeiros têm ação PRÓPRIA (não é prosseguimento), salvo perdão do doador.

## Hipóteses de aplicação no EJC
- Calcular o prazo duplo (conhecimento do fato + autoria); documentar o conhecimento.`,
    ['559', '560', '561'],
  ),
  leiCc(
    'cc-arts-562-563-revogacao-encargo-efeitos',
    'CC arts. 562-563 — Revogação por inexecução do encargo (mora; notificação judicial) e efeitos da revogação por ingratidão (terceiros e frutos) (texto literal confirmado)',
    'Doação — revogação: encargo e efeitos',
    `## Ficha da Norma
- **Norma:** Lei 10.406/2002 (Código Civil).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 562. A doação onerosa pode ser revogada por inexecução do encargo, se o donatário incorrer em mora. Não havendo prazo para o cumprimento, o doador poderá notificar judicialmente o donatário, assinando-lhe prazo razoável para que cumpra a obrigação assumida.

Art. 563. A revogação por ingratidão não prejudica os direitos adquiridos por terceiros, nem obriga o donatário a restituir os frutos percebidos antes da citação válida; mas sujeita-o a pagar os posteriores, e, quando não possa restituir em espécie as coisas doadas, a indenizá-la pelo meio termo do seu valor."

## Leitura aplicada
- **Encargo (art. 562):** mora prévia indispensável; sem prazo ajustado → notificação JUDICIAL com prazo razoável (constituição em mora).
- **Efeitos da revogação (art. 563):** (1) terceiros de boa-fé protegidos; (2) frutos anteriores à citação válida ficam com o donatário; frutos posteriores pagos; (3) impossibilidade de restituição em espécie → indenização pelo MEIO TERMO do valor.

## Hipóteses de aplicação no EJC
- Instrução da ação de revogação: constituir mora antes; cálculo de frutos e do meio-termo.`,
    ['562', '563'],
  ),
  leiCc(
    'cc-art-564-nao-revogam-ingratidao',
    'CC art. 564 — Doações que NÃO se revogam por ingratidão (remuneratórias, encargo cumprido, obrigação natural, casamento determinado) (texto literal confirmado)',
    'Doação — imunidade à revogação por ingratidão',
    `## Ficha da Norma
- **Norma:** Lei 10.406/2002 (Código Civil).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 564. Não se revogam por ingratidão:
I - as doações puramente remuneratórias;
II - as oneradas com encargo já cumprido;
III - as que se fizerem em cumprimento de obrigação natural;
IV - as feitas para determinado casamento."

## Leitura aplicada
- **Rol protetivo (art. 564):** quatro espécies são INIMUNES à revogação por ingratidão: (I) remuneratórias puras; (II) encargo já cumprido; (III) obrigação natural; (IV) determinado casamento (art. 546).
- ATENÇÃO: a imunidade alcança a ingratidão — a inexecução do ENCARDO (art. 562) permanece se o encargo ainda não cumprido for violado.

## Hipóteses de aplicação no EJC
- Defesa do donatário: verificar enquadramento em um dos incisos antes de disputar a revogação.`,
    ['564'],
  ),
  {
    slug: 'tese-doacao-diagnostico-invalidade-revogacao',
    titulo: 'Tese — Diagnóstico de vícios e desfazimento da doação: nulidade, anulabilidade e revogação (mapa de fundamentos)',
    tipoDocumento: 'TESE',
    area: 'civil',
    subarea: 'doacao',
    assunto: 'Teoria da doação — rota de desfazimento',
    prioridade: 'P1',
    lote: 'LOTE-019',
    conteudo: `## Tese
A pretensão de desfazer uma doação exige diagnóstico PRÉVIO da rota jurídica: (1) NULIDADE absoluta (CC art. 548 — todos os bens sem reserva; art. 549 — parte que invade a legítima no momento da liberalidade; art. 541 p.ú. — forma para imóveis); (2) ANULABILIDADE (art. 550 — doação do cônjuge adúltero ao cúmplice, 2 anos da dissolução); (3) REVOGAÇÃO (art. 555 — ingratidão, arts. 557-558; inexecução do encargo, art. 562 — com mora previamente constituída).

## Fundamentos literais (Planalto, consulta 2026-08-30)
- Art. 548: "É nula a doação de todos os bens sem reserva de parte, ou renda suficiente para a subsistência do doador."
- Art. 549: "Nula é também a doação quanto à parte que exceder à de que o doador, no momento da liberalidade, poderia dispor em testamento."
- Art. 550: anulável "até dois anos depois de dissolvida a sociedade conjugal".
- Art. 555/559: revogação "por ingratidão... ou por inexecução do encargo", no prazo de 1 ano do duplo conhecimento (fato + autoria).

## Requisitos e riscos
- Nulidade: impugnação não sujeita aos prazos curtos; reconhece-se de ofício (regra geral das nulidades).
- Anulabilidade: prazo DECADENCIAL de 2 anos — risco de preclusão; legitimados restritos (cônjuge lesado e herdeiros necessários).
- Revogação: 1 ano (duplo termo inicial); NÃO se transmite (art. 560), salvo homicídio doloso (art. 561); rol taxativo (arts. 557-558); defesas do art. 564 (remuneratória, encargo cumprido, obrigação natural, casamento determinado).

## Probabilidade qualitativa
- Depende do enquadramento EXATO do fato ao rol e da prova do duplo conhecimento — sem dado estatístico (o EJC não inventa percentuais).`,
    tags: ['civil/doacao', 'civil/familia'],
    fonte: EJC,
    urlFonte: URL_CC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'cc-arts-548-549-doacao-nulidades-inoficiosa', tipo: 'FUNDAMENTA', descricao: 'Nulidades da liberalidade.' },
      { destinoSlug: 'cc-arts-557-558-hipoteses-ingratidao', tipo: 'FUNDAMENTA', descricao: 'Rol taxativo da ingratidão.' },
      { destinoSlug: 'cc-art-564-nao-revogam-ingratidao', tipo: 'CONTRAPONTUA', descricao: 'Defesas do donatário.' },
    ],
  },
  {
    slug: 'peca-revogacao-doacao-ingratidao-modelo',
    titulo: 'Peça — Ação de revogação de doação por ingratidão (modelo com variáveis e checklist)',
    tipoDocumento: 'PECA',
    area: 'civil',
    subarea: 'doacao',
    assunto: 'Peça-modelo com {{VARIÁVEIS}}',
    prioridade: 'P1',
    lote: 'LOTE-019',
    conteudo: `# AÇÃO DE REVOGAÇÃO DE DOAÇÃO POR INGRATIDÃO — MODELO EJC

**Anti-invenção:** preencher TODAS as {{VARIÁVEIS}} com dados reais do caso; NÃO citar precedentes sem confirmação oficial (nº + tribunal + data).

---
EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA {{VARA}} DA COMARCA DE {{COMARCA}}/{{UF}}.

{{NOME_DOADOR}}, {{NACIONALIDADE}}, {{ESTADO_CIVIL}}, {{PROFISSAO}}, {{RG}}, {{CPF}}, residente em {{ENDERECO_DOADOR}}, por seu advogado (procuração anexa — {{OAB_ADVOGADO}}), vem propor a presente AÇÃO DE REVOGAÇÃO DE DOAÇÃO POR INGRATIDÃO em face de {{NOME_DONATARIO}}, {{QUALIFICACAO_DONATARIO}}, pelos fatos e fundamentos a seguir.

## I — DOS FATOS
1. Em {{DATA_DA_DOACAO}}, o requerente doou ao requerido {{BEM_DOADO}} ({{DESCRICAO_BEM}}), mediante {{FORMA_DOACAO: escritura pública de fls./instrumento particular}} (doc. {{NUM_DOC}}).
2. Em {{DATA_DO_FATO}}, o requerido praticou contra o requerente (ou contra {{FAMILIAR_OFENDIDO}}, cf. art. 558) a conduta de {{DESCRICAO_DA_CONDUTA}}, que se amolda ao inciso {{INCISO_557: I/II/III/IV}} do art. 557 do Código Civil {{E_OUTROS_DETALHES}}.
3. O requerente tomou conhecimento do fato e da autoria do requerido em {{DATA_DO_CONHECIMENTO}} — dentro do prazo anual do art. 559.

## II — DO DIREITO
- Art. 555 CC: a doação pode ser revogada por ingratidão do donatário.
- Art. 557, {{INCISO_557}}, CC: hipótese do rol — {{REDAÇÃO_DO_INCISO}}.
- Art. 559 CC: prazo de 1 ano contado do conhecimento do fato e da autoria — presente.
- Art. 563 CC: efeitos — restituição das coisas doadas, frutos posteriores à citação, indenização pelo meio termo se impossível a restituição em espécie.
- NÃO se aplicam as vedações do art. 564 {{VERIFICAR: a doação não é remuneratória, o encargo não foi cumprido, não é obrigação natural nem doação para determinado casamento}}.

## III — DOS PEDIDOS
a) a citação do requerido;
b) a REVOGAÇÃO da doação de {{DATA_DA_DOACAO}}, com a restituição de {{BEM_DOADO}};
c) subsidiariamente, a indenização pelo meio termo do valor (art. 563), apurada em liquidação;
d) os frutos percebidos após a citação;
e) a gratuidade da justiça {{SE_CABIVEL}} ou o preparo;
f) a produção de provas (testemunhal, documental {{E_CRIMINAL_SE_CABIVEL}}).

Dá-se à causa o valor de {{VALOR_DA_CAUSA}}.
{{LOCAL}}, {{DATA}}.
{{NOME_ADVOGADO}} — OAB/{{UF}} {{NUM_OAB}}

## CHECKLIST DE REVISÃO EJC (antes do protocolo)
- [ ] Forma original da doação documentada (escritura pública/instrumento).
- [ ] Conduta enquadrada EXATAMENTE em um inciso do art. 557 (ou art. 558 — familiar ofendido).
- [ ] Duplo termo inicial do art. 559 provado (fato + autoria) — 1 ano.
- [ ] Doação não se enquadra no art. 564 (imunidades).
- [ ] Valor da causa = valor do bem.
- [ ] Nenhum precedente citado sem confirmação oficial.`,
    tags: ['civil/doacao', 'civil/contratos'],
    fonte: EJC,
    urlFonte: URL_CC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'checklist-doacao-validade-desfazimento',
    titulo: 'Checklist — Validação e desfazimento de doação (18 pontos)',
    tipoDocumento: 'CHECKLIST',
    area: 'civil',
    subarea: 'doacao',
    assunto: 'Roteiro operacional doação',
    prioridade: 'P1',
    lote: 'LOTE-019',
    conteudo: `# CHECKLIST EJC — DOAÇÃO: VALIDADE E DESFAZIMENTO

## A — Forma e aceitação (arts. 538-543)
- [ ] 1. Imóvel? Exige ESCRITURA PÚBLICA + registro (arts. 541 + 1.245) — instrumento particular de imóvel = vício.
- [ ] 2. Móvel verbal? Só se pequeno valor + tradição imediata (art. 541 p.ú.).
- [ ] 3. Aceitação do donatário documentada (ou silêncio = aceitação apenas em doação PURA com prazo fixado — art. 539).
- [ ] 4. Nascituro: aceitação pelo representante legal (art. 542).
- [ ] 5. Incapaz absoluto: aceitação dispensada só em doação PURA (art. 543).

## B — Limites patrimoniais (arts. 548-549, 544)
- [ ] 6. Doação de TODOS os bens sem reserva? → NULA (art. 548).
- [ ] 7. Doação invade a legítima no MOMENTO da liberalidade? → NULA na parte excedente (art. 549).
- [ ] 8. Doação ascendente→descendente ou cônjuge→cônjuge: adiantamento de herança (art. 544) — verificar colação em inventário.

## C — Cláusulas (arts. 547, 551)
- [ ] 9. Reversão apenas em favor do DOADOR (art. 547 p.ú.) — cláusula em favor de terceiro não prevalece.
- [ ] 10. Doação em comum: distribuição igual, salvo declaração (art. 551); marido e mulher: totalidade para o sobrevivo.

## D — Defesa do doador (art. 552)
- [ ] 11. Juros mora/evicção/vício redibitório: doador NÃO responde (exceção: doação para casamento determinado — evicção).

## E — Encargo (arts. 553-554, 562)
- [ ] 12. Encargo a benefício do doador/terceiro/interesse geral; MP pode exigir após morte (interesse geral).
- [ ] 13. Entidade futura: constituição em 2 anos ou caducidade (art. 554).
- [ ] 14. Inexecução do encargo: MORA constituída (notificação judicial com prazo razoável se sem prazo ajustado — art. 562).

## F — Revogação por ingratidão (arts. 555-564)
- [ ] 15. Conduta no rol taxativo (art. 557 I-IV) ou contra familiar (art. 558)?
- [ ] 16. Prazo de 1 ANO do duplo conhecimento (fato + autoria — art. 559) — decadencial.
- [ ] 17. Imunidades do art. 564 ausentes?
- [ ] 18. Efeitos: restituição, frutos pós-citação, meio-termo se irrestituível (art. 563).`,
    tags: ['civil/doacao', 'geral/metodologia'],
    fonte: EJC,
    urlFonte: URL_CC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'fluxo-doacao-revogacao-etapas',
    titulo: 'Fluxo — Revogação de doação: da constatação da conduta à execução da restituição',
    tipoDocumento: 'FLUXO',
    area: 'civil',
    subarea: 'doacao',
    assunto: 'Mapa evento → prazo → providência → risco',
    prioridade: 'P1',
    lote: 'LOTE-019',
    conteudo: `# FLUXO EJC — REVOGAÇÃO DE DOAÇÃO POR INGRATIDÃO / INEXECUÇÃO DE ENCARGO

## Etapa 1 — Constatação e enquadramento
- Evento: conduta do donatário (art. 557 I-IV / 558) ou descumprimento do encargo (art. 562).
- Providência: reunir provas da conduta e da autoria; verificar imunidades do art. 564.
- Risco: fato fora do rol taxativo → revogação indeferida.

## Etapa 2 — Termo inicial do prazo (art. 559)
- Evento: doador toma conhecimento do FATO + de ser o DONATÁRIO o autor.
- Providência: documentar a data de conhecimento (mensagens, notificações, boletim).
- Prazo: 1 ANO (decadencial) — risco de caducidade do direito.

## Etapa 3 — Constituição em mora (encargo — art. 562)
- Evento: sem prazo ajustado para o encargo.
- Providência: notificação judicial com prazo razoável.
- Risco: revogação sem mora constituída → improcedência.

## Etapa 4 — Ajuizamento
- Providência: petição inicial (peça EJC do banco de peças), valor da causa = valor do bem; documento da doação.
- Risco: forma viciada da doação NÃO é revogação (é nulidade) — confundir rotas prejudica a causa.

## Etapa 5 — Citação e instrução
- Prazos: defesa do réu (procedimento comum — 15 dias úteis).
- Efeitos (art. 563): frutos percebidos ANTES da citação válida permanecem; após — pagos ao doador.

## Etapa 6 — Sentença e registro
- Providência: trânsito em julgado → registro da sentença no cartório (imóveis) para retomada da titularidade.
- Risco: terceiro de boa-fé com direito adquirido — revogação não o prejudica (art. 563).

## Etapa 7 — Execução/liquidância
- Irrestituível em espécie → indenização pelo MEIO TERMO do valor (art. 563).`,
    tags: ['civil/doacao', 'geral/prazos'],
    fonte: EJC,
    urlFonte: URL_CC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'tabela-documentos-doacao-revogacao',
    titulo: 'Tabela — Documentos necessários: ação de revogação de doação',
    tipoDocumento: 'TABELA_DOCUMENTOS',
    area: 'civil',
    subarea: 'doacao',
    assunto: 'Dossiê documental por fase',
    prioridade: 'P2',
    lote: 'LOTE-019',
    conteudo: `# TABELA EJC — DOCUMENTOS POR FASE (REVOGAÇÃO DE DOAÇÃO)

| Fase | Documento | Função |
|---|---|---|
| Pré-processual | Escritura pública/instrumento de doação | Prova do contrato e de cláusulas (encargo/reversão) |
| Pré-processual | Registro do imóvel (matrícula) | Situação atual da titularidade e ônus |
| Pré-processual | Prova da conduta (mensagens, laudo, B.O., processo criminal) | Enquadramento no art. 557/558 |
| Pré-processual | Prova do conhecimento do fato e da autoria | Termo inicial do art. 559 (1 ano) |
| Encargo | Instrumento com encargo + notificação judicial | Mora do art. 562 |
| Inicial | Procuração + documentos pessoais | Legitimação processual |
| Inicial | Comprovante de valor do bem | Valor da causa |
| Instrução | Testemunhas listadas | Prova da conduta |
| Instrução | Certidão criminal (se aplicável) | Apoio aos incisos I/II do art. 557 |
| Execução | Sentença transitada + requisição de registro | Retorno do bem ao patrimônio |
| Execução | Perícia de valor (se irrestituível) | Meio-termo do art. 563 |

**Aviso:** checklists são dossiês de referência — adaptar ao caso concreto.`,
    tags: ['civil/doacao', 'geral/metodologia'],
    fonte: EJC,
    urlFonte: URL_CC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'triagem-doacao-perguntas',
    titulo: 'Triagem — Doação: roteiro de entrevista e classificação (12 perguntas)',
    tipoDocumento: 'TRIAGEM',
    area: 'civil',
    subarea: 'doacao',
    assunto: 'Roteiro de classificação do caso',
    prioridade: 'P2',
    lote: 'LOTE-019',
    conteudo: `# TRIAGEM EJC — DOAÇÃO

1. Qual o bem doado e sua natureza (imóvel/móvel/dinheiro/direito)?
2. Existe documento formal? Escritura pública, instrumento particular ou verbal?
3. Quem doa e quem recebe — há vínculo ascendente/descendente ou conjugal (art. 544)?
4. A doação teve encargo? Qual e qual prazo? O encargo foi cumprido?
5. A doação reservou renda/parte para a subsistência do doador (art. 548)?
6. O patrimônio doado invade a legítima de herdeiros necessários (art. 549)?
7. Qual a data da doação (momento da liberalidade — art. 549)?
8. Houve conduta do donatário contra o doador ou familiares (art. 557/558)? Qual e quando?
9. Quando o doador soube do fato e da autoria (art. 559)?
10. A doação se enquadra nas imunidades do art. 564 (remuneratória, encargo cumprido, obrigação natural, casamento)?
11. Há terceiros de boa-fé envolvidos (alienação posterior, credores — art. 563)?
12. Objetivo do cliente: desfazer (revogar/nulidade) ou garantir cumprimento do encargo?

## Classificação de rota (SE-ENTÃO)
- Conduta no rol + 1 ano do duplo conhecimento → REVOGAÇÃO POR INGRATIDÃO.
- Encargo descumprido + mora → REVOGAÇÃO POR INEXECUÇÃO.
- Todos os bens sem reserva / invasão da legítima / forma de imóvel viciada → NULIDADE (não revogação).
- Cônjuge adúltero → ANULABILIDADE em 2 anos da dissolução (art. 550).`,
    tags: ['civil/doacao', 'geral/triagem'],
    fonte: EJC,
    urlFonte: URL_CC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'prazo-revogacao-doacao-ingratidao-1-ano',
    titulo: 'Prazo — Revogação de doação por ingratidão: 1 ano (CC art. 559)',
    tipoDocumento: 'PRAZO',
    area: 'civil',
    subarea: 'doacao',
    assunto: 'Doador pretende revogar doação por ingratidão do donatário',
    prioridade: 'P1',
    lote: 'LOTE-019',
    conteudo: `## Situação
Doador pretende revogar doação por ingratidão (CC arts. 557-558).

## Prazo
**1 ano — decadencial (CC, art. 559)**

## Fundamento
Art. 559: "A revogação por qualquer desses motivos deverá ser pleiteada dentro de um ano, a contar de quando chegue ao conhecimento do doador o fato que a autorizar, e de ter sido o donatário o seu autor."

## Termo inicial
Duplo: (1) conhecimento do fato; (2) ciência de que o donatário foi o autor. Documentar ambos.

## Forma de contagem
Anos civis (CC, art. 132): o ano termina no dia correspondente do mês seguinte+12 — contagem excludente do dia do início.

## Exceções
- Homicídio doloso do doador: herdeiros têm ação própria (art. 561) — observar o prazo do art. 559 a partir do óbito/conhecimento conforme caso concreto.
- Revogação por inexecução do encargo (art. 562): exige mora constituída — prazo específico conforme hipótese.

## Observações
- Não se transmite aos herdeiros (art. 560), salvo prosseguimento da ação já ajuizada.
**AVISO EJC:** validar à luz do caso concreto e do expediente forense.`,
    metadados: { prazo: '1 ano (decadencial)', fundamento: 'CC art. 559', termoInicial: 'Duplo conhecimento (fato + autoria)', contagem: 'Anos civis (CC art. 132)' },
    tags: ['civil/doacao', 'geral/prazos'],
    fonte: PLANALTO,
    urlFonte: URL_CC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'prazo-anulacao-doacao-conjuge-adultero-2-anos',
    titulo: 'Prazo — Anulação da doação do cônjuge adúltero: 2 anos após a dissolução (CC art. 550)',
    tipoDocumento: 'PRAZO',
    area: 'civil',
    subarea: 'doacao',
    assunto: 'Cônjuge lesado pretende anular doação ao cúmplice de adultério',
    prioridade: 'P1',
    lote: 'LOTE-019',
    conteudo: `## Situação
Cônjuge (ou herdeiros necessários) pretende anular doação feita pelo cônjuge adúltero ao seu cúmplice.

## Prazo
**2 anos após a dissolução da sociedade conjugal — decadencial (CC, art. 550)**

## Fundamento
Art. 550: "A doação do cônjuge adúltero ao seu cúmplice pode ser anulada pelo outro cônjuge, ou por seus herdeiros necessários, até dois anos depois de dissolvida a sociedade conjugal."

## Termo inicial
Dissolução da sociedade conjugal (não a data da doação nem o conhecimento do adultério).

## Forma de contagem
Anos civis (CC, art. 132).

## Exceções
Legitimação exclusiva: cônjuge lesado e herdeiros necessários — terceiros não têm ação própria.

## Observações
Anulabilidade (vício sanável no prazo) — decorrido o prazo, a doação convalida-se.
**AVISO EJC:** validar à luz do caso concreto.`,
    metadados: { prazo: '2 anos (decadencial)', fundamento: 'CC art. 550', termoInicial: 'Dissolução da sociedade conjugal', contagem: 'Anos civis (CC art. 132)' },
    tags: ['civil/doacao', 'geral/prazos'],
    fonte: PLANALTO,
    urlFonte: URL_CC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'argumentacao-doacao-dois-lados',
    titulo: 'Argumentação — Doação: tese do doador × defesa do donatário (4 controvérsias)',
    tipoDocumento: 'ARGUMENTACAO',
    area: 'civil',
    subarea: 'doacao',
    assunto: 'Análise bilateral da controvérsia',
    prioridade: 'P2',
    lote: 'LOTE-019',
    conteudo: `# ARGUMENTAÇÃO BILATERAL EJC — DOAÇÃO

## Controvérsia 1 — A conduta constitui ingratidão?
**Doador:** conduta literal no art. 557 (I-IV) ou contra familiares (558) — rol atendido; prova documental/testemunhal robusta.
**Donatário:** rol é TAXATIVO — desavenças comuns (discussões, rompimento de convívio) não revogam; conduta não tem dolo/gravidade; doação é remuneratória (art. 564 I).

## Controvérsia 2 — O prazo de 1 ano (art. 559) expirou?
**Doador:** duplo termo inicial (fato + autoria) — só tomou ciência plena em {{data}}; prova do conhecimento.
**Donatário:** doador sabia desde antes (mensagens antigas, conhecimento público do fato) — decadência; ônus do doador de provar o conhecimento tardio.

## Controvérsia 3 — Encargo descumprido (art. 562)?
**Doador:** encargo claro no instrumento; mora constituída por notificação judicial; prazo razoável decorrido.
**Donatário:** encargo cumprido (art. 564 II) ou impossibilidade justificada; notificação não especificou prazo razoável; encargo vago/inexequível.

## Controvérsia 4 — Nulidade (548/549) × revogação (555)?
**Herdeiros/impugnante:** doação de todos os bens sem reserva é NULA (548) — de ofício; parte que invade legítima é NULA (549).
**Donatário:** patrimônio não esgotado (havia renda); legítima verificada no MOMENTO da liberalidade e com colação; impugnante não é herdeiro necessário; casamento determinado (546) é válido e imune.`,
    tags: ['civil/doacao', 'geral/metodologia'],
    fonte: EJC,
    urlFonte: URL_CC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'doutrina-doacao-especies-animus-donandi',
    titulo: 'Doutrina — Doação: animus donandi, espécies e distinção com figuras afins (EJC)',
    tipoDocumento: 'DOUTRINA',
    area: 'civil',
    subarea: 'doacao',
    assunto: 'Conceitos técnicos do instituto',
    prioridade: 'P2',
    lote: 'LOTE-019',
    conteudo: `# DOUTRINA EJC — DOAÇÃO (CONCEITOS PRÓPRIOS)

## Animus donandi
Elemento subjetivo essencial: vontade de ENRIQUECER o donatário à custa do patrimônio do doador, sem contraprestação. Sem animus donandi não há doação — é transferência onerosa disfarçada (verificar a realidade do negócio).

## Espécies (ancoradas no art. 540 CC)
- **Pura e simples:** sem condições/encargos — aceitação dispensada para incapazes (art. 543).
- **Remuneratória:** em retribuição a serviços (valor dos serviços NÃO é liberalidade; excedente é doação).
- **Gravada (com encargo):** benefício do doador/terceiro/interesse geral (art. 553); encargo já cumprido imuniza da ingratidão (art. 564 II).
- **Contemplação do merecimento:** gratuidade mantida (art. 540).

## Distinções práticas
- **Doação × promessa de doação:** a doação de bens futuros não é admissível como liberalidade integral — cuidado com alienações antecipadas.
- **Doação × adiantamento de herança (544):** entre ascendentes/descendentes e cônjuges, presunção de antecipação da legítima — incidência de colação no inventário.
- **Doação direta × doação inoficiosa:** toda doação pode ser válida quanto à forma e inoficiosa quanto ao montante (549).

## Honestidade EJC
Conceituação técnica própria (sem citação de autores); textos dos arts. citados literalmente do Planalto na consulta de 2026-08-30.`,
    tags: ['civil/doacao', 'geral/metodologia'],
    fonte: EJC,
    urlFonte: URL_CC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'regra-se-doacao-diagnostico-rota',
    titulo: 'Regra SE-ENTÃO — Diagnóstico da rota de desfazimento da doação',
    tipoDocumento: 'REGRA_INTELIGENCIA',
    area: 'civil',
    subarea: 'doacao',
    assunto: 'Inteligência interpretável EJC',
    prioridade: 'P1',
    lote: 'LOTE-019',
    conteudo: `# REGRA SE-ENTÃO EJC — DOAÇÃO: QUAL ROTA DE DESFAZIMENTO?

**SE** a doação abrangeu TODOS os bens sem reserva de parte/renda para subsistência do doador
**ENTÃO** rota = NULIDADE ABSOLUTA (art. 548) — não sujeita ao prazo de 1 ano; reconhecível de ofício.

**SE** a doação excede o que o doador poderia dispor em testamento NO MOMENTO da liberalidade
**ENTÃO** rota = NULIDADE PARCIAL/REDUÇÃO por inoficiosidade (art. 549) — somar doações (art. 544) para apurar a legítima.

**SE** a doação partiu de cônjuge adúltero ao cúmplice
**ENTÃO** rota = ANULABILIDADE (art. 550) — legitimados: cônjuge lesado/herdeiros necessários; prazo 2 anos da DISSOLUÇÃO.

**SE** o donatário praticou conduta dos incisos I-IV do art. 557 (ou contra familiares — art. 558) E o prazo de 1 ano do duplo conhecimento está vivo E a doação não é das imunes (art. 564)
**ENTÃO** rota = REVOGAÇÃO POR INGRATIDÃO (art. 555) — restituição com efeitos do art. 563.

**SE** o encargo foi descumprido E a mora foi constituída (notificação judicial se sem prazo — art. 562)
**ENTÃO** rota = REVOGAÇÃO POR INEXECUÇÃO DO ENCARGO.

**SE** nenhuma hipótese acima se encaixa
**ENTÃO** a doação é válida e eficaz — informar o cliente com honestidade; avaliar planejamento futuro (ex.: reserva de renda, dispensa de colação expressa).

## Ordem de análise (trava anti-invenção)
1. Forma e aceitação (538-543) → 2. Limites patrimoniais (548-549) → 3. Anulabilidade (550) → 4. Revogação (555-564).`,
    tags: ['civil/doacao', 'geral/metodologia'],
    fonte: EJC,
    urlFonte: URL_CC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'jurimetria-vazia-doacao',
    titulo: 'Jurimetria — Doação (estrutura vazia — sem dados reais)',
    tipoDocumento: 'JURIMETRIA',
    area: 'civil',
    subarea: 'doacao',
    assunto: 'Estrutura para dados futuros',
    prioridade: 'P3',
    lote: 'LOTE-019',
    conteudo: `# JURIMETRIA — DOAÇÃO
**Status: SEM DADOS.** Nenhuma estatística real nesta consulta (2026-08-30) — o EJC NÃO inventa percentuais (item 18 da missão).

## Campos preparados
- tribunal/classe/período/amostra/metodologia/fonte;
- indicadores futuros: taxa de acolhimento de revogação por ingratidão; frequência de caducidade do prazo anual; relevância da inoficiosidade (549) nas impugnações.

## Separação obrigatória: DADO ESTATÍSTICO REAL (com fonte) × ANÁLISE QUALITATIVA.`,
    tags: ['civil/doacao', 'geral/metodologia'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
];
