// agent_loop.ts — loop agêntico do cérebro EJC.
// Não persiste cadeia de raciocínio: registra apenas decisões operacionais, tools e observações.

import { db } from "@/lib/db";
import { aiGatewayJson, inferSensitiveTask } from "@/lib/ai_gateway";
import { canonicalHash } from "@/lib/evidence";
import { logAuditEvent } from "@/lib/audit";

export type ToolCategory = "leitura" | "motores";
export type StepKind = "llm_call" | "tool_call" | "observation" | "hitl_pause" | "hitl_resume" | "finish" | "error";

export interface ToolResult {
  success: boolean;
  output: Record<string, unknown>;
  tokensUsed?: number;
  requiresHuman?: boolean;
  humanReviewData?: Record<string, unknown>;
  error?: string;
}

export interface AgentContext {
  runId: string;
  caseId: string;
  userId: string;
  facts: string;
  taskType: string;
  tokensUsed: number;
  tokensBudget: number;
  maxSteps: number;
  history: { step: number; action: string; observation: string }[];
}

export interface ToolDef {
  name: string;
  category: ToolCategory;
  description: string;
  requiresHumanApproval?: boolean;
  execute: (args: Record<string, unknown>, context: AgentContext) => Promise<ToolResult>;
}

export interface AgentLoopResult {
  runId: string;
  status: "completed" | "paused_hitl" | "failed" | "budget_exceeded";
  totalTokens: number;
  finalAnswer?: string;
  hitlReason?: string;
  hitlData?: Record<string, unknown>;
  steps: {
    stepNo: number;
    kind: StepKind;
    action?: string;
    observation?: string;
    tokensUsed: number;
    requiresHuman: boolean;
    status: string;
  }[];
}

const TOOL_REGISTRY = new Map<string, ToolDef>();

export function registerTool(tool: ToolDef): void {
  TOOL_REGISTRY.set(tool.name, tool);
}

export function getTool(name: string): ToolDef | undefined {
  return TOOL_REGISTRY.get(name);
}

export function listTools() {
  return Array.from(TOOL_REGISTRY.values()).map((t) => ({
    name: t.name,
    category: t.category,
    description: t.description,
    requiresHumanApproval: Boolean(t.requiresHumanApproval),
  }));
}

export class BudgetController {
  constructor(private readonly budget: number) {}
  canSpend(estimated: number, used: number) { return used + estimated <= this.budget; }
  remaining(used: number) { return Math.max(0, this.budget - used); }
  exceeded(used: number) { return used >= this.budget; }
}

type AgentDecision = {
  summary?: string;
  action?: string;
  args?: Record<string, unknown>;
  finish?: boolean;
  answer?: string;
};

function systemPrompt(): string {
  const tools = listTools().map((t) => `${t.name}: ${t.description}`).join("\n");
  return `Você é o orquestrador do cérebro jurídico EJC.

REGRAS:
1. Você não deve revelar nem registrar cadeia privada de raciocínio.
2. Responda apenas JSON: {"summary":"justificativa curta e verificável","action":"tool","args":{}}.
3. Para terminar: {"summary":"síntese","finish":true,"answer":"resposta final conservadora"}.
4. Use somente as tools registradas.
5. Não invente fatos, fontes, leis, precedentes ou evidence_ref_id.
6. Se a cobertura jurídica for insuficiente, declare a insuficiência.
7. Prefira fonte primária e vigente.
8. Procure também fundamento/precedente contrário, não só favorável.
9. Não confirme prazo processual automaticamente.
10. Não prometa resultado.

TOOLS:
${tools}`;
}

function userMessage(ctx: AgentContext): string {
  const history = ctx.history.length
    ? ctx.history.map((h) => `#${h.step} ${h.action}: ${h.observation}`).join("\n")
    : "(nenhuma execução anterior)";
  return `CASO:
${ctx.facts}

HISTÓRICO:
${history}

ORÇAMENTO:
${ctx.tokensUsed}/${ctx.tokensBudget} tokens utilizados.

Escolha a próxima tool ou finalize.`;
}

async function updateRun(runId: string, status: string, extra: Record<string, unknown>) {
  await db.agentRun.update({ where: { id: runId }, data: { status, ...extra } as Record<string, unknown> });
}

