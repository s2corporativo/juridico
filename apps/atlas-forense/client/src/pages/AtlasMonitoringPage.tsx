import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { Activity, AlertTriangle, ShieldCheck, Clock, Database, ArrowUpRight } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";

function fmt(value: string | Date | null | undefined) {
  if (!value) return "Não registrado";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Data inválida" : date.toLocaleString("pt-BR");
}

export default function AtlasMonitoringPage() {
  const { user, loading } = useAuth();
  const admin = user?.role === "admin";
  const health = trpc.editorial.health.useQuery(undefined, {
    enabled: admin, staleTime: 60_000, refetchInterval: 120_000, retry: 1,
  });
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[230px_minmax(0,1fr)]">
        <SiteNav heading="Atlas Jurídico" />
        <main className="min-w-0 space-y-6">
          <header className="border-b border-border pb-6">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary"><Activity size={15} /> Integridade do acervo</p>
            <h1 className="mt-2 text-3xl font-semibold">Monitoramento de atualizações</h1>
            <p className="mt-2 text-sm text-muted-foreground">Status real das execuções diárias, cobertura e fila editorial. Falha, ausência de execução e processamento parcial nunca aparecem como sincronização concluída.</p>
          </header>
          {loading ? <p className="text-sm">Verificando permissão…</p> :
            !user ? <button className="rounded-xl border border-primary px-4 py-3 text-sm" onClick={() => startLogin()}>Entrar como administrador</button> :
            !admin ? <p role="alert" className="rounded-xl border p-4 text-sm"><ShieldCheck className="mr-2 inline" size={17} /> Monitoramento operacional restrito à curadoria autorizada.</p> :
            health.isLoading ? <p className="text-sm">Consultando execuções reais do Atlas…</p> :
            health.isError || !health.data ? <p role="alert" className="flex gap-2 rounded-xl border border-destructive/30 p-4 text-sm text-destructive"><AlertTriangle size={19} /> Não foi possível validar o ciclo editorial. Estado não homologado.</p> : (
              <>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border bg-card p-5">
                    <p className="text-xs text-muted-foreground">Execução diária nesta data</p>
                    <p className="mt-2 text-xl font-semibold">{health.data.dailyRunObservedToday ? "Registrada" : "Não registrada"}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{health.data.checkedForDate} · Brasília</p>
                  </div>
                  <div className="rounded-2xl border bg-card p-5">
                    <p className="text-xs text-muted-foreground">Estado da última execução</p>
                    <p className="mt-2 text-xl font-semibold">{health.data.lastDailyRun?.status ?? "Sem execução"}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Início: {fmt(health.data.lastDailyRun?.startedAt)}</p>
                  </div>
                  <div className="rounded-2xl border bg-card p-5">
                    <p className="text-xs text-muted-foreground">Revisão pendente</p>
                    <p className="mt-2 text-xl font-semibold">{health.data.queue.pending_review ?? 0}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Itens de metadados, não julgados validados</p>
                  </div>
                </div>
                <section className="space-y-3">
                  <h2 className="text-lg font-semibold">Últimas execuções diárias</h2>
                  {!health.data.history.length ? <p className="rounded-xl border border-dashed p-5 text-sm text-muted-foreground">Nenhuma execução diária agendada registrada. Não há comprovação de atualização automática regular.</p> :
                    <div className="space-y-2">
                      {health.data.history.map(run => (
                        <div key={run.runKey} className="flex flex-wrap justify-between gap-3 rounded-xl border bg-card p-4 text-sm">
                          <div>
                            <strong>{run.runKey}</strong>
                            <p className="mt-1 text-xs text-muted-foreground">Início {fmt(run.startedAt)} · fim {fmt(run.finishedAt)}</p>
                          </div>
                          <div className="text-right text-xs">
                            <span className="font-semibold">{run.status}</span>
                            <p className="mt-1 text-muted-foreground">{run.queuedCount} na fila · {run.failedCount} falhas · {run.discoveredCount} candidatos</p>
                          </div>
                        </div>
                      ))}
                    </div>}
                </section>
                <div className="flex flex-wrap gap-3">
                  <a href="/controle/fila-editorial" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                    <Database size={16} /> Revisar fila editorial <ArrowUpRight size={15} />
                  </a>
                  <a href="/fontes" className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm"><Clock size={16} /> Conferir fontes</a>
                </div>
                <p className="text-xs text-muted-foreground">{health.data.note}</p>
              </>
            )}
        </main>
      </div>
    </div>
  );
}
