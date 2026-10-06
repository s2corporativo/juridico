import { describe, expect, it } from "vitest";
import { buildTopicLabels } from "@shared/compendium-presentation";

describe("compendium presentation", () => {
  it("preserves multiple taxonomy links for the same jurisprudence record", () => {
    const result = buildTopicLabels([{ jurisprudenceId: 7, topicId: 1 }, { jurisprudenceId: 7, topicId: 2 }, { jurisprudenceId: 7, topicId: 1 }], new Map([[1, "Consumidor"], [2, "Dano moral"]]));
    expect(result.get(7)).toBe("Consumidor · Dano moral");
  });
});
