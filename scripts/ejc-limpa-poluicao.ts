// EJC — Limpeza de poluição de captura (script WAF F5 BigIP raspado junto com o texto oficial)
// Uso: bun scripts/ejc-limpa-poluicao.ts
// Estratégia: remover TUDO entre </html> (fim do texto oficial) e </script> inclusive,
// preservando a NOTA EJC editorial posterior. Regenera os chunks e incrementa versão.
import { db } from '../src/lib/db';
import { gerarChunks } from '../src/lib/ejc/rag';

async function main() {
  const docs = await db.knowledgeDocument.findMany({
    where: { conteudo: { contains: 'f5_cspm' } },
    select: { id: true, slug: true, titulo: true, tipoDocumento: true, versao: true, conteudo: true },
  });

  console.log(`Documentos com poluição F5: ${docs.length}`);
  for (const d of docs) {
    const antes = d.conteudo.length;
    const idxHtml = d.conteudo.lastIndexOf('</html>');
    const idxScriptFim = d.conteudo.lastIndexOf('</script>');
    let limpo = d.conteudo;
    if (idxHtml >= 0 && idxScriptFim > idxHtml) {
      limpo = d.conteudo.slice(0, idxHtml + '</html>'.length) + d.conteudo.slice(idxScriptFim + '</script>'.length);
    } else {
      // fallback: remover o bloco <script ...>...</script> diretamente
      limpo = d.conteudo.replace(/<script[^>]*f5_cspm[\s\S]*?<\/script>/g, '');
    }
    limpo = limpo.replace(/\n{3,}/g, '\n\n').trimEnd();

    const chunks = gerarChunks(d.titulo, d.tipoDocumento, limpo);
    await db.knowledgeDocument.update({ where: { id: d.id }, data: { conteudo: limpo, versao: { increment: 1 } } });
    await db.knowledgeChunk.deleteMany({ where: { documentId: d.id } });
    await db.knowledgeChunk.createMany({
      data: chunks.map((c, i) => ({ documentId: d.id, ordem: i, contexto: c.contexto, texto: c.texto, palavras: c.texto.split(/\s+/).length })),
    });
    console.log(`  ${d.slug}: ${antes} → ${limpo.length} chars (removidos ${antes - limpo.length}), ${chunks.length} chunks regenerados, versão → ${d.versao + 1}`);
  }
  process.exit(0);
}

main().catch((e) => {
  console.error('ERRO:', e);
  process.exit(1);
});
