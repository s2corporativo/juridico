'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExternalLink, Gavel, Loader2, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface RegistroDataJud {
  numeroProcesso: string | null;
  tribunal: string | null;
  atualizadoEm: string | null;
  classe: string | null;
  orgaoJulgador: string | null;
  assuntos: string[];
  movimentos: Array<{ data: string | null; nome: string | null }>;
}

const TRIBUNAIS = [
  { id: 'tjmg', nome: 'TJMG — Minas Gerais' },
  { id: 'trt3', nome: 'TRT-3 — Minas Gerais' },
  { id: 'trf6', nome: 'TRF-6 — Minas Gerais' },
  { id: 'tjsp', nome: 'TJSP — São Paulo' },
  { id: 'tjrj', nome: 'TJRJ — Rio de Janeiro' },
  { id: 'tjdft', nome: 'TJDFT — Distrito Federal' },
  { id: 'tjba', nome: 'TJBA — Bahia' },
  { id: 'tjrs', nome: 'TJRS — Rio Grande do Sul' },
  { id: 'tjpr', nome: 'TJPR — Paraná' },
  { id: 'tjsc', nome: 'TJSC — Santa Catarina' },
];

const formatarCNJ = (num: string) => {
  const n = num.replace(/[^0-9]/g, '');
  if (n.length !== 20) return num;
  return `${n.slice(0, 7)}-${n.slice(7, 9)}.${n.slice(9, 13)}.${n.slice(13, 14)}.${n.slice(14, 16)}.${n.slice(16, 20)}`;
};

// Consulta processual pública via API DataJud/CNJ (metadados públicos; sem injeção na base).
export function DataJudChecker() {
  const [numero, setNumero] = useState('');
  const [tribunal, setTribunal] = useState('tjmg');
  const [carregando, setCarregando] = useState(false);
  const [registro, setRegistro] = useState<RegistroDataJud | null>(null);
  const [naoEncontrado, setNaoEncontrado] = useState<string | null>(null);

  const consultar = async () => {
    setCarregando(true);
    setRegistro(null);
    setNaoEncontrado(null);
    try {
      const r = await fetch('/api/ejc/datajud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numero, tribunal }),
      });
      const d = await r.json();
      if (!r.ok) {
        if (r.status === 400) {
          toast({ title: 'Número inválido', description: d.error, variant: 'destructive' });
        } else {
          toast({ title: 'Consulta indisponível', description: d.error, variant: 'destructive' });
        }
        return;
      }
      if (d.encontrado && d.registro) setRegistro(d.registro);
      else setNaoEncontrado(d.mensagem ?? 'Processo não encontrado.');
    } catch {
      toast({ title: 'Falha de rede na consulta DataJud', variant: 'destructive' });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Card className="elevacao-card rounded-xl">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2 text-base">
          <Gavel className="size-4 text-primary" aria-hidden />
          Consulta Processual Pública — DataJud/CNJ
          <Badge variant="outline" className="text-[9px] border-sky-500/40 text-sky-700 dark:text-sky-400">
            APIs públicas · MG em destaque
          </Badge>
        </CardTitle>
        <CardDescription>
          Metadados públicos do processo (classe, órgão, assuntos, movimentos) direto da API oficial do CNJ. Sem injeção na base de conhecimento — a consulta é leitura, nunca escrita.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px_auto]">
          <div className="space-y-1.5">
            <Label htmlFor="dj-numero">Número do processo (padrão CNJ)</Label>
            <Input
              id="dj-numero"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              placeholder="0000000-00.0000.8.13.0000"
              inputMode="numeric"
              className="font-mono"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dj-tribunal">Tribunal (índice DataJud)</Label>
            <select
              id="dj-tribunal"
              value={tribunal}
              onChange={(e) => setTribunal(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {TRIBUNAIS.map((t) => (
                <option key={t.id} value={t.id}>{t.nome}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button onClick={consultar} disabled={carregando || numero.replace(/[^0-9]/g, '').length < 15} className="gap-1.5">
              {carregando ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Search className="size-4" aria-hidden />}
              Consultar
            </Button>
          </div>
        </div>

        {registro && (
          <div className="space-y-3 rounded-lg border bg-accent/20 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="font-mono text-[10px]">{formatarCNJ(registro.numeroProcesso ?? '')}</Badge>
              <Badge variant="outline" className="text-[10px] border-primary/40 text-primary">{registro.tribunal}</Badge>
              {registro.classe && <span className="text-xs font-medium">{registro.classe}</span>}
              {registro.orgaoJulgador && <span className="text-[11px] text-muted-foreground">· {registro.orgaoJulgador}</span>}
            </div>
            {registro.assuntos.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {registro.assuntos.map((a) => (
                  <Badge key={a} variant="secondary" className="text-[10px]">{a}</Badge>
                ))}
              </div>
            )}
            {registro.movimentos.length > 0 && (
              <div className="scrollbar-thin max-h-52 space-y-1 overflow-y-auto pr-1">
                {[...registro.movimentos].reverse().map((m, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-md border px-2.5 py-1.5 text-[11px]">
                    <span className="shrink-0 font-mono tabular-nums text-muted-foreground">
                      {m.data ? new Date(m.data).toLocaleDateString('pt-BR') : '—'}
                    </span>
                    <span className="min-w-0 flex-1">{m.nome ?? 'Movimento'}</span>
                  </div>
                ))}
              </div>
            )}
            <p className="text-[10px] text-muted-foreground">
              Fonte: Conselho Nacional de Justiça — DataJud. Atualizado em{' '}
              {registro.atualizadoEm ? new Date(registro.atualizadoEm).toLocaleString('pt-BR') : '—'}.{' '}
              <a href="https://datajud-wiki.cnj.jus.br/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 font-medium text-primary hover:underline">
                Portal oficial <ExternalLink className="size-2.5" aria-hidden />
              </a>
            </p>
          </div>
        )}
        {naoEncontrado && (
          <p className="rounded-lg border border-orange-500/30 bg-orange-500/5 px-3 py-2 text-xs text-orange-700 dark:text-orange-400">
            {naoEncontrado}
          </p>
        )}
        <p className="text-[10px] leading-relaxed text-muted-foreground">
          A chave pública do DataJud é gratuita (datajud-wiki.cnj.jus.br) e, sem ela configurada, o sistema não simula resultado — informa honestamente a indisponibilidade.
        </p>
      </CardContent>
    </Card>
  );
}
