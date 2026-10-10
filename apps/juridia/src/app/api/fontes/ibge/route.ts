import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/fontes/ibge — busca índices IPCA/INPC do SIDRA IBGE
// Uso: cálculo de correção monetária (dupla checagem dos índices)
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;
  const url = new URL(req.url);
  const tabela = url.searchParams.get("tabela") || "1737"; // 1737 = IPCA mensal
  const periodo = url.searchParams.get("periodo") || "last%203"; // últimos 3 meses (formato IBGE)
  if (!["1737", "1886"].includes(tabela) ||
      !/^(?:last(?:%20|\s)?[1-9]\d?|\d{4})$/.test(periodo)) {
    return NextResponse.json({ error: "indice_ou_periodo_invalido" }, { status: 400 });
  }

  try {
    const ibgeUrl = `https://apisidra.ibge.gov.br/values/t/${tabela}/n1/all/p/${periodo}`;
    const res = await fetch(ibgeUrl, {
      headers: { "Accept": "application/json" },
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `IBGE retornou status ${res.status}` },
        { status: 502 }
      );
    }

    const data = await res.json();

    // Formata: extrai apenas data + valor do índice
    const series = Array.isArray(data) ? data.slice(1).map((item: Record<string, string>) => ({
      data: item.D2N || item.D3N || "",
      valor: item.V || "",
      indice: tabela === "1737" ? "IPCA" : tabela === "1886" ? "INPC" : `Tabela ${tabela}`,
    })) : [];

    return NextResponse.json({
      fonte: "IBGE/SIDRA",
      tabela,
      indice: tabela === "1737" ? "IPCA" : tabela === "1886" ? "INPC" : `Tabela ${tabela}`,
      totalRegistros: series.length,
      series,
    });
  } catch (e) {
    return NextResponse.json({ error: "ibge_unavailable", fonte: "IBGE/SIDRA" }, { status: 502 });
  }
}
