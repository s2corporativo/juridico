import { TRPCError } from "@trpc/server";
import { ENV } from "./env";

export type NotificationPayload = { title: string; content: string };

export async function notifyOwner(payload: NotificationPayload): Promise<boolean> {
  const title = payload.title.trim();
  const content = payload.content.trim();
  if (!title || !content) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Título e conteúdo são obrigatórios." });
  }
  if (!ENV.notificationWebhookUrl) return false;

  try {
    const response = await fetch(ENV.notificationWebhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(ENV.notificationWebhookToken
          ? { authorization: `Bearer ${ENV.notificationWebhookToken}` }
          : {}),
      },
      body: JSON.stringify({ title: title.slice(0, 300), content: content.slice(0, 4000) }),
      signal: AbortSignal.timeout(10_000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
