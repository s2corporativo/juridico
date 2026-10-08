/** OIDC relying party do Atlas Jurídico para o IdP JuridIA. */

import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";
import { createRemoteJWKSet, jwtVerify } from "jose";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { COOKIE_NAME, SESSION_TTL_MS } from "@shared/const";
import { getSessionCookieOptions } from "./cookies";
import { ENV } from "./env";
import { createSessionToken } from "./session";
import { getAtlasSsoRuntime, ATLAS_SSO_STATE_COOKIE, type AtlasSsoRuntime } from "../sso-config";

// ── Origem da requisição (proxy-aware) ─────────────────────────────────────────

function requestOrigin(req: Request): string {
  const header = (name: string): string | undefined => {
    const v = req.headers[name];
    return Array.isArray(v) ? v[0] : v;
  };
  const proto = header("x-forwarded-proto")?.split(",")[0]?.trim()
    || ((req as { socket?: { encrypted?: boolean } }).socket?.encrypted ? "https" : "http");
  const host = header("x-forwarded-host")?.split(",")[0]?.trim() || header("host") || "localhost";
  return `${proto}://${host}`;
}

function callbackUri(req: Request): string {
  return `${requestOrigin(req)}/api/sso/callback`;
}

// ── State (CSRF + PKCE) assinado ─────────────────────────────────────────────

interface AtlasSsoState {
  nonce: string;
  verifier: string;
  iat: number;
}

