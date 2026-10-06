import { describe, expect, it } from "vitest";
import { isSafeThesisMapDocument, THESIS_MAP_EXPORT_FORMATS, THESIS_MAP_RELATED_LIMIT } from "@shared/thesis-map-contract";

describe("thesis map public contract", () => {
  it("keeps related documents bounded and export formats explicit", () => {
    expect(THESIS_MAP_RELATED_LIMIT).toBe(24);
    expect(THESIS_MAP_EXPORT_FORMATS).toEqual(["png", "pdf"]);
  });

  it("rejects individual or raw-document fields", () => {
    expect(isSafeThesisMapDocument({ id: 1, title: "Tarifas bancárias", tribunal: "TJMG" })).toBe(true);
    expect(isSafeThesisMapDocument({ id: 1, title: "Julgado", cnjNumber: "0000000-00.0000.0.00.0000" })).toBe(false);
    expect(isSafeThesisMapDocument({ id: 1, reasoningSummary: "texto" })).toBe(false);
    expect(isSafeThesisMapDocument({ id: 1, parties: ["pessoa"] })).toBe(false);
  });
});
