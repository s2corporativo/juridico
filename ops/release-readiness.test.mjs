import { test } from "node:test";
import assert from "node:assert/strict";
import { checkEndpoint, runPreflight, CHECKS } from "./release-readiness.mjs";

const response = (status, type = "application/json") => ({
  status, headers: new Headers({ "content-type": type }),
});
test("liveness must reject legacy HTML SPA with HTTP 200", async () => {
  const result = await checkEndpoint(CHECKS[0], async () => response(200, "text/html"));
  assert.equal(result.ok, false);
  assert.equal(result.bodyTypeValid, false);
});
test("SSO disabled is a release blocker", async () => {
  const report = await runPreflight(async (url) => {
    if (url.includes("ejc-sso/start") || url.includes(".well-known")) return response(503);
    if (url.includes("auth/me")) return response(401);
    return response(200);
  });
  assert.equal(report.status, "blocked");
  assert.equal(report.checks.filter(x => !x.ok).length, 2);
});
test("all smoke checks passing still report incomplete release readiness", async () => {
  const report = await runPreflight(async (url) => {
    if (url.includes("ejc-sso/start")) return response(302, "text/html");
    if (url.includes("auth/me")) return response(401);
    return response(200);
  });
  assert.equal(report.status, "pass");
  assert.match(report.note, /nao verifica backup/);
});
test("network and timeout errors fail closed", async () => {
  const result = await checkEndpoint(CHECKS[0], async () => { throw new Error("network"); });
  assert.equal(result.ok, false);
  assert.equal(result.httpStatus, null);
});
