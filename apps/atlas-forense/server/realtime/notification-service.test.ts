import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { SignJWT } from "jose";
import { io as ioClient, type Socket as ClientSocket } from "socket.io-client";

/**
 * Testes de segurança do serviço de notificações (Task 12):
 * autenticação no handshake, segredo do /emit, validação de payload,
 * isolamento de rooms, CORS restrito e rate limiting.
 */

const SECRET = "test-internal-secret-0123456789";
const JWT_SECRET_VALUE = "test-secret-atlas-forense-0123456789abcdef";

// ENV (server/_core/env.ts) é resolvido no import — define o segredo antes.
process.env.JWT_SECRET = JWT_SECRET_VALUE;
process.env.NODE_ENV = "test";

const { startNotificationService, TokenBucket, OFFICE_ROOM } = await import(
  "./notification-service"
);
type NotificationServiceHandle = Awaited<ReturnType<typeof startNotificationService>>;

const JWT_TEST_SECRET = new TextEncoder().encode(JWT_SECRET_VALUE);

async function signSession(openId: string): Promise<string> {
  return new SignJWT({ openId, appId: "test-app", name: "Usuário de Teste" })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(Math.floor(Date.now() / 1000) + 600)
    .sign(JWT_TEST_SECRET);
}

const RESOLVE_USER = async (openId: string) => {
  if (openId === "openid-advogado") return { id: 1, role: "user" };
  if (openId === "openid-outro") return { id: 2, role: "user" };
  return null;
};

function connectClient(
  port: number,
  options: { token?: string; origin?: string } = {}
): Promise<ClientSocket> {
  return new Promise((resolve, reject) => {
    const client = ioClient(`http://127.0.0.1:${port}`, {
      path: "/socket.io/",
      transports: ["websocket"],
      auth: { token: options.token },
      extraHeaders: options.origin ? { Origin: options.origin } : undefined,
      reconnection: false,
      timeout: 5000,
    });
    client.on("connect", () => resolve(client));
    client.on("connect_error", error => {
      client.close();
      reject(error);
    });
  });
}

async function emitRequest(
  port: number,
  body: unknown,
  secret: string = SECRET
): Promise<{ status: number; json: Record<string, unknown> | null }> {
  const response = await fetch(`http://127.0.0.1:${port}/emit`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-notification-secret": secret,
    },
    body: JSON.stringify(body),
  });
  const json = (await response.json().catch(() => null)) as Record<string, unknown> | null;
  return { status: response.status, json };
}

const VALID_BODY = {
  target: "user:1",
  event: "notification:new",
  data: { title: "Teste", content: "Conteúdo", level: "info" },
};

