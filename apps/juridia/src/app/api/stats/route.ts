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
    db.document.count({ where: authUser.role === "admin" ? {} : { userId: authUser.uid } }),
    db.skill.count(),
    db.template.count(),
    db.jurisprudenceSearch.count(),
  ]);

  const viewer = await db.user.findUnique({
    where: { id: authUser.uid },
    select: { plan: true, minutasUsed: true, minutasLimit: true },
  });

  return NextResponse.json({
    // Verified operational counts only; never merge fabricated marketing metrics.
    totalUsers: authUser.role === "admin" ? users : 1,
    totalDocuments: docs,
    publicInstitutions: 0, // not tracked in this database
    statesServed: 0,
    lawOffices: 0,
    skills,
    templates,
    searches,
    demo: null,
    viewer: viewer
      ? {
          plan: viewer.plan,
          minutasUsed: viewer.minutasUsed,
          minutasLimit: viewer.minutasLimit,
          remaining: Math.max(0, viewer.minutasLimit - viewer.minutasUsed),
        }
      : null,
  });
}
