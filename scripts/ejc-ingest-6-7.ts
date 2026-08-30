// EJC — Ingestão SOMENTE dos lotes 006 e 007 (não re-ingere lotes anteriores, preserva versões)
// Uso: bun scripts/ejc-ingest-6-7.ts
import { ingestLote } from '../src/lib/ejc/ingest';
import lote6 from '../data/ejc/lote-006-bancario-cdc';
import lote7 from '../data/ejc/lote-007-recursos-cpc';

const FONTES_LOTE6 = [
  'https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm (CDC — textos literais arts. 42, 42-A, 51 e 52 — consulta 2026-08-30)',
  'https://scon.stj.jus.br/SCON/sumstj/doc.jsp?livre=%22297%22+INPATH%28NUM%29&b=SUMU (Súmula 297 STJ — julgado 12/5/2004, DJ 8/9/2004)',
  'https://arquivocidadao.stj.jus.br/index.php/sumula-381 (Súmula 381 — aprovada 22/04/2009, DJE 05/05/2009)',
  'https://arquivocidadao.stj.jus.br/index.php/sumula-380 (Súmula 380)',
  'https://arquivocidadao.stj.jus.br/index.php/sumula-472 (Súmula 472 — 13/06/2012)',
  'https://arquivocidadao.stj.jus.br/index.php/sumula-479-2 (Súmula 479)',
  'https://arquivocidadao.stj.jus.br/index.php/sumula-539 (Súmula 539 — dossiê 10/06/2015)',
  'https://arquivocidadao.stj.jus.br/index.php/sumula-30 (Súmula 30 — texto literal registrado em nota)',
  'https://www.tjdft.jus.br/consultas/jurisprudencia/jurisprudencia-em-temas/precedentes-qualificados-na-visao-do-tjdft/direito-civil/contrato-bancario (Temas 27, 29, 620, 1061 — teses literais + Súmula 566 citada em acórdão oficial)',
  'https://esaj.tjsp.jus.br/cjsg/getArquivo.do?cdAcordao=19080304&cdForo=0 (TJSP — REsp 1.061.530/RS citado como Tema Repetitivo 24)',
];

const FONTES_LOTE7 = [
  'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm (CPC/2015 — textos literais arts. 994-995, 1.003 (§ 6º red. Lei 14.939/2024), 1.007, 1.009, 1.010, 1.013, 1.021, 1.022-1.026 e 1.029 — consulta 2026-08-30)',
];

async function main() {
  const rel6 = await ingestLote(
    'LOTE-006',
    'P1 — Contratos Bancários/CDC: arts. 42, 42-A, 51 e 52 literais do Planalto; Súmulas 297, 380, 381, 472, 479 e 539/STJ com textos literais do arquivo oficial STJ; teses literais dos Temas 24, 27, 29, 620 e 1061/STJ via TJDFT oficial (+ Súmula 566 citada em acórdão); tese de indébito em dobro, peça-modelo revisional, checklist, fluxo, triagem, argumentação bilateral, doutrina, 2 regras de inteligência e regras contratuais; prescrição revisional (confiabilidade B, precedente específico pendente)',
    lote6.map((d) => ({ ...d, lote: 'LOTE-006' })),
    FONTES_LOTE6,
  );
  console.log('=== RELATÓRIO LOTE-006 ===');
  console.log(JSON.stringify(rel6, null, 2));

  const rel7 = await ingestLote(
    'LOTE-007',
    'P1 — Sistema Recursal CPC/2015: arts. 994-995, 1.003 (§ 6º red. Lei 14.939/2024), 1.007, 1.009, 1.010, 1.013, 1.021, 1.022-1.026 e 1.029 literais do Planalto; prazos de embargos/contrarrazões/REsp-RE; fluxo da apelação; peça-modelo; checklist de admissibilidade; tese do art. 1.009 § 1º; triagem recursal; argumentação embargos vs agravo; doutrina dos princípios; regra de mapeamento decisão→recurso',
    lote7.map((d) => ({ ...d, lote: 'LOTE-007' })),
    FONTES_LOTE7,
  );
  console.log('=== RELATÓRIO LOTE-007 ===');
  console.log(JSON.stringify(rel7, null, 2));
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
