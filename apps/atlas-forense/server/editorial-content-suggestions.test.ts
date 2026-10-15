import { describe, expect, it } from "vitest";
import { buildPautaJurUrl, rankContentIdeas } from "../client/src/lib/editorial-content-suggestions";

describe("Sugestões de conteúdo para Pauta.Jur", () => {
  it("prioriza afinidade temática com uma atualização editorial e não mostra fatos do caso", () => {
    const items = rankContentIdeas([
      { title: "Orientação sobre fraudes com Pix", summary: "Caso particular de pessoa identificada, sem necessidade de transmissão." }
    ], 3);
    expect(items[0].id).toBe("pix");
    expect(items[0].matched).toBe(true);
    expect(JSON.stringify(items)).not.toContain("pessoa identificada");
  });

  it("usa pauta permanente quando não há dados aprovados", () => {
    const items = rankContentIdeas([], 3);
    expect(items).toHaveLength(3);
    expect(items.every(item => item.matched === false)).toBe(true);
  });

  it("transfere apenas ID permitido para a URL HTTPS do estúdio", () => {
    const url = buildPautaJurUrl("ir");
    expect(url).toContain("pauta=ir");
    expect(url).toContain("origem=atlas");
    expect(url).not.toContain("processo");
    expect(buildPautaJurUrl("123456.2026.8.13.0000")).toBeNull();
    expect(buildPautaJurUrl("ir", "http://inseguro.example")).toBeNull();
  });

  it("não interpreta conteúdo arbitrário como uma nova pauta", () => {
    expect(buildPautaJurUrl("javascript:alert(1)")).toBeNull();
  });
});
