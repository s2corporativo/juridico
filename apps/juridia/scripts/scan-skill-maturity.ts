import { db } from "../src/lib/db";
import { reviewCatalogueMaturity } from "../src/lib/skill-maturation";

async function main() {
  const versions = await db.skillVersion.findMany({take:10000,orderBy:[{slug:"asc"},{version:"desc"}]});
  const report = reviewCatalogueMaturity(versions,250);
  console.log(JSON.stringify({engine:"juridia-maturation-local",generatedAt:new Date().toISOString(),changesApprovals:false,...report},null,2));
}
try { await main(); } finally { await db.$disconnect(); }
