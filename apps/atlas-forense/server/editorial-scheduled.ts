import type { Express, Request, Response } from "express";
import { createHash, timingSafeEqual } from "node:crypto";
import { sdk } from "./_core/sdk";
import { getEditorialScheduleByTaskUid } from "./db";
import { runEditorialUpdate, sanitizeEditorialError } from "./editorial-pipeline";

/** Optional VPS/systemd caller credential, independent of the legacy cron SDK.
 * Weak or absent credentials fail closed. Never print a secret.
 */
export function authenticateEditorialScheduleSecret(
  header: string | undefined,
  configured: string | undefined,
): boolean {
  if (!configured || configured.length < 32 || !header || header.length < 32) return false;
  const a = createHash("sha256").update(header).digest();
  const b = createHash("sha256").update(configured).digest();
  return timingSafeEqual(a, b);
}

export function registerEditorialScheduledRoute(app: Express) {
  app.post("/api/scheduled/editorial-daily", async (req: Request, res: Response) => {
    const vpsCronAuthorized = authenticateEditorialScheduleSecret(
      req.header("x-editorial-secret"),
      process.env.EDITORIAL_SCHEDULE_SECRET,
    );
    if (!vpsCronAuthorized) {
      let user;
      try {
        user = await sdk.authenticateRequest(req);
      } catch {
        res.status(403).json({ error: "scheduled_only" });
        return;
      }
      if (!user.isCron || !user.taskUid) {
        res.status(403).json({ error: "scheduled_only" });
        return;
      }
      try {
        const schedule = await getEditorialScheduleByTaskUid(user.taskUid);
        if (!schedule || !schedule.enabled) {
          res.status(200).json({ ok: true, skipped: "orphan_or_disabled" });
          return;
        }
      } catch {
        res.status(503).json({ error: "editorial_schedule_unavailable" });
        return;
      }
    }
    try {
      const result = await runEditorialUpdate();
      res.status(200).json({ ok: true, runKey: result.runKey, status: result.status, discoveredCount: result.discoveredCount, queuedCount: result.queuedCount });
    } catch (error) {
      console.error("[EditorialScheduled] run failed:", sanitizeEditorialError(error));
      res.status(500).json({ error: "editorial_update_failed" });
    }
  });
}
