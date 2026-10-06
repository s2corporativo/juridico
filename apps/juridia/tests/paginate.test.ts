// tests/paginate.test.ts — paginação estimada de minutas (função pura)
// Executar: bun run tests/paginate.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseMarkdownBlocks,
  estimateBlockLines,
  paginateMarkdown,
} from "../src/lib/paginate";

test("parseMarkdownBlocks: funde linhas consecutivas em um parágrafo", () => {
  const md = "linha um da petição\nlinha dois da petição\n\n## II. Dos Fatos";
  const blocks = parseMarkdownBlocks(md);
  assert.equal(blocks.length, 2);
  assert.equal(blocks[0], "linha um da petição linha dois da petição");
  assert.equal(blocks[1], "## II. Dos Fatos");
});

test("parseMarkdownBlocks: separa títulos, listas e parágrafos", () => {
  const md = "# TÍTULO\n\n## Seção\nParágrafo.\n- item a\n- item b\n1. pedido um";
  const blocks = parseMarkdownBlocks(md);
  assert.deepEqual(blocks, ["# TÍTULO", "## Seção", "Parágrafo.", "- item a", "- item b", "1. pedido um"]);
});

test("estimateBlockLines: vazio = 1, parágrafo estoura wrap conforme largura", () => {
  assert.equal(estimateBlockLines("", 85), 1);
  const p = "x".repeat(170); // 2 linhas de 85 + 1 respiro
  assert.equal(estimateBlockLines(p, 85), 3);
  const heading = "## " + "y".repeat(85); // 1 linha + 2 respiros
  assert.equal(estimateBlockLines(heading, 85), 3);
});

test("paginateMarkdown: texto curto cabe em 1 página", () => {
  const r = paginateMarkdown("## Petição\n\nPequena.");
  assert.equal(r.pages.length, 1);
  assert.equal(r.pages[0].blocks.length, 2);
});

test("paginateMarkdown: documento longo gera múltiplas páginas", () => {
  const paragraphs = Array.from({ length: 40 }, (_, i) => `Parágrafo ${i} ${"conteúdo do parágrafo ".repeat(6)}`).join("\n\n");
  const r = paginateMarkdown(paragraphs);
  assert.ok(r.pages.length > 3, `esperado >3 páginas, obtido ${r.pages.length}`);
  // nenhuma página (exceto página única gigante) excede a capacidade
  for (const p of r.pages) {
    if (p.blocks.length > 1) assert.ok(p.usedLines <= p.capacity, "página excedeu capacidade");
  }
});

test("paginateMarkdown: 1ª página com timbrado tem capacidade reduzida", () => {
  const paragraphs = Array.from({ length: 30 }, (_, i) => `Parágrafo ${i} ${"texto corrido do parágrafo ".repeat(6)}`).join("\n\n");
  const plain = paginateMarkdown(paragraphs);
  const withLetterhead = paginateMarkdown(paragraphs, { firstPageCapacity: 26 });
  assert.ok(withLetterhead.pages.length >= plain.pages.length, "timbrado não pode reduzir páginas");
  assert.equal(withLetterhead.pages[0].capacity, 26);
});

test("paginateMarkdown: bloco maior que a página ganha página própria", () => {
  const giant = "Parágrafo gigante " + "x".repeat(5000); // >> 33 linhas
  const md = `## Início\n\ncurto\n\n${giant}\n\nfinal`;
  const r = paginateMarkdown(md);
  assert.ok(r.pages.length >= 3);
  const giantPage = r.pages.find((p) => p.blocks.some((b) => b.startsWith("Parágrafo gigante")));
  assert.ok(giantPage, "bloco gigante deve ter página");
  assert.equal(giantPage!.blocks.length, 1, "bloco gigante não divide página com outros");
});

test("paginateMarkdown: vazio → 1 página vazia", () => {
  const r = paginateMarkdown("");
  assert.equal(r.pages.length, 1);
  assert.equal(r.pages[0].blocks.length, 0);
  assert.equal(r.totalBlocks, 0);
});

test("paginateMarkdown: monotônico — mais texto nunca reduz páginas", () => {
  const short = Array.from({ length: 10 }, (_, i) => `P${i} ${"texto ".repeat(10)}`).join("\n\n");
  const long = Array.from({ length: 60 }, (_, i) => `P${i} ${"texto ".repeat(10)}`).join("\n\n");
  const a = paginateMarkdown(short);
  const b = paginateMarkdown(long);
  assert.ok(b.pages.length >= a.pages.length);
});