async function executeLoop(params: {
  runId: string;
  caseId: string;
  userId: string;
  facts: string;
  taskType: string;
  maxSteps: number;
  tokensBudget: number;
  tokensUsed?: number;
  startStep?: number;
  history?: AgentContext["history"];
}): Promise<AgentLoopResult> {
  const budget = new BudgetController(params.tokensBudget);
  const ctx: AgentContext = {
    runId: params.runId,
    caseId: params.caseId,
    userId: params.userId,
    facts: params.facts,
    taskType: params.taskType,
    tokensUsed: params.tokensUsed || 0,
    tokensBudget: params.tokensBudget,
    maxSteps: params.maxSteps,
    history: params.history || [],
  };
  const steps: AgentLoopResult["steps"] = [];

  for (let step = params.startStep || 1; step <= params.maxSteps; step++) {
    if (budget.exceeded(ctx.tokensUsed)) {
      await updateRun(ctx.runId, "failed", { errorCode: "budget_exceeded", tokensOut: ctx.tokensUsed, finishedAt: new Date() });
      return { runId: ctx.runId, status: "budget_exceeded", totalTokens: ctx.tokensUsed, steps };
    }

    const stepRow = await db.agentRunStep.create({
      data: { runId: ctx.runId, stepNo: step * 2 - 1, kind: "llm_call", status: "running" },
    });
    try {
      const { data: decision, response } = await aiGatewayJson<AgentDecision>({
        messages: [
          { role: "system", content: systemPrompt() },
          { role: "user", content: userMessage(ctx) },
        ],
        taskType: ctx.taskType,
        temperature: 0.1,
        maxTokens: Math.min(900, budget.remaining(ctx.tokensUsed)),
      });
      ctx.tokensUsed += response.totalTokens;
      await db.agentRunStep.update({
        where: { id: stepRow.id },
        data: {
          status: "done",
          provider: response.provider,
          model: response.model,
          tokensIn: response.inputTokens,
          tokensOut: response.outputTokens,
          durationMs: response.latencyMs,
          output: JSON.stringify({ summary: decision.summary, action: decision.action, finish: decision.finish }),
        },
      });
      await db.agentRun.update({
        where: { id: ctx.runId },
        data: { tokensOut: ctx.tokensUsed, providerSnapshot: JSON.stringify({ provider: response.provider, model: response.model }) },
      });

      if (decision.finish) {
        const answer = String(decision.answer || decision.summary || "Pesquisa encerrada.");
        await db.agentRunStep.create({
          data: { runId: ctx.runId, stepNo: step * 2, kind: "finish", status: "done", output: JSON.stringify({ answer }) },
        });
        await updateRun(ctx.runId, "completed", { finishedAt: new Date(), tokensOut: ctx.tokensUsed });
        return { runId: ctx.runId, status: "completed", totalTokens: ctx.tokensUsed, finalAnswer: answer, steps };
      }

      if (!decision.action) {
        throw new Error("Agente não escolheu tool nem finalizou");
      }
      const tool = getTool(decision.action);
      if (!tool) throw new Error(`Tool não registrada: ${decision.action}`);

      const toolRow = await db.agentRunStep.create({
        data: {
          runId: ctx.runId,
          stepNo: step * 2,
          kind: "tool_call",
          toolName: decision.action,
          status: "running",
          requiresHuman: Boolean(tool.requiresHumanApproval),
        },
      });

      let toolResult: ToolResult;
      try {
        toolResult = await tool.execute(decision.args || {}, ctx);
      } catch (e) {
        toolResult = { success: false, output: {}, error: e instanceof Error ? e.message : "tool_error" };
      }
      ctx.tokensUsed += toolResult.tokensUsed || 0;
      const observation = toolResult.success
        ? JSON.stringify(toolResult.output).slice(0, 1200)
        : `ERRO: ${toolResult.error || "tool falhou"}`;

      await db.agentRunStep.update({
        where: { id: toolRow.id },
        data: {
          status: toolResult.success ? "done" : "error",
          output: JSON.stringify(toolResult.output),
          tokensOut: toolResult.tokensUsed || 0,
          requiresHuman: Boolean(toolResult.requiresHuman),
        },
      });

      steps.push({
        stepNo: step,
        kind: "tool_call",
        action: decision.action,
        observation,
        tokensUsed: response.totalTokens + (toolResult.tokensUsed || 0),
        requiresHuman: Boolean(toolResult.requiresHuman),
        status: toolResult.success ? "done" : "error",
      });

      if (toolResult.requiresHuman) {
        const hitlData = toolResult.humanReviewData || {};
        const reason = String(hitlData.reason || "custom");
        await db.agentRun.update({
          where: { id: ctx.runId },
          data: { status: "paused_hitl", hitlReason: reason, hitlData: JSON.stringify(hitlData), tokensOut: ctx.tokensUsed },
        });
        return {
          runId: ctx.runId,
          status: "paused_hitl",
          totalTokens: ctx.tokensUsed,
          hitlReason: reason,
          hitlData,
          steps,
        };
      }

      ctx.history.push({ step, action: decision.action, observation });
    } catch (e) {
      const error = e instanceof Error ? e.message : "agent_error";
      await db.agentRunStep.update({
        where: { id: stepRow.id },
        data: { status: "error", output: JSON.stringify({ error }) },
      });
      await updateRun(ctx.runId, "failed", { errorCode: error.slice(0, 80), tokensOut: ctx.tokensUsed, finishedAt: new Date() });
      return { runId: ctx.runId, status: "failed", totalTokens: ctx.tokensUsed, steps };
    }
  }

  await updateRun(ctx.runId, "completed", { finishedAt: new Date(), tokensOut: ctx.tokensUsed });
  return {
    runId: ctx.runId,
    status: "completed",
    totalTokens: ctx.tokensUsed,
    finalAnswer: "Limite de passos atingido. Resultado deve ser revisado.",
    steps,
  };
}

