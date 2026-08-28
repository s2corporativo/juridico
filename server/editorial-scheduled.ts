import type { Express, Request, Response } from "express";
import { sdk } from "./_core/sdk";
import { runEditorialUpdate, sanitizeEditorialError } from "./editorial-pipeline";

export function registerEditorialScheduledRoute(app: Express) {
  app.post("/api/scheduled/editorial-daily", async (req: Request, res: Response) => {
    try {
      const user = await sdk.authenticateRequest(req);
      if (!user.isCron || !user.taskUid) {
        res.status(403).json({ error: "scheduled_only" });
        return;
      }
      const result = await runEditorialUpdate();
      res.status(200).json({ ok: true, runKey: result.runKey, status: result.status, discoveredCount: result.discoveredCount, queuedCount: result.queuedCount });
    } catch (error) {
      console.error("[EditorialScheduled] run failed:", sanitizeEditorialError(error));
      res.status(500).json({ error: "editorial_update_failed" });
    }
  });
}
