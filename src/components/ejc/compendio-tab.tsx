'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  BookOpen,
  ChevronRight,
  FileText,
  FolderTree,
  Layers,
  Search,
  Sparkles,
} from 'lucide-react';

interface DocResumo {
  slug: string;
  titulo: string;
  tipoDocumento: string;
  assunto: string | null;
  prioridade: string;
  confiabilidade: string;
  status: string;
  lote: string | null;
}

interface Capitulo {
  id: string;
  nome: string;
  quantidade: number;
  foraDaTaxonomia?: boolean;
  documentos: DocResumo[];
}

interface AreaComp {
  id: string;
  nome: string;
  quantidade: number;
  subareas: Capitulo[];
}

interface Comp {
  total: number;
  areas: AreaComp[];
  orfas: Capitulo[];
  estatisticas: { areas: number; capitulos: number };
  atualizadoEm: string;
}

const corConf = (c: string) =>
  c === 'A'
    ? 'border-emerald-500/40 text-emerald-700 dark:text-emerald-400'
    : c === 'B'
      ? 'border-amber-500/40 text-amber-700 dark:text-amber-400'
      : 'border-red-500/40 text-red-700 dark:text-red-400';

export function CompendioTab() {
  const [comp, setComp] = useState<Comp | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [areaSel, setAreaSel] = useState<string | null>(null);
  const [capSel, setCapSel] = useState<string | null>(null);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    fetch('/api/ejc/compendio')
      .then((r) => r.json())
      .then((d) => (d.error ? setErro(d.error) : setComp(d)))
      .catch(() => setErro('Falha ao carregar o compêndio'));
  }, []);

  const areasFiltradas = useMemo(() => {
    if (!comp) return [];
    const q = busca.trim().toLowerCase();
    if (!q) return comp.areas;
    return comp.areas
      .map((a) => ({
        ...a,
        subareas: a.subareas
          .map((s) => ({
            ...s,
            documentos: s.documentos.filter(
              (d) => d.titulo.toLowerCase().includes(q) || (d.assunto ?? '').toLowerCase().includes(q),
            ),
          }))
          .filter((s) => s.quantidade > 0 && (s.nome.toLowerCase().includes(q) || s.documentos.length > 0)),
      }))
      .filter((a) => a.quantidade > 0 && (a.nome.toLowerCase().includes(q) || a.subareas.length > 0));
  }, [comp, busca]);

  const areaAtiva = areasFiltradas.find((a) => a.id === areaSel) ?? null;
  const capituloAtivo =
    (areaAtiva?.subareas ?? []).find((s) => s.id === capSel) ??
    (comp?.orfas ?? []).find((s) => s.id === capSel) ??
    null;

  const abrirDoc = (slug: string) => {
    window.dispatchEvent(new CustomEvent('ejc:abrir-doc', { detail: { slug } }));
  };

  if (erro) {
    return (
      <Alert variant="destructive">
        <FolderTree className="size-4" />
        <AlertTitle>Compêndio indisponível</AlertTitle>
        <AlertDescription>{erro}</AlertDescription>
      </Alert>
    );
  }

  if (!comp) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Cabeçalho do compêndio */}
      <div className="relative overflow-hidden rounded-xl border bg-marca-verde p-5 text-white shadow-sm sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-marca-ouro opacity-[0.06]" aria-hidden />
        <div className="relative flex flex-wrap items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-marca-ouro text-black shadow-sm">
            <BookOpen className="size-6" aria-hidden />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold tracking-tight sm:text-xl">Compêndio Jurídico EJC</h2>
            <p className="text-sm text-white/80">
              Enciclopédia categorizada da base — {comp.total} documentos em {comp.estatisticas.capitulos} capítulos e{' '}
              {comp.estatisticas.areas} áreas do conhecimento, com foco em Minas Gerais.
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="outline" className="border-white/25 bg-black/20 text-white">
              <Layers className="mr-1 size-3" />
              Área → Capítulo → Documento
            </Badge>
          </div>
        </div>
      </div>

      {/* Busca + trilha */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Filtrar capítulos ou documentos do compêndio..."
            className="pl-9"
            aria-label="Filtrar compêndio"
          />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-label="Trilha de navegação">
          <button
            className={`rounded-md px-2 py-1 transition-colors hover:bg-muted ${!areaSel ? 'font-semibold text-foreground' : ''}`}
            onClick={() => {
              setAreaSel(null);
              setCapSel(null);
            }}
          >
            Todas as áreas
          </button>
          {areaAtiva && (
            <>
              <ChevronRight className="size-3.5" aria-hidden />
              <button
                className={`rounded-md px-2 py-1 transition-colors hover:bg-muted ${!capSel ? 'font-semibold text-foreground' : ''}`}
                onClick={() => setCapSel(null)}
              >
                {areaAtiva.nome}
              </button>
            </>
          )}
          {capituloAtivo && (
            <>
              <ChevronRight className="size-3.5" aria-hidden />
              <span className="rounded-md bg-muted px-2 py-1 font-semibold text-foreground">{capituloAtivo.nome}</span>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* Coluna 1: áreas e capítulos */}
        <Card className="elevacao-card overflow-hidden border/60">
          <CardContent className="p-0">
            <div className="max-h-[32rem] overflow-y-auto p-2">
              {areasFiltradas
                .filter((a) => a.quantidade > 0)
                .map((a) => (
                  <div key={a.id} className="mb-1">
                    <button
                      onClick={() => {
                        setAreaSel(areaSel === a.id ? null : a.id);
                        setCapSel(null);
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        areaSel === a.id ? 'bg-primary/10 font-semibold text-primary' : 'hover:bg-muted'
                      }`}
                      aria-expanded={areaSel === a.id}
                    >
                      <FolderTree className="size-4 shrink-0 opacity-70" aria-hidden />
                      <span className="flex-1 truncate">{a.nome}</span>
                      <Badge variant="secondary" className="text-[10px]">
                        {a.quantidade}
                      </Badge>
                      <ChevronRight className={`size-3.5 shrink-0 transition-transform ${areaSel === a.id ? 'rotate-90' : ''}`} aria-hidden />
                    </button>
                    {areaSel === a.id && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="ml-4 space-y-0.5 overflow-hidden border-l pl-2">
                        {a.subareas.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => setCapSel(s.id)}
                            className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${
                              capSel === s.id ? 'bg-accent font-semibold text-accent-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                          >
                            <FileText className="size-3.5 shrink-0 opacity-60" aria-hidden />
                            <span className="flex-1 truncate">{s.nome}</span>
                            <span className="shrink-0 tabular-nums opacity-70">{s.quantidade}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              {comp.orfas.length > 0 && (
                <div className="mb-1">
                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-muted-foreground" disabled>
                    <Sparkles className="size-4 shrink-0" aria-hidden />
                    <span className="flex-1">Fora da taxonomia (histórico)</span>
                    <Badge variant="outline" className="text-[10px]">{comp.orfas.length}</Badge>
                  </button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Coluna 2: documentos do capítulo */}
        <Card className="elevacao-card border/60">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 border-b px-4 py-3">
              <BookOpen className="size-4 text-primary" aria-hidden />
              <h3 className="text-sm font-semibold">{capituloAtivo ? capituloAtivo.nome : areaAtiva ? `${areaAtiva.nome} — escolha um capítulo` : 'Selecione um capítulo'}</h3>
              {capituloAtivo && (
                <Badge variant="secondary" className="ml-auto text-[10px]">
                  {capituloAtivo.quantidade} docs {capituloAtivo.foraDaTaxonomia ? '· fora da taxonomia' : ''}
                </Badge>
              )}
            </div>
            <div className="max-h-[32rem] space-y-2 overflow-y-auto p-3">
              {!capituloAtivo && (
                <div className="grid gap-2 sm:grid-cols-2">
                  {(areaAtiva?.subareas ?? areasFiltradas.flatMap((a) => a.subareas).slice(0, 12)).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        if (!areaAtiva) setAreaSel(comp.areas.find((a) => a.subareas.some((x) => x.id === s.id))?.id ?? null);
                        setCapSel(s.id);
                      }}
                      className="elevacao-card group rounded-lg border p-3 text-left transition-colors hover:border-primary/40 hover:bg-accent/40"
                    >
                      <p className="line-clamp-2 text-xs font-medium group-hover:text-primary">{s.nome}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground">{s.quantidade} documentos</p>
                    </button>
                  ))}
                </div>
              )}
              {capituloAtivo &&
                capituloAtivo.documentos.map((d) => (
                  <button
                    key={d.slug}
                    onClick={() => abrirDoc(d.slug)}
                    className="group flex w-full items-start gap-2.5 rounded-lg border p-3 text-left transition-all hover:border-primary/40 hover:bg-accent/30"
                  >
                    <FileText className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-medium group-hover:text-primary">{d.titulo}</span>
                      <span className="mt-1 flex flex-wrap items-center gap-1.5">
                        <Badge variant="outline" className="text-[9px]">{d.tipoDocumento}</Badge>
                        <Badge variant="outline" className={`text-[9px] ${corConf(d.confiabilidade)}`}>conf. {d.confiabilidade}</Badge>
                        {d.status !== 'ATIVO' && (
                          <Badge variant="outline" className="text-[9px] border-orange-500/40 text-orange-600 dark:text-orange-400">{d.status}</Badge>
                        )}
                        {d.lote && <span className="text-[9px] text-muted-foreground">{d.lote}</span>}
                      </span>
                    </span>
                  </button>
                ))}
              {capituloAtivo && capituloAtivo.quantidade > capituloAtivo.documentos.length && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-muted-foreground"
                  onClick={() => window.dispatchEvent(new CustomEvent('ejc:ir-base'))}
                >
                  Ver todos os {capituloAtivo.quantidade} documentos na Base de Conhecimento
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
