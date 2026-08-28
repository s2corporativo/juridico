import type { Express, Request, Response } from "express";
import { sdk } from "./_core/sdk";
import { getEditorialScheduleByTaskUid } from "./db";
import { runEditorialUpdate, sanitizeEditorialError } from "./editorial-pipeline";

export function registerEditorialScheduledRoute(app: Express) {
  app.post("/api/scheduled/editorial-daily", async (req: Request, res: Response) => {
    let user;
    try {
      user = await sdk.authenticateRequest(req);
    } catch {
      res.status(403).json({ error: "scheduled_only" });
      return;
    }
    try {
      if (!user.isCron || !user.taskUid) {
        res.status(403).json({ error: "scheduled_only" });
        return;
      }
      const schedule = await getEditorialScheduleByTaskUid(user.taskUid);
      if (!schedule || !schedule.enabled) {
        res.status(200).json({ ok: true, skipped: "orphan_or_disabled" });
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
