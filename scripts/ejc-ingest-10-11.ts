// EJC — Ingestão SOMENTE dos lotes 010 e 011 (não re-ingere lotes anteriores, preserva versões)
// Uso: bun scripts/ejc-ingest-10-11.ts
import { ingestLote } from '../src/lib/ejc/ingest';
import lote10 from '../data/ejc/lote-010-trabalho';
import lote11 from '../data/ejc/lote-011-agravo';

const FONTES_LOTE10 = [
  'https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm (CLT — textos literais arts. 11, 467, 477, 775, 775-A, 790, 790-A, 790-B, 791-A, 840, 841, 844, 845, 848, 850, 852-A a 852-I, 895, 899, 900 — consulta 2026-08-30; anotações oficiais de ADI 5766 visíveis no próprio texto compilado)',
  'https://www.trt6.jus.br/portal/jurisprudencia/temas-e-precedentes/23274 (ADI 5766/STF — tese e ementa LITERAIS: inconstitucionais arts. 790-B caput/§ 4º e 791-A § 4º; constitucional art. 844 § 2º; Plenário 20.10.2021, DJe 03/05/2022, trânsito 04/08/2022)',
  'https://www.trt6.jus.br/portal/jurisprudencia/temas-e-precedentes/20228 (ADC 58/59 STF — decisão LITERAL: IPCA-E fase pré-judicial + SELIC a partir da citação para créditos trabalhistas e depósitos recursais, com modulação)',
];

const FONTES_LOTE11 = [
  'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm (CPC — textos literais arts. 1.015, 1.016, 1.017, 1.018 e 1.019 — consulta 2026-08-30)',
  'https://www.tjdft.jus.br/consultas/jurisprudencia/jurisprudencia-em-temas/novo-codigo-de-processo-civil/decisoes-agravaveis-2013-questao-do-rol-taxativo (TJDFT Precedentes Qualificados — tese LITERAL do Tema 988/STJ e do Tema 1022/STJ + Acórdão 2045271, 0723273-24.2025.8.07.0000, 5ª Turma Cível, julg. 18/09/2025, DJe 17/10/2025 com trecho de ementa literal; página modificada em 04/05/2026)',
];

async function main() {
  const rel10 = await ingestLote(
    'LOTE-010',
    'P1 — Processo do Trabalho (reclamatória e recursos): CLT arts. 840-841, 844 (§§ 1º-5º), 845/848/850, 852-A a 852-I (sumaríssimo), 895 (RO 8 dias + procedimento sumaríssimo), 899 §§ 1º-11 (depósito recursal), 790 §§ 3º-4º + 790-A + 790-B e 791-A (gratuidade/custas/honorários COM anotações oficiais da ADI 5766), 477 (verbas rescisórias e multas, com nota do § 8º pós-MP 905/955), 467 (50% parte incontroversa), 775/775-A (dias úteis e suspensão fim de ano) e art. 11 (prescrição) LITERAIS do Planalto; ADI 5766 (tese+ementa literais via TRT6 oficial) e ADC 58/59 (IPCA-E+SELIC via TRT6 oficial); teses de gratuidade/sucumbência e rito sumaríssimo; peça-modelo de reclamatória; checklist de dossiê; fluxo; prazos operacionais; tabela de documentos; triagem; argumentação bilateral; doutrina; 2 regras SE-ENTÃO',
    lote10.map((d) => ({ ...d, lote: 'LOTE-010' })),
    FONTES_LOTE10,
  );
  console.log('=== RELATÓRIO LOTE-010 ===');
  console.log(JSON.stringify(rel10, null, 2));

  const rel11 = await ingestLote(
    'LOTE-011',
    'P1 — Agravo de instrumento: CPC arts. 1.015 (rol I-XIII + parágrafo único — SEM §§, texto vigente confirmado no Planalto), 1.016-1.017 (requisitos/instrução com dispensa eletrônica) e 1.018-1.019 (juntada na origem 3 dias, retratação, poderes do relator em 5 dias) LITERAIS; teses LITERAIS dos Temas 988 (taxatividade mitigada) e 1022 (RJ/falência) do STJ + Acórdão TJDFT 2045271 (5ª TC 2025) via página oficial TJDFT Precedentes Qualificados; tese de agravabilidade fora do rol; prazos do agravo (15 dias úteis) e da juntada (3 dias); checklist de admissibilidade 12 pontos; fluxo; tabela de peças; triagem; argumentação bilateral; doutrina; regra SE-ENTÃO',
    lote11.map((d) => ({ ...d, lote: 'LOTE-011' })),
    FONTES_LOTE11,
  );
  console.log('=== RELATÓRIO LOTE-011 ===');
  console.log(JSON.stringify(rel11, null, 2));
}

main()
  .catch((e) => {
    console.error('ERRO INGEST', e);
    process.exit(1);
  })
  .finally(async () => {
    const { db } = await import('../src/lib/db');
    await db.$disconnect();
  });
