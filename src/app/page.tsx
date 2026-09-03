'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  BrainCircuit,
  Briefcase,
  Compass,
  Database,
  FileSearch,
  FlaskConical,
  LayoutDashboard,
  Library,
  MapPin,
  Network,
  Rss,
  ScanSearch,
  Search,
  TrendingUp,
  Wrench,
} from 'lucide-react';
import { OverviewTab } from '@/components/ejc/overview-tab';
import { KnowledgeTab } from '@/components/ejc/knowledge-tab';
import { AskTab } from '@/components/ejc/ask-tab';
import { PesquisaTab } from '@/components/ejc/pesquisa-tab';
import { TestTab } from '@/components/ejc/test-tab';
import { GraphTab } from '@/components/ejc/graph-tab';
import { ToolsTab } from '@/components/ejc/tools-tab';
import { CasosTab } from '@/components/ejc/casos-tab';
import { CompendioTab } from '@/components/ejc/compendio-tab';
import { FontesTab } from '@/components/ejc/fontes-tab';
import { IntegridadeTab } from '@/components/ejc/integridade-tab';
import { JurimetriaTab } from '@/components/ejc/jurimetria-tab';
import { CommandPalette } from '@/components/ejc/command-palette';
import { ThemeToggle } from '@/components/ejc/theme-toggle';
import { TourGuiado, abrirTour } from '@/components/ejc/tour-guiado';
import type { StatsInfo } from '@/components/ejc/types';

