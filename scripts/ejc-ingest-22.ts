// EJC — Ingestão SOMENTE do lote 022 (não re-ingere lotes anteriores, preserva versões — pipeline idempotente)
// Uso: bun scripts/ejc-ingest-22.ts
// LOTE-022: Jurimetria JEC (Juizado Especial Cível) BH/Betim — dados agregados REAIS da
// API Pública DataJud/CNJ (índice TJMG), consolidação Atlas Forense (anexo do cliente).
// Regra absoluta do lote: ESTATÍSTICAS — números 100% literais do arquivo-fonte;
// proibido usar processRows/timelineEvents (números de processos individuais).
// Verificação LGPD: scripts/lgpd-check-lote-022.ts (rodada antes desta ingestão).
import { ingestLote } from '../src/lib/ejc/ingest';
import lote22 from '../data/ejc/lote-022-jurimetria-jec';

const FONTES_LOTE22 = [
  'https://datajud-wiki.cnj.jus.br/ (API Pública DataJud/CNJ — índice TJMG; consolidação fornecida pelo cliente Atlas Forense no anexo "Demandas no Juizado Especial.zip" → jecDashboardData.ts; recorte 01/01/2025 a 26/08/2026; classe 436; coleta 25/08/2026, consolidação 26/08/2026; hashBaseProcessos 6b2e4af8e8fe7a135e56a91bed12447bee4f9afee76c902ea70e9cc1afa4deff — consulta 2026-08-26)',
];

async function main() {
  const rel22 = await ingestLote(
    'LOTE-022',
    'Jurimetria JEC (Juizado Especial Cível) — Belo Horizonte e Betim, classe 436, recorte 01/01/2025 a 26/08/2026: visão geral (summary — censo 50426/29357/4376/2776 e tempo observado médio/mediano), unidades judiciárias (unitStats — top 12 de 26), assuntos/causas frequentes (causeStats — top 20 agregado de 223 registros/103 causas), distribuição de duração (durationDistribution — 9 faixas completas), série mensal (timeline amostra movimento_observado + timelineCensus oficial_confirmado) e metodologia/fontes/limitações (meta completo com hashBaseProcessos, alertas literais, amostragem 200/recorte, 2026 parcial, tempo observado ≠ duração definitiva, consulta direta DataJud exige env DATAJUD_API_KEY com degradação honesta). TODOS os números literais do arquivo Atlas Forense (API Pública DataJud/CNJ — índice TJMG); ZERO inferências jurídicas; processRows/timelineEvents NÃO ingeridos (números de processos individuais); verificação LGPD executada (zero CPF/e-mail/telefone/partes — falso positivo único: intervalo de anos 2025-2026 em definição literal).',
    lote22.map((d) => ({ ...d, lote: 'LOTE-022' })),
    FONTES_LOTE22,
  );
  console.log('=== RELATÓRIO LOTE-022 ===');
  console.log(JSON.stringify(rel22, null, 2));

  console.log('=== RESUMO GERAL ===');
  console.log(`${rel22.lote}: pesquisados=${rel22.pesquisado} criados=${rel22.criados} atualizados=${rel22.atualizados} rejeitados=${rel22.rejeitados} duplicatasEvitadas=${rel22.duplicatasEvitadas} necessitaRevisao=${rel22.necessitaRevisao.length}`);
  for (const a of rel22.avisos) console.log(`  AVISO: ${a}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('ERRO NA INGESTÃO:', e);
    process.exit(1);
  });
