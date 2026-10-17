#!/usr/bin/env node
/**
 * Read-only preflight for the unified Atlas/JuridIA deployment.
 * Checks liveness and SSO configuration ONLY, not full E2E/backup readiness.
 * Never prints cookies, response bodies or secrets.
 */
import { pathToFileURL } from "node:url";

export const CHECKS = [
  { id: "atlas_liveness", url: "http://127.0.0.1:3114/healthz", accepted: [200], json: true },
  { id: "juridia_liveness", url: "http://127.0.0.1:3005/api/health", accepted: [200], json: true },
  { id: "juridia_oidc_discovery", url: "http://127.0.0.1:3005/api/auth/oidc/.well-known/openid-configuration", accepted: [200], json: true },
  { id: "atlas_sso_start", url: "http://127.0.0.1:3114/api/ejc-sso/start", accepted: [302], json: false },
  { id: "juridia_anonymous_access", url: "http://127.0.0.1:3005/api/auth/me", accepted: [401], json: true },
];

/** Only assert HTTP semantics; a 200 HTML SPA must not count as a health JSON. */
export async function checkEndpoint(spec, fetchImpl = fetch) {
  try {
    const response = await fetchImpl(spec.url, {
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    const contentType = response.headers.get("content-type") || "";
    const statusOk = spec.accepted.includes(response.status);
    const payloadOk = !spec.json || contentType.includes("application/json");
    return {
      id: spec.id,
      ok: statusOk && payloadOk,
      httpStatus: response.status,
      bodyTypeValid: payloadOk,
    };
  } catch {
    return { id: spec.id, ok: false, httpStatus: null, bodyTypeValid: false };
  }
}

export async function runPreflight(fetchImpl = fetch) {
  const checks = await Promise.all(CHECKS.map((check) => checkEndpoint(check, fetchImpl)));
  return { status: checks.every((check) => check.ok) ? "pass" : "blocked", checks,
    note: "Probe parcial: nao verifica backup/restore, identidade real, Atlas-JuridIA, IA, qualidade juridica ou rollback." };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const report = await runPreflight();
  process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  if (report.status !== "pass") process.exitCode = 1;
}
