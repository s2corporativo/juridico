// EJC — Ingestão SOMENTE do lote 026 (pipeline idempotente — não re-ingere lotes anteriores)
// Uso: bun scripts/ejc-ingest-27.ts
// LOTE-027: Penal II (compêndio, foco MG) — CF arts. 145-156/195, CTN arts. 1º-11 e 96-112,
// LC 116/2003 (ISS arts. 1º-9º), LC 123/2006 (arts. 13 e 17), Lei 9.430/1996 art. 74 (compensação),
// Lei 13.988/2020 (transação arts. 1º-5º) + derivados EJC.
// Regra absoluta: textos LITERAIS do Planalto (consulta 2026-08-30); NADA estadual MG citado como
// verbatim (portais MG bloqueados); [VERIFICAR LEI ESTADUAL MG] nos pontos dependentes de lei MG.
import { ingestLote } from '../src/lib/ejc/ingest';
import lote26 from '../data/ejc/lote-027-penal-ii';

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
    'LOTE-027',
    'P1 — Penal II (compêndio, foco MG): CP arts. 1º-11 (aplicação da lei penal LITERAL), 13-29 (relação de causalidade/dolo/tentativa/autoria-participação LITERAIS), 138-140 (honra LITERAL), 155 (furto LITERAL com redação Lei 15.397/2026 registrada como consta), 157 (roubo LITERAL), 163 (dano LITERAL), 168 (apropriação indébita LITERAL); CPP arts. 282-283 (cautelares LITERAIS), 310-317 (flagrante/custódia/preventiva LITERAIS); CF art. 5º LXI-LXVII (garantias LITERAIS); Lei 14.155/2021 (fraude eletrônica LITERAL) — TODOS do Planalto (consulta 2026-08-30). Derivados EJC: 4 doutrinas (teoria do crime/crimes patrimoniais/honra online/cautelares), 2 teses (furto JECrim/desclassificação fraude eletrônica), 2 peças com variáveis (liberdade provisória/defesa direta JECrim), 1 checklist 15 pontos, 1 fluxo flagrante→liberdade, 1 prazo literal (24h custódia), 1 regra SE-ENTÃO (8 rotas), 1 jurimetria vazia DataJud. ANTI-INVENÇÃO MG: NENHUM número/julgado estadual citado; [VERIFICAR LEI ESTADUAL MG]/[VERIFICAR RESOLUÇÃO CNJ] nos pontos dependentes.',
    lote26.map((d) => ({ ...d, lote: 'LOTE-027' })),
    FONTES_LOTE26,
  );
  console.log('=== RELATÓRIO LOTE-027 ===');
  console.log(JSON.stringify(rel26, null, 2));
  console.log('=== RESUMO ===');
  console.log(`LOTE-027: pesquisados=${rel26.pesquisado} criados=${rel26.criados} atualizados=${rel26.atualizados} rejeitados=${rel26.rejeitados} duplicatasEvitadas=${rel26.duplicatasEvitadas} necessitaRevisao=${rel26.necessitaRevisao.length}`);
  for (const a of rel26.avisos) console.log(`  AVISO: ${a}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('ERRO NA INGESTÃO:', e);
    process.exit(1);
  });
