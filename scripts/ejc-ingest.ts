// EJC — Executa a ingestão dos lotes com CHECK 1-10 e relatórios (item 34)
// Uso: bun scripts/ejc-ingest.ts

import { ingestLote } from '../src/lib/ejc/ingest';
import legislacao from '../data/ejc/legislacao';
import jurisprudencia from '../data/ejc/jurisprudencia';
import prazos from '../data/ejc/prazos';
import estrutural1 from '../data/ejc/estrutural-1';
import estrutural2 from '../data/ejc/estrutural-2';
import lote2 from '../data/ejc/lote-002-jurisprudencia';
import lote3 from '../data/ejc/lote-003-licitacoes';
import lote4 from '../data/ejc/lote-004-execucao-fiscal';
import lote5 from '../data/ejc/lote-005-alienacao-fiduciaria';
import lote6 from '../data/ejc/lote-006-bancario-cdc';
import lote7 from '../data/ejc/lote-007-recursos-cpc';

const FONTES_P0 = [
  'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm',
  'https://www.planalto.gov.br/ccivil_03/leis/l9605.htm',
  'https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2008/decreto/d6514.htm (texto extraído e conferido literalmente: arts. 21, 113, 127)',
  'https://www.planalto.gov.br/ccivil_03/leis/l6938.htm',
  'https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12651.htm',
  'https://www.planalto.gov.br/ccivil_03/leis/l7347orig.htm',
  'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm',
  'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm (CPC art. 300)',
  'https://www.planalto.gov.br/ccivil_03/leis/l5172compilado.htm (CTN art. 174 literal)',
  'https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm (CDC art. 27 literal)',
  'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm (LGPD)',
  'https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2009/lei/l12016.htm (MS art. 23)',
  'https://www.planalto.gov.br/ccivil_03/leis/l6830.htm (LEF art. 16 literal)',
  'https://www.planalto.gov.br/ccivil_03/decreto-lei/1965-1988/del0911.htm (DL 911 art. 2º)',
  'https://scon.stj.jus.br/SCON/sumstj/doc.jsp?livre=652&b=SUMU (Súmula 652 STJ)',
  'https://scon.stj.jus.br/SCON/sumstj/doc.jsp?livre=%22467%22+INPATH%28NUM%29&b=SUMU (Súmula 467 STJ)',
  'https://www.stj.jus.br/sites/portalp/Paginas/Comunicacao/Noticias/2025/01062025-O-poluidor-indireto-e-a-extensao-da-responsabilizacao-ambiental--segundo-a-jurisprudencia-do-STJ.aspx',
  'https://www.stj.jus.br/sites/portalp/Paginas/Comunicacao/Noticias-antigas/2019/In-dubio-pro-natura-mais-protecao-judicial-ao-meio-ambiente.aspx',
  'https://portal.stf.jus.br/jurisprudenciaRepercussao/verAndamentoProcesso.asp?incidente=5136782&numeroProcesso=1027633&classeProcesso=RE&numeroTema=940 (Tema 940 STF)',
];

const FONTES_LOTE2 = [
  'https://scon.stj.jus.br/SCON/GetInteiroTeorDoAcordao?num_registro=201002113030&dt_publicacao=04/03/2011 (REsp 1.225.489-SP — URL oficial)',
  'https://www.stj.jus.br/websecstj/cgi/revista/REJ.cgi/ITA?seq=1462384&tipo=0&nreg=201300238686&SeqCgrmaSessao=&CodOrgaoJgdr=&dt=20151217&formato=PDF&salvar=false (REsp 1.363.107 — Revista Eletrônica oficial STJ)',
  'https://www.planalto.gov.br/ccivil_03/leis/l9873.htm (Lei 9.873/1999 — textos literais art. 1º, §1º, 1º-A, 2º, 2º-A, 5º)',
  'https://scon.stj.jus.br/ (busca de precedentes — itens não confirmados permanecem em REVISAO_HUMANA)',
];

const FONTES_LOTE3 = [
  'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm (Lei 14.133/2021 — textos literais arts. 28, 62, 74, 75, 92, 155, 156)',
];

const FONTES_LOTE4 = [
  'https://www.planalto.gov.br/ccivil_03/leis/l6830.htm (LEF — textos literais arts. 2º, 7º, 11, 16, 40 §§1º-5º — consulta 2026-08-29)',
  'https://portal.stf.jus.br/jurisprudenciaRepercussao/verAndamentoProcesso.asp?incidente=4043240&numeroProcesso=636562&classeProcesso=RE&numeroTema=390 (Tema 390 STF — RE 636.562, tese oficial)',
  'https://www.stj.jus.br/sites/portalp/Paginas/Comunicacao/Noticias-antigas/2014/2014-11-27_13-10_Pedido-de-vista-interrompe-julgamento-de-recurso-repetitivo-sobre-execucao-fiscal.aspx (notícia oficial STJ — teor da Súmula 314)',
  'https://www.stj.jus.br/sites/portalp/Paginas/Comunicacao/Noticias/2025/10032025-Na-execucao-fiscal--simples-bloqueio-de-bens-basta-para-interromper-a-prescricao-intercorrente.aspx (notícia oficial STJ 10/03/2025)',
  'https://www.gov.br/pgfn/pt-br/cidadania-tributaria/por-assunto/execucao-fiscal/prescricao-intercorrente-e-extincao-da-ef-por-inercia-do-credor (PGFN — Temas 100/STF e 125/STJ, Súmula CARF 11, Atos Declaratórios PGFN 9/2008 e 03/2011)',
  'https://www.stj.jus.br/websecstj/cgi/revista/REJ.cgi/ATC?seq=79310908&tipo=3&nreg=201201691933&SeqCgrmaSessao=&CodOrgaoJgdr=&dt=20181016&formato=PDF&salvar=false (REsp 1.340.553/RS — Revista Eletrônica oficial STJ)',
];

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

