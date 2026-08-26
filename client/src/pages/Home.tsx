/** Atlas Forense: painel editorial de evidência jurídica, com dados públicos e limites visíveis. */
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownToLine,
  ArrowUpRight,
  BookOpenCheck,
  CalendarClock,
  ChevronRight,
  CircleHelp,
  Database,
  FileText,
  Filter,
  Landmark,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { jecDashboardData } from "@/data/jecDashboardData";
import { AdvancedEvidencePanel } from "@/components/AdvancedEvidencePanel";
import { useAuth } from "@/_core/hooks/useAuth";

type CityFilter = "Todos" | "Belo Horizonte" | "Betim";
type YearFilter = "Todos" | "2025" | "2026";
type Summary = {
  municipio: string;
  ano: string;
  censoProcessos: number;
  processosAmostra: number;
  coberturaAmostraPct: number;
  comUltimoMovimento: number;
  tempoMedioDias: number | null;
  tempoMedianoDias: number | null;
};
type CauseStat = { municipio: string; ano: string; causa: string; processosAmostra: number };
type UnitStat = {
  municipio: string;
  ano: string;
  orgaoCodigo: string;
  unidade: string;
  processosAmostra: number;
  comUltimoMovimento: number;
  tempoMedioDias: number | null;
  tempoMedianoDias: number | null;
};
type DurationRow = { municipio: string; ano: string; faixa: string; processos: number };
type ProcessRow = {
  municipio: string;
  ano: string;
  orgaoCodigo: string;
  unidade: string;
  assuntos: string[];
  dataAjuizamento: string;
  ultimoMovimento: string;
  ultimoMovimentoData: string;
  tempoObservadoDias: number | null;
  temBaixaObservada: boolean;
  fonteStatus: string;
};
type TimelineEvent = { municipio: string; ano: string; orgaoCodigo: string; assuntos: string[]; mesDistribuicao: string; mesBaixa: string; fonteStatus: string };

const data = jecDashboardData as unknown as {
  meta: Record<string, string>;
  summary: Summary[];
  causeStats: CauseStat[];
  unitStats: UnitStat[];
  durationDistribution: DurationRow[];
  processRows: ProcessRow[];
  timelineEvents: TimelineEvent[];
};

const CITY_COLOR: Record<string, string> = {
  "Belo Horizonte": "#154b4a",
  Betim: "#b56f2c",
};
const CITY_SOFT: Record<string, string> = {
  "Belo Horizonte": "#a9cbc4",
  Betim: "#e2b47a",
};
const fmt = new Intl.NumberFormat("pt-BR");
const fmtOne = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1, minimumFractionDigits: 1 });
const durationOrder = ["0–30 dias", "31–90 dias", "91–180 dias", "181–365 dias", "Mais de 365 dias"];
const MIN_DATE = "2025-01-01";
const MAX_DATE = "2026-08-26";

function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "city" | "alert" }) {
  return <span className={`evidence-pill ${tone}`}>{children}</span>;
}

function MetricCard({
  label,
  value,
  caption,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  caption: string;
  icon: typeof Database;
  accent: "petrol" | "copper" | "ink" | "clay";
}) {
  return (
    <article className={`metric-card ${accent}`}>
      <div className="metric-topline"><span>{label}</span><Icon size={18} strokeWidth={1.8} /></div>
      <strong>{value}</strong>
      <p>{caption}</p>
    </article>
  );
}

function ChartTitle({ eyebrow, title, note }: { eyebrow: string; title: string; note: string }) {
  return (
    <div className="chart-heading">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      <p>{note}</p>
    </div>
  );
}

function PartialRuler({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`partial-ruler ${compact ? "compact" : ""}`} aria-label="2026 parcial até 26 de agosto">
      <span>2026</span><i className="observed" /><i className="observed" /><i className="observed" /><i className="observed" /><i className="observed" /><i className="observed" /><i className="observed" /><i className="observed" /><i className="future" /><i className="future" /><i className="future" /><i className="future" /><b>até 26/08</b>
    </div>
  );
}

