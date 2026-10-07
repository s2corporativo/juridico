import { describe, expect, test } from "bun:test";
import { cosineVector } from "@/lib/embedding_service";

describe("semantic retrieval helpers", () => {
  test("cosine identical vectors", () => {
    expect(cosineVector([1,2,3],[1,2,3])).toBeCloseTo(1, 6);
  });
  test("cosine rejects incompatible dimensions", () => {
    expect(cosineVector([1,2],[1,2,3])).toBe(0);
  });
});
