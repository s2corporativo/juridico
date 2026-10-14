import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAtlasConfigured } from "@/lib/atlas_client";

export const dynamic = "force-dynamic";

type Check = { ok: boolean; detail?: string };

/**
 * Readiness (F1.4): dependências essenciais para atender tráfego com qualidade.
 * - database: bloqueante (503 quando indisponível).
 * - atlasBrain: degradação reportada, não bloqueante — sem integração o portal
 *   continua funcionando em modo degradado sinalizado.
 * Ver também: GET /api/healthz (liveness simples).
 */
export async function GET() {
  const checks: Record<string, Check> = {};
  let ready = true;

  try {
    await Promise.race([
      db.$queryRaw`SELECT 1`,
      new Promise((_resolve, reject) => setTimeout(() => reject(new Error("database_check_timeout")), 3_000)),
    ]);
    checks.database = { ok: true };
  } catch (error) {
    ready = false;
    checks.database = { ok: false, detail: error instanceof Error ? error.message : "database_error" };
  }

  const atlasConfigured = isAtlasConfigured();
  checks.atlasBrain = atlasConfigured
    ? { ok: true }
    : { ok: false, detail: "ATLAS_API_URL/ATLAS_BRAIN_API_TOKEN ausentes — integração com Atlas em modo degradado" };

  return NextResponse.json(
    { ok: ready, checks, uptimeSeconds: Math.round(process.uptime()) },
    { status: ready ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}
