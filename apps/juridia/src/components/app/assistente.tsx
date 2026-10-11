"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Copy, Play, Brain, FileText, Search, BookOpen, Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/lib/store";
import { toast } from "@/hooks/use-toast";

// ── Tipos ───────────────────────────────────────────────────────────────────
type IntentTab = "assistente" | "pesquisa" | "analise" | "minutas" | "biblioteca";

interface IntentDef {
  tab: IntentTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords: string[];
}

const INTENTS: IntentDef[] = [
  { tab: "pesquisa", label: "Pesquisa Jurídica", icon: Search, keywords:
    ["jurisprudência", "jurisprudencia", "acórdão", "acordao", "súmula", "sumula", "stj", "stf", "tribunal", "legislação", "lei", "pesquisar", "precedente", "fonte"] },
  { tab: "analise", label: "Análise Jurídica", icon: Brain, keywords:
    ["análise", "analise", "fatos", "provas", "documento", "caso", "tese", "argumentação", "estratégia", "viabilidade", "lacunas", "comparar", "analisar"] },
  { tab: "minutas", label: "Minutas IA", icon: FileText, keywords:
    ["minuta", "redigir", "gerar", "petição", "peticao", "contestação", "contestacao", "recurso", "manifestação", "manifestacao", "parecer", "editar", "revisar", "peça", "peca"] },
  { tab: "biblioteca", label: "Biblioteca de minutas", icon: BookOpen, keywords:
    ["biblioteca", "histórico", "historico", "salvas", "rascunho", "modelo", "minhas minutas", "versão", "versao"] },
  { tab: "assistente", label: "Assistente Jurídico", icon: Sparkles, keywords:
    ["ajuda", "assistente", "início", "inicio", "orientação", "orientacao"] },
];

const EXAMPLE_CHIPS = [
  "Pesquisar jurisprudência do STJ sobre responsabilidade civil",
  "Analisar os fatos e as provas de um caso",
  "Propor uma minuta de contestação fundamentada",
  "Revisar uma minuta já salva",
];

interface ScoredIntent {
  def: IntentDef;
  score: number;
  matched: string[];
}

interface Entity {
  type: string;
  value: string;
}

interface ClassificationResult {
  input: string;
  topIntent: IntentDef;
  confidence: number;
  candidates: ScoredIntent[];
  entities: Entity[];
  payload: Record<string, unknown>;
}

