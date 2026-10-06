import type { Express } from "express";
import { ENV } from "./env";

// O proxy serve somente imagens institucionais publicadas no Atlas.
const PUBLIC_ATLAS_ASSETS = new Set([
  "atlas-forense-logo_bb6317e2.png",
  "atlas-forense-seal_7ca15135.jpg",
  "atlas-forense-hero_a0688916.jpg",
  "atlas-forense-evidence_0ee8172d.jpg",
  "atlas-forense-municipal_aa1bc6b0.jpg",
]);

export function isPublicAtlasAsset(key: string): boolean {
  return PUBLIC_ATLAS_ASSETS.has(key);
}

export function registerStorageProxy(app: Express) {
  app.get("/manus-storage/*", async (req, res) => {
    const key = (req.params as Record<string, string>)[0];
    if (!key || !isPublicAtlasAsset(key)) {
      res.status(404).send("Asset not found");
      return;
    }

    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }

    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/",
      );
      forgeUrl.searchParams.set("path", key);

      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` },
      });

      if (!forgeResp.ok) {
        console.error(`[StorageProxy] forge error: ${forgeResp.status}`);
        res.status(502).send("Storage backend error");
        return;
      }

      const { url } = (await forgeResp.json()) as { url: string };
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }

      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch {
      console.error("[StorageProxy] failed to fetch public asset");
      res.status(502).send("Storage proxy error");
    }
  });
}
