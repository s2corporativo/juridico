// EJC — Ingestão SOMENTE dos lotes 014 e 015 (não re-ingere lotes anteriores, preserva versões)
// Uso: bun scripts/ejc-ingest-14-15.ts
import { ingestLote } from '../src/lib/ejc/ingest';
import lote14 from '../data/ejc/lote-014-fato-produto-recall';
import lote15 from '../data/ejc/lote-015-mandado-seguranca';

const FONTES_LOTE14 = [
  'https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm (CDC — textos literais arts. 9º, 10 §§ 1º-3º, 12 e 13 — consulta 2026-08-30; art. 11 VETADO no texto oficial)',
  'https://www.gov.br/mj/pt-br/assuntos/seus-direitos/consumidor/defesadoconsumidor/Biblioteca/legislacao-upload/portaria_mjsp_n-_618_2019.pdf (Portaria MJSP 618/2019 — PDF oficial gov.br baixado e lido na íntegra, 6 p., arts. 1º-16)',
  'http://dspace.mj.gov.br/handle/1/1844 (Portaria Conjunta nº 3/2019 — HTML oficial dspace.mj.gov.br lido na íntegra, arts. 1º-11; DOU 02/07/2019; status sem revogação expressa)',
  'https://www.gov.br/mj/pt-br/acesso-a-informacao/perguntas-frequentes/consumidor/consumo-seguro-e-saude (Senacon FAQ oficial — definição de recall, orientações ao consumidor e indicação das portarias reguladoras)',
];

const FONTES_LOTE15 = [
  'https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2009/lei/l12016.htm (Lei 12.016/2009 — textos literais arts. 5º, 6º, 7º, 8º-12, 13-14, 15 e 23 — consulta 2026-08-30; art. 5º p.ú. VETADO; anotações oficiais "Vide ADIN 4296")',
  'https://portal.stf.jus.br/noticias/verNoticiaDetalhe.asp?idConteudo=467335 (STF — notícia oficial ADI 4296; conteúdo confirmado via snippet de busca na página oficial — captura integral falhou por JS; registro B honesto)',
];

async function main() {
  const rel14 = await ingestLote(
    'LOTE-014',
    'P1 — Fato do produto/serviço e Recall: CDC arts. 9º, 10 (§§ 1º-3º), 12 e 13 literais do Planalto (art. 11 vetado); Portaria MJSP 618/2019 íntegra (prazos 24h/10 dias úteis/2 dias úteis, plano de mídia, aviso de risco, relatórios quadrimestrais); Portaria Conjunta 3/2019 íntegra (RENAVAM, notificação individual, CRLV); Senacon FAQ oficial (conceito e direito ao reparo enquanto persistir o risco); teses de responsabilidade objetiva e de cumulação LGPD-CDC; peças de reclamação por fato do produto e de notificação extrajudicial de recall; checklists de dossiê (14) e de conformidade (16); fluxos do fornecedor e do consumidor; tabela de documentos; triagem; prazos 2/10 dias úteis; argumentação bilateral; doutrina dos tipos de defeito e do conceito oficial de recall; 2 regras SE-ENTÃO; jurimetria vazia',
    lote14.map((d) => ({ ...d, lote: 'LOTE-014' })),
    FONTES_LOTE14,
  );
  console.log('=== RELATÓRIO LOTE-014 ===');
  console.log(JSON.stringify(rel14, null, 2));

  const rel15 = await ingestLote(
    'LOTE-015',
    'P1 — Mandado de segurança (Lei 12.016/2009 remanescente): arts. 5º (vedações, p.ú. vetado), 6º (inicial, coatora, exibição 10 dias, renovação), 7º (liminar, caução, vedações § 2º com "Vide ADIN 4296"), 8º-12 (caducidade 3 dias úteis, remessa 48h, indeferimento, MP 10 dias, decisão 30 dias), 13-14 (ofício, apelação, duplo grau obrigatório, execução provisória, vencimentos), 15 (suspensão de segurança, agravo 5 dias) e 23 (decadência 120 dias) LITERAIS do Planalto; ADI 4296/STF (por maioria: art. 7º § 2º inconstitucional na parte de compensação de créditos; art. 7º III caução constitucional — registro B honesto, captura integral pendente); tese da liminar de compensação pós-ADI; peça de impetração; checklist 13 pontos; fluxo completo; tabela de documentos; triagem; prazos 10/10+30/3 dias úteis/5 dias; argumentação bilateral; doutrina direito líquido e certo; regra SE-ENTÃO de cabimento',
    lote15.map((d) => ({ ...d, lote: 'LOTE-015' })),
    FONTES_LOTE15,
  );
  console.log('=== RELATÓRIO LOTE-015 ===');
  console.log(JSON.stringify(rel15, null, 2));
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
