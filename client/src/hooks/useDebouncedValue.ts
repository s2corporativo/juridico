import { useEffect, useState } from "react";

/**
 * Atrasa a propagação de um valor que muda rápido (texto de busca digitado
 * tecla a tecla) até que ele fique parado por `delayMs`. Sem isto, cada tecla
 * disparava uma query tRPC — usado pelas duas telas de busca do Atlas.
 */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
