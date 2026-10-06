"use client";

// BatchPanel — Geração em LOTE com aprovação da 1ª minuta como molde
// (paridade MinutaIA). Fluxo:
//   1. O advogado cola N casos (blocos separados por ---, cada linha
//      "campo: valor" — aceita rótulo do template ou a própria chave).
//   2. Gera a minuta do CASO 1 e permite revisar/editar.
//   3. Ao aprovar, a molde guia a geração dos casos restantes (sequencial,
//      com progresso por caso; todos os documentos ficam vinculados ao
//      mesmo batchId).
//
// Orquestração no cliente (chama a rota /api/generate-minuta caso a caso):
// evita timeouts de lote grande no servidor e mostra progresso real. O
// servidor continua sendo a única fonte de verdade (auth, anonimização,
// telemetria e persistência por caso).

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TemplateDTO, GenerateMinutaResponse } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { toast } from "@/hooks/use-toast";
import {
  Layers,
  Loader2,
  Wand2,
  CheckCircle2,
  XCircle,
  FileCheck2,
  PencilLine,
} from "lucide-react";

const MAX_BATCH_CASES = 10;

interface ParsedCase {
  index: number;
  title?: string;
  fields: Record<string, string>;
  raw: string;
}

interface BatchResult {
  label: string;
  ok: boolean;
  docId?: string;
  title?: string;
  error?: string;
  tokens?: number;
  violations?: number;
  degraded?: boolean;
}

