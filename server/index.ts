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

validateRuntimeConfig();

const app = express();
const server = createServer(app);
const root = process.cwd();

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.get("/healthz", (_req, res) => res.status(200).json(ATLAS_HEALTH_RESPONSE));

registerStorageProxy(app);
registerOAuthRoutes(app);
app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));

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

server.listen(ENV.port, ENV.host, () => console.log(`[atlas] http://${ENV.host}:${ENV.port} (${ENV.nodeEnv})`));
