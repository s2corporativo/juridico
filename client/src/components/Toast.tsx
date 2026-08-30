import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";

type ToastTone = "success" | "error";
type ToastEntry = { id: number; tone: ToastTone; message: string };
type ToastApi = { success: (message: string) => void; error: (message: string) => void };

const ToastContext = createContext<ToastApi | null>(null);

/**
 * Provider de notificações leve, sem dependência nova: reaproveita `.notice`
 * e `.notice.success` (já definida em styles.css, nunca usada até este ponto)
 * e `.notice.error`. Antes deste componente nenhuma mutation confirmava
 * sucesso, e a única forma de saber que algo funcionou era o efeito colateral
 * (a linha mudar de status, a lista recarregar).
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<ToastEntry[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setEntries((current) => current.filter((entry) => entry.id !== id));
  }, []);

  const push = useCallback(
    (tone: ToastTone, message: string) => {
      const id = nextId.current++;
      setEntries((current) => [...current, { id, tone, message }]);
      setTimeout(() => dismiss(id), 5000);
    },
    [dismiss],
  );

  const api: ToastApi = {
    success: (message) => push("success", message),
    error: (message) => push("error", message),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-stack" aria-live="polite" aria-atomic="false">
        {entries.map((entry) => (
          <div key={entry.id} className={`notice ${entry.tone} toast-entry`} role="status">
            {entry.tone === "success" ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            <span>{entry.message}</span>
            <button
              type="button"
              className="toast-dismiss"
              aria-label="Dispensar notificação"
              onClick={() => dismiss(entry.id)}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast usado fora de ToastProvider.");
  return ctx;
}
