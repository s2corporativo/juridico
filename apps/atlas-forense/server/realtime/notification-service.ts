import { createServer } from "http";
import crypto from "crypto";
import express, { type Express, type Request, type Response } from "express";
import { Server as SocketIOServer, type Socket } from "socket.io";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { verifySession } from "../_core/session";
import * as db from "../db";

/**
 * Serviço de notificações em tempo real (WebSocket) do Atlas Forense.
 *
 * Arquitetura de segurança (Task 12):
 * - Porta interna FIXA (default 3003, env NOTIFICATION_SERVICE_PORT), sempre em loopback
 *   (127.0.0.1): o serviço nunca é exposto diretamente. O acesso externo acontece apenas
 *   por rota fixa de proxy reverso: `/socket.io/*` → 127.0.0.1:3003.
 * - Nenhuma porta interna pode ser escolhida dinamicamente pelo usuário. A arquitetura
 *   `?XTransformPort=XXXX` é proibida: não existe, e nunca deve existir, parâmetro de
 *   query/header que selecione a porta de destino de um proxy.
 * - Autenticação obrigatória no handshake: cookie de sessão `app_session_id` (JWT HS256)
 *   ou token equivalente em `auth.token` (fallback Bearer espelhado, usado quando o
 *   navegador bloqueia cookies). Handshake sem sessão válida é rejeitado.
 * - Autorização por rooms: `user:<id>` automático (somente o próprio usuário recebe) e
 *   `office:global` apenas por subscrição explícita do usuário autenticado. O cliente
 *   não tem como entrar em rooms arbitrárias — joins são sempre server-side.
 * - CORS restrito: allowlist de origens exatas (env ATLAS_ALLOWED_ORIGINS). Sem wildcard.
 * - Emissão apenas via `POST /emit` protegido por segredo interno
 *   (NOTIFICATION_INTERNAL_SECRET, comparado em tempo constante). Nenhum cliente externo
 *   fabrica notificações; o cliente WebSocket só recebe.
 * - Eventos validados com zod nos dois sentidos; payload limitado (16 kB em /emit,
 *   1 MB hard-cap no upgrade do Socket.IO); links apenas relativos (mesma origem).
 * - Rate limiting (token bucket) por socket e por fonte de emissão; abuso desconecta.
 * - Logs estruturados sem conteúdo de payload (apenas alvo, evento, tamanhos e motivo).
 */

export const DEFAULT_NOTIFICATION_PORT = 3003;
export const OFFICE_ROOM = "office:global";
export const NOTIFICATION_EVENT = "notification:new";

const CLIENT_EVENT_ALLOWLIST = ["office:subscribe", "office:unsubscribe", "notification:ack"] as const;
type ClientEventName = (typeof CLIENT_EVENT_ALLOWLIST)[number];

const SOCKET_PAYLOAD_HARD_CAP = 1_000_000; // 1 MB — protege handshake e upgrade
const EMIT_BODY_LIMIT = "16kb";
const PING_INTERVAL_MS = 25_000;
const PING_TIMEOUT_MS = 20_000;

/* ------------------------------------------------------------------ */
/* Configuração                                                        */
/* ------------------------------------------------------------------ */

export type RateLimitConfig = {
  clientEventsCapacity: number;
  clientEventsRefillPerSec: number;
  emitCapacity: number;
  emitRefillPerSec: number;
  subscribeCapacity: number;
  subscribeRefillPerSec: number;
};

const DEFAULT_LIMITS: RateLimitConfig = {
  clientEventsCapacity: 20,
  clientEventsRefillPerSec: 1,
  emitCapacity: 60,
  emitRefillPerSec: 1,
  subscribeCapacity: 5,
  subscribeRefillPerSec: 0.1,
};

export type ResolvedServiceUser = { id: number; role: string };

export type NotificationServiceOptions = {
  port?: number;
  host?: string;
  secret?: string;
  allowedOrigins?: string[];
  resolveUser?: (openId: string) => Promise<ResolvedServiceUser | null>;
  limits?: Partial<RateLimitConfig>;
  logger?: Pick<Console, "log" | "warn" | "error">;
};

export type NotificationServiceHandle = {
  port: number;
  host: string;
  io: SocketIOServer;
  httpServer: ReturnType<typeof createServer>;
  close: () => Promise<void>;
};

