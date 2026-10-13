"use client";

import { useState } from "react";
import { FileUp, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

export function CaseFilesPanel() {
  const [busy, setBusy] = useState(false);
  const [count, setCount] = useState(0);
  async function upload(file?: File) {
    if (!file) return;
    setBusy(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/case-files", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "falha no processamento");
      setCount((value) => value + 1);
      toast({ title: "Autos processados", description: `${data.file.pageCount} página(s) · ${data.file.status === "ready" ? "texto extraído" : "OCR pendente"}` });
    } catch (error) {
      toast({ title: "Falha ao processar autos", description: error instanceof Error ? error.message : undefined, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="mb-5 rounded-lg border border-primary/30 bg-primary/5 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <FileUp className="h-4 w-4 text-primary" />
        <strong className="text-sm">Autos do trabalho</strong>
        <Badge variant="secondary">{count} arquivo(s)</Badge>
        <label className="ml-auto">
          <input className="sr-only" type="file" accept=".pdf,.docx,.txt,.md,image/*" disabled={busy} onChange={(event) => upload(event.target.files?.[0])} />
          <Button asChild size="sm" disabled={busy}>
            <span>{busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileUp className="mr-2 h-4 w-4" />}Adicionar autos</span>
          </Button>
        </label>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">PDF, DOCX, texto ou imagem. O arquivo é hashado, dividido em páginas e mantido separado do Atlas; imagem sem texto sinaliza OCR pendente.</p>
      {count > 0 && <div className="mt-2 flex items-center gap-1 text-xs text-primary"><CheckCircle2 className="h-3 w-3" /> Disponível para orientar a minuta após a análise.</div>}
    </div>
  );
}
