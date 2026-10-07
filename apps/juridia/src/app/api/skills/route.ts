import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import type { SkillDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

// Catálogo operacional: expõe somente a versão aprovada mais recente de cada skill.
// Edição, versionamento e aprovação ficam em /api/skills/versions.
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;

  const area = new URL(req.url).searchParams.get("area") || undefined;
  const versions = await db.skillVersion.findMany({
    where: { status: "approved", ...(area ? { area } : {}) },
    orderBy: [{ slug: "asc" }, { version: "desc" }],
    select: {
      id: true,
      slug: true,
      version: true,
      area: true,
      description: true,
    },
  });

  const latest = new Map<string, (typeof versions)[number]>();
  for (const skill of versions) {
    if (!latest.has(skill.slug)) latest.set(skill.slug, skill);
  }

  const skills: SkillDTO[] = [...latest.values()].map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.description,
    category: s.area,
    description: s.description,
    content: "",
    locked: true,
  }));

  return NextResponse.json({ skills, total: skills.length });
}
