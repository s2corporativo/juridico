// EJC — Correção de curadoria: normalização de tags fora do formato canônico
// Uso: bun scripts/ejc-fix-tags.ts
// Regra (item 20 da missão): toda tag deve seguir o formato <area>/<subarea>.
// Tags malformadas ("stj", "checklist", "doutrina", "stj-tema-repetitivo" etc.) são
// sinonímia/redundância (a informação equivalente já vive em tipoDocumento ou metadados)
// e são substituídas pelo par <area>/<subarea> do próprio documento (adicionado apenas
// se ainda não presente). Idempotente: rodar 2× não muda nada.
import { db } from '../src/lib/db';

const RE_TAG = /^[a-z0-9-]+\/[a-z0-9-]+$/;

async function main() {
  const docs = await db.knowledgeDocument.findMany({ select: { id: true, slug: true, area: true, subarea: true, tags: true } });

  let alterados = 0;
  const log: string[] = [];

  for (const d of docs) {
    if (!d.tags) continue;
    let arr: unknown;
    try {
      arr = JSON.parse(d.tags);
    } catch {
      continue; // já coberto pela auditoria (EST-09)
    }
    if (!Array.isArray(arr)) continue;

    const tags = arr.filter((t): t is string => typeof t === 'string');
    const malformadas = tags.filter((t) => !RE_TAG.test(t));
    if (malformadas.length === 0) continue;

    const nova = tags.filter((t) => RE_TAG.test(t));
    const parProprio = `${d.area}/${d.subarea ?? 'geral'}`;
    if (RE_TAG.test(parProprio) && !nova.includes(parProprio)) nova.push(parProprio);

    await db.knowledgeDocument.update({ where: { id: d.id }, data: { tags: JSON.stringify([...new Set(nova)]) } });
    alterados++;
    log.push(`${d.slug}: removidas [${malformadas.join(', ')}] → garante "${parProprio}"`);
  }

  console.log(`=== NORMALIZAÇÃO DE TAGS ===`);
  console.log(`Documentos alterados: ${alterados}`);
  for (const l of log) console.log('  ' + l);

  // Re-contagem de validação imediata
  const restantes = await db.knowledgeDocument.findMany({ select: { slug: true, tags: true } });
  let fora = 0;
  for (const d of restantes) {
    if (!d.tags) continue;
    try {
      const arr = JSON.parse(d.tags) as unknown[];
      if (!Array.isArray(arr)) continue;
      for (const t of arr) if (typeof t === 'string' && !RE_TAG.test(t)) {
        fora++;
        console.log(`  RESTANTE: ${d.slug}: "${t}"`);
      }
    } catch { /* ignorado */ }
  }
  console.log(`Tags fora do formato restantes: ${fora}`);
  process.exit(0);
}

main().catch((e) => {
  console.error('ERRO:', e);
  process.exit(1);
});
