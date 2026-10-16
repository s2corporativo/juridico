"use client";

import { Home, Scale, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAppStore } from "@/lib/store";

/**
 * Cabeçalho institucional único. As seis áreas operacionais aparecem apenas
 * em AppShell, evitando duas barras de navegação e opções repetidas no mobile.
 */
export function SiteHeader() {
  const { view, setView, setAppTab, user } = useAppStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/95 backdrop-blur">
      <div className="container-juridia flex h-16 items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => { setView("app"); setAppTab("dashboard"); }}
          className="flex min-w-0 items-center gap-2.5 rounded-lg text-left focus-visible:outline-2 focus-visible:outline-primary"
          aria-label="Atlas Forense e JuridIA — Início"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Scale className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-sm font-semibold tracking-tight sm:text-base">Atlas Forense</span>
            <span className="text-[10px] tracking-wide text-muted-foreground">JuridIA · Cérebro EJC</span>
          </span>
        </button>

        <div className="flex items-center gap-2">
          {view === "app" && (
            <button
              type="button"
              onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }))}
              className="hidden h-9 items-center gap-2 rounded-lg border border-border px-3 text-xs text-muted-foreground hover:bg-muted md:inline-flex"
              aria-label="Abrir busca de comandos"
              title="Buscar comandos (Ctrl/⌘+K)"
            >
              <Search className="h-4 w-4" aria-hidden="true" /> Buscar <kbd className="ml-1 rounded border px-1.5 py-0.5 font-mono">⌘K</kbd>
            </button>
          )}
          <ThemeToggle />
          {view === "app" ? (
            <>
              <span className="hidden max-w-40 truncate text-xs text-muted-foreground lg:inline" title={user?.email ?? undefined}>
                {user?.name || user?.email}
              </span>
              <Button variant="ghost" size="sm" onClick={() => setView("landing")} title="Página institucional">
                <Home className="h-4 w-4 sm:mr-1.5" aria-hidden="true" />
                <span className="hidden sm:inline">Site</span>
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => setView("app")}>Acessar plataforma</Button>
          )}
        </div>
      </div>
    </header>
  );
}
