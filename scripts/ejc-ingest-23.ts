// EJC — Ingestão SOMENTE do lote 023 (não re-ingere lotes anteriores, preserva versões — pipeline idempotente)
// Uso: bun scripts/ejc-ingest-23.ts
// LOTE-023: Tributário com foco MG (base federal verificável) — LC 87/1996 (Lei Kandir),
// LC 24/1975 (convênios/CONFAZ) e CTN arts. 113-131.
// Regra absoluta do lote: textos LITERAIS do Planalto (consulta 2026-08-30); NADA estadual
// citado como verbatim (portais MG bloqueados — almg.gov.br, mg.gov.br, iof.mg.gov.br,
// sefaz.mg.gov.br, tjmg.jus.br); pontos dependentes de lei estadual marcados
// [VERIFICAR LEI ESTADUAL MG]; ponte-mg-legislacao-tributaria-estadual é REVISAO_HUMANA/confiabilidade C.
import { ingestLote } from '../src/lib/ejc/ingest';
import lote23 from '../data/ejc/lote-023-tributario-mg';

const FONTES_LOTE23 = [
  'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp87.htm (LC 87/1996 — Lei Kandir: arts. 2º, 8º, 11, 12, 13, 20, 20-A, 21, 23, 24, 24-A e 25 LITERAIS, com redações LC 114/2002, LC 102/2000, LC 120/2005, LC 190/2022 e LC 204/2023 registradas como constam; § 4º do art. 13 revogado como consta — consulta 2026-08-30)',
  'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp24.htm (LC 24/1975 — convênios/CONFAZ: arts. 1º-3º LITERAIS com remissão "(Vide Lei Complementar nº 214, de 2025)" registrada como consta, não capturada — consulta 2026-08-30)',
  'https://www.planalto.gov.br/ccivil_03/leis/l5172compilado.htm (CTN — Decreto-Lei 5.172/1966 compilado: arts. 113-131 LITERAIS — obrigação tributária, fato gerador, sujeição passiva, solidariedade, capacidade, domicílio e responsabilidade; arts. 132-135 pendentes de captura; URL clássica .../decreto-lei/del5172.htm retornou 404 nesta consulta, arquivo compilado capturado no mesmo domínio — consulta 2026-08-30)',
];

async function main() {
  const rel23 = await ingestLote(
    'LOTE-023',
    'P1 — Tributário com foco MG, base federal verificável (LC 87/1996 Lei Kandir, LC 24/1975 CONFAZ, CTN arts. 113-131): art. 2º (incidência/importação), arts. 8º/11/12 (base da ST com MVA e critérios em lei § 4º, local, momento incl. LC 190/2022 consumidor final e LC 204/2023 transferências), art. 13 (base de cálculo, frete do remetente, IPI, § 4º REVOGADO como consta, LC 227/2026 Imposto Seletivo 2027), arts. 20-21 (créditos, 1/48 ativo permanente, estornos, crédito guardado § 3º), arts. 23-25 (idoneidade, extinção do crédito em 5 anos, apuração por estabelecimento, portais estaduais 24-A), LC 24 arts. 1º-3º (unanimidade/4-5/publicação DOU 10 dias) e CTN 113-131 (obrigação principal/acessória, fato gerador, contribuinte × responsável, solidariedade sem benefício de ordem, responsabilidade por lei expressa) — TODOS LITERAIS do Planalto. ANTI-INVENÇÃO MG: portais estaduais bloqueados (almg/mg.gov.br/iof.mg.gov.br/sefaz.mg/tjmg) — NENHUM número de lei/artigo estadual citado como verbatim; marcadores [VERIFICAR LEI ESTADUAL MG] na peça/checklist/fluxo/triagem/regra; ponte-mg-legislacao-tributaria-estadual (CHECKLIST, REVISAO_HUMANA, confiabilidade C) lista URLs oficiais de verificação futura. Tese ST × interestadual × interna fundamentada só nos textos capturados (arts. 6º-7º e 19 da LC 87 e CTN 132-135 registrados como pendências). Duplicatas evitadas por verificação prévia: CTN 150 § 4º/173/174 (LOTE-004) NÃO re-ingeridos. Tese, peça de impugnação de AI com variáveis, checklist 15 pontos, fluxo 7 etapas, 2 prazos literais (5 anos crédito LC 87 art. 23 § único; 10 dias DOU LC 24 art. 2º § 3º), triagem 12 perguntas, argumentação 4 controvérsias, doutrina sem autores inventados, regra SE-ENTÃO 13 rotas, jurimetria vazia.',
    lote23.map((d) => ({ ...d, lote: 'LOTE-023' })),
    FONTES_LOTE23,
  );
  console.log('=== RELATÓRIO LOTE-023 ===');
  console.log(JSON.stringify(rel23, null, 2));

  console.log('=== RESUMO GERAL ===');
  console.log(`${rel23.lote}: pesquisados=${rel23.pesquisado} criados=${rel23.criados} atualizados=${rel23.atualizados} rejeitados=${rel23.rejeitados} duplicatasEvitadas=${rel23.duplicatasEvitadas} necessitaRevisao=${rel23.necessitaRevisao.length}`);
  for (const a of rel23.avisos) console.log(`  AVISO: ${a}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('ERRO NA INGESTÃO:', e);
    process.exit(1);
  });
