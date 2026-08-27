import { trpc } from "@/lib/trpc";
import {
  ArrowLeft, ArrowUpRight, BookMarked, Boxes, CheckCircle2, CircleAlert,
  Database, FileSearch, Landmark, Scale, Search, ShieldCheck, Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { buildTopicLabels } from "@shared/compendium-presentation";

const COMPENDIUM_PAGE_SIZE = 12;

const sourceStatuses = ["official_confirmed", "official_without_number", "attachment_reviewed", "secondary_pending", "movement_observed", "search_thematic"] as const;
type SourceStatus = (typeof sourceStatuses)[number];

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
  const [tribunal, setTribunal] = useState("Todos");
  const [city, setCity] = useState("Todas");
  const [sourceStatus, setSourceStatus] = useState<SourceStatus | "Todas">("Todas");
  const [page, setPage] = useState(0);

  const snapshot = overview.data;
  const searchInput = useMemo(() => ({
    query: query.trim() || undefined,
    tribunal: tribunal === "Todos" ? undefined : tribunal,
    city: city === "Todas" ? undefined : city,
    legalArea: area === "Todas" ? undefined : area,
    sourceStatus: sourceStatus === "Todas" ? undefined : sourceStatus,
    page,
    pageSize: COMPENDIUM_PAGE_SIZE,
  }), [query, tribunal, city, area, sourceStatus, page]);
  const search = trpc.compendium.search.useQuery(searchInput);
  const areas = useMemo(
    () => ["Todas", ...(snapshot?.facets.legalAreas ?? [])],
    [snapshot],
  );
  const tribunals = useMemo(() => ["Todos", ...(snapshot?.facets.tribunals ?? [])], [snapshot]);
  const cities = useMemo(() => ["Todas", ...(snapshot?.facets.cities ?? [])], [snapshot]);
  const decisions = search.data?.decisions ?? [];
  const sourcesById = useMemo(() => new Map((search.data?.sources ?? []).map(source => [source.id, source])), [search.data]);
  const topicMap = useMemo(() => new Map((snapshot?.topics ?? []).map(topic => [topic.id, topic])), [snapshot]);

  if (overview.isLoading) {
    return <main className="compendium-loading"><Database size={24} /><p>Carregando o acervo auditável…</p></main>;
  }
  if (overview.isError || !snapshot) {
    return <main className="compendium-loading error"><CircleAlert size={24} /><p>O Compêndio não pôde carregar a base auditável.</p></main>;
  }

  const selectedTopics = buildTopicLabels(search.data?.topicLinks ?? [], new Map((snapshot?.topics ?? []).map(topic => [topic.id, topic.title])));
  const totalResults = search.data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(totalResults / COMPENDIUM_PAGE_SIZE));

  const resetPage = () => setPage(0);

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
          <div className="compendium-header-actions"><a href="/fontes">Fontes públicas <ArrowUpRight size={14} /></a><a href="/estrutura">Estrutura interna <ArrowUpRight size={14} /></a><div className="topbar-proof"><CheckCircle2 size={15} /> lote com proveniência registrada</div></div>
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
          <article><span>Julgados no lote</span><strong>{snapshot.metrics.decisionCount}</strong><small>Metadados públicos importados</small></article>
          <article><span>Fontes oficiais</span><strong>{snapshot.metrics.officialSourceCount}/{snapshot.metrics.sourceCount}</strong><small>URLs de origem registradas</small></article>
          <article><span>Temas mapeados</span><strong>{snapshot.topics.length}</strong><small>Taxonomia inicial versionada</small></article>
          <article><span>Teses estruturadas</span><strong>{snapshot.theses.length}</strong><small>Leitura condicionada à prova</small></article>
        </section>

        <section className="compendium-search-panel" id="jurisprudencia">
          <div className="search-heading"><FileSearch size={20} /><div><span>JURISPRUDÊNCIA · FONTE PRIMÁRIA</span><h2>Pesquise o acervo validado</h2><small>Tipo de evidência: julgados com metadados públicos e vínculo de proveniência.</small></div></div>
          <div className="compendium-search-controls">
            <label><Search size={17} /><input value={query} onChange={event => { setQuery(event.target.value); resetPage(); }} placeholder="Tema, tribunal, cidade ou número CNJ" aria-label="Pesquisar no acervo" /></label>
            <select value={tribunal} onChange={event => { setTribunal(event.target.value); resetPage(); }} aria-label="Filtrar tribunal">
              {tribunals.map(item => <option key={item} value={item}>{item}</option>)}
            </select>
            <select value={city} onChange={event => { setCity(event.target.value); resetPage(); }} aria-label="Filtrar cidade">
              {cities.map(item => <option key={item} value={item}>{item}</option>)}
            </select>
            <select value={area} onChange={event => { setArea(event.target.value); resetPage(); }} aria-label="Filtrar área jurídica">
              {areas.map(item => <option key={item} value={item}>{item}</option>)}
            </select>
            <select value={sourceStatus} onChange={event => { setSourceStatus(event.target.value as SourceStatus | "Todas"); resetPage(); }} aria-label="Filtrar situação da fonte">
              <option value="Todas">Todas as fontes</option>
              {sourceStatuses.map(item => <option key={item} value={item}>{sourceLabel[item]}</option>)}
            </select>
            <span>{search.isFetching ? "atualizando…" : `${totalResults} ${totalResults === 1 ? "resultado" : "resultados"}`}</span>
          </div>
          <div className="decision-grid">
            {search.isError ? <div className="compendium-empty error"><CircleAlert size={18} /> A busca não pôde ser concluída. Tente novamente; nenhum dado foi alterado.</div> : decisions.map(decision => {
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
                <div className="decision-foot"><code>{decision.cnjNumber ?? decision.externalId}</code><span><a href={`/dossie/${encodeURIComponent(decision.externalId)}`}>Dossiê <ArrowUpRight size={14} /></a>{source?.sourceUrl && <a href={source.sourceUrl} target="_blank" rel="noreferrer">Fonte oficial <ArrowUpRight size={14} /></a>}</span></div>
              </article>;
            })}
            {!search.isError && decisions.length === 0 && <div className="compendium-empty">Nenhum registro corresponde aos filtros. Remova um termo ou selecione outra área.</div>}
          </div>
          {!search.isError && totalResults > COMPENDIUM_PAGE_SIZE && <div className="compendium-pagination"><button disabled={page === 0} onClick={() => setPage(current => Math.max(0, current - 1))}>Anterior</button><span>Página {page + 1} de {pageCount}</span><button disabled={page + 1 >= pageCount} onClick={() => setPage(current => current + 1)}>Próxima</button></div>}
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
