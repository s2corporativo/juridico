// paginate.ts — Paginação ESTIMADA de minutas em páginas A4 (pure function).
//
// Editor paginado com estimativa visual. Aqui a paginação é uma ESTIMATIVA
// determinística de quantas páginas a peça terá quando impressa (o navegador
// faz a paginação real no Ctrl+P via @page). A UI usa este módulo para
// desenhar as páginas na tela com timbrado.
//
// Modelo: blocos Markdown (título, seção, subseção, parágrafo, item de lista)
// ocupam um número estimado de linhas; cada página comporta um número fixo de
// linhas (A4, 12pt, entrelinha 1,75, margens 2,5 cm ≈ 33 linhas). Blocos nunca
// são partidos no meio — um bloco maior que a página ganha página própria.

export interface PaginationOptions {
  /** Linhas de conteúdo por página (default 33) */
  linesPerPage?: number;
  /** Largura média da linha em caracteres (default 85) */
  charsPerLine?: number;
  /** Capacidade reduzida da 1ª página (timbrado completo ocupa espaço) */
  firstPageCapacity?: number;
}

export interface PaginatedPage {
  blocks: string[];
  /** Capacidade em linhas desta página (1ª pode ser menor, timbrado) */
  capacity: number;
  /** Linhas estimadas efetivamente usadas */
  usedLines: number;
}

export interface PaginationResult {
  pages: PaginatedPage[];
  totalBlocks: number;
  totalLines: number;
}

/** Linhas estimadas de um bloco renderizado (inclui 1 linha de respiro) */
export function estimateBlockLines(block: string, charsPerLine: number): number {
  const text = block.trim();
  if (!text) return 1;
  const wrap = (s: string) => Math.max(1, Math.ceil(s.length / charsPerLine));
  if (text.startsWith("### ")) return wrap(text.slice(4)) + 2;
  if (text.startsWith("## ")) return wrap(text.slice(3)) + 2;
  if (text.startsWith("# ")) return wrap(text.slice(2)) + 2;
  if (/^[-*]\s/.test(text)) return wrap(text.slice(2)) + 1;
  if (/^\d+[.)]\s/.test(text)) return wrap(text.replace(/^\d+[.)]\s/, "")) + 1;
  // Parágrafo (linhas consecutivas já foram fundidas pelo parser)
  return wrap(text) + 1;
}

/** Divide o Markdown em blocos: parágrafos consecutivos são fundidos. */
export function parseMarkdownBlocks(md: string): string[] {
  const blocks: string[] = [];
  let paragraph: string[] = [];
  const flush = () => {
    if (paragraph.length) {
      blocks.push(paragraph.join(" "));
      paragraph = [];
    }
  };
  for (const rawLine of md.split("\n")) {
    const line = rawLine.trimEnd();
    if (line.trim() === "") {
      flush();
      continue;
    }
    const isHeading = /^#{1,3}\s/.test(line);
    const isListItem = /^[-*]\s/.test(line) || /^\d+[.)]\s/.test(line);
    if (isHeading || isListItem) {
      flush();
      blocks.push(line.trim());
    } else {
      paragraph.push(line.trim());
    }
  }
  flush();
  return blocks;
}

export function paginateMarkdown(
  md: string,
  opts: PaginationOptions = {}
): PaginationResult {
  const linesPerPage = Math.max(5, opts.linesPerPage ?? 33);
  const charsPerLine = Math.max(20, opts.charsPerLine ?? 85);
  const firstPageCapacity = Math.max(
    5,
    opts.firstPageCapacity ?? linesPerPage
  );

  const blocks = parseMarkdownBlocks(md);
  const pages: PaginatedPage[] = [];
  let current: PaginatedPage = { blocks: [], capacity: firstPageCapacity, usedLines: 0 };
  let totalLines = 0;

  const pushPage = () => {
    pages.push(current);
    current = { blocks: [], capacity: linesPerPage, usedLines: 0 };
  };

  for (const block of blocks) {
    const lines = estimateBlockLines(block, charsPerLine);
    totalLines += lines;
    if (current.blocks.length > 0 && current.usedLines + lines > current.capacity) {
      pushPage();
    }
    current.blocks.push(block);
    current.usedLines += lines;
  }
  if (current.blocks.length || pages.length === 0) pages.push(current);

  return { pages, totalBlocks: blocks.length, totalLines };
}
