import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

function officialHttpsUrl(value: string | null | undefined): boolean {
  try {
    const u = new URL(value ?? "");
    return u.protocol === "https:" && !u.username && !u.password &&
      (u.hostname.endsWith(".jus.br") || u.hostname.endsWith(".gov.br"));
  } catch { return false; }
}

function shaText(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}


// GET: lista fontes jurídicas curadas (com filtros opcionais)
export async function GET(req: NextRequest) {
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;

  const url = new URL(req.url);
  const tipo = url.searchParams.get("tipo");
  const diploma = url.searchParams.get("diploma");

  const where: { tipo?: string; diploma?: { contains: string } } = {};
  if (tipo) where.tipo = tipo;
  if (diploma) where.diploma = { contains: diploma };

  const sources = await db.legalSource.findMany({
    where,
    orderBy: [{ diploma: "asc" }, { numero: "asc" }],
    take: 1000, // show the entire current curated corpus (717), including pending review
  });

  return NextResponse.json({
    sources: sources.map((s) => ({
      id: s.id,
      tipo: s.tipo,
      diploma: s.diploma,
      numero: s.numero,
      tribunal: s.tribunal,
      textoTrecho: s.textoTrecho,
      vigente: s.vigente,
      urlOficial: s.urlOficial,
      hashConteudo: s.hashConteudo,
      dataConsulta: s.dataConsulta?.toISOString(),
      revisadoPor: s.revisadoPor,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    })),
    total: sources.length,
  });
}

