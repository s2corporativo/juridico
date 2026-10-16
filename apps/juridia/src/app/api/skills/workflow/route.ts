import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { canonicalSkillManifestHash } from "@/lib/skill-manifest";

export const dynamic = "force-dynamic";
type Command = {
  action?: "create" | "submit" | "approve" | "return" | "claim";
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
  if (!body || !["create","submit","approve","return","claim"].includes(body.action ?? "")) return bad("invalid_action");
  const reason = (body.reason ?? "").trim();

  if (body.action === "create") {
    if (!body.skill) return bad("skill_required");
    let data: Record<string,string>;
    try { data = legalPayload(body.skill); } catch { return bad("invalid_draft"); }
    try {
      const created = await db.$transaction(async (tx) => {
        const last = await tx.skillVersion.findFirst({ where: { slug: data.slug },
          orderBy: { version: "desc" }, select: { version: true } });
        const version = (last?.version ?? 0) + 1;
        return tx.skillVersion.create({ data: {
          slug: data.slug, version, area: data.area, description: data.description,
          content: data.content, triggers: data.triggers, outputSchema: data.outputSchema,
          requiredSources: data.requiredSources, requiredEvidence: data.requiredEvidence,
          rules: data.rules, exceptions: data.exceptions, forbiddenClaims: data.forbiddenClaims,
          allowedTools: data.allowedTools, authorUserId: current.id, status: "draft",
          contentHash: createHash("sha256").update(data.content).digest("hex"),
        }, select: { id: true, slug: true, version: true, status: true } });
      });
      return NextResponse.json({ skill: created }, { status: 201 });
    } catch { return bad("draft_conflict_or_database_error", 409); }
  }

  if (!body.id || body.id.length > 100) return bad("skill_version_id_required");
  if (reason.length < 12 || reason.length > 1000) return bad("review_reason_required");
  const version = await db.skillVersion.findUnique({ where: { id: body.id } });
  if (!version) return bad("skill_version_not_found", 404);
  // A proposta importada não possui autor humano. Um profissional assume a
  // responsabilidade pela revisão inicial, sem atribuir aprovação automática.
  if (body.action === "claim") {
    if (current.role !== "admin" || version.status !== "draft" || version.authorUserId)
      return bad("claim_not_allowed", 403);
    return db.$transaction(async (tx) => {
      const moved = await tx.skillVersion.updateMany({
        where: { id: version.id, status: "draft", authorUserId: null, updatedAt: version.updatedAt },
        data: { authorUserId: current.id },
      });
      if (moved.count !== 1) return bad("concurrent_transition", 409);
      await tx.skillReviewEvent.create({ data: {
        skillVersionId: version.id, reviewerUserId: current.id,
        decision: "claimed", reason,
      } });
      return NextResponse.json({ ok: true, status: "draft", authorAssigned: true });
    });
  }
  if (body.action === "submit") {
    if (version.authorUserId !== current.id) return bad("author_only", 403);
    if (version.status !== "draft") return bad("invalid_state", 409);
    return db.$transaction(async (tx) => {
      const updated = await tx.skillVersion.updateMany({
        where: { id: version.id, status: "draft", authorUserId: current.id, updatedAt: version.updatedAt },
        data: { status: "review" },
      });
      if (updated.count !== 1) return bad("concurrent_transition", 409);
      await tx.skillReviewEvent.create({ data: {
        skillVersionId: version.id, reviewerUserId: current.id, decision: "submitted",
        reason,
      } });
      return NextResponse.json({ ok: true, status: "review" });
    });
  }
  if (current.role !== "admin") return bad("review_admin_required", 403);
  if (!version.authorUserId || version.authorUserId === current.id) return bad("independent_reviewer_required", 403);
  if (version.status !== "review") return bad("invalid_state", 409);
  if (body.action === "return") {
    return db.$transaction(async tx => {
      const changed = await tx.skillVersion.updateMany({
        where: { id: version.id, status: "review", updatedAt: version.updatedAt }, data: { status: "draft" },
      });
      if (changed.count !== 1) return bad("concurrent_transition", 409);
      await tx.skillReviewEvent.create({ data: {
        skillVersionId: version.id, reviewerUserId: current.id, decision: "returned", reason,
      } });
      return NextResponse.json({ ok: true, status: "draft" });
    });
  }
  try {
    const sources: unknown = JSON.parse(version.requiredSources);
    if (!Array.isArray(sources) || sources.length === 0)
      return bad("required_sources_missing", 409);
    const digest = canonicalSkillManifestHash(version);
    return await db.$transaction(async tx => {
      const changed = await tx.skillVersion.updateMany({
        where: { id: version.id, status: "review", authorUserId: version.authorUserId, updatedAt: version.updatedAt },
        data: {
          status: "approved", approvedBy: current.id, reviewerUserId: current.id,
          approvedAt: new Date(), manifestHash: digest,
          contentHash: createHash("sha256").update(version.content, "utf8").digest("hex"),
        },
      });
      if (changed.count !== 1) return bad("concurrent_transition", 409);
      await tx.skillReviewEvent.create({ data: {
        skillVersionId: version.id, reviewerUserId: current.id,
        decision: "approved", manifestHash: digest, reason,
      } });
      return NextResponse.json({ ok: true, status: "approved", manifestHash: digest });
    });
  } catch {
    return bad("legal_metadata_invalid_or_concurrent_change", 409);
  }
}

/** Fila compacta, restrita aos autores e administradores autenticados. */
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;
  const isReviewer = auth.user.role === "admin";
  const items = await db.skillVersion.findMany({
    where: {
      status: { in: ["draft", "review"] },
      ...(isReviewer ? {} : { authorUserId: auth.user.uid }),
    },
    select: {
      id: true, slug: true, version: true, area: true, description: true,
      content: true, requiredSources: true, forbiddenClaims: true,
      triggers: true, authorUserId: true, status: true, updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
    take: 50,
  });
  return NextResponse.json({
    items: items.map((item) => ({
      ...item, updatedAt: item.updatedAt.toISOString(),
      canSubmit: item.authorUserId === auth.user.uid && item.status === "draft",
      canDecide: isReviewer && item.authorUserId !== auth.user.uid && item.status === "review",
    })),
    canReview: isReviewer,
  }, { headers: { "Cache-Control": "private, no-store" } });
}
