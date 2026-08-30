'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

/** Alternador de tema — os ícones são trocados por CSS (.dark no <html>), sem estado de hidratação. */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const alternar = () => {
    const escuroAgora =
      resolvedTheme === 'dark' ||
      (resolvedTheme === undefined && typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));
    setTheme(escuroAgora ? 'light' : 'dark');
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="size-8 p-0 text-muted-foreground transition-colors hover:border-amber-500/40 hover:text-amber-600 dark:hover:text-amber-400"
      onClick={alternar}
      aria-label="Alternar entre tema claro e escuro"
      title="Alternar tema (claro/escuro)"
    >
      <Sun className="hidden size-4 dark:block" />
      <Moon className="size-4 dark:hidden" />
    </Button>
  );
}
