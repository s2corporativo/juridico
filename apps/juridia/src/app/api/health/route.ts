import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Public liveness probe. This endpoint deliberately does NOT claim readiness:
 * database, SSO, local LLM and Atlas integration require separate authenticated
 * checks before promotion to production.
 */
export async function GET() {
  return NextResponse.json(
    { status: "ok", service: "juridia", check: "liveness" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
