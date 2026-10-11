import { trpc } from "@/lib/trpc";
import { CalendarDays, ArrowUpRight, BookOpenCheck, Database, ShieldCheck, CircleAlert } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";

const statusDescription = "Apenas candidatos com revisão editorial registrada são exibidos. A coleta automática não confirma a íntegra nem a aplicabilidade de decisões judiciais.";
export default function DailyUpdatesPage() {
  const updates = trpc.editorial.approved.useQuery(undefined, {
    staleTime: 5 * 60_000, refetchInterval: 15 * 60_000, retry: 1,
  });
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[230px_minmax(0,1fr)]">
        <SiteNav heading="Atlas Jurídico" />
        <main className="min-w-0 space-y-7">
          <header className="space-y-3 border-b border-border pb-6">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
              <CalendarDays size={16} /> Atlas · Atualizações jurídicas
            </p>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Atualizações jurídicas diárias</h1>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              Novas fontes jurídicas recebidas pelos coletores do Atlas, com origem e revisão identificáveis.
              A ausência de publicações aprovadas não significa que não houve decisões ou leis novas.
            </p>
          </header>
          <div className="grid gap-3 sm:grid-cols-3">
            <a href="/compendio" className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-sm font-medium hover:border-primary/50">
              <BookOpenCheck size={19} className="text-primary" /> Consultar acervo
            </a>
            <a href="/fontes" className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-sm font-medium hover:border-primary/50">
              <Database size={19} className="text-primary" /> Pesquisar fontes
            </a>
            <a href="/controle" className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-sm font-medium hover:border-primary/50">
              <ShieldCheck size={19} className="text-primary" /> Monitorar atualização
            </a>
          </div>
          <section aria-labelledby="updates-heading" className="space-y-4">
            <div>
              <h2 id="updates-heading" className="text-xl font-semibold">Atualizações com revisão editorial</h2>
              <p className="mt-1 text-xs text-muted-foreground">{statusDescription}</p>
            </div>
            {updates.isLoading ? <p className="text-sm text-muted-foreground">Consultando a fila editorial…</p>
              : updates.isError ? <div role="alert" className="flex gap-2 rounded-xl border border-destructive/30 p-4 text-sm text-destructive">
                <CircleAlert size={19} /> Não foi possível consultar as atualizações. Não presumir sincronização bem-sucedida.
              </div>
              : !updates.data?.length ? <div className="rounded-xl border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
                Ainda não existem atualizações aprovadas na fila editorial. Consulte Monitoramento para verificar o processamento diário.
              </div>
              : <div className="grid gap-3">
                {updates.data.map(item => (
                  <article className="rounded-xl border border-border bg-card p-5" key={item.id}>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="rounded-md bg-primary/10 px-2 py-1 text-primary">{item.kind === "jurisprudence" ? "Jurisprudência" : item.kind === "legislation" ? "Legislação" : "Atualização oficial"}</span>
                      <span>{item.sourceKey}</span>
                      <span>{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("pt-BR") : "Data de publicação não informada"}</span>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.summary || "Sem resumo disponível. Consulte a fonte oficial."}</p>
                    {item.canonicalUrl?.startsWith("https://") &&
                      <a className="mt-3 inline-flex items-center gap-2 text-sm text-primary underline-offset-2 hover:underline"
                        target="_blank" rel="noopener noreferrer" href={item.canonicalUrl}>
                        Conferir fonte original <ArrowUpRight size={15} />
                      </a>}
                    <p className="mt-2 text-xs text-muted-foreground">Registro editorial: {item.status} · A aprovação de metadados não equivale à verificação do inteiro teor.</p>
                  </article>
                ))}
              </div>}
          </section>
        </main>
      </div>
    </div>
  );
}
