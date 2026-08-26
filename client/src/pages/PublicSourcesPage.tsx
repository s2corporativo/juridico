import { trpc } from "@/lib/trpc";
import { ejcIntegrationManifest } from "@shared/ejc-integration";
import { ArrowLeft, ArrowUpRight, BookOpenCheck, CircleAlert, Database, FileSearch, KeyRound, Landmark, Scale, ShieldCheck, Wifi } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const statusLabel: Record<string, string> = {
  integrated: "integrada",
  ready: "pronta para consulta",
  credential_required: "credencial temporária necessária",
  manual_only: "consulta manual",
  not_integrated: "não integrada",
};

function formatDate(value: Date | string | null) {
  if (!value) return "Sem data no catálogo";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(value));
}

export default function PublicSourcesPage() {
  const sources = trpc.sources.list.useQuery();
  const dataJud = trpc.datajud.status.useQuery();
  const [query, setQuery] = useState("jurisprudência");
  const [deferredQuery, setDeferredQuery] = useState(query);
  const routes = useMemo(() => Object.fromEntries(ejcIntegrationManifest.modules.map(module => [module.key, module.route])) as Record<string, string>, []);
  useEffect(() => {
    const timer = window.setTimeout(() => setDeferredQuery(query), 300);
    return () => window.clearTimeout(timer);
  }, [query]);
  const catalog = trpc.sources.stjCatalog.useQuery({ query: deferredQuery });

  if (sources.isLoading) return <main className="compendium-loading"><Database size={24} /><p>Carregando o catálogo de fontes públicas…</p></main>;
  if (sources.isError || !sources.data) return <main className="compendium-loading error"><CircleAlert size={24} /><p>O catálogo auditável de fontes não pôde ser carregado.</p></main>;

  return <div className="sources-shell">
    <aside className="sources-rail">
      <a className="compendium-brand" href="/"><span className="brand-crest"><Scale size={20} /></span><span><small>Atlas Forense · JEC</small><strong>Fontes<br />Públicas</strong></span></a>
      <div className="sources-rail-copy"><span className="eyebrow">MATRIZ DE FONTE</span><p>O que está integrado, o que depende de credencial e o que exige consulta humana.</p></div>
      <nav className="sources-nav" aria-label="Navegação de fontes públicas"><a href="#matriz"><span>01</span>Matriz de fontes</a><a href="#stj"><span>02</span>Catálogo STJ</a><a href="#limites"><span>03</span>Limites de uso</a></nav>
      <div className="sources-rail-foot"><ShieldCheck size={16} /><p>Sem scraping, sem contorno de CAPTCHA e sem publicação automática de conteúdo externo.</p></div>
    </aside>
    <main className="sources-main">
      <header className="sources-topbar"><a href="/estrutura" className="back-to-atlas"><ArrowLeft size={16} /> Estrutura interna</a><a href={routes.compendium} className="sources-compendium-link">Compêndio jurídico <ArrowUpRight size={15} /></a></header>
      <section className="sources-hero"><div><span className="eyebrow">ATLAS FORENSE · FONTES E CONECTORES</span><h1>Conectar dados públicos sem dissolver a <em>proveniência</em>.</h1><p>Cada fonte tem cobertura, termo, credencial e risco próprios. A plataforma torna essas condições visíveis antes de qualquer consulta ou uso jurídico.</p></div><div className="sources-mark"><Wifi size={22} /><span>FONTE<br />PRIMEIRO</span><b>04</b></div></section>
      <section className="sources-matrix" id="matriz"><div className="sources-section-heading"><Landmark size={20} /><div><span>CATÁLOGO INSTITUCIONAL</span><h2>Fontes públicas priorizadas.</h2></div></div><div className="source-card-grid">{sources.data.map(source => <article className="source-card" key={source.id}><div><span className={`source-status ${source.integrationStatus}`}>{source.sourceKey === "cnj-datajud" && dataJud.data ? dataJud.data.label : statusLabel[source.integrationStatus]}</span><small>{source.sourceType}</small></div><h3>{source.label}</h3><p className="source-maintainer">{source.maintainer}</p><p>{source.contentScope}</p><dl><div><dt>Cobertura</dt><dd>{source.coverage}</dd></div><div><dt>Acesso</dt><dd>{source.authentication === "api_key" ? "API Key" : source.authentication === "manual" ? "Consulta humana" : "Sem credencial"}</dd></div></dl><div className="source-links"><a href={source.documentationUrl} target="_blank" rel="noreferrer">Documentação <ArrowUpRight size={13} /></a><a href={source.baseUrl} target="_blank" rel="noreferrer">Fonte <ArrowUpRight size={13} /></a></div><p className="source-note"><b>Uso:</b> {source.usageNote}</p>{source.sourceKey === "cnj-datajud" && dataJud.data && <p className="source-policy"><KeyRound size={13} /> {dataJud.data.storagePolicy}</p>}</article>)}</div></section>
      <section className="stj-section" id="stj"><div className="stj-intro"><span className="eyebrow">CKAN · STJ DADOS ABERTOS</span><h2>Catálogo oficial consultado em tempo real.</h2><p>Esta conexão traz somente metadados do catálogo. Recursos, arquivos e decisões não são importados automaticamente.</p><label><FileSearch size={16} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Termo no catálogo do STJ" aria-label="Pesquisar no catálogo do STJ" /></label></div><div className="stj-results">{catalog.isLoading || query !== deferredQuery ? <p className="catalog-state">Consultando o catálogo oficial…</p> : catalog.isError ? <p className="catalog-state error"><CircleAlert size={16} /> Catálogo indisponível neste momento. Tente novamente; nenhuma fonte foi alterada.</p> : <><div className="catalog-count"><BookOpenCheck size={17} /><span>{catalog.data?.total ?? 0} conjuntos encontrados no catálogo público</span></div>{catalog.data?.entries.length === 0 ? <p className="catalog-state">Nenhum conjunto corresponde ao termo pesquisado no catálogo público.</p> : catalog.data?.entries.map(entry => <article key={entry.id}><div><span>{entry.license}</span><small>{entry.resourceCount} recursos · {entry.formats.join(" · ") || "formato não informado"}</small></div><h3>{entry.title}</h3><p>{entry.summary}</p><footer><time>Atualizado: {formatDate(entry.updatedAt)}</time><a href={entry.catalogUrl} target="_blank" rel="noreferrer">Abrir no STJ <ArrowUpRight size={13} /></a></footer></article>)}</>}</div></section>
      <section className="sources-limit-section" id="limites"><div><span className="eyebrow">LIMITES OPERACIONAIS</span><h2>Fonte pública não é autorização para inferir, automatizar ou publicar sem critério.</h2></div><div><p><KeyRound size={17} /><span><b>DataJud:</b> a consulta será habilitada apenas com chave temporária fornecida em ambiente seguro e com indicação da fonte CNJ/DataJud.</span></p><p><ShieldCheck size={17} /><span><b>Portais sem API documentada:</b> TJMG e fontes equivalentes permanecem em consulta manual; esta versão não usa scraping.</span></p><p><BookOpenCheck size={17} /><span><b>Catálogos abertos:</b> cada recurso do STJ exige conferência de licença, conteúdo e elegibilidade antes da ingestão.</span></p></div></section>
    </main>
  </div>;
}
