import { describe, expect, it } from "vitest";
import { COMPENDIUM_MODULES, EVIDENCE_FLOW, GOVERNANCE_GUARDRAILS, GOVERNANCE_LANES } from "../shared/compendium-governance";

describe("compendium governance contract", () => {
  it("keeps the internal modules, access lanes and evidence flow explicit", () => {
    expect(new Set(COMPENDIUM_MODULES.map(module => module.id)).size).toBe(COMPENDIUM_MODULES.length);
    expect(GOVERNANCE_LANES.map(lane => lane.id)).toEqual(["consultation", "review", "administration"]);
    expect(EVIDENCE_FLOW).toContain("Revisão humana");
    expect(GOVERNANCE_GUARDRAILS.join(" ").toLowerCase()).toContain("cpf");
  });
});
