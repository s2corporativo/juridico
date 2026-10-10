/**
 * One mandatory boundary for use of external text-generation SDK.
 * No confidential case leaves this VPS by default. Never logs case text or keys.
 * A conscious infrastructure opt-in is still NOT consent to leak unredacted data.
 */
import ZAI from "z-ai-web-dev-sdk";
import { createLocalChatAdapter, assertLocalAiEnabled } from "./local-chat-provider";
import { isProviderEligible, getSanitizationMode, SanitizationMode } from "./ai_governance";

export function assertExternalAiAllowed(taskType = "analise_caso"): void {
  if (process.env.JURIDIA_EXTERNAL_AI_ENABLED !== "true" ||
      process.env.JURIDIA_CONFIDENTIAL_DATA_EXPORT_APPROVED !== "true") {
    throw new Error("EXTERNAL_CASE_AI_DISABLED");
  }
  if (getSanitizationMode(taskType) === SanitizationMode.LOCAL_COMPLETO) {
    throw new Error("SENSITIVE_CASE_REQUIRES_LOCAL_PROVIDER");
  }
  const provider = isProviderEligible("zai");
  if (!provider.eligible) throw new Error("EXTERNAL_PROVIDER_INELIGIBLE");
}

export async function createGovernedZai(taskType = "analise_caso") {
  if (process.env.JURIDIA_LOCAL_AI_ENABLED === "true") {
    assertLocalAiEnabled();
    // Existing orchestration uses a small SDK-compatible surface; local adapter
    // cannot search the web or silently fall back to a remote provider.
    return createLocalChatAdapter() as unknown as Awaited<ReturnType<typeof ZAI.create>>;
  }
  assertExternalAiAllowed(taskType);
  return ZAI.create();
}
