import { describe, expect, it } from "vitest";
import { isPublicAtlasAsset } from "./_core/storageProxy";

describe("public Atlas assets", () => {
  it("allows the published site images and rejects arbitrary storage keys", () => {
    expect(isPublicAtlasAsset("atlas-forense-logo_bb6317e2.png")).toBe(true);
    expect(isPublicAtlasAsset("atlas-forense-hero_a0688916.jpg")).toBe(true);
    expect(isPublicAtlasAsset("private/client-document.pdf")).toBe(false);
    expect(isPublicAtlasAsset("../atlas-forense-logo_bb6317e2.png")).toBe(false);
  });
});