export async function runAgentLoop(params: {
  caseId: string;
  userId: string;
  facts: string;
  taskType?: string;
  maxSteps?: number;
  tokensBudget?: number;
}): Promise<AgentLoopResult> {
  const taskType = params.taskType || inferSensitiveTask(params.facts);
  const maxSteps = Math.max(1, Math.min(params.maxSteps || 6, 10));
  const tokensBudget = Math.max(1000, Math.min(params.tokensBudget || 12000, 30000));
  const inputHash = canonicalHash({ caseId: params.caseId, facts: params.facts, taskType });

  const run = await db.agentRun.create({
    data: {
      caseId: params.caseId,
      userId: params.userId,
      agentSlug: "ejc_legal_agent",
      taskType: "loop",
      status: "running",
      inputHash,
      contractVersion: "ejc_brain_v1",
      tokensBudget,
      startedAt: new Date(),
    },
  });

  const result = await executeLoop({
    runId: run.id,
    caseId: params.caseId,
    userId: params.userId,
    facts: params.facts,
    taskType,
    maxSteps,
    tokensBudget,
  });

  await logAuditEvent({
    action: "ejc_agent_loop",
    resource: "agent_run",
    resourceId: run.id,
    userId: params.userId,
    metadata: { caseId: params.caseId, status: result.status, tokens: result.totalTokens },
  });
  return result;
}

export async function resumeAgentLoop(params: {
  runId: string;
  caseId: string;
  userId: string;
  facts: string;
  decision: "approve" | "reject" | "modify";
  modifiedData?: Record<string, unknown>;
}): Promise<AgentLoopResult> {
  const run = await db.agentRun.findUnique({ where: { id: params.runId }, include: { steps: { orderBy: { stepNo: "desc" }, take: 1 } } });
  if (!run || run.caseId !== params.caseId || run.userId !== params.userId) throw new Error("Run não encontrado ou sem acesso");
  if (run.status !== "paused_hitl") throw new Error("Run não está pausado para revisão humana");

  const lastStep = run.steps[0]?.stepNo || 0;
  await db.agentRunStep.create({
    data: {
      runId: run.id,
      stepNo: lastStep + 1,
      kind: "hitl_resume",
      status: "done",
      requiresHuman: true,
      output: JSON.stringify({ decision: params.decision, modifiedData: params.modifiedData || {} }),
    },
  });

  if (params.decision === "reject") {
    await updateRun(run.id, "cancelled", { finishedAt: new Date() });
    return { runId: run.id, status: "completed", totalTokens: run.tokensOut, finalAnswer: "Execução encerrada por decisão humana.", steps: [] };
  }

  await updateRun(run.id, "running", { hitlReason: null, hitlData: "{}" });
  return executeLoop({
    runId: run.id,
    caseId: params.caseId,
    userId: params.userId,
    facts: params.facts,
    taskType: inferSensitiveTask(params.facts),
    maxSteps: 8,
    tokensBudget: run.tokensBudget,
    tokensUsed: run.tokensOut,
    startStep: Math.floor(lastStep / 2) + 1,
    history: [{ step: Math.floor(lastStep / 2), action: "human_review", observation: params.decision }],
  });
}
