import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  const [users, docs, skills, templates, searches] = await Promise.all([
    db.user.count(),
    db.document.count(),
    db.skill.count(),
    db.template.count(),
    db.jurisprudenceSearch.count(),
  ]);

  const demoUser = await db.user.findUnique({ where: { email: "demo@juridia.com.br" } });

  return NextResponse.json({
    totalUsers: 92034 + users, // estatística de marketing + demo
    totalDocuments: 35291483 + docs,
    publicInstitutions: 153,
    statesServed: 27, // 26 + DF
    lawOffices: 5217,
    skills,
    templates,
    searches,
    demo: demoUser
      ? {
          plan: demoUser.plan,
          minutasUsed: demoUser.minutasUsed,
          minutasLimit: demoUser.minutasLimit,
          remaining: Math.max(0, demoUser.minutasLimit - demoUser.minutasUsed),
        }
      : null,
  });
}
