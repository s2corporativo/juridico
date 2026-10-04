import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  BellRing,
  CalendarClock,
  Calculator,
  CheckCircle2,
  Clock,
  Inbox,
  Landmark,
  RefreshCw,
  ScrollText,
  Sparkles,
} from "lucide-react";
import { calcularPrazo, chaveData, dataDe, extrairPrazoDoTeor, fmtBR } from "@shared/prazos-module";
import { calcularPrescricao, CATALOGO } from "@shared/prescricao-module";
import { termoPrazoDaFonte } from "@shared/office-module";
import { trpc } from "@/lib/trpc";

const KIND_LABEL: Record<string, string> = {
  sentenca: "Sentença",
  despacho: "Despacho",
  decisao: "Decisão",
  edital: "Edital",
  citacao: "Citação",
  intimacao: "Intimação",
  oficio: "Ofício",
  outro: "Comunicação",
};

function dataTexto(valor: Date | string | null | undefined): string {
  if (!valor) return "—";
  const d = valor instanceof Date ? valor : new Date(valor);
  return fmtBR(d);
}

export default function OfficeComunicacoesPage() {
  const utils = trpc.useUtils();
  const settings = trpc.office.djen.settings.useQuery();
  const comms = trpc.office.comms.list.useQuery();
  const prazosRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({ lawyerName: "", oabNumber: "", oabUf: "MG", enabled: true, autoSyncEnabled: true, intervalMinutes: 180, windowDays: 10 });
  useEffect(() => {
    const s = settings.data;
    if (s) {
      setForm({
        lawyerName: s.lawyerName ?? "",
        oabNumber: s.oabNumber ?? "",
        oabUf: s.oabUf ?? "MG",
        enabled: s.enabled,
        autoSyncEnabled: s.autoSyncEnabled,
        intervalMinutes: s.intervalMinutes,
        windowDays: s.windowDays,
      });
    }
  }, [settings.data]);

  const salvarSettings = trpc.office.djen.updateSettings.useMutation({
    onSuccess: () => {
      toast.success("Configuração do conector salva");
      void utils.office.djen.settings.invalidate();
    },
    onError: err => toast.error(err.message),
  });

  const sincronizar = trpc.office.djen.sync.useMutation({
    onSuccess: data => {
      setSyncMsg({ status: data.status, message: data.message });
      void utils.office.djen.settings.invalidate();
      void utils.office.comms.list.invalidate();
      if (data.status === "success") toast.success(data.message);
      else if (data.status === "failed") toast.error(data.message);
    },
    onError: err => toast.error(err.message),
  });
  const [syncMsg, setSyncMsg] = useState<{ status: string; message: string } | null>(null);

  const mudarStatus = trpc.office.comms.updateStatus.useMutation({
    onSuccess: () => void utils.office.comms.list.invalidate(),
    onError: err => toast.error(err.message),
  });

  // ----------------------------- Prazos -------------------------------------
  const [calc, setCalc] = useState({ dataChave: chaveData(new Date()), dias: 15, termo: "dje" as "dje" | "portal" | "ciencia", contagem: "uteis" as "uteis" | "corridos", emDobro: false, motivoDobro: "mp" as "mp" | "fazenda" | "defensoria" | "litisconsortes", autosEletronicos: true, feriados: "" });
  const [resultado, setResultado] = useState<ReturnType<typeof calcularPrazo> | null>(null);
  const [origemTeor, setOrigemTeor] = useState<string | null>(null);

  function calcular() {
    try {
      const feriadosExtras: Record<string, string> = {};
      for (const linha of calc.feriados.split("\n")) {
        const m = linha.match(/(\d{4}-\d{2}-\d{2})\s*[:=]?\s*(.*)/);
        if (m) feriadosExtras[m[1]] = m[2] || "feriado local informado";
      }
      setResultado(calcularPrazo({
        dataEvento: dataDe(calc.dataChave),
        dias: calc.dias,
        termo: calc.termo,
        contagem: calc.contagem,
        emDobro: calc.emDobro,
        motivoDobro: calc.motivoDobro,
        autosEletronicos: calc.autosEletronicos,
        calendario: { feriadosExtras, usarDiasForensesUsuais: false, aplicarSuspensaoArt220: true },
      }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro no cálculo");
    }
  }

  function usarTeorDaComunicacao(c: NonNullable<typeof comms.data>[number]) {
    const teor = c.content || "";
    const extraido = teor ? extrairPrazoDoTeor(teor) : null;
    const dias = extraido?.dias ?? c.deadlineDays ?? 15;
    const dataEvento = new Date(c.receivedAt);
    const termo = termoPrazoDaFonte(c.sourceKey);
    const contagem = extraido?.unidade === "corridos" ? "corridos" : "uteis";
    setCalc(prev => ({ ...prev, dataChave: chaveData(dataEvento), dias, termo, contagem }));
    setOrigemTeor(
      extraido
        ? `Prazo extraído do teor: ${extraido.dias} dias${extraido.unidade ? ` (${extraido.unidade})` : ""}.`
        : `Sem prazo declarado no teor — usando ${c.deadlineDays ?? 15} dias (padrão do escritório).`
    );
    try {
      setResultado(calcularPrazo({
        dataEvento: dataDe(chaveData(dataEvento)),
        dias,
        termo,
        contagem,
        autosEletronicos: true,
      }));
    } catch {
      // dados incompletos: painel já pré-preenchido para revisão
    }
    prazosRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // --------------------------- Prescrição -----------------------------------
  const [presc, setPresc] = useState({ tipo: "reparacao_civil", termoInicial: "2022-05-04", dataReferencia: chaveData(new Date()) });
  const [prescResultado, setPrescResultado] = useState<ReturnType<typeof calcularPrescricao> | null>(null);
  function calcularPresc() {
    try {
      setPrescResultado(calcularPrescricao({
        termoInicial: dataDe(presc.termoInicial),
        dataReferencia: dataDe(presc.dataReferencia),
        tipo: presc.tipo,
      }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro no cálculo de prescrição");
    }
  }

  const comunicacoes = comms.data ?? [];
  const abertas = comunicacoes.filter(c => c.status !== "arquivada");
  const novas = comunicacoes.filter(c => c.status === "nova").length;
  const s = settings.data;

  return (
    <main className="office-page">
      <header className="office-topbar">
        <div className="office-topbar-brand">
          <Landmark size={20} />
          <div>
            <h1>Comunicações do Escritório</h1>
            <p>Painel JEC BH e Betim · conector DJEN automático (Comunica CNJ)</p>
          </div>
        </div>
        <nav className="office-nav">
          <a href="/escritorio/clientes">Clientes</a>
          <a href="/escritorio/comunicacoes" className="active">Comunicações</a>
          <a href="/escritorio/jurisprudencia">Jurisprudência</a>
          <a href="/">Atlas Forense</a>
        </nav>
      </header>

      <section className="office-grid">
        <article className="office-panel office-djen">
          <h2><BellRing size={16} /> Conector DJEN automático</h2>
          <p className="office-panel-sub">Coleta por inscrição OAB na API pública Comunica CNJ; dedupe por identificador, sanitização LGPD e agendamento.</p>
          {s && (
            <div className={`office-sync-state office-sync-${s.lastSyncStatus}`}>
              <strong>
                {s.lastSyncStatus === "never" && "Sincronização ainda não executada"}
                {s.lastSyncStatus === "success" && "Última sincronização concluída"}
                {s.lastSyncStatus === "partial" && "Última sincronização parcial"}
                {s.lastSyncStatus === "failed" && "Última sincronização falhou"}
                {s.lastSyncStatus === "not_configured" && "Conector não configurado"}
              </strong>
              <span>{s.lastSyncMessage ?? "Sem execução registrada."}</span>
              {s.lastSyncAt && <small>Executada em {dataTexto(s.lastSyncAt)}</small>}
            </div>
          )}
          <div className="office-form-grid">
            <label className="office-field office-field-wide">
              <span>Advogado responsável</span>
              <input value={form.lawyerName} onChange={e => setForm(f => ({ ...f, lawyerName: e.target.value }))} placeholder="Clovis José Soares" />
            </label>
            <label className="office-field">
              <span>Inscrição OAB</span>
              <input value={form.oabNumber} onChange={e => setForm(f => ({ ...f, oabNumber: e.target.value }))} placeholder="253274" inputMode="numeric" />
            </label>
            <label className="office-field">
              <span>UF</span>
              <input value={form.oabUf} onChange={e => setForm(f => ({ ...f, oabUf: e.target.value.toUpperCase().slice(0, 2) }))} maxLength={2} />
            </label>
            <label className="office-field">
              <span>Janela de coleta (dias)</span>
              <input type="number" min={1} max={90} value={form.windowDays} onChange={e => setForm(f => ({ ...f, windowDays: Number(e.target.value) }))} />
            </label>
            <label className="office-field">
              <span>Ciclo automático (min)</span>
              <input type="number" min={30} max={1440} step={30} value={form.intervalMinutes} onChange={e => setForm(f => ({ ...f, intervalMinutes: Number(e.target.value) }))} />
            </label>
            <label className="office-check office-field-wide">
              <input type="checkbox" checked={form.enabled} onChange={e => setForm(f => ({ ...f, enabled: e.target.checked }))} />
              <span>Conector habilitado</span>
            </label>
            <label className="office-check office-field-wide">
              <input type="checkbox" checked={form.autoSyncEnabled} onChange={e => setForm(f => ({ ...f, autoSyncEnabled: e.target.checked }))} />
              <span>Sincronização automática</span>
            </label>
          </div>
          <div className="office-actions">
            <button className="office-button" onClick={() => salvarSettings.mutate(form)} disabled={salvarSettings.isPending}>Salvar configuração</button>
            <button className="office-button office-button-primary" onClick={() => sincronizar.mutate()} disabled={sincronizar.isPending}>
              <RefreshCw size={15} /> {sincronizar.isPending ? "Sincronizando…" : "Sincronizar agora"}
            </button>
          </div>
          {syncMsg && (
            <p className={`office-sync-msg office-sync-${syncMsg.status}`}>
              {syncMsg.status === "failed" ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />} {syncMsg.message}
            </p>
          )}
          <small className="office-note">Sem rede até comunicapi.cnj.jus.br a sincronização falha de forma graciosa — o servidor permanece íntegro e o estado é registrado. A primeira coleta legítima ocorre assim que houver internet.</small>
        </article>

        <article className="office-panel office-stats">
          <h2><Inbox size={16} /> Caixa de comunicações</h2>
          <div className="office-stat-row">
            <div><strong>{novas}</strong><span>novas</span></div>
            <div><strong>{abertas.length}</strong><span>abertas</span></div>
            <div><strong>{comunicacoes.filter(c => c.channel === "djen").length}</strong><span>via DJEN</span></div>
            <div><strong>{comunicacoes.filter(c => c.channel === "manual").length}</strong><span>manuais</span></div>
          </div>
          <div className="office-comm-list">
            {comunicacoes.length === 0 && <p className="office-empty">Nenhuma comunicação ainda. Configure a OAB e clique em "Sincronizar agora".</p>}
            {comunicacoes.slice(0, 12).map(c => (
              <div key={c.id} className={`office-comm office-comm-${c.status}`}>
                <div className="office-comm-head">
                  <span className="office-comm-kind">{KIND_LABEL[c.kind] ?? KIND_LABEL.outro}</span>
                  {c.sourceKey === "cnj-djen-comunica" && <span className="office-comm-badge">DJEN · Comunica CNJ</span>}
                  <span className="office-comm-date">{dataTexto(c.receivedAt)}</span>
                </div>
                <h3>{c.title}</h3>
                {c.cnjNumber && <p className="office-comm-cnj">{c.cnjNumber}</p>}
                {c.content && <p className="office-comm-teor">{c.content.slice(0, 220)}{c.content.length > 220 ? "…" : ""}</p>}
                <div className="office-comm-actions">
                  {c.status !== "lida" && c.status !== "arquivada" && (
                    <button className="office-button-small" onClick={() => mudarStatus.mutate({ id: c.id, status: "lida" })}>Marcar lida</button>
                  )}
                  {c.status !== "arquivada" && (
                    <button className="office-button-small" onClick={() => mudarStatus.mutate({ id: c.id, status: "arquivada" })}>Arquivar</button>
                  )}
                  {(c.status === "nova" || c.status === "lida") && (
                    <button className="office-button-small office-button-calc" onClick={() => usarTeorDaComunicacao(c)}>
                      <Calculator size={13} /> Calcular pelo teor
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="office-panel office-prazos" ref={prazosRef} id="prazos">
        <h2><CalendarClock size={16} /> Ferramentas de prazo · motor portado do LexValida</h2>
        <p className="office-panel-sub">Cálculo determinístico com memória auditável (CPC 219/220/224; Lei 11.419/2006; CPP 798). Feriados locais devem ser informados pelo usuário.</p>
        {origemTeor && <p className="office-teor-origem"><Sparkles size={14} /> {origemTeor}</p>}
        <div className="office-form-grid">
          <label className="office-field">
            <span>Data do evento (disponibilização/envio/ciência)</span>
            <input type="date" value={calc.dataChave} onChange={e => setCalc(f => ({ ...f, dataChave: e.target.value }))} />
          </label>
          <label className="office-field">
            <span>Prazo (dias)</span>
            <input type="number" min={1} max={365} value={calc.dias} onChange={e => setCalc(f => ({ ...f, dias: Number(e.target.value) }))} />
          </label>
          <label className="office-field">
            <span>Termo inicial</span>
            <select value={calc.termo} onChange={e => setCalc(f => ({ ...f, termo: e.target.value as typeof calc.termo }))}>
              <option value="dje">DJe — disponibilização (CPC 224 §2º)</option>
              <option value="portal">Portal — envio (Lei 11.419/2006)</option>
              <option value="ciencia">Ciência conhecida</option>
            </select>
          </label>
          <label className="office-field">
            <span>Contagem</span>
            <select value={calc.contagem} onChange={e => setCalc(f => ({ ...f, contagem: e.target.value as typeof calc.contagem }))}>
              <option value="uteis">Dias úteis (CPC 219)</option>
              <option value="corridos">Dias corridos (CPP 798)</option>
            </select>
          </label>
          <label className="office-check">
            <input type="checkbox" checked={calc.emDobro} onChange={e => setCalc(f => ({ ...f, emDobro: e.target.checked }))} />
            <span>Prazo em dobro</span>
          </label>
          {calc.emDobro && (
            <>
              <label className="office-field">
                <span>Motivo da dobra</span>
                <select value={calc.motivoDobro} onChange={e => setCalc(f => ({ ...f, motivoDobro: e.target.value as typeof calc.motivoDobro }))}>
                  <option value="mp">Ministério Público (CPC 180)</option>
                  <option value="fazenda">Fazenda Pública (CPC 183)</option>
                  <option value="defensoria">Defensoria (CPC 186)</option>
                  <option value="litisconsortes">Litisconsortes (CPC 229)</option>
                </select>
              </label>
              <label className="office-check">
                <input type="checkbox" checked={calc.autosEletronicos} onChange={e => setCalc(f => ({ ...f, autosEletronicos: e.target.checked }))} />
                <span>Autos eletrônicos</span>
              </label>
            </>
          )}
          <label className="office-field office-field-wide">
            <span>Feriados locais (uma data "YYYY-MM-DD" e motivo por linha)</span>
            <textarea rows={2} value={calc.feriados} onChange={e => setCalc(f => ({ ...f, feriados: e.target.value }))} placeholder={"2026-11-19 Aniversário de Betim\n2027-01-05 suspensão TJMG"} />
          </label>
        </div>
        <button className="office-button office-button-primary" onClick={calcular}><Calculator size={15} /> Calcular prazo</button>
        {resultado && (
          <div className="office-prazo-resultado">
            <div className="office-prazo-cards">
              <div><span>Intimação</span><strong>{fmtBR(resultado.dataIntimacao)}</strong></div>
              <div><span>Início da contagem</span><strong>{fmtBR(resultado.inicioContagem)}</strong></div>
              <div className="office-prazo-venc"><span>Vencimento</span><strong>{fmtBR(resultado.vencimento)}</strong></div>
              <div><span>Prazo</span><strong>{resultado.diasComputados} {resultado.contagem === "uteis" ? "dias úteis" : "dias corridos"}{resultado.emDobro ? " (em dobro)" : ""}</strong></div>
            </div>
            <ol className="office-memoria">
              {[...resultado.memoria, ...resultado.alertas].map((linha, i) => (
                <li key={i}>{linha}</li>
              ))}
            </ol>
          </div>
        )}
      </section>

      <section className="office-panel office-prescricao">
        <h2><Clock size={16} /> Consulta de prescrição</h2>
        <p className="office-panel-sub">Catálogo com previsão legal expressa; interrupção única (CC 202) e bienal trabalhista (CF 7º XXIX). O termo inicial é juízo do advogado.</p>
        <div className="office-form-grid">
          <label className="office-field">
            <span>Pretensão</span>
            <select value={presc.tipo} onChange={e => setPresc(f => ({ ...f, tipo: e.target.value }))}>
              {Object.entries(CATALOGO).map(([chave, v]) => (
                <option key={chave} value={chave}>{v.descricao} — {v.base}</option>
              ))}
            </select>
          </label>
          <label className="office-field">
            <span>Termo inicial</span>
            <input type="date" value={presc.termoInicial} onChange={e => setPresc(f => ({ ...f, termoInicial: e.target.value }))} />
          </label>
          <label className="office-field">
            <span>Data de referência</span>
            <input type="date" value={presc.dataReferencia} onChange={e => setPresc(f => ({ ...f, dataReferencia: e.target.value }))} />
          </label>
        </div>
        <button className="office-button" onClick={calcularPresc}><ScrollText size={15} /> Consultar prescrição</button>
        {prescResultado && (
          <div className={`office-prazo-resultado ${prescResultado.prescrito ? "office-prescrito" : ""}`}>
            <div className="office-prazo-cards">
              <div><span>Termo inicial</span><strong>{fmtBR(prescResultado.termoInicial)}</strong></div>
              <div><span>Termo final</span><strong>{fmtBR(prescResultado.termoFinal)}</strong></div>
              <div className="office-prazo-venc"><span>Veredito</span><strong>{prescResultado.prescrito ? "PRESCRITA" : "NÃO prescrita"}</strong></div>
            </div>
            <ol className="office-memoria">
              {[...prescResultado.memoria, ...prescResultado.alertas].map((linha, i) => (
                <li key={i}>{linha}</li>
              ))}
            </ol>
          </div>
        )}
      </section>
    </main>
  );
}
