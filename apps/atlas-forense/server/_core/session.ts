import { SignJWT, jwtVerify } from "jose";
import type { Request } from "express";
import type { User } from "../../drizzle/schema";
import * as db from "../db";
import { COOKIE_NAME, SESSION_TTL_MS } from "@shared/const";
import { ENV } from "./env";

export type SessionPayload = {
  openId: string;
  name: string;
};

function sessionSecret(): Uint8Array {
  const secret = ENV.sessionSecret.trim();
  if (secret.length < 32) {
    throw new Error("JWT_SECRET deve possuir ao menos 32 caracteres");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(
  openId: string,
  options: { expiresInMs?: number; name?: string } = {},
): Promise<string> {
  const now = Date.now();
  const expiresInMs = options.expiresInMs ?? SESSION_TTL_MS;
  return new SignJWT({ openId, name: options.name || "" })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt(Math.floor(now / 1000))
    .setExpirationTime(Math.floor((now + expiresInMs) / 1000))
    .sign(sessionSecret());
}

export async function verifySession(
  token: string | undefined | null,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, sessionSecret(), {
      algorithms: ["HS256"],
    });
    const openId = typeof payload.openId === "string" ? payload.openId : "";
    const name = typeof payload.name === "string" ? payload.name : "";
    if (!openId) return null;
    return { openId, name };
  } catch {
    return null;
  }
}

function readCookie(req: Request): string | undefined {
  const raw = req.headers.cookie || "";
  for (const part of raw.split(";")) {
    const idx = part.indexOf("=");
    if (idx < 0) continue;
    if (part.slice(0, idx).trim() === COOKIE_NAME) {
      return decodeURIComponent(part.slice(idx + 1).trim());
    }
  }
  return undefined;
}

export async function authenticateRequest(req: Request): Promise<User> {
  const session = await verifySession(readCookie(req));
  if (!session) throw new Error("unauthenticated");

  const user = await db.getUserByOpenId(session.openId);
  if (!user) throw new Error("user_not_found");

  await db.upsertUser({ openId: user.openId, lastSignedIn: new Date() });
  return user;
}
