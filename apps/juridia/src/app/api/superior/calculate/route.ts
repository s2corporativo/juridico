import { NextRequest, NextResponse } from "next/server";
import { calculateDeadline, calculateCorrection, calculateInterest, checkPrescription } from "@/lib/legal_calculator";
import { logAuditEvent } from "@/lib/audit";
import { requireAuth } from "@/lib/auth";
import { MAX_PRAZO_DIAS } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  let body: { type?: string; [key: string]: unknown } = {};
  try { body = await req.json(); } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }

  switch (body.type) {
    case "deadline": {
      const marcoInicial = new Date(body.marcoInicial as string);
      const prazoDias = Number(body.prazoDias);
      const tipoContagem = (body.tipoContagem as "uteis" | "corridos") || "uteis";
      if (isNaN(marcoInicial.getTime()) || !Number.isSafeInteger(prazoDias) || prazoDias < 1 ||
          prazoDias > MAX_PRAZO_DIAS || !["uteis", "corridos"].includes(tipoContagem)) {
        return NextResponse.json({ error: "marcoInicial e prazoDias obrigatórios" }, { status: 400 });
      }
      const result = calculateDeadline(marcoInicial, prazoDias, tipoContagem);
      await logAuditEvent({ userId: authUser.uid, action: "calc_deadline", resource: "case", metadata: { prazoDias, tipoContagem, vencimento: result.vencimento.toISOString() } });
      return NextResponse.json({ ...result, vencimento: result.vencimento.toISOString() });
    }
    case "correction": {
      const valorOriginal = Number(body.valorOriginal);
      const fatorAcumulado = Number(body.fatorAcumulado);
      const indice = (body.indice as string) || "IPCA";
      if (!valorOriginal || !fatorAcumulado) {
        return NextResponse.json({ error: "valorOriginal e fatorAcumulado obrigatórios" }, { status: 400 });
      }
      const result = calculateCorrection(valorOriginal, fatorAcumulado, indice);
      await logAuditEvent({ userId: authUser.uid, action: "calc_correction", resource: "case", metadata: { valorOriginal, fatorAcumulado, indice } });
      return NextResponse.json(result);
    }
    case "interest": {
      const valorPrincipal = Number(body.valorPrincipal);
      const meses = Number(body.meses);
      const taxaMensal = Number(body.taxaMensal);
      const base = body.base;
      if (body.taxaMensal === undefined || body.taxaMensal === null || body.taxaMensal === "" ||
          base !== "informada_pelo_usuario" ||
          !Number.isFinite(taxaMensal) || taxaMensal < 0 || taxaMensal > 1) {
        return NextResponse.json({ error: "taxa_mensal_explicita_obrigatoria_sem_presuncao_legal" }, { status: 422 });
      }
      if (!Number.isFinite(valorPrincipal) || valorPrincipal <= 0 || valorPrincipal > 1_000_000_000 ||
          !Number.isFinite(meses) || meses <= 0 || meses > 600) {
        return NextResponse.json({ error: "valorPrincipal e meses obrigatórios" }, { status: 400 });
      }
      const result = calculateInterest(valorPrincipal, meses, taxaMensal, "informada_pelo_usuario");
      await logAuditEvent({ userId: authUser.uid, action: "calc_interest", resource: "case", metadata: { valorPrincipal, meses, taxaMensal, base } });
      return NextResponse.json(result);
    }
    case "prescription": {
      const dataFato = new Date(body.dataFato as string);
      const dataajuizamento = new Date(body.dataajuizamento as string);
      const area = (body.area as string) || "civil";
      if (isNaN(dataFato.getTime()) || isNaN(dataajuizamento.getTime())) {
        return NextResponse.json({ error: "dataFato e dataajuizamento obrigatórios" }, { status: 400 });
      }
      const result = checkPrescription(dataFato, dataajuizamento, area);
      await logAuditEvent({ userId: authUser.uid, action: "calc_prescription", resource: "case", metadata: { area, prescrito: result.prescrito, diasRestantes: result.diasRestantes } });
      return NextResponse.json(result);
    }
    default:
      return NextResponse.json({ error: "type obrigatório: deadline | correction | interest | prescription" }, { status: 400 });
  }
}
