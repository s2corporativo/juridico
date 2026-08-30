'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Network, Search, Share2 } from 'lucide-react';
import { Markdown } from './markdown';

interface GraphNode {
  id: string;
  slug: string;
  titulo: string;
  tipoDocumento: string;
  area: string;
  confiabilidade: string;
  status: string;
  grau?: number;
}
interface GraphEdge {
  origem: string;
  destino: string;
  tipo: string;
  descricao: string | null;
}

const COR_TIPO: Record<string, string> = {
  LEGISLACAO: '#b45309',
  JURISPRUDENCIA: '#047857',
  TESE: '#9333ea',
  PECA: '#c2410c',
  PRAZO: '#0f766e',
  DOUTRINA: '#6d28d9',
  CHECKLIST: '#be185d',
  FLUXO: '#a16207',
  REGRA_INTELIGENCIA: '#1d4ed8',
  ARGUMENTACAO: '#334155',
  TRIAGEM: '#4d7c0f',
  CONTRATO: '#7c2d12',
  TABELA_DOCUMENTOS: '#475569',
};

/**
 * Layout radial adaptativo:
 * - Foco: centro + satélites em 1 anel.
 * - Global: nós de maior grau no anel interno, demais no anel externo
 *   (2 anéis evitam a aglomeração de rótulos de um único círculo).
 * - Raio responsivo ao container medido (evita overflow horizontal).
 */
