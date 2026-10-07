"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AuthDialog } from "@/components/auth-dialog";
import { CommandPalette } from "@/components/command-palette";
import { AppShell } from "@/components/app";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <AppShell />
      </main>
      <SiteFooter />
      <AuthDialog />
      <CommandPalette />
    </>
  );
}
