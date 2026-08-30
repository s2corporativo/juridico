// EJC — Auditoria de Integridade da Curadoria (CLI)
// Uso: bun scripts/ejc-audit-curadoria.ts
// Re-executa CHECK 1-10 sobre a base persistida + estrutura + taxonomia + LGPD +
// anti-invenção + duplicidade semântica + saúde do RAG. Somente leitura.
import { auditarCuradoria } from '../src/lib/ejc/auditoria';

async function main() {
  console.log('=== AUDITORIA DE INTEGRIDADE DA CURADORIA — EJC ===');
  const rel = await auditarCuradoria();

  console.log(`Gerado em: ${rel.geradoEm}`);
  console.log(`SCORE: ${rel.score}/100 — ${rel.veredito}`);
  console.log(`Base: ${rel.base.documentos} docs · ${rel.base.chunks} chunks · ${rel.base.relacionamentos} relacionamentos · ${rel.base.lotes} lotes`);
  console.log(`Confiabilidade: ${JSON.stringify(rel.base.confiabilidade)} · Status: ${JSON.stringify(rel.base.status)}`);
  console.log('');

  for (const secao of rel.secoes) {
    console.log(`--- ${secao.nome} [${secao.status}] ---`);
    if (secao.achados.length === 0) console.log('  ✓ sem achados (OK)');
    for (const a of secao.achados) {
      console.log(`  ${a.severidade === 'ERRO' ? '✗' : a.severidade === 'AVISO' ? '⚠' : a.severidade === 'INFO' ? 'ℹ' : '✓'} ${a.codigo} · ${a.titulo} (total: ${a.total})`);
      console.log(`     ${a.detalhe}`);
      for (const ex of a.exemplos) console.log(`       - ${ex}`);
    }
    console.log('');
  }

  process.exit(0);
}

main().catch((e) => {
  console.error('ERRO NA AUDITORIA:', e);
  process.exit(1);
});
