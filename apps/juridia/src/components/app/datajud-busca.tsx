"use client";

import { useState } from "react";
import { Search, Loader2, FileText, Calendar, Building2, Scale, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

type RecordData = {
  numeroProcesso: string | null;
  tribunal: string | null;
  updatedAt: string | null;
  classe: string | null;
  orgaoJulgador: string | null;
  assuntos: string[];
  movimentos: Array<{ date: string | null; name: string | null }>;
};

type ApiResult = {
  found: boolean;
  alias: string;
  record: RecordData | null;
  citation: string;
  error?: string;
};

function formatCnj(input: string): string {
  const digits = input.replace(/\D/g, "").slice(0, 20);
  if (!digits) return "";
  let out = digits.slice(0, 7);
  if (digits.length > 7) out += "-" + digits.slice(7, 9);
  if (digits.length > 9) out += "." + digits.slice(9, 13);
  if (digits.length > 13) out += "." + digits.slice(13, 14);
  if (digits.length > 14) out += "." + digits.slice(14, 16);
  if (digits.length > 16) out += "." + digits.slice(16, 20);
  return out;
}

export function DataJudBusca() {
  const [cnj, setCnj] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);

  async function buscar() {
    const digits = cnj.replace(/\D/g, "");
    if (digits.length !== 20) {
      toast({ title: "CNJ inválido", description: "Informe os 20 dígitos do número CNJ.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const response = await fetch(`/api/datajud?cnj=${encodeURIComponent(cnj)}`, { credentials: "include" });
      const body = await response.json() as ApiResult;
      if (!response.ok) throw new Error(body.error || "Consulta DataJud indisponível.");
      setResult(body);
      toast({
        title: body.found ? "Processo localizado" : "Processo não localizado",
        description: body.alias?.toUpperCase(),
      });
    } catch (error) {
      toast({
        title: "Falha na consulta",
        description: error instanceof Error ? error.message : "Não foi possível consultar o DataJud.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-juridia py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Search className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">DataJud — Consulta processual</h1>
          <p className="text-sm text-muted-foreground">Consulta oficial por número CNJ, com retorno sanitizado e indicação da fonte.</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <Label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Número CNJ</Label>
              <Input
                value={cnj}
                onChange={(event) => setCnj(formatCnj(event.target.value))}
                onKeyDown={(event) => { if (event.key === "Enter") void buscar(); }}
                placeholder="0000000-00.0000.0.00.0000"
                className="font-mono"
                maxLength={25}
              />
            </div>
            <Button onClick={() => void buscar()} disabled={loading || cnj.replace(/\D/g, "").length !== 20}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              {loading ? "Consultando..." : "Consultar"}
            </Button>
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">Fonte: Conselho Nacional de Justiça — DataJud. A consulta não presume completude do acervo.</p>
        </CardContent>
      </Card>

      {result && !result.found && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-700 dark:text-amber-400">
          <AlertTriangle className="mr-2 inline h-4 w-4" />
          Nenhum registro foi retornado pelo alias {result.alias.toUpperCase()} para este número.
        </div>
      )}

      {result?.record && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-primary" />
                {result.record.classe || "Processo"}
              </CardTitle>
              <p className="font-mono text-xs text-muted-foreground">{result.record.numeroProcesso || cnj}</p>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <Field icon={Building2} label="Tribunal" value={result.record.tribunal || result.alias.toUpperCase()} />
              <Field icon={Scale} label="Órgão julgador" value={result.record.orgaoJulgador || "Não informado"} />
              <Field icon={FileText} label="Assuntos" value={result.record.assuntos.join(" · ") || "Não informados"} />
              <Field icon={Calendar} label="Atualização" value={result.record.updatedAt ? new Date(result.record.updatedAt).toLocaleString("pt-BR") : "Não informada"} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Movimentações</CardTitle></CardHeader>
            <CardContent>
              <div className="max-h-[70vh] space-y-2 overflow-y-auto">
                {result.record.movimentos.length ? result.record.movimentos.map((movement, index) => (
                  <div key={index} className="rounded border border-border p-2 text-xs">
                    <div className="font-mono text-[10px] text-primary">
                      {movement.date ? new Date(movement.date).toLocaleString("pt-BR") : "Data não informada"}
                    </div>
                    <div className="mt-1">{movement.name || "Movimento sem descrição"}</div>
                  </div>
                )) : <p className="text-xs text-muted-foreground">Nenhuma movimentação retornada.</p>}
              </div>
              <Badge variant="secondary" className="mt-3">{result.citation}</Badge>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function Field({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded border border-border p-3">
      <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="mt-1 text-xs font-medium">{value}</div>
    </div>
  );
}
