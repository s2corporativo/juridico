/** Atlas Forense: jurimetria pública e Compêndio Jurídico Nacional. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ejcIntegrationManifest } from "@shared/ejc-integration";
import { Database } from "lucide-react";
import { lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useRealtimeNotifications } from "./hooks/useRealtimeNotifications";
import { Route, Switch, useLocation } from "wouter";

const Home = lazy(() => import("./pages/Home"));
const CompendiumPage = lazy(() => import("@/pages/CompendiumPage"));
const ControlCenterPage = lazy(() => import("@/pages/ControlCenterPage"));
const EditorialReviewPage = lazy(() => import("@/pages/EditorialReviewPage"));
const GovernancePage = lazy(() => import("@/pages/GovernancePage"));
const PublicSourcesPage = lazy(() => import("@/pages/PublicSourcesPage"));
const NationalCensusPage = lazy(() => import("@/pages/NationalCensusPage"));
const CitationDossierPage = lazy(() => import("@/pages/CitationDossierPage"));
const MetropolitanCoveragePage = lazy(() => import("@/pages/MetropolitanCoveragePage"));
const CausalDashboardPage = lazy(() => import("@/pages/CausalDashboardPage"));
const JuridiaWorkspacePage = lazy(() => import("@/pages/JuridiaWorkspacePage"));
const OfficeClientesPage = lazy(() => import("@/pages/OfficeClientesPage"));
const OfficeClienteDetalhePage = lazy(() => import("@/pages/OfficeClienteDetalhePage"));
const OfficeComunicacoesPage = lazy(() => import("@/pages/OfficeComunicacoesPage"));
const OfficeJurisprudenciaPage = lazy(() => import("@/pages/OfficeJurisprudenciaPage"));
const OfficeTreinamentoPage = lazy(() => import("@/pages/OfficeTreinamentoPage"));

function PageLoader() {
  return <main className="compendium-loading"><Database size={24} /><p>Carregando módulo do Atlas Forense…</p></main>;
}

export default function App() {
  const routes = Object.fromEntries(ejcIntegrationManifest.modules.map(module => [module.key, module.route])) as Record<string, string>;
  const [location] = useLocation();
  const isAtlasHome = location === routes.atlas || location === "/";
  // Notificações em tempo real (WebSocket autenticado, rota fixa /socket.io/).
  useRealtimeNotifications();

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Suspense fallback={<PageLoader />}>
            <Switch>
              <Route path={routes.atlas} component={Home} />
              <Route path={routes.compendium} component={CompendiumPage} />
              <Route path="/estrutura" component={GovernancePage} />
              <Route path="/controle" component={ControlCenterPage} />
              <Route path="/controle/fila-editorial" component={EditorialReviewPage} />
              <Route path={routes.sources} component={PublicSourcesPage} />
              <Route path={routes.national} component={NationalCensusPage} />
              <Route path="/rmbh" component={MetropolitanCoveragePage} />
              <Route path="/causal" component={CausalDashboardPage} />
              <Route path="/juridia" component={JuridiaWorkspacePage} />
              <Route path="/escritorio/clientes/:id" component={OfficeClienteDetalhePage} />
              <Route path="/escritorio/clientes" component={OfficeClientesPage} />
              <Route path="/escritorio/comunicacoes" component={OfficeComunicacoesPage} />
              <Route path="/escritorio/jurisprudencia" component={OfficeJurisprudenciaPage} />
              <Route path="/escritorio/treinamento" component={OfficeTreinamentoPage} />
              <Route path="/dossie/:externalId" component={CitationDossierPage} />
              <Route component={Home} />
            </Switch>
          </Suspense>
          {isAtlasHome && (
            <footer className="atlas-site-footer" aria-label="Recurso jurídico relacionado">
              Recurso público relacionado: <a href="https://acionejus.com.br/" target="_blank" rel="noopener noreferrer">AcioneJus — plataforma para organizar fatos, documentos e próximos passos jurídicos</a>.
            </footer>
          )}
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