// Normaliza para comparação de rótulos: minúsculas, sem acentos, sem pontuação
function norm(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/** Faz o parse do texto colado em casos; mapeia "rótulo: valor" para campos do template */
export function parseBatchCases(text: string, template: TemplateDTO): { cases: ParsedCase[]; errors: string[] } {
  const errors: string[] = [];
  const blocks = text
    .split(/^\s*-{3,}\s*$/m)
    .map((b) => b.trim())
    .filter(Boolean);

  const keyByNorm = new Map<string, string>(); // norm(key|label) -> key
  for (const f of template.fields) {
    keyByNorm.set(norm(f.key), f.key);
    keyByNorm.set(norm(f.label), f.key);
  }
  const titleAliases = new Set(["titulo", "title", "nomedaminuta"]);

  const cases: ParsedCase[] = [];
  blocks.forEach((block, i) => {
    const fields: Record<string, string> = {};
    let title: string | undefined;
    let matched = 0;
    for (const line of block.split("\n")) {
      const m = line.match(/^\s*([^:]{1,60}?)\s*:\s*(.+)$/);
      if (!m) continue;
      const labelNorm = norm(m[1]);
      const value = m[2].trim();
      if (!value) continue;
      if (titleAliases.has(labelNorm)) {
        title = value;
        continue;
      }
      const key = keyByNorm.get(labelNorm);
      if (key) {
        fields[key] = fields[key] ? `${fields[key]}; ${value}` : value;
        matched++;
      } else {
        errors.push(`Caso ${i + 1}: campo "${m[1]}" não existe no template — linha ignorada.`);
      }
    }
    if (matched === 0 && !title) {
      errors.push(`Caso ${i + 1}: nenhuma linha "campo: valor" reconhecida — bloco ignorado.`);
      return;
    }
    cases.push({ index: i, title, fields, raw: block.slice(0, 120) });
  });
  return { cases, errors };
}

export function BatchPanel({
  template,
  skillSlugs,
  writingStyle,
  brainContext,
}: {
  template: TemplateDTO;
  skillSlugs: string[];
  writingStyle?: string;
  brainContext?: string | null;
}) {
  const { setCurrentDocId, setAppTab } = useAppStore();

  const [casesText, setCasesText] = useState("");
  const [phase, setPhase] = useState<"idle" | "mold" | "approving" | "batch">("idle");
  const [batchId] = useState(() =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `batch-${Date.now()}`
  );
  const [moldContent, setMoldContent] = useState("");
  const [moldTitle, setMoldTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<BatchResult[]>([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const parsed = useMemo(() => parseBatchCases(casesText, template), [casesText, template]);
  const cases = parsed.cases.slice(0, MAX_BATCH_CASES);
  const overflow = parsed.cases.length - cases.length;

  async function callGenerate(payload: Record<string, unknown>): Promise<GenerateMinutaResponse> {
    const res = await fetch("/api/generate-minuta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
    return data as GenerateMinutaResponse;
  }

  async function generateMold() {
    if (!cases.length) {
      toast({ title: "Cole ao menos um caso", variant: "destructive" });
      return;
    }
    setBusy(true);
    setResults([]);
    try {
      const data = await callGenerate({
        templateSlug: template.slug,
        fields: cases[0].fields,
        skillSlugs,
        title: cases[0].title || undefined,
        batchId,
        brainContext: brainContext || undefined,
        writingStyle: writingStyle || undefined,
      });
      setMoldContent(data.document.generatedContent);
      setMoldTitle(data.document.title);
      setPhase("approving");
      setCurrentDocId(data.document.id);
      toast({
        title: "Minuta-molde gerada",
        description: "Revise o texto — ele guiará todo o lote.",
      });
    } catch (e) {
      toast({
        title: "Erro ao gerar a molde",
        description: e instanceof Error ? e.message : undefined,
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  }

  async function generateRest() {
    const rest = cases.slice(1);
    if (!rest.length) {
      toast({ title: "Só há o caso-molde na lista" });
      return;
    }
    setBusy(true);
    setPhase("batch");
    setProgress({ current: 0, total: rest.length });
    const acc: BatchResult[] = [];
    for (let i = 0; i < rest.length; i++) {
      const c = rest[i];
      try {
        const data = await callGenerate({
          templateSlug: template.slug,
          fields: c.fields,
          skillSlugs,
          title: c.title || undefined,
          batchId,
          moldContent,
          brainContext: brainContext || undefined,
          writingStyle: writingStyle || undefined,
        });
        acc.push({
          label: c.title || `Caso ${c.index + 2}`,
          ok: true,
          docId: data.document.id,
          title: data.document.title,
          tokens: data.tokensUsed,
          violations: data.validation?.violations?.length ?? 0,
          degraded: data.pipeline?.degraded,
        });
      } catch (e) {
        acc.push({
          label: c.title || `Caso ${c.index + 2}`,
          ok: false,
          error: e instanceof Error ? e.message : "falha",
        });
      }
      setResults([...acc]);
      setProgress({ current: i + 1, total: rest.length });
    }
    setBusy(false);
    const okCount = acc.filter((r) => r.ok).length;
    toast({
      title: `Lote concluído: ${okCount}/${rest.length} minutas geradas`,
      description: "Todas vinculadas ao mesmo lote (batchId).",
    });
  }

  const openDoc = (id?: string) => {
    if (!id) return;
    setCurrentDocId(id);
    setAppTab("editor");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Layers className="h-4 w-4 text-primary" />
            Geração em lote — caso 1 vira a molde
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-md border border-dashed border-primary/40 bg-primary/5 p-3 text-xs text-muted-foreground">
            Cole os casos em blocos separados por uma linha <code>---</code>. Cada linha é
            <code> campo: valor</code> (aceita o rótulo do template ou a chave). O primeiro bloco
            gera a <strong>minuta-molde</strong>, que você aprova antes do restante do lote.
            Máximo de {MAX_BATCH_CASES} casos por lote.
          </div>
          <Textarea
            rows={10}
            value={casesText}
            onChange={(e) => setCasesText(e.target.value)}
            placeholder={`titulo: Ação de cobrança — Fulano\n${template.fields[0]?.label || "campo"}: valor do caso\n\n---\n\ntitulo: Ação de cobrança — Beltrano\n${template.fields[0]?.label || "campo"}: outro valor`}
            className="font-mono text-xs"
          />
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary">{cases.length} caso(s) reconhecido(s)</Badge>
            {overflow > 0 && (
              <span className="text-destructive">{overflow} caso(s) acima do limite ignorado(s)</span>
            )}
          </div>
          {parsed.errors.length > 0 && (
            <ul className="max-h-24 space-y-1 overflow-y-auto rounded border border-amber-500/40 bg-amber-500/5 p-2 text-[11px] text-amber-700 dark:text-amber-400 scrollbar-juridia">
              {parsed.errors.slice(0, 8).map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          )}
          {phase === "idle" && (
            <Button onClick={generateMold} disabled={busy || !cases.length} className="w-full sm:w-auto">
              {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              Gerar molde (caso 1)
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Aprovação da molde */}
      {phase === "approving" && (
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PencilLine className="h-4 w-4 text-primary" />
              Revise e aprove a minuta-molde
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Label htmlFor="mold-title" className="text-xs">Título da molde</Label>
            <Input
              id="mold-title"
              value={moldTitle}
              onChange={(e) => setMoldTitle(e.target.value)}
            />
            <Label htmlFor="mold-content" className="text-xs">
              Conteúdo (editável — a IA segue estrutura, nível de detalhe e tom)
            </Label>
            <Textarea
              id="mold-content"
              rows={14}
              value={moldContent}
              onChange={(e) => setMoldContent(e.target.value)}
              className="font-mono text-xs"
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={generateRest} disabled={busy || cases.length < 2}>
                {busy ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FileCheck2 className="mr-2 h-4 w-4" />
                )}
                Aprovar molde e gerar lote ({Math.max(0, cases.length - 1)} casos)
              </Button>
              <Button variant="outline" disabled={busy} onClick={() => setPhase("idle")}>
                Descartar e voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progresso do lote */}
      {phase === "batch" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              {busy ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <CheckCircle2 className="h-4 w-4 text-primary" />}
              Executando o lote ({progress.current}/{progress.total})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress value={progress.total ? (progress.current / progress.total) * 100 : 0} />
            <ul className="space-y-1.5">
              {results.map((r, i) => (
                <li key={i} className="flex items-center gap-2 text-xs">
                  {r.ok ? (
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 shrink-0 text-destructive" />
                  )}
                  <span className="font-medium">{r.label}</span>
                  {r.ok ? (
                    <>
                      <Badge variant="secondary" className="text-[10px]">
                        {r.tokens ?? 0} tokens
                      </Badge>
                      {(r.violations ?? 0) > 0 && (
                        <Badge variant="outline" className="text-[10px] text-amber-600">
                          {r.violations} ressalva(s)
                        </Badge>
                      )}
                      {r.degraded && (
                        <Badge variant="destructive" className="text-[10px]">degradado</Badge>
                      )}
                      <Button size="sm" variant="ghost" className="ml-auto h-6 px-2" onClick={() => openDoc(r.docId)}>
                        abrir
                      </Button>
                    </>
                  ) : (
                    <span className="text-destructive">{r.error}</span>
                  )}
                </li>
              ))}
            </ul>
            {!busy && (
              <Button size="sm" variant="outline" onClick={() => { setPhase("idle"); setResults([]); }}>
                Novo lote
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
