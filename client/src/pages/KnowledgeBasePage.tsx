import { BookOpenCheck, CircleAlert, Search } from "lucide-react";
import { keepPreviousData } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

const DOCUMENT_TYPES = ["peca", "contrato", "checklist", "fluxo", "tabela_documentos", "triagem", "prazo", "doutrina", "regra_inteligencia", "regras_contratuais", "argumentacao", "jurimetria"] as const;
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
const AREAS = ["ambiental", "tributario", "administrativo", "trabalhista", "civil", "processual-civil", "consumidor", "bancario", "empresarial", "penal", "digital", "geral"] as const;
const PAGE_SIZE = 12;

export default function KnowledgeBasePage() {
  const stats = trpc.knowledgeBase.stats.useQuery();

  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const documentType = params.get("tipo") ?? "";
  const area = params.get("area") ?? "";
  const kind = (params.get("kind") as "knowledge_document" | "legislation" | "") || "";
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
    () => ({
      query: q.trim() || undefined,
      documentType: (documentType || undefined) as (typeof DOCUMENT_TYPES)[number] | undefined,
      area: area || undefined,
      kind: (kind || undefined) as "knowledge_document" | "legislation" | undefined,
      page,
      pageSize: PAGE_SIZE,
    }),
    [q, documentType, area, kind, page],
  );
  const search = trpc.knowledgeBase.search.useQuery(input, { placeholderData: keepPreviousData });

  const total = search.data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="page">
      <section className="hero">
        <div>
          <span className="eyebrow">Base de Conhecimento</span>
          <h1>
            Peças, contratos, checklists e <em>doutrina</em>, com fonte declarada.
          </h1>
          <p>Conteúdo importado do corpus EJC — cada documento carrega sua situação de fonte e passa pela auditoria de integridade da curadoria antes de ser considerado confiável para uso.</p>
        </div>
        <aside className="principle-card">
          <b>
            <BookOpenCheck size={16} /> Acervo atual
          </b>
          <p>
            {stats.data?.documents ?? "—"} documentos · {stats.data?.legislation ?? "—"} normas · {stats.data?.chunks ?? "—"} trechos indexados para busca.
          </p>
        </aside>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Busca lexical</span>
            <h2>Pesquisar o acervo</h2>
          </div>
        </div>

        <div className="toolbar">
          <label className="field">
            <span>Busca</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Search size={16} />
              <input style={{ width: "100%" }} value={qInput} onChange={(e) => setQInput(e.target.value)} placeholder="ex.: prescrição ambiental" />
            </div>
          </label>
          <label className="field">
            <span>Tipo</span>
            <select value={kind} onChange={(e) => setFilter({ kind: e.target.value })}>
              <option value="">Documentos e legislação</option>
              <option value="knowledge_document">Só documentos</option>
              <option value="legislation">Só legislação</option>
            </select>
          </label>
          {kind !== "legislation" && (
            <label className="field">
              <span>Tipo de documento</span>
              <select value={documentType} onChange={(e) => setFilter({ tipo: e.target.value })}>
                <option value="">Todos</option>
                {DOCUMENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {DOCUMENT_TYPE_LABEL[t]}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className="field">
            <span>Área</span>
            <select value={area} onChange={(e) => setFilter({ area: e.target.value })}>
              <option value="">Todas</option>
              {AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
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
        ) : search.data && search.data.hits.length === 0 ? (
          <div className="empty">{q.trim() ? "Nenhum resultado para esta busca." : "Digite um termo para pesquisar o acervo."}</div>
        ) : (
          <div className="cards">
            {search.data?.hits.map((hit) => (
              <article className="card" key={`${hit.documentKind}:${hit.documentId}`}>
                <div className="card-top">
                  <span className={`status ${hit.sourceStatus === "official_confirmed" ? "official" : "review"}`}>{hit.sourceStatus.replaceAll("_", " ")}</span>
                  <BookOpenCheck size={16} />
                </div>
                <h3>{hit.title}</h3>
                <p>{hit.chunkText}</p>
                <div className="tag-row">
                  <span className="tag">{hit.documentKind === "legislation" ? "legislação" : (DOCUMENT_TYPE_LABEL[hit.documentType ?? ""] ?? "documento")}</span>
                  <span className="tag">{hit.area}</span>
                </div>
                <p>
                  <Link href={`/base-conhecimento/${hit.documentKind}/${encodeURIComponent(hit.slug)}`}>Abrir →</Link>
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
