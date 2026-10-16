import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { selectLatestApprovedSkills, inspectApprovedSkill, summarizeApprovalAccountLinks } from "@/lib/skill-governance";
import type { SkillDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * Normal catalog: only versions passing the current technical admission gate
 * can be offered for drafting; approval metadata is not proof of human review. Legacy skills remain in DB for review, not prompts.
 * Audit: admin-only metadata counts, never legal text or user records.
 */
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;
  const query = new URL(req.url).searchParams;
  const auditRequested = query.get("audit") === "1";
  if (auditRequested && auth.user.role !== "admin") {
    return NextResponse.json({ error: "Permissão administrativa necessária" }, { status: 403 });
  }
  const versioned = await db.skillVersion.findMany({
    orderBy: [{ slug: "asc" }, { version: "desc" }],
  });
  const eligibleVersions = selectLatestApprovedSkills(versioned);
  if (auditRequested) {
    const [legacyCount, accounts] = await Promise.all([
      db.skill.count(),
      db.user.findMany({ select: { id: true, email: true } }),
    ]);
    const approvalAccountLinks = summarizeApprovalAccountLinks(eligibleVersions, accounts);
    const stateCounts: Record<string, number> = {};
    const flagged: { slug: string; version: number; area: string; issues: string[] }[] = [];
    const eligible = eligibleVersions.map((skill) => ({ slug: skill.slug, version: skill.version, area: skill.area }));
    for (const skill of versioned) {
      stateCounts[skill.status] = (stateCounts[skill.status] || 0) + 1;
      const issues = inspectApprovedSkill(skill);
      if (issues.length) flagged.push({ slug: skill.slug, version: skill.version, area: skill.area, issues });
    }
    return NextResponse.json({
      legacyCount,
      versionedCount: versioned.length,
      statuses: stateCounts,
      usableCount: eligible.length,
      usable: eligible,
      flagged,
      approvalAccountLinks,
      warning: "Contagem de elegibilidade é técnica. Vínculo com conta interna também não comprova revisão jurídica individual, vigência das fontes ou habilitação profissional.",
    });
  }
  const skills: SkillDTO[] = eligibleVersions.map((skill) => ({
    id: skill.id,
    slug: skill.slug,
    name: skill.description,
    category: skill.area,
    description: skill.description,
    content: skill.content,
    locked: true,
  }));
  return NextResponse.json({ skills });
}
