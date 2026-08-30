'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, Download, ExternalLink, FileSearch, FileSignature, FileText, Gavel, Landmark, Link2, ListChecks, Printer, Quote, Search, ShieldAlert, Siren, Star, Workflow } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Markdown } from './markdown';
import { MinutaFiller } from './minuta-filler';
import { consumirAcao } from '@/lib/ejc/ui-actions';
import { alternarFavorito, ehFavorito, lerFavoritos, observarFavoritos } from '@/lib/ejc/favorites';
import type { DocDetail, DocListItem, RetrievalHitInfo } from './types';

const TIPOS: { v: string; label: string }[] = [
  { v: 'LEGISLACAO', label: 'Legislação' },
  { v: 'JURISPRUDENCIA', label: 'Jurisprudência' },
  { v: 'TESE', label: 'Teses' },
  { v: 'PECA', label: 'Peças' },
  { v: 'CONTRATO', label: 'Contratos' },
  { v: 'CHECKLIST', label: 'Checklists' },
  { v: 'FLUXO', label: 'Fluxos' },
  { v: 'TABELA_DOCUMENTOS', label: 'Documentos por ação' },
  { v: 'TRIAGEM', label: 'Triagem' },
  { v: 'PRAZO', label: 'Prazos' },
  { v: 'ARGUMENTACAO', label: 'Argumentação' },
  { v: 'DOUTRINA', label: 'Doutrina' },
  { v: 'REGRA_INTELIGENCIA', label: 'Inteligência processual' },
  { v: 'REGRAS_CONTRATUAIS', label: 'Inteligência contratual' },
  { v: 'JURIMETRIA', label: 'Jurimetria' },
];

const AREAS_F = ['ambiental', 'processual-civil', 'tributario', 'administrativo', 'trabalhista', 'civil', 'consumidor', 'bancario', 'empresarial', 'penal', 'digital', 'geral'];

