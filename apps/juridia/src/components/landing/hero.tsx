"use client";

import { ArrowRight, BookOpenCheck, FileCheck2, Scale, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";

const WORKFLOW = [
  { number: "01", title: "Pesquisar", detail: "Localize referências e confira a fonte.", icon: Search },
  { number: "02", title: "Organizar", detail: "Estruture fatos, pedidos e evidências.", icon: FileCheck2 },
  { number: "03", title: "Revisar", detail: "Valide o documento antes de utilizar.", icon: ShieldCheck },
] as const;

export function Hero() {
  const { setView, setAppTab } = useAppStore();
  const navigate = (tab: "dashboard" | "generator" | "atlas") => {
    setView("app");
    setAppTab(tab);
  };

  return (
    <section className="relative overflow-hidden border-b border-border bg-[linear-gradient(150deg,#f9faf7_0%,#eff5ef_65%,#f9f7f0_100%)]" aria-labelledby="landing-title">
      <div className="container-juridia relative py-16 md:py-24 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/75 px-3 py-2 text-xs font-semibold tracking-wide text-primary">
              <Scale className="h-4 w-4" aria-hidden="true" />
              Atlas Forense + JuridIA
            </div>
            <h1 id="landing-title" className="mt-8 max-w-2xl text-balance text-4xl font-semibold leading-[1.13] tracking-[-0.045em] text-foreground sm:text-5xl lg:text-[3.5rem]">
              Inteligência jurídica com <span className="text-primary">método, fontes e revisão.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
              Um ambiente para pesquisar fundamentos, examinar os autos e preparar minutas.
              A inteligência artificial auxilia o trabalho; a decisão e a revisão permanecem com o profissional.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={() => navigate("dashboard")} className="min-h-12 gap-2 px-6">
                Acessar plataforma <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("atlas")} className="min-h-12 gap-2 border-primary/25 bg-white/80 px-6 text-primary hover:bg-primary/5">
                <BookOpenCheck className="h-4 w-4" aria-hidden="true" /> Consultar Atlas
              </Button>
            </div>
            <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              Ferramenta de apoio ao trabalho jurídico. Fontes e documentos gerados exigem conferência profissional.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-lg" aria-label="Etapas do fluxo de trabalho jurídico">
            <div className="absolute -inset-5 -z-10 rounded-[2rem] bg-primary/5" aria-hidden="true" />
            <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_22px_75px_rgba(17,48,35,.1)]">
              <div className="flex items-center justify-between border-b border-border bg-[#123b2c] px-6 py-5 text-white">
                <div>
                  <span className="block text-[10px] font-semibold uppercase tracking-[.18em] text-[#d1c5a6]">FLUXO DE TRABALHO</span>
                  <h2 className="mt-2 text-lg font-semibold">Do fato à fundamentação</h2>
                </div>
                <Scale className="h-7 w-7 text-[#d6c395]" aria-hidden="true" />
              </div>
              <div className="space-y-0 px-6 py-3">
                {WORKFLOW.map((item) => (
                  <div key={item.number} className="flex items-start gap-4 border-b border-border py-5 last:border-b-0">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf2eb] text-primary"><item.icon className="h-5 w-5" aria-hidden="true" /></div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-semibold tracking-[.15em] text-[#917b56]">ETAPA {item.number}</span>
                      <h3 className="mt-1 text-sm font-bold text-foreground">{item.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.detail}</p>
                    </div>
                    <ArrowRight className="mt-5 h-4 w-4 text-primary/60" aria-hidden="true" />
                  </div>
                ))}
              </div>
              <div className="bg-[#f4f7f2] px-6 py-4 text-xs text-[#4e6657]">
                Evidência e rastreabilidade antes de qualquer conclusão.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
