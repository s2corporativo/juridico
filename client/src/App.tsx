/** Atlas Forense: jurimetria pública e Compêndio Jurídico Nacional. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import CompendiumPage from "@/pages/CompendiumPage";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { Route, Switch } from "wouter";

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/compendio" component={CompendiumPage} />
            <Route component={Home} />
          </Switch>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
