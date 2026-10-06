import { getNotificationRuntime } from "./notification-service";
import type { RealtimeNotificationPayload } from "./notification-service";

/**
 * Helper de emissão para o restante do servidor (DJEN, Jurisprudência, etc.).
 *
 * - Fala exclusivamente com o serviço de notificação em loopback
 *   (`http://127.0.0.1:<porta fixa>/emit`), autenticado com o segredo interno.
 * - Nunca lança: falha de entrega é apenas registrada em log — o fluxo de
 *   negócio (sincronização, ingestão) nunca depende da notificação.
 */

export type NotificationEmitInput = {
  target: "office:global" | `user:${number}`;
  event: "notification:new";
  data: {
    title: string;
    content?: string;
    level?: RealtimeNotificationPayload["level"];
    link?: string;
    category?: string;
  };
};

const EMIT_TIMEOUT_MS = 2_000;

export async function emitNotification(input: NotificationEmitInput): Promise<boolean> {
  const runtime = getNotificationRuntime();
  if (!runtime) {
    console.warn("[Realtime] emit ignorado: serviço de notificação não está em execução");
    return false;
  }

  try {
    const response = await fetch(`http://127.0.0.1:${runtime.port}/emit`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-notification-secret": runtime.secret,
      },
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(EMIT_TIMEOUT_MS),
    });

    if (!response.ok) {
      console.warn(`[Realtime] emit falhou: HTTP ${response.status}`);
      return false;
    }

    return true;
  } catch (error) {
    const motivo = error instanceof Error ? error.message : String(error);
    console.warn(`[Realtime] emit falhou: ${motivo}`);
    return false;
  }
}

/** Dispara sem bloquear o chamador (uso em fluxos de sync/agendadores). */
export function voidEmitNotification(input: NotificationEmitInput): void {
  void emitNotification(input);
}
