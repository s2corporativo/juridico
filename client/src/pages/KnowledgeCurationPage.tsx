import { AlertTriangle, CheckCircle2, ClipboardCheck, RefreshCw, ShieldAlert, Upload } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useToast } from "@/components/Toast";

const SEVERITY_CLASS: Record<string, string> = { OK: "success", INFO: "", AVISO: "warn", ERRO: "error" };

export default function KnowledgeCurationPage() {
  const toast = useToast();
  const stats = trpc.knowledgeBase.stats.useQuery();
  const audit = trpc.knowledgeBase.admin.audit.useMutation({
    onSuccess: (data) => toast.success(`Auditoria concluída — score ${data.score}/100.`),
    onError: (error) => toast.error(error.message),
  });

  const [batchKey, setBatchKey] = useState("");
  const [raw, setRaw] = useState("[]");
  const [parseError, setParseError] = useState<string | null>(null);
  const preview = trpc.knowledgeBase.admin.ingestionPreview.useMutation({
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

  return (
    <main className="page">
      <section className="hero">
        <div>
          <span className="eyebrow">Curadoria · Base de Conhecimento</span>
          <h1>
            Auditoria de integridade <em>reexecutável</em>.
          </h1>
          <p>
            {stats.data?.documents ?? "—"} documentos · {stats.data?.legislation ?? "—"} normas de legislação · {stats.data?.chunks ?? "—"} trechos indexados.
          </p>
        </div>
      </section>

      <section className="split">
        <article className="card">
          <div className="card-top">
            <b>Auditoria de curadoria</b>
            <ShieldAlert size={17} />
          </div>
          <p>Varredura de LGPD, coerência entre fonte oficial declarada e domínio real, duplicidade semântica e saúde do RAG. Leitura apenas — nunca altera a base.</p>
          <button className="button" disabled={audit.isPending} onClick={() => audit.mutate()}>
            <RefreshCw size={14} /> {audit.isPending ? "Auditando…" : "Auditar agora"}
          </button>

          {audit.data && (
            <div style={{ marginTop: 16 }}>
              <div className={`notice ${audit.data.score >= 85 ? "success" : audit.data.score >= 55 ? "warn" : "error"}`}>
                <ShieldAlert size={16} />
                <span>
                  Score {audit.data.score}/100 — {audit.data.verdict}
                </span>
              </div>
              <div className="list" style={{ marginTop: 12 }}>
                {audit.data.sections.map((section) => (
                  <div className="list-item" key={section.name}>
                    <div className="card-top">
                      <b>{section.name}</b>
                      <span className={`status ${section.status === "ERRO" ? "review" : section.status === "AVISO" ? "review" : "validated"}`}>{section.status}</span>
                    </div>
                    {section.findings.length === 0 ? (
                      <p>Nenhum achado.</p>
                    ) : (
                      section.findings.map((f) => (
                        <div className={`notice ${SEVERITY_CLASS[f.severity]}`} key={f.code} style={{ marginTop: 8 }}>
                          <AlertTriangle size={14} />
                          <div>
                            <b>
                              [{f.code}] {f.title} — {f.total}
                            </b>
                            <p>{f.detail}</p>
                            {f.examples.length > 0 && <small>{f.examples.join(" · ")}</small>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>

        <article className="card">
          <div className="card-top">
            <b>Pré-validar ingestão</b>
            <Upload size={17} />
          </div>
          <div className="notice warn" style={{ margin: "12px 0" }}>
            <AlertTriangle size={16} /> Nenhuma gravação é feita nesta etapa.
          </div>
          <label className="field">
            <span>Chave do lote</span>
            <input value={batchKey} onChange={(e) => setBatchKey(e.target.value)} placeholder="LOTE-030" />
          </label>
          <label className="field">
            <span>Candidatos JSON</span>
            <textarea value={raw} onChange={(e) => setRaw(e.target.value)} placeholder='[{"slug":"...","documentType":"peca","area":"ambiental","sourceStatus":"editorial_review"}]' />
          </label>
          <button className="button" disabled={!batchKey.trim() || preview.isPending} onClick={runPreview}>
            <ClipboardCheck size={14} /> {preview.isPending ? "Validando…" : "Executar pré-validação"}
          </button>
          {parseError && <div className="notice error">{parseError}</div>}
          {preview.data && (
            <div className="list" style={{ marginTop: 12 }}>
              <p>
                {preview.data.accepted}/{preview.data.total} aceitos
              </p>
              {preview.data.items.map((item) => (
                <div className="list-item" key={item.slug}>
                  <CheckCircle2 size={14} style={{ opacity: item.accepted ? 1 : 0.3 }} />
                  <b>{item.slug}</b>
                  <p>{item.accepted ? "Elegível para ingestão." : item.reasons.join(" ")}</p>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
    </main>
  );
}
