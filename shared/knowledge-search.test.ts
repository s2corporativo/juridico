import { describe, expect, it } from "vitest";
import { buildSearchIndex, searchIndex, tokenize, type SearchableChunk } from "./knowledge-search";

describe("tokenize", () => {
  it("remove acentos, stopwords e tokens curtos", () => {
    expect(tokenize("A Prescrição de Ação Ambiental")).toEqual(["prescricao", "acao", "ambiental"]);
  });
});

describe("searchIndex", () => {
  const chunks: SearchableChunk[] = [
    { documentId: 1, documentKind: "knowledge_document", slug: "peca-defesa-ambiental", title: "Peça de defesa ambiental", area: "ambiental", sourceStatus: "official_confirmed", chunkId: 1, chunkContext: "Fundamentos", chunkText: "Defesa administrativa contra auto de infração ambiental por dano ao meio ambiente." },
    { documentId: 2, documentKind: "legislation", slug: "lei-consumidor", title: "Código de Defesa do Consumidor", area: "consumidor", sourceStatus: "official_confirmed", chunkId: null, chunkContext: null, chunkText: "Direitos básicos do consumidor em relações de compra e venda." },
  ];

  it("encontra o documento cujos termos batem com a consulta", () => {
    const hits = searchIndex("infração ambiental", buildSearchIndex(chunks), 5);
    expect(hits[0]?.slug).toBe("peca-defesa-ambiental");
  });

  it("não retorna nada para consulta sem termos válidos (só stopwords)", () => {
    expect(searchIndex("de a o", buildSearchIndex(chunks), 5)).toEqual([]);
  });

  it("devolve só um resultado por documento mesmo com múltiplos chunks batendo", () => {
    const twoChunksSameDoc: SearchableChunk[] = [
      { ...chunks[0], chunkId: 1, chunkText: "auto de infração ambiental primeiro trecho" },
      { ...chunks[0], chunkId: 2, chunkText: "auto de infração ambiental segundo trecho" },
    ];
    const hits = searchIndex("infração ambiental", buildSearchIndex(twoChunksSameDoc), 5);
    expect(hits).toHaveLength(1);
  });

  it("penaliza documento não revisado/demonstração, igualando termos e demais boosts (porte de rag.ts do EJC)", () => {
    const reviewed: SearchableChunk = { ...chunks[0], documentId: 10, slug: "doc-revisado", status: "ativo", chunkText: "auto de infração ambiental" };
    const demo: SearchableChunk = { ...chunks[0], documentId: 11, slug: "doc-demo", status: "demonstracao", chunkText: "auto de infração ambiental" };
    const pending: SearchableChunk = { ...chunks[0], documentId: 12, slug: "doc-pendente", status: "revisao_humana", chunkText: "auto de infração ambiental" };
    const hits = searchIndex("infração ambiental", buildSearchIndex([demo, pending, reviewed]), 5);
    expect(hits[0]?.slug).toBe("doc-revisado");
    expect(hits[0]!.score).toBeGreaterThan(hits[1]!.score);
    expect(hits[0]!.score).toBeGreaterThan(hits[2]!.score);
  });
});
