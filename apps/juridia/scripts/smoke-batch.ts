import { NextRequest } from "next/server";
import { db } from "../src/lib/db";
import { signSession, SESSION_COOKIE } from "../src/lib/auth";
import { POST as generate } from "../src/app/api/generate-minuta/route";

function request(token: string, body: unknown) {
  return new NextRequest("http://localhost/api/generate-minuta", {
    method: "POST",
    headers: { "content-type": "application/json", cookie: `${SESSION_COOKIE}=${token}` },
    body: JSON.stringify(body),
  });
}

async function main() {
  const user = await db.user.upsert({
    where: { email: "smoke.batch@atlas.local" },
    update: { name: "Smoke Batch", role: "admin" },
    create: { email: "smoke.batch@atlas.local", name: "Smoke Batch", role: "admin", plan: "enterprise", minutasLimit: 9999 },
  });
  const token = signSession({ uid: user.id, email: user.email, role: user.role });
  if (!token) throw new Error("sessão não criada");

  const batchId = `smoke-batch-${Date.now()}`;
  const base = {
    templateSlug: "peticao-inicial-civil",
    skillSlugs: [],
    batchId,
    writingStyle: "sintetico",
  };

  const firstRes = await generate(request(token, {
    ...base,
    title: "Caso-molde do lote",
    fields: {
      tipoAcao: "Obrigação de fazer",
      competencia: "Vara Cível",
      autor: "Parte A",
      reu: "Parte B",
      fatos: "A parte ré deixou de cumprir obrigação contratual documentada.",
      pedidos: "Cumprimento da obrigação e providências cabíveis.",
      valorCausa: "R$ 10.000,00",
    },
  }));
  const first = await firstRes.json();
  if (firstRes.status !== 200 || !first.document?.id || !first.document?.generatedContent) {
    throw new Error(`caso-molde falhou: ${firstRes.status} ${JSON.stringify(first).slice(0, 400)}`);
  }

  const secondRes = await generate(request(token, {
    ...base,
    title: "Segundo caso do lote",
    moldContent: first.document.generatedContent,
    fields: {
      tipoAcao: "Obrigação de fazer",
      competencia: "Vara Cível",
      autor: "Parte C",
      reu: "Parte D",
      fatos: "A parte ré não realizou a prestação assumida no contrato apresentado.",
      pedidos: "Cumprimento da obrigação e providências cabíveis.",
      valorCausa: "R$ 12.000,00",
    },
  }));
  const second = await secondRes.json();
  if (secondRes.status !== 200 || !second.document?.id) {
    throw new Error(`segundo caso falhou: ${secondRes.status} ${JSON.stringify(second).slice(0, 400)}`);
  }

  const docs = await db.document.findMany({
    where: { userId: user.id, batchId },
    orderBy: { createdAt: "asc" },
    select: { id: true, title: true, batchId: true, generatedContent: true },
  });
  if (docs.length !== 2) throw new Error(`lote deveria ter 2 documentos; encontrou ${docs.length}`);
  if (!docs.every((d) => d.batchId === batchId)) throw new Error("batchId inconsistente");

  console.log(JSON.stringify({
    ok: true,
    batchId,
    documents: docs.map((d) => ({ id: d.id, title: d.title, chars: d.generatedContent.length })),
    sameBatch: true,
    moldAppliedToSecondRequest: true,
  }, null, 2));
}

main()
  .catch((error) => { console.error(error); process.exitCode = 1; })
  .finally(async () => { await db.$disconnect(); });
