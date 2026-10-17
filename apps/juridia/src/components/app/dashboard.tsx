"use client";

import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, FileText, FolderOpen, Search, ShieldCheck, Sparkles, Wand2, type LucideIcon } from "lucide-react";
import { useAppStore, type AppTab } from "@/lib/store";
import type { DocumentDTO } from "@/lib/types";
import { Button } from "@/components/ui/button";

const ACTIONS: { title: string; description: string; tab: AppTab; icon: LucideIcon; number: string }[] = [
  { number: "01", title: "Elaborar documento", description: "Inicie uma minuta com estrutura, fontes e revisão profissional.", tab: "generator", icon: Wand2 },
  { number: "02", title: "Pesquisar fundamentos", description: "Consulte o Atlas e confira a origem de cada referência.", tab: "atlas", icon: Search },
  { number: "03", title: "Analisar um caso", description: "Organize fatos, documentos e pontos que exigem atenção.", tab: "cerebro", icon: Sparkles },
  { number: "04", title: "Consultar a biblioteca", description: "Acesse modelos e habilidades com estado de revisão visível.", tab: "biblioteca", icon: BookOpen },
];

function Metric({ label, value, note, icon: Icon }: { label: string; value: string; note: string; icon: LucideIcon }) {
  return (
    <article className="juridia-metric">
      <div className="juridia-metric-label"><span>{label}</span><Icon size={17} aria-hidden="true" /></div>
      <strong className="juridia-metric-value">{value}</strong>
      <p>{note}</p>
    </article>
  );
}

