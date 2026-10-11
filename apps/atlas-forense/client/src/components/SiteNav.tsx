// SiteNav.tsx — Navegação global do Atlas Forense.
// Antes: várias seções (/estrutura, /nacional, /controle, /escritorio/*) só eram
// acessíveis digitando URL. Este componente unifica a navegação em todos os shells.
import {
  CalendarDays, BookOpenCheck, Database, Activity,
  Landmark, FileSignature, type LucideIcon,
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

/** Atlas: only discovery, organized research and daily legal updates. */
export const SITE_NAV_GROUPS: SiteNavGroup[] = [
  {
    title: "Atlas Jurídico",
    items: [
      { href: "/", label: "Atualizações diárias", icon: CalendarDays },
      { href: "/compendio", label: "Acervo jurídico", icon: BookOpenCheck },
      { href: "/fontes", label: "Pesquisa de fontes", icon: Database },
      { href: "/controle", label: "Monitoramento", icon: Activity },
    ],
  },
];

export function SiteNav({ heading = "Atlas · Atualização jurídica" }: { heading?: string }) {
  const [location] = useLocation();
  const isActive = (href: string) =>
    href === "/" ? location === "/" : location === href || location.startsWith(href + "/");

  // Ponte JuridIA (EJC): o atalho só aparece quando o runtime SSO está ATIVO
  // (fail-closed — idem integration.ejcStatus).
  const ejc = trpc.integration.ejcStatus.useQuery(undefined, { staleTime: 60_000, retry: false });
  const ejcUrl =
    ejc.data?.sso?.status === "enabled" && ejc.data.sso.issuer
      ? String(ejc.data.sso.issuer)
      : null;

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
      {ejcUrl && (
        <div className="site-nav-group">
          <span className="site-nav-group-title">Produção</span>
          <a
            href={ejcUrl}
            className="site-nav-link"
            title="Abrir JuridIA para pesquisa e proposta de minutas"
          >
            <FileSignature size={15} aria-hidden="true" />
            <span>Minutas · JuridIA</span>
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
