import { ArrowRight, BookMarked, Boxes, CircleAlert, Network, Scale } from "lucide-react";

type Thesis = { id: number; title: string; description: string; proofNotes?: string | null; adverseFacts?: string | null };
type Topic = { id: number; title: string; summary: string | null; kind: string };

type Props = { query: string; theses: Thesis[]; topics: Topic[] };

export default function ThesisEvidenceMap({ query, theses, topics }: Props) {
  const normalized = query.trim().toLocaleLowerCase("pt-BR");
  if (normalized.length < 3) return null;
  const matchingTheses = theses.filter(thesis => `${thesis.title} ${thesis.description} ${thesis.proofNotes ?? ""}`.toLocaleLowerCase("pt-BR").includes(normalized));
  const matchingTopics = topics.filter(topic => `${topic.title} ${topic.summary ?? ""}`.toLocaleLowerCase("pt-BR").includes(normalized));

  return (
    <section className="thesis-evidence-map" aria-labelledby="thesis-map-title">
      <div className="thesis-map-heading"><div><span className="eyebrow">MAPA DE EVIDÊNCIA · PESQUISA CONTEXTUAL</span><h2 id="thesis-map-title">Contexto da tese pesquisada</h2><p>O mapa mostra somente vínculos taxonômicos existentes no acervo. Ele não calcula relevância, força vinculante ou chance de êxito.</p></div><Network size={22} /></div>
      <div className="thesis-map-canvas">
        <div className="thesis-map-node thesis-map-query"><Scale size={16} /><span>Pesquisa</span><strong>{query.trim()}</strong></div>
        <ArrowRight className="thesis-map-arrow" size={20} />
        <div className="thesis-map-column"><span className="thesis-map-column-label"><BookMarked size={14} /> Teses catalogadas</span>{matchingTheses.length ? matchingTheses.slice(0, 4).map(thesis => <div className="thesis-map-node" key={thesis.id}><strong>{thesis.title}</strong><small>{thesis.description}</small></div>) : <div className="thesis-map-empty"><CircleAlert size={15} />Nenhuma tese catalogada corresponde diretamente ao termo.</div>}</div>
        <ArrowRight className="thesis-map-arrow" size={20} />
        <div className="thesis-map-column"><span className="thesis-map-column-label"><Boxes size={14} /> Temas relacionados</span>{matchingTopics.length ? matchingTopics.slice(0, 4).map(topic => <div className="thesis-map-node" key={topic.id}><span>{topic.kind}</span><strong>{topic.title}</strong></div>) : <div className="thesis-map-empty"><CircleAlert size={15} />Sem vínculo temático direto confirmado.</div>}</div>
      </div>
      <small className="thesis-map-note">Limite: a pesquisa textual não substitui a leitura do dossiê, da fonte oficial e do inteiro teor.</small>
    </section>
  );
}
