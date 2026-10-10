import { describe, expect, it } from "vitest";
import { editorialMetadataHash, sanitizeEditorialError, withinEditorialDeadline } from "./editorial-pipeline";

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

  it("bounds a hung collector and preserves success of responsive collectors", async () => {
    expect(await withinEditorialDeadline(Promise.resolve("STJ_OK"), 100)).toBe("STJ_OK");
    await expect(withinEditorialDeadline(new Promise<never>(() => {}), 5)).rejects.toThrow("EDITORIAL_SOURCE_TIMEOUT");
  });

  it("sanitizes URLs and line breaks from failures", () => {
    const value = sanitizeEditorialError(new Error("Falha https://example.com/segredo\nlinha"));
    expect(value).toBe("Falha [url] linha");
    expect(value).not.toContain("example.com");
  });
});
