"use client";

import { useEffect } from "react";
import {
  Brain,
  Wand2,
  LayoutDashboard,
  Search,
  Shield,
  BookOpen,
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

// Navegação principal orientada às tarefas do advogado. Capacidades técnicas permanecem contextuais.
const TABS = [
  { id: "dashboard" as const, label: "Início", icon: LayoutDashboard, key: "1" },
  { id: "cerebro" as const, label: "Analisar", icon: Brain, key: "e" },
  { id: "generator" as const, label: "Redigir", icon: Wand2, key: "g" },
  { id: "datajud" as const, label: "Pesquisar", icon: Search, key: "j" },
  { id: "biblioteca" as const, label: "Biblioteca", icon: BookOpen, key: "b" },
  { id: "settings" as const, label: "Governança", icon: Shield, key: "," },
];

const ALL_TABS = TABS;

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

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-secondary/20">
      <div className="sticky top-16 z-40 border-b border-border bg-background/80 glass">
        <div className="container-juridia">
          <Tabs value={appTab} onValueChange={(v) => setAppTab(v as typeof appTab)}>
            <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-none border-0 bg-transparent p-2 scrollbar-juridia">
              <div className="flex items-center gap-2 pr-2">
                <Brain className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Atlas Jurídico</span>
              </div>
              {TABS.map((t) => (
                <TabsTrigger key={t.id} value={t.id} className="gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary" title={`Atalho: ${t.key.toUpperCase()}`}>
                  <t.icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{t.label}</span>
                  <kbd className="hidden rounded border border-border bg-muted px-1 py-0.5 font-mono text-[9px] text-muted-foreground lg:inline-block">{t.key}</kbd>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div>
        {appTab === "assistente" && <Assistente />}
        {appTab === "dashboard" && <Dashboard />}
        {appTab === "biblioteca" && <BibliotecaJuridica />}
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