export default function Home() {
  // The useAuth hook provides authentication state.
  // To implement login/logout, call logout(), or start login from an event
  // handler: onClick={() => startLogin()} (imported from "@/const"). Never call
  // startLogin() during render (no href={startLogin()}) — it mints a one-time
  // nonce cookie and must run only at the moment of navigation.
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [city, setCity] = useState<CityFilter>("Todos");
  const [year, setYear] = useState<YearFilter>("Todos");
  const [dateStart, setDateStart] = useState(MIN_DATE);
  const [dateEnd, setDateEnd] = useState(MAX_DATE);

  const setQuickYear = (nextYear: YearFilter) => {
    setYear(nextYear);
    if (nextYear === "2025") { setDateStart("2025-01-01"); setDateEnd("2025-12-31"); }
    if (nextYear === "2026") { setDateStart("2026-01-01"); setDateEnd(MAX_DATE); }
    if (nextYear === "Todos") { setDateStart(MIN_DATE); setDateEnd(MAX_DATE); }
  };
  const updateStart = (value: string) => { if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return; setDateStart(value); if (value > dateEnd) setDateEnd(value); setYear("Todos"); };
  const updateEnd = (value: string) => { if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return; setDateEnd(value); if (value < dateStart) setDateStart(value); setYear("Todos"); };

  const includes = (item: { municipio: string; ano: string }) =>
    (city === "Todos" || item.municipio === city) && (year === "Todos" || item.ano === year);

  const summaryRows = useMemo(() => data.summary.filter(includes), [city, year]);
  const activeCities = city === "Todos" ? ["Belo Horizonte", "Betim"] : [city];
  const activeYears = year === "Todos" ? ["2025", "2026"] : [year];

  const totals = useMemo(() => {
    const censo = summaryRows.reduce((sum, row) => sum + row.censoProcessos, 0);
    const amostra = summaryRows.reduce((sum, row) => sum + row.processosAmostra, 0);
    const movimentados = summaryRows.reduce((sum, row) => sum + row.comUltimoMovimento, 0);
    const media = movimentados
      ? summaryRows.reduce((sum, row) => sum + (row.tempoMedioDias || 0) * row.comUltimoMovimento, 0) / movimentados
      : null;
    return { censo, amostra, movimentados, media, cobertura: censo ? (amostra / censo) * 100 : 0 };
  }, [summaryRows]);

  const annualVolumes = useMemo(
    () =>
      ["2025", "2026"].map((period) => {
        const item: Record<string, string | number> = { ano: period === "2026" ? "2026*" : period };
        for (const currentCity of ["Belo Horizonte", "Betim"]) {
          item[currentCity] = activeCities.includes(currentCity)
            ? data.summary.find((row) => row.municipio === currentCity && row.ano === period)?.censoProcessos || 0
            : 0;
        }
        return item;
      }),
    [activeCities],
  );

  const causes = useMemo(() => {
    const grouped = new Map<string, number>();
    data.causeStats.filter(includes).forEach((row) => grouped.set(row.causa, (grouped.get(row.causa) || 0) + row.processosAmostra));
    return Array.from(grouped.entries())
      .map(([causa, processos]) => ({ causa, processos }))
      .sort((a, b) => b.processos - a.processos || a.causa.localeCompare(b.causa, "pt-BR"))
      .slice(0, 12);
  }, [city, year]);

  const causeSplit = useMemo(() => {
    const grouped = new Map<string, Record<string, string | number>>();
    data.causeStats.filter(includes).forEach((row) => {
      if (!grouped.has(row.causa)) grouped.set(row.causa, { causa: row.causa, "Belo Horizonte": 0, Betim: 0 });
      const entry = grouped.get(row.causa)!;
      entry[row.municipio] = Number(entry[row.municipio]) + row.processosAmostra;
    });
    return Array.from(grouped.values())
      .sort((a, b) => Number(b["Belo Horizonte"]) + Number(b.Betim) - (Number(a["Belo Horizonte"]) + Number(a.Betim)))
      .slice(0, 8);
  }, [city, year]);

  const units = useMemo(() => {
    const grouped = new Map<string, UnitStat & { weighted: number }>();
    data.unitStats.filter(includes).forEach((row) => {
      const key = `${row.municipio}-${row.orgaoCodigo}`;
      if (!grouped.has(key)) {
        grouped.set(key, { ...row, processosAmostra: 0, comUltimoMovimento: 0, weighted: 0 });
      }
      const entry = grouped.get(key)!;
      entry.processosAmostra += row.processosAmostra;
      entry.comUltimoMovimento += row.comUltimoMovimento;
      entry.weighted += (row.tempoMedioDias || 0) * row.comUltimoMovimento;
      entry.tempoMedioDias = entry.comUltimoMovimento ? entry.weighted / entry.comUltimoMovimento : null;
    });
    return Array.from(grouped.values())
      .map(({ weighted: _weighted, ...entry }) => ({ ...entry, tempoMedioDias: entry.tempoMedioDias ? Number(entry.tempoMedioDias.toFixed(1)) : null }))
      .sort((a, b) => b.processosAmostra - a.processosAmostra || a.unidade.localeCompare(b.unidade, "pt-BR"));
  }, [city, year]);

  const unitChart = useMemo(
    () => units.slice(0, 12).map((unit) => ({ unidade: unit.orgaoCodigo, processos: unit.processosAmostra, municipio: unit.municipio })),
    [units],
  );

  const durations = useMemo(() => {
    const grouped = new Map<string, number>();
    data.durationDistribution.filter(includes).forEach((row) => grouped.set(row.faixa, (grouped.get(row.faixa) || 0) + row.processos));
    return durationOrder.map((faixa) => ({ faixa, processos: grouped.get(faixa) || 0 }));
  }, [city, year]);

  const cityPie = useMemo(() => {
    const grouped = new Map<string, number>();
    summaryRows.forEach((row) => grouped.set(row.municipio, (grouped.get(row.municipio) || 0) + row.censoProcessos));
    return Array.from(grouped.entries()).map(([name, value]) => ({ name, value }));
  }, [summaryRows]);

  const downloadFiltered = () => {
    const lines = ["municipio;ano;orgao_codigo;unidade;processos_amostra;tempo_medio_observado_dias;tempo_mediano_observado_dias"];
    units.forEach((row) => lines.push([
      row.municipio,
      row.ano,
      row.orgaoCodigo,
      `"${row.unidade.replaceAll('"', '""')}"`,
      row.processosAmostra,
      row.tempoMedioDias ?? "",
      row.tempoMedianoDias ?? "",
    ].join(";")));
    const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `jec-bh-betim-${city.toLowerCase().replaceAll(' ', '-')}-${year}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="atlas-shell">
      <aside className="atlas-sidebar">
        <div className="brand-block">
          <img className="brand-mark" src="/manus-storage/atlas-forense-logo_bb6317e2.png" alt="Marca gráfica Atlas Forense" />
          <div><span>Atlas Forense</span><strong>JEC comparado</strong><small>duas comarcas · uma linha de prova</small></div>
        </div>

        <div className="sidebar-context">
          <span className="eyebrow">RECORTE ATIVO</span>
          <p>Processos do JEC em Belo Horizonte e Betim.</p>
          <div className="source-stamp"><Database size={15} /> DataJud / TJMG</div>
        </div>

        <nav className="section-nav" aria-label="Navegação do painel">
          <a href="#visao"><span>01</span>Visão comparada</a>
          <a href="#causas"><span>02</span>Causas</a>
          <a href="#unidades"><span>03</span>Varas e unidades</a>
          <a href="#tempo"><span>04</span>Tempo observado</a>
          <a href="#metodo"><span>05</span>Metodologia</a>
        </nav>

        <div className="sidebar-footnote">
          <ShieldCheck size={16} />
          <p>Sem dados pessoais. Censo, amostra e movimento são camadas distintas.</p>
        </div>
      </aside>

      <main className="atlas-main">
        <header className="topbar">
          <div className="breadcrumb"><Landmark size={16} /> Ecossistema Jurídico Clovis <ChevronRight size={15} /> Jurimetria pública</div>
          <div className="topbar-actions"><a className="structure-link" href="/estrutura"><Landmark size={16} /> Estrutura</a><a className="compendium-link" href="/compendio"><BookOpenCheck size={16} /> Abrir Compêndio</a><button className="export-button" onClick={downloadFiltered}><ArrowDownToLine size={16} /> Baixar recorte</button></div>
        </header>

        <section className="hero-panel" id="visao">
          <div className="hero-text">
            <span className="eyebrow">CENSO • AMOSTRA • EVIDÊNCIA</span>
            <h1>O volume muda.<br /><em>O denominador</em> permanece explícito.</h1>
            <p>Comparação auditável entre a distribuição de causas, unidades jurisdicionais e tempo observado de tramitação no JEC de Belo Horizonte e Betim.</p>
            <div className="hero-tags"><Pill tone="city">Classe 436</Pill><Pill>01/01/2025 — 26/08/2026</Pill><Pill tone="alert">2026 parcial</Pill></div>
            <PartialRuler />
          </div>
          <div className="hero-art" aria-hidden="true"><img src="/manus-storage/atlas-forense-hero_a0688916.jpg" alt="" /></div>
        </section>

        <section className="filter-ribbon" aria-label="Filtros do painel">
          <div className="filter-intro"><Filter size={17} /><span>Refinar a evidência</span></div>
          <div className="filter-group">
            <span>Município</span>
            <div className="segmented-control">
              {(["Todos", "Belo Horizonte", "Betim"] as CityFilter[]).map((option) => <button key={option} onClick={() => setCity(option)} className={city === option ? "active" : ""}>{option === "Belo Horizonte" ? "BH" : option}</button>)}
            </div>
          </div>
          <label className="year-select"><span>Atalho anual</span><select value={year} onChange={(event) => setQuickYear(event.target.value as YearFilter)}><option value="Todos">2025 + 2026*</option><option value="2025">2025</option><option value="2026">2026*</option></select></label>
          <div className="date-range" aria-label="Período personalizado"><label><span>Data inicial</span><input type="date" min={MIN_DATE} max={MAX_DATE} value={dateStart} onChange={(event) => updateStart(event.target.value)} /></label><i>até</i><label><span>Data final</span><input type="date" min={MIN_DATE} max={MAX_DATE} value={dateEnd} onChange={(event) => updateEnd(event.target.value)} /></label></div>
          <div className="filter-note"><CircleHelp size={15} /> O período personalizado atualiza o dossiê, o gráfico mensal, a comparação de órgãos e as exportações.</div>
        </section>

        <AdvancedEvidencePanel city={city} year={year} startDate={dateStart} endDate={dateEnd} />

        {activeYears.includes("2026") && <div className="partial-alert"><CalendarClock size={17} /><span><strong>2026 é parcial:</strong> a comparação anual deve considerar que os processos foram coletados até 26/08/2026.</span></div>}

        <section className="metrics-grid evidence-section" data-stage="00 · RECORTE" aria-label="Indicadores principais">
          <MetricCard label="Censo no recorte" value={fmt.format(totals.censo)} caption="Processos retornados no censo DataJud." icon={Scale} accent="petrol" />
          <MetricCard label="Amostra concreta" value={fmt.format(totals.amostra)} caption={`${fmtOne.format(totals.cobertura)}% do censo filtrado; não aleatória.`} icon={BookOpenCheck} accent="copper" />
          <MetricCard label="Tempo médio observado" value={totals.media ? `${fmtOne.format(totals.media)} dias` : "—"} caption="Ajuizamento até último movimento público." icon={CalendarClock} accent="ink" />
          <MetricCard label="Registros com movimento" value={fmt.format(totals.movimentados)} caption="Usados no cálculo de tempo observado." icon={ArrowUpRight} accent="clay" />
        </section>

        <section className="dashboard-grid primary-grid evidence-section" data-stage="01 · CENSO">
          <article className="chart-card volume-card" data-evidence="FICHA 01 · CENSO DATAJUD">
            <ChartTitle eyebrow="CENSO OFICIAL" title="Volume por município e ano" note="2026 é parcial; barras não representam variação anual comparável sem ajuste temporal." />
            <PartialRuler compact />
            <div className="chart-frame tall">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={annualVolumes} margin={{ top: 14, right: 8, left: 0, bottom: 0 }} barGap={10}>
                  <CartesianGrid vertical={false} stroke="#d8d2c6" strokeDasharray="2 6" />
                  <XAxis dataKey="ano" tickLine={false} axisLine={false} tick={{ fill: "#665b50", fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#665b50", fontSize: 12 }} tickFormatter={(value) => fmt.format(value)} />
                  <Tooltip formatter={(value: number) => fmt.format(value)} contentStyle={{ borderRadius: 2, border: "1px solid #d8d2c6", background: "#fffdf8" }} />
                  <Legend iconType="square" wrapperStyle={{ fontSize: 12 }} />
                  {activeCities.includes("Belo Horizonte") && <Bar dataKey="Belo Horizonte" fill={CITY_COLOR["Belo Horizonte"]} radius={[2, 2, 0, 0]} maxBarSize={52} />}
                  {activeCities.includes("Betim") && <Bar dataKey="Betim" fill={CITY_COLOR.Betim} radius={[2, 2, 0, 0]} maxBarSize={52} />}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="evidence-card">
            <img src="/manus-storage/atlas-forense-evidence_0ee8172d.jpg" alt="Textura abstrata de evidência documental" />
            <div className="evidence-copy">
              <span className="eyebrow">LEITURA COMPARADA</span>
              <h2>2025 sustenta a comparação de tempo.</h2>
              <p>Na amostra de 2025, Belo Horizonte registrou média observada de <strong>144,9 dias</strong>; Betim, <strong>169,9 dias</strong>. A diferença é descritiva e não prova desempenho, produtividade ou tempo até sentença.</p>
              <a href="#tempo">Ver metodologia <ChevronRight size={16} /></a>
            </div>
          </article>
        </section>

        <section className="dashboard-grid causes-grid evidence-section" data-stage="02 · AMOSTRA" id="causas">
          <article className="chart-card cause-list-card" data-evidence="FICHA 02 · ASSUNTOS CNJ">
            <ChartTitle eyebrow="ASSUNTOS CNJ" title="Causas mais presentes na amostra" note="Um mesmo processo pode conter mais de um assunto; as menções não são mutuamente exclusivas." />
            <div className="cause-bars">
              {causes.map((item, index) => <div className="cause-row" key={item.causa}><span className="cause-rank">{String(index + 1).padStart(2, "0")}</span><span className="cause-label">{item.causa}</span><div className="cause-track"><i style={{ width: `${(item.processos / (causes[0]?.processos || 1)) * 100}%` }} /></div><strong>{item.processos}</strong></div>)}
            </div>
          </article>

          <article className="chart-card cause-chart-card" data-evidence="FICHA 02 · COMPARAÇÃO">
            <ChartTitle eyebrow="DISTRIBUIÇÃO COMPARADA" title="Oito causas de maior recorrência" note="Barras representam menções de assunto na amostra filtrada." />
            <div className="chart-frame cause-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={causeSplit} layout="vertical" margin={{ top: 0, right: 18, left: 16, bottom: 0 }} barGap={4}>
                  <CartesianGrid horizontal={false} stroke="#d8d2c6" strokeDasharray="2 6" />
                  <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: "#665b50", fontSize: 11 }} />
                  <YAxis type="category" dataKey="causa" width={134} tickLine={false} axisLine={false} tick={{ fill: "#40372f", fontSize: 11 }} />
                  <Tooltip formatter={(value: number) => `${value} menções`} contentStyle={{ borderRadius: 2, border: "1px solid #d8d2c6", background: "#fffdf8" }} />
                  <Legend iconType="square" wrapperStyle={{ fontSize: 12 }} />
                  {activeCities.includes("Belo Horizonte") && <Bar dataKey="Belo Horizonte" fill={CITY_COLOR["Belo Horizonte"]} radius={[0, 2, 2, 0]} />}
                  {activeCities.includes("Betim") && <Bar dataKey="Betim" fill={CITY_COLOR.Betim} radius={[0, 2, 2, 0]} />}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>
        </section>

        <section className="dashboard-grid units-grid evidence-section" data-stage="03 · UNIDADES" id="unidades">
          <article className="chart-card unit-chart-card" data-evidence="FICHA 03 · ÓRGÃOS JULGADORES">
            <ChartTitle eyebrow="UNIDADES JURISDICIONAIS" title="Processos amostrados por código" note="Betim está concentrado no órgão 40011; Belo Horizonte se distribui entre múltiplas unidades." />
            <div className="chart-frame unit-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={unitChart} margin={{ top: 10, right: 4, left: 0, bottom: 12 }}>
                  <CartesianGrid vertical={false} stroke="#d8d2c6" strokeDasharray="2 6" />
                  <XAxis dataKey="unidade" tickLine={false} axisLine={false} tick={{ fill: "#665b50", fontSize: 11 }} interval={0} angle={-32} textAnchor="end" height={58} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#665b50", fontSize: 11 }} />
                  <Tooltip formatter={(value: number) => `${value} processos`} contentStyle={{ borderRadius: 2, border: "1px solid #d8d2c6", background: "#fffdf8" }} />
                  <Bar dataKey="processos" radius={[2, 2, 0, 0]}>{unitChart.map((entry, index) => <Cell key={`${entry.unidade}-${index}`} fill={CITY_COLOR[entry.municipio]} />)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="unit-table-card" data-evidence="FICHA 03 · ÚLTIMO MOVIMENTO">
            <ChartTitle eyebrow="TEMPO POR UNIDADE" title="Último movimento observado" note="Ordenado pelo volume da amostra filtrada." />
            <div className="unit-table-wrap">
              <table>
                <thead><tr><th>Unidade</th><th>Município</th><th>Amostra</th><th>Média</th></tr></thead>
                <tbody>{units.slice(0, 12).map((unit) => <tr key={`${unit.municipio}-${unit.orgaoCodigo}`}><td><b>{unit.orgaoCodigo}</b><span>{unit.unidade}</span></td><td><span className={`city-dot ${unit.municipio === "Belo Horizonte" ? "bh" : "betim"}`} />{unit.municipio === "Belo Horizonte" ? "BH" : "Betim"}</td><td>{unit.processosAmostra}</td><td>{unit.tempoMedioDias === null ? "—" : `${fmtOne.format(unit.tempoMedioDias)} d`}</td></tr>)}</tbody>
              </table>
            </div>
          </article>
        </section>

        <section className="dashboard-grid time-grid evidence-section" data-stage="04 · TEMPO" id="tempo">
          <article className="chart-card duration-card" data-evidence="FICHA 04 · TEMPO OBSERVADO">
            <ChartTitle eyebrow="TEMPO OBSERVADO" title="Faixas até o último movimento público" note="Cálculo em dias corridos entre ajuizamento e último movimento retornado pelo DataJud." />
            <PartialRuler compact />
            <div className="chart-frame duration-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={durations} margin={{ top: 12, right: 8, left: 0, bottom: 8 }}>
                  <CartesianGrid vertical={false} stroke="#d8d2c6" strokeDasharray="2 6" />
                  <XAxis dataKey="faixa" tickLine={false} axisLine={false} tick={{ fill: "#665b50", fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#665b50", fontSize: 11 }} />
                  <Tooltip formatter={(value: number) => `${value} processos`} contentStyle={{ borderRadius: 2, border: "1px solid #d8d2c6", background: "#fffdf8" }} />
                  <Bar dataKey="processos" fill="#a64f35" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="chart-card pie-card" data-evidence="FICHA 04 · PESO DO CENSO">
            <ChartTitle eyebrow="PESO DO CENSO" title="Distribuição do volume filtrado" note="Representação do censo DataJud, não da amostra concreta." />
            <div className="chart-frame pie-frame">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={cityPie} dataKey="value" nameKey="name" innerRadius={66} outerRadius={103} paddingAngle={4} stroke="none">{cityPie.map((entry) => <Cell key={entry.name} fill={CITY_COLOR[entry.name]} />)}</Pie>
                  <Tooltip formatter={(value: number) => fmt.format(value)} contentStyle={{ borderRadius: 2, border: "1px solid #d8d2c6", background: "#fffdf8" }} />
                  <Legend iconType="square" wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </article>
        </section>

        <section className="method-section" id="metodo">
          <div className="method-art"><img src="/manus-storage/atlas-forense-municipal_aa1bc6b0.jpg" alt="Composição abstrata de municípios comparados" /></div>
          <div className="method-copy">
            <span className="eyebrow">TRILHA DE EVIDÊNCIA</span>
            <h2>O que este painel afirma — e o que ele não afirma.</h2>
            <div className="method-grid">
              <p><b>Afirma:</b> volumes do censo, menções de assuntos, unidades do DataJud e dias até o último movimento público retornado.</p>
              <p><b>Não afirma:</b> tempo definitivo, tempo até sentença, produtividade, taxa de êxito, mérito ou qualidade da decisão.</p>
            </div>
            <div className="method-source"><ShieldCheck size={18} /><span>Fonte: {data.meta.fonte}. Base de processos SHA-256: <code>{data.meta.hashBaseProcessos.slice(0, 16)}…</code></span></div>
          </div>
        </section>
      </main>
    </div>
  );
}
