import { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Confirmação para ações irreversíveis: aprovar/reprovar um gate de revisão,
 * transicionar o status de uma tese (pode publicá-la), abrir nova versão,
 * decidir a fila de evidências. Antes deste componente todas essas ações
 * disparavam direto no clique, sem nenhum passo intermediário.
 *
 * Usa <dialog> nativo (foco e Esc de graça) estilizado com as classes que já
 * existem em styles.css — .card/.card-top para a moldura, .button.danger
 * (definida, nunca usada até este ponto) para a ação destrutiva.
 */
export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  danger = false,
  pending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const onCancelEvent = (event: Event) => {
      event.preventDefault();
      onCancel();
    };
    node.addEventListener("cancel", onCancelEvent);
    return () => node.removeEventListener("cancel", onCancelEvent);
  }, [onCancel]);

  return (
    <dialog ref={ref} className="confirm-dialog card">
      <div className="card-top">
        <b>
          <AlertTriangle size={16} /> {title}
        </b>
      </div>
      <p>{description}</p>
      <div className="confirm-dialog-actions">
        <button type="button" className="button secondary" onClick={onCancel} disabled={pending}>
          Cancelar
        </button>
        <button
          type="button"
          className={`button ${danger ? "danger" : ""}`}
          onClick={onConfirm}
          disabled={pending}
        >
          {pending ? "Aguarde…" : confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
