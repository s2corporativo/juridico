export const atlasIntegrationManifest = {
  product: "Atlas Jurídico",
  integrationMode: "active" as const,
  modules: [
    { key: "atlas", label: "Atlas Jurídico", route: "/", app: "atlas-data", access: "authenticated_or_public_policy" },
    { key: "compendium", label: "Compêndio Jurídico", route: "/compendio", app: "atlas-data", access: "public_metadata" },
    { key: "sources", label: "Fontes Públicas", route: "/fontes", app: "atlas-data", access: "public_metadata" },
    { key: "national", label: "Dados Nacionais", route: "/nacional", app: "atlas-data", access: "public_metadata" },
    { key: "control", label: "Governança do Acervo", route: "/controle", app: "atlas-data", access: "admin_only" },
    { key: "brain", label: "Cérebro Jurídico", route: "/api/brain", app: "atlas-intelligence", access: "authenticated" },
    { key: "skills", label: "Skills Jurídicas", route: "/api/skills", app: "atlas-intelligence", access: "authenticated" },
    { key: "generation", label: "Produção Jurídica", route: "/api/generate-minuta/agentic", app: "atlas-intelligence", access: "authenticated" },
  ],
  identity: {
    provider: "juridia-oidc" as const,
    protocol: "oidc_authorization_code" as const,
    allowedRoles: ["admin", "user", "advogado", "promotor", "juiz"] as const,
  },
  confidentiality: {
    prohibitedTransfer: ["credenciais", "CPF", "telefone", "endereço", "documentos privados"],
    principle: "Dados de caso usam política de acesso, pseudonimização e revisão humana; metadados públicos preservam proveniência.",
  },
} as const;

export const atlasAuthBridge = {
  mode: "enabled" as const,
  provider: "juridia-oidc" as const,
  protocol: "oidc_authorization_code" as const,
  callbackPath: "/api/sso/callback" as const,
  claims: ["iss", "sub", "aud", "exp", "role", "auth_time", "persona"] as const,
} as const;

export function getAtlasIntegrationStatus() {
  return {
    mode: atlasIntegrationManifest.integrationMode,
    authBridgeMode: atlasAuthBridge.mode,
    authBridgeProtocol: atlasAuthBridge.protocol,
    provider: atlasAuthBridge.provider,
    callbackPath: atlasAuthBridge.callbackPath,
    routes: atlasIntegrationManifest.modules.map((module) => ({
      key: module.key,
      route: module.route,
      app: module.app,
      access: module.access,
    })),
  };
}
