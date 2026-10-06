// OIDC core for JuridIA (the EJC Identity Provider).
// Implements a minimal OIDC provider using HMAC-SHA256 (HS256) JWTs.
// Atlas Forense validates issued JWTs by calling /api/auth/oidc/verify
// (symmetric shared secret via JURIDIA_JWT_SECRET env var).

import { createHmac, timingSafeEqual } from "crypto";

export const OIDC_ISSUER = "http://localhost:3000/api/auth/oidc";
export const OIDC_AUDIENCE = "atlas-forense";
export const OIDC_KEY_ID = "juridia-1";
const TOKEN_TTL_SECONDS = 3600;

function getSecret(): string {
  const secret = process.env.JURIDIA_JWT_SECRET;
  if (!secret) {
    // Dev fallback — never used in production. In prod, JURIDIA_JWT_SECRET must be set.
    return "juridia-oidc-dev-shared-secret-please-rotate";
  }
  return secret;
}

function base64UrlEncode(input: Buffer | string): string {
  const buf = typeof input === "string" ? Buffer.from(input) : input;
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(str: string): Buffer {
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return Buffer.from(b64, "base64");
}

function sign(data: string): string {
  return base64UrlEncode(createHmac("sha256", getSecret()).update(data).digest());
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export interface OidcClaims {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  auth_time: number;
  role: string;
  persona: string;
  email?: string;
}

export interface IssueTokenInput {
  email: string;
  persona: string;
  role?: string;
}

export function issueJwt(input: IssueTokenInput): { token: string; expiresAt: number } {
  const now = Math.floor(Date.now() / 1000);
  const role = (input.role || deriveRoleFromPersona(input.persona)).toLowerCase();
  const header = { alg: "HS256", typ: "JWT", kid: OIDC_KEY_ID };
  const payload: OidcClaims = {
    iss: OIDC_ISSUER,
    sub: input.email,
    aud: OIDC_AUDIENCE,
    iat: now,
    exp: now + TOKEN_TTL_SECONDS,
    auth_time: now,
    role,
    persona: input.persona,
    email: input.email,
  };
  const h = base64UrlEncode(JSON.stringify(header));
  const p = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${h}.${p}`;
  const sig = sign(signingInput);
  return { token: `${signingInput}.${sig}`, expiresAt: payload.exp };
}

export interface VerifyResult {
  valid: boolean;
  claims?: OidcClaims;
  error?: string;
}

export function verifyJwt(token: string): VerifyResult {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return { valid: false, error: "malformed_token" };
  }
  const [h, p, sig] = parts;
  const expectedSig = sign(`${h}.${p}`);
  if (!safeEqual(sig, expectedSig)) {
    return { valid: false, error: "invalid_signature" };
  }
  let claims: OidcClaims;
  try {
    claims = JSON.parse(base64UrlDecode(p).toString("utf8")) as OidcClaims;
  } catch {
    return { valid: false, error: "malformed_payload" };
  }
  if (claims.iss !== OIDC_ISSUER) {
    return { valid: false, error: "invalid_issuer" };
  }
  if (claims.aud !== OIDC_AUDIENCE) {
    return { valid: false, error: "invalid_audience" };
  }
  const now = Math.floor(Date.now() / 1000);
  if (typeof claims.exp === "number" && now >= claims.exp) {
    return { valid: false, error: "token_expired" };
  }
  return { valid: true, claims };
}

function deriveRoleFromPersona(persona: string): string {
  const map: Record<string, string> = {
    admin: "admin",
    advogado: "advogado",
    promotor: "promotor",
    juiz: "juiz",
    user: "user",
  };
  return map[persona?.toLowerCase()] || "user";
}

export function discoveryDocument() {
  return {
    issuer: OIDC_ISSUER,
    authorization_endpoint: `${OIDC_ISSUER}/authorize`,
    token_endpoint: `${OIDC_ISSUER}/token`,
    userinfo_endpoint: `${OIDC_ISSUER}/userinfo`,
    jwks_uri: `${OIDC_ISSUER}/jwks`,
    revocation_endpoint: `${OIDC_ISSUER}/revoke`,
    introspection_endpoint: `${OIDC_ISSUER}/verify`,
    response_types_supported: ["code", "token"],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: ["HS256"],
    scopes_supported: ["openid", "profile", "email", "role", "persona"],
    claims_supported: [
      "iss",
      "sub",
      "aud",
      "exp",
      "iat",
      "auth_time",
      "role",
      "persona",
      "email",
    ],
    grant_types_supported: ["authorization_code", "client_credentials"],
  };
}

export function jwksResponse() {
  // Symmetric key descriptor — Atlas calls /verify to validate signatures
  // (HS256 cannot expose a public key, so consumers validate via the verify endpoint).
  return {
    keys: [
      {
        kty: "oct",
        use: "sig",
        alg: "HS256",
        kid: OIDC_KEY_ID,
      },
    ],
  };
}
