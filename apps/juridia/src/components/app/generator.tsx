"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Gavel,
  Scale,
  FileSignature,
  Lightbulb,
  Stamp,
  ShieldAlert,
  Sparkles,
  Loader2,
  Wand2,
  CheckCircle2,
  HardHat,
  Landmark,
  Image,
  Mail,
  Brain,
  Layers,
  FileEdit,
  FileCheck2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import type { TemplateDTO, SkillDTO, GenerateMinutaResponse } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { BatchPanel } from "./batch-panel";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  Gavel,
  Scale,
  FileSignature,
  Lightbulb,
  Stamp,
  HardHat,
  Landmark,
  Image,
  Mail,
};

export function Generator() {
  const {
    selectedTemplateSlug,
    setSelectedTemplateSlug,
    selectedSkillSlugs,
    toggleSkill,
    setAppTab,
    setCurrentDocId,
    user,
    brainContext,
    setBrainContext,
    writingStyle,
    currentCaseId,
  } = useAppStore();

  const [templates, setTemplates] = useState<TemplateDTO[]>([]);
  const [skills, setSkills] = useState<SkillDTO[]>([]);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<
    "idle" | "prepare" | "outline" | "draft" | "review" | "finalize"
  >("idle");
  const [liveDraft, setLiveDraft] = useState("");
  const [mode, setMode] = useState<"individual" | "agentic" | "lote">("agentic");
  const [result, setResult] = useState<GenerateMinutaResponse | null>(null);
  const [agentRunId, setAgentRunId] = useState<string | null>(null);
  const [agentPlan, setAgentPlan] = useState<{
    resumo?: string;
    perguntas?: string[];
    estrategia?: string;
    roteiro?: { titulo: string; objetivo: string; fontesNecessarias?: string[] }[];
    riscos?: string[];
    pesquisaInsuficiente?: string[];
  } | null>(null);
  const [agentResearch, setAgentResearch] = useState<unknown[]>([]);
  const [agentAnswers, setAgentAnswers] = useState<Record<string, string>>({});
  const liveRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    fetch("/api/templates")
      .then((r) => r.json())
      .then((d) => {
        setTemplates(d.templates || []);
        if (d.templates?.length && !selectedTemplateSlug) {
          setSelectedTemplateSlug(d.templates[0].slug);
        }
      })
      .catch(() => null);
    fetch("/api/skills")
      .then((r) => r.json())
      .then((d) => setSkills(d.skills || []))
      .catch(() => null);
  }, [selectedTemplateSlug, setSelectedTemplateSlug]);

  const current = templates.find((t) => t.slug === selectedTemplateSlug);

  // Filtra skills por categoria do template
  const templateCategory = current?.category || "civil";
  const suggestedSkills = skills.filter(
    (s) =>
      s.category === templateCategory ||
      s.category === "civil" ||
      s.slug === "cnj-615-2025" ||
      s.slug === "lgpd-dados-sensiveis"
  );

  /** Lê a resposta SSE do servidor, evento a evento. */
  async function readSse(
    res: Response,
    handlers: {
      onStage?: (e: { stage: string; status: string; note?: string }) => void;
      onDraft?: (text: string) => void;
      onDone?: (data: GenerateMinutaResponse) => void;
      onError?: (msg: string) => void;
    }
  ) {
    const reader = res.body?.getReader();
    if (!reader) throw new Error("resposta sem corpo de stream");
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value as unknown as ArrayBuffer, { stream: true });
      let sep: number;
      while ((sep = buffer.indexOf("\n\n")) !== -1) {
        const frame = buffer.slice(0, sep);
        buffer = buffer.slice(sep + 2);
        let event = "message";
        let data = "";
        for (const line of frame.split("\n")) {
          if (line.startsWith("event: ")) event = line.slice(7).trim();
          else if (line.startsWith("data: ")) data += line.slice(6);
        }
        if (!data) continue;
        try {
          const json = JSON.parse(data);
          if (event === "stage") handlers.onStage?.(json);
          else if (event === "draft") handlers.onDraft?.(json.text || "");
          else if (event === "done") handlers.onDone?.(json as GenerateMinutaResponse);
          else if (event === "error") handlers.onError?.(json.error || "falha na geração");
        } catch {
          // frame parcial — ignora
        }
      }
    }
  }

  async function generate() {
    if (!current) {
      toast({ title: "Selecione um template", variant: "destructive" });
      return;
    }
    // Verifica se há dados sensíveis típicos nos campos
    const hasData = Object.values(fields).some((v) => v && v.trim());
    if (!hasData) {
      toast({
        title: "Preencha ao menos um campo do caso",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    setResult(null);
    setLiveDraft("");
    setStep("prepare");

    const applyResult = (data: GenerateMinutaResponse) => {
      setResult(data);
      setCurrentDocId(data.document.id);
      const hasErrors =
        data.validation?.violations?.some((v) => v.severity === "error") ||
        data.pipeline?.degraded;
      if (hasErrors) {
        toast({
          title: "Minuta gerada com ressalvas",
          description: "Verifique o relatório de conformidade antes de usar a peça.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Minuta gerada!",
          description: "Pipeline em 3 etapas concluído e marcadores restaurados localmente.",
        });
        setAppTab("editor");
      }
    };

    try {
      const payload = {
        templateSlug: current.slug,
        fields,
        skillSlugs: selectedSkillSlugs,
        title: title || undefined,
        brainContext: brainContext || undefined,
        writingStyle: writingStyle || undefined,
      };
      const res = await fetch("/api/generate-minuta/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.headers.get("content-type")?.includes("text/event-stream")) {
        let failure: string | null = null;
        await readSse(res, {
          onStage: (e) => {
            setStep(e.stage as typeof step);
          },
          onDraft: (text) => {
            setStep("draft");
            setLiveDraft((prev) => (prev + text).slice(-4000));
          },
          onDone: applyResult,
          onError: (msg) => {
            failure = msg;
          },
        });
        if (failure) throw new Error(failure);
      } else {
        // Rota de streaming indisponível (404 em deploy antigo) → clássica.
        const classic = await fetch("/api/generate-minuta", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!classic.ok) {
          const err = await classic.json().catch(() => ({}));
          throw new Error(err?.error || `HTTP ${classic.status}`);
        }
        applyResult((await classic.json()) as GenerateMinutaResponse);
      }
      setStep("idle");
    } catch (e) {
      setStep("idle");
      toast({
        title: "Erro ao gerar minuta",
        description: e instanceof Error ? e.message : undefined,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setLiveDraft("");
    }
  }

  async function planAgentic() {
    if (!current) return;
    if (!Object.values(fields).some((v) => v && v.trim())) {
      toast({ title: "Preencha ao menos um campo do caso", variant: "destructive" });
      return;
    }
    setLoading(true);
    setResult(null);
    setAgentPlan(null);
    setAgentResearch([]);
    setStep("prepare");
    try {
      const request = {
        templateSlug: current.slug,
        fields,
        skillSlugs: selectedSkillSlugs,
        title: title || undefined,
        brainContext: brainContext || undefined,
        writingStyle: writingStyle || undefined,
        caseId: currentCaseId || undefined,
      };
      const res = await fetch("/api/generate-minuta/agentic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phase: "plan", request }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setAgentRunId(data.runId);
      setAgentPlan(data.plan || null);
      setAgentResearch(Array.isArray(data.research) ? data.research : []);
      setStep("idle");
      toast({
        title: "Plano agêntico pronto para revisão",
        description: "Revise estratégia, lacunas e pesquisa antes de autorizar a redação.",
      });
    } catch (e) {
      setStep("idle");
      toast({ title: "Falha no planejamento agêntico", description: e instanceof Error ? e.message : undefined, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  async function approveAgenticAndDraft() {
    if (!current || !agentRunId || !agentPlan) return;
    setLoading(true);
    setStep("draft");
    try {
      const request = {
        templateSlug: current.slug,
        fields,
        skillSlugs: selectedSkillSlugs,
        title: title || undefined,
        brainContext: brainContext || undefined,
        writingStyle: writingStyle || undefined,
        caseId: currentCaseId || undefined,
      };
      const res = await fetch("/api/generate-minuta/agentic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phase: "draft", runId: agentRunId, request, approvedPlan: agentPlan, answers: agentAnswers }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      const generated = data.result as GenerateMinutaResponse;
      setResult(generated);
      setCurrentDocId(generated.document.id);
      const blocked = generated.validation?.violations?.some((v) => v.severity === "error") || generated.pipeline?.degraded;
      if (blocked) {
        toast({ title: "Minuta gerada com bloqueios de revisão", description: "Abra o relatório de conformidade antes de homologar.", variant: "destructive" });
      } else {
        toast({ title: "Minuta agêntica concluída", description: "Plano, pesquisa, redação e gates concluídos." });
        setAppTab("editor");
      }
      setStep("idle");
    } catch (e) {
      setStep("idle");
      toast({ title: "Falha na redação agêntica", description: e instanceof Error ? e.message : undefined, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  const stepLabels: Record<string, string> = {
    prepare: "1. Pseudonimizando, roteando habilidades e fontes...",
    outline: "2. Estrategista: planejando a peça...",
    draft: "3. Redator sênior: redigindo (ao vivo)...",
    review: "4. Revisor sênior: 2ª passada...",
    finalize: "5. Reidratando marcadores e validando...",
    idle: "",
  };

  const stepProgress: Record<string, number> = {
    prepare: 15,
    outline: 30,
    draft: 60,
    review: 85,
    finalize: 95,
    idle: 0,
  };

  // Auto-scroll do texto ao vivo
  useEffect(() => {
    if (liveRef.current) liveRef.current.scrollTop = liveRef.current.scrollHeight;
  }, [liveDraft]);

  return (
    <div className="container-juridia py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gerar minuta</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Escolha o template, preencha os fatos e a IA gera a peça com
            anonimização local.
          </p>
        </div>
        {user && (
          <Badge variant="secondary" className="text-xs">
            Plano {user.plan === "individual_2" ? "Individual II" : (user.plan ?? "não informado")}
          </Badge>
        )}
      </div>

      {/* Alternância de modo: individual × lote (molde) */}
      <div className="mb-5 flex gap-2">
        <Button
          variant={mode === "individual" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("individual")}
        >
          <FileEdit className="mr-1.5 h-4 w-4" />
          Individual
        </Button>
        <Button
          variant={mode === "agentic" ? "default" : "outline"}
          size="sm"
          onClick={() => { setMode("agentic"); setAgentPlan(null); setAgentRunId(null); }}
        >
          <Brain className="mr-1.5 h-4 w-4" />
          Agêntico
        </Button>
        <Button
          variant={mode === "lote" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("lote")}
        >
          <Layers className="mr-1.5 h-4 w-4" />
          Em lote (molde)
        </Button>
      </div>

      {/* Brain context banner */}
      {brainContext && (
        <div className="mb-4 rounded-lg border border-primary/40 bg-primary/5 p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <Brain className="h-4 w-4" />
              Contexto da análise cerebral ativo
            </div>
            <button
              onClick={() => setBrainContext(null)}
              className="text-xs text-muted-foreground hover:text-destructive"
            >
              remover contexto
            </button>
          </div>
          <pre className="mt-2 max-h-32 overflow-y-auto whitespace-pre-wrap text-[10px] text-muted-foreground scrollbar-juridia">
            {brainContext.slice(0, 500)}
          </pre>
        </div>
      )}

      {/* Relatório de conformidade — visível quando há ressalvas ou falha de pipeline */}
      {result && (result.pipeline?.degraded || (result.validation?.violations?.length ?? 0) > 0) && (
        <Card className="mb-4 border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-destructive">
              <ShieldAlert className="h-4 w-4" />
              Relatório de conformidade da geração
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {result.pipeline?.degraded && (
              <p className="rounded-md bg-destructive/10 p-2 text-xs text-destructive">
                A IA ficou indisponível em etapa essencial e a peça foi gerada como
                esqueleto offline. Refaça a geração quando o serviço normalizar.
              </p>
            )}
            {result.validation?.violations?.length ? (
              <ul className="space-y-1.5">
                {result.validation.violations.map((v, i) => (
                  <li key={i} className="text-xs">
                    <Badge variant={v.severity === "error" ? "destructive" : "secondary"} className="mr-2 text-[10px]">
                      {v.severity === "error" ? "erro" : "atenção"}
                    </Badge>
                    <span className="font-medium">{v.rule}</span> — {v.detail}
                    {v.excerpt ? <span className="block pl-1 text-muted-foreground">Trecho: “{v.excerpt}”</span> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">Nenhuma violação deontológica detectada.</p>
            )}
            <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
              {result.pipeline?.stages?.map((s) => (
                <span key={s.stage} className="rounded border px-1.5 py-0.5">
                  {s.stage}: {s.ok ? "ok" : "falhou"} · {(s.ms / 1000).toFixed(1)}s{s.note ? ` · ${s.note}` : ""}
                </span>
              ))}
              {result.pipeline?.reviewCorrections?.applied ? (
                <span className="rounded border px-1.5 py-0.5">
                  revisor: {result.pipeline.reviewCorrections.applied} correção(ões) aplicada(s)
                </span>
              ) : null}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setAppTab("editor")}>
                Abrir no editor mesmo assim
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Referências rastreáveis usadas na fundamentação (RAG base curada) */}
      {result?.references?.length ? (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Landmark className="h-4 w-4 text-primary" />
              Fontes normativas correlatas ({result.references.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-xs text-muted-foreground">
              {result.references.map((r, i) => (
                <li key={i}>
                  <span className="font-medium text-foreground">
                    {r.diploma} {r.numero}
                  </span>
                  {r.tribunal ? ` — ${r.tribunal}` : ""}
                  {r.urlOficial ? (
                    <>
                      {" · "}
                      <a href={r.urlOficial} target="_blank" rel="noreferrer" className="text-primary underline">
                        fonte oficial
                      </a>
                    </>
                  ) : null}
                  <span className="ml-2 rounded bg-secondary px-1 py-0.5 text-[10px]">
                    score {r.score.toFixed(3)}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      {/* Template selector — compartilhado entre os modos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-primary" />
            Template da minuta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((t) => {
              const Icon = ICONS[t.icon] || FileText;
              const active = t.slug === selectedTemplateSlug;
              return (
                <button
                  key={t.slug}
                  onClick={() => {
                    setSelectedTemplateSlug(t.slug);
                    setFields({});
                    setResult(null);
                  }}
                  className={`flex flex-col items-start gap-2 rounded-lg border p-3 text-left transition-all ${
                    active
                      ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${active ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">
                    {t.description}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {mode === "agentic" && agentPlan && (
        <Card className="mb-5 border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Brain className="h-4 w-4 text-primary" />
              Plano agêntico — aprovação obrigatória
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {agentPlan.resumo && <div><strong>Resumo:</strong> {agentPlan.resumo}</div>}
            {agentPlan.estrategia && <div><strong>Estratégia:</strong> {agentPlan.estrategia}</div>}
            {!!agentPlan.pesquisaInsuficiente?.length && (
              <div className="rounded-md border border-amber-500/50 bg-amber-500/5 p-3 text-xs">
                <strong>Pesquisa ainda insuficiente:</strong>
                <ul className="mt-1 list-disc pl-5">{agentPlan.pesquisaInsuficiente.map((x, i) => <li key={i}>{x}</li>)}</ul>
              </div>
            )}
            {!!agentPlan.roteiro?.length && (
              <div>
                <strong>Roteiro:</strong>
                <ol className="mt-1 list-decimal space-y-1 pl-5 text-xs">
                  {agentPlan.roteiro.map((s, i) => <li key={i}><b>{s.titulo}</b> — {s.objetivo}</li>)}
                </ol>
              </div>
            )}
            {!!agentPlan.perguntas?.length && (
              <div className="space-y-2">
                <strong>Perguntas/lacunas:</strong>
                {agentPlan.perguntas.map((q, i) => (
                  <div key={i}>
                    <Label className="text-xs">{q}</Label>
                    <Textarea rows={2} value={agentAnswers[String(i)] || ""} onChange={(e) => setAgentAnswers((prev) => ({ ...prev, [String(i)]: e.target.value }))} />
                  </div>
                ))}
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              Pesquisa iterativa executada em {agentResearch.length} questão(ões). O texto só será redigido após sua aprovação.
            </div>
            <div className="flex gap-2">
              <Button onClick={approveAgenticAndDraft} disabled={loading}>
                <FileCheck2 className="mr-2 h-4 w-4" />
                Aprovar plano e redigir
              </Button>
              <Button variant="outline" onClick={() => { setAgentPlan(null); setAgentRunId(null); setAgentAnswers({}); }} disabled={loading}>
                Refazer planejamento
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {mode === "lote" ? (
        current ? (
          <BatchPanel
            template={current}
            skillSlugs={selectedSkillSlugs}
            writingStyle={writingStyle}
            brainContext={brainContext}
          />
        ) : null
      ) : (
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Coluna principal */}
        <div className="space-y-6">

          {/* Fields */}
          {current && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Fatos e dados do caso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border border-dashed border-primary/40 bg-primary/5 p-3 text-xs text-muted-foreground">
                  <ShieldAlert className="mb-1 inline h-4 w-4 text-primary" />
                  Dados sensíveis (CPF, nome, endereço, valores) são{" "}
                  <strong>anonimizados localmente</strong> com marcadores{" "}
                  <span className="marker-chip">[TIPO_0001]</span> antes de
                  chegar à IA. O conteúdo real nunca sai da sua máquina.
                </div>
                <div className="space-y-3">
                  {current.fields.map((f) => (
                    <div key={f.key} className="space-y-1.5">
                      <Label htmlFor={f.key} className="text-xs font-medium">
                        {f.label}
                      </Label>
                      {f.type === "select" ? (
                        <Select
                          value={fields[f.key] || ""}
                          onValueChange={(v) =>
                            setFields((s) => ({ ...s, [f.key]: v }))
                          }
                        >
                          <SelectTrigger id={f.key}>
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                          <SelectContent>
                            {(f.options || []).map((o) => (
                              <SelectItem key={o} value={o}>
                                {o}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : f.type === "textarea" ? (
                        <Textarea
                          id={f.key}
                          rows={4}
                          value={fields[f.key] || ""}
                          onChange={(e) =>
                            setFields((s) => ({ ...s, [f.key]: e.target.value }))
                          }
                          placeholder={f.placeholder}
                        />
                      ) : (
                        <Input
                          id={f.key}
                          value={fields[f.key] || ""}
                          onChange={(e) =>
                            setFields((s) => ({ ...s, [f.key]: e.target.value }))
                          }
                          placeholder={f.placeholder}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="title" className="text-xs font-medium">
                    Título da minuta (opcional)
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Petição inicial — Ação Indenizatória 09/2026"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Coluna lateral: skills + generate */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Wand2 className="h-4 w-4 text-primary" />
                Habilidades (skills)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-xs text-muted-foreground">
                Pacotes de conhecimento que orientam a geração. Clique para
                ativar/desativar.
              </p>
              <div className="space-y-2">
                {suggestedSkills.map((s) => {
                  const active = selectedSkillSlugs.includes(s.slug);
                  return (
                    <button
                      key={s.slug}
                      onClick={() => toggleSkill(s.slug)}
                      className={`flex w-full items-start gap-2 rounded-lg border p-2.5 text-left transition-all ${
                        active
                          ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      <CheckCircle2
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          active ? "text-primary" : "text-muted-foreground/40"
                        }`}
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold">{s.name}</div>
                        <div className="mt-0.5 text-[11px] text-muted-foreground line-clamp-2">
                          {s.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full">
                      Ver catálogo completo
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[380px] sm:w-[440px]">
                    <SheetHeader>
                      <SheetTitle>Catálogo de habilidades</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4 space-y-2 overflow-y-auto scrollbar-juridia">
                      {skills.map((s) => {
                        const active = selectedSkillSlugs.includes(s.slug);
                        return (
                          <button
                            key={s.slug}
                            onClick={() => toggleSkill(s.slug)}
                            className={`flex w-full items-start gap-2 rounded-lg border p-3 text-left transition-all ${
                              active
                                ? "border-primary bg-primary/5"
                                : "border-border bg-card"
                            }`}
                          >
                            <CheckCircle2
                              className={`mt-0.5 h-4 w-4 shrink-0 ${
                                active ? "text-primary" : "text-muted-foreground/40"
                              }`}
                            />
                            <div>
                              <div className="text-xs font-semibold">{s.name}</div>
                              <div className="text-[11px] text-muted-foreground line-clamp-3">
                                {s.content}
                              </div>
                              <Badge variant="secondary" className="mt-1 text-[10px]">
                                {s.category}
                              </Badge>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              {loading ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    {stepLabels[step]}
                  </div>
                  <Progress value={stepProgress[step] ?? 0} />
                  {liveDraft ? (
                    <pre
                      ref={liveRef}
                      className="max-h-48 overflow-y-auto whitespace-pre-wrap rounded border border-border bg-secondary/50 p-2 font-mono text-[11px] leading-relaxed scrollbar-juridia"
                    >
                      {liveDraft.slice(-1200)}
                    </pre>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      A IA está processando o caso com os marcadores locais.
                    </p>
                  )}
                </div>
              ) : (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={mode === "agentic" ? planAgentic : generate}
                  disabled={!current}
                >
                  {mode === "agentic" ? <Brain className="mr-2 h-4 w-4" /> : <Wand2 className="mr-2 h-4 w-4" />}
                  {mode === "agentic" ? "Planejar e pesquisar antes de redigir" : "Gerar minuta com IA"}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      )}
    </div>
  );
}
