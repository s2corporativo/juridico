import { io, type Socket } from "socket.io-client";

/**
 * Cliente WebSocket do Atlas Forense.
 *
 * - Conecta SEMPRE pela mesma origem e rota fixa `/socket.io/` (o proxy reverso
 *   encaminha para a porta fixa interna do serviço de notificação). Nenhuma porta
 *   é escolhida aqui — a arquitetura `?XTransformPort=XXXX` não existe no app.
 * - Autenticação por cookie de sessão (`withCredentials`) com fallback do token
 *   de sessão em sessionStorage (mesmo mecanismo Bearer do cliente tRPC).
 * - Reconexão automática com backoff exponencial + jitter (1s → 15s).
 */

export type RealtimeNotification = {
  id: string;
  title: string;
  content: string;
  level: "info" | "success" | "warning" | "error";
  link?: string;
  category?: string;
  at: string;
};

export const REALTIME_NOTIFICATION_EVENT = "notification:new";

let socket: Socket | null = null;

export function getRealtimeSocket(): Socket {
  if (!socket) {
    socket = io({
      path: "/socket.io/",
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Number.POSITIVE_INFINITY,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 15000,
      randomizationFactor: 0.5,
      timeout: 20000,
    });
  }
  return socket;
}

export function disconnectRealtime(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
