import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { JURIDIA_AGENTS } from "@/lib/agent-registry";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;
  return NextResponse.json({ agents: JURIDIA_AGENTS, policy: "Agentes geram rascunhos auxiliares; revisão humana permanece obrigatória." });
}
