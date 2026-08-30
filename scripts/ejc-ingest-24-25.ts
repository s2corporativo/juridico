// EJC — Ingestão SOMENTE dos lotes 024 e 025 (não re-ingere lotes anteriores, preserva versões — pipeline idempotente)
// Uso: bun scripts/ejc-ingest-24-25.ts
// LOTE-024: Consumidor + JEC Fazenda Pública MG — Lei 12.153/2009 completa + complementos CDC
// LOTE-025: Penal — crimes CDC (arts. 63-67), CP 171 § 2º VI / 311-A e JECrim (Lei 9.099 complementar)
// Regra absoluta: textos LITERAIS do Planalto (consulta 2026-08-30); NADA estadual MG citado como
// verbatim (portais bloqueados: almg.gov.br, mg.gov.br, iof.mg.gov.br, tjmg.jus.br) — pontes REVISAO_HUMANA.
import { ingestLote } from '../src/lib/ejc/ingest';
import lote24 from '../data/ejc/lote-024-consumidor-jec-mg';
import lote25 from '../data/ejc/lote-025-penal-mg';

const FONTES_LOTE24 = [
  'https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2009/lei/l12153.htm (Lei 12.153/2009 — JEC Fazenda Pública: arts. 1º-27 LITERAIS do Planalto, "(VETADO)" nos §§ 3º do art. 2º e 4º do art. 19 registrados como constam — consulta 2026-08-30)',
  'https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm (CDC art. 21 — vício do serviço LITERAL; arts. 14/20/26 já na base, não duplicados — consulta 2026-08-30)',
  'PONTES REVISAO_HUMANA (confiabilidade C): PROCON MG/BH e procedimentos estaduais — portais MG bloqueados nesta consulta (almg.gov.br, mg.gov.br, iof.mg.gov.br, tjmg.jus.br); zero números de lei estadual apresentados como verificados',
];

const FONTES_LOTE25 = [
  'https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm (CDC arts. 63-67 — crimes contra relações de consumo LITERAIS do Planalto — consulta 2026-08-30)',
  'https://www.planalto.gov.br/ccivil_03/decreto-lei/del2848compilado.htm (CP art. 171 § 2º VI e art. 311-A LITERAIS — consulta 2026-08-30)',
  'https://www.planalto.gov.br/ccivil_03/leis/l9099.htm (Lei 9.099/1995 — complementos JECrim literais dos arts. 61-68 não cobertos no LOTE-012; duplicatas evitadas por verificação prévia — consulta 2026-08-30)',
  'PONTE REVISAO_HUMANA (confiabilidade C): legislação penal estadual MG (ex.: Código Ambiental MG) — portal ALMG bloqueado nesta consulta; zero artigos estaduais citados como verbatim',
];

async function main() {
  const rel24 = await ingestLote(
    'LOTE-024',
    'P1 — Consumidor + JEC Fazenda Pública MG: Lei 12.153/2009 LITERAL do Planalto (competência 60 SM com exclusões do art. 1º § único/2º § 1º, representação legal art. 2º § 2º, sem advogado até 20 SM, citação/tutela arts. 3º-4º, recurso só contra sentença art. 4º caput, FAZENDA SEM PRAZO DIFERENCIADO art. 7º, sem reexame necessário art. 11, pagamento por requisição até o limite legal arts. 12-13 com sequestro § 1º, aplicação subsidiária 9.099/CPC art. 21) + CDC art. 21 (vício do serviço, LITERAL) + ponte PROCON MG (REVISAO_HUMANA, C). ANTI-INVENÇÃO: premissas da rodada corrigidas pelo texto oficial (arts. 5º-6º = partes/citações, NÃO sentença/recursos; arts. 9º-10 = documentação/assistente, NÃO pagamento/precatório); "(VETADO)" registrado como consta; portais MG bloqueados → zero números estaduais como verbatim. Tese de rota (JEC-Faz × LEF × antecipação), peça inicial com 20+ variáveis, checklist 15 pontos, fluxo 7 etapas, 3 prazos literais, triagem 12 perguntas, argumentação bilateral 4 controvérsias, doutrina, regra SE-ENTÃO de rota de juízo, jurimetria vazia.',
    lote24.map((d) => ({ ...d, lote: 'LOTE-024' })),
    FONTES_LOTE24,
  );
  console.log('=== RELATÓRIO LOTE-024 ===');
  console.log(`${rel24.lote}: criados=${rel24.criados} atualizados=${rel24.atualizados} rejeitados=${rel24.rejeitados} duplicatasEvitadas=${rel24.duplicatasEvitadas}`);
  for (const a of rel24.avisos) console.log(`  AVISO: ${a}`);

  const rel25 = await ingestLote(
    'LOTE-025',
    'P1 — Penal: crimes contra relações de consumo CDC arts. 63-67 LITERAIS (publicidade enganosa/abusiva, exposição à venda imitação, reincidência, óbice à fiscalização), CP art. 171 § 2º VI e art. 311-A LITERAIS (estelionato eletrônico, fraude em negócio por meios eletrônicos), JECrim Lei 9.099 complementar LITERAL (arts. não cobertos no LOTE-012) + ponte legislação penal estadual MG (REVISAO_HUMANA, C). Tese de enquadramento CDC × CP, peça de defesa preliminar JECrim com variáveis, checklist 12 pontos, fluxo 7 etapas, prazos literais, triagem, argumentação bilateral, doutrina, regra SE-ENTÃO, jurimetria vazia.',
    lote25.map((d) => ({ ...d, lote: 'LOTE-025' })),
    FONTES_LOTE25,
  );
  console.log('=== RELATÓRIO LOTE-025 ===');
  console.log(`${rel25.lote}: criados=${rel25.criados} atualizados=${rel25.atualizados} rejeitados=${rel25.rejeitados} duplicatasEvitadas=${rel25.duplicatasEvitadas}`);
  for (const a of rel25.avisos) console.log(`  AVISO: ${a}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('ERRO NA INGESTÃO:', e);
    process.exit(1);
  });
