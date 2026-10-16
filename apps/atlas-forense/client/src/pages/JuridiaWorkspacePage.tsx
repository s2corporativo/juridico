import { AlertTriangle, ArrowLeft, ExternalLink, FileSignature, Landmark, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { trpc } from "@/lib/trpc";

function statusLabel(status?: string) {
  if (status === "enabled") return "Ponte de identidade ativa";
  if (status === "configured_not_activated") return "Ponte aguardando ativação";
  if (status === "insecure_issuer") return "Issuer inseguro";
  return "Configuração pendente";
}

export default function JuridiaWorkspacePage() {
  const integration = trpc.integration.ejcStatus.useQuery(undefined, { staleTime: 60_000, retry: false });
  const data = integration.data;
  const juridiaUrl = data?.sso?.juridia?.url ?? null;
  const canOpen = Boolean(juridiaUrl);

  return (
    <div className="atlas-shell juridia-shell">
      <aside className="atlas-sidebar juridia-sidebar">
        <div className="brand-block">
          <div className="brand-mark juridia-mark"><FileSignature size={22} /></div>
          <div><span>Atlas Forense</span><strong>JuridIA</strong><small>produção assistida · EJC</small></div>
        </div>
        <div className="sidebar-context">
          <span className="eyebrow">WORKSPACE EJC</span>
          <p>A entrada única para a produção de minutas, autos e inteligência jurídica.</p>
          <div className="source-stamp"><LockKeyhole size={15} /> Dados isolados</div>
        </div>
        <SiteNav />
        <div className="sidebar-footnote"><ShieldCheck size={16} /><p>O Atlas transporta identidade pela ponte OIDC. Casos, documentos e bancos permanecem no ambiente próprio da JuridIA.</p></div>
      </aside>

      <main className="atlas-main juridia-main">
        <header className="topbar">
          <div className="breadcrumb"><Landmark size={16} /> Atlas Forense <span>/</span> JuridIA</div>
          <div className="topbar-actions"><a className="structure-link" href="/"><ArrowLeft size={15} /> Dashboard Atlas</a></div>
        </header>

        <section className="juridia-hero">
          <div>
            <span className="eyebrow">PRODUÇÃO JURÍDICA · WORKSPACE UNIFICADO</span>
            <h1>Do dado forense à <em>minuta supervisionada.</em></h1>
            <p>Abra a JuridIA pelo mesmo painel do Atlas, com uma fronteira clara entre inteligência pública, autos do caso e redação profissional.</p>
            <div className="juridia-tags"><span><Sparkles size={14} /> Agentes jurídicos</span><span><LockKeyhole size={14} /> SSO EJC</span><span><ShieldCheck size={14} /> Revisão humana</span></div>
          </div>
          <div className="juridia-hero-mark"><FileSignature size={42} /><span>MINUTA<br />AUDITÁVEL</span></div>
        </section>

        {integration.isLoading && <section className="juridia-state"><ShieldCheck size={23} /><p>Verificando a ponte Atlas · JuridIA…</p></section>}
        {integration.isError && <section className="juridia-state error"><AlertTriangle size={24} /><h2>Integração indisponível</h2><p>O estado da ponte não pôde ser consultado. Nenhuma credencial foi exposta e nenhuma sessão foi criada.</p></section>}
        {!integration.isLoading && !integration.isError && <section className="juridia-workspace-grid">
          <article className="juridia-launch-card">
            <span className="eyebrow">ACESSO PRINCIPAL</span>
            <h2>JuridIA · produção de peças</h2>
            <p>Continue no ambiente de trabalho da JuridIA para carregar autos, analisar o caso, gerar a minuta e exportar o documento com rastreabilidade.</p>
            <div className="juridia-status"><i className={canOpen ? "is-ready" : ""} /> {statusLabel(data?.sso?.status)}</div>
            {canOpen ? <a className="juridia-launch-button" href={juridiaUrl!}><FileSignature size={17} /> Abrir workspace JuridIA <ExternalLink size={15} /></a> : <div className="juridia-disabled"><AlertTriangle size={16} /> Configure uma `JURIDIA_PUBLIC_URL` HTTPS válida para liberar o acesso.</div>}
          </article>
          <aside className="juridia-contract-card">
            <span className="eyebrow">CONTRATO DA PONTE</span>
            <h2>Uma porta, duas camadas.</h2>
            <dl><div><dt>Atlas</dt><dd>jurimetria, fontes e casos causais</dd></div><div><dt>JuridIA</dt><dd>autos, agentes, editor e exportação</dd></div><div><dt>Identidade</dt><dd>OIDC + PKCE, sem transportar documentos</dd></div></dl>
            <p>O link usa a URL pública da aplicação, nunca o issuer OIDC. O issuer permanece reservado ao protocolo de autenticação.</p>
          </aside>
        </section>}
      </main>
    </div>
  );
}
