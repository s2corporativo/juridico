import { describe, expect, it } from "vitest";
import { isSafePublicMetadata, PUBLIC_JURISPRUDENCE_FIELDS } from "./compendium.utils";

describe("compendium privacy contract", () => {
  it("exposes only metadata fields compatible with the public research layer", () => {
    expect(PUBLIC_JURISPRUDENCE_FIELDS).toContain("sourceStatus");
    expect(isSafePublicMetadata({ tribunal: "TJMG", theme: "Tarifas bancárias" })).toBe(true);
    expect(isSafePublicMetadata({ cpfParte: "000.000.000-00" })).toBe(false);
    expect(isSafePublicMetadata({ nota: "CPF 000.000.000-00" })).toBe(false);
    expect(isSafePublicMetadata({ contato: { email: "pessoa@exemplo.com" } })).toBe(false);
  });
});
