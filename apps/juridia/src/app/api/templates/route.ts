import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { TemplateDTO, TemplateField } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  const items = await db.template.findMany({ orderBy: { name: "asc" } });
  const dtos: TemplateDTO[] = items.map((t) => ({
    id: t.id,
    slug: t.slug,
    name: t.name,
    category: t.category,
    description: t.description,
    icon: t.icon,
    fields: safeParseFields(t.fields),
  }));
  return NextResponse.json({ templates: dtos });
}

function safeParseFields(raw: string): TemplateField[] {
  try {
    return JSON.parse(raw) as TemplateField[];
  } catch {
    return [];
  }
}
