import crypto from "crypto";
import type { Express, Request, Response } from "express";
import { runEditorialUpdate, sanitizeEditorialError } from "./editorial-pipeline";

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

export function registerEditorialScheduledRoute(app: Express) {
  app.post("/api/scheduled/editorial-daily", async (req: Request, res: Response) => {
    const expected = process.env.EDITORIAL_SCHEDULE_SECRET || "";
    const provided = req.header("x-editorial-secret") || "";
    if (!expected || expected.length < 16 || !safeEqual(provided, expected)) {
      res.status(403).json({ error: "scheduled_only" });
      return;
    }

    try {
      const result = await runEditorialUpdate();
      res.status(200).json({
        ok: true,
        runKey: result.runKey,
        status: result.status,
        discoveredCount: result.discoveredCount,
        queuedCount: result.queuedCount,
      });
    } catch (error) {
      console.error("[EditorialScheduled] run failed:", sanitizeEditorialError(error));
      res.status(500).json({ error: "editorial_update_failed" });
    }
  });
}
