import { AlertTriangle, CheckCircle2, ClipboardCheck, Database, Search, Upload, XCircle } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useToast } from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";

const DATAJUD_ALIASES = ["tjmg", "trt3", "trf6", "tre-mg", "tjmmg"] as const;
type DataJudAlias = (typeof DATAJUD_ALIASES)[number];

const REVIEW_STATUSES = ["pending", "approved", "rejected", "returned"] as const;
type ReviewStatus = (typeof REVIEW_STATUSES)[number];
const reviewStatusLabel: Record<ReviewStatus, string> = { pending: "Pendente", approved: "Aprovado", rejected: "Reprovado", returned: "Devolvido" };

const REVIEW_PRIORITIES = ["routine", "elevated", "urgent"] as const;
type ReviewPriority = (typeof REVIEW_PRIORITIES)[number];
const reviewPriorityLabel: Record<ReviewPriority, string> = { routine: "Rotina", elevated: "Elevada", urgent: "Urgente" };

const REVIEW_DECISIONS = ["approved", "returned", "rejected"] as const;
type ReviewDecision = (typeof REVIEW_DECISIONS)[number];
const reviewDecisionLabel: Record<ReviewDecision, string> = { approved: "Aprovar", returned: "Devolver", rejected: "Reprovar" };

function formatDate(value: Date | string | null | undefined) {
  return value ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value)) : "—";
}

