// OIDC Identity Provider do JuridIA para o Atlas Jurídico.
// Authorization Code + PKCE S256, tokens RS256 e configuração fail-closed.

import { createHash, createPublicKey, createSign, createVerify, generateKeyPairSync, randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const KEY_KID = "juridia-rs256-1";
const ID_TOKEN_TTL_SECONDS = 600; // 10 min — curto: só para o handshake SSO
const CODE_TTL_SECONDS = 120; // código single-use, curto

export const OIDC_AUDIENCE = "atlas-juridico";
export const OIDC_SCOPES = ["openid", "profile", "email", "role", "persona"];
export const OIDC_SUPPORTED_ROLES = ["admin", "advogado", "user", "promotor", "juiz"];

// ── Configuração por env (fail-closed em produção) ──────────────────────────

export interface OidcIssuerConfig {
  issuer: string;
  clientId: string;
  clientSecret: string;
  redirectUris: string[];
}

/**
 * Configuração do IdP. Em produção exige JURIDIA_OIDC_ISSUER HTTPS e o cliente
 * registrado; sem isso, authorize/token retornam 503 (nunca segredo padrão).
 * Em desenvolvimento, um issuer localhost e um cliente "atlas-juridico" local
 * podem ser usados para homologação, desde que JURIDIA_OIDC_DEV_ALLOW_LOCAL=1.
 */
export function getIssuerConfig(): OidcIssuerConfig | { error: string } {
  const issuer = process.env.JURIDIA_OIDC_ISSUER?.trim().replace(/\/$/, "");
  const clientId = process.env.ATLAS_OIDC_CLIENT_ID?.trim();
  const clientSecret = process.env.ATLAS_OIDC_CLIENT_SECRET?.trim();
  const redirectUris = (process.env.ATLAS_OIDC_REDIRECT_URIS ?? "")
    .split(",").map(s => s.trim()).filter(Boolean);
  const devAllow = process.env.JURIDIA_OIDC_DEV_ALLOW_LOCAL === "1" && process.env.NODE_ENV !== "production";

  if (!issuer || !clientId || !clientSecret || redirectUris.length === 0) {
    if (devAllow) {
      const localIssuer = "http://localhost:3005/api/auth/oidc";
      return {
        issuer: localIssuer,
        clientId: "atlas-juridico",
        clientSecret: "atlas-juridico-local-secret",
        redirectUris: ["http://localhost:3000/api/sso/callback"],
      };
    }
    return { error: "sso_not_configured" };
  }

  if (!issuer.startsWith("https://") && process.env.NODE_ENV === "production") {
    return { error: "insecure_issuer_https_required" };
  }
  if (!issuer.startsWith("https://") && !devAllow && !/^https?:\/\/(localhost|127\.0\.0\.1)/.test(issuer)) {
    return { error: "insecure_issuer_https_required" };
  }
  return { issuer, clientId, clientSecret, redirectUris };
}

export function isHttpsIssuer(issuer: string): boolean {
  return issuer.startsWith("https://");
}

// ── PKCE (S256) ──────────────────────────────────────────────────────────────

export function s256Challenge(verifier: string): string {
  return createHash("sha256").update(verifier, "ascii").digest()
    .toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function isValidPkceVerifier(verifier: string): boolean {
  return verifier.length >= 43 && verifier.length <= 128 && /^[A-Za-z0-9\-._~]+$/.test(verifier);
}

// ── Chaves RS256 (persistidas em DB; geradas uma única vez) ─────────────────

export interface RsaKeyMaterial {
  kid: string;
  publicKeyPem: string;
  privateKeyPem: string;
}

export async function loadOrCreateSigningKey(): Promise<RsaKeyMaterial> {
  const existing = await db.oidcKey.findUnique({ where: { kid: KEY_KID } });
  if (existing) {
    return { kid: existing.kid, publicKeyPem: existing.publicKeyPem, privateKeyPem: existing.privateKeyPem };
  }
  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });
  const created = await db.oidcKey.create({
    data: { kid: KEY_KID, publicKeyPem: publicKey, privateKeyPem: privateKey },
  });
  return { kid: created.kid, publicKeyPem: created.publicKeyPem, privateKeyPem: created.privateKeyPem };
}

// ── ID Token (RS256) ─────────────────────────────────────────────────────────

