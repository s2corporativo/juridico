export const EJC_SSO_REQUIRED_ENV = ["EJC_OIDC_ISSUER", "EJC_OIDC_CLIENT_ID", "EJC_OIDC_CLIENT_SECRET"] as const;

export const EJC_SSO_STATE_COOKIE = "ejc_sso_state" as const;

export interface EjcSsoRuntime {
  status: "disabled" | "configuration_required" | "insecure_issuer" | "enabled";
  enabled: boolean;
  issuer: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

type EnvSource = Record<string, string | undefined>;

/**
 * Estado de ativação da ponte SSO com o EJC (JuridIA).
 *
 * Regra de ativação (docs/ejc-sso-preparacao.md):
 * 1. EJC_SSO_ENABLED=true (decisão explícita do titular — registrada em
 *    docs/ejc-sso-ativacao.md); sem a flag, a ponte permanece desativada.
 * 2. EJC_OIDC_ISSUER, EJC_OIDC_CLIENT_ID e EJC_OIDC_CLIENT_SECRET presentes.
 * 3. Issuer HTTPS obrigatório em produção (NODE_ENV=production). Em
 *    desenvolvimento, issuer http://localhost é permitido para homologação
 *    (exceção documentada; nunca em produção).
 * 4. Callback reservada: <origem>/api/ejc-sso/callback — registrada no IdP.
 *
 * Falhar fechado: qualquer estado diferente de "enabled" mantém as rotas
 * /api/ejc-sso/* retornando 503 e nenhuma sessão é criada via SSO.
 */
export function getEjcSsoRuntime(redirectUri?: string): EjcSsoRuntime {
  const env: EnvSource = process.env;
  const explicitlyEnabled = env.EJC_SSO_ENABLED?.trim() === "true";
  const issuer = env.EJC_OIDC_ISSUER?.trim().replace(/\/$/, "") ?? "";
  const clientId = env.EJC_OIDC_CLIENT_ID?.trim() ?? "";
  const clientSecret = env.EJC_OIDC_CLIENT_SECRET?.trim() ?? "";
  const configuredRedirect = env.EJC_SSO_REDIRECT_URI?.trim() ?? "";
  const missingConfiguration = EJC_SSO_REQUIRED_ENV.filter(key => !env[key]?.trim());

  const base = {
    enabled: false,
    issuer,
    clientId,
    clientSecret,
    redirectUri: configuredRedirect || redirectUri || "",
  };

  if (!explicitlyEnabled) {
    return { ...base, status: "disabled" };
  }
  if (missingConfiguration.length > 0) {
    return { ...base, status: "configuration_required" };
  }
  const isLocalHttp = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/.test(issuer);
  if (!issuer.startsWith("https://") && !(isLocalHttp && process.env.NODE_ENV !== "production")) {
    return { ...base, status: "insecure_issuer" };
  }
  return { ...base, status: "enabled", enabled: true };
}

/**
 * Estado resumido para a GovernancePage (tRPC integration.ejcStatus).
 * Honestidade em primeiro lugar: sem ambiente configurado, a ponte está
 * "configured_not_activated" ou "configuration_required" — nunca "enabled".
 */
export function getEjcSsoReadiness(env: EnvSource = process.env) {
  const missingConfiguration = EJC_SSO_REQUIRED_ENV.filter(key => !env[key]?.trim());
  const explicitlyEnabled = env.EJC_SSO_ENABLED?.trim() === "true";
  const issuer = env.EJC_OIDC_ISSUER?.trim() ?? "";
  const isLocalHttp = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/.test(issuer);

  let status: string;
  if (!explicitlyEnabled) {
    status = missingConfiguration.length === 0 ? "configured_not_activated" : "configuration_required";
  } else if (missingConfiguration.length > 0) {
    status = "configuration_required";
  } else if (!issuer.startsWith("https://") && !(isLocalHttp && process.env.NODE_ENV !== "production")) {
    status = "insecure_issuer";
  } else {
    status = "enabled";
  }

  return {
    enabled: status === "enabled",
    status,
    configurationComplete: missingConfiguration.length === 0,
    protocol: "oidc_authorization_code" as const,
    callbackPath: "/api/ejc-sso/callback",
    requiredClaims: ["iss", "sub", "aud", "exp"] as const,
    roleClaim: "role",
    pkce: "S256" as const,
    signing: "RS256" as const,
    activationRule: "Exige decisão do titular registrada (EJC_SSO_ENABLED=true), issuer HTTPS, discovery validado, cliente registrado e revisão humana.",
  };
}