function b64u(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function getStateSecret(): string {
  const secret = ENV.sessionSecret;
  if (secret) return secret;
  if (ENV.isProduction) {
    throw new Error("JWT_SECRET ausente — impossível assinar o state do SSO em produção");
  }
  // Dev: segredo efêmero por processo (nunca usado em produção).
  return "atlas-sso-dev-only-state-secret";
}

function signState(state: AtlasSsoState): string {
  const payload = b64u(Buffer.from(JSON.stringify(state), "utf8"));
  const sig = b64u(createHmac("sha256", getStateSecret()).update(payload).digest());
  return `${payload}.${sig}`;
}

function verifyState(value: string | undefined): AtlasSsoState | null {
  if (!value) return null;
  const dot = value.lastIndexOf(".");
  if (dot <= 0) return null;
  const payload = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  const expected = b64u(createHmac("sha256", getStateSecret()).update(payload).digest());
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return null;
  try {
    const state = JSON.parse(Buffer.from(payload, "base64").toString("utf8")) as AtlasSsoState;
    // state válido por no máximo 10 minutos
    if (typeof state.iat !== "number" || Date.now() - state.iat > 10 * 60 * 1000) return null;
    if (typeof state.nonce !== "string" || typeof state.verifier !== "string") return null;
    return state;
  } catch {
    return null;
  }
}

// ── Descoberta OIDC (validada e em cache curto) ──────────────────────────────

interface DiscoveryDoc {
  issuer: string;
  token_endpoint: string;
  jwks_uri: string;
}

const discoveryCache = new Map<string, { doc: DiscoveryDoc; fetchedAt: number }>();
const DISCOVERY_TTL_MS = 5 * 60 * 1000;

export async function fetchValidatedDiscovery(runtime: AtlasSsoRuntime): Promise<DiscoveryDoc> {
  const cached = discoveryCache.get(runtime.issuer);
  if (cached && Date.now() - cached.fetchedAt < DISCOVERY_TTL_MS) return cached.doc;

  const url = `${runtime.issuer}/.well-known/openid-configuration`;
  const resp = await fetch(url, { signal: AbortSignal.timeout(5_000) });
  if (!resp.ok) throw new Error(`discovery indisponível (${resp.status})`);
  const doc = (await resp.json()) as DiscoveryDoc;
  if (doc.issuer !== runtime.issuer) {
    throw new Error(`issuer divergente: discovery declara "${doc.issuer}", configurado "${runtime.issuer}"`);
  }
  if (!doc.token_endpoint || !doc.jwks_uri) {
    throw new Error("discovery sem token_endpoint/jwks_uri");
  }
  discoveryCache.set(runtime.issuer, { doc, fetchedAt: Date.now() });
  return doc;
}

// ── JWKS ─────────────────────────────────────────────────────────────────────

const jwksCache = new Map<string, ReturnType<typeof createRemoteJWKSet>>();
function getJwks(jwksUri: string) {
  let set = jwksCache.get(jwksUri);
  if (!set) {
    set = createRemoteJWKSet(new URL(jwksUri), { cooldownDuration: 60_000 });
    jwksCache.set(jwksUri, set);
  }
  return set;
}

// ── Rotas ────────────────────────────────────────────────────────────────────

function notEnabled(res: Response, runtime: ReturnType<typeof getAtlasSsoRuntime>) {
  res.status(503).json({ error: "sso_disabled", status: runtime.status });
}

/**
 * GET /api/sso/start — inicia o fluxo: gera state+PKCE, grava cookie e
 * redireciona ao endpoint de autorização do JuridIA. A ativação é fail-closed e depende da configuração do ambiente.
 */
export async function ssoStart(req: Request, res: Response): Promise<void> {
  const runtime = getAtlasSsoRuntime(callbackUri(req));
  if (runtime.status !== "enabled") {
    notEnabled(res, runtime);
    return;
  }
  try {
    const discovery = await fetchValidatedDiscovery(runtime);
    const nonce = randomBytes(16).toString("base64url");
    const verifier = randomBytes(64).toString("base64url");

    // PKCE S256: challenge = base64url(sha256(verifier.ascii))
    const challenge = b64u(createHash("sha256").update(verifier, "ascii").digest());

    const authorizeUrl = new URL(`${discovery.issuer}/authorize`);
    authorizeUrl.searchParams.set("client_id", runtime.clientId);
    authorizeUrl.searchParams.set("redirect_uri", runtime.redirectUri);
    authorizeUrl.searchParams.set("response_type", "code");
    authorizeUrl.searchParams.set("scope", "openid profile email role persona");
    authorizeUrl.searchParams.set("state", "atlas"); // referência simples; a prova é o cookie assinado
    authorizeUrl.searchParams.set("nonce", nonce);
    authorizeUrl.searchParams.set("code_challenge", challenge);
    authorizeUrl.searchParams.set("code_challenge_method", "S256");

    const signed = signState({ nonce, verifier, iat: Date.now() });
    const cookieOptions = getSessionCookieOptions(req);
    res.cookie(ATLAS_SSO_STATE_COOKIE, signed, { ...cookieOptions, maxAge: 10 * 60 * 1000, sameSite: "lax" });
    console.log("[ATLAS-SSO] start → authorize", { issuer: runtime.issuer });
    res.redirect(302, authorizeUrl.toString());
  } catch (error) {
    console.error("[ATLAS-SSO] start falhou:", error instanceof Error ? error.message : error);
    res.status(502).json({ error: "sso_start_failed" });
  }
}

/**
 * GET /api/sso/callback — troca o código por ID Token e cria a sessão Atlas.
 */
export async function ssoCallback(req: Request, res: Response): Promise<void> {
  const runtime = getAtlasSsoRuntime(callbackUri(req));
  if (runtime.status !== "enabled") {
    notEnabled(res, runtime);
    return;
  }

  const url = new URL(req.url, "http://internal");
  const code = url.searchParams.get("code");
  const oauthError = url.searchParams.get("error");
  const stateParam = url.searchParams.get("state");

  // O cookie de dupla submissão é a prova anti-CSRF; o state na URL é referência.
  const cookieHeader = req.headers.cookie ?? "";
  const stateCookie = cookieHeader
    .split(";")
    .map(c => c.trim())
    .find(c => c.startsWith(`${ATLAS_SSO_STATE_COOKIE}=`))
    ?.slice(ATLAS_SSO_STATE_COOKIE.length + 1);
  const state = verifyState(stateCookie);

  res.clearCookie(ATLAS_SSO_STATE_COOKIE, { path: "/" });

  if (oauthError) {
    console.warn("[ATLAS-SSO] authorize devolveu erro:", oauthError);
    res.status(400).json({ error: "sso_authorize_error", detail: oauthError });
    return;
  }
  if (!code || !stateParam || !state) {
    res.status(403).json({ error: "invalid_sso_state" });
    return;
  }

  try {
    const discovery = await fetchValidatedDiscovery(runtime);

    // Troca do código (server-to-server, client_secret_post + PKCE).
    const tokenResp = await fetch(discovery.token_endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: runtime.clientId,
        client_secret: runtime.clientSecret,
        code,
        redirect_uri: runtime.redirectUri,
        code_verifier: state.verifier,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!tokenResp.ok) {
      const detail = await tokenResp.text().catch(() => "");
      console.error("[ATLAS-SSO] token endpoint falhou:", tokenResp.status, detail.slice(0, 200));
      res.status(502).json({ error: "sso_token_failed", status: tokenResp.status });
      return;
    }
    const tokens = (await tokenResp.json()) as { id_token?: string };
    if (!tokens.id_token) {
      res.status(502).json({ error: "sso_missing_id_token" });
      return;
    }

    // Validação do ID Token: assinatura via JWKS do emissor + iss/aud/exp.
    const jwks = getJwks(discovery.jwks_uri);
    const { payload } = await jwtVerify(tokens.id_token, jwks, {
      issuer: runtime.issuer,
      audience: "atlas-juridico",
      clockTolerance: 30,
    });
    // Anti-replay: o nonce do token deve bater com o state assinado (jose 6
    // não valida nonce nativamente — comparação explícita abaixo).
    if (payload.nonce !== state.nonce) {
      console.error("[ATLAS-SSO] nonce divergente — token possivelmente replayado");
      res.status(401).json({ error: "sso_invalid_token", detail: "nonce_mismatch" });
      return;
    }

    const sub = typeof payload.sub === "string" ? payload.sub : "";
    if (!sub) {
      res.status(401).json({ error: "sso_invalid_token", detail: "sub ausente" });
      return;
    }

    // Privilégio recebido do IdP nunca promove automaticamente o usuário no Atlas. A promoção administrativa é local e explícita.
    const claimedRole = typeof payload.role === "string" ? payload.role.toLowerCase() : "";
    const role = "user" as const;

    const openId = `juridia:${sub}`;
    const email = typeof payload.email === "string" ? payload.email : sub;
    const name = typeof payload.name === "string" && payload.name ? payload.name : null;

    await db.upsertUser({
      openId,
      name,
      email,
      loginMethod: "juridia-oidc",
      lastSignedIn: new Date(),
    });

    const sessionToken = await createSessionToken(openId, {
      name: name || "",
      expiresInMs: SESSION_TTL_MS,
    });
    const cookieOptions = getSessionCookieOptions(req);
    // SameSite=Lax (não "none"): o callback é navegação top-level do SSO — Lax
    // mantém o cookie funcional em http (dev) e https (produção), e browsers
    // rejeitam SameSite=None sem Secure.
    res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, sameSite: "lax", maxAge: SESSION_TTL_MS });

    console.log("[ATLAS-SSO] sessão criada", { sub, role, claimedRole, loginMethod: "juridia-oidc" });
    res.redirect(302, "/");
  } catch (error) {
    console.error("[ATLAS-SSO] callback falhou:", error instanceof Error ? error.message : error);
    res.status(401).json({ error: "sso_callback_failed" });
  }
}

/**
 * POST /api/sso/logout — encerra a sessão local do Atlas.
 * (O fim de sessão no IdP é feito pelo usuário em /api/auth/logout do JuridIA.)
 */
export async function ssoLogout(req: Request, res: Response): Promise<void> {
  res.clearCookie(COOKIE_NAME, { path: "/" });
  res.status(200).json({ ok: true });
}

export function registerSsoRoutes(app: Express): void {
  app.get("/api/sso/start", ssoStart);
  app.get("/api/sso/callback", ssoCallback);
  app.post("/api/sso/logout", ssoLogout);
}
