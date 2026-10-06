import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  disconnectRealtime,
  getRealtimeSocket,
  REALTIME_NOTIFICATION_EVENT,
  type RealtimeNotification,
} from "@/lib/realtime";

/**
 * Hook de notificações em tempo real.
 *
 * - Só conecta com usuário autenticado; ao deslogar, desconecta.
 * - Assina a room do escritório (`office:subscribe`) a cada conexão — a room do
 *   usuário (`user:<id>`) é atribuída automaticamente pelo servidor.
 * - Valida o payload recebido com zod antes de exibir (defesa em profundidade).
 * - Reconexão é transparente (backoff exponencial do socket.io-client); o status
 *   fica disponível para a UI.
 */

const notificationSchema: z.ZodType<RealtimeNotification> = z.object({
  id: z.string().min(8).max(64),
  title: z.string().min(1).max(300),
  content: z.string().max(2000),
  level: z.enum(["info", "success", "warning", "error"]),
  link: z
    .string()
    .max(500)
    .regex(/^\/[A-Za-z0-9\-._~!$&'()*+,;=:@%/]*$/, "link interno inválido")
    .optional(),
  category: z.string().max(60).optional(),
  at: z.string().max(40),
});

export function useRealtimeNotifications() {
  const { isAuthenticated } = useAuth();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      disconnectRealtime();
      setConnected(false);
      return;
    }

    const socket = getRealtimeSocket();

    const onConnect = () => {
      setConnected(true);
      socket.emit("office:subscribe", {}, (ack: { ok?: boolean } | undefined) => {
        if (ack && ack.ok === false) {
          console.warn("[Realtime] subscrição do escritório rejeitada");
        }
      });
    };
    const onDisconnect = () => setConnected(false);
    const onConnectError = (error: Error) => {
      setConnected(false);
      // Falha silenciosa controlada: sem o gateway encaminhando /socket.io/ o
      // sistema continua funcional; a reconexão continua tentando com backoff.
      console.info("[Realtime] aguardando conexão:", error.message);
    };

    const onNotification = (payload: unknown) => {
      const parsed = notificationSchema.safeParse(payload);
      if (!parsed.success) {
        console.warn("[Realtime] payload de notificação inválido descartado");
        return;
      }
      const data = parsed.data;
      const options: Parameters<typeof toast.info>[1] = {
        description: data.content || undefined,
      };
      if (data.link) {
        options.action = {
          label: "Abrir",
          onClick: () => {
            window.location.href = data.link as string;
          },
        };
      }
      switch (data.level) {
        case "success":
          toast.success(data.title, options);
          break;
        case "warning":
          toast.warning(data.title, options);
          break;
        case "error":
          toast.error(data.title, options);
          break;
        default:
          toast.info(data.title, options);
      }
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on(REALTIME_NOTIFICATION_EVENT, onNotification);

    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off(REALTIME_NOTIFICATION_EVENT, onNotification);
    };
  }, [isAuthenticated]);

  return { connected };
}
