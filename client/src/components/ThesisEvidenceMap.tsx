import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { ArrowRight, BookMarked, Boxes, CheckCircle2, CircleAlert, Download, ExternalLink, FileText, Loader2, Network, Scale, X } from "lucide-react";
import { useRef, useState } from "react";
import { trpc } from "@/lib/trpc";

type Thesis = { id: number; title: string; description: string; proofNotes?: string | null; adverseFacts?: string | null };
type Topic = { id: number; title: string; summary: string | null; kind: string };
type Props = { query: string; theses: Thesis[]; topics: Topic[] };

const statusLabels: Record<string, string> = { official_confirmed: "Fonte oficial", official_without_number: "Fonte oficial sem número", attachment_reviewed: "Anexo revisado", movement_observed: "Movimento observado", search_thematic: "Busca temática", secondary_pending: "Fonte secundária pendente" };

export default function ThesisEvidenceMap({ query, theses, topics }: Props) {
  const normalized = query.trim().toLocaleLowerCase("pt-BR");
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedThesisId, setSelectedThesisId] = useState<number | null>(null);
  const [expandedTopicId, setExpandedTopicId] = useState<number | null>(null);
  const [exporting, setExporting] = useState<"png" | "pdf" | null>(null);
  const related = trpc.compendium.thesisRelated.useQuery({ thesisId: selectedThesisId ?? 0 }, { enabled: selectedThesisId !== null });

  if (normalized.length < 3) return null;
  const matchingTheses = theses.filter(thesis => `${thesis.title} ${thesis.description} ${thesis.proofNotes ?? ""}`.toLocaleLowerCase("pt-BR").includes(normalized));
  const matchingTopics = topics.filter(topic => `${topic.title} ${topic.summary ?? ""}`.toLocaleLowerCase("pt-BR").includes(normalized));
  const selectedThesis = theses.find(thesis => thesis.id === selectedThesisId);

  const exportMap = async (format: "png" | "pdf") => {
    if (!mapRef.current) return;
    setExporting(format);
    try {
      const dataUrl = await toPng(mapRef.current, { cacheBust: true, pixelRatio: 2, backgroundColor: "#f5f1e8" });
      const link = document.createElement("a");
      if (format === "png") {
        link.download = "atlas-mapa-tese.png";
        link.href = dataUrl;
        link.click();
      } else {
        const image = new Image();
        image.src = dataUrl;
        await new Promise<void>(resolve => { image.onload = () => resolve(); });
        const pdf = new jsPDF({ orientation: image.width >= image.height ? "landscape" : "portrait", unit: "px", format: [image.width, image.height] });
        pdf.addImage(dataUrl, "PNG", 0, 0, image.width, image.height, undefined, "FAST");
        pdf.save("atlas-mapa-tese.pdf");
      }
    } finally {
      setExporting(null);
    }
  };

  return (
    <section className="thesis-evidence-map" aria-labelledby="thesis-map-title">
      <div className="thesis-map-heading"><div><span className="eyebrow">MAPA DE EVIDÊNCIA · PESQUISA CONTEXTUAL</span><h2 id="thesis-map-title">Contexto da tese pesquisada</h2><p>Selecione uma tese para abrir julgados relacionados já catalogados. O mapa não calcula relevância, força vinculante ou chance de êxito.</p></div><div className="thesis-map-actions"><button type="button" onClick={() => void exportMap("png")} disabled={exporting !== null} title="Baixar mapa como imagem"><Download size={15} /> {exporting === "png" ? "Gerando…" : "Imagem"}</button><button type="button" onClick={() => void exportMap("pdf")} disabled={exporting !== null} title="Baixar mapa como PDF"><Download size={15} /> {exporting === "pdf" ? "Gerando…" : "PDF"}</button><Network size={22} /></div></div>
      <div className="thesis-map-export-note">Exportação: inclui pesquisa, nós visíveis, filtros contextuais e esta nota metodológica. Não inclui dados individuais não catalogados.</div>
      <div className="thesis-map-canvas" ref={mapRef}>
        <div className="thesis-map-node thesis-map-query"><Scale size={16} /><span>Pesquisa</span><strong>{query.trim()}</strong></div>
        <ArrowRight className="thesis-map-arrow" size={20} />
        <div className="thesis-map-column"><span className="thesis-map-column-label"><BookMarked size={14} /> Teses catalogadas</span>{matchingTheses.length ? matchingTheses.slice(0, 4).map(thesis => <button type="button" className={`thesis-map-node thesis-map-node-button ${selectedThesisId === thesis.id ? "is-selected" : ""}`} key={thesis.id} onClick={() => setSelectedThesisId(current => current === thesis.id ? null : thesis.id)} aria-expanded={selectedThesisId === thesis.id}><strong>{thesis.title}</strong><small>{thesis.description}</small><span className="thesis-map-node-hint">{selectedThesisId === thesis.id ? "Fechar detalhes" : "Abrir julgados relacionados"}</span></button>) : <div className="thesis-map-empty"><CircleAlert size={15} />Nenhuma tese catalogada corresponde diretamente ao termo.</div>}</div>
        <ArrowRight className="thesis-map-arrow" size={20} />
        <div className="thesis-map-column"><span className="thesis-map-column-label"><Boxes size={14} /> Temas relacionados</span>{matchingTopics.length ? matchingTopics.slice(0, 4).map(topic => <button type="button" className={`thesis-map-node thesis-map-node-button ${expandedTopicId === topic.id ? "is-selected" : ""}`} key={topic.id} onClick={() => setExpandedTopicId(current => current === topic.id ? null : topic.id)} aria-expanded={expandedTopicId === topic.id}><span>{topic.kind}</span><strong>{topic.title}</strong>{expandedTopicId === topic.id && <small>{topic.summary ?? "Resumo não informado no catálogo público."}</small>}</button>) : <div className="thesis-map-empty"><CircleAlert size={15} />Sem vínculo temático direto confirmado.</div>}</div>
      </div>
      {selectedThesis && <aside className="thesis-map-detail" aria-live="polite"><div className="thesis-map-detail-head"><div><span className="eyebrow">DETALHE DO NÓ · TESE CATALOGADA</span><h3>{selectedThesis.title}</h3></div><button type="button" onClick={() => setSelectedThesisId(null)} aria-label="Fechar detalhes"><X size={17} /></button></div><p>{selectedThesis.description}</p><dl className="thesis-map-detail-notes"><div><dt>Prova</dt><dd>{selectedThesis.proofNotes ?? "A conferir no dossiê."}</dd></div><div><dt>Fator adverso</dt><dd>{selectedThesis.adverseFacts ?? "A conferir no dossiê."}</dd></div></dl><div className="thesis-related-heading"><span><FileText size={15} /> Documentos relacionados</span><small>{related.data?.length ?? 0} vínculo(s) público(s)</small></div>{related.isLoading ? <div className="thesis-map-loading"><Loader2 size={16} className="animate-spin" /> Carregando vínculos catalogados…</div> : related.isError ? <div className="thesis-map-empty"><CircleAlert size={15} />Os documentos relacionados não puderam ser carregados.</div> : related.data?.length ? <div className="thesis-related-list">{related.data.map(document => <article key={document.id}><div><span className="thesis-related-meta">{document.stance === "supports" ? "Apoia" : document.stance === "opposes" ? "Contrapõe" : "Contextualiza"} · {statusLabels[document.sourceStatus] ?? document.sourceStatus}</span><strong>{document.title ?? "Julgado sem tema informado"}</strong><small>{document.tribunal} · {document.city ?? "Cidade não informada"} · {document.decisionType}</small></div><a href={`/dossie/${encodeURIComponent(document.externalId)}`} aria-label={`Abrir dossiê de ${document.title ?? "julgado"}`}><ExternalLink size={15} /></a></article>)}</div> : <div className="thesis-map-empty"><CircleAlert size={15} />Nenhum documento relacionado foi catalogado para esta tese.</div>}<div className="thesis-map-detail-foot"><CheckCircle2 size={14} /> Vínculos exibidos somente quando registrados no acervo público.</div></aside>}
      <small className="thesis-map-note">Limite: a pesquisa textual não substitui a leitura do dossiê, da fonte oficial e do inteiro teor.</small>
    </section>
  );
}
