import { ArrowLeft, Check, RefreshCw, Send, ShieldCheck, Sparkles, Undo2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { SiteNav } from "@/components/SiteNav";
import { trpc } from "@/lib/trpc";

const fmt = new Intl.NumberFormat("pt-BR");

type ReviewDecision = "approved" | "rejected" | "returned";

function decisaoBotao(decision: ReviewDecision) {
  if (decision === "approved") return { rotulo: "Aprovar", icon: Check, classe: "cqx-btn ok" };
  if (decision === "rejected") return { rotulo: "Rejeitar", icon: X, classe: "cqx-btn no" };
  return { rotulo: "Devolver", icon: Undo2, classe: "cqx-btn back" };
}

const SUGESTOES = [
  "Quais as causas mais presentes da amostra?",
  "O que ensejou as indenizações por dano moral?",
  "Há pendências de revisão? O que falta para avançar?",
];

export default function CausalDashboardPage() {
  const { user, loading } = useAuth();
  const isAdmin = user?.role === "admin";
  const utils = trpc.useUtils();

  const dashboard = trpc.causal.dashboard.useQuery(undefined, { enabled: isAdmin, retry: false });
  const causas = trpc.causal.provenCauses.useQuery(undefined, { enabled: isAdmin, retry: false });
  const fila = trpc.causal.reviewQueue.useQuery({ limit: 50 }, { enabled: isAdmin, retry: false });
  const juridiaContext = trpc.causal.juridiaContext.useQuery(undefined, { enabled: isAdmin, retry: false });

  const review = trpc.causal.reviewAnnotation.useMutation({
    onSuccess: () => {
      utils.causal.reviewQueue.invalidate();
      utils.causal.provenCauses.invalidate();
      utils.causal.dashboard.invalidate();
      utils.causal.juridiaContext.invalidate();
    },
  });

  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState<{ texto: string; modo: string } | null>(null);
  const perguntar = trpc.causal.juridiaAsk.useMutation({
    onSuccess: result => setResposta({ texto: result.answer, modo: result.modo }),
  });

  const atualizarTudo = () => {
    dashboard.refetch();
    causas.refetch();
    fila.refetch();
    juridiaContext.refetch();
  };

  const maxCasos = useMemo(
    () => Math.max(1, ...(causas.data?.causasComprovadas ?? []).map(item => item.casos)),
    [causas.data],
  );

  const enviar = () => {
    const texto = pergunta.trim();
    if (texto.length < 3 || perguntar.isPending) return;
    perguntar.mutate({ question: texto });
  };

  const decidir = (annotationId: number, decision: ReviewDecision) => {
    const nota = decision === "approved" ? "Revisão humana: fato/pedido confirmado com evidência do inteiro teor." : undefined;
    review.mutate({
      annotationId,
      decision,
      reviewer: (user?.name || user?.email || "Revisor Atlas").slice(0, 190),
      ...(nota ? { note: nota } : {}),
    });
  };

  return <div className="atlas-shell causal-shell">
    <aside className="atlas-sidebar causal-sidebar">
      <div className="brand-block"><div className="brand-mark causal-mark"><ShieldCheck size={22} /></div><div><span>Atlas Forense</span><strong>Atlas<br />Causal</strong><small>causa · evidência · revisão</small></div></div>
      <SiteNav />
      <div className="sidebar-footnote"><ShieldCheck size={16} /><p>Banco causal isolado. Candidato só vira causa comprovada após revisão humana.</p></div>
    </aside>

    <main className="atlas-main causal-main">
      <header className="topbar">
        <div className="breadcrumb">Atlas Forense <span>/</span> Atlas Causal</div>
        <div className="topbar-actions">
          <a className="structure-link" href="/"><ArrowLeft size={15} /> Painel JEC</a>
          <button className="export-button" onClick={atualizarTudo} disabled={dashboard.isFetching}><RefreshCw size={15} className={dashboard.isFetching ? "causal-spin" : ""} /> Atualizar</button>
        </div>
      </header>

      {loading ? <section className="causal-state"><ShieldCheck size={22} /><p>Verificando acesso…</p></section>
        : !user ? <section className="causal-state"><ShieldCheck size={26} /><h2>Autenticação necessária</h2><p>O painel causal é administrativo.</p><button className="causal-primary-button" onClick={() => startLogin()}>Entrar</button></section>
        : !isAdmin ? <section className="causal-state restricted"><ShieldCheck size={26} /><h2>Perfil sem permissão</h2><p>Solicite o papel <strong>admin</strong>.</p></section>
        : <>
          {dashboard.isError && <section className="causal-state error"><ShieldCheck size={24} /><h2>Atlas Causal indisponível</h2><p>O banco isolado não está configurado ou não respondeu.</p></section>}

          {causas.data && <div className="cqx-wrap">
            {/* Funil em uma linha */}
            <section className="cqx-funil">
              <div><span>Casos</span><strong>{fmt.format(causas.data.resumo.casosComCausaAprovada || dashboard.data?.summary.cases || 0)}</strong><small>{fmt.format(dashboard.data?.summary.cases ?? 0)} no banco causal</small></div>
              <div className="cqx-seta">→</div>
              <div><span>Fila de revisão</span><strong>{fmt.format(causas.data.resumo.filaDeRevisao)}</strong><small>candidatos pendentes</small></div>
              <div className="cqx-seta">→</div>
              <div className="cqx-destaque"><span>Causas comprovadas</span><strong>{fmt.format(causas.data.resumo.causasComprovadas)}</strong><small>{fmt.format(causas.data.resumo.casosComCausaAprovada)} casos com causa aprovada</small></div>
            </section>

            {/* Causas comprovadas — resposta direta */}
            <section className="cqx-grid">
              <article className="cqx-card">
                <h2>Causas comprovadas da amostra</h2>
                <p className="cqx-sub">O que ensejou os pedidos — extraído do inteiro teor e aprovado em revisão humana.</p>
                {causas.data.causasComprovadas.length === 0 ? <p className="cqx-vazio">Nenhuma causa comprovada ainda: ingeste o inteiro teor e aprove os candidatos na fila.</p>
                  : <ul className="cqx-causas">{causas.data.causasComprovadas.map(item => (
                    <li key={`${item.familyKey}-${item.claimType}`}>
                      <div className="cqx-causa-linha"><span>{item.familyLabel}</span><b>{item.claimLabel} · {fmt.format(item.casos)} {item.casos === 1 ? "caso" : "casos"}</b></div>
                      <div className="cqx-barra"><i style={{ width: `${Math.max(6, Math.round((item.casos / maxCasos) * 100))}%` }} /></div>
                    </li>
                  ))}</ul>}
                <div className="cqx-pedidos">{causas.data.pedidosComprovados.map(item => (
                  <span key={item.claimType}>{item.claimLabel}: <b>{fmt.format(item.casos)}</b></span>
                ))}</div>
                <p className="cqx-nota">Menções não são mutuamente exclusivas: um caso pode ter mais de uma causa e um processo pode cumular pedidos.</p>
              </article>

              {/* Fila de revisão — 1 clique */}
              <article className="cqx-card">
                <h2>Fila de revisão <span className="cqx-contador">{fmt.format(fila.data?.length ?? 0)}</span></h2>
                <p className="cqx-sub">Candidato extraído do inteiro teor aguardando decisão humana.</p>
                {fila.isLoading ? <p className="cqx-vazio">Carregando…</p>
                  : (fila.data?.length ?? 0) === 0 ? <p className="cqx-vazio ok">Fila zerada — todos os candidatos revisados.</p>
                  : <ul className="cqx-fila">{fila.data!.slice(0, 12).map(item => (
                    <li key={item.annotationId}>
                      <div className="cqx-fila-topo"><b>{item.familyLabel}</b><span>{item.claimLabel} · confiança {Number(item.confidence).toFixed(2)}</span></div>
                      <div className="cqx-fila-caso">{item.caseKey}</div>
                      {item.excerpt && <blockquote>{item.excerpt}</blockquote>}
                      <div className="cqx-fila-acoes">
                        {(["approved", "rejected", "returned"] as ReviewDecision[]).map(decision => {
                          const botao = decisaoBotao(decision);
                          return <button key={decision} className={botao.classe} disabled={review.isPending} onClick={() => decidir(item.annotationId, decision)}><botao.icon size={13} /> {botao.rotulo}</button>;
                        })}
                      </div>
                    </li>
                  ))}</ul>}
              </article>
            </section>

            {/* JuridIA dentro do Atlas, alimentada pelo Atlas */}
            <section className="cqx-card cqx-juridia">
              <div className="cqx-juridia-topo">
                <h2><Sparkles size={18} /> JuridIA · dentro do Atlas</h2>
                {juridiaContext.data && <div className="cqx-alimentacao">
                  <span>alimentada pelo Atlas causal:</span>
                  <em>{fmt.format(juridiaContext.data.dashboard.casos)} casos</em>
                  <em>{fmt.format(juridiaContext.data.resumo.causasComprovadas)} causas comprovadas</em>
                  <em>{fmt.format(juridiaContext.data.resumo.filaDeRevisao)} pendências</em>
                </div>}
              </div>
              <div className="cqx-sugestoes">{SUGESTOES.map(sugestao => (
                <button key={sugestao} onClick={() => setPergunta(sugestao)}>{sugestao}</button>
              ))}</div>
              {resposta && <div className="cqx-resposta"><p>{resposta.texto}</p><small>modo: {resposta.modo === "llm" ? "JuridIA (LLM)" : "local (sem LLM)"} · dados: banco causal do Atlas</small></div>}
              {perguntar.isError && <div className="cqx-resposta erro"><p>{perguntar.error.message}</p></div>}
              <div className="cqx-envio">
                <input value={pergunta} maxLength={1000} placeholder="Pergunte sobre as causas comprovadas, pendências e pedidos da amostra…" onChange={evento => setPergunta(evento.target.value)} onKeyDown={evento => evento.key === "Enter" && enviar()} />
                <button onClick={enviar} disabled={perguntar.isPending || pergunta.trim().length < 3}><Send size={15} /> {perguntar.isPending ? "Consultando…" : "Perguntar"}</button>
              </div>
            </section>

            <p className="cqx-rodape"><ShieldCheck size={13} /> Candidato só vira causa comprovada com revisão humana e evidência do inteiro teor. Leitura descritiva, sem previsão de êxito.</p>
          </div>}
        </>}
    </main>
  </div>;
}
