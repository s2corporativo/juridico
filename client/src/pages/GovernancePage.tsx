import { COMPENDIUM_MODULES, EVIDENCE_FLOW, GOVERNANCE_GUARDRAILS, GOVERNANCE_LANES } from "@shared/compendium-governance";
import { ejcIntegrationManifest } from "@shared/ejc-integration";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, ArrowUpRight, BookOpenCheck, Database, FileLock2, Landmark, Network, Scale, ShieldCheck, UserRoundCheck, Workflow } from "lucide-react";

const icons = [Landmark, BookOpenCheck, Scale, FileLock2] as const;
const laneIcons = [UserRoundCheck, ShieldCheck, Workflow] as const;

export default function GovernancePage() {
  const ejcStatus = trpc.integration.ejcStatus.useQuery();
  return (
    <div className="governance-shell">
      <aside className="governance-rail">
        <a className="compendium-brand" href="/">
          <span className="brand-crest"><Scale size={20} /></span>
          <span><small>Atlas Forense · JEC</small><strong>Estrutura<br />Interna</strong></span>
        </a>
        <div className="governance-rail-copy"><span className="eyebrow">MAPA OPERACIONAL</span><p>Organização antes da integração: módulos, evidências, papéis e controles.</p></div>
        <nav className="governance-nav" aria-label="Navegação da estrutura interna">
          <a href="#modulos"><span>01</span>Módulos</a>
          <a href="#fluxo"><span>02</span>Fluxo de evidência</a>
          <a href="#papeis"><span>03</span>Papéis e acesso</a>
          <a href="#guardrails"><span>04</span>Controles</a>
        </nav>
        <div className="governance-rail-foot"><ShieldCheck size={16} /><p>A integração ao EJC será feita depois desta fundação operacional.</p></div>
      </aside>

      <main className="governance-main">
        <header className="governance-topbar"><a href="/" className="back-to-atlas"><ArrowLeft size={16} /> Atlas JEC</a><div className="governance-header-actions"><a href="/nacional">Prontidão nacional</a><a href="/fontes">Fontes públicas</a><a href="/controle">Central de controle</a><a href="/compendio" className="governance-compendium-link">Abrir Compêndio <ArrowUpRight size={15} /></a></div></header>

        <section className="governance-hero">
          <div><span className="eyebrow">ATLAS FORENSE · ORGANIZAÇÃO INTERNA</span><h1>Uma base jurídica só escala quando cada camada sabe <em>o que prova</em> e quem a governa.</h1><p>O Atlas Forense passa a operar por módulos independentes e conectados: censo, pesquisa, teses, taxonomia e auditoria. O vínculo com o EJC será uma integração posterior, sobre esta estrutura já controlada.</p></div>
          <div className="governance-mark"><Network size={24} /><span>ARQUITETURA<br />PRIMEIRO</span><b>01</b></div>
        </section>

        <section className="ejc-bridge-status"><div><span className="eyebrow">PONTE EJC · NÃO ATIVA</span><h2>Rotas e identidade estão prontas para a decisão de vínculo.</h2><p>{ejcStatus.data?.activationRule ?? "Verificando o contrato de integração…"}</p></div><div>{ejcIntegrationManifest.modules.map(module => <p key={module.key}><b>{module.label}</b><code>{module.route}</code><small>{module.access}</small></p>)}</div></section>

        <section className="governance-modules" id="modulos">
          <div className="governance-section-heading"><Database size={20} /><div><span>MAPA DE MÓDULOS</span><h2>Camadas que não se confundem.</h2></div></div>
          <div className="module-grid">
            {COMPENDIUM_MODULES.map((module, index) => {
              const Icon = icons[index];
              return <a href={module.route} key={module.id} className="module-card"><div><span>{module.ordinal}</span><Icon size={18} /></div><h3>{module.title}</h3><p>{module.description}</p><small><b>Natureza:</b> {module.evidence}</small><i>{module.state}</i></a>;
            })}
          </div>
        </section>

        <section className="evidence-flow" id="fluxo">
          <div className="flow-intro"><span className="eyebrow">FLUXO OPERACIONAL</span><h2>Da descoberta à publicação, sem saltar a evidência.</h2><p>O fluxo deve ser cumprido para cada lote novo. A plataforma registra o caminho; a revisão humana decide a qualidade jurídica.</p></div>
          <ol>{EVIDENCE_FLOW.map((stage, index) => <li key={stage}><span>{String(index + 1).padStart(2, "0")}</span><strong>{stage}</strong></li>)}</ol>
        </section>

        <section className="governance-lanes" id="papeis">
          <div className="governance-section-heading"><UserRoundCheck size={20} /><div><span>PAPÉIS E ACESSO</span><h2>Permissão acompanha responsabilidade.</h2></div></div>
          <div className="lanes-grid">
            {GOVERNANCE_LANES.map((lane, index) => {
              const Icon = laneIcons[index];
              return <article key={lane.id} className={`lane-card lane-${lane.status.replaceAll(" ", "-")}`}><Icon size={22} /><span>{lane.status}</span><h3>{lane.title}</h3><b>{lane.access}</b><p>{lane.rule}</p></article>;
            })}
          </div>
        </section>

        <section className="guardrails-section" id="guardrails">
          <div><span className="eyebrow">CONTROLES NÃO NEGOCIÁVEIS</span><h2>O rigor metodológico não é acabamento. É parte do produto.</h2></div>
          <div>{GOVERNANCE_GUARDRAILS.map((guardrail, index) => <p key={guardrail}><span>{String(index + 1).padStart(2, "0")}</span>{guardrail}</p>)}</div>
        </section>
      </main>
    </div>
  );
}
