import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { aiGatewayJson } from "@/lib/ai_gateway";
import { runIterativeLegalResearch, type IterativeResearchResult } from "@/lib/iterative_research";
import { routeSkills } from "@/lib/skill_router";
import { buildFactsBlock } from "@/lib/minuta_pipeline";
import { runMinutaPipeline } from "@/lib/minuta_run";
import { pseudonymize } from "@/lib/pseudonymizer";
import { canAccessCase } from "@/lib/case_access";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

type AgentPlan = {
  resumo: string;
  perguntas: string[];
  estrategia: string;
  roteiro: { titulo: string; objetivo: string; fontesNecessarias: string[] }[];
  riscos: string[];
  pesquisaInsuficiente: string[];
};

function deterministicPlan(
  templateSlug: string,
  issues: { title: string; area: string; question?: string; risks?: string[] }[],
  research: IterativeResearchResult[],
): AgentPlan {
  const missing = [...new Set(research.flatMap((r) => r.coverage.missing || []))];
  const risks = [...new Set(issues.flatMap((i) => i.risks || []))].slice(0, 8);
  const issueNames = issues.map((i) => i.title).join(", ") || "questão principal";
  return {
    resumo: `Planejamento de ${templateSlug} para tratar: ${issueNames}.`,
    perguntas: [
      "Há algum fato relevante ou documento do caso ainda não inserido no sistema?",
      ...(missing.length ? ["Há informação adicional capaz de suprir as lacunas de pesquisa/evidência indicadas no plano?"] : []),
    ],
    estrategia: "Partir dos fatos comprovados, vincular afirmações às evidências dos autos, aplicar somente fontes jurídicas verificadas e vigentes, considerar precedentes favoráveis e contrários e manter em rascunho qualquer ponto não confirmado.",
    roteiro: [
      { titulo: "Fatos e evidências", objetivo: "Expor apenas fatos comprovados e indicar documento/página/evidence_ref_id.", fontesNecessarias: ["evidências do caso"] },
      { titulo: "Enquadramento jurídico", objetivo: "Aplicar legislação vigente aos fatos relevantes.", fontesNecessarias: ["fontes oficiais"] },
      { titulo: "Jurisprudência e aderência", objetivo: "Confrontar precedentes favoráveis e contrários com os fatos.", fontesNecessarias: ["tribunais oficiais"] },
      { titulo: "Riscos e contrapontos", objetivo: "Registrar lacunas, distinções e argumentos adversos relevantes.", fontesNecessarias: ["pesquisa bilateral"] },
      { titulo: "Pedidos e providências", objetivo: "Formular pedidos compatíveis com fatos, provas e fundamentos verificados.", fontesNecessarias: ["legislação aplicável"] },
    ],
    riscos: risks,
    pesquisaInsuficiente: missing,
  };
}

