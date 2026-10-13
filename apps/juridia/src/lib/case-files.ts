import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
export type ExtractedPage = { pageNo: number; text: string; evidence: Record<string, unknown> };

export function sha256(input: Uint8Array | string) {
  return createHash("sha256").update(input).digest("hex");
}

export async function extractCaseFile(buffer: Buffer, mimeType: string, name: string): Promise<{ text: string; pages: ExtractedPage[]; status: "ready" | "ocr_required" }> {
  const lower = name.toLowerCase();
  if (mimeType === "text/plain" || lower.endsWith(".txt") || lower.endsWith(".md")) {
    const text = buffer.toString("utf8");
    return { text, pages: splitPages(text), status: "ready" };
  }
  const dir = await mkdtemp(join(tmpdir(), "juridia-case-"));
  const isImage = mimeType.startsWith("image/") || /\.(png|jpe?g|tiff?|bmp|webp)$/i.test(lower);
  const input = join(dir, isImage ? "input-image" : lower.endsWith(".docx") ? "input.docx" : "input.pdf");
  try {
    await writeFile(input, buffer);
    let text = "";
    let pages: ExtractedPage[] = [];
    if (mimeType === "application/pdf" || lower.endsWith(".pdf")) {
      text = String((await execFileAsync("pdftotext", ["-layout", input, "-"])).stdout || "");
      pages = splitPages(text);
      if (!text.trim()) {
        const imagePrefix = join(dir, "page");
        await execFileAsync("pdftoppm", ["-png", "-r", "200", input, imagePrefix]);
        const rendered = (await execFileAsync("bash", ["-lc", "printf '%s\\n' \"$1\"/*.png", "bash", dir])).stdout.trim().split("\n").filter(Boolean);
        const ocrPages: ExtractedPage[] = [];
        for (let index = 0; index < rendered.length; index += 1) {
          const ocr = String((await execFileAsync("tesseract", [rendered[index], "stdout", "-l", "por+eng"])).stdout || "").trim();
          ocrPages.push({ pageNo: index + 1, text: ocr, evidence: { source: "local-ocr", language: "por+eng", file: `page-${index + 1}` } });
        }
        pages = ocrPages;
        text = ocrPages.map((page) => page.text).filter(Boolean).join("\n\n");
      }
    } else if (mimeType.includes("wordprocessingml") || lower.endsWith(".docx")) {
      text = String((await execFileAsync("bash", ["-lc", `unzip -p "$1" word/document.xml 2>/dev/null | sed 's/<[^>]*>/ /g'`, "bash", input])).stdout || "");
      text = text.replace(/\s+/g, " ").trim();
      pages = splitPages(text);
    } else if (isImage) {
      text = String((await execFileAsync("tesseract", [input, "stdout", "-l", "por+eng"])).stdout || "").trim();
      pages = [{ pageNo: 1, text, evidence: { source: "local-ocr", language: "por+eng" } }];
    }
    return { text, pages: pages.length ? pages : splitPages(text), status: text.trim() ? "ready" : "ocr_required" };
  } catch {
    return { text: "", pages: [], status: "ocr_required" };
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

function splitPages(text: string): ExtractedPage[] {
  const pages = text.split(/\f|\n\s*---\s*P[ÁA]GINA\s+\d+\s*---\n/i).map((page) => page.trim()).filter(Boolean);
  return (pages.length ? pages : [text]).map((page, index) => ({
    pageNo: index + 1,
    text: page,
    evidence: { source: "local-extraction", start: 0, end: page.length },
  }));
}
