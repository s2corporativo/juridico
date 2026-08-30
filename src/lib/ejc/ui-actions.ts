// EJC — Ações pendentes entre componentes (paleta ⌘K → abas).
// Como o AnimatePresence remonta as abas ao trocar, o evento CustomEvent pode
// se perder na janela de remontagem; o consumidor lê a ação pendente no mount
// e limpa em seguida (padrão "one-shot").

interface UiActions {
  abrirDoc?: string;
  perguntar?: string;
}

export const uiActions: UiActions = {};

export function agendarAcao<T extends keyof UiActions>(chave: T, valor: UiActions[T]) {
  uiActions[chave] = valor;
}

export function consumirAcao<T extends keyof UiActions>(chave: T): UiActions[T] {
  const valor = uiActions[chave];
  delete uiActions[chave];
  return valor;
}
