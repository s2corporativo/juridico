// API route — expõe anonymize/detect para uso CLIENTE (navegador).
// Garante que o texto original NUNCA saia do navegador.
// Para detecção sem anonimizar, use POST com preview:true.
import { NextRequest, NextResponse } from "next/server";
import { anonymize, detect } from "@/lib/anonymize";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

// POST — anonimiza no servidor (apenas para detecção de PII sem modificar)
// GET — expõe as funções para uso client-side (o cliente chama via fetch no browser)
export async function GET(req: NextRequest): Promise<NextResponse> {
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;

  const url = new URL(req.url);
  const text = url.searchParams.get("text");

  if (!text) {
    // Retorna metadados sobre o módulo — para o cliente saber que está disponível
    return NextResponse.json({ available: true, mode: "client-side" });
  }

  // Sem originais na resposta
  const result = anonymize(text);
  const detection = detect(text);

  return NextResponse.json({
    anonymized: result.text,
    markers: result.markers,
    counts: result.counts,
    total: result.total,
    detection,
  });
}

// POST — detecção de PII sem modificar o texto original
export async function POST(req: NextRequest): Promise<NextResponse> {
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;

  let body: { text: string; preview?: boolean };
  try {
    body = (await req.json()) as { text: string; preview?: boolean };
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  if (!body || typeof body.text !== "string") {
    return NextResponse.json({ error: "Campo 'text' obrigatório" }, { status: 400 });
  }

  // preview=true: só detecção, sem anonimizar
  if (body.preview === true) {
    const detection = detect(body.text);
    return NextResponse.json({ detection });
  }

  // preview=false ou omitido: anonimiza e devolve SEM o original
  const result = anonymize(body.text);
  const detection = detect(body.text);

  return NextResponse.json({
    anonymized: result.text,
    markers: result.markers,
    counts: result.counts,
    total: result.total,
    detection,
  });
}
