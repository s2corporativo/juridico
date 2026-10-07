import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { buildOfficeSkillCatalog } from "@/lib/office_skill_catalog";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;
  if (auth.user.role !== "admin") return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const catalog = buildOfficeSkillCatalog();
  let changed = 0;
  for (let offset = 0; offset < catalog.length; offset += 100) {
    const batch = catalog.slice(offset, offset + 100);
    await db.$transaction(batch.map((s) => {
      const hash = createHash("sha256").update(s.content).digest("hex");
      return db.skillVersion.upsert({
        where: { slug_version: { slug: s.slug, version: 1 } },
        update: {
          area: s.area, description: s.description, content: s.content,
          triggers: JSON.stringify({ keywords: s.triggers }),
          requiredSources: JSON.stringify(s.requiredSources),
          requiredEvidence: JSON.stringify(s.requiredEvidence),
          rules: JSON.stringify(s.rules),
          exceptions: JSON.stringify(s.exceptions),
          forbiddenClaims: JSON.stringify(s.forbiddenClaims),
          allowedTools: JSON.stringify(s.allowedTools),
          outputSchema: JSON.stringify(s.outputSchema),
          contentHash: hash, status: "approved",
          approvedBy: auth.user.uid, approvedAt: new Date(),
        },
        create: {
          slug: s.slug, version: 1, area: s.area, description: s.description, content: s.content,
          triggers: JSON.stringify({ keywords: s.triggers }),
          requiredSources: JSON.stringify(s.requiredSources),
          requiredEvidence: JSON.stringify(s.requiredEvidence),
          rules: JSON.stringify(s.rules),
          exceptions: JSON.stringify(s.exceptions),
          forbiddenClaims: JSON.stringify(s.forbiddenClaims),
          allowedTools: JSON.stringify(s.allowedTools),
          outputSchema: JSON.stringify(s.outputSchema),
          contentHash: hash, status: "approved",
          approvedBy: auth.user.uid, approvedAt: new Date(),
        },
      });
    }));
    changed += batch.length;
  }
  return NextResponse.json({ ok: true, catalogSize: catalog.length, changed });
}
