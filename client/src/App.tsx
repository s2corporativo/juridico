/** Atlas Forense: jurimetria pública e Compêndio Jurídico Nacional. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ejcIntegrationManifest } from "@shared/ejc-integration";
import { Database } from "lucide-react";
import { lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Route, Switch } from "wouter";

const Home = lazy(() => import("./pages/Home"));
const CompendiumPage = lazy(() => import("@/pages/CompendiumPage"));
const ControlCenterPage = lazy(() => import("@/pages/ControlCenterPage"));
const GovernancePage = lazy(() => import("@/pages/GovernancePage"));
const PublicSourcesPage = lazy(() => import("@/pages/PublicSourcesPage"));
const NationalCensusPage = lazy(() => import("@/pages/NationalCensusPage"));
const CitationDossierPage = lazy(() => import("@/pages/CitationDossierPage"));

function PageLoader() {
  return <main className="compendium-loading"><Database size={24} /><p>Carregando módulo do Atlas Forense…</p></main>;
}

export default function App() {
  const routes = Object.fromEntries(ejcIntegrationManifest.modules.map(module => [module.key, module.route])) as Record<string, string>;
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
              <Route path={routes.sources} component={PublicSourcesPage} />
              <Route path={routes.national} component={NationalCensusPage} />
              <Route path="/dossie/:externalId" component={CitationDossierPage} />
              <Route component={Home} />
            </Switch>
          </Suspense>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
