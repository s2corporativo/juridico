// EJC — Varredura de poluição de captura (JS de WAF anti-bot) em toda a base
import { db } from '../src/lib/db';

const PADROES = ['f5_cspm', 'f5avr', 'document.cookie', 'window.document', '<script', 'javascript:', 'function()', 'var res=', 'setTimeout(', 'encodeURIComponent'];

async function main() {
  const docs = await db.knowledgeDocument.findMany({ select: { id: true, slug: true, lote: true, fonte: true, urlFonte: true, conteudo: true, metadados: true } });

  console.log('=== VARREDURA DE POLUIÇÃO DE CAPTURA ===');
  let poluidos = 0;
  for (const d of docs) {
    const corpo = `${d.conteudo}\n${d.metadados ?? ''}\n${d.fonte ?? ''}`;
    const achados = PADROES.filter((p) => corpo.includes(p));
    if (achados.length > 0) {
      poluidos++;
      console.log(`\n${d.slug} (lote ${d.lote ?? '?'}, fonte: ${d.fonte ?? '?'})`);
      console.log(`  padrões: ${achados.join(', ')}`);
      // localizar primeira ocorrência no conteudo
      const idx = d.conteudo.search(/f5_cspm|f5avr|<script/);
      if (idx >= 0) {
        const ini = Math.max(0, idx - 80);
        console.log(`  trecho (pos ${idx}/${d.conteudo.length}): ...${d.conteudo.slice(ini, idx + 200).replace(/\n/g, ' ')}...`);
      }
    }
  }
  console.log(`\nTotal de documentos poluídos: ${poluidos}`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
