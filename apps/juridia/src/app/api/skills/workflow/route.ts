import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { canonicalSkillManifestHash } from "@/lib/skill-manifest";

export const dynamic = "force-dynamic";
type Command = {
  action?: "create" | "submit" | "approve" | "return";
  id?: string; reason?: string; skill?: Record<string, unknown>;
};
const arrays = ["requiredSources","requiredEvidence","rules","exceptions","forbiddenClaims","allowedTools"] as const;
function bad(error: string, status = 400) { return NextResponse.json({ error }, { status }); }
function legalPayload(raw: Record<string, unknown>) {
  const slug = String(raw.slug ?? "").trim().toLowerCase();
  const area = String(raw.area ?? "").trim().toLowerCase();
  const description = String(raw.description ?? "").trim();
  const content = String(raw.content ?? "").trim();
  if (!/^[a-z0-9][a-z0-9-]{2,79}$/.test(slug) ||
      !/^[a-z][a-z-]{2,35}$/.test(area) ||
      description.length < 10 || description.length > 400 ||
      content.length < 30 || content.length > 15000) throw new Error("invalid_draft");
  const triggers = raw.triggers ?? { keywords: [] };
  const outputSchema = raw.outputSchema ?? {};
  if (!triggers || typeof triggers !== "object" || Array.isArray(triggers) ||
      !outputSchema || typeof outputSchema !== "object" || Array.isArray(outputSchema))
    throw new Error("invalid_draft");
  const payload: Record<string,string> = {
    slug, area, description, content, triggers: JSON.stringify(triggers),
    outputSchema: JSON.stringify(outputSchema),
  };
  for (const key of arrays) {
    const values = raw[key] ?? [];
    if (!Array.isArray(values) || values.length > 30 ||
        values.some((v) => typeof v !== "string" || v.length > 1000))
      throw new Error("invalid_draft");
    payload[key] = JSON.stringify(values);
  }
  return payload;
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;
  const current = await db.user.findUnique({ where: { id: auth.user.uid },
    select: { id: true, role: true, oabNumero: true, oabEstado: true } });
  if (!current || !["admin","advogado"].includes(current.role) ||
      !/^\d{3,9}$/.test(current.oabNumero ?? "") ||
      !/^[A-Z]{2}$/.test(current.oabEstado ?? "")) return bad("registered_legal_reviewer_required",403);
  const raw = await req.text();
  if (raw.length > 25000) return bad("payload_too_large",413);
  let body: Command;
  try { body = JSON.parse(raw) as Command; } catch { return bad("invalid_json"); }
  if (!body || !["create","submit","approve","return"].includes(body.action ?? "")) return bad("invalid_action");
  const reason = (body.reason ?? "").trim();
