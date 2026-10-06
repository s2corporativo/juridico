/**
 * Contrato de integração EJC — planejado e NÃO ativo.
 *
 * A ponte de identidade permanece DESABILITADA: nenhuma rota OIDC está
 * registrada no servidor Atlas (/api/ejc-sso/callback e /api/auth/oidc/*
 * ainda não existem) e nenhum JWT é emitido ou validado entre os apps.
 * A ativação exige decisão do titular, administrador real, configuração
 * via ambiente (EJC_OIDC_ISSUER, EJC_OIDC_CLIENT_ID, EJC_OIDC_CLIENT_SECRET),
 * issuer HTTPS validado e revisão humana — ver server/ejc-sso-config.ts.
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
