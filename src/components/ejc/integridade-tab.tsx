'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Database,
  FileSearch,
  Fingerprint,
  Info,
  Loader2,
  RefreshCw,
  Scale,
  ScanSearch,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react';

// Espelha a estrutura de src/lib/ejc/auditoria.ts
type Severidade = 'OK' | 'INFO' | 'AVISO' | 'ERRO';

interface Achado {
  codigo: string;
  severidade: Severidade;
  titulo: string;
  detalhe: string;
  total: number;
  exemplos: string[];
}

interface SecaoAuditoria {
  nome: string;
  status: Severidade;
  achados: Achado[];
}

interface Auditoria {
  geradoEm: string;
  score: number;
  veredito: string;
  base: {
    documentos: number;
    chunks: number;
    relacionamentos: number;
    lotes: number;
    confiabilidade: Record<string, number>;
    status: Record<string, number>;
  };
  secoes: SecaoAuditoria[];
  emCache?: boolean;
}

const visualSeveridade: Record<Severidade, { cls: string; icon: typeof CheckCircle2; rotulo: string }> = {
  ERRO: { cls: 'border-red-500/40 bg-red-500/5 text-red-700 dark:text-red-400', icon: TriangleAlert, rotulo: 'Erro crítico' },
  AVISO: { cls: 'border-amber-500/40 bg-amber-500/5 text-amber-700 dark:text-amber-400', icon: AlertTriangle, rotulo: 'Atenção' },
  INFO: { cls: 'border-sky-500/40 bg-sky-500/5 text-sky-700 dark:text-sky-400', icon: Info, rotulo: 'Informativo' },
  OK: { cls: 'border-emerald-500/40 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400', icon: CheckCircle2, rotulo: 'Íntegro' },
};

