import { createHash } from "node:crypto";
import { db } from "../src/lib/db";
import { buildOfficeSkillCatalog } from "../src/lib/office_skill_catalog";

async function main() {
  const catalog = buildOfficeSkillCatalog();
  let created = 0;
  let unchanged = 0;

  for (let offset = 0; offset < catalog.length; offset += 100) {
    const batch = catalog.slice(offset, offset + 100);
    for (const s of batch) {
      const hash = createHash("sha256").update(s.content).digest("hex");
      const existing = await db.skillVersion.findUnique({ where: { slug_version: { slug: s.slug, version: 1 } } });
      if (existing?.contentHash === hash) { unchanged++; continue; }
      await db.skillVersion.upsert({
        where: { slug_version: { slug: s.slug, version: 1 } },
        update: {
          area: s.area,
          description: s.description,
          content: s.content,
          triggers: JSON.stringify({ keywords: s.triggers }),
          requiredSources: JSON.stringify(s.requiredSources),
          requiredEvidence: JSON.stringify(s.requiredEvidence),
          rules: JSON.stringify(s.rules),
          exceptions: JSON.stringify(s.exceptions),
          forbiddenClaims: JSON.stringify(s.forbiddenClaims),
          allowedTools: JSON.stringify(s.allowedTools),
          outputSchema: JSON.stringify(s.outputSchema),
          contentHash: hash,
          status: "approved",
          approvedBy: "system:atlas-office-catalog-v1",
          approvedAt: new Date(),
        },
        create: {
          slug: s.slug,
          version: 1,
          area: s.area,
          description: s.description,
          content: s.content,
          triggers: JSON.stringify({ keywords: s.triggers }),
          requiredSources: JSON.stringify(s.requiredSources),
          requiredEvidence: JSON.stringify(s.requiredEvidence),
          rules: JSON.stringify(s.rules),
          exceptions: JSON.stringify(s.exceptions),
          forbiddenClaims: JSON.stringify(s.forbiddenClaims),
          allowedTools: JSON.stringify(s.allowedTools),
          outputSchema: JSON.stringify(s.outputSchema),
          contentHash: hash,
          status: "approved",
          approvedBy: "system:atlas-office-catalog-v1",
          approvedAt: new Date(),
        },
      });
      created++;
    }
    process.stdout.write(`\r${Math.min(offset + batch.length, catalog.length)}/${catalog.length}`);
  }

  console.log(`\nSkills prontas: ${catalog.length}; gravadas/atualizadas: ${created}; inalteradas: ${unchanged}`);
}

main().finally(() => db.$disconnect());