// POST: cria nova fonte jurídica (GATE ADMIN — base curada afeta o Citation Gate)
export async function POST(req: NextRequest) {
  const __auth = await requireAuth(req, { admin: true });
  if (!__auth.ok) return __auth.response;

  let body: {
    tipo?: string;
    diploma?: string;
    numero?: string;
    tribunal?: string;
    textoTrecho?: string;
    vigente?: boolean;
    urlOficial?: string;
    revisadoPor?: string;
  } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!body.tipo || !body.diploma || !body.numero) {
    return NextResponse.json(
      { error: "tipo, diploma e numero obrigatórios" },
      { status: 400 }
    );
  }

  try {
    const source = await db.legalSource.create({
      data: {
        tipo: body.tipo,
        diploma: body.diploma,
        numero: body.numero,
        tribunal: body.tribunal || null,
        textoTrecho: body.textoTrecho || "",
        vigente: body.vigente ?? true,
        urlOficial: body.urlOficial || null,
        // A submitted link does not prove it was consulted; human review sets date.
        dataConsulta: null,
        // Creating a record is ingestion, NOT an editorial human approval.
        revisadoPor: null,
        hashConteudo: shaText(body.textoTrecho || ""),
      },
    });

    await logAuditEvent({
      action: "create_legal_source",
      userId: __auth.user.uid,
      resource: "legal_source",
      resourceId: source.id,
      metadata: { tipo: body.tipo, diploma: body.diploma, numero: body.numero },
    });

    return NextResponse.json({
      id: source.id,
      tipo: source.tipo,
      diploma: source.diploma,
      numero: source.numero,
      tribunal: source.tribunal,
      vigente: source.vigente,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao criar fonte";
    // Unique constraint = já existe
    if (msg.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Fonte já existe na base curada" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PATCH: atualiza fonte (ex: marcar como não vigente) — GATE ADMIN
export async function PATCH(req: NextRequest) {
  const __auth = await requireAuth(req, { admin: true });
  if (!__auth.ok) return __auth.response;

  let body: {
    id?: string;
    textoTrecho?: string;
    vigente?: boolean;
    urlOficial?: string;
    approve?: boolean;
    review?: {
      viewedOfficialPublication?: boolean;
      comparedFullExcerpt?: boolean;
      checkedValidityAsOfToday?: boolean;
      checkedApplicability?: boolean;
      expectedContentHash?: string;
      expectedUpdatedAt?: string;
    };
  } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!body.id) {
    return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
  }

  const data: {
    textoTrecho?: string;
    vigente?: boolean;
    urlOficial?: string;
    revisadoPor?: string | null;
    hashConteudo?: string;
    dataConsulta?: Date;
  } = {};

  const existing = await db.legalSource.findUnique({ where: { id: body.id } });
  if (!existing) return NextResponse.json({ error: "source_not_found" }, { status: 404 });
  if (body.textoTrecho !== undefined) {
    data.textoTrecho = body.textoTrecho;
    data.hashConteudo = shaText(body.textoTrecho);
    data.revisadoPor = null; // a changed text invalidates any previous review
  }
  if (body.vigente !== undefined) data.vigente = body.vigente;
  if (body.urlOficial !== undefined) {
    data.urlOficial = body.urlOficial;
    // Changing a URL is ingestion/editing, never proof of a new official consultation.
    data.dataConsulta = undefined;
    data.revisadoPor = null;
  }
  // A simple confirmation click is not evidence of actual editorial review.
  // Require explicit attestations against the exact immutable source snapshot.
  if (body.approve === true) {
    const r = body.review;
    if (body.textoTrecho !== undefined || body.urlOficial !== undefined || body.vigente !== undefined ||
        !r?.viewedOfficialPublication || !r.comparedFullExcerpt ||
        !r.checkedValidityAsOfToday || !r.checkedApplicability ||
        r.expectedContentHash !== shaText(existing.textoTrecho) ||
        r.expectedUpdatedAt !== existing.updatedAt.toISOString() ||
        !officialHttpsUrl(existing.urlOficial) || !existing.vigente ||
        existing.textoTrecho.trim().length < 25) {
      return NextResponse.json({ error: "documented_manual_editorial_review_required" }, { status: 422 });
    }
    data.hashConteudo = shaText(existing.textoTrecho);
    data.revisadoPor = `human:${__auth.user.uid}`;
    data.dataConsulta = new Date();
  }

  if (body.textoTrecho !== undefined &&
      (typeof body.textoTrecho !== "string" || body.textoTrecho.length > 70_000 ||
       body.textoTrecho.trim().length < 25)) {
    return NextResponse.json({ error: "invalid_legal_excerpt" }, { status: 422 });
  }
  if (body.urlOficial !== undefined && !officialHttpsUrl(body.urlOficial)) {
    return NextResponse.json({ error: "invalid_official_url" }, { status: 422 });
  }
  if (body.vigente === false) data.revisadoPor = null;

  const changed = await db.legalSource.updateMany({
    where: { id: body.id, updatedAt: existing.updatedAt },
    data,
  });
  if (changed.count !== 1) return NextResponse.json({ error: "source_review_conflict" }, { status: 409 });
  const updated = await db.legalSource.findUnique({ where: { id: body.id } });
  if (!updated) return NextResponse.json({ error: "source_not_found" }, { status: 404 });

  await logAuditEvent({
    action: "update_legal_source",
    userId: __auth.user.uid,
    resource: "legal_source",
    resourceId: body.id,
    metadata: { diploma: updated.diploma, numero: updated.numero, vigente: updated.vigente, editorialApproval: body.approve === true, actor: __auth.user.uid },
  });

  return NextResponse.json({ ok: true });
}

// DELETE: exclui fonte — GATE ADMIN
export async function DELETE(req: NextRequest) {
  const __auth = await requireAuth(req, { admin: true });
  if (!__auth.ok) return __auth.response;

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });

  const src = await db.legalSource.findUnique({ where: { id }, select: { diploma: true, numero: true } });
  if (!src) return NextResponse.json({ error: "source_not_found" }, { status: 404 });
  // Historical source identities must remain available for auditing prior drafts.
  await db.legalSource.update({ where: { id }, data: { vigente: false, revisadoPor: null } });
  await logAuditEvent({
    action: "retire_legal_source",
    resource: "legal_source",
    resourceId: id,
    userId: __auth.user.uid,
    metadata: { diploma: src.diploma, numero: src.numero },
  });
  return NextResponse.json({ ok: true });
}
