import "dotenv/config";
import express from "express";
import path from "node:path";
import { createServer } from "node:http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { createContext } from "./_core/trpc";
import { validateRuntimeConfig } from "./_core/config";
import { ENV, isProduction } from "./_core/env";
import { registerOAuthRoutes } from "./_core/oauth";
import { registerStorageProxy } from "./_core/storageProxy";
import { ATLAS_HEALTH_RESPONSE } from "@shared/deployment";
import { apiLimiter, authLimiter, storageLimiter } from "./_core/rate-limit";

validateRuntimeConfig();

const app = express();
const server = createServer(app);
const root = process.cwd();

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.get("/healthz", (_req, res) => res.status(200).json(ATLAS_HEALTH_RESPONSE));

// Log de requisição enxuto: método, rota, status e duração. Sem query string e
// sem corpo, para que relato de caso e número de processo não caiam no journal.
app.use((req, res, next) => {
  if (req.path === "/healthz") return next();
  const startedAt = process.hrtime.bigint();
  res.on("finish", () => {
    const ms = Number(process.hrtime.bigint() - startedAt) / 1e6;
    console.log(`[atlas] ${req.method} ${req.path} ${res.statusCode} ${ms.toFixed(1)}ms`);
  });
  next();
});

app.use("/api/auth", authLimiter);
app.use("/manus-storage", storageLimiter);
app.use("/api/trpc", apiLimiter);

registerStorageProxy(app);
registerOAuthRoutes(app);
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
    onError({ error, path: procedure, type }) {
      // Erros de contrato (404/403/400) são ruído esperado; só o inesperado
      // precisa de stack. Nada do input é registrado.
      if (error.code === "INTERNAL_SERVER_ERROR") {
        console.error(`[atlas-trpc] ${type} ${procedure ?? "<sem rota>"} falhou`, error.cause ?? error);
      } else {
        console.warn(`[atlas-trpc] ${type} ${procedure ?? "<sem rota>"} ${error.code}`);
      }
    },
  }),
);

if (isProduction) {
  const client = path.join(root, "dist/client");
  app.use(express.static(client, { maxAge: "1h", index: false }));
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api/") || req.path.startsWith("/manus-storage/")) return next();
    res.sendFile(path.join(client, "index.html"));
  });
} else {
  const { createServer: createVite } = await import("vite");
  const vite = await createVite({ root: path.join(root, "client"), server: { middlewareMode: true }, appType: "spa" });
  app.use(vite.middlewares);
}

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[atlas] erro não tratado", error);
  if (res.headersSent) return;
  res.status(500).json({ error: "internal_error" });
});

server.listen(ENV.port, ENV.host, () => console.log(`[atlas] http://${ENV.host}:${ENV.port} (${ENV.nodeEnv})`));
