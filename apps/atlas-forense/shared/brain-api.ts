/**
 * Alias de compatibilidade (F1.1): o contrato canônico da Brain API vive agora
 * em `packages/shared/brain-api.ts`, compartilhado entre Atlas (produtor) e
 * JuridIA (consumidor). Este arquivo apenas re-exporta — novas constantes e
 * funções devem ser adicionadas SOMENTE no pacote compartilhado.
 */
export * from "../../../packages/shared/brain-api";
