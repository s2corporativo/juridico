'use client';

import * as React from 'react';
import { CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Input de data nativo (type=date) com estilo shadcn — confiável em mobile e teclado. */
export function CalendarInput({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <div className="relative">
      <input
        type="date"
        data-slot="calendar-input"
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pe-9 text-sm shadow-xs transition-colors',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-1',
          'dark:bg-input/30',
          className,
        )}
        {...props}
      />
      <CalendarDays className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
    </div>
  );
}
