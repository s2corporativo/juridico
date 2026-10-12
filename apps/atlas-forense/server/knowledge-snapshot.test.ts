import { describe, expect, it } from "vitest";
import { projectApprovedKnowledge } from "./knowledge-snapshot";

const verified = new Date("2026-10-10T12:00:00Z");
const base = {
  id: 11,
  sourceKey: "stj-dados-abertos",
  kind: "official_update",
  contentHash: "a".repeat(64),
  canonicalUrl: "https://dadosabertos.web.stj.jus.br/dataset/amostra",
  status: "approved",
  publishedAt: null,
  reviewedAt: verified,
};

describe("Atlas approved knowledge v1: fail-closed metadata snapshot", () => {
  it("only returns human-approved official discovery metadata", () => {
    const input = [
      base,
      { ...base, id: 12, status: "pending_review" },
      { ...base, id: 13, reviewedAt: null },
      { ...base, id: 14, sourceKey: "brain-thesis" },
      { ...base, id: 15, kind: "jurisprudence" },
      { ...base, id: 16, canonicalUrl: "https://unsafe.example.org/a" },
    ];
    const value = projectApprovedKnowledge(input);
    expect(value.items).toHaveLength(1);
    expect(value.items[0]).toMatchObject({
      atlasItemId: "11", tribunal: "STJ", documentStatus: "discovery_only",
      citableAsPrecedent: false, editorialStatus: "approved", text: null,
    });
    expect(value.snapshotVersion).toMatch(/^v1:[a-f0-9]{64}$/);
  });

  it("produces the same snapshot version for the same set, independent of order", () => {
    const second = { ...base, id: 19, contentHash: "b".repeat(64) };
    const a = projectApprovedKnowledge([base, second]);
    const b = projectApprovedKnowledge([second, base]);
    expect(a.snapshotVersion).toBe(b.snapshotVersion);
    expect(projectApprovedKnowledge([base]).snapshotVersion).not.toBe(a.snapshotVersion);
  });

  it("excludes unsafe URLs, user-supplied content and non-approved statuses", () => {
    const input = [
      { ...base, canonicalUrl: "https://dadosabertos.web.stj.jus.br.evil.net/dataset" },
      { ...base, id: 2, sourceKey: "cnj-djen-daily", canonicalUrl: "https://comunica.pje.jus.br/", status: "rejected" },
      { ...base, id: 3, sourceKey: "cnj-djen-daily", canonicalUrl: "https://comunica.pje.jus.br/" },
    ];
    const result = projectApprovedKnowledge(input);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].sourceKey).toBe("cnj-djen-daily");
    expect(JSON.stringify(result)).not.toContain("evil.net");
  });
});