export default function Home() {
  const [stats, setStats] = useState<StatsInfo | null>(null);
  const [erro, setErro] = useState(false);
  const [aba, setAba] = useState('visao');
  const [paletteAberta, setPaletteAberta] = useState(false);

  useEffect(() => {
    fetch('/api/ejc/stats')
      .then((r) => r.json())
      .then((d) => (d.error ? setErro(true) : setStats(d)))
      .catch(() => setErro(true));
  }, []);

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-gradient-to-b from-emerald-950/[0.04] via-background to-background dark:from-emerald-950/20">
      {/* Filete dourado de marca */}
      <div aria-hidden className="h-[3px] w-full bg-marca-ouro" />

      {/* Header — verde institucional da marca (fundo do logotipo) com tipografia branca */}
      <header className="bg-marca-verde sticky top-0 z-40 border-b border-black/20 shadow-[0_2px_16px_-6px_oklch(0.24_0.04_168/0.55)]">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.06] to-transparent" />
        <div className="relative mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Placa de marca com o logotipo oficial sobre o próprio verde */}
            <div className="relative flex h-14 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-black/30 borda-ouro brilho-ouro-suave shadow-sm ring-1 ring-white/10 transition-transform duration-300 hover:scale-[1.03] sm:w-40">
              <img
                src="/logo-depaula-dark-wide.png"
                alt="Logotipo De Paula Teixeira Advocacia — monograma PT em ouro"
                className="h-full w-full object-cover object-center mix-blend-screen opacity-95"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-bold leading-tight tracking-tight text-white sm:text-lg">
                Jurimetria DPT
              </h1>
              <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-white/70 sm:text-xs">
                <span className="font-semibold texto-ouro-gradiente">De Paula Teixeira Advocacia</span>
                <span aria-hidden className="hidden text-white/30 sm:inline">·</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3" aria-hidden />
                  Minas Gerais
                </span>
              </p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="[&_button]:border-white/25 [&_button]:bg-white/10 [&_button]:text-white/90 [&_button]:hover:bg-white/20 [&_button]:hover:text-white">
              <ThemeToggle />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={abrirTour}
              className="h-8 gap-1.5 border-white/25 bg-white/10 text-xs text-white/90 hover:bg-white/20 hover:text-white"
              aria-label="Tour guiado pela plataforma"
              title="Tour guiado pela plataforma"
            >
              <Compass className="size-3.5" />
              <span className="hidden sm:inline">Tour</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPaletteAberta(true)}
              className="h-8 gap-1.5 border-white/25 bg-white/10 text-xs text-white/90 hover:bg-white/20 hover:text-white"
              aria-label="Abrir busca rápida (Ctrl+K)"
              title="Busca rápida (Ctrl+K)"
            >
              <Search className="size-3.5" />
              <span className="hidden sm:inline">Busca rápida</span>
              <kbd className="hidden rounded border border-white/30 bg-white/15 px-1 py-0.5 font-mono text-[9px] text-white md:inline">⌘K</kbd>
            </Button>
            {stats && (
              <Badge variant="outline" className="border-[--brand-gold]/50 bg-white/10 text-[11px] text-white transition-colors hover:bg-white/20">
                <Library className="mr-1 size-3" />
                {stats.total} documentos
              </Badge>
            )}
            {stats && (
              <Badge variant="outline" className="hidden border-white/25 bg-white/10 text-[11px] text-white/90 sm:inline-flex">
                <Database className="mr-1 size-3" />
                {stats.chunks} chunks RAG
              </Badge>
            )}
            {stats && (
              <Badge
                variant="outline"
                className="hidden border-[--brand-gold]/50 bg-white/10 text-[11px] text-white md:inline-flex"
                title="Lotes de abastecimento validados com CHECK 1-10"
              >
                <FlaskConical className="mr-1 size-3" />
                {stats.lotes.length} lotes
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        {erro ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-8 text-center text-sm text-red-600 dark:text-red-400">
            Falha ao carregar os dados do sistema. Verifique o servidor e recarregue a página.
          </div>
        ) : (
          <Tabs value={aba} onValueChange={setAba} className="space-y-5">
            <TabsList className="vidro h-auto w-full flex-wrap justify-start gap-1 rounded-xl border p-1 sm:w-auto">
              <TabsTrigger value="visao" className="gap-1.5 rounded-lg data-[state=active]:shadow-sm">
                <LayoutDashboard className="size-4" /> Visão Geral
              </TabsTrigger>
              <TabsTrigger value="jurimetria" className="gap-1.5 rounded-lg data-[state=active]:shadow-sm">
                <TrendingUp className="size-4" /> Jurimetria
              </TabsTrigger>
              <TabsTrigger value="compendio" className="gap-1.5 rounded-lg data-[state=active]:shadow-sm">
                <BookOpen className="size-4" /> Compêndio
              </TabsTrigger>
              <TabsTrigger value="base" className="gap-1.5 rounded-lg data-[state=active]:shadow-sm">
                <Library className="size-4" /> Base
              </TabsTrigger>
              <TabsTrigger value="consulta" className="gap-1.5 rounded-lg data-[state=active]:shadow-sm">
                <BrainCircuit className="size-4" /> Consulta IA
              </TabsTrigger>
              <TabsTrigger value="pesquisa" className="gap-1.5 rounded-lg data-[state=active]:shadow-sm">
                <FileSearch className="size-4" /> Pesquisa
              </TabsTrigger>
              <TabsTrigger value="grafo" className="gap-1.5 rounded-lg data-[state=active]:shadow-sm">
                <Network className="size-4" /> Grafo
              </TabsTrigger>
              <TabsTrigger value="ferramentas" className="gap-1.5 rounded-lg data-[state=active]:shadow-sm">
                <Wrench className="size-4" /> Ferramentas
              </TabsTrigger>
              <TabsTrigger value="casos" className="gap-1.5 rounded-lg data-[state=active]:shadow-sm">
                <Briefcase className="size-4" /> Casos
              </TabsTrigger>
              <TabsTrigger value="fontes" className="gap-1.5 rounded-lg data-[state=active]:shadow-sm">
                <Rss className="size-4" /> Fontes
              </TabsTrigger>
              <TabsTrigger value="testes" className="gap-1.5 rounded-lg data-[state=active]:shadow-sm">
                <FlaskConical className="size-4" /> Testes RAG
              </TabsTrigger>
              <TabsTrigger value="integridade" className="gap-1.5 rounded-lg data-[state=active]:shadow-sm">
                <ScanSearch className="size-4" /> Integridade
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={aba}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <TabsContent value="visao" forceMount className="mt-0 data-[state=inactive]:hidden">
                  {stats ? <OverviewTab stats={stats} onNavegar={setAba} /> : <p className="py-16 text-center text-sm text-muted-foreground">Carregando estatísticas...</p>}
                </TabsContent>
                <TabsContent value="jurimetria" forceMount className="mt-0 data-[state=inactive]:hidden">
                  <JurimetriaTab />
                </TabsContent>
                <TabsContent value="compendio" forceMount className="mt-0 data-[state=inactive]:hidden">
                  <CompendioTab />
                </TabsContent>
                <TabsContent value="base" forceMount className="mt-0 data-[state=inactive]:hidden">
                  <KnowledgeTab />
                </TabsContent>
                <TabsContent value="consulta" forceMount className="mt-0 data-[state=inactive]:hidden">
                  <AskTab />
                </TabsContent>
                <TabsContent value="pesquisa" forceMount className="mt-0 data-[state=inactive]:hidden">
                  <PesquisaTab />
                </TabsContent>
                <TabsContent value="grafo" forceMount className="mt-0 data-[state=inactive]:hidden">
                  <GraphTab />
                </TabsContent>
                <TabsContent value="ferramentas" forceMount className="mt-0 data-[state=inactive]:hidden">
                  <ToolsTab />
                </TabsContent>
                <TabsContent value="casos" forceMount className="mt-0 data-[state=inactive]:hidden">
                  <CasosTab onNavegar={setAba} />
                </TabsContent>
                <TabsContent value="fontes" forceMount className="mt-0 data-[state=inactive]:hidden">
                  <FontesTab />
                </TabsContent>
                <TabsContent value="testes" forceMount className="mt-0 data-[state=inactive]:hidden">
                  <TestTab />
                </TabsContent>
                <TabsContent value="integridade" forceMount className="mt-0 data-[state=inactive]:hidden">
                  <IntegridadeTab />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        )}
      </main>

      {/* Paleta de comandos (⌘K) — navegação e salto direto a documentos */}
      <CommandPalette onNavegar={setAba} open={paletteAberta} onOpenChange={setPaletteAberta} />

      {/* Tour guiado — 1ª visita (localStorage) ou botão "Tour" / paleta ⌘K */}
      <TourGuiado onNavegar={setAba} />

      {/* Footer — fixado ao rodapé (mt-auto) e respeitando safe-area */}
      <footer className="mt-auto border-t bg-muted/40 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-black borda-ouro">
                  <img
                  src="/logo-depaula-dark-wide.png"
                  alt=""
                  aria-hidden
                  className="h-full w-full object-cover mix-blend-screen"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Jurimetria DPT.</span>{' '}
                <span className="font-medium text-primary">De Paula Teixeira Advocacia</span>
              </p>
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground sm:ml-auto sm:max-w-xl">
              Regra absoluta: nenhuma informação jurídica é inventada — todo conteúdo factual possui fonte, URL e data de consulta; registros não confirmados ficam em revisão humana. O feed de fontes públicas exibe apenas metadados com link ao inteiro teor oficial.
            </p>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Prazos e precedentes devem ser sempre validados à luz do processo concreto e da legislação vigente. Conteúdo com confiabilidade C não deve fundamentar documento definitivo sem validação adicional.
          </p>
        </div>
      </footer>
    </div>
  );
}
