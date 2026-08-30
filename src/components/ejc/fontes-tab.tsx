'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Building2,
  CheckCircle2,
  ExternalLink,
  Gavel,
  KeyRound,
  Landmark,
  RefreshCw,
  Rss,
  Scale,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EstadoFonte {
  id: string;
  nome: string;
  tipo: string;
  urlBase: string;
  status: 'ATIVA' | 'BLOQUEADA' | 'AGUARDANDO_CHAVE' | 'ERRO';
  detalhe: string;
  latenciaMs: number | null;
}

interface ItemFonte {
  id: string;
  fonteId: string;
  origem: string;
  categoria: string;
  titulo: string;
  ementa?: string;
  dataISO: string | null;
  url: string;
  urlInteiroTeor: string;
}

interface Snapshot {
  atualizadoEm: string;
  proximaAtualizacao: string;
  duracaoMs: number;
  fontes: EstadoFonte[];
  itens: ItemFonte[];
  aviso?: string;
  politica?: {
    principio: string;
    cadencia: string;
    confiabilidade: string;
    antiduplicacao: string;
  };
}

const iconeFonte = (id: string) => {
  if (id === 'camara' || id === 'senado') return Landmark;
  if (id === 'stj' || id === 'datajud') return Gavel;
  return Scale;
};

const visualStatus = (s: EstadoFonte['status']) => {
  switch (s) {
    case 'ATIVA':
      return { cls: 'border-emerald-500/40 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400', rotulo: 'Ativa', icon: CheckCircle2 };
    case 'BLOQUEADA':
      return { cls: 'border-orange-500/40 bg-orange-500/5 text-orange-700 dark:text-orange-400', rotulo: 'Bloqueada (rede)', icon: TriangleAlert };
    case 'AGUARDANDO_CHAVE':
      return { cls: 'border-sky-500/40 bg-sky-500/5 text-sky-700 dark:text-sky-400', rotulo: 'Aguardando chave', icon: KeyRound };
    default:
      return { cls: 'border-red-500/40 bg-red-500/5 text-red-700 dark:text-red-400', rotulo: 'Erro', icon: TriangleAlert };
  }
};

