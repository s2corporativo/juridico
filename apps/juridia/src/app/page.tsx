"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AuthDialog } from "@/components/auth-dialog";
import { CommandPalette } from "@/components/command-palette";
import { Landing } from "@/components/landing";
import { AppShell } from "@/components/app";

export default function Home() {
  const { view, setUser, setAuthOpen } = useAppStore();
  const [sessionStatus, setSessionStatus] = useState<"checking" | "authenticated" | "unauthorized">("checking");

  useEffect(() => {
    let active = true;
    async function verifySession() {
      try {
        const response = await fetch("/api/auth/me", { credentials: "same-origin", cache: "no-store" });
        if (!active) return;
        if (!response.ok) throw new Error("unauthorized");
        const payload = await response.json() as { user?: { email?: string; name?: string | null } };
        if (!payload.user?.email) throw new Error("session_invalid");
        setUser({ email: payload.user.email, name: payload.user.name ?? null });
        setSessionStatus("authenticated");
        setAuthOpen(false);
      } catch {
        if (!active) return;
        setUser(null);
        setSessionStatus("unauthorized");
        setAuthOpen(true);
      }
    }
    void verifySession();
    window.addEventListener("juridia:auth-changed", verifySession);
    return () => {
      active = false;
      window.removeEventListener("juridia:auth-changed", verifySession);
    };
  }, [setUser, setAuthOpen]);

  // Scroll para topo ao trocar de view
  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {view === "landing" ? <Landing /> : sessionStatus === "authenticated" ? (
          <AppShell />
        ) : (
          <div className="container-juridia py-24 text-center">
            <h1 className="text-xl font-semibold">Atlas Forense · JuridIA</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              {sessionStatus === "checking" ? "Verificando sua sessão…" : "Entre com sua conta para acessar a plataforma unificada."}
            </p>
            {sessionStatus === "unauthorized" && (
              <button className="mt-5 rounded-md border px-4 py-2 text-sm" onClick={() => setAuthOpen(true)}>
                Entrar
              </button>
            )}
          </div>
        )}
      </main>
      <SiteFooter />
      <AuthDialog />
      <CommandPalette />
    </>
  );
}
