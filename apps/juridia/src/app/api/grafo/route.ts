import { NextRequest, NextResponse } from "next/server";
import { logAuditEvent } from "@/lib/audit";
import { buildSystemGraph, buildCaseGraph } from "@/lib/graph-agent";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/grafo?view=system|case&caseId=xxx
export async function GET(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  const url = new URL(req.url);
  const view = url.searchParams.get("view") || "system";
  const caseId = url.searchParams.get("caseId") || "";

  if (view === "system") {
    if (authUser.role !== "admin") {
      return NextResponse.json({ error: "system_graph_admin_only" }, { status: 403 });
    }
    if (process.env.NODE_ENV === "production" && process.env.JURIDIA_RUNTIME_GRAPH_ENABLED !== "true") {
      return NextResponse.json({ error: "system_graph_disabled_in_production" }, { status: 503 });
    }
    const graph = await buildSystemGraph();
    await logAuditEvent({
      action: "grafo_query",
      resource: "graph",
      metadata: { view: "system", nodes: graph.stats.totalNodes, edges: graph.stats.totalEdges },
    });
    return NextResponse.json(graph);
  }

  if (view === "case") {
    if (!caseId) {
      return NextResponse.json({ error: "caseId obrigatório para view=case" }, { status: 400 });
    }
    const permitted = await db.case.findFirst({
      where: {
        id: caseId,
        ...(authUser.role === "admin" ? {} : { client: { is: { userId: authUser.uid } } }),
      },
      select: { id: true },
    });
    if (!permitted) return NextResponse.json({ error: "case_not_found" }, { status: 404 });
    const graph = await buildCaseGraph(caseId);
    await logAuditEvent({
      action: "grafo_query",
      resource: "graph",
      resourceId: caseId,
      metadata: { view: "case", nodes: graph.stats.totalNodes, edges: graph.stats.totalEdges },
    });
    return NextResponse.json(graph);
  }

  return NextResponse.json({ error: "view inválido: use 'system' ou 'case'" }, { status: 400 });
}