export function Dashboard() {
  const { setAppTab, setCurrentDocId } = useAppStore();
  const [docs, setDocs] = useState<DocumentDTO[]>([]);
  const [skillsCount, setSkillsCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [documentsError, setDocumentsError] = useState(false);
  const [skillsError, setSkillsError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    Promise.allSettled([
      fetch("/api/documents", { signal: controller.signal, cache: "no-store" }).then(async (response) => {
        if (!response.ok) throw new Error("documentos_indisponiveis");
        const data = await response.json() as { documents?: DocumentDTO[] };
        if (!controller.signal.aborted) setDocs(Array.isArray(data.documents) ? data.documents : []);
      }),
      fetch("/api/skills", { signal: controller.signal, cache: "no-store" }).then(async (response) => {
        if (!response.ok) throw new Error("catalogo_indisponivel");
        const data = await response.json() as { skills?: unknown[] };
        if (!controller.signal.aborted) setSkillsCount(Array.isArray(data.skills) ? data.skills.length : null);
      }),
    ]).then((results) => {
      if (controller.signal.aborted) return;
      setDocumentsError(results[0].status === "rejected");
      setSkillsError(results[1].status === "rejected");
      setLoading(false);
    });
    return () => controller.abort();
  }, []);

  return (
    <div className="container-juridia juridia-dashboard">
      <header className="juridia-workspace-hero">
        <div className="juridia-hero-copy">
          <span className="juridia-eyebrow"><span className="juridia-eyebrow-dot" /> ESPAÇO DE TRABALHO JURÍDICO</span>
          <h1>Clareza para pesquisar.<br /><span>Precisão para produzir.</span></h1>
          <p>Pesquisa, análise e elaboração de documentos em um mesmo fluxo. Cada etapa preserva a verificação de fontes e a revisão do advogado.</p>
          <div className="juridia-hero-buttons">
            <Button onClick={() => setAppTab("generator")} className="min-h-11 gap-2 px-5">
              <Wand2 size={17} aria-hidden="true" /> Criar documento <ArrowRight size={17} aria-hidden="true" />
            </Button>
            <Button onClick={() => setAppTab("atlas")} variant="outline" className="min-h-11 gap-2 border-white/35 bg-white/10 px-5 text-white hover:bg-white/20 hover:text-white">
              <Search size={17} aria-hidden="true" /> Pesquisar no Atlas
            </Button>
          </div>
          <span className="juridia-hero-assurance"><ShieldCheck size={15} aria-hidden="true" /> Conteúdo gerado exige conferência jurídica antes do uso.</span>
        </div>
        <div className="juridia-hero-illustration" aria-hidden="true">
          <div className="juridia-illustration-header"><span /><span /><span /></div>
          <div className="juridia-illustration-row"><Search size={18} /> Pesquisa fundamentada <span className="juridia-illustration-check">01</span></div>
          <div className="juridia-illustration-divider" />
          <div className="juridia-illustration-row"><FileText size={18} /> Organização de evidências <span className="juridia-illustration-check">02</span></div>
          <div className="juridia-illustration-divider" />
          <div className="juridia-illustration-row"><ShieldCheck size={18} /> Revisão pelo profissional <span className="juridia-illustration-check">03</span></div>
        </div>
      </header>

      <section aria-labelledby="juridia-actions-title" className="juridia-dashboard-section">
        <div className="juridia-section-heading">
          <div>
            <span className="juridia-section-kicker">ACESSO RÁPIDO</span>
            <h2 id="juridia-actions-title">Por onde deseja começar?</h2>
          </div>
          <p>Quatro ações principais, sem percursos desnecessários.</p>
        </div>
        <div className="juridia-action-grid">
          {ACTIONS.map((action) => (
            <button key={action.tab} type="button" onClick={() => setAppTab(action.tab)} className="juridia-action-card">
              <span className="juridia-action-icon"><action.icon size={22} strokeWidth={1.8} aria-hidden="true" /></span>
              <span className="juridia-action-number">{action.number}</span>
              <span className="juridia-action-title">{action.title}</span>
              <span className="juridia-action-description">{action.description}</span>
              <span className="juridia-action-footer">Abrir ferramenta <ArrowRight size={16} aria-hidden="true" /></span>
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="juridia-activity-title" className="juridia-dashboard-section">
        <div className="juridia-section-heading">
          <div>
            <span className="juridia-section-kicker">VISÃO OPERACIONAL</span>
            <h2 id="juridia-activity-title">Seu trabalho, organizado.</h2>
          </div>
          <p>Indicadores desta conta, sem estimar valores indisponíveis.</p>
        </div>
        <div className="juridia-metric-grid">
          <Metric label="Documentos nesta listagem" value={documentsError ? "Indisponível" : loading ? "—" : String(docs.length)} note="Documentos retornados pela consulta atual." icon={FolderOpen} />
          <Metric label="Habilidades no catálogo" value={skillsError ? "Indisponível" : loading ? "—" : String(skillsCount ?? "—")} note="Quantidade técnica; aprovação jurídica é individual." icon={BookOpen} />
        </div>
      </section>

      <section className="juridia-dashboard-section juridia-recent" aria-labelledby="juridia-recent-title">
        <div className="juridia-section-heading">
          <div>
            <span className="juridia-section-kicker">CONTINUIDADE</span>
            <h2 id="juridia-recent-title">Documentos recentes</h2>
          </div>
          <Button size="sm" variant="outline" onClick={() => setAppTab("editor")}>Abrir documentos <ArrowRight size={15} aria-hidden="true" /></Button>
        </div>
        <div className="juridia-recent-list" aria-live="polite">
          {loading ? <p className="juridia-empty">Carregando documentos…</p> :
            documentsError ? <p className="juridia-empty" role="status">Documentos indisponíveis no momento. O acesso aos demais recursos permanece disponível.</p> :
            docs.length === 0 ? <p className="juridia-empty">Nenhum documento encontrado nesta listagem. Você pode começar uma nova minuta.</p> :
            docs.slice(0, 5).map((document) => (
              <button key={document.id} type="button" onClick={() => { setCurrentDocId(document.id); setAppTab("editor"); }} className="juridia-recent-item">
                <span className="juridia-recent-icon"><FileText size={18} aria-hidden="true" /></span>
                <span className="juridia-recent-name">{document.title}</span>
                <time className="juridia-recent-date" dateTime={document.createdAt}>{new Date(document.createdAt).toLocaleDateString("pt-BR")}</time>
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            ))
          }
        </div>
      </section>
    </div>
  );
}
