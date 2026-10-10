/**
 * Autenticação e limite de taxa da API interna Atlas ⇄ Cérebro (JuridIA).
 *
 * - Token de serviço (Bearer) comparado em tempo constante via SHA-256 de ambos os lados.
 * - Fail-closed: token ausente ou com menos de 32 caracteres desliga a API (503).
 * - Rate limit em memória por janela fixa; o IP é irrelevante (chamador único, o JuridIA),
 *   então a chave é o próprio token (já validado).
 */

import { createHash, timingSafeEqual } from "node:crypto";
import { BRAIN_TOKEN_MIN_LENGTH } from "@shared/brain-api";

export type BrainAuthResult = { ok: true } | { ok: false; status: 401 | 503; error: "brain_api_disabled" | "unauthorized" };

function digest(value: string) {
  return createHash("sha256").update(value, "utf8").digest();
}

export function isBrainTokenConfigured(configured: string | undefined | null): configured is string {
  return typeof configured === "string" && configured.trim().length >= BRAIN_TOKEN_MIN_LENGTH;
}

export function authenticateBrainToken(authorizationHeader: string | string[] | undefined, configuredToken: string | undefined | null): BrainAuthResult {
  if (!isBrainTokenConfigured(configuredToken)) return { ok: false, status: 503, error: "brain_api_disabled" };
  const header = Array.isArray(authorizationHeader) ? authorizationHeader[0] : authorizationHeader;
  const match = header?.match(/^Bearer\s+(\S+)$/i);
  if (!match) return { ok: false, status: 401, error: "unauthorized" };
  const provided = digest(match[1]);
  const expected = digest(configuredToken.trim());
  return timingSafeEqual(provided, expected) ? { ok: true } : { ok: false, status: 401, error: "unauthorized" };
}

export function createRateLimiter(options: { limit: number; windowMs: number; now?: () => number }) {
  const now = options.now ?? Date.now;
  let windowStart = now();
  let count = 0;
  return {
    /** Retorna true quando a requisição pode seguir. */
    take(): boolean {
      const current = now();
      if (current - windowStart >= options.windowMs) {
        windowStart = current;
        count = 0;
      }
      count += 1;
      return count <= options.limit;
    },
  };
}
