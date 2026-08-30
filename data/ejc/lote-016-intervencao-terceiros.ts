// LOTE-016 — Intervenção de terceiros — CPC/2015 arts. 119-138 (P1)
// Textos LITERAIS extraídos do Planalto em 2026-08-30:
// https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm
// TÍTULO III: CAP. I Assistência (arts. 119-124), CAP. II Denunciação da lide
// (arts. 125-129), CAP. III Chamamento ao processo (arts. 130-132),
// CAP. IV Incidente de desconsideração da personalidade jurídica (arts. 133-137),
// CAP. V Amicus curiae (art. 138).
//
// ANTI-INVENÇÃO desta rodada:
// - Nenhum acórdão/REsp sobre intervenção citado (nenhum confirmado em fonte
//   oficial na consulta — STF/STJ bloqueados por 403/Cloudflare em 2026-08-30).
// - Nenhuma súmula específica de intervenção incluída nesta rodada.
// - Todos os textos de lei verbatim do Planalto.
import type { InputDocument } from '../../src/lib/ejc/types';

const D = '2026-08-30';
const PLANALTO = 'Presidência da República — Planalto';
const URL_CPC = 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm';
const EJC = 'Elaboração EJC — conteúdo estrutural original';

function leiCpc(
  slug: string, titulo: string, assunto: string, conteudo: string, artigos: string[],
  extra?: Partial<InputDocument>,
): InputDocument {
  return {
    slug, titulo, tipoDocumento: 'LEGISLACAO', area: 'processual-civil', subarea: 'intervencao-terceiros',
    assunto, prioridade: 'P1', lote: 'LOTE-016',
    conteudo,
    metadados: { numero: 'Lei 13.105/2015 (CPC)', data_norma: '2015-03-16', orgao: 'Congresso Nacional', artigos_principais: artigos, vigente: true, confirmacao_texto: 'Extração literal do texto oficial do Planalto em 2026-08-30.' },
    tags: ['processual-civil/intervencao-terceiros', 'geral/prazos'],
    fonte: PLANALTO,
    urlFonte: URL_CPC,
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
  leiCpc(
    'cpc-art-119-assistencia-cabimento-texto-literal',
    'CPC art. 119 — Assistência: cabimento em qualquer procedimento e grau (texto literal confirmado)',
    'Cabimento da assistência',
    `## Ficha da Norma
- **Norma:** Lei 13.105/2015 (CPC) — Título III "Da Intervenção de Terceiros", Capítulo I "Da Assistência", Seção I "Disposições Comuns".

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 119. Pendendo causa entre 2 (duas) ou mais pessoas, o terceiro juridicamente interessado em que a sentença seja favorável a uma delas poderá intervir no processo para assisti-la.

Parágrafo único. A assistência será admitida em qualquer procedimento e em todos os graus de jurisdição, recebendo o assistente o processo no estado em que se encontre."

## Leitura aplicada
- **Requisito central: interesse jurídico** (não mero interesse de fato — é relevante apenas para a admissão, a qualificação jurídica é o que importa).
- **Amplitude:** qualquer procedimento + todos os graus de jurisdição; o assistente recebe o processo NO ESTADO EM QUE SE ENCONTRA (não repristina prazos).
- Distinção conceitual: assistência simples (art. 121) × assistência litisconsorcial (art. 124 — quando a sentença influir na relação jurídica entre assistente e adversário do assistido).

## Hipóteses de aplicação no EJC
- Garantidor/fiador que acompanha demanda do devedor; cessionário acompanhando cedente; contratante que responderá regressivamente.`,
    ['119', '119 p.ú.'],
    {
      relacionamentos: [
        { destinoSlug: 'cpc-art-120-deferimento-impugnacao-assistencia', tipo: 'SEQUENCIA', descricao: 'Procedimento de admissão e impugnação.' },
        { destinoSlug: 'cpc-arts-121-124-assistencia-simples-litisconsorcial', tipo: 'REFINA', descricao: 'Espécies de assistência e efeitos da coisa julgada.' },
      ],
    },
  ),
  leiCpc(
    'cpc-art-120-deferimento-impugnacao-assistencia',
    'CPC art. 120 — Deferimento do pedido de assistência e impugnação em 15 dias (texto literal confirmado)',
    'Procedimento da assistência',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 120. Não havendo impugnação no prazo de 15 (quinze) dias, o pedido do assistente será deferido, salvo se for caso de rejeição liminar.

Parágrafo único. Se qualquer parte alegar que falta ao requerente interesse jurídico para intervir, o juiz decidirá o incidente, sem suspensão do processo."

## Leitura aplicada
- **Prazo de 15 dias** para impugnação das partes (dia útil — art. 219 CPC).
- Sem impugnação → deferimento; EXCEÇÃO: rejeição liminar (casos patentes de falta de interesse jurídico).
- Incidente de falta de interesse jurídico NÃO suspende o processo (p.ú.).

## Hipóteses de aplicação no EJC
- Monitorar o prazo de 15 dias quando qualquer parte quiser impugnar a assistência.
- A intervenção não suspende o curso do processo principal.`,
    ['120', '120 p.ú.'],
    {
      relacionamentos: [
        { destinoSlug: 'prazo-impugnacao-assistencia-15-dias', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Prazo de 15 dias registrado no Banco 10.' },
      ],
    },
  ),
  leiCpc(
    'cpc-arts-121-124-assistencia-simples-litisconsorcial',
    'CPC arts. 121-124 — Assistência simples (auxiliar/substituto processual) e litisconsorcial (texto literal confirmado)',
    'Espécies de assistência e coisa julgada',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 121. O assistente simples atuará como auxiliar da parte principal, exercerá os mesmos poderes e sujeitar-se-á aos mesmos ônus processuais que o assistido.

Parágrafo único. Sendo revel ou, de qualquer outro modo, omisso o assistido, o assistente será considerado seu substituto processual.

Art. 122. A assistência simples não obsta a que a parte principal reconheça a procedência do pedido, desista da ação, renuncie ao direito sobre o que se funda a ação ou transija sobre direitos controvertidos.

Art. 123. Transitada em julgado a sentença no processo em que interveio o assistente, este não poderá, em processo posterior, discutir a justiça da decisão, salvo se alegar e provar que:
I - pelo estado em que recebeu o processo ou pelas declarações e pelos atos do assistido, foi impedido de produzir provas suscetíveis de influir na sentença;
II - desconhecia a existência de alegações ou de provas das quais o assistido, por dolo ou culpa, não se valeu.

Art. 124. Considera-se litisconsorte da parte principal o assistente sempre que a sentença influir na relação jurídica entre ele e o adversário do assistido."

## Leitura aplicada
- **Assistência simples:** auxiliar — mesmos poderes/ônus; o assistido revel/omisso converte o assistente em SUBSTITUTO PROCESSUAL (p.ú. do art. 121).
- **Limitação decisiva (art. 122):** o assistido simples PODE reconhecer procedência, desistir, renunciar ou transigir — o assistente não impede.
- **Coisa julgada (art. 123):** o assistente simples fica vinculado, SALVO as duas hipóteses de desvinculação (provas impedidas; alegações/provas desconhecidas por dolo ou culpa do assistido — ônus de alegar e provar).
- **Assistência litisconsorcial (art. 124):** quando a sentença influir na relação jurídica entre assistente e adversário do assistido — tratamento de litisconsorte (mais poderes: atos que podem alterar o resultado).

## Hipóteses de aplicação no EJC
- Defesa do assistente litisconsorcial: atos de defesa autônoma sem dependência do assistido.
- Pós-julgamento: avaliar as 2 portas do art. 123 antes de vincular a decisão.`,
    ['121', '121 p.ú.', '122', '123', '124'],
    {
      relacionamentos: [
        { destinoSlug: 'argumentacao-assistencia-simples-vs-litisconsorcial', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Análise bilateral da escolha da espécie.' },
        { destinoSlug: 'doutrina-intervencao-terceiros-tipos', tipo: 'CONTEXTO', descricao: 'Panorama doutrinário das intervenções.' },
      ],
    },
  ),
  leiCpc(
    'cpc-arts-125-129-denunciacao-lide-texto-literal',
    'CPC arts. 125-129 — Denunciação da lide: hipóteses, cadeia dominial, procedimento e regresso (texto literal confirmado)',
    'Denunciação da lide',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 125. É admissível a denunciação da lide, promovida por qualquer das partes:
I - ao alienante imediato, no processo relativo à coisa cujo domínio foi transferido ao denunciante, a fim de que possa exercer os direitos que da evicção lhe resultam;
II - àquele que estiver obrigado, por lei ou pelo contrato, a indenizar, em ação regressiva, o prejuízo de quem for vencido no processo.

§ 1º O direito regressivo será exercido por ação autônoma quando a denunciação da lide for indeferida, deixar de ser promovida ou não for permitida.

§ 2º Admite-se uma única denunciação sucessiva, promovida pelo denunciado, contra seu antecessor imediato na cadeia dominial ou quem seja responsável por indenizá-lo, não podendo o denunciado sucessivo promover nova denunciação, hipótese em que eventual direito de regresso será exercido por ação autônoma.

Art. 126. A citação do denunciado será requerida na petição inicial, se o denunciante for autor, ou na contestação, se o denunciante for réu, devendo ser realizada na forma e nos prazos previstos no art. 131.

Art. 127. Feita a denunciação pelo autor, o denunciado poderá assumir a posição de litisconsorte do denunciante e acrescentar novos argumentos à petição inicial, procedendo-se em seguida à citação do réu.

Art. 128. Feita a denunciação pelo réu:
I - se o denunciado contestar o pedido formulado pelo autor, o processo prosseguirá tendo, na ação principal, em litisconsórcio, denunciante e denunciado;
II - se o denunciado for revel, o denunciante pode deixar de prosseguir com sua defesa, eventualmente oferecida, e abster-se de recorrer, restringindo sua atuação à ação regressiva;
III - se o denunciado confessar os fatos alegados pelo autor na ação principal, o denunciante poderá prosseguir com sua defesa ou, aderindo a tal reconhecimento, pedir apenas a procedência da ação de regresso.

Parágrafo único. Procedente o pedido da ação principal, pode o autor, se for o caso, requerer o cumprimento da sentença também contra o denunciado, nos limites da condenação deste na ação regressiva.

Art. 129. Se o denunciante for vencido na ação principal, o juiz passará ao julgamento da denunciação da lide.

Parágrafo único. Se o denunciante for vencedor, a ação de denunciação não terá o seu pedido examinado, sem prejuízo da condenação do denunciante ao pagamento das verbas de sucumbência em favor do denunciado."

## Leitura aplicada
- **2 hipóteses taxativas (art. 125):** evicção (alienante imediato) + regresso por lei ou contrato.
- **Cadeia dominial:** UMA denunciação sucessiva apenas (§ 2º) — regressos além disso por ação autônoma.
- **Momento:** autor → na inicial; réu → na contestação (art. 126), citação regida pelo art. 131 (30 dias / 2 meses).
- **Denunciante vencedor (art. 129 p.ú.):** pedido regressivo NÃO examinado, mas denunciante paga sucumbência ao denunciado — armadilha prática.
- **Efeito extensivo (art. 128 p.ú.):** cumprimento também contra o denunciado nos limites da regressiva.

## Hipóteses de aplicação no EJC
- Condenação do comprador/possuidor → denunciar alienante para evicção (contratos da base).
- Réu contratual obrigado por lei/contrato a indenizar vencedor... (regresso: fornecedor/comerciante etc.).`,
    ['125', '125 § 1º', '125 § 2º', '126', '127', '128', '129', '129 p.ú.'],
    {
      relacionamentos: [
        { destinoSlug: 'cpc-arts-130-132-chamamento-ao-processo-texto-literal', tipo: 'SEQUENCIA', descricao: 'Intervenção seguinte: chamamento ao processo.' },
        { destinoSlug: 'prazo-citacao-denunciado-chamado-30-dias', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Prazo de citação do denunciado (art. 131).' },
      ],
    },
  ),
  leiCpc(
    'cpc-arts-130-132-chamamento-ao-processo-texto-literal',
    'CPC arts. 130-132 — Chamamento ao processo: fiador/afiançado e devedores solidários (texto literal confirmado)',
    'Chamamento ao processo',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 130. É admissível o chamamento ao processo, requerido pelo réu:
I - do afiançado, na ação em que o fiador for réu;
II - dos demais fiadores, na ação proposta contra um ou alguns deles;
III - dos demais devedores solidários, quando o credor exigir de um ou de alguns o pagamento da dívida comum.

Art. 131. A citação daqueles que devam figurar em litisconsórcio passivo será requerida pelo réu na contestação e deve ser promovida no prazo de 30 (trinta) dias, sob pena de ficar sem efeito o chamamento.

Parágrafo único. Se o chamado residir em outra comarca, seção ou subseção judiciárias, ou em lugar incerto, o prazo será de 2 (dois) meses.

Art. 132. A sentença de procedência valerá como título executivo em favor do réu que satisfizer a dívida, a fim de que possa exigi-la, por inteiro, do devedor principal, ou, de cada um dos codevedores, a sua quota, na proporção que lhes tocar."

## Leitura aplicada
- **3 hipóteses taxativas (art. 130):** fiador → afiançado; co-fiadores; devedores solidários.
- **Momento e prazo:** requerido na contestação; citação promovida em 30 dias (2 meses se outra comarca/lugar incerto) — sob pena de ficar SEM EFEITO o chamamento (art. 131).
- **Efeito executivo (art. 132):** a sentença vira título em favor do réu que pagou — cobrar por inteiro do principal ou a quota dos codevedores (economia processual regressiva).

## Hipóteses de aplicação no EJC
- Cobrança contra fiador → chamar o devedor principal.
- Cobrança de dívida solidária contra um devedor → chamar os demais.`,
    ['130', '131', '131 p.ú.', '132'],
    {
      relacionamentos: [
        { destinoSlug: 'prazo-citacao-denunciado-chamado-30-dias', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Prazo de 30 dias/2 meses do art. 131.' },
      ],
    },
  ),
  leiCpc(
    'cpc-arts-133-137-idpj-texto-literal',
    'CPC arts. 133-137 — Incidente de desconsideração da personalidade jurídica (texto literal confirmado)',
    'Incidente de desconsideração da personalidade jurídica',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 133. O incidente de desconsideração da personalidade jurídica será instaurado a pedido da parte ou do Ministério Público, quando lhe couber intervir no processo.

§ 1º O pedido de desconsideração da personalidade jurídica observará os pressupostos previstos em lei.

§ 2º Aplica-se o disposto neste Capítulo à hipótese de desconsideração inversa da personalidade jurídica.

Art. 134. O incidente de desconsideração é cabível em todas as fases do processo de conhecimento, no cumprimento de sentença e na execução fundada em título executivo extrajudicial.

§ 1º A instauração do incidente será imediatamente comunicada ao distribuidor para as anotações devidas.

§ 2º Dispensa-se a instauração do incidente se a desconsideração da personalidade jurídica for requerida na petição inicial, hipótese em que será citado o sócio ou a pessoa jurídica.

§ 3º A instauração do incidente suspenderá o processo, salvo na hipótese do § 2º.

§ 4º O requerimento deve demonstrar o preenchimento dos pressupostos legais específicos para desconsideração da personalidade jurídica.

Art. 135. Instaurado o incidente, o sócio ou a pessoa jurídica será citado para manifestar-se e requerer as provas cabíveis no prazo de 15 (quinze) dias.

Art. 136. Concluída a instrução, se necessária, o incidente será resolvido por decisão interlocutória.

Parágrafo único. Se a decisão for proferida pelo relator, cabe agravo interno.

Art. 137. Acolhido o pedido de desconsideração, a alienação ou a oneração de bens, havida em fraude de execução, será ineficaz em relação ao requerente."

## Leitura aplicada
- **Legitimidade:** parte ou MP; pressupostos = os previstos em LEI (art. 50 CC — abuso da personalidade; CDC art. 28 etc. — EJC não afirma pressupostos por inferência).
- **Fases cabíveis (art. 134):** TODAS as fases do conhecimento, cumprimento de sentença e execução extrajudicial.
- **Desconsideração INVERSA** expressamente prevista (art. 133 § 2º).
- **Suspensão do processo** na instauração (art. 134 § 3º), salvo requerimento na inicial (§ 2º).
- **Citação do sócio/PJ: 15 dias** para manifestar-se e requerer provas (art. 135).
- **Decisão interlocutória** (art. 136): agravo de instrumento — art. 1.015 II; se pelo relator → agravo interno (p.ú.).
- **Fraude de execução (art. 137):** alienação/oneração após o incidente é INEFICAZ em relação ao requerente.

## Hipóteses de aplicação no EJC
- Recuperação de crédito: partir do sócio quando pressupostos legais demonstráveis.
- Fluxo de instauração com anotação no distribuidor (evita alienações — art. 137).`,
    ['133', '133 § 2º', '134', '134 § 2º', '134 § 3º', '135', '136', '137'],
    {
      relacionamentos: [
        { destinoSlug: 'cpc-art-1015-cabimento-agravo-texto-atual', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Agravo de instrumento contra a decisão do incidente (art. 1.015 II).' },
        { destinoSlug: 'fluxo-idpj-instauracao-defesa', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Fluxo operacional do incidente.' },
        { destinoSlug: 'prazo-manifestacao-idpj-15-dias', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Prazo de 15 dias do art. 135.' },
      ],
    },
  ),
  leiCpc(
    'cpc-art-138-amicus-curiae-texto-literal',
    'CPC art. 138 — Amicus curiae: admissão, poderes e limites recursais (texto literal confirmado)',
    'Amicus curiae',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 138. O juiz ou o relator, considerando a relevância da matéria, a especificidade do tema objeto da demanda ou a repercussão social da controvérsia, poderá, por decisão irrecorrível, de ofício ou a requerimento das partes ou de quem pretenda manifestar-se, solicitar ou admitir a participação de pessoa natural ou jurídica, órgão ou entidade especializada, com representatividade adequada, no prazo de 15 (quinze) dias de sua intimação.

§ 1º A intervenção de que trata o caput não implica alteração de competência nem autoriza a interposição de recursos, ressalvadas a oposição de embargos de declaração e a hipótese do § 3º.

§ 2º Caberá ao juiz ou ao relator, na decisão que solicitar ou admitir a intervenção, definir os poderes do amicus curiae.

§ 3º O amicus curiae pode recorrer da decisão que julgar o incidente de resolução de demandas repetitivas."

## Leitura aplicada
- **Requisitos de admissibilidade:** relevância da matéria, especificidade do tema ou repercussão social + representatividade adequada.
- **Decisão IRRECORRÍVEL** que solicita/admite (caput) — não cabe agravo.
- **Limites recursais (§ 1º):** sem recursos, SALVO embargos de declaração e recurso contra decisão do IRDR (§ 3º).
- **Poderes definidos na decisão de admissão** (§ 2º); manifestação em 15 dias da intimação.

## Hipóteses de aplicação no EJC
- Entidades setoriais/associações querendo atuar em causa coletiva; fiscalizar o escopo de poderes definidos pelo juiz.`,
    ['138', '138 § 1º', '138 § 2º', '138 § 3º'],
  ),
  {
    slug: 'tese-idpj-fases-e-fraude-execucao',
    titulo: 'Tese — IDPJ é incidente autônomo cabível em todas as fases, com ineficácia das alienações em fraude de execução',
    tipoDocumento: 'TESE',
    area: 'processual-civil',
    subarea: 'intervencao-terceiros',
    assunto: 'Desconsideração da personalidade jurídica',
    prioridade: 'P1',
    lote: 'LOTE-016',
    conteudo: `## Tese estruturada (fundada em texto legal literal — CPC arts. 133-137)
**Enunciado:** O incidente de desconsideração da personalidade jurídica é via autônoma, cabível em todas as fases do processo de conhecimento, no cumprimento de sentença e na execução de título extrajudicial; acolhido o pedido, a alienação/oneração de bens havida em fraude de execução é ineficaz em relação ao requerente.

## Fundamento legal (literal)
- CPC art. 134 (fases cabíveis); art. 134 § 3º (suspensão do processo); art. 135 (citação 15 dias); art. 137 (ineficácia da fraude de execução); art. 133 § 2º (desconsideração inversa).
- Pressupostos: "previstos em lei" (art. 133 § 1º) — citar a lei material cabível ao caso (ex.: CC art. 50; CDC art. 28), VERIFICANDO no texto oficial antes de usar.

## Requisitos operacionais
1. Demonstração EXPRESSA dos pressupostos legais no requerimento (art. 134 § 4º) — não basta alegar "fraude genérica".
2. Comunicação imediata ao distribuidor (art. 134 § 1º) para blindagem contra alienações.
3. Quando o pedido é na inicial, dispensa o incidente e cita-se direto sócio/PJ (art. 134 § 2º).

## Riscos e contrários
- Defesa do sócio: falta de demonstração dos pressupostos (art. 134 § 4º) e de responsabilidade pessoal.
- A suspensão do processo principal durante o incidente (art. 134 § 3º) pode ser explorada taticamente por ambas as partes.

## Probabilidade qualitativa: ALTA quando pressupostos legais demonstrados (base = texto legal vigente).`,
    metadados: { area_arvore: 'processual-civil > intervencao-terceiros > idpj', palavras_chave: ['desconsideração', 'IDPJ', 'fraude de execução', 'lifting the veil'], probabilidade: 'alta (quando demonstrados os pressupostos legais)' },
    tags: ['processual-civil/intervencao-terceiros'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'cpc-arts-133-137-idpj-texto-literal', tipo: 'FUNDAMENTA_EM', descricao: 'Base legal literal da tese.' },
      { destinoSlug: 'fluxo-idpj-instauracao-defesa', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Fluxo de instauração e defesa.' },
    ],
  },
  {
    slug: 'peca-denunciacao-chamamento-idpj-modelo',
    titulo: 'Peça-modelo — Manifestação do réu com denunciação da lide / chamamento ao processo / IDPJ (variáveis + checklist)',
    tipoDocumento: 'PECA',
    area: 'processual-civil',
    subarea: 'intervencao-terceiros',
    assunto: 'Contestação com intervenção provocada',
    prioridade: 'P1',
    lote: 'LOTE-016',
    conteudo: `# CONTESTAÇÃO COM INTERVENÇÃO PROVOCADA — MODELO EJC
## Uso: réu que provoca denunciação da lide (art. 125), chamamento ao processo (art. 130) ou desconsideração (arts. 133-137) CPC.

AO JUÍZO DA {{VARA_COMARCA}}
Processo nº {{PROCESSO}}
{{AUTOR}} (Autor) x {{REU}} (Réu)

{{REU}}, por seu advogado, vem, tempestivamente, APRESENTAR CONTESTAÇÃO, requerendo, preliminarmente/acumuladamente:

### 1. DENUNCIAÇÃO DA LIDE (art. 125 CPC)
Denunciar a lide a {{DENUNCIADO}}, {{CPF_CNPJ_DENUNCIADO}}, nas hipóteses do art. 125, I (evicção — alienante imediato da coisa {{DESCRICAO_COISA}}) ou II (obrigação de indenizar em regresso — fonte: {{LEI_OU_CONTRATO}}), requerendo a citação no prazo do art. 131 (30 dias / 2 meses).

### 2. CHAMAMENTO AO PROCESSO (art. 130 CPC)
Chamar ao processo {{CHAMADO}}, na hipótese do art. 130, {{INCISO}} (afiançado / demais fiadores / demais devedores solidários), requerendo citação sob pena de ineficácia do chamamento (art. 131).

### 3. DESCONSIDERAÇÃO (arts. 133-137 CPC) — quando cabível
Instaurar incidente de desconsideração ({{DIRETA_OU_INVERSA}}) da personalidade jurídica de {{SOCIO_PJ}}, demonstrando os pressupostos legais: {{PRESSUPOSTOS_DEMONSTRADOS}}, com comunicação ao distribuidor (art. 134 § 1º).

### Mérito
{{FUNDAMENTOS_DO_MERITO}}
### Pedidos
{{PEDIDOS}}
Nestes termos, pede deferimento. {{LOCAL_DATA}} — {{ADVOGADO_OAB}}

## CHECKLIST DE REVISÃO (embutido)
- [ ] Momento correto: denunciação/chamamento NA CONTESTAÇÃO (arts. 126 e 131); IDPJ: pedido inicial dispensa incidente (art. 134 § 2º)
- [ ] Demonstração expressa dos pressupostos de desconsideração (art. 134 § 4º)
- [ ] Requerimento de citação com endereço do denunciado/chamado (prazo 30 dias/2 meses — art. 131)
- [ ] Uma única denunciação sucessiva (art. 125 § 2º)
- [ ] Pedidos regressivos reservados para o julgamento após vencimento na principal (art. 129)
- [ ] Fonte verificada no texto oficial do CPC (Planalto, consulta {{DATA_CONSULTA}})`,
    metadados: { variaveis: ['VARA_COMARCA', 'PROCESSO', 'AUTOR', 'REU', 'DENUNCIADO', 'CPF_CNPJ_DENUNCIADO', 'DESCRICAO_COISA', 'LEI_OU_CONTRATO', 'CHAMADO', 'INCISO', 'SOCIO_PJ', 'PRESSUPOSTOS_DEMONSTRADOS', 'FUNDAMENTOS_DO_MERITO', 'PEDIDOS', 'LOCAL_DATA', 'ADVOGADO_OAB', 'DATA_CONSULTA'] },
    tags: ['processual-civil/intervencao-terceiros'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'cpc-arts-125-129-denunciacao-lide-texto-literal', tipo: 'FUNDAMENTA_EM', descricao: 'Base legal da denunciação.' },
      { destinoSlug: 'cpc-arts-130-132-chamamento-ao-processo-texto-literal', tipo: 'FUNDAMENTA_EM', descricao: 'Base legal do chamamento.' },
    ],
  },
  {
    slug: 'checklist-intervencoes-admissibilidade',
    titulo: 'Checklist — Admissibilidade das intervenções de terceiros (CPC arts. 119-138)',
    tipoDocumento: 'CHECKLIST',
    area: 'processual-civil',
    subarea: 'intervencao-terceiros',
    assunto: 'Controle prévio de admissibilidade',
    prioridade: 'P1',
    lote: 'LOTE-016',
    conteudo: `# CHECKLIST DE ADMISSIBILIDADE DAS INTERVENÇÕES (consulta 2026-08-30, textos literais)
1. **Espécie adequada?** Espontâneas (assistência simples/litisconsorcial — arts. 119-124) × provocadas (denunciação 125-129; chamamento 130-132; IDPJ 133-137; amicus 138).
2. **Hipótese taxativa?** Denunciação: só evicção (alienante imediato) ou regresso por lei/contrato (art. 125); chamamento: só as 3 hipóteses do art. 130.
3. **Momento correto?** Provocadas: autor na inicial, réu na contestação (arts. 126 e 131); IDPJ: qualquer fase — mas na inicial dispensa incidente (art. 134 § 2º).
4. **Prazos de citação protegidos?** Denunciado/chamado citado em 30 dias (2 meses outra comarca/incerto) — art. 131; senão o chamamento fica sem efeito.
5. **Interesse jurídico demonstrado?** Assistência: interesse JURÍDICO (art. 119) — incidente não suspende o processo (art. 120 p.ú.).
6. **Sucessiva única?** Denunciação sucessiva: UMA só (art. 125 § 2º).
7. **IDPJ: pressupostos legais demonstrados?** (art. 134 § 4º) + comunicação ao distribuidor (§ 1º).
8. **Cadeia de efeitos mapeada?** vencimento → julgamento da denunciação (art. 129); título executivo do réu que pagou (art. 132); ineficácia da fraude de execução (art. 137).
9. **Amicus: representatividade + poderes definidos?** (art. 138 caput e § 2º) — decisão irrecorrível.
10. **Pós-julgamento do assistente:** as 2 portas do art. 123 avaliadas antes de vinculação.
11. **Sucumbência do denunciado** prevista se denunciante vencer (art. 129 p.ú.) — evitar surpresa.
12. **Fonte confirmada:** textos conferidos no Planalto (consulta {{DATA_CONSULTA}}).`,
    tags: ['processual-civil/intervencao-terceiros', 'geral/metodologia'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'cpc-art-119-assistencia-cabimento-texto-literal', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Base literal da assistência.' },
    ],
  },
  {
    slug: 'fluxo-idpj-instauracao-defesa',
    titulo: 'Fluxo — Incidente de desconsideração da personalidade jurídica (instauração → decisão)',
    tipoDocumento: 'FLUXO',
    area: 'processual-civil',
    subarea: 'intervencao-terceiros',
    assunto: 'IDPJ passo a passo',
    prioridade: 'P1',
    lote: 'LOTE-016',
    conteudo: `# FLUXO DO IDPJ — CPC arts. 133-137 (textos literais, consulta 2026-08-30)
1. **Pedido** por parte ou MP (art. 133) → demonstrar expressamente os pressupostos legais (art. 134 § 4º). Se pedido na inicial: dispensa incidente e cita-se sócio/PJ direto (art. 134 § 2º).
2. **Instauração** → comunicação imediata ao distribuidor para anotações (art. 134 § 1º) — efeito prático ligado ao art. 137 (ineficácia de alienações em fraude de execução).
3. **Suspensão do processo principal** salvo hipótese do § 2º (art. 134 § 3º).
4. **Citação do sócio/PJ** → 15 dias para manifestar-se e requerer provas (art. 135).
5. **Instrução** (se necessária) → conclusão.
6. **Decisão interlocutória** (art. 136): acolhido → sócio/PJ integra a relação (e art. 137: alienações em fraude de execução ineficazes); rejeitado → incidente extinto.
7. **Recurso:** agravo de instrumento (art. 1.015 II CPC); se decisão do relator → agravo interno (art. 136 p.ú.).
**Risco:** suspender sem necessidade (§ 3º) atrasa o principal; não comunicar o distribuidor perde a blindagem do art. 137.`,
    tags: ['processual-civil/intervencao-terceiros'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'cpc-arts-133-137-idpj-texto-literal', tipo: 'FUNDAMENTA_EM', descricao: 'Base literal do fluxo.' },
      { destinoSlug: 'cpc-art-1015-cabimento-agravo-texto-atual', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Recursal do incidente.' },
    ],
  },
  {
    slug: 'prazo-impugnacao-assistencia-15-dias',
    titulo: 'Prazo — Impugnação ao pedido de assistência: 15 dias (CPC art. 120)',
    tipoDocumento: 'PRAZO',
    area: 'processual-civil',
    subarea: 'intervencao-terceiros',
    assunto: 'Assistência',
    prioridade: 'P1',
    lote: 'LOTE-016',
    conteudo: `## Prazo registrado
- **Situação:** pedido de assistência apresentado no processo; parte quer impugnar o interesse jurídico do assistente.
- **Prazo:** 15 dias úteis (contagem — CPC arts. 219 e 12-A Lei 11.419 se eletrônico).
- **Fundamento:** CPC art. 120 caput (texto literal confirmado no Planalto, 2026-08-30): "Não havendo impugnação no prazo de 15 (quinze) dias, o pedido do assistente será deferido, salvo se for caso de rejeição liminar."
- **Termo inicial:** a partir da data da intervenção/intimação conforme regras gerais do art. 120.
- **Exceções/observações:** sem impugnação → deferimento; rejeição liminar possível; incidente de falta de interesse jurídivo NÃO suspende o processo (art. 120 p.ú.).
- **Aviso EJC:** todo prazo deve ser validado à luz do processo concreto, legislação vigente, expediente forense e decisões aplicáveis.`,
    metadados: { tipo: 'processual', contagem: 'dias úteis', fundamento_literal: 'CPC art. 120 caput' },
    tags: ['processual-civil/intervencao-terceiros', 'geral/prazos'],
    fonte: PLANALTO,
    urlFonte: URL_CPC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'prazo-citacao-denunciado-chamado-30-dias',
    titulo: 'Prazo — Citação do denunciado/chamado: 30 dias ou 2 meses (CPC art. 131)',
    tipoDocumento: 'PRAZO',
    area: 'processual-civil',
    subarea: 'intervencao-terceiros',
    assunto: 'Denunciação e chamamento',
    prioridade: 'P1',
    lote: 'LOTE-016',
    conteudo: `## Prazo registrado
- **Situação:** denunciação da lide (art. 126 remete ao 131) ou chamamento ao processo requeridos pelo réu.
- **Prazo:** citação promovida em 30 dias; se o chamado residir em outra comarca/seção ou lugar incerto → 2 meses.
- **Fundamento:** CPC art. 131 caput e p.ú. (texto literal, Planalto 2026-08-30): "sob pena de ficar sem efeito o chamamento".
- **Consequência:** perder o prazo = chamamento SEM EFEITO.
- **Aplicação:** requerimento na contestação; o art. 126 aplica o mesmo regime à citação do denunciado.
- **Aviso EJC:** validar no processo concreto.`,
    metadados: { tipo: 'processual', contagem: 'dias corridos do requerimento', fundamento_literal: 'CPC art. 131' },
    tags: ['processual-civil/intervencao-terceiros', 'geral/prazos'],
    fonte: PLANALTO,
    urlFonte: URL_CPC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'prazo-manifestacao-idpj-15-dias',
    titulo: 'Prazo — Manifestação e provas no IDPJ: 15 dias (CPC art. 135)',
    tipoDocumento: 'PRAZO',
    area: 'processual-civil',
    subarea: 'intervencao-terceiros',
    assunto: 'Desconsideração da personalidade jurídica',
    prioridade: 'P1',
    lote: 'LOTE-016',
    conteudo: `## Prazo registrado
- **Situação:** incidente de desconsideração instaurado; sócio/pessoa jurídica citado.
- **Prazo:** 15 dias úteis para manifestar-se e requerer as provas cabíveis.
- **Fundamento:** CPC art. 135 (texto literal, Planalto 2026-08-30).
- **Termo inicial:** citação do sócio/PJ.
- **Observações:** depois da instrução → decisão interlocutória (art. 136); agravo de instrumento (art. 1.015 II) ou agravo interno se proferida pelo relator (art. 136 p.ú.).
- **Aviso EJC:** validar no processo concreto.`,
    metadados: { tipo: 'processual', contagem: 'dias úteis', fundamento_literal: 'CPC art. 135' },
    tags: ['processual-civil/intervencao-terceiros', 'geral/prazos'],
    fonte: PLANALTO,
    urlFonte: URL_CPC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'triagem-intervencoes-terceiros',
    titulo: 'Triagem — Qual intervenção de terceiro se aplica ao caso?',
    tipoDocumento: 'TRIAGEM',
    area: 'processual-civil',
    subarea: 'intervencao-terceiros',
    assunto: 'Diagnóstico por perguntas',
    prioridade: 'P1',
    lote: 'LOTE-016',
    conteudo: `# ROTEIRO DE TRIAGEM — INTERVENÇÕES (CPC 119-138)
1. **Quem é você no processo?** (parte que intervém / terceiro / sócio citado)
2. **A intervenção é espontânea ou provocada?**
   - Espontânea → 3. | Provocada → 5.
3. **A sentença vai influir na SUA relação jurídica com o adversário do assistido?**
   - Sim → assistência LITISCONSORCIAL (art. 124).
   - Não → assistência SIMPLES (arts. 121-122) — lembre: assistido pode transigir/desistir (art. 122); coisa julgada vinculante salvo portas do art. 123.
4. **Assistido revel/omisso?** → assistente vira substituto processual (art. 121 p.ú.). FIM.
5. **Você é réu e há regresso previsto por lei/contrato ou caso de evicção?**
   - Sim → DENUNCIAÇÃO DA LIDE (art. 125): na contestação; citação 30 dias/2 meses (art. 131); UMA sucessiva (§ 2º); se vencer na principal, regresso NÃO examinado + sucumbência (art. 129 p.ú.).
6. **Réu em cobrança: fiador ou devedor solidário com coobrigados?**
   - Sim → CHAMAMENTO AO PROCESSO (art. 130): na contestação; citação 30 dias/2 meses; título para regresso (art. 132).
7. **Há pressupostos legais de desconsideração da personalidade jurídica (demonstráveis) e bens em risco de alienação?**
   - Sim → IDPJ (arts. 133-137): demonstrar pressupostos (§ 4º do 134), comunicar distribuidor (§ 1º), suspensão do principal (§ 3º), citação 15 dias (art. 135).
8. **Entidade quer influir em matéria de alta relevância/repercussão?**
   - Sim → AMICUS CURIAE (art. 138): representatividade adequada; poderes definidos pelo juiz; sem recursos salvo ED e IRDR.
9. **Documentos:** contrato/lei do regresso, prova do interesse jurídico, endereço do interveniente, pressupostos documentados.
10. **Confidencialidade:** dados de clientes permanecem na BASE PRIVADA DO CASO.`,
    tags: ['processual-civil/intervencao-terceiros', 'geral/triagem'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'regra-se-diagnostico-intervencao', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Versão SE-ENTÃO da triagem.' },
    ],
  },
  {
    slug: 'argumentacao-assistencia-simples-vs-litisconsorcial',
    titulo: 'Argumentação bilateral — Assistência simples × litisconsorcial e denunciação na prática',
    tipoDocumento: 'ARGUMENTACAO',
    area: 'processual-civil',
    subarea: 'intervencao-terceiros',
    assunto: 'Controvérsias recorrentes',
    prioridade: 'P1',
    lote: 'LOTE-016',
    conteudo: `# CONTROVÉRSIA 1 — Assistência simples × litisconsorcial
- **Tese ampla (litisconsorcial):** a sentença influirá na relação jurídica entre assistente e adversário (art. 124) — ex.: garantidor que responderá depois → poderes de litisconsorte, atos autônomos.
- **Tese restritiva (simples):** falta o nexo direto; o art. 124 exige influência real na relação jurídica — como auxiliar, sofre os atos do assistido (art. 122).
- **Provas relevantes:** contrato de garantia, regresso previsto, contexto da relação.
- **Estratégia:** qualificar o interesse JURÍDICO desde o requerimento (art. 119) para alcançar a litisconsorcial.

# CONTROVÉRSIA 2 — Denunciação: direito do assistente à desvinculação (art. 123)
- **Vinculação:** coisa julgada alcança o assistente.
- **Desvinculação:** provar (I) impedimento de produzir provas pelo estado do processo/atos do assistido ou (II) desconhecimento de alegações/provas omitidas por dolo/culpa do assistido — ônus naquele que alega.

# CONTROVÉRSIA 3 — Denunciação vencedora e sucumbência (art. 129 p.ú.)
- **Contra denunciar:** denunciante que vencer paga sucumbência ao denunciado sem exame do regresso — risco econômico.
- **A favor:** assegura tema probatório e relação processual desde logo; alternativa: ação autônoma depois (art. 125 § 1º).

# CONTROVÉRSIA 4 — IDPJ: suspensão do principal (art. 134 § 3º)
- **Pelo suspendimento:** incidente é fase autônoma com citação e provas (art. 135) — principal não pode avançar contra quem está em discussão.
- **Contra:** executado pode usar o incidente para procrastinar; mitigação: rigor na exigência do § 4º (pressupostos demonstrados) e prosseguimento contra os não afetados.`,
    tags: ['processual-civil/intervencao-terceiros'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'doutrina-intervencao-terceiros-tipos',
    titulo: 'Doutrina EJC — Panorama das intervenções de terceiros no CPC/2015',
    tipoDocumento: 'DOUTRINA',
    area: 'processual-civil',
    subarea: 'intervencao-terceiros',
    assunto: 'Conceito e classificação',
    prioridade: 'P1',
    lote: 'LOTE-016',
    conteudo: `# CONCEITO (elaboração própria EJC — sem cópia extensa de obras protegidas)
**Intervenção de terceiros** é a participação de quem NÃO é parte original no processo pendente, formando novo estado de litispendência entre sujeitos adicionais e as partes, por hipóteses legais taxativas.

## Estrutura do Título III (CPC arts. 119-138)
1. **Assistência** (espontânea): simples — auxiliar da parte (arts. 121-123); litisconsorcial — quando a sentença influir na relação jurídica do terceiro (art. 124).
2. **Denunciação da lide** (provocada): evicção ou regresso por lei/contrato (art. 125); cadeia: UMA sucessiva (§ 2º).
3. **Chamamento ao processo** (provocado): fiador↔afiançado, co-fiadores, devedores solidários (art. 130) — sentença como título de regresso (art. 132).
4. **IDPJ** (arts. 133-137): incidente autônomo em todas as fases; inversa (§ 2º do 133); fraude de execução ineficaz (art. 137).
5. **Amicus curiae** (art. 138): com representatividade; poderes definidos; sem recursos salvo ED/IRDR.

## Finalidade
- Economia processual (regressos no mesmo processo), blindagem do terceiro juridicamente interessado e proteção do patrimônio (art. 137).

## Controvérsias doutrinárias clássicas
- Natureza da assistência litisconsorcial (transforma ou não o terceiro em parte plena).
- Extensão da coisa julgada ao assistente simples e as portas do art. 123.
- Conciliação do IDPJ com o princípio da concentração da fase executiva.`,
    tags: ['processual-civil/intervencao-terceiros'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'regra-se-diagnostico-intervencao',
    titulo: 'Regra SE-ENTÃO — Diagnóstico da intervenção adequada (CPC 119-138)',
    tipoDocumento: 'REGRA_INTELIGENCIA',
    area: 'processual-civil',
    subarea: 'intervencao-terceiros',
    assunto: 'Inteligência processual',
    prioridade: 'P1',
    lote: 'LOTE-016',
    conteudo: `# REGRA DE INTELIGÊNCIA — EJC (fundada em textos literais arts. 119-138, consulta 2026-08-30)

SE terceiro quer intervir espontaneamente ENTÃO:
- SE sentença influir na sua relação jurídica com o adversário do assistido → ASSISTÊNCIA LITISCONSORCIAL (art. 124);
- SENÃO → ASSISTÊNCIA SIMPLES (art. 121) + registrar: assistido pode transigir/desistir (art. 122); assistido revel → substituto processual (art. 121 p.ú.);
- SE partes impugnarem → incidente em 15 dias SEM suspensão (art. 120).

SE réu tem regresso (evicção OU obrigação por lei/contrato) ENTÃO DENUNCIAÇÃO DA LIDE:
- na contestação; citação 30 dias/2 meses (art. 131); UMA sucessiva (art. 125 § 2º);
- SE denunciante vencer na principal ENTÃO regresso não examinado + sucumbência ao denunciado (art. 129 p.ú.);
- SE denunciação indeferida/não promovida ENTÃO ação autônoma (art. 125 § 1º).

SE réu é fiador ou devedor solidário com coobrigados ENTÃO CHAMAMENTO (art. 130) — na contestação, citação 30 dias/2 meses, título do regresso (art. 132).

SE pressupostos legais de desconsideração DEMONSTRÁVEIS ENTÃO IDPJ (arts. 133-137) — demonstrar (§ 4º do 134), comunicar distribuidor, 15 dias do sócio/PJ, suspensão (§ 3º), decisão interlocutória → agravo (1.015 II / interno se relator), fraude de execução ineficaz (art. 137).

SE entidade especializada quer atuar ENTÃO AMICUS (art. 138) — representatividade, poderes definidos, sem recursos salvo ED/IRDR.`,
    tags: ['processual-civil/intervencao-terceiros'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'triagem-intervencoes-terceiros', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Triagem humana equivalente.' },
    ],
  },
  {
    slug: 'jurimetria-vazia-intervencao-terceiros',
    titulo: 'Jurimetria — Intervenção de terceiros (estrutura vazia — sem dados reais)',
    tipoDocumento: 'JURIMETRIA',
    area: 'processual-civil',
    subarea: 'intervencao-terceiros',
    assunto: 'Estrutura para dados futuros',
    prioridade: 'P3',
    lote: 'LOTE-016',
    conteudo: `# JURIMETRIA — INTERVENÇÃO DE TERCEIROS
**Status: SEM DADOS.** Nenhuma estatística real disponível nesta consulta (2026-08-30) — o EJC NÃO inventa percentuais (item 18 da missão).

## Campos preparados para preenchimento com dados REAIS
- tribunal; órgão julgador; classe; período; amostra; metodologia; fonte;
- indicadores: taxa de admissão da assistência; taxa de procedência da denunciação na regressiva; concessão do IDPJ; frequência de amicus.

## Separação obrigatória
- DADO ESTATÍSTICO REAL (com fonte e metodologia) × ANÁLISE QUALITATIVA (documentada, sem número inventado).`,
    tags: ['processual-civil/intervencao-terceiros', 'geral/metodologia'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
];
