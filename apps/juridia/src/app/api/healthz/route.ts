import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Liveness (F1.4): o processo está de pé? Não toca em dependências — serve para
 * o Caddy/supervisor saberem que o app responde. Verificação de dependências
 * (banco, Atlas) fica no /api/readyz.
 */
export async function GET() {
  return NextResponse.json(
    { ok: true, service: "juridia", uptimeSeconds: Math.round(process.uptime()) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