const COR_SCORE = (s: number) => (s >= 95 ? 'text-emerald-600 dark:text-emerald-400' : s >= 80 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400');

const COBERTURA = [
  'Estrutura e rastreabilidade (slugs, chunks, grafo, JSON, lotes)',
  'Taxonomia do compêndio (áreas, subáreas, tags canônicas)',
  'CHECK 1-10 re-executados sobre a base persistida',
  'Varredura LGPD de 100% do conteúdo (CPF, e-mail, telefone, nº CNJ)',
  'Anti-invenção (URL oficial, honestidade literal "(VETADO)"/redações)',
  'Duplicidade semântica (mesma regra do CHECK 8)',
  'Saúde do RAG (últimas execuções do suíte e grafo)',
];

export function IntegridadeTab() {
  const [aud, setAud] = useState<Auditoria | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState(false);

  const carregar = useCallback(async (refresh = false) => {
    if (refresh) setAtualizando(true);
    else setCarregando(true);
    try {
      const r = await fetch(`/api/ejc/integridade${refresh ? '?refresh=1' : ''}`);
      const d = await r.json();
      if (d.error) setErro(true);
      else {
        setAud(d);
        setErro(false);
      }
    } catch {
      setErro(true);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  if (carregando) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground" role="status" aria-live="polite">
        <Loader2 className="size-6 animate-spin" aria-hidden />
        <p className="text-sm">Auditando a curadoria — varredura de {aud ? '' : '639'} documentos, chunks, grafo e conteúdo...</p>
      </div>
    );
  }

  if (erro || !aud) {
    return (
      <Alert variant="destructive" className="max-w-2xl">
        <TriangleAlert className="size-4" />
        <AlertTitle>Falha na auditoria</AlertTitle>
        <AlertDescription>
          Não foi possível executar a auditoria de integridade. Tente novamente com o botão abaixo.
          <Button variant="outline" size="sm" className="mt-3 gap-1.5" onClick={() => void carregar(true)}>
            <RefreshCw className="size-3.5" /> Re-executar
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const totalErros = aud.secoes.reduce((s, x) => s + x.achados.filter((a) => a.severidade === 'ERRO').reduce((y, a) => y + a.total, 0), 0);
  const totalAvisos = aud.secoes.reduce((s, x) => s + x.achados.filter((a) => a.severidade === 'AVISO').reduce((y, a) => y + a.total, 0), 0);

  return (
    <div className="space-y-5" aria-label="Painel de integridade da curadoria">
      {/* Banner de cobertura */}
      <Alert className="border-primary/30 bg-primary/5">
        <ScanSearch className="size-4 text-primary" aria-hidden />
        <AlertTitle className="text-sm font-semibold">Auditoria de integridade da curadoria</AlertTitle>
        <AlertDescription className="text-xs leading-relaxed text-muted-foreground">
          Re-executa sobre a base persistida o mesmo conjunto de regras aplicado na ingestão (CHECK 1-10) e varre 100% do conteúdo.
          A auditoria é somente leitura — nunca altera a base. Cobertura: {COBERTURA.join(' · ')}.
        </AlertDescription>
      </Alert>

      {/* Score + base */}
      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <Card className="elevacao-card h-full">
            <CardContent className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Score de integridade</p>
              <p className={`text-5xl font-bold tabular-nums ${COR_SCORE(aud.score)}`}>{aud.score}</p>
              <p className="text-xs text-muted-foreground">/ 100</p>
              <p className="mt-1 rounded-md border border-amber-500/40 bg-amber-500/5 px-2 py-1 text-[11px] font-medium leading-snug text-amber-700 dark:text-amber-400">{aud.veredito}</p>
              <div className="mt-2 flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => void carregar(true)} disabled={atualizando}>
                  {atualizando ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
                  Re-auditar
                </Button>
                {aud.emCache && (
                  <span className="text-[10px] text-muted-foreground" title="Auditoria em cache de 10 min — use Re-auditar para forçar">
                    em cache
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.05 }} className="lg:col-span-2">
          <Card className="elevacao-card h-full">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { rotulo: 'Documentos', valor: aud.base.documentos, icon: FileSearch },
                  { rotulo: 'Chunks RAG', valor: aud.base.chunks, icon: Database },
                  { rotulo: 'Relacionamentos', valor: aud.base.relacionamentos, icon: Scale },
                  { rotulo: 'Lotes', valor: aud.base.lotes, icon: Fingerprint },
                ].map((m) => (
                  <div key={m.rotulo} className="rounded-lg border bg-muted/30 p-3 text-center">
                    <m.icon className="mx-auto size-4 text-primary" aria-hidden />
                    <p className="mt-1 text-xl font-bold tabular-nums">{m.valor}</p>
                    <p className="text-[10px] text-muted-foreground">{m.rotulo}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Confiabilidade</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {['A', 'B', 'C'].map((c) => (
                      <Badge key={c} variant="outline" className={`text-[11px] ${c === 'A' ? 'border-emerald-500/40 text-emerald-700 dark:text-emerald-400' : c === 'B' ? 'border-amber-500/40 text-amber-700 dark:text-amber-400' : 'border-red-500/40 text-red-700 dark:text-red-400'}`}>
                        {c}: {aud.base.confiabilidade[c] ?? 0}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Status</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {Object.entries(aud.base.status).map(([s, n]) => (
                      <Badge key={s} variant="outline" className="text-[11px]">
                        {s === 'ATIVO' ? 'Ativo' : s === 'REVISAO_HUMANA' ? 'Revisão humana' : s === 'DEMONSTRACAO' ? 'Demonstração' : s}: {n}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground">
                {totalErros === 0 && totalAvisos === 0
                  ? 'Nenhuma ocorrência pendente.'
                  : `${totalErros} ocorrência(s) crítica(s) · ${totalAvisos} ponto(s) de atenção — detalhados abaixo.`}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Seções com achados */}
      <div className="space-y-3">
        {aud.secoes.map((secao, i) => {
          const vis = visualSeveridade[secao.status];
          return (
            <motion.div key={secao.nome} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, delay: Math.min(i * 0.04, 0.2) }}>
              <Collapsible defaultOpen={secao.status === 'ERRO' || secao.status === 'AVISO'}>
                <Card className={`elevacao-card overflow-hidden p-0 ${vis.cls}`}>
                  <CollapsibleTrigger className="flex w-full items-center gap-2.5 px-5 py-4 text-left transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.03]">
                    <vis.icon className="size-4 shrink-0" aria-hidden />
                    <span className="flex-1 text-sm font-semibold">{secao.nome}</span>
                    <Badge variant="outline" className="shrink-0 border-current/30 text-[10px]">
                      {vis.rotulo}
                    </Badge>
                    <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform [[data-state=open]>&]:rotate-180" aria-hidden />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t bg-background/60 px-5 py-4">
                      {secao.achados.length === 0 ? (
                        <p className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400">
                          <CheckCircle2 className="size-4" aria-hidden />
                          Nenhuma inconsistência encontrada nesta seção.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {secao.achados.map((a) => {
                            const va = visualSeveridade[a.severidade];
                            return (
                              <div key={a.codigo} className="rounded-lg border p-3">
                                <div className="flex flex-wrap items-center gap-2">
                                  <va.icon className={`size-3.5 shrink-0 ${a.severidade === 'ERRO' ? 'text-red-600 dark:text-red-400' : a.severidade === 'AVISO' ? 'text-amber-600 dark:text-amber-400' : 'text-sky-600 dark:text-sky-400'}`} aria-hidden />
                                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">{a.codigo}</code>
                                  <span className="text-xs font-semibold">{a.titulo}</span>
                                  <Badge variant="outline" className="ml-auto shrink-0 text-[10px]">
                                    {a.total}
                                  </Badge>
                                </div>
                                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{a.detalhe}</p>
                                {a.exemplos.length > 0 && (
                                  <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto pr-1" aria-label={`Exemplos de ${a.titulo}`}>
                                    {a.exemplos.map((ex) => (
                                      <li key={ex} className="truncate rounded bg-muted/50 px-2 py-1 font-mono text-[10.5px] text-muted-foreground">
                                        {ex}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </motion.div>
          );
        })}
      </div>

      <p className="text-center text-[11px] text-muted-foreground">
        Última auditoria: {new Date(aud.geradoEm).toLocaleString('pt-BR')} · Executada pela API <code className="rounded bg-muted px-1">/api/ejc/integridade</code> e reproduzível via{' '}
        <code className="rounded bg-muted px-1">bun scripts/ejc-audit-curadoria.ts</code>
      </p>
    </div>
  );
}
