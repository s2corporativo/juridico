import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { AlertTriangle, ArrowLeft, CheckCircle2, Database, FileCheck2, FileLock2, KeyRound, Scale, Search, ShieldCheck, Upload, XCircle } from "lucide-react";
import { useState } from "react";

type CandidateInput = {
  externalId: string;
  cnjNumber?: string;
  tribunal: string;
  justice: string;
  decisionType: string;
  sourceUrl?: string;
  sourceStatus: "official_confirmed" | "official_without_number" | "attachment_reviewed" | "secondary_pending" | "movement_observed" | "search_thematic";
  metadata?: Record<string, unknown>;
};

export default function ControlCenterPage() {
  const { user, loading } = useAuth();
  const [batchKey, setBatchKey] = useState("");
  const [rawCandidates, setRawCandidates] = useState("[]");
  const [parseError, setParseError] = useState<string | null>(null);
  const [tribunalAlias, setTribunalAlias] = useState<"tjmg" | "trt3" | "trf6" | "tre-mg" | "tjmmg">("tjmg");
  const [processNumber, setProcessNumber] = useState("");
  const preview = trpc.compendium.ingestion.preview.useMutation();
  const dataJudStatus = trpc.datajud.status.useQuery();
  const dataJudLookup = trpc.datajud.lookup.useMutation();

  const runPreview = () => {
    setParseError(null);
    let candidates: CandidateInput[];
    try {
      const parsed = JSON.parse(rawCandidates) as unknown;
      if (!Array.isArray(parsed)) throw new Error("O conteúdo deve ser uma lista JSON de registros.");
      candidates = parsed as CandidateInput[];
    } catch (error) {
      setParseError(error instanceof Error ? error.message : "JSON inválido.");
      return;
    }
    preview.mutate({ batchKey, candidates });
  };

  const isAdmin = user?.role === "admin";

  const runDataJudLookup = () => {
    dataJudLookup.reset();
    dataJudLookup.mutate({ tribunalAlias, processNumber });
  };

  return (
    <div className="control-shell">
      <aside className="control-rail">
        <a className="compendium-brand" href="/"><span className="brand-crest"><Scale size={20} /></span><span><small>Atlas Forense · JEC</small><strong>Central de<br />Controle</strong></span></a>
        <div className="control-rail-copy"><span className="eyebrow">ACESSO RESTRITO</span><p>Pré-validação de lotes antes de qualquer gravação no acervo jurídico.</p></div>
        <div className="control-rail-rule"><FileLock2 size={17} /><p>Este ambiente não recebe PDFs, não persiste documentos e não publica registros automaticamente.</p></div>
      </aside>

      <main className="control-main">
        <header className="control-topbar"><a href="/estrutura" className="back-to-atlas"><ArrowLeft size={16} /> Estrutura interna</a><a href="/compendio" className="control-link">Compêndio jurídico</a></header>
        <section className="control-hero"><div><span className="eyebrow">GOVERNANÇA · PRÉ-VALIDAÇÃO</span><h1>Entrada controlada antes de qualquer <em>publicação</em>.</h1><p>O lote é revisado no formato de metadados mínimos. A rotina identifica duplicidade interna, campos incompatíveis com privacidade e fonte oficial sem URL HTTPS antes de permitir a etapa humana de curadoria.</p></div><div className="control-mark"><FileCheck2 size={23} /><span>SEM GRAVAÇÃO<br />NESTA ETAPA</span></div></section>

        {loading ? <div className="control-state"><KeyRound size={23} /><p>Verificando o perfil de acesso…</p></div> : !user ? <section className="control-state"><KeyRound size={26} /><h2>Autenticação necessária</h2><p>A pré-validação é uma função administrativa. Entre com sua conta para verificar o perfil atribuído.</p><button onClick={() => startLogin()}>Entrar para continuar</button></section> : !isAdmin ? <section className="control-state restricted"><ShieldCheck size={26} /><h2>Perfil sem permissão de ingestão</h2><p>Seu perfil atual pode consultar o acervo, mas não pode validar lotes. A administração do Atlas deve conceder o papel técnico <strong>admin</strong> antes desta etapa.</p></section> : <section className="preflight-panel">
          <div className="preflight-heading"><Upload size={21} /><div><span>PRÉ-VALIDAÇÃO ADMINISTRATIVA</span><h2>Simule o lote antes de importar.</h2></div></div>
          <div className="preflight-warning"><AlertTriangle size={16} /><p>Esta rotina somente analisa metadados enviados nesta sessão. Não cria lote, fonte, tese ou julgado no banco.</p></div>
          <label className="preflight-field"><span>Chave do lote</span><input value={batchKey} onChange={event => setBatchKey(event.target.value)} placeholder="ex.: tjmg-jurisprudencia-2026-09-lote-1" /></label>
          <label className="preflight-field"><span>Registros candidatos em JSON</span><textarea value={rawCandidates} onChange={event => setRawCandidates(event.target.value)} placeholder={'[\n  {\n    "externalId": "…",\n    "tribunal": "…",\n    "justice": "…",\n    "decisionType": "…",\n    "sourceStatus": "…"\n  }\n]'} rows={14} /></label>
          {parseError && <p className="preflight-error"><XCircle size={16} /> {parseError}</p>}
          {preview.error && <p className="preflight-error"><XCircle size={16} /> {preview.error.message}</p>}
          <button className="preflight-button" disabled={preview.isPending || !batchKey.trim()} onClick={runPreview}>{preview.isPending ? "Validando…" : "Executar pré-validação"}</button>
          {preview.data && <div className="preflight-result"><div><span>ACEITOS</span><strong>{preview.data.accepted}</strong></div><div><span>REJEITADOS</span><strong>{preview.data.rejected}</strong></div><div className="preflight-items">{preview.data.items.map(item => <article key={item.externalId}><span>{item.accepted ? <CheckCircle2 size={16} /> : <XCircle size={16} />}</span><code>{item.externalId}</code><p>{item.accepted ? "Elegível para revisão humana posterior." : item.reasons.join(" ")}</p></article>)}</div></div>}
          <section className="datajud-admin-panel"><div className="preflight-heading"><Database size={21} /><div><span>CONSULTA PONTUAL · DATAJUD</span><h2>Consultar metadados públicos com controle.</h2></div></div><p className="datajud-admin-note">{dataJudStatus.data?.label ?? "Verificando disponibilidade do conector…"}. A consulta retorna apenas metadados públicos mínimos e não grava nenhum resultado no acervo.</p><div className="datajud-form"><label className="preflight-field"><span>Tribunal</span><select value={tribunalAlias} onChange={event => setTribunalAlias(event.target.value as typeof tribunalAlias)}><option value="tjmg">TJMG</option><option value="trt3">TRT 3ª Região</option><option value="trf6">TRF 6ª Região</option><option value="tre-mg">TRE-MG</option><option value="tjmmg">TJM-MG</option></select></label><label className="preflight-field"><span>Número CNJ</span><input value={processNumber} onChange={event => setProcessNumber(event.target.value)} placeholder="0000000-00.0000.0.00.0000" /></label><button className="preflight-button" disabled={dataJudLookup.isPending || !processNumber.trim() || !dataJudStatus.data?.configured} onClick={runDataJudLookup}><Search size={15} /> {dataJudLookup.isPending ? "Consultando…" : "Consultar DataJud"}</button></div>{!dataJudStatus.data?.configured && <p className="preflight-warning"><KeyRound size={16} /> A chave não está configurada neste ambiente. Nenhuma credencial é exibida ou armazenada por esta tela.</p>}{dataJudLookup.error && <p className="preflight-error"><XCircle size={16} /> {dataJudLookup.error.message}</p>}{dataJudLookup.data && <div className="datajud-result"><span>{dataJudLookup.data.found ? "METADADO ENCONTRADO" : "SEM RESULTADO"}</span>{dataJudLookup.data.record ? <dl><div><dt>Número</dt><dd>{dataJudLookup.data.record.numeroProcesso ?? "Não informado"}</dd></div><div><dt>Órgão</dt><dd>{dataJudLookup.data.record.orgaoJulgador ?? "Não informado"}</dd></div><div><dt>Classe</dt><dd>{dataJudLookup.data.record.classe ?? "Não informada"}</dd></div><div><dt>Atualização</dt><dd>{dataJudLookup.data.record.updatedAt ?? "Não informada"}</dd></div></dl> : <p>Não houve registro retornado pela fonte selecionada.</p>}<small>{dataJudLookup.data.citation}</small></div>}</section>
        </section>}
      </main>
    </div>
  );
}
