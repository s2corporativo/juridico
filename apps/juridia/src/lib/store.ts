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

export type AppTab = "assistente" | "pesquisa" | "analise" | "minutas" | "biblioteca";
export type ModuleView =
  | "assistente" | "pesquisa" | "cerebro" | "intelligence" | "pipeline"
  | "generator" | "editor" | "visuallaw" | "biblioteca";

const APP_TABS: readonly AppTab[] = ["assistente", "pesquisa", "analise", "minutas", "biblioteca"];
const MODULE_VIEWS: Record<AppTab, ModuleView> = {
  assistente: "assistente", pesquisa: "pesquisa",
  analise: "cerebro", minutas: "generator", biblioteca: "biblioteca",
};
/** Redirect legacy actions into the five research/drafting areas. */
const APP_TAB_ALIASES: Record<string, [AppTab, ModuleView]> = {
  dashboard: ["assistente","assistente"],
  clients: ["assistente","assistente"],
  casos: ["analise","cerebro"],
  cases: ["analise","cerebro"],
  documents: ["biblioteca","biblioteca"],
  jurisprudence: ["pesquisa","pesquisa"],
  datajud: ["pesquisa","pesquisa"],
  "case-analysis": ["analise","cerebro"],
  cerebro: ["analise","cerebro"],
  intelligence: ["analise","intelligence"],
  pipeline: ["analise","pipeline"],
  grafo: ["analise","intelligence"],
  generator: ["minutas","generator"],
  batch: ["minutas","generator"],
  editor: ["minutas","editor"],
  visuallaw: ["minutas","visuallaw"],
  calculadora: ["analise","cerebro"],
  financeiro: ["assistente","assistente"],
  produtividade: ["assistente","assistente"],
  prazos: ["assistente","assistente"],
  audiencias: ["assistente","assistente"],
  homologacao: ["analise","cerebro"],
  settings: ["assistente","assistente"],
  audit: ["assistente","assistente"],
};
export function resolveAppTab(value: string): AppTab {
  return resolveAppDestination(value)[0];
}
export function resolveAppDestination(value: string): [AppTab, ModuleView] {
  if ((APP_TABS as readonly string[]).includes(value))
    return [value as AppTab, MODULE_VIEWS[value as AppTab]];
  return APP_TAB_ALIASES[value] ?? ["assistente", "assistente"];
}

interface AppState {
  view: View;
  setView: (v: View) => void;
  appTab: AppTab;
  moduleView: ModuleView;
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
  oabUf: "",
  office: "",
  email: "",
  phone: "",
  address: "",
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      view: "app",
      setView: (view) => set({ view }),
      appTab: "assistente",
      moduleView: "assistente",
      setAppTab: (value) => set(() => {
        const [appTab, moduleView] = resolveAppDestination(value);
        return { appTab, moduleView };
      }),
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
      version: 2,
      migrate: (persisted: unknown) => {
        const old = (persisted ?? {}) as Partial<AppState>;
        // Clear only legacy fixture identity; retain legitimate user preferences.
        const user = old.user?.email === "demo@juridia.com.br" ? null : old.user;
        const profile = old.profile?.email === "demo@juridia.com.br"
          ? DEFAULT_PROFILE : old.profile;
        const [appTab, moduleView] = resolveAppDestination(String(old.appTab ?? "assistente"));
        return {
          ...old, appTab, moduleView,
          user: user ?? null, profile: profile ?? DEFAULT_PROFILE,
        } as AppState;
      },
      partialize: (s) => ({
        view: s.view,
        appTab: s.appTab,
        moduleView: s.moduleView,
        user: s.user,
        selectedSkillSlugs: s.selectedSkillSlugs,
        profile: s.profile,
        writingStyle: s.writingStyle,
        defaultSkills: s.defaultSkills,
      }),
    }
  )
);
