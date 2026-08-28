import { ArrowUpRight, CalendarDays, FileCheck2, Gavel, Landmark, RefreshCw } from "lucide-react";
import { trpc } from "@/lib/trpc";

const kindLabel = {
  jurisprudence: "Jurisprudência",
  legislation: "Legislação",
  official_update: "Atualização institucional",
} as const;

function formatDate(value: Date | string | null) {
  if (!value) return "Data pública não informada";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(value));
}

export default function EditorialUpdatesPanel() {
  const updates = trpc.editorial.approved.useQuery();
  const entries = updates.data ?? [];

  return (
    <section className="editorial-updates-panel" id="atualizacoes" aria-labelledby="atualizacoes-title">
      <div className="editorial-updates-heading">
        <div>
          <span className="eyebrow">RADAR OFICIAL · REVISÃO HUMANA</span>
          <h2 id="atualizacoes-title">Atualizações relevantes, sem ruído editorial.</h2>
          <p>Metadados de fontes públicas são verificados diariamente e só aparecem aqui depois de revisão humana. A ausência de item não significa ausência de mudança normativa ou jurisprudencial.</p>
        </div>
        <div className="editorial-updates-status"><RefreshCw size={16} /><span>{updates.isFetching ? "Sincronizando…" : "Fila pública aprovada"}</span></div>
      </div>
      {updates.isError && <div className="editorial-empty"><Landmark size={18} /><span>A atualização editorial está temporariamente indisponível. Nenhum conteúdo novo foi publicado.</span></div>}
      {!updates.isError && entries.length === 0 && <div className="editorial-empty"><FileCheck2 size={18} /><span>Nenhum item foi aprovado para publicação. A fila permanece protegida por revisão humana.</span></div>}
      {!updates.isError && entries.length > 0 && <div className="editorial-update-grid">{entries.slice(0, 6).map(entry => <article className="editorial-update-card" key={entry.id}>
        <div className="editorial-update-meta"><span className="editorial-kind">{entry.kind === "jurisprudence" ? <Gavel size={14} /> : entry.kind === "legislation" ? <Landmark size={14} /> : <FileCheck2 size={14} />}{kindLabel[entry.kind]}</span><span>{formatDate(entry.publishedAt)}</span></div>
        <h3>{entry.title}</h3>
        <p>{entry.summary ?? "Metadado oficial aguardando descrição editorial."}</p>
        <a href={entry.canonicalUrl} target="_blank" rel="noreferrer">Abrir fonte oficial <ArrowUpRight size={14} /></a>
      </article>)}</div>}
      <div className="editorial-updates-foot"><CalendarDays size={15} /><span>Rotina prevista: 03:00 no horário de Brasília · itens novos não são publicados automaticamente.</span></div>
    </section>
  );
}
