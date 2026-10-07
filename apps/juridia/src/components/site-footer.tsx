"use client";

import { Scale, ShieldCheck } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-secondary/40">
      <div className="container-juridia py-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <strong className="block text-sm">Atlas Jurídico · JuridIA</strong>
                <span className="text-xs text-muted-foreground">Inteligência jurídica com evidência e revisão humana</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4" />
            <span>LGPD · trilha de auditoria · Citation/Evidence Gates</span>
          </div>
        </div>
        <div className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Atlas Jurídico. Uso interno do escritório.
        </div>
      </div>
    </footer>
  );
}
