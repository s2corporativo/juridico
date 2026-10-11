/** Atlas: daily autonomous source ingestion and research corpus, without ERP modules. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Database } from "lucide-react";
import { lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Route, Switch } from "wouter";

const DailyUpdatesPage = lazy(() => import("./pages/DailyUpdatesPage"));
const CompendiumPage = lazy(() => import("./pages/CompendiumPage"));
const PublicSourcesPage = lazy(() => import("./pages/PublicSourcesPage"));
const AtlasMonitoringPage = lazy(() => import("./pages/AtlasMonitoringPage"));
const EditorialReviewPage = lazy(() => import("./pages/EditorialReviewPage"));
const CitationDossierPage = lazy(() => import("./pages/CitationDossierPage"));

function PageLoader() {
  return <main className="compendium-loading"><Database size={24} /><p>Carregando o acervo jurídico…</p></main>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Suspense fallback={<PageLoader />}>
            <Switch>
              <Route path="/" component={DailyUpdatesPage} />
              <Route path="/compendio" component={CompendiumPage} />
              <Route path="/fontes" component={PublicSourcesPage} />
              <Route path="/controle" component={AtlasMonitoringPage} />
              {/* Internal review is subordinate to monitoring, not a fifth module. */}
              <Route path="/controle/fila-editorial" component={EditorialReviewPage} />
              {/* Deep citation traceability stays accessible from the corpus. */}
              <Route path="/dossie/:externalId" component={CitationDossierPage} />
              {/* Legacy office, JEC and census paths are no longer routable modules. */}
              <Route component={DailyUpdatesPage} />
            </Switch>
          </Suspense>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
