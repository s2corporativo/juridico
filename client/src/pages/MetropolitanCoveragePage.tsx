import { ArrowLeft, Download, Landmark, MapPinned, Scale, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";

const fmt = new Intl.NumberFormat("pt-BR");

export default function MetropolitanCoveragePage() {
  const coverage = trpc.metropolitan.coverage.useQuery();
  const [municipality, setMunicipality] = useState("all");
  const [branch, setBranch] = useState("all");
  const data = coverage.data;
  const municipalities = useMemo(() => data?.municipalities.filter(item => municipality === "all" || String(item.ibgeCode) === municipality) ?? [], [data, municipality]);
  const selectedBranch = data?.legalBranches.find(item => item.key === branch);

  const exportCsv = () => {
    if (!data) return;
    const header = ["municipio", "codigo_ibge", "estado_cobertura", "orgaos_confirmados", "soma_facetas_orgaos", "fonte", "periodo", "limite_metodologico"];
    const rows = municipalities.map(item => [item.name, item.ibgeCode, item.state, item.bodyCount, item.facetAmount, "CNJ/DataJud API Pública · TJMG", `${data.readiness.periodStart ?? "—"} a ${data.readiness.periodEnd ?? "—"}`, "Facetas agregadas por órgão; não é censo municipal, estoque, taxa ou série mensal."]);
    const blob = new Blob(["\ufeff" + [header, ...rows].map(row => row.map(value => `\"${String(value).replaceAll('"', '""')}\"`).join(";")).join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `atlas-rmbh-cobertura-${municipality === "all" ? "todos" : municipality}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return <main className="min-h-screen bg-[#f4f0e8] px-4 py-6 text-[#2a2823] sm:px-8 lg:px-12">
    <header className="mx-auto flex max-w-7xl flex-col gap-5 border-b border-[#d5ccbd] pb-6 sm:flex-row sm:items-start sm:justify-between">
      <div><a href="/" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#1a5652]"><ArrowLeft size={16} /> Voltar ao Atlas</a><p className="text-xs font-bold tracking-[0.19em] text-[#a16632]">COBERTURA TERRITORIAL · RMBH</p><h1 className="mt-2 font-serif text-4xl leading-none sm:text-5xl">Órgãos, território e <em className="text-[#13514e]">proveniência.</em></h1><p className="mt-4 max-w-3xl text-sm leading-6 text-[#60584e]">Mapa de órgãos TJMG retornados no recorte da classe 436 e associados por rótulo exato a municípios da Região Metropolitana de Belo Horizonte. A identificação institucional de unidade JEC é exibida separadamente; esta camada não consulta nem exibe processos individuais.</p></div>
      <button onClick={exportCsv} disabled={!data} className="inline-flex items-center justify-center gap-2 border border-[#13514e] bg-[#13514e] px-4 py-3 text-sm font-bold text-[#faf7f0] disabled:opacity-50"><Download size={16} /> Exportar cobertura</button>
    </header>

    {coverage.isLoading && <p className="mx-auto max-w-7xl py-16 text-[#60584e]">Carregando cobertura territorial auditável…</p>}
    {coverage.isError && <p className="mx-auto max-w-7xl py-16 text-[#9b4635]">A cobertura RMBH não pôde ser carregada. O painel nacional e o Compêndio não foram alterados.</p>}
    {data && <div className="mx-auto max-w-7xl py-8">
      <section className="grid gap-px overflow-hidden border border-[#d5ccbd] bg-[#d5ccbd] sm:grid-cols-2 lg:grid-cols-4">
        <article className="bg-[#fffdf8] p-5"><span className="text-xs font-bold tracking-[0.14em] text-[#7d6e5e]">MUNICÍPIOS RMBH</span><strong className="mt-2 block text-3xl text-[#13514e]">{fmt.format(data.readiness.mappedMunicipalities)}/{fmt.format(data.readiness.expectedMunicipalities)}</strong><p className="mt-2 text-xs leading-5 text-[#60584e]">Com órgão TJMG confirmado no recorte.</p></article>
        <article className="bg-[#fffdf8] p-5"><span className="text-xs font-bold tracking-[0.14em] text-[#7d6e5e]">ÓRGÃOS MAPEADOS</span><strong className="mt-2 block text-3xl text-[#13514e]">{fmt.format(data.readiness.totalBodies)}</strong><p className="mt-2 text-xs leading-5 text-[#60584e]">Alias TJMG preservado por linha.</p></article>
        <article className="bg-[#fffdf8] p-5"><span className="text-xs font-bold tracking-[0.14em] text-[#7d6e5e]">RECORTE</span><strong className="mt-2 block text-xl text-[#13514e]">Classe 436 · JE</strong><p className="mt-2 text-xs leading-5 text-[#60584e]">{data.readiness.periodStart} a {data.readiness.periodEnd}; 2026 parcial.</p></article>
        <article className="bg-[#fffdf8] p-5"><span className="text-xs font-bold tracking-[0.14em] text-[#7d6e5e]">ESTADO</span><strong className="mt-2 block text-xl uppercase text-[#13514e]">{data.readiness.state}</strong><p className="mt-2 text-xs leading-5 text-[#60584e]">Facetas agregadas; sem processos individuais.</p></article>
      </section>

      <section className="mt-8 grid gap-4 rounded-sm border border-[#d5ccbd] bg-[#fffdf8] p-5 lg:grid-cols-[1fr_1fr_auto]">
        <label className="text-sm font-semibold text-[#40372f]">Município<select value={municipality} onChange={event => setMunicipality(event.target.value)} className="mt-2 w-full border border-[#bfb3a3] bg-white px-3 py-2 text-sm"><option value="all">Todos os 34 municípios RMBH</option>{data.municipalities.map(item => <option key={item.ibgeCode} value={item.ibgeCode}>{item.name}</option>)}</select></label>
        <label className="text-sm font-semibold text-[#40372f]">Ramo jurídico<select value={branch} onChange={event => setBranch(event.target.value)} className="mt-2 w-full border border-[#bfb3a3] bg-white px-3 py-2 text-sm"><option value="all">Mapa de expansão por ramos</option>{data.legalBranches.map(item => <option key={item.key} value={item.key}>{item.label}</option>)}</select></label>
        <div className="flex items-end"><p className="text-xs leading-5 text-[#60584e]">O filtro territorial seleciona as facetas. O ramo descreve a frente de expansão e não reclassifica este recorte JEC.</p></div>
      </section>

      {selectedBranch && <section className="mt-4 border-l-4 border-[#b56f2c] bg-[#f2e8d9] px-5 py-4"><div className="flex gap-3"><Scale className="mt-0.5 shrink-0 text-[#8a4f20]" size={18} /><div><strong>{selectedBranch.label}</strong><p className="mt-1 text-sm text-[#604d3b]">Raízes TPU: {selectedBranch.topicRoots.join(", ")} · jurisdições previstas: {selectedBranch.jurisdictions.join(", ")}. {selectedBranch.scopeNote}</p></div></div></section>}

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {municipalities.map(item => <article key={item.ibgeCode} className={`border p-5 ${item.state === "mapped" ? "border-[#b9cfc9] bg-[#f7fbf9]" : "border-[#d7cfc2] bg-[#fbf8f2]"}`}>
          <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold tracking-[0.14em] text-[#7d6e5e]">RMBH · IBGE {item.ibgeCode}</p><h2 className="mt-1 font-serif text-2xl">{item.name}</h2></div><MapPinned size={20} className={item.state === "mapped" ? "text-[#13514e]" : "text-[#a16632]"} /></div>
          {item.state === "mapped" ? <><div className="mt-5 grid grid-cols-3 gap-3 border-y border-[#d4e1dc] py-3"><div><span className="block text-[11px] font-bold tracking-wider text-[#60736e]">ÓRGÃOS</span><strong className="text-xl text-[#13514e]">{fmt.format(item.bodyCount)}</strong></div><div><span className="block text-[11px] font-bold tracking-wider text-[#60736e]">NOME JEC/UJ</span><strong className="text-xl text-[#13514e]">{fmt.format(item.jecNamedBodyCount)}</strong></div><div><span className="block text-[11px] font-bold tracking-wider text-[#60736e]">FACETAS</span><strong className="text-xl text-[#13514e]">{fmt.format(item.facetAmount)}</strong></div></div><ul className="mt-4 space-y-2 text-xs leading-5 text-[#514a42]">{item.bodies.slice(0, 3).map(body => <li key={body.code}><b className="text-[#13514e]">{body.code}</b> · {body.label} <span className="text-[#7d6e5e]">({fmt.format(body.amount)})</span>{body.institutionalStatus === "other_named" && <small className="mt-0.5 block text-[#8a4f20]">Rótulo institucional não identifica JEC/UJ; mantido apenas como retorno do recorte classe 436.</small>}</li>)}{item.bodies.length > 3 && <li className="text-[#7d6e5e]">+ {item.bodies.length - 3} órgão(s) no recorte.</li>}</ul></> : <p className="mt-5 border-t border-[#e1d7ca] pt-4 text-sm leading-6 text-[#685d50]">Sem órgão com vínculo literal à comarca nesta execução. Não se presume cobertura por município-sede, proximidade territorial ou faceta nacional sem alias.</p>}
        </article>)}
      </section>

      <section className="mt-8 grid gap-4 border border-[#13514e] bg-[#123f3e] p-5 text-[#f4f0e8] lg:grid-cols-[auto_1fr]"><ShieldCheck size={28} className="text-[#e3b778]" /><div><h2 className="font-serif text-2xl">Limite de leitura</h2><p className="mt-2 max-w-4xl text-sm leading-6 text-[#d8e2dc]">{data.readiness.coverageNote} A soma de facetas de órgão não deve ser lida como processos únicos, estoque, produtividade, taxa de êxito ou comparação completa entre municípios. O retorno pela classe 436 não substitui a identificação institucional de competência. Municípios sem órgão confirmado permanecem visíveis como lacuna metodológica.</p><p className="mt-3 text-xs font-bold tracking-[0.1em] text-[#e3b778]"><Landmark size={13} className="mr-1 inline" /> Fonte: CNJ/DataJud API Pública · TJMG · consulta agregada `size=0`.</p></div></section>
    </div>}
  </main>;
}
