import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { createEvidence } from "@/lib/evidence";
import { detectInstructionInjection } from "@/lib/ai_governance";
import { archivePrivateOriginal } from "@/lib/private-originals";
import { logAuditEvent } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const run = promisify(execFile);
const MAX_FILE = 8 * 1024 * 1024;
const MAX_TEXT = 400_000;
const MAX_PAGES = 60;

/** Only deterministic extraction; scanned PDFs need an explicit OCR workflow. */
function decodeXml(xml: string): string {
  return xml
    .replace(/<w:tab\b[^>]*\/>/g, "\t")
    .replace(/<w:br\b[^>]*\/>/g, "\n")
    .replace(/<\/w:p>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&(?:lt|gt|amp|quot|apos|#x[0-9a-fA-F]+|#\d+);/g, (entity) => {
      const mapping: Record<string, string> = {
        "&lt;": "<", "&gt;": ">", "&amp;": "&", "&quot;": '"', "&apos;": "'",
      };
      if (entity in mapping) return mapping[entity];
      const value = entity.startsWith("&#x")
        ? parseInt(entity.slice(3, -1), 16) : parseInt(entity.slice(2, -1), 10);
      return Number.isInteger(value) && value > 0 && value <= 0x10ffff
        ? String.fromCodePoint(value) : "";
    });
}

function reject(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return reject("formato_de_envio_invalido", 400);
  }
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0 || file.size > MAX_FILE) {
    return reject("arquivo_ausente_ou_acima_de_8mb", 413);
  }
  const ext = file.name.toLowerCase().match(/\.(pdf|docx|txt|md)$/)?.[1];
  if (!ext) return reject("tipo_de_arquivo_nao_permitido", 415);
  const name = file.name.replace(/[^a-zA-Z0-9_. -]/g, "_").slice(0, 120);
  const rawCaseId = form.get("caseId");
  const caseId = typeof rawCaseId === "string" && rawCaseId !== "cerebro-session"
    ? rawCaseId.trim() : "";
  if (caseId) {
    const owned = await db.case.findFirst({
      where: {
        id: caseId,
        ...(auth.user.role === "admin"
          ? {} : { client: { is: { userId: auth.user.uid } } }),
      },
      select: { id: true },
    });
    if (!owned) return reject("processo_nao_autorizado", 404);
  }

  const binary = Buffer.from(await file.arrayBuffer());
  const kind = ext === "pdf" ? "%PDF-" : ext === "docx" ? "PK" : "";
  if (kind && !binary.subarray(0, kind.length).toString("ascii").startsWith(kind)) {
    return reject("assinatura_de_arquivo_invalida", 415);
  }

  const dir = await mkdtemp(join(tmpdir(), "juridia-file-"));
  let text = "";
  try {
    if (ext === "txt" || ext === "md") {
      text = new TextDecoder("utf-8", { fatal: true }).decode(binary);
    } else {
      const local = join(dir, "source." + ext);
      await writeFile(local, binary, { mode: 0o600, flag: "wx" });
      if (ext === "pdf") {
        const out = await run("pdftotext", ["-layout", "-enc", "UTF-8", local, "-"], {
          timeout: 12_000, maxBuffer: MAX_TEXT * 4, encoding: "utf8",
        });
        text = out.stdout;
      } else {
        const out = await run("unzip", ["-p", local, "word/document.xml"], {
          timeout: 12_000, maxBuffer: MAX_TEXT * 4, encoding: "utf8",
        });
        text = decodeXml(out.stdout);
      }
    }
  } catch {
    return reject("extracao_falhou_ou_documento_digitalizado_sem_ocr", 422);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }

  if (!text.trim()) return reject("arquivo_sem_texto_extraivel", 422);
  if (text.length > MAX_TEXT) return reject("arquivo_com_texto_acima_do_limite", 413);
  if (detectInstructionInjection(text)) return reject("documento_com_instrucoes_suspeitas_exige_revisao", 422);

  const rawPages = ext === "pdf" ? text.split("\f") : [text];
  const pages = rawPages.map((text, index) => ({ text, number: index + 1 })).filter((page) => page.text.trim().length > 0);
  if (pages.length > MAX_PAGES) return reject("limite_de_60_paginas_atingido", 413);

  const documentHash = createHash("sha256").update(binary).digest("hex");
  // Original archive is strictly opt-in, case-owned and outside the Next public tree.
  // If configured but unhealthy, reject; never promise that an original was stored.
  let retained = false;
  if (caseId && process.env.JURIDIA_PRIVATE_UPLOAD_ROOT) {
    try {
      const stored = await archivePrivateOriginal(caseId, binary);
      retained = stored.hash === documentHash;
    } catch {
      return reject("arquivo_original_privado_indisponivel", 503);
    }
  }
  let totalEvidence = 0;
  if (caseId) {
    for (const page of pages) {
      const excerpt = page.text.replace(/\s+/g, " ").trim().slice(0, 1500);
      if (excerpt.length < 10) continue;
      const reference = await createEvidence({
        caseId,
        quote: excerpt,
        pageNumber: ext === "pdf" ? page.number : null,
        sectionLabel: name,
        sourceKind: "text",
        retrievalMethod: "deterministic",
        documentHash,
        metadata: { fileName: name, uploadKind: ext, originalRetained: retained },
      });
      // Existing deduplicated references may predate private archival.
      if (retained) {
        const existing = await db.evidenceRef.findUnique({ where: { id: reference.id }, select: { metadata: true } });
        let previous: Record<string, unknown> = {};
        try { previous = JSON.parse(existing?.metadata ?? "{}"); } catch { /* replace invalid legacy JSON */ }
        await db.evidenceRef.update({
          where: { id: reference.id },
          data: { metadata: JSON.stringify({ ...previous, fileName: name, uploadKind: ext, originalRetained: true }) },
        });
      }
      totalEvidence++;
    }
    await logAuditEvent({
      action: "case_file_uploaded",
      resource: "case",
      resourceId: caseId,
      userId: auth.user.uid,
      metadata: { hash: documentHash, bytes: binary.length, pages: pages.length, retained, evidenceCount: totalEvidence },
    });
  }

  return NextResponse.json({
    fileName: name,
    text: text.trim(),
    textLength: text.trim().length,
    totalEvidence,
    documentHash,
    pages: pages.length,
    evidencePersisted: Boolean(caseId),
    originalRetained: retained,
    originalUrl: retained ? "/api/originals?caseId=" + encodeURIComponent(caseId) + "&hash=" + documentHash : null,
    warning: retained
      ? "Texto extraído. Original armazenado em cofre privado, mas ainda não validado juridicamente."
      : "Texto extraído, não validado juridicamente. O arquivo original não foi arquivado.",
  });
}
