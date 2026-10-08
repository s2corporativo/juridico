import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  | "dashboard"
  | "biblioteca"
  | "calculadora"
  | "cerebro"
  | "generator"
  | "editor"
  | "visuallaw"
  | "datajud"
  | "settings";

// Aliases de navegação mantêm links antigos compatíveis com a interface consolidada.
const APP_TAB_ALIASES: Record<string, AppTab> = {
  documents: "editor",
  clients: "dashboard",
  jurisprudence: "biblioteca",
  "case-analysis": "cerebro",
  batch: "generator",
  audit: "settings",
  assistente: "dashboard",
  intelligence: "cerebro",
  pipeline: "generator",
  homologacao: "editor",
  grafo: "cerebro",
};

export function resolveAppTab(t: string): AppTab {
  if (t in APP_TAB_ALIASES) return APP_TAB_ALIASES[t];
  return (APP_TABS as readonly string[]).includes(t) ? (t as AppTab) : "dashboard";
}

const APP_TABS: AppTab[] = [
  "dashboard", "biblioteca", "calculadora", "cerebro",
  "generator", "editor", "visuallaw", "datajud", "settings",
];

interface AppState {
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

const DEFAULT_PROFILE: LawyerProfile = {
  name: "",
  oab: "",
  oabUf: "MG",
  office: "Atlas Jurídico",
  email: "",
  phone: "",
  address: "",
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
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
      name: "atlas-juridico-store",
      partialize: (s) => ({
        appTab: s.appTab,
        user: s.user,
        selectedSkillSlugs: s.selectedSkillSlugs,
        profile: s.profile,
        writingStyle: s.writingStyle,
        defaultSkills: s.defaultSkills,
      }),
    }
  )
);
