import { useMemo, useState } from "react";
import { CalendarDays, Database, Filter, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";

const MIN_MONTH = "2025-01";
const MAX_MONTH = "2026-08";
const fmt = new Intl.NumberFormat("pt-BR");

function monthLabel(month: string) {
  const [year, rawMonth] = month.split("-");
  return `${rawMonth}/${year.slice(2)}`;
}

function PercentBar({ value, max }: { value: number; max: number }) {
  return <span className="pilot-progress"><i style={{ width: `${max ? Math.max(4, (value / max) * 100) : 0}%` }} /></span>;
}

export default function CivilConsumerPanel() {
  const [from, setFrom] = useState(MIN_MONTH);
  const [to, setTo] = useState(MAX_MONTH);
  const [municipalityIbgeCode, setMunicipalityIbgeCode] = useState("");
  const queryInput = useMemo(() => ({ from, to, ...(municipalityIbgeCode ? { municipalityIbgeCode } : {}) }), [from, to, municipalityIbgeCode]);
  const overview = trpc.civilConsumer.overview.useQuery(queryInput);
  const coverage = trpc.metropolitan.coverage.useQuery();
  const data = overview.data;
  const availableMunicipalities = useMemo(() => (coverage.data?.municipalities ?? []).filter((item) => item.state === "mapped"), [coverage.data]);
  const maxCategory = Math.max(...(data?.categories ?? []).map((item) => item.amount), 1);
  const maxMonth = Math.max(...(data?.monthly ?? []).map((item) => item.amount), 1);
  const selectedLabel = availableMunicipalities.find((item) => String(item.ibgeCode) === municipalityIbgeCode)?.name;

  return (
    <section className="civil-consumer-panel" id="piloto-civel-consumidor" aria-labelledby="civil-consumer-title">
      <div className="pilot-header">
        <div>
          <span className="pilot-kicker"><Sparkles size={14} /> PILOTO AGREGADO · DATAJUD / TJMG</span>
          <h2 id="civil-consumer-title">Cível e Consumidor, <em>com contexto.</em></h2>
          <p>Volume de documentos agrupado pelas categorias principais da TPU, com leitura mensal e recorte territorial controlado.</p>
        </div>
        <div className="pilot-status"><span className="status-dot" /> <strong>{data?.readiness.state === "completed" ? "Dados disponíveis" : "Aguardando dados"}</strong><small>camada temática independente</small></div>
      </div>

      <div className="pilot-filters" aria-label="Filtros do piloto Cível e Consumidor">
        <div className="pilot-filter-label"><Filter size={16} /><span>Filtros ativos</span></div>
        <label><span><CalendarDays size={13} /> De</span><input type="month" min={MIN_MONTH} max={MAX_MONTH} value={from} onChange={(event) => setFrom(event.target.value > to ? to : event.target.value)} /></label>
        <label><span><CalendarDays size={13} /> Até</span><input type="month" min={MIN_MONTH} max={MAX_MONTH} value={to} onChange={(event) => setTo(event.target.value < from ? from : event.target.value)} /></label>
        <label className="pilot-comarca"><span><MapPin size={13} /> Comarca / órgão confirmado</span><select value={municipalityIbgeCode} onChange={(event) => setMunicipalityIbgeCode(event.target.value)}><option value="">Todas com dados</option>{availableMunicipalities.map((item) => <option key={item.ibgeCode} value={String(item.ibgeCode)}>{item.name}</option>)}</select></label>
      </div>

      {overview.isLoading && <div className="pilot-state"><Database size={18} /> Consultando a camada agregada…</div>}
      {overview.isError && <div className="pilot-state error"><Database size={18} /> Não foi possível carregar o piloto temático; as demais camadas permanecem intactas.</div>}
      {data && !overview.isLoading && <>
        <div className="pilot-metrics">
          <article className="pilot-total"><span>DOCUMENTOS NO RECORTE</span><strong>{fmt.format(data.total)}</strong><small>{selectedLabel ?? "Todas as comarcas com dados"} · {from} → {to}</small></article>
          <article><span>CATEGORIAS TPU</span><strong>{data.categories.length}</strong><small>Civil e Consumidor</small></article>
          <article><span>MESES OBSERVADOS</span><strong>{data.monthly.length}</strong><small>granularidade mensal</small></article>
          <article><span>ÓRGÃOS</span><strong>{data.bodies.length}</strong><small>códigos confirmados</small></article>
        </div>

        <div className="pilot-grid">
          <article className="pilot-card pilot-categories"><div className="pilot-card-heading"><div><span>01 · CATEGORIAS PRINCIPAIS</span><h3>Onde está o volume</h3></div><span className="pilot-chip">TPU</span></div><div className="category-list">{data.categories.length ? data.categories.map((item) => <div className="category-row" key={item.code}><div><b>{item.label}</b><small>Raiz TPU {item.code}</small></div><strong>{fmt.format(item.amount)}</strong><PercentBar value={item.amount} max={maxCategory} /></div>) : <p className="pilot-empty">Nenhum registro no intervalo selecionado.</p>}</div></article>
          <article className="pilot-card pilot-timeline"><div className="pilot-card-heading"><div><span>02 · SÉRIE MENSAL</span><h3>Ritmo de distribuição</h3></div><span className="pilot-chip copper">MÊS</span></div><div className="monthly-bars">{data.monthly.length ? data.monthly.map((item) => <div className="monthly-column" key={item.month} title={`${item.month}: ${fmt.format(item.amount)}`}><i style={{ height: `${Math.max(6, (item.amount / maxMonth) * 100)}%` }} /><small>{monthLabel(item.month)}</small></div>) : <p className="pilot-empty">Nenhum registro no intervalo selecionado.</p>}</div></article>
        </div>
        <div className="pilot-foot"><ShieldCheck size={16} /><span>Fonte: {data.readiness.sourceKey ?? "CNJ/DataJud API Pública"}. Classe 436 · grau JE · árvore TPU {data.readiness.subjectTreeVersion ?? "versionada"}. O total é agregado e não representa taxa de êxito, estoque, produtividade ou censo nacional.</span></div>
      </>}
    </section>
  );
}
