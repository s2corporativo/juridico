"use client";

import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, FileText, Search, Sparkles, Wand2 } from "lucide-react";
import { useAppStore, type AppTab } from "@/lib/store";
import type { DocumentDTO } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ACTIONS: { title: string; description: string; tab: AppTab; icon: typeof Search }[] = [
  { title: "Começar uma minuta", description: "Escolha a peça e descreva o caso.", tab: "generator", icon: Wand2 },
  { title: "Conversar com a JuridIA", description: "Organize suas dúvidas e tarefas jurídicas.", tab: "assistente", icon: Sparkles },
  { title: "Pesquisar no Atlas", description: "Consulte fontes e precedentes verificados.", tab: "atlas", icon: Search },
  { title: "Abrir biblioteca", description: "Consulte modelos e o catálogo de habilidades.", tab: "biblioteca", icon: BookOpen },
];

export function Dashboard() {
  const { setAppTab, setCurrentDocId } = useAppStore();
  const [docs, setDocs] = useState<DocumentDTO[]>([]);
  const [skillsCount, setSkillsCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [documentsError, setDocumentsError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    Promise.allSettled([
      fetch("/api/documents", { signal: controller.signal, cache: "no-store" }).then(async (response) => {
        if (!response.ok) throw new Error("documentos indisponíveis");
        const data = await response.json() as { documents?: DocumentDTO[] };
        if (!controller.signal.aborted) setDocs(Array.isArray(data.documents) ? data.documents : []);
      }),
      fetch("/api/skills", { signal: controller.signal, cache: "no-store" }).then(async (response) => {
        if (!response.ok) throw new Error("catálogo indisponível");
        const data = await response.json() as { skills?: unknown[] };
        if (!controller.signal.aborted) setSkillsCount(Array.isArray(data.skills) ? data.skills.length : null);
      }),
    ]).then((results) => {
      if (!controller.signal.aborted) {
        setDocumentsError(results[0].status === "rejected");
        setLoading(false);
      }
    });
    return () => controller.abort();
  }, []);

  return (
    <div className="container-juridia max-w-6xl space-y-8 py-8 md:py-10">
      <header className="flex flex-col gap-3 border-b border-border/70 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">Mesa de trabalho</p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Sua inteligência jurídica, em um só lugar.</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Pesquise com o Atlas, organize os fatos com o Cérebro EJC e produza documentos com revisão humana.
          </p>
        </div>
        <Button onClick={() => setAppTab("generator")} className="gap-2 self-start sm:self-auto">
          <Wand2 className="h-4 w-4" /> Nova minuta
        </Button>
      </header>

      <section aria-labelledby="inicio-acoes">
        <h2 id="inicio-acoes" className="mb-4 text-sm font-semibold text-foreground">O que você precisa fazer?</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {ACTIONS.map((action) => (
            <button
              key={action.tab}
              type="button"
              onClick={() => setAppTab(action.tab)}
              className="group flex items-start gap-4 rounded-xl border border-border/80 bg-card p-5 text-left shadow-sm transition-colors hover:border-primary/35 hover:bg-primary/[0.03] focus-visible:outline-2 focus-visible:outline-primary"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <action.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{action.title}</span>
                <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{action.description}</span>
              </span>
              <ArrowRight className="mt-2 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>

      <section aria-label="Situação da biblioteca" className="grid gap-3 sm:grid-cols-2">
        <Card className="border-border/80 shadow-none">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground">Documentos nesta listagem</p>
            <p className="mt-2 text-2xl font-semibold">{documentsError ? "Indisponível" : loading ? "—" : docs.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border/80 shadow-none">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground">Habilidades no catálogo técnico</p>
            <p className="mt-2 text-2xl font-semibold">{skillsCount ?? "Indisponível"}</p>
            <p className="mt-1 text-xs text-muted-foreground">Verificação técnica não substitui revisão jurídica individual.</p>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="documentos-recentes">
        <Card className="border-border/80 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle id="documentos-recentes" className="text-base font-semibold">Documentos recentes</CardTitle>
            <Button size="sm" variant="outline" onClick={() => setAppTab("editor")}>Abrir editor</Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading ? <p className="py-6 text-sm text-muted-foreground">Carregando documentos…</p> :
              documentsError ? <p className="py-6 text-sm text-muted-foreground" role="status">Não foi possível consultar os documentos. Tente novamente mais tarde.</p> :
              docs.length === 0 ? <p className="py-6 text-sm text-muted-foreground">Você ainda não possui documentos nesta listagem.</p> :
              docs.slice(0, 5).map((document) => (
                <button
                  key={document.id}
                  type="button"
                  onClick={() => { setCurrentDocId(document.id); setAppTab("editor"); }}
                  className="flex w-full items-center gap-3 rounded-lg border border-border/60 px-4 py-3 text-left transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <FileText className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{document.title}</span>
                  <span className="hidden text-xs text-muted-foreground sm:inline">
                    {new Date(document.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </button>
              ))
            }
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
