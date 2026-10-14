import { AlertTriangle, ArrowLeft, BarChart3, CalendarClock, Database, FileCheck2, Filter, Landmark, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { SiteNav } from "@/components/SiteNav";
import { trpc } from "@/lib/trpc";

const fmt = new Intl.NumberFormat("pt-BR");
const dateFmt = new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" });
type ClaimType = "all" | "dano_moral" | "dano_material";
type ReviewStatus = "all" | "pending" | "approved" | "rejected" | "returned";

function labelClaimType(value: ClaimType) {
  return value === "dano_moral" ? "Dano moral" : value === "dano_material" ? "Dano material" : "Ambos os danos";
}

function labelStatus(value: string) {
  return value === "pending" ? "Pendente" : value === "approved" ? "Aprovado" : value === "rejected" ? "Rejeitado" : value === "returned" ? "Devolvido" : value;
}

function Metric({ label, value, note, accent = "petrol" }: { label: string; value: string; note: string; accent?: "petrol" | "copper" | "clay" | "ink" }) {
  return <article className={`causal-metric ${accent}`}><span>{label}</span><strong>{value}</strong><small>{note}</small></article>;
}

export default function CausalDashboardPage() {
  const { user, loading } = useAuth();
  const [claimType, setClaimType] = useState<ClaimType>("all");
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>("all");
  const isAdmin = user?.role === "admin";
  const dashboard = trpc.causal.dashboard.useQuery({ claimType, reviewStatus }, { enabled: isAdmin, retry: false });
  const data = dashboard.data;
  const facts = data?.factGenerators.slice(0, 10).map(item => ({ name: item.label, casos: item.cases, tipo: item.claimLabel })) ?? [];
  const outcomes = data?.outcomes.slice(0, 8) ?? [];

  return <div className="atlas-shell causal-shell">
    <aside className="atlas-sidebar causal-sidebar">
      <div className="brand-block"><div className="brand-mark causal-mark"><BarChart3 size={22} /></div><div><span>Atlas Forense</span><strong>Atlas<br />Causal</strong><small>causa · evidência · resultado</small></div></div>
      <div className="sidebar-context"><span className="eyebrow">CAMADA CAUSAL</span><p>Casos individuais sanitizados que explicam os números de dano moral e material.</p><div className="source-stamp"><ShieldCheck size={15} /> Banco isolado</div></div>
      <SiteNav />
      <div className="sidebar-footnote"><ShieldCheck size={16} /><p>Sem partes, CPF/CNPJ ou número CNJ bruto. Candidatos causais exigem revisão humana.</p></div>
    </aside>

    <main className="atlas-main causal-main">
      <header className="topbar"><div className="breadcrumb"><Landmark size={16} /> Atlas Forense <span>/</span> Atlas Causal</div><div className="topbar-actions"><a className="structure-link" href="/"><ArrowLeft size={15} /> Painel JEC</a><button className="export-button" onClick={() => dashboard.refetch()} disabled={dashboard.isFetching}><RefreshCw size={15} className={dashboard.isFetching ? "causal-spin" : ""} /> Atualizar</button></div></header>

      <section className="causal-hero"><div><span className="eyebrow">JURIMETRIA CAUSAL · VISÃO ADMINISTRATIVA</span><h1>Do rótulo do dano ao <em>fato gerador.</em></h1><p>Separe causa, pedido e resultado em uma leitura única dos casos sanitizados do Atlas Causal.</p><div className="causal-tags"><span><Database size={14} /> Banco isolado</span><span><FileCheck2 size={14} /> Revisão rastreável</span><span><Sparkles size={14} /> Descritivo</span></div></div><div className="causal-hero-mark"><span>FICHA<br />CAUSAL</span><BarChart3 size={44} /></div></section>

      {loading ? <section className="causal-state"><ShieldCheck size={23} /><p>Verificando o perfil de acesso…</p></section> : !user ? <section className="causal-state"><ShieldCheck size={28} /><h2>Autenticação necessária</h2><p>O dashboard causal é administrativo e não publica dados individualizados.</p><button className="causal-primary-button" onClick={() => startLogin()}>Entrar para continuar</button></section> : !isAdmin ? <section className="causal-state restricted"><ShieldCheck size={28} /><h2>Perfil sem permissão</h2><p>A camada causal contém dados de trabalho administrativo. Solicite o papel <strong>admin</strong> para consultar os agregados.</p></section> : <>
        {dashboard.isError && <section className="causal-state error"><AlertTriangle size={24} /><h2>Atlas Causal indisponível</h2><p>O banco isolado não está configurado ou não respondeu. O Atlas Métrico permanece separado e não foi alterado.</p></section>}
        {data && <div className="causal-content">
          <section className="causal-filter-ribbon" aria-label="Filtros da análise causal"><div className="filter-intro"><Filter size={17} /><span>Refinar a leitura</span></div><label><span>Tipo de dano</span><select value={claimType} onChange={event => setClaimType(event.target.value as ClaimType)}><option value="all">Ambos os danos</option><option value="dano_moral">Dano moral</option><option value="dano_material">Dano material</option></select></label><label><span>Revisão</span><select value={reviewStatus} onChange={event => setReviewStatus(event.target.value as ReviewStatus)}><option value="all">Todos os estados</option><option value="pending">Pendente</option><option value="approved">Aprovado</option><option value="returned">Devolvido</option><option value="rejected">Rejeitado</option></select></label><p><CalendarClock size={15} /> Agregado da última coleta.</p></section>

          <section className="causal-metrics-grid"><Metric label="Casos sanitizados" value={fmt.format(data.summary.cases)} note="Sem identificadores pessoais" /><Metric label="Fatos geradores" value={fmt.format(data.summary.factGenerators)} note="Rótulos por tipo e revisão" accent="copper" /><Metric label="Pendentes" value={fmt.format(data.summary.pendingAnnotations)} note="Exigem conferência humana" accent="clay" /><Metric label="Evidências" value={fmt.format(data.summary.evidence)} note="Referências com hash de origem" accent="ink" /></section>

          <section className="causal-grid"><article className="causal-card causal-chart-card"><div className="causal-card-heading"><div><span className="eyebrow">FATO GERADOR · TOP 10</span><h2>Quais causas aparecem nos danos?</h2></div><span className="causal-count">{fmt.format(data.summary.factGenerators)} categorias</span></div>{facts.length ? <div className="causal-chart"><ResponsiveContainer width="100%" height={Math.max(290, facts.length * 38)}><BarChart data={facts} layout="vertical" margin={{ top: 5, right: 18, left: 8, bottom: 5 }}><CartesianGrid horizontal={false} stroke="#d8d2c6" strokeDasharray="2 6" /><XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "#665b50", fontSize: 11 }} /><YAxis type="category" dataKey="name" width={155} tickLine={false} axisLine={false} tick={{ fill: "#40372f", fontSize: 11 }} /><Tooltip formatter={(value: number) => [`${fmt.format(value)} casos`, "Frequência"]} labelFormatter={(label, payload) => payload?.[0]?.payload?.tipo ? `${label} · ${payload[0].payload.tipo}` : label} contentStyle={{ borderRadius: 2, border: "1px solid #d8d2c6", background: "#fffdf8" }} /><Bar dataKey="casos" fill="#13514e" radius={[0, 3, 3, 0]} /></BarChart></ResponsiveContainer></div> : <EmptyState text="Nenhum fato gerador corresponde aos filtros." />}</article>
            <article className="causal-card"><div className="causal-card-heading"><div><span className="eyebrow">PEDIDOS E RESULTADOS</span><h2>Como os casos foram classificados?</h2></div></div><div className="causal-outcome-list">{outcomes.length ? outcomes.map(item => <div className="causal-outcome-row" key={`${item.claimType}-${item.outcome}-${item.reviewStatus}`}><div><strong>{item.outcomeLabel}</strong><span>{item.claimLabel} · {labelStatus(item.reviewStatus)}</span></div><b>{fmt.format(item.cases)} <small>casos</small></b></div>) : <EmptyState text="Nenhum resultado revisado corresponde aos filtros." />}</div><div className="causal-review-strip">{data.review.map(item => <span key={item.status}><i className={`causal-dot ${item.status}`} />{labelStatus(item.status)} <b>{fmt.format(item.count)}</b></span>)}</div></article></section>

          <section className="causal-lower-grid"><article className="causal-card"><div className="causal-card-heading"><div><span className="eyebrow">RECORTE TERRITORIAL</span><h2>Casos por município</h2></div></div><div className="causal-mini-table">{data.casesByMunicipality.slice(0, 8).map(item => <div key={item.municipality}><span>{item.municipality}</span><strong>{fmt.format(item.cases)}</strong></div>)}</div></article><article className="causal-card causal-source-card"><span className="eyebrow">ÚLTIMA COLETA</span><h2>{data.latestRun ? data.latestRun.sourceKey : "Nenhuma execução"}</h2>{data.latestRun ? <dl><div><dt>Período</dt><dd>{data.latestRun.periodStart} a {data.latestRun.periodEnd}</dd></div><div><dt>Escopo</dt><dd>{data.latestRun.scope}</dd></div><div><dt>Atualizado</dt><dd>{dateFmt.format(new Date(data.latestRun.updatedAt))}</dd></div><div><dt>Metodologia</dt><dd>{data.latestRun.methodologyVersion}</dd></div></dl> : <p>Execute o coletor-piloto para materializar a primeira camada causal.</p>}</article></section>

          <section className="causal-limitations"><AlertTriangle size={22} /><div><h2>Como ler sem transformar candidato em verdade</h2><ul>{data.limitations.map(item => <li key={item}>{item}</li>)}</ul><p className="causal-freshness"><CalendarClock size={14} /> Atualização das fontes: consultar a última coleta exibida acima; jurisprudência e legislação devem ser sincronizadas em rotina própria antes do uso profissional.</p></div></section>
        </div>}
      </>}
    </main>
  </div>;
}

function EmptyState({ text }: { text: string }) {
  return <div className="causal-empty"><Database size={20} /><p>{text}</p></div>;
}