function radialLayout(
  nodes: GraphNode[],
  centerId: string | null,
  w: number,
  h: number,
) {
  const cx = w / 2;
  const cy = h / 2;
  const pos = new Map<string, { x: number; y: number }>();
  if (!centerId) {
    const ordered = [...nodes].sort((a, b) => (b.grau ?? 0) - (a.grau ?? 0));
    const useTwoRings = ordered.length > 16;
    const inner = useTwoRings ? ordered.slice(0, Math.ceil(ordered.length * 0.4)) : ordered;
    const outer = useTwoRings ? ordered.slice(inner.length) : [];
    const rMax = Math.min(w, h) / 2 - 34;
    const rIn = useTwoRings ? rMax * 0.52 : rMax;
    const rOut = rMax;
    inner.forEach((n, i) => {
      const a = (2 * Math.PI * i) / inner.length - Math.PI / 2;
      pos.set(n.id, { x: cx + rIn * Math.cos(a), y: cy + rIn * Math.sin(a) });
    });
    outer.forEach((n, i) => {
      // alterna ângulo para distribuir entre os do anel interno
      const a = (2 * Math.PI * (i + 0.5)) / outer.length - Math.PI / 2;
      pos.set(n.id, { x: cx + rOut * Math.cos(a), y: cy + rOut * Math.sin(a) });
    });
    return pos;
  }
  pos.set(centerId, { x: cx, y: cy });
  const sat = nodes.filter((n) => n.id !== centerId);
  const r = Math.min(w, h) / 2 - 44;
  sat.forEach((n, i) => {
    const a = (2 * Math.PI * i) / Math.max(1, sat.length) - Math.PI / 2;
    pos.set(n.id, { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
  });
  return pos;
}

export function GraphTab() {
  const [global, setGlobal] = useState<{ nodes: GraphNode[]; edges: GraphEdge[]; total: number } | null>(null);
  const [focado, setFocado] = useState<{ centro: { id: string; slug: string; titulo: string }; nodes: GraphNode[]; edges: GraphEdge[] } | null>(null);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [docAberto, setDocAberto] = useState<string | null>(null);
  const [docConteudo, setDocConteudo] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [w, setW] = useState(880);

  // Mede a largura real do container → SVG responsivo sem min-width (sem overflow mobile)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const atualizar = () => setW(Math.max(300, el.clientWidth));
    atualizar();
    const ro = new ResizeObserver(atualizar);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const carregarGlobal = useCallback(async () => {
    const r = await fetch('/api/ejc/graph');
    const d = await r.json();
    setGlobal({ nodes: d.nodes ?? [], edges: d.edges ?? [], total: d.total ?? 0 });
    setFocado(null);
    setCarregando(false);
  }, []);

  useEffect(() => {
    let ok = true;
    (async () => {
      const r = await fetch('/api/ejc/graph');
      const d = await r.json();
      if (!ok) return;
      setGlobal({ nodes: d.nodes ?? [], edges: d.edges ?? [], total: d.total ?? 0 });
      setCarregando(false);
    })();
    return () => {
      ok = false;
    };
  }, []);

  const focar = async (slug: string) => {
    setCarregando(true);
    const r = await fetch(`/api/ejc/graph?slug=${encodeURIComponent(slug)}`);
    const d = await r.json();
    setFocado(d.centro ? d : null);
    setCarregando(false);
  };

  const abrirDoc = async (slug: string) => {
    setDocAberto(slug);
    setDocConteudo(null);
    const r = await fetch(`/api/ejc/documents?slug=${encodeURIComponent(slug)}`);
    const d = await r.json();
    setDocConteudo(d.documento?.conteudo ?? 'Documento não encontrado.');
  };

  const sugestoes = focado
    ? focado.nodes.filter((n) => n.id !== focado.centro.id && n.titulo.toLowerCase().includes(busca.toLowerCase())).slice(0, 8)
    : null;

  const view = focado ? { nodes: focado.nodes, edges: focado.edges, centerId: focado.centro.id } : global ? { nodes: global.nodes, edges: global.edges, centerId: null } : null;
  const H = Math.round(Math.min(560, Math.max(380, w * 0.58)));
  const pos = view ? radialLayout(view.nodes, view.centerId, w, H) : null;
  // No foco: rótulos sempre visíveis. Na visão global: rótulo só no hover
  // (evita colisão de textos; <title> dá tooltip nativo no toque).
  const mostraRotulos = !!focado;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Network className="size-4 text-amber-600" /> Grafo jurídico de conhecimento</CardTitle>
          <CardDescription>
            Não armazenamos informação isolada (item 29 da missão): lei ↔ precedente ↔ tese ↔ peça ↔ prazo ↔ risco. Clique em um nó para focar; clique novamente no título para abrir o documento completo.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder={focado ? 'Filtrar vizinhos do documento focado...' : 'Buscar documento para focar o grafo...'} className="pl-9" />
          </div>
          {focado && (
            <button onClick={carregarGlobal} className="rounded-lg border px-3 py-2 text-xs font-medium transition-colors hover:border-amber-500/50">
              ← Visão global ({global?.edges.length ?? 0} relacionamentos)
            </button>
          )}
        </CardContent>
      </Card>

      {carregando && <Card><CardContent className="py-16 text-center text-sm text-muted-foreground">Carregando grafo...</CardContent></Card>}

      {!carregando && focado && busca && sugestoes && sugestoes.length > 0 && (
        <Card>
          <CardContent className="flex flex-wrap gap-2 p-4">
            {sugestoes.map((s) => (
              <button key={s.id} onClick={() => { setBusca(''); focar(s.slug); }} className="max-w-full truncate rounded-full border px-3 py-1 text-xs transition-colors hover:border-amber-500/50">
                {s.titulo}
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      {!carregando && view && pos && (
        <Card className="overflow-hidden">
          <CardContent className="p-2 sm:p-4">
            <div ref={containerRef} className="w-full">
              <svg viewBox={`0 0 ${w} ${H}`} width="100%" height={H} className="mx-auto block" role="img" aria-label="Grafo de relacionamentos entre documentos jurídicos">
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" className="text-muted-foreground/60" />
                  </marker>
                </defs>
                {view.edges.map((e, i) => {
                  const a = pos.get(e.origem);
                  const b = pos.get(e.destino);
                  if (!a || !b) return null;
                  const active = hover === e.origem || hover === e.destino;
                  return (
                    <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={active ? '#d97706' : 'currentColor'} strokeWidth={active ? 2 : 1} markerEnd="url(#arrow)" className="text-border" opacity={active ? 1 : 0.45} />
                  );
                })}
                {view.nodes.map((n) => {
                  const p = pos.get(n.id);
                  if (!p) return null;
                  const isCenter = n.id === view.centerId;
                  const cor = COR_TIPO[n.tipoDocumento] ?? '#57534e';
                  const r = w < 520 ? (isCenter ? 22 : 12) : isCenter ? 26 : 16;
                  const visivel = mostraRotulos || isCenter || hover === n.id;
                  const maxChars = w < 520 ? 20 : 30;
                  const label = n.titulo.length > maxChars ? n.titulo.slice(0, maxChars - 1) + '…' : n.titulo;
                  const foraDoGrafo = p.x < 40 || p.x > w - 40;
                  const rotuloAcima = foraDoGrafo || p.y < H / 2;
                  const dyRotulo = rotuloAcima ? -(r + 10) : r + 18;
                  return (
                    <motion.g key={n.id} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35, delay: isCenter ? 0 : Math.min(0.4, (n.grau ?? 1) * 0.05) }} style={{ transformOrigin: `${p.x}px ${p.y}px` }}>
                      <g transform={`translate(${p.x},${p.y})`} onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)} onClick={() => focar(n.slug)} className="cursor-pointer">
                        <title>{`${n.titulo} — ${n.tipoDocumento} · clique para focar`}</title>
                        <circle r={r} fill={cor} fillOpacity={n.status === 'ATIVO' ? 0.9 : 0.45} stroke={hover === n.id ? '#d97706' : '#fff'} strokeWidth={hover === n.id ? 3 : 2} />
                        {visivel && (
                          <text y={dyRotulo} textAnchor="middle" className="fill-foreground text-[10px] font-medium" style={{ pointerEvents: 'none' }}>
                            {label}
                          </text>
                        )}
                        {visivel && (
                          <text y={dyRotulo + 12} textAnchor="middle" className="fill-muted-foreground text-[9px]" style={{ pointerEvents: 'none' }}>
                            {n.tipoDocumento}
                          </text>
                        )}
                      </g>
                    </motion.g>
                  );
                })}
              </svg>
            </div>
            {!mostraRotulos && (
              <p className="pb-1 text-center text-[11px] text-muted-foreground">Passe o mouse (ou toque) em um nó para ver o título · clique para focar</p>
            )}
            <div className="flex flex-wrap items-center gap-2 px-2 pb-2 pt-1">
              <Share2 className="size-3.5 text-muted-foreground" />
              {Object.entries(COR_TIPO).slice(0, 10).map(([t, c]) => (
                <span key={t} className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                  <span className="inline-block size-2 rounded-full" style={{ background: c }} />
                  {t}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!carregando && view && view.edges.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Ainda não há relacionamentos registrados envolvendo este documento. Relacionamentos são criados na ingestão (campo <code>relacionamentos</code>).
          </CardContent>
        </Card>
      )}

      <Dialog open={!!docAberto} onOpenChange={(o) => !o && setDocAberto(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-hidden p-0">
          <DialogHeader className="border-b bg-muted/40 px-6 py-4">
            <DialogTitle className="text-sm leading-snug">{docAberto}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(85vh-90px)]">
            <div className="px-6 py-4">
              {docConteudo ? <Markdown>{docConteudo}</Markdown> : <p className="py-8 text-center text-sm text-muted-foreground">Carregando...</p>}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
