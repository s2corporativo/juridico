"use client";

import { Scale } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAppStore } from "@/lib/store";

export function SiteHeader() {
  const { setAppTab, user } = useAppStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border glass">
      <div className="container-juridia flex h-16 items-center justify-between gap-4">
        <button
          onClick={() => setAppTab("dashboard")}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          aria-label="Atlas Jurídico — Início"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Scale className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-tight">Atlas Jurídico</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Uso interno do escritório
            </span>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => {
              window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }));
            }}
            className="hidden md:flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Abrir paleta de comandos"
            title="Abrir paleta de comandos"
          >
            <kbd className="font-mono text-[10px]">⌘K</kbd>
            <span>Comandos</span>
          </button>
          <span className="hidden max-w-[220px] truncate text-sm text-muted-foreground sm:inline">
            {user?.name || user?.email || "Escritório"}
          </span>
        </div>
      </div>
    </header>
  );
}
