import { create } from "zustand";
import { persist } from "zustand/middleware";

export type View = "landing" | "app";

export type WritingStyle =
  | "formal"      // formal técnico (padrão)
  | "sintetico"   // conciso e direto
  | "academic"    // acadêmico/doutrinário
  | "direto";     // linguagem simples

export interface LawyerProfile {
  name: string;
  oab: string;
  oabUf: string;
  office: string;
  email: string;
  phone: string;
  address: string;
}

export type AppTab =
  | "assistente"
  | "dashboard"
  | "atlas"
  | "biblioteca"
  | "calculadora"
  | "cerebro"
  | "intelligence"
  | "pipeline"
  | "generator"
  | "editor"
  | "homologacao"
  | "visuallaw"
  | "datajud"
  | "grafo"
  | "settings";

// Ids legados usados por componentes (header, paleta, dashboard) que foram
// consolidados em tabs renderizáveis — evita navegar para uma tab sem view.
const APP_TAB_ALIASES: Record<string, AppTab> = {
  documents: "editor",
  clients: "dashboard",
  jurisprudence: "biblioteca",
  "case-analysis": "assistente",
  batch: "generator",
  audit: "settings",
};

export function resolveAppTab(t: string): AppTab {
  if (t in APP_TAB_ALIASES) return APP_TAB_ALIASES[t];
  return (APP_TABS as readonly string[]).includes(t) ? (t as AppTab) : "dashboard";
}

const APP_TABS: AppTab[] = [
  "assistente", "dashboard", "atlas", "biblioteca", "calculadora", "cerebro",
  "intelligence", "pipeline", "generator", "editor", "homologacao",
  "visuallaw", "datajud", "grafo", "settings",
];

interface AppState {
  view: View;
  setView: (v: View) => void;
  appTab: AppTab;
  setAppTab: (t: string) => void;
  currentDocId: string | null;
  setCurrentDocId: (id: string | null) => void;
  currentCaseId: string | null;
  setCurrentCaseId: (id: string | null) => void;
  brainContext: string | null; // contexto da análise cerebral para passar ao gerador
  setBrainContext: (ctx: string | null) => void;
  selectedTemplateSlug: string | null;
  setSelectedTemplateSlug: (slug: string | null) => void;
  selectedSkillSlugs: string[];
  toggleSkill: (slug: string) => void;
  clearSkills: () => void;
  authOpen: boolean;
  setAuthOpen: (b: boolean) => void;
  user: { email: string; name: string | null; plan?: string | null } | null;
  setUser: (u: { email: string; name: string | null; plan?: string | null } | null) => void;
  // Perfil e estilo
  profile: LawyerProfile;
  setProfile: (p: Partial<LawyerProfile>) => void;
  writingStyle: WritingStyle;
  setWritingStyle: (s: WritingStyle) => void;
  defaultSkills: string[];
  toggleDefaultSkill: (slug: string) => void;
}

// Sem dados de OAB/identidade inventados em peças, assinaturas ou procurações.
const DEFAULT_PROFILE: LawyerProfile = {
  name: "",
  oab: "",
  oabUf: "",
  office: "",
  email: "",
  phone: "",
  address: "",
};

/** Corrige somente os campos fictícios de versões antigas; preserva dados reais. */
export function sanitizeLegacyProfile(value: unknown): LawyerProfile {
  const input = value && typeof value === "object" ? value as Partial<LawyerProfile> : {};
  const fake: LawyerProfile = {
    name: "Advogado Demo",
    oab: "123456",
    oabUf: "SP",
    office: "Escritório JuridIA Advocacia",
    email: "demo@juridia.com.br",
    phone: "(11) 99999-0000",
    address: "Av. Paulista, 1000 — São Paulo/SP",
  };
  const clean = { ...DEFAULT_PROFILE };
  for (const key of Object.keys(clean) as (keyof LawyerProfile)[]) {
    const saved = input[key];
    clean[key] = typeof saved === "string" && saved !== fake[key] ? saved : "";
  }
  return clean;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      view: "app",
      setView: (view) => set({ view }),
      appTab: "dashboard",
      setAppTab: (appTab) => set({ appTab: resolveAppTab(appTab) }),
      currentDocId: null,
      setCurrentDocId: (currentDocId) => set({ currentDocId }),
      currentCaseId: null,
      setCurrentCaseId: (currentCaseId) => set({ currentCaseId }),
      brainContext: null,
      setBrainContext: (brainContext) => set({ brainContext }),
      selectedTemplateSlug: null,
      setSelectedTemplateSlug: (selectedTemplateSlug) => set({ selectedTemplateSlug }),
      selectedSkillSlugs: [],
      toggleSkill: (slug) => {
        const cur = get().selectedSkillSlugs;
        if (cur.includes(slug)) {
          set({ selectedSkillSlugs: cur.filter((s) => s !== slug) });
        } else {
          set({ selectedSkillSlugs: [...cur, slug] });
        }
      },
      clearSkills: () => set({ selectedSkillSlugs: [] }),
      authOpen: false,
      setAuthOpen: (authOpen) => set({ authOpen }),
      user: null,
      setUser: (user) => set({ user }),
      // Perfil e estilo
      profile: DEFAULT_PROFILE,
      setProfile: (p) => set({ profile: { ...get().profile, ...p } }),
      writingStyle: "formal",
      setWritingStyle: (writingStyle) => set({ writingStyle }),
      defaultSkills: ["cpc-estrutura-peticao", "cnj-615-2025"],
      toggleDefaultSkill: (slug) => {
        const cur = get().defaultSkills;
        if (cur.includes(slug)) {
          set({ defaultSkills: cur.filter((s) => s !== slug) });
        } else {
          set({ defaultSkills: [...cur, slug] });
        }
      },
    }),
    {
      name: "juridia-store",
      version: 1,
      migrate: (persisted) => {
        const prior = persisted && typeof persisted === "object"
          ? persisted as Partial<AppState>
          : {};
        const style = prior.writingStyle;
        const writingStyle: WritingStyle = style === "formal" || style === "sintetico" ||
          style === "academic" || style === "direto" ? style : "formal";
        return {
          view: prior.view === "landing" ? "landing" as const : "app" as const,
          appTab: resolveAppTab(prior.appTab ?? "dashboard"),
          selectedSkillSlugs: Array.isArray(prior.selectedSkillSlugs)
            ? prior.selectedSkillSlugs.filter((x): x is string => typeof x === "string") : [],
          profile: sanitizeLegacyProfile(prior.profile),
          writingStyle,
          defaultSkills: Array.isArray(prior.defaultSkills)
            ? prior.defaultSkills.filter((x): x is string => typeof x === "string") : [],
        };
      },
      partialize: (s) => ({
        view: s.view,
        appTab: s.appTab,
        selectedSkillSlugs: s.selectedSkillSlugs,
        profile: s.profile,
        writingStyle: s.writingStyle,
        defaultSkills: s.defaultSkills,
      }),
    }
  )
);
