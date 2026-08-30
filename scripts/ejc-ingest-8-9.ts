// EJC — Ingestão SOMENTE dos lotes 008 e 009 (não re-ingere lotes anteriores, preserva versões)
// Uso: bun scripts/ejc-ingest-8-9.ts
import { ingestLote } from '../src/lib/ejc/ingest';
import lote8 from '../data/ejc/lote-008-lgpd';
import lote9 from '../data/ejc/lote-009-consumidor';

const FONTES_LOTE8 = [
  'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm (LGPD — textos literais arts. 5º, 6º, 7º, 18, 19, 42, 44, 46, 48 e 52 — consulta 2026-08-30)',
  'https://www.gov.br/anpd/pt-br/assuntos/noticias-periodo-eleitoral/Regulamento_Dosimetria_vf.pdf/@@display-file/file (Resolução CD/ANPD nº 4/2023 — PDF oficial lido na íntegra, 19 p.: art. 8º gravidades, Tabela 1 alíquotas, art. 14 agravantes, atenuantes de cessação 75/50/30)',
  'https://bibliotecadigital.mj.gov.br/handle/1/12879 (Resolução CD/ANPD nº 15/2024 — listagem oficial MJ; texto integral com arts. 6º/9º — 3 dias úteis — verificado em cópia institucional ABRAPP: https://www.abrapp.org.br/legislacao/resolucao-cd-anpd-no-15-de-24-de-abril-de-2024)',
  'https://www.gov.br/mec/pt-br/acesso-a-informacao/perguntas-frequentes/privacidade-e-protecao-de-dados-pessoais/qual-o-prazo-para-que (gov.br MEC — confirmação do prazo de 15 dias do art. 19, II LGPD)',
  'https://www.gov.br/anpd/pt-br/acesso-a-informacao/institucional/atos-normativos/regulamentacoes_anpd (listagem oficial de regulamentações vigentes da ANPD)',
];

const FONTES_LOTE9 = [
  'https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm (CDC — textos literais arts. 6º, 14, 18, 19, 20, 25, 26 e 49 — consulta 2026-08-30)',
  'https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2013/decreto/d7962.htm (Decreto 7.962/2013 — textos literais arts. 1º, 2º, 4º, 5º e 7º — consulta 2026-08-30)',
  'https://www.tjdft.jus.br/consultas/jurisprudencia/jurisprudencia-em-temas/cdc-na-visao-do-tjdft-1/o-consumidor-na-internet/responsabilidade-do-intermediador-na-venda-feita-pela-internet (TJDFT Precedentes Qualificados — Acórdão 1965134, 0719604-85.2024.8.07.0003, 1ª TR, julg. 07/02/2025, DJe 18/02/2025 + Acórdão 2033075, 8ª Turma Cível, 21/08/2025 — trechos literais)',
  'https://www.stj.jus.br/sites/portalp/Paginas/Comunicacao/Noticias/2025/27052025-Prazo-de-30-dias-para-reparo-de-produto-defeituoso-nao-afeta-direito-ao-ressarcimento-integral-de-danos-materiais.aspx (STJ notícia oficial 27/05/2025 — título/URL confirmados; texto integral sob anti-bot — registrado com confiabilidade B e nota honesta)',
];

async function main() {
  const rel8 = await ingestLote(
    'LOTE-008',
    'P1 — LGPD na prática: arts. 5º, 6º, 7º, 18-19, 42, 44, 46, 48 e 52 literais do Planalto; Resolução CD/ANPD 4/2023 (dosimetria: gravidades leve/média/grave, Tabela 1 de alíquotas, agravantes e atenuantes — PDF oficial ANPD lido na íntegra); Resolução CD/ANPD 15/2024 (incidente: 3 dias úteis, complementação 20 dias úteis — via cópia institucional integral, conf. B); prazo de resposta ao titular 15 dias (art. 19 II); peça de requerimento art. 18, checklist de compliance, fluxo e triagem LGPD, argumentação bilateral, doutrina de conceitos, regra SE-ENTÃO de incidente e jurimetria de sanções',
    lote8.map((d) => ({ ...d, lote: 'LOTE-008' })),
    FONTES_LOTE8,
  );
  console.log('=== RELATÓRIO LOTE-008 ===');
  console.log(JSON.stringify(rel8, null, 2));

  const rel9 = await ingestLote(
    'LOTE-009',
    'P1 — Defesa do Consumidor: CDC arts. 6º, 14, 18, 20, 26 e 49 + Decreto 7.962/2013 literais do Planalto; TJDFT Precedentes Qualificados sobre marketplace (Acórdão 1965134/1ª TR 2025 — solidariedade da cadeia de fornecimento; Acórdão 2033075 — culpa concorrente em classificados/OLX); notícia STJ 27/05/2025 (conf. B honesta, anti-bot); teses de marketplace, arrependimento e art. 18 § 1º; peças de reclamação e notificação de arrependimento; checklists de dossiê e de conformidade e-commerce; fluxos de vício e arrependimento; triagem, argumentação, doutrina vício x fato, regra SE-ENTÃO e jurimetria',
    lote9.map((d) => ({ ...d, lote: 'LOTE-009' })),
    FONTES_LOTE9,
  );
  console.log('=== RELATÓRIO LOTE-009 ===');
  console.log(JSON.stringify(rel9, null, 2));
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