/* Runtime compartilhado no processo (usado pelo helper de emissão). */
let runtime: { port: number; secret: string } | null = null;

export function getNotificationRuntime(): { port: number; secret: string } | null {
  return runtime;
}

/* ------------------------------------------------------------------ */
/* Token bucket (rate limiting sem dependências externas)              */
/* ------------------------------------------------------------------ */

export class TokenBucket {
  private tokens: number;
  private lastRefill: number;

  constructor(
    private readonly capacity: number,
    private readonly refillPerSecond: number
  ) {
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  tryTake(amount = 1): boolean {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(
      this.capacity,
      this.tokens + elapsedSeconds * this.refillPerSecond
    );
    this.lastRefill = now;
    if (this.tokens < amount) return false;
    this.tokens -= amount;
    return true;
  }
}

/* ------------------------------------------------------------------ */
/* Validação de eventos (zod)                                          */
/* ------------------------------------------------------------------ */

/** Apenas caminhos relativos de mesma origem (bloqueia redirects externos). */
const RELATIVE_LINK_PATTERN = /^\/[A-Za-z0-9\-._~!$&'()*+,;=:@%/]*$/;
/** Alvos permitidos: room do usuário (server-side) ou room do escritório. */
const TARGET_PATTERN = /^(user:\d+|office:global)$/;
/** Acks referenciam apenas identificadores opacos gerados pelo próprio serviço. */
const ACK_ID_PATTERN = /^[A-Za-z0-9\-]{8,64}$/;

export const notificationDataSchema = z
  .object({
    title: z.string().min(1).max(300),
    content: z.string().max(2000).default(""),
    level: z.enum(["info", "success", "warning", "error"]).default("info"),
    link: z
      .string()
      .max(500)
      .regex(RELATIVE_LINK_PATTERN, "link deve ser caminho relativo à mesma origem")
      .optional(),
    category: z.string().max(60).optional(),
  })
  .strict();

const emitSchema = z
  .object({
    target: z
      .string()
      .max(64)
      .regex(TARGET_PATTERN, "target deve ser user:<id> ou office:global"),
    event: z.literal(NOTIFICATION_EVENT),
    data: notificationDataSchema,
  })
  .strict();

export type EmitRequest = z.infer<typeof emitSchema>;
export type RealtimeNotificationPayload = {
  id: string;
  title: string;
  content: string;
  level: "info" | "success" | "warning" | "error";
  link?: string;
  category?: string;
  at: string;
};

const clientEventSchemas: Record<ClientEventName, z.ZodTypeAny> = {
  "office:subscribe": z.object({}).strict(),
  "office:unsubscribe": z.object({}).strict(),
  "notification:ack": z
    .object({ id: z.string().max(64).regex(ACK_ID_PATTERN, "id inválido") })
    .strict(),
};

/* ------------------------------------------------------------------ */
/* Utilitários                                                         */
/* ------------------------------------------------------------------ */

function safeEqualStrings(provided: string, expected: string): boolean {
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) {
    // Compara mesmo assim para manter o perfil de tempo estável.
    crypto.timingSafeEqual(a, a.subarray(0, a.length));
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}

function parseAllowedOrigins(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map(origin => origin.trim().replace(/\/+$/, ""))
    .filter(origin => origin.length > 0);
}

const DEV_DEFAULT_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
];

function resolveInternalSecret(
  explicit: string | undefined,
  isProduction: boolean,
  logger: Pick<Console, "log" | "warn" | "error">
): string {
  if (explicit && explicit.length >= 16) return explicit;
  if (explicit) {
    logger.warn(
      "[Realtime] NOTIFICATION_INTERNAL_SECRET definido, mas curto demais (mínimo 16 caracteres). Gerando segredo efêmero."
    );
  }
  if (isProduction) {
    throw new Error(
      "[Realtime] NOTIFICATION_INTERNAL_SECRET é obrigatório em produção. Gere com: openssl rand -hex 32"
    );
  }
  const ephemeral = crypto.randomBytes(32).toString("hex");
  logger.warn(
    "[Realtime] NOTIFICATION_INTERNAL_SECRET ausente — usando segredo efêmero de desenvolvimento (válido apenas nesta execução)."
  );
  return ephemeral;
}

/* ------------------------------------------------------------------ */
/* Serviço                                                             */
/* ------------------------------------------------------------------ */

export async function startNotificationService(
  options: NotificationServiceOptions = {}
): Promise<NotificationServiceHandle> {
  const logger = options.logger ?? console;
  const isProduction = process.env.NODE_ENV === "production";

  const port =
    options.port ??
    (Number(process.env.NOTIFICATION_SERVICE_PORT ?? "") || DEFAULT_NOTIFICATION_PORT);
  const host = options.host ?? "127.0.0.1";
  const secret = resolveInternalSecret(
    options.secret ?? process.env.NOTIFICATION_INTERNAL_SECRET,
    isProduction,
    logger
  );
  const limits: RateLimitConfig = { ...DEFAULT_LIMITS, ...options.limits };

  const allowedOrigins =
    options.allowedOrigins ?? parseAllowedOrigins(process.env.ATLAS_ALLOWED_ORIGINS);
  const effectiveOrigins =
    allowedOrigins.length === 0 && !isProduction ? DEV_DEFAULT_ORIGINS : allowedOrigins;

  const resolveUser =
    options.resolveUser ??
    (async (openId: string): Promise<ResolvedServiceUser | null> => {
      const user = await db.getUserByOpenId(openId);
      if (!user) return null;
      return { id: user.id, role: user.role };
    });

  const app: Express = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: EMIT_BODY_LIMIT }));

  app.get("/healthz", (_req: Request, res: Response) => {
    res.status(200).json({ ok: true, service: "notification" });
  });

  const emitBucket = new TokenBucket(limits.emitCapacity, limits.emitRefillPerSec);

  app.post("/emit", (req: Request, res: Response) => {
    const provided = req.header("x-notification-secret") ?? "";
    if (!safeEqualStrings(provided, secret)) {
      logger.warn("[Realtime] emit:reject motivo=segredo_invalido");
      res.status(401).json({ ok: false, error: "unauthorized" });
      return;
    }

    if (!emitBucket.tryTake()) {
      logger.warn("[Realtime] emit:reject motivo=rate_limit");
      res.status(429).json({ ok: false, error: "rate_limited" });
      return;
    }

    const parsed = emitSchema.safeParse(req.body);
    if (!parsed.success) {
      const paths = parsed.error.issues
        .map(issue => issue.path.map(String).join("."))
        .slice(0, 5)
        .join(", ");
      logger.warn(
        `[Realtime] emit:reject motivo=payload_invalido campos=${paths || "desconhecidos"}`
      );
      res.status(400).json({ ok: false, error: "invalid_payload" });
      return;
    }

    const { target, event, data } = parsed.data;
    const payload: RealtimeNotificationPayload = {
      id: crypto.randomUUID(),
      title: data.title,
      content: data.content,
      level: data.level,
      link: data.link,
      category: data.category,
      at: new Date().toISOString(),
    };

    io.to(target).emit(event, payload);
    const delivered = io.of("/").adapter.rooms.get(target)?.size ?? 0;
    logger.log(
      `[Realtime] emit:accept evento=${event} alvo=${target} entregas=${delivered} bytes=${JSON.stringify(payload).length}`
    );
    res.status(200).json({ ok: true, delivered });
  });

  const httpServer = createServer(app);

  const io = new SocketIOServer(httpServer, {
    path: "/socket.io/",
    serveClient: false,
    maxHttpBufferSize: SOCKET_PAYLOAD_HARD_CAP,
    pingInterval: PING_INTERVAL_MS,
    pingTimeout: PING_TIMEOUT_MS,
    cors: {
      origin: (origin, callback) => {
        // Requisições sem Origin (curl, health, testes server-to-server) passam;
        // o handshake continua exigindo sessão válida.
        if (!origin) {
          callback(null, true);
          return;
        }
        const normalized = origin.replace(/\/+$/, "");
        if (effectiveOrigins.includes(normalized)) {
          callback(null, true);
          return;
        }
        logger.warn(`[Realtime] cors:reject origem=${normalized}`);
        callback(new Error("origin_not_allowed"));
      },
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  /* Autenticação obrigatória no handshake. */
  io.use(async (socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;
      const cookieToken = cookieHeader
        ? new Map(
            cookieHeader.split(";").map(pair => {
              const idx = pair.indexOf("=");
              return idx === -1
                ? [pair.trim(), ""]
                : [
                    pair.slice(0, idx).trim(),
                    decodeURIComponent(pair.slice(idx + 1).trim()),
                  ];
            })
          ).get(COOKIE_NAME)
        : undefined;

      const authCandidate = socket.handshake.auth?.token;
      const bearerToken =
        typeof authCandidate === "string" && authCandidate.length > 0
          ? authCandidate
          : undefined;

      const session = await verifySession(cookieToken ?? bearerToken);
      if (!session) {
        logger.warn(`[Realtime] auth:reject socket=${socket.id} motivo=sessao_invalida`);
        next(new Error("unauthorized"));
        return;
      }

      const user = await resolveUser(session.openId);
      if (!user) {
        logger.warn(`[Realtime] auth:reject socket=${socket.id} motivo=usuario_desconhecido`);
        next(new Error("unauthorized"));
        return;
      }

      socket.data.userId = user.id;
      socket.data.role = user.role;
      next();
    } catch {
      logger.warn(`[Realtime] auth:reject socket=${socket.id} motivo=erro_verificacao`);
      next(new Error("unauthorized"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = socket.data.userId as number;
    logger.log(`[Realtime] connect socket=${socket.id} user=${userId}`);

    socket.join(`user:${userId}`);

    const clientEventsBucket = new TokenBucket(
      limits.clientEventsCapacity,
      limits.clientEventsRefillPerSec
    );
    const subscribeBucket = new TokenBucket(
      limits.subscribeCapacity,
      limits.subscribeRefillPerSec
    );

    socket.onAny((eventName, ...args) => {
      if (!CLIENT_EVENT_ALLOWLIST.includes(eventName as ClientEventName)) {
        logger.warn(
          `[Realtime] client:event:reject socket=${socket.id} evento=${String(eventName)} motivo=event_fora_da_allowlist`
        );
        return; // ignora silenciosamente — cliente não define eventos
      }

      if (!clientEventsBucket.tryTake()) {
        logger.warn(`[Realtime] rate:limit socket=${socket.id} escopo=client_events`);
        socket.disconnect(true);
        return;
      }

      const ack =
        typeof args[args.length - 1] === "function" ? args[args.length - 1] : undefined;
      const payload = ack !== undefined ? args[args.length - 2] : args[args.length - 1];

      const parsed = clientEventSchemas[eventName as ClientEventName].safeParse(payload ?? {});
      if (!parsed.success) {
        logger.warn(
          `[Realtime] client:event:reject socket=${socket.id} evento=${eventName} motivo=payload_invalido`
        );
        if (typeof ack === "function") ack({ ok: false, error: "invalid_payload" });
        return;
      }

      switch (eventName) {
        case "office:subscribe": {
          if (!subscribeBucket.tryTake()) {
            logger.warn(`[Realtime] rate:limit socket=${socket.id} escopo=office_subscribe`);
            if (typeof ack === "function") ack({ ok: false, error: "rate_limited" });
            return;
          }
          socket.join(OFFICE_ROOM);
          if (typeof ack === "function") ack({ ok: true });
          break;
        }
        case "office:unsubscribe": {
          socket.leave(OFFICE_ROOM);
          if (typeof ack === "function") ack({ ok: true });
          break;
        }
        case "notification:ack": {
          // Reservado para confirmações de entrega; não há estado sensível aqui.
          if (typeof ack === "function") ack({ ok: true });
          break;
        }
      }
    });

    socket.on("disconnect", reason => {
      logger.log(`[Realtime] disconnect socket=${socket.id} user=${userId} motivo=${reason}`);
    });
  });

  await new Promise<void>((resolve, reject) => {
    httpServer.once("error", reject);
    httpServer.listen(port, host, () => resolve());
  });

  const address = httpServer.address();
  const actualPort = typeof address === "object" && address !== null ? address.port : port;

  runtime = { port: actualPort, secret };

  logger.log(
    `[Realtime] serviço de notificação escutando em http://${host}:${actualPort}/socket.io/ (rota fixa)`
  );

  return {
    port: actualPort,
    host,
    io,
    httpServer,
    close: async () => {
      runtime = null;
      await new Promise<void>((resolve, reject) => {
        io.close(() => resolve());
        httpServer.close(err => (err ? reject(err) : undefined));
      });
    },
  };
}
