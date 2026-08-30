import { CircleAlert, Database, FileSearch, Search, ShieldCheck } from "lucide-react";
import { keepPreviousData } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

const SOURCE_STATUSES = ["official_confirmed", "official_without_number", "attachment_reviewed", "secondary_pending", "movement_observed", "search_thematic"] as const;
type SourceStatus = (typeof SOURCE_STATUSES)[number];
const PAGE_SIZE = 12;

export default function CompendiumPage() {
  const overview = trpc.compendium.overview.useQuery();
  const quality = trpc.compendium.quality.useQuery();
  const freshness = trpc.compendium.freshness.useQuery();

  // Filtros e página vivem na URL: o resultado é compartilhável e o botão
  // Voltar do navegador desfaz a última mudança em vez de perder a busca.
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const tribunal = params.get("tribunal") ?? "";
  const area = params.get("area") ?? "";
  const sourceStatus = (params.get("status") as SourceStatus) || "";
  const page = Number(params.get("page") ?? "0") || 0;

  const [qInput, setQInput] = useState(q);
  useEffect(() => setQInput(q), [q]);
  const debouncedQ = useDebouncedValue(qInput, 300);

  function setFilter(patch: Record<string, string>, resetPage = true) {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(patch)) {
          if (value) next.set(key, value);
          else next.delete(key);
        }
        if (resetPage) next.delete("page");
        return next;
      },
      { replace: true },
    );
  }

  useEffect(() => {
    if (debouncedQ !== q) setFilter({ q: debouncedQ });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

  const input = useMemo(
    () => ({ query: q.trim() || undefined, tribunal: tribunal || undefined, legalArea: area || undefined, sourceStatus: sourceStatus || undefined, page, pageSize: PAGE_SIZE }),
    [q, tribunal, area, sourceStatus, page],
  );
  const search = trpc.compendium.search.useQuery(input, { placeholderData: keepPreviousData });

  if (overview.isLoading) return <main className="loading"><Database /> Carregando Compêndio…</main>;
  if (!overview.data || overview.isError) return <main className="page"><div className="notice error"><CircleAlert /> Compêndio indisponível.</div></main>;
  const d = overview.data;

  const total = search.data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="page">
      <section className="hero">
        <div>
          <span className="eyebrow">Compêndio Jurídico</span>
          <h1>
            Direito organizado por <em>evidência</em>, não por promessas.
          </h1>
          <p>Julgados, temas, teses e fontes ficam ligados por proveniência. A ausência de registro no Atlas não indica ausência de processos ou entendimento no tribunal.</p>
        </div>
        <aside className="principle-card">
          <b>
            <ShieldCheck size={16} /> Cobertura atual
          </b>
          <p>
            {d.metrics.decisionCount} julgados · {d.metrics.officialSourceCount}/{d.metrics.sourceCount} fontes oficiais · qualidade média {quality.data?.summary.averageScore ?? "—"}/100.
          </p>
        </aside>
      </section>

      <section className="metrics">
        <article className="metric">
          <span>Julgados</span>
          <strong>{d.metrics.decisionCount}</strong>
        </article>
        <article className="metric">
          <span>Temas</span>
          <strong>{d.topics.length}</strong>
        </article>
        <article className="metric">
          <span>Teses base</span>
          <strong>{d.theses.length}</strong>
        </article>
        <article className="metric">
          <span>Autoridades</span>
          <strong>{d.metrics.authorityCount}</strong>
        </article>
        <article className="metric">
          <span>Revisão documental</span>
          <strong>{freshness.data?.summary.theses.reviewDue ?? "—"}</strong>
        </article>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Jurisprudência</span>
            <h2>Pesquisar acervo</h2>
          </div>
        </div>

        <div className="toolbar">
          <label className="field">
            <span>Busca</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Search size={16} />
              <input style={{ width: "100%" }} value={qInput} onChange={(e) => setQInput(e.target.value)} placeholder="tema ou número CNJ" />
            </div>
          </label>
          <label className="field">
            <span>Tribunal</span>
            <select value={tribunal} onChange={(e) => setFilter({ tribunal: e.target.value })}>
              <option value="">Todos</option>
              {d.facets.tribunals.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Área</span>
            <select value={area} onChange={(e) => setFilter({ area: e.target.value })}>
              <option value="">Todas</option>
              {d.facets.legalAreas.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Situação da fonte</span>
            <select value={sourceStatus} onChange={(e) => setFilter({ status: e.target.value })}>
              <option value="">Todas</option>
              {SOURCE_STATUSES.map((x) => (
                <option key={x} value={x}>
                  {x.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </label>
          <div className="field">
            <span>Resultados</span>
            <b>
              {total || "—"}
              {search.isFetching && !search.isLoading ? " · atualizando…" : ""}
            </b>
          </div>
        </div>

        {search.isError ? (
          <div className="notice error">
            <CircleAlert /> A busca falhou; nenhum dado foi alterado.
          </div>
        ) : search.data && search.data.decisions.length === 0 ? (
          <div className="empty">Nenhum julgado encontrado com estes filtros.</div>
        ) : (
          <div className="cards">
            {search.data?.decisions.map((dec) => (
              <article className="card" key={dec.id}>
                <div className="card-top">
                  <span className={`status ${dec.sourceStatus === "official_confirmed" ? "official" : "review"}`}>{dec.sourceStatus.replaceAll("_", " ")}</span>
                  <FileSearch size={16} />
                </div>
                <h3>{dec.theme ?? "Tema não classificado"}</h3>
                <p>{dec.reasoningSummary ?? "Sem resumo público catalogado."}</p>
                <div className="tag-row">
                  <span className="tag">{dec.tribunal}</span>
                  {dec.city && <span className="tag">{dec.city}</span>}
                  {dec.legalArea && <span className="tag">{dec.legalArea}</span>}
                </div>
                <p>
                  <Link href={`/dossie/${encodeURIComponent(dec.externalId)}`}>Abrir dossiê →</Link>
                </p>
              </article>
            ))}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginTop: 18 }}>
          <button className="button secondary" disabled={page === 0} onClick={() => setFilter({ page: String(Math.max(0, page - 1)) }, false)}>
            Anterior
          </button>
          <span className="tag">
            Página {page + 1} de {pageCount}
          </span>
          <button className="button secondary" disabled={page + 1 >= pageCount} onClick={() => setFilter({ page: String(page + 1) }, false)}>
            Próxima
          </button>
        </div>
      </section>
    </main>
  );
}