function confBadge(c: string) {
  if (c === 'A') return { label: 'Fonte A', cls: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' };
  if (c === 'B') return { label: 'Fonte B', cls: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30' };
  return { label: 'Fonte C — validar', cls: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30' };
}

function statusBadge(s: string) {
  if (s === 'ATIVO') return null;
  return { label: s === 'REVISAO_HUMANA' ? 'Revisão humana' : s, cls: 'bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30' };
}

// Ícone e matiz por tipo de documento — identifica visualmente o banco de origem
function tipoVisual(t: string): { icon: React.ReactNode; cls: string } {
  const base = 'size-3';
  switch (t) {
    case 'LEGISLACAO': return { icon: <Landmark className={base} />, cls: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25' };
    case 'JURISPRUDENCIA': return { icon: <Gavel className={base} />, cls: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/25' };
    case 'TESE': return { icon: <Siren className={base} />, cls: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/25' };
    case 'PRAZO': return { icon: <Workflow className={base} />, cls: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25' };
    case 'CHECKLIST': case 'TABELA_DOCUMENTOS': return { icon: <ListChecks className={base} />, cls: 'bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/25' };
    default: return { icon: <FileText className={base} />, cls: 'bg-stone-500/10 text-stone-700 dark:text-stone-400 border-stone-500/25' };
  }
}

export function KnowledgeTab() {
  const [q, setQ] = useState('');
  const [tipo, setTipo] = useState('');
  const [area, setArea] = useState('');
  const [conf, setConf] = useState('');
  const [status, setStatus] = useState('');
  const [modo, setModo] = useState<'lista' | 'rag'>('lista');
  const [docs, setDocs] = useState<DocListItem[]>([]);
  const [hits, setHits] = useState<RetrievalHitInfo[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const [buscando, setBuscando] = useState(false);
  const [aberto, setAberto] = useState<string | null>(null);
  const [detalhe, setDetalhe] = useState<DocDetail | null>(null);
  const [carregandoDetalhe, setCarregandoDetalhe] = useState(false);
  const [minutaAberta, setMinutaAberta] = useState(false);
  const [imprimindo, setImprimindo] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [soFavoritos, setSoFavoritos] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Favoritos: contagem inicial + sincronização entre abas/componentes
  useEffect(() => {
    const atualizar = () => setFavCount(lerFavoritos().length);
    atualizar();
    return observarFavoritos(atualizar);
  }, []);

  const carregar = useCallback(
    async (p = 1, busca = '') => {
      const filtros = `${tipo ? `&tipo=${tipo}` : ''}${area ? `&area=${area}` : ''}${conf ? `&conf=${conf}` : ''}${status ? `&status=${status}` : ''}${soFavoritos && lerFavoritos().length ? `&slugs=${lerFavoritos().join(',')}` : ''}`;
      if (busca) {
        setBuscando(true);
        const r = await fetch(`/api/ejc/documents?q=${encodeURIComponent(busca)}${filtros}`);
        const d = await r.json();
        setHits(d.resultados ?? []);
        setTotal(d.total ?? 0);
        setBuscando(false);
      } else {
        setCarregando(true);
        const r = await fetch(`/api/ejc/documents?page=${p}&pageSize=12${filtros}`);
        const d = await r.json();
        setDocs(d.documentos ?? []);
        setTotal(d.total ?? 0);
        setCarregando(false);
      }
    },
    [tipo, area, conf, status, soFavoritos],
  );

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setPage(1);
      carregar(1, q.trim());
    }, 350);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [q, tipo, area, conf, status, carregar]);

  // Escuta eventos da paleta de comandos (⌘K) para abrir documento direto —
  // evento direto OU ação pendente lida no mount (a aba é remontada ao trocar)
  useEffect(() => {
    const onAbrirDoc = (e: Event) => {
      const slug = (e as CustomEvent<{ slug: string }>).detail?.slug;
      if (slug) abrirDoc(slug);
    };
    window.addEventListener('ejc:abrir-doc', onAbrirDoc);
    const pendente = consumirAcao('abrirDoc');
    if (pendente) abrirDoc(pendente);
    return () => window.removeEventListener('ejc:abrir-doc', onAbrirDoc);

  }, []);

  const abrirDoc = async (slug: string) => {
    setAberto(slug);
    setDetalhe(null);
    setCarregandoDetalhe(true);
    const r = await fetch(`/api/ejc/documents?slug=${encodeURIComponent(slug)}`);
    const d = await r.json();
    setDetalhe(d.documento ?? null);
    setCarregandoDetalhe(false);
  };

  const imprimirDoc = (doc: DocDetail) => {
    setImprimindo(true);
    toast({ title: 'Preparando impressão', description: 'Confirme a janela de impressão do navegador (salvar como PDF).' });
    setTimeout(() => {
      window.print();
      setImprimindo(false);
    }, 250);
  };

  const toggleFav = (slug: string) => {
    const virou = alternarFavorito(slug);
    toast({ title: virou ? 'Adicionado aos favoritos' : 'Removido dos favoritos', description: virou ? 'Use o filtro "Favoritos" para acessar rapidamente.' : undefined });
    setFavCount(lerFavoritos().length);
  };

  const paginas = Math.ceil(total / 12);
  const emModoRag = q.trim().length > 0;

  // Exporta o documento como Markdown com frontmatter YAML (rastreabilidade)
  const exportarMd = (doc: DocDetail) => {
    const yaml = [
      '---',
      `id: ${doc.slug}`,
      `titulo: ${JSON.stringify(doc.titulo)}`,
      `tipo_documento: ${doc.tipoDocumento}`,
      `area: ${doc.area}`,
      doc.subarea ? `subarea: ${doc.subarea}` : 'subarea:',
      doc.assunto ? `assunto: ${JSON.stringify(doc.assunto)}` : 'assunto:',
      `prioridade: ${doc.prioridade}`,
      `lote: ${doc.lote ?? ''}`,
      `versao: ${doc.versao}`,
      `fonte: ${JSON.stringify(doc.fonte ?? '')}`,
      `url_fonte: ${doc.urlFonte ?? ''}`,
      `data_consulta: ${doc.dataConsulta ?? ''}`,
      `confiabilidade: ${doc.confiabilidade}`,
      `vigente: ${doc.vigente}`,
      `status: ${doc.status}`,
      `dados_ficticios: ${doc.dadosFicticios}`,
      `ultima_verificacao: ${doc.dataUltimaVerificacao ?? ''}`,
      `proxima_verificacao_recomendada: ${doc.proximaVerificacaoRecomendada ?? ''}`,
      doc.tags?.length ? `tags: [${doc.tags.join(', ')}]` : 'tags: []',
      '---',
    ].join('\n');
    const md = `${yaml}\n\n# ${doc.titulo}\n\n${doc.conteudo}\n`;
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ejc-${doc.slug}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Documento exportado', description: `Arquivo ejc-${doc.slug}.md baixado com metadados YAML.`, });
  };

  // Gera citação no padrão ABNT NBR 6023 a partir dos metadados reais do documento
  const citarAbnt = (doc: DocDetail): string => {
    if (doc.tipoDocumento === 'LEGISLACAO') {
      const numero = (doc.metadados?.numero as string) ?? '';
      const partes: string[] = ['BRASIL'];
      if (numero) partes.push(numero);
      return `${partes.join('. ')}. ${doc.titulo}. ${doc.fonte ?? ''}, consulta ${doc.dataConsulta ?? ''}. Disponível em: ${doc.urlFonte ?? ''}. Acesso em: ${doc.dataConsulta ?? ''}.`;
    }
    if (doc.tipoDocumento === 'JURISPRUDENCIA') {
      const tribunal = (doc.metadados?.tribunal as string) ?? 'STJ';
      const tema = doc.metadados?.tema_repetitivo ? ` (Tema ${doc.metadados.tema_repetitivo}/STJ)` : '';
      return `BRASIL. ${tribunal}${tema}. ${doc.titulo}. ${doc.fonte ?? ''}, consulta ${doc.dataConsulta ?? ''}. Disponível em: ${doc.urlFonte ?? ''}. Acesso em: ${doc.dataConsulta ?? ''}.`;
    }
    return `${doc.titulo}. In: EJC — Ecossistema Jurídico Clovis. ${doc.fonte ?? 'Elaboração EJC'}, consulta ${doc.dataConsulta ?? ''}. Disponível em: ${doc.urlFonte ?? 'base interna EJC'}. Acesso em: ${doc.dataConsulta ?? ''}.`;
  };

  const copiarCitacao = async (doc: DocDetail) => {
    const cit = citarAbnt(doc);
    try {
      await navigator.clipboard.writeText(cit);
      toast({ title: 'Citação ABNT copiada', description: 'Confira os dados do documento antes do uso formal.' });
    } catch {
      toast({ title: 'Não foi possível copiar', description: 'Seu navegador bloqueou a área de transferência.', variant: 'destructive' });
    }
  };

  const copiarYaml = async (doc: DocDetail) => {
    const yaml = [
      `id: ${doc.slug}`,
      `titulo: ${JSON.stringify(doc.titulo)}`,
      `tipo_documento: ${doc.tipoDocumento}`,
      `area: ${doc.area}`,
      doc.subarea ? `subarea: ${doc.subarea}` : 'subarea:',
      doc.assunto ? `assunto: ${JSON.stringify(doc.assunto)}` : 'assunto:',
      `prioridade: ${doc.prioridade}`,
      `lote: ${doc.lote ?? ''}`,
      `versao: ${doc.versao}`,
      `fonte: ${JSON.stringify(doc.fonte ?? '')}`,
      `url_fonte: ${doc.urlFonte ?? ''}`,
      `data_consulta: ${doc.dataConsulta ?? ''}`,
      `confiabilidade: ${doc.confiabilidade}`,
      `vigente: ${doc.vigente}`,
      `status: ${doc.status}`,
      ...(doc.metadados ? Object.entries(doc.metadados).filter(([, v]) => v !== null && v !== undefined).map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : String(v)}`) : []),
      ...(doc.tags?.length ? [`tags: [${doc.tags.join(', ')}]`] : ['tags: []']),
    ].join('\n');
    try {
      await navigator.clipboard.writeText(yaml);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
      toast({ title: 'Metadados YAML copiados', description: 'Cole no seu sistema de gestão ou no repositório.' });
    } catch {
      // Fallback para contextos sem Clipboard API (iframes, http, navegadores restritos)
      try {
        const ta = document.createElement('textarea');
        ta.value = yaml;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        if (!ok) throw new Error('execCommand falhou');
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
        toast({ title: 'Metadados YAML copiados', description: 'Cole no seu sistema de gestão ou no repositório.' });
      } catch {
        toast({ title: 'Não foi possível copiar', description: 'Seu navegador bloqueou a área de transferência — use o botão .md para baixar o documento completo.', variant: 'destructive' });
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Busca e filtros */}
      <Card className="border-amber-500/15 bg-gradient-to-br from-card to-amber-500/[0.03]">
        <CardContent className="flex flex-col gap-3 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Pesquisar na base (ex.: prescrição intercorrente, purgação da mora, súmula 467...)"
                className="pl-9"
                aria-label="Pesquisar base de conhecimento"
              />
            </div>
            <div className="flex gap-2">
              <Select value={tipo || 'todos'} onValueChange={(v) => setTipo(v === 'todos' ? '' : v)}>
                <SelectTrigger className="w-[150px]" aria-label="Tipo de documento"><SelectValue placeholder="Tipo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  {TIPOS.map((t) => <SelectItem key={t.v} value={t.v}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={area || 'todas'} onValueChange={(v) => setArea(v === 'todas' ? '' : v)}>
                <SelectTrigger className="w-[150px]" aria-label="Área"><SelectValue placeholder="Área" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as áreas</SelectItem>
                  {AREAS_F.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Governança:</span>
            <Select value={conf || 'todas'} onValueChange={(v) => setConf(v === 'todas' ? '' : v)}>
              <SelectTrigger className="h-8 w-[180px] text-xs" aria-label="Confiabilidade"><SelectValue placeholder="Confiabilidade" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Qualquer confiabilidade</SelectItem>
                <SelectItem value="A">A — Fonte oficial confirmada</SelectItem>
                <SelectItem value="B">B — Institucional confiável</SelectItem>
                <SelectItem value="C">C — Requer validação</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status || 'qualquer'} onValueChange={(v) => setStatus(v === 'qualquer' ? '' : v)}>
              <SelectTrigger className="h-8 w-[170px] text-xs" aria-label="Status"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="qualquer">Qualquer status</SelectItem>
                <SelectItem value="ATIVO">Ativo</SelectItem>
                <SelectItem value="REVISAO_HUMANA">Revisão humana</SelectItem>
              </SelectContent>
            </Select>
            {(conf || status || soFavoritos) && (
              <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground" onClick={() => { setConf(''); setStatus(''); setSoFavoritos(false); }}>
                limpar governança
              </Button>
            )}
            <div className="ml-auto">
              <Button
                variant={soFavoritos ? 'default' : 'outline'}
                size="sm"
                className={`h-8 gap-1.5 text-xs ${soFavoritos ? 'bg-amber-500 text-white hover:bg-amber-600' : 'text-amber-700 dark:text-amber-400 border-amber-500/40'}`}
                onClick={() => { setSoFavoritos(!soFavoritos); setPage(1); }}
                aria-pressed={soFavoritos}
                aria-label="Filtrar somente favoritos"
              >
                <Star className={`size-3.5 ${soFavoritos ? 'fill-current' : ''}`} /> Favoritos
                {favCount > 0 && <span className="tabular-nums opacity-80">({favCount})</span>}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estado da busca */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {emModoRag
            ? `Busca semântica RAG — ${total} documento(s) relevante(s)`
            : `${total} documento(s) na base`}
        </span>
        {emModoRag && <Badge variant="outline" className="text-[10px]">modo RAG · ranking ponderado</Badge>}
      </div>

      {/* Resultados */}
      {carregando || buscando ? (
        <div className="grid gap-3 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}><CardContent className="space-y-2 p-4"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/2" /><Skeleton className="h-3 w-2/3" /></CardContent></Card>
          ))}
        </div>
      ) : emModoRag ? (
        hits.length === 0 ? (
          <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">Nenhum resultado. Tente outros termos jurídicos.</CardContent></Card>
        ) : (
          <div className="space-y-3">
            {hits.map((h) => {
              const cb = confBadge(h.confiabilidade);
              const sb = statusBadge(h.status);
              const tv = tipoVisual(h.tipoDocumento);
              return (
                <Card key={h.chunkId ?? h.slug} className="group relative border-l-2 border-l-transparent transition-all hover:border-l-amber-500 hover:border-amber-500/40 hover:shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant="secondary" className={`gap-1 text-[10px] ${tv.cls}`}>{tv.icon}{h.tipoDocumento}</Badge>
                      <Badge variant="outline" className={`text-[10px] ${cb.cls}`}>{cb.label}</Badge>
                      {sb && <Badge variant="outline" className={`text-[10px] ${sb.cls}`}><ShieldAlert className="mr-1 size-2.5" />{sb.label}</Badge>}
                      <Badge variant="outline" className="text-[10px] tabular-nums">score {h.score}</Badge>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFav(h.slug); }}
                        className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground/50 transition-colors hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400"
                        aria-label={ehFavorito(h.slug) ? `Remover ${h.titulo} dos favoritos` : `Adicionar ${h.titulo} aos favoritos`}
                        aria-pressed={ehFavorito(h.slug)}
                      >
                        <Star className={`size-3.5 ${ehFavorito(h.slug) ? 'fill-amber-500 text-amber-500' : ''}`} />
                      </button>
                    </div>
                    <button onClick={() => abrirDoc(h.slug)} className="mt-2 text-left text-sm font-semibold group-hover:text-amber-700 dark:group-hover:text-amber-400 hover:underline">{h.titulo}</button>
                    <p className="mt-1.5 line-clamp-3 text-xs text-muted-foreground">{h.chunkTexto}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                      {h.urlFonte && <a href={h.urlFonte} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-amber-600"><ExternalLink className="size-3" /> fonte oficial</a>}
                      {h.dataConsulta && <span>consulta: {h.dataConsulta}</span>}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )
      ) : (
        <>
          <div className="grid gap-3 md:grid-cols-2">
            {docs.map((d) => {
              const cb = confBadge(d.confiabilidade);
              const sb = statusBadge(d.status);
              const tv = tipoVisual(d.tipoDocumento);
              return (
                <Card key={d.slug} className="group relative border-l-2 border-l-transparent transition-all hover:border-l-amber-500 hover:border-amber-500/40 hover:shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant="secondary" className={`gap-1 text-[10px] ${tv.cls}`}>{tv.icon}{d.tipoDocumento}</Badge>
                      <Badge variant="outline" className={`text-[10px] ${cb.cls}`}>{cb.label}</Badge>
                      {sb && <Badge variant="outline" className={`text-[10px] ${sb.cls}`}><ShieldAlert className="mr-1 size-2.5" />{sb.label}</Badge>}
                      {d.prioridade === 'P0' && <Badge variant="outline" className="text-[10px] border-amber-500/40">P0</Badge>}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFav(d.slug); }}
                        className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground/50 transition-colors hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400"
                        aria-label={ehFavorito(d.slug) ? `Remover ${d.titulo} dos favoritos` : `Adicionar ${d.titulo} aos favoritos`}
                        aria-pressed={ehFavorito(d.slug)}
                      >
                        <Star className={`size-3.5 ${ehFavorito(d.slug) ? 'fill-amber-500 text-amber-500' : ''}`} />
                      </button>
                      {d.lote && <span className="ml-auto mr-6 hidden font-mono text-[9px] text-muted-foreground/70 sm:inline">{d.lote}</span>}
                    </div>
                    <button onClick={() => abrirDoc(d.slug)} className="mt-2 line-clamp-2 text-left text-sm font-semibold group-hover:text-amber-700 dark:group-hover:text-amber-400 hover:underline">{d.titulo}</button>
                    <p className="mt-1 text-xs text-muted-foreground">{d.area}{d.subarea ? ` · ${d.subarea}` : ''}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                      {d.urlFonte && <a href={d.urlFonte} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-amber-600"><ExternalLink className="size-3" /> fonte oficial</a>}
                      {d.tags?.slice(0, 2).map((t) => <span key={t} className="font-mono">#{t}</span>)}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {paginas > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => { setPage(page - 1); carregar(page - 1, ''); }}>Anterior</Button>
              <span className="text-xs text-muted-foreground">Página {page} de {paginas}</span>
              <Button variant="outline" size="sm" disabled={page >= paginas} onClick={() => { setPage(page + 1); carregar(page + 1, ''); }}>Próxima</Button>
            </div>
          )}
        </>
      )}

      {/* Dialog de detalhe */}
      <Dialog open={!!aberto} onOpenChange={(o) => !o && setAberto(null)}>
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-hidden p-0 sm:max-w-3xl">
          <DialogHeader className="border-b bg-gradient-to-r from-muted/60 to-amber-500/[0.04] px-6 py-4">
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between">
              <DialogTitle className="text-base leading-snug sm:pr-2">{detalhe?.titulo ?? 'Carregando...'}</DialogTitle>
              {detalhe && (
                <div className="flex shrink-0 gap-1.5 sm:pt-0.5">
                  {detalhe.conteudo.includes('{{') && (
                    <Button size="sm" className="h-7 gap-1.5 bg-amber-600 px-2.5 text-[11px] text-white hover:bg-amber-700" onClick={() => setMinutaAberta(true)} aria-label="Preencher minuta com variáveis do caso">
                      <FileSignature className="size-3" /> <span className="hidden sm:inline">preencher</span> minuta
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="h-7 gap-1.5 px-2.5 text-[11px]" onClick={() => toggleFav(detalhe.slug)} aria-label={ehFavorito(detalhe.slug) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'} aria-pressed={ehFavorito(detalhe.slug)}>
                    <Star className={`size-3 ${ehFavorito(detalhe.slug) ? 'fill-amber-500 text-amber-500' : ''}`} />
                    <span className="hidden sm:inline">{ehFavorito(detalhe.slug) ? 'favorito' : 'favoritar'}</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 gap-1.5 px-2.5 text-[11px]" onClick={() => exportarMd(detalhe)} aria-label="Exportar documento como Markdown">
                    <Download className="size-3" /> .md
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 gap-1.5 px-2.5 text-[11px]" onClick={() => copiarCitacao(detalhe)} aria-label="Copiar citação ABNT">
                    <Quote className="size-3" /> citar
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 gap-1.5 px-2.5 text-[11px]" onClick={() => copiarYaml(detalhe)} aria-label="Copiar metadados YAML">
                    {copiado ? <Check className="size-3 text-emerald-600" /> : <FileText className="size-3" />} {copiado ? 'copiado' : 'YAML'}
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 gap-1.5 px-2.5 text-[11px]" onClick={() => imprimirDoc(detalhe)} aria-label="Imprimir documento ou salvar como PDF">
                    <Printer className="size-3" /> <span className="hidden sm:inline">imprimir</span>
                  </Button>
                </div>
              )}
            </div>
            <DialogDescription asChild>
              <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                {detalhe && (
                  <>
                    <Badge variant="secondary" className="text-[10px]">{detalhe.tipoDocumento}</Badge>
                    <Badge variant="outline" className={`text-[10px] ${confBadge(detalhe.confiabilidade).cls}`}>{confBadge(detalhe.confiabilidade).label}</Badge>
                    {statusBadge(detalhe.status) && <Badge variant="outline" className={`text-[10px] ${statusBadge(detalhe.status)!.cls}`}>{statusBadge(detalhe.status)!.label}</Badge>}
                    <span className="text-[11px]">{detalhe.area}{detalhe.subarea ? ` · ${detalhe.subarea}` : ''}</span>
                    {detalhe.lote && <Badge variant="outline" className="font-mono text-[10px]">{detalhe.lote}</Badge>}
                    <Badge variant="outline" className="text-[10px] tabular-nums">v{detalhe.versao}</Badge>
                  </>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(85vh-100px)]">
            <div className="px-6 py-4">
              {carregandoDetalhe ? (
                <div className="space-y-3"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6" /><Skeleton className="h-4 w-4/6" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /></div>
              ) : detalhe ? (
                <div className="space-y-4">
                  {(detalhe.fonte || detalhe.dataConsulta || detalhe.dataUltimaVerificacao) && (
                    <div className="rounded-lg border bg-muted/30 p-3 text-xs">
                      <div className="grid gap-1 sm:grid-cols-2">
                        {detalhe.fonte && <p><span className="font-medium">Fonte:</span> {detalhe.fonte}</p>}
                        {detalhe.dataConsulta && <p><span className="font-medium">Consulta:</span> {detalhe.dataConsulta}</p>}
                        {detalhe.dataUltimaVerificacao && <p><span className="font-medium">Última verificação:</span> {detalhe.dataUltimaVerificacao}</p>}
                        {detalhe.proximaVerificacaoRecomendada && <p><span className="font-medium">Próxima verificação recomendada:</span> {detalhe.proximaVerificacaoRecomendada}</p>}
                        {detalhe.urlFonte && (
                          <p className="sm:col-span-2">
                            <a href={detalhe.urlFonte} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-amber-600 hover:underline"><ExternalLink className="size-3" /> {detalhe.urlFonte}</a>
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  <Markdown>{detalhe.conteudo}</Markdown>
                  {detalhe.metadados && Object.keys(detalhe.metadados).length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Metadados</p>
                        <pre className="overflow-x-auto rounded-lg border bg-muted/40 p-3 text-[11px] leading-relaxed">{JSON.stringify(detalhe.metadados, null, 2)}</pre>
                      </div>
                    </>
                  )}
                  {detalhe.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {detalhe.tags.map((t) => <Badge key={t} variant="outline" className="font-mono text-[10px]">{t}</Badge>)}
                    </div>
                  )}
                  {(detalhe.relacaoOrigem.length > 0 || detalhe.relacaoDestino.length > 0) && (
                    <>
                      <Separator />
                      <div>
                        <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground"><Link2 className="size-3" /> Grafo de conhecimento (relacionamentos)</p>
                        <div className="space-y-1.5">
                          {detalhe.relacaoOrigem.map((r) => (
                            <button key={r.id} onClick={() => abrirDoc(r.destino.slug)} className="flex w-full items-center gap-2 rounded-lg border p-2 text-left text-xs hover:border-amber-500/40">
                              <Badge variant="secondary" className="shrink-0 text-[9px]">{r.tipo}</Badge>
                              <span className="truncate">{r.destino.titulo}</span>
                            </button>
                          ))}
                          {detalhe.relacaoDestino.map((r) => (
                            <button key={r.id} onClick={() => abrirDoc(r.origem.slug)} className="flex w-full items-center gap-2 rounded-lg border p-2 text-left text-xs hover:border-amber-500/40">
                              <Badge variant="outline" className="shrink-0 text-[9px]">{r.tipo}</Badge>
                              <span className="truncate">{r.origem.titulo}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  {detalhe.chunks?.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground"><FileSearch className="size-3" /> Chunks indexados para RAG ({detalhe.chunks.length})</p>
                        <div className="space-y-2">
                          {detalhe.chunks.slice(0, 4).map((c) => (
                            <div key={c.id} className="rounded-lg border p-2.5">
                              <p className="text-[11px] font-medium text-muted-foreground">{c.contexto}</p>
                              <p className="mt-1 line-clamp-2 text-xs">{c.texto}</p>
                              <p className="mt-1 text-[10px] text-muted-foreground">{c.palavras} palavras</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <p className="py-6 text-center text-sm text-muted-foreground"><FileSearch className="mx-auto mb-2 size-6" /> Documento não encontrado.</p>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      {detalhe && (
        <MinutaFiller
          key={`${detalhe.slug}:${minutaAberta}`}
          aberto={minutaAberta}
          onOpenChange={setMinutaAberta}
          titulo={detalhe.titulo}
          conteudo={detalhe.conteudo}
        />
      )}
      {imprimindo && detalhe && (
        <div id="ejc-print" aria-hidden="true">
          <h1>{detalhe.titulo}</h1>
          <p className="meta">
            {detalhe.tipoDocumento} · {detalhe.area}{detalhe.subarea ? ` · ${detalhe.subarea}` : ''} · confiança {detalhe.confiabilidade} · {detalhe.lote ?? ''} · consulta {detalhe.dataConsulta ?? ''} · EJC — Ecossistema Jurídico Clovis
          </p>
          {detalhe.fonte && <p className="meta">Fonte: {detalhe.fonte}{detalhe.urlFonte ? ` — ${detalhe.urlFonte}` : ''}</p>}
          <hr />
          <Markdown>{detalhe.conteudo}</Markdown>
        </div>
      )}
      {toast && null}
    </div>
  );
}
