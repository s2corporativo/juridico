/** Atlas Forense: filtros múltiplos, evidência censitária e relatório de impressão. */
import { useMemo, useState } from "react";
import { ArrowDownToLine, ArrowUpRight, BarChart3, FileText, Filter, Plus, Printer, X } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { jecDashboardData } from "@/data/jecDashboardData";

type CityFilter = "Todos" | "Belo Horizonte" | "Betim";
type YearFilter = "Todos" | "2025" | "2026";
type ProcessRow = { municipio: string; ano: string; orgaoCodigo: string; unidade: string; assuntos: string[]; dataAjuizamento: string; ultimoMovimento: string; ultimoMovimentoData: string; tempoObservadoDias: number | null; temBaixaObservada: boolean; fonteStatus: string };
type TimelineCensus = { municipio: string; mes: string; distribuicoesCenso: number; baixasCensoProcessos: number; fonteStatus: string; nota: string };

const data = jecDashboardData as unknown as { meta: Record<string, string>; processRows: ProcessRow[]; timelineCensus: TimelineCensus[] };
const fmt = new Intl.NumberFormat("pt-BR");
const months = ["2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06", "2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12", "2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06", "2026-07", "2026-08"];

export function AdvancedEvidencePanel({ city, year }: { city: CityFilter; year: YearFilter }) {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedOrgaos, setSelectedOrgaos] = useState<string[]>([]);
  const [orgaoDraft, setOrgaoDraft] = useState("");

  const subjects = useMemo(() => Array.from(new Set(data.processRows.flatMap((row) => row.assuntos))).sort((a, b) => a.localeCompare(b, "pt-BR")), []);
  const orgaos = useMemo(() => Array.from(new Map(data.processRows.map((row) => [row.orgaoCodigo, { codigo: row.orgaoCodigo, unidade: row.unidade }])).values()).sort((a, b) => a.unidade.localeCompare(b.unidade, "pt-BR")), []);
  const includes = (item: ProcessRow) =>
    (city === "Todos" || item.municipio === city) &&
    (year === "Todos" || item.ano === year) &&
    (!selectedSubjects.length || selectedSubjects.some((subject) => item.assuntos.includes(subject))) &&
    (!selectedOrgaos.length || selectedOrgaos.includes(item.orgaoCodigo));
  const rows = useMemo(() => data.processRows.filter(includes), [city, year, selectedSubjects, selectedOrgaos]);

  const timeline = useMemo(() => months
    .filter((month) => (year === "Todos" || month.startsWith(year)))
    .map((month) => {
      const bh = data.timelineCensus.find((row) => row.municipio === "Belo Horizonte" && row.mes === month);
      const betim = data.timelineCensus.find((row) => row.municipio === "Betim" && row.mes === month);
      return {
        mes: `${month.slice(5, 7)}/${month.slice(2, 4)}`,
        bhDistribuicoes: city === "Betim" ? null : bh?.distribuicoesCenso ?? 0,
        bhBaixas: city === "Betim" ? null : bh?.baixasCensoProcessos ?? 0,
        betimDistribuicoes: city === "Belo Horizonte" ? null : betim?.distribuicoesCenso ?? 0,
        betimBaixas: city === "Belo Horizonte" ? null : betim?.baixasCensoProcessos ?? 0,
      };
    }), [city, year]);

  const comparison = useMemo(() => {
    const grouped = new Map<string, { codigo: string; unidade: string; municipio: string; processos: number; tempos: number[] }>();
    rows.forEach((row) => {
      const key = row.orgaoCodigo;
      const current = grouped.get(key) ?? { codigo: key, unidade: row.unidade, municipio: row.municipio, processos: 0, tempos: [] };
      current.processos += 1;
      if (row.tempoObservadoDias !== null) current.tempos.push(row.tempoObservadoDias);
      grouped.set(key, current);
    });
    const ordered = Array.from(grouped.values()).sort((a, b) => b.processos - a.processos);
    const selected = selectedOrgaos.length ? ordered.filter((row) => selectedOrgaos.includes(row.codigo)) : ordered.slice(0, 3);
    return selected.map((row) => ({ ...row, rotulo: `${row.codigo} · ${row.unidade.replace("Unidade Jurisdicional ", "")}`, tempoMedio: row.tempos.length ? Math.round((row.tempos.reduce((sum, value) => sum + value, 0) / row.tempos.length) * 10) / 10 : null }));
  }, [rows, selectedOrgaos]);

  const activeFilters = [
    city === "Todos" ? "Belo Horizonte e Betim" : city,
    year === "Todos" ? "2025 e 2026 parcial" : year === "2026" ? "2026 parcial" : "2025",
    selectedSubjects.length ? `${selectedSubjects.length} assunto(s) CNJ` : "Todos os assuntos",
    selectedOrgaos.length ? `${selectedOrgaos.length} órgão(s) selecionado(s)` : "Órgãos comparados por volume",
  ];

  const toggleSubject = (subject: string) => setSelectedSubjects((current) => current.includes(subject) ? current.filter((item) => item !== subject) : [...current, subject]);
  const addOrgao = () => {
    if (orgaoDraft && !selectedOrgaos.includes(orgaoDraft) && selectedOrgaos.length < 3) setSelectedOrgaos((current) => [...current, orgaoDraft]);
    setOrgaoDraft("");
  };
  const csvCell = (value: string | number | boolean | null) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const exportCsv = () => {
    const metadata = ["# Atlas Forense — recorte filtrado", `# Filtros: ${activeFilters.join(" | ")}`, `# Fonte: ${data.meta.fonte}`, `# Série mensal: ${data.meta.alertaTimeline}`];
    const header = "municipio;ano;orgao_codigo;unidade;assuntos_cnj;data_ajuizamento;ultimo_movimento;data_ultimo_movimento;tempo_observado_dias;baixa_observada;fonte_status";
    const lines = rows.map((row) => [row.municipio, row.ano, row.orgaoCodigo, row.unidade, row.assuntos.join(" | "), row.dataAjuizamento, row.ultimoMovimento, row.ultimoMovimentoData, row.tempoObservadoDias, row.temBaixaObservada, row.fonteStatus].map(csvCell).join(";"));
    const blob = new Blob(["\ufeff" + [...metadata, header, ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `atlas-forense-recorte-${city.toLowerCase().replaceAll(" ", "-")}-${year}-${rows.length}-processos.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="advanced-evidence evidence-section" data-stage="01A · DETALHE" id="detalhe">
      <article className="print-report" aria-hidden="true">
        <span>ATLAS FORENSE · RELATÓRIO JURIMÉTRICO</span>
        <h1>JEC comparado<br />Belo Horizonte e Betim</h1>
        <p>Relatório de evidência pública gerado pelo painel interativo, com os filtros ativos, recorte metodológico e anexos de rastreabilidade.</p>
        <dl><dt>Filtros ativos</dt><dd>{activeFilters.join(" · ")}</dd><dt>Fonte</dt><dd>{data.meta.fonte}</dd><dt>Recorte</dt><dd>{data.meta.recorte}</dd><dt>Classe</dt><dd>{data.meta.classe}</dd></dl>
        <footer>Sem dados pessoais. Censo, amostra e movimentos são camadas distintas.</footer>
      </article>

      <div className="advanced-heading">
        <div><span className="eyebrow">DOSSÊ FILTRÁVEL</span><h2>Assunto CNJ, órgãos e série censitária</h2><p>O detalhe usa os 800 processos concretos sem dados pessoais. A linha temporal apresenta o censo territorial de distribuições e as baixas definitivas do coorte 2025–2026.</p></div>
        <div className="advanced-actions"><button onClick={exportCsv}><ArrowDownToLine size={15} /> CSV filtrado</button><button onClick={() => window.print()}><FileText size={15} /> PDF / imprimir</button></div>
      </div>

      <div className="advanced-filters multi-filters">
        <div className="filter-symbol"><Filter size={17} /><span>Camada de detalhe</span></div>
        <label className="multi-subject"><span>Assuntos CNJ · múltipla seleção</span><details><summary>{selectedSubjects.length ? `${selectedSubjects.length} assunto(s) selecionado(s)` : "Todos os assuntos"}</summary><div className="subject-options">{subjects.map((item) => <label key={item}><input type="checkbox" checked={selectedSubjects.includes(item)} onChange={() => toggleSubject(item)} /> <span>{item}</span></label>)}</div></details><button type="button" className="clear-filter" onClick={() => setSelectedSubjects([])} disabled={!selectedSubjects.length}>Limpar assuntos</button></label>
        <label className="organ-picker"><span>Órgãos para comparar · até 3</span><div className="organ-add"><select value={orgaoDraft} onChange={(event) => setOrgaoDraft(event.target.value)}><option value="">Selecione um órgão</option>{orgaos.map((item) => <option key={item.codigo} value={item.codigo}>{item.codigo} — {item.unidade}</option>)}</select><button type="button" onClick={addOrgao} disabled={!orgaoDraft || selectedOrgaos.length >= 3}><Plus size={15} /> Adicionar</button></div><div className="organ-tags">{selectedOrgaos.length ? selectedOrgaos.map((code) => <button type="button" key={code} onClick={() => setSelectedOrgaos((current) => current.filter((item) => item !== code))}>{code}<X size={12} /></button>) : <span>Sem seleção: exibe os três órgãos com maior volume no recorte.</span>}</div></label>
        <div className="advanced-count"><b>{fmt.format(rows.length)}</b><span>processos no recorte detalhado</span></div>
      </div>

      <div className="advanced-grid">
        <article className="timeline-card" data-evidence="FICHA 01A · CENSO MENSAL">
          <div className="timeline-title"><ArrowUpRight size={17} /><div><span>EVOLUÇÃO MENSAL</span><h3>Distribuições e baixas do coorte</h3></div></div>
          <div className="timeline-chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={timeline} margin={{ top: 12, right: 12, left: -12, bottom: 0 }}><CartesianGrid vertical={false} stroke="#d8d2c6" strokeDasharray="2 6" /><XAxis dataKey="mes" tickLine={false} axisLine={false} tick={{ fill: "#665b50", fontSize: 10 }} interval={1} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "#665b50", fontSize: 10 }} /><Tooltip contentStyle={{ borderRadius: 2, border: "1px solid #d8d2c6", background: "#fffdf8" }} /><Legend iconType="plainline" wrapperStyle={{ fontSize: 11 }} />{city !== "Betim" && <Line type="monotone" dataKey="bhDistribuicoes" name="BH · distribuições" stroke="#154b4a" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />}{city !== "Betim" && <Line type="monotone" dataKey="bhBaixas" name="BH · baixas definitivas" stroke="#75a39b" strokeWidth={2} strokeDasharray="5 4" dot={false} activeDot={{ r: 4 }} />}{city !== "Belo Horizonte" && <Line type="monotone" dataKey="betimDistribuicoes" name="Betim · distribuições" stroke="#b56f2c" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />}{city !== "Belo Horizonte" && <Line type="monotone" dataKey="betimBaixas" name="Betim · baixas definitivas" stroke="#e2ac6f" strokeWidth={2} strokeDasharray="5 4" dot={false} activeDot={{ r: 4 }} />}</LineChart></ResponsiveContainer></div>
          <p className="timeline-note"><Printer size={13} /> Para gerar PDF, use o botão e selecione “Salvar como PDF” no diálogo do navegador. <strong>{data.meta.alertaTimeline} {data.meta.definicaoBaixaCenso}</strong></p>
        </article>
        <aside className="advanced-note"><span className="eyebrow">LEITURA RESPONSÁVEL</span><h3>O censo permanece territorial; os filtros aprofundam o dossiê.</h3><p>Assuntos e órgãos filtram os processos detalhados, a comparação e o CSV. A série censitária mensal é deliberadamente preservada como referência ampla do território.</p><div><span>Fonte</span><b>DataJud · TJMG</b></div><div><span>Exportação</span><b>CSV e impressão PDF</b></div></aside>
      </div>

      <article className="organ-comparison" data-evidence="FICHA 01B · ÓRGÃOS">
        <div className="comparison-heading"><div><span>COMPARAÇÃO DE ÓRGÃOS</span><h3>Até três unidades no mesmo recorte</h3></div><p>Processos da amostra detalhada e tempo observado até o último movimento público.</p></div>
        <div className="comparison-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={comparison} layout="vertical" margin={{ top: 4, right: 20, left: 0, bottom: 2 }}><CartesianGrid horizontal={false} stroke="#d8d2c6" strokeDasharray="2 6" /><XAxis type="number" allowDecimals={false} tick={{ fill: "#665b50", fontSize: 10 }} /><YAxis type="category" dataKey="rotulo" width={176} tick={{ fill: "#5c4f44", fontSize: 10 }} /><Tooltip contentStyle={{ borderRadius: 2, border: "1px solid #d8d2c6", background: "#fffdf8" }} formatter={(value: number) => [fmt.format(value), "Processos da amostra"]} /><Bar dataKey="processos" name="Processos" fill="#154b4a" radius={[0, 2, 2, 0]} /></BarChart></ResponsiveContainer></div>
        <div className="comparison-stats">{comparison.map((item) => <div key={item.codigo}><b>{item.codigo}</b><span>{item.municipio}</span><strong>{item.tempoMedio === null ? "—" : `${item.tempoMedio.toLocaleString("pt-BR")} d`}</strong><small>média observada</small></div>)}</div>
      </article>

      <section className="print-annex" aria-hidden="true"><h2>Anexo metodológico</h2><p><b>Distribuições mensais:</b> contagem oficial de processos ajuizados no JEC, classe CNJ 436, por município e mês.</p><p><b>Baixas definitivas:</b> processos do coorte de ajuizamento 2025–2026 que receberam o movimento público “Baixa Definitiva” no mês, contados uma vez por mês.</p><p><b>Tempo observado:</b> {data.meta.definicaoTempo} {data.meta.alertaTempo}</p><p><b>Rastreabilidade:</b> {data.meta.fonte}. Base de processos SHA-256: {data.meta.hashBaseProcessos}.</p></section>
    </section>
  );
}
