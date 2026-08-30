// EJC — Contexto dos 4 hits restantes de LGP-03 (somente leitura)
import { db } from '../src/lib/db';

async function main() {
  const alvos: { slug: string; termo: string }[] = [
    { slug: 'prazo-prescricao-revisional-bancaria-10-anos', termo: '2021023855' },
    { slug: 'prazo-embargos-declaracao-cpc-5-dias', termo: '1022-1026' },
    { slug: 'l14155-fraude-eletronica-alteracoes', termo: '1762355499' },
    { slug: 'resp-1363107-risco-integral-herman-benjamin', termo: '(2013002386' },
  ];

  for (const a of alvos) {
    const d = await db.knowledgeDocument.findUnique({ where: { slug: a.slug }, select: { slug: true, tipoDocumento: true, conteudo: true } });
    if (!d) continue;
    const idx = d.conteudo.indexOf(a.termo);
    const ini = Math.max(0, idx - 120);
    const fim = Math.min(d.conteudo.length, idx + a.termo.length + 120);
    console.log(`\n=== ${d.slug} (${d.tipoDocumento}) ===`);
    console.log(`...${d.conteudo.slice(ini, fim).replace(/\n/g, ' | ')}...`);
  }
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
