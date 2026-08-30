import { ArrowLeft, BookOpenCheck, CircleAlert, ExternalLink } from "lucide-react";
import { Link, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";

const DOCUMENT_TYPE_LABEL: Record<string, string> = {
  peca: "Peça",
  contrato: "Contrato",
  checklist: "Checklist",
  fluxo: "Fluxo",
  tabela_documentos: "Tabela de documentos",
  triagem: "Triagem",
  prazo: "Prazo",
  doutrina: "Doutrina",
  regra_inteligencia: "Regra de inteligência",
  regras_contratuais: "Regras contratuais",
  argumentacao: "Argumentação",
  jurimetria: "Jurimetria",
};

export default function KnowledgeDocumentDetailPage() {
  const [, params] = useRoute("/base-conhecimento/:kind/:slug");
  const kind = params?.kind === "legislation" ? "legislation" : "knowledge_document";
  const slug = params?.slug ?? "";
  const query = trpc.knowledgeBase.detail.useQuery({ kind, slug }, { enabled: Boolean(slug) });

  if (query.isLoading) return <main className="loading"><BookOpenCheck /> Carregando documento…</main>;
  if (!query.data || query.isError)
    return (
      <main className="page">
        <div className="notice error">
          <CircleAlert /> Documento não encontrado.
        </div>
      </main>
    );

  const { document, chunks, relationships } = query.data;
  const isLegislation = kind === "legislation";
  const doc = document as typeof document & { documentType?: string; norm?: string; provision?: string | null; officialUrl?: string | null; consultedAt?: string | null };

  return (
    <main className="page">
      <Link href="/base-conhecimento" className="health">
        <ArrowLeft size={14} /> Base de Conhecimento
      </Link>
      <section className="hero">
        <div>
          <span className="eyebrow">{isLegislation ? "Legislação" : DOCUMENT_TYPE_LABEL[doc.documentType ?? ""] ?? "Documento"}</span>
          <h1>{doc.title}</h1>
          <div className="tag-row">
            <span className={`status ${doc.sourceStatus === "official_confirmed" ? "official" : "review"}`}>{doc.sourceStatus.replaceAll("_", " ")}</span>
            <span className="tag">{doc.area}</span>
            {"subarea" in doc && doc.subarea ? <span className="tag">{doc.subarea as string}</span> : null}
          </div>
        </div>
      </section>

      {isLegislation && (
        <section className="card">
          <h2>Ficha da norma</h2>
          <dl className="detail-grid">
            <div>
              <dt>Norma</dt>
              <dd>{doc.norm}</dd>
            </div>
            {doc.provision && (
              <div>
                <dt>Dispositivo</dt>
                <dd>{doc.provision}</dd>
              </div>
            )}
            {doc.consultedAt && (
              <div>
                <dt>Data da consulta</dt>
                <dd>{doc.consultedAt}</dd>
              </div>
            )}
          </dl>
          {doc.officialUrl && (
            <p>
              <a href={doc.officialUrl} target="_blank" rel="noreferrer">
                Abrir fonte oficial <ExternalLink size={14} />
              </a>
            </p>
          )}
        </section>
      )}

      <section className="card">
        <h2>Conteúdo</h2>
        <div style={{ whiteSpace: "pre-wrap" }}>{doc.content}</div>
      </section>

      {!isLegislation && chunks.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>Trechos indexados para busca</h2>
          </div>
          <div className="list">
            {chunks.map((c: { id: number; context: string | null; text: string }) => (
              <div className="list-item" key={c.id}>
                {c.context && <b>{c.context}</b>}
                <p>{c.text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {!isLegislation && (relationships.outgoing.length > 0 || relationships.incoming.length > 0) && (
        <section className="split section">
          {relationships.outgoing.length > 0 && (
            <article className="card">
              <h2>Referencia</h2>
              <div className="list">
                {relationships.outgoing.map((r: { id: number; relationType: string; target: { slug: string; title: string } }) => (
                  <Link className="list-item" href={`/base-conhecimento/knowledge_document/${encodeURIComponent(r.target.slug)}`} key={r.id}>
                    <span className="tag">{r.relationType}</span>
                    <p>{r.target.title}</p>
                  </Link>
                ))}
              </div>
            </article>
          )}
          {relationships.incoming.length > 0 && (
            <article className="card">
              <h2>Referenciado por</h2>
              <div className="list">
                {relationships.incoming.map((r: { id: number; relationType: string; source: { slug: string; title: string } }) => (
                  <Link className="list-item" href={`/base-conhecimento/knowledge_document/${encodeURIComponent(r.source.slug)}`} key={r.id}>
                    <span className="tag">{r.relationType}</span>
                    <p>{r.source.title}</p>
                  </Link>
                ))}
              </div>
            </article>
          )}
        </section>
      )}
    </main>
  );
}
