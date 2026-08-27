export const EJC_SSO_REQUIRED_ENV = ["EJC_OIDC_ISSUER", "EJC_OIDC_CLIENT_ID", "EJC_OIDC_CLIENT_SECRET"] as const;

type EnvSource = Record<string, string | undefined>;

export function getEjcSsoReadiness(env: EnvSource = process.env) {
  const missingConfiguration = EJC_SSO_REQUIRED_ENV.filter(key => !env[key]?.trim());

  return {
    enabled: false,
    status: missingConfiguration.length === 0 ? "configured_not_activated" : "configuration_required",
    protocol: "oidc_authorization_code" as const,
    callbackPath: "/api/ejc-sso/callback",
    requiredClaims: ["iss", "sub", "aud", "exp"] as const,
    roleClaim: "role",
    missingConfiguration,
    activationRule: "Exige issuer HTTPS, discovery OIDC validado, client registrado, mapeamento de papéis aprovado e usuário administrativo real.",
  };
}
