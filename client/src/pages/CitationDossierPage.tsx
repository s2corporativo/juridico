import { ArrowLeft, Check, CircleAlert, Copy, Download, FileText, Landmark, Printer, ShieldCheck } from "lucide-react";
import { useRoute } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { buildCitationDossierMarkdown } from "@shared/citation-dossier";
import { buildPublicCitationReference } from "@shared/citation-reference";

function formatDate(value: Date | string | null | undefined) {
  return value ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(value)) : "Não informada";
}

function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

async function copyText(content: string) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(content);
  const textarea = document.createElement("textarea");
  textarea.value = content;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

export default function CitationDossierPage() {
  const [, params] = useRoute("/dossie/:externalId");
  const externalId = params?.externalId ? decodeURIComponent(params.externalId) : "";
  const dossier = trpc.compendium.dossier.useQuery({ externalId }, { enabled: Boolean(externalId) });
  const [copied, setCopied] = useState(false);

  if (dossier.isLoading) return <main className="loading"><FileText size={20}/> Montando dossiê…</main>;
  if (dossier.isError || !dossier.data) return <main className="page"><div className="notice error"><CircleAlert size={18}/> Dossiê não disponível.</div></main>;

  const { record, source, batch, topics, theses, review, events } = dossier.data;
  const markdown = buildCitationDossierMarkdown({
    externalId: record.externalId,
    cnjNumber: record.cnjNumber,
    tribunal: record.tribunal,
    justice: record.justice,
    city: record.city,
    decisionType: record.decisionType,
    decisionDate: record.decisionDate,
    sourceStatus: record.sourceStatus,
    sourceLabel: source.label,
    sourceUrl: source.sourceUrl,
    batchKey: batch.batchKey,
    batchHash: batch.sourceHash,
    validationNote: record.validationNote,
    topics,
    theses,
  });
  const reference = buildPublicCitationReference({
    theme: record.theme,
    tribunal: record.tribunal,
    cnjNumber: record.cnjNumber,
    externalId: record.externalId,
    decisionDate: record.decisionDate,
    sourceUrl: source.sourceUrl,
  });

  return <main className="dossier">
    <header className="dossier-header">
      <a href="/compendio" className="health"><ArrowLeft size={14}/> Compêndio</a>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        <button className="button secondary" onClick={async()=>{await copyText(reference);setCopied(true);setTimeout(()=>setCopied(false),2000)}}>{copied?<Check size={14}/>:<Copy size={14}/>} {copied?"Copiado":"Copiar referência"}</button>
        <button className="button secondary" onClick={()=>downloadText(`dossie-${record.externalId}.md`,markdown)}><Download size={14}/> Markdown</button>
        <button className="button secondary" onClick={()=>window.print()}><Printer size={14}/> Imprimir</button>
      </div>
    </header>
    <span className="eyebrow">DADOS PÚBLICOS · PROVENIÊNCIA EXPLÍCITA</span>
    <h1 className="dossier-title">Dossiê de citação e evidência</h1>
    <div className="notice"><ShieldCheck size={17}/> A projeção pública não expõe IDs de revisores, responsáveis, motivo interno nem notas administrativas livres.</div>

    <section className="split section">
      <article className="dossier-card"><h2>{record.theme ?? "Tema não classificado"}</h2><dl><div><dt>Número</dt><dd>{record.cnjNumber ?? record.externalId}</dd></div><div><dt>Tribunal</dt><dd>{record.tribunal} · {record.justice}</dd></div><div><dt>Origem</dt><dd>{record.comarca ?? record.city ?? "Não informada"}</dd></div><div><dt>Decisão</dt><dd>{record.decisionType} · {formatDate(record.decisionDate)}</dd></div></dl><p>{record.reasoningSummary ?? "Sem resumo público catalogado."}</p></article>
      <article className="dossier-card"><div className="card-top"><b>Proveniência</b><Landmark size={17}/></div><dl><div><dt>Fonte</dt><dd>{source.label}</dd></div><div><dt>Status</dt><dd>{source.publicStatus}</dd></div><div><dt>Lote</dt><dd>{batch.batchKey}</dd></div><div><dt>Hash</dt><dd>{batch.sourceHash ?? "Não informado"}</dd></div></dl>{source.sourceUrl&&<a href={source.sourceUrl} target="_blank" rel="noreferrer">Abrir fonte registrada →</a>}</article>
    </section>

    <section className="split section">
      <article className="dossier-card"><h2>Taxonomia e teses</h2><div className="tag-row">{topics.length?topics.map(topic=><span className="tag" key={topic.id}>{topic.pathKey}</span>):<span className="tag">Sem taxonomia</span>}</div><div className="list" style={{marginTop:12}}>{theses.length?theses.map(thesis=><div className="list-item" key={thesis.id}><span className="status">{thesis.position}</span><p><b>{thesis.title}</b></p></div>):<p>Nenhuma tese relacionada foi catalogada.</p>}</div></article>
      <article className="dossier-card"><h2>Revisão humana</h2><p><b>{review?.status ?? "Ainda não enfileirado"}</b></p><p>{review?.requestedReason ?? "Sem revisão pública registrada."}</p>{review?.decisionNote&&<p>{review.decisionNote}</p>}<div className="list">{events.map(event=><div className="list-item" key={event.id}><b>{event.action}</b><p>{formatDate(event.createdAt)} · {event.note ?? "Sem nota pública."}</p></div>)}</div></article>
    </section>
    <div className="notice warn section"><CircleAlert size={17}/> Este dossiê não substitui inteiro teor, confirmação de fonte, adequação do precedente nem revisão profissional.</div>
  </main>;
}
