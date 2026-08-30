// EJC — Ingestão SOMENTE dos lotes 012 e 013 (não re-ingere lotes anteriores, preserva versões)
// Uso: bun scripts/ejc-ingest-12-13.ts
import { ingestLote } from '../src/lib/ejc/ingest';
import lote12, { FONTES_LOTE12 } from '../data/ejc/lote-012-juizados';
import lote13, { FONTES_LOTE13 } from '../data/ejc/lote-013-lgpd-avancada';

async function main() {
  const rel12 = await ingestLote(
    'LOTE-012',
    'P1 — Juizados Especiais (JEC/JECrim/JEF/JF — recurso inominado e turmas recursais): Lei 9.099/1995 arts. 1º-3º, 4º/8º/9º/10, 12-A, 14-16, 17-23, 27-33, 34-36, 37-40, 41-43 (núcleo recursal), 52-55 e 60-61/72-76 (JECrim) LITERAIS do Planalto; Lei 10.259/2001 arts. 3º, 5º, 6º, 9º, 10, 13 e 14 (PUI) LITERAIS; Lei 12.153/2009 arts. 1º-3º, 13, 17-19 e 27 LITERAIS; Súmulas 203 e 376 do STJ com enunciados LITERAIS do Arquivo Cidadão STJ; Súmula 640/STF com página oficial confirmada (registro B honesto por captura JS); Súmulas 7, 25 e 41 da Turma de Uniformização dos JEC/TJDFT LITERAIS; teses, peça-modelo de recurso inominado, checklist de admissibilidade, fluxo completo, 3 prazos (10 dias úteis, preparo 48h, testemunhas 5 dias), triagem, tabela de documentos, argumentação bilateral, 2 doutrinas, 2 regras SE-ENTÃO e jurimetria vazia',
    lote12.map((d) => ({ ...d, lote: 'LOTE-012' })),
    FONTES_LOTE12,
  );
  console.log('=== RELATÓRIO LOTE-012 ===');
  console.log(JSON.stringify(rel12, null, 2));

  const rel13 = await ingestLote(
    'LOTE-013',
    'LGPD avançada (dados sensíveis, crianças e transferência internacional): LGPD arts. 11 (hipóteses de dados sensíveis), 12 (anonimização), 13 (pesquisa em saúde), 14 (crianças — melhor interesse) e 33-36 (transferência internacional) LITERAIS do Planalto; Resolução CD/ANPD nº 19/2024 (Regulamento de TID e cláusulas-padrão) confirmada na página oficial gov.br/ANPD com mecanismos regulados e prazo de 12 meses; teses de irregularidade (crianças sem verificação parental; dados de saúde para vantagem econômica), checklists (apps infantis; mapeamento de TID), fluxo de seleção de mecanismo, prazo regulatório, triagem avançada, tabela comparativa de mecanismos, argumentação bilateral, 2 doutrinas, 2 regras SE-ENTÃO e jurimetria vazia',
    lote13.map((d) => ({ ...d, lote: 'LOTE-013' })),
    FONTES_LOTE13,
  );
  console.log('=== RELATÓRIO LOTE-013 ===');
  console.log(JSON.stringify(rel13, null, 2));
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
