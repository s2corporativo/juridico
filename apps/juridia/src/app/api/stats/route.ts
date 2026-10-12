import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  const [users, docs, skills, templates, searches, lawyer] = await Promise.all([
    db.user.count(),
    db.document.count({ where: { userId: authUser.uid } }),
    db.skill.count(),
    db.template.count(),
    db.jurisprudenceSearch.count({ where: { userId: authUser.uid } }),
    db.user.findUnique({
      where: { id: authUser.uid },
      select: { plan: true, minutasUsed: true, minutasLimit: true },
    }),
  ]);

  // Não inventar números de usuários, minutas ou instituições.
  // Campos legados mantidos por compatibilidade; zero indica ausência
  // de levantamento verificável (não extrapolar dados).
  return NextResponse.json({
    totalUsers: users,
    totalDocuments: docs,
    publicInstitutions: 0,
    statesServed: 0,
    lawOffices: 0,
    skills,
    templates,
    searches,
    // Chave "demo" mantida para a UI existente, mas representa o usuário real.
    demo: lawyer ? {
      plan: lawyer.plan,
      minutasUsed: lawyer.minutasUsed,
      minutasLimit: lawyer.minutasLimit,
      remaining: Math.max(0, lawyer.minutasLimit - lawyer.minutasUsed),
    } : null,
  });
}
