// EJC — Ingestão SOMENTE dos lotes 016, 017 e 018 (não re-ingere lotes anteriores, preserva versões)
// Uso: bun scripts/ejc-ingest-16-18.ts
import { ingestLote } from '../src/lib/ejc/ingest';
import lote16 from '../data/ejc/lote-016-intervencao-terceiros';
import lote17 from '../data/ejc/lote-017-cumprimento-sentenca';
import lote18 from '../data/ejc/lote-018-prescricao-decadencia';

const FONTES_LOTE16 = [
  'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm (CPC/2015 — textos literais arts. 119-138: assistência, denunciação, chamamento, IDPJ, amicus curiae — consulta 2026-08-30)',
];

const FONTES_LOTE17 = [
  'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm (CPC/2015 — textos literais arts. 523-530: cumprimento de quantia certa e de alimentos — consulta 2026-08-30)',
  'https://www8.tjmg.jus.br/enciclopedia-nugep/DasDespesasdosHonorariosAdvocati.html (Súmula 453/STJ — enunciado verbatim em enciclopédia oficial de tribunal; portal STJ bloqueado por Cloudflare na consulta — registro B honesto)',
];

const FONTES_LOTE18 = [
  'https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm (Código Civil — textos literais arts. 189-210, com marcadores oficiais de revogação: art. 194 (Lei 11.280/2006) e art. 206 § 1º II (Lei 15.040/2024); art. 206-A red. Lei 14.382/2022 — consulta 2026-08-30)',
  'https://www.coad.com.br/busca/detalhe_16/459/Sumulas_e_enunciados (Súmula 150/STF — enunciado verbatim + Sessão Plenária 13/12/1963; portal STF bloqueado por 403 na consulta — registro B honesto)',
];

async function main() {
  const rel16 = await ingestLote(
    'LOTE-016',
    'P1 — Intervenção de terceiros (CPC arts. 119-138): assistência simples/litisconsorcial, denunciação da lide (cadeia única sucessiva), chamamento ao processo, incidente de desconsideração da personalidade jurídica (inclui inversa e fraude de execução) e amicus curiae — TODOS LITERAIS do Planalto; tese do IDPJ; peça-modelo de contestação com intervenção provocada; checklist de admissibilidade 12 pontos; fluxo do IDPJ; 3 prazos (15 dias impugnação assistência, 30 dias/2 meses citação denunciado-chamado, 15 dias IDPJ); triagem; argumentação bilateral 4 controvérsias; doutrina dos tipos; regra SE-ENTÃO de diagnóstico; jurimetria vazia',
    lote16.map((d) => ({ ...d, lote: 'LOTE-016' })),
    FONTES_LOTE16,
  );
  console.log('=== RELATÓRIO LOTE-016 ===');
  console.log(JSON.stringify(rel16, null, 2));

  const rel17 = await ingestLote(
    'LOTE-017',
    'P1 — Cumprimento de sentença (CPC arts. 523-530): quantia certa (15 dias, multa/honorários 10%, parcial sobre o restante, penhora desde logo), demonstrativo 7 itens, impugnação (rol taxativo, excesso com demonstrativo, suspensão com garantia, inexigibilidade por inconstitucionalidade STF §§ 12-15), pagamento anterior (art. 526), provisório (527), alimentos (3 dias, impossibilidade absoluta, prisão 1-3 meses, 3 prestações) e desconto em folha — TODOS LITERAIS do Planalto; tese da multa proporcional; peças de requerimento e de impugnação; checklist duplo; fluxo completo; prazos 15/15/3 dias; Súmula 453/STJ (B honesto via enciclopédia TJMG); argumentação bilateral; doutrina das multas executivas; triagem; regra SE-ENTÃO de rotas; jurimetria vazia; ANTI-INVENÇÃO: Tema 810/STF constatado tratar de art. 1º-F Lei 9.494 (NÃO da multa do 523) — retroatividade da multa NÃO afirmada',
    lote17.map((d) => ({ ...d, lote: 'LOTE-017' })),
    FONTES_LOTE17,
  );
  console.log('=== RELATÓRIO LOTE-017 ===');
  console.log(JSON.stringify(rel17, null, 2));

  const rel18 = await ingestLote(
    'LOTE-018',
    'P1 — Prescrição e decadência civis (CC arts. 189-210, base transversal): pretensão (189), exceção e sucessor, renúncia/alegação (191-195), impedimento/suspensão (197-203), interrupção com 6 hipóteses e recomeço integral (202+204), prazo geral 10 anos (205), prazos especiais 1/2/3/4/5 anos (206), prescrição intercorrente (206-A, red. Lei 14.382/2022) e regime da decadência (207-210) — TODOS LITERAIS do Planalto; HONESTIDADE: art. 194 revogado (Lei 11.280/2006) e art. 206 § 1º II revogado (Lei 15.040/2024) registrados como constam no texto oficial; tabela operacional de prazos com termos iniciais; Súmula 150/STF (B honesto — enunciado verbatim em fontes institucionais, portal STF bloqueado); checklist de 10 passos; regra SE-ENTÃO; doutrina prescrição×decadência; triagem; argumentação bilateral; jurimetria vazia',
    lote18.map((d) => ({ ...d, lote: 'LOTE-018' })),
    FONTES_LOTE18,
  );
  console.log('=== RELATÓRIO LOTE-018 ===');
  console.log(JSON.stringify(rel18, null, 2));
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
