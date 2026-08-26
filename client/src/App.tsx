/** Atlas Forense: jurimetria pública e Compêndio Jurídico Nacional. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import CompendiumPage from "@/pages/CompendiumPage";
import ControlCenterPage from "@/pages/ControlCenterPage";
import GovernancePage from "@/pages/GovernancePage";
import PublicSourcesPage from "@/pages/PublicSourcesPage";
import NationalCensusPage from "@/pages/NationalCensusPage";
import { ejcIntegrationManifest } from "@shared/ejc-integration";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { Route, Switch } from "wouter";

export default function App() {
  const routes = Object.fromEntries(ejcIntegrationManifest.modules.map(module => [module.key, module.route])) as Record<string, string>;
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Switch>
            <Route path={routes.atlas} component={Home} />
            <Route path={routes.compendium} component={CompendiumPage} />
            <Route path="/estrutura" component={GovernancePage} />
            <Route path="/controle" component={ControlCenterPage} />
            <Route path={routes.sources} component={PublicSourcesPage} />
            <Route path={routes.national} component={NationalCensusPage} />
            <Route component={Home} />
          </Switch>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
