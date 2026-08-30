// Temp dump (Task 12-b) — lista slugs/títulos/áreas da base
import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
const docs = await db.knowledgeDocument.findMany({
  select: { slug: true, titulo: true, area: true, subarea: true, tipoDocumento: true, lote: true, confiabilidade: true, status: true },
  orderBy: { createdAt: 'asc' },
});
for (const d of docs) console.log(`${d.lote ?? '-'} | ${d.area}/${d.subarea ?? '-'} | ${d.tipoDocumento} | ${d.confiabilidade} | ${d.status} | ${d.slug} | ${d.titulo}`);
console.log('TOTAL', docs.length);
await db.$disconnect();
