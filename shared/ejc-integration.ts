/**
 * Contrato neutro de integração. Não realiza conexão externa, SSO nem transfere dados.
 * A ativação depende da aprovação do ponto de entrada e das regras de sigilo do EJC.
 */
export const ejcIntegrationManifest = {
  product: "Atlas Forense",
  integrationMode: "pending_approval" as const,
  modules: [
    { key: "atlas", label: "Atlas Forense", route: "/", access: "authenticated_or_public_policy" },
    { key: "compendium", label: "Compêndio Jurídico", route: "/compendio", access: "public_metadata" },
    { key: "sources", label: "Fontes Públicas", route: "/fontes", access: "public_metadata" },
    { key: "national", label: "Prontidão Nacional", route: "/nacional", access: "public_metadata" },
    { key: "control", label: "Central de Controle", route: "/controle", access: "admin_only" },
  ],
  identity: {
    currentProvider: "Manus OAuth",
    futureRequirement: "Mapeamento explícito de identidade e papel antes de SSO ou navegação compartilhada.",
    allowedRoles: ["admin", "user"],
  },
  confidentiality: {
    prohibitedTransfer: ["credenciais", "partes", "CPF", "telefone", "endereço", "documentos privados"],
    principle: "Integração por rotas e metadados públicos; qualquer vínculo a caso do EJC exige base legal, autorização e revisão humana.",
  },
} as const;

export const ejcAuthBridge = {
  mode: "disabled" as const,
  currentProvider: "Manus OAuth",
  futureClaims: ["externalSubject", "role", "sessionIssuedAt"] as const,
  activationRule: "Exige URL do EJC, mapeamento de identidade, escopo de sigilo aprovado e revisão humana.",
} as const;

export function getEjcIntegrationStatus() {
  return {
    mode: ejcIntegrationManifest.integrationMode,
    currentProvider: ejcAuthBridge.currentProvider,
    authBridgeMode: ejcAuthBridge.mode,
    routes: ejcIntegrationManifest.modules.map(module => ({ key: module.key, route: module.route, access: module.access })),
    activationRule: ejcAuthBridge.activationRule,
  };
}
