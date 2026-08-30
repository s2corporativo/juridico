'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ShieldCheck, AlertTriangle, FlaskConical, Database, Layers, History, BrainCircuit, Wrench, Library, ChevronRight, BookOpen, Rss, CalendarClock, RefreshCcw } from 'lucide-react';
import type { StatsInfo } from './types';

// Cores por banco (sequência quente coerente com o tema — usada na barra empilhada)
const CORES_BANCO = [
  'bg-amber-500', 'bg-emerald-500', 'bg-orange-500', 'bg-rose-500', 'bg-teal-500',
  'bg-yellow-500', 'bg-lime-600', 'bg-fuchsia-500', 'bg-cyan-600', 'bg-red-500',
  'bg-indigo-400', 'bg-pink-500', 'bg-sky-500', 'bg-violet-500', 'bg-stone-500',
];

export function OverviewTab({ stats, onNavegar }: { stats: StatsInfo; onNavegar?: (aba: string) => void }) {
  const ultimoLote = stats.lotes[0];
  const bancosAtivos = stats.bancos.filter((b) => b.quantidade > 0);
  return (
    <div className="space-y-6">
      {/* Acesso rápido — domínios recentes e ferramentas */}
      {onNavegar && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { aba: 'consulta', titulo: 'Consulta Jurídica (IA)', desc: 'Pergunte à base: respostas com fontes rastreáveis e disclaimers', icon: BrainCircuit, grad: 'from-primary/15 to-primary/5 hover:from-primary/25', cor: 'text-primary' },
            { aba: 'compendio', titulo: 'Compêndio Jurídico', desc: 'Navegação enciclopédica por área, capítulo e documento', icon: BookOpen, grad: 'from-yellow-500/15 to-amber-500/5 hover:from-yellow-500/25', cor: 'text-amber-600' },
            { aba: 'ferramentas', titulo: 'Ferramentas operacionais', desc: 'Prazos, Alçada, Prescrição, Usucapião e DataJud/CNJ', icon: Wrench, grad: 'from-emerald-500/15 to-teal-500/5 hover:from-emerald-500/25', cor: 'text-emerald-600' },
            { aba: 'fontes', titulo: 'Fontes públicas (diário)', desc: 'APIs oficiais com link ao inteiro teor — sem injeção na base', icon: Rss, grad: 'from-orange-500/15 to-amber-500/5 hover:from-orange-500/25', cor: 'text-orange-600' },
          ].map((c) => (
            <button
              key={c.aba}
              onClick={() => onNavegar(c.aba)}
              className={`group rounded-xl border bg-gradient-to-br p-4 text-left transition-all hover:shadow-md ${c.grad}`}
            >
              <div className="flex items-center justify-between">
                <span className={`flex size-8 items-center justify-center rounded-lg bg-background/70 shadow-sm`}><c.icon className={`size-4 ${c.cor}`} aria-hidden /></span>
                <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
              </div>
              <p className="mt-2.5 text-sm font-semibold">{c.titulo}</p>
              <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{c.desc}</p>
            </button>
          ))}
        </div>
      )}

      {/* Indicadores principais */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="group relative overflow-hidden border-amber-500/25 transition-all hover:shadow-md">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-amber-500/60 to-transparent" />
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5"><span className="flex size-6 items-center justify-center rounded-md bg-amber-500/10"><Database className="size-3.5 text-amber-600" /></span> Documentos na base</CardDescription>
            <CardTitle className="text-3xl tabular-nums transition-colors group-hover:text-amber-700 dark:group-hover:text-amber-400">{stats.total}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">Distribuídos nos 15 bancos do EJC</CardContent>
        </Card>
        <Card className="group relative overflow-hidden border-amber-500/25 transition-all hover:shadow-md">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-amber-500/60 to-transparent" />
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5"><span className="flex size-6 items-center justify-center rounded-md bg-amber-500/10"><Layers className="size-3.5 text-amber-600" /></span> Chunks RAG</CardDescription>
            <CardTitle className="text-3xl tabular-nums transition-colors group-hover:text-amber-700 dark:group-hover:text-amber-400">{stats.chunks}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">Unidades semanticamente completas indexadas</CardContent>
        </Card>
        <Card className="group relative overflow-hidden transition-all hover:shadow-md">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-emerald-500/60 to-transparent" />
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5"><span className="flex size-6 items-center justify-center rounded-md bg-emerald-500/10"><ShieldCheck className="size-3.5 text-emerald-600" /></span> Fontes nível A</CardDescription>
            <CardTitle className="text-3xl tabular-nums transition-colors group-hover:text-emerald-700 dark:group-hover:text-emerald-400">{stats.confiabilidade.find((c) => c.nivel === 'A')?.quantidade ?? 0}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">Confirmadas em fonte oficial</CardContent>
        </Card>
        <Card className="group relative overflow-hidden transition-all hover:shadow-md">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-orange-500/60 to-transparent" />
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5"><span className="flex size-6 items-center justify-center rounded-md bg-orange-500/10"><AlertTriangle className="size-3.5 text-orange-600" /></span> Revisão humana</CardDescription>
            <CardTitle className="text-3xl tabular-nums transition-colors group-hover:text-orange-700 dark:group-hover:text-orange-400">{stats.status.find((s) => s.status === 'REVISAO_HUMANA')?.quantidade ?? 0}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">Registros REVISAO_HUMANA que exigem validação antes do uso</CardContent>
        </Card>
      </div>

      {/* Painel editorial — frescor documental (revisão devida >90 dias ou verificação vencida) */}
      {stats.frescor && (
        <Card className="elevacao-card rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex flex-wrap items-center gap-2 text-base">
              <CalendarClock className="size-4 text-primary" aria-hidden />
              Revisão documental (frescor)
              <Badge variant="outline" className="text-[10px] border-primary/40 text-primary">janela de 90 dias</Badge>
            </CardTitle>
            <CardDescription>
              Pipeline editorial: cada documento tem verificação registrada e data de próxima revisão — nada fica obsoleto silenciosamente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-[auto_minmax(0,1fr)]">
              <div className="flex gap-2">
                {[
                  { rotulo: 'Frescos', valor: stats.frescor.ok, cls: 'border-emerald-500/40 text-emerald-700 dark:text-emerald-400', icon: RefreshCcw },
                  { rotulo: 'Revisão devida', valor: stats.frescor.revisaoDevida, cls: 'border-orange-500/40 text-orange-700 dark:text-orange-400', icon: AlertTriangle },
                  { rotulo: 'Sem verificação', valor: stats.frescor.semVerificacao, cls: 'border-stone-400/40 text-muted-foreground', icon: History },
                ].map((k) => (
                  <div key={k.rotulo} className={`min-w-24 rounded-lg border px-3 py-2 ${k.cls}`}>
                    <p className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide"><k.icon className="size-3" aria-hidden />{k.rotulo}</p>
                    <p className="text-xl font-bold tabular-nums">{k.valor}</p>
                  </div>
                ))}
              </div>
              <div className="min-w-0">
                <p className="mb-1.5 text-[11px] font-medium text-muted-foreground">Mais vencidos (próxima verificação recomendada)</p>
                <div className="scrollbar-thin max-h-32 space-y-1 overflow-y-auto pr-1">
                  {stats.frescor.devidos.length === 0 && (
                    <p className="rounded-lg border border-emerald-500/25 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-400">
                      Toda a base verificada está dentro da janela de 90 dias.
                    </p>
                  )}
                  {stats.frescor.devidos.map((d) => (
                    <button
                      key={d.slug}
                      onClick={() => window.dispatchEvent(new CustomEvent('ejc:abrir-doc', { detail: { slug: d.slug } }))}
                      className="flex w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left text-[11px] transition-colors hover:border-primary/40 hover:bg-accent/30"
                    >
                      <span className="min-w-0 flex-1 truncate">{d.titulo}</span>
                      <Badge variant="outline" className="shrink-0 text-[9px] border-orange-500/40 text-orange-700 dark:text-orange-400">{d.diasAtraso}d</Badge>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sistema de confiança */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="size-4 text-emerald-600" /> Sistema de confiança e regra anti-invenção</CardTitle>
          <CardDescription>Nenhum conteúdo entra na base sem passar pelas validações CHECK 1–10. Registros não confirmados nunca recebem fonte falsa — recebem status de revisão humana.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            {stats.confiabilidade
              .slice()
              .sort((a, b) => a.nivel.localeCompare(b.nivel))
              .map((c) => (
                <div key={c.nivel} className={`rounded-lg border p-3 ${c.cor}`}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-semibold">{c.label}</span>
                    <span className="text-xl font-bold tabular-nums">{c.quantidade}</span>
                  </div>
                  <p className="mt-1 text-xs opacity-80">{c.descricao}</p>
                  <Progress value={(c.quantidade / Math.max(1, stats.total)) * 100} className="mt-2 h-1.5" />
                </div>
              ))}
          </div>
          <Separator className="my-4" />
          <div className="flex flex-wrap gap-1.5">
            {stats.checks.map((c) => (
              <Badge key={c} variant="outline" className="font-normal text-[11px]">{c}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* 15 bancos */}
        <Card className="min-w-0 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Database className="size-4 text-amber-600" /> Os 15 bancos de conhecimento</CardTitle>
            <CardDescription>Arquitetura completa implementada — lotes seguintes continuarão o abastecimento.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {/* Composição da base: barra empilhada por banco */}
            <div className="px-6 pb-1">
              <div
                className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted"
                role="img"
                aria-label={`Composição da base por banco: ${bancosAtivos.map((b) => `${b.nome} ${b.quantidade}`).join(', ')}`}
              >
                {bancosAtivos.map((b, i) => (
                  <div
                    key={b.banco}
                    className={`${CORES_BANCO[i % CORES_BANCO.length]} h-full transition-all`}
                    style={{ width: `${(b.quantidade / Math.max(1, stats.total)) * 100}%` }}
                    title={`${b.nome}: ${b.quantidade}`}
                  />
                ))}
              </div>
              <p className="mt-1.5 text-[10px] text-muted-foreground">
                <span className="font-medium text-foreground">{bancosAtivos.length} de 15 bancos</span> abastecidos · passe o cursor sobre a barra para ver cada banco
              </p>
            </div>
            <ScrollArea className="h-[352px] px-6 pb-4">
              <div className="space-y-2.5">
                {stats.bancos.map((b) => (
                  <div key={b.banco} className="flex items-center justify-between gap-3 rounded-lg border p-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{b.nome}</p>
                      <p className="truncate text-xs text-muted-foreground">{b.descricao}</p>
                    </div>
                    <Badge variant={b.quantidade > 0 ? 'default' : 'outline'} className="shrink-0 tabular-nums">{b.quantidade}</Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Lotes e áreas */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><FlaskConical className="size-4 text-amber-600" /> Lotes de produção</CardTitle>
              <CardDescription>Controle de abastecimento em lotes validados (item 26 da missão).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {ultimoLote ? (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-semibold">{ultimoLote.codigo}</span>
                    <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">{ultimoLote.status}</Badge>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{ultimoLote.descricao}</p>
                  <div className="mt-2 grid grid-cols-4 gap-2 text-center text-xs">
                    <div><p className="text-lg font-bold tabular-nums">{ultimoLote.pesquisado}</p><p className="text-muted-foreground">pesquisados</p></div>
                    <div><p className="text-lg font-bold tabular-nums">{ultimoLote.criados}</p><p className="text-muted-foreground">criados</p></div>
                    <div><p className="text-lg font-bold tabular-nums">{ultimoLote.atualizados}</p><p className="text-muted-foreground">atualizados</p></div>
                    <div><p className="text-lg font-bold tabular-nums">{ultimoLote.duplicatasEvitadas}</p><p className="text-muted-foreground">duplicatas</p></div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum lote registrado ainda.</p>
              )}
              <p className="text-xs text-muted-foreground">
                Fontes oficiais consultadas no lote: <span className="font-medium text-foreground">{ultimoLote?.relatorio?.fontesConsultadas?.length ?? 0}</span> (Planalto, STJ, STF, gov.br)
              </p>
              <Separator className="my-2" />
              {/* Linha do tempo de todos os lotes */}
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground"><History className="size-3" /> Histórico de abastecimento ({stats.lotes.length} lotes)</p>
                <div className="scrollbar-thin max-h-[150px] overflow-y-auto pr-1">
                  <div className="space-y-1.5">
                    {stats.lotes.map((l, i) => (
                      <div key={l.codigo} className="flex items-center gap-2.5 rounded-md border px-2.5 py-1.5 transition-colors hover:border-amber-500/30 hover:bg-amber-500/[0.03]">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-500/10 font-mono text-[10px] font-bold text-amber-700 dark:text-amber-400">{stats.lotes.length - i}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-mono text-xs font-semibold">{l.codigo}</p>
                          <p className="truncate text-[10px] text-muted-foreground">{l.descricao}</p>
                        </div>
                        <Badge variant="outline" className="shrink-0 text-[10px] tabular-nums">+{l.criados}n {l.atualizados > 0 ? `·${l.atualizados}a` : ''}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cobertura por área</CardTitle>
              <CardDescription>Áreas com conteúdo no LOTE-001 (P0) destacadas em primeiro lugar.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[210px] px-6 pb-4">
                <div className="space-y-1.5">
                  {stats.areas.slice().sort((a, b) => b.quantidade - a.quantidade).map((a) => (
                    <div key={a.id} className="group flex items-center gap-3">
                      <span className="w-44 shrink-0 truncate text-xs font-medium transition-colors group-hover:text-amber-700 dark:group-hover:text-amber-400">{a.nome}</span>
                      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all group-hover:from-amber-500 group-hover:to-amber-700"
                          style={{ width: `${(a.quantidade / Math.max(1, stats.total)) * 100}%` }}
                          title={`${a.nome}: ${a.quantidade} documentos`}
                        />
                      </div>
                      <span className="w-8 shrink-0 text-right text-xs tabular-nums text-muted-foreground">{a.quantidade}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
