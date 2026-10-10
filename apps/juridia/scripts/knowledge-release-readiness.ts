/**
 * Command: DATABASE_URL=file:/absolute/staging.db bun scripts/knowledge-release-readiness.ts
 * No writes. Exit code 2 while human/legal/external gates are unproven.
 */
import { db } from "../src/lib/db";
import { evaluateKnowledgeReadiness, type KnowledgeMetrics } from "../src/lib/knowledge-readiness";

function officialHttps(value: string | null): boolean {
  if (!value) return false;
  try {
    const u = new URL(value);
    return u.protocol === "https:" && !u.username && !u.password &&
      (u.hostname.endsWith(".gov.br") || u.hostname.endsWith(".jus.br"));
  } catch { return false; }
}

async function main() {
  const cutoff = new Date(Date.now() - 30 * 86_400_000);
  const [sources, skills, docsMissingUrl, templatesTotal] = await Promise.all([
    db.legalSource.findMany({
      select: { revisadoPor: true, urlOficial: true, vigente: true, dataConsulta: true, hashConteudo: true, textoTrecho: true },
    }),
    db.skillVersion.findMany({ select: { status: true, approvedBy: true, approvedAt: true } }),
    db.knowledgeDocument.count({ where: { OR: [{ urlFonte: null }, { urlFonte: "" }] } }),
    db.template.count(),
  ]);
  const reviewed = sources.filter(source =>
    /^human:[A-Za-z0-9_-]+$/.test(source.revisadoPor ?? "") &&
    source.vigente &&
    officialHttps(source.urlOficial) &&
    (source.textoTrecho?.trim().length ?? 0) >= 25
  );
  const metrics: KnowledgeMetrics = {
    sourcesTotal: sources.length,
    sourcesReviewed: reviewed.length,
    sourcesUnreviewed: sources.length - reviewed.length,
    sourcesCurrent: sources.filter(source => source.vigente && source.dataConsulta && source.dataConsulta >= cutoff).length,
    sourcesWithBadUrl: sources.filter(source => !officialHttps(source.urlOficial)).length,
    skillsTotal: skills.length,
    skillsHumanApproved: skills.filter(s => s.status === "approved" &&
      /^human:[A-Za-z0-9_-]+$/.test(s.approvedBy ?? "") && s.approvedAt).length,
    skillsSystemApproved: skills.filter(s => s.status === "approved" && !/^human:/.test(s.approvedBy ?? "")).length,
    documentsWithoutOrigin: docsMissingUrl,
    templatesTotal,
    privateArchiveConfigured: Boolean(process.env.JURIDIA_PRIVATE_UPLOAD_ROOT),
    privateArchiveEncrypted: /^[a-fA-F0-9]{64}$/.test(process.env.JURIDIA_PRIVATE_UPLOAD_KEY ?? ""),
    // Synthetic model tests and operator-supplied numbers never count as lawyer signoff.
    goldCaseHumanReviewCount: 0,
  };
  const report = evaluateKnowledgeReadiness(metrics);
  console.log(JSON.stringify(report, null, 2));
  process.exitCode = report.releaseBlocked ? 2 : 0;
}
main().catch(error => {
  console.error("KNOWLEDGE_RELEASE_GATE_FAILED", error instanceof Error ? error.name : "unknown");
  process.exitCode = 3;
}).finally(async () => { await db.$disconnect(); });