function sha(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null) as {
    phase?: "plan" | "draft";
    runId?: string;
    request?: {
      templateSlug: string;
      fields: Record<string,string>;
      skillSlugs?: string[];
      title?: string;
      batchId?: string;
      moldContent?: string;
      writingStyle?: string;
      brainContext?: string;
      caseId?: string;
    };
    approvedPlan?: unknown;
    answers?: Record<string,string>;
  } | null;

  const input = body?.request;
  if (!input?.templateSlug || !input.fields) {
    return NextResponse.json({ error: "request inválido" }, { status: 400 });
  }
  if (input.caseId && !(await canAccessCase(input.caseId, auth.user))) {
    return NextResponse.json({ error: "Caso não encontrado ou sem acesso" }, { status: 404 });
  }

  const facts = buildFactsBlock(input.fields);

  if ((body?.phase || "plan") === "plan") {
    const routed = await routeSkills(facts);
    const configuredIssueLimit = Number(process.env.AGENTIC_ISSUE_LIMIT || 3);
    const issueLimit = Number.isFinite(configuredIssueLimit) ? Math.max(1, Math.min(configuredIssueLimit, 3)) : 3;
    const issues = routed.issues.length
      ? routed.issues.slice(0, issueLimit)
      : [{ key: "questao_principal", title: input.templateSlug, area: routed.area || "civil" }];
    const research: IterativeResearchResult[] = [];
    const configuredCycles = Number(process.env.AGENTIC_RESEARCH_MAX_CYCLES || 3);
    const maxCycles = Number.isFinite(configuredCycles) ? Math.max(1, Math.min(configuredCycles, 4)) : 3;
    for (const issue of issues) {
      research.push(await runIterativeLegalResearch({
        issue: issue.title,
        area: issue.area,
        taskType: issue.area === "penal" ? "criminal" : "pesquisa",
        maxCycles,
      }));
    }

    const researchContext = research.map((r) => ({
      issue: r.issue,
      area: r.area,
      coverage: r.coverage,
      insufficient: r.insufficient,
      laws: r.laws.slice(0, 2).map((x) => ({
        id: x.source.id,
        diploma: x.source.diploma,
        numero: x.source.numero,
        urlOficial: x.source.urlOficial,
        vigente: x.source.vigente,
      })),
      atlasKnowledge: r.atlasKnowledge.slice(0, 2).map((x) => ({
        documentId: x.documentId,
        slug: x.slug,
        title: x.title,
        type: x.documentType,
        area: x.area,
        source: x.source,
        sourceUrl: x.sourceUrl,
        reliability: x.reliability,
        excerpt: x.text.slice(0, 180),
        score: x.score,
        semanticScore: x.semanticScore,
      })),
      precedents: r.precedents.slice(0, 2).map((x) => ({
        name: x.name,
        url: x.url,
        favorable: x.favorable,
        relevance: x.relevance,
        official: x.verified,
      })),
    }));

    let plan: AgentPlan = deterministicPlan(input.templateSlug, issues, research);
    let planProvider = { provider: "deterministic", model: "agentic-plan-v2", inputTokens: 0, outputTokens: 0 };
    if (process.env.AGENTIC_PLAN_LLM !== "false") {
      try {
        const llmPlan = await aiGatewayJson<AgentPlan>({
          taskType: routed.area === "penal" ? "criminal" : "analise_caso",
          temperature: 0.1,
          maxTokens: 650,
          messages: [
            {
              role: "system",
              content: "Enriqueça o plano determinístico sem inventar fatos ou fontes. Preserve a exigência de documento/página/evidence_ref_id, pesquisa bilateral e revisão humana. Responda apenas JSON com resumo, perguntas, estrategia, roteiro, riscos e pesquisaInsuficiente.",
            },
            {
              role: "user",
              content: JSON.stringify({
                template: input.templateSlug,
                facts: facts.slice(0, 1800),
                deterministicPlan: plan,
                issues: issues.map((i) => ({ title: i.title, area: i.area })),
                research: researchContext,
              }),
            },
          ],
        });
        plan = { ...plan, ...llmPlan.data };
        planProvider = {
          provider: llmPlan.response.provider,
          model: llmPlan.response.model,
          inputTokens: llmPlan.response.inputTokens,
          outputTokens: llmPlan.response.outputTokens,
        };
      } catch {
        // O plano determinístico permanece válido e auditável.
      }
    }

    const inputHash = sha({ templateSlug: input.templateSlug, fields: input.fields, caseId: input.caseId || null });
    const storedPlan = pseudonymize(JSON.stringify(plan)).text;
    const run = await db.agentRun.create({
      data: {
        caseId: input.caseId || null,
        userId: auth.user.uid,
        agentSlug: "agentic_draft",
        taskType: "draft",
        status: "paused_hitl",
        inputHash: sha({ inputHash, nonce: crypto.randomUUID() }),
        contractVersion: "agentic_draft_v2",
        providerSnapshot: JSON.stringify({ provider: planProvider.provider, model: planProvider.model }),
        tokensIn: planProvider.inputTokens,
        tokensOut: planProvider.outputTokens,
        tokensBudget: 30000,
        hitlReason: "approve_plan",
        hitlData: JSON.stringify({
          requestHash: inputHash,
          planHash: sha(plan),
          planPseudonymized: storedPlan,
          research: researchContext,
          issues,
          skills: routed.matches.slice(0, 8).map((s) => s.slug),
        }),
        startedAt: new Date(),
      },
    });
    await db.agentRunStep.create({
      data: { runId: run.id, stepNo: 1, kind: "hitl_pause", status: "paused", requiresHuman: true, output: JSON.stringify({ reason: "approve_plan", questions: plan.perguntas || [] }) },
    });

    return NextResponse.json({ runId: run.id, status: "paused_hitl", plan, research: researchContext });
  }

  if (!body?.runId || !body.approvedPlan) {
    return NextResponse.json({ error: "runId e approvedPlan são obrigatórios para redigir" }, { status: 400 });
  }
  const run = await db.agentRun.findUnique({ where: { id: body.runId } });
  if (!run || run.userId !== auth.user.uid || run.status !== "paused_hitl" || run.agentSlug !== "agentic_draft") {
    return NextResponse.json({ error: "run inválido ou sem acesso" }, { status: 403 });
  }
  const hitl = JSON.parse(run.hitlData || "{}") as { requestHash?: string; research?: unknown; issues?: unknown; skills?: string[] };
  const currentHash = sha({ templateSlug: input.templateSlug, fields: input.fields, caseId: input.caseId || null });
  if (hitl.requestHash !== currentHash) {
    return NextResponse.json({ error: "O caso foi alterado após o planejamento. Gere um novo plano." }, { status: 409 });
  }

  await db.agentRunStep.create({
    data: { runId: run.id, stepNo: 2, kind: "hitl_resume", status: "done", requiresHuman: true, output: JSON.stringify({ decision: "approve", editedPlan: sha(body.approvedPlan), answersCount: Object.keys(body.answers || {}).length }) },
  });
  await db.agentRun.update({ where: { id: run.id }, data: { status: "running", hitlReason: null } });

  const brainContext = [
    input.brainContext || "",
    "## PLANO AGÊNTICO APROVADO PELO ADVOGADO",
    JSON.stringify(body.approvedPlan),
    "## RESPOSTAS DO ADVOGADO",
    JSON.stringify(body.answers || {}),
    "## PESQUISA JURÍDICA ITERATIVA",
    JSON.stringify(hitl.research || {}),
  ].filter(Boolean).join("\n\n");

  try {
    const result = await runMinutaPipeline({
      ...input,
      skillSlugs: [...new Set([...(input.skillSlugs || []), ...(hitl.skills || [])])],
      brainContext,
    }, auth.user);

    await db.agentRun.update({
      where: { id: run.id },
      data: { status: "completed", finishedAt: new Date(), resultSnapshotId: result.document.id },
    });
    await db.agentRunStep.create({
      data: { runId: run.id, stepNo: 3, kind: "finish", status: "done", output: JSON.stringify({ documentId: result.document.id, citationBlocked: result.citationGate?.bloquear || false, evidenceBlocked: result.evidenceGate?.bloquear || false }) },
    });
    return NextResponse.json({ runId: run.id, status: "completed", result });
  } catch (e) {
    await db.agentRun.update({ where: { id: run.id }, data: { status: "failed", errorCode: String(e instanceof Error ? e.message : e).slice(0, 80), finishedAt: new Date() } });
    return NextResponse.json({ error: e instanceof Error ? e.message : "agentic_draft_failed" }, { status: 500 });
  }
}
