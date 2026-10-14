import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import httpProxy from "http-proxy";
import { sql } from "drizzle-orm";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerEjcSsoRoutes } from "./ejc-sso";
import { registerBrainApiRoutes } from "../brain-api";
import { isBrainTokenConfigured } from "../brain-api-auth";
import { registerStorageProxy } from "./storageProxy";
import { getServerListenOptions } from "./network";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { ATLAS_HEALTH_RESPONSE } from "@shared/deployment";
import { attachRequestId } from "./request-id";
import { getDb } from "../db";
import { ENV } from "./env";
import { registerEditorialScheduledRoute } from "../editorial-scheduled";
import { startDjenAutoSync } from "../djen";
import { startJurisprudenciaAutoSync } from "../jurisprudencia";
import { startNotificationService } from "../realtime/notification-service";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // Correlação ponta a ponta (F1.3): ver server/_core/request-id.ts
  app.use(attachRequestId);
  app.get("/healthz", (_req, res) => res.status(200).json(ATLAS_HEALTH_RESPONSE));
  // Readiness (F1.4): diferentemente do /healthz (liveness), /readyz verifica
  // dependências essenciais e reporta degradação explícita. Banco é bloqueante;
  // a API Brain sem token é degradação reportada (o painel continua servindo).
  app.get("/readyz", async (_req, res) => {
    const checks: Record<string, { ok: boolean; detail?: string }> = {};
    let ready = true;
    try {
      const db = await getDb();
      if (!db) throw new Error("database_unconfigured");
      await Promise.race([
        db.execute(sql`SELECT 1`),
        new Promise((_resolve, reject) => setTimeout(() => reject(new Error("database_check_timeout")), 3_000)),
      ]);
      checks.database = { ok: true };
    } catch (error) {
      ready = false;
      checks.database = { ok: false, detail: error instanceof Error ? error.message : "database_error" };
    }
    const brainConfigured = isBrainTokenConfigured(ENV.brainApiToken);
    checks.brainApi = brainConfigured
      ? { ok: true }
      : { ok: false, detail: "ATLAS_BRAIN_API_TOKEN ausente ou curto — API Brain desligada (503), painel segue de pé" };
    res.status(ready ? 200 : 503).json({ ok: ready, checks, uptimeSeconds: Math.round(process.uptime()) });
  });
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  registerEjcSsoRoutes(app);
  registerBrainApiRoutes(app);
  registerEditorialScheduledRoute(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  // (a rota fixa do WebSocket é registrada antes do middleware catch-all do Vite)

  // Serviço de notificação (WebSocket) em porta fixa de loopback, iniciado ANTES do
  // servidor principal para que a porta 3003 já esteja reservada quando o app
  // procurar a própria porta. Falha aqui não derruba o aplicativo.
  let notificationPort: number | null = null;
  try {
    const notification = await startNotificationService();
    notificationPort = notification.port;
    console.log(
      `[Realtime] notificações em http://127.0.0.1:${notification.port}/socket.io/ (rota fixa)`
    );
  } catch (error) {
    console.error(
      "[Realtime] serviço de notificação não iniciado:",
      error instanceof Error ? error.message : error
    );
  }

  // Rota fixa interna do WebSocket: /socket.io/* → 127.0.0.1:<porta fixa>.
  // Fixo→fixo, sem qualquer parâmetro de request escolhendo a porta de destino
  // (a arquitetura ?XTransformPort=XXXX é proibida). Em produções com proxy
  // reverso externo (Caddy) a rota externa é idêntica e o proxy interno fica
  // como segunda camada, inofensiva.
  if (notificationPort !== null) {
    const notificationProxy = httpProxy.createProxyServer({
      target: `http://127.0.0.1:${notificationPort}`,
      ws: true,
    });
    notificationProxy.on("error", (error, _req, res) => {
      console.warn(`[Realtime] proxy falhou: ${error.message}`);
      if (res && "writeHead" in res && typeof res.writeHead === "function") {
        try {
          res.writeHead(502, { "content-type": "application/json" });
          res.end('{"ok":false,"error":"notification_service_unavailable"}');
        } catch {
          // socket já encerrado
        }
      }
    });
    const isSocketIoPath = (url: string | undefined) =>
      url === "/socket.io" || url?.startsWith("/socket.io/") === true;
    app.use((req, res, next) => {
      if (isSocketIoPath(req.url)) {
        notificationProxy.web(req, res);
        return;
      }
      next();
    });
    server.on("upgrade", (req, socket, head) => {
      if (isSocketIoPath(req.url)) {
        notificationProxy.ws(req, socket, head);
      }
    });
    console.log(
      `[Realtime] rota fixa /socket.io/* → 127.0.0.1:${notificationPort} registrada`
    );
  }

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");

  // Fail-fast em produção (plano de profissionalização, tarefa F0.3): a porta é
  // contrato com o proxy reverso — o Caddy aponta para uma porta fixa. Buscar
  // automaticamente a próxima porta livre esconderia um desvio silencioso: o
  // serviço subia em outra porta, sem erro aparente, e o proxy passaria a
  // apontar para lugar nenhum. Em desenvolvimento mantém-se a busca por
  // conveniência local.
  let port: number;
  if (process.env.NODE_ENV === "production") {
    if (!(await isPortAvailable(preferredPort))) {
      throw new Error(
        `[Startup] Porta ${preferredPort} indisponível em produção — fail-fast (sem busca automática de porta). Verifique colisão com outro serviço ou ajuste PORT no arquivo de ambiente.`
      );
    }
    port = preferredPort;
  } else {
    port = await findAvailablePort(preferredPort);
    if (port !== preferredPort) {
      console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
    }
  }

  server.listen(getServerListenOptions(port, process.env.HOST), () => {
    console.log(`Server running on http://localhost:${port}/`);
    startDjenAutoSync();
    startJurisprudenciaAutoSync();
  });
}

startServer().catch((error) => {
  console.error(error);
  // Fail-fast: falha de inicialização (inclusive porta indisponível em
  // produção) encerra o processo com código de erro — o systemd deve registrar
  // a falha em vez de deixar o serviço aparentemente ativo.
  process.exit(1);
});
