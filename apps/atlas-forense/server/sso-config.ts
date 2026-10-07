export const ATLAS_SSO_REQUIRED_ENV = [
  "JURIDIA_OIDC_ISSUER",
  "ATLAS_OIDC_CLIENT_ID",
  "ATLAS_OIDC_CLIENT_SECRET",
] as const;

export const ATLAS_SSO_STATE_COOKIE = "atlas_sso_state" as const;

export interface AtlasSsoRuntime {
  status: "disabled" | "configuration_required" | "insecure_issuer" | "enabled";
  enabled: boolean;
  issuer: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

type EnvSource = Record<string, string | undefined>;

export function getAtlasSsoRuntime(redirectUri?: string): AtlasSsoRuntime {
  const env: EnvSource = process.env;
  const explicitlyEnabled = env.ATLAS_SSO_ENABLED?.trim() === "true";
  const issuer = env.JURIDIA_OIDC_ISSUER?.trim().replace(/\/$/, "") ?? "";
  const clientId = env.ATLAS_OIDC_CLIENT_ID?.trim() ?? "";
  const clientSecret = env.ATLAS_OIDC_CLIENT_SECRET?.trim() ?? "";
  const configuredRedirect = env.ATLAS_SSO_REDIRECT_URI?.trim() ?? "";
  const missingConfiguration = ATLAS_SSO_REQUIRED_ENV.filter((key) => !env[key]?.trim());

  const base = {
    enabled: false,
    issuer,
    clientId,
    clientSecret,
    redirectUri: configuredRedirect || redirectUri || "",
  };

  if (!explicitlyEnabled) return { ...base, status: "disabled" };
  if (missingConfiguration.length) return { ...base, status: "configuration_required" };

  const localHttp = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/.test(issuer);
  if (!issuer.startsWith("https://") && !(localHttp && process.env.NODE_ENV !== "production")) {
    return { ...base, status: "insecure_issuer" };
  }

  return { ...base, status: "enabled", enabled: true };
}

export function getAtlasSsoReadiness(env: EnvSource = process.env) {
  const missingConfiguration = ATLAS_SSO_REQUIRED_ENV.filter((key) => !env[key]?.trim());
  const enabled = env.ATLAS_SSO_ENABLED?.trim() === "true";
  const issuer = env.JURIDIA_OIDC_ISSUER?.trim() ?? "";
  const localHttp = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/.test(issuer);

  let status: string;
  if (!enabled) status = missingConfiguration.length ? "configuration_required" : "disabled";
  else if (missingConfiguration.length) status = "configuration_required";
  else if (!issuer.startsWith("https://") && !(localHttp && process.env.NODE_ENV !== "production")) status = "insecure_issuer";
  else status = "enabled";

  return {
    enabled: status === "enabled",
    status,
    configurationComplete: missingConfiguration.length === 0,
    issuer,
    protocol: "oidc_authorization_code" as const,
    callbackPath: "/api/sso/callback",
    requiredClaims: ["iss", "sub", "aud", "exp"] as const,
    roleClaim: "role",
    pkce: "S256" as const,
    signing: "RS256" as const,
  };
}
