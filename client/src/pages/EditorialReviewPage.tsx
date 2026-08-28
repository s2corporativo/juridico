import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { Check, ChevronDown, FileCheck2, Filter, KeyRound, Loader2, RotateCcw, ShieldCheck, X } from "lucide-react";
import { useState } from "react";

const statusLabels = { pending_review: "Pendente", approved: "Aprovado", rejected: "Rejeitado", superseded: "Substituído" } as const;
const kindLabels = { jurisprudence: "Julgado", legislation: "Legislação", official_update: "Atualização oficial" } as const;
type Decision = "approved" | "rejected" | "superseded";

export default function EditorialReviewPage() {
  const { user, loading } = useAuth();
  const isAdmin = user?.role === "admin";
  const [status, setStatus] = useState<keyof typeof statusLabels | "all">("pending_review");
  const [kind, setKind] = useState<keyof typeof kindLabels | "all">("all");
  const [notes, setNotes] = useState<Record<number, string>>({});
  const utils = trpc.useUtils();
  const queue = trpc.editorial.queue.useQuery({ status: status === "all" ? undefined : status, kind: kind === "all" ? undefined : kind }, { enabled: isAdmin });
  const decide = trpc.editorial.decide.useMutation({ onSuccess: () => { void utils.editorial.queue.invalidate(); } });

  const submitDecision = (id: number, decision: Decision) => {
    const reviewNote = notes[id]?.trim() ?? "";
    if (reviewNote.length < 3) return;
    decide.mutate({ id, decision, reviewNote });
  };

  if (loading) return <main className="min-h-screen bg-background p-8 text-foreground"><div className="mx-auto flex max-w-5xl items-center gap-3 rounded-2xl border border-border bg-card p-8"><Loader2 className="animate-spin" size={20} /> Verificando perfil administrativo…</div></main>;
  if (!user) return <main className="min-h-screen bg-background p-8 text-foreground"><div className="mx-auto max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-sm"><KeyRound className="mx-auto mb-4" size={28} /><h1 className="text-3xl font-semibold">Acesso administrativo</h1><p className="mt-3 text-muted-foreground">Entre para revisar itens editoriais sem abrir registros restritos.</p><button className="mt-6 rounded-xl bg-primary px-5 py-3 font-medium text-primary-foreground" onClick={() => startLogin()}>Entrar para revisar</button></div></main>;
  if (!isAdmin) return <main className="min-h-screen bg-background p-8 text-foreground"><div className="mx-auto max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-sm"><ShieldCheck className="mx-auto mb-4" size={28} /><h1 className="text-3xl font-semibold">Perfil sem permissão</h1><p className="mt-3 text-muted-foreground">A central editorial exige o papel admin. Nenhum registro de revisão é exibido para este perfil.</p></div></main>;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,hsl(var(--accent)/.18),transparent_38%),hsl(var(--background))] px-4 py-6 text-foreground sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-5 border-b border-border/80 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div><a href="/" className="text-sm font-medium text-primary hover:underline">← Voltar ao Atlas Forense</a><div className="mt-5 flex items-center gap-3 text-sm uppercase tracking-[.18em] text-muted-foreground"><FileCheck2 size={18} /> Curadoria editorial</div><h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Revisão rápida, <span className="text-primary">decisão rastreável.</span></h1><p className="mt-3 max-w-2xl text-muted-foreground">A fila reúne metadados oficiais candidatos. Aprovar, rejeitar ou substituir exige uma nota curta que será registrada na trilha de auditoria.</p></div>
          <div className="rounded-2xl border border-primary/20 bg-primary/10 px-5 py-4 text-sm"><strong className="block">Área protegida</strong><span className="text-muted-foreground">{user.name ?? "Administrador"} · papel admin</span></div>
        </header>

        <section className="mb-6 grid gap-3 rounded-3xl border border-border bg-card/90 p-4 shadow-sm sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:p-5">
          <label className="grid gap-2 text-sm font-medium"><span className="flex items-center gap-2 text-muted-foreground"><Filter size={15} /> Situação</span><select className="rounded-xl border border-border bg-background px-3 py-3" value={status} onChange={event => setStatus(event.target.value as typeof status)}><option value="pending_review">Pendentes</option><option value="approved">Aprovados</option><option value="rejected">Rejeitados</option><option value="superseded">Substituídos</option><option value="all">Todas</option></select></label>
          <label className="grid gap-2 text-sm font-medium"><span className="text-muted-foreground">Tipo de item</span><select className="rounded-xl border border-border bg-background px-3 py-3" value={kind} onChange={event => setKind(event.target.value as typeof kind)}><option value="all">Todos os tipos</option><option value="jurisprudence">Julgados</option><option value="legislation">Legislação</option><option value="official_update">Atualizações oficiais</option></select></label>
          <div className="rounded-xl bg-muted px-4 py-3 text-sm"><span className="block text-muted-foreground">Itens carregados</span><strong className="text-2xl">{queue.data?.length ?? "—"}</strong></div>
        </section>

        {queue.error && <div className="mb-5 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">Não foi possível carregar a fila. A sessão administrativa pode ter expirado.</div>}
        {queue.isLoading ? <div className="flex items-center gap-3 rounded-3xl border border-border bg-card p-8"><Loader2 className="animate-spin" size={20} /> Carregando fila editorial…</div> : queue.data?.length ? <div className="grid gap-4">{queue.data.map(item => { const note = notes[item.id] ?? ""; const pending = item.status === "pending_review"; return <article key={item.id} className="rounded-3xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"><div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between"><div className="min-w-0 flex-1"><div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[.14em]"><span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">{kindLabels[item.kind]}</span><span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">{statusLabels[item.status]}</span><span className="text-muted-foreground">{item.sourceKey}</span></div><h2 className="text-xl font-semibold leading-tight">{item.title}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{item.summary ?? "Sem resumo editorial. Revisar a fonte oficial antes de decidir."}</p><div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground"><span>Chave pública: <code>{item.externalKey}</code></span><span>Publicado: {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("pt-BR") : "não informado"}</span>{item.canonicalUrl && <a className="text-primary hover:underline" href={item.canonicalUrl} target="_blank" rel="noreferrer">Abrir fonte oficial ↗</a>}</div></div><div className="w-full shrink-0 xl:max-w-md">{pending ? <><label className="grid gap-2 text-sm font-medium"><span>Nota da decisão <span className="font-normal text-muted-foreground">(obrigatória)</span></span><textarea className="min-h-24 rounded-xl border border-border bg-background px-3 py-3 text-sm" value={note} onChange={event => setNotes(current => ({ ...current, [item.id]: event.target.value }))} placeholder="Ex.: URL oficial confirmada e metadados mínimos conferidos." /></label><div className="mt-3 grid grid-cols-3 gap-2"><button className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-700 px-3 py-3 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40" disabled={note.trim().length < 3 || decide.isPending} onClick={() => submitDecision(item.id, "approved")}><Check size={15} /> Aprovar</button><button className="inline-flex items-center justify-center gap-1 rounded-xl border border-border px-3 py-3 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40" disabled={note.trim().length < 3 || decide.isPending} onClick={() => submitDecision(item.id, "superseded")}><RotateCcw size={15} /> Substituir</button><button className="inline-flex items-center justify-center gap-1 rounded-xl bg-destructive px-3 py-3 text-xs font-semibold text-destructive-foreground disabled:cursor-not-allowed disabled:opacity-40" disabled={note.trim().length < 3 || decide.isPending} onClick={() => submitDecision(item.id, "rejected")}><X size={15} /> Rejeitar</button></div></> : <div className="rounded-2xl bg-muted p-4 text-sm"><strong>Decisão registrada</strong><p className="mt-1 text-muted-foreground">{item.reviewNote ?? "Sem nota pública."}</p></div>}</div></div></article>; })}</div> : <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center"><ChevronDown className="mx-auto mb-3 rotate-[-90deg] text-muted-foreground" size={22} /><h2 className="text-xl font-semibold">Nenhum item nesta visão</h2><p className="mt-2 text-sm text-muted-foreground">A fila está vazia ou os filtros não encontram registros correspondentes.</p></div>}
      </div>
    </main>
  );
}
