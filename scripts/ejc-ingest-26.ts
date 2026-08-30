// EJC — Ingestão SOMENTE do lote 026 (pipeline idempotente — não re-ingere lotes anteriores)
// Uso: bun scripts/ejc-ingest-26.ts
// LOTE-026: Tributário II (compêndio, foco MG) — CF arts. 145-156/195, CTN arts. 1º-11 e 96-112,
// LC 116/2003 (ISS arts. 1º-9º), LC 123/2006 (arts. 13 e 17), Lei 9.430/1996 art. 74 (compensação),
// Lei 13.988/2020 (transação arts. 1º-5º) + derivados EJC.
// Regra absoluta: textos LITERAIS do Planalto (consulta 2026-08-30); NADA estadual MG citado como
// verbatim (portais MG bloqueados); [VERIFICAR LEI ESTADUAL MG] nos pontos dependentes de lei MG.
import { ingestLote } from '../src/lib/ejc/ingest';
import lote26 from '../data/ejc/lote-026-tributario-ii';

const FONTES_LOTE26 = [
  'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm (CF/1988 — arts. 145, 150, 151, 152, 155, 156, 195 LITERAIS do texto compilado; redações empilhadas com notas "(Redação dada pela ...)" registradas como consta — consulta 2026-08-30)',
  'https://www.planalto.gov.br/ccivil_03/leis/l5172compilado.htm (CTN — arts. 1º-11 e 96-112 LITERAIS; arts. 113-131 já ingeridos no LOTE-023, não repetidos — consulta 2026-08-30)',
  'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp116.htm (LC 116/2003 — arts. 1º-9º LITERAIS; lista anexa de serviços NÃO capturada nesta consulta, remissões registradas como consta — consulta 2026-08-30)',
  'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm (LC 123/2006 — arts. 13 e 17 LITERAIS; demais arts. registrados como pendência — consulta 2026-08-30)',
  'https://www.planalto.gov.br/ccivil_03/leis/L9430.htm (Lei 9.430/1996 — art. 74 compensação LITERAL do texto compilado com redações históricas empilhadas registradas como consta — consulta 2026-08-30)',
  'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2020/lei/l13988.htm (Lei 13.988/2020 — arts. 1º-5º LITERAIS; arts. 6º-22 pendentes — consulta 2026-08-30)',
];

async function main() {
  const rel26 = await ingestLote(
    'LOTE-026',
    'P1 — Tributário II (compêndio, foco MG): CF arts. 145-152 (espécies/vedações LITERAIS), art. 155 (ICMS LITERAL), art. 156 (ISS LITERAL), art. 195 (seguridade LITERAL); CTN arts. 1º-11 (competência LITERAL) e 96-112 (legislação tributária LITERAL); LC 116/2003 arts. 1º-9º (ISS LITERAL); LC 123/2006 arts. 13/17 (Simples LITERAL); Lei 9.430 art. 74 (compensação LITERAL compilado); Lei 13.988 arts. 1º-5º (transação LITERAL) — TODOS do Planalto (consulta 2026-08-30). Derivados EJC: 2 doutrinas constitucionais (anterioridade/imunidades), 2 doutrinas práticas (guerra fiscal/Simples), 1 tese ICMS×ISS, 2 peças com variáveis (glosa de compensação/transação individual), 1 checklist MG REVISAO_HUMANA (benefício fiscal estadual), 2 fluxos, 1 triagem, 1 regra SE-ENTÃO (8 rotas), 1 prazo literal (30/360 dias art. 74). ANTI-INVENÇÃO MG: NENHUM número/valor estadual citado como verbatim; [VERIFICAR LEI ESTADUAL MG] em todos os pontos dependentes; checklist-benefício-fiscal-mg é REVISAO_HUMANA/confiabilidade C com URLs ALMG para verificação futura. Pendências registradas: lista anexa LC 116 não capturada; LC 214/2025 não capturada; arts. complementares das leis registrados como pendência.',
    lote26.map((d) => ({ ...d, lote: 'LOTE-026' })),
    FONTES_LOTE26,
  );
  console.log('=== RELATÓRIO LOTE-026 ===');
  console.log(JSON.stringify(rel26, null, 2));
  console.log('=== RESUMO ===');
  console.log(`LOTE-026: pesquisados=${rel26.pesquisado} criados=${rel26.criados} atualizados=${rel26.atualizados} rejeitados=${rel26.rejeitados} duplicatasEvitadas=${rel26.duplicatasEvitadas} necessitaRevisao=${rel26.necessitaRevisao.length}`);
  for (const a of rel26.avisos) console.log(`  AVISO: ${a}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('ERRO NA INGESTÃO:', e);
    process.exit(1);
  });
