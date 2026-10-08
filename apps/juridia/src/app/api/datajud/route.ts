import { NextRequest, NextResponse } from "next/server";
import { logAuditEvent } from "@/lib/audit";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

const DATAJUD_BASE_URL = "https://api-publica.datajud.cnj.jus.br";
const DATAJUD_ACCESS_URL = "https://datajud-wiki.cnj.jus.br/api-publica/acesso/";

const UF_BY_TR: Record<string, string> = {
  "01":"ac","02":"al","03":"ap","04":"am","05":"ba","06":"ce","07":"dft",
  "08":"es","09":"go","10":"ma","11":"mt","12":"ms","13":"mg","14":"pa",
  "15":"pb","16":"pr","17":"pe","18":"pi","19":"rj","20":"rn","21":"rs",
  "22":"ro","23":"rr","24":"sc","25":"se","26":"sp","27":"to",
};

function inferAlias(cnj: string): string | null {
  const justice = cnj[13];
  const tr = cnj.slice(14, 16);
  if (justice === "8") {
    const uf = UF_BY_TR[tr];
    return uf ? `tj${uf}` : null;
  }
  if (justice === "4") return `trf${Number(tr)}`;
  if (justice === "5") return `trt${Number(tr)}`;
  if (justice === "6") {
    const uf = UF_BY_TR[tr];
    return uf ? `tre-${uf === "dft" ? "df" : uf}` : null;
  }
  if (justice === "9") {
    if (tr === "13") return "tjmmg";
    if (tr === "21") return "tjmrs";
    if (tr === "26") return "tjmsp";
  }
  return null;
}

function extractPublicDataJudKey(page: string): string | null {
  const text = page.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ");
  const marker = text.indexOf("Authorization: APIKey");
  if (marker < 0) return null;
  return text.slice(marker, marker + 280).match(/[A-Za-z0-9_-]{40,}={0,2}/)?.[0] ?? null;
}

async function getDataJudKey(): Promise<string> {
  const configured = process.env.DATAJUD_API_KEY?.trim();
  if (configured) return configured;

  const response = await fetch(DATAJUD_ACCESS_URL, {
    headers: { Accept: "text/html" },
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error("Não foi possível obter a chave pública oficial do DataJud.");
  const key = extractPublicDataJudKey(await response.text());
  if (!key) throw new Error("A página oficial não apresentou uma chave pública DataJud reconhecível.");
  return key;
}

function readName(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const name = (value as { nome?: unknown }).nome;
  return typeof name === "string" ? name : null;
}

function sanitize(source: Record<string, unknown>) {
  const movements = Array.isArray(source.movimentos) ? source.movimentos : [];
  return {
    numeroProcesso: typeof source.numeroProcesso === "string" ? source.numeroProcesso : null,
    tribunal: typeof source.tribunal === "string" ? source.tribunal : null,
    updatedAt: typeof source["@timestamp"] === "string" ? source["@timestamp"] : null,
    classe: readName(source.classe),
    orgaoJulgador: readName(source.orgaoJulgador),
    assuntos: (Array.isArray(source.assuntos) ? source.assuntos : [])
      .map(readName)
      .filter((value): value is string => Boolean(value))
      .slice(0, 12),
    movimentos: movements
      .map((movement) => {
        const record = movement && typeof movement === "object"
          ? movement as Record<string, unknown>
          : {};
        return {
          date: typeof record.dataHora === "string"
            ? record.dataHora
            : typeof record.data === "string"
              ? record.data
              : null,
          name: readName(record) ?? (typeof record.nome === "string" ? record.nome : null),
        };
      })
      .filter((item) => item.date || item.name)
      .slice(-40),
  };
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const guard = await requireAuth(req);
  if (!guard.ok) return guard.response;

  const raw = new URL(req.url).searchParams.get("cnj") ?? "";
  const cnj = raw.replace(/\D/g, "");
  if (cnj.length !== 20) {
    return NextResponse.json({ error: "CNJ deve ter 20 dígitos" }, { status: 400 });
  }

  const alias = inferAlias(cnj);
  if (!alias) {
    return NextResponse.json(
      { error: "Não foi possível identificar automaticamente o tribunal desse número CNJ." },
      { status: 400 },
    );
  }

  try {
    const key = await getDataJudKey();
    const response = await fetch(`${DATAJUD_BASE_URL}/api_publica_${alias}/_search`, {
      method: "POST",
      headers: {
        Authorization: `APIKey ${key}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        size: 1,
        query: { match: { numeroProcesso: cnj } },
        _source: ["numeroProcesso","tribunal","@timestamp","classe","assuntos","orgaoJulgador","movimentos"],
      }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      return NextResponse.json({ error: `DataJud indisponível para ${alias} (HTTP ${response.status}).` }, { status: 502 });
    }

    const body = await response.json() as {
      hits?: { hits?: Array<{ _source?: Record<string, unknown> }> };
    };
    const source = body.hits?.hits?.[0]?._source;

    await logAuditEvent({
      userId: guard.user.uid,
      action: "datajud_query",
      resource: "process",
      metadata: { cnj, alias, found: Boolean(source) },
    });

    return NextResponse.json({
      found: Boolean(source),
      alias,
      record: source ? sanitize(source) : null,
      citation: "Fonte: Conselho Nacional de Justiça — DataJud.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao consultar DataJud." },
      { status: 502 },
    );
  }
}
