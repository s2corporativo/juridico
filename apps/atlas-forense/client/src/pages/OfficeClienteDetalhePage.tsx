import { useState } from "react";
import { useParams } from "wouter";
import { toast } from "sonner";
import { Briefcase, Landmark, NotebookPen, UserRound } from "lucide-react";
import { cnjValido, formatarCnj } from "@shared/office-module";
import { trpc } from "@/lib/trpc";

export default function OfficeClienteDetalhePage() {
  const params = useParams();
  const clientId = Number(params.id);
  const utils = trpc.useUtils();
  const cliente = trpc.office.clients.get.useQuery({ id: clientId }, { enabled: Number.isFinite(clientId) && clientId > 0 });
  const materias = trpc.office.matters.list.useQuery({ clientId });
  const atendimentos = trpc.office.attendances.list.useQuery({ clientId });

  const [materia, setMateria] = useState({ title: "", cnjNumber: "", area: "", note: "" });
  const criarMateria = trpc.office.matters.create.useMutation({
    onSuccess: () => {
      toast.success("Matéria registrada");
      void utils.office.matters.list.invalidate();
      setMateria({ title: "", cnjNumber: "", area: "", note: "" });
    },
    onError: err => toast.error(err.message),
  });

  const [atendimento, setAtendimento] = useState({ summary: "", channel: "presencial" });
  const criarAtendimento = trpc.office.attendances.create.useMutation({
    onSuccess: () => {
      toast.success("Atendimento registrado");
      void utils.office.attendances.list.invalidate();
      setAtendimento({ summary: "", channel: "presencial" });
    },
    onError: err => toast.error(err.message),
  });

  function validarCnjOuCru(valor: string): string | null {
    const limpo = valor.trim();
    if (!limpo) return null;
    if (cnjValido(limpo)) return formatarCnj(limpo);
    throw new Error("Número CNJ inválido: o dígito verificador não confere (Resolução 65/2008).");
  }

  if (cliente.isLoading) {
    return <main className="office-page"><p className="office-empty">Carregando dossiê…</p></main>;
  }
  if (!cliente.data) {
    return <main className="office-page"><p className="office-empty">Cliente não encontrado.</p></main>;
  }

  return (
    <main className="office-page">
      <header className="office-topbar">
        <div className="office-topbar-brand">
          <UserRound size={20} />
          <div>
            <h1>{cliente.data.name}</h1>
            <p>Dossiê do cliente · {cliente.data.document ?? "sem documento"}</p>
          </div>
        </div>
        <nav className="office-nav">
          <a href="/escritorio/clientes" className="active">Clientes</a>
          <a href="/escritorio/comunicacoes">Comunicações</a>
          <a href="/escritorio/jurisprudencia">Jurisprudência</a>
          <a href="/">Atlas Forense</a>
        </nav>
      </header>

      <section className="office-grid">
        <article className="office-panel">
          <h2><Briefcase size={16} /> Matérias ({materias.data?.length ?? 0})</h2>
          <div className="office-form-grid">
            <label className="office-field office-field-wide">
              <span>Título da matéria/caso</span>
              <input value={materia.title} onChange={e => setMateria(f => ({ ...f, title: e.target.value }))} placeholder="Ação de indenização por acidente" />
            </label>
            <label className="office-field">
              <span>Processo (CNJ)</span>
              <input value={materia.cnjNumber} onChange={e => setMateria(f => ({ ...f, cnjNumber: e.target.value }))} placeholder="0001234-77.2015.8.13.0026" />
            </label>
            <label className="office-field">
              <span>Área</span>
              <input value={materia.area} onChange={e => setMateria(f => ({ ...f, area: e.target.value }))} placeholder="Cível / Consumidor" />
            </label>
          </div>
          <div className="office-actions">
            <button
              className="office-button office-button-primary"
              disabled={materia.title.trim().length < 2 || criarMateria.isPending}
              onClick={() => {
                try {
                  criarMateria.mutate({
                    clientId,
                    title: materia.title,
                    cnjNumber: validarCnjOuCru(materia.cnjNumber) ?? undefined,
                    area: materia.area || undefined,
                  });
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Erro");
                }
              }}
            >
              Registrar matéria
            </button>
          </div>
          <div className="office-matter-list">
            {materias.data?.length === 0 && <p className="office-empty">Nenhuma matéria registrada.</p>}
            {materias.data?.map(m => (
              <div key={m.id} className="office-matter-item">
                <strong>{m.title}</strong>
                <span>{m.cnjNumber ?? "sem processo"} · {m.area ?? "área não informada"} · {m.status}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="office-panel">
          <h2><NotebookPen size={16} /> Atendimentos ({atendimentos.data?.length ?? 0})</h2>
          <div className="office-form-grid">
            <label className="office-field">
              <span>Canal</span>
              <select value={atendimento.channel} onChange={e => setAtendimento(f => ({ ...f, channel: e.target.value }))}>
                <option value="presencial">Presencial</option>
                <option value="telefone">Telefone</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="e-mail">E-mail</option>
              </select>
            </label>
            <label className="office-field office-field-wide">
              <span>Resumo</span>
              <textarea rows={2} value={atendimento.summary} onChange={e => setAtendimento(f => ({ ...f, summary: e.target.value }))} placeholder="Cliente relatou…" />
            </label>
          </div>
          <div className="office-actions">
            <button className="office-button" disabled={atendimento.summary.trim().length < 3 || criarAtendimento.isPending} onClick={() => criarAtendimento.mutate({ clientId, channel: atendimento.channel, summary: atendimento.summary })}>
              Registrar atendimento
            </button>
          </div>
          <div className="office-matter-list">
            {atendimentos.data?.length === 0 && <p className="office-empty">Nenhum atendimento registrado.</p>}
            {atendimentos.data?.map(a => (
              <div key={a.id} className="office-matter-item">
                <strong>{a.channel}</strong>
                <span>{a.summary}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