describe("Serviço de notificações (WebSocket)", () => {
  let handle: NotificationServiceHandle;
  const clients: ClientSocket[] = [];

  beforeAll(async () => {
    handle = await startNotificationService({
      port: 0, // porta efêmera — testes nunca tocam a porta fixa 3003
      secret: SECRET,
      allowedOrigins: ["http://localhost:3000"],
      resolveUser: RESOLVE_USER,
      limits: {
        emitCapacity: 1000,
        emitRefillPerSec: 1000,
        clientEventsCapacity: 1000,
        clientEventsRefillPerSec: 1000,
        subscribeCapacity: 1000,
        subscribeRefillPerSec: 1000,
      },
    });
  });

  afterAll(async () => {
    for (const client of clients) client.close();
    await handle?.close();
  });

  it("healthz responde sem dados sensíveis", async () => {
    const response = await fetch(`http://127.0.0.1:${handle.port}/healthz`);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, service: "notification" });
  });

  it("/emit sem segredo → 401", async () => {
    const response = await fetch(`http://127.0.0.1:${handle.port}/emit`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(VALID_BODY),
    });
    expect(response.status).toBe(401);
  });

  it("/emit com segredo errado → 401", async () => {
    const { status } = await emitRequest(handle.port, VALID_BODY, "segredo-errado");
    expect(status).toBe(401);
  });

  it("/emit com payload inválido → 400 (link absoluto, evento desconhecido, target arbitrário)", async () => {
    const linkAbsoluto = await emitRequest(handle.port, {
      target: "user:1",
      event: "notification:new",
      data: { title: "T", link: "https://externo.example/pagina" },
    });
    expect(linkAbsoluto.status).toBe(400);

    const eventoErrado = await emitRequest(handle.port, {
      target: "user:1",
      event: "notification:fabricada",
      data: { title: "T" },
    });
    expect(eventoErrado.status).toBe(400);

    const targetArbitrario = await emitRequest(handle.port, {
      target: "room:qualquer",
      event: "notification:new",
      data: { title: "T" },
    });
    expect(targetArbitrario.status).toBe(400);
  });

  it("handshake sem token é rejeitado", async () => {
    await expect(connectClient(handle.port)).rejects.toThrow(/unauthorized/i);
  });

  it("handshake com token inválido é rejeitado", async () => {
    await expect(
      connectClient(handle.port, { token: "token-falsificado" })
    ).rejects.toThrow(/unauthorized/i);
  });

  it("handshake com sessão válida conecta e recebe notificação dirigida à sua room", async () => {
    const token = await signSession("openid-advogado");
    const client = await connectClient(handle.port, { token });
    clients.push(client);

    const recebida = new Promise<Record<string, unknown>>(resolve =>
      client.on("notification:new", resolve)
    );
    const { status, json } = await emitRequest(handle.port, {
      target: "user:1",
      event: "notification:new",
      data: { title: "DJEN · novas comunicações", level: "success", link: "/escritorio/comunicacoes" },
    });
    expect(status).toBe(200);
    expect(json).toMatchObject({ ok: true, delivered: 1 });

    const payload = await recebida;
    expect(payload).toMatchObject({
      title: "DJEN · novas comunicações",
      level: "success",
      link: "/escritorio/comunicacoes",
    });
    expect(typeof payload.id).toBe("string");
  });

  it("isolamento: usuário não recebe notificação de outra room nem do escritório sem subscrição", async () => {
    const token = await signSession("openid-advogado");
    const client = await connectClient(handle.port, { token });
    clients.push(client);

    let recebeu = false;
    client.on("notification:new", () => {
      recebeu = true;
    });

    // Notificação para outro usuário — não pode chegar.
    await emitRequest(handle.port, {
      target: "user:2",
      event: "notification:new",
      data: { title: "Confidencial do outro usuário" },
    });
    // Notificação do escritório antes da subscrição — não pode chegar.
    await emitRequest(handle.port, {
      target: OFFICE_ROOM,
      event: "notification:new",
      data: { title: "Escritório antes da subscrição" },
    });
    await new Promise(resolve => setTimeout(resolve, 300));
    expect(recebeu).toBe(false);

    // Após subscrição explícita, a notificação do escritório chega.
    client.emit("office:subscribe", {}, (ack: { ok: boolean }) => {
      expect(ack.ok).toBe(true);
    });
    const recebida = new Promise<Record<string, unknown>>(resolve =>
      client.on("notification:new", resolve)
    );
    await new Promise(resolve => setTimeout(resolve, 100));
    const { status } = await emitRequest(handle.port, {
      target: OFFICE_ROOM,
      event: "notification:new",
      data: { title: "Escritório pós-subscrição" },
    });
    expect(status).toBe(200);
    expect(await recebida).toMatchObject({ title: "Escritório pós-subscrição" });
    recebeu = true;
  });

  it("cliente não consegue entrar em room arbitrária (não existe join genérico)", async () => {
    const token = await signSession("openid-advogado");
    const client = await connectClient(handle.port, { token });
    clients.push(client);

    let recebeu = false;
    client.on("notification:new", () => {
      recebeu = true;
    });

    // Tentativa de "join" manual — evento fora da allowlist é descartado.
    client.emit("join", { room: "user:2" });
    client.emit("notification:new", { title: "forjada pelo cliente" });
    await emitRequest(handle.port, {
      target: "user:2",
      event: "notification:new",
      data: { title: "Confidencial" },
    });
    await new Promise(resolve => setTimeout(resolve, 300));
    expect(recebeu).toBe(false);

    // Socket continua íntegro e eventos permitidos respondem.
    const ack = await new Promise<{ ok: boolean }>(resolve =>
      client.emit("notification:ack", { id: "aaaaaaaa-aaaa" }, resolve)
    );
    expect(ack.ok).toBe(true);
  });

  it("origem fora da allowlist é rejeitada no CORS", async () => {
    const token = await signSession("openid-advogado");
    await expect(
      connectClient(handle.port, { token, origin: "https://site-malicioso.example" })
    ).rejects.toThrow();
  });

  it("origem da allowlist conecta normalmente", async () => {
    const token = await signSession("openid-advogado");
    const client = await connectClient(handle.port, {
      token,
      origin: "http://localhost:3000",
    });
    clients.push(client);
    expect(client.connected).toBe(true);
  });

  it("rate limiting de /emit: excede o balde → 429", async () => {
    const dedicado = await startNotificationService({
      port: 0,
      secret: SECRET,
      resolveUser: RESOLVE_USER,
      limits: { emitCapacity: 3, emitRefillPerSec: 0 },
    });
    try {
      for (let i = 0; i < 3; i += 1) {
        const { status } = await emitRequest(dedicado.port, VALID_BODY);
        expect(status).toBe(200);
      }
      const { status } = await emitRequest(dedicado.port, VALID_BODY);
      expect(status).toBe(429);
    } finally {
      await dedicado.close();
    }
  });

  it("rate limiting de eventos do cliente: abuso desconecta o socket", async () => {
    const dedicado = await startNotificationService({
      port: 0,
      secret: SECRET,
      resolveUser: RESOLVE_USER,
      limits: { clientEventsCapacity: 5, clientEventsRefillPerSec: 0 },
    });
    try {
      const token = await signSession("openid-advogado");
      const client = await connectClient(dedicado.port, { token });
      const desconectou = new Promise<string>(resolve =>
        client.on("disconnect", reason => resolve(reason))
      );
      for (let i = 0; i < 8; i += 1) {
        client.emit("notification:ack", { id: `aaaaaaaa-${i}` });
      }
      const reason = await desconectou;
      expect(reason).toBe("io server disconnect");
      client.close();
    } finally {
      await dedicado.close();
    }
  });

  it("TokenBucket: capacidade e recarga", async () => {
    const balde = new TokenBucket(2, 0);
    expect(balde.tryTake()).toBe(true);
    expect(balde.tryTake()).toBe(true);
    expect(balde.tryTake()).toBe(false);

    const recarregavel = new TokenBucket(1, 1000);
    expect(recarregavel.tryTake()).toBe(true);
    await new Promise(resolve => setTimeout(resolve, 5));
    expect(recarregavel.tryTake()).toBe(true);
  });
});
