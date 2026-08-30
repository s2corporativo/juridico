// EJC — Ingestão SOMENTE do lote 028 (pipeline idempotente — não re-ingere lotes anteriores)
// Uso: bun scripts/ejc-ingest-28.ts
// LOTE-028: Consumidor II (compêndio, foco MG) — CF art. 5º XXXII + art. 170 V; CDC arts. 30-41,
// 43-48, 53-55, 71-74, 83-90; Decreto 11.034/2022 SAC arts. 1º-10 + derivados EJC.
// Regra absoluta: textos LITERAIS do Planalto (consulta 2026-08-30); "(VETADO)" como consta;
// NADA estadual MG citado como verbatim (portais MG bloqueados).
import { ingestLote } from '../src/lib/ejc/ingest';
import lote28 from '../data/ejc/lote-028-consumidor-ii';

const FONTES_LOTE28 = [
  'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm (CF/1988 — art. 5º XXXII e art. 170 V LITERAIS — consulta 2026-08-30)',
  'https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm (CDC — arts. 7, 30-41, 43-48, 53-55, 71-74, 83-90 LITERAIS do texto compilado; redações empilhadas e "(VETADO)" registrados como consta — consulta 2026-08-30)',
  'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/decreto/d11034.htm (Decreto 11.034/2022 — arts. 1º-10 LITERAIS — consulta 2026-08-30)',
];

async function main() {
  const rel28 = await ingestLote(
    'LOTE-028',
    'P1 — Consumidor II (compêndio, foco MG): CF art. 5º XXXII + art. 170 V (fundamento constitucional LITERAL); CDC arts. 30-35 (oferta/vinculação LITERAL), 36-38 (publicidade enganosa/abusiva + inversão art. 38 LITERAL), 39-41 (práticas abusivas LITERAL), 43-44 (cadastro/retificação 5 dias LITERAL), 46-48 (informação prévia/contratos LITERAL), 53-55 (crédito LITERAL), 71-74 (crimes de cobrança LITERAL), 83-85 (defesa em juízo/tutela específica LITERAL), 86-90 (procedimentos LITERAL); Decreto 11.034/2022 arts. 1º-10 (SAC LITERAL) — TODOS do Planalto (consulta 2026-08-30). Derivados EJC: 2 doutrinas (publicidade enganosa×abusiva/cobrança indevida), 1 doutrina extrajudicial MG REVISAO_HUMANA, 1 tese publicidade, 2 peças com variáveis (inicial publicidade enganosa/notificação SAC), 1 checklist bancário 15 pontos, 1 fluxo SAC→PROCON→JEC, 1 prazo literal (5 dias cadastro), 1 regra SE-ENTÃO (10 rotas), 1 jurimetria vazia. ANTI-INVENÇÃO MG: [VERIFICAR] em pontos estaduais.',
    lote28.map((d) => ({ ...d, lote: 'LOTE-028' })),
    FONTES_LOTE28,
  );
  console.log('=== RELATÓRIO LOTE-028 ===');
  console.log(JSON.stringify(rel28, null, 2));
  console.log('=== RESUMO ===');
  console.log(`LOTE-028: pesquisados=${rel28.pesquisado} criados=${rel28.criados} atualizados=${rel28.atualizados} rejeitados=${rel28.rejeitados} duplicatasEvitadas=${rel28.duplicatasEvitadas} necessitaRevisao=${rel28.necessitaRevisao.length}`);
  for (const a of rel28.avisos) console.log(`  AVISO: ${a}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('ERRO NA INGESTÃO:', e);
    process.exit(1);
  });
