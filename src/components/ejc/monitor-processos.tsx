'use client';

// EJC — Painel "Processos monitorados" (guia de integrações, P1 DataJud).
// Cadastra/acompanha números CNJ em /api/ejc/monitor. LGPD: só número + tribunal
// + rótulo livre são armazenados (metadados públicos); movimentações vêm ao vivo.

import { useCallback, useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BellRing, Loader2, Plus, RefreshCw, Trash2 } from 'lucide-react';

interface ProcessoMonitor {
  id: string;
  numeroProcesso: string;
  tribunalAlias: string;
  rotulo: string | null;
  ativo: boolean;
  ultimaConsulta: string | null;
  ultimoResumo: string | null;
}

interface Movimento {
  nome: string;
  dataHora?: string;
}

const ROTULOS_TRIBUNAL: Record<string, string> = {
  TJMG: 'TJMG',
  TJSP: 'TJSP',
  TRT3: 'TRT-3',
  TRF1: 'TRF-1',
  STJ: 'STJ',
  STF: 'STF',
  TST: 'TST',
};

export function MonitorProcessos() {
  const [lista, setLista] = useState<ProcessoMonitor[]>([]);
  const [tribunais, setTribunais] = useState<Record<string, string>>({});
  const [numero, setNumero] = useState('');
  const [tribunal, setTribunal] = useState('TJMG');
  const [rotulo, setRotulo] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [adicionando, setAdicionando] = useState(false);
  const [sincronizando, setSincronizando] = useState<string | null>(null);
  const [movimentosDe, setMovimentosDe] = useState<{ processo: string; movimentos: Movimento[] } | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    try {
      const r = await fetch('/api/ejc/monitor');
      const d = await r.json();
      setLista(d.processos ?? []);
      setTribunais(d.tribunais ?? {});
    } catch {
      /* lista é opcional */
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const adicionar = async () => {
    setAdicionando(true);
    setErro(null);
    try {
      const r = await fetch('/api/ejc/monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acao: 'adicionar', numeroProcesso: numero, tribunalAlias: tribunais[tribunal] ?? tribunal, rotulo }),
      });
      const d = await r.json();
      if (!r.ok || d.error) {
        setErro(d.error ?? 'Falha ao adicionar.');
        return;
      }
      setNumero('');
      setRotulo('');
      await carregar();
    } finally {
      setAdicionando(false);
    }
  };

  const sincronizar = async (id: string) => {
    setSincronizando(id);
    setErro(null);
    try {
      const r = await fetch('/api/ejc/monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acao: 'sincronizar', id }),
      });
      const d = await r.json();
      if (!r.ok || d.error) {
        setErro(d.error ?? 'Falha na sincronização.');
        return;
      }
      setMovimentosDe({ processo: d.numeroProcesso, movimentos: d.movimentos ?? [] });
      await carregar();
    } finally {
      setSincronizando(null);
    }
  };

  const remover = async (id: string) => {
    await fetch(`/api/ejc/monitor?id=${id}`, { method: 'DELETE' });
    if (movimentosDe) setMovimentosDe(null);
    await carregar();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BellRing className="size-4 text-amber-600" /> Processos monitorados (DataJud/CNJ)
        </CardTitle>
        <CardDescription>
          Consulta ao vivo de movimentações por número CNJ. LGPD: armazenamos apenas número, tribunal e rótulo — nenhuma parte ou dado pessoal.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr_auto]">
          <div className="space-y-1">
            <Label htmlFor="mon-num" className="text-[11px]">Número CNJ (20 dígitos)</Label>
            <Input id="mon-num" value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="0000000-00.0000.0.00.0000" className="text-sm" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="mon-trib" className="text-[11px]">Tribunal</Label>
            <select
              id="mon-trib"
              value={tribunal}
              onChange={(e) => setTribunal(e.target.value)}
              className="h-9 rounded-md border bg-background px-2 text-sm"
            >
              {Object.entries(ROTULOS_TRIBUNAL).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="mon-rot" className="text-[11px]">Rótulo (sem dados pessoais)</Label>
            <Input id="mon-rot" value={rotulo} onChange={(e) => setRotulo(e.target.value)} placeholder="Ex.: Execução fiscal — acompanhamento" className="text-sm" />
          </div>
          <div className="flex items-end">
            <Button onClick={adicionar} disabled={adicionando || numero.replace(/\D/g, '').length !== 20} size="sm" className="gap-1.5">
              {adicionando ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />} Monitorar
            </Button>
          </div>
        </div>
        {erro && <p className="text-xs text-red-600 dark:text-red-400">{erro}</p>}

        {carregando ? (
          <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" /> carregando…</div>
        ) : lista.length === 0 ? (
          <p className="py-3 text-center text-xs text-muted-foreground">Nenhum processo monitorado ainda.</p>
        ) : (
          <div className="scrollbar-thin max-h-72 space-y-2 overflow-y-auto">
            {lista.map((p) => (
              <div key={p.id} className="rounded-lg border p-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-medium">{p.numeroProcesso.replace(/(\d{7})(\d{2})(\d{4})(\d)(\d{2})(\d{4})/, '$1-$2.$3.$4.$5.$6')}</span>
                  <Badge variant="outline" className="text-[10px]">{ROTULOS_TRIBUNAL[p.tribunalAlias] ?? p.tribunalAlias}</Badge>
                  {p.rotulo && <span className="min-w-0 flex-1 truncate text-[11px] text-muted-foreground" title={p.rotulo}>{p.rotulo}</span>}
                  <div className="ml-auto flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => sincronizar(p.id)} disabled={sincronizando === p.id} className="h-7 gap-1 px-2 text-[11px]">
                      {sincronizando === p.id ? <Loader2 className="size-3 animate-spin" /> : <RefreshCw className="size-3" />} sincronizar
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => remover(p.id)} className="h-7 px-2 text-[11px] text-muted-foreground hover:text-red-600">
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </div>
                {p.ultimoResumo && (
                  <p className={`mt-1 truncate text-[11px] ${p.ultimoResumo.startsWith('ERRO') ? 'text-amber-600' : 'text-muted-foreground'}`} title={p.ultimoResumo}>
                    {p.ultimoResumo.startsWith('ERRO') ? p.ultimoResumo : `Última movimentação: ${p.ultimoResumo}`}
                  </p>
                )}
                {p.ultimaConsulta && <p className="text-[10px] text-muted-foreground">consultado em {new Date(p.ultimaConsulta).toLocaleString('pt-BR')}</p>}
              </div>
            ))}
          </div>
        )}

        {movimentosDe && (
          <div className="scrollbar-thin max-h-48 overflow-y-auto rounded-lg border bg-muted/30 p-3">
            <p className="mb-1.5 text-[11px] font-medium">Movimentações de {movimentosDe.processo.replace(/(\d{7})(\d{2})(\d{4})(\d)(\d{2})(\d{4})/, '$1-$2.$3.$4.$5.$6')}</p>
            <div className="space-y-1">
              {movimentosDe.movimentos.map((m, i) => (
                <p key={i} className="text-[11px] text-muted-foreground">
                  <span className="font-mono text-foreground">{m.dataHora ? m.dataHora.slice(0, 10) : '—'}</span> · {m.nome}
                </p>
              ))}
              {movimentosDe.movimentos.length === 0 && <p className="text-[11px] text-muted-foreground">Sem movimentações retornadas pela fonte.</p>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
