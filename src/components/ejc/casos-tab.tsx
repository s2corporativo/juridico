'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Archive, ArchiveRestore, Briefcase, FileDown, FileText, Loader2, Lock, NotebookPen, Plus, Search, StickyNote, Trash2, Unlink, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { agendarAcao } from '@/lib/ejc/ui-actions';

// ---------------------------------------------------------------------------
// Casos privados (CaseWorkspace — item 25 da missão): workspace de casos do
// escritório, SEPARADO da base geral. Tudo fica APENAS no banco local
// (SQLite deste ambiente) — nenhum dado de caso sai para serviços externos.
// Documentos da base são VINCULADOS por referência (FK), nunca copiados.
// ---------------------------------------------------------------------------

interface CasoItem {
  id: string;
  nome: string;
  cliente: string | null;
  privado: boolean;
  status: string;
  updatedAt: string;
  _count?: { documentos: number; notas: number };
}

interface CasoDocItem {
  id: string;
  anotacao: string | null;
  createdAt: string;
  document: { slug: string; titulo: string; tipoDocumento: string; area: string; confiabilidade: string; status: string; urlFonte: string | null };
}

interface CasoNotaItem {
  id: string;
  texto: string;
  createdAt: string;
}

interface CasoDetalhe extends CasoItem {
  createdAt: string;
  documentos: CasoDocItem[];
  notas: CasoNotaItem[];
}

interface BuscaResult {
  documentId: string;
  slug: string;
  titulo: string;
  tipoDocumento: string;
  area: string;
  confiabilidade: string;
}

const dt = (iso: string) => new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

