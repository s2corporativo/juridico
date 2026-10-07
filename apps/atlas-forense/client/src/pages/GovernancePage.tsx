import { COMPENDIUM_MODULES, EVIDENCE_FLOW, GOVERNANCE_GUARDRAILS, GOVERNANCE_LANES } from "@shared/compendium-governance";
import { atlasIntegrationManifest } from "@shared/integration";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, ArrowUpRight, BookOpenCheck, Database, FileLock2, Landmark, Network, Scale, ShieldCheck, UserRoundCheck, Workflow } from "lucide-react";

const icons = [Landmark, BookOpenCheck, Scale, FileLock2] as const;
const laneIcons = [UserRoundCheck, ShieldCheck, Workflow] as const;

export default function GovernancePage() {
  const integration = trpc.integration.ssoStatus.useQuery();
  const ssoEnabled = integration.data?.sso?.status === "enabled";

  return (
    <div className="governance-shell">
      <aside className="governance-rail">
        <a className="compendium-brand" href="/">
          <span className="brand-crest"><Scale size={20} /></span>
          <span><small>Atlas Jurídico</small><strong>Governança<br />do Sistema</strong></span>
        </a>
        <div className="governance-rail-copy">
          <span className="eyebrow">ARQUITETURA OPERACIONAL</span>
          <p>Módulos, evidências, identidade, papéis e controles do ambiente interno.</p>
        </div>
        <nav className="governance-nav" aria-label="Navegação da governança">
          <a href="#integracao"><span>01</span>Integração</a>
          <a href="#modulos"><span>02</span>Módulos</a>
          <a href="#fluxo"><span>03</span>Fluxo de evidência</a>
          <a href="#papeis"><span>04</span>Papéis e acesso</a>
          <a href="#guardrails"><span>05</span>Controles</a>
        </nav>
        <div className="governance-rail-foot"><ShieldCheck size={16} /><p>Autenticação e produção usam contratos explícitos e política fail-closed.</p></div>
      </aside>

      <main className="governance-main">
        <header className="governance-topbar">
          <a href="/" className="back-to-atlas"><ArrowLeft size={16} /> Atlas Jurídico</a>
          <div className="governance-header-actions">
            <a href="/nacional">Dados nacionais</a>
            <a href="/fontes">Fontes públicas</a>
            <a href="/controle">Controle editorial</a>
            <a href="/compendio" className="governance-compendium-link">Compêndio <ArrowUpRight size={15} /></a>
          </div>
        </header>

        <section className="governance-hero">
          <div>
            <span className="eyebrow">ATLAS JURÍDICO · GOVERNANÇA</span>
            <h1>Uma arquitetura única para dados, conhecimento e produção jurídica.</h1>
            <p>O sistema separa aquisição de dados, conhecimento jurídico e produção assistida sem duplicar identidade, evidência ou regras de segurança.</p>
          </div>
          <div className="governance-mark"><Network size={24} /><span>ARQUITETURA<br />CONTROLADA</span><b>01</b></div>
        </section>

        <section className="integration-status" id="integracao">
          <div>
            <span className="eyebrow">IDENTIDADE E INTEGRAÇÃO</span>
            <h2>{ssoEnabled ? "SSO JuridIA operacional" : "SSO JuridIA indisponível"}</h2>
            <p>Authorization Code + PKCE, ID Token RS256, JWKS e sessão local do Atlas.</p>
          </div>
          <div>{atlasIntegrationManifest.modules.map(module => <p key={module.key}><b>{module.label}</b><code>{module.route}</code><small>{module.access}</small></p>)}</div>
        </section>

        <section className="governance-modules" id="modulos">
          <div className="governance-section-heading"><Database size={20} /><div><span>MAPA DE MÓDULOS</span><h2>Responsabilidades bem delimitadas.</h2></div></div>
          <div className="module-grid">
            {COMPENDIUM_MODULES.map((module, index) => {
              const Icon = icons[index];
              return <a href={module.route} key={module.id} className="module-card"><div><span>{module.ordinal}</span><Icon size={18} /></div><h3>{module.title}</h3><p>{module.description}</p><small><b>Natureza:</b> {module.evidence}</small><i>{module.state}</i></a>;
            })}
          </div>
        </section>

        <section className="evidence-flow" id="fluxo">
          <div className="flow-intro"><span className="eyebrow">FLUXO DE EVIDÊNCIA</span><h2>Da fonte à peça sem quebrar a proveniência.</h2><p>A revisão humana encerra o ciclo e nenhuma inferência da IA substitui evidência confirmada.</p></div>
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
          <div><span className="eyebrow">CONTROLES</span><h2>Segurança, proveniência e revisão são parte do produto.</h2></div>
          <div>{GOVERNANCE_GUARDRAILS.map((guardrail, index) => <p key={guardrail}><span>{String(index + 1).padStart(2, "0")}</span>{guardrail}</p>)}</div>
        </section>
      </main>
    </div>
  );
}
