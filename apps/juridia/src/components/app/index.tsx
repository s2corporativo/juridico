"use client";

import { useEffect } from "react";
import { BookOpen, Brain, FileText, Library, Search, Sparkles } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore, type AppTab } from "@/lib/store";
import { Assistente } from "./assistente";
import { BibliotecaJuridica } from "./biblioteca-juridica";
import { Cerebro } from "./cerebro";
import { Inteligencia } from "./inteligencia";
import { Pipeline } from "./pipeline";
import { Generator } from "./generator";
import { Editor } from "./editor";
import { VisualLaw } from "./visual-law";
import { BibliotecaMinutas } from "./biblioteca-minutas";

/** The only five user-facing JuridIA modules: no ERP or accounting. */
export const JURIDIA_MODULES: { id: AppTab; label: string; key: string; icon: typeof Brain }[] = [
  { id: "assistente", label: "Assistente Jurídico", key: "1", icon: Sparkles },
  { id: "pesquisa", label: "Pesquisa Jurídica", key: "2", icon: Search },
  { id: "analise", label: "Análise Jurídica", key: "3", icon: Brain },
  { id: "minutas", label: "Minutas IA", key: "4", icon: FileText },
  { id: "biblioteca", label: "Biblioteca", key: "5", icon: Library },
];

const SUBMODULES = {
  analise: [
    { id: "cerebro", label: "Analisar fatos e provas" },
    { id: "intelligence", label: "Fundamentação e evidências" },
    { id: "pipeline", label: "Etapas da análise" },
  ],
  minutas: [
    { id: "generator", label: "Propor minuta" },
    { id: "editor", label: "Revisar e editar" },
    { id: "visuallaw", label: "Apresentação do documento" },
  ],
} as const;

export function AppShell() {
  const { appTab, moduleView, setAppTab } = useAppStore();

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName) ||
          target?.isContentEditable || event.metaKey || event.ctrlKey || event.altKey) return;
      const tab = JURIDIA_MODULES.find(item => item.key === event.key);
      if (tab) { event.preventDefault(); setAppTab(tab.id); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setAppTab]);

  const subTabs = appTab === "analise" ? SUBMODULES.analise :
    appTab === "minutas" ? SUBMODULES.minutas : [];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-secondary/20">
      <header className="sticky top-16 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="container-juridia">
          <div className="flex flex-wrap items-center justify-between gap-2 px-2 pt-2 text-xs text-muted-foreground">
            <span className="font-semibold text-primary">JuridIA · Pesquisa e produção jurídica assistida</span>
            <span>Fontes conferíveis · Minutas sujeitas à revisão do advogado</span>
          </div>
          <Tabs value={appTab} onValueChange={setAppTab}>
            <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-none border-0 bg-transparent p-2 scrollbar-juridia">
              {JURIDIA_MODULES.map(tab => (
                <TabsTrigger key={tab.id} value={tab.id}
                  className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                  title={`Atalho: ${tab.key}`}>
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </header>
      {subTabs.length > 0 && (
        <nav className="container-juridia flex flex-wrap gap-2 border-b border-border/60 p-3"
          aria-label={appTab === "analise" ? "Etapas da análise" : "Etapas da minuta"}>
          {subTabs.map(view => (
            <button type="button" key={view.id}
              aria-current={moduleView === view.id ? "page" : undefined}
              className={`rounded-md px-3 py-2 text-xs font-medium transition-colors ${moduleView === view.id
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground hover:bg-muted"}`}
              onClick={() => setAppTab(view.id)}>{view.label}</button>
          ))}
        </nav>
      )}
      <main>
        {appTab === "assistente" && <Assistente />}
        {appTab === "pesquisa" && <BibliotecaJuridica />}
        {appTab === "analise" && moduleView === "cerebro" && <Cerebro />}
        {appTab === "analise" && moduleView === "intelligence" && <Inteligencia />}
        {appTab === "analise" && moduleView === "pipeline" && <Pipeline />}
        {appTab === "minutas" && moduleView === "generator" && <Generator />}
        {appTab === "minutas" && moduleView === "editor" && <Editor />}
        {appTab === "minutas" && moduleView === "visuallaw" && <VisualLaw />}
        {appTab === "biblioteca" && <BibliotecaMinutas />}
      </main>
    </div>
  );
}
