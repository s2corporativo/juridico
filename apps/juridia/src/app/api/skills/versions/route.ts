import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

function parse(raw: string, fallback: unknown) {
  try { return JSON.parse(raw); } catch { return fallback; }
}

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;
  const u = new URL(req.url);
  const area = u.searchParams.get("area") || undefined;
  const status = u.searchParams.get("status") || undefined;
  const q = (u.searchParams.get("q") || "").trim();
  const page = Math.max(1, Number(u.searchParams.get("page")) || 1);
  const pageSize = Math.max(1, Math.min(100, Number(u.searchParams.get("pageSize")) || 50));

  const where = {
    ...(area ? { area } : {}),
    ...(status ? { status } : {}),
    ...(q ? { OR: [{ slug: { contains: q } }, { description: { contains: q } }, { content: { contains: q } }] } : {}),
  };
  const [items, total] = await Promise.all([
    db.skillVersion.findMany({ where, orderBy: [{ area: "asc" }, { slug: "asc" }, { version: "desc" }], skip: (page - 1) * pageSize, take: pageSize }),
    db.skillVersion.count({ where }),
  ]);
  return NextResponse.json({
    total, page, pageSize,
    skills: items.map((s) => ({
      ...s,
      triggers: parse(s.triggers, {}),
      requiredSources: parse(s.requiredSources, []),
      requiredEvidence: parse(s.requiredEvidence, []),
      rules: parse(s.rules, []),
      exceptions: parse(s.exceptions, []),
      forbiddenClaims: parse(s.forbiddenClaims, []),
      allowedTools: parse(s.allowedTools, []),
      outputSchema: parse(s.outputSchema, {}),
    })),
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;
  if (auth.user.role !== "admin") return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null) as Record<string, unknown> | null;
  const slug = String(body?.slug || "").trim();
  const content = String(body?.content || "").trim();
  const area = String(body?.area || "").trim();
  const description = String(body?.description || "").trim();
  if (!slug || !content || !area || !description) {
    return NextResponse.json({ error: "slug, area, description e content são obrigatórios" }, { status: 400 });
  }
  const latest = await db.skillVersion.findFirst({ where: { slug }, orderBy: { version: "desc" } });
  const version = (latest?.version || 0) + 1;
  const hash = createHash("sha256").update(content).digest("hex");
  const created = await db.skillVersion.create({
    data: {
      slug, version, area, description, content,
      triggers: JSON.stringify(body?.triggers || {}),
      requiredSources: JSON.stringify(body?.requiredSources || []),
      requiredEvidence: JSON.stringify(body?.requiredEvidence || []),
      rules: JSON.stringify(body?.rules || []),
      exceptions: JSON.stringify(body?.exceptions || []),
      forbiddenClaims: JSON.stringify(body?.forbiddenClaims || []),
      allowedTools: JSON.stringify(body?.allowedTools || []),
      outputSchema: JSON.stringify(body?.outputSchema || {}),
      status: "review",
      contentHash: hash,
    },
  });
  return NextResponse.json({ skill: created }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;
  if (auth.user.role !== "admin") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const body = await req.json().catch(() => null) as { id?: string; status?: string } | null;
  if (!body?.id || !["draft","review","approved","retired"].includes(String(body.status))) {
    return NextResponse.json({ error: "id/status inválidos" }, { status: 400 });
  }
  const skill = await db.skillVersion.update({
    where: { id: body.id },
    data: {
      status: body.status,
      approvedBy: body.status === "approved" ? auth.user.uid : null,
      approvedAt: body.status === "approved" ? new Date() : null,
    },
  });
  return NextResponse.json({ skill });
}
