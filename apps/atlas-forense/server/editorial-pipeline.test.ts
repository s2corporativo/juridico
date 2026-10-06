import { describe, expect, it } from "vitest";
import { editorialMetadataHash, sanitizeEditorialError } from "./editorial-pipeline";

describe("editorial pipeline privacy contract", () => {
  const base = {
    sourceKey: "stf-jurisprudencia",
    externalKey: "research-portal",
    kind: "jurisprudence" as const,
    title: "STF — Pesquisa de Jurisprudência",
    summary: "Fonte oficial pública.",
    canonicalUrl: "https://portal.stf.jus.br/jurisprudencia/",
    publishedAt: null,
  };

  it("produces a stable metadata-only hash", () => {
    expect(editorialMetadataHash(base)).toHaveLength(64);
    expect(editorialMetadataHash(base)).toBe(editorialMetadataHash({ ...base }));
  });

  it("sanitizes URLs and line breaks from failures", () => {
    const value = sanitizeEditorialError(new Error("Falha https://example.com/segredo\nlinha"));
    expect(value).toBe("Falha [url] linha");
    expect(value).not.toContain("example.com");
  });
});
