import { AlertTriangle, BookOpenCheck, CheckCircle2, FilePlus2, LockKeyhole, RefreshCw, ShieldCheck, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useToast } from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";
import {
  authorityStanceLabel,
  authorityTypeLabel,
  lifecycleLabel,
  reviewDecisionLabel,
  sourceStatusLabel,
  THESIS_AUTHORITY_STANCES,
  THESIS_AUTHORITY_TYPES,
  THESIS_COUNTERARGUMENT_SOURCE_STATUSES,
  THESIS_EVIDENCE_IMPORTANCE,
  THESIS_LEGAL_BASIS_SOURCE_STATUSES,
  THESIS_LIFECYCLE_STATUSES,
  THESIS_METRIC_SOURCE_STATUSES,
  THESIS_REVIEW_DECISIONS,
  THESIS_REVIEW_STAGES,
  type ThesisAuthorityStance,
  type ThesisAuthorityType,
  type ThesisCounterargumentSourceStatus,
  type ThesisEvidenceImportance,
  type ThesisLegalBasisSourceStatus,
  type ThesisLifecycleStatus,
  type ThesisMetricSourceStatus,
  type ThesisReviewDecision,
  type ThesisReviewStage,
} from "@shared/thesis-bank";

type Tab = "content" | "evidence" | "evaluation" | "review";

const stageLabel: Record<ThesisReviewStage, string> = {
  researcher: "Pesquisador",
  validator: "Validador",
  counter_review: "Crítico de contratese",
  auditor: "Auditor final",
};

const emptyDraft = {
  topicId: "",
  title: "",
  description: "",
  position: "condicionada" as const,
  useType: "both" as const,
  argumentation: "",
  whenToUse: "",
  whenNotToUse: "",
  riskNotes: "",
};

const emptyBasis = {
  authorityType: "law" as ThesisAuthorityType,
  norm: "",
  provision: "",
  officialUrl: "",
  sourceStatus: "official_confirmed" as ThesisLegalBasisSourceStatus,
  lastVerifiedAt: "",
};

const emptyEvidence = { label: "", description: "", importance: "required" as ThesisEvidenceImportance };
const emptyCounter = {
  title: "",
  argument: "",
  recommendedResponse: "",
  sourceStatus: "editorial_review" as ThesisCounterargumentSourceStatus,
};
const emptyPrecedent = { externalId: "", stance: "supports" as ThesisAuthorityStance, note: "" };
const emptyScore = { legalStrength: "", jurisprudentialConsistency: "", freshness: "", evidenceQuality: "", methodologyNote: "" };
const emptyMetric = {
  tribunal: "",
  judgingBody: "",
  periodStart: "",
  periodEnd: "",
  analyzedCount: "",
  favorableCount: "0",
  unfavorableCount: "0",
  partialCount: "0",
  agreementCount: "0",
  sampleDefinition: "",
  coverageNote: "",
  sourceStatus: "validated_sample" as ThesisMetricSourceStatus,
};

type PendingAction =
  | { kind: "review"; stage: ThesisReviewStage; decision: ThesisReviewDecision }
  | { kind: "transition"; target: ThesisLifecycleStatus }
  | { kind: "newVersion" }
  | null;

