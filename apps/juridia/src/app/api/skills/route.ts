import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { isEligibleSkillVersion, inspectApprovedSkill } from "@/lib/skill-governance";
import type { SkillDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * Normal catalog: only human-approved, hash-valid skills can be offered
 * for use in legal drafting. Legacy skills remain in DB for review, not prompts.
 * Audit: admin-only metadata counts, never legal text or user records.
 */
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;
  const query = new URL(req.url).searchParams;
  const versioned = await db.skillVersion.findMany({
    orderBy: [{ slug: "asc" }, { version: "desc" }],
  });
  if (query.get("audit") === "1") {
    if (auth.user.role !== "admin") {
      return NextResponse.json({ error: "Permissão administrativa necessária" }, { status: 403 });
    }
    const legacyCount = await db.skill.count();
    const stateCounts: Record<string, number> = {};
    const flagged: { slug: string; version: number; area: string; issues: string[] }[] = [];
    const seen = new Set<string>();
    const eligible: { slug: string; version: number; area: string }[] = [];
    for (const skill of versioned) {
      stateCounts[skill.status] = (stateCounts[skill.status] || 0) + 1;
      const issues = inspectApprovedSkill(skill);
      if (issues.length) flagged.push({ slug: skill.slug, version: skill.version, area: skill.area, issues });
      if (!seen.has(skill.slug) && isEligibleSkillVersion(skill)) {
        seen.add(skill.slug);
        eligible.push({ slug: skill.slug, version: skill.version, area: skill.area });
      }
    }
    return NextResponse.json({
      legacyCount,
      versionedCount: versioned.length,
      statuses: stateCounts,
      usableCount: eligible.length,
      usable: eligible,
      flagged,
      warning: "Aprovação atribuída por scripts ou hash inválido não habilita uma skill. Aprovação jurídica individual é necessária.",
    });
  }
  const latest = new Map<string, (typeof versioned)[number]>();
  for (const skill of versioned) {
    if (isEligibleSkillVersion(skill) && !latest.has(skill.slug)) latest.set(skill.slug, skill);
  }
  const skills: SkillDTO[] = [...latest.values()].map((skill) => ({
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
