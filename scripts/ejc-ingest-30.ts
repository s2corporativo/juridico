// Jurimetria DPT — Ingestão SOMENTE do lote 030 (pipeline idempotente — não re-ingere lotes anteriores)
// Uso: bun scripts/ejc-ingest-30.ts
// Lei 11.101/2005 (Recuperação Judicial, Extrajudicial e Falência) — textos LITERAIS do Planalto
// (consulta 2026-09-01, URL /ccivil_03/_ato2004-2006/2005/lei/l11101.htm); redações empilhadas
// (Lei 14.112/2021) como consta; "(VETADO)" como consta. Derivados EJC: 1 doutrina (mapa RJ,
// confiabilidade B), 1 PRAZO consolidado com citações verbatim, 1 checklist admissibilidade
// (15 pontos), 1 fluxo F0-F9, 1 peça com variáveis, 1 regra SE-ENTÃO (9 rotas), 1 jurimetria
// VAZIA honesta (C). ANTI-INVENÇÃO MG: nenhuma prática estadual citada como verbatim — dados
// TJMG apenas via aba Jurimetria/DataJud.
import { ingestLote } from '../src/lib/ejc/ingest';
import lote30 from '../data/ejc/lote-030-recuperacao-judicial';

const FONTES_LOTE30 = [
  'https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2005/lei/l11101.htm (Lei 11.101/2005 — arts. 1º-173 LITERAIS do texto oficial; redações empilhadas da Lei 14.112/2021 como consta — consulta 2026-09-01)',
];

async function main() {
  const rel30 = await ingestLote(
    'LOTE-030',
    'P1 — Recuperação Judicial e Falência (compêndio, foco MG): Lei 11.101/2005 arts. 1º-2º (âmbito/exclusões LITERAL), 3º-4º (competência territorial LITERAL, art. 4º VETADO como consta), 5º-6º (definições + juízo universal + stay period 180 dias LITERAL), 7º-8º (legitimação LITERAL), 9º-10 (petição inicial LITERAL), 11-19 (documentos/habilitação LITERAL), 20 (acesso LITERAL), 21-22 (Administrador Judicial/Comitê LITERAL), 35-37 (assembleia LITERAL), 45-49 (quórum/sujeição LITERAL), 50 (meios de recuperação LITERAL), 51-53 (plano/objeções LITERAL), 54-58 (credoria especial/cram-down art. 58 §1º LITERAL), 59-61 (eficácia/novação LITERAL), 69-73 (descumprimento/convolação LITERAL), 74-75 (conclusão/extinção LITERAL), 83-84 (verificação/classificação LITERAL), 94-96 (falência por impontualidade LITERAL), 99-101 (sentença declaratória LITERAL), 105 (atos suspeitos LITERAL), 161-167 (extrajudicial LITERAL), 171-173 (disposições penais LITERAL) — TODOS do Planalto (consulta 2026-09-01). Derivados EJC: 1 doutrina mapa RJ (preservação da empresa, B), 1 PRAZO consolidado com citações verbatim (A), 1 checklist admissibilidade 15 pontos (B), 1 fluxo F0-F9 (B), 1 peça com variáveis (B), 1 regra SE-ENTÃO 9 rotas (B), 1 jurimetria vazia honesta (C — preencher via aba Jurimetria/DataJud). ANTI-INVENÇÃO MG: turmas/praxe TJMG NÃO afirmadas; monitoramento real somente por DataJud.',
    lote30.map((d) => ({ ...d, lote: 'LOTE-030' })),
    FONTES_LOTE30,
  );
  console.log('=== RELATÓRIO LOTE-030 ===');
  console.log(JSON.stringify(rel30, null, 2));
  console.log('=== RESUMO ===');
  console.log(`LOTE-030: pesquisados=${rel30.pesquisado} criados=${rel30.criados} atualizados=${rel30.atualizados} rejeitados=${rel30.rejeitados} duplicatasEvitadas=${rel30.duplicatasEvitadas} necessitaRevisao=${rel30.necessitaRevisao.length}`);
  for (const a of rel30.avisos) console.log(`  AVISO: ${a}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('ERRO NA INGESTÃO:', e);
    process.exit(1);
  });
