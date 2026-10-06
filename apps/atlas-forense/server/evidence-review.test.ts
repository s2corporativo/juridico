import { describe, expect, it } from "vitest";
import { validateReviewDecision, validateReviewRequest } from "./evidence-review";

describe("evidence review safeguards", () => {
  it("requires a safe reason and decision note", () => {
    expect(validateReviewRequest("Conferir coerência entre fonte oficial e tese.")).toContain("Conferir");
    expect(() => validateReviewRequest("contato teste@exemplo.com")).toThrow(/dados pessoais/i);
    expect(validateReviewDecision("pending", "approved", "URL oficial e número confirmados.").status).toBe("approved");
  });

  it("blocks a rewrite of a final decision", () => {
    expect(() => validateReviewDecision("approved", "rejected", "Revisão posterior.")).toThrow(/decisão final/i);
  });
});