export function FontesTab() {
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [renovando, setRenovando] = useState(false);
  const [filtro, setFiltro] = useState<string>('todos');
  const { toast } = useToast();

  const carregar = useCallback(async (forcar = false) => {
    if (forcar) setRenovando(true);
    else setCarregando(true);
    try {
      const r = await fetch(`/api/ejc/fontes${forcar ? '?refresh=1' : ''}`);
      const d = await r.json();
      if (d.error) throw new Error(d.error);
      setSnap(d);
    } catch {
      toast({ title: 'Falha ao consultar fontes públicas', variant: 'destructive' });
    } finally {
      setCarregando(false);
      setRenovando(false);
    }
  }, [toast]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const fontes = snap?.fontes ?? [];
  const itensFiltrados = useMemo(() => {
    const itens = snap?.itens ?? [];
    return filtro === 'todos' ? itens : itens.filter((i) => i.fonteId === filtro);
  }, [snap, filtro]);

  const formatarData = (iso: string | null) => {
    if (!iso) return null;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-5">
      {/* Banner de política — regra do usuário: link ao inteiro teor, sem injeção, sem loop */}
      <Alert className="border-primary/30 bg-primary/[0.04]">
        <ShieldCheck className="size-4 text-primary" />
        <AlertTitle className="text-sm font-semibold">Atualização diária por APIs públicas — com inteiro teor oficial e sem contaminação</AlertTitle>
        <AlertDescription className="text-xs leading-relaxed text-muted-foreground">
          {snap?.politica?.principio ?? 'Somente metadados + link direto ao inteiro teor oficial. Nada é injetado na base RAG (sem contaminação, sem loops).'}{' '}
          {snap?.politica?.cadencia ?? 'Feed renovado a cada 6 horas.'}
        </AlertDescription>
      </Alert>

      {/* Cabeçalho com refresh */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-marca-ouro text-black shadow-sm">
          <Rss className="size-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-bold sm:text-lg">Fontes Públicas Oficiais</h2>
          <p className="text-xs text-muted-foreground">
            {snap
              ? `Atualizado ${new Date(snap.atualizadoEm).toLocaleString('pt-BR')} · próxima renovação ${new Date(snap.proximaAtualizacao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} · ${snap.itens.length} itens`
              : 'Consultando fontes...'}
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={() => carregar(true)} disabled={renovando} className="ml-auto gap-1.5">
          <RefreshCw className={`size-3.5 ${renovando ? 'animate-spin' : ''}`} aria-hidden />
          {renovando ? 'Renovando...' : 'Renovar agora'}
        </Button>
      </div>

      {snap?.aviso && (
        <Alert className="border-orange-500/30 bg-orange-500/[0.05]">
          <TriangleAlert className="size-4 text-orange-600 dark:text-orange-400" />
          <AlertDescription className="text-xs">{snap.aviso}</AlertDescription>
        </Alert>
      )}

      {/* Grid de status por fonte */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {(carregando && !snap ? Array.from({ length: 5 }) : fontes).map((f, i) => {
          if (!f) return <Card key={i} className="h-40 animate-pulse rounded-xl bg-muted/60" />;
          const fonte = f as EstadoFonte;
          const Icone = iconeFonte(fonte.id);
          const vs = visualStatus(fonte.status);
          const StatusIcon = vs.icon;
          return (
            <motion.div key={fonte.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: i * 0.04 }}>
              <Card className={`elevacao-card min-h-40 rounded-xl border ${fonte.status === 'ATIVA' ? 'border-emerald-500/25' : ''}`}>
                <CardContent className="flex h-full flex-col gap-2 p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icone className="size-4" aria-hidden />
                    </div>
                    <Badge variant="outline" className={`text-[9px] ${vs.cls}`}>
                      <StatusIcon className="mr-1 size-2.5" aria-hidden />
                      {vs.rotulo}
                    </Badge>
                    {fonte.latenciaMs != null && fonte.latenciaMs > 0 && (
                      <span className="ml-auto text-[10px] tabular-nums text-muted-foreground">{(fonte.latenciaMs / 1000).toFixed(1)}s</span>
                    )}
                  </div>
                  <p className="text-xs font-semibold leading-snug text-card-foreground">{fonte.nome}</p>
                  <p className="flex-1 text-[11px] leading-relaxed text-muted-foreground">{fonte.detalhe}</p>
                  <a
                    href={fonte.urlBase}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                  >
                    <ExternalLink className="size-3" aria-hidden />
                    Portal oficial
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Filtros por fonte */}
      <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Filtrar itens por fonte">
        {[
          { id: 'todos', nome: `Todos (${snap?.itens.length ?? 0})` },
          ...fontes.map((f) => ({ id: f.id, nome: `${f.nome.split('—')[0].trim()} (${(snap?.itens ?? []).filter((i) => i.fonteId === f.id).length})` })),
        ].map((o) => (
          <button
            key={o.id}
            role="tab"
            aria-selected={filtro === o.id}
            onClick={() => setFiltro(o.id)}
            className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors ${
              filtro === o.id ? 'border-primary/50 bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {o.nome}
          </button>
        ))}
      </div>

      {/* Feed de atualizações — cada item com link para o inteiro teor oficial */}
      <Card className="overflow-hidden rounded-xl">
        <CardContent className="p-0">
          <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-2.5">
            <Building2 className="size-4 text-primary" aria-hidden />
            <h3 className="text-sm font-semibold">Últimas atualizações oficiais</h3>
            <span className="ml-auto text-[10px] text-muted-foreground">clique para o inteiro teor ↗</span>
          </div>
          <div className="max-h-[36rem] divide-y overflow-y-auto">
            {carregando && !snap &&
              Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-16 animate-pulse bg-muted/40" />)}
            {itensFiltrados.map((item, i) => (
              <motion.a
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: Math.min(i * 0.02, 0.3) }}
                href={item.urlInteiroTeor}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-accent/40"
              >
                <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {item.categoria === 'PROPOSICAO' ? <Landmark className="size-3.5" aria-hidden /> : item.categoria === 'CONJUNTO_DADOS' ? <Gavel className="size-3.5" aria-hidden /> : <Scale className="size-3.5" aria-hidden />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="text-xs font-semibold group-hover:text-primary">{item.titulo}</span>
                    <Badge variant="outline" className="text-[9px]">{item.origem}</Badge>
                    {formatarData(item.dataISO) && (
                      <span className="text-[10px] tabular-nums text-muted-foreground">{formatarData(item.dataISO)}</span>
                    )}
                  </div>
                  {item.ementa && <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">{item.ementa}</p>}
                </div>
                <ExternalLink className="mt-1 size-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden />
              </motion.a>
            ))}
            {!carregando && itensFiltrados.length === 0 && (
              <p className="px-4 py-10 text-center text-xs text-muted-foreground">
                Nenhum item desta fonte nesta consulta — o feed informa honestamente o status de cada portal.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <p className="text-[11px] leading-relaxed text-muted-foreground">
        {snap?.politica?.confiabilidade} {snap?.politica?.antiduplicacao}
      </p>
    </div>
  );
}
