export const ENV = {
  sessionSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  adminSubject: process.env.ATLAS_ADMIN_SUBJECT ?? "",
  isProduction: process.env.NODE_ENV === "production",
  llmBaseUrl: process.env.ATLAS_LLM_BASE_URL ?? "",
  llmApiKey: process.env.ATLAS_LLM_API_KEY ?? "",
  notificationWebhookUrl: process.env.ATLAS_NOTIFICATION_WEBHOOK_URL ?? "",
  notificationWebhookToken: process.env.ATLAS_NOTIFICATION_WEBHOOK_TOKEN ?? "",
};
