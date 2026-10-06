// OIDC discovery document — standard /.well-known/openid-configuration
import { NextResponse } from "next/server";
import { discoveryDocument } from "@/lib/oidc";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(discoveryDocument(), {
    headers: { "Cache-Control": "public, max-age=300" },
  });
}
