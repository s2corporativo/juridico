import { PrismaClient } from "@prisma/client";
import { writeFile, mkdir, rename } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { reviewCatalogueMaturity } from "../src/lib/skill-maturation";

/**
 * Rotina independente e SOMENTE LEITURA. A curadoria propõe correções; jamais
 * aprova, retira, reescreve fatos de clientes ou modifica SkillVersion.
 * Não enviar texto jurídico sensível ao relatório; salvar apenas sinais.
 */
async function main() {
  const db = new PrismaClient();
  try {
    const versions = await db.skillVersion.findMany({
      where: { status: { in: ["draft", "review", "approved"] } },
      orderBy: [{ slug: "asc" }, { version: "desc" }],
      take: 10000,
      select: {
        id:true,slug:true,version:true,area:true,description:true,content:true,
        triggers:true,requiredSources:true,forbiddenClaims:true,status:true,
      },
    });
    const latest = new Map<string,typeof versions[number]>();
    for (const row of versions) if (!latest.has(row.slug)) latest.set(row.slug,row);
    const findings = reviewCatalogueMaturity([...latest.values()], 500);
    const report = {
      version:1, generatedAt:new Date().toISOString(), safeReadOnly:true,
      inspected:findings.stats.total, ...findings,
    };
    const target=process.env.JURIDIA_MATURATION_REPORT?.trim();
    if (!target) {
      process.stdout.write(JSON.stringify({stats:report.stats,warning:report.warning})+"\n");
      return;
    }
    if (!process.env.JURIDIA_ENV?.match(/^(staging|qa)$/) || !target.startsWith("/var/lib/atlas-juridico/"))
      throw new Error("unsafe_maturation_report_destination");
    const path=resolve(target);
    await mkdir(dirname(path),{recursive:true,mode:0o700});
    const tmp=path+".tmp."+process.pid;
    await writeFile(tmp,JSON.stringify(report,null,2)+"\n",{mode:0o600});
    await rename(tmp,path);
    process.stdout.write(JSON.stringify({status:"report_written",count:report.inspected})+"\n");
  } finally { await db.$disconnect(); }
}
await main();
