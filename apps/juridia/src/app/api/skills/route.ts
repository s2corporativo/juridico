import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import type { SkillDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

// GET exige sessão: skills são conteúdo proprietário/orientador do produto.
export async function GET(req: NextRequest) {
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;

  const items = await db.skill.findMany({ orderBy: { name: "asc" } });
  const dtos: SkillDTO[] = items.map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    category: s.category,
    description: s.description,
    content: s.content,
    locked: s.locked,
  }));
  return NextResponse.json({ skills: dtos });
}