const FONTES_LOTE5 = [
  'https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm (Código Civil — textos literais arts. 1.361-1.365)',
  'https://www.planalto.gov.br/ccivil_03/leis/l4728.htm (Lei 4.728/1965 — art. 66-B literal; art. 66 na redação do DL 911 constatado REVOGADO pela Lei 10.931/2004)',
  'https://www.planalto.gov.br/ccivil_03/decreto-lei/1965-1988/del0911.htm (DL 911/1969 — textos literais arts. 2º e 3º, redações da Lei 13.043/2014)',
  'https://www.planalto.gov.br/ccivil_03/leis/l9514.htm (Lei 9.514/1997 — textos literais arts. 26, 26-A e 27, redações da Lei 14.711/2023)',
  'https://www.stj.jus.br/sites/portalp/Paginas/Comunicacao/Noticias/2023/14112023-Intimacao-do-devedor-fiduciante-sobre-data-do-leilao-so-se-tornou-obrigatoria-apos-2017--decide-Quarta-Turma.aspx (notícia oficial STJ — título confirma tese; texto integral pendente → confiabilidade B)',
  'https://www.stj.jus.br/sites/portalp/Paginas/Comunicacao/Noticias/27082020-Busca-e-apreensao-nao-autoriza-juiz-a-extinguir-contrato-de-alienacao-fiduciaria-sem-pedido-do-credor.aspx (notícia oficial STJ — título confirma tese; texto integral pendente → confiabilidade B)',
];

async function main() {
  const rel0 = await ingestLote(
    'LOTE-001',
    'P0 — Direito Ambiental (Autos de Infração) + bases estruturantes (legislação, jurisprudência validada, prazos, teses, peças, contratos, checklists, fluxos, tabelas, triagem, argumentação, doutrina, regras de inteligência, jurimetria)',
    [...legislacao, ...jurisprudencia, ...prazos, ...estrutural1, ...estrutural2].map((d) => ({ ...d, lote: 'LOTE-001' })),
    FONTES_P0,
  );
  console.log('=== RELATÓRIO LOTE-001 ===');
  console.log(JSON.stringify(rel0, null, 2));

  const rel2 = await ingestLote(
    'LOTE-002',
    'P0 — Jurisprudência ambiental qualificada: REsp 1.225.489/SP e REsp 1.363.107 confirmados em URL oficial STJ; Lei 9.873/1999 com textos literais; atualização do registro de decadência (pendência mantida honestamente)',
    lote2.map((d) => ({ ...d, lote: 'LOTE-002' })),
    FONTES_LOTE2,
  );
  console.log('=== RELATÓRIO LOTE-002 ===');
  console.log(JSON.stringify(rel2, null, 2));

  const rel3 = await ingestLote(
    'LOTE-003',
    'P1 — Lei 14.133/2021 detalhada: habilitação (art. 62), contratação direta (arts. 74-75), sanções (arts. 155-156), modalidades e cláusulas (arts. 28, 92) com textos literais + peça de impugnação, checklist, regra de inteligência, tese e argumentação',
    lote3.map((d) => ({ ...d, lote: 'LOTE-003' })),
    FONTES_LOTE3,
  );
  console.log('=== RELATÓRIO LOTE-003 ===');
  console.log(JSON.stringify(rel3, null, 2));

  const rel4 = await ingestLote(
    'LOTE-004',
    'P1 — Execução Fiscal: LEF arts. 2º, 7º, 11, 16 e 40 com textos literais do Planalto; Tema 390/STF (RE 636.562); Súmula 314/STJ; STJ 2025 (Sisbajud interrompe); Temas 100/STF e 125/STJ via PGFN; tese, peça de embargos, argumentação bilateral e tabela de documentos; CORREÇÃO do registro de prescrição intercorrente (§ 4º da LEF incluído pela Lei 11.051/2004 — não LC 118/2005)',
    lote4.map((d) => ({ ...d, lote: 'LOTE-004' })),
    FONTES_LOTE4,
  );
  console.log('=== RELATÓRIO LOTE-004 ===');
  console.log(JSON.stringify(rel4, null, 2));

  const rel5 = await ingestLote(
    'LOTE-005',
    'P1 — Alienação Fiduciária: CC arts. 1.361-1.365 e Lei 4.728/65 art. 66-B literais; DL 911/1969 arts. 2º-3º literais (red. Lei 13.043/2014); Lei 9.514/1997 arts. 26, 26-A e 27 literais (red. Lei 14.711/2023); notícias oficiais STJ (confiabilidade B, texto integral pendente); tese, peça e fluxo da excussão imobiliária; CORREÇÕES: removidas citações inexistentes (DL 911 art. 2º § 1º/5 dias; art. 66-C inexistente; art. 66 revogado pela Lei 10.931/2004)',
    lote5.map((d) => ({ ...d, lote: 'LOTE-005' })),
    FONTES_LOTE5,
  );
  console.log('=== RELATÓRIO LOTE-005 ===');
  console.log(JSON.stringify(rel5, null, 2));

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
