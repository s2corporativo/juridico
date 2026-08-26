/** Atlas Forense: dossiê filtrável de assuntos, órgãos e movimentos observados. */
import { useMemo, useState } from "react";
import { ArrowDownToLine, ArrowUpRight, FileText, Filter, Printer } from "lucide-react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { jecDashboardData } from "@/data/jecDashboardData";

type CityFilter = "Todos" | "Belo Horizonte" | "Betim";
type YearFilter = "Todos" | "2025" | "2026";
type ProcessRow = { municipio: string; ano: string; orgaoCodigo: string; unidade: string; assuntos: string[]; dataAjuizamento: string; ultimoMovimento: string; ultimoMovimentoData: string; tempoObservadoDias: number | null; temBaixaObservada: boolean; fonteStatus: string };
type TimelineEvent = { municipio: string; ano: string; orgaoCodigo: string; assuntos: string[]; mesDistribuicao: string; mesBaixa: string; fonteStatus: string };

const data = jecDashboardData as unknown as { meta: Record<string, string>; processRows: ProcessRow[]; timelineEvents: TimelineEvent[] };
const fmt = new Intl.NumberFormat("pt-BR");

export function AdvancedEvidencePanel({ city, year }: { city: CityFilter; year: YearFilter }) {
  const [subject, setSubject] = useState("Todos");
  const [orgao, setOrgao] = useState("Todos");
  const includes = (item: { municipio: string; ano: string; orgaoCodigo: string; assuntos: string[] }) =>
    (city === "Todos" || item.municipio === city) && (year === "Todos" || item.ano === year) && (subject === "Todos" || item.assuntos.includes(subject)) && (orgao === "Todos" || item.orgaoCodigo === orgao);

  const subjects = useMemo(() => Array.from(new Set(data.processRows.flatMap((row) => row.assuntos))).sort((a, b) => a.localeCompare(b, "pt-BR")), []);
  const orgaos = useMemo(() => Array.from(new Map(data.processRows.map((row) => [row.orgaoCodigo, { codigo: row.orgaoCodigo, unidade: row.unidade }])).values()).sort((a, b) => a.unidade.localeCompare(b.unidade, "pt-BR")), []);
  const rows = useMemo(() => data.processRows.filter(includes), [city, year, subject, orgao]);
  const timeline = useMemo(() => {
    const months = ["2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06", "2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12", "2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06", "2026-07", "2026-08"].filter((month) => year === "Todos" || month.startsWith(year));
    const events = data.timelineEvents.filter(includes);
    return months.map((month) => ({ mes: `${month.slice(5, 7)}/${month.slice(2, 4)}`, distribuicoes: events.filter((event) => event.mesDistribuicao === month).length, baixas: events.filter((event) => event.mesBaixa === month).length }));
  }, [city, year, subject, orgao]);

  const csvCell = (value: string | number | boolean | null) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const exportCsv = () => {
    const header = "municipio;ano;orgao_codigo;unidade;assuntos_cnj;data_ajuizamento;ultimo_movimento;data_ultimo_movimento;tempo_observado_dias;baixa_observada;fonte_status";
    const lines = rows.map((row) => [row.municipio, row.ano, row.orgaoCodigo, row.unidade, row.assuntos.join(" | "), row.dataAjuizamento, row.ultimoMovimento, row.ultimoMovimentoData, row.tempoObservadoDias, row.temBaixaObservada, row.fonteStatus].map(csvCell).join(";"));
    const blob = new Blob(["\ufeff" + [header, ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `atlas-forense-recorte-${city.toLowerCase().replaceAll(" ", "-")}-${year}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="advanced-evidence evidence-section" data-stage="01A · DETALHE" id="detalhe">
      <div className="advanced-heading">
        <div><span className="eyebrow">DOSSÊ FILTRÁVEL</span><h2>Assunto CNJ, órgão julgador e série mensal</h2><p>Os filtros usam os 800 processos concretos sem dados pessoais. A série temporal mostra somente distribuições e baixas observadas na amostra; não é censo mensal.</p></div>
        <div className="advanced-actions"><button onClick={exportCsv}><ArrowDownToLine size={15} /> CSV filtrado</button><button onClick={() => window.print()}><FileText size={15} /> PDF / imprimir</button></div>
      </div>

      <div className="advanced-filters">
        <div className="filter-symbol"><Filter size={17} /><span>Camada de detalhe</span></div>
        <label><span>Assunto CNJ</span><select value={subject} onChange={(event) => setSubject(event.target.value)}><option value="Todos">Todos os assuntos</option>{subjects.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <label><span>Órgão julgador</span><select value={orgao} onChange={(event) => setOrgao(event.target.value)}><option value="Todos">Todos os órgãos</option>{orgaos.map((item) => <option key={item.codigo} value={item.codigo}>{item.codigo} — {item.unidade}</option>)}</select></label>
        <div className="advanced-count"><b>{fmt.format(rows.length)}</b><span>processos no recorte</span></div>
      </div>

      <div className="advanced-grid">
        <article className="timeline-card" data-evidence="FICHA 01A · SÉRIE MENSAL">
          <div className="timeline-title"><ArrowUpRight size={17} /><div><span>EVOLUÇÃO MENSAL</span><h3>Distribuições e baixas observadas</h3></div></div>
          <div className="timeline-chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={timeline} margin={{ top: 12, right: 12, left: -12, bottom: 0 }}><CartesianGrid vertical={false} stroke="#d8d2c6" strokeDasharray="2 6" /><XAxis dataKey="mes" tickLine={false} axisLine={false} tick={{ fill: "#665b50", fontSize: 10 }} interval={1} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "#665b50", fontSize: 10 }} /><Tooltip contentStyle={{ borderRadius: 2, border: "1px solid #d8d2c6", background: "#fffdf8" }} /><Legend iconType="plainline" wrapperStyle={{ fontSize: 11 }} /><Line type="monotone" dataKey="distribuicoes" name="Distribuições na amostra" stroke="#154b4a" strokeWidth={2.5} dot={{ r: 2.5 }} activeDot={{ r: 4 }} /><Line type="monotone" dataKey="baixas" name="Baixas observadas" stroke="#b56f2c" strokeWidth={2.5} dot={{ r: 2.5 }} activeDot={{ r: 4 }} /></LineChart></ResponsiveContainer></div>
          <p className="timeline-note"><Printer size={13} /> Para gerar PDF, use o botão e selecione “Salvar como PDF” no diálogo do navegador. <strong>{data.meta.alertaTimeline}</strong></p>
        </article>
        <aside className="advanced-note"><span className="eyebrow">LEITURA RESPONSÁVEL</span><h3>Filtro reduz amostra; não recalibra o censo.</h3><p>Ao selecionar assunto ou órgão, as fichas detalhadas passam a representar apenas a subamostra correspondente. O volume de censo permanece disponível na camada superior como referência territorial e temporal.</p><div><span>Fonte</span><b>Movimento observado</b></div><div><span>Exportação</span><b>CSV e impressão PDF</b></div></aside>
      </div>
    </section>
  );
}
