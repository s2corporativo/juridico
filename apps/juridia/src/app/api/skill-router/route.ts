import { NextRequest, NextResponse } from "next/server";
import { routeSkills } from "@/lib/skill_router";
import { logAuditEvent } from "@/lib/audit";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

// POST /api/skill-router — dado fatos do caso, retorna skills relevantes
export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  let body: { facts?: string; caseId?: string } = {};
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const facts = (body.facts || "").trim();
  if (facts.length < 30) {
    return NextResponse.json({ error: "Texto insuficiente (mín. 30 caracteres)" }, { status: 400 });
  }

  const result = await routeSkills(facts);

  await logAuditEvent({
    action: "skill_router",
    resource: "case",
    resourceId: body.caseId || null,
    metadata: {
      matchesCount: result.matches.length,
      area: result.area,
      issuesCount: result.issues.length,
      topSkill: result.matches[0]?.slug || null,
    },
  });

  return NextResponse.json({
    area: result.area,
    issues: result.issues,
    matches: result.matches.map((m) => ({
      slug: m.slug,
      name: m.name,
      area: m.area,
      version: m.version,
      matchScore: Math.round(m.matchScore * 100) / 100,
      matchedTriggers: m.matchedTriggers,
      content: m.content,
    })),
  });
}
