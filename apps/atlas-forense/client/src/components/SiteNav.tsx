// Navegação global do Atlas Jurídico.
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
  FileSearch,
  Landmark,
  FileSignature,
  type LucideIcon,
} from "lucide-react";
import { trpc } from "@/lib/trpc";

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
    title: "Análise",
    items: [
      { href: "/", label: "Painel JEC", icon: LayoutDashboard },
      { href: "/compendio", label: "Compêndio", icon: BookOpenCheck },
      { href: "/rmbh", label: "Cobertura RMBH", icon: MapPinned },
      { href: "/nacional", label: "Censo nacional", icon: Globe2 },
    ],
  },
  {
    title: "Escritório",
    items: [
      { href: "/escritorio/clientes", label: "Clientes", icon: Users },
      { href: "/escritorio/comunicacoes", label: "Comunicações", icon: Inbox },
      { href: "/escritorio/jurisprudencia", label: "Jurisprudência", icon: Gavel },
      { href: "/escritorio/treinamento", label: "Treinamento", icon: GraduationCap },
    ],
  },
  {
    title: "Sistema",
    items: [
      { href: "/estrutura", label: "Estrutura", icon: Boxes },
      { href: "/fontes", label: "Fontes públicas", icon: Database },
      { href: "/controle", label: "Controle editorial", icon: ClipboardCheck },
      { href: "/controle/fila-editorial", label: "Fila editorial", icon: FileSearch },
    ],
  },
];

export function SiteNav({ heading = "Atlas Jurídico" }: { heading?: string }) {
  const [location] = useLocation();
  const isActive = (href: string) =>
    href === "/" ? location === "/" : location === href || location.startsWith(href + "/");

  const integration = trpc.integration.ssoStatus.useQuery(undefined, { staleTime: 60_000, retry: false });
  const juridiaUrl =
    integration.data?.sso?.status === "enabled" && integration.data.sso.appUrl
      ? String(integration.data.sso.appUrl)
      : null;

  return (
    <nav className="site-nav" aria-label="Navegação do Atlas Jurídico">
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
      {juridiaUrl && (
        <div className="site-nav-group">
          <span className="site-nav-group-title">Produção</span>
          <a
            href={juridiaUrl}
            className="site-nav-link"
            title="Abrir a produção jurídica assistida"
          >
            <FileSignature size={15} aria-hidden="true" />
            <span>Produção Jurídica</span>
          </a>
        </div>
      )}
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
