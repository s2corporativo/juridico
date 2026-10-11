import { NextRequest, NextResponse } from "next/server";
import { logAuditEvent } from "@/lib/audit";
import { parseJsonBody, truncateForDisplay } from "@/lib/api-helpers";
import { classificar } from "@/lib/assistente";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

const MODULES = {
  assistente: "Entrada de pesquisa, análise e produção jurídica",
  pesquisa: "Consulta de legislação, jurisprudência, súmulas e fontes",
  analise: "Análise de fatos, teses, lacunas e evidências",
  minutas: "Proposta de minutas, revisão e edição",
  biblioteca: "Rascunhos e modelos de redação",
} as const;
const ROUTE_INTENTS: Record<string, keyof typeof MODULES> = {
  ajuda: "assistente", briefing: "assistente",
  pesquisa: "pesquisa", lei: "pesquisa", sumula: "pesquisa",
  verificar: "pesquisa", legislativo: "pesquisa", jurimetria: "pesquisa",
  redigir: "minutas",
  processo: "analise", contradicoes: "analise", intimacao: "analise",
  prazo: "analise", prescricao: "analise", intercorrente: "analise",
  valor_causa: "analise", licitacao: "analise",
};


// GET /api/assistente — lista intenções cadastradas
export async function GET(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  return NextResponse.json({
    intencoes: Object.fromEntries(Object.entries(MODULES).map(([key, descricao]) => [key, { descricao }])),
    total: Object.keys(MODULES).length,
  });
}

// POST /api/assistente — classifica intenção + extrai entidades
export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  const parsed = await parseJsonBody<{ texto?: string }>(req);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const { texto } = parsed.body;
  if (!texto?.trim()) return NextResponse.json({ error: "texto obrigatório" }, { status: 400 });

  const classified = classificar(texto);
  const intent = classified.intencao ? (ROUTE_INTENTS[classified.intencao] ?? "assistente") : "assistente";
  const result = {
    ...classified,
    intencao: intent,
    candidatas: Array.from(new Set(classified.candidatas.map(item =>
      ROUTE_INTENTS[item] ?? "assistente"))),
  };

  await logAuditEvent({
    action: "assistente_classify",
    resource: "assistente",
    metadata: {
      preview: truncateForDisplay(texto, 200),
      intencao: result.intencao,
      confianca: result.confianca,
      candidatas: result.candidatas,
      entidades: {
        cnj: result.entidades.cnj.length,
        oabs: result.entidades.oabs.length,
        datas: result.entidades.datas.length,
        dias: result.entidades.dias.length,
        valores: result.entidades.valores.length,
        dispositivos: result.entidades.dispositivos.length,
        sumulas: result.entidades.sumulas.length,
        tribunais: result.entidades.tribunais.length,
        tipoPeca: result.entidades.tipoPeca,
        area: result.entidades.area,
      },
    },
  });

  return NextResponse.json(result);
}
