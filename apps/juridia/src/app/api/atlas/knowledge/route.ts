import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { atlasRequest, fetchAtlasKnowledgeSnapshot } from "@/lib/atlas_client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Única fronteira pública de leitura do conhecimento Atlas para o JuridIA.
 * JWT/sessão de usuário obrigatório. O segredo da API Atlas nunca vai ao navegador.
 * Não disponibiliza texto integral nem peças privadas de processos.
 */
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;

  const view = req.nextUrl.searchParams.get("view") ?? "snapshot";
  if (view === "health") {
    const response = await atlasRequest<{
      ok: true; contractVersion: 1; lastRunStatus: string;
      lastRunStartedAt: string | null; lastRunFinishedAt: string | null;
      lastRunCounts: { discovered: number; queued: number; failed: number } | null;
    }>("/knowledge/health");
    if (!response.ok) return NextResponse.json({ ok: false, status: "unavailable", error: response.error }, { status: 503 });
    return NextResponse.json({ ...response.data, source: "atlas_forense" }, { headers: { "Cache-Control": "no-store" } });
  }

  if (view !== "snapshot") {
    return NextResponse.json({ ok: false, error: "invalid_view" }, { status: 400 });
  }
  const pageInput = req.nextUrl.searchParams.get("page") ?? "0";
  const version = req.nextUrl.searchParams.get("version") ?? undefined;
  if (!/^(?:0|[1-9]\d{0,2})$/.test(pageInput)) {
    return NextResponse.json({ ok: false, error: "invalid_page" }, { status: 400 });
  }
  if (version !== undefined && !/^v1:[a-f0-9]{64}$/.test(version)) {
    return NextResponse.json({ ok: false, error: "invalid_version" }, { status: 400 });
  }
  const page = Number(pageInput);
  if (page > 0 && !version) {
    return NextResponse.json({ ok: false, error: "snapshot_version_required" }, { status: 400 });
  }
  const response = await fetchAtlasKnowledgeSnapshot(page, version);
  if (!response.ok) {
    return NextResponse.json(
      { ok: false, source: "atlas_forense", error: response.error },
      { status: response.status === 409 ? 409 : 503 },
    );
  }
  return NextResponse.json(
    { ...response.data, source: "atlas_forense" },
    { headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } },
  );
}
