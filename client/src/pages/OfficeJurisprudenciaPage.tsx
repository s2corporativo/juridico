import { useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  BookMarked,
  CheckCircle2,
  Gavel,
  Landmark,
  Network,
  PenLine,
  RefreshCw,
} from "lucide-react";
import { trpc } from "@/lib/trpc";

const STATUS_LABEL: Record<string, string> = {
  nova: "Nova",
  destacada: "Destacada",
  aplicada: "Aplicada",
  descartada: "Descartada",
};

interface Diagnostico {
  provedor: string;
  status: "ok" | "falhou" | "ignorado";
  codigo?: string;
  novos?: number;
}

export default function OfficeJurisprudenciaPage() {
  const utils = trpc.useUtils();
  const settings = trpc.office.jurisprudencia.settings.useQuery();
  const acervo = trpc.office.jurisprudencia.list.useQuery();
  const materias = trpc.office.matters.list.useQuery();

  const [form, setForm] = useState({ query: "consumidor boa fe", lexmlEndpoint: "http://lexml.gov.br/busca/sru", maxItems: 5, enabled: true, autoSyncEnabled: true, intervalMinutes: 240 });
  const [inicializado, setInicializado] = useState(false);
  if (settings.data && !inicializado) {
    const s = settings.data;
    setForm({ query: s.query, lexmlEndpoint: s.lexmlEndpoint, maxItems: s.maxItems, enabled: s.enabled, autoSyncEnabled: s.autoSyncEnabled, intervalMinutes: s.intervalMinutes });
    setInicializado(true);
  }

  const salvar = trpc.office.jurisprudencia.updateSettings.useMutation({
    onSuccess: () => {
      toast.success("Configuração salva");
      void utils.office.jurisprudencia.settings.invalidate();
    },
    onError: err => toast.error(err.message),
  });

  const sincronizar = trpc.office.jurisprudencia.sync.useMutation({
    onSuccess: data => {
      setSyncResultado(data);
      void utils.office.jurisprudencia.list.invalidate();
      void utils.office.jurisprudencia.settings.invalidate();
      if (data.status === "failed") toast.error(data.message);
      else toast.success(data.message);
    },
    onError: err => toast.error(err.message),
  });
  const [syncResultado, setSyncResultado] = useState<{ status: string; message: string; diagnosticos: Diagnostico[] } | null>(null);

  const mudarStatus = trpc.office.jurisprudencia.updateStatus.useMutation({
    onSuccess: () => void utils.office.jurisprudencia.list.invalidate(),
    onError: err => toast.error(err.message),
  });
  const vincular = trpc.office.jurisprudencia.link.useMutation({
    onSuccess: () => {
      toast.success("Vínculo atualizado");
      void utils.office.jurisprudencia.list.invalidate();
    },
    onError: err => toast.error(err.message),
  });

  const [manual, setManual] = useState({ externalId: "", tribunal: "TJMG", orgao: "", cnjNumber: "", ementa: "", url: "", dataJulgamento: "" });
  const registrarManual = trpc.office.jurisprudencia.manual.useMutation({
    onSuccess: () => {
      toast.success("Julgado registrado no acervo");
      void utils.office.jurisprudencia.list.invalidate();
      setManual({ externalId: "", tribunal: "TJMG", orgao: "", cnjNumber: "", ementa: "", url: "", dataJulgamento: "" });
    },
    onError: err => toast.error(err.message),
  });

  return (
    <main className="office-page">
      <header className="office-topbar">
        <div className="office-topbar-brand">
          <Landmark size={20} />
          <div>
            <h1>Jurisprudência do Escritório</h1>
            <p>Fontes públicas sem credencial: STJ Dados Abertos + LexML SRU + registro manual TJMG</p>
          </div>
        </div>
        <nav className="office-nav">
          <a href="/escritorio/clientes">Clientes</a>
          <a href="/escritorio/comunicacoes">Comunicações</a>
          <a href="/escritorio/jurisprudencia" className="active">Jurisprudência</a>
          <a href="/">Atlas Forense</a>
        </nav>
      </header>

      <section className="office-grid">
        <article className="office-panel">
          <h2><Network size={16} /> Conector de jurisprudência</h2>
          <p className="office-panel-sub">Coleta determinística por consulta textual nos catálogos públicos; sem chave de API; falha graciosa por provedor com diagnóstico auditável.</p>
          <div className="office-form-grid">
            <label className="office-field office-field-wide">
              <span>Consulta (query)</span>
              <input value={form.query} onChange={e => setForm(f => ({ ...f, query: e.target.value }))} />
            </label>
            <label className="office-field">
              <span>Endpoint SRU do LexML</span>
              <input value={form.lexmlEndpoint} onChange={e => setForm(f => ({ ...f, lexmlEndpoint: e.target.value }))} />
            </label>
            <label className="office-field">
              <span>Máx. itens por provedor (1–20)</span>
              <input type="number" min={1} max={20} value={form.maxItems} onChange={e => setForm(f => ({ ...f, maxItems: Number(e.target.value) }))} />
            </label>
            <label className="office-field">
              <span>Ciclo automático (min)</span>
              <input type="number" min={30} max={1440} step={30} value={form.intervalMinutes} onChange={e => setForm(f => ({ ...f, intervalMinutes: Number(e.target.value) }))} />
            </label>
            <label className="office-check">
              <input type="checkbox" checked={form.enabled} onChange={e => setForm(f => ({ ...f, enabled: e.target.checked }))} />
              <span>Conector habilitado</span>
            </label>
            <label className="office-check">
              <input type="checkbox" checked={form.autoSyncEnabled} onChange={e => setForm(f => ({ ...f, autoSyncEnabled: e.target.checked }))} />
              <span>Sincronização automática</span>
            </label>
          </div>
          <div className="office-actions">
            <button className="office-button" onClick={() => salvar.mutate(form)} disabled={salvar.isPending}>Salvar configuração</button>
            <button className="office-button office-button-primary" onClick={() => sincronizar.mutate()} disabled={sincronizar.isPending}>
              <RefreshCw size={15} /> {sincronizar.isPending ? "Sincronizando…" : "Sincronizar agora"}
            </button>
          </div>
          {syncResultado && (
            <div className={`office-sync-state office-sync-${syncResultado.status}`}>
              <strong>{syncResultado.status === "success" && "Coleta concluída"}{syncResultado.status === "partial" && "Coleta parcial"}{syncResultado.status === "failed" && "Coleta falhou"}</strong>
              <span>{syncResultado.message}</span>
              {syncResultado.diagnosticos.map(d => (
                <small key={d.provedor}>
                  {d.status === "ok" ? <CheckCircle2 size={11} /> : <AlertTriangle size={11} />} {d.provedor}: {d.status === "ok" ? `ok (${d.novos} itens)` : d.codigo}
                </small>
              ))}
            </div>
          )}
          {settings.data?.lastSyncState && !syncResultado && (
            <div className={`office-sync-state office-sync-${settings.data.lastSyncStatus}`}>
              <span>Estado da última execução registrada: {settings.data.lastSyncState}</span>
            </div>
          )}
        </article>

        <article className="office-panel">
          <h2><PenLine size={16} /> Registro manual (TJMG auditável)</h2>
          <p className="office-panel-sub">Para julgados obtidos por consulta manual no TJMG; o número CNJ é validado pelo dígito verificador (Resolução 65/2008).</p>
          <div className="office-form-grid">
            <label className="office-field">
              <span>Identificador externo</span>
              <input value={manual.externalId} onChange={e => setManual(f => ({ ...f, externalId: e.target.value }))} placeholder="TJMG-2026-001" />
            </label>
            <label className="office-field">
              <span>Tribunal</span>
              <input value={manual.tribunal} onChange={e => setManual(f => ({ ...f, tribunal: e.target.value }))} />
            </label>
            <label className="office-field">
              <span>Órgão julgador</span>
              <input value={manual.orgao} onChange={e => setManual(f => ({ ...f, orgao: e.target.value }))} placeholder="3ª Câmara Cível" />
            </label>
            <label className="office-field">
              <span>Processo (CNJ, opcional)</span>
              <input value={manual.cnjNumber} onChange={e => setManual(f => ({ ...f, cnjNumber: e.target.value }))} placeholder="0001234-77.2015.8.13.0026" />
            </label>
            <label className="office-field">
              <span>Data do julgamento</span>
              <input value={manual.dataJulgamento} onChange={e => setManual(f => ({ ...f, dataJulgamento: e.target.value }))} placeholder="2026-09-15" />
            </label>
            <label className="office-field">
              <span>URL</span>
              <input value={manual.url} onChange={e => setManual(f => ({ ...f, url: e.target.value }))} placeholder="https://…" />
            </label>
            <label className="office-field office-field-wide">
              <span>Ementa / julgado</span>
              <textarea rows={3} value={manual.ementa} onChange={e => setManual(f => ({ ...f, ementa: e.target.value }))} />
            </label>
          </div>
          <div className="office-actions">
            <button
              className="office-button office-button-primary"
              disabled={registrarManual.isPending || manual.externalId.trim().length < 3 || manual.ementa.trim().length < 10}
              onClick={() => registrarManual.mutate({ ...manual, orgao: manual.orgao || undefined, cnjNumber: manual.cnjNumber || undefined, url: manual.url || undefined, dataJulgamento: manual.dataJulgamento || undefined })}
            >
              Registrar no acervo
            </button>
          </div>
        </article>
      </section>

      <section className="office-panel">
        <h2><Gavel size={16} /> Acervo ({acervo.data?.length ?? 0})</h2>
        <div className="office-comm-list">
          {acervo.data?.length === 0 && <p className="office-empty">Acervo vazio. Sincronize os provedores ou registre um julgado manual.</p>}
          {acervo.data?.map(j => (
            <div key={j.id} className={`office-comm office-comm-${j.status}`}>
              <div className="office-comm-head">
                <span className="office-comm-kind">{j.provider}</span>
                <span className="office-comm-badge">{STATUS_LABEL[j.status] ?? j.status}</span>
                <span className="office-comm-date">{j.tribunal}{j.orgao ? ` · ${j.orgao}` : ""}</span>
              </div>
              <h3 className="office-juris-ementa">{j.ementa}</h3>
              {j.cnjNumber && <p className="office-comm-cnj">{j.cnjNumber}</p>}
              {j.url && <p className="office-comm-url"><a href={j.url} target="_blank" rel="noopener noreferrer">{j.url}</a></p>}
              <div className="office-comm-actions">
                {j.status !== "destacada" && j.status !== "aplicada" && (
                  <button className="office-button-small" onClick={() => mudarStatus.mutate({ id: j.id, status: "destacada" })}><BookMarked size={12} /> Destacar</button>
                )}
                {j.status !== "descartada" && (
                  <button className="office-button-small" onClick={() => mudarStatus.mutate({ id: j.id, status: "descartada" })}>Descartar</button>
                )}
                <select
                  className="office-select-small"
                  value={j.matterId ?? ""}
                  onChange={e => vincular.mutate({ id: j.id, matterId: e.target.value ? Number(e.target.value) : null })}
                >
                  <option value="">Vincular a matéria…</option>
                  {materias.data?.map(m => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