export function CasosTab({ onNavegar }: { onNavegar: (aba: string) => void }) {
  const [casos, setCasos] = useState<CasoItem[] | null>(null);
  const [selecionado, setSelecionado] = useState<CasoDetalhe | null>(null);
  const [carregandoDetalhe, setCarregandoDetalhe] = useState(false);
  const [novoAberto, setNovoAberto] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novoCliente, setNovoCliente] = useState('');
  const [confirmandoExcluir, setConfirmandoExcluir] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [editando, setEditando] = useState(false);
  const [editNome, setEditNome] = useState('');
  const [editCliente, setEditCliente] = useState('');
  const [busca, setBusca] = useState('');
  const [resultados, setResultados] = useState<BuscaResult[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [nota, setNota] = useState('');
  const timerBusca = useRef<ReturnType<typeof setTimeout> | null>(null);

  const carregarLista = useCallback(async () => {
    try {
      const r = await fetch('/api/ejc/casos');
      const d = await r.json();
      setCasos(d.casos ?? []);
      return d.casos as CasoItem[];
    } catch {
      toast({ title: 'Falha ao carregar casos', variant: 'destructive' });
      setCasos([]);
      return [];
    }
  }, []);

  const carregarDetalhe = useCallback(async (id: string) => {
    setCarregandoDetalhe(true);
    try {
      const r = await fetch(`/api/ejc/casos/${id}`);
      if (!r.ok) throw new Error();
      const d = await r.json();
      setSelecionado(d.caso);
    } catch {
      toast({ title: 'Falha ao carregar o caso', variant: 'destructive' });
    } finally {
      setCarregandoDetalhe(false);
    }
  }, []);

  useEffect(() => {
    carregarLista();
  }, [carregarLista]);

  // busca de documentos na base geral (debounce)
  useEffect(() => {
    if (timerBusca.current) clearTimeout(timerBusca.current);
    if (!selecionado || busca.trim().length < 2) {
      setResultados([]);
      return;
    }
    timerBusca.current = setTimeout(async () => {
      setBuscando(true);
      try {
        const r = await fetch(`/api/ejc/documents?q=${encodeURIComponent(busca.trim())}&pageSize=8`);
        const d = await r.json();
        setResultados((d.resultados ?? []) as BuscaResult[]);
      } catch {
        setResultados([]);
      } finally {
        setBuscando(false);
      }
    }, 350);
    return () => {
      if (timerBusca.current) clearTimeout(timerBusca.current);
    };
  }, [busca, selecionado]);

  const criarCaso = async () => {
    if (!novoNome.trim()) return;
    try {
      const r = await fetch('/api/ejc/casos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nome: novoNome, cliente: novoCliente }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? 'Erro');
      setNovoAberto(false);
      setNovoNome('');
      setNovoCliente('');
      toast({ title: 'Caso criado', description: 'Workspace privado pronto para uso.' });
      await carregarLista();
      await carregarDetalhe(d.caso.id);
    } catch (e) {
      toast({ title: 'Falha ao criar caso', description: e instanceof Error ? e.message : undefined, variant: 'destructive' });
    }
  };

  const atualizarCaso = async (data: Record<string, unknown>) => {
    if (!selecionado) return;
    try {
      const r = await fetch(`/api/ejc/casos/${selecionado.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!r.ok) throw new Error();
      await carregarDetalhe(selecionado.id);
      await carregarLista();
      toast({ title: 'Caso atualizado' });
    } catch {
      toast({ title: 'Falha ao atualizar caso', variant: 'destructive' });
    }
  };

  // Exporta relatório executivo .docx — gerado 100% localmente (LGPD); download direto.
  const exportarRelatorio = async () => {
    if (!selecionado) return;
    setExportando(true);
    try {
      const r = await fetch(`/api/ejc/casos/${selecionado.id}/relatorio`);
      if (!r.ok) throw new Error();
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-${selecionado.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'caso'}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast({ title: 'Relatório gerado', description: 'Arquivo .docx salvo localmente — nenhum dado saiu do servidor.' });
    } catch {
      toast({ title: 'Falha ao gerar relatório', variant: 'destructive' });
    } finally {
      setExportando(false);
    }
  };

  const excluirCaso = async () => {
    if (!selecionado) return;
    try {
      await fetch(`/api/ejc/casos/${selecionado.id}`, { method: 'DELETE' });
      toast({ title: 'Caso excluído', description: 'Os documentos da base geral continuam intactos.' });
      setSelecionado(null);
      setConfirmandoExcluir(false);
      await carregarLista();
    } catch {
      toast({ title: 'Falha ao excluir caso', variant: 'destructive' });
    }
  };

  const adicionarDocumento = async (res: BuscaResult) => {
    if (!selecionado) return;
    try {
      const r = await fetch(`/api/ejc/casos/${selecionado.id}/itens`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tipo: 'documento', documentId: res.documentId }) });
      if (!r.ok) throw new Error();
      toast({ title: 'Documento vinculado', description: res.titulo.slice(0, 80) });
      setBusca('');
      setResultados([]);
      await carregarDetalhe(selecionado.id);
      await carregarLista();
    } catch {
      toast({ title: 'Falha ao vincular documento', variant: 'destructive' });
    }
  };

  const removerItem = async (params: string) => {
    if (!selecionado) return;
    try {
      await fetch(`/api/ejc/casos/${selecionado.id}/itens?${params}`, { method: 'DELETE' });
      await carregarDetalhe(selecionado.id);
      await carregarLista();
    } catch {
      toast({ title: 'Falha ao remover item', variant: 'destructive' });
    }
  };

  const adicionarNota = async () => {
    if (!selecionado || !nota.trim()) return;
    try {
      await fetch(`/api/ejc/casos/${selecionado.id}/itens`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tipo: 'nota', texto: nota }) });
      setNota('');
      await carregarDetalhe(selecionado.id);
      await carregarLista();
    } catch {
      toast({ title: 'Falha ao adicionar nota', variant: 'destructive' });
    }
  };

  const abrirNaBase = (slug: string) => {
    agendarAcao('abrirDoc', slug);
    onNavegar('base');
  };

  return (
    <div className="space-y-4">
      {/* Aviso de confidencialidade (LGPD / item 25) */}
      <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
        <Lock className="mt-0.5 size-4 shrink-0" />
        <p>
          <strong>Workspace privado do escritório:</strong> os casos ficam <strong>apenas no banco local</strong> deste ambiente — nenhum dado de caso é enviado a serviços externos. Os documentos da base geral são <strong>vinculados por referência</strong> (o conteúdo não é copiado), mantendo a segregação biblioteca pública × casos privados.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        {/* Coluna esquerda — lista de casos */}
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between gap-2 text-base">
              <span className="flex items-center gap-2"><Briefcase className="size-4 text-emerald-600" /> Casos</span>
              {casos && <Badge variant="secondary" className="tabular-nums">{casos.length}</Badge>}
            </CardTitle>
            <CardDescription>Workspaces privados de acompanhamento.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button onClick={() => setNovoAberto(true)} className="w-full gap-2 bg-emerald-600 text-white shadow-sm hover:bg-emerald-700">
              <Plus className="size-4" /> Novo caso
            </Button>
            {!casos && <p className="py-4 text-center text-xs text-muted-foreground">Carregando…</p>}
            {casos?.length === 0 && (
              <p className="py-4 text-center text-xs text-muted-foreground">Nenhum caso ainda. Crie o primeiro workspace.</p>
            )}
            <div className="scrollbar-thin max-h-[420px] space-y-1.5 overflow-y-auto">
              {casos?.map((c) => (
                <button
                  key={c.id}
                  onClick={() => carregarDetalhe(c.id)}
                  className={`w-full rounded-lg border p-2.5 text-left transition-all hover:border-emerald-500/40 hover:bg-emerald-500/5 ${selecionado?.id === c.id ? 'border-emerald-500/60 bg-emerald-500/10' : ''} ${c.status === 'ARQUIVADO' ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">{c.nome}</span>
                    {c.status === 'ARQUIVADO' && <Archive className="size-3.5 shrink-0 text-muted-foreground" />}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                    {c.cliente && <span className="max-w-full truncate">{c.cliente}</span>}
                    <span className="flex items-center gap-1"><FileText className="size-3" />{c._count?.documentos ?? 0}</span>
                    <span className="flex items-center gap-1"><StickyNote className="size-3" />{c._count?.notas ?? 0}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Coluna direita — detalhe do caso */}
        {!selecionado ? (
          <Card className="flex min-h-[320px] items-center justify-center">
            <CardContent className="py-16 text-center">
              <Briefcase className="mx-auto mb-3 size-10 text-muted-foreground/40" />
              <p className="text-sm font-medium">Selecione um caso à esquerda</p>
              <p className="mt-1 text-xs text-muted-foreground">ou crie um novo workspace privado para organizar documentos, anotações e acompanhamento.</p>
            </CardContent>
          </Card>
        ) : carregandoDetalhe ? (
          <Card className="flex min-h-[320px] items-center justify-center"><p className="text-sm text-muted-foreground">Carregando caso…</p></Card>
        ) : (
          <div className="min-w-0 space-y-4">
            {/* Cabeçalho do caso */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle className="flex flex-wrap items-center gap-2 text-lg">
                      <span className="min-w-0 break-words">{selecionado.nome}</span>
                      <Badge variant="outline" className="gap-1 text-[10px]"><Lock className="size-3" /> Privado</Badge>
                      <Badge variant={selecionado.status === 'ATIVO' ? 'default' : 'secondary'} className={`text-[10px] ${selecionado.status === 'ATIVO' ? 'bg-emerald-600' : ''}`}>{selecionado.status}</Badge>
                    </CardTitle>
                    {selecionado.cliente && <CardDescription className="mt-1">Cliente: {selecionado.cliente}</CardDescription>}
                    <p className="mt-1 text-[11px] text-muted-foreground">Criado em {dt(selecionado.createdAt)}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={exportarRelatorio} disabled={exportando} title="Gera relatório executivo .docx localmente (LGPD)">
                      {exportando ? <Loader2 className="size-3.5 animate-spin" /> : <FileDown className="size-3.5" />} Relatório
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => { setEditNome(selecionado.nome); setEditCliente(selecionado.cliente ?? ''); setEditando(true); }}>
                      <NotebookPen className="size-3.5" /> Editar
                    </Button>
                    {selecionado.status === 'ATIVO' ? (
                      <Button size="sm" variant="outline" className="gap-1.5" onClick={() => atualizarCaso({ status: 'ARQUIVADO' })}>
                        <Archive className="size-3.5" /> Arquivar
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="gap-1.5" onClick={() => atualizarCaso({ status: 'ATIVO' })}>
                        <ArchiveRestore className="size-3.5" /> Reativar
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="gap-1.5 border-red-500/40 text-red-600 hover:bg-red-500/10 dark:text-red-400" onClick={() => setConfirmandoExcluir(true)}>
                      <Trash2 className="size-3.5" /> Excluir
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <div className="grid gap-4 xl:grid-cols-2">
              {/* Documentos vinculados */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between gap-2 text-base">
                    <span className="flex items-center gap-2"><FileText className="size-4 text-emerald-600" /> Documentos vinculados</span>
                    <Badge variant="secondary" className="tabular-nums">{selecionado.documentos.length}</Badge>
                  </CardTitle>
                  <CardDescription>Referências à base geral — o conteúdo permanece na biblioteca pública.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar na base geral para vincular…" className="pl-9" />
                    {buscando && <span className="absolute right-3 top-1/2 size-3.5 -translate-y-1/2 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />}
                  </div>
                  {resultados.length > 0 && (
                    <div className="scrollbar-thin max-h-44 space-y-1.5 overflow-y-auto rounded-lg border p-2">
                      {resultados.map((res) => (
                        <div key={res.documentId} className="flex items-center justify-between gap-2 rounded-md px-1.5 py-1 hover:bg-muted/60">
                          <div className="min-w-0">
                            <p className="truncate text-xs font-medium">{res.titulo}</p>
                            <p className="text-[10px] text-muted-foreground">{res.tipoDocumento} · {res.area} · conf {res.confiabilidade}</p>
                          </div>
                          <Button size="sm" variant="ghost" className="size-7 shrink-0 p-0 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700" onClick={() => adicionarDocumento(res)} aria-label={`Vincular ${res.titulo}`}>
                            <Plus className="size-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  {selecionado.documentos.length === 0 ? (
                    <p className="py-6 text-center text-xs text-muted-foreground">Nenhum documento vinculado. Busque acima e clique em + para vincular.</p>
                  ) : (
                    <ScrollArea className="scrollbar-thin max-h-72">
                      <div className="space-y-1.5 pr-2">
                        {selecionado.documentos.map((item) => (
                          <div key={item.id} className="group rounded-lg border p-2.5 transition-colors hover:border-emerald-500/40">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-xs font-medium leading-snug">{item.document.titulo}</p>
                                <div className="mt-1 flex flex-wrap items-center gap-1">
                                  <Badge variant="outline" className="text-[9px] font-normal">{item.document.tipoDocumento}</Badge>
                                  <Badge variant="outline" className="text-[9px] font-normal">{item.document.area}</Badge>
                                  <Badge variant="outline" className={`text-[9px] font-normal ${item.document.confiabilidade === 'A' ? 'border-emerald-500/40 text-emerald-700 dark:text-emerald-400' : ''}`}>conf {item.document.confiabilidade}</Badge>
                                  {item.document.status !== 'ATIVO' && <Badge variant="outline" className="text-[9px] font-normal text-amber-600">{item.document.status}</Badge>}
                                </div>
                                {item.anotacao && <p className="mt-1.5 border-l-2 border-amber-500/50 pl-2 text-[11px] italic text-muted-foreground">{item.anotacao}</p>}
                              </div>
                              <div className="flex shrink-0 flex-col gap-1">
                                <Button size="sm" variant="ghost" className="size-7 p-0 text-emerald-600 hover:bg-emerald-500/10" onClick={() => abrirNaBase(item.document.slug)} aria-label="Abrir na Base" title="Abrir na Base">
                                  <FileText className="size-3.5" />
                                </Button>
                                <Button size="sm" variant="ghost" className="size-7 p-0 text-muted-foreground hover:bg-red-500/10 hover:text-red-600" onClick={() => removerItem(`documento=${item.id}`)} aria-label="Desvincular" title="Desvincular">
                                  <Unlink className="size-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>

              {/* Notas */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between gap-2 text-base">
                    <span className="flex items-center gap-2"><StickyNote className="size-4 text-amber-500" /> Notas de acompanhamento</span>
                    <Badge variant="secondary" className="tabular-nums">{selecionado.notas.length}</Badge>
                  </CardTitle>
                  <CardDescription>Registro cronológico do andamento — fica no banco local.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Textarea value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Ex.: audiência de conciliação designada para 15/10; cliente notificado…" className="min-h-20 resize-y" />
                    <div className="flex justify-end">
                      <Button size="sm" onClick={adicionarNota} disabled={!nota.trim()} className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700">
                        <Plus className="size-3.5" /> Adicionar nota
                      </Button>
                    </div>
                  </div>
                  {selecionado.notas.length === 0 ? (
                    <p className="py-6 text-center text-xs text-muted-foreground">Nenhuma nota ainda.</p>
                  ) : (
                    <ScrollArea className="scrollbar-thin max-h-72">
                      <div className="space-y-2 pr-2">
                        {selecionado.notas.map((n) => (
                          <div key={n.id} className="flex items-start justify-between gap-2 rounded-lg border bg-muted/30 p-2.5">
                            <div className="min-w-0">
                              <p className="whitespace-pre-wrap break-words text-xs leading-relaxed">{n.texto}</p>
                              <p className="mt-1 text-[10px] text-muted-foreground">{dt(n.createdAt)}</p>
                            </div>
                            <Button size="sm" variant="ghost" className="size-6 shrink-0 p-0 text-muted-foreground hover:bg-red-500/10 hover:text-red-600" onClick={() => removerItem(`nota=${n.id}`)} aria-label="Remover nota">
                              <X className="size-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Dialog: novo caso */}
      <Dialog open={novoAberto} onOpenChange={setNovoAberto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Briefcase className="size-4 text-emerald-600" /> Novo caso privado</DialogTitle>
            <DialogDescription>Identificação interna do workspace. Fica apenas no banco local.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="caso-nome">Nome do caso *</Label>
              <Input id="caso-nome" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} placeholder="Ex.: Ação de cobrança — Contrato 2024/17" maxLength={200} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="caso-cliente">Cliente (opcional)</Label>
              <Input id="caso-cliente" value={novoCliente} onChange={(e) => setNovoCliente(e.target.value)} placeholder="Ex.: Transportadora XYZ Ltda." maxLength={200} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNovoAberto(false)}>Cancelar</Button>
            <Button onClick={criarCaso} disabled={!novoNome.trim()} className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"><Plus className="size-4" /> Criar caso</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: editar caso */}
      <Dialog open={editando} onOpenChange={setEditando}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar caso</DialogTitle>
            <DialogDescription>Ajuste a identificação interna do workspace.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-nome">Nome do caso *</Label>
              <Input id="edit-nome" value={editNome} onChange={(e) => setEditNome(e.target.value)} maxLength={200} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-cliente">Cliente (opcional)</Label>
              <Input id="edit-cliente" value={editCliente} onChange={(e) => setEditCliente(e.target.value)} maxLength={200} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditando(false)}>Cancelar</Button>
            <Button onClick={async () => { await atualizarCaso({ nome: editNome, cliente: editCliente }); setEditando(false); }} disabled={!editNome.trim()}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog: confirmar exclusão */}
      <AlertDialog open={confirmandoExcluir} onOpenChange={setConfirmandoExcluir}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir caso “{selecionado?.nome}”?</AlertDialogTitle>
            <AlertDialogDescription>
              O workspace, suas notas e vínculos serão removidos. Os documentos da base geral <strong>não são afetados</strong>. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700" onClick={excluirCaso}>Excluir definitivamente</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
