import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { selectLatestApprovedSkills } from "@/lib/skill-governance";
import { retrieveLegalSkills, type LegalCandidate } from "@/lib/legal-intelligence-core";
import { reviewCatalogueMaturity } from "@/lib/skill-maturation";

export const dynamic = "force-dynamic";
const select = {
  id: true, slug: true, version: true, area: true, description: true, content: true,
  triggers: true, requiredSources: true, requiredEvidence: true,
  rules: true, exceptions: true, forbiddenClaims: true,
  allowedTools: true, outputSchema: true,
  status: true, approvedAt: true, approvedBy: true,
  contentHash: true, manifestHash: true, authorUserId: true, reviewerUserId: true,
} as const;

/** Admin-only, read-only maturity scan. No case facts are transmitted or saved. */
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, { admin: true });
  if (!auth.ok) return auth.response;
  const latest = await db.skillVersion.findMany({
    where: { status: { in: ["draft","review","approved"] } },
    select, orderBy: [{ slug: "asc" }, { version: "desc" }], take: 10000,
  });
  const slugs = new Set<string>();
  const candidates = latest.filter((v) => {
    if (slugs.has(v.slug)) return false;
    slugs.add(v.slug);
    return true;
  });
  const report = reviewCatalogueMaturity(candidates, 100);
  return NextResponse.json({
    ...report,
    actionable: report.stats.needsReview + report.stats.needsEnrichment,
    auditKind: "mechanical_completeness_not_legal_approval",
  }, { headers: { "Cache-Control": "private, no-store" } });
}

/** Local non-generative analysis. Only approved + integrity-verified skills are ranked. */
export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;
  const raw = await req.text();
  if (raw.length > 24000) return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  let body: { facts?: unknown; topK?: unknown };
  try { body = JSON.parse(raw) as typeof body; } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  if (typeof body.facts !== "string" || body.facts.trim().length < 30 || body.facts.length > 12000)
    return NextResponse.json({ error: "insufficient_or_oversized_facts" }, { status: 400 });
  const topK = typeof body.topK === "number" ? Math.min(10, Math.max(1, Math.floor(body.topK))) : 6;
  const rows = await db.skillVersion.findMany({
    where: { status: "approved" }, select,
    orderBy: [{ slug: "asc" }, { version: "desc" }], take: 10000,
  });
  const candidates: LegalCandidate[] = selectLatestApprovedSkills(rows);
  const result = retrieveLegalSkills(body.facts, candidates, topK);
  return NextResponse.json({
    engine: "legal-intelligence-v1-local",
    ...result, eligibleCatalogSize: candidates.length,
    requiresHumanReview: true, storesFacts: false,
  }, { headers: { "Cache-Control": "private, no-store" } });
}