function b64u(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64uJson(obj: unknown): string {
  return b64u(Buffer.from(JSON.stringify(obj), "utf8"));
}

export interface IdTokenClaims {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  auth_time: number;
  nonce?: string;
  role: string;
  persona: string;
  email?: string;
  name?: string | null;
}

export async function issueIdToken(params: {
  issuer: string;
  sub: string;
  role: string;
  nonce?: string | null;
  name?: string | null;
  email?: string;
}): Promise<{ token: string; expiresAt: number }> {
  const key = await loadOrCreateSigningKey();
  const now = Math.floor(Date.now() / 1000);
  const exp = now + ID_TOKEN_TTL_SECONDS;
  const role = (OIDC_SUPPORTED_ROLES as string[]).includes(params.role) ? params.role : "user";
  const header = { alg: "RS256", typ: "JWT", kid: key.kid };
  const payload: IdTokenClaims = {
    iss: params.issuer,
    sub: params.sub,
    aud: OIDC_AUDIENCE,
    iat: now,
    exp,
    auth_time: now,
    ...(params.nonce ? { nonce: params.nonce } : {}),
    role,
    persona: role,
    email: params.email ?? params.sub,
    name: params.name ?? null,
  };
  const signingInput = `${b64uJson(header)}.${b64uJson(payload)}`;
  const signer = createSign("RSA-SHA256");
  signer.update(signingInput);
  const sig = b64u(signer.sign(key.privateKeyPem));
  return { token: `${signingInput}.${sig}`, expiresAt: exp };
}

export interface JwtVerifyResult {
  valid: boolean;
  claims?: IdTokenClaims;
  error?: string;
}

export async function verifyIdToken(token: string, opts: { audience?: string } = {}): Promise<JwtVerifyResult> {
  const parts = token.split(".");
  if (parts.length !== 3) return { valid: false, error: "malformed_token" };
  const [h, p, sig] = parts;
  const key = await loadOrCreateSigningKey();
  const verifier = createVerify("RSA-SHA256");
  verifier.update(`${h}.${p}`);
  let sigOk = false;
  try {
    sigOk = verifier.verify(key.publicKeyPem, Buffer.from(sig.replace(/-/g, "+").replace(/_/g, "/"), "base64"));
  } catch {
    return { valid: false, error: "invalid_signature" };
  }
  if (!sigOk) return { valid: false, error: "invalid_signature" };
  let claims: IdTokenClaims;
  try {
    claims = JSON.parse(Buffer.from(p.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8")) as IdTokenClaims;
  } catch {
    return { valid: false, error: "malformed_payload" };
  }
  const cfg = getIssuerConfig();
  if ("error" in cfg) return { valid: false, error: cfg.error };
  if (claims.iss !== cfg.issuer) return { valid: false, error: "invalid_issuer" };
  if (claims.aud !== (opts.audience ?? OIDC_AUDIENCE)) return { valid: false, error: "invalid_audience" };
  if (typeof claims.exp !== "number" || Math.floor(Date.now() / 1000) >= claims.exp) {
    return { valid: false, error: "token_expired" };
  }
  return { valid: true, claims };
}

// ── JWKS (pública, RS256) ────────────────────────────────────────────────────

export async function jwksResponse(): Promise<{ keys: Record<string, unknown>[] }> {
  const key = await loadOrCreateSigningKey();
  const pub = createPublicKey(key.publicKeyPem);
  const jwk = pub.export({ format: "jwk" }) as { n?: string; e?: string; kty?: string };
  return {
    keys: [
      {
        kty: jwk.kty ?? "RSA",
        use: "sig",
        alg: "RS256",
        kid: key.kid,
        n: jwk.n,
        e: jwk.e,
      },
    ],
  };
}

// ── Discovery ────────────────────────────────────────────────────────────────

export function discoveryDocument(issuer: string) {
  return {
    issuer,
    authorization_endpoint: `${issuer}/authorize`,
    token_endpoint: `${issuer}/token`,
    jwks_uri: `${issuer}/jwks`,
    userinfo_endpoint: `${issuer}/verify`,
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code"],
    code_challenge_methods_supported: ["S256"],
    id_token_signing_alg_values_supported: ["RS256"],
    subject_types_supported: ["public"],
    scopes_supported: OIDC_SCOPES,
    claims_supported: ["iss", "sub", "aud", "exp", "iat", "auth_time", "nonce", "role", "persona", "email", "name"],
    token_endpoint_auth_methods_supported: ["client_secret_post"],
  };
}

// ── Códigos de autorização (single-use, TTL curto) ──────────────────────────

export function generateAuthCode(): string {
  return randomBytes(32).toString("base64url");
}

export function codeExpiry(): Date {
  return new Date(Date.now() + CODE_TTL_SECONDS * 1000);
}

// ── Utilitários de redirect_uri (allowlist exata) ────────────────────────────

export function isRegisteredRedirectUri(cfg: OidcIssuerConfig, uri: string): boolean {
  return cfg.redirectUris.includes(uri);
}
