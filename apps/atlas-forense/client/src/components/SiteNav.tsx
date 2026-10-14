// SiteNav.tsx — Navegação global do Atlas Forense.
// Antes: várias seções (/estrutura, /nacional, /controle, /escritorio/*) só eram
// acessíveis digitando URL. Este componente unifica a navegação em todos os shells.
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  BookOpenCheck,
  MapPinned,
  Globe2,
  Users,
  Inbox,
  Gavel,
  GraduationCap,
  Boxes,
  Database,
  ClipboardCheck,
  Landmark,
  FileSignature,
  GitBranch,
  type LucideIcon,
} from "lucide-react";

export interface SiteNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface SiteNavGroup {
  title: string;
  items: SiteNavItem[];
}

export const SITE_NAV_GROUPS: SiteNavGroup[] = [
  {
    title: "Consultar",
    items: [
      { href: "/", label: "Painel JEC", icon: LayoutDashboard },
      { href: "/causal", label: "Atlas Causal", icon: GitBranch },
      { href: "/compendio", label: "Compêndio", icon: BookOpenCheck },
      { href: "/rmbh", label: "Cobertura RMBH", icon: MapPinned },
      { href: "/nacional", label: "Censo nacional", icon: Globe2 },
    ],
  },
  {
    title: "Operar",
    items: [
      { href: "/escritorio/clientes", label: "Clientes", icon: Users },
      { href: "/escritorio/comunicacoes", label: "Comunicações", icon: Inbox },
      { href: "/escritorio/jurisprudencia", label: "Jurisprudência", icon: Gavel },
      { href: "/escritorio/treinamento", label: "Treinamento", icon: GraduationCap },
      { href: "/juridia", label: "JuridIA", icon: FileSignature },
    ],
  },
  {
    title: "Governar",
    items: [
      { href: "/estrutura", label: "Estrutura", icon: Boxes },
      { href: "/fontes", label: "Fontes públicas", icon: Database },
      { href: "/controle", label: "Controle editorial", icon: ClipboardCheck },
    ],
  },
];

export function SiteNav({ heading = "Navegação principal" }: { heading?: string }) {
  const [location] = useLocation();
  const isActive = (href: string) =>
    href === "/" ? location === "/" : location === href || location.startsWith(href + "/");

  return (
    <nav className="site-nav" aria-label="Navegação do Atlas Forense">
      <span className="site-nav-heading">{heading}</span>
      {SITE_NAV_GROUPS.map((group) => (
        <div key={group.title} className="site-nav-group">
          <span className="site-nav-group-title">{group.title}</span>
          {group.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(item.href) ? "site-nav-link active" : "site-nav-link"}
            >
              <item.icon size={15} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}

/** Trilha de retorno compacta para topbars das páginas internas. */
export function SiteBreadcrumb({ current }: { current: string }) {
  return (
    <div className="site-breadcrumb" aria-label="Trilha de navegação">
      <Link href="/" className="site-breadcrumb-link">
        <Landmark size={14} /> Painel Atlas
      </Link>
      <span aria-hidden="true">/</span>
      <span className="site-breadcrumb-current">{current}</span>
    </div>
  );
}
