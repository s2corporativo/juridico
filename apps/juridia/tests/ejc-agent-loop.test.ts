import { describe, expect, test } from "bun:test";
import { BudgetController } from "@/lib/agent_loop";

describe("EJC agent loop", () => {
  test("budget bloqueia excesso", () => {
    const b = new BudgetController(1000);
    expect(b.canSpend(200, 700)).toBe(true);
    expect(b.canSpend(400, 700)).toBe(false);
    expect(b.remaining(700)).toBe(300);
  });
});
