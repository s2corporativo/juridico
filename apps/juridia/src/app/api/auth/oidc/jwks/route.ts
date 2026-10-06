// JWKS endpoint — returns the symmetric key descriptor.
// HS256 is symmetric; Atlas validates signatures via the /verify endpoint instead.
import { NextResponse } from "next/server";
import { jwksResponse } from "@/lib/oidc";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(jwksResponse(), {
    headers: { "Cache-Control": "public, max-age=300" },
  });
}
