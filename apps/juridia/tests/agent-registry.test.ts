import { describe, expect, test } from "bun:test";
import { JURIDIA_AGENTS, agentForStage, buildAgentWorkflow, isWorkflowGoal } from "../src/lib/agent-registry";

describe("Agent team safety and composition", () => {
  test("all registered roles are unique, non-destructive and accountable", () => {
    const ids = JURIDIA_AGENTS.map((agent) => agent.slug);
    expect(ids.length).toBeGreaterThanOrEqual(10);
    expect(new Set(ids).size).toBe(ids.length);
    expect(JURIDIA_AGENTS.every((agent) => agent.mayPublishExternally === false)).toBe(true);
    expect(JURIDIA_AGENTS.some((agent) => agent.slug === "legal_brain")).toBe(true);
  });
  test("existing single pipeline retains stable stage-agent responsibilities", () => {
    expect(agentForStage("prepare").slug).toBe("privacy_auditor");
    expect(agentForStage("outline").slug).toBe("case_mapper");
    expect(agentForStage("draft").slug).toBe("legal_draft");
    expect(agentForStage("review").slug).toBe("legal_review");
    expect(agentForStage("finalize").slug).toBe("legal_research");
  });
  test("coordinator cannot invent execution goals, court actions or bypass lawyer", () => {
    expect(isWorkflowGoal("case_analysis")).toBe(true);
    expect(isWorkflowGoal("draft_document")).toBe(true);
    expect(isWorkflowGoal("__proto__")).toBe(false);
    expect(isWorkflowGoal("publish_to_court")).toBe(false);
    const plan = buildAgentWorkflow("case_analysis");
    expect(plan.externalActionsAllowed).toBe(false);
    expect(plan.finalApproval).toBe("advogado_responsavel");
    expect(plan.agents[0].slug).toBe("workflow_coordinator");
    expect(plan.agents.some((a) => a.slug === "legal_brain")).toBe(true);
    expect(plan.agents.every((a) => a.operationalRoute.startsWith("/juridia/api/"))).toBe(true);
  });
});