function classifyIntent(input: string): ClassificationResult {
  const lower = input.toLowerCase();
  const scored = INTENTS.map((def) => {
    const matched: string[] = [];
    for (const kw of def.keywords) {
      if (lower.includes(kw)) matched.push(kw);
    }
    const score = matched.length > 0 ? matched.length / def.keywords.length + matched.length * 0.15 : 0;
    return { def, score: Math.min(1, score), matched };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  const candidates = scored.slice(0, 3);
  const top = candidates[0];

  // fallback: se nada foi casado, sugere "dashboard"
  const topIntent = top?.def ?? INTENTS.find((i) => i.tab === "assistente")!;
  const confidence = top ? Math.min(99, Math.round(top.score * 100 + 25)) : 15;

  // entidades simples
  const entities: Entity[] = [];
  const valueMatches = input.match(/R\$\s*\d[\d.,]*\d{0,2}/gi);
  if (valueMatches) valueMatches.forEach((v) => entities.push({ type: "valor", value: v }));
  const dateMatches = input.match(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g);
  if (dateMatches) dateMatches.forEach((v) => entities.push({ type: "data", value: v }));
  const procMatches = input.match(/\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}/g);
  if (procMatches) procMatches.forEach((v) => entities.push({ type: "processo", value: v }));
  const oabMatches = input.match(/OAB\s*[A-Z]{2}\s*\d{4,7}/gi);
  if (oabMatches) oabMatches.forEach((v) => entities.push({ type: "oab", value: v }));

  const payload: Record<string, unknown> = {
    intent: topIntent.tab,
    label: topIntent.label,
    confidence,
    candidates: candidates.map((c) => ({ tab: c.def.tab, label: c.def.label, score: Math.round(c.score * 100) / 100, matched: c.matched })),
    entities,
    input,
    timestamp: new Date().toISOString(),
  };

  return { input, topIntent, confidence, candidates, entities, payload };
}

export function Assistente() {
  const { setAppTab } = useAppStore();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);

  function interpret() {
    if (input.trim().length < 5) {
      toast({ title: "Descreva melhor a intenção", description: "Mínimo 5 caracteres", variant: "destructive" });
      return;
    }
    setLoading(true);
    // Feedback breve de classificação, sem consulta jurídica
    setTimeout(() => {
      setResult(classifyIntent(input));
      setLoading(false);
    }, 350);
  }

  function executar() {
    if (!result) return;
    setAppTab(result.topIntent.tab);
    toast({ title: `Indo para ${result.topIntent.label}`, description: `Confiança ${result.confidence}%` });
  }

  function copyPayload() {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result.payload, null, 2));
    toast({ title: "Payload copiado", description: "JSON da classificação na área de transferência" });
  }

  function applyChip(text: string) {
    setInput(text);
    setResult(null);
  }

  return (
    <div className="container-juridia py-8">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Assistente de navegação jurídica</h1>
            <p className="text-sm text-muted-foreground">Descreva sua atividade de pesquisa, análise ou redação; o sistema indica a área adequada. Não é uma opinião jurídica.</p>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Coluna esquerda — input + chips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-primary" /> O que você precisa agora?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              rows={5}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ex.: Pesquisar decisões do STJ e propor uma minuta"
              className="resize-none"
            />
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_CHIPS.map((chip) => (
                <Badge
                  key={chip}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary/10 hover:text-primary"
                  onClick={() => applyChip(chip)}
                >
                  {chip}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Button onClick={interpret} disabled={loading || input.trim().length < 5} className="flex-1">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Interpretar
              </Button>
              {result && (
                <Button onClick={executar} variant="default">
                  <Play className="mr-2 h-4 w-4" /> Executar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Coluna direita — resultado */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Brain className="h-4 w-4 text-primary" /> Resultado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-4"
                >
                  {/* Confiança */}
                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Correspondência de termos na solicitação</span>
                      <span className="font-semibold text-primary">{result.confidence}%</span>
                    </div>
                    <Progress value={result.confidence} className="h-2" />
                  </div>

                  {/* Top intenção */}
                  <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <result.topIntent.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{result.topIntent.label}</div>
                      <div className="text-[11px] text-muted-foreground">Aba sugerida: {result.topIntent.tab}</div>
                    </div>
                    <Button size="sm" onClick={executar}>
                      Abrir <Play className="ml-1 h-3 w-3" />
                    </Button>
                  </div>

                  {/* Top 3 candidatos */}
                  <div>
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Top 3 candidatos</div>
                    <div className="space-y-1.5">
                      {result.candidates.map((c, idx) => (
                        <div key={c.def.tab} className="flex items-center gap-2 rounded border border-border p-2 text-xs">
                          <Badge variant="outline" className="text-[10px]">{idx + 1}</Badge>
                          <c.def.icon className="h-3.5 w-3.5 text-primary" />
                          <span className="flex-1 font-medium">{c.def.label}</span>
                          <span className="font-mono text-[10px] text-muted-foreground">{Math.round(c.score * 100)}%</span>
                          {c.matched.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {c.matched.slice(0, 2).map((m) => (
                                <span key={m} className="rounded bg-secondary px-1 py-0.5 text-[9px] text-muted-foreground">{m}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Entidades */}
                  <div>
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Entidades detectadas</div>
                    {result.entities.length === 0 ? (
                      <div className="rounded border border-dashed border-border p-3 text-center text-[11px] text-muted-foreground">
                        Nenhuma entidade especial (valor/data/processo/OAB) detectada.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {result.entities.map((e, i) => (
                          <div key={i} className="flex flex-col gap-1 rounded border border-border p-2">
                            <span className="text-[9px] uppercase tracking-wider text-muted-foreground">{e.type}</span>
                            <span className="font-mono text-xs">{e.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Payload JSON */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Payload JSON</span>
                      <Button size="sm" variant="ghost" onClick={copyPayload}>
                        <Copy className="mr-1 h-3 w-3" /> Copiar
                      </Button>
                    </div>
                    <pre className="max-h-48 overflow-auto rounded border border-border bg-secondary/50 p-3 text-[10px] leading-relaxed scrollbar-juridia">
{JSON.stringify(result.payload, null, 2)}
                    </pre>
                  </div>

                  <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Classificação de navegação por palavras-chave. A análise jurídica ocorre na área indicada e exige revisão profissional.</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center gap-2 py-12 text-center"
                >
                  <Sparkles className="h-10 w-10 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">
                    Digite sua intenção e clique em <strong>Interpretar</strong> para ver a sugestão.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