export default function ThesisCurationPage() {
  const utils = trpc.useUtils();
  const toast = useToast();
  const overview = trpc.compendium.overview.useQuery();
  const list = trpc.thesisBank.admin.list.useQuery();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [tab, setTab] = useState<Tab>("content");
  const snapshot = trpc.thesisBank.admin.snapshot.useQuery({ thesisId: selectedId! }, { enabled: selectedId !== null });

  const refresh = async () => {
    await Promise.all([
      utils.thesisBank.admin.list.invalidate(),
      selectedId ? utils.thesisBank.admin.snapshot.invalidate({ thesisId: selectedId }) : Promise.resolve(),
    ]);
  };

  const [draft, setDraft] = useState(emptyDraft);
  const create = trpc.thesisBank.admin.createDraft.useMutation({
    onSuccess: async (row) => {
      setSelectedId(row.id);
      setDraft(emptyDraft);
      toast.success(`Tese ${row.publicId} criada como rascunho.`);
      await refresh();
    },
    onError: (error) => toast.error(error.message),
  });

  const update = trpc.thesisBank.admin.updateDraft.useMutation({
    onSuccess: async () => {
      toast.success("Conteúdo salvo.");
      await refresh();
    },
    onError: (error) => toast.error(error.message),
  });

  const [basis, setBasis] = useState(emptyBasis);
  const addBasis = trpc.thesisBank.admin.addLegalBasis.useMutation({
    onSuccess: async () => {
      setBasis(emptyBasis);
      toast.success("Fundamento adicionado.");
      await refresh();
    },
    onError: (error) => toast.error(error.message),
  });

  const [evidence, setEvidence] = useState(emptyEvidence);
  const addEvidence = trpc.thesisBank.admin.addEvidenceRequirement.useMutation({
    onSuccess: async () => {
      setEvidence(emptyEvidence);
      toast.success("Prova adicionada.");
      await refresh();
    },
    onError: (error) => toast.error(error.message),
  });

  const [counter, setCounter] = useState(emptyCounter);
  const addCounter = trpc.thesisBank.admin.addCounterargument.useMutation({
    onSuccess: async () => {
      setCounter(emptyCounter);
      toast.success("Contratese adicionada.");
      await refresh();
    },
    onError: (error) => toast.error(error.message),
  });

  const [precedent, setPrecedent] = useState(emptyPrecedent);
  const linkAuthority = trpc.thesisBank.admin.linkAuthority.useMutation({
    onSuccess: async () => {
      setPrecedent(emptyPrecedent);
      toast.success("Precedente vinculado.");
      await refresh();
    },
    onError: (error) => toast.error(error.message),
  });

  const [score, setScore] = useState(emptyScore);
  const setScoreMutation = trpc.thesisBank.admin.setScore.useMutation({
    onSuccess: async () => {
      toast.success("Atlas Confidence registrado.");
      await refresh();
    },
    onError: (error) => toast.error(error.message),
  });

  const [metric, setMetric] = useState(emptyMetric);
  const addMetric = trpc.thesisBank.admin.addMetric.useMutation({
    onSuccess: async () => {
      setMetric(emptyMetric);
      toast.success("Métrica registrada.");
      await refresh();
    },
    onError: (error) => toast.error(error.message),
  });

  const [reviewNote, setReviewNote] = useState("");
  const review = trpc.thesisBank.admin.review.useMutation({
    onSuccess: async () => {
      setReviewNote("");
      toast.success("Decisão de revisão registrada.");
      await refresh();
    },
    onError: (error) => toast.error(error.message),
  });

  const [statusTarget, setStatusTarget] = useState<ThesisLifecycleStatus>("source_pending");
  const [transitionNote, setTransitionNote] = useState("");
  const transition = trpc.thesisBank.admin.transitionStatus.useMutation({
    onSuccess: async () => {
      setTransitionNote("");
      toast.success(`Status alterado para ${lifecycleLabel(statusTarget)}.`);
      await refresh();
    },
    onError: (error) => toast.error(error.message),
  });

  const [newVersionNote, setNewVersionNote] = useState("");
  const newVersion = trpc.thesisBank.admin.restartReviewCycle.useMutation({
    onSuccess: async () => {
      setNewVersionNote("");
      toast.success("Nova versão aberta.");
      await refresh();
    },
    onError: (error) => toast.error(error.message),
  });

  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const topics = useMemo(() => overview.data?.topics ?? [], [overview.data]);
  const current = snapshot.data;
  const locked = current?.editing.contentLocked ?? false;
  const qLocked = current?.editing.quantitativeLocked ?? false;
  const error = [create.error, update.error, newVersion.error, addBasis.error, addEvidence.error, addCounter.error, linkAuthority.error, setScoreMutation.error, addMetric.error, review.error, transition.error].find(Boolean);
  const selected = list.data?.find((row) => row.thesis.id === selectedId);

  const scoreComplete = [score.legalStrength, score.jurisprudentialConsistency, score.freshness, score.evidenceQuality].every((value) => value.trim() !== "");
  const anyPending = pendingAction !== null && (review.isPending || transition.isPending || newVersion.isPending);

  function confirmPendingAction() {
    if (!pendingAction || !selectedId) return;
    if (pendingAction.kind === "review") {
      review.mutate({ thesisId: selectedId, stage: pendingAction.stage, decision: pendingAction.decision, note: reviewNote });
    } else if (pendingAction.kind === "transition") {
      transition.mutate({ thesisId: selectedId, target: pendingAction.target, note: transitionNote });
    } else if (pendingAction.kind === "newVersion") {
      newVersion.mutate({ thesisId: selectedId, note: newVersionNote });
    }
    setPendingAction(null);
  }

  return (
    <main className="page">
      <section className="hero">
        <div>
          <span className="eyebrow">Banco Nacional de Teses · Curadoria</span>
          <h1>
            Conteúdo → evidências → avaliação → <em>revisão</em>.
          </h1>
          <p>A interface respeita o versionamento: após a primeira aprovação humana, alterações materiais exigem nova versão. Score e jurimetria ficam vinculados à versão corrente.</p>
        </div>
        <aside className="principle-card">
          <b>
            <LockKeyhole size={16} /> Regra de imutabilidade
          </b>
          <p>Uma versão aprovada não é reescrita silenciosamente. Abra nova versão e recomece os quatro gates.</p>
        </aside>
      </section>

      {error && (
        <div className="notice error">
          <AlertTriangle size={16} />
          {error.message}
        </div>
      )}

      <section className="split section">
        <article className="card">
          <div className="card-top">
            <b>Criar rascunho</b>
            <FilePlus2 size={17} />
          </div>
          <label className="field">
            <span>Tema</span>
            <select value={draft.topicId} onChange={(e) => setDraft((v) => ({ ...v, topicId: e.target.value }))}>
              <option value="">Selecione</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.pathKey} · {t.title}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Título</span>
            <input value={draft.title} onChange={(e) => setDraft((v) => ({ ...v, title: e.target.value }))} />
          </label>
          <label className="field">
            <span>Descrição</span>
            <textarea value={draft.description} onChange={(e) => setDraft((v) => ({ ...v, description: e.target.value }))} />
          </label>
          <div className="split">
            <label className="field">
              <span>Posição</span>
              <select value={draft.position} onChange={(e) => setDraft((v) => ({ ...v, position: e.target.value as typeof draft.position }))}>
                <option value="favoravel">Favorável</option>
                <option value="contraria">Contrária</option>
                <option value="condicionada">Condicionada</option>
                <option value="em_debate">Em debate</option>
              </select>
            </label>
            <label className="field">
              <span>Uso</span>
              <select value={draft.useType} onChange={(e) => setDraft((v) => ({ ...v, useType: e.target.value as typeof draft.useType }))}>
                <option value="attack">Ataque</option>
                <option value="defense">Defesa</option>
                <option value="both">Ambos</option>
              </select>
            </label>
          </div>
          <button
            className="button"
            disabled={!draft.topicId || draft.title.length < 5 || draft.description.length < 20 || create.isPending}
            onClick={() =>
              create.mutate({
                topicId: Number(draft.topicId),
                title: draft.title,
                description: draft.description,
                position: draft.position,
                useType: draft.useType,
                argumentation: draft.argumentation || undefined,
                whenToUse: draft.whenToUse || undefined,
                whenNotToUse: draft.whenNotToUse || undefined,
                riskNotes: draft.riskNotes || undefined,
              })
            }
          >
            {create.isPending ? "Criando…" : "Criar tese"}
          </button>
        </article>

        <article className="card">
          <b>Teses em curadoria</b>
          <div className="list" style={{ marginTop: 12, maxHeight: 410, overflow: "auto" }}>
            {list.data?.map((row) => (
              <button key={row.thesis.id} className="list-item" style={{ textAlign: "left", cursor: "pointer" }} onClick={() => setSelectedId(row.thesis.id)}>
                <span className={`status ${row.profile.lifecycleStatus}`}>{lifecycleLabel(row.profile.lifecycleStatus)}</span>
                <p>
                  <b>{row.thesis.title}</b>
                </p>
                <small>
                  {row.profile.publicId} · v{row.profile.version}
                </small>
              </button>
            ))}
          </div>
        </article>
      </section>

      {!selectedId || !current || !selected ? (
        <section className="empty section">Selecione ou crie uma tese para abrir a workspace.</section>
      ) : (
        <>
          <section className="section card">
            <div className="card-top">
              <div>
                <span className="eyebrow">
                  {current.profile.publicId} · v{current.profile.version}
                </span>
                <h2 style={{ margin: "5px 0" }}>{current.thesis.title}</h2>
              </div>
              {locked ? (
                <span className="status review">
                  <LockKeyhole size={12} /> Conteúdo travado
                </span>
              ) : (
                <span className="status validated">Editável</span>
              )}
            </div>
            {locked && (
              <div className="notice warn" style={{ marginTop: 12 }}>
                <LockKeyhole size={16} />
                {current.editing.reason}
                <label className="field" style={{ marginTop: 8 }}>
                  <span>Motivo da nova versão</span>
                  <textarea value={newVersionNote} onChange={(e) => setNewVersionNote(e.target.value)} placeholder="O que mudou e por que a alteração exige nova versão." />
                </label>
                <button className="button secondary" disabled={newVersion.isPending || newVersionNote.trim().length < 3} onClick={() => setPendingAction({ kind: "newVersion" })}>
                  <RefreshCw size={13} /> Abrir nova versão
                </button>
              </div>
            )}
            <div className="workflow">
              {(["content", "evidence", "evaluation", "review"] as Tab[]).map((x) => (
                <button key={x} className={tab === x ? "active" : ""} onClick={() => setTab(x)}>
                  {x === "content" ? "1. Conteúdo" : x === "evidence" ? "2. Evidências" : x === "evaluation" ? "3. Avaliação" : "4. Revisão"}
                </button>
              ))}
            </div>
          </section>

          {tab === "content" && (
            <section className="card" key={`content-${selectedId}`}>
              <h2>Conteúdo estratégico</h2>
              <div className="notice">Edite somente antes da primeira aprovação humana da versão.</div>
              <label className="field">
                <span>Argumentação</span>
                <textarea defaultValue={current.profile.argumentation ?? ""} id="arg-edit" disabled={locked} />
              </label>
              <label className="field">
                <span>Quando usar</span>
                <textarea defaultValue={current.profile.whenToUse ?? ""} id="use-edit" disabled={locked} />
              </label>
              <label className="field">
                <span>Quando não usar</span>
                <textarea defaultValue={current.profile.whenNotToUse ?? ""} id="notuse-edit" disabled={locked} />
              </label>
              <label className="field">
                <span>Riscos</span>
                <textarea defaultValue={current.profile.riskNotes ?? ""} id="risk-edit" disabled={locked} />
              </label>
              <button
                className="button"
                disabled={locked || update.isPending}
                onClick={() =>
                  update.mutate({
                    thesisId: selectedId,
                    argumentation: (document.getElementById("arg-edit") as HTMLTextAreaElement).value,
                    whenToUse: (document.getElementById("use-edit") as HTMLTextAreaElement).value,
                    whenNotToUse: (document.getElementById("notuse-edit") as HTMLTextAreaElement).value,
                    riskNotes: (document.getElementById("risk-edit") as HTMLTextAreaElement).value,
                  })
                }
              >
                {update.isPending ? "Salvando…" : "Salvar conteúdo"}
              </button>
            </section>
          )}

          {tab === "evidence" && (
            <section className="split">
              <article className="card">
                <h2>Fundamento oficial</h2>
                <label className="field">
                  <span>Tipo</span>
                  <select value={basis.authorityType} onChange={(e) => setBasis((v) => ({ ...v, authorityType: e.target.value as ThesisAuthorityType }))}>
                    {THESIS_AUTHORITY_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {authorityTypeLabel(type)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Norma</span>
                  <input value={basis.norm} onChange={(e) => setBasis((v) => ({ ...v, norm: e.target.value }))} />
                </label>
                <label className="field">
                  <span>Dispositivo</span>
                  <input value={basis.provision} onChange={(e) => setBasis((v) => ({ ...v, provision: e.target.value }))} />
                </label>
                <label className="field">
                  <span>URL oficial</span>
                  <input value={basis.officialUrl} onChange={(e) => setBasis((v) => ({ ...v, officialUrl: e.target.value }))} placeholder="https://..." />
                </label>
                <label className="field">
                  <span>Situação da fonte</span>
                  <select value={basis.sourceStatus} onChange={(e) => setBasis((v) => ({ ...v, sourceStatus: e.target.value as ThesisLegalBasisSourceStatus }))}>
                    {THESIS_LEGAL_BASIS_SOURCE_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {sourceStatusLabel(status)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Data da conferência</span>
                  <input type="date" value={basis.lastVerifiedAt} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setBasis((v) => ({ ...v, lastVerifiedAt: e.target.value }))} />
                </label>
                <button
                  className="button"
                  disabled={locked || !basis.norm || (basis.sourceStatus === "official_confirmed" && (!basis.officialUrl || !basis.lastVerifiedAt)) || addBasis.isPending}
                  onClick={() =>
                    addBasis.mutate({
                      thesisId: selectedId,
                      authorityType: basis.authorityType,
                      norm: basis.norm,
                      provision: basis.provision || undefined,
                      officialUrl: basis.officialUrl || undefined,
                      sourceStatus: basis.sourceStatus,
                      lastVerifiedAt: basis.lastVerifiedAt ? new Date(basis.lastVerifiedAt).toISOString() : undefined,
                    })
                  }
                >
                  {addBasis.isPending ? "Adicionando…" : "Adicionar fundamento"}
                </button>
                <div className="list" style={{ marginTop: 12 }}>
                  {current.basis.map((x) => (
                    <div className="list-item" key={x.id}>
                      <b>{x.norm}</b>
                      <p>
                        {x.provision ?? ""} · {sourceStatusLabel(x.sourceStatus)}
                      </p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="card">
                <h2>Provas e precedentes</h2>
                <label className="field">
                  <span>Prova necessária</span>
                  <input value={evidence.label} onChange={(e) => setEvidence((v) => ({ ...v, label: e.target.value }))} />
                </label>
                <label className="field">
                  <span>Descrição</span>
                  <textarea value={evidence.description} onChange={(e) => setEvidence((v) => ({ ...v, description: e.target.value }))} />
                </label>
                <label className="field">
                  <span>Importância</span>
                  <select value={evidence.importance} onChange={(e) => setEvidence((v) => ({ ...v, importance: e.target.value as ThesisEvidenceImportance }))}>
                    {THESIS_EVIDENCE_IMPORTANCE.map((importance) => (
                      <option key={importance} value={importance}>
                        {importance === "required" ? "Obrigatória" : importance === "recommended" ? "Recomendada" : "Contextual"}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  className="button secondary"
                  disabled={locked || evidence.label.length < 2 || addEvidence.isPending}
                  onClick={() => addEvidence.mutate({ thesisId: selectedId, label: evidence.label, description: evidence.description || undefined, importance: evidence.importance })}
                >
                  {addEvidence.isPending ? "Adicionando…" : "Adicionar prova"}
                </button>

                <label className="field" style={{ marginTop: 16 }}>
                  <span>externalId do precedente</span>
                  <input value={precedent.externalId} onChange={(e) => setPrecedent((v) => ({ ...v, externalId: e.target.value }))} />
                </label>
                <label className="field">
                  <span>Posição do precedente</span>
                  <select value={precedent.stance} onChange={(e) => setPrecedent((v) => ({ ...v, stance: e.target.value as ThesisAuthorityStance }))}>
                    {THESIS_AUTHORITY_STANCES.map((stance) => (
                      <option key={stance} value={stance}>
                        {authorityStanceLabel(stance)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Nota (opcional)</span>
                  <input value={precedent.note} onChange={(e) => setPrecedent((v) => ({ ...v, note: e.target.value }))} />
                </label>
                <button
                  className="button secondary"
                  disabled={locked || !precedent.externalId.trim() || linkAuthority.isPending}
                  onClick={() => linkAuthority.mutate({ thesisId: selectedId, jurisprudenceExternalId: precedent.externalId.trim(), stance: precedent.stance, note: precedent.note || undefined })}
                >
                  {linkAuthority.isPending ? "Vinculando…" : "Vincular precedente"}
                </button>
                <div className="list" style={{ marginTop: 12 }}>
                  {current.evidence.map((x) => (
                    <div className="list-item" key={x.id}>
                      <b>{x.label}</b>
                      <p>{x.description ?? ""}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="card">
                <h2>Contratese</h2>
                <label className="field">
                  <span>Título</span>
                  <input value={counter.title} onChange={(e) => setCounter((v) => ({ ...v, title: e.target.value }))} />
                </label>
                <label className="field">
                  <span>Argumento</span>
                  <textarea value={counter.argument} onChange={(e) => setCounter((v) => ({ ...v, argument: e.target.value }))} />
                </label>
                <label className="field">
                  <span>Resposta recomendada</span>
                  <textarea value={counter.recommendedResponse} onChange={(e) => setCounter((v) => ({ ...v, recommendedResponse: e.target.value }))} />
                </label>
                <label className="field">
                  <span>Situação da fonte</span>
                  <select value={counter.sourceStatus} onChange={(e) => setCounter((v) => ({ ...v, sourceStatus: e.target.value as ThesisCounterargumentSourceStatus }))}>
                    {THESIS_COUNTERARGUMENT_SOURCE_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {sourceStatusLabel(status)}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  className="button"
                  disabled={locked || counter.title.length < 3 || counter.argument.length < 10 || addCounter.isPending}
                  onClick={() =>
                    addCounter.mutate({
                      thesisId: selectedId,
                      title: counter.title,
                      argument: counter.argument,
                      recommendedResponse: counter.recommendedResponse || undefined,
                      sourceStatus: counter.sourceStatus,
                    })
                  }
                >
                  {addCounter.isPending ? "Adicionando…" : "Adicionar contratese"}
                </button>
                <div className="list" style={{ marginTop: 12 }}>
                  {current.counterarguments.map((x) => (
                    <div className="list-item" key={x.id}>
                      <b>{x.title}</b>
                      <p>{x.argument}</p>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          )}

          {tab === "evaluation" && (
            <section className="split">
              <article className="card">
                <h2>Atlas Confidence</h2>
                {qLocked && (
                  <div className="notice warn">
                    <LockKeyhole size={14} /> Score congelado após aprovação do auditor.
                  </div>
                )}
                <div className="score-grid">
                  <label className="field">
                    <span>Força jurídica</span>
                    <input type="number" min="0" max="100" value={score.legalStrength} disabled={qLocked} onChange={(e) => setScore((v) => ({ ...v, legalStrength: e.target.value }))} />
                  </label>
                  <label className="field">
                    <span>Consistência jurisprudencial</span>
                    <input type="number" min="0" max="100" value={score.jurisprudentialConsistency} disabled={qLocked} onChange={(e) => setScore((v) => ({ ...v, jurisprudentialConsistency: e.target.value }))} />
                  </label>
                  <label className="field">
                    <span>Atualidade</span>
                    <input type="number" min="0" max="100" value={score.freshness} disabled={qLocked} onChange={(e) => setScore((v) => ({ ...v, freshness: e.target.value }))} />
                  </label>
                  <label className="field">
                    <span>Qualidade da evidência</span>
                    <input type="number" min="0" max="100" value={score.evidenceQuality} disabled={qLocked} onChange={(e) => setScore((v) => ({ ...v, evidenceQuality: e.target.value }))} />
                  </label>
                </div>
                <label className="field">
                  <span>Nota metodológica</span>
                  <textarea
                    value={score.methodologyNote}
                    disabled={qLocked}
                    placeholder="Como cada eixo foi avaliado — não deixe em branco nem repita um texto padrão."
                    onChange={(e) => setScore((v) => ({ ...v, methodologyNote: e.target.value }))}
                  />
                </label>
                <button
                  className="button"
                  disabled={qLocked || !scoreComplete || score.methodologyNote.length < 10 || setScoreMutation.isPending}
                  onClick={() =>
                    setScoreMutation.mutate({
                      thesisId: selectedId,
                      legalStrength: Number(score.legalStrength),
                      jurisprudentialConsistency: Number(score.jurisprudentialConsistency),
                      freshness: Number(score.freshness),
                      evidenceQuality: Number(score.evidenceQuality),
                      methodologyNote: score.methodologyNote,
                    })
                  }
                >
                  {setScoreMutation.isPending ? "Salvando…" : "Salvar score"}
                </button>
              </article>

              <article className="card">
                <h2>Jurimetria da versão</h2>
                <div className="notice warn">Taxa descritiva da amostra; não representa probabilidade de êxito.</div>
                <div className="split">
                  <label className="field">
                    <span>Tribunal</span>
                    <input value={metric.tribunal} disabled={qLocked} onChange={(e) => setMetric((v) => ({ ...v, tribunal: e.target.value }))} />
                  </label>
                  <label className="field">
                    <span>Órgão julgador</span>
                    <input value={metric.judgingBody} disabled={qLocked} onChange={(e) => setMetric((v) => ({ ...v, judgingBody: e.target.value }))} />
                  </label>
                </div>
                <div className="split">
                  <label className="field">
                    <span>Período — início</span>
                    <input type="date" value={metric.periodStart} disabled={qLocked} onChange={(e) => setMetric((v) => ({ ...v, periodStart: e.target.value }))} />
                  </label>
                  <label className="field">
                    <span>Período — fim</span>
                    <input type="date" value={metric.periodEnd} disabled={qLocked} onChange={(e) => setMetric((v) => ({ ...v, periodEnd: e.target.value }))} />
                  </label>
                </div>
                <div className="split">
                  <label className="field">
                    <span>Analisados</span>
                    <input type="number" min="1" value={metric.analyzedCount} disabled={qLocked} onChange={(e) => setMetric((v) => ({ ...v, analyzedCount: e.target.value }))} />
                  </label>
                  <label className="field">
                    <span>Favoráveis</span>
                    <input type="number" min="0" value={metric.favorableCount} disabled={qLocked} onChange={(e) => setMetric((v) => ({ ...v, favorableCount: e.target.value }))} />
                  </label>
                </div>
                <div className="split">
                  <label className="field">
                    <span>Desfavoráveis</span>
                    <input type="number" min="0" value={metric.unfavorableCount} disabled={qLocked} onChange={(e) => setMetric((v) => ({ ...v, unfavorableCount: e.target.value }))} />
                  </label>
                  <label className="field">
                    <span>Parciais</span>
                    <input type="number" min="0" value={metric.partialCount} disabled={qLocked} onChange={(e) => setMetric((v) => ({ ...v, partialCount: e.target.value }))} />
                  </label>
                </div>
                <label className="field">
                  <span>Acordos</span>
                  <input type="number" min="0" value={metric.agreementCount} disabled={qLocked} onChange={(e) => setMetric((v) => ({ ...v, agreementCount: e.target.value }))} />
                </label>
                <label className="field">
                  <span>Definição da amostra</span>
                  <textarea value={metric.sampleDefinition} disabled={qLocked} onChange={(e) => setMetric((v) => ({ ...v, sampleDefinition: e.target.value }))} />
                </label>
                <label className="field">
                  <span>Nota de cobertura</span>
                  <textarea value={metric.coverageNote} disabled={qLocked} onChange={(e) => setMetric((v) => ({ ...v, coverageNote: e.target.value }))} />
                </label>
                <label className="field">
                  <span>Situação da fonte</span>
                  <select value={metric.sourceStatus} disabled={qLocked} onChange={(e) => setMetric((v) => ({ ...v, sourceStatus: e.target.value as ThesisMetricSourceStatus }))}>
                    {THESIS_METRIC_SOURCE_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {sourceStatusLabel(status)}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  className="button"
                  disabled={
                    qLocked ||
                    Number(metric.analyzedCount) <= 0 ||
                    !metric.periodStart ||
                    !metric.periodEnd ||
                    metric.sampleDefinition.length < 10 ||
                    metric.coverageNote.length < 10 ||
                    addMetric.isPending
                  }
                  onClick={() =>
                    addMetric.mutate({
                      thesisId: selectedId,
                      tribunal: metric.tribunal || undefined,
                      judgingBody: metric.judgingBody || undefined,
                      periodStart: metric.periodStart,
                      periodEnd: metric.periodEnd,
                      analyzedCount: Number(metric.analyzedCount),
                      favorableCount: Number(metric.favorableCount),
                      unfavorableCount: Number(metric.unfavorableCount),
                      partialCount: Number(metric.partialCount),
                      agreementCount: Number(metric.agreementCount),
                      methodologyVersion: "atlas-thesis-metrics-v1",
                      sampleDefinition: metric.sampleDefinition,
                      coverageNote: metric.coverageNote,
                      sourceStatus: metric.sourceStatus,
                    })
                  }
                >
                  {addMetric.isPending ? "Registrando…" : "Adicionar métrica"}
                </button>
              </article>
            </section>
          )}

          {tab === "review" && (
            <section className="split">
              <article className="card">
                <div className="card-top">
                  <h2>Quatro gates humanos</h2>
                  <ShieldCheck size={18} />
                </div>
                <p>Cada aprovação deve ser feita por conta distinta e em ordem.</p>
                <label className="field">
                  <span>Nota da revisão</span>
                  <textarea value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} placeholder="O que foi conferido nesta etapa." />
                </label>
                <div className="list">
                  {THESIS_REVIEW_STAGES.map((stage) => {
                    const step = current.reviews.find((x) => x.stage === stage);
                    const pending = step?.status !== "approved" && step?.status !== "rejected";
                    return (
                      <div className="list-item" key={stage}>
                        <b>{stageLabel[stage]}</b>
                        <p>Status: {step?.status ?? "pending"}</p>
                        {pending && (
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {THESIS_REVIEW_DECISIONS.map((decision) => (
                              <button
                                key={decision}
                                className="button secondary"
                                disabled={review.isPending || reviewNote.trim().length < 3}
                                onClick={() => setPendingAction({ kind: "review", stage, decision })}
                              >
                                {decision === "approved" ? <CheckCircle2 size={13} /> : decision === "rejected" ? <XCircle size={13} /> : <RefreshCw size={13} />}
                                {reviewDecisionLabel(decision)}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </article>

              <article className="card">
                <h2>Status editorial</h2>
                <label className="field">
                  <span>Destino</span>
                  <select value={statusTarget} onChange={(e) => setStatusTarget(e.target.value as ThesisLifecycleStatus)}>
                    {THESIS_LIFECYCLE_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {lifecycleLabel(s)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Motivo da transição</span>
                  <textarea value={transitionNote} onChange={(e) => setTransitionNote(e.target.value)} placeholder="Por que o status muda agora." />
                </label>
                <button className="button" disabled={transition.isPending || transitionNote.trim().length < 3} onClick={() => setPendingAction({ kind: "transition", target: statusTarget })}>
                  {transition.isPending ? "Alterando…" : "Alterar status"}
                </button>
                <div className="notice warn" style={{ marginTop: 12 }}>
                  <BookOpenCheck size={15} /> `validated` e `contested` só passam se backend confirmar quatro revisores distintos, fundamento oficial, precedente oficial e score da versão. `contested` exige contratese.
                </div>
              </article>
            </section>
          )}
        </>
      )}

      <ConfirmDialog
        open={pendingAction !== null}
        pending={anyPending}
        danger={pendingAction?.kind === "review" && pendingAction.decision !== "approved"}
        title={
          pendingAction?.kind === "review"
            ? `${reviewDecisionLabel(pendingAction.decision)} etapa: ${stageLabel[pendingAction.stage]}`
            : pendingAction?.kind === "transition"
              ? `Alterar status para ${lifecycleLabel(pendingAction.target)}`
              : "Abrir nova versão"
        }
        description={
          pendingAction?.kind === "review"
            ? "Fica registrado como decisão sua, com conta distinta exigida na etapa seguinte. Não pode ser desfeito por aqui."
            : pendingAction?.kind === "transition"
              ? "Pode tornar a tese pública, dependendo do destino escolhido. Confirme antes de prosseguir."
              : "A versão corrente é congelada e uma nova é aberta a partir dela, reiniciando os quatro gates."
        }
        confirmLabel={pendingAction?.kind === "review" ? reviewDecisionLabel(pendingAction.decision) : "Confirmar"}
        onConfirm={confirmPendingAction}
        onCancel={() => setPendingAction(null)}
      />
    </main>
  );
}
