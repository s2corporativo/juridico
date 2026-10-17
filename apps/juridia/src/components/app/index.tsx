"use client";

import { useEffect } from "react";
import {
  Brain,
  Wand2,
  FileText,
  LayoutDashboard,
  Settings as SettingsIcon,
  Network,
  Calculator,
  BarChart3,
  GitBranch,
  ClipboardCheck,
  Search,
  Sparkles,
  Shield,
  BookOpen,
  ChevronDown,
} from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/lib/store";
import { Generator } from "./generator";
import { Editor } from "./editor";
import { Dashboard } from "./dashboard";
import { Settings } from "./settings";
import { Cerebro } from "./cerebro";
import { Inteligencia } from "./inteligencia";
import { Assistente } from "./assistente";
import { CalculadoraJuridica } from "./calculadora-juridica";
import { Pipeline } from "./pipeline";
import { Homologacao } from "./homologacao";
import { VisualLaw } from "./visual-law";
import { DataJudBusca } from "./datajud-busca";
import { GrafoSistema } from "./grafo-sistema";
import { BibliotecaJuridica } from "./biblioteca-juridica";
import { AtlasWorkspace } from "./atlas-workspace";

// A navegação principal descreve o trabalho do advogado, não os motores internos.
const PRIMARY_TABS = [
  { id: "dashboard" as const, label: "Início", icon: LayoutDashboard, key: "1" },
  { id: "assistente" as const, label: "Assistente", icon: Sparkles, key: "s" },
  { id: "atlas" as const, label: "Pesquisa Atlas", icon: Search, key: "a" },
  { id: "generator" as const, label: "Nova minuta", icon: Wand2, key: "g" },
  { id: "editor" as const, label: "Documentos", icon: FileText, key: "m" },
  { id: "biblioteca" as const, label: "Biblioteca", icon: BookOpen, key: "b" },
];
const TOOL_TABS = [
  { id: "cerebro" as const, label: "Análise do caso · Cérebro EJC", icon: Brain, key: "e" },
  { id: "intelligence" as const, label: "Mapa e evidências", icon: Network, key: "i" },
  { id: "pipeline" as const, label: "Etapas da produção", icon: GitBranch, key: "p" },
  { id: "calculadora" as const, label: "Calculadora jurídica", icon: Calculator, key: "l" },
  { id: "visuallaw" as const, label: "Visual Law", icon: BarChart3, key: "v" },
  { id: "datajud" as const, label: "DataJud", icon: Search, key: "j" },
  { id: "grafo" as const, label: "Grafo jurídico", icon: Network, key: "n" },
  { id: "homologacao" as const, label: "Homologação", icon: ClipboardCheck, key: "h" },
  { id: "settings" as const, label: "Governança e configurações", icon: Shield, key: "," },
];
const ALL_TABS = [...PRIMARY_TABS, ...TOOL_TABS];

export function AppShell() {
  const { appTab, setAppTab } = useAppStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable || target?.tagName === "SELECT") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key.toLowerCase();
      const tab = ALL_TABS.find((t) => t.key === key);
      if (tab) { e.preventDefault(); setAppTab(tab.id); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setAppTab]);

  const activeTool = TOOL_TABS.find((tab) => tab.id === appTab);
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="sticky top-16 z-40 border-b border-border/70 bg-background/95 backdrop-blur-md">
        <div className="container-juridia">
          <Tabs value={appTab} onValueChange={(v) => setAppTab(v)}>
            <div className="flex min-w-0 items-center gap-3 py-2">
              <TabsList aria-label="Áreas principais da JuridIA" className="juridia-primary-nav flex h-auto min-w-0 flex-1 items-center justify-start gap-1 overflow-x-auto rounded-none border-0 bg-transparent px-0 py-1">
                {PRIMARY_TABS.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    title={`Atalho: ${tab.key.toUpperCase()}`}
                    className="min-h-10 shrink-0 gap-2 rounded-md px-3 text-xs font-medium transition-colors data-[state=active]:bg-primary/8 data-[state=active]:text-primary sm:text-sm"
                  >
                    <tab.icon className="h-4 w-4" aria-hidden="true" />
                    <span>{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              <details className="group relative z-50 shrink-0">
                <summary className="flex min-h-10 cursor-pointer list-none items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground hover:border-primary/30 hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary sm:text-sm">
                  <span className="hidden md:inline">{activeTool?.label ?? "Mais ferramentas"}</span>
                  <span className="md:hidden">Ferramentas</span>
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                </summary>
                <div className="juridia-tool-menu absolute right-0 top-full z-50 mt-2 max-h-[min(70vh,560px)] w-[min(84vw,290px)] overflow-y-auto rounded-xl border border-border p-1.5">
                  <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Recursos especializados</p>
                  {TOOL_TABS.map((tab) => (
                    <button key={tab.id} type="button"
                      aria-current={appTab === tab.id ? "page" : undefined}
                      onClick={(event) => {
                        setAppTab(tab.id);
                        event.currentTarget.closest("details")?.removeAttribute("open");
                      }}
                      className="flex min-h-10 w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary aria-[current=page]:bg-primary/10 aria-[current=page]:text-primary sm:text-sm">
                      <tab.icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </details>
            </div>
          </Tabs>
        </div>
      </div>

      <div>
        {/* Cérebro Jurídico — zona única (sem ERP) */}
        {appTab === "assistente" && <Assistente />}
        {appTab === "dashboard" && <Dashboard />}
        {appTab === "biblioteca" && <BibliotecaJuridica />}
        {appTab === "atlas" && <AtlasWorkspace />}
        {appTab === "cerebro" && <Cerebro />}
        {appTab === "intelligence" && <Inteligencia />}
        {appTab === "pipeline" && <Pipeline />}
        {appTab === "generator" && <Generator />}
        {appTab === "editor" && <Editor />}
        {appTab === "homologacao" && <Homologacao />}
        {appTab === "calculadora" && <CalculadoraJuridica />}
        {appTab === "visuallaw" && <VisualLaw />}
        {appTab === "datajud" && <DataJudBusca />}
        {appTab === "grafo" && <GrafoSistema />}
        {appTab === "settings" && <Settings />}
      </div>
    </div>
  );
}
