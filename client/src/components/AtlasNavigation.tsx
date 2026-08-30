import { BarChart3, BookOpenCheck, Database, Home, Landmark, LogIn, LogOut, Scale, Settings2, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { activeModuleRoute, ATLAS_GROUP_LABELS, ATLAS_MODULES, type AtlasModuleGroup } from "@shared/atlas-modules";

const icons: Record<string, LucideIcon> = {
  home: Home,
  compendium: BookOpenCheck,
  theses: Sparkles,
  jurimetryJec: BarChart3,
  national: Landmark,
  metropolitan: Database,
  sources: Database,
  governance: ShieldCheck,
  control: Settings2,
  evidenceControl: Database,
  thesisCuration: Scale,
};

const groups: AtlasModuleGroup[] = ["intelligence", "jurimetry", "governance"];

export default function AtlasNavigation() {
  const { user, login, logout } = useAuth();
  const [location] = useLocation();
  const visible = ATLAS_MODULES.filter((m) => m.access !== "admin" || user?.role === "admin");
  const activeRoute = activeModuleRoute(location, visible);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand">
          <span className="brand-mark">
            <Scale size={17} />
          </span>
          <span>
            <strong>Atlas Forense</strong>
            <small>Inteligência jurídica auditável</small>
          </span>
        </Link>
        <div className="header-actions">
          <span className="source-authority">
            <b>Fonte autoritativa</b>
            <small>Compêndio · Teses · Jurimetria</small>
          </span>
          {user ? (
            <button className="ghost-button" onClick={() => void logout()}>
              <LogOut size={14} /> Sair
            </button>
          ) : (
            <button className="ghost-button" onClick={login}>
              <LogIn size={14} /> Entrar
            </button>
          )}
        </div>
      </div>
      <nav className="module-nav" aria-label="Módulos do Atlas">
        {groups.flatMap((group) =>
          visible
            .filter((m) => m.group === group)
            .map((m) => {
              const Icon = icons[m.key] ?? Scale;
              const isActive = m.route === activeRoute;
              return (
                <Link
                  key={m.key}
                  href={m.route}
                  className={isActive ? "active" : ""}
                  aria-current={isActive ? "page" : undefined}
                  title={`${ATLAS_GROUP_LABELS[group]} · ${m.description}`}
                >
                  <Icon size={14} />
                  {m.shortLabel}
                </Link>
              );
            }),
        )}
      </nav>
    </header>
  );
}
