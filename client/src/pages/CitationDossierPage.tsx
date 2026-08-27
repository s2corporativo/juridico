import { buildCitationDossierMarkdown } from "@shared/citation-dossier";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, ArrowUpRight, BookMarked, CircleAlert, Download, FileCheck2, FileText, Landmark, Printer, Scale, ShieldCheck } from "lucide-react";
import { useRoute } from "wouter";

function formatDate(value: Date | string | null | undefined) {
  return value ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(value)) : "Não informada";
}

function downloadDossier(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function CitationDossierPage() {
  const [, params] = useRoute("/dossie/:externalId");
  const externalId = params?.externalId ? decodeURIComponent(params.externalId) : "";
  const dossier = trpc.compendium.dossier.useQuery({ externalId }, { enabled: Boolean(externalId) });

  if (dossier.isLoading) return <main className="compendium-loading"><FileText size={24} /><p>Montando o dossiê de citação…</p></main>;
  if (dossier.isError || !dossier.data) return <main className="compendium-loading error"><CircleAlert size={24} /><p>O dossiê não está disponível. Confira o identificador ou retorne à pesquisa.</p><a href="/compendio">Voltar ao Compêndio</a></main>;

  const { record, source, batch, topics, theses, review, events } = dossier.data;
  const markdown = buildCitationDossierMarkdown({
    externalId: record.externalId, cnjNumber: record.cnjNumber, tribunal: record.tribunal, justice: record.justice, city: record.city,
    decisionType: record.decisionType, decisionDate: record.decisionDate, sourceStatus: record.sourceStatus, sourceLabel: source.label,
    sourceUrl: source.sourceUrl, batchKey: batch.batchKey, batchHash: batch.sourceHash, validationNote: record.validationNote,
    topics, theses,
  });

  return <div className="dossier-shell">
    <aside className="compendium-rail"><a className="compendium-brand" href="/"><span className="brand-crest"><Scale size={20} /></span><span><small>Atlas Forense · JEC</small><strong>Dossiê de<br />Citação</strong></span></a><div className="compendium-rail-copy"><span className="eyebrow">FONTE · TESE · AUDITORIA</span><p>Uma ficha exportável de prova, não uma conclusão jurídica automática.</p></div><div className="compendium-rail-foot"><ShieldCheck size={16} /><p>Sem dados pessoais. A fonte oficial e o inteiro teor continuam indispensáveis.</p></div></aside>
    <main className="dossier-main">
      <header className="dossier-topbar"><a href="/compendio" className="back-to-atlas"><ArrowLeft size={16} /> Compêndio jurídico</a><div><button onClick={() => downloadDossier(`dossie-${record.externalId}.md`, markdown)}><Download size={15} /> Baixar Markdown</button><button onClick={() => window.print()}><Printer size={15} /> Imprimir</button></div></header>
      <section className="dossier-hero"><div><span className="eyebrow">DADOS PÚBLICOS · PROVENIÊNCIA EXPLÍCITA</span><h1>Dossiê de <em>citação</em> e evidência.</h1><p>Registro estruturado para localizar a origem, entender a classificação e registrar revisão humana sem confundir síntese com inteiro teor.</p></div><div className={`dossier-status ${record.sourceStatus === "official_confirmed" ? "official" : "review"}`}><Landmark size={20} /><span>{record.sourceStatus.replaceAll("_", " ")}</span></div></section>
      <section className="dossier-grid"><article className="dossier-card"><div className="dossier-label"><FileCheck2 size={17} /> IDENTIFICAÇÃO PÚBLICA</div><h2>{record.theme ?? "Tema não classificado"}</h2><dl><div><dt>Número / identificação</dt><dd>{record.cnjNumber ?? record.externalId}</dd></div><div><dt>Tribunal / justiça</dt><dd>{record.tribunal} · {record.justice}</dd></div><div><dt>Comarca / cidade</dt><dd>{record.comarca ?? record.city ?? "Não informada"}</dd></div><div><dt>Decisão</dt><dd>{record.decisionType} · {formatDate(record.decisionDate)}</dd></div></dl><p>{record.reasoningSummary ?? "Sem resumo público catalogado."}</p></article><article className="dossier-card provenance"><div className="dossier-label"><Landmark size={17} /> PROVENIÊNCIA</div><h2>De onde veio este registro.</h2><dl><div><dt>Fonte</dt><dd>{source.label}</dd></div><div><dt>Status</dt><dd>{source.publicStatus.replaceAll("_", " ")}</dd></div><div><dt>Lote</dt><dd>{batch.batchKey}</dd></div><div><dt>Hash do lote</dt><dd>{batch.sourceHash ?? "Não informado"}</dd></div></dl>{source.sourceUrl && <a className="official-source-link" href={source.sourceUrl} target="_blank" rel="noreferrer">Abrir fonte registrada <ArrowUpRight size={15} /></a>}<small>{record.validationNote ?? source.note ?? "Conferir inteiro teor e fonte oficial antes de citar."}</small></article></section>
      <section className="dossier-grid"><article className="dossier-card"><div className="dossier-label"><BookMarked size={17} /> TAXONOMIA E TESES</div><h2>Classificação, não atalho decisório.</h2><div className="dossier-tags">{topics.length ? topics.map(topic => <span key={topic.id}>{topic.pathKey}</span>) : <span>Sem taxonomia vinculada</span>}</div><div className="dossier-theses">{theses.length ? theses.map(thesis => <article key={thesis.id}><b>{thesis.position.replaceAll("_", " ")}</b><p>{thesis.title}</p></article>) : <p>Nenhuma tese relacionada foi catalogada.</p>}</div></article><article className="dossier-card"><div className="dossier-label"><ShieldCheck size={17} /> REVISÃO HUMANA</div><h2>{review ? review.status.replaceAll("_", " ") : "Ainda não enfileirado"}</h2><p>{review?.requestedReason ?? "O registro ainda não ingressou na fila de curadoria."}</p>{review?.decisionNote && <blockquote>{review.decisionNote}</blockquote>}<div className="dossier-audit-events">{events.length ? events.map(event => <p key={event.id}><b>{event.action.replaceAll("_", " ")}</b><span>{formatDate(event.createdAt)}</span><small>{event.note}</small></p>) : <p>Sem decisão de revisão registrada.</p>}</div></article></section>
      <section className="dossier-warning"><CircleAlert size={20} /><p><b>Limite profissional:</b> este dossiê não substitui o inteiro teor, a confirmação da fonte, a adequação do precedente ao caso concreto ou a revisão humana antes de qualquer uso jurídico.</p></section>
    </main>
  </div>;
}
