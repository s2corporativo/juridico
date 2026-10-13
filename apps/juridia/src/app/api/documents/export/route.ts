import { NextRequest, NextResponse } from "next/server";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";

const execFileAsync = promisify(execFile);

function esc(value: string) { return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;"); }
function markdownToHtml(markdown: string) {
  return markdown.split("\n").map((line) => {
    if (line.startsWith("### ")) return `<h3>${esc(line.slice(4))}</h3>`;
    if (line.startsWith("## ")) return `<h2>${esc(line.slice(3))}</h2>`;
    if (line.startsWith("# ")) return `<h1>${esc(line.slice(2))}</h1>`;
    if (line.startsWith("- ")) return `<p class="bullet">• ${esc(line.slice(2))}</p>`;
    if (/^\d+\.\s/.test(line)) return `<p class="bullet">${esc(line)}</p>`;
    return line.trim() ? `<p>${esc(line)}</p>` : "";
  }).join("\n");
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;
  const body = (await req.json().catch(() => null)) as { documentId?: string; title?: string; content?: string; format?: "docx" | "pdf" } | null;
  if (!body?.format || !["docx", "pdf"].includes(body.format)) return NextResponse.json({ error: "format deve ser docx ou pdf" }, { status: 400 });
  let title = body.title?.trim() || "Documento JuridIA";
  let content = body.content || "";
  if (body.documentId) {
    const doc = await db.document.findFirst({ where: { id: body.documentId, userId: auth.user.uid }, select: { title: true, generatedContent: true } });
    if (!doc) return NextResponse.json({ error: "document_not_found" }, { status: 404 });
    title = doc.title;
    content = doc.generatedContent;
  }
  if (!content.trim()) return NextResponse.json({ error: "content obrigatório" }, { status: 400 });
  const dir = await mkdtemp(join(tmpdir(), "juridia-export-"));
  try {
    const html = `<!doctype html><html><head><meta charset="utf-8"><style>@page{size:A4;margin:2.5cm}body{font-family:Georgia,'Times New Roman',serif;font-size:12pt;line-height:1.75;color:#1a1a1a}h1{text-align:center;font-size:16pt;text-transform:uppercase}h2{text-transform:uppercase;font-size:13pt;margin-top:18pt}h3{font-size:12pt;margin-top:14pt}p{text-align:justify;text-indent:1.25cm;margin:0 0 8pt}.bullet{text-indent:0;margin-left:1cm}</style></head><body><h1>${esc(title)}</h1>${markdownToHtml(content)}<hr><p style="text-align:center;text-indent:0;font-size:9pt">Gerado por JuridIA em ${new Date().toLocaleDateString("pt-BR")}</p></body></html>`;
    const input = join(dir, "document.html");
    await writeFile(input, html, "utf8");
    if (body.format === "docx") {
      await execFileAsync("soffice", ["--headless", "--convert-to", "odt", "--outdir", dir, input], { timeout: 120000 });
      await execFileAsync("soffice", ["--headless", "--convert-to", "docx", "--outdir", dir, join(dir, "document.odt")], { timeout: 120000 });
    } else {
      await execFileAsync("soffice", ["--headless", "--convert-to", "pdf", "--outdir", dir, input], { timeout: 120000 });
    }
    const output = join(dir, `document.${body.format}`);
    const file = await readFile(output);
    const safeTitle = title.replace(/[^\p{L}\p{N}_-]+/gu, "-").replace(/^-|-$/g, "") || "documento-juridia";
    return new NextResponse(file, { headers: { "Content-Type": body.format === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "Content-Disposition": `attachment; filename="${safeTitle}.${body.format}"`, "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "falha na exportação" }, { status: 500 });
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
