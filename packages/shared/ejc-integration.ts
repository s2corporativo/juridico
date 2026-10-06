// Enhanced EJC Integration Contract — now ACTIVE.
// Atlas Forense <-> JuridIA (EJC) integration is now enabled.
// EJC (JuridIA) is the active OIDC identity provider; Atlas validates JWTs via JWKS / verify endpoint.

export const ejcIntegrationManifest = {
  product: "Atlas Forense + JuridIA (EJC) Unified System",
  integrationMode: "active" as const, // <- CHANGED from "pending_approval"
  modules: [
    { key: "atlas", label: "Atlas Forense", route: "/", app: "atlas-forense", access: "authenticated_or_public_policy" },
    { key: "compendium", label: "Compêndio Jurídico", route: "/compendio", app: "atlas-forense", access: "public_metadata" },
    { key: "sources", label: "Fontes Públicas", route: "/fontes", app: "atlas-forense", access: "public_metadata" },
    { key: "national", label: "Prontidão Nacional", route: "/nacional", app: "atlas-forense", access: "public_metadata" },
    { key: "control", label: "Central de Controle", route: "/controle", app: "atlas-forense", access: "admin_only" },
    { key: "cerebro", label: "Cérebro Jurídico", route: "/api/brain", app: "juridia", access: "authenticated" },
    { key: "biblioteca", label: "Biblioteca Jurídica", route: "/api/skills", app: "juridia", access: "public_metadata" },
    { key: "pipeline", label: "Pipeline LexValida", route: "/api/lexvalida/pipeline", app: "juridia", access: "authenticated" },
  ],
  identity: {
    provider: "juridia-oidc" as const, // <- EJC is now the IdP
    protocol: "oidc_authorization_code" as const,
    allowedRoles: ["admin", "user", "advogado", "promotor", "juiz"] as const,
  },
  confidentiality: {
    prohibitedTransfer: ["credenciais", "partes", "CPF", "telefone", "endereço", "documentos privados"],
    principle:
      "Integração por rotas e metadados públicos; qualquer vínculo a caso exige base legal, autorização e revisão humana.",
  },
} as const;

export const ejcAuthBridge = {
  mode: "enabled" as const, // <- CHANGED from "disabled"
  provider: "juridia-oidc",
  protocol: "oidc_authorization_code" as const,
  // EJC (JuridIA) is now the active OIDC identity provider.
  issuerUrl: "http://localhost:3000/api/auth/oidc" as const, // JuridIA issues
  callbackPath: "/api/ejc-sso/callback",
  tokenEndpoint: "http://localhost:3000/api/auth/oidc/token",
  jwksEndpoint: "http://localhost:3000/api/auth/oidc/jwks",
  claims: ["iss", "sub", "aud", "exp", "role", "auth_time", "persona"] as const,
  activationRule:
    "OIDC bridge active. EJC (JuridIA) issues JWT, Atlas validates via JWKS.",
} as const;

export function getEjcIntegrationStatus() {
  return {
    mode: ejcIntegrationManifest.integrationMode,
    authBridgeMode: ejcAuthBridge.mode,
    provider: ejcAuthBridge.provider,
    routes: ejcIntegrationManifest.modules.map((m) => ({
      key: m.key,
      route: m.route,
      app: m.app,
      access: m.access,
    })),
  };
}
