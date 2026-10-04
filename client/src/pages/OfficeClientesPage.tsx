import { useState } from "react";
import { toast } from "sonner";
import { Landmark, Plus, Users } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function OfficeClientesPage() {
  const utils = trpc.useUtils();
  const clientes = trpc.office.clients.list.useQuery();
  const criar = trpc.office.clients.create.useMutation({
    onSuccess: () => {
      toast.success("Cliente cadastrado");
      void utils.office.clients.list.invalidate();
      setForm({ name: "", document: "", email: "", phone: "", note: "" });
    },
    onError: err => toast.error(err.message),
  });

  const [form, setForm] = useState({ name: "", document: "", email: "", phone: "", note: "" });

  return (
    <main className="office-page">
      <header className="office-topbar">
        <div className="office-topbar-brand">
          <Landmark size={20} />
          <div>
            <h1>Clientes do Escritório</h1>
            <p>Painel JEC BH e Betim · cadastro e dossiês</p>
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
          <h2><Plus size={16} /> Novo cliente</h2>
          <div className="office-form-grid">
            <label className="office-field office-field-wide">
              <span>Nome completo</span>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nome do cliente" />
            </label>
            <label className="office-field">
              <span>CPF/CNPJ</span>
              <input value={form.document} onChange={e => setForm(f => ({ ...f, document: e.target.value }))} placeholder="000.000.000-00" />
            </label>
            <label className="office-field">
              <span>Telefone</span>
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="(31) 9 9999-9999" />
            </label>
            <label className="office-field office-field-wide">
              <span>E-mail</span>
              <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" placeholder="cliente@exemplo.com" />
            </label>
            <label className="office-field office-field-wide">
              <span>Observações</span>
              <textarea rows={2} value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
            </label>
          </div>
          <div className="office-actions">
            <button className="office-button office-button-primary" onClick={() => criar.mutate({ name: form.name, document: form.document || undefined, email: form.email || undefined, phone: form.phone || undefined, note: form.note || undefined })} disabled={criar.isPending || form.name.trim().length < 2}>Cadastrar cliente</button>
          </div>
        </article>

        <article className="office-panel">
          <h2><Users size={16} /> Clientes cadastrados ({clientes.data?.length ?? 0})</h2>
          <div className="office-client-list">
            {clientes.data?.length === 0 && <p className="office-empty">Nenhum cliente cadastrado ainda.</p>}
            {clientes.data?.map(c => (
              <a key={c.id} href={`/escritorio/clientes/${c.id}`} className="office-client-item">
                <strong>{c.name}</strong>
                <span>{c.document ?? "sem documento"} · {c.email ?? "sem e-mail"}</span>
              </a>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
