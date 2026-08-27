import { describe, expect, it } from "vitest";
import { publicMetadataManifest, validatePublicMetadataManifest } from "../scripts/seed-public-compendium-metadata.mjs";

describe("public Compendium metadata manifest", () => {
  it("contains only the reviewed pilot scope and all required relationships", () => {
    expect(() => validatePublicMetadataManifest()).not.toThrow();
    expect(publicMetadataManifest.topics).toHaveLength(7);
    expect(publicMetadataManifest.theses).toHaveLength(3);
    expect(publicMetadataManifest.jurisprudenceTopics).toHaveLength(6);
    expect(publicMetadataManifest.thesisAuthorities).toHaveLength(4);
    expect(publicMetadataManifest.auditEvents).toHaveLength(14);
  });

  it("fails closed when a required public relationship is absent", () => {
    expect(() => validatePublicMetadataManifest({ ...publicMetadataManifest, thesisAuthorities: [] })).toThrow("incompleto");
  });
});