export default function EvidenceControlPage() {
  const toast = useToast();
  const utils = trpc.useUtils();

  // Pré-validação de lote
  const [batchKey, setBatchKey] = useState("");
  const [raw, setRaw] = useState("[]");
  const [parseError, setParseError] = useState<string | null>(null);
  const preview = trpc.compendium.ingestion.preview.useMutation({
    onError: (error) => toast.error(error.message),
  });
  function runPreview() {
    setParseError(null);
    try {
      const candidates = JSON.parse(raw);
      if (!Array.isArray(candidates)) throw new Error("JSON deve ser uma lista.");
      preview.mutate({ batchKey, candidates });
    } catch (e) {
      setParseError(e instanceof Error ? e.message : "JSON inválido");
    }
  }

  // Consulta DataJud
  const [alias, setAlias] = useState<DataJudAlias>("tjmg");
  const [processNumber, setProcessNumber] = useState("");
  const lookup = trpc.datajud.lookup.useMutation({ onError: (error) => toast.error(error.message) });
  const datajud = trpc.datajud.status.useQuery();
  const coverage = trpc.datajud.coverage.useMutation({ onError: (error) => toast.error(error.message) });

  // Fila de revisão humana
  const [externalId, setExternalId] = useState("");
  const [reason, setReason] = useState("");
  const [enqueuePriority, setEnqueuePriority] = useState<ReviewPriority>("routine");
  const enqueue = trpc.compendium.reviewQueue.enqueue.useMutation({
    onSuccess: async () => {
      setExternalId("");
      setReason("");
      toast.success("Registro enviado à revisão.");
      await utils.compendium.reviewQueue.list.invalidate();
    },
    onError: (error) => toast.error(error.message),
  });

  const [statusFilter, setStatusFilter] = useState<ReviewStatus | "">("pending");
  const [priorityFilter, setPriorityFilter] = useState<ReviewPriority | "">("");
  const [tribunalFilter, setTribunalFilter] = useState("");
  const reviews = trpc.compendium.reviewQueue.list.useQuery({
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
    tribunal: tribunalFilter.trim() || undefined,
  });

  const [decisionNote, setDecisionNote] = useState("");
  const decide = trpc.compendium.reviewQueue.decide.useMutation({
    onSuccess: async () => {
      setDecisionNote("");
      toast.success("Decisão registrada.");
      await utils.compendium.reviewQueue.list.invalidate();
    },
    onError: (error) => toast.error(error.message),
  });

  const [pendingDecision, setPendingDecision] = useState<{ reviewId: number; externalId: string; decision: ReviewDecision } | null>(null);

  return (
    <main className="page">
      <section className="hero">
        <div>
          <span className="eyebrow">Evidências e DataJud</span>
          <h1>
            Entrada controlada <em>antes da gravação</em>.
          </h1>
          <p>A pré-validação não importa automaticamente; ela verifica duplicidade, privacidade e fonte. A fila humana atua sobre registros já catalogados.</p>
        </div>
      </section>

      <section className="split">
        <article className="card">
          <div className="card-top">
            <b>Pré-validar lote</b>
            <Upload size={17} />
          </div>
          <div className="notice warn" style={{ margin: "12px 0" }}>
            <AlertTriangle size={16} /> Nenhuma gravação é feita nesta etapa.
          </div>
          <label className="field">
            <span>Chave do lote</span>
            <input value={batchKey} onChange={(e) => setBatchKey(e.target.value)} placeholder="tjmg-2026-lote-01" />
          </label>
          <label className="field">
            <span>Candidatos JSON</span>
            <textarea value={raw} onChange={(e) => setRaw(e.target.value)} />
          </label>
          <button className="button" disabled={!batchKey.trim() || preview.isPending} onClick={runPreview}>
            {preview.isPending ? "Validando…" : "Executar pré-validação"}
          </button>
          {parseError && <div className="notice error">{parseError}</div>}
          {preview.data && (
            <div className="list" style={{ marginTop: 12 }}>
              {preview.data.items.map((item) => (
                <div className="list-item" key={item.externalId}>
                  {item.accepted ? <CheckCircle2 size={14} /> : <XCircle size={14} />} <b>{item.externalId}</b>
                  <p>{item.accepted ? "Elegível para revisão humana posterior." : item.reasons.join(" ")}</p>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="card">
          <div className="card-top">
            <b>Consulta DataJud</b>
            <Database size={17} />
          </div>
          <p>{datajud.data?.label ?? "Verificando…"}</p>
          <label className="field">
            <span>Tribunal</span>
            <select value={alias} onChange={(e) => setAlias(e.target.value as DataJudAlias)}>
              {DATAJUD_ALIASES.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Número CNJ</span>
            <input value={processNumber} onChange={(e) => setProcessNumber(e.target.value)} />
          </label>
          <button className="button" disabled={!processNumber.trim() || lookup.isPending || !datajud.data?.configured} onClick={() => lookup.mutate({ tribunalAlias: alias, processNumber })}>
            <Search size={14} /> {lookup.isPending ? "Consultando…" : "Consultar"}
          </button>
          {lookup.error && <div className="notice error">{lookup.error.message}</div>}
          {lookup.data && (
            <pre className="list-item" style={{ whiteSpace: "pre-wrap" }}>
              {JSON.stringify(lookup.data, null, 2)}
            </pre>
          )}
          <hr className="rule" />
          <button className="button secondary" disabled={coverage.isPending} onClick={() => coverage.mutate()}>
            {coverage.isPending ? "Verificando…" : "Verificar endpoints"}
          </button>
          {coverage.data && (
            <p>
              {coverage.data.responded}/{coverage.data.tested} responderam
              {coverage.data.skipped ? ` (${coverage.data.skipped} não sondados dentro do prazo)` : ""}. Isso não prova completude.
            </p>
          )}
        </article>
      </section>

      <section className="section card">
        <div className="card-top">
          <b>Fila de revisão humana</b>
          <ClipboardCheck size={17} />
        </div>

        <div className="split" style={{ marginTop: 14 }}>
          <label className="field">
            <span>externalId</span>
            <input value={externalId} onChange={(e) => setExternalId(e.target.value)} />
          </label>
          <label className="field">
            <span>Prioridade</span>
            <select value={enqueuePriority} onChange={(e) => setEnqueuePriority(e.target.value as ReviewPriority)}>
              {REVIEW_PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {reviewPriorityLabel[p]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="field">
          <span>Motivação</span>
          <input value={reason} onChange={(e) => setReason(e.target.value)} />
        </label>
        <button className="button" disabled={!externalId.trim() || reason.trim().length < 3 || enqueue.isPending} onClick={() => enqueue.mutate({ externalId, priority: enqueuePriority, requestedReason: reason })}>
          {enqueue.isPending ? "Enviando…" : "Enviar à revisão"}
        </button>

        <div className="toolbar" style={{ marginTop: 20 }}>
          <label className="field">
            <span>Status</span>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ReviewStatus | "")}>
              <option value="">Todos</option>
              {REVIEW_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {reviewStatusLabel[s]}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Prioridade</span>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as ReviewPriority | "")}>
              <option value="">Todas</option>
              {REVIEW_PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {reviewPriorityLabel[p]}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Tribunal</span>
            <input value={tribunalFilter} onChange={(e) => setTribunalFilter(e.target.value)} placeholder="TJMG" />
          </label>
        </div>

        <label className="field">
          <span>Nota da decisão</span>
          <textarea value={decisionNote} onChange={(e) => setDecisionNote(e.target.value)} placeholder="Motivo real da aprovação, devolução ou reprovação — fica registrado na auditoria." />
        </label>

        {reviews.data && reviews.data.length >= 500 && (
          <div className="notice warn">
            <AlertTriangle size={14} /> Exibindo o limite de 500 registros; refine os filtros para ver itens além deste teto.
          </div>
        )}

        <div className="table-wrap" style={{ marginTop: 16 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Registro</th>
                <th>Status</th>
                <th>Prioridade</th>
                <th>Motivo</th>
                <th>Decidido em</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {reviews.data?.map((item) => (
                <tr key={item.id}>
                  <td>
                    <b>{item.tribunal}</b>
                    <p>{item.externalId}</p>
                  </td>
                  <td>{reviewStatusLabel[item.status as ReviewStatus]}</td>
                  <td>{reviewPriorityLabel[item.priority as ReviewPriority]}</td>
                  <td>{item.requestedReason}</td>
                  <td>{formatDate(item.reviewedAt)}</td>
                  <td>
                    {item.status === "pending" && (
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {REVIEW_DECISIONS.map((decision) => (
                          <button
                            key={decision}
                            className="button secondary"
                            disabled={decide.isPending || decisionNote.trim().length < 3}
                            onClick={() => setPendingDecision({ reviewId: item.id, externalId: item.externalId, decision })}
                          >
                            {reviewDecisionLabel[decision]}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <ConfirmDialog
        open={pendingDecision !== null}
        pending={decide.isPending}
        danger={pendingDecision?.decision !== "approved"}
        title={pendingDecision ? `${reviewDecisionLabel[pendingDecision.decision]}: ${pendingDecision.externalId}` : ""}
        description="A decisão fica registrada na trilha de auditoria com a nota informada e não pode ser desfeita por aqui."
        confirmLabel={pendingDecision ? reviewDecisionLabel[pendingDecision.decision] : "Confirmar"}
        onConfirm={() => {
          if (pendingDecision) decide.mutate({ reviewId: pendingDecision.reviewId, decision: pendingDecision.decision, decisionNote });
          setPendingDecision(null);
        }}
        onCancel={() => setPendingDecision(null)}
      />
    </main>
  );
}
