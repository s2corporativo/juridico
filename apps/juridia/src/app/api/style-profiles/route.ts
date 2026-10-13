import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;
  const profiles = await db.styleProfile.findMany({ where: { userId: auth.user.uid }, orderBy: { updatedAt: "desc" } });
  return NextResponse.json({ profiles });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;
  const body = (await req.json().catch(() => null)) as { id?: string; name?: string; description?: string; examples?: string[]; approved?: boolean } | null;
  if (!body?.name?.trim()) return NextResponse.json({ error: "name obrigatório" }, { status: 400 });
  const data = { name: body.name.trim(), description: body.description?.trim() || "", examples: JSON.stringify(Array.isArray(body.examples) ? body.examples.slice(0, 20) : []), approved: body.approved === true };
  if (body.id) {
    const updated = await db.styleProfile.updateMany({ where: { id: body.id, userId: auth.user.uid }, data });
    if (updated.count !== 1) return NextResponse.json({ error: "profile_not_found" }, { status: 404 });
    return NextResponse.json({ profile: await db.styleProfile.findUnique({ where: { id: body.id } }) });
  }
  const profile = await db.styleProfile.create({ data: { userId: auth.user.uid, ...data } });
  return NextResponse.json({ profile }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;
  const body = (await req.json().catch(() => null)) as { id?: string; approved?: boolean } | null;
  if (!body?.id || typeof body.approved !== "boolean") return NextResponse.json({ error: "id e approved obrigatórios" }, { status: 400 });
  const updated = await db.styleProfile.updateMany({ where: { id: body.id, userId: auth.user.uid }, data: { approved: body.approved } });
  if (updated.count !== 1) return NextResponse.json({ error: "profile_not_found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
