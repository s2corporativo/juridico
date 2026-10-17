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
    title: "Pesquisa",
    items: [
      { href: "/", label: "Painel", icon: LayoutDashboard },
      { href: "/compendio", label: "Compêndio jurídico", icon: BookOpenCheck },
      { href: "/escritorio/jurisprudencia", label: "Jurisprudência", icon: Gavel },
      { href: "/causal", label: "Atlas Causal", icon: GitBranch },
    ],
  },
  {
    title: "Trabalho jurídico e curadoria",
    items: [
      { href: "/juridia", label: "JuridIA", icon: FileSignature },
      { href: "/fontes", label: "Fontes públicas", icon: Database },
      { href: "/controle", label: "Revisão editorial", icon: ClipboardCheck },
    ],
  },
  {
    title: "Recursos complementares",
    items: [
      { href: "/rmbh", label: "Cobertura RMBH", icon: MapPinned },
      { href: "/nacional", label: "Censo nacional", icon: Globe2 },
      { href: "/estrutura", label: "Estrutura", icon: Boxes },
      { href: "/escritorio/clientes", label: "Clientes do Atlas", icon: Users },
      { href: "/escritorio/comunicacoes", label: "Comunicações", icon: Inbox },
      { href: "/escritorio/treinamento", label: "Treinamento", icon: GraduationCap },
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
      {SITE_NAV_GROUPS.slice(0, 2).map((group) => (
        <div key={group.title} className="site-nav-group">
          <span className="site-nav-group-title">{group.title}</span>
          {group.items.map((item) => (
            item.href === "/juridia" ? (
              <a key={item.href} href="/juridia"
                className={isActive(item.href) ? "site-nav-link active" : "site-nav-link"}>
                <item.icon size={15} aria-hidden="true" />
                <span>{item.label}</span>
              </a>
            ) : (
              <Link key={item.href} href={item.href}
                className={isActive(item.href) ? "site-nav-link active" : "site-nav-link"}>
              <item.icon size={15} aria-hidden="true" />
              <span>{item.label}</span>
              </Link>
            )
          ))}
        </div>
      ))}
      <details className="site-nav-group">
        <summary className="site-nav-group-title cursor-pointer rounded-md py-2 focus-visible:outline-2">
          Recursos complementares
        </summary>
        {SITE_NAV_GROUPS[2].items.map((item) => (
          <Link key={item.href} href={item.href}
            className={isActive(item.href) ? "site-nav-link active" : "site-nav-link"}>
            <item.icon size={15} aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        ))}
      </details>
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
