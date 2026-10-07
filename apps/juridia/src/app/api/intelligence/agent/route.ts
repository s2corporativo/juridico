import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { registerDefaultAgentTools } from "@/lib/agent_tools";
import { runAgentLoop, resumeAgentLoop } from "@/lib/agent_loop";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

async function canAccessCase(caseId: string, user: { uid: string; role: string }): Promise<boolean> {
  const c = await db.case.findUnique({
    where: { id: caseId },
    include: { client: { select: { userId: true } } },
  });
  if (!c) return false;
  if (user.role === "admin") return true;
  return Boolean(c.client.userId && c.client.userId === user.uid);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null) as {
    action?: "run" | "resume";
    caseId?: string;
    facts?: string;
    runId?: string;
    decision?: "approve" | "reject" | "modify";
    modifiedData?: Record<string, unknown>;
    maxSteps?: number;
    tokensBudget?: number;
  } | null;

  if (!body?.caseId || !body.facts?.trim()) {
    return NextResponse.json({ error: "caseId e facts são obrigatórios" }, { status: 400 });
  }
  if (!(await canAccessCase(body.caseId, auth.user))) {
    return NextResponse.json({ error: "case_not_found_or_forbidden" }, { status: 403 });
  }

  registerDefaultAgentTools();

  try {
    if (body.action === "resume") {
      if (!body.runId || !body.decision) {
        return NextResponse.json({ error: "runId e decision são obrigatórios para resume" }, { status: 400 });
      }
      const result = await resumeAgentLoop({
        runId: body.runId,
        caseId: body.caseId,
        userId: auth.user.uid,
        facts: body.facts,
        decision: body.decision,
        modifiedData: body.modifiedData,
      });
      return NextResponse.json(result);
    }

    const result = await runAgentLoop({
      caseId: body.caseId,
      userId: auth.user.uid,
      facts: body.facts,
      maxSteps: body.maxSteps,
      tokensBudget: body.tokensBudget,
    });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "agent_error" }, { status: 500 });
  }
}
