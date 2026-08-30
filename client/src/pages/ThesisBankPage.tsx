import { Search, ShieldCheck, Sparkles } from "lucide-react";
import { keepPreviousData } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { lifecycleLabel, THESIS_USE_TYPES, type ThesisUseType } from "@shared/thesis-bank";

const useTypeLabel: Record<ThesisUseType, string> = { attack: "Ataque", defense: "Defesa", both: "Ambos" };
const PAGE_SIZE = 30;

export default function ThesisBankPage() {
  const { user, login } = useAuth();
  const overview = trpc.thesisBank.overview.useQuery();

  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const useType = (params.get("useType") as ThesisUseType) || "";
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

  const searchInput = useMemo(
    () => ({ query: q.trim() || undefined, useType: useType || undefined, page, pageSize: PAGE_SIZE }),
    [q, useType, page],
  );
  const search = trpc.thesisBank.search.useQuery(searchInput, { placeholderData: keepPreviousData });

  const [caseText, setCaseText] = useState("");
  const find = trpc.thesisBank.findForCase.useMutation();

  const total = search.data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="page">
      <section className="hero">
        <div>
          <span className="eyebrow">Banco Nacional de Teses Jurídicas</span>
          <h1>
            Teses com <em>fonte, contraditório e versão</em>.
          </h1>
          <p>O Atlas só publica teses validadas ou controvertidas depois dos gates humanos. O score representa qualidade/força comparativa da evidência, nunca chance de ganhar uma causa.</p>
        </div>
        <aside className="principle-card">
          <b>
            <ShieldCheck size={16} /> Curadoria
          </b>
          <p>{overview.data?.total ?? "—"} teses estruturadas. Meta progressiva: 100 → 500 → 1.000 → 3.000+, sempre priorizando qualidade.</p>
        </aside>
      </section>

      <section className="split">
        <article className="card">
          <div className="card-top">
            <b>Pesquisar teses</b>
            <Search size={16} />
          </div>
          <div className="split" style={{ marginTop: 14 }}>
            <label className="field">
              <span>Termo</span>
              <input value={qInput} onChange={(e) => setQInput(e.target.value)} placeholder="fraude bancária, vínculo, dano moral…" />
            </label>
            <label className="field">
              <span>Uso</span>
              <select value={useType} onChange={(e) => setFilter({ useType: e.target.value })}>
                <option value="">Ataque e defesa</option>
                {THESIS_USE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {useTypeLabel[type]}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="tag">
            {total || "—"} tese(s){search.isFetching && !search.isLoading ? " · atualizando…" : ""}
          </p>

          {search.data && search.data.items.length === 0 ? (
            <div className="empty" style={{ marginTop: 14 }}>
              Nenhuma tese publicada encontrada com estes filtros.
            </div>
          ) : (
            <div className="list" style={{ marginTop: 14 }}>
              {search.data?.items.map((item) => (
                <Link className="list-item" href={`/teses/${item.profile.publicId}`} key={item.thesis.id}>
                  <div className="card-top">
                    <span className={`status ${item.profile.lifecycleStatus}`}>{lifecycleLabel(item.profile.lifecycleStatus)}</span>
                    {item.score && <b>{Number(item.score.compositeScore).toFixed(0)}/100</b>}
                  </div>
                  <b>{item.thesis.title}</b>
                  <p>{item.thesis.description}</p>
                  <div className="tag-row">
                    <span className="tag">{useTypeLabel[item.profile.useType as ThesisUseType]}</span>
                    <span className="tag">{item.topic.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginTop: 16 }}>
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
        </article>

        <article className="card">
          <div className="card-top">
            <b>Encontrar Teses</b>
            <Sparkles size={16} />
          </div>
          <p>Cole a questão ou narrativa. O recurso apenas recupera teses já curadas; não inventa tese nova.</p>
          <label className="field">
            <span>Relato do caso</span>
            <textarea value={caseText} onChange={(e) => setCaseText(e.target.value)} placeholder="Descreva fatos relevantes, pedido e controvérsia…" />
          </label>
          {!user ? (
            <button className="button" onClick={login}>
              Entrar para analisar
            </button>
          ) : (
            <button className="button" disabled={caseText.trim().length < 20 || find.isPending} onClick={() => find.mutate({ text: caseText })}>
              {find.isPending ? "Analisando…" : "Encontrar Teses"}
            </button>
          )}
          {find.error && <div className="notice error">{find.error.message}</div>}
          {find.data && (
            <div style={{ marginTop: 16 }}>
              <div className="notice warn">{find.data.limitations.join(" ")}</div>
              <div className="card-top" style={{ marginTop: 12 }}>
                <h3>Ataque</h3>
                {find.data.attack.length > 0 && (
                  <button className="button secondary" onClick={() => find.reset()}>
                    Limpar
                  </button>
                )}
              </div>
              <div className="list">
                {find.data.attack.map((item) => (
                  <Link className="list-item" href={`/teses/${item.profile.publicId}`} key={item.thesis.id}>
                    <b>{item.thesis.title}</b>
                    <p>{item.thesis.description}</p>
                  </Link>
                ))}
              </div>
              <h3>Defesa</h3>
              <div className="list">
                {find.data.defense.map((item) => (
                  <Link className="list-item" href={`/teses/${item.profile.publicId}`} key={item.thesis.id}>
                    <b>{item.thesis.title}</b>
                    <p>{item.thesis.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </section>
    </main>
  );
}
