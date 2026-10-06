/**
 * Contrato de integração EJC — planejado, com ativação POR AMBIENTE.
 *
 * Postura estática (este arquivo): pending_approval / disabled — é o estado de
 * qualquer implantação sem as variáveis de ativação. O estado REAL é publicado
 * em runtime pelo tRPC integration.ejcStatus, que sobrepõe mode/authBridgeMode
 * somente quando getEjcSsoRuntime() reporta "enabled" (EJC_SSO_ENABLED=true +
 * EJC_OIDC_ISSUER/CLIENT_ID/CLIENT_SECRET + issuer HTTPS em produção).
 *
 * A ponte implementada (server/_core/ejc-sso.ts + IdP em apps/juridia) usa
 * Authorization Code Flow + PKCE S256 + state assinado + nonce + validação
 * JWKS (RS256) — conforme docs/ejc-sso-preparacao.md e docs/ejc-sso-ativacao.md.
 */
export const ejcIntegrationManifest = {
  product: "Atlas Forense + JuridIA (EJC) Unified System",
  integrationMode: "pending_approval" as const,
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
    currentProvider: "Sessão Atlas (cookie app_session_id)",
    plannedProvider: "juridia-oidc",
    plannedProtocol: "oidc_authorization_code" as const,
    allowedRoles: ["admin", "user", "advogado", "promotor", "juiz"] as const,
  },
  confidentiality: {
    prohibitedTransfer: ["credenciais", "partes", "CPF", "telefone", "endereço", "documentos privados"],
    principle: "Integração por rotas e metadados públicos; qualquer vínculo a caso do EJC exige base legal, autorização e revisão humana.",
  },
} as const;

export const ejcAuthBridge = {
  mode: "disabled" as const,
  provider: "juridia-oidc",
  protocol: "oidc_authorization_code" as const,
  callbackPath: "/api/ejc-sso/callback",
  plannedClaims: ["iss", "sub", "aud", "exp", "role", "auth_time", "persona"] as const,
  activationRule: "Exige decisão do titular, issuer HTTPS do EJC, discovery OIDC validado, cliente registrado, mapeamento de identidade, escopo de sigilo aprovado e revisão humana.",
} as const;

export function getEjcIntegrationStatus() {
  return {
    mode: ejcIntegrationManifest.integrationMode,
    currentProvider: ejcIntegrationManifest.identity.currentProvider,
    authBridgeMode: ejcAuthBridge.mode,
    authBridgeProtocol: ejcAuthBridge.protocol,
    callbackPath: ejcAuthBridge.callbackPath,
    routes: ejcIntegrationManifest.modules.map(m => ({ key: m.key, route: m.route, app: m.app, access: m.access })),
    activationRule: ejcAuthBridge.activationRule,
  };
}
