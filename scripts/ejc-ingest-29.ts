// EJC — Ingestão SOMENTE do lote 028 (pipeline idempotente — não re-ingere lotes anteriores)
// Uso: bun scripts/ejc-ingest-29.ts
// 43-48, 53-55, 71-74, 83-90; Decreto 11.034/2022 SAC arts. 1º-10 + derivados EJC.
// Regra absoluta: textos LITERAIS do Planalto (consulta 2026-08-30); "(VETADO)" como consta;
// NADA estadual MG citado como verbatim (portais MG bloqueados).
import { ingestLote } from '../src/lib/ejc/ingest';
import lote28 from '../data/ejc/lote-029-jec-ii';

const FONTES_LOTE28 = [
  'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm (CF/1988 — art. 5º XXXII e art. 170 V LITERAIS — consulta 2026-08-30)',
  'https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm (CDC — arts. 7, 30-41, 43-48, 53-55, 71-74, 83-90 LITERAIS do texto compilado; redações empilhadas e "(VETADO)" registrados como consta — consulta 2026-08-30)',
  'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/decreto/d11034.htm (Decreto 11.034/2022 — arts. 1º-10 LITERAIS — consulta 2026-08-30)',
];

async function main() {
  const rel28 = await ingestLote(
    'LOTE-029',
    'P1 — Juizados Especiais II (compêndio, foco MG): CF art. 98 I (fundamento constitucional LITERAL); Lei 9.099/1995 arts. 9º-11 (assistência/orientação LITERAL), 18-20 (citação por correspondência/dispensa de prova até 20 SM LITERAL), 24-26 (estimação/provas LITERAL), 44-51 (sentença/deveres/custas LITERAL), 56-59 (disposições gerais LITERAL), 77-88 (colagem/transição LITERAL), 90-93 (disposições finais LITERAL) — complementos dos lotes 010-012; Lei 12.153/2009 arts. 17-19 (LITERAL) — TODOS do Planalto (consulta 2026-08-30). Derivados EJC: 3 doutrinas (3 regimes JEC/turmas recursais MG REVISAO_HUMANA/CEJUSC MG REVISAO_HUMANA), 1 checklist admissibilidade consolidada 15 pontos, 2 peças com variáveis (contestação JEC/execução de sentença), 1 fluxo recurso inominado→Turma, 1 prazo literal consolidado (10 dias/48h), 1 regra SE-ENTÃO (9 rotas), 1 jurimetria cruzada vazia. ANTI-INVENÇÃO MG: turmas/CEJUSC/sistemas TJMG são REVISAO_HUMANA/C com [VERIFICAR TJMG].',
    lote28.map((d) => ({ ...d, lote: 'LOTE-029' })),
    FONTES_LOTE28,
  );
  console.log('=== RELATÓRIO LOTE-029 ===');
  console.log(JSON.stringify(rel28, null, 2));
  console.log('=== RESUMO ===');
  console.log(`LOTE-029: pesquisados=${rel28.pesquisado} criados=${rel28.criados} atualizados=${rel28.atualizados} rejeitados=${rel28.rejeitados} duplicatasEvitadas=${rel28.duplicatasEvitadas} necessitaRevisao=${rel28.necessitaRevisao.length}`);
  for (const a of rel28.avisos) console.log(`  AVISO: ${a}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('ERRO NA INGESTÃO:', e);
    process.exit(1);
  });
