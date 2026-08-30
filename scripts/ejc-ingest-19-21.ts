// EJC — Ingestão SOMENTE dos lotes 019, 020 e 021 (não re-ingere lotes anteriores, preserva versões)
// Uso: bun scripts/ejc-ingest-19-21.ts
import { ingestLote } from '../src/lib/ejc/ingest';
import lote19 from '../data/ejc/lote-019-doacao';
import lote20 from '../data/ejc/lote-020-usucapiao';
import lote21 from '../data/ejc/lote-021-responsabilidade-civil';

const FONTES_LOTE19 = [
  'https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm (Código Civil — textos literais arts. 538-564: doação, forma, limites, revogação — consulta 2026-08-30)',
];

const FONTES_LOTE20 = [
  'https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm (Código Civil — textos literais arts. 1.228-1.244: reivindicatória, usucapiões, união de posses — consulta 2026-08-30)',
  'https://www.planalto.gov.br/ccivil_03/leis/l6015compilada.htm (Lei 6.015/73 — art. 216-A literal: usucapião extrajudicial com redações Lei 13.465/2017 e Lei 14.382/2022; divergência histórica do § 2º registrada — consulta 2026-08-30)',
  'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm (CPC/2015 — textos literais arts. 235 § 3º, 259 I e 561-567: citação dos confinantes, edital, ações possessórias — consulta 2026-08-30)',
];

const FONTES_LOTE21 = [
  'https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm (Código Civil — textos literais arts. 927-954: responsabilidade civil e indenização; remissões ADI 7055/6792 registradas como constam — consulta 2026-08-30)',
  'https://www.stj.jus.br/docs_internet/VerbetesSTJ_asc.txt (Súmula 227/STJ — enunciado verbatim em arquivo OFICIAL do STJ confirmado por snippet; captura direta bloqueada por 403 — registro B honesto, consulta 2026-08-30)',
];

async function main() {
  const rel19 = await ingestLote(
    'LOTE-019',
    'P1 — Doação (CC arts. 538-564): conceito/animus donandi, forma (escritura pública, verbal de pequeno valor), aceitação (nascituro/incapazes), adiantamento de herança (544), subvenção periódica e casamento (545-546), reversão e nulidades (547-549 — todos os bens/inoficiosa), cônjuge adúltero (550) e doação em comum (551), garantias (552), encargo e entidade futura (553-554), revogação por ingratidão (rol 557-558, prazo 1 ano do duplo conhecimento 559, transmissão 560-561, encargo/efeitos 562-563, imunidades 564) — TODOS LITERAIS do Planalto; tese de diagnóstico de rota (nulidade × anulabilidade × revogação); peça de revogação por ingratidão com variáveis; checklist 18 pontos; fluxo; tabela de documentos; triagem; 2 prazos (1 ano ingratidão, 2 anos cônjuge adúltero); argumentação bilateral 4 controvérsias; doutrina; regra SE-ENTÃO; jurimetria vazia. Nenhuma súmula de doação confirmada em fonte oficial nesta consulta (Súmula 49/STF NÃO confirmada — não incluída).',
    lote19.map((d) => ({ ...d, lote: 'LOTE-019' })),
    FONTES_LOTE19,
  );
  console.log('=== RELATÓRIO LOTE-019 ===');
  console.log(JSON.stringify(rel19, null, 2));

  const rel20 = await ingestLote(
    'LOTE-020',
    'P1 — Usucapião (CC arts. 1.228-1.244) e via extrajudicial (Lei 6.015 art. 216-A): reivindicatória e usucapião coletiva extensa (1.228 §§ 4º-5º), extraordinária 15/10 (1.238), especial rural 5 anos/50 ha (1.239), especial urbana 5 anos/250 m² (1.240), conjugal 2 anos (1.240-A, Lei 12.424/2011, § 2º VETADO como consta), ordinária 10/5 registro cancelado (1.241-1.242), união de posses e aplicação das causas prescricionais (1.243-1.244) — TODOS LITERAIS do Planalto; art. 216-A da Lei 6.015 literal (ata notarial, planta+ART, certidões, impostos; notificações 15 dias com silêncio = CONCORDÂNCIA na redação vigente Lei 13.465/2017 — divergência histórica da redação original registrada; rejeição não impede ação § 9º; impugnação justificada → juízo § 10 red. Lei 14.382/2022); CPC arts. 235 § 3º (citação pessoal dos confinantes) e 259 I (edital) e 561-567 (possessórias: prova, liminar, citação 5/15 dias, mediação litígio coletivo, interdito proibitório) literais; NOTA HONESTA: CPC/2015 não tem rito especial de usucapião (procedimento comum); tese das vias; peça de ação de usucapião; checklist extrajudicial 14 pontos; fluxo; tabela; triagem; 4 prazos (15/10, 5, 2, 15 dias notificações + possessória 5/15); argumentação bilateral; doutrina; regra SE-ENTÃO; jurimetria vazia. Súmula 523/STF NÃO confirmada verbatim — não incluída.',
    lote20.map((d) => ({ ...d, lote: 'LOTE-020' })),
    FONTES_LOTE20,
  );
  console.log('=== RELATÓRIO LOTE-020 ===');
  console.log(JSON.stringify(rel20, null, 2));

  const rel21 = await ingestLote(
    'LOTE-021',
    'P1 — Responsabilidade civil (CC arts. 927-954, núcleo transversal): princípio geral e objetividade pelo risco da atividade (927 — remissões ADI 7055/6792 registradas como constam, sem afirmar desfechos), incapaz/equidade e estado de necessidade (928-930), produto no regime geral (931), fato de terceiros rol I-V com objetividade e regresso (932-934), independência da esfera criminal e hipóteses objetivas animal/ruína/coisas lançadas (935-938), cobrança indevida com penas (939-941), solidariedade e herança (942-943), extensão do dano e redução equitativa (944), culpa concorrente (945), morte/lesão/incapacidade (946-950), erro profissional/usurpação/honra/liberdade pessoal (951-954) — TODOS LITERAIS do Planalto; Súmula 227/STJ (pessoa jurídica — dano moral) com registro B honesto (enunciado verbatim via arquivo oficial do STJ confirmado por snippet; captura direta 403); tese de diagnóstico de regime; peça de indenização por danos morais/materiais; checklist 15 pontos; fluxo; tabela; triagem; argumentação bilateral 4 controvérsias; doutrina do dano moral (sem tabelas inventadas); regra SE-ENTÃO; jurimetria vazia.',
    lote21.map((d) => ({ ...d, lote: 'LOTE-021' })),
    FONTES_LOTE21,
  );
  console.log('=== RELATÓRIO LOTE-021 ===');
  console.log(JSON.stringify(rel21, null, 2));

  console.log('=== RESUMO GERAL ===');
  for (const rel of [rel19, rel20, rel21]) {
    console.log(`${rel.lote}: pesquisados=${rel.pesquisado} criados=${rel.criados} atualizados=${rel.atualizados} rejeitados=${rel.rejeitados} duplicatasEvitadas=${rel.duplicatasEvitadas} necessitaRevisao=${rel.necessitaRevisao.length}`);
    for (const a of rel.avisos) console.log(`  AVISO: ${a}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('ERRO NA INGESTÃO:', e);
    process.exit(1);
  });
