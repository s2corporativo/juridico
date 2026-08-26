import { trpc } from "@/lib/trpc";
import {
  ArrowLeft, ArrowUpRight, BookMarked, Boxes, CheckCircle2, CircleAlert,
  Database, FileSearch, Landmark, Scale, Search, ShieldCheck, Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";

const sourceLabel: Record<string, string> = {
  official_confirmed: "Fonte oficial confirmada",
  official_without_number: "Fonte oficial sem número CNJ",
  attachment_reviewed: "Anexo revisado",
  secondary_pending: "Fonte secundária pendente",
  movement_observed: "Movimento observado",
  search_thematic: "Busca temática",
};

function formatDate(value: Date | string | null) {
  if (!value) return "Data não informada";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(value));
}

export default function CompendiumPage() {
  const overview = trpc.compendium.overview.useQuery();
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("Todas");

  const snapshot = overview.data;
  const areas = useMemo(
    () => ["Todas", ...Array.from(new Set(snapshot?.decisions.map(item => item.legalArea).filter((value): value is string => Boolean(value)) ?? []))],
    [snapshot],
  );
  const decisions = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("pt-BR");
    return (snapshot?.decisions ?? []).filter(item => {
      const matchesArea = area === "Todas" || item.legalArea === area;
      const haystack = [item.theme, item.reasoningSummary, item.tribunal, item.city, item.cnjNumber, item.legalArea].filter(Boolean).join(" ").toLocaleLowerCase("pt-BR");
      return matchesArea && (!q || haystack.includes(q));
    });
  }, [snapshot, query, area]);
  const sourcesById = useMemo(() => new Map((snapshot?.sources ?? []).map(source => [source.id, source])), [snapshot]);
  const topicMap = useMemo(() => new Map((snapshot?.topics ?? []).map(topic => [topic.id, topic])), [snapshot]);

  if (overview.isLoading) {
    return <main className="compendium-loading"><Database size={24} /><p>Carregando o acervo auditável…</p></main>;
  }
  if (overview.isError || !snapshot) {
    return <main className="compendium-loading error"><CircleAlert size={24} /><p>O Compêndio não pôde carregar a base auditável.</p></main>;
  }

  const officialCount = snapshot.decisions.filter(item => item.sourceStatus === "official_confirmed").length;
  const sourceCount = snapshot.sources.length;
  const selectedTopics = new Map(snapshot.topicLinks.map(link => [link.jurisprudenceId, topicMap.get(link.topicId)?.title ?? "Tema não classificado"]));

  return (
    <div className="compendium-shell">
      <aside className="compendium-rail">
        <a className="compendium-brand" href="/">
          <span className="brand-crest"><Scale size={20} /></span>
          <span><small>Atlas Forense · JEC</small><strong>Compêndio<br />Jurídico</strong></span>
        </a>
        <div className="compendium-rail-copy">
          <span className="eyebrow">MÓDULO DO ATLAS FORENSE</span>
          <p>Taxonomia, teses e jurisprudência com status de evidência explícito.</p>
        </div>
        <nav className="compendium-nav" aria-label="Navegação do compêndio">
          <a href="#panorama"><span>01</span>Panorama</a>
          <a href="#jurisprudencia"><span>02</span>Jurisprudência</a>
          <a href="#teses"><span>03</span>Teses</a>
          <a href="#taxonomia"><span>04</span>Taxonomia</a>
          <a href="#auditoria"><span>05</span>Auditoria</a>
        </nav>
        <div className="compendium-rail-foot"><ShieldCheck size={16} /><p>Sem partes, CPF, endereço ou documento pessoal no modelo público.</p></div>
      </aside>

      <main className="compendium-main">
        <header className="compendium-topbar">
          <a href="/" className="back-to-atlas"><ArrowLeft size={16} /> Atlas JEC</a>
          <div className="topbar-proof"><CheckCircle2 size={15} /> lote com proveniência registrada</div>
        </header>

        <section className="compendium-hero" id="panorama">
          <div>
            <span className="eyebrow">ATLAS FORENSE · MÓDULO 02 / COMPÊNDIO JURÍDICO</span>
            <h1>Direito organizado por <em>evidência</em>, não por promessas.</h1>
            <p>Uma camada estruturada para conectar áreas, temas, teses, julgados e fontes. O lote atual é piloto e local; a arquitetura é nacional e preparada para expansão auditável.</p>
            <span className="scope-chip"><CircleAlert size={13} /> Escopo vigente: piloto local · TJMG</span>
          </div>
          <div className="compendium-hero-stamp"><Landmark size={22} /><span>MODELO<br />RASTREÁVEL</span><b>v1</b></div>
        </section>

        <section className="compendium-metrics" aria-label="Indicadores do acervo">
          <article><span>Julgados no lote</span><strong>{snapshot.decisions.length}</strong><small>Metadados públicos importados</small></article>
          <article><span>Fontes oficiais</span><strong>{officialCount}/{sourceCount}</strong><small>URLs de origem registradas</small></article>
          <article><span>Temas mapeados</span><strong>{snapshot.topics.length}</strong><small>Taxonomia inicial versionada</small></article>
          <article><span>Teses estruturadas</span><strong>{snapshot.theses.length}</strong><small>Leitura condicionada à prova</small></article>
        </section>

        <section className="compendium-search-panel" id="jurisprudencia">
          <div className="search-heading"><FileSearch size={20} /><div><span>JURISPRUDÊNCIA · FONTE PRIMÁRIA</span><h2>Pesquise o acervo validado</h2><small>Tipo de evidência: julgados com metadados públicos e vínculo de proveniência.</small></div></div>
          <div className="compendium-search-controls">
            <label><Search size={17} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Tema, tribunal, cidade ou número CNJ" aria-label="Pesquisar no acervo" /></label>
            <select value={area} onChange={event => setArea(event.target.value)} aria-label="Filtrar área jurídica">
              {areas.map(item => <option key={item} value={item}>{item}</option>)}
            </select>
            <span>{decisions.length} {decisions.length === 1 ? "resultado" : "resultados"}</span>
          </div>
          <div className="decision-grid">
            {decisions.map(decision => {
              const source = sourcesById.get(decision.sourceId);
              return <article className="decision-card" key={decision.id}>
                <div className="decision-meta"><span>{decision.tribunal} · {decision.city ?? "Origem não informada"}</span><i className={decision.sourceStatus === "official_confirmed" ? "official" : "review"}>{sourceLabel[decision.sourceStatus] ?? decision.sourceStatus}</i></div>
                <h3>{decision.theme ?? "Tema não classificado"}</h3>
                <p>{decision.reasoningSummary ?? "Sem resumo público disponível."}</p>
                <dl>
                  <div><dt>Decisão</dt><dd>{formatDate(decision.decisionDate)}</dd></div>
                  <div><dt>Resultado</dt><dd>{decision.outcomeAppeal ?? decision.outcomeOrigin ?? "Não informado"}</dd></div>
                  <div><dt>Classificação</dt><dd>{selectedTopics.get(decision.id) ?? decision.legalArea ?? "Em revisão"}</dd></div>
                </dl>
                <div className="decision-foot"><code>{decision.cnjNumber ?? decision.externalId}</code>{source?.sourceUrl && <a href={source.sourceUrl} target="_blank" rel="noreferrer">Fonte oficial <ArrowUpRight size={14} /></a>}</div>
              </article>;
            })}
            {decisions.length === 0 && <div className="compendium-empty">Nenhum registro corresponde aos filtros. Remova um termo ou selecione outra área.</div>}
          </div>
        </section>

        <section className="compendium-columns" id="teses">
          <article className="thesis-card">
            <div className="section-label"><BookMarked size={19} /><span>BANCO DE TESES</span></div>
            <h2>Teses não são atalhos. São hipóteses com condições explícitas.</h2>
            <p className="method-subheader">Tipo de evidência: síntese temática condicionada à prova e à leitura do inteiro teor.</p>
            <div className="thesis-list">
              {snapshot.theses.map(thesis => <div key={thesis.id} className="thesis-row"><span className={`position ${thesis.position}`}>{thesis.position.replace("_", " ")}</span><h3>{thesis.title}</h3><p>{thesis.description}</p><small><b>Prova:</b> {thesis.proofNotes ?? "A conferir"}</small><small><b>Fator adverso:</b> {thesis.adverseFacts ?? "A conferir"}</small></div>)}
            </div>
          </article>
          <article className="taxonomy-card" id="taxonomia">
            <div className="section-label"><Boxes size={19} /><span>TAXONOMIA</span></div>
            <h2>Navegação por área, instituto e tema.</h2>
            <p className="method-subheader">Tipo de evidência: classificação versionada do acervo, sem inferência estatística.</p>
            <div className="topic-tree">
              {snapshot.topics.map(topic => <div key={topic.id} className={`topic-node level-${topic.kind}`}><span>{topic.kind}</span><strong>{topic.title}</strong><p>{topic.summary}</p></div>)}
            </div>
          </article>
        </section>

        <section className="audit-section" id="auditoria">
          <div><span className="eyebrow">CADEIA DE CUSTÓDIA</span><h2>Todo lote precisa dizer de onde veio, o que entrou e o que ficou de fora.</h2><p>O acervo importado é mantido como piloto de Betim, Contagem e Belo Horizonte. Ele não é usado para inferências nacionais ou estatísticas por estrato.</p></div>
          <div className="audit-list">
            {snapshot.batches.map(batch => <article key={batch.id}><span>{batch.status}</span><strong>{batch.sourceLabel}</strong><p>{batch.itemsImported} importados · {batch.itemsExcluded} excluídos</p><small>{batch.note}</small></article>)}
          </div>
        </section>
      </main>
    </div>
  );
}
