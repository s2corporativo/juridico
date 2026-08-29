import rateLimit, { type Options } from "express-rate-limit";

/**
 * Limites de requisição do Atlas.
 *
 * As rotas protegidas aqui gastam recurso de terceiros ou de banco a cada
 * chamada: `/api/auth/*` dispara discovery OIDC, `/manus-storage/*` consome
 * quota da API de storage com credencial do servidor, e `/api/trpc` inclui a
 * busca textual do Compêndio (LIKE sem índice) e as consultas ao DataJud.
 *
 * Cada limite é ajustável por variável de ambiente para que a VPS possa
 * calibrar sem novo deploy; os padrões valem para uso profissional normal.
 */
function readLimit(name: string, fallback: number) {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const BASE: Partial<Options> = {
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "rate_limited", message: "Muitas requisições. Aguarde antes de tentar novamente." },
};

/** Autenticação: baixo volume legítimo; protege o discovery OIDC externo. */
export const authLimiter = rateLimit({
  ...BASE,
  windowMs: 15 * 60_000,
  limit: readLimit("ATLAS_RATE_LIMIT_AUTH", 20),
});

/** Proxy de storage: público e sem autenticação, gasta quota com credencial do servidor. */
export const storageLimiter = rateLimit({
  ...BASE,
  windowMs: 60_000,
  limit: readLimit("ATLAS_RATE_LIMIT_STORAGE", 60),
});

/** API geral: cobre busca pública, jurimetria e as mutations administrativas. */
export const apiLimiter = rateLimit({
  ...BASE,
  windowMs: 60_000,
  limit: readLimit("ATLAS_RATE_LIMIT_API", 300),
});
