// POST /api/generate-minuta/stream — mesma geração da rota clássica, com
// Server-Sent Events: o advogado acompanha as etapas e vê a REDAÇÃO chegar
// token a token , em vez de esperar
// 20-30 s sem feedback.
//
// Eventos SSE emitidos (todos `data:` são JSON de uma linha):
//   event: stage   data: { stage, status, note?, ms?, tokens? }
//   event: draft   data: { text }            ← delta incremental da redação
//   event: done    data: { <GenerateMinutaResponse completo> }
//   event: error   data: { error }
//
// Autenticação e toda a telemetria (AgentRun/AgentRunStep, auditoria, cota)
// são IDÊNTICAS à rota clássica — o streaming é apenas o transporte.

import { NextRequest } from "next/server";
import { runMinutaPipeline, PipelineError, type MinutaRunEvent } from "@/lib/minuta_run";
import type { GenerateMinutaRequest } from "@/lib/types";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const SSE_HEADERS = {
  "Content-Type": "text/event-stream; charset=utf-8",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
  "X-Accel-Buffering": "no", // atrás de nginx/proxy: desativa buffering
};

function sseFrame(event: string, data: unknown): Uint8Array {
  return new TextEncoder().encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

export async function POST(req: NextRequest): Promise<Response> {
  // ── Guard de autenticação (antes de abrir o stream) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  let body: GenerateMinutaRequest;
  try {
    body = (await req.json()) as GenerateMinutaRequest;
  } catch {
    return new Response(JSON.stringify({ error: "JSON inválido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!body?.templateSlug || !body?.fields) {
    return new Response(JSON.stringify({ error: "templateSlug e fields obrigatórios" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        try {
          controller.enqueue(sseFrame(event, data));
        } catch {
          // cliente desconectou — o cancel() cuida do encerramento
        }
      };
      try {
        const onEvent = (e: MinutaRunEvent) => {
          if (e.type === "done") return; // emitido separadamente no final
          if (e.type === "draft_delta") send("draft", { text: e.text });
          else send("stage", e);
        };
        const result = await runMinutaPipeline(body, authUser, onEvent);
        send("done", result);
      } catch (e) {
        const message =
          e instanceof PipelineError
            ? e.message
            : e instanceof Error
              ? e.message
              : "falha na geração";
        send("error", { error: message, status: e instanceof PipelineError ? e.status : 500 });
      } finally {
        try {
          controller.close();
        } catch {
          // já fechado
        }
      }
    },
  });

  return new Response(stream, { headers: SSE_HEADERS });
}
