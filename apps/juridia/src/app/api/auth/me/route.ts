// GET /api/auth/me — identidade da sessão atual (ou 401).
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const guard = await requireAuth(req);
  if (!guard.ok) return guard.response;
  return NextResponse.json({
    user: { email: guard.user.email, name: guard.user.name, role: guard.user.role },
  });
}
