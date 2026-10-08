import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;

  const [documents, skills, templates, searches, cases, clients] = await Promise.all([
    db.document.count(),
    db.skill.count(),
    db.template.count(),
    db.jurisprudenceSearch.count(),
    db.case.count(),
    db.client.count(),
  ]);

  return NextResponse.json({
    documents,
    skills,
    templates,
    searches,
    cases,
    clients,
  });
}
